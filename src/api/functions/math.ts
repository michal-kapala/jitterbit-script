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

  call(args: RuntimeVal[], scope: Scope) {
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

/**
 * The implementation of `Floor` function.
 * 
 * Returns the mathematical floor (rounded down to the nearest integer) of a given value as an integer.
 * The argument should be a double and is first converted to a double if not.
 */
export class Floor extends Func {
  constructor() {
    super();
    this.name = "Floor";
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

    return new JbNumber(Math.floor(num.value));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Log` function.
 * 
 * Returns the natural log (logarithm to the base e) of a given value.
 * The argument should be a double and is first converted to a double if not.
 */
export class Log extends Func {
  constructor() {
    super();
    this.name = "Log";
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
    return new JbNumber(Math.log(num.value));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Log10` function.
 * 
 * Returns the logarithm to the base 10 of a given value. The argument should be a double and is first converted to a double if not.
 */
export class Log10 extends Func {
  constructor() {
    super();
    this.name = "Log10";
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
    return new JbNumber(Math.log10(num.value));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Mod` function.
 * 
 * Calculates the modulus (the remainder) of the division of the numerator by the denominator.
 * The return value has the same sign as the numerator.
 * If the denominator is 0, the numerator is returned.
 */
export class Mod extends Func {
  constructor() {
    super();
    this.name = "Mod";
    this.module = "math";
    this.signatures = [
      new Signature("number", [
        new Parameter("number", "numerator"),
        new Parameter("number", "denominator")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: implicit conversions to be tested
    const numerator = args[0].type !== "number"
      ? new JbNumber(args[0].toNumber())
      : args[0] as JbNumber;

    const denominator = args[1].type !== "number"
      ? new JbNumber(args[1].toNumber())
      : args[1] as JbNumber;

    if(denominator.value === 0)
      return numerator;

    return new JbNumber(numerator.value % denominator.value);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Pow` function.
 * 
 * Returns the mathematical result base^exponent, or base to the power of exponent.
 * The arguments should be doubles and are first converted to doubles if not.
 * 
 * `Pow(0, 0)` returns 1.
 */
export class Pow extends Func {
  constructor() {
    super();
    this.name = "Pow";
    this.module = "math";
    this.signatures = [
      new Signature("number", [
        new Parameter("number", "base"),
        new Parameter("number", "exponent")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // conversions
    const base = args[0].type !== "number"
      ? new JbNumber(args[0].toNumber())
      : args[0] as JbNumber;

    const exponent = args[1].type !== "number"
      ? new JbNumber(args[1].toNumber())
      : args[1] as JbNumber;

    return new JbNumber(Math.pow(base.value, exponent.value));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
