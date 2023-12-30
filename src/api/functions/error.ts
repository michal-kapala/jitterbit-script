import Scope from "../../runtime/scope";
import { JbNull, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";
import { NamedError } from "../../errors";

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
    throw new NamedError(err.value, this.name);
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
