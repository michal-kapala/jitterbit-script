import { ArrayLiteral } from "../../../frontend/ast";
import { evaluate } from "../../interpreter";
import Scope from "../../scope";
import {
  ArrayVal,
  BooleanVal,
  MK_NULL,
  NullVal,
  NumberVal,
  RuntimeVal,
  StringVal,
} from "../../values";

/**
 * Max array size in null values; around 226500, with 227000 Jitterbit Studio throws Java heap limit exception.
 * Tested on a bare script with default heap settings (`-Xms512m -Xmx1024m`).
 */
export const MAX_ARRAY_SIZE = 226500;

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

/**
 * Checks if the number is a valid array index.
 * @param index 
 * @returns 
 */
export function checkArrayIndex(index: number): boolean {
  if(index < 0)
    throw `Invalid array index: ${index}`;

  // limit testing warning
  if(index > MAX_ARRAY_SIZE)
    console.warn(`Index of ${index} exceeds maximum array size for Jitterbit Studio's default Java heap (1GB)`);

  // non-empty strings evaluate to NaN and dont affect the array size
  // float indices return null values
  if (Number.isNaN(index) || !Number.isInteger(index)) {
    return false;
  }

  return true;
}

/**
 * Performs member assignment via LHS member expression.
 * @param array 
 * @param newValue 
 * @param index 
 * @returns 
 */
export function setMember(array: ArrayVal, newValue: RuntimeVal, index: number): RuntimeVal {
  // handle out-of-bounds index
  if (index >= array.members.length) {
    console.warn(`InterpreterWarning: Specified index value out of bounds, the original array is resized to ${index+1} with null values`);
    
    for(let i = index; i > array.members.length; i--)
      array.members.push(MK_NULL());

    array.members.push(newValue);
    return newValue;
  }
  
  array.members[index] = newValue;
  return newValue;
}

/**
 * Mutates a nested array for += and -= assignments with numeric values.
 * @param nested 
 * @param numVal 
 * @param operator `-=` or `+=`
 * @param lhs Determines if `numVal` is LHS, true by default.
 * @returns 
 */
export function eval_number_assignment(nested: ArrayVal, numVal: NumberVal, operator: string, lhs = true): ArrayVal {
  const members = nested.members;
  for(const idx in members)
  {
    switch (members[idx].type) {
      case "number":
        if(operator === "+=")
          (members[idx] as NumberVal).value += numVal.value;
        else if(lhs)
          (members[idx] as NumberVal).value = numVal.value - (members[idx] as NumberVal).value;
        else
          (members[idx] as NumberVal).value -= numVal.value;
        break;
      case "string":
        // if the string is a parseable number or empty, concatenate the number as string
        // note - cannot reproduce this case
        // if(Number.isNaN(parseFloat((members[idx] as StringVal).value)) && (members[idx] as StringVal).value !== "")
        //   throw `Cannot set the data element of array type with a string: "<array literal>"`;

        if(operator === "+=")
          (members[idx] as StringVal).value += numVal.value.toString();
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? numVal.type : members[idx].type } - ${lhs ? members[idx].type : numVal.type }`;
        break;
      case "null":
        if(operator === "+=" || lhs)
          members[idx] = numVal;
        else
          members[idx] = { type: "number", value: -1 * numVal.value } as NumberVal;
        break;
      case "array":
        members[idx] = eval_number_assignment(members[idx] as ArrayVal, numVal, operator, lhs);
        break;
      case "bool":
      case "dictionary":
        throw `Cannot set the data element of array type with a string: "<array literal>"`;
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }
  return nested;
}

/**
 * Mutates a nested array for += and -= assignments with null values.
 * @param nested 
 * @param nullVal 
 * @param operator `-=` or `+=`
 * @param lhs Determines if `nullVal` is LHS, true by default.
 * @returns 
 */
export function eval_null_assignment(nested: ArrayVal, nullVal: NullVal, operator: string, lhs = true): ArrayVal {
  const members = nested.members;
  for(const idx in members)
  {
    switch (members[idx].type) {
      case "number":
        if(operator === "+=" || !lhs)
          break;
        else
          (members[idx] as NumberVal).value *= -1;
        break;
      case "string":
        if(operator === "+=" || !lhs)
          break;
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? nullVal.type : members[idx].type} - ${lhs ? members[idx].type : nullVal.type}`;
      case "bool":
        if(operator === "+=")
          break;
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? nullVal.type : members[idx].type} - ${lhs ? members[idx].type : nullVal.type}`;
      case "null":
        break;
      case "array":
        members[idx] = eval_null_assignment(members[idx] as ArrayVal, nullVal, operator, lhs);
        break;
      case "dictionary":
        throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }
  return nested;
}

/**
 * Mutates a nested array for += and -= assignments with null values.
 * @param nested 
 * @param boolVal 
 * @param operator `-=` or `+=`
 * @param lhs Determines if `boolVal` is LHS, true by default.
 * @returns 
 */
export function eval_bool_assignment(nested: ArrayVal, boolVal: BooleanVal, operator: string, lhs = true): ArrayVal {
  const members = nested.members;
  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        throw `Illegal operation: ${lhs ? members[idx].type : boolVal.type} ${operator} ${lhs ? boolVal.type : members[idx].type}`;
      case "bool":
        throw `Illegal operation, ADDITION with incompatible data types: bool ${operator === "+=" ? "+" : "-"} bool`;
      case "string":
        if(operator === "+=")
          (members[idx] as StringVal).value += boolVal.value ? "1" : "0";
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? boolVal.type : members[idx].type} - ${lhs ? members[idx].type : boolVal.type}`;
        break;
      case "null":
        if(operator === "+=")
          members[idx] = boolVal;
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? boolVal.type : members[idx].type} - ${lhs ? members[idx].type : boolVal.type}`;
        break;
      case "array":
        members[idx] = eval_bool_assignment(members[idx] as ArrayVal, boolVal, operator, lhs);
        break;
      case "dictionary":
        if(operator === "+=")
          throw `Illegal operation: ${members[idx].type} += ${boolVal.type}`;
        throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? boolVal.type : members[idx].type} - ${lhs ? members[idx].type : boolVal.type}`;
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }
  return nested;
}

/**
 * Mutates a nested array for += and -= assignments with string values.
 * @param nested 
 * @param strVal 
 * @param operator `-=` or `+=`
 * @param lhs Determines if `strVal` is LHS, true by default.
 * @returns 
 */
export function eval_string_assignment(nested: ArrayVal, strVal: StringVal, operator: string, lhs = true): ArrayVal {
  const members = nested.members;
  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        if(operator === "+=") {
          // concat
          if(lhs)
            members[idx] = {type: "string", value: strVal.value + (members[idx] as NumberVal).value.toString()} as StringVal;
          else
            members[idx] = {type: "string", value: (members[idx] as NumberVal).value.toString() + strVal.value} as StringVal;
        }
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? strVal.type : members[idx].type} - ${lhs ? members[idx].type : strVal.type}`;
        break;
      case "bool":
        // bool2int2string and concat
        if(operator === "+=") {
          if(lhs)
            members[idx] = {type: "string", value: strVal.value + ((members[idx] as BooleanVal).value ? "1" : "0")} as StringVal;
          else
            members[idx] = {type: "string", value: ((members[idx] as BooleanVal).value ? "1" : "0") + strVal.value} as StringVal;
        }
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? strVal.type : members[idx].type} - ${lhs ? members[idx].type : strVal.type}`;
        break;
      case "string":
        // concat
        if(operator === "+=") {
          if(lhs)
            (members[idx] as StringVal).value = strVal.value + (members[idx] as StringVal).value;
          else
            (members[idx] as StringVal).value += strVal.value;
        }
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? strVal.type : members[idx].type} - ${lhs ? members[idx].type : strVal.type}`;
        break;
      case "null":
        // assign string
        if(operator === "+=" || lhs)
          members[idx] = strVal;
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${members[idx].type} - ${strVal.type}`;
        break;
      case "array":
        // nested arrays
        members[idx] = eval_string_assignment(members[idx] as ArrayVal, strVal, operator, lhs);
        break;
      case "dictionary":
        if(operator === "+=")
          throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
        else
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? strVal.type : members[idx].type} - ${lhs ? members[idx].type : strVal.type}`;
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }
  return nested;
}
