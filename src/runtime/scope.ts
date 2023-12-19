import { Api } from "../api";
import { GlobalIdentifier } from "../frontend/ast";
import { evalAssignment } from "./eval/expressions/assignment";
import { 
  Array,
  JbBool,
  JbNull,
  JbNumber,
  JbString
} from "./types";
import { RuntimeVal } from "./values";

export function createGlobalScope() {
  const scope = new Scope();
  return scope;
}

export default class Scope {
  private parent?: Scope;
  private variables: Map<string, RuntimeVal>;

  constructor(parentScope?: Scope) {
    const global = parentScope ? false : true;
    this.parent = parentScope;
    this.variables = new Map();
    if(global) {
      // Initialize static system variables
      Api.sysVars.static.forEach((value) => {
        // parse default value
        if(value.default !== undefined) {
          let def = {} as RuntimeVal;
          switch(value.dataType) {
            case "Boolean":
              def = new JbBool(value.default === "true");
              break;
            case "Integer":
              def = new JbNumber(parseInt(value.default));
              break;
            case "String":
              def = new JbString(value.default);
              break;
            case "Array":
              def = new Array();
              break;
            default:
              // This can happen only if you modify system vars types
              console.error(`ScopeError: Unsupported system variable type for ${value.name}:`, value.dataType);
              def = new JbNull();
              break;
          }
          this.variables.set(value.name, def);
        }
        // initialize with null value
        else
          this.variables.set(value.name, new JbNull());
      });
    }
  }

  public assignVar(varName: string, value: RuntimeVal, operator = "="): RuntimeVal {
    let isGlobal = varName[0] === "$";
    let oldValue = isGlobal
      ? this.getGlobal().variables.get(varName)
      : this.variables.get(varName);

    // declaration checks
    if(["-=", "+="].includes(operator) && oldValue === undefined) {
      // local variable
      if(!isGlobal) 
        throw `Local variable '${varName}' hasn't been initialized`;

      // global variable
      switch(operator) {
        case "-=":
          switch(value.type) {
            case "bool":
              throw `Illegal operation, SUBTRACT with incompatible data types: unknown - bool`
            // zero-initialized
            case "number":
              let newValue = value as JbNumber;
              newValue.value = 0 - newValue.value;
              this.getGlobal().variables.set(varName, newValue);
              return newValue;
            case "string":
              throw `Illegal operation, SUBTRACT with incompatible data types: unknown - ${value.type}`;
            case "array":
              // eval as null-initialized
              oldValue = new JbNull();
              break;
            case "null":
              this.getGlobal().variables.set(varName, value);
              return value;
            case "dictionary":
              // TODO
            default:
              throw `Unsupported type: ${value.type}`;
          }
        case "+=":
          switch(value.type) {
            // zero-initialized
            case "number":
              let newValue = value as JbNumber;
              newValue.value = 0 + newValue.value;
              this.getGlobal().variables.set(varName, newValue);
              return newValue;
            // new value assigned
            case "bool":
            case "string":
            case "array":
            case "null":
              // new value assigned
              this.getGlobal().variables.set(varName, value);
              return value;
            case "dictionary":
              // TODO
            default:
              throw `Unsupported type: ${value.type}`;
          }
        default:
          throw `Unknown assignment operator ${operator}`;
      }
    }

    let newValue = evalAssignment(oldValue ?? new JbNull(), value, operator);
    return this.setVar(varName, newValue);
  }

  /**
   * Determines the scope and assign the value to the variable.
   * @param varName 
   * @param value 
   * @returns 
   */
  private setVar(varName: string, value: RuntimeVal): RuntimeVal {
    // global var assignment
    if(varName[0] === "$")
      this.getGlobal().variables.set(varName, value);
    // local variable assignment (initial assignments are declarations)
    else
      this.variables.set(varName, value);
    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const scope = this.resolve(varname);
    return scope.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Scope {
    if (this.variables.has(varname)) {
      return this;
    }

    // global scope reached
    if (this.parent === undefined) {
      // proper scope for global/system variables
      if(varname[0] === "$")
        return this;
      else
        throw `Local variable '${varname}' hasn't been initialized`;
    }

    return this.parent.resolve(varname);
  }

  /**
   * Returns the global scope.
   * @returns Top-level `Scope` of a program.
   */
  public getGlobal(): Scope {
    if(this.parent === undefined)
      return this;
    return this.parent.getGlobal();
  }

  /**
   * Null-initializes a global or extendable system variable.
   * 
   * Static system variables are initalized before interpretation.
   * @param global A global/system variable AST node
   */
  public initGlobalVar(global: GlobalIdentifier): void {
    if(this.parent === undefined) {
      const value = this.lookupVar(global.symbol);
      if(value === undefined)
        this.variables.set(global.symbol, new JbNull());
    }
    else
      // This is a development-only warning, users cant cause it
      console.warn("ScopeWarning: Attempt to null-initialize a global variable from a child scope.");
  }
}
