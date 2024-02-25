import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { AsyncFunc, Parameter, Signature } from "../types";

/**
 * The implementation of `NetSuiteGetSelectValue` function.
 * 
 * Retrieves the picklist values for a field from NetSuite.
 * 
 * The function response is a dictionary (map), where:
 * 
 * 1. The dictionary keys are the picklist values.
 * 
 * 2. The dictionary values are a map with two elements: the internal ID and the external ID for each picklist.
 */
export class NetSuiteGetSelectValue extends AsyncFunc {
  constructor() {
    super();
    this.name = "NetSuiteGetSelectValue";
    this.module = "netsuite";
    this.signatures = [
      new Signature("dictionary", [
        new Parameter("string", "netSuiteOrg"),
        new Parameter("string", "recordType"),
        new Parameter("string", "field"),
        new Parameter("string", "sublist", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 4;
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // netSuiteOrg
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // recordType
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // field
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 3) {
      // sublist
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `NetSuiteGetServerTime` function.
 * 
 * Retrieves the server date-time from a NetSuite server.
 */
export class NetSuiteGetServerTime extends AsyncFunc {
  constructor() {
    super();
    this.name = "NetSuiteGetServerTime";
    this.module = "netsuite";
    this.signatures = [
      new Signature("string", [new Parameter("string", "netSuiteOrg")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `NetSuiteLogin` function.
 * 
 * Retrieves a new session ID from a NetSuite endpoint for use in REST or SOAP calls
 * that are used outside of the NetSuite connector.
 * This provides a simple way to log in to NetSuite without requiring
 * authentication headers for each web service call.
 */
export class NetSuiteLogin extends AsyncFunc {
  constructor() {
    super();
    this.name = "NetSuiteLogin";
    this.module = "netsuite";
    this.signatures = [
      new Signature("string", [new Parameter("string", "netSuiteOrg")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}
