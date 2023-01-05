// -----------------------------------------------------------
// ---------------          LEXER          -------------------
// ---  Responsible for producing tokens from the source   ---
// -----------------------------------------------------------

// Represents tokens that our language understands in parsing.
export enum TokenType {
  // Script scope tag
  OpenTransTag,
  CloseTransTag,
  // Literal Types
  Integer,
  Float,
  Identifier,
  GlobalIdentifier,
  SingleQuoteString,
  DoubleQuoteString,
  // Keywords
  Let,
  Const,
  True,
  False,
  // Grouping * Operators
  BinaryOperator,
  Assignment,
  Comma,
  Dot,
  Colon,
  Semicolon,
  OpenParen, // (
  CloseParen, // )
  OpenBrace, // {
  CloseBrace, // }
  OpenBracket, // [
  CloseBracket, //]
  EOF, // Signified the end of file
  UnknownToken // Token parsing error
}

/**
 * Constant lookup for keywords and known identifiers + symbols.
 */
// to be yoinked
const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
  true: TokenType.True,
  false: TokenType.False,
};

/**
 * Represents a single token from the source-code.
 */
export interface Token {
  value: string; // contains the raw value as seen inside the source code.
  type: TokenType; // tagged structure.
}

/**
 * Returns a token of a given type and value
 * @param value token literal
 * @param type token type
 * @returns 
 */
function token(value = "", type: TokenType): Token {
  return { value, type };
}

/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 */
// to be changed
function isAlpha(src: string): boolean {
  return src.toUpperCase() != src.toLowerCase();
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
// to be changed to support positioning (newline)
function isSkippable(str: string): boolean {
  return str == " " || str == "\n" || str == "\t" || str == "\r";
}

/**
 Return whether the character is a valid integer -> [0-9]
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
 * Given a string representing source code: Produce tokens and handles
 * possible unidentified characters.
 *
 * - Returns an array of tokens.
 * - Does not modify the incoming string.
 */
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  let skippedChar;
  let currChar;
  let nextChar;
  let transTagOpened = false;
  let transTagClosed = false;

  // produce tokens until the EOF is reached.
  while (src.length > 0) {
    // BEGIN PARSING MULTICHARACTER TOKENS - OPERATORS, TAGS, COMMENTS

    // SKIP DOUBLEDASH COMMENTS
    if(src[0] == "/" && src[1] == "/") {
      src.shift();
      skippedChar = src.shift();
      while(skippedChar != "\n") {
        skippedChar = src.shift();
      }
    }
    // SKIP MULTILINE COMMENTS
    else if(src[0] == "/" && src[1] == "*") {
      src.shift();
      skippedChar = src.shift();
      currChar = src[0];
      nextChar = src[1];
      if(currChar == "/") {
        // JB throws 'Unknown token */' if the first commented character
        // in a valid comment is a slash
        // 'self closing comment' problem
        // this should add an error/warning
        console.warn("Warning: JB throws 'Unknown token */' with comment content that begins with a slash");
      }
      
      // skip content
      while(src.length > 0) {
        // it is safe to skip to the end of the file
        // script scope tag validation should return
        // 'Missing closing tag </trans>' error
        skippedChar = src.shift();
        if(skippedChar === "*" && src[0] === "/"){
          // consume the ending slash
          src.shift();
          break;
        }
      }
    } else if(
      !transTagOpened &&
      src.length >= 7 &&
      src[0] == "<" &&
      src[1] == "t" &&
      src[2] == "r" &&
      src[3] == "a" &&
      src[4] == "n" &&
      src[5] == "s" &&
      src[6] == ">"
    ) {
      for(let i = 0; i < 7; i++) src.shift();
      tokens.push(token("<trans>", TokenType.OpenTransTag));
      // only try to parse 1 trans tag opening
      // the subsequent ones will result in an operator expr error
      transTagOpened = true;
    }
    else if(
      !transTagClosed && transTagOpened &&
      src.length >= 8 &&
      src[0] == "<" &&
      src[1] == "/" &&
      src[2] == "t" &&
      src[3] == "r" &&
      src[4] == "a" &&
      src[5] == "n" &&
      src[6] == "s" &&
      src[7] == ">"
    ) {
      for(let i = 0; i< 8; i++) src.shift();
      tokens.push(token("</trans>", TokenType.CloseTransTag));
      // only try to parse the first trans tag closing
      // the subsequent ones will be ignored
      transTagClosed = true;
    }
    // STRINGS
    else if(src[0] == "'") {
      // consume opening '
      skippedChar = src.shift()
      // make string literal
      let sqString = "";
      let escapedChar = "";
      // consume string characters and omit escapes (\')
      while(src.length > 0 && src[0] !== "'") {
        skippedChar = src.shift();
        // handle escaped characters
        if(skippedChar == "\\" && src.length > 1) {
          escapedChar = src.shift() as string;
          sqString += resolve_escaped(escapedChar);
        } else {
          sqString += skippedChar;
        }
      }
      // consume closing '
      src.shift();
      tokens.push(token(sqString, TokenType.SingleQuoteString));
    } else if(src[0] == "\"") {
      // consume opening "
      skippedChar = src.shift()
      // make string literal
      let dqString = "";
      let escapedChar = "";
      // consume string characters and omit escapes (\')
      while(src.length > 0 && src[0] !== "\"" ) {
        skippedChar = src.shift();
        // handle escaped characters
        if(skippedChar == "\\" && src.length > 1) {
          escapedChar = src.shift() as string;
          dqString += resolve_escaped(escapedChar);
        } else {
          dqString += skippedChar;
        }
      }
      // consume closing "
      src.shift();
      tokens.push(token(dqString, TokenType.DoubleQuoteString));
    }
    // BEGIN PARSING ONE CHARACTER TOKENS
    else if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == "{") {
      tokens.push(token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] == "}") {
      tokens.push(token(src.shift(), TokenType.CloseBrace));
    } else if (src[0] == "[") {
      tokens.push(token(src.shift(), TokenType.OpenBracket));
    } else if (src[0] == "]") {
      tokens.push(token(src.shift(), TokenType.CloseBracket));
    } // HANDLE BINARY OPERATORS
    else if (
      src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" ||
      src[0] == "%"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } // Handle Conditional & Assignment Tokens
    else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Assignment));
    } else if (src[0] == ";") {
      tokens.push(token(src.shift(), TokenType.Semicolon));
    } else if (src[0] == ":") {
      // Unsupported token
      tokens.push(token(src.shift(), TokenType.Colon));
    } else if (src[0] == ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    } else if (src[0] == ".") {
      tokens.push(token(src.shift(), TokenType.Dot));
    } else if(src[0] == "$") {
      // HANDLE GLOBAL/SYSTEM VAR IDENTIFIERS
      // Note: extendable sys variables can include hyphens but they have to be referenced as string literals
      // e.g. jitterbit.networking.http.request.header.content-type

      // consume $
      let globalVar = src.shift() as string;

      // read global var name ident
      while(src.length > 0 && isGlobalVarChar(src[0])) {
        globalVar += src.shift();
      }
      tokens.push(token(globalVar, TokenType.GlobalIdentifier));
    } // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
    else {
      // Handle numeric literals
      if (isNumber(src[0])) {
        let num = "";
        let isUnk = isUnknown(src[0]);
        while (src.length > 0 && isIntlike(src[0])) {
          if(isUnknown(src[0]))
            isUnk = true;
          num += src.shift();
        }

        // Add JB error:
        // 'Unknown token: <int-like literal>'
        if(isUnk) {
          console.error("Unknown token: ", num);
          tokens.push(token(num, TokenType.UnknownToken));
        }
        // push the integer
        else if(src[0] !== ".")
          tokens.push(token(num, TokenType.Integer));
        // read the floating point part
        else if(src[0] === "."){
          // read the dot
          // <integer part>. literals are valid
          num += src.shift();
          // read the optional fraction part or undefined token
          if(isFloatlike(src[0])) {
            // handle 'Undefined token' JB error for numeric literals
            let isUndef = isUndefined(src[0]);
            while (src.length > 0 && isFloatlike(src[0])) {
              if(isUndefined(src[0]))
                isUndef = true;
              num += src.shift();
            }

            // Add JB error:
            // 'Undefined token: <float-like literal>'
            if(isUndef) {
              console.error("Undefined token: ", num);
              tokens.push(token(num, TokenType.UnknownToken));
            }
            else
              tokens.push(token(num, TokenType.Float));
          }
          // other known/defined token character found after <integer part>.
          // push as float token
          else
            tokens.push(token(num, TokenType.Float));
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
        }

        // to be yoinked
        // CHECK FOR RESERVED KEYWORDS
        const reserved = KEYWORDS[ident];
        // If value is not undefined then the identifier is
        // recognized keyword
        if (typeof reserved == "number") {
          tokens.push(token(ident, reserved));
        } else {
          // Unrecognized name must mean user defined symbol.
          tokens.push(token(ident, TokenType.Identifier));
        }
      } else if (isSkippable(src[0])) {
        // Skip unneeded chars.
        src.shift();
      } // Handle unrecognized characters.
      // TODO: Implement better errors and error recovery.
      else {
        // only parse the unknown characters inside of the script scope
        if(transTagOpened) {
          console.error(
            "Unrecognized character found in source: ",
            src[0].charCodeAt(0),
            src,
          );
          tokens.push({ type: TokenType.EOF, value: "UnexpectedEndOfFile" });
        }
        // pre-scope unhandled characters
        else {
          src.shift();
        }
      }
    }
  }

  return tokens;
}
