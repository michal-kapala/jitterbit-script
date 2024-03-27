import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { Func, Signature } from "../types";

/**
 * The implementation of `GetAgentGroupID` function.
 * 
 * Returns the ID of the agent group that the operation or expression is currently running in.
 */
export class GetAgentGroupID extends Func {
  constructor() {
    super();
    this.name = "GetAgentGroupID";
    this.module = "envinfo";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the ID of the agent group that the operation or expression is currently running in.";
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetAgentGroupName` function.
 * 
 * Returns the name of the agent group that the operation or expression is currently running in.
 */
export class GetAgentGroupName extends Func {
  constructor() {
    super();
    this.name = "GetAgentGroupName";
    this.module = "envinfo";
    this.signatures = [
      new Signature("string", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the name of the agent group that the operation or expression is currently running in.";
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }
  
  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetAgentID` function.
 * 
 * Returns the ID of the agent that is running the operation or expression.
 */
export class GetAgentID extends Func {
  constructor() {
    super();
    this.name = "GetAgentID";
    this.module = "envinfo";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the ID of the agent that is running the operation or expression.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetAgentName` function.
 * 
 * Returns the name of the agent that the operation or expression is currently running in.
 */
export class GetAgentName extends Func {
  constructor() {
    super();
    this.name = "GetAgentName";
    this.module = "envinfo";
    this.signatures = [
      new Signature("string", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the name of the agent that the operation or expression is currently running in.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetAgentVersionID` function.
 * 
 * Returns the version ID of the agent that the operation or expression is currently running in.
 */
export class GetAgentVersionID extends Func {
  constructor() {
    super();
    this.name = "GetAgentVersionID";
    this.module = "envinfo";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the version ID of the agent that the operation or expression is currently running in.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetAgentVersionName` function.
 * 
 * Returns the version name of the agent that the operation or expression is currently running in.
 */
export class GetAgentVersionName extends Func {
  constructor() {
    super();
    this.name = "GetAgentVersionName";
    this.module = "envinfo";
    this.signatures = [
      new Signature("string", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the version name of the agent that the operation or expression is currently running in.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetEnvironmentID` function.
 * 
 * Returns the ID of the environment that the operation or expression is currently running in.
 */
export class GetEnvironmentID extends Func {
  constructor() {
    super();
    this.name = "GetEnvironmentID";
    this.module = "envinfo";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the ID of the environment that the operation or expression is currently running in.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.\nYou can read your environment ID from 'environment.properties' local file.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetEnvironmentName` function.
 * 
 * Returns the name of the environment that the operation or expression is currently running in.
 */
export class GetEnvironmentName extends Func {
  constructor() {
    super();
    this.name = "GetEnvironmentName";
    this.module = "envinfo";
    this.signatures = [
      new Signature("string", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the name of the environment that the operation or expression is currently running in.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.\nYou can read your environment name from 'environment.properties' local file.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetOrganizationID` function.
 * 
 * Returns the ID of the organization that the operation or expression is currently running in.
 */
export class GetOrganizationID extends Func {
  constructor() {
    super();
    this.name = "GetOrganizationID";
    this.module = "envinfo";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the ID of the organization that the operation or expression is currently running in.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.\nYou can read your organization ID from 'environment.properties' local file.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetOrganizationName` function.
 * 
 * Returns the name of the organization that the operation or expression is currently running in.
 */
export class GetOrganizationName extends Func {
  constructor() {
    super();
    this.name = "GetOrganizationName";
    this.module = "envinfo";
    this.signatures = [
      new Signature("string", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the name of the organization that the operation or expression is currently running in.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.\nYou can read your organization name from 'environment.properties' local file.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}
