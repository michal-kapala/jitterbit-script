import { StaticType } from "./types";

/**
 * Variable environment for static type evaluation.
 */
export default class TypeEnv {
  private variables: Map<string, StaticType>;

  constructor() {
    this.variables = new Map();
  }

  public set(varName: string, type: StaticType) {
    this.variables.set(varName, type);
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
