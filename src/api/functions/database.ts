import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbBool } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { TypedExpr, TypedIdentifier, TypeInfo } from "../../typechecker/ast";
import TypeEnv from "../../typechecker/environment";
import { AsyncFunc, Func, Parameter, Signature } from "../types";

/**
 * The implementation of `CacheLookup` function.
 * 
 * This function is the same as `DBLookup`, except that the first lookup caches the information
 * and subsequent lookups use this cache instead of repeatedly querying the database
 * (an alternative to caching is to use the functions `Set` and `Get`).
 * 
 * If there are no rows returned for the query specified in `sql`, the function returns `null`.
 * 
 * The global Jitterbit variable `$jitterbit.scripting.db.rows_affected` is not set by this method.
 * 
 * The database used in this function call must be defined as a Database connection in the current project.
 * For more information, see the instructions on inserting endpoints under the Endpoints section in Jitterbit Script.
 */
export class CacheLookup extends AsyncFunc {
  constructor() {
    super();
    this.name = "CacheLookup";
    this.module = "database";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "databaseId"),
        new Parameter("string", "sql")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "This function is the same as `DBLookup`, except that the first lookup caches the information and subsequent lookups use this cache instead of repeatedly querying the database (an alternative to caching is to use the functions `Set` and `Get`).\n\nIf there are no rows returned for the query specified in `sql`, the function returns `null`.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-cachelookup).";
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // databaseId
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // sql
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `CallStoredProcedure` function.
 * 
 * Calls the stored procedure `spName` using the connection information specified by
 * the Database connection identified by `databaseId`.
 * 
 * If applicable, the returned `resultSet` is a two-dimensional array of strings.
 * If the stored procedure returns no `resultSet` or if using an ODBC driver, this argument is ignored.
 * 
 * The remaining optional parameters are used to pass input and output arguments to the stored procedure.
 * The number of arguments required depends on the signature of the stored procedure.
 * 
 * Input arguments can be a hard-coded value, the value of a source, or the value
 * of a calculation or formula. Output arguments (including the `resultSet`) are specified
 * by reference as `$name`, where `name` is the name of the global variable
 * that will hold the output value. The return value and type of the function is
 * the return value and type of the stored procedure.
 * 
 * The database used in this function call must be defined as a Database connection in the current project.
 * For more information, see the instructions on inserting endpoints under the Endpoints section
 * in Jitterbit Script.
 * 
 * Supports up to 100-argument calls.
 */
export class CallStoredProcedure extends AsyncFunc {
  constructor() {
    super();
    this.name = "CallStoredProcedure";
    this.module = "database";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "databaseId"),
        new Parameter("string", "spName"),
        new Parameter("type", "resultSet"),
        new Parameter("string", "inputOutputVariable", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    this.maxArgs = 100;
    this.docs = "Calls the stored procedure `spName` using the connection information specified by the database connection identified by `databaseId`.\n\nIf applicable, the returned `resultSet` is a two-dimensional array of strings. If the stored procedure returns no `resultSet` or if using an ODBC driver, this argument is ignored.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-callstoredprocedure).";
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // databaseId
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // spName
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // resultSet
    info = args[argIdx].typeExpr(env);
    if(args[argIdx].kind !== "GlobalIdentifier")
      args[argIdx].warning = `Argument '${this.signature.params[argIdx].name}' is expected to be a global variable for the stored procedure call results.`;
    argIdx++;
    // inputOutputVariable
    if(args.length > 3) {
      for(argIdx; argIdx < args.length; argIdx++) {
        info = args[argIdx].typeExpr(env);
        if(args[argIdx].kind !== "GlobalIdentifier")
          args[argIdx].warning = `Argument '${this.signature.params[3].name}' is expected to be a global variable.`;
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `DBCloseConnection` function.
 * 
 * Commits the current transaction and closes the Database connection.
 * 
 * The database used in this function call must be defined as a Database connection in the current project.
 * For more information, see the instructions on inserting endpoints under the Endpoints section
 * in Jitterbit Script.
 */
export class DBCloseConnection extends AsyncFunc {
  constructor() {
    super();
    this.name = "DBCloseConnection";
    this.module = "database";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "databaseId")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Commits the current transaction and closes the database connection.\n\nThe database used in this function call must be defined as a Database connection in the current project. For more information, see [Endpoints](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/scripts/jitterbit-script#jitterbitscript-connectors).";
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `DBExecute` function.
 * 
 * Executes a SQL statement on a database and returns the results.
 * 
 * If the SQL statement produces a result set, there are two ways to retrieve the data:
 * 
 * - If you specify only the two required parameters (first form),
 * the function will return the full record set as an array of rows.
 * 
 *     You can then use a `While()` loop to iterate over the rows and use `Get()` to retrieve the data.
 *     If no rows are returned, the method returns an empty array `(Length($arr) == 0)`.
 * 
 * - If you specify output variables in addition to the two required parameters (second form),
 * the values of the fields of the first row are returned.
 * 
 *     Pass names of global variables within quotes as parameters after the first two parameters.
 *     The value of the first field of the first row will be written to the global variable passed
 *     as the third parameter, the second field of the first row to the fourth parameter, and so on.
 *     Alternatively, the global variables can be passed by reference by preceding them
 *     with a `$` sign, such as `$output`.
 * 
 *     The return value in this case is the number of records returned; either 1 (if records were found)
 *     or 0 (if none were returned).
 * 
 * The returned data values are always strings.
 * Binary data is returned as its hex-string representation.
 * 
 * The database used in this function call must be defined as a Database connection in the current project.
 * For more information, see the instructions on inserting endpoints under the Endpoints section
 * in Jitterbit Script.
 * 
 * Supports up to 100-argument calls.
 */
export class DBExecute extends AsyncFunc {
  constructor() {
    super();
    this.name = "DBExecute";
    this.module = "database";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "databaseId"),
        new Parameter("string", "sql")
      ]),
      new Signature("number", [
        new Parameter("string", "databaseId"),
        new Parameter("string", "sql"),
        new Parameter("string", "outputVariable")
      ])
    ];
    this.minArgs = 2;
    this.maxArgs = 100;
    this.docs = "Executes a SQL statement on a database and returns the results.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dbexecute)."
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
    this.signature = this.signatures[args.length === 2 ? 0 : 1];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    const sigIdx = args.length > 2 ? 1 : 0;
    // databaseId
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signatures[sigIdx].params[argIdx++], info.type);
    // sql
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signatures[sigIdx].params[argIdx], info.type);

    if(args.length === 2)
      return {type: this.signatures[sigIdx].returnType};

    // outputVariable
    for(argIdx = 2; argIdx < args.length; argIdx++) {
      info = args[argIdx].typeExpr(env);
      if(info.type === "unassigned") {
        args[argIdx].type = "error";
        args[argIdx].error = `Local variable '${(args[argIdx] as TypedIdentifier).symbol}' hasn't been initialized.`;
      }
      else if(args[argIdx].kind !== "GlobalIdentifier" && info.type !== "string")
        args[argIdx].warning = `Argument '${this.signatures[sigIdx].params[2].name + (argIdx - 1)}' should be a global variable or a string with the name of a global variable.`;
    }
    return {type: this.signatures[sigIdx].returnType};
  }
}

/**
 * The implementation of `DBLoad` function.
 * 
 * Takes a source (a single file in CSV format) and loads the data into a specified
 * table in a target database.
 * 
 * The parameter `columnKeynames` is not used when only inserting (`mode=2`)
 * and may be omitted in that case.
 */
export class DBLoad extends AsyncFunc {
  constructor() {
    super();
    this.name = "DBLoad";
    this.module = "database";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "source"),
        new Parameter("string", "target"),
        new Parameter("number", "mode"),
        new Parameter("string", "tablename"),
        new Parameter("string", "columnNames"),
        // Required if mode is not 2.
        // good job jitterbit
        new Parameter("string", "columnKeynames", false),
        new Parameter("number", "skipLines", false),
        new Parameter("string", "dateFormat", false),
        new Parameter("string", "datetimeFormat", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 5;
    this.maxArgs = 9;
    this.docs = "Takes a source (a single file in CSV format) and loads the data into a specified table in a target database.\n\nThe parameter `columnKeynames` is not used when only inserting (`mode=2`) and may be omitted in that case.";
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
    this.signature = this.signatures[args[2].toNumber() === 2 ? 0 : 1];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // source
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // target
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // mode
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkOptArg(this.signature.params[argIdx++], info.type);
    // tablename
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // columnNames
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);

    if(args.length > 5) {
      // columnKeynames
      info = args[++argIdx].typeExpr(env);
      args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
      if(args.length > 6) {
        // skipLines
        info = args[++argIdx].typeExpr(env);
        args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
        if(args.length > 7) {
          // dateFormat
          info = args[++argIdx].typeExpr(env);
          args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
          if(args.length > 8) {
            // datetimeFormat
            info = args[++argIdx].typeExpr(env);
            args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
          }
        }
      }
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `DBLookup` function.
 * 
 * Executes a SQL statement on a database and returns the first field of
 * the first result matching the specified criteria.
 * 
 * The returned data value is always a string.
 * Binary data is returned as its hex-string representation.
 * If there are no rows returned for the specified query, the function returns null.
 * 
 * The global Jitterbit variable `$jitterbit.scripting.db.rows_affected` is not set by this method.
 * 
 * For more advanced queries, where you want to retrieve more than one value or row,
 * use the functions `DBLookupAll` or `DBExecute`.
 */
export class DBLookup extends AsyncFunc {
  constructor() {
    super();
    this.name = "DBLookup";
    this.module = "database";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "databaseId"),
        new Parameter("string", "sql")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Executes a SQL statement on a database and returns the first field of the first result matching the specified criteria.\n\nThe returned data value is always a string.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dblookup).";
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // databaseId
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // sql
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);

    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `DBLookupAll` function.
 * 
 * Executes a SQL statement on a database and returns the results matching the specified criteria.
 * 
 * The returned data is always returned as a two-dimensional array of strings.
 * Binary data is returned as its hex-string representation.
 * If there are no rows returned for the specified query, the function returns an empty array.
 * 
 * The global Jitterbit variable `$jitterbit.scripting.db.rows_affected` is not set by this method.
 * 
 * The database used in this function call must be defined as a Database connection
 * in the current project.
 * For more information, see the instructions on inserting endpoints under the Endpoints section
 * in Jitterbit Script.
 * 
 * For more advanced queries, where you want to retrieve directly into global variables,
 * use the function `DBExecute`.
 */
export class DBLookupAll extends AsyncFunc {
  constructor() {
    super();
    this.name = "DBLookupAll";
    this.module = "database";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "databaseId"),
        new Parameter("string", "sql")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
    this.docs = "Executes a SQL statement on a database and returns the results matching the specified criteria.\n\nThe returned data is always returned as a two-dimensional array of strings.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dblookupall).";
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // databaseId
    let info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);
    // sql
    info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);

    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `DBRollbackTransaction` function.
 * 
 * Rolls back the current transaction and closes the Database connection.
 * 
 * The database used in this function call must be defined as a database connection
 * in the current project.
 * For more information, see the instructions on inserting endpoints under the Endpoints section
 * in Jitterbit Script.
 */
export class DBRollbackTransaction extends AsyncFunc {
  constructor() {
    super();
    this.name = "DBRollbackTransaction";
    this.module = "database";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "databaseId")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
    this.docs = "Rolls back the current transaction and closes the Database connection.\n\nThe database used in this function call must be defined as a database connection in the current project.";
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

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    const argIdx = 0;
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx], info.type);
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `DBWrite` function.
 * 
 * An alias for the function `DBLoad`. See `DBLoad` for details.
 */
export class DBWrite extends DBLoad {
  constructor() {
    super();
    this.name = "DBWrite";
    this.docs = "An alias for the function `DBLoad`. See [`DBLoad`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dbload) for details.";
  }
}

/**
 * The implementation of `SetDBInsert` function.
 * 
 * Overrides the current setting of the insert/update mode to "insert" for the current record.
 * The return value is `null`.
 */
export class SetDBInsert extends Func {
  constructor() {
    super();
    this.name = "SetDBInsert";
    this.module = "database";
    this.signatures = [
      new Signature("void", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Overrides the current setting of the insert/update mode to \"insert\" for the current record. The return value is `null`.";
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `SetDBUpdate` function.
 * 
 * Overrides the current setting of the insert/update mode to "update" for the current record.
 * The return value is `null`.
 */
export class SetDBUpdate extends Func {
  constructor() {
    super();
    this.name = "SetDBUpdate";
    this.module = "database";
    this.signatures = [
      new Signature("void", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "Overrides the current setting of the insert/update mode to \"update\" for the current record. The return value is `null`.";
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `SQLEscape` function.
 * 
 * Performs the necessary escaping of literal strings used in a SQL statement.
 * 
 * Strings used as character constants in a SQL statement uses a single quote (`'`)
 * as a delimiter; if the actual data contains single quotes, they need to be escaped by
 * specifying them twice.
 * This method escapes single quotes following the SQL standard by replacing each single quote
 * (`'`) with two single quotes (`''`).
 * If backslash characters should also be escaped, provide and set the second parameter to `true`.
 */
export class SQLEscape extends Func {
  constructor() {
    super();
    this.name = "SQLEscape";
    this.module = "database";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "unescapedSQL"),
        new Parameter("bool", "escapeBackslash", false, new JbBool(false)),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
    this.docs = "Performs the necessary escaping of literal strings used in a SQL statement.\n\nSee full documentation [here](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-sqlescape).";
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    let argIdx = 0;
    // unescapedSQL
    const info = args[argIdx].typeExpr(env);
    args[argIdx].checkReqArg(this.signature.params[argIdx++], info.type);

    if(args.length === 2) {
      // escapeBackslash
      const info = args[argIdx].typeExpr(env);
      args[argIdx].checkOptArg(this.signature.params[argIdx], info.type);
    }
    return {type: this.signature.returnType};
  }
}

/**
 * The implementation of `Unmap` function.
 * 
 * For use in mappings, this function sets a database target field to be treated as unmapped.
 * The return value is `null`.
 */
export class Unmap extends Func {
  constructor() {
    super();
    this.name = "Unmap";
    this.module = "database";
    this.signatures = [
      new Signature("void", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
    this.docs = "For use in mappings, this function sets a database target field to be treated as unmapped. The return value is `null`.";
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }

  analyzeCall(args: TypedExpr[], env: TypeEnv): TypeInfo {
    return {type: this.signature.returnType};
  }
}
