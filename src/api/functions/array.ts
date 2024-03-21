import { RuntimeError, UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbArray, JbBool, JbNull, JbNumber, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypedIdentifier, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `Array` function.
 * 
 * Creates an empty array. Though arrays don't need to be initialized prior to use, this method can be used to be explicit or to reset an already-existing array. Arrays are zero-based, and values are retrieved using indexes.
 */
export class Array extends Func {
  constructor() {
    super();
    this.name = "Array";
    this.module = "dict/array";
    this.signatures = [new Signature("array", [])];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbArray();
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: "array"};
  }
}

/**
 * The implementation of `Collection` function.
 * 
 * An alias for `Array`. See the function `Array`.
 */
export class Collection extends Array {
  constructor() {
    super();
    this.name = "Collection";
  }
}

/**
 * The implementation of `GetSourceAttrNames` function.
 * 
 * Returns an array containing the names of the attributes of a node, in the order that the attributes appear in the node.
 * 
 * Compare with the function `GetSourceInstanceMap` which returns a map of the keys (the attributes) and values for a node.
 * 
 * To enter an n path into the function, drag and drop the desired XML node folder from the Source Objects tab of the script component palette to the script to insert its qualified path at the location of your cursor, or enter its reference path manually. For more information, see the instructions on inserting source objects.
 */
export class GetSourceAttrNames extends Func {
  constructor() {
    super();
    this.name = "GetSourceAttrNames";
    this.module = "dict/array";
    this.signatures = [
      new Signature("array", [
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetSourceElementNames` function.
 * 
 * Returns an array containing the names of the simple sub-elements for a node in the order that the attributes appear in the node.
 * 
 * Compare with the function `GetSourceInstanceElementMap` which returns a map of a node.
 * 
 * To enter an n path into the function, drag and drop the desired XML node folder
 * from the Source Objects tab of the script component palette to the script
 * to insert its qualified path at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 */
export class GetSourceElementNames extends Func {
  constructor() {
    super();
    this.name = "GetSourceElementNames";
    this.module = "dict/array";
    this.signatures = [
      new Signature("array", [
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetSourceInstanceArray` function.
 * 
 * Returns an array containing the attribute's value from an element node. The value in the array is labeled with the attribute's name, and can be retrieved either by its index or by its name as in a dictionary data element.
 * 
 * As an alternative to this function, see `GetSourceInstanceMap`.
 * 
 * To enter an n path into the function, drag and drop the desired XML node folder from the Source Objects tab of the script component palette to the script to insert its qualified path at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 */
export class GetSourceInstanceArray extends Func {
  constructor() {
    super();
    this.name = "GetSourceInstanceArray";
    this.module = "dict/array";
    this.signatures = [
      new Signature("array", [
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetSourceInstanceElementArray` function.
 * 
 * Returns an array containing the sub-element's value from an element node. The value in the array is labeled with the name of the sub-element, and can be retrieved either by its index or by its name as in the dictionary data element.
 * 
 * As an alternative to this function, see `GetSourceInstanceElementMap`.
 * 
 * To enter an `n` path into the function, drag and drop the desired XML node folder from the Source Objects tab of the script component palette to the script to insert its qualified path at the location of your cursor, or enter its reference path manually. For more information, see the instructions on inserting source objects.
 */
export class GetSourceInstanceElementArray extends Func {
  constructor() {
    super();
    this.name = "GetSourceInstanceElementArray";
    this.module = "dict/array";
    this.signatures = [
      new Signature("array", [
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * Internal numeric evaluation of an array element for comparison purposes when sorting.
 */
type Evaluation = { eval: number; elem: RuntimeVal; };

/**
 * The implementation of `SortArray` function.
 * 
 * Sorts an array in-place. The return value is undefined and should be ignored (it's actually `null`).
 * 
 * In the first form, the second parameter (optional) specifies the sort order.
 * 
 * In the second form, for multi-dimentional arrays, the function sorts the array according to a zero-based index specified in the second parameter (required). In the second form, the third argument (optional) specifies the sort order.
 * 
 * The default sort order is ascending in both forms.
 * 
 * After the function returns, the array will be sorted in-place. If specified, it will be sorted according to the index.
 * 
 * Multiple sorting of the same array is possible by applying the `SortArray` function repeatedly.
 */
export class SortArray extends Func {
  constructor() {
    super();
    this.name = "SortArray";
    this.module = "dict/array";
    this.signatures = [
      new Signature("void", [
        new Parameter("array", "arrayToSort"),
        new Parameter("bool", "isAscending", false)
      ]),
      new Signature("void", [
        new Parameter("array", "arrayToSort"),
        new Parameter("number", "index"),
        new Parameter("bool", "isAscending", false)
      ])
    ];
    this.minArgs = 1;
    this.maxArgs = 3;
  } 

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`${this.name} can only be called on array data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    // comparison evaluation rules:
    // generally, toInt (applies across signatures):
    // - integers as-are
    // - booleans - true = 1, false = 0
    // - strings - try parsing to int, else 0 (order precedence)
    //    - plot twist: "-1337" throws:
    //      "Illegal operation: A boolean can only be compared to another boolean using the equals or not-equals operators. You need to convert it to a type for which the less-than operator is defined."
    //    - plot twist:  1 > ".1337" > toInt(true)
    // - null - 0-values (order precedence)
    // - arrays - 0-values (order precedence)
    // - dictionaries - 0-values (order precedence)
    // where applicable, order precedence applies
    // if descending, the array is reversed at the end

    const array = args[0] as JbArray;
    let isAscending = true;

    // empty array
    if(array.members.length === 0)
      return array;

    // SortArray(array, [isAscending])
    if(this.signature.params.length === 2) {
      // SortArray(array)
      if(args.length === 1)
        this.sort(array);
      // SortArray(array, isAscending)
      // SortArray(array, index, [isAscending])        
      else {
        // if args.length === 3, index becomes isAscending
        // the 3rd argument is ignored
        isAscending = this.toBool(args[1]);
        this.sort(array);
        // descending sort
        // POD: jitterbit messed it up for 1-dimensional arrays
        if(!isAscending)
          array.members.reverse();
      }
      return new JbNull();
    }

    // SortArray(array, index, [isAscending])

    // the converted number is floored if float
    const index = Math.floor(args[1].toNumber());

    // multi-dimensional array validation
    this.checkElements(array, index);

    // SortArray(array, index)
    if(args.length === 2)
      this.sort(array, index);
    // SortArray(array, index, isAscending)
    else {
      isAscending = args[2].toBool();
        this.sort(array, index);
        // descending sort
        // POD: jitterbit messed it up for multi-dimensional arrays too
        if(!isAscending)
          array.members.reverse();
    }
    return new JbNull();
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    const array = args[0] as JbArray;
    const members = array.members;

    switch (args.length) {
      case 1:
        this.signature = this.signatures[0];
        return;
      case 2:
      case 3:    
        // checks the first element and assumes things:
        // - type homogeneity - a multidimensional array
        // - converts the 2nd argument (index) to integer, only errors with dictionaries
        // - for all the inner arrays A, A[toInt(index)] exists, otherwise errors:
        // SortArray error, array index is out of range: <index>
        if (members[0].type === "array") {
          this.signature = this.signatures[1];
          return;
        }

        // empty array or non-array type
        this.signature = this.signatures[0];
        return;
      default:
        // TODO: this error is thrown by parser
        throw new RuntimeError(`Wrong number of arguments in SortArray(): number of arguments = ${args.length}, should be between 1 and 3`);
    }
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    const arrInfo = args[argIdx].typeExpr(env);
    // arrayToSort
    args[argIdx].checkReqArg(this.signatures[0].params[argIdx++], arrInfo.type);

    if(args.length === 2) {
      // isAscending or index
      const isAscInfo = args[argIdx].typeExpr(env);
      const type1 = this.signatures[0].params[argIdx].type;
      const type2 = this.signatures[1].params[argIdx].type;
      const secArgTypes = [type1, type2, "type", "unknown", "error"];
      if(isAscInfo.type === "unassigned") {
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
      }
      else if(!secArgTypes.includes(isAscInfo.type))
        args[argIdx].warning = `The type of argument is ${isAscInfo.type}, should be ${type1} or ${type2}.`;
    } else if (args.length === 3) {
      // index
      const idxInfo = args[argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signatures[1].params[argIdx++], idxInfo.type);
      // isAscending
      const isAscInfo = args[argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signatures[1].params[argIdx], isAscInfo.type);
    }
      
    return {type: this.signatures[0].returnType};
  }

  /**
   * Sorts the array members in-place and in ascending order.
   * @param array 
   * @param index 
   */
  private sort(array: JbArray, index?: number) {
    // not that much in-place
    const evaluations: Evaluation[] = index === undefined
    ? this.evalOneDimArray(array)
    : this.evalMultiDimArray(array, index);
    
    // hopefully preserves order?
    evaluations.sort((a: Evaluation, b: Evaluation): number => {
      if(a.eval === b.eval)
        return 0;
      return a.eval < b.eval ? -1 : 1;
    });

    // not close to in-place actually
    const result: RuntimeVal[] = [];
    for(const e of evaluations)
      result.push(e.elem);

    array.members = result;
  }
  
  /**
   * Produces a list of array members with their evaluation for sorintg comparisons.
   * @param array 
   * @returns 
   */
  private evalOneDimArray(array: JbArray): Evaluation[] {
    const result: Evaluation[] = [];
    
    for(const mem of array.members) {
      switch(mem.type) {
        case "number":
          result.push({
            eval: (mem as JbNumber).value,
            elem: mem
          });
          break;
        case "bool":
          result.push({
            eval: (mem as JbBool).toNumber(),
            elem: mem
          });
          break;
        case "string":
          result.push({
            eval: (mem as JbString).toNumber(),
            elem: mem
          });
          break;
        case "null":
        case "void":
        case "array":
        case "dictionary":
          result.push({
            eval: 0,
            elem: mem
          });
          break;
        default:
          throw `Unsupported array member type: ${mem.type}`;
      }
    }

    return result;
  }

  /**
   * Produces a list of array members with their evaluation for sorintg comparisons.
   * 
   * Assumes all the elements are arrays and the index is not out of bounds.
   * @param array 
   * @param index 
   * @returns 
   */
  private evalMultiDimArray(array: JbArray, index: number): Evaluation[] {
    const result: Evaluation[] = [];
    
    for(const mem of array.members as JbArray[]) {
      const value = mem.members[index];
      switch(value.type) {
        case "number":
          result.push({
            eval: (value as JbNumber).value,
            elem: mem
          });
          break;
        case "bool":
          result.push({
            eval: (value as JbBool).toNumber(),
            elem: mem
          });
          break;
        case "string":
          result.push({
            eval: (value as JbString).toNumber(),
            elem: mem
          });
          break;
        case "null":
        case "void":
        case "array":
        case "dictionary":
          result.push({
            eval: 0,
            elem: mem
          });
          break;
        default:
          throw `Unsupported array member type: ${value.type}`;
      }
    }

    return result;
  }

  /**
   * Converts any `RuntimeVal` to a boolean.
   * @param val 
   * @returns 
   */
  private toBool(val: RuntimeVal): boolean {
    switch (val.type) {
      case "number":
        return (val as JbNumber).toBool();
      case "bool":
        return (val as JbBool).toBool();
      case "string":
        // string2int2bool happens
        return (val as JbString).toBoolAsNumber();
      case "null":
      case "void":
        return false;
      case "array":
      case "dictionary":
        throw `[${this.name}] Transform Error: DE_TYPE_CONVERT_FAILED`;
      default:
        throw `[${this.name}] Unsupported argument type: ${val.type}`;
    }
  }

  /**
   * Throws if an element is not an array or the index is negative/out of bounds of any element.
   * @param array 
   * @param index 
   */
  private checkElements(array: JbArray, index: number): void {
    for(const elem of array.members) {
      if(elem.type !== "array")
        // POD: the orginal error:
        // SortArray error, array index is out of range: <index>
        throw `[${this.name}] The sorted array is expected to contain array elements only`;
      if(index < 0 || index >= (elem as JbArray).members.length)
        throw `[${this.name}] Array index is out of range: ${index}`;
    }
  }
}

/**
 * The implementation of `ReduceDimension` function.
 * 
 * Given a multi-dimensional array with `n` dimensions, the function returns an array with `n-1` dimensions. The lowest dimension of the input array will disappear, and their members will be collected to the next level dimension.
 */
export class ReduceDimension extends Func {
  constructor() {
    super();
    this.name = "ReduceDimension";
    this.module = "dict/array";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("array", [
        new Parameter("array", "arrayMultiD")
      ])
    ];
    this.signature = this.signatures[0];
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    // POD: the original error:
    // ReduceDimension failed, err:array dimension <2.
    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`ReduceDimension can only be called on array data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const array = args[0] as JbArray;
    if(array.members.length === 0)
      throw new RuntimeError("ReduceDimension failed, the array does not have enough dimensions for reduction (at least 2).");

    let dimension = 1;
    dimension = this.getDimension(array, dimension);

    // no nested arrays
    if (dimension === 1)
      throw new RuntimeError("ReduceDimension failed, the array does not have enough dimensions for reduction (at least 2).");

    this.checkDimensionality(array, dimension, 1);
    return this.reduce(array, dimension);
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }

  /**
   * Returns the array nesting level present in the array.
   * @param array 
   * @returns
   */
  private getDimension(array: JbArray, dim: number): number {
    // the first element defines uniform dimensionality
    const mem = array.members.at(0);
    if (mem !== undefined && mem.type === "array")
      return this.getDimension(array.members.at(0) as JbArray, ++dim);
    else 
      return dim;
  }

  /**
   * Validates for uniform array dimensions across all elements.
   * 
   * Throws if the array contains elements of varying dimensions.
   * @param array 
   * @param validDim 
   */
  private checkDimensionality(array: JbArray, validDim: number, dim: number) {
    const members = array.members;
    if(members.length === 0) {
      if(dim + 1 !== validDim) {
        throw new RuntimeError(`ReduceDimension failed, the array contains element ${array.toString()} of non-uniform dimensionality: ${dim}`);
      }
    }
    
    for(const mem of members) {
      const curDim = dim;
      if(mem.type === "array")
        this.checkDimensionality(mem as JbArray, validDim, ++dim);
      else {
        // POD: Jitterbit's implementation allows for certain dimensionality mismatches (at the cost of data loss)
        // example proof:
        // arr = {
        //   { "a", "b", "c"},
        //   { {1}, {2, "xd"} },
        //   { {3}, {4} },
        // };
        // arr = ReduceDimension(arr);
        //
        // results in: {{}, {1,2,xd}, {3,4}}
        // this implementation throws on any dimensionality mismatch

        if(dim !== validDim)
          throw new RuntimeError(`ReduceDimension failed, the array contains element '${mem.toString()}' of non-uniform dimensionality: ${dim}`);
      }
      // restore the shallow value
      dim = curDim;
    }
  }

  /**
   * Performs the dimensionality reduction.
   * @param array 
   * @param dim 
   */
  private reduce(array: JbArray, dim: number): JbArray {
    for(let idx = 0; idx < array.members.length; idx++) {
      // navigate to the inner elements
      if (dim > 2) {
        const inserts = this.reduce(array.members[idx] as JbArray, dim - 1);
        array.members[idx] = inserts;
      }
      else {
        // only arrays of simple value arrays here
        const newArr = new JbArray();
        for(const mem of array.members) {
          // array of simple values
          if(mem.type == "array") {
            for(const m of (mem as JbArray).members)
              newArr.members.push(m);
          }
          // a simple value
          else
            newArr.members.push(mem);
        }
        return newArr;
      }
    }
    return array;
  }
}
