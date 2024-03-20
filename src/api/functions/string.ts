import { RuntimeError, UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbArray, JbBool, JbNumber, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypedIdentifier, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
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

    // empty strings dont match, even on an empty string
    const substr = args[1].toString();
    if(substr === "")
      return new JbNumber(0);

    // POD: this implementation does not support overlapping matches
    // e.g. CountSubString("aaaaaaa", "aa") will return 3, originally 6
    const matches = [...args[0].toString().matchAll(
      // escaping
      new RegExp(substr.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')
    )];
    
    return new JbNumber(matches.length);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // subStr
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initalized.`
    }
    return {type: this.signature.returnType};
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
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // formatStr
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // de
    info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`
    }
    return {type: this.signature.returnType};
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
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // subStr
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    if(args.length > 2) {
      // n
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // n
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `LPad` function.
 * 
 * Adds spaces to the left (the beginning) of a string until the string contains `n` characters.
 * Strings containing `n` or more characters are truncated to `n` characters.
 * 
 * ~~`LPad(str, -n)` is the same as `RPad(str, n)`.~~ See the `RPad` function.
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // n
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // padChar
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // n
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // trimChars
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Mid` function.
 * 
 * Returns a portion of a string, starting with the character at position `m` for a length
 * of `n` characters.
 * 
 * See also the `Left` and `Right` functions.
 */
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // m
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // n
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `ParseURL` function.
 * 
 * Parses a URL string and returns an array of decoded parameter values.
 * ~~The values are tagged so that they can be retrieved either by index or by field name.~~
 * ~~When retrieving values from the result, the case of a field name is ignored.~~
 * 
 * See also the `URLDecode` and `URLEncode` functions.
 * 
 * **Note**: This implementation returns an empty array if the URL is invalid.
 * Only index-based member access is supported.
 */
export class ParseURL extends Func {
  constructor() {
    super();
    this.name = "ParseURL";
    this.module = "string";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "url")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    const urlStr = args[0].toString();
    const result = new JbArray();
    // URL.canParse was added in 2023
    // see: https://github.com/nodejs/node/pull/47179
    try {
      const url = new URL(urlStr);
      for(const param of url.searchParams)
        result.members.push(new JbString(decodeURIComponent(param[1])));
    }
    catch(e) {
      throw new RuntimeError(`[${this.name}] URL parsing error: '${urlStr}'`);
    }
    return result;  
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Quote` function.
 * 
 * Places a string in single quotes and returns the result.
 * Embedded single quotes are not escaped.
 */
export class Quote extends Func {
  constructor() {
    super();
    this.name = "Quote";
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
    return new JbString(`'${args[0].toString()}'`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
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
 * The implementation of `RegExMatch` function.
 * 
 * Matches a regular expression with an input string, stores the marked sub-expressions
 * in variables, and returns the number of matches.
 * 
 * Returns the total number of marked sub-expressions (which could be more or less than
 * the number of variables actually supplied).
 * Any additional matches that exceed the number of variables supplied are discarded.
 * If there are no matches, `-1` is returned.
 * 
 * ~~The regular expression follows the *Boost* regular expression library syntax.~~
 * It is a variation of the Perl regular expression syntax.
 * 
 * Unicode characters, including symbols such as emoji, must be matched using their
 * literal characters and not using Unicode escape sequences.
 * For example, the range [😀-🤯] (`U+1F600` to `U+1F92F`) successfully captures the 🤔 (`U+1F914`) symbol in between.
 * 
 * See also the `RegExReplace` function.
 * 
 * This implementation uses JavaScript regex syntax, which should be in major part
 * compatible with the original *Boost* dialect.
 * 
 * The first match is used for variable assignments, subsequent capture groups
 * are assigned as values.
 * 
 * Supports up to 100-argument calls.
 */
export class RegExMatch extends Func {
  constructor() {
    super();
    this.name = "RegExMatch";
    this.module = "string";
    this.signatures = [
      new Signature("number", [
        new Parameter("string", "str"),
        new Parameter("string", "exp"),
        // the docs type is wrong, these are global variable names
        new Parameter("string", "var", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 100;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    const matches = [...(args[0] as JbString).toString().matchAll(
      new RegExp((args[1] as JbString).toString(), 'g')
    )];

    if(matches.length == 0)
      return new JbNumber(-1);

    if(args.length > 2) {
      // POD: the original impl skips the first match
      // for the example:
      // result = RegExMatch("[abc]", "(\\[)(.*)(\\])", "dummy", "value");
      // the agent performs: $dummy = "["; $value = "abc"; (returns 3)
      // this impl performs: $dummy = "[abc]"; $value = "["; (returns 4)
      let matchIdx = 0;
      for(let idx = 2; idx < args.length; idx++) {
        if(matchIdx < matches[0].length) {
          scope.assignVar(`$${args[idx].toString()}`, new JbString(matches[0][matchIdx]))
          matchIdx++;
        }
        else break;
      }
    }
    return new JbNumber(matches[0].length);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // exp
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    if(args.length > 2) {
      // var
      for(argIdx = 2; argIdx < args.length; argIdx++) {
        info = args[argIdx].typeExpr(env);
        args[argIdx].checkReqArg(
          {
            ...this.signature.params[2],
            name: this.signature.params[2].name + (argIdx - 1)
          },
          info.type
        );
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `RegExReplace` function.
 * 
 * Replaces all sub-strings in a string that match an expression, using a specifed format
 * to replace each sub-string.
 * Any sections of the string that do not match the expression are passed through
 * to the returned string unchanged.
 * 
 * ~~The regular expression follows the Boost regular expression library syntax.~~
 * It is a variation of the Perl regular expression syntax.
 * 
 * Unicode characters, including symbols such as emoji, must be matched using
 * their literal characters and not using Unicode escape sequences.
 * For example, the range [😀-🤯] (`U+1F600` to `U+1F92F`) successfully captures
 * the 🤔 (`U+1F914`) symbol in between.
 * 
 * The format string follows the Boost-Extended Format String Syntax.
 * If the format string is an empty string (`""`) then a match produces
 * no result for that sub-string.
 * 
 * See also the `RegExMatch` function.
 */
export class RegExReplace extends Func {
  constructor() {
    super();
    this.name = "RegExReplace";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("string", "exp"),
        new Parameter("string", "format"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // exp
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // format
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Replace` function.
 * 
 * Searches a string for sub-strings matching the `old` argument and replaces a matching
 * sub-string with the `new` argument.
 * 
 * For more complex search and replace operations, see the `RegExReplace` function.
 */
export class Replace extends Func {
  constructor() {
    super();
    this.name = "Replace";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("string", "old"),
        new Parameter("string", "new")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 3;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    const old = args[1].toString();
    if(old === "")
      return new JbString(args[0].toString());

    return new JbString(
      args[0].toString().replaceAll(
        old,
        args[2].toString()
      )
    );
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // old
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // new
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Right` function.
 * 
 * Returns `n` characters of a string, counting from the right (the end) of a string.
 * 
 * See also the `Left` and `Mid` functions.
 */
export class Right extends Func {
  constructor() {
    super();
    this.name = "Right";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("number", "n")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    let str = args[0].toString();

    return new JbString(
      str.substring(str.length - args[1].toNumber(), str.length)
    );
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // n
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `RPad` function.
 * 
 * Adds spaces to the right (the end) of a string until the string contains `n` characters.
 * Strings containing `n` or more characters are truncated to `n` characters.
 * 
 * ~~`RPad(str, -n)` is the same as `LPad(str, n)`.~~ See the `LPad` function.
 */
export class RPad extends Func {
  constructor() {
    super();
    this.name = "RPad";
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
      return new JbString(str.substring(str.length - n, str.length));

    let result = str;
    for(let i = n; i > str.length; i--)
      result = result + " ";
    return new JbString(result);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // n
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `RPadChar` function.
 * 
 * Adds a padding character to the right (the end) of a string until the string contains
 * `n` characters. Strings containing `n` or more characters are truncated to `n` characters.
 * 
 * `RPadChar(str, " ", n)` is the same as `RPad(str, n)`. See the `RPad` function.
 */
export class RPadChar extends Func {
  constructor() {
    super();
    this.name = "RPadChar";
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
      return new JbString(str.substring(str.length - n, str.length));

    if(char === "")
      return new JbString(str);

    let result = str;
    for(let i = n; i > str.length; i--)
      result = result + char[0];

    return new JbString(result);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // padChar
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // n
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `RTrim` function.
 * 
 * Removes whitespace (spaces, tabs) from the right (the end) of a string
 * and returns the remaining characters.
 */
export class RTrim extends Func {
  constructor() {
    super();
    this.name = "RTrim";
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
    return new JbString(args[0].toString().trimEnd());
  }

  protected chooseSignature(args: RuntimeVal[]) {
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
 * The implementation of `RTrimChars` function.
 * 
 * Removes any trailing characters in a string from the end that match those in
 * the trimming characters and returns the remaining characters.
 * 
 * This function tests each trailing character of a string, beginning on the right edge,
 * and sees if it is found in the trim characters.
 * If it does, it is removed, and the process repeated until there is no longer a match.
 * 
 * This can be used to trim characters other than the default whitespace characters,
 * such as trimming trailing colons.
 * 
 * See also the `LTrimChars` and `TrimChars` functions.
 */
export class RTrimChars extends Func {
  constructor() {
    super();
    this.name = "RTrimChars";
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
    let str = args[0].toString();
    const trimChars = args[1].toString();
    let strIdx = str.length - 1;

    outer:
    for(; strIdx >= 0; strIdx--) {
      for(let charIdx = 0; charIdx < trimChars.length; charIdx++) {
        if(str[strIdx] === trimChars[charIdx])
          continue outer;
      }
      break;
    }
    return new JbString(str.substring(0, strIdx + 1));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // trimChars
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Split` function.
 * 
 * Splits a string using a delimiter string, returning the result as an array.
 * 
 * Returns the result in an array of size equal to the number of delimiters plus one.
 * If the expression ends with the delimiter, the array size is equal to
 * the number of delimiters (the last empty value is ignored).
 * If the string contains no delimiters, an array of size one is returned containing
 * the original string.
 */
export class Split extends Func {
  constructor() {
    super();
    this.name = "Split";
    this.module = "string";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "str"),
        new Parameter("string", "delimiter")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    let str = args[0].toString();
    const delimiter = args[1].toString();
    const result = new JbArray();

    for(const s of str.split(delimiter))
      result.members.push(new JbString(s));
    
    if((result.members[result.members.length - 1] as JbString).value === "")
      result.members.pop();

    return result;
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // delimiter
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `SplitCSV` function.
 * 
 * Splits a CSV-formatted string and returns an array with the individual column values.
 * 
 * By default, the delimiter is a comma (`,`) and the string qualifier is a double quote (`"`).
 * This can be changed by specifying the optional second and third arguments respectively.
 */
export class SplitCSV extends Func {
  constructor() {
    super();
    this.name = "SplitCSV";
    this.module = "string";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "str"),
        // actual union with int
        new Parameter("string", "delimiter", false, new JbString(",")),
        // actual union with int
        new Parameter("string", "qualifier", false, new JbString('"'))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 3;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    if(args.length > 1) {
      // delimiter
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
      // supports numeric ASCII values
      if(info.type === "number")
        args[argIdx].warning = undefined;
      if(args.length > 2) {
        // qualifier
        info = args[++argIdx].typeExpr(env);
        args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
        // supports numeric ASCII values
        if(info.type === "number")
          args[argIdx].warning = undefined;
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `StringLength` function.
 * 
 * Returns the length of a string.
 * 
 * The function returns an array if the argument is an array, with each element
 * of the returned array the length of the corresponding element of the argument array.
 * The `Length` function returns the length of an array rather than the length
 * of the individual elements.
 */
export class StringLength extends Func {
  constructor() {
    super();
    this.name = "StringLength";
    this.module = "string";
    this.signatures = [
      new Signature("number", [
        new Parameter("string", "str")
      ]),
      new Signature("array", [
        new Parameter("array", "arr")
      ])
    ];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    if(args[0].type === this.signatures[1].params[0].type) {
      const arr = args[0] as JbArray;
      const result = new JbArray();
      // POD: converts nested arrays to strings, does not traverse
      // implicit conversions
      for(const mem of arr.members)
        result.members.push(new JbNumber(mem.toString().length))
      return result;
    }
    // implicit conversion
    else
      return new JbNumber(args[0].toString().length);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 0 : 1];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    let sigIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signatures[sigIdx].params[argIdx], info.type);
    if(info.type === "array") {
      args[argIdx].warning = undefined;
      sigIdx = 1;
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `ToLower` function.
 * 
 * Converts all ASCII uppercase characters (A through Z, ASCII 65 through 90)
 * in a string to lowercase.
 */
export class ToLower extends Func {
  constructor() {
    super();
    this.name = "ToLower";
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
    return new JbString(args[0].toString().toLowerCase());
  }

  protected chooseSignature(args: RuntimeVal[]) {
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
 * The implementation of `ToProper` function.
 * 
 * Converts a string to proper case (the first letter of every word being capitalized).
 * This is distinct from title case, which only capitalizes selected and longer words
 * in a string.
 */
export class ToProper extends Func {
  constructor() {
    super();
    this.name = "ToProper";
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
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
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
 * The implementation of `ToUpper` function.
 * 
 * Converts all ASCII lowercase characters (a through z, ASCII 97 through 122) in a string
 * to uppercase.
 */
export class ToUpper extends Func {
  constructor() {
    super();
    this.name = "ToUpper";
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
    return new JbString(args[0].toString().toUpperCase());
  }

  protected chooseSignature(args: RuntimeVal[]) {
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
 * The implementation of `Trim` function.
 * 
 * Removes whitespace from the beginning and end of a string and returns the
 * remaining characters.
 */
export class Trim extends Func {
  constructor() {
    super();
    this.name = "Trim";
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
    return new JbString(args[0].toString().trim());
  }

  protected chooseSignature(args: RuntimeVal[]) {
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
 * The implementation of `TrimChars` function.
 * 
 * Removes any leading or trailing characters in a string that match those
 * in the trimming characters and returns the remaining characters.
 * 
 * This function tests each leading and trailing character of a string and sees if
 * it is found in the trim characters.
 * If it does, it is removed, and the process repeated until there are no longer any matches.
 * 
 * This can be used to trim characters other than the default whitespace characters,
 * such as trimming colons.
 * 
 * See also the `LTrimChars` and `RTrimChars` functions.
 */
export class TrimChars extends Func {
  constructor() {
    super();
    this.name = "TrimChars";
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

    const start = strIdx;
    strIdx = str.length - 1;

    outer:
    for(; strIdx >= 0; strIdx--) {
      for(let charIdx = 0; charIdx < trimChars.length; charIdx++) {
        if(str[strIdx] === trimChars[charIdx])
          continue outer;
      }
      break;
    }

    return new JbString(str.substring(start, strIdx + 1));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // trimChars
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Truncate` function.
 * 
 * Deletes `firstChars` characters from the left (the beginning) and `lastChars` characters
 * from the right (the end) of a string and returns the remaining string.
 * 
 * See also the `Left` and `Right` functions.
 */
export class Truncate extends Func {
  constructor() {
    super();
    this.name = "Truncate";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "str"),
        new Parameter("number", "firstChars"),
        new Parameter("number", "lastChars")
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
    return new JbString(
      str.substring(args[1].toNumber(), str.length - args[2].toNumber())
    );
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // str
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // firstChars
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // lastChars
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `URLDecode` function.
 * 
 * Parse a URL string and return the decoded value of the URL parameter with
 * the specified name. The case of the name is ignored.
 * If the name is not found in parameters of the URL, an empty string ("") is returned.
 * 
 * See also the `ParseURL` and `URLEncode` functions.
 */
export class URLDecode extends Func {
  constructor() {
    super();
    this.name = "URLDecode";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "url"),
        new Parameter("string", "paramName")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    const urlStr = args[0].toString();
    const paramName = args[1].toString();
    let result = "";
    // URL.canParse was added in 2023
    // see: https://github.com/nodejs/node/pull/47179
    try {
      const url = new URL(urlStr);
      result = decodeURIComponent(url.searchParams.get(paramName.toLowerCase()) ?? "");
    }
    catch(e) {
      throw new RuntimeError(`[${this.name}] URL parsing error: '${urlStr}'`);
    }
    return new JbString(result);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // url
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // paramName
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `URLEncode` function.
 * 
 * Encodes a string following RFC 1738.
 * 
 * Valid values for the optional encoding option are:
 * 
 * - `0`: Standard URL encoding. Encodes ASCII control characters, non-ASCII characters,
 * "reserved" characters, and "unsafe" characters.
 * This is the default encoding if the option is omitted.
 * - `1`: Don't encode "unsafe" characters: " `< > ; # % { } | \ ^ ~ [ ]`, backtick and the space character
 * - `2`: Don't encode "reserved" characters: `; / ? : @ & =`
 * - `3`: Don't encode "unsafe" characters and "reserved" characters
 * 
 * These characters are considered "safe" and are never encoded: `$ - _ . + ! * ' ( ) ,`
 * 
 * See also the `ParseURL` and `URLDecode` functions.
 * 
 * This implementation does not honor the encoding option, all strings are encoded using JavaScript's `encodeURIComponent`.
 */
export class URLEncode extends Func {
  constructor() {
    super();
    this.name = "URLEncode";
    this.module = "string";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "url"),
        new Parameter("number", "encodingOption", false, new JbNumber(0))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // implicit conversions
    // POD: no encoding options
    return new JbString(encodeURIComponent(args[0].toString()));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
  
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // url
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 1) {
      // encodingOption
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}
