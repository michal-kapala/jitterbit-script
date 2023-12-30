import Scope from "../../runtime/scope";
import { JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Signature } from "../types";

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
    return new JbString(scope.lookupVar("$jitterbit.operation.last_error").toString());
  }
  
  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
