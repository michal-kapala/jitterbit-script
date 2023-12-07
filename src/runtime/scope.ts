import { systemVars } from "../api/sysvars";
import { GlobalIdentifier } from "../frontend/ast";
import { 
  BooleanVal,
  MK_BOOL,
  MK_NULL,
  MK_NUMBER,
  MK_STRING,
  NumberVal,
  RuntimeVal,
  StringVal
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
            // TODO: Array
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

  public declareVar(varName: string, value: RuntimeVal): RuntimeVal {
    this.variables.set(varName, value);
    return value;
  }

  public assignVar(varName: string, value: RuntimeVal, operator = "="): RuntimeVal {
    let oldValue = varName[0] === "$"
      ? this.getGlobal().variables.get(varName)
      : this.variables.get(varName);

    switch (operator) {
      case "=":
        return this.setVar(varName, value);
      case "-=":
        // declaration
        if(oldValue === undefined) {
          // global vars are zero-initialized on the fly
          if(varName[0] === "$") {
            switch(value.type) {
              // unsupported
              case "bool":
                throw `Illegal operation, SUBTRACT with incompatible data types: unknown - bool`
              // zero-initialized
              case "number":
                let newValue = value as NumberVal;
                newValue.value = 0 - newValue.value;
                this.getGlobal().variables.set(varName, newValue);
                return newValue;
              // unsupported
              case "string":
                throw `Illegal operation, SUBTRACT with incompatible data types: unknown - string`
              case "object":
                throw `Illegal operation, SUBTRACT with incompatible data types: unknown - object`
              case "call":
                throw `Illegal operation, SUBTRACT with incompatible data types: unknown - call`
              // null-initialized
              case "null":
                this.getGlobal().variables.set(varName, value);
                return value;
            }
          }
          else
            throw `Local variable '${varName}' hasn't been initialized`
        }
        else {
          if(oldValue.type === value.type && value.type === "number") {
            let newValue = value as NumberVal;
            newValue.value = (oldValue as NumberVal).value - (value as NumberVal).value;
            return this.setVar(varName, newValue);
          }
          // supported null interactions, no effect/assigns the other type
          else if (oldValue.type in ["number", "string", "null"] && value.type === "null") {
            return oldValue;
          } else if (oldValue.type === "null" && value.type in ["number", "string", "null"]) {
            return this.setVar(varName, value);
          }
          else
            // currently returns interpreter types rather than strict JB types (e.g. 'number' instead of int/double)
            // string -= string
            // bool -= bool
            // null -= bool
            // bool -= null
            // string -= number
            // number -= string
            // string -= bool
            // bool -= string
            // number -= bool
            // bool -= number
            throw `Illegal operation, SUBTRACT with incompatible data types: ${oldValue.type} - ${value.type}`
        }
      case "+=":
         // declaration
        if(oldValue === undefined) {
          // global vars are zero-initialized on the fly
          if(varName[0] === "$") {
            switch(value.type) {
              // new value assigned
              case "bool":
                this.getGlobal().variables.set(varName, value);
                return value;
              // zero-initialized
              case "number":
                let newValue = value as NumberVal;
                newValue.value = 0 + newValue.value;
                this.getGlobal().variables.set(varName, newValue);
                return newValue;
              // new value assigned
              case "string":
                this.getGlobal().variables.set(varName, value);
                return value;
              case "object":
                // TODO: list handling
                throw `Illegal operation, ADDITION with incompatible data types: unknown - object`
              case "call":
                throw `Illegal operation, ADDITION with incompatible data types: unknown - call`
              // null-initialized
              case "null":
                this.getGlobal().variables.set(varName, value);
                return value;
            }
          }
          else
            throw `Local variable '${varName}' hasn't been initialized`
        }
        else {
          // numbers
          if(oldValue.type === value.type && value.type === "number") {
            let newValue = value as NumberVal;
            newValue.value = (oldValue as NumberVal).value + (value as NumberVal).value;
            return this.setVar(varName, newValue);
          }
          // string concat
          else if (oldValue.type === value.type && value.type === "string") {
            let newValue = value as StringVal;
            newValue.value = (oldValue as StringVal).value + (value as StringVal).value;
            return this.setVar(varName, newValue);
          }
          // string += bool - implicit type conversion to string
          else if (oldValue.type === "string" && value.type === "bool") {
            let stringVal = (oldValue as StringVal).value;
            let boolValue = (value as BooleanVal).value;
            let newValue = {
              type: "string",
              value: stringVal + (boolValue ? "1" : "0")
            } as StringVal;
            return this.setVar(varName, newValue);
          } // bool += string - implicit type conversion to string
          else if (oldValue.type === "bool" && value.type === "string") {
            let boolValue = (oldValue as BooleanVal).value;
            let stringVal = (value as StringVal).value;
            let newValue = {
              type: "string",
              value: (boolValue ? "1" : "0") + stringVal
            } as StringVal;
            return this.setVar(varName, newValue);
          }
          // string += number - implicit type conversion to string
          else if (oldValue.type === "string" && value.type === "number") {
            let stringVal = (oldValue as StringVal).value;
            let numberValue = (value as NumberVal).value;
            let newValue = {
              type: "string",
              value: stringVal + numberValue.toString()
            } as StringVal;
            return this.setVar(varName, newValue);
          }
          // number += string - implicit type conversion to string
          else if (oldValue.type === "number" && value.type === "string") {
            let numberValue = (oldValue as NumberVal).value;
            let stringVal = (value as StringVal).value;
            let newValue = {
              type: "string",
              value: numberValue.toString() + stringVal
            } as StringVal;
            return this.setVar(varName, newValue);
          }
          // null interactions - no effect/assigns the other type, no type conversion assumed
          // string += null
          // null += string
          // bool += null
          // null += bool
          // number += null
          // null += number
          else if (
            oldValue.type === "string" && value.type === "null" ||
            oldValue.type === "null" && value.type === "string" ||
            oldValue.type === "bool" && value.type === "null" ||
            oldValue.type === "null" && value.type === "bool" ||
            oldValue.type === "number" && value.type === "null" ||
            oldValue.type === "null" && value.type === "number"
          ) {
            let newValue = (oldValue.type !== "null" ? oldValue : value);
            return this.setVar(varName, newValue);
          }
          // number += bool, bool += number - unsupported
          else if (
            oldValue.type === "number" && value.type === "bool" ||
            oldValue.type === "bool" && value.type === "number"
          ) {
            throw `Illegal operation: ${oldValue.type} += ${value.type}`
          }
          else
            // currently returns interpreter types rather than strict JB types (e.g. 'number' instead of int/double)
            // call types should not be here, it should be their return value
            // bool += bool
            // TODO: object type handling
            throw `Illegal operation, ADDITION with incompatible data types: ${oldValue.type} + ${value.type}`
        }
      default:
        throw `Unknown assignment operator ${operator}`;
      }
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
