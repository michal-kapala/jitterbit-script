import { AssignmentExpr, Identifier } from "../../../frontend/ast";
import Scope from "../../scope";
import { evaluate } from "../../interpreter";
import { RuntimeVal } from "../../values";

/**
 * Executes assignment expressions (excluding incrementation/decrementation).
 * @param node 
 * @param scope 
 * @returns 
 */
export function eval_assignment_expr(
  node: AssignmentExpr,
  scope: Scope,
): RuntimeVal {
  if (node.assignee.kind !== "Identifier" && node.assignee.kind !== "GlobalIdentifier") {
    throw `Invalid LHS inside assignment expr ${JSON.stringify(node.assignee)}`;
  }
  const varName = (node.assignee as Identifier).symbol;

  return scope.assignVar(varName, evaluate(node.value, scope), node.operator.value);
}
