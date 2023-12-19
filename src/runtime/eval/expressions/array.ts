import { ArrayLiteral } from "../../../frontend/ast";
import { evaluate } from "../../interpreter";
import Scope from "../../scope";
import { Array } from "../../types";
import { RuntimeVal } from "../../values";

/**
 * Evaluates array literal expressions.
 * @param array 
 * @param scope 
 */
export function eval_array_literal_expr(array: ArrayLiteral, scope: Scope) {
  let members: RuntimeVal[] = [];
  for (let elem of array.members)
    members.push(evaluate(elem, scope));

  return new Array(members);
}
