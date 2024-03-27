import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { AsyncFunc, Parameter, Signature } from "../types";

/**
 * The implementation of `SendEmail` function.
 * 
 * Sends an email using the supplied information.
 * 
 * On success, an empty string is returned; otherwise, any error messages are returned.
 * 
 * Only the first four parameters are required; the rest are optional.
 * If information is not specified, it will be read from the server configuration file.
 * If it is not available in the configuration file, the email will not be sent.
 */
export class SendEmail extends AsyncFunc {
  constructor() {
    super();
    this.name = "SendEmail";
    this.module = "email";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "from"),
        new Parameter("string", "to"),
        new Parameter("string", "subject"),
        new Parameter("string", "message"),
        new Parameter("string", "smtpServers", false),
        new Parameter("string", "account", false),
        new Parameter("string", "accountPassword", false),
        new Parameter("string", "cc", false),
        new Parameter("string", "bcc", false),
        new Parameter("string", "replyTo", false),
        new Parameter("bool", "useSSL", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 4;
    this.maxArgs = 11;
    this.docs = "Sends an email using the supplied information.\n\nOn success, an empty string is returned; otherwise, any error messages are returned.\n\nIf information is not specified, it will be read from the server configuration file. If it is not available in the configuration file, the email will not be sent.";
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
    // from
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // to
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // subject
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // message
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 4) {
      // smtpServers
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
      if(args.length > 5) {
        // account
        info = args[++argIdx].typeExpr(env);
        args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
        if(args.length > 6) {
          // accountPassword
          info = args[++argIdx].typeExpr(env);
          args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
          if(args.length > 7) {
            // cc
            info = args[++argIdx].typeExpr(env);
            args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
            if(args.length > 8) {
              // bcc
              info = args[++argIdx].typeExpr(env);
              args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
              if(args.length > 9) {
                // replyTo
                info = args[++argIdx].typeExpr(env);
                args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
                if(args.length > 10) {
                  // useSSL
                  info = args[++argIdx].typeExpr(env);
                  args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
                }
              }
            }
          }
        }
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `SendEmailMessage` function.
 * 
 * Sends an email using a predefined email notification.
 * 
 * On success, an empty string is returned; otherwise, any error messages are returned.
 * 
 * The email message used in this function call must be defined as an email notification
 * in the current project.
 * For more information, see the instructions on inserting email messages under
 * the Notifications section in Jitterbit Script.
 */
export class SendEmailMessage extends AsyncFunc {
  constructor() {
    super();
    this.name = "SendEmailMessage";
    this.module = "email";
    this.signatures = [
      new Signature("string", [new Parameter("string", "emailMessageId")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Sends an email using a predefined email notification.\n\nOn success, an empty string is returned; otherwise, any error messages are returned.\n\nThe email message used in this function call must be defined as an email notification in the current project.\n\nFor more information, see [Notifications](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/scripts/jitterbit-script#jitterbitscript-notifications).";
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
 * The implementation of `SendSystemEmail` function.
 * 
 * Sends an email using a pre-configured "From" address, SMTP servers, and account information.
 * These are defined in the server configuration file.
 * If these have not been defined, use one of the other email functions.
 * On success, an empty string is returned; otherwise, any error messages are returned.
 */
export class SendSystemEmail extends AsyncFunc {
  constructor() {
    super();
    this.name = "SendSystemEmail";
    this.module = "email";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "to"),
        new Parameter("string", "subject"),
        new Parameter("string", "message")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
    this.docs = "Sends an email using a pre-configured \"From\" address, SMTP servers, and account information. These are defined in the server configuration file. If not, use one of the other email functions.\n\nOn success, an empty string is returned; otherwise, any error messages are returned.";
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
    // to
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // subject
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // message
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}
