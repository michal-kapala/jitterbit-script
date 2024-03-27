import { Expr } from "../frontend/ast";
import Scope from "../runtime/scope";
import { RuntimeVal, ValueType } from "../runtime/values";
import { TypeInfo, TypedExpr } from "../typechecker/ast";
import TypeEnv from "../typechecker/environment";

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
  docs!: string;

  /**
   * Validates argument list and executes the function's implementation.
   * @returns
   */
  abstract call(args: RuntimeVal[], scope: Scope): RuntimeVal;

  /**
   * Selects the target signature at runtime based on the passed argument list.
   * 
   * Should always be called from `call`.
   */
  protected abstract chooseSignature(args: RuntimeVal[]): void;

  /**
   * Validates the argument list and deducts the return type at static analysis time.
   * @param args 
   * @param env 
   */
  abstract analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo;

  /**
   * The function's signature string.
   * @returns 
   */
  toString() {
    if(this.signature) {
      let signature = `${this.name}(`;
      let optionals = false;
      const params = this.signature.params;
      for(let idx = 0; idx < this.signature.params.length; idx++) {
        if(!optionals && !params[idx].required) {
          optionals = true;
          signature += "[";
        }
        signature += `${params[idx].type} ${params[idx].name}, `;
      }
      signature = signature.substring(0, signature.length - 2);
      signature += optionals ? "])" : ")";
      signature += `: ${this.signature.returnType}`;
      return signature;
    }
    else return `${this.name} (polymorphic)`;
  }
}

/**
 * Jitterbit function with deferred argument evaluation.
 */
export abstract class DeferrableFunc extends Func {
  /**
   * Evaluates the arguments in a controlled manner and executes the function implementation.
   * @param args 
   * @param scope 
   */
  abstract callEval(args: Expr[], scope: Scope): Promise<RuntimeVal>;
}

/**
 * Jitterbit function executing an async operation.
 */
export abstract class AsyncFunc extends Func {
  /**
   * Executes the implementation of an async function.
   * @param args 
   * @param scope 
   */
  abstract callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal>;
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
  "envinfo" |
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
   * - `info` - readable
   * 
   * - `setting` - writable
   */
  type: "info" | "setting";
  /**
   * Variable's expected data type.
   */
  dataType: "String" | "Integer" | "Boolean" | "Array";
  /**
   * Optional default value.
   */
  default?: string;
  /**
   * Variable description (markdown format).
   */
  description: string;
}
