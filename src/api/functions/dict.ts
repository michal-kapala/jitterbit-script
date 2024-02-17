import { RuntimeVal } from "../../runtime/values";
import { JbDictionary, JbBool, JbArray, JbString } from "../../runtime/types";
import { Func, Parameter, Signature } from "../types";
import Scope from "../../runtime/scope";
import { RuntimeError, UnimplementedError } from "../../errors";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";

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
export class AddToDict extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "AddToDict";
    this.module = "dict/array";
    this.signatures = [
      new Signature("bool", [
        new Parameter("dictionary", "dict"),
        // all types but null allowed
        new Parameter("type", "key"),
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    // original behaviour
    if(args[1].type === "null")
      throw new RuntimeError(`A dictionary key can't be null.`);

    const dict = args[0] as JbDictionary;

    // native get needed for the result
    const result = dict.members.get(JbDictionary.keyValueToString(args[1])) === undefined;
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
export class CollectValues extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
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

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    // TODO: these errors should be thrown by type checker (too)
    // POD: original error:
    // call CollectValues() error, argument data types must be diction, collection
    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as JbDictionary;

    if(args[1].type !== this.signature.params[1].type)
      throw new RuntimeError(`${this.name} can only be called on ${this.signature.params[1].type} data elements. The '${this.signature.params[1].name}' argument is of type ${args[1].type}`);

    // POD: the function will throw on null values in 'names' array
    // originally a null value is returned
    let idx = 0;
    const result = new JbArray();
    for(const key of (args[1] as JbArray).members)
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
export class GetKeys extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
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

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as JbDictionary;
    const result = new JbArray();
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
 * The implementation of `GetSourceInstanceMap` function.
 * 
 * Returns a dictionary (map) containing the attribute name and its value from an element node.
 * 
 * As an alternative to this function, see `GetSourceInstanceArray`.
 * 
 * To enter an `n` path into the function, drag and drop the desired XML node folder from the Source Objects tab of the script component palette to the script to insert its qualified path at the location of your cursor, or enter its reference path manually. For more information, see the instructions on inserting source objects.
 */
export class GetSourceInstanceMap extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "GetSourceInstanceMap";
    this.module = "dict/array";
    this.signatures = [
      new Signature("dictionary", [
        new Parameter("node", "n")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of transformation API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `GetSourceInstanceElementMap` function.
 * 
 * Returns a dictionary (map) containing the sub-element's value from an element node.
 * 
 * As an alternative to this function, see `GetSourceInstanceElementArray`.
 * 
 * To enter an `n` path into the function, drag and drop the desired XML node folder
 * from the Source Objects tab of the script component palette to the script to insert
 * its qualified path at the location of your cursor, or enter its reference path manually.
 * 
 * For more information, see the instructions on inserting source objects.
 */
export class GetSourceInstanceElementMap extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "GetSourceInstanceElementMap";
    this.module = "dict/array";
    this.signatures = [
      new Signature("dictionary", [
        new Parameter("node", "n")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of transformation API calls is currently unsupported.`);
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
export class Dict extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "Dict";
    this.module = "dict/array";
    this.signatures = [new Signature("dictionary", [])];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbDictionary();
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
export class HasKey extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "HasKey";
    this.module = "dict/array";
    this.signatures = [
      new Signature("bool", [
        new Parameter("dictionary", "dict"),
        // the docs wrongly say this is a string, implicit conversion in reality
        new Parameter("type", "key")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as JbDictionary;
    const result = dict.members.get(JbDictionary.keyValueToString(args[1]));
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
export class Map extends Dict {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
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
export class MapCache extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "MapCache";
    this.module = "dict/array";
    // the docs wrongly say this is a string, can be any value
    // in case the 3rd arg is used, its string representation is returned
    this.signatures = [
      new Signature("string", [
        new Parameter("dictionary", "dict"),
        // the docs wrongly say this is a string, implicit conversion in reality
        new Parameter("type", "key"),
        // the docs wrongly say this is a string, implicit conversion in reality
        new Parameter("type", "value")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    
    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const dict = args[0] as JbDictionary;
    const lookup = dict.members.get(JbDictionary.keyValueToString(args[1]));
    // POD: the original function returns null if lookup is a null value
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
export class RemoveKey extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "RemoveKey";
    this.module = "dict/array";
    this.signatures = [
      new Signature("bool", [
        new Parameter("dictionary", "dict"),
        // the docs say this is a string, implicit conversion in reality
        new Parameter("type", "key")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    // POD: originally the type is not validated, the value is reassigned with a new dictionary
    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    // 'The key must be a string or have a string representation, and null values are not allowed.'
    // this neither throws nor affects the dictionary
    if(args[1].type === "null")
      return new JbBool(false);

    const dict = args[0] as JbDictionary;
    const key = JbDictionary.keyValueToString(args[1]);
    return new JbBool(dict.members.delete(key));
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}
