/**
 * Runtime value type.
 */
export type ValueType = 
  "null" |
  "number" |
  "bool" |
  "string" |
  "array" |
  "dictionary" |
  // function call-only types
  "void" |
  "type" |
  "node";

/**
 * Any runtime value.
 */
export interface RuntimeVal {
  type: ValueType;

  /**
   * Creates a deep copy of the runtime value.
   */
  clone(): RuntimeVal;

  /**
   * Applies `--` unary operator to the runtime value.
   * @param value 
   * @returns 
   */
  decrement(): RuntimeVal;

  /**
   * Applies `++` unary operator to the runtime value.
   * @param value 
   * @returns 
   */
  increment(): RuntimeVal;

  /**
   * Applies `!` unary operator to the runtime value.
   * @param value 
   * @returns 
   */
  negate(): RuntimeVal;

  /**
   * Applies `-` unary operator to the runtime value.
   * @param value 
   * @returns 
   */
  negative(): RuntimeVal;

  /**
   * Returns the boolean representation of the runtime value.
   */
  toBool(): boolean

  /**
   * Returns the numeric representation of the runtime value.
   */
  toNumber(): number;

  /**
   * Returns the string representation of the runtime value.
   */
  toString(): string;
}

/**
 * Null runtime value.
 */
export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

/**
 * Runtime value that has access to native javascript boolean.
 */
export interface BooleanVal extends RuntimeVal {
  type: "bool";
  value: boolean;
}

/**
 * Runtime value that has access to native javascript number.
 */
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

/**
 * Runtime value that has access to native javascript string.
 */
export interface StringVal extends RuntimeVal {
  type: "string";
  value: string;
}

/**
 * Runtime value of an array literal or an array function call.
 */
export interface ArrayVal extends RuntimeVal {
  type: "array";
  members: RuntimeVal[];
}

/**
 * Runtime value of a dictionary object.
 */
export interface DictVal extends RuntimeVal {
  type: "dictionary";
  members: Map<string, RuntimeVal>;
}

/**
 * Only returned by void function calls.
 * 
 * Void function calls are in fact assignable and return null values.
 */
export interface VoidVal extends RuntimeVal {
  type: "void";
  value: NullVal;
}
