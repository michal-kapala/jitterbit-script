import { Expr } from "../../frontend/ast";
import { evaluate } from "../../runtime/interpreter";
import Scope from "../../runtime/scope";
import { JbNull } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { DeferrableFunc, Parameter, Signature } from "../types";

/**
 * The implementation of `If` function.
 * 
 * Returns `trueResult` if condition is `true`, else it returns `falseResult`.
 * 
 * If the first argument (condition) is not a boolean data type, it is converted to a boolean before it is evaluated.
 * If the optional third argument is not specified and condition is `false`, a `null` value is returned.
 */
export class If extends DeferrableFunc {
  constructor() {
    super();
    this.name = "If";
    this.module = "logical";
    this.signatures = [
      new Signature("type", [
        new Parameter("bool", "condition"),
        new Parameter("type", "trueResult"),
        new Parameter("type", "falseResult", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 3;
  }

  callEval(args: Expr[], scope: Scope) {
    const condition = evaluate(args[0], scope).toBool();

    if(!condition && args.length === 2)
      return new JbNull();

    return evaluate(condition ? args[1] : args[2], scope);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
