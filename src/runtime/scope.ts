import { Api } from "../api";
import { GlobalIdentifier } from "../frontend/ast";
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
              throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
            // TODO: binary
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
              throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
            // TODO: binary
            default:
              throw `Unsupported type: ${value.type}`;
          }
        default:
          throw `Unknown assignment operator ${operator}`;
      }
    }

    let newValue = Scope.assign(oldValue ?? new JbNull(), value, operator);
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

  static assign(lhs: RuntimeVal, rhs: RuntimeVal, operator: string): RuntimeVal {
    switch (operator) {
      case "=":
        return rhs;
      case "-=":
        // number -= number
        if(lhs.type === rhs.type && lhs.type === "number") {
          let newValue = rhs as JbNumber;
          newValue.value = (lhs as JbNumber).value - (rhs as JbNumber).value;
          return newValue;
        }
        // simple type null interactions
        // string -= null
        // null -= string
        // bool -= null
        // null -= bool
        // number -= null
        // null -= number
        else if (
          lhs.type === "string" && rhs.type === "null" ||
          lhs.type === "null" && rhs.type === "string" ||
          lhs.type === "bool" && rhs.type === "null" ||
          lhs.type === "null" && rhs.type === "bool" ||
          lhs.type === "number" && rhs.type === "null" ||
          lhs.type === "null" && rhs.type === "number"
        ) {
          if(lhs.type === "null") {
            switch (rhs.type) {
              case "number":
                let newValue = {
                  ...rhs,
                  value: (rhs as JbNumber).value * -1
                } as JbNumber;
                return newValue;
              case "bool":
              case "string":
                throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs.type} - ${rhs.type}`
            }
          } 
          else {
            switch (lhs.type) {
              case "number":
              case "string":
                return lhs;
              case "bool":
                throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs.type} - ${rhs.type}`
            }
          }
        }
  
        // arrays
  
        // array -= array
        else if (lhs.type === rhs.type && lhs.type === "array") {
          lhs = (lhs as Array).assignArray(rhs as Array, operator);
          return lhs;
        }
  
        // null -= array
        // array -= null
        else if (
          lhs.type === "null" && rhs.type === "array" ||
          lhs.type === "array" && rhs.type === "null"
        ) {
          // if(isGlobal)
          //   console.warn(`InterpreterWarning: Expression of type ${lhs.type} -= ${rhs.type} on a global variable. This and further operations on this array can result in errors and unstable behaviour.`);
  
          const isLhs = lhs.type === "null";
          const nullVal = (isLhs ? lhs : rhs) as JbNull;
          let arr = (isLhs ? rhs : lhs) as Array;
          arr = arr.assignNull(nullVal, operator, isLhs);
          return arr;
        }
        // number -= array
        // array -= number
        else if (
          lhs.type === "number" && rhs.type === "array" ||
          lhs.type === "array" && rhs.type === "number"
        ) {
          const isLhs = lhs.type === "number";
          const numVal = (isLhs ? lhs : rhs) as JbNumber;
          let arr = (isLhs ? rhs : lhs) as Array;
          arr = arr.assignNumber(numVal, operator, isLhs);
          return arr;
        }
        // bool -= array
        // array -= bool
        else if (
          lhs.type === "bool" && rhs.type === "array" ||
          lhs.type === "array" && rhs.type === "bool"
        ) {
          const isLhs = lhs.type === "bool";
          const boolVal = (isLhs ? lhs : rhs) as JbBool;
          let arr = (isLhs ? rhs : lhs) as Array;
          arr = arr.assignBool(boolVal, operator, isLhs);
          return arr;
        }
        // string -= array
        // array -= string
        else if (
          lhs.type === "string" && rhs.type === "array" ||
          lhs.type === "array" && rhs.type === "string"
        ) {
          const isLhs = lhs.type === "string";
          const strVal = (isLhs ? lhs : rhs) as JbString;
          let arr = (isLhs ? rhs : lhs) as Array;
          arr = arr.assignString(strVal, operator, isLhs);
          return arr;
        }
        // array -= dict
        // dict -= array
        else if (
          lhs.type === "array" && rhs.type === "dictionary" ||
          lhs.type === "dictionary" && rhs.type === "array"
        ) {
          const isLhs = lhs.type === "array";
          const array = (isLhs ? lhs : rhs) as Array;

          // empty arrays get assigned
          if(array.members.length === 0)
            return array;
          
          // other arrays throw
          // POD: originally nested empty arrays work too, e.g. {{{}}}
          throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
        }

        // dicts

        // dict -= dict
        // number -= dict
        // dict -= number
        // null -= dict
        // dict -= null
        else if (
          lhs.type === "dictionary" && rhs.type === "dictionary" ||
          lhs.type === "number" && rhs.type === "dictionary" ||
          lhs.type === "dictionary" && rhs.type === "number" ||
          lhs.type === "null" && rhs.type === "dictionary" ||
          lhs.type === "dictionary" && rhs.type === "null"
        ) {
          throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
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
          // string -= dict
          // dict -= string
          // bool -= dict
          // dict -= bool
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs.type} - ${rhs.type}`;
      case "+=":
        // number += number
        if(lhs.type === rhs.type && rhs.type === "number") {
          let newValue = rhs as JbNumber;
          newValue.value = (lhs as JbNumber).value + (rhs as JbNumber).value;
          return newValue;
        }
        // string += string
        else if (lhs.type === rhs.type && rhs.type === "string") {
          let newValue = rhs as JbString;
          newValue.value = (lhs as JbString).value + (rhs as JbString).value;
          return newValue;
        }
        // bool + bool (unsupported)
        else if (lhs.type === rhs.type && rhs.type === "bool") {
          throw `Illegal operation, ADDITION with incompatible data types: ${lhs.type} + ${rhs.type}`;
        }
        // string += bool - implicit type conversion to string
        else if (lhs.type === "string" && rhs.type === "bool") {
          return new JbString((lhs as JbString).value + (rhs as JbBool).toString());
        }
        // bool += string - implicit type conversion to string
        else if (lhs.type === "bool" && rhs.type === "string") {
          return new JbString((lhs as JbBool).toString() + (rhs as JbString).value);
        }
        // string += number - implicit type conversion to string
        else if (lhs.type === "string" && rhs.type === "number") {
          return new JbString((lhs as JbString).value + (rhs as JbNumber).toString());
        }
        // number += string - implicit type conversion to string
        else if (lhs.type === "number" && rhs.type === "string") {
          return new JbString((lhs as JbString).value + (rhs as JbNumber).toString());
        }
        // number += bool (unsupported)
        // bool += number (unsupported)
        else if (
          lhs.type === "number" && rhs.type === "bool" ||
          lhs.type === "bool" && rhs.type === "number"
        ) {
          throw `Illegal operation: ${lhs.type} += ${rhs.type}`
        }
  
        // arrays
        
        // array += array
        else if (lhs.type === rhs.type && lhs.type === "array") {
          lhs = (lhs as Array).assignArray(rhs as Array, operator);
          return lhs;
        }
        // null += array
        // array += null
        else if (
          lhs.type === "null" && rhs.type === "array" ||
          lhs.type === "array" && rhs.type === "null"
        ) {
          const isLhs = lhs.type === "null";
          const nullVal = (isLhs ? lhs : rhs) as JbNull;
          let arr = (isLhs ? rhs : lhs) as Array;
          arr = arr.assignNull(nullVal, operator, isLhs);
          return arr;
        }
        // number += array
        // array += number
        else if (
          lhs.type === "number" && rhs.type === "array" ||
          lhs.type === "array" && rhs.type === "number"
        ) {
          const isLhs = lhs.type === "number";
          const numVal = (isLhs ? lhs : rhs) as JbNumber;
          let arr = (isLhs ? rhs : lhs) as Array;
          arr = arr.assignNumber(numVal, operator, isLhs);
          return arr;
        }
        // bool += array
        // array += bool
        else if (
          lhs.type === "bool" && rhs.type === "array" ||
          lhs.type === "array" && rhs.type === "bool"
        ) {
          const isLhs = lhs.type === "bool";
          const boolVal = (isLhs ? lhs : rhs) as JbBool;
          let arr = (isLhs ? rhs : lhs) as Array;
          arr = arr.assignBool(boolVal, operator, isLhs);
          return arr;
        }
        // string += array
        // array += string
        else if (
          lhs.type === "string" && rhs.type === "array" ||
          lhs.type === "array" && rhs.type === "string"
        ) {
          const isLhs = lhs.type === "string";
          const strVal = (isLhs ? lhs : rhs) as JbString;
          let arr = (isLhs ? rhs : lhs) as Array;
          arr = arr.assignString(strVal, operator, isLhs);
          return arr;
        }
        // array += dict
        // dict += array
        else if (
          lhs.type === "array" && rhs.type === "dictionary" ||
          lhs.type === "dictionary" && rhs.type === "array"
        ) {
          const isLhs = lhs.type === "array";
          const array = (isLhs ? lhs : rhs) as Array;

          // empty arrays get assigned
          if(array.members.length === 0)
            return array;
          
          // other arrays throw
          // POD: originally nested empty arrays work too, e.g. {{{}}}
          throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
        }

        // dicts

        // dict += dict
        else if(lhs.type === "dictionary" && lhs.type === rhs.type) {
          throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
        }
        // dict += number
        // number += dict
        else if (
          lhs.type === "number" && rhs.type === "dictionary" ||
          lhs.type === "dictionary" && rhs.type === "number"
        ) {
          throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
        }
        // dict += string
        // string += dict
        else if (
          lhs.type === "string" && rhs.type === "dictionary" ||
          lhs.type === "dictionary" && rhs.type === "string"
        ) {
          throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
        }
        // dict += null
        // null += dict
        else if (
          lhs.type === "null" && rhs.type === "dictionary" ||
          lhs.type === "dictionary" && rhs.type === "null"
        ) {
          throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
        }
        // dict += bool
        // bool += dict
        else if (
          lhs.type === "bool" && rhs.type === "dictionary" ||
          lhs.type === "dictionary" && rhs.type === "bool"
        ) {
          throw new Error(`Illegal operation: ${lhs.type} += ${rhs.type}`);
        }
        else
          // POD: currently returns interpreter types rather than strict JB types (e.g. 'number' instead of int/double)
          // call types should not be here, it should be their return value
          // TODO: binary type handling
          throw `Illegal operation, ADDITION with incompatible data types: ${lhs.type} + ${rhs.type}`
      default:
        throw `Unknown assignment operator ${operator}`;
    }
  }
}
