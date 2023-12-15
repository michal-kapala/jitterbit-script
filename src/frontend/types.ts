export class Position {
  character: number;
  line: number;

  constructor(line: number = 1, character: number = 1) {
    this.line = line;
    this.character = character;
  }

  nextLine(): void {
    this.line++;
    this.character = 1;
  }

  advance(): void {
    this.character++;
  }
}

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
  MathOperator,
  ComparisonOperator,
  LogicalOperator,
  Assignment,
  // Other
  UnaryOperator,
  /**
   * `-` (either a unary or binary operator).
   */
  Minus,
  Comma,
  Dot,
  Colon,
  Semicolon,
  /**
   * `(`
   */
  OpenParen,
  /**
   * `)`
   */
  CloseParen,
  /**
   * `{`
   */
  OpenBrace,
  /**
   * `}`
   */
  CloseBrace,
  /**
   * `[`
   */
  OpenBracket,
  /**
   * `]`
   */
  CloseBracket,
  /**
   * `%`
   */
  Percent,
  /**
   * End of file.
   */
  EOF,
  /**
   * Token parsing error.
   */
  UnknownToken 
}

/**
 * Represents a single token from the source-code.
 */
export class Token {
  /**
   * Contains the raw value as seen inside the source code.
   */
  value: string;
  /**
   * Type of the tagged structure.
   */
  type: TokenType;
  /**
   * The position of token's first character.
   */ 
  begin: Position;
  /**
   * The position of token's last character.
   */
  end: Position;

  constructor(value: string, type: TokenType, begin: Position, end: Position) {
    this.value = value;
    this.type = type;
    this.begin = begin;
    this.end = end;
  }
}
