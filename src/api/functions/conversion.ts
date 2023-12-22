import Scope from "../../runtime/scope";
import { JbBinary, JbBool, JbString } from "../../runtime/types";
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

  call(args: RuntimeVal[], scope: Scope) {
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

  call(args: RuntimeVal[], scope: Scope) {
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
  
  call(args: RuntimeVal[], scope: Scope) {
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

/**
 * The implementation of `HexToString` function.
 * 
 * Converts a hex-string to a string value. The resulting value will contain the characters represented by each pair of characters in the input string. The input string is case-insensitive. As the input characters are hex, the character pairs of the input string must be limited to the range "00" through "FF".
 * 
 * This implementation always uses UTF-8 encoding, the first successful call will set `$jitterbit.scripting.hex.enable_unicode_support` to `true`.
 * 
 * This is the reverse of the function `StringToHex`.
 */
export class HexToStringFunc extends Func {
  constructor() {
    super();
    this.name = "HexToString";
    this.module = "conversion";
    this.signatures = [
      // the signature's return type in the Jitterbit docs is wrong
      new Signature("string", [
        new Parameter("string", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    
    // TODO: this error should be thrown by type checker (too)
    // POD: originally the argument is implicitly converted to string
    if(args[0].type !== this.signature.params[0].type)
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const hex = args[0] as JbString;
    // POD: originally UTF-8 encoding is opt-in
    // this implementation always uses UTF-8, the first successful call enables it globally.
    let enableUtf8 = scope.lookupVar("$jitterbit.scripting.hex.enable_unicode_support");
    if(enableUtf8.type !== "bool" || !(enableUtf8 as JbBool).value)
      enableUtf8 = new JbBool(true);

    let bin = JbBinary.fromHex(hex.value);
    bin = JbBinary.fromHex(bin.bytes2utf8());
    return new JbString(Buffer.from(bin.value).toString("utf-8"));
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `UUIDToBinary` function.
 * 
 * Converts a UUID string to a binary value containing the corresponding bytes.
 * The size of the input string must be 36 characters.
 * 
 * The format of the input should be `nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn` where each pair (`nn`)
 * is the hexadecimal representation of the corresponding byte.
 * 
 * The case of the input string does not matter. The returned binary value is 16 bytes long.
 * 
 * This is the reverse of the function `BinaryToUUID`.
 */
export class UUIDToBinaryFunc extends Func {
  constructor() {
    super();
    this.name = "UUIDToBinary";
    this.module = "conversion";
    this.signatures = [
      new Signature("binary", [
        new Parameter("string", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    
    // TODO: this error should be thrown by type checker (too)
    // POD: originally the argument is implicitly converted to string
    // original error:
    // Invalid UUID string 'x'. A UUID string has to be 36 characters long.
    if(args[0].type !== this.signature.params[0].type)
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const uuid = args[0] as JbString;
    return JbBinary.fromUUID(uuid.value);
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}
