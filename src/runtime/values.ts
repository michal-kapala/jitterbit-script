export type ValueType = "null" | "number" | "boolean" | "object" | "string" | "call";

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
 * Runtime value that has access to the raw native javascript boolean.
 */
export interface BooleanVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}

export function MK_BOOL(b = true) {
  return { type: "boolean", value: b } as BooleanVal;
}

/**
 * Runtime value that has access to the raw native javascript number.
 */
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export function MK_NUMBER(n = 0) {
  return { type: "number", value: n } as NumberVal;
}

/**
 * Runtime value that has access to the raw native javascript object property map.
 */
export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}

export interface StringVal extends RuntimeVal {
  type: "string";
  value: string;
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
