import { Func, SystemVariable } from "./api/types";
import * as Arrays from "./api/functions/array";
import * as Cache from "./api/functions/cache";
import * as Conversion from "./api/functions/conversion";
import * as Crypto from "./api/functions/crypto";
import * as Database from "./api/functions/database";
import * as Datetime from "./api/functions/datetime";
import * as Debug from "./api/functions/debug";
import * as Dicts from "./api/functions/dict";
import * as Diff from "./api/functions/diff";
import * as Email from "./api/functions/email";
import * as EnvInfo from "./api/functions/envinfo";
import * as Error from "./api/functions/error";
import * as File from "./api/functions/file";
import * as General from "./api/functions/general";
import * as Instance from "./api/functions/instance";
import * as LDAP from "./api/functions/ldap";
import * as Log from "./api/functions/log";
import * as Logical from "./api/functions/logical";
import * as Math from "./api/functions/math";
import * as NetSuite from "./api/functions/netsuite";
import * as Salesforce from "./api/functions/salesforce";
import * as String from "./api/functions/string";
import * as Text from "./api/functions/text";
import * as XML from "./api/functions/xml";

type SystemVariables = {
  /**
   * Strictly checked Jitterbit variables.
   * 
   * Naming: `$jitterbit.<modules>.<prop>`
   */
  static: SystemVariable[];
  /**
   * Jitterbit variables with multiple valid endings.
   * 
   * Naming: `$jitterbit.<modules>.*`
   */
  extendable: SystemVariable[];
};

/**
 * Jitterbit script API.
 */
export default class Api {
  static sysVars: SystemVariables;
  static functions: Func[];

  static {
    Api.sysVars = {
      static: [
        {
          name: "$jitterbit.api.request.body",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Looks at the payloads submitted to the API. Note that for the majority of the APIs, you would expect only one plain payload and, as such, `jitterbit.api.request.body` is the variable to use (also known as `content-type:text/plain`).\n\nIf you expect multiple payloads to be submitted at once, using the URL-encoded form (also known as `content-type:application/x-www-form-urlencoded`), as in the case of an API being used as the backend of a submission form (see [form docs](http://www.w3.org/TR/html401/interact/forms.html)), then you should be using `jitterbit.api.request.body.*`. As with `jitterbit.api.request.parameters.*`, `jitterbit.api.request.body.name` will be equal to `EStore` if the value of the form's field \"name\" was entered as `EStore`."
        },
        {
          name: "$jitterbit.api.request.enum.body",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Variable array used to dynamically iterate through all of the submitted parts of the payload/body (versus checking a specific part as with `jitterbit.api.request.body.*`). The usage is the same as with the `jitterbit.api.request.enum.parameters`."
        },
        {
          name: "$jitterbit.api.request.enum.headers",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Variable array used to dynamically iterate through all of the request headers (versus checking specific headers as with `jitterbit.api.request.headers.*`). The usage is the same as with the `jitterbit.api.request.enum.parameters` and `jitterbit.api.request.enum.body`."
        },
        {
          name: "$jitterbit.api.request.enum.mvparameters",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Variable array used to dynamically iterate through all of the multi-value parameters (as opposed to checking each parameter specifically as `jitterbit.api.request.mvparameters.ProdID`)."
        },
        {
          name: "$jitterbit.api.request.enum.parameters",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Variable array used to dynamically iterate through all of the submitted parameters (as opposed to checking each parameter specifically as `jitterbit.api.request.parameters.name`)."
        },
        {
          name: "$jitterbit.api.request.headers.fulluri",
          module: "api",
          type: "info",
          dataType: "String",
          description: "The URL that was called to trigger the Jitterbit OData or Custom API."
        },
        {
          name: "$jitterbit.api.request.method",
          module: "api",
          type: "info",
          dataType: "String",
          description: "The request method that was used to call the API."
        },
        {
          name: "$jitterbit.api.response",
          module: "api",
          type: "setting",
          dataType: "String",
          description: "This variable must be set if your Custom API is configured to use a system variable as the response type. The `jitterbit.api.response` variable can be used multiple times throughout an operation chain, but it must be set for each use."
        },
        {
          name: "$jitterbit.api.response.blank_error_response",
          module: "api",
          type: "setting",
          dataType: "Boolean",
          description: "Allows a blank API response to be returned for non-`200`-type status codes when `jitterbit.api.response.blank_error_response` is set to `true`. When set to `false` (default), an HTML status page is rendered for the returned status code. Available for use with agent and API Gateway versions 10.59 or later."
        },
        {
          name: "$jitterbit.api.response.status_code",
          module: "api",
          type: "setting",
          dataType: "String",
          description: "Provides the ability to override HTTP response code for custom APIs via Jitterbit script variable. Set the `jitterbit.api.response.status_code` variable in the script that is executed by a Custom API. This allows project authors to set a specific HTTP error code (along with actual payload information) versus relying on the system to return codes 200 or 500 based on default behavior."
        },
        {
          name: "$jitterbit.networking.http.request.method",
          module: "networking",
          type: "setting",
          dataType: "String",
          description: "When an HTTP Endpoint is called, this variable is set to the method used (GET, PUT, and POST are the most common values)."
        },
        {
          name: "$jitterbit.networking.http.response.content_type",
          module: "networking",
          type: "setting",
          dataType: "String",
          description: "Set this variable to override the response content type for a Hosted HTTP Endpoint."
        },
        {
          name: "$jitterbit.networking.http.response.status_code",
          module: "networking",
          type: "setting",
          dataType: "Integer",
          description: "Set this variable to override the response status code for a Hosted HTTP Endpoint. By default Jitterbit, returns the status code 200. This variable can be used to set a custom success code (`2xx`), redirect (`3xx`), client error (`4xx`), or server error (`5xx`). Illegal values will revert to 200."
        },
        {
          name: "$jitterbit.networking.peer.ip",
          module: "networking",
          type: "setting",
          dataType: "String",
          description: "Set when handling a hosted web service call or a Hosted HTTP Endpoint. Holds the IP number of the host calling the web service or accessing the Hosted HTTP Endpoint."
        },
        {
          name: "$jitterbit.netsuite.async",
          module: "netsuite",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Set to `true` for API calls to NetSuite to run asynchronously. That is, after a request is made, the connection is kept open and Jitterbit Harmony will periodically poll to see if the request is finished.\n\nWhen this variable is set to `true`, the **Retry on Recoverable Exception** setting on a [NetSuite Connector Endpoint](https://success.jitterbit.com/design-studio/design-studio-reference/connectors/netsuite-connector/netsuite-connector-endpoint) is ignored."
        },
        {
          name: "$jitterbit.operation.error",
          module: "operation",
          type: "info",
          dataType: "String",
          description: "All errors that have occurred in the operation, separated by line breaks."
        },
        {
          name: "$jitterbit.operation.info",
          module: "operation",
          type: "info",
          dataType: "String",
          description: "Informational messages from the operation log, separated by line breaks. This variable was added in Jitterbit Harmony version 8.21."
        },
        {
          name: "$jitterbit.operation.warning",
          module: "operation",
          type: "info",
          dataType: "String",
          description: "Warnings from the operation log, separated by line breaks. This variable was added in Jitterbit Harmony version 8.21."
        },
        {
          name: "$jitterbit.operation.guid",
          module: "operation",
          type: "info",
          dataType: "String",
          description: "The GUID of the currently executing operation."
        },
        {
          name: "$jitterbit.operation.last_error",
          module: "operation",
          type: "info",
          dataType: "String",
          description: "The last error that occurred in the operation."
        },
        {
          name: "$jitterbit.operation.name",
          module: "operation",
          type: "info",
          dataType: "String",
          description: "Name of the currently executing operation."
        },
        {
          name: "$jitterbit.operation.previous.error",
          module: "operation",
          type: "info",
          dataType: "String",
          description: "Error reported from previous operation if that operation failed."
        },
        {
          name: "$jitterbit.operation.previous.success",
          module: "operation",
          type: "info",
          dataType: "String",
          description: "At the end of a successful transformation, this variable updates with any messages from the transformation.\n\nAt the end of a successful operation, this variable updates with all messages from the operation."
        },
        {
          name: "$jitterbit.operation.chunking.warn_on_error",
          module: "operation",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "If set to `true` and chunking is enabled, ignores errors in a single chunk, but logs a warning. Instead of a fatal error, continues to the next chunk."
        },
        {
          name: "$jitterbit.operation.log_level",
          module: "operation",
          type: "setting",
          dataType: "Integer",
          description: "Set to the minimal log level that should result in an entry in the operation log. Can be used to disable logging of success messages if speed is a main concern. These values are valid:\n- `1` - Log everything.\n- `2` - Log errors and warnings.\n- `3` - Log only errors."
        },
        {
          name: "$jitterbit.operation.write_history",
          module: "operation",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "Set to false to disable writing operation history. Do this only if speed is of utmost importance."
        },
        {
          name: "$jitterbit.scripting.db.auto_commit",
          module: "scripting",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "Set to `false` to run [`DbExecute`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dbexecute) and [`DbLookup`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dblookup) statements in a transaction. Auto-commit is turned on by default."
        },
        {
          name: "$jitterbit.scripting.db.max_rows",
          module: "scripting",
          type: "setting",
          dataType: "Integer",
          default: "10000",
          description: "Maximum number of rows to fetch in a call to [`DbExecute`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dbexecute)."
        },
        {
          name: "$jitterbit.scripting.db.rows_affected",
          module: "scripting",
          type: "setting",
          dataType: "Integer",
          description: "The number of rows affected by a call to [`DbExecute`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dbexecute) or [`DbLookup`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dblookup)."
        },
        {
          name: "$jitterbit.scripting.db.transaction",
          module: "scripting",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Set to `true` if you want [`DbExecute`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dbexecute)/[`DbLookup`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-dblookup) calls to run in a transaction."
        },
        {
          name: "$jitterbit.scripting.ldap.include_dn_in_results",
          module: "scripting",
          type: "setting",
          dataType: "Boolean",
          description: "When set, XML-formatted [`LdapSearch`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/ldap-functions/#ldapfunctions-ldapsearch) results will include the `DN` attribute for each `Entry`."
        },
        {
          name: "$jitterbit.scripting.hex.enable_unicode_support",
          module: "scripting",
          type: "setting",
          dataType: "Boolean",
          description: "Set to `true` upstream of the [`HexToString`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/conversion-functions/#conversionfunctions-hextostring) or [`StringToHex`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/conversion-functions/#conversionfunctions-stringtohex) functions to convert between UTF-8 string values and their hexadecimal representations. This variable is supported when using agent versions 10.70.1 or later or 11.8.1 or later.",
          default: "false"
        },
        {
          name: "$jitterbit.scripting.ldap.max_search_results",
          module: "scripting",
          type: "setting",
          dataType: "Integer",
          description: "The maximum number of entries [`LdapSearch`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/ldap-functions/#ldapfunctions-ldapsearch) should return."
        },
        {
          name: "$jitterbit.scripting.ldap.return_null_if_no_results",
          module: "scripting",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "If an LDAP query returns no results, a `null` data element is returned. The default is to return an empty array data element. This is for backward-compatibility only."
        },
        {
          name: "$jitterbit.scripting.ldap.scope",
          module: "scripting",
          type: "setting",
          dataType: "Integer",
          description: "The scope [`LdapSearch`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/ldap-functions/#ldapfunctions-ldapsearch) should use. These options are valid:\n- `0` - Search the base entry only\n- `1` - Search all entries in the first level below the base entry, excluding the base entry.\n- `2` - Search the base entry and all entries in the tree below the base."
        },
        {
          name: "$jitterbit.scripting.ldap.use_paged_search",
          module: "scripting",
          type: "setting",
          dataType: "Integer",
          description: "Use paged search when searching LDAP directories. This option is useful for retrieving large result sets.\n\nThis variable is supported only on Windows-based Private Agents and is not supported on Linux-based Private Agents or the Cloud Agent Groups. To work around this limitation, we suggest using an LDAP user that is not restricted by the search size limit imposed by the LDAP server, such as an admin user, or adjusting the search size limit setting on the LDAP server itself."
        },
        {
          name: "$jitterbit.scripting.nesting.max",
          module: "scripting",
          type: "setting",
          dataType: "Integer",
          default: "10",
          description: "Maximum nesting level for [`RunScript`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-runscript)/[`RunOperation`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/general-functions/#generalfunctions-runoperation) calls. If the nesting level is exceeded, the operation will fail. If your application needs deeper nesting, increase this number."
        },
        {
          name: "$jitterbit.scripting.while.max_iterations",
          module: "scripting",
          type: "setting",
          dataType: "Integer",
          default: "50000",
          description: "The maximum number of times that the body of a [`While`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/logical-functions/#logicalfunctions-while) loop will execute. Setting this number to less than 1 reverts to the default of 50,000 iterations."
        },
        {
          name: "$jitterbit.sfdc.failure_record_count",
          module: "sfdc",
          type: "info",
          dataType: "Integer",
          description: "Returns the number of failure records from a Salesforce upsert, insert, update, or delete operation."
        },
        {
          name: "$jitterbit.sfdc.query.record_count",
          module: "sfdc",
          type: "info",
          dataType: "Integer",
          description: "Returns the number of records returned by a Salesforce query operation."
        },
        {
          name: "$jitterbit.sfdc.success_record_count",
          module: "sfdc",
          type: "info",
          dataType: "Integer",
          description: "Returns the number of success records from a Salesforce upsert, insert, update, or delete operation."
        },
        {
          name: "$jitterbit.sfdc.auto_fieldsToNull",
          module: "sfdc",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "If set to `true`, `fieldsToNull` elements for Salesforce web service calls will be automatically inserted when `null` or an empty string is mapped to a field. The default is `true` for backwards compatibility with previous versions where this was a manual process. This flag should be set to `true` if you plan to map `null` or empty fields and expect those to be set to `null` in Salesforce."
        },
        {
          name: "$jitterbit.sfdc.dbsource.sfheader",
          module: "sfdc",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Applies to Salesforce update and Salesforce upsert operations. If set to `true`, allows you to capture the header string from a database source and write the string at the beginning of success and/or failure files."
        },
        {
          name: "$jitterbit.source.filename",
          module: "source",
          type: "info",
          dataType: "String",
          description: "The name of the source file. Holds the leaf part of the locator. For example, if the locator is `ftp://ordersrv/orderdrop/po.xml`, the name of the source file is `po.xml`. This variable is available only while a transformation using this particular file is executing."
        },
        {
          name: "$jitterbit.source.filenames",
          module: "source",
          type: "info",
          dataType: "Array",
          description: "Same as `jitterbit.source.locators` but holding only the leaf part of the locators (see `jitterbit.source.locator`). This variable is available unless it has been overwritten by another operation in an operation chain."
        },
        {
          name: "$jitterbit.source.ftp.return_code",
          module: "source",
          type: "info",
          dataType: "Integer",
          description: "The response status code returned from an FTP source when used in an operation or [`ReadFile`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/file-functions/#filefunctions-readfile) script function. If no status code is returned, the reported value is `-1`."
        },
        {
          name: "$jitterbit.source.http.response",
          module: "source",
          type: "info",
          dataType: "String",
          description: "The response body returned from an HTTP source when used in an operation or [`ReadFile`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/file-functions/#filefunctions-readfile) script function. This variable is populated only when the operation or function fails. Available as of Jitterbit Harmony version 8.20."
        },
        {
          name: "$jitterbit.source.http.status_code",
          module: "source",
          type: "info",
          dataType: "Integer",
          description: "The response status code returned from an HTTP source when used in an operation or [`ReadFile`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/file-functions/#filefunctions-readfile) script function. If no status code is returned, the reported value is `-1`."
        },
        {
          name: "$jitterbit.source.locator",
          module: "source",
          type: "info",
          dataType: "String",
          description: "The locator used to fetch a file. This can be a URL or a path to a file share, such as `ftp://ordersrv/orderdrop/po.xml`. This variable is available only while a transformation using this particular file is executing."
        },
        {
          name: "$jitterbit.source.locators",
          module: "source",
          type: "info",
          dataType: "Array",
          description: "An array containing all the locators that will be processed. This variable is available after the source files have been fetched. It is available as long as it has not been overwritten by another operation in an operation chain."
        },
        {
          name: "$jitterbit.source.sftp.ssh_key_id",
          module: "source",
          type: "setting",
          dataType: "String",
          default: "",
          description: "For configuring multiple SSH keys. By default, these are both empty, meaning the configuration in the `[SSH]` section of the `jitterbit.conf` configuration is used for all SFTP sources and targets with no password defined."
        },
        {
          name: "$jitterbit.source.size",
          module: "source",
          type: "info",
          dataType: "Integer",
          description: "Size of the source file in bytes. The size is `0` for database sources."
        },
        {
          name: "$jitterbit.source.sizes",
          module: "source",
          type: "info",
          dataType: "Array",
          description: "An array containing all the sizes of the source files that will be processed. This variable is available after the source files have been fetched. It is available as long as it has not been overwritten by another operation in an operation chain."
        },
        {
          name: "$jitterbit.source.db.character_encoding",
          module: "source",
          type: "setting",
          dataType: "String",
          description: "Specifies the character encoding for ODBC source database character/text columns. If no encoding is specified, `Latin-1` (ISO-8859-1) is assumed. For supported encoding, see [Supported Character Encodings](https://success.jitterbit.com/agent/supported-character-encodings)."
        },
        {
          name: "$jitterbit.source.db.preserve_char_whitespace",
          module: "source",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Preserves whitespace in `char(n)` database source columns if the length of the data is less than `n`."
        },
        {
          name: "$jitterbit.source.db.schema_name_delimiter",
          module: "source",
          type: "setting",
          dataType: "String",
          default: ".",
          description: "Character used by the source database to delimit the schema name from the table name, such as `Schema.Tab`. The default is a single period (`.`), as most databases use a period as the delimiter."
        },
        {
          name: "$jitterbit.source.db.trim",
          module: "source",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Trim white-space characters from values read from the database."
        },
        {
          name: "$jitterbit.source.file_limit",
          module: "source",
          type: "setting",
          dataType: "Integer",
          description: "Maximum number of files to process for a file share or FTP source. This limit is applied after the files have been listed and filtered."
        },
        {
          name: "$jitterbit.source.file_share.file_list_limit",
          module: "source",
          type: "setting",
          dataType: "Integer",
          description: "This option limits the number of files that are listed for a file share. It is applied before the filter. This option is more efficient than `jitterbit.source.file_limit`, but it can be used only if all the files in a directory are to be processed. In all other cases, use `jitterbit.source.file_limit` for file share sources."
        },
        {
          name: "$jitterbit.source.ftp.encode_url",
          module: "source",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Set to `true` in a transformation script to use encoding where a filename or folder name contains special characters such as `#`, `%`, or `@`. For example, `sftp://reposit.mysite.com/storage/file#1.xml`."
        },
        {
          name: "$jitterbit.source.ftp.transfer_timeout",
          module: "source",
          type: "setting",
          dataType: "Integer",
          description: "Set the transfer time-out in seconds for FTP source transfers. The default transfer time-out for FTP is four hours (14,400 seconds). Set to zero to disable."
        },
        {
          name: "$jitterbit.source.http.max_redirs",
          module: "source",
          type: "setting",
          dataType: "Integer",
          default: "0",
          description: "Maximum number of redirects to follow when using an HTTP source. Set this variable to a negative number to follow any number of redirects. The default is `0`; no redirects are followed."
        },
        {
          name: "$jitterbit.source.http.ssl_cert_id",
          module: "source",
          type: "setting",
          dataType: "String",
          description: "An identifier for a configuration entry in the configuration file `jitterbit.conf` for the SSL certificate to use for HTTP sources. Also see [Customizations > Client Certificates](https://success.jitterbit.com/management-console/customizations/customizations-client-certificates) and [Adding Certificates to Keystore for Private Agents](https://success.jitterbit.com/agent/private-agents/private-agent-how-tos/add-certificates-to-keystore)."
        },
        {
          name: "$jitterbit.source.http.transfer_timeout",
          module: "source",
          type: "setting",
          dataType: "Integer",
          description: "Sets the transfer time-out in seconds for HTTP source transfers. The default transfer time-out for HTTP is one hour (3,600 seconds). Set to zero to disable."
        },
        {
          name: "$jitterbit.source.preserve_char_whitespace",
          module: "source",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Set this to `true` to preserve whitespace in source data. The default value is `false`, meaning white space will be trimmed from the beginning and end of strings in the source."
        },
        {
          name: "$jitterbit.source.text.character_encoding",
          module: "source",
          type: "setting",
          dataType: "String",
          description: "Specify the character encoding for text source documents. If no encoding is specified, `Latin-1` (ISO-8859-1) is assumed. For supported encoding, see [Supported Character Encodings](https://success.jitterbit.com/agent/supported-character-encodings)."
        },
        {
          name: "$jitterbit.source.text.csv_nullable",
          module: "source",
          type: "setting",
          dataType: "Boolean",
          description: "If set to `true`, CSV files can contain `null` data elements. Two consecutive commas in a file will be interpreted as a `null`."
        },
        {
          name: "$jitterbit.target.file_count",
          module: "target",
          type: "info",
          dataType: "Integer",
          description: "After all the input files have been transformed, this variable is set to the number of target files that will be transferred."
        },
        {
          name: "$jitterbit.target.ftp.return_code",
          module: "target",
          type: "info",
          dataType: "Integer",
          description: "The response status code returned from an FTP target when used in an operation or [`WriteFile`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/file-functions/#filefunctions-writefile) script function. If no status code is returned, the reported value is `-1`."
        },
        {
          name: "$jitterbit.target.http.status_code",
          module: "target",
          type: "info",
          dataType: "Integer",
          description: "The response status code returned from a HTTP target when used in an operation or [`WriteFile`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/file-functions/#filefunctions-writefile) script function. If no status code is returned, the reported value is `-1`."
        },
        {
          name: "$jitterbit.target.chunk_node_name",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "If chunking (splitting a file apart) is enabled, a node is the repeating record (or loop node) at which it is possible to split the file.\n\nFor example, in an XML file, the named levels (repeating records) could be root, organization, department, and employee. You could choose to chunk (split) the file on department or on employee.\n\nIt is also possible to set the node in [Operation Options](https://success.jitterbit.com/design-studio/design-studio-reference/operations/operation-options)."
        },
        {
          name: "$jitterbit.target.chunk_size",
          module: "target",
          type: "setting",
          dataType: "Integer",
          description: "Two possible cases where `jitterbit.target.chunk_size = 2000`:\n\n- **Case 1**: Source chunking is turned off, perform target chunking with size = `2000`.\n\n- **Case 2**: Source chunking is turned on, it will combine the target first and then chunk the combined target to size = `2000`."
        },
        {
          name: "$jitterbit.target.chunking_uncombined",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          description: "If set to `true`, and source chunking is turned on, target chunk files are not combined. This allows for 1 target file per record."
        },
        {
          name: "$jitterbit.target.db.character_encoding",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "Specify the character encoding for ODBC target database character/text columns. If no encoding is specified, `Latin-1` (ISO-8859-1) is assumed. For supported encoding, see [Supported Character Encodings](https://success.jitterbit.com/agent/supported-character-encodings)."
        },
        {
          name: "$jitterbit.target.db.commit_chunks",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          description: "If set to `true` and chunking is enabled for an operation with a database source, each chunk is committed to the database as it is created. This setting can make the transformation run faster as chunks can be committed in parallel."
        },
        {
          name: "$jitterbit.target.db.include_null_in_sql_statement",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "If set to `true`, INCLUDE and UPDATE statements generated by Jitterbit for database targets will contain explicit `null` values for columns that are nullable and have a mapping with a `null` result."
        },
        {
          name: "$jitterbit.target.db.no_data_action",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "Option for what to do if an empty database target is created. These values are valid:\n\n- `OK`\n\n- `Warning`\n\n- `Error`\n\nThe default (for when this variable is not set) can be changed in `jitterbit.conf` with the option in the `[ErrorHandling]` section called `NoTargetDataGenerated`. If nothing is specified there either, the default is to issue a warning."
        },
        {
          name: "$jitterbit.target.db.pre_target_sql",
          module: "target",
          type: "setting",
          dataType: "String",
          default: "",
          description: "Run this SQL statement before starting to populate the target database table(s). The default is an empty string."
        },
        {
          name: "$jitterbit.target.db.schema_name_delimiter",
          module: "target",
          type: "setting",
          dataType: "String",
          default: ".",
          description: "The default is a single period (`.`). Character used by the target database to delimit the schema name from the table name, e.g. `Schema.Tab`. Almost all databases use a period for the delimiter."
        },
        {
          name: "$jitterbit.target.db.transaction",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "Set to `false` if you don't want database changes to be made in a transaction. The default is to commit all of the database changes in a transaction."
        },
        {
          name: "$jitterbit.target.file_share.create_directories",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Set to `true` if you want file share target directories to be checked and created. If the directory is known to exist then don't use this option."
        },
        {
          name: "$jitterbit.target.ftp.encode_url",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Set to `true` in a transformation script to use encoding where a filename or folder name contains special characters such as `#`, `%`, or `@`. For example, `sftp://reposit.mysite.com/storage/file#1.xml`."
        },
        {
          name: "$jitterbit.target.ftp.transfer_timeout",
          module: "target",
          type: "setting",
          dataType: "Integer",
          description: "Set the transfer time-out in seconds for FTP target transfers. The default transfer time-out for FTP is one hour (3,600 seconds). Set to zero to disable."
        },
        {
          name: "$jitterbit.target.http.form_data",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          description: "If set to `true`, each target file is uploaded using RFC 1687 form upload."
        },
        {
          name: "$jitterbit.target.http.form_data.ContentType",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "If RFC 1687 form upload is used, this sets the `Content-Type` of the file."
        },
        {
          name: "$jitterbit.target.http.form_data.filename",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "If RFC 1687 form upload is used, this sets the name of the uploaded file."
        },
        {
          name: "$jitterbit.target.http.form_data.name",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "If RFC 1687 form upload is used, this sets the name of the form."
        },
        {
          name: "$jitterbit.target.http.max_redirs",
          module: "target",
          type: "setting",
          dataType: "Integer",
          default: "0",
          description: "Maximum number of redirects to follow when using an HTTP target. Set this variable to a negative number to follow any number of redirects. The default is `0`; no redirects are followed."
        },
        {
          name: "$jitterbit.target.http.remove_trailing_linebreaks",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          description: "If set to `true`, trailing line breaks will be removed before the target data is posted."
        },
        {
          name: "$jitterbit.target.http.ssl_cert_id",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "An identifier for a configuration entry in `jitterbit.conf` for the SSL certificate to use for HTTP targets. See also [Customizations > Client Certificates](https://success.jitterbit.com/management-console/customizations/customizations-client-certificates) and [Adding Certificates to Keystore for Private Agents](https://success.jitterbit.com/agent/private-agents/private-agent-how-tos/add-certificates-to-keystore)."
        },
        {
          name: "$jitterbit.target.http.transfer_timeout",
          module: "target",
          type: "setting",
          dataType: "Integer",
          description: "Set the transfer time-out in seconds for HTTP target transfers. The default transfer time-out for HTTP is one hour (3,600 seconds). Set to zero to disable."
        },
        {
          name: "$jitterbit.target.json.array_to_object",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          description: "If set to `true` upstream of a transformation with a JSON target data structure in an operation with [chunking](https://success.jitterbit.com/design-studio/design-studio-reference/operations/chunking) enabled, the target file will be in JSON format instead of XML."
        },
        {
          name: "$jitterbit.target.sftp.ssh_key_id",
          module: "target",
          type: "setting",
          dataType: "String",
          default: "",
          description: "For configuring multiple SSH keys. Empty by default, meaning the configuration in the `[SSH]` section of the `jitterbit.conf` configuration is used for all SFTP sources and targets with no password defined."
        },
        {
          name: "$jitterbit.target.text.character_encoding",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "Specify the character encoding for target text documents. If no encoding is specified, `Latin-1` (ISO-8859-1) is assumed. For supported encoding, see [Supported Character Encodings](https://success.jitterbit.com/agent/supported-character-encodings)."
        },
        {
          name: "$jitterbit.target.wave.json",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "Used to override the JSON in a Salesforce Einstein (Wave) JSON metafile. See [Overriding JSON Metadata in Salesforce Einstein Analytics](https://success.jitterbit.com/design-studio/design-studio-reference/salesforce-wave-analytics/override-json-metadata)."
        },
        {
          name: "$jitterbit.target.xml.include_empty_xml",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "If a mapping to a target node results in an empty value, set this variable to `true` to include the node in the target XML. The default (`false`) is to exclude the node with an empty value from the target XML. This variable does not affect target nodes that have a boolean value (see `jitterbit.target.xml.exclude_empty_data` instead)."
        },
        {
          name: "$jitterbit.target.xml.include_null_xml",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "If a mapping to a target node results in a `null` value or an empty value, the default of this variable (`true`) is to include the node in the target XML but make it `nil`. Set this variable to `false` to remove the node with a `null` value from the target XML."
        },
        {
          name: "$jitterbit.target.xml.nsprefix",
          module: "target",
          type: "setting",
          dataType: "String",
          default: "NS",
          description: "The default XML namespace prefix is `\"NS\"`. If your XML requires a different namespace prefix, this variable can be used to override the default namespace prefix with your existing namespace prefix name."
        },
        {
          name: "$jitterbit.target.xml.num_for_bool",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "If set to `true`, XML boolean target values will be represented with `\"0\"` or `\"1\"` for `false` and `true` values respectively. This is the default so to get the string values `\"true\"`/`\"false\"` instead you need to set this parameter to `false`."
        },
        {
          name: "$jitterbit.target.xml.prettify",
          module: "target",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "If set to true, XML targets are written with line breaks and tab indention. This is easier to read but the resulting file will be larger."
        },
        {
          name: "$jitterbit.text.qualifier_required",
          module: "text",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Set to `true` if the string qualifier is required for text targets. If set to `false` the string qualifier will be written only when needed."
        },
        {
          name: "$jitterbit.transformation.chunk_number",
          module: "transformation",
          type: "info",
          dataType: "Integer",
          description: "For chunked operations, holds a number between `1` and `$jitterbit.transformation.total_chunks` for the currently executing transformation mapping. For non-chunked operations, it has the value `1`."
        },
        {
          name: "$jitterbit.transformation.name",
          module: "transformation",
          type: "info",
          dataType: "String",
          description: "Name of the currently executing transformation."
        },
        {
          name: "$jitterbit.transformation.source.thread_number",
          module: "transformation",
          type: "info",
          dataType: "Integer",
          description: "For multi-threaded transformations, holds a number between `1` and `$jitterbit.transformation.total_threads` for the currently executing transformation mapping. For single-threaded transformation, it has the value `1`."
        },
        {
          name: "$jitterbit.transformation.total_chunks",
          module: "transformation",
          type: "info",
          dataType: "Integer",
          description: "Holds the total number of chunks being processed by the current operation. For non-chunked operations, it has the value `1`."
        },
        {
          name: "$jitterbit.transformation.total_threads",
          module: "transformation",
          type: "info",
          dataType: "Integer",
          description: "Holds the maximum number of threads being executed by the current operation. For non-threaded operations, it has the value `1`."
        },
        {
          name: "$jitterbit.transformation.auto_streaming",
          module: "transformation",
          type: "setting",
          dataType: "Boolean",
          description: "Set to `false` to not use auto-streaming. The default is configured in `jitterbit.conf`. This option is mostly for working around bugs in the streaming transformation implementation, so the default should be used unless there are specific problems."
        },
        {
          name: "$jitterbit.transformation.chunking",
          module: "transformation",
          type: "setting",
          dataType: "Boolean",
          description: "Set to `true` if the current transformation mapping runs with chunking. Not applicable in scripts."
        },
        {
          name: "$jitterbit.transformation.disable_normalization",
          module: "transformation",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Applies for flat-to-hierarchical transformations. By default, Jitterbit uses a normalization algorithm to construct the target tree. This is often the desired result, but if it is not the desired result, it can be disabled by setting to `true`."
        },
        {
          name: "$jitterbit.transformation.jbxmlparser",
          module: "transformation",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Use alternative XML parser implementation, which uses less memory when handling large XML source files and the transformation doesn't qualify for streaming transformations."
        },
        {
          name: "$jitterbit.transformation.source.check_null_characters",
          module: "transformation",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "Checks the input file for null characters. If the input is a large file and you are sure there are no null characters in the file, then this option can be disabled by setting to `false`."
        },
        {
          name: "$jitterbit.transformation.timing_on",
          module: "transformation",
          type: "setting",
          dataType: "Boolean",
          default: "false",
          description: "Enable writing profile information for the current operation chain. This is the same as setting `TimingOn=true` in `jitterbit.conf` but only for the current operation chain or until the value is set to `false` again."
        },
        {
          name: "$jitterbit.transformation.trim_extra_linebreaks",
          module: "transformation",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "Extra trailing line breaks in target mappings will be trimmed. This is normally what is desirable, but for backwards compatibility you can set this flag to `false` to leave the line breaks alone."
        },
        {
          name: "$jitterbit.web_service_call.status_code",
          module: "web_service_call",
          type: "info",
          dataType: "Integer",
          description: "The response status code returned from a [web service](https://success.jitterbit.com/design-studio/design-studio-reference/web-services/call-a-web-service) when used in an operation. If no status code is returned, the reported value is `-1`."
        },
        {
          name: "$jitterbit.web_service_call.max_redirs",
          module: "web_service_call",
          type: "setting",
          dataType: "Integer",
          default: "0",
          description: "Maximum number of redirects to follow when calling a [web service](https://success.jitterbit.com/design-studio/design-studio-reference/web-services/call-a-web-service). Set to a negative number to follow any number of redirects. The default is `0`; no redirects are followed."
        },
        {
          name: "$jitterbit.web_service_call.number_of_retries",
          module: "web_service_call",
          type: "setting",
          dataType: "Integer",
          description: "If a call to a [web service](https://success.jitterbit.com/design-studio/design-studio-reference/web-services/call-a-web-service) fails with any status code except `400` or `403`, retry this many times. The default is to not try again."
        },
        {
          name: "$jitterbit.web_service_call.retry_wait_seconds",
          module: "web_service_call",
          type: "setting",
          dataType: "Integer",
          description: "If a call to a [web service](https://success.jitterbit.com/design-studio/design-studio-reference/web-services/call-a-web-service) fails and retries are enabled by setting `$jitterbit.web_service_call.number_of_retries` to a positive integer, wait this many seconds between retries."
        },
        {
          name: "$jitterbit.web_service_call.ssl_cert_id",
          module: "web_service_call",
          type: "setting",
          dataType: "String",
          description: "An identifier for a configuration entry in the configuration file jitterbit.conf for the SSL certificate to use for [web services](https://success.jitterbit.com/design-studio/design-studio-reference/web-services/call-a-web-service). Also see [Customizations > Client Certificates](https://success.jitterbit.com/management-console/customizations/customizations-client-certificates) and [Adding Certificates to Keystore for Private Agents](https://success.jitterbit.com/agent/private-agents/private-agent-how-tos/add-certificates-to-keystore)."
        },
        {
          name: "$jitterbit.web_service_call.sync_response",
          module: "web_service_call",
          type: "setting",
          dataType: "Boolean",
          default: "true",
          description: "Set to `false` to skip a step in processing of [web service](https://success.jitterbit.com/design-studio/design-studio-reference/web-services/call-a-web-service) responses. This step is necessary only when processing SOAP arrays and can be skipped in other cases. The default is `true`, meaning this step is always performed."
        },
        {
          name: "$jitterbit.web_service_call.time_out",
          module: "web_service_call",
          type: "setting",
          dataType: "Integer",
          description: "Set the number of seconds after which [web service](https://success.jitterbit.com/design-studio/design-studio-reference/web-services/call-a-web-service) calls will time out, or set to `0` to disable. The default transfer time-out for web service calls is one hour (3600 seconds)."
        },
        {
          name: "$jitterbit.md5.hash.use.file.mode.string.only",
          module: "misc",
          type: "setting",
          dataType: "Integer",
          description: "Set `jitterbit.md5.hash.use.file.mode.string.only` to `true` to change the behavior of the [`MD5`](https://success.jitterbit.com/design-studio/design-studio-reference/formula-builder/cryptographic-functions/#cryptographicfunctions-md5) and [`SHA-256`](https://success.jitterbit.com/design-studio/design-studio-reference/formula-builder/cryptographic-functions/#cryptographicfunctions-sha256) functions to that prior to the [10.64 / 11.2](https://success.jitterbit.com/release-notes/harmony-release-notes/winter-2023/10-64-11-2) release. When set to `true`, the function output of binary files when used in a script upstream of the function call will be incorrect. Using this variable is not recommended."
        },
      ] as SystemVariable[],
      extendable: [
        {
          name: "$jitterbit.api.request.body",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Looks at the payloads submitted to the API. Note that for the majority of the APIs, you would expect only one plain payload and, as such, `jitterbit.api.request.body` is the variable to use (also known as `content-type:text/plain`).\n\nIf you expect multiple payloads to be submitted at once, using the URL-encoded form (also known as `content-type:application/x-www-form-urlencoded`), as in the case of an API being used as the backend of a submission form (see [form docs](http://www.w3.org/TR/html401/interact/forms.html)), then you should be using `jitterbit.api.request.body.*`. As with `jitterbit.api.request.parameters.*`, `jitterbit.api.request.body.name` will be equal to `EStore` if the value of the form's field \"name\" was entered as `EStore`."
        },
        {
          name: "$jitterbit.api.request.headers",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Variable used to look at the request headers submitted to the API; for example, `$jitterbit.api.request.headers.x_forwarded_for` is the public IP of the box/user accessing the URL."
        },
        {
          name: "$jitterbit.api.request.mvparameters",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Looks at the multi-values of the parameter submitted to the API directly via the URL and returns the values as an array with a space between each value."
        },
        {
          name: "$jitterbit.api.request.parameters",
          module: "api",
          type: "info",
          dataType: "String",
          description: "Looks at the parameters submitted to the API directly via the URL; for example, `jitterbit.api.request.parameters.name` will be equal to `EStore` if the URL requested had `&name=EStore`."
        },
        {
          name: "$jitterbit.api.response.headers",
          module: "api",
          type: "setting",
          dataType: "String",
          description: "Used to set the response headers of the API. For example, set `jitterbit.api.response.headers.access_control_allow_origin=\"*\"` to override default CORS behavior and allow the API to be accessed by any domain in a cross-site manner."
        },
        {
          name: "$jitterbit.networking.http.query",
          module: "networking",
          type: "setting",
          dataType: "String",
          description: "Set when handling a hosted web service call or a Hosted HTTP Endpoint. With `ParameterName` substituted by a URL query parameter name, this variable holds the corresponding value. This is for a URL query data of the type `?a=b&c=d`."
        },
        {
          name: "$jitterbit.networking.http.request.header",
          module: "networking",
          type: "setting",
          dataType: "String",
          description: "Set when handling a hosted web service call or a Hosted HTTP Endpoint. This variable holds the specified header's value. For example, the variable `jitterbit.networking.http.request.header.Content-Type` will hold the MIME type of the body of the request."
        },
        {
          name: "$jitterbit.networking.http.response.header",
          module: "networking",
          type: "setting",
          dataType: "String",
          description: "Set when handling an HTTP Endpoint to send back a custom Hosted HTTP header. Can be used to send back HTTP headers such as a location for redirect."
        },
        {
          name: "$jitterbit.source.http.response.header",
          module: "source",
          type: "setting",
          dataType: "String",
          description: "Set when handling a hosted web service call or an HTTP endpoint. HTTP request headers are not exposed, just the payload. This variable holds the value of the corresponding header.\n\nFor example, the variable `Get(\"jitterbit.source.http.response.header.Content-Type\")` would hold the MIME type of the body of the request.\n\n**Note**: If the header name includes a hyphen, you must reference the variable by using either the `Set` or `Get` functions."
        },
        {
          name: "$jitterbit.target.http.response.header",
          module: "target",
          type: "setting",
          dataType: "String",
          description: "Set when handling a hosted web service post or an HTTP endpoint. HTTP response headers are not exposed, just the payload. This variable holds the value of the corresponding header.\n\nFor example, the variable `Get(\"jitterbit.target.http.response.header.Proxy-Authenticate\")` would hold the value of the `Proxy-Authenticate` response header."
        },
      ] as SystemVariable[],
    };
    Api.functions = [
      // cache
      new Cache.ReadCache(),
      new Cache.WriteCache(),
      // conversion
      new Conversion.BinaryToHex(),
      new Conversion.BinaryToUUID(),
      new Conversion.Bool(),
      new Conversion.DateFunc(),
      new Conversion.Double(),
      new Conversion.Float(),
      new Conversion.HexToBinary(),
      new Conversion.HexToString(),
      new Conversion.Int(),
      new Conversion.Long(),
      new Conversion.String(),
      new Conversion.StringToHex(),
      new Conversion.UUIDToBinary(),
      // crypto
      new Crypto.AESDecryption(),
      new Crypto.AESEncryption(),
      new Crypto.Base64Decode(),
      new Crypto.Base64Encode(),
      new Crypto.Base64EncodeFile(),
      new Crypto.MD5(),
      new Crypto.MD5AsTwoNumbers(),
      new Crypto.SHA256(),
      // database
      new Database.CacheLookup(),
      new Database.CallStoredProcedure(),
      new Database.DBCloseConnection(),
      new Database.DBExecute(),
      new Database.DBLoad(),
      new Database.DBLookup(),
      new Database.DBLookupAll(),
      new Database.DBRollbackTransaction(),
      new Database.DBWrite(),
      new Database.SetDBInsert(),
      new Database.SetDBUpdate(),
      new Database.SQLEscape(),
      new Database.Unmap(),
      // datetime
      new Datetime.ConvertTimeZone(),
      new Datetime.CVTDate(),
      new Datetime.DateAdd(),
      new Datetime.DayOfMonth(),
      new Datetime.DayOfWeek(),
      new Datetime.FormatDate(),
      new Datetime.GeneralDate(),
      new Datetime.GetUTCFormattedDate(),
      new Datetime.GetUTCFormattedDateTime(),
      new Datetime.LastDayOfMonth(),
      new Datetime.LongDate(),
      new Datetime.LongTime(),
      new Datetime.MediumDate(),
      new Datetime.MediumTime(),
      new Datetime.MonthOfYear(),
      new Datetime.Now(),
      new Datetime.Now_(),
      new Datetime.ShortDate(),
      new Datetime.ShortTime(),
      // debug
      new Debug.DebugBreak(),
      // dict/array
      new Dicts.AddToDict(),
      new Arrays.Array(),
      new Arrays.Collection(),
      new Dicts.CollectValues(),
      new Dicts.Dict(),
      new Dicts.GetKeys(),
      new Arrays.GetSourceAttrNames(),
      new Arrays.GetSourceElementNames(),
      new Arrays.GetSourceInstanceArray(),
      new Arrays.GetSourceInstanceElementArray(),
      new Dicts.GetSourceInstanceMap(),
      new Dicts.GetSourceInstanceElementMap(),
      new Dicts.HasKey(),
      new Dicts.Map(),
      new Dicts.MapCache,
      new Arrays.ReduceDimension(),
      new Dicts.RemoveKey(),
      new Arrays.SortArray(),
      // diff
      new Diff.DiffAdd(),
      new Diff.DiffComplete(),
      new Diff.DiffDelete(),
      new Diff.DiffKeyList(),
      new Diff.DiffNode(),
      new Diff.DiffUpdate(),
      new Diff.InitializeDiff(),
      new Diff.OrderedDiffKeyList(),
      new Diff.ResetDiff(),
      new Diff.SetDiffChunkSize(),
      // email
      new Email.SendEmail(),
      new Email.SendEmailMessage(),
      new Email.SendSystemEmail(),
      // env info
      new EnvInfo.GetAgentGroupID(),
      new EnvInfo.GetAgentGroupName(),
      new EnvInfo.GetAgentID(),
      new EnvInfo.GetAgentName(),
      new EnvInfo.GetAgentVersionID(),
      new EnvInfo.GetAgentVersionName(),
      new EnvInfo.GetEnvironmentID(),
      new EnvInfo.GetEnvironmentName(),
      new EnvInfo.GetOrganizationID(),
      new EnvInfo.GetOrganizationName(),
      // file
      new File.ArchiveFile(),
      new File.DeleteFile(),
      new File.DeleteFiles(),
      new File.DirList(),
      new File.FileList(),
      new File.FlushAllFiles(),
      new File.FlushFile(),
      new File.ReadFile(),
      new File.WriteFile(),
      // general
      new General.ArgumentList(),
      new General.AutoNumber(),
      new General.CancelOperation(),
      new General.CancelOperationChain(),
      new General.Eval(),
      new General.Get(),
      new General.GetChunkDataElement(),
      new General.GetHostByIP(),
      new General.GetInputString(),
      new General.GetLastOperationRunStartTime(),
      new General.GetName(),
      new General.GetOperationQueue(),
      new General.GetServerName(),
      new General.GUID(),
      new General.IfEmpty(),
      new General.IfNull(),
      new General.InList(),
      new General.InitCounter(),
      new General.IsInteger(),
      new General.IsNull(),
      new General.IsValid(),
      new General.Length(),
      new General.Null(),
      new General.Random(),
      new General.RandomString(),
      new General.ReRunOperation(),
      new General.ReadArrayString(),
      new General.RecordCount(),
      new General.RunOperation(),
      new General.RunPlugin(),
      new General.RunScript(),
      new General.Set(),
      new General.SetChunkDataElement(),
      new General.Sleep(),
      new General.SourceInstanceCount(),
      new General.TargetInstanceCount(),
      new General.WaitForOperation(),
      // instance
      new Instance.Count(),
      new Instance.CountSourceRecords(),
      new Instance.Exist(),
      new Instance.FindByPos(),
      new Instance.FindValue(),
      new Instance.GetInstance(),
      new Instance.Max(),
      new Instance.Min(),
      new Instance.ResolveOneOf(),
      new Instance.SetInstances(),
      new Instance.SortInstances(),
      new Instance.Sum(),
      new Instance.SumCSV(),
      new Instance.SumString(),
      // LDAP
      new LDAP.ArrayToMultipleValues(),
      new LDAP.LDAPAdd(),
      new LDAP.LDAPConnect(),
      new LDAP.LDAPDeleteEntry(),
      new LDAP.LDAPExecute(),
      new LDAP.LDAPRemove(),
      new LDAP.LDAPRename(),
      new LDAP.LDAPReplace(),
      new LDAP.LDAPSearch(),
      // log/error
      new Error.GetLastError(),
      new Error.RaiseError(),
      new Error.ResetLastError(),
      new Error.SetLastError(),
      new Log.WriteToOperationLog(),
      // logical
      new Logical.Case(),
      new Logical.Equal(),
      new Logical.If(),
      new Logical.While(),
      // math
      new Math.Ceiling(),
      new Math.Exp(),
      new Math.Floor(),
      new Math.Log(),
      new Math.Log10(),
      new Math.Mod(),
      new Math.Pow(),
      new Math.Round(),
      new Math.RoundToInt(),
      new Math.Sqrt(),
      // netsuite
      new NetSuite.NetSuiteGetSelectValue(),
      new NetSuite.NetSuiteGetServerTime(),
      new NetSuite.NetSuiteLogin(),
      // salesforce
      new Salesforce.GetSalesforceTimestamp(),
      new Salesforce.LoginToSalesforceAndGetTimeStamp(),
      new Salesforce.SalesforceLogin(),
      new Salesforce.SetSalesforceSession(),
      new Salesforce.SfCacheLookup(),
      new Salesforce.SfLookup(),
      new Salesforce.SfLookupAll(),
      new Salesforce.SfLookupAllToFile(),
      // string
      new String.CountSubString(),
      new String.DQuote(),
      new String.Format(),
      new String.Index(),
      new String.IsValidString(),
      new String.Left(),
      new String.LPad(),
      new String.LPadChar(),
      new String.LTrim(),
      new String.LTrimChars(),
      new String.Mid(),
      new String.ParseURL(),
      new String.Quote(),
      new String.RegExMatch(),
      new String.RegExReplace(),
      new String.Replace(),
      new String.Right(),
      new String.RPad(),
      new String.RPadChar(),
      new String.RTrim(),
      new String.RTrimChars(),
      new String.Split(),
      new String.SplitCSV(),
      new String.StringLength(),
      new String.ToLower(),
      new String.ToProper(),
      new String.ToUpper(),
      new String.Trim(),
      new String.TrimChars(),
      new String.Truncate(),
      new String.URLDecode(),
      new String.URLEncode(),
      // text
      new Text.Validate(),
      // xml
      new XML.Attribute(),
      new XML.CreateNode(),
      new XML.GetNodeName(),
      new XML.GetNodeValue(),
      new XML.GetXMLString(),
      new XML.IsNil(),
      new XML.RunXSLT(),
      new XML.SelectNodeFromXMLAny(),
      new XML.SelectNodes(),
      new XML.SelectNodesFromXMLAny(),
      new XML.SelectSingleNode(),
    ];
  }

  /**
   * Retrieves API definition of a Jitterbit variable.
   * @param name Variable name to look up.
   * @returns Found Jitterbit variable or undefined.
   */
  static getSysVar(name: string) : SystemVariable | undefined {
    // check static vars
    let sysVar = Api.sysVars.static.find(element => element.name === name);
    if(sysVar)
      return sysVar;
    // check extendable vars (with user-defined endings)
    Api.sysVars.extendable.forEach((value) => {
      // check if the name begins with the defined extendable name
      if(name.length > value.name.length
        && name.substring(0, value.name.length + 1) === value.name + "."
      ) {
        // use the user-provided name
        sysVar = {...value, name} as SystemVariable;
      }
    });
    
    return sysVar;
  }

  /**
   * Retrieves API definition of a Jitterbit function.
   * @param name Variable name to look up.
   * @returns Found Jitterbit variable or undefined.
   */
  static getFunc(name: string): Func | undefined {
    // 'anycase' calls are supported, e.g nUll() is valid
    return Api.functions.find((f) => f.name.toLowerCase() === name.toLowerCase())
  }
}
