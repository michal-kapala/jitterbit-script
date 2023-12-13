import { systemVars } from "../api/sysvars";
import { GlobalIdentifier } from "../frontend/ast";
import { evalAssignment } from "./eval/expressions/assignment";
import { 
  MK_ARRAY,
  MK_BOOL,
  MK_NULL,
  MK_NUMBER,
  MK_STRING,
  NumberVal,
  RuntimeVal,
} from "./values";

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
      systemVars.static.forEach((value) => {
        // parse default value
        if(value.default !== undefined) {
          let def = {} as RuntimeVal;
          switch(value.dataType) {
            case "Boolean":
              def = MK_BOOL(value.default === "true" ? true : false);
              break;
            case "Integer":
              def = MK_NUMBER(parseInt(value.default));
              break;
            case "String":
              def = MK_STRING(value.default);
              break;
            case "Array":
              def = MK_ARRAY();
              break;
            default:
              // This can happen only if you modify system vars types
              console.error(`ScopeError: Unsupported system variable type for ${value.name}:`, value.dataType);
              def = MK_NULL();
              break;
          }
          this.variables.set(value.name, def);
        }
        // initialize with null value
        else
          this.variables.set(value.name, MK_NULL());
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
              let newValue = value as NumberVal;
              newValue.value = 0 - newValue.value;
              this.getGlobal().variables.set(varName, newValue);
              return newValue;
            case "string":
              throw `Illegal operation, SUBTRACT with incompatible data types: unknown - ${value.type}`;
            case "array":
              // eval as null-initialized
              oldValue = MK_NULL();
              break;
            case "null":
              this.getGlobal().variables.set(varName, value);
              return value;
            // TODO
            case "dictionary":
            default:
              throw `Unsupported type: ${value.type}`;
          }
        case "+=":
          switch(value.type) {
            // zero-initialized
            case "number":
              let newValue = value as NumberVal;
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
            // TODO
            case "dictionary":
            default:
              throw `Unsupported type: ${value.type}`;
          }
        default:
          throw `Unknown assignment operator ${operator}`;
      }
    }

    let newValue = evalAssignment(oldValue ?? MK_NULL(), value, operator);
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
        // Add JB error
        // Local variable <varname> hasn't been initialized
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
        this.variables.set(global.symbol, MK_NULL());
    }
    else
      // This is a development-only warning, users cant cause it
      console.warn("ScopeWarning: Attempt to null-initialize a global variable from a child scope.");
  }
}
