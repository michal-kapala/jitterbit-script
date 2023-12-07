export type ValueType = "null" | "number" | "bool" | "object" | "string" | "call";

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

/**
 * Runtime value that has access to the raw native javascript object property map.
 */
export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}

/**
 * Runtime value of a function call, which can result in different runtime values.
 */
export interface CallVal extends RuntimeVal {
  type: "call";
  // calls dont return other calls (only simple type or object type literals)
  // 'ObjectVal' to be changed to array type
  result: NullVal | BooleanVal | NumberVal | ObjectVal | StringVal;
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
