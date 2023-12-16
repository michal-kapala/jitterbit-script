import { 
  ArrayLiteral,
  AssignmentExpr,
  Identifier,
  MemberExpr
} from "../../../frontend/ast";
import { evaluate } from "../../interpreter";
import Scope from "../../scope";
import {
  ArrayVal,
  BooleanVal,
  DictVal,
  MK_NULL,
  NullVal,
  NumberVal,
  RuntimeVal,
  StringVal,
} from "../../values";
import { checkArrayIndex, setMember } from "./array";
import { evalAssignment } from "./assignment";
import { getDictMember, keyValueToString, setDictMember } from "./dict";

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
          return eval_array_ident_member_expr(val as ArrayVal, key);
        case "dictionary":
          return getDictMember(val as DictVal, key);
        default:
          throw `[] operator applied to a ${memExp.object.kind} data element of unsupported type: ${val.type}`;
      }
    // a[1][1]
    case "MemberExpr":
      const left = evaluate(memExp.object, scope);
      switch(left.type) {
        case "array":
          return eval_array_ident_member_expr(left as ArrayVal, key);
        case "dictionary":
          return getDictMember(left as DictVal, key);
        default:
          throw `[] operator applied to a ${memExp.object.kind} data element of unsupported type: ${left.type}`;
      }
    default:
      throw `[] operator applied to a ${memExp.object.kind} data element.\nIf in the script testing screen, try clicking 'Reset' and run again`;
  }
}

function eval_array_lit_member_expr(arrayExpr: ArrayLiteral, key: RuntimeVal, scope: Scope): RuntimeVal {
  const index = keyValueToNumber(key);
  
  // non-empty strings evaluate to NaN and dont affect the array size
  if (checkArrayIndex(index)) {
    return { type: "null", value: null} as NullVal;
  }

  let array = evaluate(arrayExpr, scope) as ArrayVal;

  // computed index out of bounds
  if (index >= array.members.length) {
    // Resizing is skipped for literals since they dont exist in the scope anyway
    if (index > array.members.length)
      console.warn(`InterpreterWarning: Specified index value out of bounds, the original array is resized to ${index} with null values`);
    return { type: "null", value: null } as NullVal;
  }

  return array.members[index];
}

function eval_array_ident_member_expr(array: ArrayVal, key: RuntimeVal, lhs = false): RuntimeVal {
  const index = keyValueToNumber(key);

  if (!checkArrayIndex(index)) {
    return { type: "null", value: null} as NullVal;
  }
  
  // computed index out of bounds
  if (index >= array.members.length) {
    array.members.push(MK_NULL());
    // Inserts the null values and mutates the scope
    // Resizes to index of elements with null values
    if(index >= array.members.length)
      console.warn(`InterpreterWarning: Specified index value out of bounds, the original array is resized to ${index} with null values`);
    for(let i = index; i >= array.members.length; i--)
      array.members.push(MK_NULL());

    return { type: "null", value: null } as NullVal;
  }
  
  return array.members[index];
}

/**
 * Converts a key value of any type to a number.
 * @param key 
 * @returns 
 */
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
    case "array":
    case "dictionary":
      // same for dict
      throw `Evaluation of array index error`;
    default:
      throw `Unsupported member expression key type: ${key.type}`;
  }
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
      const index = keyValueToNumber(evaluate(memExp.key, scope));
      let rhs = checkArrayIndex(index)
        ? evaluate(assignment.value, scope)
        : MK_NULL();
      const newValue = evalAssignment(evaluate(memExp, scope), rhs, assignment.operator.value);
      // setMember appends null values if index is out of bounds
      return setMember(lhs as ArrayVal, newValue, index);
    case "dictionary":
      const key = keyValueToString(evaluate(memExp.key, scope));
      const newVal = evalAssignment(
        evaluate(memExp, scope),
        evaluate(assignment.value, scope),
        assignment.operator.value
      );
      return setDictMember(lhs as DictVal, newVal, key);
    default:
      throw `[] operator applied to a ${lhs.type} data element.\nIf in the script testing screen, try clicking 'Reset' and run again`;
  }
}
