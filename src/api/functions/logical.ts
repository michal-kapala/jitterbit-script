import { RuntimeError, UnimplementedError } from "../../errors";
import { Expr } from "../../frontend/ast";
import { evaluate } from "../../runtime/interpreter";
import Scope from "../../runtime/scope";
import { JbArray, JbBool, JbNull } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypedIdentifier, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
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
        new Parameter("bool", "b", false),
        new Parameter("type", "arg", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 100;
  }

  async callEval(args: Expr[], scope: Scope) {
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // b1
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // arg1
    info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    if(args.length > 2) {
      for(argIdx = 2; argIdx < args.length; argIdx++) {
        // bN
        info = args[argIdx].typeExpr(env);
        args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
        // odd nb of arguments
        if(++argIdx === args.length) {
          if(args[argIdx - 1].type !== "error")
            args[argIdx - 1].warning = `The condition '${this.signature.params[2].name + ((argIdx + 1) / 2)}' is missing its corresponding expression '${this.signature.params[3].name + ((argIdx + 1) / 2)}'.`;
          break;
        }
        // argN
        info = args[argIdx].typeExpr(env);
        if(info.type === "unassigned") {
          args[argIdx].type = "error";
          args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        }
      }
    }
    return {type: this.signature.returnType};
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
    const condition = args[0].type === args[1].type && args[0].type === "array";
    this.signature = this.signatures[condition ? 0 : 1];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    let sigIdx = 1;
    // arg1/array1
    const arg1Info = args[argIdx].typeExpr(env);
    if(arg1Info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    // arg2/array2
    const arg2Info = args[++argIdx].typeExpr(env);
    if(arg2Info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    if(
      arg1Info.type === "array" && ["array", "type", "unknown"].includes(arg2Info.type) ||
      arg2Info.type === "array" && ["array", "type", "unknown"].includes(arg1Info.type)
    )
      sigIdx = 0;

    const result = {type: this.signatures[sigIdx].returnType} as TypeInfo;
    if(arg1Info.type !== arg2Info.type &&
      !["type", "unknown", "error"].includes(arg1Info.type) &&
      !["type", "unknown", "error"].includes(arg2Info.type)
    )
      result.warning = `Implicit type conversion/promotion will be performed on the argument pair (${arg1Info.type}, ${arg2Info.type}).`;

    return result;
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // condition
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // trueResult
    info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }

    if(args.length > 2) {
      // falseResult
      info = args[++argIdx].typeExpr(env);
      if(info.type === "unassigned") {
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
      }
    }
    return {type: this.signature.returnType};
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // condition
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // expression
    info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}
