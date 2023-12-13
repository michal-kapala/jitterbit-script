export type ValueType = "null" | "number" | "bool" | "string" | "call" | "array" | "dictionary";

export interface RuntimeVal {
  type: ValueType;
}

/**
 * Defines a value of undefined meaning.
 */
export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

export function MK_NULL() {
  return { type: "null", value: null } as NullVal;
}

/**
 * Runtime value that has access to native javascript boolean.
 */
export interface BooleanVal extends RuntimeVal {
  type: "bool";
  value: boolean;
}

export function MK_BOOL(b = true) {
  return { type: "bool", value: b } as BooleanVal;
}

/**
 * Runtime value that has access to native javascript number.
 */
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export function MK_NUMBER(n = 0) {
  return { type: "number", value: n } as NumberVal;
}

/**
 * Runtime value that has access to native javascript string.
 */
export interface StringVal extends RuntimeVal {
  type: "string";
  value: string;
}

export function MK_STRING(s = "") {
  return { type: "string", value: s } as StringVal;
}

export function MK_ARRAY(m: RuntimeVal[] = []) {
  return { type: "array", members: m } as ArrayVal;
}

/**
 * Runtime value of a function call, which can result in different runtime values.
 */
export interface CallVal extends RuntimeVal {
  type: "call";
  // calls dont return other calls (only simple type or object type literals)
  // DictVal to be added
  result: NullVal | BooleanVal | NumberVal | StringVal | ArrayVal;
}

/**
 * Runtime value of an array literal or an array function call.
 */
export interface ArrayVal extends RuntimeVal {
  type: "array",
  // evaluated elements
  members: RuntimeVal[]
}

/**
 * Performs Jitterbit's string2number conversion (float-based).
 * 
 * If there's a number at the beginning of the string, Jitterbit truncates the string and tries to parse the longest possible number literal.
 * When successful, the value is returned, otherwise returns 0.
 * @param strVal 
 * @returns 
 */
export function jbStringToNumber(strVal: StringVal): number {
  // regular strings evaluate to 0, e.g. 0 == "abcd1234"
  // strings beginning with a parsable number are truncated and parsed
  // for example the below expressions return true:
  // 1234 == "1234abcd5"
  // -0.8 == "-.8abc.-.5"
  const pattern = /^(-{0,1}[0-9]|\.)+/g;
  const matches = strVal.value.match(pattern);
  
  // regular strings evaluate to 0, e.g. 0 == "abcd1234" is true
  if(matches === null) {
    return 0;
  }

  // always parsable
  return parseFloat(matches[0]);
}

/**
 * Performs Jitterbit's string2bool conversion.
 * @param strVal 
 * @returns 
 */
export function jbStringToBool(strVal: StringVal): boolean {
  let parseResult = parseFloat(strVal.value);
  return (!Number.isNaN(parseResult) && parseResult !== 0) || strVal.value === "true";
}

/**
 * Performs Jitterbit's string2bool and bool2int conversions to evaluate <, >, <= and >= cross-type binary expressions.
 * 
 * `strVal` is always LHS.
 * 
 * In lt/gt comparisons, Jitterbit evaluates "true" string to `false`, as well as negative numbers and fractions.
 * @param strVal 
 * @param boolVal
 * @returns 
 */
export function jbCompareStringToBool(strVal: StringVal, operator: string, boolVal: BooleanVal): boolean {
  let parseResult = parseFloat(strVal.value);
  let strBoolVal = !Number.isNaN(parseResult) && parseResult >= 1;
  let strIntVal = strBoolVal ? 1 : 0;
  let boolIntVal = boolVal.value ? 1: 0;

  switch(operator) {
    case "<":
      return strIntVal < boolIntVal;
    case ">":
      return strIntVal > boolIntVal;
    case "<=":
      return strIntVal <= boolIntVal;
    case ">=":
      return strIntVal >= boolIntVal;
    default:
      throw `[jbCompareStringToBool] Unsupported operator ${operator}`;
  } 
}

/**
 * Creates a deep copy of any value.
 * @param value 
 * @returns 
 */
export function clone(value: RuntimeVal): RuntimeVal {
  let copy: RuntimeVal;
  switch (value.type) {
    case "number":
      copy = MK_NUMBER((value as NumberVal).value);
      break;
    case "bool":
      copy = MK_BOOL((value as BooleanVal).value);
      break;
    case "string":
      copy = MK_STRING((value as StringVal).value);
      break;
    case "null":
      copy = MK_NULL();
      break;
    case "array":
      copy = MK_ARRAY();
      for(const mem of (value as ArrayVal).members)
        (copy as ArrayVal).members.push(clone(mem));
      break;
    case "dictionary":
      // TODO
    default:
      throw `Cannot clone unsupported type: ${value.type}`;
  }
  return copy;
}

/**
 * Applies `--` unary operator to any value type.
 * @param value 
 * @returns 
 */
export function decrement(value: RuntimeVal) {
  switch(value.type){
    case "number":
      value = decrementNumber(value as NumberVal);
      break;
    case "bool":
      value = decrementBool(value as BooleanVal);
      break;
    case "string":
      value = decrementString(value as StringVal);
      break;
    case "null":
      // TODO: error message to be changed
      throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: --`;
    case "array":
      value = decrementArray(value as ArrayVal);
      break;
    case "dictionary":
      // TODO
    default:
      throw `Unsupported type: ${value.type}`;
  }
  return value;
}

/**
 * Applies `++` unary operator to any value type.
 * @param value 
 * @returns 
 */
export function increment(value: RuntimeVal) {
  switch(value.type){
    case "number":
      value = incrementNumber(value as NumberVal);
      break;
    case "bool":
      value = incrementBool(value as BooleanVal);
      break;
    case "string":
      value = incrementString(value as StringVal);
      break;
    case "null":
      // TODO: error message to be changed
      throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ++`;
    case "array":
      value = incrementArray(value as ArrayVal);
      break;
    case "dictionary":
      // TODO
    default:
      throw `Unsupported type: ${value.type}`;
  }
  return value;
}

/**
 * Applies `!` unary operator to any value type.
 * @param value 
 * @returns 
 */
export function negate(value: RuntimeVal) {
  switch (value.type) {
    case "number":
      return negateNumber(value as NumberVal);
    case "bool":
      return negateBool(value as BooleanVal);
    case "string":
      return negateString(value as StringVal);
    case "null":
      return negateNull(value as NullVal);
    case "array":
      return negateArray(value as ArrayVal);
    case "dictionary":
      // TODO
    default:
      throw `Unsupported type for ! unary operator: ${value.type}`;
  }
}

/**
 * Applies `-` unary operator to any value type.
 * @param value 
 * @returns 
 */
export function negative(value: RuntimeVal) {
  switch (value.type) {
    case "number":
      return negativeNumber(value as NumberVal)
    // all the below should probably return warnings
    case "bool":
      return negativeBool(value as BooleanVal);
    case "string":
      return negativeString(value as StringVal);
    case "null":
      throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: -`;
    case "array":
      return negativeArray(value as ArrayVal, "-");
    case "dictionary":
    default:
      throw `Unsupported type for - unary operator: ${value.type}`;
  }
}

/**
 * Applies unary operator `!` to all the array members.
 * @param array 
 * @returns 
 */
function negateArray(array: ArrayVal): RuntimeVal {
  const members = array.members;
  for(const idx in members) {
    switch(members[idx].type) {
      case "number":
        members[idx] = negateNumber(members[idx] as NumberVal);
        break;
      case "bool":
        members[idx] = negateBool(members[idx] as BooleanVal);
        break;
      case "string":
        members[idx] = negateString(members[idx] as StringVal);
        break;
      case "null":
        members[idx] = negateNull(members[idx] as NullVal);
        break;
      case "array":
        members[idx] = negateArray(members[idx] as ArrayVal);
        break;
      case "dictionary":
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }
  return array;
}

/**
 * Negates a number, returns false for non-zero values.
 * @param numVal 
 * @returns 
 */
function negateNumber(numVal: NumberVal): BooleanVal {
  return { type: "bool", value: numVal.value === 0 };
}

/**
 * Negates a boolean value.
 * @param boolVal 
 * @returns 
 */
function negateBool(boolVal: BooleanVal): BooleanVal {
  return { type: "bool", value: !boolVal.value };
}

/**
 * Applies `!` unary operator to a string value.
 * @param strVal 
 * @returns 
 */
function negateString(strVal: StringVal): BooleanVal {
  return { type: "bool", value: jbStringToNumber(strVal) === 0 };
}

/**
 * Negates a null value, always returns `true`.
 * @param nullVal 
 * @returns 
 */
function negateNull(nullVal: NullVal): BooleanVal {
  return { type: "bool", value: true };
}

/**
 * Changes the sign of the value.
 * @param numVal 
 * @returns 
 */
function negativeNumber(numVal: NumberVal) {
  numVal.value *= -1;
  return numVal;
}

/**
 * Unary `-` operator does not affect booleans, the value is returned unchanged.
 * @param boolVal 
 * @returns 
 */
function negativeBool(boolVal: BooleanVal) {
  // -true is true
  // -false is false
  return boolVal;
}

/**
 * Applies unary `-` operator to a string value.
 * @param strVal 
 * @returns 
 */
function negativeString(strVal: StringVal): StringVal {
  // returns a string
  // performs string->number->string conversion, the result is prefixed with "-"
  // examples:
  // -"abcd1234" results in "-0"
  // -"0" results in "-0"
  // -"1" results in "-1"
  // -"1.2" results in "-1.2"
  // -"-12310.4jbb35" results in "12310.4"
  // -"321.4" + 69 results in "-321.469"
  let prefix = "-";
  let nb = jbStringToNumber(strVal);
  if(strVal.value[0] === "-") {
    prefix = "";
    nb *= -1;
  }
  return { type: "string", value: prefix + nb.toString() };
}

/**
 * Applies unary `-` operator to all members.
 * @param arrVal 
 * @param operator 
 * @returns 
 */
function negativeArray(arrVal: ArrayVal, operator: string) {
  const members = arrVal.members;
  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = negativeNumber(members[idx] as NumberVal);
        break;
      case "bool":
        members[idx] = negativeBool(members[idx] as BooleanVal);
        break;
      case "string":
        members[idx] = negativeString(members[idx] as StringVal);
        break;
      case "null":
        // The original error shows the tokens of the faulty expr before null expr
        // for example, a = -Null(); results in:
        // at line <x>
        // a = -
        throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ${operator}`;
      case "array":
        members[idx] = negativeArray(members[idx] as ArrayVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }
  return arrVal;
}

/**
 * Decrements a number value.
 * @param numVal 
 * @returns 
 */
function decrementNumber(numVal: NumberVal) {
  --numVal.value;
  return numVal;
}

/**
 * Decrements (negates) a boolean value.
 * @param boolVal 
 * @returns 
 */
function decrementBool(boolVal: BooleanVal) {
  boolVal.value = !boolVal.value;
  return boolVal;
}

/**
 * Tries to parse a number off the string and decrement it, then converts it back to a string value.
 * @param strVal 
 * @returns 
 */
function decrementString(strVal: StringVal) {
  strVal.value = (jbStringToNumber(strVal) - 1).toString();
  return strVal;
}

/**
 * Decrements all members of the array.
 * @param array 
 * @returns 
 */
function decrementArray(array: ArrayVal): ArrayVal {
  const members = array.members;
  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = decrementNumber(members[idx] as NumberVal);
        break;
      case "bool":
        members[idx] = decrementBool(members[idx] as BooleanVal);
        break;
      case "string":
        members[idx] = decrementString(members[idx] as StringVal);
        break;
      case "null":
        // TODO: error message to be changed
        throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: --`;
      case "array":
        members[idx] = decrementArray(members[idx] as ArrayVal);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }
  return array;
}

/**
 * Increments a number value.
 * @param numVal 
 * @returns 
 */
function incrementNumber(numVal: NumberVal) {
  ++numVal.value;
  return numVal;
}

/**
 * Increments a boolean value, always returns `true`.
 * @param boolVal 
 * @returns 
 */
function incrementBool(boolVal: BooleanVal) {
  boolVal.value = true;
  return boolVal;
}

/**
 * Tries to parse a number off the string and increment it, then converts it back to a string value.
 * @param strVal 
 * @returns 
 */
function incrementString(strVal: StringVal) {
  strVal.value = (jbStringToNumber(strVal) + 1).toString();
  return strVal;
}

/**
 * Increments all members of the array.
 * @param array 
 * @returns 
 */
function incrementArray(array: ArrayVal): ArrayVal {
  const members = array.members;
  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = incrementNumber(members[idx] as NumberVal);
        break;
      case "bool":
        members[idx] = incrementBool(members[idx] as BooleanVal);
        break;
      case "string":
        members[idx] = incrementString(members[idx] as StringVal);
        break;
      case "null":
        // TODO: error message to be changed
        throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ++`;
      case "array":
        members[idx] = incrementArray(members[idx] as ArrayVal);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }
  return array;
}
