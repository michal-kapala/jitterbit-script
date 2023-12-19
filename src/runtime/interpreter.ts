import { RuntimeVal } from "./values";
import {
  BinaryExpr,
  Expr,
  GlobalIdentifier,
  Program,
  Stmt,
} from "../frontend/ast";
import Scope from "./scope";
import { eval_binary_expr } from "./eval/expressions/binary";
import { JbNull } from "./types";

/**
 * Evaluates a statement or expression.
 * @param astNode `Stmt` or `Expr`
 * @param scope the current scope
 * @returns 
 */
export function evaluate(astNode: Stmt, scope: Scope): RuntimeVal {
  switch (astNode.kind) {
    case "Program":
      return (astNode as Program).execute(scope);
    case "BinaryExpr":
      // TODO: rewrite
      return eval_binary_expr(astNode as BinaryExpr, scope);
    case "GlobalIdentifier":
      scope.getGlobal().initGlobalVar(astNode as GlobalIdentifier);
    case "NumericLiteral":
    case "BooleanLiteral":
    case "StringLiteral":
    case "Identifier":
    case "ArrayLiteral":
    case "MemberExpr":
    case "AssignmentExpr":
    case "UnaryExpr":
    case "CallExpr":
      return (astNode as Expr).eval(scope);
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      return new JbNull();
  }
}
