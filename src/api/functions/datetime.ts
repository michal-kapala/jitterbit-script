import Scope from "../../runtime/scope";
import { JbDate } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Signature } from "../types";

/**
 * The implementation of `Now` function.
 * 
 * Returns a date object representing the date and time values at the moment the function was run.
 * The fraction of the second is truncated.
 */
export class Now extends Func {
  constructor() {
    super();
    this.name = "Now";
    this.module = "datetime";
    this.minArgs = 0;
    this.maxArgs = 0;
    this.signatures = [new Signature("date", [])];
    this.signature = this.signatures[0];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbDate();
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Now_` function.
 * 
 * Returns a date object representing the date and time values at the moment the function was run.
 * The time value includes the fraction of second (milliseconds).
 */
export class Now_ extends Func {
  constructor() {
    super();
    this.name = "Now_";
    this.module = "datetime";
    this.minArgs = 0;
    this.maxArgs = 0;
    this.signatures = [new Signature("date", [])];
    this.signature = this.signatures[0];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbDate(new Date(), false);
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}
