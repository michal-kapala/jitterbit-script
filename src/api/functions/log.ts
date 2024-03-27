import Scope from "../../runtime/scope";
import { JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypedIdentifier, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `WriteToOperationLog` function.
 * 
 * Writes a message to the operation log.
 */
export class WriteToOperationLog extends Func {
  constructor() {
    super();
    this.name = "WriteToOperationLog";
    this.module = "log/error";
    this.signatures = [
      new Signature("string", [new Parameter("string", "message")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Writes a message to the operation log.";
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversion
    console.log(`[Log] ${args[0].toString()}`);
    return new JbString(args[0].toString());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}
