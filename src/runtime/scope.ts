import { MK_BOOL, MK_NULL, RuntimeVal } from "./values";

export function createGlobalScope() {
  const scope = new Scope();
  // Create default global scope
  scope.declareVar("true", MK_BOOL(true), true);
  scope.declareVar("false", MK_BOOL(false), true);
  scope.declareVar("null", MK_NULL(), true);

  return scope;
}

export default class Scope {
  private parent?: Scope;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentScope?: Scope) {
    const global = parentScope ? true : false;
    this.parent = parentScope;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(
    varname: string,
    value: RuntimeVal,
    constant: boolean,
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `Cannot declare variable ${varname} as it already is defined.`;
    }

    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const scope = this.resolve(varname);

    // Cannot assign to constant
    if (scope.constants.has(varname)) {
      throw `Cannot reassign to variable ${varname} as it was declared constant.`;
    }

    scope.variables.set(varname, value);
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

    if (this.parent == undefined) {
      throw `Cannot resolve '${varname}' as it does not exist.`;
    }

    return this.parent.resolve(varname);
  }
}
