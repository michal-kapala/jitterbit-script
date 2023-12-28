import Scope from "../../runtime/scope";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `SendEmail` function.
 * 
 * Sends an email using the supplied information.
 * On success, an empty string is returned; otherwise, any error messages are returned.
 * 
 * Only the first four parameters are required; the rest are optional.
 * If information is not specified, it will be read from the server configuration file.
 * If it is not available in the configuration file, the email will not be sent.
 */
export class SendEmail extends Func {
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
        new Parameter("string", "useSSL", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 4;
    this.maxArgs = 11;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `SendEmailMessage` function.
 * 
 * Sends an email using a predefined email notification.
 * On success, an empty string is returned; otherwise, any error messages are returned.
 * 
 * The email message used in this function call must be defined as an email notification
 * in the current project.
 * For more information, see the instructions on inserting email messages under
 * the Notifications section in Jitterbit Script.
 */
export class SendEmailMessage extends Func {
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
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
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
export class SendSystemEmail extends Func {
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
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}