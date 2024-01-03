import { NamedError } from "../../errors";
import { Expr } from "../../frontend/ast";
import { evaluate } from "../../runtime/interpreter";
import Scope from "../../runtime/scope";
import { JbNull } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { DeferrableFunc, Parameter, Signature } from "../types";

/**
 * The implementation of `Case` function.
 * 
 * This function evaluates pairs of arguments: if the evaluation of the expression
 * in the first argument of a pair is true, it stops checking and returns the second argument
 * with the type preserved. Otherwise it will check the next pair, and so on.
 * If none of the pairs evaluate to `true`, `null` is returned.
 * 
 * To create a default or fall-through case, use `true` and the desired return value
 * as the last pair.
 * 
 * Supports up to 100-argument calls (50 pairs).
 */
export class Case extends DeferrableFunc {
  constructor() {
    super();
    this.name = "Case";
    this.module = "logical";
    this.signatures = [
      new Signature("type", [
        new Parameter("bool", "b1"),
        new Parameter("type", "arg1"),
        new Parameter("bool", "bN", false),
        new Parameter("type", "argN", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 100;
  }

  callEval(args: Expr[], scope: Scope) {
    // TODO: to be copied into typechecker
    if(args.length % 2 === 1)
      throw new NamedError("Odd number of arguments", this.name);

    for(let idx = 0; idx < args.length; idx += 2) {
      if(evaluate(args[idx], scope).toBool())
        return evaluate(args[idx + 1], scope);
    }
    return new JbNull();
  }

  call(args: RuntimeVal[], scope: Scope): never {
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

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
