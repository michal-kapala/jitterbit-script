import { Array, JbBool, JbNumber, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `Array` function.
 * 
 * Creates an empty array. Though arrays don't need to be initialized prior to use, this method can be used to be explicit or to reset an already-existing array. Arrays are zero-based, and values are retrieved using indexes.
 */
export class ArrayFunc extends Func {
  constructor() {
    super();
    this.name = "Array";
    this.module = "dict/array";
    this.signatures = [new Signature("array", [])];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);
    return new Array();
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Collection` function.
 * 
 * An alias for `Array`. See the function `Array`.
 */
export class CollectionFunc extends ArrayFunc {
  constructor() {
    super();
    this.name = "Collection";
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
export class SortArrayFunc extends Func  {
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

  call(args: RuntimeVal[]): RuntimeVal {
    // TODO: this error should be thrown by type checker (too)
    if(args[0].type !== "array")
      throw new Error(`SortArray can only be called on array data elements. The 'array' argument is of type ${args[0].type}`);

    this.chooseSignature(args);
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

    const array = args[0] as Array;
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
      return array;
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

    return array;
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    const array = args[0] as Array;
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
        throw new Error(`Wrong number of arguments in SortArray(): number of arguments = ${args.length}, should be between 1 and 3`);
    }
  }

  /**
   * Sorts the array members in-place and in ascending order.
   * @param array 
   * @param index 
   */
  private sort(array: Array, index?: number) {
    // not that much in-place
    let evaluations: Evaluation[] = index === undefined
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
  private evalOneDimArray(array: Array): Evaluation[] {
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
  private evalMultiDimArray(array: Array, index: number): Evaluation[] {
    const result: Evaluation[] = [];
    
    for(const mem of array.members as Array[]) {
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
  private checkElements(array: Array, index: number): void {
    for(const elem of array.members) {
      if(elem.type !== "array")
        // POD: the orginal error:
        // SortArray error, array index is out of range: <index>
        throw `[${this.name}] The sorted array is expected to contain array elements only`;
      if(index < 0 || index >= (elem as Array).members.length)
        throw `[${this.name}] Array index is out of range: ${index}`;
    }
  }
}
