import { getSystemVar } from "../api/sysvars";
import {
  ArrayLiteral,
  AssignmentExpr,
  BinaryExpr,
  BooleanLiteral,
  CallExpr,
  Expr,
  FloatLiteral,
  GlobalIdentifier,
  Identifier,
  IntegerLiteral,
  MemberExpr,
  Program,
  Stmt,
  StringLiteral,
  UnaryExpr,
} from "./ast";

import { tokenize } from "./lexer";
import Position from "./types/Position";
import { Token, TokenType } from "./types/Token";

/**
 * Frontend for producing a valid AST from source code.
 */
export default class Parser {
  private tokens: Token[] = [];

  /*
   * Determines if the parsing is complete and the END OF FILE Is reached.
   */
  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  /**
   * Returns the currently available token.
   */
  private at() {
    return this.tokens[0] as Token;
  }

  /**
   * Advances the tokens array to the next value and returns the removed one.
   */
  private consume() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  /**
   *  Returns the previous token and then advances the tokens array to the next value.
   *  Also checks the type of expected token and throws if the values dont match.
   */
  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error("ParserError:\n", err, prev, " - Expecting: ", type);
      return {
        type: prev ? prev.type : TokenType.UnknownToken,
        value: prev ? prev.value : null
      } as Token;
    }

    return prev;
  }

  public produceAST(sourceCode: string): Program {
    // global current tokenizer position, starts at 1,1
    let curPos = new Position();
    this.tokens = tokenize(sourceCode, curPos);

    // find the evaluation scope - <trans>...</trans>
    let openIdx = null;
    let closeIdx = null;
    this.tokens.forEach( (token, index) => {
      if(token.type === TokenType.OpenTransTag)
        openIdx = index;
      if(token.type === TokenType.CloseTransTag)
        closeIdx = index;
    });
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // validate the evaluation scope
    if(openIdx === null) {
      // Add warning:
      // 'No <trans> tag, script returns its content as string.'
      // pos 1,1
      console.log('Warning: No <trans> tag, script returns its content as string.');
      
      // return the script source as a string

    } else if(closeIdx === null) {
      // Add JB error:
      // 'The expression <expr> is missing closing tag </trans>'
      // curPos
      console.log("tokens:", JSON.stringify(this.tokens));
      console.log(`JB error: The expression is missing </trans> closing tag:\n${sourceCode}\n`);
    }
    else {
      if(openIdx !== 0) {
        // Add warning:
        // 'Script content before <trans> is not evaluated and may result in unexpected behaviour.'
        // pos 1,1 - trans tag pos
        console.log("Warning: Script content before <trans> is not evaluated and may result in unexpected behaviour.");

        // Remove the front tail
        while(this.tokens[0].type !== TokenType.OpenTransTag) {
          this.tokens.shift();
        }
      }

      if(closeIdx !== this.tokens.length - 1) {
        // Add warning:
        // 'Script content after </trans> is not evaluated and may result in unexpected behaviour.'
        // ignore the eof token
        // </trans> pos - curPos
        if(closeIdx !== this.tokens.length - 2)
          console.log("Warning: Script content after </trans> is not evaluated and may result in unexpected behaviour.");

        // Remove the back tail
        let len = this.tokens.length - 1;
        while(this.tokens[len].type !== TokenType.CloseTransTag) {
          this.tokens.pop();
          len--;
        }
      }

      // Remove <trans> and </trans> then restore EOF into the evaluated token set
      this.tokens.shift();
      this.tokens.pop();
      this.tokens.push(new Token("EndOfFile", TokenType.EOF, curPos, curPos));

      this.printTokens();

      // Parse until end of file
      while (this.not_eof()) {
        program.body.push(this.parse_stmt());

        // top-level statement/expression semicolon
        // the last expression can have the semicolon dropped
        if(this.not_eof()) {
          this.expect(
            TokenType.Semicolon,
            "Expected semicolon before:"
          );
        }
      }
    }

    return program;
  }

  private printTokens() {
    for (const tkn of this.tokens)
      console.log(`{ '${tkn.value}', ${TokenType[tkn.type]} }`);
  }

  // Handle complex statement types
  private parse_stmt(): Stmt {
    // skip to parse_expr
    switch (this.at().type) {
      default:
        return this.parse_expr();
    }
  }

  // Handle expressions
  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  private parse_assignment_expr(): Expr {
    const left = this.parse_logical_expr();

    if (this.at().type == TokenType.Assignment) {
      let operator = this.consume(); // advance past equals
      const value = this.parse_assignment_expr();
      return { 
        value,
        assignee: left,
        kind: "AssignmentExpr",
        operator
      } as AssignmentExpr;
    }

    return left;
  }

  /**
   * Parses logical operator expressions.
   * @returns
   */
  private parse_logical_expr(): Expr {
      // binary expr
      let left = this.parse_comparative_expr();
      while(this.at().type === TokenType.LogicalOperator) {
        const operator = this.consume().value;
        const right = this.parse_comparative_expr();

        left = {
          kind: "BinaryExpr",
          left,
          right,
          operator,
        } as BinaryExpr;
      }

      return left;
  }

  /**
   * Parses conditional operator expressions.
   * @returns 
   */
  private parse_comparative_expr(): Expr {
    let left = this.parse_additive_expr();
    while (this.at().type === TokenType.ComparisonOperator) {
      const operator = this.consume().value;
      const right = this.parse_additive_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // Handle Addition & Subtraction Operations
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    while (this.at().value === "+" || this.at().value === "-") {
      const operator = this.consume().value;
      const right = this.parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // Handle Multiplication, Division & Modulo Operations
  private parse_multiplicative_expr(): Expr {
    let left = this.parse_negation_expr();

    while (
      this.at().value === "/" || this.at().value === "*" || this.at().value === "%"
    ) {
      const operator = this.consume().value;
      const right = this.parse_negation_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // !(a || b)
  private parse_negation_expr(): Expr {
    // LHS unary operator expr
    // for some reason Jitterbit dont parse this with other unary expressions
    if(this.at().value === "!") {
      let operator = this.consume().value;
      return {
        kind: "UnaryExpr",
        // could be parse_object_expr() as assignments cant be negated directly (like any other binary expr)
        value: this.parse_assignment_expr(),
        operator,
        lhs: true
      } as UnaryExpr;
    } else {
      return this.parse_power_expr();
    }
  }

  // 3 ^ 4
  private parse_power_expr(): Expr {
    let left = this.parse_unary_expr();

    while (this.at().value === "^") {
      const operator = this.consume().value;
      const right = this.parse_unary_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // ++a, b--
  private parse_unary_expr(): Expr {
    // LHS operators (pre-)
    // -x, --x, ++x
    if(
      this.at().type === TokenType.UnaryOperator ||
      this.at().type === TokenType.Minus
    ) {
      const operator = this.consume().value;
      return {
        kind: "UnaryExpr",
        value: this.parse_call_member_expr(),
        operator,
        lhs: true
      } as UnaryExpr;
    } else {
      // RHS operators (post-)
      let left = this.parse_call_member_expr();

      if(this.at().value === "++" || this.at().value === "--") {
        const operator = this.consume().value;
        left = {
          kind: "UnaryExpr",
          value: left,
          operator,
          lhs: false
        } as UnaryExpr;
      }
      
      return left;
    }
  }

  // foo.x()()
  private parse_call_member_expr(): Expr {
    const member = this.parse_member_expr();

    if (this.at().type == TokenType.OpenParen) {
      return this.parse_call_expr(member);
    }

    return member;
  }

  private parse_call_expr(caller: Expr): Expr {
    let call_expr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parse_args(),
    } as CallExpr;

    if (this.at().type == TokenType.OpenParen) {
      call_expr = this.parse_call_expr(call_expr);
    }

    return call_expr;
  }

  private parse_args(): Expr[] {
    this.expect(TokenType.OpenParen, "ParserError: Expected open parenthesis");
    const args = this.at().type == TokenType.CloseParen
      ? []
      : this.parse_arguments_list();

    this.expect(
      TokenType.CloseParen,
      "ParserError: Missing closing parenthesis inside arguments list",
    );
    return args;
  }

  private parse_arguments_list(): Expr[] {
    const args = [this.parse_assignment_expr()];

    while (this.at().type == TokenType.Comma && this.consume()) {
      args.push(this.parse_assignment_expr());
    }

    return args;
  }

  // a[++b], c[true][Int("2")] etc.
  private parse_member_expr(): Expr {
    let object = this.parse_array_expr();

    while (this.at().type === TokenType.OpenBracket) {
      // [
      this.consume();

      // this allows obj[computedValue]
      let key = this.parse_expr();
      this.expect(
        TokenType.CloseBracket,
        "ParserError: Missing closing bracket in computed value.",
      );

      object = {
        kind: "MemberExpr",
        object,
        key,
        computed: true,
      } as MemberExpr;
    }

    return object;
  }

  // { 1, -2, true, "", Null(), ... }
  private parse_array_expr(): Expr {
    if(this.at().type !== TokenType.OpenBrace) {
      return this.parse_primary_expr();
    }

    // {
    this.consume();

    // empty array
    if(this.at().type === TokenType.CloseBrace) {
      this.consume();
      return { kind: "ArrayLiteral", members: [] } as ArrayLiteral;
    }

    const members = this.parse_arguments_list();

    this.expect(
      TokenType.CloseBrace,
      "ParserError: Array literal missing closing brace."
    );
    return { kind: "ArrayLiteral", members} as ArrayLiteral;
  }

  // Expression precedence (lowest to highest):
  // Assignment
  // Object
  // Logical
  // Comparative
  // Additive
  // Multiplicitave
  // Negation
  // Power
  // Unary
  // Call
  // Member
  // Array
  // Primary

  // Parse literals and grouping expressions
  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    // Determine which token we are currently at and return literal value
    switch (tk) {
      // User-defined local variables
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.consume().value } as Identifier;

      case TokenType.GlobalIdentifier:
        // consume the token
        let globalVarToken = this.consume();
        // check if the name is '$'
        // then the var acts as an untracked global var i.e. it doesnt appear in the debugger
        if(globalVarToken.value === "$") {
          // Add a warning
          // member expressions on $ can lead to unexpected behavior, for instance:
          // $[2] = $;
          // lol = $[2];
          // results in a proxy error (502) and apache server exceptions from agents
          console.warn("ParserWarning: '$' should not be used as an identifier. It behaves like an untracked global variable and may cause unexpected behaviour including agent-level exceptions when used in complex expressions");
        }
        // check if system variable
        let sysVar = getSystemVar(globalVarToken.value);
        if(sysVar !== undefined) 
          return {
            kind: "GlobalIdentifier",
            symbol: globalVarToken.value,
            type: "system" 
          } as GlobalIdentifier;
        else {
          if(globalVarToken.value.substring(0, 11) === "$jitterbit.") {
            // Add a warning:
            // Global variable names should not begin with '$jitterbit.', it is a reserved namespace.
            console.warn("ParserWarning: Global variable names should not begin with '$jitterbit.', it is a reserved namespace.");
          }

          return {
            kind: "GlobalIdentifier",
            symbol: globalVarToken.value,
            type: "global"
          } as GlobalIdentifier;
        }

      // Constants and Numeric Constants
      case TokenType.Integer:
        return {
          kind: "NumericLiteral",
          value: parseInt(this.consume().value),
        } as IntegerLiteral;
      
      case TokenType.Float:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.consume().value),
        } as FloatLiteral;

      case TokenType.True:
        this.consume();
        return {
          kind: "BooleanLiteral",
          value: true,
        } as BooleanLiteral;

      case TokenType.False:
        this.consume();
        return {
          kind: "BooleanLiteral",
          value: false,
        } as BooleanLiteral;

      // Grouping Expressions
      case TokenType.OpenParen: {
        this.consume(); // eat the opening paren
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "ParserError: Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
        ); // closing paren
        return value;
      }

      // '' string literal
      case TokenType.SingleQuoteString: {
        return { kind: "StringLiteral", value: this.consume().value } as StringLiteral;
      }

      // "" string literal
      case TokenType.DoubleQuoteString: {
        return { kind: "StringLiteral", value: this.consume().value } as StringLiteral;
      }

      // Unidentified Tokens and Invalid Code Reached
      default:
        console.error("ParserError: Unexpected token found during parsing!", this.at());
        // TODO: add an error/error detail for every other token type here
        // consume the token to prevent infinite loops
        this.consume()
        return { kind: "Program" };
    }
  }
}
