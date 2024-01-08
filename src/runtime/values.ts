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
  "binary" |
  "date" |
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

  /**
   * Applies a binary operator to this value with the RHS value being a number.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopNumber(operator: string, rhs: NumberVal): RuntimeVal;

  /**
   * Applies a binary operator to this value with the RHS value being a boolean.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopBool(operator: string, rhs: BooleanVal): RuntimeVal;

  /**
   * Applies a binary operator to this value with the RHS value being a string.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopString(operator: string, rhs: StringVal): RuntimeVal;

  /**
   * Applies a binary operator to this value with the RHS value being a null.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopNull(operator: string, rhs: NullVal): RuntimeVal;

  /**
   * Applies a binary operator to this value with the RHS value being an array.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopArray(operator: string, rhs: ArrayVal): RuntimeVal;

  /**
   * Applies a binary operator to this value with the RHS value being a dictionary.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDict(operator: string, rhs: DictVal): RuntimeVal;

  /**
   * Applies a binary operator to this value with the RHS value being binary data.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopBin(operator: string, rhs: BinaryVal): RuntimeVal;

  /**
   * Applies a binary operator to this value with the RHS value being a date.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDate(operator: string, rhs: DateVal): RuntimeVal;
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

/**
 * Runtime value of binary data.
 */
export interface BinaryVal extends RuntimeVal {
  type: "binary";
  value: Uint8Array;
}

/**
 * Runtime value of a date object.
 */
export interface DateVal extends RuntimeVal {
  type: "date";
  value: Date;
}
