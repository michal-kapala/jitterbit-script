import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbBool } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { AsyncFunc, Func, Parameter, Signature } from "../types";

/**
 * The implementation of `ArchiveFile` function.
 * 
 * Reads a file from a file-type source activity and writes it to a file-type target activity.
 * This function combines the `ReadFile` and `WriteFile` functions, automatically
 * performs `FlushFile`, and provides an option to delete the source file.
 * 
 * The source and target used in this function call must be defined as activities
 * associated with file-type endpoints in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * As only one file is archived, it is recommended that the source be created to only return a single file.
 * If multiple files are returned, only the first will be used.
 * 
 * Like the `WriteFile` function, this function will not overwrite an existing file on the target.
 * 
 * If the `ArchiveFile` function fails, the operation does not fail.
 * A script will abort, a warning added to the operation log, and the operation will continue.
 */
export class ArchiveFile extends AsyncFunc {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "ArchiveFile";
    this.module = "file";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "sourceId"),
        new Parameter("string", "targetId"),
        new Parameter("string", "deleteSource", false, new JbBool(false))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 3;
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
 * The implementation of `DeleteFile` function.
 * 
 * Deletes a file from the specified source.
 * 
 * The source used in this function call must be defined as an activity associated
 * with a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * If the source filter selects more than one file, an error will be thrown.
 * To delete multiple files, use the `DeleteFiles` function instead.
 * 
 * The method returns an integer of either 0 or 1: it returns 1 if the file was deleted;
 * 0 if the file could not be found.
 * 
 * The second parameter, `fileFilter`, is optional and can be used to override
 * the file filter used in the activity configuration.
 * A filename can be used. Alternatively, a global variable can be used to override
 * the file filter in the activity configuration.
 * Global variables are referenced as `[de_name]` in the activity configuration.
 */
export class DeleteFile extends AsyncFunc {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "DeleteFile";
    this.module = "file";
    this.signatures = [
      new Signature("number", [
        new Parameter("string", "sourceId"),
        new Parameter("string", "fileFilter", false)
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
 * The implementation of `DeleteFiles` function.
 * 
 * Deletes one or more files from the specified source.
 * 
 * The source used in this function call must be defined as an activity associated
 * with a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * This method will delete multiple files, if any are found, based on the file filter
 * of the activity configuration.
 * An integer is returned specifying how many files were deleted.
 * Returning 0 means no files were found matching the file filter.
 * 
 * If a specified path in the source cannot be found, an error will be thrown.
 * If that is a possibility, the function should be wrapped in an `Eval` function.
 * 
 * To delete a single file, use the `DeleteFile` function instead.
 * 
 * The second parameter, `fileFilter`, is optional and can be used to override
 * the file filter used in the activity configuration.
 * A filename can be used. Alternatively, a global variable can be used to override
 * the file filter in the activity configuration.
 * Global variables are referenced as `[de_name]` in the activity configuration.
 */
export class DeleteFiles extends AsyncFunc {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "DeleteFiles";
    this.module = "file";
    this.signatures = [
      new Signature("number", [
        new Parameter("string", "sourceId"),
        new Parameter("string", "fileFilter", false)
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
 * The implementation of `DirList` function.
 * 
 * Returns a list of directories contained in a source, optionally specifying a path
 * and a filter to restrict the results.
 * 
 * This method returns an array containing the directory names.
 * 
 * The source used in this function call must be defined as an activity associated
 * with a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The parameter `fileFilter` is optional and can be used to override
 * the file filter used in the activity configuration. A filename can be used.
 * Alternatively, a global variable can be used to override
 * the file filter in the activity configuration.
 * Global variables are referenced as `[de_name]` in the activity configuration.
 */
export class DirList extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "DirList";
    this.module = "file";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "sourceId"),
        new Parameter("string", "path", false),
        new Parameter("string", "fileFilter", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 3;
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
 * The implementation of `FileList` function
 * 
 * Returns a list of filenames contained in a source.
 * This will be the same list of files received when a file-type source's connection is tested,
 * unless a file filter is specified to override the filter specified in the activity configuration.
 * 
 * The source used in this function call must be defined as an activity associated with
 * a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The parameter `path` is optional and can be used to override the path used in the activity configuration.
 * 
 * The parameter `fileFilter` is optional and can be used to override
 * the file filter used in the activity configuration.
 * A filename can be used. Alternatively, a global variable can be used to override
 * the file filter in the activity configuration.
 * Global variables are referenced as `[de_name]` in the activity configuration.
 * 
 * The method returns an array containing the filenames matching either the file filter
 * of the source activity or the overridden source.
 */
export class FileList extends Func {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "FileList";
    this.module = "file";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "sourceId"),
        new Parameter("string", "path", false),
        new Parameter("string", "fileFilter", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 3;
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
 * The implementation of `FlushAllFiles` function.
 * 
 * Persists data written to a file buffer with `WriteFile`.
 * 
 * The target used in this function call must be defined as an activity associated
 * with a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * If `FlushAllFiles` is called with a `targetId` as an argument, all files written using
 * that target will be flushed (see the `FlushFile` function).
 * If `FlushAllFiles` is called without an argument, all files written using `WriteFile`
 * to any activities used as targets will be persisted to their respective targets.
 * 
 * See also the `FlushFiles` function.
 */
export class FlushAllFiles extends AsyncFunc {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "FlushAllFiles";
    this.module = "file";
    this.signatures = [
      new Signature("void", [new Parameter("string", "targetId", false)])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 1;
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
 * The implementation of `FlushFile` function.
 * 
 * Persists data written to a file buffer with `WriteFile`. When `FlushFile` is called,
 * the current contents of the buffer is written to the target and the local buffer is discarded.
 * 
 * The target used in this function call must be defined as an activity associated
 * with a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The optional parameter, `filename`, can be used to override the filename used in
 * the activity configuration if it was similarly overridden in the call to the `WriteFile` function.
 * Flushing a file that has never been written to has no effect.
 * 
 * Alternatively, a global variable can be used to override the filename in the activity configuration.
 * Global variables are referenced as `[de_name]` in the activity configuration.
 * If an override filename is used, each buffer is flushed separately for each unique name.
 * 
 * See also the `FlushAllFiles` function.
 */
export class FlushFile extends AsyncFunc {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "FlushFile";
    this.module = "file";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "targetId"),
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
 * The implementation of `ReadFile` function.
 * 
 * Reads the contents of a file from a source.
 * 
 * The source used in this function call must be defined as an activity associated
 * with a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The method returns the contents of the file pointed to by the source.
 * If the source filter selects more than one file, the first one will be used.
 * It is recommended to specify a source that uniquely identifies a single file.
 * 
 * The parameter fileFilter is optional and can be used to override
 * the file filter used in the activity configuration.
 * A filename can be used. Alternatively, a global variable can be used to override
 * the file filter in the activity configuration.
 * Global variables are referenced as `[de_name]` in the activity configuration.
 * 
 * If the `ReadFile()` function fails, the operation does not fail.
 * A script will abort, a warning added to the operation log, and the operation will continue.
 * 
 * This method can be used to read data from an HTTP source.
 * In that case, all Jitterbit `$jitterbit.source.http.*` variables will be populated.
 */
export class ReadFile extends AsyncFunc {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "ReadFile";
    this.module = "file";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "targetId"),
        new Parameter("string", "fileFilter", false)
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
 * The implementation of `WriteFile` function.
 * 
 * Writes the `fileContents` to the target specified by `targetId`.
 * If `fileContents` is of type binary, the binary data is written to the file.
 * In all other cases, a string representation of the data is written.
 * 
 * The target used in this function call must be defined as an activity associated
 * with a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The third parameter, `filename`, is optional and can be used to override
 * the filename used in the activity configuration.
 * Alternatively, a global variable can be used to override
 * the filename in the activity configuration.
 * Global variables are referenced as `[de_name]` in the activity configuration.
 * 
 * This method can also be used to write/post data to an HTTP target.
 * In that case, `$jitterbit.target.http.*` variables will be populated.
 * 
 * If the `WriteFile()` function fails, the operation does not fail.
 * A script will abort, a warning added to the operation log, and the operation will continue.
 */
export class WriteFile extends AsyncFunc {
  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.name = "WriteFile";
    this.module = "file";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "targetId"),
        new Parameter("type", "fileContents"),
        new Parameter("string", "filename", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 3;
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
