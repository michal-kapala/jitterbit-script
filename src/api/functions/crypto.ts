import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { AsyncFunc, Func, Parameter, Signature } from "../types";

/**
 * The implementation of `AESDecryption` function.
 * 
 * This function decrypts a string encrypted with the AES algorithm.
 * 
 * The decrypted output is returned as a string. See `AESEncryption` for additional details.
 */
export class AESDecryption extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "AESDecryption";
    this.module = "crypto";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "encryptedText"),
        new Parameter("string", "passphrase"),
        new Parameter("string", "salt", false),
        new Parameter("number", "keyLength", false),
        new Parameter("number", "iterations", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 5;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `AESEncryption` function.
 * 
 * This function encrypts a string using the AES algorithm.
 * The key is generated according to Password-Based Cryptography Specification Version 2.0 (PKCS5S2).
 * 
 * The encrypted output is a base64-encoded string.
 * The output from `AESEncryption` can be passed directly to the function `AESDecryption`
 * for decryption, using the same parameters as when the plaintext string was encrypted.
 */
export class AESEncryption extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "AESEncryption";
    this.module = "crypto";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "plainText"),
        new Parameter("string", "passphrase"),
        new Parameter("string", "salt", false),
        new Parameter("number", "keyLength", false),
        new Parameter("number", "iterations", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 5;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Base64Decode` function.
 * 
 * Decodes a base64-encoded string, returning binary data. See also `Base64Encode`.
 */
export class Base64Decode extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "Base64Decode";
    this.module = "crypto";
    this.signatures = [
      new Signature("binary", [
        new Parameter("string", "encryptedText")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Base64Encode` function.
 * 
 * Encodes the argument data, treating the characters in a string as binary data unless
 * the input is already binary.
 * If the type of the argument is not binary or a string, then the argument value
 * is first converted to a string before encryption.
 * 
 * A newline character (`\n`) is added after every 64th character of the encoded result string.
 * As many implementations of Base64 include newlines to limit the encoded result's
 * maximum line length, this should be explicitly disabled only as needed.
 * To disable this, set the `jitterbit.base64.encoded.string.no.wrap` Jitterbit variable
 * to `true` before calling this function.
 * This variable is supported with string data when using 10.49 agents and later, and
 * with binary data when using 10.x agents 10.66 and later and 11.x agents 11.4 and later.
 * 
 * See also `Base64Decode`.
 */
export class Base64Encode extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "Base64Encode";
    this.module = "crypto";
    this.signatures = [
      new Signature("string", [
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Base64EncodeFile` function.
 * 
 * Reads a binary file from the specified source activity and returns the contents
 * as a base64-encoded string. This method is generally used for files that could be binary.
 * To read a text file, use the function `ReadFile` instead.
 * 
 * The source used in this function must be defined as an activity associated
 * with a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * This method returns the contents of the file pointed to by the specified source.
 * If the source filter selects more than one file, the first one will be used.
 * It is recommended to specify a source that uniquely identifies a single file.
 * 
 * The second parameter, filename, is optional and can be used to override
 * the filename returned in the activity configuration.
 * Alternatively, a global variable can be used to override
 * the filename in the activity configuration.
 * Global variables are referenced as `[de_name]` in the activity configuration.
 * 
 * If a file is not found, an error will be raised.
 * 
 * A newline character (`\n`) is added after every 64th character of the encoded result string.
 * As many implementations of Base64 include newlines to limit the encoded result's
 * maximum line length, this should be explicitly disabled only as needed.
 * To disable this, set the `jitterbit.base64.encoded.string.no.wrap` Jitterbit variable
 * to `true` before calling this function.
 * This variable is supported with string data when using 10.49 agents and later, and
 * with binary data when using 10.x agents 10.66 and later and 11.x agents 11.4 and later.
 * 
 * See also `Base64Decode`.
 */
export class Base64EncodeFile extends AsyncFunc {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "Base64EncodeFile";
    this.module = "crypto";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "sourceId"),
        new Parameter("string", "filename", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `MD5` function.
 * 
 * Applies the MD5 hash function to the supplied argument.
 * The hash is returned as a 64-bit string of hex numbers.
 * Non-string data will first be converted to a string.
 */
export class MD5 extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "MD5";
    this.module = "crypto";
    this.signatures = [
      new Signature("string", [
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `MD5AsTwoNumbers` function.
 * 
 * Applies the MD5 hash function to an input string and returns the result as an array
 * with two 64-bit numbers.
 * Non-string data will first be converted to a string.
 */
export class MD5AsTwoNumbers extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "MD5AsTwoNumbers";
    this.module = "crypto";
    this.signatures = [
      new Signature("array", [
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `SHA256` function.
 * 
 * Applies the SHA-256 hash function to an input string.
 * The hash returned is a string of 64 hex numbers.
 * 
 * If the input is a string, it will first be converted to the UTF-8 byte representation.
 * Non-string data will first be converted to a string.
 */
export class SHA256 extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "SHA256";
    this.module = "crypto";
    this.signatures = [
      new Signature("string", [
        new Parameter("type", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
