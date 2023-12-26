import Scope from "../../runtime/scope";
import { JbNumber } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `Ceiling` function.
 * 
 * Returns the mathematical ceiling (rounded up to the nearest integer) of a given value as an integer.
 * The argument should be a double and is first converted to a double if not.
 */
export class Ceiling extends Func {
  constructor() {
    super();
    this.name = "Ceiling";
    this.module = "math";
    this.signatures = [
      new Signature("number", [new Parameter("number", "d")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // conversion
    const num = args[0].type !== "number"
      ? new JbNumber(args[0].toNumber())
      : args[0] as JbNumber;

    return new JbNumber(Math.ceil(num.value));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Exp` function.
 * 
 * Returns the mathematical result e^d, or e to the power of d.
 * The argument should be a double and is first converted to a double if not.
 */
export class Exp extends Func {
  constructor() {
    super();
    this.name = "Exp";
    this.module = "math";
    this.signatures = [
      new Signature("number", [new Parameter("number", "d")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    // conversion
    const num = args[0].type !== "number"
      ? new JbNumber(args[0].toNumber())
      : args[0] as JbNumber;

    return new JbNumber(Math.exp(num.value));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
