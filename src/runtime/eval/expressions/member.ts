import { 
  ArrayLiteral,
  AssignmentExpr,
  Identifier,
  MemberExpr
} from "../../../frontend/ast";
import { evaluate } from "../../interpreter";
import Scope from "../../scope";
import { RuntimeVal } from "../../values";
import { evalAssignment } from "./assignment";
import { Dictionary, Array, JbNull } from "../../types";

/**
 * Evaluates a member expression (x[y]).
 * @param memExp 
 * @param scope 
 * @returns 
 */
export function eval_member_expr(memExp: MemberExpr, scope: Scope): RuntimeVal {
  const key = evaluate(memExp.key, scope);

  switch(memExp.object.kind) {
    // {1,2,3}[1]
    case "ArrayLiteral":
      return eval_array_lit_member_expr(memExp.object as ArrayLiteral, key, scope);
    // a[1], $a[1]
    case "Identifier":
    case "GlobalIdentifier":
      const name = (memExp.object as Identifier).symbol;
      const val = scope.lookupVar(name);
      // check the value type
      switch (val.type) {
        case "array":
          return (val as Array).get(key);
        case "dictionary":
          return (val as Dictionary).get(key);
        default:
          throw `[] operator applied to a ${memExp.object.kind} data element of unsupported type: ${val.type}`;
      }
    // a[1][1]
    case "MemberExpr":
      const left = evaluate(memExp.object, scope);
      switch(left.type) {
        case "array":
          return (left as Array).get(key);
        case "dictionary":
          return (left as Dictionary).get(key);
        default:
          throw `[] operator applied to a ${memExp.object.kind} data element of unsupported type: ${left.type}`;
      }
    default:
      throw `[] operator applied to a ${memExp.object.kind} data element.\nIf in the script testing screen, try clicking 'Reset' and run again`;
  }
}

function eval_array_lit_member_expr(arrayExpr: ArrayLiteral, key: RuntimeVal, scope: Scope): RuntimeVal {
  const index = Array.keyValueToNumber(key);
  
  // non-empty strings evaluate to NaN and dont affect the array size
  if (Array.checkIndex(index)) {
    return new JbNull();
  }

  let array = evaluate(arrayExpr, scope) as Array;

  // computed index out of bounds
  if (index >= array.members.length) {
    // Resizing is skipped for literals since they dont exist in the scope anyway
    if (index > array.members.length)
      console.warn(`InterpreterWarning: Specified index value out of bounds, the original array is resized to ${index} with null values`);
    return new JbNull();
  }

  return array.members[index];
}

/**
 * Performs an assignment to a LHS member expression.
 * @param memExp 
 * @param assignment 
 * @param scope 
 * @returns 
 */
export function eval_member_assignment(memExp: MemberExpr, assignment: AssignmentExpr, scope: Scope): RuntimeVal {
  const kind = memExp.object.kind;
  // only identifiers allowed
  if(kind !== "Identifier" && kind !== "GlobalIdentifier" && kind !== "MemberExpr")
    throw `Invalid LHS inside assignment expr ${JSON.stringify(assignment.assignee)}; must be a local or global data element identifier or member expression`;

  // for a[1][2] expr, this evaluates a[1]
  const lhs = evaluate(memExp.object, scope);

  switch (lhs.type) {
    case "array":
      const index = Array.keyValueToNumber(evaluate(memExp.key, scope));
      let rhs = Array.checkIndex(index)
        ? evaluate(assignment.value, scope)
        : new JbNull();
      const newValue = evalAssignment(evaluate(memExp, scope), rhs, assignment.operator.value);
      // setMember appends null values if index is out of bounds
      return  (lhs as Array).set(index, newValue);
    case "dictionary":
      const key = evaluate(memExp.key, scope);
      const newVal = evalAssignment(
        evaluate(memExp, scope),
        evaluate(assignment.value, scope),
        assignment.operator.value
      );
      return (lhs as Dictionary).set(key, newVal);
    default:
      throw `[] operator applied to a ${lhs.type} data element.\nIf in the script testing screen, try clicking 'Reset' and run again`;
  }
}
