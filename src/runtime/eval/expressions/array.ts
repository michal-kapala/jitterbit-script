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
    
    for(let i = index; i > array.members.length; i--) {
      console.warn(`InterpreterWarning: Specified index value out of bounds, the original array is resized to ${index+1} with null values`);
      array.members.push(MK_NULL());
    }

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

        if(operator === "+=") {
          if(lhs)
            (members[idx] as StringVal).value = numVal.value.toString() + (members[idx] as StringVal).value;
          else
            (members[idx] as StringVal).value += numVal.value.toString();
        } 
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
        throw `Illegal operation, ${operator === "+=" ? "ADDITION" : "SUBTRACT"} with incompatible data types: bool ${operator === "+=" ? "+" : "-"} bool`;
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

export function eval_array_assignment(lhs: ArrayVal, rhs: ArrayVal, operator: string): ArrayVal {
  if(lhs.members.length !== rhs.members.length)
    throw `The operator ${operator} operating on two array data elements with inconsistent sizes n1/n2: ${lhs.members.length}/${rhs.members.length}`;

  switch (operator) {
    case "-=":
      return eval_array_subtraction_assignment(lhs, rhs);
    case "+=":
      return eval_array_addition_assignment(lhs, rhs);
    default:
      throw `Unsupported array assignment operator: ${operator}`;
  }
}

/**
 * Evaluates array -= array expressions.
 * @param lhs 
 * @param rhs 
 * @returns
 */
function eval_array_subtraction_assignment(lhs: ArrayVal, rhs: ArrayVal): ArrayVal {
  const lMembers = lhs.members;
  const rMembers = rhs.members;
  for (const idx in lMembers) {
    switch (lMembers[idx].type) { 
      case "number":
        switch (rMembers[idx].type) {
          case "number":
            (lMembers[idx] as NumberVal).value -= (rMembers[idx] as NumberVal).value;
            break;
          case "bool":
          case "string":
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
          case "null":
            break;
          case "array":
            lMembers[idx] = eval_number_assignment(
              rMembers[idx] as ArrayVal,
              lMembers[idx] as NumberVal,
              "-=");
            break;
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "bool":
        switch (rMembers[idx].type) {
          case "number":
          case "bool":
          case "string":
          case "null":
          case "dictionary":
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
          case "array":
            lMembers[idx] = eval_bool_assignment(
              rMembers[idx] as ArrayVal,
              lMembers[idx] as BooleanVal,
              "-=");
            break;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "string":
        switch (rMembers[idx].type) {
          case "number":
          case "bool":
          case "string":
          case "dictionary":
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
          case "null":
            break;
          case "array":
            lMembers[idx] = eval_string_assignment(
              rMembers[idx] as ArrayVal,
              lMembers[idx] as StringVal,
              "-=");
            break;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "null":
        switch (rMembers[idx].type) {
          case "number":
            lMembers[idx] = {type : "number", value: -1 * (rMembers[idx] as NumberVal).value} as NumberVal;
            break;
          case "bool":
          case "string":
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
          case "null":
            break;
          case "array":
            lMembers[idx] = eval_null_assignment(
              rMembers[idx] as ArrayVal,
              lMembers[idx] as NullVal,
              "-=");
            break;
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "array":
        switch (rMembers[idx].type) {
          case "number":
            lMembers[idx] = eval_number_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as NumberVal,
              "-=", false);
            break;
          case "bool":
            lMembers[idx] = eval_bool_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as BooleanVal,
              "-=", false);
            break;
          case "string":
            lMembers[idx] = eval_string_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as StringVal,
              "-=", false);
            break;
          case "null":
            lMembers[idx] = eval_null_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as NullVal,
              "-=", false);
            break;
          case "array":
            lMembers[idx] = eval_array_subtraction_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as ArrayVal);
            break;
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "dictionary":
        switch (rMembers[idx].type) {
          case "bool":
          case "string":
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
          case "number":
          case "null":
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          case "array":
            // TODO: recursive function for dict +- array
            throw `Handling for dictionary -= array not yet implemented`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      default:
        throw `Unsupported LHS array member type: ${lMembers[idx].type}`;
    }
  }
  return lhs;
}

/**
 * Evaluates array += array expressions.
 * @param lhs 
 * @param rhs 
 * @returns
 */
function eval_array_addition_assignment(lhs: ArrayVal, rhs: ArrayVal): ArrayVal {
  const lMembers = lhs.members;
  const rMembers = rhs.members;
  for (const idx in lMembers) {
    switch (lMembers[idx].type) { 
      case "number":
        switch (rMembers[idx].type) {
          case "number":
            (lMembers[idx] as NumberVal).value += (rMembers[idx] as NumberVal).value;
            break;
          case "bool":
            throw `Illegal operation: ${lMembers[idx].type} += ${rMembers[idx].type}`;
          case "string":
            lMembers[idx] = {
              type: "string",
              value: (lMembers[idx] as NumberVal).value.toString() + (rMembers[idx] as StringVal).value
            } as StringVal;
            break;
          case "null":
            break;
          case "array":
            lMembers[idx] = eval_number_assignment(
              rMembers[idx] as ArrayVal,
              lMembers[idx] as NumberVal,
              "+=");
            break;
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "bool":
        switch (rMembers[idx].type) {
          case "number":
          case "dictionary":
            throw `Illegal operation: ${lMembers[idx].type} += ${rMembers[idx].type}`;
          case "bool":
            throw `Illegal operation, ADDITION with incompatible data types: ${lMembers[idx].type} + ${rMembers[idx].type}`;
          case "string":
            lMembers[idx] = {
              type: "string",
              value: ((lMembers[idx] as BooleanVal).value ? "1" : "0") + (rMembers[idx] as StringVal).value
            } as StringVal;
            break;
          case "null":
            break;
          case "array":
            lMembers[idx] = eval_bool_assignment(
              rMembers[idx] as ArrayVal,
              lMembers[idx] as BooleanVal,
              "+=");
            break;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "string":
        switch (rMembers[idx].type) {
          case "number":
            (lMembers[idx] as StringVal).value += (rMembers[idx] as NumberVal).value.toString();
            break;
          case "bool":
            (lMembers[idx] as StringVal).value += (rMembers[idx] as BooleanVal).value ? "1" : "0";
            break;
          case "string":
            (lMembers[idx] as StringVal).value += (rMembers[idx] as StringVal).value;
            break;
          case "null":
            break;
          case "array":
            lMembers[idx] = eval_string_assignment(
              rMembers[idx] as ArrayVal,
              lMembers[idx] as StringVal,
              "+=");
            break;
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "null":
        switch (rMembers[idx].type) {
          case "number":
          case "bool":
          case "string":
            lMembers[idx] = rMembers[idx];
            break;
          case "null":
            break;
          case "array":
            lMembers[idx] = eval_null_assignment(
              rMembers[idx] as ArrayVal,
              lMembers[idx] as NullVal,
              "+=");
            break;
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "array":
        switch (rMembers[idx].type) {
          case "number":
            lMembers[idx] = eval_number_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as NumberVal,
              "+=", false);
            break;
          case "bool":
            lMembers[idx] = eval_bool_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as BooleanVal,
              "+=", false);
            break;
          case "string":
            console.log("called")
            lMembers[idx] = eval_string_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as StringVal,
              "+=", false);
            break;
          case "null":
            lMembers[idx] = eval_null_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as NullVal,
              "+=", false);
            break;
          case "array":
            lMembers[idx] = eval_array_addition_assignment(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as ArrayVal);
            break;
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      case "dictionary":
        switch (rMembers[idx].type) {
          case "bool":
          case "string":
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
          case "number":
          case "null":
          case "dictionary":
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          case "array":
            // TODO: recursive function for dict +- array
            throw `Handling for dictionary += array not yet implemented`;
          default:
            throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
        }
        break;
      default:
        throw `Unsupported LHS array member type: ${lMembers[idx].type}`;
    }
  }
  return lhs;
}
