import Scope from "../../runtime/scope";
import { JbArray, JbDictionary, JbBinary, JbBool, JbNull, JbNumber, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { AsyncFunc, DeferrableFunc, Func, Parameter, Signature } from "../types";
import { hostname } from "os";
import { randomUUID } from "crypto";
import { reverse } from "dns/promises";
import { RuntimeError, UnimplementedError } from "../../errors";
import { Expr } from "../../frontend/ast";
import evaluate from "../../runtime/interpreter";
import { TypedExpr, TypedGlobalIdentifier, TypedIdentifier, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";

/**
 * The implementation of `ArgumentList` function.
 * 
 * This function initializes a set of local variables from its argument list.
 * 
 * The construction of the local variables depends on which of these cases applies:
 * 
 * - Case 1: Transformation mappings: When the function call is made in the mapping of
 * a target field (a call to the function `SetInstances` must have been made previously).
 * The local variables are constructed from the corresponding global variables in the
 * instance given by the function `SetInstances`.
 * - Case 2: Running a script: When the function call is made in a script.
 * The local variables are constructed from the corresponding arguments in the list
 * provided by the calling `RunScript` statement.
 * These variables can also be addressed by index, as `_1`, `_2`...
 * 
 * A null value is returned by this function and can be ignored.
 * As an alternative, see the function `GetInstance`.
 * 
 * Supports up to 100-argument calls.
 */
export class ArgumentList extends Func {
  constructor() {
    super();
    this.name = "ArgumentList";
    this.module = "general";
    this.signatures = [
      new Signature("null", [
        new Parameter("type", "var1"),
        new Parameter("type", "var", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 100;
    this.docs = "This function initializes a set of local variables from its argument list.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-argumentlist).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 1;
    let info: TypeInfo;
    for(const arg of args) {
      info = arg.typeExpr(env);
      if(arg.kind !== "Identifier" && arg.kind !== "GlobalIdentifier" && !arg.warning) {
        arg.warning = `The argument passed into ${this.name} as 'var${argIdx}' should be a variable.`;
        argIdx++;
        continue;
      }
      // TODO: for future RunScript implementation, the env/scope should store script argument list (both for typechecker and runtime)
      // assigns the unknown type to the variable args
      info = {type: "unknown"};
      arg.setTypeInfo(info);
      env.set((arg as TypedIdentifier).symbol, info);
      argIdx++;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `AutoNumber` function.
 * 
 * Returns the number of an instance within a particular hierarchy.
 * 
 * **Warning**: This method has been deprecated and may be removed in a future version of Jitterbit.
 * Use either the `TargetInstanceCount` or `SourceInstanceCount` functions instead.
 * The `TargetInstanceCount` function is equivalent to this function.
 */
export class AutoNumber extends Func {
  constructor() {
    super();
    this.name = "AutoNumber";
    this.module = "general";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the number of an instance within a particular hierarchy.\n\n**Warning**: This method has been deprecated and may be removed in a future version of Jitterbit. Use either the [`TargetInstanceCount`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-targetinstancecount) or [`SourceInstanceCount`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-sourceinstancecount) instead. `TargetInstanceCount` is equivalent to this function.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is unsupported as deprecated, you should use TargetInstanceCount or SourceInstanceCount instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {
      type: this.signature.returnType,
      warning: `This method has been deprecated and may be removed in a future version of Jitterbit. Use either the TargetInstanceCount or SourceInstanceCount functions instead. The TargetInstanceCount function is equivalent to this function.`
    };
  }
}

/**
 * The implementation of `CancelOperation` function.
 * 
 * Cancels a particular operation specified by the operation's reference path.
 * For more information, see the instructions on inserting operations under
 * the Operations section in Jitterbit Script.
 * 
 * Call the `GetOperationQueue` function to retrieve instances of running operations.
 * The operation instance GUID is at index 4 of the sub-arrays returned by
 * the `GetOperationQueue` function.
 * See the `GetOperationQueue` function for details.
 */
export class CancelOperation extends AsyncFunc {
  constructor() {
    super();
    this.name = "CancelOperation";
    this.module = "general";
    this.signatures = [
      new Signature("void", [new Parameter("string", "operationInstanceGUID")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Cancels a particular operation specified by the operation's reference path.";
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
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
 * The implementation of `CancelOperationChain` function.
 * 
 * If the current operation has either success or failure operations, calling this function will
 * cause those operations to be cancelled.
 * Any operations linked by a condition will also be cancelled.
 * However, any scripts in the current operation will be completed.
 * 
 * This can be useful if an operation is running in a loop and the condition to stop
 * looping has been reached.
 */
export class CancelOperationChain extends AsyncFunc {
  constructor() {
    super();
    this.name = "CancelOperationChain";
    this.module = "general";
    this.signatures = [
      new Signature("void", [new Parameter("string", "message")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "If the current operation has either success or failure operations, calling this function will cause those operations to be cancelled. Any operations linked by a condition will also be cancelled. However, any scripts in the current operation will be completed.";
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
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
 * The implementation of `Eval` function.
 * 
 * Evaluates the first argument; if valid, its result is returned as a string.
 * Otherwise, the default value is evaluated and its results are returned as a string.
 * 
 * This can be used as a "try-catch" statement as the second argument will be evaluated
 * only if the first one fails.
 * 
 * **Note:** It is not recommended to use this function with `RunOperation` as it will always
 * return a valid result after the operation runs unless the operation call itself
 * is malformed or invalid.
 * Instead, to capture failed operations, functions such as `If` and `GetLastError` can be used
 * to achieve similar functionality.
 * For more information, see the *Scripting* section in Harmony Best Practices.
 * 
 * This implementation evaluates `defaultResult` only if the first evaluation throws.
 */
export class Eval extends DeferrableFunc {
  constructor() {
    super();
    this.name = "Eval";
    this.module = "general";
    this.signatures = [
      new Signature("string", [
        new Parameter("type", "expToEvaluate"),
        new Parameter("type", "defaultResult")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Evaluates the first argument; if valid, its result is returned as a string. Otherwise, the default value is evaluated and its results are returned as a string.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-eval).";
  }

  async callEval(args: Expr[], scope: Scope) {
    let result: RuntimeVal;
    try {
      result = await evaluate(args[0], scope);
    } catch {
      result = await evaluate(args[1], scope);
    }
    return result;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callEval instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // expToEvaluate
    let info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    // defaultResult
    info = args[++argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Get` function.
 * 
 * Returns the value of a global variable with a given name.
 * If passed an array or the name of a global variable that is an array, returns
 * an element of the array. See also the complementary `Set` function.
 * 
 * If the first argument is either an array or the name of a global variable that is an array,
 * the function retrieves a specific element by its index (or indices for a multi-dimensional
 * array such as a record-set) using the remaining arguments.
 * 
 * Arrays are zero-indexed; the first element is at index `0` and the last element
 * (of the array `$array`) is at index `[Length($array)-1]`.
 * 
 * Attempting to retrieve an element beyond the end of the array will result in
 * a return value of `null`.
 */
export class Get extends Func {
  constructor() {
    super();
    this.name = "Get";
    this.module = "general";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "name"),
        new Parameter("number", "index", false)
      ]),
      new Signature("type", [
        new Parameter("array", "name"),
        new Parameter("number", "index", false)
      ]),
    ];
    this.minArgs = 1;
    this.maxArgs = 100;
    this.docs = "Returns the value of a global variable with a given name. If passed an array or the name of a global variable that is an array, returns an element of the array. See also the complementary [`Set`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-set).\n\nIf the first argument is either an array or the name of a global variable that is an array, the function retrieves a specific element by its index (or indices for a multi-dimensional array such as a record-set) using the remaining arguments.\n\nArrays are zero-indexed; the first element is at index `0` and the last element (of the array `$array`) is at index `[Length($array)-1]`.\n\nAttempting to retrieve an element beyond the end of the array will result in a return value of `null`.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 0 : 1];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    let sigIdx = 0;
    // name
    let info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "string":
      case "error":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a global variable name or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global errors
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].type = "error";
        args[argIdx].error = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' cannot be ${info.type}, a global variable name or an array is required.`;
        break;
    }
    // index
    if(args.length > 1) {
      for(argIdx = 1; argIdx < args.length; argIdx++) {
        info = args[argIdx].typeExpr(env);
        args[argIdx].checkOptArg(
          {
            ...this.signatures[sigIdx].params[1],
            name: this.signatures[sigIdx].params[1].name + argIdx
          },
          info.type
        );
      }
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `GetChunkDataElement` function.
 * 
 * Returns the value of the chunk variable with a given name.
 * 
 * A chunk variable is evaluated as each chunk of data is processed.
 * An alternative method is to use the `SCOPE_CHUNK` syntax of the `Set` function.
 * 
 * See also the `SetChunkDataElement` and `Set` functions.
 */
export class GetChunkDataElement extends Func {
  constructor() {
    super();
    this.name = "GetChunkDataElement";
    this.module = "general";
    this.signatures = [
      new Signature("type", [new Parameter("string", "name")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns the value of the chunk variable with a given name.\n\nA chunk variable is evaluated as each chunk of data is processed. An alternative method is to use the `SCOPE_CHUNK` syntax of the `Set` function.\n\nSee also the [`SetChunkDataElement`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-setchunkdataelement) and [`Set`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-set) functions.";
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
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetHostByIP` function.
 * 
 * Resolves an IP address to a host name.
 * 
 * The original implementation performs implicit numeric conversion of the argument
 * and supports valid number representations of an address.
 * 
 * This implementation only accepts strings with an IPv4 address. The range is validated, special addresses
 * such as `0.0.0.0` are not checked for and may result in a runtime errror.
 */
export class GetHostByIP extends AsyncFunc {
  constructor() {
    super();
    this.name = "GetHostByIP";
    this.module = "general";
    this.signatures = [
      new Signature("string", [new Parameter("string", "ipAddress")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Resolves an IP address to a host name.";
  }

  async callAsync(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // POD: originally the function implicitly converts everything to numbers (and supports number type too)
    // IPv4 addresses as numbers are unsupported here
    if(args[0].type !== "string")
      throw new RuntimeError(`Argument '${this.signature.params[0].name}' must be of type: ${this.signature.params[0].type}, ${args[0].type} passed.`);

    // only supports IPv4
    const ipRegex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/g;
    if((args[0] as JbString).value.match(ipRegex) === null)
      throw new RuntimeError(`'${(args[0] as JbString).value}' is not a valid IP address.`);
    
    let hostnames: string[] = [];
    hostnames = await reverse((args[0] as JbString).value);
    return new JbString(hostnames[0] ?? '');
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    if(info.type === "number")
      args[argIdx].warning = `${this.name} supports IPv4 addresses as numbers, however this behaviour is not officially documented.`;
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetInputString` function.
 * 
 * Returns the unformatted input as a string given a source global variable.
 * 
 * This is useful if the standard Jitterbit representation of a data type
 * (such as `date` or `double`) is not suitable and the "raw" input is required.
 * If this method is called on an object that is not a source global variable,
 * an empty string is returned.
 */
export class GetInputString extends Func {
  constructor() {
    super();
    this.name = "GetInputString";
    this.module = "general";
    this.signatures = [
      // the docs indicate 'type' arg type, it should be node
      new Signature("string", [new Parameter("node", "arg")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns the unformatted input as a string given a source global variable.\n\nThis is useful if the standard Jitterbit representation of a data type (such as `date` or `double`) is not suitable and the \"raw\" input is required. If this method is called on an object that is not a source global variable, an empty string is returned.";
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
 * The implementation of `GetLastOperationRunStartTime` function.
 * 
 * Returns the last date and time the given operation was run.
 * The return value is a date (which includes the date and time).
 * To be used with a single Private Agent only.
 * 
 * The operation used in this function call must be defined as an operation
 * in the current project.
 * For more information, see the instructions on inserting operations under
 * the *Operations* section in Jitterbit Script.
 * 
 * The returned date is in UTC (without a specific time zone).
 * Use the `ConvertTimeZone` function to convert to a local time.
 */
export class GetLastOperationRunStartTime extends Func {
  constructor() {
    super();
    this.name = "GetLastOperationRunStartTime";
    this.module = "general";
    this.signatures = [
      new Signature("date", [new Parameter("string", "operationId")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns the last date and time the given operation was run.\n\nThe return value is a date (which includes the date and time).\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-getlastoperationrunstarttime).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
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
 * The implementation of `GetName` function.
 * 
 * Returns the name of a variable or a global variable.
 * 
 * Certain functions return a named global variable array; if defined,
 * this function retrieves the name of the value.
 */
export class GetName extends Func {
  constructor() {
    super();
    this.name = "GetName";
    this.module = "general";
    this.signatures = [
      new Signature("string", [new Parameter("type", "arg")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns the name of a variable or a global variable.\n\nCertain functions return a named global variable array; if defined, this function retrieves the name of the value.";
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
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetOperationQueue` function.
 * 
 * Returns the contents of the operation queue as an array.
 * Only operations that the current user has read access for will be returned.
 * To be used with a single Private Agent only.
 * 
 * The result is returned as an array of arrays, with these elements in each sub-array:
 * 
 * - `0`: Operation GUID (`string`)
 * - `1`: The IsExecuting flag (`bool`)
 * - `2`: Timestamp for when the operation was added to the queue (`date`)
 * - `3`: Seconds in current status (`integer`)
 * - `4`: Operation instance GUID (`string`)
 * - `5`: Operation name (`string`)
 * 
 * The operation tag argument is optional.
 * If the operation tag argument is present, only queue entries for that particular
 * operation will be returned.
 * For more information, see the instructions on inserting operations under
 * the *Operations* section in Jitterbit Script.
 */
export class GetOperationQueue extends AsyncFunc {
  constructor() {
    super();
    this.name = "GetOperationQueue";
    this.module = "general";
    this.signatures = [
      new Signature("array", [new Parameter("string", "operationTag", false)])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 1;
    this.docs = "Returns the contents of the operation queue as an array. Only operations that the current user has read access for will be returned.\n\nThe result is returned as an array of arrays, with these elements in each sub-array:\n- `0`: Operation GUID (`string`)\n- `1`: The IsExecuting flag (`bool`)\n- `2`: Timestamp for when the operation was added to the queue (`date`)\n- `3`: Seconds in current status (`integer`)\n- `4`: Operation instance GUID (`string`)\n- `5`: Operation name (`string`)";
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    if(args.length > 0) {
      const argIdx = 0;
      const info = args[argIdx].typeExpr(env);
      args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GetServerName` function.
 * 
 * Returns the name of the machine that the agent is running on.
 */
export class GetServerName extends Func {
  constructor() {
    super();
    this.name = "GetServerName";
    this.module = "general";
    this.signatures = [
      new Signature("string", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the name of the machine that the agent is running on.";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbString(hostname());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `GUID` function.
 * 
 * Returns a GUID string (a globally unique identifier, also known as a universally unique identifier or UUID).
 * 
 * The format of the GUID is `xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx`, where `M` is the version (4) and `N` is the variant (8).
 */
export class GUID extends Func {
  constructor() {
    super();
    this.name = "GUID";
    this.module = "general";
    this.signatures = [
      new Signature("string", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns a GUID string (a globally unique identifier/UUID).\n\nThe format of the GUID is `xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx`, where `M` is the version (4) and `N` is the variant (8).";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbString(randomUUID());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `IfEmpty` function.
 * 
 * Returns the default value if the first argument is null or if the string representation of the argument is an empty string.
 * Otherwise, it returns the first argument. This is a shortcut for an `If` function statement:
 * 
 * `If(IsNull(arg) || Length(arg)==0, default, arg)`
 * 
 * See also the `IsNull` function.
 * 
 * **Warning**: the above condition is false for arrays, an empty array is not treated as empty even though `Length({}) == 0`.
 */
export class IfEmpty extends DeferrableFunc {
  constructor() {
    super();
    this.name = "IfEmpty";
    this.module = "general";
    this.signatures = [
      new Signature("type", [
        new Parameter("type", "arg"),
        new Parameter("type", "default")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Returns the default value if the first argument is `null` or if the string representation of the argument is an empty string. Otherwise, it returns the first argument.";
  }

  async callEval(args: Expr[], scope: Scope) {
    const result = await evaluate(args[0], scope);
    if(
      result.type === "null" ||
      (result.type === "string" && (result as JbString).value === "")
    )
      return await evaluate(args[1], scope);

    return result;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callEval instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // arg
    const argInfo = args[argIdx].typeExpr(env);
    if(argInfo.type === "unassigned") {
      argInfo.type = "error";
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    // default
    const defaultInfo = args[++argIdx].typeExpr(env);
    if(defaultInfo.type === "unassigned") {
      defaultInfo.type = "error";
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    const condition = argInfo.type === "null" || argInfo.type === "void";
    // empty string literal checks are not supported (`type` returned)
    if(argInfo.type === "string")
      return {type: this.signature.returnType};
    // handle errors
    if(
      condition && defaultInfo.type === "error" ||
      !condition && argInfo.type === "error"
    )
      return {type: "unknown"};

    return {type: condition ? defaultInfo.type : argInfo.type};
  }
}

/**
 * The implementation of `IfNull` function.
 * 
 * Returns the default value if the first argument is `null`, else returns the first argument.
 * 
 * This is a shortcut for an `If` function statement:
 * 
 * `If(IsNull(arg), default, arg)`
 * 
 * See also the `IsNull` and `IfEmpty` functions.
 */
export class IfNull extends DeferrableFunc {
  constructor() {
    super();
    this.name = "IfNull";
    this.module = "general";
    this.signatures = [
      new Signature("type", [
        new Parameter("type", "arg"),
        new Parameter("type", "default")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Returns the default value if the first argument is `null`, else returns the first argument.\n\nSee also [`IsNull`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-isnull) and [`IfEmpty`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-ifempty).";
  }

  async callEval(args: Expr[], scope: Scope) {
    const result = await evaluate(args[0], scope);
    if(result.type === "null")
      return await evaluate(args[1], scope);
      
    return result;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callEval instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // arg
    const argInfo = args[argIdx].typeExpr(env);
    if(argInfo.type === "unassigned") {
      argInfo.type = "error";
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    // default
    const defaultInfo = args[++argIdx].typeExpr(env);
    if(defaultInfo.type === "unassigned") {
      defaultInfo.type = "error";
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    const condition = argInfo.type === "null" || argInfo.type === "void";
    // handle errors
    if(
      condition && defaultInfo.type === "error" ||
      !condition && argInfo.type === "error"
    )
      return {type: "unknown"};

    return {type: condition ? defaultInfo.type : argInfo.type};
  }
}

/**
 * The implementation of `InitCounter` function.
 * 
 * Initializes a counter, optionally passing an initial value.
 * To be used with a Single Agent only.
 * 
 * If no initial value is set, the initial value is set to 0.
 * The first argument is either the name of a variable or a reference to a variable
 * (see the examples). This method needs to be called in single-threaded contexts only.
 * Calling this method in a multi-threaded context will result in an error.
 * See also *Use Variables with Chunking* under Operation Options.
 */
export class InitCounter extends Func {
  constructor() {
    super();
    this.name = "InitCounter";
    this.module = "general";
    this.signatures = [
      new Signature("number", [
        new Parameter("type", "counter"),
        new Parameter("number", "initialValue", false, new JbNumber())
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
    this.docs = "Initializes a counter, optionally passing an initial value.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-initcounter).";
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
    // counter
    let info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    const result = {
      type: this.signature.returnType,
      warning: "This function must be used only with a single Agent as it results in an error in a multiple Agent context."
    } as TypeInfo;

    if(info.type !== "string" && args[argIdx].kind !== "GlobalIdentifier" && info.type !== "error") {
      result.type = "error";
      result.warning = undefined;
      result.error = `The argument '${this.signature.params[argIdx].name}' is required to be a global variable name or reference.`
    }

    // references infer the number type
    if(args[argIdx].kind === "GlobalIdentifier") {
      // clears 'Global variable used without an explicit assignment ...'
      args[argIdx].warning = undefined;
      env.set((args[argIdx] as TypedGlobalIdentifier).symbol, {type: "number"});
    }
    
    // initialValue
    if(args.length > 1) {
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return result;
  }
}

/**
 * The implementation of `InList` function.
 * 
 * Checks for `x` in the list of arguments (`arg1` through `argN`).
 * If a match (by value) is found, this function will return an integer representing
 * the position of the match in the list, with the first position in the list being
 * represented by the integer `1`.
 * 
 * If the list contains more than one instance of `x`, this function returns the position
 * of the first match (the match with the lowest position index).
 * `0` is returned if the list does not contain a matching value or if only
 * a single argument is supplied.
 */
export class InList extends Func {
  constructor() {
    super();
    this.name = "InList";
    this.module = "general";
    this.signatures = [
      new Signature("number", [
        new Parameter("type", "x"),
        new Parameter("type", "arg", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 100;
    this.docs = "Checks for `x` in the list of arguments (`arg1` through `argN`). If a match (by value) is found, this function will return an integer representing the position of the match in the list, with the first position in the list being represented by the integer `1`.\n\nIf the list contains more than one instance of `x`, this function returns the position of the first match (the match with the lowest position index). `0` is returned if the list does not contain a matching value or if only a single argument is supplied.";
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
    let info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx++] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    if(args.length > 1) {
      for(argIdx; argIdx < args.length; argIdx++) {
        info = args[argIdx].typeExpr(env);
        if(info.type === "unassigned") {
          args[argIdx].type = "error";
          args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        }
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `IsInteger` function.
 * 
 * Returns `true` if the argument is of type `integer` or `long` or can be converted to
 * an integer or long without any loss of information.
 */
export class IsInteger extends Func {
  constructor() {
    super();
    this.name = "IsInteger";
    this.module = "general";
    this.signatures = [
      new Signature("bool", [new Parameter("type", "x")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns `true` if the argument is of type `integer` or `long` or can be converted to an integer or long without any loss of information.";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    if(args[0].type !== "number")
      return new JbBool(false);

    return new JbBool((args[0] as JbNumber).value === Math.floor((args[0] as JbNumber).value))
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `IsNull` function.
 * 
 * Returns `true` if the argument is `null`.
 * Applies to database fields, variables, and functions that can return nulls.
 * 
 * See also the `IfNull` and `IfEmpty` functions for shortcuts that can be used
 * instead of this function.
 */
export class IsNull extends Func {
  constructor() {
    super();
    this.name = "IsNull";
    this.module = "general";
    this.signatures = [
      new Signature("bool", [new Parameter("type", "x")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns `true` if the argument is `null`. Applies to database fields, variables, and functions that can return nulls.\n\nSee also [`IfNull`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-ifnull) and [`IfEmpty`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-ifempty).";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbBool(args[0].type === "null")
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `IsValid` function.
 * 
 * Returns `true` if the evaluation of the argument results without an error.
 */
export class IsValid extends DeferrableFunc {
  constructor() {
    super();
    this.name = "IsValid";
    this.module = "general";
    this.signatures = [
      new Signature("bool", [new Parameter("type", "x")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns `true` if the evaluation of the argument results without an error.";
  }

  async callEval(args: Expr[], scope: Scope) {
    try {
     await evaluate(args[0], scope);
     return new JbBool(true);
    } catch {
      return new JbBool(false);
    }
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: already evaluated, should try-catch evaluate
    return new JbBool(true);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Length` function.
 * 
 * Returns the length of the input argument.
 * 
 * The behavior of this method depends on the argument type:
 * 
 * - `string`: the length of the string is returned
 * - `array`: the number of elements in the array is returned
 * - `binary`: the number of bytes is returned
 * - for all other types, an attempt is made to convert the argument to a string, and the length of the resulting string is returned.
 * - if the argument cannot be converted to a string, or the argument is `null` or of an unknown type, `0` is returned.
 */
export class Length extends Func {
  constructor() {
    super();
    this.name = "Length";
    this.module = "general";
    this.signatures = [
      new Signature("number", [new Parameter("type", "x")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Returns the length of the input argument.\n\nThe behavior of this method depends on the argument type:\n- `string`: the length of the string is returned\n- `array`: the number of elements in the array is returned\n- `binary`: the number of bytes is returned\n- for all other types, an attempt is made to convert the argument to a string, and the length of the resulting string is returned.\n- if the argument cannot be converted to a string, or the argument is `null` or of an unknown type, `0` is returned.";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    switch (args[0].type) {
      case "array":
        return new JbNumber((args[0] as JbArray).members.length);
      case "dictionary":
        // measuring the length of your dict in... entries
        return new JbNumber((args[0] as JbDictionary).members.size);
      case "binary":
        return new JbNumber((args[0] as JbBinary).value.length);
      case "null":
        return new JbNumber();
      default:
        return new JbNumber(args[0].toString().length)
    }
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Null` function.
 * 
 * Returns `null`.
 */
export class Null extends Func {
  constructor() {
    super();
    this.name = "Null";
    this.module = "general";
    this.signatures = [
      new Signature("null", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns `null`.";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbNull();
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Random` function.
 * 
 * Generates a random integer number between and including the given minimum and maximum values.
 * See also the `RandomString` function.
 */
export class Random extends Func {
  constructor() {
    super();
    this.name = "Random";
    this.module = "general";
    this.signatures = [
      new Signature("number", [
        new Parameter("number", "min"),
        new Parameter("number", "max")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Generates a random integer number between and including the given minimum and maximum values.\n\nSee also [`RandomString`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-randomstring).";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    const min = args[0].toNumber() < 0
      ? Math.ceil(args[0].toNumber())
      : Math.floor(args[0].toNumber());
    const max = args[1].toNumber() < 0
      ? Math.ceil(args[1].toNumber())
      : Math.floor(args[1].toNumber());
    // order-proof, [min, max] range
    return new JbNumber(Math.round(Math.random() * Math.abs(max - min) + Math.min(min, max)));
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // min
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // max
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `RandomString` function.
 * 
 * Generates a random string of the given length.
 * By default, the function uses alphanumeric characters; the set that includes `a-z`, `A-Z`, and `0-9`.
 * See also the `Random` function.
 */
export class RandomString extends Func {
  constructor() {
    super();
    this.name = "RandomString";
    this.module = "general";
    this.signatures = [
      new Signature("number", [
        new Parameter("number", "len"),
        new Parameter("string", "chars", false, new JbString("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
    this.docs = "Generates a random string of the given length.\n\nBy default, the function uses alphanumeric characters; the set that includes `a-z`, `A-Z`, and `0-9`.\n\nSee also [`Random`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-random).";
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    const len = args[0].toNumber();
    const alphabet = args[1] !== undefined
      ? args[1].toString()
      : this.signature.params[1].defaultVal?.toString() ?? "";
    let result = "";
    let index = 0;
    for(let i = 0; i < len; i++) {
      index = Math.round(Math.random() * (alphabet.length - 1));
      result += alphabet[index];
    }
    return new JbString(result);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // len
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // chars
    if(args.length > 1) {
      info = args[argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `ReadArrayString` function.
 * 
 * Reads a string that represents a single or multi-dimensional array.
 * 
 * The array is represented by enclosing array elements with a pair of curly brackets (`{` and `}`).
 * Each array element can be an array or a scalar element separated by comma (`,`).
 * The elements in an array must be either all scalars or all arrays.
 * 
 * The scalar value can be represented by a CSV string. Double quotes to enclose the string are optional, unless the string contains special characters
 * such as `",{}\n` (double quotes, comma, brace brackets, tabs, line breaks, or carriage returns).
 * Inside the double-quoted string, each double quote must be escaped by two double quotes.
 * The optional second argument is to specify the data type of the scalar value.
 * The type is assumed to be string if it is not explicitly specified.
 */
export class ReadArrayString extends Func {
  constructor() {
    super();
    this.name = "ReadArrayString";
    this.module = "general";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "arrayString"),
        new Parameter("string", "type", false, new JbString("string"))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
    this.docs = "Reads a string that represents a single or multi-dimensional array.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-readarraystring).";
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
    // arrayString
    let info = args[argIdx].typeExpr(env);
    if(info.type === "array")
      args[argIdx].warning = `The argument '${this.signature.params[argIdx].name}' already is an array.`;
    else
      args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    // type
    if(args.length > 1) {
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `RecordCount` function.
 * 
 * Returns the instance number of the target loop that is currently being generated.
 * 
 * If it is called in a condition, it returns the instance number of the last instance that
 * was generated.
 * The first time this method is called in a loop it returns `0` if called in a condition;
 * otherwise, it returns 1. The counter is reset to `0` each time a new loop is started.
 */
export class RecordCount extends Func {
  constructor() {
    super();
    this.name = "RecordCount";
    this.module = "general";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the instance number of the target loop that is currently being generated.\n\nIf it is called in a condition, it returns the instance number of the last instance that was generated. The first time this method is called in a loop it returns `0` if called in a condition; otherwise, it returns 1. The counter is reset to `0` each time a new loop is started.";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is unsupported as deprecated, you should use TargetInstanceCount or SourceInstanceCount instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {
      type: this.signature.returnType,
      warning: `This method has been deprecated and may be removed in a future version. Use SourceInstanceCount or TargetInstanceCount instead. TargetInstanceCount is equivalent to this method.`
    };
  }
}

/**
 * The implementation of `ReRunOperation` function.
 * 
 * Re-runs the current operation.
 * 
 * The behavior of this method with respect to return value and global variables is identical
 * to the `RunOperation` function.
 * See that function for a description of how re-running the operation synchronously
 * or asynchronously affects global global variables.
 */
export class ReRunOperation extends AsyncFunc {
  constructor() {
    super();
    this.name = "ReRunOperation";
    this.module = "general";
    this.signatures = [
      new Signature("bool", [
        new Parameter("bool", "runSynchronously", false, new JbBool(true))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 1;
    this.docs = "Re-runs the current operation.\n\nThe behavior of this method with respect to return value and global variables is identical to [`RunOperation`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-runoperation).";
  }

  async callAsync(args: RuntimeVal[], scope: Scope): Promise<never> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    if(args.length > 0) {
      const argIdx = 0;
      const info = args[argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `RunOperation` function.
 * 
 * Runs an operation synchronously or asynchronously, with synchronous being the default.
 * 
 * The operation used in this function call must be defined as an operation in the current project.
 * For more information, see the instructions on inserting operations under
 * the *Operations* section in Jitterbit Script.
 */
export class RunOperation extends AsyncFunc {
  constructor() {
    super();
    this.name = "RunOperation";
    this.module = "general";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "operationId"),
        new Parameter("bool", "runSynchronously", false, new JbBool(true))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
    this.docs = "Runs an operation synchronously or asynchronously, with synchronous being the default.\n\nThe operation used in this function call must be defined as an operation in the current project.";
  }

  async callAsync(args: RuntimeVal[], scope: Scope): Promise<never> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 1) {
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `RunPlugin` function.
 * 
 * Runs a specified plugin and then continues execution of the current script.
 * If multiple versions of a plugin are installed on an agent, the highest available version
 * is used.
 * 
 * In the Cloud Studio UI, only those plugins that can be run inside a script are displayed;
 * plugins that run on activities are hidden.
 * For more information, see the instructions on inserting plugins under
 * the *Plugins* section in Jitterbit Script.
 * 
 * Returns `true` if the plugin completes without errors.
 * Returns `false` if the plugin could not be run or the plugin implementation itself
 * returned an error. Call `GetLastError` to retrieve the error message.
 */
export class RunPlugin extends AsyncFunc {
  constructor() {
    super();
    this.name = "RunPlugin";
    this.module = "general";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "pluginId")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Runs a specified plugin and then continues execution of the current script. If multiple versions of a plugin are installed on an agent, the highest available version is used.\n\nReturns `true` if the plugin completes without errors. Returns `false` if the plugin could not be run or the plugin implementation itself returned an error.";
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
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
 * The implementation of `RunScript` function.
 * 
 * Runs the specified script and then continues execution of the current script.
 * This method returns, on success, the return value of the called script as a string.
 * 
 * The script used in this function call must be defined as either a Jitterbit Script
 * or JavaScript in the current project.
 * For more information, see the instructions on inserting scripts under
 * *Jitterbit Script* or *JavaScript*.
 * 
 * A list of values can be passed to a `RunScript` call as input variables.
 * The script will create local variables using these values with default names such as `_1`, `_2` ....
 * 
 * If comprehensive names are preferred, the `ArgumentList` function can be used to map a list
 * of local variable names to the list of `_1`, `_2` ....
 * 
 * See the `ArgumentList` function for examples.
 * 
 * Supports up to 100-argument calls.
 */
export class RunScript extends AsyncFunc {
  constructor() {
    super();
    this.name = "RunScript";
    this.module = "general";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "scriptId"),
        new Parameter("type", "var", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 100;
    this.docs = "Runs the specified script and then continues execution of the current script. This method returns, on success, the return value of the called script as a string.\n\nThe script used in this function call must be defined as either a [Jitterbit Script](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/scripts/jitterbit-script) or [JavaScript](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/scripts/javascript) in the current project.\n\nA list of values can be passed to a `RunScript` call as input variables, see [`ArgumentList`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-argumentlist).";
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // scriptId
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    // var
    if(args.length > 1) {
      argIdx++;
      for(argIdx; argIdx < args.length; argIdx++) {
        info = args[argIdx].typeExpr(env);
        if(info.type === "unassigned") {
          args[argIdx].type = "error";
          args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        }
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Set` function.
 * 
 * Sets the value of a global variable with a given name to a value, and returns the value.
 * See also the complementary `Get` function.
 * 
 * Supports up to 100-argument calls.
 */
export class Set extends Func {
  constructor() {
    super();
    this.name = "Set";
    this.module = "general";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "name"),
        new Parameter("type", "value"),
        new Parameter("number", "index", false)
      ]),
      new Signature("type", [
        new Parameter("array", "name"),
        new Parameter("type", "value"),
        new Parameter("number", "index", false)
      ])
    ];
    this.minArgs = 2;
    this.maxArgs = 100;
    this.docs = "Sets the value of a global variable with a given name to a value, and returns the value.\n\nSee also the complementary [`Get`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-get).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    if (args.length === 2)
      this.signature = this.signatures[0];
    if (args.length > 2)
      this.signature = this.signatures[args[0].type === "string" ? 1 : 2];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    let sigIdx = 0;
    // name
    let info = args[argIdx].typeExpr(env);
    switch(info.type) {
      case "string":
      case "error":
        break;
      case "array":
        sigIdx = 1;
        break;
      case "unknown":
      case "type":
        args[argIdx].warning = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' should be a global variable name or an array.`;
        break;
      case "unassigned":
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
        break;
      case "null":
        // suppress unassigned global errors
        if(args[argIdx].kind === "GlobalIdentifier")
          break;
      default:
        args[argIdx].type = "error";
        args[argIdx].error = `The type of argument '${this.signatures[sigIdx].params[argIdx].name}' cannot be ${info.type}, a global variable name or an array is required.`;
        break;
    }
    // value
    info = args[++argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      info.type = "unknown";
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    const result = {type: info.type !== "error" ? info.type : "unknown"} as TypeInfo;
    // index
    if(args.length > 2) {
      for(argIdx = 2; argIdx < args.length; argIdx++) {
        info = args[argIdx].typeExpr(env);
        args[argIdx].checkOptArg(
          {
            ...this.signatures[sigIdx].params[2],
            name: this.signatures[sigIdx].params[2].name + (argIdx - 1)
          },
          info.type
        );
      }
    }
    return result;
  }
}

/**
 * The implementation of `SetChunkDataElement` function.
 * 
 * Sets the value of a specified chunk variable, and returns the value.
 * A chunk variable is evaluated as each chunk of data is processed.
 * An alternative method is to use the `SCOPE_CHUNK` syntax of the `Set` function.
 * 
 * See also the `GetChunkDataElement` and `Set` functions.
 */
export class SetChunkDataElement extends Func {
  constructor() {
    super();
    this.name = "SetChunkDataElement";
    this.module = "general";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "name"),
        new Parameter("type", "value")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Sets the value of a specified chunk variable, and returns the value.\n\nA chunk variable is evaluated as each chunk of data is processed.\n\nAn alternative method is to use the `SCOPE_CHUNK` syntax of [`Set`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-set).\n\nSee also [`GetChunkDataElement`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-getchunkdataelement).";
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
    // name
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // value
    info = args[argIdx].typeExpr(env);
    if(info.type === "unassigned") {
      info.type = "unknown";
      args[argIdx].type = "error";
      args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
    }
    return {type: info.type !== "error" ? info.type : "unknown"};
  }
}

/**
 * The implementation of `Sleep` function.
 * 
 * Causes execution to be suspended for a specified number of seconds.
 */
export class Sleep extends AsyncFunc {
  constructor() {
    super();
    this.name = "Sleep";
    this.module = "general";
    this.signatures = [
      new Signature("void", [
        new Parameter("number", "seconds"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Causes execution to be suspended for a specified number of seconds.";
  }

  async callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    if(args[0].type !== this.signature.params[0].type)
      throw new RuntimeError(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}.`);

    const seconds = args[0] as JbNumber;
    await async function(seconds: number) {
      return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }(seconds.value);
    return new JbNull();
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
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
 * The implementation of `SourceInstanceCount` function.
 * 
 * Returns the instance count of the most recent generator.
 * 
 * The value is independent of whether the target instance has been generated or not;
 * the same value is returned if called in a condition script or in a mapping script.
 * 
 * When the first source instance is used as the generator, `1` is returned, then `2`, and so forth.
 * 
 * See also the `TargetInstanceCount` function.
 */
export class SourceInstanceCount extends Func {
  constructor() {
    super();
    this.name = "SourceInstanceCount";
    this.module = "general";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the instance count of the most recent generator.\n\nThe value is independent of whether the target instance has been generated or not; the same value is returned if called in a condition script or in a mapping script.\n\nWhen the first source instance is used as the generator, `1` is returned, then `2`, and so forth.\n\nSee also [`TargetInstanceCount`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-targetinstancecount).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of transformation API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `TargetInstanceCount` function.
 * 
 * Returns the instance count of a generating target loop node.
 * 
 * When called in a condition it returns the number of target instances that
 * have been generated so far for the current loop node.
 * The number returned by this method will be one less if it is called in a condition since,
 * in a condition, it is not known if the current target instance will be generated or not.
 * 
 * When the first target instance is generated, `1` is returned, then `2`, and so forth.
 * If called in a condition, the sequence will instead be `0`, `1`, and so forth.
 * 
 * See also the `SourceInstanceCount` function.
 */
export class TargetInstanceCount extends Func {
  constructor() {
    super();
    this.name = "TargetInstanceCount";
    this.module = "general";
    this.signatures = [
      new Signature("number", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Returns the instance count of a generating target loop node.\n\nWhen called in a condition it returns the number of target instances that have been generated so far for the current loop node. The number returned by this method will be one less if it is called in a condition since, in a condition, it is not known if the current target instance will be generated or not.\n\nWhen the first target instance is generated, `1` is returned, then `2`, and so forth. If called in a condition, the sequence will instead be `0`, `1`, and so forth.\n\nSee also [`SourceInstanceCount`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-sourceinstancecount).";
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of transformation API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `WaitForOperation` function.
 * 
 * Stops execution of a script or mapping until all instances of the specified operation currently in the operation queue have finished processing. This method is useful if you want to add many instances of an operation to the queue for parallel processing and then wait for all of them to finish.
 * 
 * The operation used in this function call must be defined as an operation in the current project. For more information, see the instructions on inserting operations under the Operations section in Jitterbit Script.
 * 
 * Note:
 * 
 * - For each operation (identified by its operationID) that is to be waited on,
 * a call must be made to this method.
 * - Operation instances that are added (by calls to the `RunOperation` function) after
 * this call is made are not waited for.
 * - The current user needs to have read access for the operation being waited on.
 * 
 * The second (optional) argument is the timeout in seconds.
 * The default timeout is 1 hour (3600 seconds) and if all the operations have not finished
 * within this time, an error will be thrown.
 * If you expect your operations to run for a longer time during normal conditions
 * you must increase the timeout. You can handle this error by using the `Eval` function.
 * 
 * The third (optional) argument is the poll interval in seconds.
 * The poll interval is the time between operation queue checks.
 * The default poll interval is 10 seconds.
 * The default will not be a significant performance hit but if your operations are
 * expected to run for a very long time, you may want to increase the poll interval.
 */
export class WaitForOperation extends AsyncFunc {
  constructor() {
    super();
    this.name = "WaitForOperation";
    this.module = "general";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "operationId"),
        new Parameter("number", "timeOutSec", false, new JbNumber(3600)),
        new Parameter("number", "pollIntervalSec", false, new JbNumber(10))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 3;
    this.docs = "Stops execution of a script or mapping until all instances of the specified operation currently in the operation queue have finished processing. This method is useful if you want to add many instances of an operation to the queue for parallel processing and then wait for all of them to finish.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-waitforoperation).";
  }

  callAsync(args: RuntimeVal[], scope: Scope): Promise<RuntimeVal> {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of operation API calls is currently unsupported.`);
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} does not support synchronous calls, use callAsync instead.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    if(args.length > 1) {
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
      if(args.length > 2) {
        info = args[++argIdx].typeExpr(env);
        args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
      }
    }
    return {type: this.signature.returnType};
  }
}
