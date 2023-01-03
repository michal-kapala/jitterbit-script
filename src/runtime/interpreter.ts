import { NullVal, NumberVal, RuntimeVal, StringVal } from "./values";
import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Stmt,
  StringLiteral,
  VarDeclaration,
} from "../frontend/ast";
import Scope from "./scope";
import { eval_program, eval_var_declaration } from "./eval/statements";
import {
  eval_assignment,
  eval_binary_expr,
  eval_identifier,
  eval_object_expr,
} from "./eval/expressions";

export function evaluate(astNode: Stmt, scope: Scope): RuntimeVal {
  switch (astNode.kind) {
    // handles both integer and float literals
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumberVal;
    case "StringLiteral":
      return {
        value: ((astNode as StringLiteral).value),
        type: "string"
      } as StringVal;
    case "Identifier":
      return eval_identifier(astNode as Identifier, scope);
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, scope);
    case "AssignmentExpr":
      return eval_assignment(astNode as AssignmentExpr, scope);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, scope);
    case "Program":
      return eval_program(astNode as Program, scope);
    // Handle statements
    case "VarDeclaration":
      return eval_var_declaration(astNode as VarDeclaration, scope);
    // Handle unimplimented ast types as error.
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      return { type: "null" } as NullVal;
  }
}
