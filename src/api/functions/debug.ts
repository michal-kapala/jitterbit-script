import Scope from "../../runtime/scope";
import { JbBool } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `DebugBreak` function.
 * 
 * When passed an expression that evaluates to `true`, `DebugBreak()` causes
 * execution control to return to the client when testing a script, expression,
 * transformation, or operation.
 * Returns `true` if execution was stopped; otherwise `false` is returned.
* 
* The input argument is optional: `DebugBreak()` is equivalent to `DebugBreak(true)`.
* 
* For more information, see Script Testing.
* 
* This implementation only prints the variables available within the current scope;
* the execution does not get halted.
 */
export class DebugBreak extends Func {
  constructor() {
    super();
    this.name = "DebugBreak";
    this.module = "debug";
    this.minArgs = 0;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("bool", [
        new Parameter("bool", "booleanExpression", false, new JbBool(true))
      ])
    ];
    this.signature = this.signatures[0];
    this.docs = "When passed an expression that evaluates to `true`, `DebugBreak()` causes execution control to return to the client when testing a script, expression, transformation, or operation.\n\nReturns `true` if execution was stopped; otherwise `false` is returned.\n\nThe input argument is optional: `DebugBreak()` is equivalent to `DebugBreak(true)`.\n\nFor more information, see [Script Testing](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/scripts/script-testing).";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    let result = this.signature.params[0].defaultVal as JbBool ?? new JbBool();
    // TODO: conversions to be checked
    if(args[0] !== undefined)
      result = new JbBool(args[0].toBool());

    // prints the scope
    if(result.value) {
      console.log("\nDebugBreak():")
      scope.logAvailable();
    }
    return result;
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    if(args.length === 1) {
      const argIdx = 0;
      const info = args[argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}
