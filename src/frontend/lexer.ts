// -----------------------------------------------------------
// ---------------          LEXER          -------------------
// ---  Responsible for producing tokens from the source   ---
// -----------------------------------------------------------
import { Position, Token, TokenType } from "./types";

/**
 * Constant lookup for keywords and known identifiers + symbols.
 */
const KEYWORDS: Record<string, TokenType> = {
  true: TokenType.True,
  false: TokenType.False,
};

/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 * @param src 
 * @returns 
 */
function isAlpha(src: string): boolean {
  // to be changed
  return src.toUpperCase() != src.toLowerCase();
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \r]
 * @param str 
 * @returns 
 */
function isSkippable(str: string): boolean {
  // to be changed to support positioning (newline)
  return str === " " || str === "\t" || str === "\r";
}

/**
 * Returns true if the character is end of line character - `\n`.
 * @param str 
 * @returns 
 */
function isEOL(str: string): boolean {
  return str === "\n";
}

/**
 * Return whether the character is a valid integer -> [0-9]
 * @param str 
 * @returns 
 */
function isNumber(str: string): boolean {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

/**
 * Checks if a character used in integer literal makes the token unknown/unrecognized.
 * @param char Checked character
 * @returns
 */
function isUnknown(char: string): boolean {
  // '(' returns unrecognized in JB
  let undefinedTokens = ['`', '~', '@', '#', '$', '%', '_', ':', '?', '('];
  if(undefinedTokens.includes(char) || isAlpha(char))
    return true;
  return false;
}

/**
 * Checks if a character used in float literal makes the token undefined/unrecognized.
 * @param char Checked character
 * @returns
 */
function isUndefined(char: string): boolean {
  // '(' returns unrecognized in JB
  // <integer part>.. results in undefined too
  let undefinedTokens = ['`', '~', '@', '#', '$', '%', '_', ':', '?', '.', '('];
  if(undefinedTokens.includes(char) || isAlpha(char))
    return true;
  return false;
}

/**
 * Checks if the character is accepted into int literal candidate.
 * @param char Checked char
 * @returns
 */
function isIntlike(char: string): boolean {
  return isNumber(char) || isUnknown(char);
}

/**
 * Checks if the character is accepted into float literal candidate.
 * @param char 
 * @returns
 */
function isFloatlike(char: string): boolean {
  return isNumber(char) || isUndefined(char);
}

/**
 * Checks if a character is valid for a global/system variable symbol.
 * @param char Checked character
 * @returns 
 */
function isGlobalVarChar(char: string): boolean {
  // allowed special characters
  let allowed = ['`', '~', '@', '#', '$', '%', '_', ':', '.', '?'];
  return (allowed.includes(char) || isAlpha(char) || isNumber(char));
}

function resolve_escaped(escChar: string): string {
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
 * Given a string representing source code, produces tokens and handles
 * possible unidentified characters.
 * @param sourceCode 
 * @param curPos 
 * @returns 
 */
export function tokenize(sourceCode: string, curPos: Position): Token[] {
  const tokens = new Array<Token>();
  // source code
  const src = sourceCode.split("");
  // token marker
  let beginPos: Position;
  // might be useless after global position changes
  let skippedChar;
  let currChar;
  // global scope checkers
  let transTagOpened = false;
  let transTagClosed = false;

  // produce tokens until the EOF is reached.
  while (src.length > 0) {
    // BEGIN PARSING MULTICHARACTER TOKENS - OPERATORS, TAGS, COMMENTS

    // SKIP DOUBLEDASH COMMENTS
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
    // SKIP MULTILINE COMMENTS
    else if(src[0] === "/" && src[1] === "*") {
      src.shift();
      curPos.advance();

      skippedChar = src.shift();
      curPos.advance();

      currChar = src[0];
      if(currChar === "/") {
        // JB throws 'Unknown token */' if the first commented character
        // in a valid comment is a slash
        // 'self closing comment' problem
        // this should add an error/warning, use curPos
        console.warn("Warning: JB throws 'Unknown token */' with comment content that begins with a slash");
      }
      
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
    } else if(
      !transTagOpened &&
      src.length >= 7 &&
      src[0] === "<" &&
      src[1] === "t" &&
      src[2] === "r" &&
      src[3] === "a" &&
      src[4] === "n" &&
      src[5] === "s" &&
      src[6] === ">"
    ) {
      // save begin position
      beginPos = { line: curPos.line, character: curPos.character } as Position;
      // consume
      for(let i = 0; i < 7; i++) {
        src.shift();
        curPos.advance();
      }
      tokens.push(new Token(
        "<trans>",
        TokenType.OpenTransTag,
        // ts/js pass objects by reference :/
        // subtract 1 to indicate the position of the last character
        { line: beginPos.line, character: beginPos.character } as Position,
        { line: curPos.line, character: curPos.character - 1 } as Position
      ));
      // only try to parse 1 trans tag opening
      // the subsequent ones will result in an operator expr error
      transTagOpened = true;
    }
    else if(
      !transTagClosed && transTagOpened &&
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
      // save begin position
      beginPos = { line: curPos.line, character: curPos.character } as Position;
      // consume
      for(let i = 0; i< 8; i++) {
        src.shift();
        curPos.advance();
      }
      tokens.push(new Token(
        "</trans>",
        TokenType.CloseTransTag,
        { line: beginPos.line, character: beginPos.character } as Position,
        { line: curPos.line, character: curPos.character - 1 } as Position
      ));
      // only try to parse the first trans tag closing
      // the subsequent ones will be ignored
      transTagClosed = true;
    }
    // STRINGS
    else if(src[0] === "'") {
      // save begin position
      beginPos = { line: curPos.line, character: curPos.character } as Position;
      // consume opening '
      skippedChar = src.shift()
      curPos.advance();
      // make string literal
      let sqString = "";
      let escapedChar = "";
      // consume string characters and omit escapes (\')
      while(src.length > 0 && src[0] !== "'") {
        skippedChar = src.shift();
        // update position for multiline strings correctly
        if(skippedChar === '\n') {
          // ignore EOLs
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
          sqString += resolve_escaped(escapedChar);
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
        { line: beginPos.line, character: beginPos.character } as Position,
        { line: curPos.line, character: curPos.character - 1 } as Position
      ));
    }
    else if(src[0] === "\"") {
      // save begin position
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
          dqString += resolve_escaped(escapedChar);
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
        { line: beginPos.line, character: beginPos.character } as Position,
        { line: curPos.line, character: curPos.character - 1 } as Position
      ));
    }
    // BEGIN PARSING ONE CHARACTER TOKENS
    else if (src[0] === "(") {
      tokens.push(new Token(
        src.shift() ?? src[0],
        TokenType.OpenParen,
        { line: curPos.line, character: curPos.character } as Position,
        { line: curPos.line, character: curPos.character } as Position
      ));
      curPos.advance();
    } else if (src[0] === ")") {
      tokens.push(new Token(
        src.shift() ?? src[0],
        TokenType.CloseParen,
        { line: curPos.line, character: curPos.character } as Position,
        { line: curPos.line, character: curPos.character } as Position
      ));
      curPos.advance();
    } else if (src[0] === "{") {
      tokens.push(new Token(
        src.shift() ?? src[0],
        TokenType.OpenBrace,
        { line: curPos.line, character: curPos.character } as Position,
        { line: curPos.line, character: curPos.character } as Position
      ));
      curPos.advance();
    } else if (src[0] === "}") {
      tokens.push(new Token(
        src.shift() ?? src[0],
        TokenType.CloseBrace,
        { line: curPos.line, character: curPos.character } as Position,
        { line: curPos.line, character: curPos.character } as Position
      ));
      curPos.advance();
    } else if (src[0] === "[") {
      tokens.push(new Token(
        src.shift() ?? src[0],
        TokenType.OpenBracket,
        { line: curPos.line, character: curPos.character } as Position,
        { line: curPos.line, character: curPos.character } as Position
      ));
      curPos.advance();
    } else if (src[0] === "]") {
      tokens.push(new Token(
        src.shift() ?? src[0],
        TokenType.CloseBracket,
        { line: curPos.line, character: curPos.character } as Position,
        { line: curPos.line, character: curPos.character } as Position
      ));
      curPos.advance();
    } // HANDLE BINARY OPERATORS
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
        addToken(tokens, operator, TokenType.UnaryOperator, curPos);
      } else if(
        // +=, -=
        src.length >= 2 &&
        ((src[0] === "+" && src[1] === "=") || (src[0] === "-" && src[1] === "="))
      ) {
        let operator = src.shift() ?? src[0];
        operator += src.shift() ?? src[1];
        addToken(tokens, operator, TokenType.Assignment, curPos);
      } else {
        src[0] === "-"
          ? addToken(tokens, src.shift() ?? src[0], TokenType.Minus, curPos)
          : addToken(tokens, src.shift() ?? src[0], TokenType.MathOperator, curPos);
      }
      
    } else if (src[0] === "<" || src[0] === ">") {
      // <= or >=
      if (src.length >= 2 && src[1] === "=") {
        let operator = (src.shift() ?? src[0]);
        operator += (src.shift() ?? src[1]);
        addToken(tokens, operator, TokenType.ComparisonOperator, curPos);
      } else {
        addToken(tokens, src.shift() ?? src[0], TokenType.ComparisonOperator, curPos);
      }
    } // Handle Conditional & Assignment Tokens
    else if (src[0] === "=") {
      // ==
      if(src.length >= 2 && src[1] === "=") {
        let operator = src.shift() ?? src[0];
        operator += src.shift() ?? src[1]
        addToken(tokens, operator, TokenType.ComparisonOperator, curPos);
      } else {
        addToken(tokens, src.shift() ?? src[0], TokenType.Assignment, curPos);
      }
    } else if (src[0] === "&") {
      let operator: string;
      // &&
      if(src.length >= 2 && src[1] === "&") {
         operator = src.shift() ?? src[0]
         operator += src.shift() ?? src[1]
         addToken(tokens, operator, TokenType.LogicalOperator, curPos);
      } else {
        // & is an alias for && (logical AND)
        operator = src.shift() ?? src[0]
        addToken(tokens, operator, TokenType.LogicalOperator, curPos);
      }
    } else if (src[0] === "|") {
      let operator: string;
      // &&
      if(src.length >= 2 && src[1] === "|") {
         operator = src.shift() ?? src[0]
         operator += src.shift() ?? src[1]
         addToken(tokens, operator, TokenType.LogicalOperator, curPos);
      } else {
        // | is an alias for || (logical OR)
        operator = src.shift() ?? src[0]
        addToken(tokens, operator, TokenType.LogicalOperator, curPos);
      }
    } else if (src[0] === ";") {
      addToken(tokens, src.shift() ?? src[0], TokenType.Semicolon, curPos);
    } else if (src[0] === ":") {
      // Unsupported token
      addToken(tokens, src.shift() ?? src[0], TokenType.Colon, curPos);
    } else if (src[0] === ",") {
      addToken(tokens, src.shift() ?? src[0], TokenType.Comma, curPos);
    } else if (src[0] === ".") {
      // leading-dot float literal
      if(src.length >= 2 && isNumber(src[1])) {
        let dotLiteral = src.shift() ?? src[0];
        while(isNumber(src[0]))
          dotLiteral += src.shift();
        addToken(tokens, dotLiteral, TokenType.Float, curPos);
      }
      else
        addToken(tokens, src.shift() ?? src[0], TokenType.Dot, curPos);
    } else if (src[0] === "^") {
      addToken(tokens, src.shift() ?? src[0], TokenType.MathOperator, curPos);
    } else if (src[0] === "%") {
      // Unsupported token
      addToken(tokens, src.shift() ?? src[0], TokenType.Percent, curPos);
    } else if(src[0] === "!") {
      // !=
      if(src.length >= 2 && src[1] === "=") {
        let operator = src.shift() ?? src[0];
        operator += src.shift() ?? src[1];
        addToken(tokens, operator, TokenType.ComparisonOperator, curPos);
      } else {
        addToken(tokens, src.shift() ?? src[0], TokenType.UnaryOperator, curPos);
      }
    } else if(src[0] === "$") {
      // HANDLE GLOBAL/SYSTEM VAR IDENTIFIERS
      // Note: extendable sys variables can include hyphens but they have to be referenced as string literals
      // e.g. jitterbit.networking.http.request.header.content-type

      // save begin position
      beginPos = { line: curPos.line, character: curPos.character } as Position;
      // consume $
      let globalVar = src.shift() as string;
      curPos.advance();
      // read global var name ident
      while(src.length > 0 && isGlobalVarChar(src[0])) {
        globalVar += src.shift();
        curPos.advance();
      }
      tokens.push(new Token(
        globalVar,
        TokenType.GlobalIdentifier,
        { line: beginPos.line, character: beginPos.character } as Position,
        { line: curPos.line, character: curPos.character - 1 } as Position
      ));
    } // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
    else {
      // save begin position
      beginPos = { line: curPos.line, character: curPos.character } as Position;
      // Handle numeric literals
      if (isNumber(src[0])) {
        let num = "";
        let isUnk = isUnknown(src[0]);
        while (src.length > 0 && isIntlike(src[0])) {
          if(isUnknown(src[0]))
            isUnk = true;
          num += src.shift();
          curPos.advance();
        }

        // Add JB error:
        // 'Unknown token: <int-like literal>'
        if(isUnk) {
          console.error("Unknown token: ", num);
          tokens.push(new Token(
            num,
            TokenType.UnknownToken,
            { line: beginPos.line, character: beginPos.character } as Position,
            { line: curPos.line, character: curPos.character - 1 } as Position
          ));
        }
        // push the integer
        else if(src[0] !== ".")
          tokens.push(new Token(
            num,
            TokenType.Integer,
            { line: beginPos.line, character: beginPos.character } as Position,
            { line: curPos.line, character: curPos.character - 1 } as Position
          ));
        // read the floating point part
        else if(src[0] === "."){
          // read the dot
          // <integer part>. literals are valid
          num += src.shift();
          curPos.advance();
          // read the optional fraction part or undefined token
          if(isFloatlike(src[0])) {
            // handle 'Undefined token' JB error for numeric literals
            let isUndef = isUndefined(src[0]);
            while (src.length > 0 && isFloatlike(src[0])) {
              if(isUndefined(src[0]))
                isUndef = true;
              num += src.shift();
              curPos.advance();
            }

            // Add JB error:
            // 'Undefined token: <float-like literal>'
            if(isUndef) {
              console.error("Undefined token: ", num);
              tokens.push(new Token(
                num,
                TokenType.UnknownToken,
                { line: beginPos.line, character: beginPos.character } as Position,
                { line: curPos.line, character: curPos.character - 1 } as Position
              ));
            }
            else
              tokens.push(new Token(
                num,
                TokenType.Float,
                { line: beginPos.line, character: beginPos.character } as Position,
                { line: curPos.line, character: curPos.character - 1 } as Position
              ));
          }
          // other known/defined token character found after <integer part>.
          // push as float token
          else
            tokens.push(new Token(
              num,
              TokenType.Float,
              { line: beginPos.line, character: beginPos.character } as Position,
              { line: curPos.line, character: curPos.character - 1 } as Position
            ));
        }        
      } // Handle Identifier & Keyword Tokens.
      else if (isAlpha(src[0]) || src[0] === "_") {
        let ident = "";
        while (src.length > 0 
          && (
            isAlpha(src[0])
            || isNumber(src[0])
            || src[0] === "_"
          )
        ) {
          ident += src.shift();
          curPos.advance();
        }

        // keywords
        const reserved = KEYWORDS[ident];
        if (typeof reserved == "number") {
          tokens.push(new Token(
            ident,
            reserved,
            { line: beginPos.line, character: beginPos.character } as Position,
            { line: curPos.line, character: curPos.character - 1 } as Position
          ));
        } else {
          // identifiers
          tokens.push(new Token(
            ident,
            TokenType.Identifier,
            { line: beginPos.line, character: beginPos.character } as Position,
            { line: curPos.line, character: curPos.character - 1 } as Position
          ));
        }
      } else if (isSkippable(src[0])) {
        src.shift();
        curPos.advance();
      } else if(isEOL(src[0])) {
        src.shift();
        curPos.nextLine();
      }
      // Handle unrecognized characters.
      // TODO: Implement better errors and error recovery.
      else {
        // only parse the unknown characters inside of the script scope
        if(transTagOpened) {
          console.error(
            "Unrecognized character found in source: ",
            src[0].charCodeAt(0),
            src,
          );
          tokens.push(new Token(
            "UnexpectedEndOfFile",
            TokenType.EOF,
            { line: beginPos.line, character: beginPos.character } as Position,
            { line: curPos.line, character: curPos.character - 1 } as Position
          ));
          return tokens;
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

/**
 * Appends a token to `tokens` and updates the current position.
 * @param tokens 
 * @param value 
 * @param type 
 * @param curPos 
 */
function addToken(tokens: Token[], value: string, type: TokenType, curPos: Position) {
  tokens.push(new Token(
    value,
    type,
    { line: curPos.line, character: curPos.character } as Position,
    { line: curPos.line, character: curPos.character + value.length - 1 } as Position
  ));

  for(let i = 0; i< value.length; i++) {
    curPos.advance();
  }
}
