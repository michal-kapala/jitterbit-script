import Scope from "../../runtime/scope";
import { JbNumber, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `CountSubString` function.
 * 
 * Returns the number of times a sub-string appears in a string.
 */
export class CountSubString extends Func {
  constructor() {
    super();
    this.name = "CountSubString";
    this.module = "string";
    this.signatures = [
      new Signature("number", [
        new Parameter("string", "str"),
        new Parameter("string", "subStr"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    const matches = [...(args[0] as JbString).toString().matchAll(
      new RegExp((args[1] as JbString).toString(), 'g')
    )];
    
    return new JbNumber(matches.length);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `DQuote` function.
 * 
 * Places a string in double quotes and returns the result.
 * Embedded double quotes are not escaped.
 */
export class DQuote extends Func {
  constructor() {
    super();
    this.name = "DQuote";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversion
    return new JbString(`"${args[0].toString()}"`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
