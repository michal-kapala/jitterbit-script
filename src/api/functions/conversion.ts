import Scope from "../../runtime/scope";
import { JbBinary, JbBool, JbDate, JbNumber, JbString } from "../../runtime/types";
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
export class BinaryToHex extends Func {
  constructor() {
    super();
    this.name = "BinaryToHex";
    this.module = "conversion";
    this.signatures = [
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

  protected chooseSignature(args: RuntimeVal[]) {
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
export class BinaryToUUID extends Func {
  constructor() {
    super();
    this.name = "BinaryToUUID";
    this.module = "conversion";
    this.signatures = [
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

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Bool` function.
 * 
 * Converts any data type to a boolean value (true or false).
 * If the data is an integer or a floating-point number not equal to zero, the result is true (1).
 * 
 * The strings "true" and "T" return true independently of case ("TRUE", "t", and "True" all return true).
 * In all other cases, the result is false (0).
 */
export class Bool extends Func {
  constructor(){
    super();
    this.name = "Bool";
    this.module = "conversion";
    this.signatures = [
      new Signature("bool", [
        // parameter type and description from the docs is wrong
        new Parameter("type", "arg")  
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    
    // POD: standard conversion rules, no fancy exceptions
    return new JbBool(args[0].toBool());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Date` function.
 * 
 * Converts the argument to a date.
 * If the input is a string, it has to be formatted using one of the standard date formats
 * such as `"12/25/2018 12:30"`, `"2018-12-25"`, `"2018-12-25T12:30:00"`,
 * `"December 25, 2018"`, or `"DEC 25, 2018"`.
 * 
 * If the input string is not in one of the four
 * predefined date formats (`GeneralDate`, `LongDate`, `MediumDate`, or `ShortDate`)
 * that can be read by the `Date` function, it can be converted first to a standard format
 * by the `CVTDate` function. Hour, minute, and second are optional.
 * 
 * If the input is an integer or a double, the input is interpreted as the number of seconds from 12:00:00 AM of 1/1/1970 UTC, the start of the UNIX epoch.
 * 
 * Note that `Date(Long(Now())) == Now()`.
 * 
 * In this implementation, supported string formats that do not specify time will be timezone-affected.
 * 
 * For instance, `Date("12-12-2023")` will result in `2023-12-11 23:00:00.000` for `GMT+01:00` local timezone.
 */
export class DateFunc extends Func {
  constructor(){
    super();
    this.name = "Date";
    this.module = "conversion";
    this.signatures = [
      new Signature("date", [
        new Parameter("type", "arg")  
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    switch (args[0].type) {
      case "bool":
        throw new Error(`Cannot convert a ${args[0].type} to a date object`);
      case "number":
        // 'the input is interpreted as the number of seconds' - epoch timestamp (UTC-based)
        return new JbDate(new Date(Math.round((args[0] as JbNumber).value) * 1000));
      case "string":
        // POD: JbDate.parse supports the JS formats rather than JB's
        return JbDate.parse(args[0] as JbString);
      case "date":
        return args[0] as JbDate;
      case "array":
      case "binary":
      case "dictionary":
      default:
        throw new Error(`Cannot convert ${args[0].type} object to a date object`);
    }
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Double` function.
 * 
 * A best-effort is made to convert the argument to a double.
 * If the data type being evaluated cannot be converted to a double, the function returns 0.
 * If the data being evaluated is a date or time record, the result is
 * the number of seconds from 12:00:00 AM of 1/1/1970 UTC (the start of the UNIX epoch).
 */
export class Double extends Func {
  constructor(){
    super();
    this.name = "Double";
    this.module = "conversion";
    this.signatures = [
      new Signature("number", [
        new Parameter("type", "arg")  
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    try {
      return new JbNumber(args[0].toNumber());
    } catch(e) {
      console.error(e);
      return new JbNumber();
    }
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Float` function.
 * 
 * A best-effort is made to convert the argument to a float.
 * If the data type being evaluated cannot be converted to a float the function returns 0.
 * If the data being evaluated is a date or time record, the result is
 * the number of seconds from 12:00:00 AM of 1/1/1970 UTC (the start of the UNIX epoch).
 */
export class Float extends Func {
  constructor(){
    super();
    this.name = "Float";
    this.module = "conversion";
    this.signatures = [
      new Signature("number", [
        new Parameter("type", "arg")  
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    try {
      return new JbNumber(args[0].toNumber());
    } catch(e) {
      console.error(e);
      return new JbNumber();
    }
  }
  protected chooseSignature(args: RuntimeVal[]) {
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
export class HexToBinary extends Func {
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

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `HexToString` function.
 * 
 * Converts a hex-string to a string value. The resulting value will contain the characters represented by each pair of characters in the input string. The input string is case-insensitive. As the input characters are hex, the character pairs of the input string must be limited to the range "00" through "FF".
 * 
 * To use UTF-8 for the outgoing string value, set `jitterbit.scripting.hex.enable_unicode_support` to `true` upstream of this function when using agent versions 10.70.1 or later or 11.8.1 or later.
 * 
 * This is the reverse of the function `StringToHex`.
 */
export class HexToString extends Func {
  constructor() {
    super();
    this.name = "HexToString";
    this.module = "conversion";
    this.signatures = [
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
    // originally UTF-8 encoding is opt-in, the same goes for this implementation
    let enableUtf8 = scope.lookupVar("$jitterbit.scripting.hex.enable_unicode_support");
    if(enableUtf8.type !== "bool")
      enableUtf8 = new JbBool(false);

    if((enableUtf8 as JbBool).value) {
      let bin = JbBinary.fromHex(hex.value);
      bin = JbBinary.fromHex(bin.bytes2utf8());
      return new JbString(Buffer.from(bin.value).toString("utf-8"));
    }
    else {
      let bin = JbBinary.fromHex(hex.value);
      return new JbString(Buffer.from(bin.value).toString());
    }
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Int` function.
 * 
 * A best-effort is made to convert the argument to an integer.
 * If the data type being evaluated cannot be converted to an integer, the function returns 0.
 * If the data being evaluated is a date or time record, the result is
 * the number of seconds from 12:00:00 AM of 1/1/1970 UTC (the start of the UNIX epoch).
 */
export class Int extends Func {
  constructor() {
    super();
    this.name = "Int";
    this.module = "conversion";
    this.signatures = [
      new Signature("number", [
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // floating-point values obtained from
    // number-number and string-number conversions are rounded
    try {
      return new JbNumber(Math.round(args[0].toNumber()));
    } catch(e) {
      console.error(e);
      return new JbNumber();
    }
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Long` function.
 * 
 * A best-effort is made to convert the argument to a long integer.
 * If the data type being evaluated cannot be converted to a long integer, the function returns 0.
 * If the data being evaluated is a date or time record, the result is
 * the number of seconds from 12:00:00 AM of 1/1/1970 UTC (the start of the UNIX epoch).
 */
export class Long extends Func {
  constructor() {
    super();
    this.name = "Long";
    this.module = "conversion";
    this.signatures = [
      new Signature("number", [
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // floating-point values obtained from
    // number-number and string-number conversions are rounded
    try {
      return new JbNumber(Math.round(args[0].toNumber()));
    } catch(e) {
      console.error(e);
      return new JbNumber();
    }
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `String` function.
 * 
 * Converts any data type to a string. If the data being evaluated is already a string, no conversion takes place.
 * 
 * If the data type is a date or time record, the date is returned in ISO 8601 format (yyyy-mm-dd HH:MM:SS).
 * For other date formats, use the functions `CVTDate` or `FormatDate`.
 * 
 * Binary data that contains null bytes is returned as a string representing the hexadecimal values of each byte, just as if `BinaryToHex` had been called.
 * If the binary data contains no null bytes, then a string representation is returned with the assumption that the bytes represent a UTF-8-encoded string.
 * If you always want a hexadecimal representation, use the `BinaryToHex` function instead.
 * 
 * For a boolean value, the strings "1" or "0" are returned.
 */
export class String extends Func {
  constructor() {
    super();
    this.name = "String";
    this.module = "conversion";
    this.signatures = [
      new Signature("string", [
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // POD: standard conversion rules, no fancy exceptions
    // e.g. binary type is always returned as a hex string
    return new JbString(args[0].toString());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `StringToHex` function.
 * 
 * Converts a string value to a string representing the hexadecimal values of each byte.
 * The resulting string will be all lowercase.
 * 
 * To use UTF-8 for the incoming string value, set `jitterbit.scripting.hex.enable_unicode_support` to true upstream of this function when using agent versions 10.70.1 or later or 11.8.1 or later.
 * 
 * Warning: this function has reversed logic regarding UTF-8, set `jitterbit.scripting.hex.enable_unicode_support` to opt out of UTF-8 (original Jitterbit bug).
 * 
 * This is the reverse of the function `HexToString`.
 */
export class StringToHex extends Func {
  constructor() {
    super();
    this.name = "StringToHex";
    this.module = "conversion";
    this.signatures = [
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
    // POD: originally the argument is implicitly converted to string, the docs state undefined behaviour
    if(args[0].type !== this.signature.params[0].type)
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    const str = args[0] as JbString;

    // originally UTF-8 encoding is opt-in, the same goes for this implementation
    let enableUtf8 = scope.lookupVar("$jitterbit.scripting.hex.enable_unicode_support");
    if(enableUtf8.type !== "bool")
      enableUtf8 = new JbBool(false);

    // POD: originally if utf-8 is disabled, a unicode string is returned
    // this implementation could reverse this logic as it doesnt make sense
    // however a bugfix would be a breaking change for the existing code
    // currently the behaviour is mimicked
    const encoding = !(enableUtf8 as JbBool).value ? "utf-8": "ascii";
    return new JbString(Buffer.from(str.value, encoding).toString("hex").toLowerCase());
  }

  protected chooseSignature(args: RuntimeVal[]) {
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
export class UUIDToBinary extends Func {
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

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
