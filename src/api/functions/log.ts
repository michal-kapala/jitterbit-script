import Scope from "../../runtime/scope";
import { JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `WriteToOperationLog` function.
 * 
 * Writes a message to the operation log.
 */
export class WriteToOperationLog extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
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
}
