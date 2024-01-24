import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { RuntimeVal } from "../../runtime/values";
import { AsyncFunc, Parameter, Signature } from "../types";

/**
 * The implementation of `GetSalesforceTimestamp` function.
 * 
 * Retrieves the current system time from Salesforce.
 * 
 * The timestamp is returned in the format `yyyy-mm-dd HH:MM:SS`, using your Salesforce endpoint's time zone setting by default. You must have logged into Salesforce using the SalesforceLogin function before using this function.
 * The function returns a null value if the call fails.
 * Use the `GetLastError` function to retrieve the error message in that case.
 * 
 * The optional third argument can be used to set the time zone to use.
 * The time zone of your Salesforce endpoint is used by default if a time zone is not provided.
 * The time zone argument must be a time zone recognized by Java's `TimeZone` class.
 * 
 * In a common scenario, the `SalesforceLogin` function is called first.
 * The URL and session ID are then available in these global variables:
 * 
 * - `$Salesforce.ServerUrl`
 * - `$Salesforce.SessionId`
 * 
 * As an alternative to this function, see also the `LoginToSalesforceAndGetTimestamp` function.
 */
export class GetSalesforceTimestamp extends AsyncFunc {
  constructor() {
    super();
    this.name = "GetSalesforceTimestamp";
    this.module = "salesforce";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "url"),
        new Parameter("string", "sessionId"),
        new Parameter("string", "timeZoneId", false)
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
 * The implementation of `LoginToSalesforceAndGetTimeStamp` function.
 * 
 * Logs in to Salesforce using a Salesforce endpoint
 * and retrieves the current system time from Salesforce.
 * 
 * The Salesforce endpoint used in this function call must be defined as
 * a Salesforce connection in the current project.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The login call is made using the credentials in the specified Salesforce endpoint.
 * The timestamp is returned in the format `yyyy-mm-dd HH:MM:SS`, using
 * your Salesforce endpoint's time zone setting by default.
 * The function returns a null value if the call fails.
 * Use the `GetLastError` function to retrieve the error message in that case.
 * 
 * The optional argument can be used to set the time zone to use.
 * The time zone of your Salesforce endpoint is used by default if a time zone is not provided.
 * The time zone argument must be a time zone recognized by Java's `TimeZone` class.
 * 
 * Once this function has been called, the Salesforce URL and session ID are available
 * in these global variables:
 * 
 * - `$Salesforce.ServerUrl`
 * - `$Salesforce.SessionId`
 * 
 * As an alternative to this function, see also the `GetSalesforceTimestamp` function.
 */
export class LoginToSalesforceAndGetTimeStamp extends AsyncFunc {
  constructor() {
    super();
    this.name = "LoginToSalesforceAndGetTimeStamp";
    this.module = "salesforce";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "salesforceOrg"),
        new Parameter("string", "timeZoneId", false)
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
 * The implementation of `SalesforceLogin` function.
 * 
 * Logs into Salesforce, using the specified Salesforce endpoint.
 * 
 * The Salesforce endpoint used in this function call must be defined as
 * a Salesforce connection in the current project.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * After a successful login, these global variables will have been set and can be used
 * in subsequent scripts or mappings:
 * 
 * - `$Salesforce.SessionID`: The Salesforce session ID
 * - `$Salesforce.ServerURL`: The URL to use in subsequent calls to Salesforce in the same session
 * - `$Salesforce.UserID`: The ID of the Salesforce user
 * 
 * The function returns true if the login was successful and false if the login failed.
 * Use the `GetLastError` function to retrieve the error message in that case.
 */
export class SalesforceLogin extends AsyncFunc {
  constructor() {
    super();
    this.name = "SalesforceLogin";
    this.module = "salesforce";
    this.signatures = [
      new Signature("bool", [new Parameter("string", "salesforceOrg")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
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
 * The implementation of `SetSalesforceSession` function.
 * 
 * Sets Salesforce session information for the specified Salesforce endpoint.
 * Use this function if you have an existing Salesforce session ID and server URL.
 * Calling this function will disable the automatic Salesforce login and instead
 * use the provided session information.
 * 
 * The Salesforce endpoint used in this function call must be defined as
 * a Salesforce connection in the current project.
 * For more information, see the instructions on inserting endpoints under the
 * Endpoints section in Jitterbit Script.
 * 
 * After a successful function call, these global variables will have been set and can be used
 * in subsequent scripts or mappings:
 * 
 * - `$Salesforce.SessionID`: The Salesforce session ID.
 * - `$Salesforce.ServerURL`: The URL to use in subsequent calls to Salesforce in the same session.
 * 
 * This function does not validate the input; it only fails if either the session ID
 * or the server URL are empty or the referenced Salesforce endpoint does not exist.
 * If either the session ID or server URL is invalid, subsequent Salesforce operations will fail.
 * 
 * Use the `Eval` function to catch errors, calling the `GetLastError` function
 * to retrieve the error message.
 */
export class SetSalesforceSession extends AsyncFunc {
  constructor() {
    super();
    this.name = "SetSalesforceSession";
    this.module = "salesforce";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "salesforceOrg"),
        new Parameter("string", "sessionId"),
        new Parameter("string", "serverURL")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
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
 * The implementation of `SfCacheLookup` function.
 * 
 * Logs into Salesforce (if necessary) and retrieves the result of the query from Salesforce.
 * Only the value from the first field of the first record is returned.
 * 
 * The Salesforce endpoint used in this function call must be defined
 * as a Salesforce connection in the current project.
 * For more information, see the instructions on inserting endpoints under the
 * Endpoints section in Jitterbit Script.
 * 
 * Values are cached so that subsequent calls with the same exact parameters
 * (Salesforce endpoint and SOQL) do not trigger a call to Salesforce.
 * Salesforce is called only the first time.
 * 
 * The function returns `null` if the login fails, the query returns no records, or the API fails.
 * Use the `GetLastError` function to retrieve the error message in that case.
 */
export class SfCacheLookup extends AsyncFunc {
  constructor() {
    super();
    this.name = "SfCacheLookup";
    this.module = "salesforce";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "salesforceOrg"),
        new Parameter("string", "soql")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
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
 * The implementation of `SfLookup` function.
 * 
 * Logs into Salesforce (if necessary) and retrieves the result of the query from Salesforce.
 * Only the value from the first field of the first record is returned.
 * 
 * The Salesforce endpoint used in this function call must be defined
 * as a Salesforce connection in the current project.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The function returns null if the login fails, the query returns no records, or the API fails.
 * Use the `GetLastError` function to retrieve the error message in that case.
 * 
 * See also the `SFLookupAll` and `SFLookupAllToFile` functions.
 */
export class SfLookup extends AsyncFunc {
  constructor() {
    super();
    this.name = "SfLookup";
    this.module = "salesforce";
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "salesforceOrg"),
        new Parameter("string", "soql")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
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
 * The implementation of `SfLookupAll` function.
 * 
 * Logs into Salesforce (if necessary) and retrieves the result of the query from Salesforce.
 * The returned array is two-dimenional; an array of records, with each record
 * an array of named fields.
 * 
 * The Salesforce endpoint used in this function call must be defined
 * as a Salesforce connection in the current project.
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The function returns null if the login fails, the query returns no records, or the API fails.
 * Use the `GetLastError` function to retrieve the error message in that case.
 * 
 * There are limitations if a relationship query is used:
 * 
 * - Only immediate relationship can be retrieved. The query cannot include a grandchild relationship.
 * - For each query record, each child cannot have multiple records.
 * - In the query statement, the fields under the same child should be grouped together.
 * 
 * See also the `SFLookup` and `SFLookupAllToFile` functions.
 */
export class SfLookupAll extends AsyncFunc {
  constructor() {
    super();
    this.name = "SfLookupAll";
    this.module = "salesforce";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "salesforceOrg"),
        new Parameter("string", "soql")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
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
 * The implementation of `SfLookupAllToFile` function.
 * 
 * Logs into Salesforce (if necessary) and writes the results
 * from Salesforce query to a CSV file.
 * The function returns the number of records retrieved.
 * 
 * The login call is made using the credentials in the specified Salesforce endpoint.
 * The Salesforce endpoint used in this function call must be defined
 * as a Salesforce connection in the current project.
 * 
 * The target used in this function call must be defined as an activity associated with
 * a file-type endpoint in the current project.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * 
 * For more information, see the instructions on inserting endpoints under
 * the Endpoints section in Jitterbit Script.
 * 
 * The function returns `null` if the login fails, the query returns no records, or the API fails.
 * Use the `GetLastError` function to retrieve the error message in that case.
 * 
 * See also the `SFLookup` and `SFLookupAll` functions.
 */
export class SfLookupAllToFile extends AsyncFunc {
  constructor() {
    super();
    this.name = "SfLookupAllToFile";
    this.module = "salesforce";
    this.signatures = [
      new Signature("number", [
        new Parameter("string", "salesforceOrg"),
        new Parameter("string", "soql"),
        new Parameter("string", "targetId")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
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
