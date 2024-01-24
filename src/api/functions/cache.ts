import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbNumber, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { AsyncFunc, Parameter, Signature } from "../types";

/**
 * The implementation of `ReadCache` function.
 * 
 * Reads from a common cache stored on Harmony.
 */
export class ReadCache extends AsyncFunc {
  constructor() {
    super();
    this.name = "ReadCache";
    this.module = "cache";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "name"),
        new Parameter("number", "expirationSeconds", false, new JbNumber(1800)),
        new Parameter("string", "scope", false, new JbString("project"))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 3;
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
}

/**
 * The implementation of `WriteCache` function.
 * 
 * Writes to a common cache stored on Harmony.
 */
export class WriteCache extends AsyncFunc {
  constructor() {
    super();
    this.name = "WriteCache";
    this.module = "cache";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "name"),
        new Parameter("type", "value"),
        new Parameter("number", "expirationSeconds", false, new JbNumber(1800)),
        new Parameter("string", "scope", false, new JbString("project"))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
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
}
