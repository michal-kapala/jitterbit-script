import Scope from "../../runtime/scope";
import { JbBool, JbNumber, JbString } from "../../runtime/types";
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

/**
 * The implementation of `Format` function.
 * 
 * Returns a string in the format specified by a format string.
 * 
 * The format specification is the same as used in the *Date and Time Functions*;
 * see its section on format strings.
 * It is similar to the standard C library `printf` format specification.
 * 
 * This function can be used to set the output format for a target.
 * It is useful when Jitterbit's default output format for a data type
 * (such as date or double) is not as desired.
 * The call to the `Format` function must be the last call in a mapping formula
 * to have it be the mapped value.
 */
export class Format extends Func {
  constructor() {
    super();
    this.name = "Format";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "formatStr"),
        new Parameter("type", "de")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Index` function.
 * 
 * Returns the position of a sub-string within a string.
 * 
 * In cases where the sub-string appears more than once in the main string,
 * the third argument (`n`) is used to determine which specific instance of the sub-string
 * is of interest.
 * 
 * - If `n < 0`, the instance counting starts from the end of the main string.
 * - If `|n| > 0` the maximum number of times the sub-string appears in the main string,
 * the function returns -1.
 * 
 * Otherwise, the function returns the sub-string's first character's position within
 * the main string (starting at position 0).
 * 
 * Special cases to consider:
 * 
 * - `n = 0` returns the same result as `n = 1`
 * 
 * - If `subStr` is an empty string (""):
 * 
 *      - `n >= 0` always returns 0
 * 
 *      - `n < 0` always returns `Length(str)`
 */
export class Index extends Func {
  constructor() {
    super();
    this.name = "Index";
    this.module = "string";
    this.signatures = [
      new Signature("number", [
        new Parameter("string", "str"),
        new Parameter("string", "subStr"),
        new Parameter("number", "n", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 3;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `IsValidString` function.
 * 
 * Returns true if each character in a string is valid.
 * Valid characters are ASCII codes 32 through 126 inclusive and any of linefeed (LF),
 * carriage return (CR), or tab (TAB) characters.
 */
export class IsValidString extends Func {
  constructor() {
    super();
    this.name = "IsValidString";
    this.module = "string";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "str"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversion
    const str = args[0].toString();
    for(const char of str) {
      if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126)
        continue;
      if(char.charCodeAt(0) === 9 || char.charCodeAt(0) === 10 || char.charCodeAt(0) === 13)
        continue;
      return new JbBool(false);
    }
    return new JbBool(true);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Left` function.
 * 
 * Returns `n` characters of a string, counting from the left (the beginning) of a string.
 * 
 * See also the `Mid` and `Right` functions.
 */
export class Left extends Func {
  constructor() {
    super();
    this.name = "Left";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("number", "n"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    return new JbString(
      args[0].toString().substring(0, args[1].toNumber())
    );
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `LPad` function.
 * 
 * Adds spaces to the left (the beginning) of a string until the string contains `n` characters.
 * Strings containing `n` or more characters are truncated to `n` characters.
 * 
 * `LPad(str, -n)` is the same as `RPad(str, n)`. See the `RPad` function.
 */
export class LPad extends Func {
  constructor() {
    super();
    this.name = "LPad";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("number", "n"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    const str = args[0].toString();
    const n = args[1].toNumber();
    if(str.length >= n)
      return new JbString(str.substring(0, n));

    let result = str;
    for(let i = 0; i < n - str.length; i++)
      result = " " + result;
    return new JbString(result);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `LPadChar` function.
 * 
 * Adds a padding character to the left (the beginning) of a string until the string
 * contains `n` characters.
 * Strings containing `n` or more characters are truncated to `n` characters.
 * 
 * `LPadChar(str, " ", n)` is the same as `LPad(str, n)`. See the `LPad` function.
 */
export class LPadChar extends Func {
  constructor() {
    super();
    this.name = "LPadChar";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("string", "padChar"),
        new Parameter("number", "n"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    const str = args[0].toString();
    const char = args[1].toString();
    const n = args[2].toNumber();

    if(str.length >= n)
      return new JbString(str.substring(0, n));

    if(char === "")
      return new JbString(str);

    let result = str;
    for(let i = 0; i < n - str.length; i++)
      result = char[0] + result;

    return new JbString(result);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `LTrim` function.
 * 
 * Removes whitespace (spaces, tabs) from the left (the beginning) of a string
 * and returns the remaining characters.
 */
export class LTrim extends Func {
  constructor() {
    super();
    this.name = "LTrim";
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
    // implicit conversions
    return new JbString(args[0].toString().trimStart());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `LTrimChars` function.
 * 
 * Removes any leading characters in a string from the left (the beginning) that match those in
 * the trimming characters and returns the remaining characters.
 * 
 * This function tests each leading character of a string, beginning on the left edge, and
 * sees if it is found in the trim characters.
 * If it does, it is removed, and the process repeated until there is no longer a match.
 * 
 * This can be used to trim characters other than the default whitespace characters,
 * such as trimming leading colons.
 * 
 * See also the `RTrimChars` and `TrimChars` functions.
 */
export class LTrimChars extends Func {
  constructor() {
    super();
    this.name = "LTrimChars";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("string", "trimChars")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    const str = args[0].toString();
    const trimChars = args[1].toString();
    let strIdx = 0;

    outer:
    for(; strIdx < str.length; strIdx++) {
      for(let charIdx = 0; charIdx < trimChars.length; charIdx++) {
        if(str[strIdx] === trimChars[charIdx])
          continue outer;
      }
      break;
    }
    return new JbString(str.substring(strIdx));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

export class Mid extends Func {
  constructor() {
    super();
    this.name = "Mid";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("number", "m"),
        new Parameter("number", "n"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    return new JbString(
      args[0].toString().substring(args[1].toNumber(), args[2].toNumber())
    );
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
