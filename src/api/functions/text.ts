import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbBool } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `Validate` function.
 * 
 * This function is intended to be called from a script used for text validation.
 * It provides for that validation script the same validation as can be defined
 * for a text document file format.
 * Typically this function is called in a script used in the validation of a source
 * text document file format. Note that validation works only for sources, not targets.
 * 
 * The `Validate` function assumes that the calling script has these three input arguments
 * provided to it, as it uses them to obtain the value that it is going to validate:
 * 
 * - `_1`: The input value, as a string
 * - `_2`: A string with the data type of the input value (the "Type" field as used in the File Format)
 * - `_3`: A format string of the input value (the "Format" field as used in the File Format)
 * 
 * See the `ArgumentList` function for more information on how values are passed using the `_n` syntax.
 */
export class Validate extends Func {
  constructor() {
    super();
    this.name = "Validate";
    this.module = "text";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "op"),
        new Parameter("string", "arg"),
        new Parameter("bool", "ignoreCase", false, new JbBool(false)),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 3;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // op
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // arg
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 2) {
      // ignoreCase
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}
