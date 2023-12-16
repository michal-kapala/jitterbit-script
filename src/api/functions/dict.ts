import { DictVal, MK_DICT, RuntimeVal } from "../../runtime/values";
import { Func, Signature } from "../types";

/**
 * The implementation of `Dict` function.
 * 
 * Creates an empty dictionary.
 * A dictionary is a collection of name-value pairs where the value is retrieved based on a string key value. Any value is allowed, even null values. The key must be a string or have a string representation.
 * Null keys are not allowed.
 * 
 * See also the `AddToDict` function.
 */
export class DictFunc extends Func {
  constructor() {
    super();
    this.name = "Dict";
    this.module = "dict/array";
    this.signatures = [new Signature("dictionary", [])];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }

  call(args: RuntimeVal[]): DictVal {
    this.chooseSignature(args);
    return MK_DICT();
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Map` function.
 * 
 * An alias for `Dict`. See the function `Dict`.
 */
export class MapFunc extends DictFunc {
  constructor() {
    super();
    this.name = "Map";
  }
}
