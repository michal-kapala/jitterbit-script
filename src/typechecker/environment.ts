import { TypeInfo } from "./ast";

/**
 * Variable environment for static type evaluation.
 */
export default class TypeEnv {
  private variables: Map<string, TypeInfo>;

  constructor() {
    this.variables = new Map();
  }

  public set(varName: string, info: TypeInfo) {
    this.variables.set(varName, info);
  }

  /**
   * Returns the type of a variable from the global environment.
   * 
   * Jitterbit does not use child scopes for local variables.
   */
  public lookup(varName: string) {
    return this.variables.get(varName);
  }
}
