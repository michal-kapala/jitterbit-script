import Diagnostic from "../diagnostic";
import { RuntimeError } from "../errors";
import { Position, Token, TokenType } from "./types";

/**
 * Performs script tokenization.
 */
export default class Lexer {
  /**
   * Keywords supported by Jitterbit scripts.
   */
  private static KEYWORDS: Record<string, TokenType> = {
    true: TokenType.True,
    false: TokenType.False,
  };

  /**
   * Returns whether the character passed in alphabetic -> [a-zA-Z]
   * @param src 
   * @returns 
   */
  private static isAlpha(src: string): boolean {
    // to be changed
    return src.toUpperCase() != src.toLowerCase();
  }

  /**
   * Returns true if the character is whitespace like -> [\s, \t, \r]
   * @param str 
   * @returns 
   */
  private static isSkippable(str: string): boolean {
    // to be changed to support positioning (newline)
    return str === " " || str === "\t" || str === "\r";
  }

  /**
   * Returns true if the character is end of line character - `\n`.
   * @param str 
   * @returns 
   */
  private static isEOL(str: string): boolean {
    return str === "\n";
  }

  /**
   * Return whether the character is a valid integer -> [0-9]
   * @param str 
   * @returns 
   */
  private static isNumber(str: string): boolean {
    const c = str.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
  }

  /**
   * Checks if a character used in integer literal makes the token unknown/unrecognized.
   * @param char Checked character
   * @returns
   */
  private static isUnknown(char: string): boolean {
    // '(' returns unrecognized in JB
    const undefinedTokens = ['`', '~', '@', '#', '$', '%', '_', ':', '?', '('];
    if(undefinedTokens.includes(char) || this.isAlpha(char))
      return true;
    return false;
  }

  /**
   * Checks if a character used in float literal makes the token undefined/unrecognized.
   * @param char Checked character
   * @returns
   */
  private static isUndefined(char: string): boolean {
    // '(' returns unrecognized in JB
    // <integer part>.. results in undefined too
    const undefinedTokens = ['`', '~', '@', '#', '$', '%', '_', ':', '?', '.', '('];
    if(undefinedTokens.includes(char) || this.isAlpha(char))
      return true;
    return false;
  }

  /**
   * Checks if the character is accepted into int literal candidate.
   * @param char Checked char
   * @returns
   */
  private static isIntlike(char: string): boolean {
    return this.isNumber(char) || this.isUnknown(char);
  }

  /**
   * Checks if the character is accepted into float literal candidate.
   * @param char 
   * @returns
   */
  private static isFloatlike(char: string): boolean {
    return this.isNumber(char) || this.isUndefined(char);
  }

  /**
   * Checks if a character is valid for a global/system variable symbol.
   * @param char Checked character
   * @returns 
   */
  private static isGlobalVarChar(char: string): boolean {
    // allowed special characters
    const allowed = ['`', '~', '@', '#', '$', '%', '_', ':', '.', '?'];
    return (allowed.includes(char) || this.isAlpha(char) || this.isNumber(char));
  }

  /**
   * Unescapes a sensitive character.
   * @param escChar 
   * @returns 
   */
  private static unescape(escChar: string): string {
    switch(escChar) {
      case "b":
        return "\b";
      case "f":
        return "\f";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "t":
        return "\t";
      case "v":
        return "\v";
      case "\\":
        return "\\";
      case "'":
        return "'";
      case "\"":
        return "\"";
      default:
        return "\\" + escChar;
    }
  }

  /**
   * Appends a token to `tokens` and updates the current position.
   * @param tokens 
   * @param value 
   * @param type 
   * @param curPos 
   */
  private static addToken(tokens: Token[], value: string, type: TokenType, curPos: Position) {
    tokens.push(new Token(
      value,
      type,
      new Position(curPos.line, curPos.character),
      new Position(curPos.line, curPos.character + value.length - 1)
    ));

    for(let i = 0; i< value.length; i++) {
      curPos.advance();
    }
  }

  /**
   * Given a string representing source code, produces tokens and handles
   * possible unidentified characters.
   * @param sourceCode 
   * @param curPos 
   * @param diagnostics 
   * @throws Multiple use of `trans` tags results in `RuntimeError` (runtime-only)
   * @returns 
   */
  public static tokenize(sourceCode: string, diagnostics?: Diagnostic[]): Token[] {
    const curPos = new Position();
    const tokens = new Array<Token>();
    const src = sourceCode.split("");
    // token marker
    let beginPos: Position;
    let skippedChar;
    let currChar;
    // global scope checkers
    let transTagOpened = false;
    let transTagClosed = false;

    while (src.length > 0) {
      // comments
      if(src[0] === '/' && src[1] === '/') {
        src.shift();
        curPos.advance();

        skippedChar = src.shift();
        curPos.advance();

        while(skippedChar !== '\n') {
          skippedChar = src.shift();
          if(skippedChar === '\n')
            curPos.nextLine();
          else
            curPos.advance();
        }
      }
      // multiline comments
      else if(src[0] === "/" && src[1] === "*") {
        src.shift();
        curPos.advance();

        skippedChar = src.shift();
        curPos.advance();

        currChar = src[0];
        if(currChar === "/") {
          // 'self-closing comment' problem
          if(diagnostics) {
            diagnostics.push(
              new Diagnostic(
                new Position(curPos.line, curPos.character - 2),
                new Position(curPos.line, curPos.character),
                "Self-closing multiline comment '/*/' prevents the execution of all subsequent code.",
                false
              )
            );
          }
          else
            console.warn("LexerWarning: Self-closing multiline comment '/*/' prevents the execution of all subsequent code.");
          src.shift();
          curPos.advance();
        }
        else {
          // skip content
          while(src.length > 0) {
            // it is safe to skip to the end of the file
            // script scope tag validation should return
            // 'Missing closing tag </trans>' error
            skippedChar = src.shift();

            // update position
            if(skippedChar === '\n')
              curPos.nextLine();
            else
              curPos.advance();

            // consume the ending slash
            if(skippedChar === "*" && src[0] === "/"){  
              src.shift();
              curPos.advance();
              break;
            }
          }
        }
      } else if(
        src.length >= 7 &&
        src[0] === "<" &&
        src[1] === "t" &&
        src[2] === "r" &&
        src[3] === "a" &&
        src[4] === "n" &&
        src[5] === "s" &&
        src[6] === ">"
      ) {
        beginPos = { line: curPos.line, character: curPos.character } as Position;
        for(let i = 0; i < 7; i++) {
          src.shift();
          curPos.advance();
        }
        tokens.push(new Token(
          "<trans>",
          TokenType.OpenTransTag,
          // subtract 1 to indicate the position of the last character
          new Position(beginPos.line, beginPos.character),
          new Position(curPos.line, curPos.character - 1)
        ));
        if(transTagOpened) {
          const msg = "Repeated use of <trans> script opening tag.";
          if(diagnostics) {
            diagnostics.push(
              new Diagnostic(
                tokens[tokens.length - 1].begin,
                tokens[tokens.length - 1].end,
                msg
              )
            );
          }
          // runtime-only error
          else
            throw new RuntimeError(msg);
        }
        transTagOpened = true;
      }
      else if(
        src.length >= 8 &&
        src[0] === "<" &&
        src[1] === "/" &&
        src[2] === "t" &&
        src[3] === "r" &&
        src[4] === "a" &&
        src[5] === "n" &&
        src[6] === "s" &&
        src[7] === ">"
      ) {
        beginPos = { line: curPos.line, character: curPos.character } as Position;
        for(let i = 0; i< 8; i++) {
          src.shift();
          curPos.advance();
        }
        tokens.push(new Token(
          "</trans>",
          TokenType.CloseTransTag,
          new Position(beginPos.line, beginPos.character),
          new Position(curPos.line, curPos.character - 1)
        ));
        if(transTagClosed) {
          const msg = "Repeated use of </trans> script closing tag.";
          if(diagnostics) {
            diagnostics.push(
              new Diagnostic(
                tokens[tokens.length - 1].begin,
                tokens[tokens.length - 1].end,
                msg
              )
            );
          }
          // runtime-only error
          else
            throw new RuntimeError(msg);
        }
        transTagClosed = true;
      }
      // strings
      else if(src[0] === "'") {
        beginPos = { line: curPos.line, character: curPos.character } as Position;
        // consume opening '
        skippedChar = src.shift()
        curPos.advance();
        let sqString = "";
        let escapedChar = "";
        // consume string characters and omit escapes (\')
        while(src.length > 0 && src[0] !== "'") {
          skippedChar = src.shift();
          // update position for multiline strings correctly
          if(skippedChar === '\n') {
            skippedChar = '';
            curPos.nextLine();
          }
          else if(skippedChar === '\r') {
            // resolve \r\n to a space
            skippedChar = ' ';
            curPos.advance();
          }
          else
            curPos.advance();

          // handle escaped characters
          if(skippedChar == "\\" && src.length > 1) {
            escapedChar = src.shift() as string;
            curPos.advance();
            sqString += Lexer.unescape(escapedChar);
          } else {
            sqString += skippedChar;
          }
        }
        // consume closing '
        src.shift();
        curPos.advance();
        tokens.push(new Token(
          sqString,
          TokenType.SingleQuoteString,
          new Position(beginPos.line, beginPos.character),
          new Position(curPos.line, curPos.character - 1)
        ));
      }
      else if(src[0] === "\"") {
        beginPos = { line: curPos.line, character: curPos.character } as Position;
        // consume opening "
        skippedChar = src.shift();
        curPos.advance();
        // make string literal
        let dqString = "";
        let escapedChar = "";
        // consume string characters and omit escapes (\')
        while(src.length > 0 && src[0] !== "\"" ) {
          skippedChar = src.shift();
          // update position for multiline strings correctly
          if(skippedChar === '\n')
            curPos.nextLine();
          else
            curPos.advance();
          // handle escaped characters
          if(skippedChar == "\\" && src.length > 1) {
            escapedChar = src.shift() as string;
            curPos.advance();
            dqString += Lexer.unescape(escapedChar);
          } else {
            dqString += skippedChar;
          }
        }
        // consume closing "
        src.shift();
        curPos.advance();
        tokens.push(new Token(
          dqString,
          TokenType.DoubleQuoteString,
          new Position(beginPos.line, beginPos.character),
          new Position(curPos.line, curPos.character - 1)
        ));
      }
      else if (src[0] === "(") {
        tokens.push(new Token(
          src.shift() ?? src[0],
          TokenType.OpenParen,
          new Position(curPos.line, curPos.character),
          new Position(curPos.line, curPos.character)
        ));
        curPos.advance();
      } else if (src[0] === ")") {
        tokens.push(new Token(
          src.shift() ?? src[0],
          TokenType.CloseParen,
          new Position(curPos.line, curPos.character),
          new Position(curPos.line, curPos.character)
        ));
        curPos.advance();
      } else if (src[0] === "{") {
        tokens.push(new Token(
          src.shift() ?? src[0],
          TokenType.OpenBrace,
          new Position(curPos.line, curPos.character),
          new Position(curPos.line, curPos.character)
        ));
        curPos.advance();
      } else if (src[0] === "}") {
        tokens.push(new Token(
          src.shift() ?? src[0],
          TokenType.CloseBrace,
          new Position(curPos.line, curPos.character),
          new Position(curPos.line, curPos.character)
        ));
        curPos.advance();
      } else if (src[0] === "[") {
        tokens.push(new Token(
          src.shift() ?? src[0],
          TokenType.OpenBracket,
          new Position(curPos.line, curPos.character),
          new Position(curPos.line, curPos.character)
        ));
        curPos.advance();
      } else if (src[0] === "]") {
        tokens.push(new Token(
          src.shift() ?? src[0],
          TokenType.CloseBracket,
          new Position(curPos.line, curPos.character),
          new Position(curPos.line, curPos.character)
        ));
        curPos.advance();
      }
      else if (
        src[0] === "+" || 
        src[0] === "-" ||
        src[0] === "*" ||
        src[0] === "/"
      ) {
        // ++, --
        if(
          src.length >= 2 &&
          ((src[0] === "+" && src[1] === "+") || (src[0] === "-" && src[1] === "-"))
        ) {
          let operator = src.shift() ?? src[0];
          operator += src.shift() ?? src[1];
          Lexer.addToken(tokens, operator, TokenType.UnaryOperator, curPos);
        } else if(
          // +=, -=
          src.length >= 2 &&
          ((src[0] === "+" && src[1] === "=") || (src[0] === "-" && src[1] === "="))
        ) {
          let operator = src.shift() ?? src[0];
          operator += src.shift() ?? src[1];
          Lexer.addToken(tokens, operator, TokenType.Assignment, curPos);
        } else {
          src[0] === "-"
            ? Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.Minus, curPos)
            : Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.MathOperator, curPos);
        }
        
      } else if (src[0] === "<" || src[0] === ">") {
        // <= or >=
        if (src.length >= 2 && src[1] === "=") {
          let operator = (src.shift() ?? src[0]);
          operator += (src.shift() ?? src[1]);
          Lexer.addToken(tokens, operator, TokenType.ComparisonOperator, curPos);
        } else {
          Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.ComparisonOperator, curPos);
        }
      }
      else if (src[0] === "=") {
        // ==
        if(src.length >= 2 && src[1] === "=") {
          let operator = src.shift() ?? src[0];
          operator += src.shift() ?? src[1]
          Lexer.addToken(tokens, operator, TokenType.ComparisonOperator, curPos);
        } else {
          Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.Assignment, curPos);
        }
      } else if (src[0] === "&") {
        let operator: string;
        // &&
        if(src.length >= 2 && src[1] === "&") {
          operator = src.shift() ?? src[0]
          operator += src.shift() ?? src[1]
          Lexer.addToken(tokens, operator, TokenType.LogicalOperator, curPos);
        } else {
          // & is an alias for && (logical AND)
          operator = src.shift() ?? src[0]
          Lexer.addToken(tokens, operator, TokenType.LogicalOperator, curPos);
        }
      } else if (src[0] === "|") {
        let operator: string;
        // &&
        if(src.length >= 2 && src[1] === "|") {
          operator = src.shift() ?? src[0]
          operator += src.shift() ?? src[1]
          Lexer.addToken(tokens, operator, TokenType.LogicalOperator, curPos);
        } else {
          // | is an alias for || (logical OR)
          operator = src.shift() ?? src[0]
          Lexer.addToken(tokens, operator, TokenType.LogicalOperator, curPos);
        }
      } else if (src[0] === ";") {
        Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.Semicolon, curPos);
      } else if (src[0] === ":") {
        // Unsupported token
        Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.Colon, curPos);
      } else if (src[0] === ",") {
        Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.Comma, curPos);
      } else if (src[0] === ".") {
        // leading-dot float literal
        if(src.length >= 2 && Lexer.isNumber(src[1])) {
          let dotLiteral = src.shift() ?? src[0];
          while(Lexer.isNumber(src[0]))
            dotLiteral += src.shift();
            Lexer.addToken(tokens, dotLiteral, TokenType.Float, curPos);
        }
        else
          Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.Dot, curPos);
      } else if (src[0] === "^") {
        Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.MathOperator, curPos);
      } else if (src[0] === "%") {
        // Unsupported token
        Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.Percent, curPos);
      } else if(src[0] === "!") {
        // !=
        if(src.length >= 2 && src[1] === "=") {
          let operator = src.shift() ?? src[0];
          operator += src.shift() ?? src[1];
          Lexer.addToken(tokens, operator, TokenType.ComparisonOperator, curPos);
        } else {
          Lexer.addToken(tokens, src.shift() ?? src[0], TokenType.UnaryOperator, curPos);
        }
      } else if(src[0] === "$") {
        // global/system variables
        // Note: extendable sys variables can include hyphens but they have to be referenced as string literals
        // e.g. jitterbit.networking.http.request.header.content-type

        beginPos = { line: curPos.line, character: curPos.character } as Position;
        // consume $
        let globalVar = src.shift() as string;
        curPos.advance();
        while(src.length > 0 && Lexer.isGlobalVarChar(src[0])) {
          globalVar += src.shift();
          curPos.advance();
        }
        tokens.push(new Token(
          globalVar,
          TokenType.GlobalIdentifier,
          new Position(beginPos.line, beginPos.character),
          new Position(curPos.line, curPos.character - 1)
        ));
      }
      else {
        beginPos = { line: curPos.line, character: curPos.character } as Position;
        // numeric literals
        if (Lexer.isNumber(src[0])) {
          let num = "";
          let isUnk = Lexer.isUnknown(src[0]);
          while (src.length > 0 && Lexer.isIntlike(src[0])) {
            if(Lexer.isUnknown(src[0]))
              isUnk = true;
            num += src.shift();
            curPos.advance();
          }

          // Add JB error:
          // 'Unknown token: <int-like literal>'
          if(isUnk) {
            if(diagnostics) {
              diagnostics.push(
                new Diagnostic(
                  new Position(curPos.line, curPos.character - num.length),
                  new Position(curPos.line, curPos.character),
                  `Unknown token: '${num}'.`
                )
              );
            }
            console.error("Unknown token: ", num);
            tokens.push(new Token(
              num,
              TokenType.UnknownToken,
              new Position(beginPos.line, beginPos.character),
              new Position(curPos.line, curPos.character - 1)
            ));
          }
          // push the integer
          else if(src[0] !== ".")
            tokens.push(new Token(
              num,
              TokenType.Integer,
              new Position(beginPos.line, beginPos.character),
              new Position(curPos.line, curPos.character - 1)
            ));
          // read the floating point part
          else if(src[0] === "."){
            // read the dot
            // <integer part>. literals are valid
            num += src.shift();
            curPos.advance();
            // read the optional fraction part or undefined token
            if(Lexer.isFloatlike(src[0])) {
              // handle 'Undefined token' JB error for numeric literals
              let isUndef = Lexer.isUndefined(src[0]);
              while (src.length > 0 && Lexer.isFloatlike(src[0])) {
                if(Lexer.isUndefined(src[0]))
                  isUndef = true;
                num += src.shift();
                curPos.advance();
              }

              // Add JB error:
              // 'Undefined token: <float-like literal>'
              if(isUndef) {
                if(diagnostics) {
                  diagnostics.push(
                    new Diagnostic(
                      new Position(curPos.line, curPos.character - num.length),
                      new Position(curPos.line, curPos.character),
                      `Undefined token: '${num}'.`
                    )
                  );
                }
                console.error("Undefined token: ", num);
                tokens.push(new Token(
                  num,
                  TokenType.UnknownToken,
                  new Position(beginPos.line, beginPos.character),
                  new Position(curPos.line, curPos.character - 1)
                ));
              }
              else
                tokens.push(new Token(
                  num,
                  TokenType.Float,
                  new Position(beginPos.line, beginPos.character),
                  new Position(curPos.line, curPos.character - 1)
                ));
            }
            // other known/defined token character found after <integer part>.
            // push as float token
            else
              tokens.push(new Token(
                num,
                TokenType.Float,
                new Position(beginPos.line, beginPos.character),
                new Position(curPos.line, curPos.character - 1)
              ));
          }        
        } // identifiers/keywords
        else if (Lexer.isAlpha(src[0]) || src[0] === "_") {
          let ident = "";
          while (src.length > 0 
            && (
              Lexer.isAlpha(src[0])
              || Lexer.isNumber(src[0])
              || src[0] === "_"
            )
          ) {
            ident += src.shift();
            curPos.advance();
          }

          // keywords
          const reserved = Lexer.KEYWORDS[ident];
          if (typeof reserved == "number") {
            tokens.push(new Token(
              ident,
              reserved,
              new Position(beginPos.line, beginPos.character),
              new Position(curPos.line, curPos.character - 1)
            ));
          } else {
            // identifiers
            tokens.push(new Token(
              ident,
              TokenType.Identifier,
              new Position(beginPos.line, beginPos.character),
              new Position(curPos.line, curPos.character - 1)
            ));
          }
        } else if (Lexer.isSkippable(src[0])) {
          src.shift();
          curPos.advance();
        } else if(Lexer.isEOL(src[0])) {
          src.shift();
          curPos.nextLine();
        }
        // unrecognized characters
        else {
          // only parse the unknown characters inside of the script scope
          if(transTagOpened) {
            if(diagnostics) {
              diagnostics.push(
                new Diagnostic(
                  new Position(curPos.line, curPos.character),
                  new Position(curPos.line, curPos.character),
                  `Unknown token: '${src[0]}'.`
                )
              );
            }
            console.error(`LexerError: Unrecognized character found in source: ${src[0]}`);
            tokens.push(new Token(
              src.shift() ?? "",
              TokenType.UnknownToken,
              curPos,
              curPos
            ));
            curPos.advance();
          }
          // pre-scope unhandled characters
          else {
            src.shift();
            curPos.advance();
          }
        }
      }
    }

    return tokens;
  }
}
