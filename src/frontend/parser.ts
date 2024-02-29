
import { Api } from "../api";
import Diagnostic from "../diagnostic";
import { ParserError } from "../errors";
import {
  ArrayLiteral,
  AssignmentExpr,
  BinaryExpr,
  BlockExpr,
  BooleanLiteral,
  CallExpr,
  Expr,
  FunctionIdentifier,
  GlobalIdentifier,
  Identifier,
  MemberExpr,
  NumericLiteral,
  Program,
  Stmt,
  StringLiteral,
  UnaryExpr,
} from "./ast";
import Lexer from "./lexer";
import { Position, Token, TokenType } from "./types";

/**
 * Frontend for producing a valid AST from source code.
 */
export default class Parser {
  private tokens: Token[] = [];

  /**
   * Determines if the parsing is complete and the EOF was reached.
   * @returns 
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
   * Returns the previous token and then advances the tokens array to the next value.
   * Also checks the type of expected token and throws if the values dont match.
   * @param type 
   * @param err 
   * @returns 
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

  /**
   * Validates if there are no adjacent primary expressions.
   * @param diagnostics 
   */
  private checkAdjacentLiterals(diagnostics?: Diagnostic[]) {
    // TODO: handling to be extended for other applicable expression pairs
    for(let curIdx = 0; curIdx < this.tokens.length - 1; curIdx++) {
      const primaryTokens = [
        TokenType.Identifier,
        TokenType.GlobalIdentifier,
        TokenType.Integer,
        TokenType.Float,
        TokenType.True,
        TokenType.False,
        TokenType.SingleQuoteString,
        TokenType.DoubleQuoteString,
      ];

      // two adjacent primary expressions or ')('
      if (
        (primaryTokens.includes(this.tokens[curIdx].type) &&
          primaryTokens.includes(this.tokens[curIdx+1].type)) ||
        (this.tokens[curIdx].type === TokenType.CloseParen &&
          this.tokens[curIdx+1].type === TokenType.OpenParen)
      ) {
        // static analysis
        if(diagnostics) {
          diagnostics.push(
            new Diagnostic(
              this.tokens[curIdx].begin,
              this.tokens[curIdx+1].end,
              `Missing operator between two operands: '${this.tokens[curIdx].value}' and '${this.tokens[curIdx+1].value}'.`
            )
          );
        }
        // runtime
        else
          throw new ParserError(`Missing operator between two operands: '${this.tokens[curIdx].value}' and '${this.tokens[curIdx+1].value}'.`);
      }
    }
  }

  /**
   * Assigns the last of the found opening and closing tag indices as the script scope boundaries.
   * @returns
   */
  private findScopeTags(): (number | null)[] {
    let openIdx: number | null = null;
    let closeIdx: number | null = null;
    for(const idx in this.tokens) {
      if(this.tokens[idx].type === TokenType.OpenTransTag)
        openIdx = parseInt(idx);
      if(this.tokens[idx].type === TokenType.CloseTransTag)
        closeIdx = parseInt(idx);
    }
    return [openIdx, closeIdx];
  }

  /**
   * Validates the script's scope and removes the `trans` tag tokens.
   * @param sourceCode 
   * @param diagnostics 
   */
  private removeScopeTags(sourceCode: string, diagnostics?: Diagnostic[]) {
    // global current tokenizer position, starts at 1,1
    let curPos = new Position();
    // find the evaluation scope - <trans>...</trans>
    let openIdx: number | null = null;
    let closeIdx: number | null = null;
    [openIdx, closeIdx] = this.findScopeTags();

    // validate the evaluation scope
    if(openIdx === null) {
      // Add warning:
      // 'No <trans> tag, script returns its content as string.'
      // pos 1,1
      if(diagnostics) {
        const pos = new Position(1, 1);
        diagnostics.push(
          new Diagnostic(
            pos, pos, 'No <trans> tag, the script returns its content as string.', false
          )
        );
      }
      console.warn('ParserWarning: No <trans> tag, the script returns its content as string.');
      // return the script source as a string
    }
    if(closeIdx === null) {
      // Add JB error:
      // 'The expression <expr> is missing closing tag </trans>'
      // curPos

      // static analysis
      if(diagnostics) {
        const start = this.tokens[this.tokens.length - 1].begin ?? new Position(1, 1);
        const end = this.tokens[this.tokens.length - 1].end ?? start;
        diagnostics.push(
          new Diagnostic(start, end, "The script is missing '</trans>' scope closing tag.")
        );
      }
      // runtime
      else
        throw new ParserError(`The expression is missing </trans> closing tag:\n${sourceCode}\n`);
    }
    if(openIdx && openIdx !== 0) {
      // Add warning:
      // 'Script content before <trans> is not evaluated and may result in unexpected behaviour.'
      // pos 1,1 - trans tag pos
      if(diagnostics) {
        diagnostics.push(
          new Diagnostic(
            this.tokens[0].begin,
            this.tokens[openIdx - 1].end,
            "Script content before <trans> is not evaluated and may result in unexpected behaviour.",
            false
          )
        );
      }
      else
        console.warn("ParserWarning: Script content before <trans> is not evaluated and may result in unexpected behaviour.");

      // Remove the front tail and update the scope indices
      while(this.tokens[0].type !== TokenType.OpenTransTag)
        this.tokens.shift();
      [openIdx, closeIdx] = this.findScopeTags();
    }

    if(closeIdx && closeIdx > 0 && closeIdx !== this.tokens.length - 1) {
      // Add warning:
      // 'Script content after </trans> is not evaluated and may result in unexpected behaviour.'
      // ignore the eof token
      // </trans> pos - curPos
      if(closeIdx !== this.tokens.length - 2) {
        if(diagnostics) {
          diagnostics.push(
            new Diagnostic(
              this.tokens[closeIdx + 1].begin,
              this.tokens[this.tokens.length - 1].end,
              "Script content after </trans> is not evaluated and may result in unexpected behaviour.",
              false
            )
          );
        }
        else
          console.warn("ParserWarning: Script content after </trans> is not evaluated and may result in unexpected behaviour.");
      }

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
  }

  /**
   * Parses a Jitterbit script, returns an expression list.
   * @param sourceCode 
   * @param diagnostics 
   * @returns 
   */
  public parse(sourceCode: string, diagnostics?: Diagnostic[]): Program {
    const program = new Program();

    // currently the lexer can only throw at runtime
    try {
      this.tokens = Lexer.tokenize(sourceCode, diagnostics);
    } catch(e) {
      console.error(e);
      return program;
    }
    
    this.removeScopeTags(sourceCode, diagnostics);
    this.checkAdjacentLiterals(diagnostics);
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
    return program;
  }

  /**
   * Development util function.
   */
  private printTokens() {
    for (const tkn of this.tokens)
      console.log(`{ '${tkn.value}', ${TokenType[tkn.type]} }`);
  }

  /**
   * Parses statements.
   * @returns 
   */
  private parse_stmt(): Stmt {
    // skip to parse_expr
    switch (this.at().type) {
      default:
        return this.parse_expr();
    }
  }

  /**
   * Parses expressions.
   * @returns 
   */
  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  /**
   * Parses a list of expressions with a shared scope.
   * @returns
   */
  private parse_block_expr(): Expr {
    const expr = this.parse_expr();
    if(this.at().type === TokenType.Semicolon) {
      const block = new BlockExpr([expr]);
      while(this.at().type === TokenType.Semicolon) {
        this.consume();
        // func(a;b;c;)
        if(this.at().type === TokenType.CloseParen)
          break;
        block.body.push(this.parse_expr());
      }
      // update end position
      block.end = block.body[block.body.length - 1].end;
      return block;
    }
    else return expr;
  }

  /**
   * Parses assignment expressions.
   * @returns 
   */
  private parse_assignment_expr(): Expr {
    const left = this.parse_logical_expr();

    if (this.at().type == TokenType.Assignment) {
      let operator = this.consume();
      const value = this.parse_assignment_expr();
      return new AssignmentExpr(left, value, operator);
    }

    return left;
  }

  /**
   * Parses logical binary operator expressions.
   * @returns
   */
  private parse_logical_expr(): Expr {
      let left = this.parse_comparative_expr();
      while(this.at().type === TokenType.LogicalOperator) {
        const operator = this.consume().value;
        const right = this.parse_comparative_expr();
        left = new BinaryExpr(left, right, operator);
      }

      return left;
  }

  /**
   * Parses conditional binary operator expressions.
   * @returns 
   */
  private parse_comparative_expr(): Expr {
    let left = this.parse_additive_expr();
    while (this.at().type === TokenType.ComparisonOperator) {
      const operator = this.consume().value;
      const right = this.parse_additive_expr();
      left = new BinaryExpr(left, right, operator);
    }

    return left;
  }

  /**
   * Parses additive binary operator expressions.
   * @returns 
   */
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    while (
      (this.at().type === TokenType.MathOperator || this.at().type === TokenType.Minus) &&
      (this.at().value === "+" || this.at().value === "-")
    ) {
      const operator = this.consume().value;
      const right = this.parse_multiplicative_expr();
      left = new BinaryExpr(left, right, operator);
    }

    return left;
  }

  /**
   * Parses multiplicative binary operator expressions.
   * @returns 
   */
  private parse_multiplicative_expr(): Expr {
    let left = this.parse_negation_expr();

    while (
      this.at().type === TokenType.MathOperator &&
      (this.at().value === "/" || this.at().value === "*")
    ) {
      const operator = this.consume().value;
      const right = this.parse_negation_expr();
      left = new BinaryExpr(left, right, operator);
    }

    return left;
  }

  /**
   * Parses negation unary expressions.
   * @returns 
   */
  private parse_negation_expr(): Expr {
    // LHS unary operator expr
    // for some reason Jitterbit dont parse this with other unary expressions
    if(this.at().type === TokenType.UnaryOperator && this.at().value === "!") {
      let operator = this.consume();
      return new UnaryExpr(this.parse_assignment_expr(), operator, true);
    } else {
      return this.parse_power_expr();
    }
  }

  /**
   * Parses power binary expressions.
   * @returns 
   */
  private parse_power_expr(): Expr {
    let left = this.parse_unary_expr();

    while (this.at().type === TokenType.MathOperator && this.at().value === "^") {
      const operator = this.consume().value;
      const right = this.parse_unary_expr();
      left = new BinaryExpr(left, right, operator);
    }

    return left;
  }

  /**
   * Parses unary expressions other than negation.
   * @returns 
   */
  private parse_unary_expr(): Expr {
    // LHS operators (pre-)
    // -x, --x, ++x
    if(
      this.at().type === TokenType.UnaryOperator ||
      this.at().type === TokenType.Minus
    ) {
      const operator = this.consume();
      return new UnaryExpr(this.parse_member_expr(), operator, true);
    } else {
      // RHS operators (post-)
      let left = this.parse_member_expr();

      if(
        this.at().type === TokenType.UnaryOperator &&
        (this.at().value === "++" || this.at().value === "--")
      ) {
        const operator = this.consume();
        left = new UnaryExpr(left, operator, false);
      }
      
      return left;
    }
  }

  /**
   * Parses a member access expression to array or dictionary.
   * @returns 
   */
  private parse_member_expr(): Expr {
    let expr = this.parse_array_expr();
    while (this.at().type === TokenType.OpenBracket) {
      // [
      this.consume();
      // this allows obj[computedValue]
      let key = this.parse_expr();
      const rBracket = this.expect(
        TokenType.CloseBracket,
        "Missing closing bracket in computed value.",
      );
      expr = new MemberExpr(expr, key, rBracket.end, true);
    }
    return expr;
  }

  /**
   * Parses an array literal expression.
   * @returns 
   */
  private parse_array_expr(): Expr {
    if(this.at().type !== TokenType.OpenBrace) {
      return this.parse_call_expr();
    }
    // {
    const lBrace = this.consume();
    // empty array
    if(this.at().type === TokenType.CloseBrace) {
      return new ArrayLiteral([], lBrace.begin, this.consume().end);
    }
    const members = this.parse_arguments_list();
    const rBrace = this.expect(
      TokenType.CloseBrace,
      "Array literal missing closing brace."
    );
    return new ArrayLiteral(members, lBrace.begin, rBrace.end);
  }

  /**
   * Parses a call expression.
   * @param caller 
   * @returns 
   */
  private parse_call_expr(): Expr {
    // the caller should always be an identifier
    const caller = this.parse_primary_expr();
    if(this.at().type !== TokenType.OpenParen)
      return caller;

    // prevents 3(), ()() etc.
    if(caller.kind !== "Identifier")
      throw new ParserError(`Invalid call expression, the caller is not a function identifier`);

    const funcName = (caller as Identifier).symbol;

    // non-existent function name
    const func = Api.getFunc(funcName)
    if(func === undefined)
      throw new ParserError(`Function '${funcName}' does not exist, refer to Jitterbit function API docs`);

    const funcIdent = new FunctionIdentifier(
      new Token((caller as Identifier).symbol, TokenType.Identifier, caller.start, caller.end)
    );
    const args = this.parse_args();
    const rParen = this.expect(
      TokenType.CloseParen,
      "Missing closing parenthesis inside arguments list",
    );
    let call_expr: Expr = new CallExpr(args, funcIdent, rParen.end);

    // invalid number of arguments
    // TODO: should not throw or be moved to typechecker
    if(
      (call_expr as CallExpr).args.length < func.minArgs ||
      (call_expr as CallExpr).args.length > func.maxArgs
    )
      throw new ParserError(`Wrong number of arguments for the function ${func.name}, should be `
      + `${func.minArgs === func.maxArgs ? func.minArgs : `${func.minArgs}-${func.maxArgs}`}`);

    return call_expr;
  }

  /**
   * Parses the argument list of a call expression.
   * @returns 
   */
  private parse_args(): Expr[] {
    this.expect(TokenType.OpenParen, "Expected open parenthesis");
    const args = this.at().type === TokenType.CloseParen
      ? []
      : this.parse_arguments_list();

    return args;
  }

  /**
   * Parses any comma-separated expression list.
   * @returns 
   */
  private parse_arguments_list(): Expr[] {
    const args = [this.parse_block_expr()];

    while (this.at().type === TokenType.Comma && this.consume()) {
      args.push(this.parse_block_expr());
    }

    return args;
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
  // Member
  // Array
  // Call
  // Primary

  /**
   * Parses literals and grouping expressions.
   * @returns 
   */
  private parse_primary_expr(): Expr {
    const tk = this.at();

    // Determine which token we are currently at and return literal value
    switch (tk.type) {
      // User-defined local variables
      case TokenType.Identifier:
        return new Identifier(this.consume());

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
        let sysVar = Api.getSysVar(globalVarToken.value);
        if(sysVar !== undefined)
          return new GlobalIdentifier(globalVarToken, "system");
        else {
          if(globalVarToken.value.substring(0, 11) === "$jitterbit.") {
            // Add a warning:
            // Global variable names should not begin with '$jitterbit.', it is a reserved namespace.
            console.warn(`ParserWarning: Global variable names should not begin with '$jitterbit.', it is a reserved namespace (${globalVarToken.value}).`);
          }

          return new GlobalIdentifier(globalVarToken, "global");
        }

      // Constants and Numeric Constants
      case TokenType.Integer:
      case TokenType.Float:
        return new NumericLiteral(this.consume());

      case TokenType.True:
        const trueToken = this.consume();
        return new BooleanLiteral(true, trueToken);

      case TokenType.False:
        const falseToken = this.consume();
        return new BooleanLiteral(false, falseToken);

      // Grouping Expressions
      case TokenType.OpenParen: {
        // ()
        if(
          this.tokens[0].type === TokenType.OpenParen &&
          this.tokens[1].type === TokenType.CloseParen
        )
          throw new ParserError("Nothing between parentheses");
        
        this.consume();
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
        );
        return value;
      }

      case TokenType.CloseParen:
        // TODO: error handling to be unified
        // consume the token to prevent infinite loops
        const tkn = this.consume();
        throw new ParserError(`Syntax error, misplaced operator \")\" (${tkn.begin.line}:${tkn.begin.character}).`);

      // string literals
      case TokenType.SingleQuoteString:
      case TokenType.DoubleQuoteString:
        return new StringLiteral(this.consume());

      default:
        // TODO: error message to be unified
        // TODO: add an error/error detail for every other token type here
        // consume the token to prevent infinite loops
        this.consume();
        throw new ParserError(`Unexpected token found during parsing: ${tk.value}`);
    }
  }
}
