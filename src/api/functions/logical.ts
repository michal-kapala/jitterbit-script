import { RuntimeError, UnimplementedError } from "../../errors";
import { Expr } from "../../frontend/ast";
import { evaluate } from "../../runtime/interpreter";
import Scope from "../../runtime/scope";
import { JbArray, JbBool, JbNull } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { DeferrableFunc, Func, Parameter, Signature } from "../types";

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

  async callEval(args: Expr[], scope: Scope) {
    // TODO: to be copied into typechecker
    if(args.length % 2 === 1)
      throw new RuntimeError("Odd number of arguments", this.name);

    for(let idx = 0; idx < args.length; idx += 2) {
      if((await evaluate(args[idx], scope)).toBool())
        return await evaluate(args[idx + 1], scope);
    }
    return new JbNull();
  }

  call(args: RuntimeVal[], scope: Scope): never {
    throw new UnimplementedError("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implemetation of `Equal` function.
 * 
 * Performs a recursive comparison of two arrays.
 * Returns true if all corresponding members of the arrays are equal, otherwise it returns false.
 * It can also be used with simple types, and follows conversion rules to promote
 * different types to compare them.
 * 
 * Calling this function to compare two arrays is different from using
 * the `==` operator on two arrays.
 * Using the `==` operator on two arrays returns an array of booleans
 * containing the result of a comparison of each array member.
 * Using this function compares each corresponding element in turn.
 * 
 * The `Equal()` function always returns false if the two array arguments have different sizes.
 * 
 * Type conversion and promotion is performed if the arguments or elements being
 * compared are of different types.
 * 
 * This implementation is type-sensitive - comparison of different types always returns `false`.
 */
export class Equal extends Func {
  constructor() {
    super();
    this.name = "Equal";
    this.module = "logical";
    this.signatures = [
      new Signature("bool", [
        new Parameter("array", "array1"),
        new Parameter("array", "array2")
      ]),
      new Signature("bool", [
        new Parameter("type", "arg1"),
        new Parameter("type", "arg2")
      ])
    ];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // POD: this implementation is type-sensitive
    // the original implementation performs implicit conversions
    // e.g. originally Equal(0, "") returns true
    if(args[0].type !== args[1].type)
      return new JbBool(false);

    // arrays
    if(this.signature === this.signatures[0]) {
      const arr1 = args[0] as JbArray;
      const arr2 = args[1] as JbArray;
      if(arr1.members.length !== arr2.members.length)
        return new JbBool(false);

      // compares types and string representations of each element pair
      for(let idx = 0; idx < arr1.members.length; idx++) {
        // POD: type-sensitive
        if(arr1.members[idx].type !== arr2.members[idx].type)
          return new JbBool(false);
        if(arr1.members[idx].toString() !== arr2.members[idx].toString())
          return new JbBool(false);
      }
      return new JbBool(true);
    }
    // other types
    return new JbBool(args[0].toString() === args[1].toString());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    const condition = args[0].type === args[1].type && args[0].type == "array";
    this.signature = this.signatures[condition ? 0 : 1];
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

  async callEval(args: Expr[], scope: Scope) {
    const condition = (await evaluate(args[0], scope)).toBool();

    if(!condition && args.length === 2)
      return new JbNull();

    return evaluate(condition ? args[1] : args[2], scope);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    throw new UnimplementedError("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `While` function.
 * 
 * Repeatedly executes an expression as long as a condition is true.
 * 
 * The Jitterbit variable `jitterbit.scripting.while.max_iterations` limits
 * the number of iterations.
 * An error is reported if the maximum number of iterations is reached.
 */
export class While extends DeferrableFunc {
  constructor() {
    super();
    this.name = "While";
    this.module = "logical";
    this.signatures = [
      new Signature("null", [
        new Parameter("bool", "condition"),
        new Parameter("type", "expression")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  async callEval(args: Expr[], scope: Scope) {
    const maxIters = scope.lookupVar("$jitterbit.scripting.while.max_iterations").toNumber();
    let iterCount = 0;
    while((await evaluate(args[0], scope)).toBool() && iterCount < maxIters) {
      evaluate(args[1], scope);
      iterCount++;
    }

    // POD: not the original error
    if(iterCount === maxIters)
      throw new RuntimeError(`Max number of ${maxIters} iterations reached. Set $jitterbit.scripting.while.max_iterations upstream of this function call to increase the iteration limit.`);

    return new JbNull();
  }

  call(args: RuntimeVal[], scope: Scope): never {
    throw new UnimplementedError("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
