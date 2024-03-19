import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbBool, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { AsyncFunc, Func, Parameter, Signature } from "../types";

/**
 * The implementation of `ArrayToMultipleValues` function.
 * 
 * Signals that an array should be used to populate a multiple-valued LDAP attribute
 * when mapping to an LDAP target.
 * The array is converted to XML and interpreted when the LDAP server is written to.
 */
export class ArrayToMultipleValues extends Func {
  constructor() {
    super();
    this.name = "ArrayToMultipleValues";
    this.module = "ldap";
    this.signatures = [
      new Signature("string", [new Parameter("array", "arr")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
 * The implementation of `LDAPAdd` function.
 * 
 * To use this function, the `LDAPConnect` function must first be used
 * to establish a connection with the LDAP directory.
 * 
 * After a connection is established, the `LDAPAdd` function is used to add entries
 * and attributes to the connected LDAP directory.
 * The value is added to the node specified in the `LDAPExecute` function,
 * which should be called immediately afterwards to have the changes take effect.
 * 
 * See also the `LDAPConnect` and `LDAPExecute` functions.
 */
export class LDAPAdd extends AsyncFunc {
  constructor() {
    super();
    this.name = "LDAPAdd";
    this.module = "ldap";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "ldapType"),
        new Parameter("string", "ldapValue")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
    // ldapType
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // ldapValue
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `LDAPConnect` function.
 * 
 * Connects to a directory using LDAP.
 * 
 * See also the `LDAPExecute` function.
 */
export class LDAPConnect extends AsyncFunc {
  constructor() {
    super();
    this.name = "LDAPConnect";
    this.module = "ldap";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "hostname"),
        new Parameter("string", "user"),
        new Parameter("string", "password"),
        new Parameter("number", "mode", false),
        new Parameter("number", "port", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 5;
  }
  
  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
    // hostname
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // user
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // password
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 3) {
      // mode
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
      if(args.length > 4) {
        // port
        info = args[++argIdx].typeExpr(env);
        args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `LDAPDeleteEntry` function.
 * 
 * To use this function, the `LDAPConnect` function must first be used
 * to establish a connection with the LDAP directory.
 * 
 * After a connection is established, the `LDAPDeleteEntry` function is used to remove
 * an entry specified by a distinguished name.
 * 
 * See also the `LDAPConnect` and `LDAPExecute` functions.
 */
export class LDAPDeleteEntry extends AsyncFunc {
  constructor() {
    super();
    this.name = "LDAPDeleteEntry";
    this.module = "ldap";
    this.signatures = [
      new Signature("bool", [new Parameter("string", "distinguishedName")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
 * The implementation of `LDAPExecute` function.
 * 
 * To use this function, the `LDAPConnect` function must first be used
 * to establish a connection with the LDAP directory.
 * 
 * After a connection is established, the `LDAPExecute` function is used
 * to execute one or more modifications (add, remove, replace) that have previously been
 * specified with the `LDAPAdd`, `LDAPRemove`, or `LDAPReplace` functions.
 * 
 * See also the `LDAPConnect` and `LDAPExecute` functions.
 */
export class LDAPExecute extends AsyncFunc {
  constructor() {
    super();
    this.name = "LDAPExecute";
    this.module = "ldap";
    this.signatures = [
      new Signature("bool", [new Parameter("string", "distinguishedName")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
 * The implementation of `LDAPRemove` function.
 * 
 * To use this function, the `LDAPConnect` function must first be used
 * to establish a connection with the LDAP directory.
 * 
 * Once a connection is established, the `LDAPRemove` function is used to remove an attribute
 * of a specified type and with a specified value.
 * 
 * If the attribute type of that value is not found, an error is thrown.
 * See also the `LDAPConnect` and `LDAPExecute` functions.
 */
export class LDAPRemove extends AsyncFunc {
  constructor() {
    super();
    this.name = "LDAPRemove";
    this.module = "ldap";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "ldapType"),
        new Parameter("string", "ldapValue")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
    // ldapType
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // ldapValue
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `LDAPRename` function.
 * 
 * To use this function, the `LDAPConnect` function must first be used
 * to establish a connection with the LDAP directory.
 * 
 * Once a connection is established, the `LDAPRename` function is used
 * to change the distinguished name of an entry in the connected directory.
 * 
 * See also the `LDAPConnect` and `LDAPExecute` functions.
 */
export class LDAPRename extends AsyncFunc {
  constructor() {
    super();
    this.name = "LDAPRename";
    this.module = "ldap";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "distinguishedName"),
        new Parameter("string", "newRDN"),
        new Parameter("string", "newParent", false, new JbString()),
        new Parameter("bool", "deleteOldRDN", false, new JbBool(false))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 4;
  }
  
  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
    // distinguishedName
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // newRDN
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 2) {
      // newParent
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
      if(args.length > 3) {
        // deleteOldRDN
        info = args[++argIdx].typeExpr(env);
        args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `LDAPReplace` function.
 * 
 * To use this function, the `LDAPConnect` function must first be used
 * to establish a connection with the LDAP directory.
 * 
 * Once a connection is established, the `LDAPReplace` function is used
 * to replace an existing attribute's value with a new value.
 * 
 * See also the `LDAPConnect` and `LDAPExecute` functions.
 */
export class LDAPReplace extends AsyncFunc {
  constructor() {
    super();
    this.name = "LDAPReplace";
    this.module = "ldap";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "ldapType"),
        new Parameter("string", "ldapValue")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
    // ldapType
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // ldapValue
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `LDAPSearch` function.
 * 
 * To use this function, the `LDAPConnect` function must first be used
 * to establish a connection with the LDAP directory.
 * 
 * Once a connection is established, the `LDAPSearch` function is used
 * to search within the connected directory.
 * 
 * See also the `LDAPConnect` and `LDAPExecute` functions.
 * 
 * Supports up to 100-argument calls.
 */
export class LDAPSearch extends AsyncFunc {
  constructor() {
    super();
    this.name = "LDAPSearch";
    this.module = "ldap";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "path"),
        new Parameter("string", "filter"),
        new Parameter("number", "detail"),
        new Parameter("string", "attribute1"),
        new Parameter("string", "attribute", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 4;
    this.maxArgs = 100;
  }
  
  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module.toUpperCase()} API calls is currently unsupported.`);
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
    // path
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // filter
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // detail
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // attribute1
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 4) {
      // attributeN
      for(argIdx = 4; argIdx < args.length; argIdx++) {
        info = args[argIdx].typeExpr(env);
        args[argIdx].checkReqArg(
          {
            ...this.signature.params[4],
            name: this.signature.params[4].name + (argIdx - 2)
          },
          info.type
        );
      }
    }
    return {type: this.signature.returnType};
  }
}
