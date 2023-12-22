import { JbBinary, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `BinaryToHex` function.
 * 
 * Converts a binary value to a string representing the hexadecimal values of each byte. The resulting string will be all lowercase.
 * The result of this function call is undefined if the argument is not a binary value.
 * 
 * This is the reverse of the function `HexToBinary`.
 */
export class BinaryToHexFunc extends Func {
  constructor() {
    super();
    this.name = "BinaryToHex";
    this.module = "conversion";
    this.signatures = [
      // the signature's return type in the Jitterbit docs is wrong
      new Signature("string", [
        new Parameter("binary", "arg")  
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);
    
    // TODO: this error should be thrown by type checker (too)
    if(args[0].type !== this.signature.params[0].type)
      throw new Error(`${this.name} failed, the argument must be binary data.`);

    const bin = args[0] as JbBinary;
    return new JbString(bin.toString());
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `BinaryToUUID` function.
 * 
 * Converts a 16-byte binary value to a string in the standard UUID format.
 * The resulting string will always be lowercase.
 * 
 * This is the reverse of the function `UUIDToBinary`.
 */
export class BinaryToUUIDFunc extends Func {
  constructor() {
    super();
    this.name = "BinaryToUUID";
    this.module = "conversion";
    this.signatures = [
      // the signature's return type in the Jitterbit docs is wrong
      new Signature("string", [
        new Parameter("binary", "arg")  
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[]) {
    this.chooseSignature(args);

    // TODO: this error should be thrown by type checker (too)
    if(args[0].type !== this.signature.params[0].type)
      throw new Error(`${this.name} failed, the argument must be binary data.`);

    return new JbString((args[0] as JbBinary).toUUID());
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `HexToBinary` function.
 * 
 * Converts a hex-string to a binary value.
 * The resulting value will contain the bytes represented by each pair of characters in the input string.
 * The input string is case-insensitive.
 * 
 * This is the reverse of the function `BinaryToHex`.
 */
export class HexToBinaryFunc extends Func {
  constructor() {
    super();
    this.name = "HexToBinary";
    this.module = "conversion";
    this.signatures = [
      // the signature's return type in the Jitterbit docs is wrong
      new Signature("binary", [
        new Parameter("string", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[]) {
    this.chooseSignature(args);
    // TODO: this error should be thrown by type checker (too)
    // POD: originally the argument is implicitly converted to string
    if(args[0].type !== this.signature.params[0].type)
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);
    const hex = args[0] as JbString;
    return JbBinary.fromHex(hex.value);
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}
