import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbBool, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedArrayLiteral, TypedExpr, TypedIdentifier, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `Count` function.
 * 
 * Counts all instances of a data element at a particular hierarchical level
 * in a source or target, where that data element contains a valid value (and is not `null`).
 * 
 * The function returns either an integer or an array of instances,
 * depending on the context in which it is called.
 */
export class Count extends Func {
  constructor() {
    super();
    this.name = "Count";
    this.module = "instance";
    this.signatures = [
      new Signature("number", [new Parameter("node", "de")]),
      new Signature("number", [new Parameter("array", "arr")])
    ];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Counts all instances of a data element at a particular hierarchical level in a source or target, where that data element contains a valid value (and is not `null`).\n\nThe function returns either an integer or an array of instances, depending on the context in which it is called.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    let sigIdx = 0;
    const info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' is ${info.type}, should be node or array; a null value is returned.`;
        return {type: "null"};
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `CountSourceRecords` function.
 * 
 * Returns the number of source instances for a target node,
 * when the target node is referring to a parent of a mapping field.
 * 
 * If the target node is not a loop node, the function returns `1`.
 * See also the `SourceInstanceCount` function.
 */
export class CountSourceRecords extends Func {
  constructor() {
    super();
    this.name = "CountSourceRecords";
    this.module = "instance";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the number of source instances for a target node, when the target node is referring to a parent of a mapping field.\n\nIf the target node is not a loop node, the function returns `1`. See also [`SourceInstanceCount`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-sourceinstancecount).";
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
 * The implementation of `Exist` function.
 * 
 * Checks for the existence of a value (`v`) in instances of a data element (`de`)
 * or an array (`arr`) and returns `true` (or `false`) depending if it is found.
 * 
 * The function returns either a boolean or an array of instances,
 * depending on the context in which it is called.
 */
export class Exist extends Func {
  constructor() {
    super();
    this.name = "Exist";
    this.module = "instance";
    this.signatures = [
      // the docs say 'returns either a boolean or an array of instances'
      new Signature("bool", [
        new Parameter("type", "v"),
        new Parameter("node", "de")
      ]),
      new Signature("bool", [
        new Parameter("type", "v"),
        new Parameter("array", "arr")
      ])
    ];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Checks for the existence of a value (`v`) in instances of a data element (`de`) or an array (`arr`) and returns `true` (or `false`) depending if it is found.\n\nThe function returns either a boolean or an array of instances, depending on the context in which it is called.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[1].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    let sigIdx = 0;
    // v
    let info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`
    }
    // de/arr
    info = args[++argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].type = "error";
        args[argIdx].error = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' cannot be ${info.type}, the required type is node or array.`;
        break;
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `FindByPos` function.
 * 
 * Returns the value of a data element from an instance that occurs multiple times.
 * It can also be used to return an element of an array, in a 1-based fashion.
 * 
 * If a negative number is specified for the occurrence or array, counting will begin
 * from the last row or element. Note that the index is 1-based.
 */
export class FindByPos extends Func {
  constructor() {
    super();
    this.name = "FindByPos";
    this.module = "instance";
    this.signatures = [
      new Signature("type", [
        new Parameter("number", "pos"),
        new Parameter("node", "de")
      ]),
      new Signature("type", [
        new Parameter("number", "pos"),
        new Parameter("array", "arr")
      ])
    ];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Returns the value of a data element from an instance that occurs multiple times. It can also be used to return an element of an array, in a 1-based fashion.\n\nIf a negative number is specified for the occurrence or array, counting will begin from the last row or element. Note that the index is 1-based.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[1].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    let sigIdx = 0;
    // pos
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signatures[sigIdx].params[argIdx++], info.type);
    // de/arr
    info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' is ${info.type}, should be node or array.`;
        break;
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `FindValue` function.
 * 
 * Searches multiple instances of a data element (`de1`) looking for the value specified in `v`.
 * 
 * If the function finds the value, it returns the value in the field specified in
 * the third parameter (`de2`) for that found instance.
 * If the value is not found, the function returns `null`.
 * See also the `HasKey` function.
 */
export class FindValue extends Func {
  constructor() {
    super();
    this.name = "FindValue";
    this.module = "instance";
    this.signatures = [
      new Signature("type", [
        new Parameter("type", "v"),
        new Parameter("type", "de1"),
        new Parameter("type", "de2")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
    this.docs = "Searches multiple instances of a data element (`de1`) looking for the value specified in `v`.\n\nIf the function finds the value, it returns the value in the field specified in the third parameter (`de2`) for that found instance. If the value is not found, the function returns `null`.\n\n See also [`HasKey`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/dictionary-and-array-functions/#dictionaryandarrayfunctions-haskey).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // v
    let info = args[argIdx].typeExpr(env);
    if(args[argIdx].type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    // de1
    info = args[++argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
      case "array":
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signature.params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signature.params[argIdx].name}' is ${info.type}, should be node or array.`;
        break;
    }
    // de2
    info = args[++argIdx].typeExpr(env);
    if(args[argIdx].type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetInstance` function.
 * 
 * This function returns the instance data element which was defined
 * by calling `SetInstances` function during the generation of the parent.
 * As an alternative to this function, see the `ArgumentList` function.
 */
export class GetInstance extends Func {
  constructor() {
    super();
    this.name = "GetInstance";
    this.module = "instance";
    this.signatures = [
      new Signature("type", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the instance data element which was defined by calling [`SetInstances`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/instance-functions/#instancefunctions-setinstances) function during the generation of the parent.\n\nAs an alternative to this function, see [`ArgumentList`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-argumentlist).";
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
 * The implementation of `Max` function.
 * 
 * Returns the maximum value of instances of a data element at a particular level
 * in the hierarchy of a data structure.
 * It will check all instances at that level and return the largest.
 * It can also be used to return the maximum value of an array.
 */
export class Max extends Func {
  constructor() {
    super();
    this.name = "Max";
    this.module = "instance";
    this.signatures = [
      new Signature("type", [new Parameter("node", "de")]),
      new Signature("type", [new Parameter("array", "arr")])
    ];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns the maximum value of instances of a data element at a particular level in the hierarchy of a data structure.\n\nIt can also be used to return the maximum value of an array.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    let sigIdx = 0;
    const info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' is ${info.type}, should be node or array.`;
        break;
    }

    // array literal inference
    if(args[argIdx].kind === "ArrayLiteral") {
      const arr = args[argIdx] as TypedArrayLiteral;
      if(arr.members.length === 0)
        return {type: "null"};
      const arrType = arr.members[0].type;
      for(const elem of arr.members) {
        if(
          elem.type !== arrType && elem.type !== "error" &&
          elem.type !== "unknown" && elem.type !== "type"
        ) {
          elem.error = `The array contains element(s) of type '${elem.type}', expected '${arrType}'.`;
          elem.type = "error";
          return {type: this.signatures[sigIdx].returnType};
        }
      }
      return {type: arrType};
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `Min` function.
 * 
 * Returns the minimum value of instances of a data element at a particular level
 * in the hierarchy of a data structure.
 * It will check all instances at that level and return the smallest.
 * It can also be used to return the minimum value of an array.
 */
export class Min extends Func {
  constructor() {
    super();
    this.name = "Min";
    this.module = "instance";
    this.signatures = [
      new Signature("type", [new Parameter("node", "de")]),
      new Signature("type", [new Parameter("array", "arr")])
    ];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns the minimum value of instances of a data element at a particular level in the hierarchy of a data structure.\n\nIt can also be used to return the minimum value of an array.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    let sigIdx = 0;
    const info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' is ${info.type}, should be node or array.`;
        break;
    }

    // array literal inference
    if(args[argIdx].kind === "ArrayLiteral") {
      const arr = args[argIdx] as TypedArrayLiteral;
      if(arr.members.length === 0)
        return {type: "null"};
      const arrType = arr.members[0].type;
      for(const elem of arr.members) {
        if(
          elem.type !== arrType && elem.type !== "error" &&
          elem.type !== "unknown" && elem.type !== "type"
        ) {
          elem.error = `Element of type '${elem.type}', expected '${arrType}'.`;
          elem.type = "error";
          return {type: this.signatures[sigIdx].returnType};
        }
      }
      return {type: arrType};
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `ResolveOneOf` function.
 * 
 * Returns the first non-null value from instances of a data element.
 * This function is generally used for retrieving the value of a "one-of" source data element.
 * It can also be used with arrays, and will return the first non-null element.
 */
export class ResolveOneOf extends Func {
  constructor() {
    super();
    this.name = "ResolveOneOf";
    this.module = "instance";
    this.signatures = [
      new Signature("type", [new Parameter("node", "de")]),
      new Signature("type", [new Parameter("array", "arr")])
    ];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns the first non-null value from instances of a data element.\n\nThis function is generally used for retrieving the value of a \"one-of\" source data element. It can also be used with arrays, and will return the first non-null element.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    let sigIdx = 0;
    const info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' is ${info.type}, should be node or array.`;
        break;
    }

    // array literal inference
    if(args[argIdx].kind === "ArrayLiteral") {
      const arr = args[argIdx] as TypedArrayLiteral;
      if(arr.members.length === 0)
        return {type: "null"};
      for(const elem of arr.members) {
        if(elem.type !== "error" && elem.type !== "unknown" && elem.type !== "null")
          return {type: elem.type};
      }
      return {type: "null"};
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `SetInstances` function.
 * 
 * Defines the source instances for a target loop node.
 * Normally, a loop target instance is generated from a loop source instance.
 * Sometimes the data may come from other sources.
 * This function is intended for cases where the data is in multiple sets and each set
 * generates a single target element.
 * 
 * The instance is a data element which could be a simple value, or an array of data elements.
 * When creating the target, each instance will be used to generate a target instance.
 * 
 * To see how to use an instance data element, see the `GetInstance` and `ArgumentList` functions.
 * 
 * This function should be called in the mappings of the parent node of the intended target.
 * If no leaf node is available in the parent, you can create a condition node that calls this function.
 * The condition should end with `true` so that it always is accepted.
 * 
 * The function should not be called more than once with the same target node,
 * as the last call overrides previous ones.
 * To avoid being overridden, you may create multiple-mapping-folders.
 * 
 * A `null` data element is returned from this function and should be ignored.
 */
export class SetInstances extends Func {
  constructor() {
    super();
    this.name = "SetInstances";
    this.module = "instance";
    this.signatures = [
      new Signature("null", [
        new Parameter("string", "nodeName"),
        // the docs type is wrong
        new Parameter("type", "de")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Defines the source instances for a target loop node.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/instance-functions/#instancefunctions-setinstances).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // nodeName
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // de
    info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `SortInstances` function.
 * 
 * Sorts the generation of target loop data elements based on one or more data elements
 * in the source or target.
 * 
 * All the sorting instances must have the same number of instances as the number of target instances.
 * 
 * The sorting order is assumed to be ascending, and an optional scalar argument can be put
 * next to each sorting data element to override the default sorting order.
 * If the `sortOrder` is `false`, the sorting order is descending.
 * 
 * The target loop data elements will be sorted first by the instances of the first source
 * data elements, and then sorted by the instances of the second data elements, and so on.
 * 
 * This function must be called in the mappings of the parent node.
 * If there is no field to map in the parent node, either a script can be called
 * with this function or a condition added for that purpose.
 * 
 * A `null` value is returned from this function and should be ignored.
 */
export class SortInstances extends Func {
  constructor() {
    super();
    this.name = "SortInstances";
    this.module = "instance";
    this.signatures = [
      new Signature("null", [
        new Parameter("string", "nodeName"),
        new Parameter("array", "sourceDataElements1"),
        new Parameter("bool", "sortOrder1", false, new JbBool(true)),
        new Parameter("array", "sourceDataElements", false),
        new Parameter("bool", "sortOrder", false, new JbBool(true)),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 100;
    this.docs = "Sorts the generation of target loop data elements based on one or more data elements in the source or target.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/instance-functions/#instancefunctions-sortinstances).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // nodeName
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // sourceDataElements1
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    
    if(args.length > 2) {
      // sortOrder1
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
      if(args.length > 3) {
        for(argIdx = 3; argIdx < args.length; argIdx++) {
          // sourceDataElementsN
          info = args[argIdx].typeExpr(env);
          args[argIdx].checkReqArg(
            {
              ...this.signature.params[3],
              name: this.signature.params[3].name + ((argIdx + 1) / 2)
            },
            info.type
          );
          if(++argIdx === args.length)
            break;
          // sortOrderN
          info = args[argIdx].typeExpr(env);
          args[argIdx].checkOptArg(
            {
              ...this.signature.params[4],
              name: this.signature.params[4].name + (argIdx / 2)
            },
            info.type
          );
        }
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Sum` function.
 * 
 * Takes the value of each instance of a data element at a particular
 * hierarchical level and returns the sum.
 * The data type of both `de` and `arr` must be one of integer, long, float, double, or string.
 * The data types of all instances or all elements must be the same.
 * 
 * If the array is empty, `0` is returned.
 * Though null values will be ignored in arrays with another data type,
 * an array with just nulls will return an error.
 */
export class Sum extends Func {
  constructor() {
    super();
    this.name = "Sum";
    this.module = "instance";
    this.signatures = [
      new Signature("type", [new Parameter("node", "de")]),
      new Signature("type", [new Parameter("array", "arr")])
    ];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Takes the value of each instance of a data element at a particular hierarchical level and returns the sum.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/instance-functions/#instancefunctions-sum).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    let sigIdx = 0;
    const info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' is ${info.type}, should be node or array; a null value is returned.`;
        return {type: "null"};
    }

    // array literal inference
    if(args[argIdx].kind === "ArrayLiteral") {
      const arr = args[argIdx] as TypedArrayLiteral;
      if(arr.members.length === 0)
        return {type: "null"};
      const arrType = arr.members[0].type;
      for(const elem of arr.members) {
        if(
          elem.type !== arrType && elem.type !== "error" &&
          elem.type !== "unknown" && elem.type !== "type"
        ) {
          elem.error = `Element of type '${elem.type}', expected '${arrType}'.`;
          elem.type = "error";
        }
      }
      return {type: arrType};
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `SumCSV` function.
 * 
 * Concatenates each instance of a field of a data element or each element of an array,
 * with a comma delimiter between each instance or element.
 * 
 * If the field or array element contains special characters such as line feeds or commas,
 * the field or array element is enclosed by double quotes.
 * No delimiter is added after the last instance or element is concatenated.
 * 
 * See also the `SumString` function for a similar function but with additional options.
 */
export class SumCSV extends Func {
  constructor() {
    super();
    this.name = "SumCSV";
    this.module = "instance";
    this.signatures = [
      new Signature("string", [new Parameter("node", "de")]),
      new Signature("string", [new Parameter("array", "arr")])
    ];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Concatenates each instance of a field of a data element or each element of an array, with a comma delimiter between each instance or element.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/instance-functions/#instancefunctions-sumcsv).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    let sigIdx = 0;
    const info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' is ${info.type}, should be node or array; a null value is returned.`;
        return {type: "null"};
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `SumString` function.
 * 
 * Concatenates each instance of the specified data elements or each element of an array,
 * with a delimiter automatically appended to the end of each concatenated string.
 * 
 * If the parameter `omitLast` is `true`, the delimiter after the last string is omitted.
 * 
 * See also the `SumCSV` function.
 */
export class SumString extends Func {
  constructor() {
    super();
    this.name = "SumString";
    this.module = "instance";
    this.signatures = [
      new Signature("string", [
        new Parameter("node", "de"),
        new Parameter("string", "delimiter", false, new JbString(";")),
        new Parameter("bool", "omitLast", false, new JbBool(false))
      ]),
      new Signature("string", [
        new Parameter("array", "arr"),
        new Parameter("string", "delimiter", false, new JbString(";")),
        new Parameter("bool", "omitLast", false, new JbBool(false))
      ])
    ];
    this.minArgs = 1;
    this.maxArgs = 3;
    this.docs = "Concatenates each instance of the specified data elements or each element of an array, with a delimiter automatically appended to the end of each concatenated string.\n\nIf the parameter `omitLast` is `true`, the delimiter after the last string is omitted.\n\nSee also [`SumCSV`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/instance-functions/#instancefunctions-sumcsv).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "array" ? 1 : 0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    let sigIdx = 0;
    // de/arr
    let info = args[argIdx].typeExpr(env);
    let retNull: TypeInfo | undefined;
    switch(info.type) {
      case "node":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a source/target data element path or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global warnings
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' is ${info.type}, should be node or array; a null value is returned.`;
        retNull = {type: "null"};
    }

    if(args.length > 1) {
      // delimiter
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signatures[sigIdx].params[argIdx], info.type);
      if(args.length > 2) {
        // omitLast
        info = args[++argIdx].typeExpr(env);
        args[argIdx].checkOptArg(this.signatures[sigIdx].params[argIdx], info.type);
      }
    }
    if(retNull)
      return retNull;
    return {type: this.signatures[sigIdx].returnType};
  }
}
