import { BooleanVal, NullVal, NumberVal, RuntimeVal, StringVal } from "./values";
import {
  AssignmentExpr,
  BinaryExpr,
  BooleanLiteral,
  GlobalIdentifier,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Stmt,
  StringLiteral,
  UnaryExpr,
} from "../frontend/ast";
import Scope from "./scope";
import { eval_program } from "./eval/statements";
import { eval_assignment_expr } from "./eval/expressions/assignment";
import { eval_binary_expr } from "./eval/expressions/binary";
import { eval_identifier } from "./eval/expressions/identifier";
import { eval_object_expr } from "./eval/expressions/object";
import { eval_unary_expr } from "./eval/expressions/unary";

/**
 * Evaluates a statement or expression.
 * @param astNode `Stmt` or `Expr`
 * @param scope the current scope
 * @returns 
 */
export function evaluate(astNode: Stmt, scope: Scope): RuntimeVal {
  switch (astNode.kind) {
    // handles both integer and float literals
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumberVal;
    case "BooleanLiteral":
      return {
        value: ((astNode as BooleanLiteral).value),
        type: "bool"
      } as BooleanVal;
    case "StringLiteral":
      return {
        value: ((astNode as StringLiteral).value),
        type: "string"
      } as StringVal;
    case "Identifier":
      return eval_identifier(astNode as Identifier, scope);
    case "GlobalIdentifier":
      const global = astNode as GlobalIdentifier;
      // null-init global variables on first appearance, before the evaluation
      // globals are script-scoped, there's nothing like a script call stack available here
      // which also makes project variables unsupported
       const globalScope = scope.getGlobal();
       globalScope.initGlobalVar(global);
      return eval_identifier(astNode as Identifier, scope);
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, scope);
    case "AssignmentExpr":
      return eval_assignment_expr(astNode as AssignmentExpr, scope);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, scope);
    case "UnaryExpr":
      return eval_unary_expr(astNode as UnaryExpr, scope);
    case "Program":
      return eval_program(astNode as Program, scope);
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      return { type: "null" } as NullVal;
  }
}
