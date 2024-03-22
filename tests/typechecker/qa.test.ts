import { describe, expect, test } from '@jest/globals';
import { typecheck } from "../utils";

describe('Typechecker QA script suite', function() {
  test('jb.mime.archive.testHarnes', function() {
    const script = 
`<trans>

/*
https://www.w3.org/TR/html401/interact/forms.html#h-17.13.4

jitterbit.target.http.form_data	Boolean	If set to true each target file is uploaded using RFC 1687 form upload.
jitterbit.target.http.form_data.ContentType	String	If RFC 1687 form upload is used this sets the Content-Type of the file.
jitterbit.target.http.form_data.filename	String	If RFC 1687 form upload is used this sets the name of the uploaded file.
jitterbit.target.http.form_data.name	String	If RFC 1687 form upload is used this sets the name of the form.
*/

$jb.core.temp.filename = 'formDataFileName1.txt';
WriteFile("<TAG>Targets/jitterbit/core/jb.core.operation.temp</TAG>", 'myFileContents1');
FlushFile("<TAG>Targets/jitterbit/core/jb.core.operation.temp</TAG>");

$jb.core.temp.filename = 'formDataFileName2.txt';
WriteFile("<TAG>Targets/jitterbit/core/jb.core.operation.temp</TAG>", 'myFileContents2');
FlushFile("<TAG>Targets/jitterbit/core/jb.core.operation.temp</TAG>");
$jb.core.temp.filename = '*.txt';

$jb.core.http.url = 'https://jitterpaks276792.jitterbit.eu/apis_dev/requestbin';
$jb.core.http.request.contentType = 'multipart/form-data'; // ContentType setting for the WHOLE request not the message parts below
$jitterbit.target.http.form_data = true;
$jitterbit.target.http.form_data.ContentType; // It will make best guess, usually 'application/octet-stream'
$jitterbit.target.http.form_data.filename; // if left empty will set to "file" e.g. Content-Disposition: attachment; name="file"; filename="file"
$jitterbit.target.http.form_data.name; // = if left empty will set to "file" e.g. Content-Disposition: attachment; name="file"; filename="file"

If(!RunOperation("<TAG>Operations/jitterbit/mime/option1/jb.mime.archive</TAG>"),
	RaiseError(GetLastError())
);
RunScript("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",'********************************************\r\nArchive Option produces:\r\n'+$jb.core.operation.inout)

/*
--------------------------fa163a9f54022935
Content-Disposition: attachment; name="file"; filename="file"
Content-Type: application/octet-stream

myFileContents1
--------------------------fa163a9f54022935--
*/

</trans>`;
    const result = typecheck(script);
    // $jb.core.temp.filename
    expect(result.vars[0].type).toStrictEqual("string");
    // $jitterbit.target.http.form_data.filename
    expect(result.vars[7].type).toStrictEqual("string");
    // $jitterbit.target.http.form_data.name
    expect(result.vars[8].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(2);
    // string + null concat
    expect(result.diagnostics[0].error).toStrictEqual(false);
    // $jb.core.operation.inout used without assignment
    expect(result.diagnostics[1].error).toStrictEqual(false);
  });

  test('jb.sqlServer.dbExecute', function() {
    const script = 
`<trans>

// https://success.jitterbit.com/display/DOC/Database+Functions#DatabaseFunctions-DBExecute
// https://www.w3schools.com/sql/sql_insert_into_select.asp


/*
Related Jitterbit Variables
If DbExecute completes successfully, $jitterbit.scripting.db.rows_affected will contain the number of rows affected by the query.
To run the statement in a transaction, prior to the call set:

    $jitterbit.scripting.db.max_rows = 1000000;
    $jitterbit.scripting.db.auto_commit=false
    $jitterbit.scripting.db.transaction=true

The transaction will be committed at the end of a successful transformation. Setting both auto_commit and transaction to true will result in an error.
Set $jitterbit.scripting.db.max_rows to limit the number of records to return. The default is 10,000 rows.
*/


If(Length($jb.sqlServer.sqlStatement) == 0,$jb.core.messageText = 'Error $jb.sqlServer.sqlStatement was empty' ; RunScript("<TAG>Scripts/jitterbit/core/jb.core.raiseError</TAG>"));

result = Eval(DbExecute("<TAG>Sources/jitterbit/microsoft/sqlServer/jb.sqlServer.jdbc</TAG>",$jb.sqlServer.sqlStatement),true);
If(result
    ,
        $jb.core.messageText = GetLastError(); RunScript("<TAG>Scripts/jitterbit/core/jb.core.raiseError</TAG>")
    ,
        $jb.core.operation.recordsCounter = $jitterbit.scripting.db.rows_affected
);
</trans>`;
    const result = typecheck(script);
    // $jb.core.messageText
    expect(result.vars[1].type).toStrictEqual("string");
    // result
    expect(result.vars[2].type).toStrictEqual("string");
    // $jb.core.messageText
    expect(result.vars[5].type).toStrictEqual("string");
    // $jb.core.operation.recordsCounter
    expect(result.vars[6].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(2);
    // $jb.sqlServer.sqlStatement used without assignment
    expect(result.diagnostics[0].error).toStrictEqual(false);
    // 'condition' is string, should be bool
    expect(result.diagnostics[1].error).toStrictEqual(false);
  });

  test('jb.postgres.checkTableExists', function() {
    const script = 
`<trans>
/*
Failed to test expression: DBExecute failed to execute SQL statement "SELECT 'dbtablestacb'::regclass".
org.postgresql.util.PSQLException: ERROR: relation "dbtablestacb" does not exist
  Position: 8
Caused by: ERROR: relation "dbtablestacb" does not exist
  Position: 8

Cause stacktrace: org.jitterbit.integration.server.engine.EngineSessionException: org.postgresql.util.PSQLException: ERROR: relation "dbtablestacb" does not exist
  Position: 8
*/
$jb.postgres.db.tableName = 'sdfsf';

If(Length($jb.postgres.db.tableName) == 0
    ,
        RaiseError('jb.postgres.db.tableName is empty')
    ,
        sql_str = "SELECT '"+$jb.postgres.db.tableName+"'::regclass";
        RunScript("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",sql_str);
        Eval(DbExecute("<TAG>Sources/jitterbit/postgres/jb.postgres.jdbc</TAG>",sql_str),DebugBreak();RaiseError(GetLastError()));
        // jitterbit.script.db.row_count
        // jitterbit.scripting.db.rows_affected
);
</trans>`;
    const result = typecheck(script);
    // $jb.postgres.db.tableName
    expect(result.vars[0].type).toStrictEqual("string");
    // sql_str
    expect(result.vars[1].type).toStrictEqual("string");
    // sql_str
    expect(result.vars[2].type).toStrictEqual("string");
    // sql_str
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('jb.sap.ecc.rfcReadTable.request', function() {
    const script = 
`<trans>
/*************************************************************************************************************
SCRIPT DATE 19/Jan/2020
DESCRIPTION: In order to read SAP tables or views, SAP provides RFC_READ_TABLE.
            For many customers, BBP_RFC_READ_TABLE is also available and is somewhat more functional.
            The initial steps involved in using this RFC is similar to using any SAP function. 
HELP URL:    https://success.jitterbit.com/display/DOC/Guide+to+Using+RFC_READ_TABLE+to+Query+SAP+Tables
            https://success.jitterbit.com/display/DOC/Best+Practices+for+SAP
*************************************************************************************************************/
RunScript("<TAG>Scripts/jitterbit/core/jb.core.recordsCounterIntialise</TAG>");

IfEmpty($jb.sap.RFC_READ_TABLE.fieldname01, RaiseError('\n********************\nGlobal Variable: jb.sap.RFC_READ_TABLE.fieldname01 is empty please supply at least one field to return\n********************\n'));
IfEmpty($jb.sap.RFC_READ_TABLE.table, RaiseError('\n********************\nGlobal Variable: jb.sap.RFC_READ_TABLE.table is empty please supply SAP Table Name\n********************\n'));
IfEmpty($jb.sap.RFC_READ_TABLE.options.text, RaiseError('\n********************\nGlobal Variable: jb.sap.RFC_READ_TABLE.options.text Enter the query option. Note that RFC_READ_TABLE has a limit of 75 characters per Option line, so if your query exceeds that, an additional folder is needed\n********************\n'));

</trans>`;
    const result = typecheck(script);
    // $jb.sap.RFC_READ_TABLE.fieldname01
    expect(result.vars[0].type).toStrictEqual("null");
    // $jb.sap.RFC_READ_TABLE.table
    expect(result.vars[1].type).toStrictEqual("null");
    // $jb.sap.RFC_READ_TABLE.options.text
    expect(result.vars[2].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(3);
    // 3 global without assignment warnings
    expect(result.diagnostics[0].error).toStrictEqual(false);
    expect(result.diagnostics[1].error).toStrictEqual(false);
    expect(result.diagnostics[2].error).toStrictEqual(false);
  });

  test('jb.google.bq.tableData.insertAll.url', function() {
    const script = 
`<trans>
/*
https://cloud.google.com/bigquery/docs/reference/rest/v2/tabledata/insertAll

POST https://www.googleapis.com/bigquery/v2/projects/projectId/datasets/datasetId/tables/tableId/insertAll
*/

If(Length($jb.google.bq.projectId) == 0
    ,
        RaiseError('\n********************\nProject Variable: $jb.google.bq.projectId is empty please supply\n********************\n')
    );

If(Length($jb.google.bq.datasetId) == 0
    ,
        RaiseError('\n********************\nGlobal Variable: $jb.google.bq.datasetId is empty please supply\n********************\n')
    );

If(Length($jb.google.bq.tableId) == 0
    ,
        RaiseError('\n********************\nGlobal Variable: $jb.google.bq.tableId is empty please supply\n********************\n')
    );

// https://www.googleapis.com/bigquery/v2/projects/bigquery-public-data/datasets/samples/tables/shakespeare/insertAll

$jb.google.resource = '/bigquery/'
                    + $jb.google.bq.version
                  + '/projects/'
                  + $jb.google.bq.projectId
                  + '/datasets/' 
                  + $jb.google.bq.datasetId
                  + '/tables/'
                  + $jb.google.bq.tableId
                  + '/insertAll';
$jb.google.url = $jb.google.host + $jb.google.resource;
$jb.google.contentType = 'application/json';
</trans>`;
    const result = typecheck(script);
    // $jb.google.bq.projectId
    expect(result.vars[0].type).toStrictEqual("null");
    // $jb.google.resource
    expect(result.vars[3].type).toStrictEqual("string");
    // $jb.google.url
    expect(result.vars[8].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(10);
    // $jb.google.bq.projectId used without an explicit assignment
    expect(result.diagnostics[0].error).toStrictEqual(false);
    // $jb.google.bq.datasetId used without an explicit assignment
    expect(result.diagnostics[1].error).toStrictEqual(false);
    // $jb.google.bq.tableId used without an explicit assignment
    expect(result.diagnostics[2].error).toStrictEqual(false);
    // concatenation of string + null
    expect(result.diagnostics[3].error).toStrictEqual(false);
    // concatenation of string + null
    expect(result.diagnostics[4].error).toStrictEqual(false);
    // concatenation of string + null
    expect(result.diagnostics[5].error).toStrictEqual(false);
    // concatenation of string + null
    expect(result.diagnostics[6].error).toStrictEqual(false);
    // $jb.google.bq.version used without an explicit assignment
    expect(result.diagnostics[7].error).toStrictEqual(false);
    // concatenation of null + string
    expect(result.diagnostics[8].error).toStrictEqual(false);
    // $jb.google.host used without an explicit assignment
    expect(result.diagnostics[9].error).toStrictEqual(false);
  });

  test('jb.etl.soqlClause', function() {
    const script = 
`<trans>
$jb.sfdc.soqlClauses = " WHERE (LastModifiedDate > "+FormatDate($jb.runDateTime.previous,"yyyy-mm-ddTHH:MM:SS.zzzZ")+" AND LastModifiedDate <= "+FormatDate($jb.runDateTime.this,"yyyy-mm-ddTHH:MM:SS.zzzZ")+") AND LastModifiedBy.Username != '"+$jb.sfdc.org.user+"'";
RunScript("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",'SF SOQL clause: '+$jb.sfdc.soqlClauses);
</trans>`;
    const result = typecheck(script);
    // $jb.sfdc.soqlClauses
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(4);
    // Cross-type concatenation of string + null
    expect(result.diagnostics[0].error).toStrictEqual(false);
    // $jb.runDateTime.previous used without an explicit assignment
    expect(result.diagnostics[1].error).toStrictEqual(false);
    // $jb.runDateTime.this used without an explicit assignment
    expect(result.diagnostics[2].error).toStrictEqual(false);
    // $jb.sfdc.org.user used without an explicit assignment
    expect(result.diagnostics[3].error).toStrictEqual(false);
  });

  test('jb.deduplication.validation', function() {
    const script = 
`<trans>
/*
https://success.jitterbit.com/display/DOC/Text+Validation+Functions
_1: The input value, as a string
_2: A string with the data type of the input value (the "Type" field as used in the File Format)
_3: A format string of the input value (the "Format" field as used in the File Format)
*/
ArgumentList(value,type,format);

If(HasKey($jb.core.dict.keys,value),false,$jb.core.dict.keys[value] = value);

</trans>`;
    const result = typecheck(script);
    // value
    expect(result.vars[0].type).toStrictEqual("unknown");
    // type
    expect(result.vars[1].type).toStrictEqual("unknown");
    // format
    expect(result.vars[2].type).toStrictEqual("unknown");
    expect(result.diagnostics.length).toStrictEqual(1);
    // $jb.core.dict.keys used without an explicit assignment
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });
});
