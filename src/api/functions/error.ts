import Scope from "../../runtime/scope";
import { JbNull, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";
import { RuntimeError } from "../../errors";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";

/**
 * The implementation of `GetLastError` function.
 * 
 * Returns the last error reported in a script or transformation.
 * It can be used with the `ResetError` and `Eval` functions for error handling.
 * 
 * Note that the `GetLastError` function does not carry the error message over into another
 * operation.
 * To do that, Jitterbit variables are available that contain that information for use between
 * operations:
 * 
 * - `$jitterbit.operation.error`
 * - `$jitterbit.operation.previous.error`
 * - `$jitterbit.operation.last_error`
 * 
 * See also the `RaiseError` function.
 * 
 * This implementation retrieves the value of `$jitterbit.operation.last_error`.
 */
export class GetLastError extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "GetLastError";
    this.module = "log/error";
    this.signatures = [
      new Signature("string", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // POD: use of operation system variable
    // TODO: all errors should be preceded with setting of this variable
    return new JbString(scope.lookupVar("$jitterbit.operation.last_error").toString());
  }
  
  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `RaiseError` function.
 * 
 * Causes a script or transformation to fail, and the contents of the parameter message
 * to be displayed in the error log.
 * 
 * The entire text written to the error log will be:
 * 
 * `RaiseError: <message>`
 * 
 * This implementation updates error system variables:
 * - `$jitterbit.operation.previous.error`
 * - `$jitterbit.operation.last_error`
 */
export class RaiseError extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "RaiseError";
    this.module = "log/error";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "message")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    const err = new JbString(args[0].toString());
    scope.assignVar("$jitterbit.operation.previous.error", scope.lookupVar("$jitterbit.operation.last_error"));
    scope.assignVar("$jitterbit.operation.last_error", err);
    throw new RuntimeError(err.value, this.name);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `ResetLastError` function.
 * 
 * Sets the last error to an empty string. This is identical to calling `SetLastError("")`.
 * 
 * See also the function `SetLastError`.
 */
export class ResetLastError extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "ResetLastError";
    this.module = "log/error";
    this.signatures = [
      new Signature("void", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // $jitterbit.operation.previous.error is not affected
    scope.assignVar("$jitterbit.operation.last_error", new JbString());
    return new JbNull();
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `SetLastError` function.
 * 
 * Sets a user-defined last error. The message will be logged as a warning
 * and the `GetLastError` function will return the message unless another error occurs.
 * 
 * See also the function `ResetLastError`, which performs the same action of setting
 * the last error but without logging a message.
 */
export class SetLastError extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "SetLastError";
    this.module = "log/error";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "message")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    const err = new JbString(args[0].toString());
    // $jitterbit.operation.previous.error is not affected
    scope.assignVar("$jitterbit.operation.last_error", err);
    console.warn(`[${this.name}] Warning: ${err.value}`);
    return new JbNull();
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
