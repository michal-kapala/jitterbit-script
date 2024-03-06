import { TcError } from "../errors";
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
  StringLiteral,
  UnaryExpr
} from "../frontend/ast";
import TypeEnv from "./environment";
import {
  TypedArrayLiteral,
  TypedAssignment,
  TypedBinaryExpr,
  TypedBlockExpr,
  TypedBoolLiteral,
  TypedCall,
  TypedExpr,
  TypedGlobalIdentifier,
  TypedIdentifier,
  TypedInvalidExpr,
  TypedMemberExpr,
  TypedNumericLiteral,
  TypedStringLiteral,
  TypedUnaryExpr
} from "./ast";
import Diagnostic from "../diagnostic";

/**
 * Static type checker for Jitterbit script ASTs.
 */
export default class Typechecker {
  static rebuildAst(ast: Program): TypedExpr[] {
    const typedAst: TypedExpr[] = [];
    // Jitterbit uses expressions only
    for(const expr of ast.body)
      typedAst.push(this.convertExpr(expr as Expr));
    return typedAst;
  }

  /**
   * Converts an expression node into a typed expression node.
   * @param expr 
   * @returns 
   */
  static convertExpr(expr: Expr): TypedExpr {
    switch(expr.kind) {
      case "ArrayLiteral":
        return new TypedArrayLiteral(expr as ArrayLiteral);
      case "AssignmentExpr":
        return new TypedAssignment(expr as AssignmentExpr);
      case "BinaryExpr":
        return new TypedBinaryExpr(expr as BinaryExpr);
      case "BlockExpr":
        return new TypedBlockExpr(expr as BlockExpr);
      case "BooleanLiteral":
        return new TypedBoolLiteral(expr as BooleanLiteral);
      case "CallExpr":
        return new TypedCall(expr as CallExpr);
      case "Identifier":
        return new TypedIdentifier(expr as Identifier);
      case "InvalidExpr":
        return new TypedInvalidExpr(expr as InvalidExpr);
      case "GlobalIdentifier":
        return new TypedGlobalIdentifier(expr as GlobalIdentifier);
      case "MemberExpr":
        return new TypedMemberExpr(expr as MemberExpr);
      case "NumericLiteral":
        return new TypedNumericLiteral(expr as NumericLiteral);
      case "Program":
        throw new TcError("Nested AST found.");
      case "StringLiteral":
        return new TypedStringLiteral(expr as StringLiteral);
      case "UnaryExpr":
        return new TypedUnaryExpr(expr as UnaryExpr);
      default:
        throw new TcError(`Unsupported expression type ${expr.kind}.`);
    }
  }

  /**
   * Performs static analysis of Jitterbit script AST.
   * @param ast 
   * @param diagnostics 
   * @returns 
   */
  static analyze(ast: Program, diagnostics: Diagnostic[]): CodeAnalysis {
    const typedAst = this.rebuildAst(ast);
    const env = new TypeEnv();
    for(const expr of typedAst) {
      expr.typeExpr(env);
      // top-level unassigned identifiers
      if(expr.type === "unassigned") {
        expr.type = "error";
        expr.error = `Local variable '${(expr as TypedIdentifier).symbol}' hasn't been initialized.`
      }
    }
    for(const d of this.collectDiagnostics(typedAst))
      diagnostics.push(d);
    return {ast: typedAst, diagnostics};
  }

  /**
   * Creates a diagnostic list out of type-checked AST.
   * @param ast 
   * @returns 
   */
  static collectDiagnostics(ast: TypedExpr[]) {
    const diagnostics: Diagnostic[] = [];
    for(const expr of ast) {
      for(const d of expr.collect())
        diagnostics.push(d);
    }
    return diagnostics;
  }
}

/**
 * The result of the code's static analysis.
 */
type CodeAnalysis = {
  ast: TypedExpr[],
  diagnostics: Diagnostic[];
};
