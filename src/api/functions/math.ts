import { RuntimeError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbNumber, JbString } from "../../runtime/types";
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
    return new JbNumber(Math.ceil(args[0].toNumber()));
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
    return new JbNumber(Math.exp(args[0].toNumber()));
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
    return new JbNumber(Math.floor(args[0].toNumber()));
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
    const num = args[0].toNumber();
    if(num < 0)
      throw new RuntimeError(`The logarithm of a negative number (${num}) is undefined.`);
    if(num === 0)
      throw new RuntimeError(`The logarithm of 0 is undefined.`);
    return new JbNumber(Math.log(num));
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
    const num = args[0].toNumber();
    if(num < 0)
      throw new RuntimeError(`The logarithm of a negative number (${num}) is undefined.`);
    if(num === 0)
      throw new RuntimeError(`The logarithm of 0 is undefined.`);
    return new JbNumber(Math.log10(num));
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
    // TODO: typechecker errors
    const numerator = Math.floor(args[0].toNumber());
    const denominator = args[1].toNumber() < 0
      ? Math.ceil(args[1].toNumber())
      : Math.floor(args[1].toNumber());

    if(denominator === 0)
      return new JbNumber(args[0].toNumber());
    return new JbNumber(numerator % denominator);
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
    return new JbNumber(Math.pow(
      args[0].toNumber(),
      args[1].toNumber()
    ));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Round` function.
 * 
 * Returns the given value rounded to a specified precision and then converted to a string.
 * The argument should be a double and is first converted to a double if not.
 * This function is designed for displaying values (not computing) as the output is a string.
 * 
 * This function is similar to the String `Format` function.
 */
export class Round extends Func {
  constructor() {
    super();
    this.name = "Round";
    this.module = "math";
    this.signatures = [
      new Signature("string", [
        new Parameter("number", "d"),
        new Parameter("number", "numPlaces", false, new JbNumber(0))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // conversions
    let num = args[0].toNumber();
    let numPlaces = (this.signature.params[1].defaultVal as JbNumber).value ?? 0;

    if(args.length === 2) {
      // POD: the original implementation returns a format string for negative numPlaces
      // e.g. Round(-13.123456789, -9.9) returns '%.0-9f'
      if(args[1].toNumber() < 0)
        throw new RuntimeError(`Cannot round a number to a negative number of digits.`);

      numPlaces = args[1].type !== "number"
        ? Math.floor(Math.abs(args[1].toNumber()))
        : Math.floor(Math.abs((args[1] as JbNumber).value));
    }

    num *= 10 ** numPlaces;
    num = Math.round(num);
    num /= 10 ** numPlaces;

    return new JbString(num.toString());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `RoundToInt` function.
 * 
 * Returns the given value rounded to the nearest integer (no decimal places).
 * The argument should be a double and is first converted to a double if not.
 */
export class RoundToInt extends Func {
  constructor() {
    super();
    this.name = "RoundToInt";
    this.module = "math";
    this.signatures = [
      new Signature("number", [
        new Parameter("number", "d")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // conversions
    return new JbNumber(Math.round(args[0].toNumber()));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Sqrt` function.
 * 
 * Returns the square root of a given value.
 * The argument should be a double and is first converted to a double if not.
 * 
 * This implementation throws instead of returning `-nan` for negative input.
 */
export class Sqrt extends Func {
  constructor() {
    super();
    this.name = "Sqrt";
    this.module = "math";
    this.signatures = [
      new Signature("number", [
        new Parameter("number", "d")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // conversion
    const num = args[0].toNumber();
    // POD: the original function returns '-nan' for negative input
    if(num < 0)
      throw new RuntimeError(`${this.name}(${num}) is not a real number.`);
    return new JbNumber(Math.sqrt(num));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
