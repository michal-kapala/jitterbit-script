import { ArrayLiteral, MemberExpr } from "../../../frontend/ast";
import { evaluate } from "../../interpreter";
import Scope from "../../scope";
import { ArrayVal, BooleanVal, NullVal, NumberVal, RuntimeVal, StringVal } from "../../values";

/**
 * Evaluates a member expression (x[y]).
 * @param memExp 
 * @param scope 
 * @returns 
 */
export function eval_member_expr(memExp: MemberExpr, scope: Scope): RuntimeVal {
  let key = evaluate(memExp.key, scope);

  switch(memExp.object.kind) {
    case "ArrayLiteral":
      return eval_array_member_expr(memExp.object as ArrayLiteral, key, scope);
    default:
      throw `[] operator applied to a ${memExp.object.kind} data element.\nIf in the script testing screen, try clicking 'Reset' and run again`;
  }
}

function eval_array_member_expr(arrayExpr: ArrayLiteral, key: RuntimeVal, scope: Scope): RuntimeVal {
  // TODO: set a sensible limit and an error to prevent allocation errors on the agent
  const index = keyValueToNumber(key);
  
  // non-empty strings evaluate to NaN and dont affect the array size
  if(Number.isNaN(index)) {
    return { type: "null", value: null} as NullVal;
  }

  let array = evaluate(arrayExpr, scope) as ArrayVal;
  // computed index out of bounds
  if (index >= array.members.length) {
    // TODO: insert the null values and mutate the scope
    // resize to index of elements with null values
    // the returned null value does not get inserted
    // this should return a warning
    return { type: "null", value: null } as NullVal;
  }

  return array.members[index];
}

function keyValueToNumber(key: RuntimeVal): number {
  switch (key.type) {
    case "number":
      return (key as NumberVal).value;
    case "bool":
      return (key as BooleanVal).value ? 1 : 0;
    case "string":
      return (key as StringVal).value === "" ? 0 : NaN;
    case "null":
      return 0;
    default:
      throw `Unsupported member expression key type: ${key.type}`;
  }
}
