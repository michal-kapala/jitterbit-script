import { Api } from "../api";
import { GlobalIdentifier } from "../frontend/ast";
import { 
  JbArray,
  JbDictionary,
  JbBinary,
  JbBool,
  JbDate,
  JbNull,
  JbNumber,
  JbString
} from "./types";
import { RuntimeVal } from "./values";

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
              def = new JbArray();
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

  /**
   * Performs an assignment to an identifier.
   * @param varName 
   * @param value 
   * @param operator 
   * @returns 
   */
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
            // zero-initialized
            case "number":
              let newValue = value as JbNumber;
              newValue.value = 0 - newValue.value;
              this.getGlobal().variables.set(varName, newValue);
              return newValue;
            case "bool":
            case "string":
            case "binary":
            case "date":
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
            case "binary":
            case "null":
            case "date":
              this.getGlobal().variables.set(varName, value);
              return value;
            case "dictionary":
              throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
            default:
              throw `Unsupported type: ${value.type}`;
          }
        default:
          throw `Unknown assignment operator ${operator}`;
      }
    }

    let newValue = Scope.assign(oldValue ?? new JbNull(), operator, value);
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

  /**
   * Returns a reference on an identifier's value.
   * @param varname 
   * @returns 
   */
  public lookupVar(varname: string): RuntimeVal {
    const scope = this.resolve(varname);
    return scope.variables.get(varname) as RuntimeVal;
  }

  /**
   * Returns the scope of the identifier.
   * @param varname 
   * @returns 
   */
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
  public initGlobalVar(global: GlobalIdentifier) {
    if(this.parent === undefined) {
      const value = this.lookupVar(global.symbol);
      if(value === undefined)
        this.variables.set(global.symbol, new JbNull());
    }
    else
      // This is a development-only warning, users cant cause it
      console.warn("ScopeWarning: Attempt to null-initialize a global variable from a child scope.");
  }

  /**
   * Performs reference assignments for =, -=, += operators.
   * @param lhs 
   * @param rhs 
   * @param operator 
   * @returns 
   */
  static assign(lhs: RuntimeVal, operator: string, rhs: RuntimeVal) {
    switch (operator) {
      case "=":
        return rhs;
      case "-=":
      case "+=":
        switch(rhs.type) {
          case "array":
            return lhs.binopArray(operator[0], rhs as JbArray);
          case "binary":
            return lhs.binopBin(operator[0], rhs as JbBinary);
          case "bool":
            return lhs.binopBool(operator[0], rhs as JbBool);
          case "date":
            return lhs.binopDate(operator[0], rhs as JbDate);
          case "dictionary":
            return lhs.binopDict(operator[0], rhs as JbDictionary);
          case "null":
            return lhs.binopNull(operator[0], rhs as JbNull);
          case "number":
            return lhs.binopNumber(operator[0], rhs as JbNumber);
          case "string":
            return lhs.binopString(operator[0], rhs as JbString);
          default:
            throw new Error(`Unsupported RHS runtime type: ${rhs.type}`);
        }
      default:
        throw `Unknown assignment operator ${operator}`;
    }
  }

  /**
   * Prints a table with all available variables as KV pairs.
   * @param merged The result map with the variables collected from the scope and its parents.
   */
  public logAvailable(merged = new Map<string, RuntimeVal>()) {   
    merged = new Map([...merged, ...this.variables]);
    // global scope reached
    if(this.parent === undefined) {
      const vars = new Map<string, string | undefined>();
      for(const key of merged.keys()) {
        if(Api.getSysVar(key) === undefined)
          vars.set(key, merged.get(key)?.toString());
      }
      console.table(vars);
      return;
    }
    // traverse parent scopes
    this.parent.logAvailable(merged);
  }
}
