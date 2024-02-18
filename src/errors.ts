import { Parameter } from "./api/types";
import { StaticTypeName } from "./typechecker/ast";

/**
 * Runtime exceptions, e.g. thrown by `RaiseError` function.
 */
export class RuntimeError extends Error {
  constructor(message: string, src?: string) {
    super();
    if(src !== undefined)
      this.name = src;
    this.message =  message;
  }
}

/**
 * Indicates that the functionality has not been implemented yet.
 */
export class UnimplementedError extends RuntimeError {}

/**
 * Parser exceptions, indicating an AST construction failure.
 */
export class ParserError extends Error {
  constructor(message: string, src?: string) {
    super();
    if(src !== undefined)
      this.name = src;
    this.message =  message;
  }
}

/**
 * Type exceptions thrown by typechecker during AST validation.
 */
export class TcError extends Error {
  constructor(message: string, src?: string) {
    super();
    if(src !== undefined)
      this.name = src;
    this.message =  message;
  }

  /**
   * Warning message for call expr argument type validation.
   * @param param 
   * @param argType 
   * @param paramType 
   * @returns 
   */
  static makeArgTypeWarn(param: Parameter, argType: StaticTypeName) {
    return `The type of argument '${param.name}' is ${argType}, should be ${param.type}.`;
  }

  /**
   * Error message for call expr argument type validation.
   * @param paramName 
   * @param argType 
   * @param paramType 
   * @returns 
   */
  static makeArgTypeError(param: Parameter, argType: StaticTypeName) {
    return `The type of argument '${param.name}' cannot be ${argType}, the required type is ${param.type}.`;
  }
}
