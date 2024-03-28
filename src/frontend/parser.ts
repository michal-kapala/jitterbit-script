
import Api from "../api";
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
  GlobalIdentifier,
  Identifier,
  InvalidExpr,
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
  private endTagStart?: Position;
  private endTagEnd?: Position;

  /**
   * Determines if the parsing is complete and the EOF was reached.
   * @returns 
   */
  private not_eof(): boolean {
    return this.tokens[0].type !== TokenType.EOF;
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
   * Checks the token type and errors on mismatch.
   * 
   * Consumes expected tokens. Returns the expression's end position.
   * @param type 
   * @param err 
   * @param start
   * @param end 
   * @param diagnostics
   * @throws `ParserError` (runtime-only)
   * @returns 
   */
  private expect(type: TokenType, err: string, start: Position, end: Position, diagnostics?: Diagnostic[]) {
    const current = this.at();
    // expected
    if (current && current.type === type)
      return this.consume().end;

    // unexpected
    if (!current || current.type !== type) {
      // static analysis / runtime
      if(diagnostics)
        diagnostics.push(new Diagnostic(start, end, err));
      else
        throw new ParserError(err);
    }
    // returns the expression's end
    return end;
  }
  
  /**
   * Validates if there are no adjacent primary expressions.
   * @param diagnostics 
   * @throws `ParserError` (runtime-only)
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
        const err = `Missing semicolon or operator between two operands: '${this.tokens[curIdx].value}' and '${this.tokens[curIdx+1].value}'.`;
        // static analysis / runtime
        if(diagnostics)
          diagnostics.push(new Diagnostic(this.tokens[curIdx].begin, this.tokens[curIdx+1].end, err));
        else
          throw new ParserError(err);
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
   * 
   * Returns `true` on a script scope error.
   * @param diagnostics 
   * @returns
   * @throws `ParserError` (runtime-only)
   */
  private removeScopeTags(diagnostics?: Diagnostic[]): boolean {
    // empty script
    if(this.tokens.length === 0) {
      if(diagnostics)
        return true;
      else
        throw new ParserError("Empty script.");
    }
    
    // find the evaluation scope - <trans>...</trans>
    let result = false;
    let openIdx: number | null = null;
    let closeIdx: number | null = null;
    [openIdx, closeIdx] = this.findScopeTags();

    // validate the evaluation scope
    if(openIdx === null) {
      const msg = "No <trans> tag, the script returns its content as string.";
      // static analysis / runtime
      if(diagnostics) {
        const pos = new Position(1, 1);
        diagnostics.push(new Diagnostic(pos, pos, msg));
        result = true;
      }
      else
        console.warn(`ParserWarning: ${msg}`);
      // TODO: return the script source as a string
    }
    if(closeIdx === null) {
      const msg = "The script is missing '</trans>' scope closing tag.";
      // static analysis / runtime
      if(diagnostics) {
        const start = this.tokens[this.tokens.length - 1].begin ?? new Position(1, 1);
        const end = this.tokens[this.tokens.length - 1].end ?? start;
        diagnostics.push(new Diagnostic(start, end, msg));
        result = true;
      }
      else
        throw new ParserError(msg);
    }
    if(openIdx && openIdx !== 0) {
      const msg = "Script content before <trans> is not evaluated and may result in unexpected behaviour.";
      // static analysis / runtime
      if(diagnostics)
        diagnostics.push(new Diagnostic(this.tokens[0].begin, this.tokens[openIdx - 1].end, msg, false));
      else
        console.warn(`ParserWarning: ${msg}`);
      // Remove the front tail and update the scope indices
      while(this.tokens[0].type !== TokenType.OpenTransTag)
        this.tokens.shift();
      [openIdx, closeIdx] = this.findScopeTags();
    }

    if(closeIdx && closeIdx > 0 && closeIdx !== this.tokens.length - 1) {
      if(closeIdx !== this.tokens.length - 2) {
        const msg = "Script content after </trans> is not evaluated and may result in unexpected behaviour.";
        // static analysis / runtime
        if(diagnostics)
          diagnostics.push(new Diagnostic(this.tokens[closeIdx + 1].begin, this.tokens[this.tokens.length - 1].end, msg, false));
        else
          console.warn(`ParserWarning: ${msg}`);
      }
      // Remove the back tail
      let len = this.tokens.length - 1;
      while(this.tokens[len].type !== TokenType.CloseTransTag) {
        this.tokens.pop();
        len--;
      }
    }
    // Remove <trans> and </trans>, restore EOF
    this.tokens.shift();
    const last = this.tokens.pop() as Token;
    if(last.type === TokenType.CloseTransTag) {
      this.endTagStart = last.begin;
      this.endTagEnd = last.end;
    }
    this.tokens.push(new Token("EndOfFile", TokenType.EOF, last.end, last.end));
    return result;
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
    const scopeError = this.removeScopeTags(diagnostics);
    // missing script tags
    if(scopeError)
      return program;

    this.checkAdjacentLiterals(diagnostics);
    // Parse until end of file
    while (this.not_eof()) {
      // Jitterbit only uses expressions
      const expr = this.parseStmt(diagnostics) as Expr;
      program.body.push(expr);
      // top-level statement/expression semicolon
      // the last expression can have the semicolon dropped
      if(this.not_eof()) {
        // array literal/call error handling
        // TODO: to be extended
        if(this.at().type !== TokenType.Comma)
          this.expect(TokenType.Semicolon, "Expected ';' at the expression's end.", expr.start, expr.end, diagnostics);
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
   * @param diagnostics
   * @returns 
   */
  private parseStmt(diagnostics?: Diagnostic[]): Stmt {
    // skip to parse_expr
    switch (this.at().type) {
      default:
        return this.parseExpr(diagnostics);
    }
  }

  /**
   * Parses expressions. Expression precedence (lowest to highest):
   * 1. Assignment
   * 2. Logical
   * 3. Comparative
   * 4. Additive
   * 5. Multiplicitave
   * 6. Negation
   * 7. Power
   * 8. Unary
   * 9. Member
   * 10. Array
   * 11. Call
   * 12. Primary (literals/grouping parenthesis)
   * @param diagnostics 
   * @returns 
   */
  private parseExpr(diagnostics?: Diagnostic[]): Expr {
    return this.parseAssign(diagnostics);
  }

  /**
   * Parses a list of expressions with a shared scope.
   * @param diagnostics 
   * @returns
   */
  private parseBlock(diagnostics?: Diagnostic[]): Expr {
    const expr = this.parseExpr(diagnostics);
    if(this.at().type === TokenType.Semicolon) {
      const block = new BlockExpr([expr]);
      while(this.at().type === TokenType.Semicolon) {
        this.consume();
        // call expressions with nested calls missing ')'
        if(this.at().type === TokenType.EOF)
          break;
        // func(a;b;c;)
        if(this.at().type === TokenType.CloseParen)
          break;
        block.body.push(this.parseExpr(diagnostics));
      }
      // update end position
      block.end = block.body[block.body.length - 1].end;
      return block;
    }
    return expr;
  }

  /**
   * Parses assignment expressions.
   * @param diagnostics 
   * @returns 
   */
  private parseAssign(diagnostics?: Diagnostic[]): Expr {
    const left = this.parseLogical(diagnostics);
    if(this.at().type == TokenType.Assignment) {
      const operator = this.consume();
      const value = this.parseAssign(diagnostics);
      return new AssignmentExpr(left, value, operator);
    }
    return left;
  }

  /**
   * Parses logical binary operator expressions.
   * @param diagnostics 
   * @returns
   */
  private parseLogical(diagnostics?: Diagnostic[]): Expr {
      let left = this.parseComparative(diagnostics);
      while(this.at().type === TokenType.LogicalOperator) {
        const operator = this.consume().value;
        const right = this.parseComparative(diagnostics);
        left = new BinaryExpr(left, right, operator);
      }
      return left;
  }

  /**
   * Parses conditional binary operator expressions.
   * @param diagnostics 
   * @returns 
   */
  private parseComparative(diagnostics?: Diagnostic[]): Expr {
    let left = this.parseAdditive(diagnostics);
    while (this.at().type === TokenType.ComparisonOperator) {
      const operator = this.consume().value;
      const right = this.parseAdditive(diagnostics);
      left = new BinaryExpr(left, right, operator);
    }
    return left;
  }

  /**
   * Parses additive binary operator expressions.
   * @param diagnostics 
   * @returns 
   */
  private parseAdditive(diagnostics?: Diagnostic[]): Expr {
    let left = this.parseMultiplicative(diagnostics);
    while (
      (this.at().type === TokenType.MathOperator || this.at().type === TokenType.Minus) &&
      (this.at().value === "+" || this.at().value === "-")
    ) {
      const operator = this.consume().value;
      const right = this.parseMultiplicative(diagnostics);
      left = new BinaryExpr(left, right, operator);
    }
    return left;
  }

  /**
   * Parses multiplicative binary operator expressions.
   * @param diagnostics 
   * @returns 
   */
  private parseMultiplicative(diagnostics?: Diagnostic[]): Expr {
    let left = this.parseNegation(diagnostics);
    while (
      this.at().type === TokenType.MathOperator &&
      (this.at().value === "/" || this.at().value === "*")
    ) {
      const operator = this.consume().value;
      const right = this.parseNegation(diagnostics);
      left = new BinaryExpr(left, right, operator);
    }
    return left;
  }

  /**
   * Parses negation unary expressions.
   * @param diagnostics 
   * @returns 
   */
  private parseNegation(diagnostics?: Diagnostic[]): Expr {
    // LHS unary operator expr
    // for some reason Jitterbit dont parse this with other unary expressions
    if(this.at().type === TokenType.UnaryOperator && this.at().value === "!") {
      const operator = this.consume();
      return new UnaryExpr(this.parseAssign(diagnostics), operator, true);
    } else {
      return this.parsePower(diagnostics);
    }
  }

  /**
   * Parses power binary expressions.
   * @param diagnostics 
   * @returns 
   */
  private parsePower(diagnostics?: Diagnostic[]): Expr {
    let left = this.parseUnary(diagnostics);
    while (this.at().type === TokenType.MathOperator && this.at().value === "^") {
      const operator = this.consume().value;
      const right = this.parseUnary(diagnostics);
      left = new BinaryExpr(left, right, operator);
    }
    return left;
  }

  /**
   * Parses unary expressions other than negation.
   * @param diagnostics 
   * @returns 
   */
  private parseUnary(diagnostics?: Diagnostic[]): Expr {
    // LHS operators (pre-)
    // -x, --x, ++x
    if(
      this.at().type === TokenType.UnaryOperator ||
      this.at().type === TokenType.Minus
    ) {
      const operator = this.consume();
      return new UnaryExpr(this.parseMember(diagnostics), operator, true);
    } else {
      // RHS operators (post-)
      let left = this.parseMember(diagnostics);
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
   * @param diagnostics 
   * @returns 
   */
  private parseMember(diagnostics?: Diagnostic[]): Expr {
    let expr = this.parseArray(diagnostics);
    if(this.tokens.length === 0)
      return expr;
    
    while (this.at().type === TokenType.OpenBracket) {
      // [
      this.consume();
      // this allows obj[computedValue]
      const key = this.parseExpr(diagnostics);
      const rBracketPos = this.expect(
        TokenType.CloseBracket,
        "Expected ']'.",
        expr.start,
        key.end,
        diagnostics
      );
      expr = new MemberExpr(expr, key, rBracketPos, true);
    }
    return expr;
  }

  /**
   * Parses an array literal expression.
   * @param diagnostics 
   * @returns 
   */
  private parseArray(diagnostics?: Diagnostic[]): Expr {
    if(this.at().type !== TokenType.OpenBrace)
      return this.parseCall(diagnostics);

    // {
    const lBrace = this.consume();
    // empty array
    if(this.at().type === TokenType.CloseBrace)
      return new ArrayLiteral([], lBrace.begin, this.consume().end);
    
    const members = this.parseArgs(diagnostics);
    const endPos = members.length > 0
      ? members[members.length - 1].end
      : lBrace.end;
    const rBracePos = this.expect(
      TokenType.CloseBrace,
      "Array literal missing closing brace.",
      lBrace.begin,
      endPos,
      diagnostics
    );
    return new ArrayLiteral(members, lBrace.begin, rBracePos);
  }

  /**
   * Parses a call expression.
   * @param diagnostics
   * @throws `ParserError` (runtime-only)
   * @returns 
   */
  private parseCall(diagnostics?: Diagnostic[]): Expr {
    // the caller should always be an identifier
    const caller = this.parsePrimary(diagnostics);
    if(this.tokens.length === 0)
      return caller;

    if(this.at().type !== TokenType.OpenParen)
      return caller;

    const lParenPos = this.expect(
      TokenType.OpenParen,
      "Expected '(' for the call expression.",
      caller.start,
      caller.end,
      diagnostics
    );
    const args = this.at().type !== TokenType.CloseParen ? this.parseArgs(diagnostics) : [];
    const endPos = args.length > 0 ? args[args.length - 1].end : lParenPos;
    const rParenPos = this.expect(
      TokenType.CloseParen,
      "Expected ')' at the call expression's end.",
      caller.start,
      endPos,
      diagnostics
    );
    return new CallExpr(args, caller, rParenPos);
  }

  /**
   * Parses any comma-separated expression list.
   * @param diagnostics 
   * @returns 
   */
  private parseArgs(diagnostics?: Diagnostic[]): Expr[] {
    const args = [this.parseBlock(diagnostics)];
    while (this.at().type === TokenType.Comma && this.consume())
      args.push(this.parseBlock(diagnostics));
    return args;
  }

  /**
   * Parses literals and grouping expressions.
   * @param diagnostics 
   * @throws `ParserError` (runtime-only)
   * @returns 
   */
  private parsePrimary(diagnostics?: Diagnostic[]): Expr {
    const tk = this.at();
    switch (tk.type) {
      case TokenType.Identifier:
        return new Identifier(this.consume());
      case TokenType.GlobalIdentifier:
        const globalVar = this.consume();
        // if the name is '$' then the var acts as an untracked global var
        // i.e. it doesnt appear in the debugger
        if(globalVar.value === "$") {
          // Member expressions on $ can lead to unexpected behavior, for instance:
          // $[2] = $;
          // lol = $[2];
          // results in a proxy error (502) and apache server exceptions from agents
          const warn = "'$' should not be used as an identifier. It behaves like an untracked global variable and may cause unexpected behaviour including agent-level exceptions when used in complex expressions.";
          // static analysis / runtime
          if(diagnostics)
            diagnostics.push(new Diagnostic(globalVar.begin, globalVar.end, warn, false));
          else
            console.warn(`ParserWarning: ${warn}`);
        }
        const sysVar = Api.getSysVar(globalVar.value);
        if(sysVar !== undefined)
          return new GlobalIdentifier(globalVar, "system");
        else {
          if(globalVar.value.substring(0, 11) === "$jitterbit.") {
            const warn = `Global variable names should not begin with '$jitterbit.', it is a reserved namespace (${globalVar.value}).`;
            // static analysis / runtime
            if(diagnostics)
              diagnostics.push(new Diagnostic(globalVar.begin, globalVar.end, warn, false));
            else
              console.warn(`ParserWarning: ${warn}`);
          }
          return new GlobalIdentifier(globalVar, "global");
        }
      // numeric/bool literals
      case TokenType.Integer:
      case TokenType.Float:
        return new NumericLiteral(this.consume());
      case TokenType.True:
        return new BooleanLiteral(true, this.consume());
      case TokenType.False:
        return new BooleanLiteral(false, this.consume());
      // grouping expression
      case TokenType.OpenParen:
        // ()
        if(
          this.tokens[0].type === TokenType.OpenParen &&
          this.tokens[1].type === TokenType.CloseParen
        ) {
          const err = "Expected non-empty grouping expression.";
          // static analysis / runtime
          if(diagnostics) {
            const lparen = this.consume();
            const rparen = this.consume();
            return new InvalidExpr("()", err, lparen.begin, rparen.end);
          }
          else
            throw new ParserError(err);
        }
        const lParen = this.consume();
        const value = this.parseExpr();
        this.expect(
          TokenType.CloseParen,
          "Expected ')' at the grouping expression's end.",
          lParen.begin,
          value.end,
          diagnostics
        );
        return value;
      case TokenType.CloseParen:
        // consume the token to prevent infinite loops
        const tkn = this.consume();
        const parenErr = "Unexpected ')'.";
        // static analysis / runtime
        if(diagnostics)
          return new InvalidExpr(tkn.value, parenErr, tkn.begin, tkn.end);
        else
          throw new ParserError(parenErr);
      // string literals
      case TokenType.SingleQuoteString:
      case TokenType.DoubleQuoteString:
        return new StringLiteral(this.consume());
      case TokenType.EOF:
        const start = this.endTagStart ?? tk.begin;
        const end = this.endTagEnd ?? tk.end;
        return new InvalidExpr("EOF", "Expected expression before the end of script.", start, end);
      default:
        // consume the token to prevent infinite loops
        const unk = this.consume();
        // static analysis / runtime
        const err = `Unexpected token '${tk.value}'.`;
        if(diagnostics)
          return new InvalidExpr(unk.value, err, unk.begin, unk.end);
        else
          throw new ParserError(err);
    }
  }
}
