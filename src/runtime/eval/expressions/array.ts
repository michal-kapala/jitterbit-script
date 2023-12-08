import { ArrayLiteral } from "../../../frontend/ast";
import { evaluate } from "../../interpreter";
import Scope from "../../scope";
import { ArrayVal, RuntimeVal } from "../../values";

/**
 * Evaluates array expressions (literals/fuction calls).
 * @param array 
 * @param scope 
 */
export function eval_array_expr(array: ArrayLiteral, scope: Scope): ArrayVal {
  let members: RuntimeVal[] = [];
  for (let elem of array.members)
    members.push(evaluate(elem, scope));

  return { type: "array", members }
}
