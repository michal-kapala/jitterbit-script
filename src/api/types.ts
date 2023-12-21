import { RuntimeVal, ValueType } from "../runtime/values";

/**
 * Jitterbit function definition.
 */
export abstract class Func {
  name!: string;
  module!: FuncModule;
  protected signatures!: Signature[];
  signature!: Signature;
  minArgs!: number;
  maxArgs!: number;

  /**
   * Validates argument list and executes the function's implementation.
   * @returns
   */
  abstract call(args: RuntimeVal[]): RuntimeVal;

  /**
   * Selects the target signature based on the passed argument list.
   * 
   * Should always be called from `call`.
   */
  protected abstract chooseSignature(args: RuntimeVal[]): void;
}

/**
 * Jitterbit module of a function.
 */
export type FuncModule = 
  "cache" |
  "conversion" |
  "crypto" |
  "database" |
  "datetime" |
  "debug" |
  "dict/array" |
  "diff" |
  "email" |
  "env info" |
  "file" |
  "general" |
  "instance" |
  "ldap" |
  "log/error" |
  "logical" |
  "math" |
  "netsuite" |
  "salesforce" |
  "string" |
  "text" |
  "xml";

/**
 * Function parameter definition.
 */
export class Parameter {
  name: string;
  type: ValueType;
  required: boolean;
  defaultVal?: RuntimeVal;

  constructor(type: ValueType, name: string, required = true, defaultVal?: RuntimeVal) {
    this.name = name;
    this.type = type;
    this.required = required;
    this.defaultVal = defaultVal;
  }
}

/**
 * A single overload of a function. Allows for return type and parameter list variance in polymorphic functions.
 */
export class Signature {
  returnType: ValueType;
  params: Parameter[];

  constructor(returnType: ValueType, params: Parameter[]) {
    this.returnType = returnType;
    this.params = params;
  }
}

/**
 * Available Jitterbit/system variable modules.
 */
type SysVarModule = "api" 
| "networking" 
| "netsuite"
| "operation"
| "scripting"
| "sfdc"
| "source"
| "target"
| "text"
| "transformation"
| "web_service_call"
| "misc";

/**
 * Jitterbit/system variable information.
 */
export interface SystemVariable {
  /**
   * Variable name.
   */
  name: string;
  module: SysVarModule;
  /**
   * Variable's intended usage:
   * 
   * - `Informational` - readable
   * 
   * - `Settings` - writable
   */
  type: "Informational" | "Settings";
  /**
   * Variable's expected data type.
   */
  dataType: "String" | "Integer" | "Boolean" | "Array";
  /**
   * Optional default value.
   */
  default?: string;
  /**
   * Variable description.
   */
  description: string;
}
