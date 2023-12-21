import { RuntimeVal } from "../../runtime/values";
import { Dictionary, JbBool, Array, JbString } from "../../runtime/types";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `AddToDict` function.
 * 
 * Adds a value to a dictionary for a specific key.
 * 
 * The key must be a string or have a string representation, with null keys not allowed. Any value is allowed, even null values.
 * 
 * Returns `true` if the value was added and the new key added to the dictionary or `false` if the key already existed and the value at that key was instead updated. If the first argument is not defined or is not a dictionary, it will be initialized to an empty dictionary before the value is added.
 * 
 * See also the `Dict` function.
 */
export class AddToDictFunc extends Func {
  constructor() {
    super();
    this.name = "AddToDict";
    this.module = "dict/array";
    this.signatures = [
      new Signature("bool", [
        new Parameter("dictionary", "dict"),
        new Parameter("string", "key"),
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
  }

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== "dictionary")
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as Dictionary;

    // native get needed for the result
    const result = dict.members.get(Dictionary.keyValueToString(args[1])) === undefined;
    dict.set(args[1], args[2]);
    return new JbBool(result);
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `CollectValues` function.
 * 
 * Returns an array containing the values corresponding to the names in the argument array,
 * returned in the same order as the keys in the array.
 */
export class CollectValuesFunc extends Func {
  constructor() {
    super();
    this.name = "CollectValues";
    this.module = "dict/array";
    this.signatures = [
      new Signature("array", [
        new Parameter("dictionary", "dict"),
        new Parameter("array", "names")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);

    // TODO: these errors should be thrown by type checker (too)
    // POD: original error:
    // call CollectValues() error, argument data types must be diction, collection
    if(args[0].type !== "dictionary")
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as Dictionary;

    if(args[1].type !== "array")
      throw new Error(`${this.name} can only be called on ${this.signature.params[1].type} data elements. The '${this.signature.params[1].name}' argument is of type ${args[1].type}`);

    // POD: the function will throw on null values in 'names' array
    // originally a null value is returned
    let idx = 0;
    const result = new Array();
    for(const key of (args[1] as Array).members)
      result.set(idx++, dict.get(key));

    return result;
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `GetKeys` function.
 * 
 * Returns an array of the keys in a dictionary. The argument must be an existing dictionary.
 */
export class GetKeysFunc extends Func {
  constructor() {
    super();
    this.name = "GetKeys";
    this.module = "dict/array";
    this.signatures = [
      new Signature("array", [
        new Parameter("dictionary", "dict")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== "dictionary")
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as Dictionary;
    const result = new Array();
    let idx = 0;
    for(const key of dict.members.keys())
      result.set(idx++, new JbString(key));

    return result;
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

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

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);
    return new Dictionary();
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `HasKey` function.
 * 
 * Checks whether a dictionary contains a specified key. Returns `false` if the first argument is not a dictionary or if the key was not found.
 * As an equivalent function that works for arrays, see the examples of the `FindValue` function.
 */
export class HasKeyFunc extends Func {
  constructor() {
    super();
    this.name = "HasKey";
    this.module = "dict/array";
    this.signatures = [
      new Signature("bool", [
        new Parameter("dictionary", "dict"),
        new Parameter("string", "key")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== "dictionary")
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as Dictionary;
    const result = dict.members.get(Dictionary.keyValueToString(args[1]));
    return new JbBool(result !== undefined)
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

/**
 * The implementation of `MapCache` function.
 * 
 * This function caches a key/value pair to a dictionary.
 * If the key already exists in the dictionary, the corresponding value will be returned;
 * otherwise, the third argument will be evaluated, and that value would be stored in the dictionary for the key.
 */
export class MapCacheFunc extends Func {
  constructor() {
    super();
    this.name = "MapCache";
    this.module = "dict/array";
    this.signatures = [
      new Signature("string", [
        new Parameter("dictionary", "dict"),
        new Parameter("string", "key"),
        new Parameter("string", "value")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
  }

  call(args: RuntimeVal[]): RuntimeVal {
    this.chooseSignature(args);
    
    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== "dictionary")
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as Dictionary;
    const lookup = dict.members.get(Dictionary.keyValueToString(args[1]));
    const result = lookup !== undefined
      ? lookup.toString()
      : dict.set(args[1], args[2]).toString();
    return new JbString(result);
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `RemoveKey` function.
 * 
 * Removes a key-value pair with a specific key from a dictionary.
 * The key must be a string or have a string representation, and null values are not allowed.
 * Returns `true` if the key-value pair was removed and `false` if the key didn't exist.
 */
export class RemoveKeyFunc extends Func {
  constructor() {
    super();
    this.name = "RemoveKey";
    this.module = "dict/array";
    this.signatures = [
      new Signature("bool", [
        new Parameter("dictionary", "dict"),
        new Parameter("string", "key")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== "dictionary")
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as Dictionary;
    const key = Dictionary.keyValueToString(args[1]);
    return new JbBool(dict.members.delete(key));
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}
