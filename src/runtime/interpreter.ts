import { RuntimeVal } from "./values";
import { Expr, GlobalIdentifier, Program, Stmt } from "../frontend/ast";
import Scope from "./scope";
import { JbNull } from "./types";

/**
 * Evaluates a statement or expression.
 * @param astNode `Stmt` or `Expr`
 * @param scope the current scope
 * @returns 
 */
export async function evaluate(astNode: Stmt, scope: Scope) {
  switch (astNode.kind) {
    case "Program":
      return await (astNode as Program).execute(scope);
    case "GlobalIdentifier":
      scope.getGlobal().initGlobalVar(astNode as GlobalIdentifier);
    case "NumericLiteral":
    case "BooleanLiteral":
    case "StringLiteral":
    case "Identifier":
    case "ArrayLiteral":
    case "MemberExpr":
    case "AssignmentExpr":
    case "BinaryExpr":
    case "UnaryExpr":
    case "CallExpr":
    case "BlockExpr":
      return await (astNode as Expr).eval(scope);
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      return new JbNull();
  }
}
