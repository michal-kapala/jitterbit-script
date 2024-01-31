import { Position, Token, TokenType } from "../../src/frontend/types";
import Lexer from "../../src/frontend/lexer";

type LexerTest = {script: string, tokens: Token[]};

const tests: LexerTest[] = [
  {
    script: `<trans> </trans>`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(1, 9), new Position(1, 16)),
    ]
  },
  {
    script:
`<trans>
  /* this is a comment
  comments dont make it to token list*/
  result = Null();
</trans>`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("result", TokenType.Identifier, new Position(4, 3), new Position(4, 8)),
      new Token("=", TokenType.Assignment, new Position(4, 10), new Position(4, 10)),   
      new Token("Null", TokenType.Identifier, new Position(4, 12), new Position(4, 15)),
      new Token("(", TokenType.OpenParen, new Position(4, 16), new Position(4, 16)),
      new Token(")", TokenType.CloseParen, new Position(4, 17), new Position(4, 17)),
      new Token(";", TokenType.Semicolon, new Position(4, 18), new Position(4, 18)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(5, 1), new Position(5, 8))
    ]
  },
  {
    script:
`<trans>
  // test for Round function
  result = Round(123.123456789, -7.7);
  DebugBreak();

</trans>
`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("result", TokenType.Identifier, new Position(3, 3), new Position(3, 8)),
      new Token("=", TokenType.Assignment, new Position(3, 10), new Position(3, 10)),
      new Token("Round", TokenType.Identifier, new Position(3, 12), new Position(3, 16)),
      new Token("(", TokenType.OpenParen, new Position(3, 17), new Position(3, 17)),
      new Token("123.123456789", TokenType.Float, new Position(3, 18), new Position(3, 30)),
      new Token(",", TokenType.Comma, new Position(3, 31), new Position(3, 31)),
      new Token("-", TokenType.Minus, new Position(3, 33), new Position(3, 33)),
      new Token("7.7", TokenType.Float, new Position(3, 34), new Position(3, 36)),
      new Token(")", TokenType.CloseParen, new Position(3, 37), new Position(3, 37)),
      new Token(";", TokenType.Semicolon, new Position(3, 38), new Position(3, 38)),
      new Token("DebugBreak", TokenType.Identifier, new Position(4, 3), new Position(4, 12)),
      new Token("(", TokenType.OpenParen, new Position(4, 13), new Position(4, 13)),
      new Token(")", TokenType.CloseParen, new Position(4, 14), new Position(4, 14)),
      new Token(";", TokenType.Semicolon, new Position(4, 15), new Position(4, 15)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(6, 1), new Position(6, 8))
    ]
  },
  {
    script:
`<trans>
DebugBreak();
sendEmail = false; // until proven otherwise

// Throttle by Operation Name & Project Name - email only sent once per day per operation & project name

$jb.cache.expirationSeconds = 2592000;
$jb.cache.scope.justProject = true;
$jb.cache.value = Null();
$jb.cache.name = $jitterbit.operation.name+'-SendEmailMessage';
If(!RunOperation("<TAG>Operations/jitterbit/core/jb.core.cache.read</TAG>"),    RaiseError(GetLastError()));

DebugBreak();

If(Length($jb.cache.value) == 0
    ,
        sendEmail = true
    ,
        date = DateAdd('dd',1,$jb.cache.value);
        If(date < Now(),sendEmail = true)
    
);

If(sendEmail == true
    ,
        SendEmailMessage("<TAG>Email Messages/jitterbit/core/jb.core.email</TAG>");
        $jb.cache.value = Now();
        If(!RunOperation("<TAG>Operations/jitterbit/core/jb.core.cache.write</TAG>"),RaiseError(GetLastError()))
);
DebugBreak();
</trans>`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("DebugBreak", TokenType.Identifier, new Position(2, 1), new Position(2, 10)),
      new Token("(", TokenType.OpenParen, new Position(2, 11), new Position(2, 11)),
      new Token(")", TokenType.CloseParen, new Position(2, 12), new Position(2, 12)),
      new Token(";", TokenType.Semicolon, new Position(2, 13), new Position(2, 13)),
      new Token("sendEmail", TokenType.Identifier, new Position(3, 1), new Position(3, 9)),
      new Token("=", TokenType.Assignment, new Position(3, 11), new Position(3, 11)),
      new Token("false", TokenType.False, new Position(3, 13), new Position(3, 17)),
      new Token(";", TokenType.Semicolon, new Position(3, 18), new Position(3, 18)),
      new Token("$jb.cache.expirationSeconds", TokenType.GlobalIdentifier, new Position(7, 1), new Position(7, 27)),
      new Token("=", TokenType.Assignment, new Position(7, 29), new Position(7, 29)),
      new Token("2592000", TokenType.Integer, new Position(7, 31), new Position(7, 37)),
      new Token(";", TokenType.Semicolon, new Position(7, 38), new Position(7, 38)),
      new Token("$jb.cache.scope.justProject", TokenType.GlobalIdentifier, new Position(8, 1), new Position(8, 27)),   
      new Token("=", TokenType.Assignment, new Position(8, 29), new Position(8, 29)),
      new Token("true", TokenType.True, new Position(8, 31), new Position(8, 34)),
      new Token(";", TokenType.Semicolon, new Position(8, 35), new Position(8, 35)),
      new Token("$jb.cache.value", TokenType.GlobalIdentifier, new Position(9, 1), new Position(9, 15)),
      new Token("=", TokenType.Assignment, new Position(9, 17), new Position(9, 17)),
      new Token("Null", TokenType.Identifier, new Position(9, 19), new Position(9, 22)),
      new Token("(", TokenType.OpenParen, new Position(9, 23), new Position(9, 23)),
      new Token(")", TokenType.CloseParen, new Position(9, 24), new Position(9, 24)),
      new Token(";", TokenType.Semicolon, new Position(9, 25), new Position(9, 25)),
      new Token("$jb.cache.name", TokenType.GlobalIdentifier, new Position(10, 1), new Position(10, 14)),
      new Token("=", TokenType.Assignment, new Position(10, 16), new Position(10, 16)),
      new Token("$jitterbit.operation.name", TokenType.GlobalIdentifier, new Position(10, 18), new Position(10, 42)),  
      new Token("+", TokenType.MathOperator, new Position(10, 43), new Position(10, 43)),
      new Token("-SendEmailMessage", TokenType.SingleQuoteString, new Position(10, 44), new Position(10, 62)),
      new Token(";", TokenType.Semicolon, new Position(10, 63), new Position(10, 63)),
      new Token("If", TokenType.Identifier, new Position(11, 1), new Position(11, 2)),
      new Token("(", TokenType.OpenParen, new Position(11, 3), new Position(11, 3)),
      new Token("!", TokenType.UnaryOperator, new Position(11, 4), new Position(11, 4)),
      new Token("RunOperation", TokenType.Identifier, new Position(11, 5), new Position(11, 16)),
      new Token("(", TokenType.OpenParen, new Position(11, 17), new Position(11, 17)),
      new Token("<TAG>Operations/jitterbit/core/jb.core.cache.read</TAG>", TokenType.DoubleQuoteString, new Position(11, 18), new Position(11, 74)),
      new Token(")", TokenType.CloseParen, new Position(11, 75), new Position(11, 75)),
      new Token(",", TokenType.Comma, new Position(11, 76), new Position(11, 76)),
      new Token("RaiseError", TokenType.Identifier, new Position(11, 81), new Position(11, 90)),
      new Token("(", TokenType.OpenParen, new Position(11, 91), new Position(11, 91)),
      new Token("GetLastError", TokenType.Identifier, new Position(11, 92), new Position(11, 103)),
      new Token("(", TokenType.OpenParen, new Position(11, 104), new Position(11, 104)),
      new Token(")", TokenType.CloseParen, new Position(11, 105), new Position(11, 105)),
      new Token(")", TokenType.CloseParen, new Position(11, 106), new Position(11, 106)),
      new Token(")", TokenType.CloseParen, new Position(11, 107), new Position(11, 107)),
      new Token(";", TokenType.Semicolon, new Position(11, 108), new Position(11, 108)),
      new Token("DebugBreak", TokenType.Identifier, new Position(13, 1), new Position(13, 10)),
      new Token("(", TokenType.OpenParen, new Position(13, 11), new Position(13, 11)),
      new Token(")", TokenType.CloseParen, new Position(13, 12), new Position(13, 12)),
      new Token(";", TokenType.Semicolon, new Position(13, 13), new Position(13, 13)),
      new Token("If", TokenType.Identifier, new Position(15, 1), new Position(15, 2)),
      new Token("(", TokenType.OpenParen, new Position(15, 3), new Position(15, 3)),
      new Token("Length", TokenType.Identifier, new Position(15, 4), new Position(15, 9)),
      new Token("(", TokenType.OpenParen, new Position(15, 10), new Position(15, 10)),
      new Token("$jb.cache.value", TokenType.GlobalIdentifier, new Position(15, 11), new Position(15, 25)),
      new Token(")", TokenType.CloseParen, new Position(15, 26), new Position(15, 26)),
      new Token("==", TokenType.ComparisonOperator, new Position(15, 28), new Position(15, 29)),
      new Token("0", TokenType.Integer, new Position(15, 31), new Position(15, 31)),
      new Token(",", TokenType.Comma, new Position(16, 5), new Position(16, 5)),
      new Token("sendEmail", TokenType.Identifier, new Position(17, 9), new Position(17, 17)),
      new Token("=", TokenType.Assignment, new Position(17, 19), new Position(17, 19)),
      new Token("true", TokenType.True, new Position(17, 21), new Position(17, 24)),
      new Token(",", TokenType.Comma, new Position(18, 5), new Position(18, 5)),
      new Token("date", TokenType.Identifier, new Position(19, 9), new Position(19, 12)),
      new Token("=", TokenType.Assignment, new Position(19, 14), new Position(19, 14)),
      new Token("DateAdd", TokenType.Identifier, new Position(19, 16), new Position(19, 22)),
      new Token("(", TokenType.OpenParen, new Position(19, 23), new Position(19, 23)),
      new Token("dd", TokenType.SingleQuoteString, new Position(19, 24), new Position(19, 27)),
      new Token(",", TokenType.Comma, new Position(19, 28), new Position(19, 28)),
      new Token("1", TokenType.Integer, new Position(19, 29), new Position(19, 29)),
      new Token(",", TokenType.Comma, new Position(19, 30), new Position(19, 30)),
      new Token("$jb.cache.value", TokenType.GlobalIdentifier, new Position(19, 31), new Position(19, 45)),
      new Token(")", TokenType.CloseParen, new Position(19, 46), new Position(19, 46)),
      new Token(";", TokenType.Semicolon, new Position(19, 47), new Position(19, 47)),
      new Token("If", TokenType.Identifier, new Position(20, 9), new Position(20, 10)),
      new Token("(", TokenType.OpenParen, new Position(20, 11), new Position(20, 11)),
      new Token("date", TokenType.Identifier, new Position(20, 12), new Position(20, 15)),
      new Token("<", TokenType.ComparisonOperator, new Position(20, 17), new Position(20, 17)),
      new Token("Now", TokenType.Identifier, new Position(20, 19), new Position(20, 21)),
      new Token("(", TokenType.OpenParen, new Position(20, 22), new Position(20, 22)),
      new Token(")", TokenType.CloseParen, new Position(20, 23), new Position(20, 23)),
      new Token(",", TokenType.Comma, new Position(20, 24), new Position(20, 24)),
      new Token("sendEmail", TokenType.Identifier, new Position(20, 25), new Position(20, 33)),
      new Token("=", TokenType.Assignment, new Position(20, 35), new Position(20, 35)),
      new Token("true", TokenType.True, new Position(20, 37), new Position(20, 40)),
      new Token(")", TokenType.CloseParen, new Position(20, 41), new Position(20, 41)),
      new Token(")", TokenType.CloseParen, new Position(22, 1), new Position(22, 1)),
      new Token(";", TokenType.Semicolon, new Position(22, 2), new Position(22, 2)),
      new Token("If", TokenType.Identifier, new Position(24, 1), new Position(24, 2)),
      new Token("(", TokenType.OpenParen, new Position(24, 3), new Position(24, 3)),
      new Token("sendEmail", TokenType.Identifier, new Position(24, 4), new Position(24, 12)),
      new Token("==", TokenType.ComparisonOperator, new Position(24, 14), new Position(24, 15)),
      new Token("true", TokenType.True, new Position(24, 17), new Position(24, 20)),
      new Token(",", TokenType.Comma, new Position(25, 5), new Position(25, 5)),
      new Token("SendEmailMessage", TokenType.Identifier, new Position(26, 9), new Position(26, 24)),
      new Token("(", TokenType.OpenParen, new Position(26, 25), new Position(26, 25)),
      new Token("<TAG>Email Messages/jitterbit/core/jb.core.email</TAG>", TokenType.DoubleQuoteString, new Position(26, 26), new Position(26, 81)),
      new Token(")", TokenType.CloseParen, new Position(26, 82), new Position(26, 82)),
      new Token(";", TokenType.Semicolon, new Position(26, 83), new Position(26, 83)),
      new Token("$jb.cache.value", TokenType.GlobalIdentifier, new Position(27, 9), new Position(27, 23)),
      new Token("=", TokenType.Assignment, new Position(27, 25), new Position(27, 25)),
      new Token("Now", TokenType.Identifier, new Position(27, 27), new Position(27, 29)),
      new Token("(", TokenType.OpenParen, new Position(27, 30), new Position(27, 30)),
      new Token(")", TokenType.CloseParen, new Position(27, 31), new Position(27, 31)),
      new Token(";", TokenType.Semicolon, new Position(27, 32), new Position(27, 32)),
      new Token("If", TokenType.Identifier, new Position(28, 9), new Position(28, 10)),
      new Token("(", TokenType.OpenParen, new Position(28, 11), new Position(28, 11)),
      new Token("!", TokenType.UnaryOperator, new Position(28, 12), new Position(28, 12)),
      new Token("RunOperation", TokenType.Identifier, new Position(28, 13), new Position(28, 24)),
      new Token("(", TokenType.OpenParen, new Position(28, 25), new Position(28, 25)),
      new Token("<TAG>Operations/jitterbit/core/jb.core.cache.write</TAG>", TokenType.DoubleQuoteString, new Position(28, 26), new Position(28, 83)),
      new Token(")", TokenType.CloseParen, new Position(28, 84), new Position(28, 84)),
      new Token(",", TokenType.Comma, new Position(28, 85), new Position(28, 85)),
      new Token("RaiseError", TokenType.Identifier, new Position(28, 86), new Position(28, 95)),
      new Token("(", TokenType.OpenParen, new Position(28, 96), new Position(28, 96)),
      new Token("GetLastError", TokenType.Identifier, new Position(28, 97), new Position(28, 108)),
      new Token("(", TokenType.OpenParen, new Position(28, 109), new Position(28, 109)),
      new Token(")", TokenType.CloseParen, new Position(28, 110), new Position(28, 110)),
      new Token(")", TokenType.CloseParen, new Position(28, 111), new Position(28, 111)),
      new Token(")", TokenType.CloseParen, new Position(28, 112), new Position(28, 112)),
      new Token(")", TokenType.CloseParen, new Position(29, 1), new Position(29, 1)),
      new Token(";", TokenType.Semicolon, new Position(29, 2), new Position(29, 2)),
      new Token("DebugBreak", TokenType.Identifier, new Position(30, 1), new Position(30, 10)),
      new Token("(", TokenType.OpenParen, new Position(30, 11), new Position(30, 11)),
      new Token(")", TokenType.CloseParen, new Position(30, 12), new Position(30, 12)),
      new Token(";", TokenType.Semicolon, new Position(30, 13), new Position(30, 13)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(31, 1), new Position(31, 8))
    ]
  },
  {
    script:
`<trans>
$jb.log.message=' api.request.body = ' + $jitterbit.api.request.body
+' api.request.enum.body = ' + $jitterbit.api.request.enum.body
+' api.request.enum.headers = ' + $jitterbit.api.request.enum.headers
+' api.request.enum.parameters = ' + $jitterbit.api.request.enum.parameters
+' api.request.headers.fulluri = ' + $jitterbit.api.request.headers.fulluri
+' api.request.method = ' + $jitterbit.api.request.method
+' api.response = ' + $jitterbit.api.response
+' api.response.status_code = ' + $jitterbit.api.response.status_code
+' http.enable_cookies = ' + $jitterbit.http.enable_cookies
+' mime.boundary = ' + $jitterbit.mime.boundary
+' mime.message_id = ' + $jitterbit.mime.message_id
+' netsuite.async = ' + $jitterbit.netsuite.async
+' networking.http.request.method = ' + $jitterbit.networking.http.request.method
+' networking.http.response.content_type = ' + $jitterbit.networking.http.response.content_type
+' networking.http.response.status_code = ' + $jitterbit.networking.http.response.status_code
+' networking.peer.ip = ' + $jitterbit.networking.peer.ip
+' operation.chunking.warn_on_error = ' + $jitterbit.operation.chunking.warn_on_error
+' operation.error = ' + $jitterbit.operation.error
+' operation.guid) = ' + $jitterbit.operation.guid
+' operation.info = ' + $jitterbit.operation.info
+' operation.instance_guid = ' + $jitterbit.operation.instance_guid
+' operation.last_error = ' + $jitterbit.operation.last_error
+' operation.log_level = ' + $jitterbit.operation.log_level
+' operation.max_async_chain_length = ' + $jitterbit.operation.max_async_chain_length
+' operation.name = ' + $jitterbit.operation.name
+' operation.previous.error = ' + $jitterbit.operation.previous.error
+' operation.previous.success = ' + $jitterbit.operation.previous.success
+' operation.project_name = ' + $jitterbit.operation.project_name
+' operation.warning = ' + $jitterbit.operation.warning
+' operation.write_history = ' + $jitterbit.operation.write_history
+' scripting.db.auto_commit = ' + $jitterbit.scripting.db.auto_commit
+' scripting.db.character_encoding = ' + $jitterbit.scripting.db.character_encoding
+' scripting.db.max_rows) = ' + $jitterbit.scripting.db.max_rows
+' scripting.db.rows_affected = ' + $jitterbit.scripting.db.rows_affected
+' scripting.db.transaction = ' + $jitterbit.scripting.db.transaction
+' scripting.db.unicode = ' + $jitterbit.scripting.db.unicode
+' scripting.ldap.include_dn_in_results = ' + $jitterbit.scripting.ldap.include_dn_in_results
+' scripting.ldap.max_search_results = ' + $jitterbit.scripting.ldap.max_search_results
+' scripting.ldap.return_null_if_no_results = ' + $jitterbit.scripting.ldap.return_null_if_no_results
+' scripting.ldap.scope = ' + $jitterbit.scripting.ldap.scope
+' scripting.ldap.use_paged_search = ' + $jitterbit.scripting.ldap.use_paged_search
+' scripting.nesting.max = ' + $jitterbit.scripting.nesting.max
+' scripting.while.max_iterations = ' + $jitterbit.scripting.while.max_iterations
+' sfdc.auto_fieldsToNull = ' + $jitterbit.sfdc.auto_fieldsToNull
+' sfdc.failure_record_count = ' + $jitterbit.sfdc.failure_record_count
+' sfdc.query.record_count = ' + $jitterbit.sfdc.query.record_count
+' sfdc.success_record_count = ' + $jitterbit.sfdc.success_record_count
+' source.archivefilename = ' + $jitterbit.source.archivefilename
+' source.archivefilenames = ' + $jitterbit.source.archivefilenames
+' source.db.character_encoding = ' + $jitterbit.source.db.character_encoding
+' source.db.preserve_char_whitespace = ' + $jitterbit.source.db.preserve_char_whitespace
+' source.db.schema_name_delimiter = ' + $jitterbit.source.db.schema_name_delimiter
+' source.db.trim = ' + $jitterbit.source.db.trim
+' source.file_limit = ' + $jitterbit.source.file_limit
+' source.file_share.file_list_limit = ' + $jitterbit.source.file_share.file_list_limit
+' source.filename = ' + $jitterbit.source.filename
+' source.filenames = ' + $jitterbit.source.filenames
+' source.ftp.return_code = ' + $jitterbit.source.ftp.return_code
+' source.ftp.transfer_timeout = ' + $jitterbit.source.ftp.transfer_timeout
+' source.http.response = ' + $jitterbit.source.http.response
+' source.http.ssl_cert_id = ' + $jitterbit.source.http.ssl_cert_id
+' source.http.status_code = ' + $jitterbit.source.http.status_code
+' source.http.transfer_timeout = ' + $jitterbit.source.http.transfer_timeout
+' source.locator = ' + $jitterbit.source.locator
+' source.locators = ' + $jitterbit.source.locators
+' source.preserve_char_whitespace = ' + $jitterbit.source.preserve_char_whitespace
+' source.sftp.ssh_key_id = ' + $jitterbit.source.sftp.ssh_key_id
+' source.size = ' + $jitterbit.source.size
+' source.sizes = ' + $jitterbit.source.sizes
+' source.text.character_encoding = ' + $jitterbit.source.text.character_encoding
+' source.text.charset_detection_confidence = ' + $jitterbit.source.text.charset_detection_confidence
+' source.text.charset_detection_length = ' + $jitterbit.source.text.charset_detection_length
+' source.text.csv_nullable = ' + $jitterbit.source.text.csv_nullable
+' target.chunk_node_name = ' + $jitterbit.target.chunk_node_name
+' target.chunk_size = ' + $jitterbit.target.chunk_size
+' target.chunking_uncombined = ' + $jitterbit.target.chunking_uncombined
+' target.db.character_encoding = ' + $jitterbit.target.db.character_encoding
+' target.db.commit_chunks = ' + $jitterbit.target.db.commit_chunks
+' target.db.include_null_in_sql_statement = ' + $jitterbit.target.db.include_null_in_sql_statement
+' target.db.no_data_action = ' + $jitterbit.target.db.no_data_action
+' target.db.pre_target_sql = ' + $jitterbit.target.db.pre_target_sql
+' target.db.schema_name_delimiter = ' + $jitterbit.target.db.schema_name_delimiter
+' target.db.transaction = ' + $jitterbit.target.db.transaction
+' target.file_count = ' + $jitterbit.target.file_count
+' target.file_share.create_directories = ' + $jitterbit.target.file_share.create_directories
+' target.ftp.return_code = ' + $jitterbit.target.ftp.return_code
+' target.ftp.transfer_timeout = ' + $jitterbit.target.ftp.transfer_timeout
+' target.http.form_data = ' + $jitterbit.target.http.form_data
+' target.http.form_data.ContentType = ' + $jitterbit.target.http.form_data.ContentType
+' target.http.form_data.filename = ' + $jitterbit.target.http.form_data.filename
+' target.http.form_data.name = ' + $jitterbit.target.http.form_data.name
+' target.http.remove_trailing_linebreaks = ' + $jitterbit.target.http.remove_trailing_linebreaks
+' target.http.ssl_cert_id = ' + $jitterbit.target.http.ssl_cert_id
+' target.http.status_code = ' + $jitterbit.target.http.status_code
+' target.http.transfer_timeout = ' + $jitterbit.target.http.transfer_timeout
+' target.sftp.ssh_key_id = ' + $jitterbit.target.sftp.ssh_key_id
+' target.text.character_encoding = ' + $jitterbit.target.text.character_encoding
+' target.wave.json = ' + $jitterbit.target.wave.json
+' target.xml.include_empty_xml = ' + $jitterbit.target.xml.include_empty_xml
+' target.xml.include_null_xml = ' + $jitterbit.target.xml.include_null_xml
+' target.xml.nsprefix = ' + $jitterbit.target.xml.nsprefix
+' target.xml.num_for_bool = ' + $jitterbit.target.xml.num_for_bool
+' target.xml.prettify = ' + $jitterbit.target.xml.prettify
+' text.qualifier_required = ' + $jitterbit.text.qualifier_required
+' transformation.auto_streaming = ' + $jitterbit.transformation.auto_streaming
+' transformation.chunk_number = ' + $jitterbit.transformation.chunk_number
+' transformation.chunking = ' + $jitterbit.transformation.chunking
+' transformation.disable_normalization = ' + $jitterbit.transformation.disable_normalization
+' transformation.jbxmlparser = ' + $jitterbit.transformation.jbxmlparser
+' transformation.name = ' + $jitterbit.transformation.name
+' transformation.source.check_null_characters = ' + $jitterbit.transformation.source.check_null_characters
+' transformation.thread_number = ' + $jitterbit.transformation.thread_number
+' transformation.timing_on = ' + $jitterbit.transformation.timing_on
+' transformation.total_chunks = ' + $jitterbit.transformation.total_chunks
+' transformation.total_threads = ' + $jitterbit.transformation.total_threads
+' transformation.trim_extra_linebreaks = ' + $jitterbit.transformation.trim_extra_linebreaks
+' web_service_call.max_redirs = ' + $jitterbit.web_service_call.max_redirs
+' web_service_call.number_of_retries = ' + $jitterbit.web_service_call.number_of_retries
+' web_service_call.retry_wait_seconds = ' + $jitterbit.web_service_call.retry_wait_seconds
+' web_service_call.ssl_cert_id = ' + $jitterbit.web_service_call.ssl_cert_id
+' web_service_call.status_code = ' + $jitterbit.web_service_call.status_code
+' web_service_call.sync_response = ' + $jitterbit.web_service_call.sync_response
+' web_service_call.time_out = ' + $jitterbit.web_service_call.time_out;
RunScript("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",$jb.log.message);
</trans>`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("$jb.log.message", TokenType.GlobalIdentifier, new Position(2, 1), new Position(2, 15)),
      new Token("=", TokenType.Assignment, new Position(2, 16), new Position(2, 16)),
      new Token(" api.request.body = ", TokenType.SingleQuoteString, new Position(2, 17), new Position(2, 38)),
      new Token("+", TokenType.MathOperator, new Position(2, 40), new Position(2, 40)),
      new Token("$jitterbit.api.request.body", TokenType.GlobalIdentifier, new Position(2, 42), new Position(2, 68)),
      new Token("+", TokenType.MathOperator, new Position(3, 1), new Position(3, 1)),
      new Token(" api.request.enum.body = ", TokenType.SingleQuoteString, new Position(3, 2), new Position(3, 28)),
      new Token("+", TokenType.MathOperator, new Position(3, 30), new Position(3, 30)),
      new Token("$jitterbit.api.request.enum.body", TokenType.GlobalIdentifier, new Position(3, 32), new Position(3, 63)),
      new Token("+", TokenType.MathOperator, new Position(4, 1), new Position(4, 1)),
      new Token(" api.request.enum.headers = ", TokenType.SingleQuoteString, new Position(4, 2), new Position(4, 31)),
      new Token("+", TokenType.MathOperator, new Position(4, 33), new Position(4, 33)),
      new Token("$jitterbit.api.request.enum.headers", TokenType.GlobalIdentifier, new Position(4, 35), new Position(4, 69)),
      new Token("+", TokenType.MathOperator, new Position(5, 1), new Position(5, 1)),
      new Token(" api.request.enum.parameters = ", TokenType.SingleQuoteString, new Position(5, 2), new Position(5, 34)),
      new Token("+", TokenType.MathOperator, new Position(5, 36), new Position(5, 36)),
      new Token("$jitterbit.api.request.enum.parameters", TokenType.GlobalIdentifier, new Position(5, 38), new Position(5, 75)),
      new Token("+", TokenType.MathOperator, new Position(6, 1), new Position(6, 1)),
      new Token(" api.request.headers.fulluri = ", TokenType.SingleQuoteString, new Position(6, 2), new Position(6, 34)),
      new Token("+", TokenType.MathOperator, new Position(6, 36), new Position(6, 36)),
      new Token("$jitterbit.api.request.headers.fulluri", TokenType.GlobalIdentifier, new Position(6, 38), new Position(6, 75)),
      new Token("+", TokenType.MathOperator, new Position(7, 1), new Position(7, 1)),
      new Token(" api.request.method = ", TokenType.SingleQuoteString, new Position(7, 2), new Position(7, 25)),
      new Token("+", TokenType.MathOperator, new Position(7, 27), new Position(7, 27)),
      new Token("$jitterbit.api.request.method", TokenType.GlobalIdentifier, new Position(7, 29), new Position(7, 57)),new Token("+", TokenType.MathOperator, new Position(8, 1), new Position(8, 1)),
      new Token(" api.response = ", TokenType.SingleQuoteString, new Position(8, 2), new Position(8, 19)),
      new Token("+", TokenType.MathOperator, new Position(8, 21), new Position(8, 21)),
      new Token("$jitterbit.api.response", TokenType.GlobalIdentifier, new Position(8, 23), new Position(8, 45)),
      new Token("+", TokenType.MathOperator, new Position(9, 1), new Position(9, 1)),
      new Token(" api.response.status_code = ", TokenType.SingleQuoteString, new Position(9, 2), new Position(9, 31)),
      new Token("+", TokenType.MathOperator, new Position(9, 33), new Position(9, 33)),
      new Token("$jitterbit.api.response.status_code", TokenType.GlobalIdentifier, new Position(9, 35), new Position(9, 69)),
      new Token("+", TokenType.MathOperator, new Position(10, 1), new Position(10, 1)),
      new Token(" http.enable_cookies = ", TokenType.SingleQuoteString, new Position(10, 2), new Position(10, 26)),
      new Token("+", TokenType.MathOperator, new Position(10, 28), new Position(10, 28)),
      new Token("$jitterbit.http.enable_cookies", TokenType.GlobalIdentifier, new Position(10, 30), new Position(10, 59)),
      new Token("+", TokenType.MathOperator, new Position(11, 1), new Position(11, 1)),
      new Token(" mime.boundary = ", TokenType.SingleQuoteString, new Position(11, 2), new Position(11, 20)),
      new Token("+", TokenType.MathOperator, new Position(11, 22), new Position(11, 22)),
      new Token("$jitterbit.mime.boundary", TokenType.GlobalIdentifier, new Position(11, 24), new Position(11, 47)),
      new Token("+", TokenType.MathOperator, new Position(12, 1), new Position(12, 1)),
      new Token(" mime.message_id = ", TokenType.SingleQuoteString, new Position(12, 2), new Position(12, 22)),
      new Token("+", TokenType.MathOperator, new Position(12, 24), new Position(12, 24)),
      new Token("$jitterbit.mime.message_id", TokenType.GlobalIdentifier, new Position(12, 26), new Position(12, 51)),
      new Token("+", TokenType.MathOperator, new Position(13, 1), new Position(13, 1)),
      new Token(" netsuite.async = ", TokenType.SingleQuoteString, new Position(13, 2), new Position(13, 21)),
      new Token("+", TokenType.MathOperator, new Position(13, 23), new Position(13, 23)),
      new Token("$jitterbit.netsuite.async", TokenType.GlobalIdentifier, new Position(13, 25), new Position(13, 49)),
      new Token("+", TokenType.MathOperator, new Position(14, 1), new Position(14, 1)),
      new Token(" networking.http.request.method = ", TokenType.SingleQuoteString, new Position(14, 2), new Position(14, 37)),
      new Token("+", TokenType.MathOperator, new Position(14, 39), new Position(14, 39)),
      new Token("$jitterbit.networking.http.request.method", TokenType.GlobalIdentifier, new Position(14, 41), new Position(14, 81)),
      new Token("+", TokenType.MathOperator, new Position(15, 1), new Position(15, 1)),
      new Token(" networking.http.response.content_type = ", TokenType.SingleQuoteString, new Position(15, 2), new Position(15, 44)),
      new Token("+", TokenType.MathOperator, new Position(15, 46), new Position(15, 46)),
      new Token("$jitterbit.networking.http.response.content_type", TokenType.GlobalIdentifier, new Position(15, 48), new Position(15, 95)),
      new Token("+", TokenType.MathOperator, new Position(16, 1), new Position(16, 1)),
      new Token(" networking.http.response.status_code = ", TokenType.SingleQuoteString, new Position(16, 2), new Position(16, 43)),
      new Token("+", TokenType.MathOperator, new Position(16, 45), new Position(16, 45)),
      new Token("$jitterbit.networking.http.response.status_code", TokenType.GlobalIdentifier, new Position(16, 47), new Position(16, 93)),
      new Token("+", TokenType.MathOperator, new Position(17, 1), new Position(17, 1)),
      new Token(" networking.peer.ip = ", TokenType.SingleQuoteString, new Position(17, 2), new Position(17, 25)),
      new Token("+", TokenType.MathOperator, new Position(17, 27), new Position(17, 27)),
      new Token("$jitterbit.networking.peer.ip", TokenType.GlobalIdentifier, new Position(17, 29), new Position(17, 57)),
      new Token("+", TokenType.MathOperator, new Position(18, 1), new Position(18, 1)),
      new Token(" operation.chunking.warn_on_error = ", TokenType.SingleQuoteString, new Position(18, 2), new Position(18, 39)),
      new Token("+", TokenType.MathOperator, new Position(18, 41), new Position(18, 41)),
      new Token("$jitterbit.operation.chunking.warn_on_error", TokenType.GlobalIdentifier, new Position(18, 43), new Position(18, 85)),
      new Token("+", TokenType.MathOperator, new Position(19, 1), new Position(19, 1)),
      new Token(" operation.error = ", TokenType.SingleQuoteString, new Position(19, 2), new Position(19, 22)),
      new Token("+", TokenType.MathOperator, new Position(19, 24), new Position(19, 24)),
      new Token("$jitterbit.operation.error", TokenType.GlobalIdentifier, new Position(19, 26), new Position(19, 51)),
      new Token("+", TokenType.MathOperator, new Position(20, 1), new Position(20, 1)),
      new Token(" operation.guid) = ", TokenType.SingleQuoteString, new Position(20, 2), new Position(20, 22)),
      new Token("+", TokenType.MathOperator, new Position(20, 24), new Position(20, 24)),
      new Token("$jitterbit.operation.guid", TokenType.GlobalIdentifier, new Position(20, 26), new Position(20, 50)),
      new Token("+", TokenType.MathOperator, new Position(21, 1), new Position(21, 1)),
      new Token(" operation.info = ", TokenType.SingleQuoteString, new Position(21, 2), new Position(21, 21)),
      new Token("+", TokenType.MathOperator, new Position(21, 23), new Position(21, 23)),
      new Token("$jitterbit.operation.info", TokenType.GlobalIdentifier, new Position(21, 25), new Position(21, 49)),
      new Token("+", TokenType.MathOperator, new Position(22, 1), new Position(22, 1)),
      new Token(" operation.instance_guid = ", TokenType.SingleQuoteString, new Position(22, 2), new Position(22, 30)),
      new Token("+", TokenType.MathOperator, new Position(22, 32), new Position(22, 32)),
      new Token("$jitterbit.operation.instance_guid", TokenType.GlobalIdentifier, new Position(22, 34), new Position(22, 67)),
      new Token("+", TokenType.MathOperator, new Position(23, 1), new Position(23, 1)),
      new Token(" operation.last_error = ", TokenType.SingleQuoteString, new Position(23, 2), new Position(23, 27)),
      new Token("+", TokenType.MathOperator, new Position(23, 29), new Position(23, 29)),
      new Token("$jitterbit.operation.last_error", TokenType.GlobalIdentifier, new Position(23, 31), new Position(23, 61)),
      new Token("+", TokenType.MathOperator, new Position(24, 1), new Position(24, 1)),
      new Token(" operation.log_level = ", TokenType.SingleQuoteString, new Position(24, 2), new Position(24, 26)),
      new Token("+", TokenType.MathOperator, new Position(24, 28), new Position(24, 28)),
      new Token("$jitterbit.operation.log_level", TokenType.GlobalIdentifier, new Position(24, 30), new Position(24, 59)),
      new Token("+", TokenType.MathOperator, new Position(25, 1), new Position(25, 1)),
      new Token(" operation.max_async_chain_length = ", TokenType.SingleQuoteString, new Position(25, 2), new Position(25, 39)),
      new Token("+", TokenType.MathOperator, new Position(25, 41), new Position(25, 41)),
      new Token("$jitterbit.operation.max_async_chain_length", TokenType.GlobalIdentifier, new Position(25, 43), new Position(25, 85)),
      new Token("+", TokenType.MathOperator, new Position(26, 1), new Position(26, 1)),
      new Token(" operation.name = ", TokenType.SingleQuoteString, new Position(26, 2), new Position(26, 21)),
      new Token("+", TokenType.MathOperator, new Position(26, 23), new Position(26, 23)),
      new Token("$jitterbit.operation.name", TokenType.GlobalIdentifier, new Position(26, 25), new Position(26, 49)),
      new Token("+", TokenType.MathOperator, new Position(27, 1), new Position(27, 1)),
      new Token(" operation.previous.error = ", TokenType.SingleQuoteString, new Position(27, 2), new Position(27, 31)),
      new Token("+", TokenType.MathOperator, new Position(27, 33), new Position(27, 33)),
      new Token("$jitterbit.operation.previous.error", TokenType.GlobalIdentifier, new Position(27, 35), new Position(27, 69)),
      new Token("+", TokenType.MathOperator, new Position(28, 1), new Position(28, 1)),
      new Token(" operation.previous.success = ", TokenType.SingleQuoteString, new Position(28, 2), new Position(28, 33)),
      new Token("+", TokenType.MathOperator, new Position(28, 35), new Position(28, 35)),
      new Token("$jitterbit.operation.previous.success", TokenType.GlobalIdentifier, new Position(28, 37), new Position(28, 73)),
      new Token("+", TokenType.MathOperator, new Position(29, 1), new Position(29, 1)),
      new Token(" operation.project_name = ", TokenType.SingleQuoteString, new Position(29, 2), new Position(29, 29)),
      new Token("+", TokenType.MathOperator, new Position(29, 31), new Position(29, 31)),
      new Token("$jitterbit.operation.project_name", TokenType.GlobalIdentifier, new Position(29, 33), new Position(29, 65)),
      new Token("+", TokenType.MathOperator, new Position(30, 1), new Position(30, 1)),
      new Token(" operation.warning = ", TokenType.SingleQuoteString, new Position(30, 2), new Position(30, 24)),
      new Token("+", TokenType.MathOperator, new Position(30, 26), new Position(30, 26)),
      new Token("$jitterbit.operation.warning", TokenType.GlobalIdentifier, new Position(30, 28), new Position(30, 55)),
      new Token("+", TokenType.MathOperator, new Position(31, 1), new Position(31, 1)),
      new Token(" operation.write_history = ", TokenType.SingleQuoteString, new Position(31, 2), new Position(31, 30)),new Token("+", TokenType.MathOperator, new Position(31, 32), new Position(31, 32)),
      new Token("$jitterbit.operation.write_history", TokenType.GlobalIdentifier, new Position(31, 34), new Position(31, 67)),
      new Token("+", TokenType.MathOperator, new Position(32, 1), new Position(32, 1)),
      new Token(" scripting.db.auto_commit = ", TokenType.SingleQuoteString, new Position(32, 2), new Position(32, 31)),
      new Token("+", TokenType.MathOperator, new Position(32, 33), new Position(32, 33)),
      new Token("$jitterbit.scripting.db.auto_commit", TokenType.GlobalIdentifier, new Position(32, 35), new Position(32, 69)),
      new Token("+", TokenType.MathOperator, new Position(33, 1), new Position(33, 1)),
      new Token(" scripting.db.character_encoding = ", TokenType.SingleQuoteString, new Position(33, 2), new Position(33, 38)),
      new Token("+", TokenType.MathOperator, new Position(33, 40), new Position(33, 40)),
      new Token("$jitterbit.scripting.db.character_encoding", TokenType.GlobalIdentifier, new Position(33, 42), new Position(33, 83)),
      new Token("+", TokenType.MathOperator, new Position(34, 1), new Position(34, 1)),
      new Token(" scripting.db.max_rows) = ", TokenType.SingleQuoteString, new Position(34, 2), new Position(34, 29)),
      new Token("+", TokenType.MathOperator, new Position(34, 31), new Position(34, 31)),
      new Token("$jitterbit.scripting.db.max_rows", TokenType.GlobalIdentifier, new Position(34, 33), new Position(34, 64)),
      new Token("+", TokenType.MathOperator, new Position(35, 1), new Position(35, 1)),
      new Token(" scripting.db.rows_affected = ", TokenType.SingleQuoteString, new Position(35, 2), new Position(35, 33)),
      new Token("+", TokenType.MathOperator, new Position(35, 35), new Position(35, 35)),
      new Token("$jitterbit.scripting.db.rows_affected", TokenType.GlobalIdentifier, new Position(35, 37), new Position(35, 73)),
      new Token("+", TokenType.MathOperator, new Position(36, 1), new Position(36, 1)),
      new Token(" scripting.db.transaction = ", TokenType.SingleQuoteString, new Position(36, 2), new Position(36, 31)),
      new Token("+", TokenType.MathOperator, new Position(36, 33), new Position(36, 33)),
      new Token("$jitterbit.scripting.db.transaction", TokenType.GlobalIdentifier, new Position(36, 35), new Position(36, 69)),
      new Token("+", TokenType.MathOperator, new Position(37, 1), new Position(37, 1)),
      new Token(" scripting.db.unicode = ", TokenType.SingleQuoteString, new Position(37, 2), new Position(37, 27)),
      new Token("+", TokenType.MathOperator, new Position(37, 29), new Position(37, 29)),
      new Token("$jitterbit.scripting.db.unicode", TokenType.GlobalIdentifier, new Position(37, 31), new Position(37, 61)),
      new Token("+", TokenType.MathOperator, new Position(38, 1), new Position(38, 1)),
      new Token(" scripting.ldap.include_dn_in_results = ", TokenType.SingleQuoteString, new Position(38, 2), new Position(38, 43)),
      new Token("+", TokenType.MathOperator, new Position(38, 45), new Position(38, 45)),
      new Token("$jitterbit.scripting.ldap.include_dn_in_results", TokenType.GlobalIdentifier, new Position(38, 47), new Position(38, 93)),
      new Token("+", TokenType.MathOperator, new Position(39, 1), new Position(39, 1)),
      new Token(" scripting.ldap.max_search_results = ", TokenType.SingleQuoteString, new Position(39, 2), new Position(39, 40)),
      new Token("+", TokenType.MathOperator, new Position(39, 42), new Position(39, 42)),
      new Token("$jitterbit.scripting.ldap.max_search_results", TokenType.GlobalIdentifier, new Position(39, 44), new Position(39, 87)),
      new Token("+", TokenType.MathOperator, new Position(40, 1), new Position(40, 1)),
      new Token(" scripting.ldap.return_null_if_no_results = ", TokenType.SingleQuoteString, new Position(40, 2), new Position(40, 47)),
      new Token("+", TokenType.MathOperator, new Position(40, 49), new Position(40, 49)),
      new Token("$jitterbit.scripting.ldap.return_null_if_no_results", TokenType.GlobalIdentifier, new Position(40, 51), new Position(40, 101)),
      new Token("+", TokenType.MathOperator, new Position(41, 1), new Position(41, 1)),
      new Token(" scripting.ldap.scope = ", TokenType.SingleQuoteString, new Position(41, 2), new Position(41, 27)),
      new Token("+", TokenType.MathOperator, new Position(41, 29), new Position(41, 29)),
      new Token("$jitterbit.scripting.ldap.scope", TokenType.GlobalIdentifier, new Position(41, 31), new Position(41, 61)),
      new Token("+", TokenType.MathOperator, new Position(42, 1), new Position(42, 1)),
      new Token(" scripting.ldap.use_paged_search = ", TokenType.SingleQuoteString, new Position(42, 2), new Position(42, 38)),
      new Token("+", TokenType.MathOperator, new Position(42, 40), new Position(42, 40)),
      new Token("$jitterbit.scripting.ldap.use_paged_search", TokenType.GlobalIdentifier, new Position(42, 42), new Position(42, 83)),
      new Token("+", TokenType.MathOperator, new Position(43, 1), new Position(43, 1)),
      new Token(" scripting.nesting.max = ", TokenType.SingleQuoteString, new Position(43, 2), new Position(43, 28)),
      new Token("+", TokenType.MathOperator, new Position(43, 30), new Position(43, 30)),
      new Token("$jitterbit.scripting.nesting.max", TokenType.GlobalIdentifier, new Position(43, 32), new Position(43, 63)),
      new Token("+", TokenType.MathOperator, new Position(44, 1), new Position(44, 1)),
      new Token(" scripting.while.max_iterations = ", TokenType.SingleQuoteString, new Position(44, 2), new Position(44, 37)),
      new Token("+", TokenType.MathOperator, new Position(44, 39), new Position(44, 39)),
      new Token("$jitterbit.scripting.while.max_iterations", TokenType.GlobalIdentifier, new Position(44, 41), new Position(44, 81)),
      new Token("+", TokenType.MathOperator, new Position(45, 1), new Position(45, 1)),
      new Token(" sfdc.auto_fieldsToNull = ", TokenType.SingleQuoteString, new Position(45, 2), new Position(45, 29)),
      new Token("+", TokenType.MathOperator, new Position(45, 31), new Position(45, 31)),
      new Token("$jitterbit.sfdc.auto_fieldsToNull", TokenType.GlobalIdentifier, new Position(45, 33), new Position(45, 65)),
      new Token("+", TokenType.MathOperator, new Position(46, 1), new Position(46, 1)),
      new Token(" sfdc.failure_record_count = ", TokenType.SingleQuoteString, new Position(46, 2), new Position(46, 32)),
      new Token("+", TokenType.MathOperator, new Position(46, 34), new Position(46, 34)),
      new Token("$jitterbit.sfdc.failure_record_count", TokenType.GlobalIdentifier, new Position(46, 36), new Position(46, 71)),
      new Token("+", TokenType.MathOperator, new Position(47, 1), new Position(47, 1)),
      new Token(" sfdc.query.record_count = ", TokenType.SingleQuoteString, new Position(47, 2), new Position(47, 30)),new Token("+", TokenType.MathOperator, new Position(47, 32), new Position(47, 32)),
      new Token("$jitterbit.sfdc.query.record_count", TokenType.GlobalIdentifier, new Position(47, 34), new Position(47, 67)),
      new Token("+", TokenType.MathOperator, new Position(48, 1), new Position(48, 1)),
      new Token(" sfdc.success_record_count = ", TokenType.SingleQuoteString, new Position(48, 2), new Position(48, 32)),
      new Token("+", TokenType.MathOperator, new Position(48, 34), new Position(48, 34)),
      new Token("$jitterbit.sfdc.success_record_count", TokenType.GlobalIdentifier, new Position(48, 36), new Position(48, 71)),
      new Token("+", TokenType.MathOperator, new Position(49, 1), new Position(49, 1)),
      new Token(" source.archivefilename = ", TokenType.SingleQuoteString, new Position(49, 2), new Position(49, 29)),
      new Token("+", TokenType.MathOperator, new Position(49, 31), new Position(49, 31)),
      new Token("$jitterbit.source.archivefilename", TokenType.GlobalIdentifier, new Position(49, 33), new Position(49, 65)),
      new Token("+", TokenType.MathOperator, new Position(50, 1), new Position(50, 1)),
      new Token(" source.archivefilenames = ", TokenType.SingleQuoteString, new Position(50, 2), new Position(50, 30)),new Token("+", TokenType.MathOperator, new Position(50, 32), new Position(50, 32)),
      new Token("$jitterbit.source.archivefilenames", TokenType.GlobalIdentifier, new Position(50, 34), new Position(50, 67)),
      new Token("+", TokenType.MathOperator, new Position(51, 1), new Position(51, 1)),
      new Token(" source.db.character_encoding = ", TokenType.SingleQuoteString, new Position(51, 2), new Position(51, 35)),
      new Token("+", TokenType.MathOperator, new Position(51, 37), new Position(51, 37)),
      new Token("$jitterbit.source.db.character_encoding", TokenType.GlobalIdentifier, new Position(51, 39), new Position(51, 77)),
      new Token("+", TokenType.MathOperator, new Position(52, 1), new Position(52, 1)),
      new Token(" source.db.preserve_char_whitespace = ", TokenType.SingleQuoteString, new Position(52, 2), new Position(52, 41)),
      new Token("+", TokenType.MathOperator, new Position(52, 43), new Position(52, 43)),
      new Token("$jitterbit.source.db.preserve_char_whitespace", TokenType.GlobalIdentifier, new Position(52, 45), new Position(52, 89)),
      new Token("+", TokenType.MathOperator, new Position(53, 1), new Position(53, 1)),
      new Token(" source.db.schema_name_delimiter = ", TokenType.SingleQuoteString, new Position(53, 2), new Position(53, 38)),
      new Token("+", TokenType.MathOperator, new Position(53, 40), new Position(53, 40)),
      new Token("$jitterbit.source.db.schema_name_delimiter", TokenType.GlobalIdentifier, new Position(53, 42), new Position(53, 83)),
      new Token("+", TokenType.MathOperator, new Position(54, 1), new Position(54, 1)),
      new Token(" source.db.trim = ", TokenType.SingleQuoteString, new Position(54, 2), new Position(54, 21)),
      new Token("+", TokenType.MathOperator, new Position(54, 23), new Position(54, 23)),
      new Token("$jitterbit.source.db.trim", TokenType.GlobalIdentifier, new Position(54, 25), new Position(54, 49)),
      new Token("+", TokenType.MathOperator, new Position(55, 1), new Position(55, 1)),
      new Token(" source.file_limit = ", TokenType.SingleQuoteString, new Position(55, 2), new Position(55, 24)),
      new Token("+", TokenType.MathOperator, new Position(55, 26), new Position(55, 26)),
      new Token("$jitterbit.source.file_limit", TokenType.GlobalIdentifier, new Position(55, 28), new Position(55, 55)),
      new Token("+", TokenType.MathOperator, new Position(56, 1), new Position(56, 1)),
      new Token(" source.file_share.file_list_limit = ", TokenType.SingleQuoteString, new Position(56, 2), new Position(56, 40)),
      new Token("+", TokenType.MathOperator, new Position(56, 42), new Position(56, 42)),
      new Token("$jitterbit.source.file_share.file_list_limit", TokenType.GlobalIdentifier, new Position(56, 44), new Position(56, 87)),
      new Token("+", TokenType.MathOperator, new Position(57, 1), new Position(57, 1)),
      new Token(" source.filename = ", TokenType.SingleQuoteString, new Position(57, 2), new Position(57, 22)),
      new Token("+", TokenType.MathOperator, new Position(57, 24), new Position(57, 24)),
      new Token("$jitterbit.source.filename", TokenType.GlobalIdentifier, new Position(57, 26), new Position(57, 51)),
      new Token("+", TokenType.MathOperator, new Position(58, 1), new Position(58, 1)),
      new Token(" source.filenames = ", TokenType.SingleQuoteString, new Position(58, 2), new Position(58, 23)),
      new Token("+", TokenType.MathOperator, new Position(58, 25), new Position(58, 25)),
      new Token("$jitterbit.source.filenames", TokenType.GlobalIdentifier, new Position(58, 27), new Position(58, 53)),new Token("+", TokenType.MathOperator, new Position(59, 1), new Position(59, 1)),
      new Token(" source.ftp.return_code = ", TokenType.SingleQuoteString, new Position(59, 2), new Position(59, 29)),
      new Token("+", TokenType.MathOperator, new Position(59, 31), new Position(59, 31)),
      new Token("$jitterbit.source.ftp.return_code", TokenType.GlobalIdentifier, new Position(59, 33), new Position(59, 65)),
      new Token("+", TokenType.MathOperator, new Position(60, 1), new Position(60, 1)),
      new Token(" source.ftp.transfer_timeout = ", TokenType.SingleQuoteString, new Position(60, 2), new Position(60, 34)),
      new Token("+", TokenType.MathOperator, new Position(60, 36), new Position(60, 36)),
      new Token("$jitterbit.source.ftp.transfer_timeout", TokenType.GlobalIdentifier, new Position(60, 38), new Position(60, 75)),
      new Token("+", TokenType.MathOperator, new Position(61, 1), new Position(61, 1)),
      new Token(" source.http.response = ", TokenType.SingleQuoteString, new Position(61, 2), new Position(61, 27)),
      new Token("+", TokenType.MathOperator, new Position(61, 29), new Position(61, 29)),
      new Token("$jitterbit.source.http.response", TokenType.GlobalIdentifier, new Position(61, 31), new Position(61, 61)),
      new Token("+", TokenType.MathOperator, new Position(62, 1), new Position(62, 1)),
      new Token(" source.http.ssl_cert_id = ", TokenType.SingleQuoteString, new Position(62, 2), new Position(62, 30)),new Token("+", TokenType.MathOperator, new Position(62, 32), new Position(62, 32)),
      new Token("$jitterbit.source.http.ssl_cert_id", TokenType.GlobalIdentifier, new Position(62, 34), new Position(62, 67)),
      new Token("+", TokenType.MathOperator, new Position(63, 1), new Position(63, 1)),
      new Token(" source.http.status_code = ", TokenType.SingleQuoteString, new Position(63, 2), new Position(63, 30)),new Token("+", TokenType.MathOperator, new Position(63, 32), new Position(63, 32)),
      new Token("$jitterbit.source.http.status_code", TokenType.GlobalIdentifier, new Position(63, 34), new Position(63, 67)),
      new Token("+", TokenType.MathOperator, new Position(64, 1), new Position(64, 1)),
      new Token(" source.http.transfer_timeout = ", TokenType.SingleQuoteString, new Position(64, 2), new Position(64, 35)),
      new Token("+", TokenType.MathOperator, new Position(64, 37), new Position(64, 37)),
      new Token("$jitterbit.source.http.transfer_timeout", TokenType.GlobalIdentifier, new Position(64, 39), new Position(64, 77)),
      new Token("+", TokenType.MathOperator, new Position(65, 1), new Position(65, 1)),
      new Token(" source.locator = ", TokenType.SingleQuoteString, new Position(65, 2), new Position(65, 21)),
      new Token("+", TokenType.MathOperator, new Position(65, 23), new Position(65, 23)),
      new Token("$jitterbit.source.locator", TokenType.GlobalIdentifier, new Position(65, 25), new Position(65, 49)),
      new Token("+", TokenType.MathOperator, new Position(66, 1), new Position(66, 1)),
      new Token(" source.locators = ", TokenType.SingleQuoteString, new Position(66, 2), new Position(66, 22)),
      new Token("+", TokenType.MathOperator, new Position(66, 24), new Position(66, 24)),
      new Token("$jitterbit.source.locators", TokenType.GlobalIdentifier, new Position(66, 26), new Position(66, 51)),
      new Token("+", TokenType.MathOperator, new Position(67, 1), new Position(67, 1)),
      new Token(" source.preserve_char_whitespace = ", TokenType.SingleQuoteString, new Position(67, 2), new Position(67, 38)),
      new Token("+", TokenType.MathOperator, new Position(67, 40), new Position(67, 40)),
      new Token("$jitterbit.source.preserve_char_whitespace", TokenType.GlobalIdentifier, new Position(67, 42), new Position(67, 83)),
      new Token("+", TokenType.MathOperator, new Position(68, 1), new Position(68, 1)),
      new Token(" source.sftp.ssh_key_id = ", TokenType.SingleQuoteString, new Position(68, 2), new Position(68, 29)),
      new Token("+", TokenType.MathOperator, new Position(68, 31), new Position(68, 31)),
      new Token("$jitterbit.source.sftp.ssh_key_id", TokenType.GlobalIdentifier, new Position(68, 33), new Position(68, 65)),
      new Token("+", TokenType.MathOperator, new Position(69, 1), new Position(69, 1)),
      new Token(" source.size = ", TokenType.SingleQuoteString, new Position(69, 2), new Position(69, 18)),
      new Token("+", TokenType.MathOperator, new Position(69, 20), new Position(69, 20)),
      new Token("$jitterbit.source.size", TokenType.GlobalIdentifier, new Position(69, 22), new Position(69, 43)),
      new Token("+", TokenType.MathOperator, new Position(70, 1), new Position(70, 1)),
      new Token(" source.sizes = ", TokenType.SingleQuoteString, new Position(70, 2), new Position(70, 19)),
      new Token("+", TokenType.MathOperator, new Position(70, 21), new Position(70, 21)),
      new Token("$jitterbit.source.sizes", TokenType.GlobalIdentifier, new Position(70, 23), new Position(70, 45)),
      new Token("+", TokenType.MathOperator, new Position(71, 1), new Position(71, 1)),
      new Token(" source.text.character_encoding = ", TokenType.SingleQuoteString, new Position(71, 2), new Position(71, 37)),
      new Token("+", TokenType.MathOperator, new Position(71, 39), new Position(71, 39)),
      new Token("$jitterbit.source.text.character_encoding", TokenType.GlobalIdentifier, new Position(71, 41), new Position(71, 81)),
      new Token("+", TokenType.MathOperator, new Position(72, 1), new Position(72, 1)),
      new Token(" source.text.charset_detection_confidence = ", TokenType.SingleQuoteString, new Position(72, 2), new Position(72, 47)),
      new Token("+", TokenType.MathOperator, new Position(72, 49), new Position(72, 49)),
      new Token("$jitterbit.source.text.charset_detection_confidence", TokenType.GlobalIdentifier, new Position(72, 51), new Position(72, 101)),
      new Token("+", TokenType.MathOperator, new Position(73, 1), new Position(73, 1)),
      new Token(" source.text.charset_detection_length = ", TokenType.SingleQuoteString, new Position(73, 2), new Position(73, 43)),
      new Token("+", TokenType.MathOperator, new Position(73, 45), new Position(73, 45)),
      new Token("$jitterbit.source.text.charset_detection_length", TokenType.GlobalIdentifier, new Position(73, 47), new Position(73, 93)),
      new Token("+", TokenType.MathOperator, new Position(74, 1), new Position(74, 1)),
      new Token(" source.text.csv_nullable = ", TokenType.SingleQuoteString, new Position(74, 2), new Position(74, 31)),
      new Token("+", TokenType.MathOperator, new Position(74, 33), new Position(74, 33)),
      new Token("$jitterbit.source.text.csv_nullable", TokenType.GlobalIdentifier, new Position(74, 35), new Position(74, 69)),
      new Token("+", TokenType.MathOperator, new Position(75, 1), new Position(75, 1)),
      new Token(" target.chunk_node_name = ", TokenType.SingleQuoteString, new Position(75, 2), new Position(75, 29)),
      new Token("+", TokenType.MathOperator, new Position(75, 31), new Position(75, 31)),
      new Token("$jitterbit.target.chunk_node_name", TokenType.GlobalIdentifier, new Position(75, 33), new Position(75, 65)),
      new Token("+", TokenType.MathOperator, new Position(76, 1), new Position(76, 1)),
      new Token(" target.chunk_size = ", TokenType.SingleQuoteString, new Position(76, 2), new Position(76, 24)),
      new Token("+", TokenType.MathOperator, new Position(76, 26), new Position(76, 26)),
      new Token("$jitterbit.target.chunk_size", TokenType.GlobalIdentifier, new Position(76, 28), new Position(76, 55)),
      new Token("+", TokenType.MathOperator, new Position(77, 1), new Position(77, 1)),
      new Token(" target.chunking_uncombined = ", TokenType.SingleQuoteString, new Position(77, 2), new Position(77, 33)),
      new Token("+", TokenType.MathOperator, new Position(77, 35), new Position(77, 35)),
      new Token("$jitterbit.target.chunking_uncombined", TokenType.GlobalIdentifier, new Position(77, 37), new Position(77, 73)),
      new Token("+", TokenType.MathOperator, new Position(78, 1), new Position(78, 1)),
      new Token(" target.db.character_encoding = ", TokenType.SingleQuoteString, new Position(78, 2), new Position(78, 35)),
      new Token("+", TokenType.MathOperator, new Position(78, 37), new Position(78, 37)),
      new Token("$jitterbit.target.db.character_encoding", TokenType.GlobalIdentifier, new Position(78, 39), new Position(78, 77)),
      new Token("+", TokenType.MathOperator, new Position(79, 1), new Position(79, 1)),
      new Token(" target.db.commit_chunks = ", TokenType.SingleQuoteString, new Position(79, 2), new Position(79, 30)),new Token("+", TokenType.MathOperator, new Position(79, 32), new Position(79, 32)),
      new Token("$jitterbit.target.db.commit_chunks", TokenType.GlobalIdentifier, new Position(79, 34), new Position(79, 67)),
      new Token("+", TokenType.MathOperator, new Position(80, 1), new Position(80, 1)),
      new Token(" target.db.include_null_in_sql_statement = ", TokenType.SingleQuoteString, new Position(80, 2), new Position(80, 46)),
      new Token("+", TokenType.MathOperator, new Position(80, 48), new Position(80, 48)),
      new Token("$jitterbit.target.db.include_null_in_sql_statement", TokenType.GlobalIdentifier, new Position(80, 50), new Position(80, 99)),
      new Token("+", TokenType.MathOperator, new Position(81, 1), new Position(81, 1)),
      new Token(" target.db.no_data_action = ", TokenType.SingleQuoteString, new Position(81, 2), new Position(81, 31)),
      new Token("+", TokenType.MathOperator, new Position(81, 33), new Position(81, 33)),
      new Token("$jitterbit.target.db.no_data_action", TokenType.GlobalIdentifier, new Position(81, 35), new Position(81, 69)),
      new Token("+", TokenType.MathOperator, new Position(82, 1), new Position(82, 1)),
      new Token(" target.db.pre_target_sql = ", TokenType.SingleQuoteString, new Position(82, 2), new Position(82, 31)),
      new Token("+", TokenType.MathOperator, new Position(82, 33), new Position(82, 33)),
      new Token("$jitterbit.target.db.pre_target_sql", TokenType.GlobalIdentifier, new Position(82, 35), new Position(82, 69)),
      new Token("+", TokenType.MathOperator, new Position(83, 1), new Position(83, 1)),
      new Token(" target.db.schema_name_delimiter = ", TokenType.SingleQuoteString, new Position(83, 2), new Position(83, 38)),
      new Token("+", TokenType.MathOperator, new Position(83, 40), new Position(83, 40)),
      new Token("$jitterbit.target.db.schema_name_delimiter", TokenType.GlobalIdentifier, new Position(83, 42), new Position(83, 83)),
      new Token("+", TokenType.MathOperator, new Position(84, 1), new Position(84, 1)),
      new Token(" target.db.transaction = ", TokenType.SingleQuoteString, new Position(84, 2), new Position(84, 28)),
      new Token("+", TokenType.MathOperator, new Position(84, 30), new Position(84, 30)),
      new Token("$jitterbit.target.db.transaction", TokenType.GlobalIdentifier, new Position(84, 32), new Position(84, 63)),
      new Token("+", TokenType.MathOperator, new Position(85, 1), new Position(85, 1)),
      new Token(" target.file_count = ", TokenType.SingleQuoteString, new Position(85, 2), new Position(85, 24)),
      new Token("+", TokenType.MathOperator, new Position(85, 26), new Position(85, 26)),
      new Token("$jitterbit.target.file_count", TokenType.GlobalIdentifier, new Position(85, 28), new Position(85, 55)),
      new Token("+", TokenType.MathOperator, new Position(86, 1), new Position(86, 1)),
      new Token(" target.file_share.create_directories = ", TokenType.SingleQuoteString, new Position(86, 2), new Position(86, 43)),
      new Token("+", TokenType.MathOperator, new Position(86, 45), new Position(86, 45)),
      new Token("$jitterbit.target.file_share.create_directories", TokenType.GlobalIdentifier, new Position(86, 47), new Position(86, 93)),
      new Token("+", TokenType.MathOperator, new Position(87, 1), new Position(87, 1)),
      new Token(" target.ftp.return_code = ", TokenType.SingleQuoteString, new Position(87, 2), new Position(87, 29)),
      new Token("+", TokenType.MathOperator, new Position(87, 31), new Position(87, 31)),
      new Token("$jitterbit.target.ftp.return_code", TokenType.GlobalIdentifier, new Position(87, 33), new Position(87, 65)),
      new Token("+", TokenType.MathOperator, new Position(88, 1), new Position(88, 1)),
      new Token(" target.ftp.transfer_timeout = ", TokenType.SingleQuoteString, new Position(88, 2), new Position(88, 34)),
      new Token("+", TokenType.MathOperator, new Position(88, 36), new Position(88, 36)),
      new Token("$jitterbit.target.ftp.transfer_timeout", TokenType.GlobalIdentifier, new Position(88, 38), new Position(88, 75)),
      new Token("+", TokenType.MathOperator, new Position(89, 1), new Position(89, 1)),
      new Token(" target.http.form_data = ", TokenType.SingleQuoteString, new Position(89, 2), new Position(89, 28)),
      new Token("+", TokenType.MathOperator, new Position(89, 30), new Position(89, 30)),
      new Token("$jitterbit.target.http.form_data", TokenType.GlobalIdentifier, new Position(89, 32), new Position(89, 63)),
      new Token("+", TokenType.MathOperator, new Position(90, 1), new Position(90, 1)),
      new Token(" target.http.form_data.ContentType = ", TokenType.SingleQuoteString, new Position(90, 2), new Position(90, 40)),
      new Token("+", TokenType.MathOperator, new Position(90, 42), new Position(90, 42)),
      new Token("$jitterbit.target.http.form_data.ContentType", TokenType.GlobalIdentifier, new Position(90, 44), new Position(90, 87)),
      new Token("+", TokenType.MathOperator, new Position(91, 1), new Position(91, 1)),
      new Token(" target.http.form_data.filename = ", TokenType.SingleQuoteString, new Position(91, 2), new Position(91, 37)),
      new Token("+", TokenType.MathOperator, new Position(91, 39), new Position(91, 39)),
      new Token("$jitterbit.target.http.form_data.filename", TokenType.GlobalIdentifier, new Position(91, 41), new Position(91, 81)),
      new Token("+", TokenType.MathOperator, new Position(92, 1), new Position(92, 1)),
      new Token(" target.http.form_data.name = ", TokenType.SingleQuoteString, new Position(92, 2), new Position(92, 33)),
      new Token("+", TokenType.MathOperator, new Position(92, 35), new Position(92, 35)),
      new Token("$jitterbit.target.http.form_data.name", TokenType.GlobalIdentifier, new Position(92, 37), new Position(92, 73)),
      new Token("+", TokenType.MathOperator, new Position(93, 1), new Position(93, 1)),
      new Token(" target.http.remove_trailing_linebreaks = ", TokenType.SingleQuoteString, new Position(93, 2), new Position(93, 45)),
      new Token("+", TokenType.MathOperator, new Position(93, 47), new Position(93, 47)),
      new Token("$jitterbit.target.http.remove_trailing_linebreaks", TokenType.GlobalIdentifier, new Position(93, 49), new Position(93, 97)),
      new Token("+", TokenType.MathOperator, new Position(94, 1), new Position(94, 1)),
      new Token(" target.http.ssl_cert_id = ", TokenType.SingleQuoteString, new Position(94, 2), new Position(94, 30)),new Token("+", TokenType.MathOperator, new Position(94, 32), new Position(94, 32)),
      new Token("$jitterbit.target.http.ssl_cert_id", TokenType.GlobalIdentifier, new Position(94, 34), new Position(94, 67)),
      new Token("+", TokenType.MathOperator, new Position(95, 1), new Position(95, 1)),
      new Token(" target.http.status_code = ", TokenType.SingleQuoteString, new Position(95, 2), new Position(95, 30)),new Token("+", TokenType.MathOperator, new Position(95, 32), new Position(95, 32)),
      new Token("$jitterbit.target.http.status_code", TokenType.GlobalIdentifier, new Position(95, 34), new Position(95, 67)),
      new Token("+", TokenType.MathOperator, new Position(96, 1), new Position(96, 1)),
      new Token(" target.http.transfer_timeout = ", TokenType.SingleQuoteString, new Position(96, 2), new Position(96, 35)),
      new Token("+", TokenType.MathOperator, new Position(96, 37), new Position(96, 37)),
      new Token("$jitterbit.target.http.transfer_timeout", TokenType.GlobalIdentifier, new Position(96, 39), new Position(96, 77)),
      new Token("+", TokenType.MathOperator, new Position(97, 1), new Position(97, 1)),
      new Token(" target.sftp.ssh_key_id = ", TokenType.SingleQuoteString, new Position(97, 2), new Position(97, 29)),
      new Token("+", TokenType.MathOperator, new Position(97, 31), new Position(97, 31)),
      new Token("$jitterbit.target.sftp.ssh_key_id", TokenType.GlobalIdentifier, new Position(97, 33), new Position(97, 65)),
      new Token("+", TokenType.MathOperator, new Position(98, 1), new Position(98, 1)),
      new Token(" target.text.character_encoding = ", TokenType.SingleQuoteString, new Position(98, 2), new Position(98, 37)),
      new Token("+", TokenType.MathOperator, new Position(98, 39), new Position(98, 39)),
      new Token("$jitterbit.target.text.character_encoding", TokenType.GlobalIdentifier, new Position(98, 41), new Position(98, 81)),
      new Token("+", TokenType.MathOperator, new Position(99, 1), new Position(99, 1)),
      new Token(" target.wave.json = ", TokenType.SingleQuoteString, new Position(99, 2), new Position(99, 23)),
      new Token("+", TokenType.MathOperator, new Position(99, 25), new Position(99, 25)),
      new Token("$jitterbit.target.wave.json", TokenType.GlobalIdentifier, new Position(99, 27), new Position(99, 53)),new Token("+", TokenType.MathOperator, new Position(100, 1), new Position(100, 1)),
      new Token(" target.xml.include_empty_xml = ", TokenType.SingleQuoteString, new Position(100, 2), new Position(100, 35)),
      new Token("+", TokenType.MathOperator, new Position(100, 37), new Position(100, 37)),
      new Token("$jitterbit.target.xml.include_empty_xml", TokenType.GlobalIdentifier, new Position(100, 39), new Position(100, 77)),
      new Token("+", TokenType.MathOperator, new Position(101, 1), new Position(101, 1)),
      new Token(" target.xml.include_null_xml = ", TokenType.SingleQuoteString, new Position(101, 2), new Position(101, 34)),
      new Token("+", TokenType.MathOperator, new Position(101, 36), new Position(101, 36)),
      new Token("$jitterbit.target.xml.include_null_xml", TokenType.GlobalIdentifier, new Position(101, 38), new Position(101, 75)),
      new Token("+", TokenType.MathOperator, new Position(102, 1), new Position(102, 1)),
      new Token(" target.xml.nsprefix = ", TokenType.SingleQuoteString, new Position(102, 2), new Position(102, 26)),
      new Token("+", TokenType.MathOperator, new Position(102, 28), new Position(102, 28)),
      new Token("$jitterbit.target.xml.nsprefix", TokenType.GlobalIdentifier, new Position(102, 30), new Position(102, 59)),
      new Token("+", TokenType.MathOperator, new Position(103, 1), new Position(103, 1)),
      new Token(" target.xml.num_for_bool = ", TokenType.SingleQuoteString, new Position(103, 2), new Position(103, 30)),
      new Token("+", TokenType.MathOperator, new Position(103, 32), new Position(103, 32)),
      new Token("$jitterbit.target.xml.num_for_bool", TokenType.GlobalIdentifier, new Position(103, 34), new Position(103, 67)),
      new Token("+", TokenType.MathOperator, new Position(104, 1), new Position(104, 1)),
      new Token(" target.xml.prettify = ", TokenType.SingleQuoteString, new Position(104, 2), new Position(104, 26)),
      new Token("+", TokenType.MathOperator, new Position(104, 28), new Position(104, 28)),
      new Token("$jitterbit.target.xml.prettify", TokenType.GlobalIdentifier, new Position(104, 30), new Position(104, 59)),
      new Token("+", TokenType.MathOperator, new Position(105, 1), new Position(105, 1)),
      new Token(" text.qualifier_required = ", TokenType.SingleQuoteString, new Position(105, 2), new Position(105, 30)),
      new Token("+", TokenType.MathOperator, new Position(105, 32), new Position(105, 32)),
      new Token("$jitterbit.text.qualifier_required", TokenType.GlobalIdentifier, new Position(105, 34), new Position(105, 67)),
      new Token("+", TokenType.MathOperator, new Position(106, 1), new Position(106, 1)),
      new Token(" transformation.auto_streaming = ", TokenType.SingleQuoteString, new Position(106, 2), new Position(106, 36)),
      new Token("+", TokenType.MathOperator, new Position(106, 38), new Position(106, 38)),
      new Token("$jitterbit.transformation.auto_streaming", TokenType.GlobalIdentifier, new Position(106, 40), new Position(106, 79)),
      new Token("+", TokenType.MathOperator, new Position(107, 1), new Position(107, 1)),
      new Token(" transformation.chunk_number = ", TokenType.SingleQuoteString, new Position(107, 2), new Position(107, 34)),
      new Token("+", TokenType.MathOperator, new Position(107, 36), new Position(107, 36)),
      new Token("$jitterbit.transformation.chunk_number", TokenType.GlobalIdentifier, new Position(107, 38), new Position(107, 75)),
      new Token("+", TokenType.MathOperator, new Position(108, 1), new Position(108, 1)),
      new Token(" transformation.chunking = ", TokenType.SingleQuoteString, new Position(108, 2), new Position(108, 30)),
      new Token("+", TokenType.MathOperator, new Position(108, 32), new Position(108, 32)),
      new Token("$jitterbit.transformation.chunking", TokenType.GlobalIdentifier, new Position(108, 34), new Position(108, 67)),
      new Token("+", TokenType.MathOperator, new Position(109, 1), new Position(109, 1)),
      new Token(" transformation.disable_normalization = ", TokenType.SingleQuoteString, new Position(109, 2), new Position(109, 43)),
      new Token("+", TokenType.MathOperator, new Position(109, 45), new Position(109, 45)),
      new Token("$jitterbit.transformation.disable_normalization", TokenType.GlobalIdentifier, new Position(109, 47), new Position(109, 93)),
      new Token("+", TokenType.MathOperator, new Position(110, 1), new Position(110, 1)),
      new Token(" transformation.jbxmlparser = ", TokenType.SingleQuoteString, new Position(110, 2), new Position(110, 33)),
      new Token("+", TokenType.MathOperator, new Position(110, 35), new Position(110, 35)),
      new Token("$jitterbit.transformation.jbxmlparser", TokenType.GlobalIdentifier, new Position(110, 37), new Position(110, 73)),
      new Token("+", TokenType.MathOperator, new Position(111, 1), new Position(111, 1)),
      new Token(" transformation.name = ", TokenType.SingleQuoteString, new Position(111, 2), new Position(111, 26)),
      new Token("+", TokenType.MathOperator, new Position(111, 28), new Position(111, 28)),
      new Token("$jitterbit.transformation.name", TokenType.GlobalIdentifier, new Position(111, 30), new Position(111, 59)),
      new Token("+", TokenType.MathOperator, new Position(112, 1), new Position(112, 1)),
      new Token(" transformation.source.check_null_characters = ", TokenType.SingleQuoteString, new Position(112, 2), new Position(112, 50)),
      new Token("+", TokenType.MathOperator, new Position(112, 52), new Position(112, 52)),
      new Token("$jitterbit.transformation.source.check_null_characters", TokenType.GlobalIdentifier, new Position(112, 54), new Position(112, 107)),
      new Token("+", TokenType.MathOperator, new Position(113, 1), new Position(113, 1)),
      new Token(" transformation.thread_number = ", TokenType.SingleQuoteString, new Position(113, 2), new Position(113, 35)),
      new Token("+", TokenType.MathOperator, new Position(113, 37), new Position(113, 37)),
      new Token("$jitterbit.transformation.thread_number", TokenType.GlobalIdentifier, new Position(113, 39), new Position(113, 77)),
      new Token("+", TokenType.MathOperator, new Position(114, 1), new Position(114, 1)),
      new Token(" transformation.timing_on = ", TokenType.SingleQuoteString, new Position(114, 2), new Position(114, 31)),
      new Token("+", TokenType.MathOperator, new Position(114, 33), new Position(114, 33)),
      new Token("$jitterbit.transformation.timing_on", TokenType.GlobalIdentifier, new Position(114, 35), new Position(114, 69)),
      new Token("+", TokenType.MathOperator, new Position(115, 1), new Position(115, 1)),
      new Token(" transformation.total_chunks = ", TokenType.SingleQuoteString, new Position(115, 2), new Position(115, 34)),
      new Token("+", TokenType.MathOperator, new Position(115, 36), new Position(115, 36)),
      new Token("$jitterbit.transformation.total_chunks", TokenType.GlobalIdentifier, new Position(115, 38), new Position(115, 75)),
      new Token("+", TokenType.MathOperator, new Position(116, 1), new Position(116, 1)),
      new Token(" transformation.total_threads = ", TokenType.SingleQuoteString, new Position(116, 2), new Position(116, 35)),
      new Token("+", TokenType.MathOperator, new Position(116, 37), new Position(116, 37)),
      new Token("$jitterbit.transformation.total_threads", TokenType.GlobalIdentifier, new Position(116, 39), new Position(116, 77)),
      new Token("+", TokenType.MathOperator, new Position(117, 1), new Position(117, 1)),
      new Token(" transformation.trim_extra_linebreaks = ", TokenType.SingleQuoteString, new Position(117, 2), new Position(117, 43)),
      new Token("+", TokenType.MathOperator, new Position(117, 45), new Position(117, 45)),
      new Token("$jitterbit.transformation.trim_extra_linebreaks", TokenType.GlobalIdentifier, new Position(117, 47), new Position(117, 93)),
      new Token("+", TokenType.MathOperator, new Position(118, 1), new Position(118, 1)),
      new Token(" web_service_call.max_redirs = ", TokenType.SingleQuoteString, new Position(118, 2), new Position(118, 34)),
      new Token("+", TokenType.MathOperator, new Position(118, 36), new Position(118, 36)),
      new Token("$jitterbit.web_service_call.max_redirs", TokenType.GlobalIdentifier, new Position(118, 38), new Position(118, 75)),
      new Token("+", TokenType.MathOperator, new Position(119, 1), new Position(119, 1)),
      new Token(" web_service_call.number_of_retries = ", TokenType.SingleQuoteString, new Position(119, 2), new Position(119, 41)),
      new Token("+", TokenType.MathOperator, new Position(119, 43), new Position(119, 43)),
      new Token("$jitterbit.web_service_call.number_of_retries", TokenType.GlobalIdentifier, new Position(119, 45), new Position(119, 89)),
      new Token("+", TokenType.MathOperator, new Position(120, 1), new Position(120, 1)),
      new Token(" web_service_call.retry_wait_seconds = ", TokenType.SingleQuoteString, new Position(120, 2), new Position(120, 42)),
      new Token("+", TokenType.MathOperator, new Position(120, 44), new Position(120, 44)),
      new Token("$jitterbit.web_service_call.retry_wait_seconds", TokenType.GlobalIdentifier, new Position(120, 46), new Position(120, 91)),
      new Token("+", TokenType.MathOperator, new Position(121, 1), new Position(121, 1)),
      new Token(" web_service_call.ssl_cert_id = ", TokenType.SingleQuoteString, new Position(121, 2), new Position(121, 35)),
      new Token("+", TokenType.MathOperator, new Position(121, 37), new Position(121, 37)),
      new Token("$jitterbit.web_service_call.ssl_cert_id", TokenType.GlobalIdentifier, new Position(121, 39), new Position(121, 77)),
      new Token("+", TokenType.MathOperator, new Position(122, 1), new Position(122, 1)),
      new Token(" web_service_call.status_code = ", TokenType.SingleQuoteString, new Position(122, 2), new Position(122, 35)),
      new Token("+", TokenType.MathOperator, new Position(122, 37), new Position(122, 37)),
      new Token("$jitterbit.web_service_call.status_code", TokenType.GlobalIdentifier, new Position(122, 39), new Position(122, 77)),
      new Token("+", TokenType.MathOperator, new Position(123, 1), new Position(123, 1)),
      new Token(" web_service_call.sync_response = ", TokenType.SingleQuoteString, new Position(123, 2), new Position(123, 37)),
      new Token("+", TokenType.MathOperator, new Position(123, 39), new Position(123, 39)),
      new Token("$jitterbit.web_service_call.sync_response", TokenType.GlobalIdentifier, new Position(123, 41), new Position(123, 81)),
      new Token("+", TokenType.MathOperator, new Position(124, 1), new Position(124, 1)),
      new Token(" web_service_call.time_out = ", TokenType.SingleQuoteString, new Position(124, 2), new Position(124, 32)),
      new Token("+", TokenType.MathOperator, new Position(124, 34), new Position(124, 34)),
      new Token("$jitterbit.web_service_call.time_out", TokenType.GlobalIdentifier, new Position(124, 36), new Position(124, 71)),
      new Token(";", TokenType.Semicolon, new Position(124, 72), new Position(124, 72)),
      new Token("RunScript", TokenType.Identifier, new Position(125, 1), new Position(125, 9)),
      new Token("(", TokenType.OpenParen, new Position(125, 10), new Position(125, 10)),
      new Token("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>", TokenType.DoubleQuoteString, new Position(125, 11), new Position(125, 58)),
      new Token(",", TokenType.Comma, new Position(125, 59), new Position(125, 59)),
      new Token("$jb.log.message", TokenType.GlobalIdentifier, new Position(125, 60), new Position(125, 74)),
      new Token(")", TokenType.CloseParen, new Position(125, 75), new Position(125, 75)),
      new Token(";", TokenType.Semicolon, new Position(125, 76), new Position(125, 76)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(126, 1), new Position(126, 8))
    ]
  },
  {
    script:
`<trans>
// RequestBin...echo request
headers = "Headers: \\r\\n";
enum = $jitterbit.api.request.enum.headers;
i = 0;
while(i<length(enum),
  name = enum[i];
  headers = headers + "$" + name + ": " + Get(name) + " \\r\\n";
  i = i+1;
 );
if(i==0, headers = headers + "(none)\\r\\n");

RunScript("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",headers);
</trans>`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("headers", TokenType.Identifier, new Position(3, 1), new Position(3, 7)),
      new Token("=", TokenType.Assignment, new Position(3, 9), new Position(3, 9)),
      new Token("Headers: \r\n", TokenType.DoubleQuoteString, new Position(3, 11), new Position(3, 25)),
      new Token(";", TokenType.Semicolon, new Position(3, 26), new Position(3, 26)),
      new Token("enum", TokenType.Identifier, new Position(4, 1), new Position(4, 4)),
      new Token("=", TokenType.Assignment, new Position(4, 6), new Position(4, 6)),
      new Token("$jitterbit.api.request.enum.headers", TokenType.GlobalIdentifier, new Position(4, 8), new Position(4, 42)),
      new Token(";", TokenType.Semicolon, new Position(4, 43), new Position(4, 43)),
      new Token("i", TokenType.Identifier, new Position(5, 1), new Position(5, 1)),
      new Token("=", TokenType.Assignment, new Position(5, 3), new Position(5, 3)),
      new Token("0", TokenType.Integer, new Position(5, 5), new Position(5, 5)),
      new Token(";", TokenType.Semicolon, new Position(5, 6), new Position(5, 6)),
      new Token("while", TokenType.Identifier, new Position(6, 1), new Position(6, 5)),
      new Token("(", TokenType.OpenParen, new Position(6, 6), new Position(6, 6)),
      new Token("i", TokenType.Identifier, new Position(6, 7), new Position(6, 7)),
      new Token("<", TokenType.ComparisonOperator, new Position(6, 8), new Position(6, 8)),
      new Token("length", TokenType.Identifier, new Position(6, 9), new Position(6, 14)),
      new Token("(", TokenType.OpenParen, new Position(6, 15), new Position(6, 15)),
      new Token("enum", TokenType.Identifier, new Position(6, 16), new Position(6, 19)),
      new Token(")", TokenType.CloseParen, new Position(6, 20), new Position(6, 20)),
      new Token(",", TokenType.Comma, new Position(6, 21), new Position(6, 21)),
      new Token("name", TokenType.Identifier, new Position(7, 3), new Position(7, 6)),
      new Token("=", TokenType.Assignment, new Position(7, 8), new Position(7, 8)),
      new Token("enum", TokenType.Identifier, new Position(7, 10), new Position(7, 13)),
      new Token("[", TokenType.OpenBracket, new Position(7, 14), new Position(7, 14)),
      new Token("i", TokenType.Identifier, new Position(7, 15), new Position(7, 15)),
      new Token("]", TokenType.CloseBracket, new Position(7, 16), new Position(7, 16)),
      new Token(";", TokenType.Semicolon, new Position(7, 17), new Position(7, 17)),
      new Token("headers", TokenType.Identifier, new Position(8, 3), new Position(8, 9)),
      new Token("=", TokenType.Assignment, new Position(8, 11), new Position(8, 11)),
      new Token("headers", TokenType.Identifier, new Position(8, 13), new Position(8, 19)),
      new Token("+", TokenType.MathOperator, new Position(8, 21), new Position(8, 21)),
      new Token("$", TokenType.DoubleQuoteString, new Position(8, 23), new Position(8, 25)),
      new Token("+", TokenType.MathOperator, new Position(8, 27), new Position(8, 27)),
      new Token("name", TokenType.Identifier, new Position(8, 29), new Position(8, 32)),
      new Token("+", TokenType.MathOperator, new Position(8, 34), new Position(8, 34)),
      new Token(": ", TokenType.DoubleQuoteString, new Position(8, 36), new Position(8, 39)),
      new Token("+", TokenType.MathOperator, new Position(8, 41), new Position(8, 41)),
      new Token("Get", TokenType.Identifier, new Position(8, 43), new Position(8, 45)),
      new Token("(", TokenType.OpenParen, new Position(8, 46), new Position(8, 46)),
      new Token("name", TokenType.Identifier, new Position(8, 47), new Position(8, 50)),
      new Token(")", TokenType.CloseParen, new Position(8, 51), new Position(8, 51)),
      new Token("+", TokenType.MathOperator, new Position(8, 53), new Position(8, 53)),
      new Token(" \r\n", TokenType.DoubleQuoteString, new Position(8, 55), new Position(8, 61)),
      new Token(";", TokenType.Semicolon, new Position(8, 62), new Position(8, 62)),
      new Token("i", TokenType.Identifier, new Position(9, 3), new Position(9, 3)),
      new Token("=", TokenType.Assignment, new Position(9, 5), new Position(9, 5)),
      new Token("i", TokenType.Identifier, new Position(9, 7), new Position(9, 7)),
      new Token("+", TokenType.MathOperator, new Position(9, 8), new Position(9, 8)),
      new Token("1", TokenType.Integer, new Position(9, 9), new Position(9, 9)),
      new Token(";", TokenType.Semicolon, new Position(9, 10), new Position(9, 10)),
      new Token(")", TokenType.CloseParen, new Position(10, 2), new Position(10, 2)),
      new Token(";", TokenType.Semicolon, new Position(10, 3), new Position(10, 3)),
      new Token("if", TokenType.Identifier, new Position(11, 1), new Position(11, 2)),
      new Token("(", TokenType.OpenParen, new Position(11, 3), new Position(11, 3)),
      new Token("i", TokenType.Identifier, new Position(11, 4), new Position(11, 4)),
      new Token("==", TokenType.ComparisonOperator, new Position(11, 5), new Position(11, 6)),
      new Token("0", TokenType.Integer, new Position(11, 7), new Position(11, 7)),
      new Token(",", TokenType.Comma, new Position(11, 8), new Position(11, 8)),
      new Token("headers", TokenType.Identifier, new Position(11, 10), new Position(11, 16)),
      new Token("=", TokenType.Assignment, new Position(11, 18), new Position(11, 18)),
      new Token("headers", TokenType.Identifier, new Position(11, 20), new Position(11, 26)),
      new Token("+", TokenType.MathOperator, new Position(11, 28), new Position(11, 28)),
      new Token("(none)\r\n", TokenType.DoubleQuoteString, new Position(11, 30), new Position(11, 41)),
      new Token(")", TokenType.CloseParen, new Position(11, 42), new Position(11, 42)),
      new Token(";", TokenType.Semicolon, new Position(11, 43), new Position(11, 43)),
      new Token("RunScript", TokenType.Identifier, new Position(13, 1), new Position(13, 9)),
      new Token("(", TokenType.OpenParen, new Position(13, 10), new Position(13, 10)),
      new Token("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>", TokenType.DoubleQuoteString, new Position(13, 11), new Position(13, 58)),
      new Token(",", TokenType.Comma, new Position(13, 59), new Position(13, 59)),
      new Token("headers", TokenType.Identifier, new Position(13, 60), new Position(13, 66)),
      new Token(")", TokenType.CloseParen, new Position(13, 67), new Position(13, 67)),
      new Token(";", TokenType.Semicolon, new Position(13, 68), new Position(13, 68)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(14, 1), new Position(14, 8))
    ]
  },
  {
    script:
`<trans>
/*************************************************************************************************************
SCRIPT DATE 23/Feb/2020
AUTHOR:
HELP URL:
DESCRIPTION:
*************************************************************************************************************/
work=ToLower($jitterbit.api.request.headers.Accept);
case(
    work=='application/json',
        $jb.core.operation.contentType='json';
        $jitterbit.api.response.headers.Content_Type="application/json",
    work=='application/xml',
        $jb.core.operation.contentType='xml';
        $jitterbit.api.response.headers.Content_Type="application/xml",
    work=='text/html',
        $jb.core.operation.contentType='json';
        $jitterbit.api.response.headers.Content_Type="text/html",
    true,
        $jb.core.operation.contentType='xml';
        $jitterbit.api.response.headers.Content_Type="application/xml"
);
</trans>`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("work", TokenType.Identifier, new Position(8, 1), new Position(8, 4)),
      new Token("=", TokenType.Assignment, new Position(8, 5), new Position(8, 5)),
      new Token("ToLower", TokenType.Identifier, new Position(8, 6), new Position(8, 12)),
      new Token("(", TokenType.OpenParen, new Position(8, 13), new Position(8, 13)),
      new Token("$jitterbit.api.request.headers.Accept", TokenType.GlobalIdentifier, new Position(8, 14), new Position(8, 50)),
      new Token(")", TokenType.CloseParen, new Position(8, 51), new Position(8, 51)),
      new Token(";", TokenType.Semicolon, new Position(8, 52), new Position(8, 52)),
      new Token("case", TokenType.Identifier, new Position(9, 1), new Position(9, 4)),
      new Token("(", TokenType.OpenParen, new Position(9, 5), new Position(9, 5)),
      new Token("work", TokenType.Identifier, new Position(10, 5), new Position(10, 8)),
      new Token("==", TokenType.ComparisonOperator, new Position(10, 9), new Position(10, 10)),
      new Token("application/json", TokenType.SingleQuoteString, new Position(10, 11), new Position(10, 28)),
      new Token(",", TokenType.Comma, new Position(10, 29), new Position(10, 29)),
      new Token("$jb.core.operation.contentType", TokenType.GlobalIdentifier, new Position(11, 9), new Position(11, 38)),
      new Token("=", TokenType.Assignment, new Position(11, 39), new Position(11, 39)),
      new Token("json", TokenType.SingleQuoteString, new Position(11, 40), new Position(11, 45)),
      new Token(";", TokenType.Semicolon, new Position(11, 46), new Position(11, 46)),
      new Token("$jitterbit.api.response.headers.Content_Type", TokenType.GlobalIdentifier, new Position(12, 9), new Position(12, 52)),
      new Token("=", TokenType.Assignment, new Position(12, 53), new Position(12, 53)),
      new Token("application/json", TokenType.DoubleQuoteString, new Position(12, 54), new Position(12, 71)),
      new Token(",", TokenType.Comma, new Position(12, 72), new Position(12, 72)),
      new Token("work", TokenType.Identifier, new Position(13, 5), new Position(13, 8)),
      new Token("==", TokenType.ComparisonOperator, new Position(13, 9), new Position(13, 10)),
      new Token("application/xml", TokenType.SingleQuoteString, new Position(13, 11), new Position(13, 27)),
      new Token(",", TokenType.Comma, new Position(13, 28), new Position(13, 28)),
      new Token("$jb.core.operation.contentType", TokenType.GlobalIdentifier, new Position(14, 9), new Position(14, 38)),
      new Token("=", TokenType.Assignment, new Position(14, 39), new Position(14, 39)),
      new Token("xml", TokenType.SingleQuoteString, new Position(14, 40), new Position(14, 44)),
      new Token(";", TokenType.Semicolon, new Position(14, 45), new Position(14, 45)),
      new Token("$jitterbit.api.response.headers.Content_Type", TokenType.GlobalIdentifier, new Position(15, 9), new Position(15, 52)),
      new Token("=", TokenType.Assignment, new Position(15, 53), new Position(15, 53)),
      new Token("application/xml", TokenType.DoubleQuoteString, new Position(15, 54), new Position(15, 70)),
      new Token(",", TokenType.Comma, new Position(15, 71), new Position(15, 71)),
      new Token("work", TokenType.Identifier, new Position(16, 5), new Position(16, 8)),
      new Token("==", TokenType.ComparisonOperator, new Position(16, 9), new Position(16, 10)),
      new Token("text/html", TokenType.SingleQuoteString, new Position(16, 11), new Position(16, 21)),
      new Token(",", TokenType.Comma, new Position(16, 22), new Position(16, 22)),
      new Token("$jb.core.operation.contentType", TokenType.GlobalIdentifier, new Position(17, 9), new Position(17, 38)),
      new Token("=", TokenType.Assignment, new Position(17, 39), new Position(17, 39)),
      new Token("json", TokenType.SingleQuoteString, new Position(17, 40), new Position(17, 45)),
      new Token(";", TokenType.Semicolon, new Position(17, 46), new Position(17, 46)),
      new Token("$jitterbit.api.response.headers.Content_Type", TokenType.GlobalIdentifier, new Position(18, 9), new Position(18, 52)),
      new Token("=", TokenType.Assignment, new Position(18, 53), new Position(18, 53)),
      new Token("text/html", TokenType.DoubleQuoteString, new Position(18, 54), new Position(18, 64)),
      new Token(",", TokenType.Comma, new Position(18, 65), new Position(18, 65)),
      new Token("true", TokenType.True, new Position(19, 5), new Position(19, 8)),
      new Token(",", TokenType.Comma, new Position(19, 9), new Position(19, 9)),
      new Token("$jb.core.operation.contentType", TokenType.GlobalIdentifier, new Position(20, 9), new Position(20, 38)),
      new Token("=", TokenType.Assignment, new Position(20, 39), new Position(20, 39)),
      new Token("xml", TokenType.SingleQuoteString, new Position(20, 40), new Position(20, 44)),
      new Token(";", TokenType.Semicolon, new Position(20, 45), new Position(20, 45)),
      new Token("$jitterbit.api.response.headers.Content_Type", TokenType.GlobalIdentifier, new Position(21, 9), new Position(21, 52)),
      new Token("=", TokenType.Assignment, new Position(21, 53), new Position(21, 53)),
      new Token("application/xml", TokenType.DoubleQuoteString, new Position(21, 54), new Position(21, 70)),
      new Token(")", TokenType.CloseParen, new Position(22, 1), new Position(22, 1)),
      new Token(";", TokenType.Semicolon, new Position(22, 2), new Position(22, 2)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(23, 1), new Position(23, 8))
    ]
  },
  {
    script:
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
</trans>`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("$jb.postgres.db.tableName", TokenType.GlobalIdentifier, new Position(12, 1), new Position(12, 25)),
      new Token("=", TokenType.Assignment, new Position(12, 27), new Position(12, 27)),
      new Token("sdfsf", TokenType.SingleQuoteString, new Position(12, 29), new Position(12, 35)),
      new Token(";", TokenType.Semicolon, new Position(12, 36), new Position(12, 36)),
      new Token("If", TokenType.Identifier, new Position(14, 1), new Position(14, 2)),
      new Token("(", TokenType.OpenParen, new Position(14, 3), new Position(14, 3)),
      new Token("Length", TokenType.Identifier, new Position(14, 4), new Position(14, 9)),
      new Token("(", TokenType.OpenParen, new Position(14, 10), new Position(14, 10)),
      new Token("$jb.postgres.db.tableName", TokenType.GlobalIdentifier, new Position(14, 11), new Position(14, 35)),  
      new Token(")", TokenType.CloseParen, new Position(14, 36), new Position(14, 36)),
      new Token("==", TokenType.ComparisonOperator, new Position(14, 38), new Position(14, 39)),
      new Token("0", TokenType.Integer, new Position(14, 41), new Position(14, 41)),
      new Token(",", TokenType.Comma, new Position(15, 5), new Position(15, 5)),
      new Token("RaiseError", TokenType.Identifier, new Position(16, 9), new Position(16, 18)),
      new Token("(", TokenType.OpenParen, new Position(16, 19), new Position(16, 19)),
      new Token("jb.postgres.db.tableName is empty", TokenType.SingleQuoteString, new Position(16, 20), new Position(16, 54)),
      new Token(")", TokenType.CloseParen, new Position(16, 55), new Position(16, 55)),
      new Token(",", TokenType.Comma, new Position(17, 5), new Position(17, 5)),
      new Token("sql_str", TokenType.Identifier, new Position(18, 9), new Position(18, 15)),
      new Token("=", TokenType.Assignment, new Position(18, 17), new Position(18, 17)),
      new Token("SELECT '", TokenType.DoubleQuoteString, new Position(18, 19), new Position(18, 28)),
      new Token("+", TokenType.MathOperator, new Position(18, 29), new Position(18, 29)),
      new Token("$jb.postgres.db.tableName", TokenType.GlobalIdentifier, new Position(18, 30), new Position(18, 54)),  
      new Token("+", TokenType.MathOperator, new Position(18, 55), new Position(18, 55)),
      new Token("'::regclass", TokenType.DoubleQuoteString, new Position(18, 56), new Position(18, 68)),
      new Token(";", TokenType.Semicolon, new Position(18, 69), new Position(18, 69)),
      new Token("RunScript", TokenType.Identifier, new Position(19, 9), new Position(19, 17)),
      new Token("(", TokenType.OpenParen, new Position(19, 18), new Position(19, 18)),
      new Token("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>", TokenType.DoubleQuoteString, new Position(19, 19), new Position(19, 66)),
      new Token(",", TokenType.Comma, new Position(19, 67), new Position(19, 67)),
      new Token("sql_str", TokenType.Identifier, new Position(19, 68), new Position(19, 74)),
      new Token(")", TokenType.CloseParen, new Position(19, 75), new Position(19, 75)),
      new Token(";", TokenType.Semicolon, new Position(19, 76), new Position(19, 76)),
      new Token("Eval", TokenType.Identifier, new Position(20, 9), new Position(20, 12)),
      new Token("(", TokenType.OpenParen, new Position(20, 13), new Position(20, 13)),
      new Token("DbExecute", TokenType.Identifier, new Position(20, 14), new Position(20, 22)),
      new Token("(", TokenType.OpenParen, new Position(20, 23), new Position(20, 23)),
      new Token("<TAG>Sources/jitterbit/postgres/jb.postgres.jdbc</TAG>", TokenType.DoubleQuoteString, new Position(20, 24), new Position(20, 79)),
      new Token(",", TokenType.Comma, new Position(20, 80), new Position(20, 80)),
      new Token("sql_str", TokenType.Identifier, new Position(20, 81), new Position(20, 87)),
      new Token(")", TokenType.CloseParen, new Position(20, 88), new Position(20, 88)),
      new Token(",", TokenType.Comma, new Position(20, 89), new Position(20, 89)),
      new Token("DebugBreak", TokenType.Identifier, new Position(20, 90), new Position(20, 99)),
      new Token("(", TokenType.OpenParen, new Position(20, 100), new Position(20, 100)),
      new Token(")", TokenType.CloseParen, new Position(20, 101), new Position(20, 101)),
      new Token(";", TokenType.Semicolon, new Position(20, 102), new Position(20, 102)),
      new Token("RaiseError", TokenType.Identifier, new Position(20, 103), new Position(20, 112)),
      new Token("(", TokenType.OpenParen, new Position(20, 113), new Position(20, 113)),
      new Token("GetLastError", TokenType.Identifier, new Position(20, 114), new Position(20, 125)),
      new Token("(", TokenType.OpenParen, new Position(20, 126), new Position(20, 126)),
      new Token(")", TokenType.CloseParen, new Position(20, 127), new Position(20, 127)),
      new Token(")", TokenType.CloseParen, new Position(20, 128), new Position(20, 128)),
      new Token(")", TokenType.CloseParen, new Position(20, 129), new Position(20, 129)),
      new Token(";", TokenType.Semicolon, new Position(20, 130), new Position(20, 130)),
      new Token(")", TokenType.CloseParen, new Position(23, 1), new Position(23, 1)),
      new Token(";", TokenType.Semicolon, new Position(23, 2), new Position(23, 2)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(24, 1), new Position(24, 8))
    ]
  },
  {
    script:
`13 ^ 2;
<trans>
</trans>`,
    tokens: [
      new Token("13", TokenType.Integer, new Position(1, 1), new Position(1, 2)),
      new Token("^", TokenType.MathOperator, new Position(1, 4), new Position(1, 4)),
      new Token("2", TokenType.Integer, new Position(1, 6), new Position(1, 6)),
      new Token(";", TokenType.Semicolon, new Position(1, 7), new Position(1, 7)),
      new Token("<trans>", TokenType.OpenTransTag, new Position(2, 1), new Position(2, 7)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(3, 1), new Position(3, 8))
    ]
  },
  {
    script:
`<trans>
"something";
</trans>
// look we're out of scope
"something out of scope"`,
    tokens: [
      new Token("<trans>", TokenType.OpenTransTag, new Position(1, 1), new Position(1, 7)),
      new Token("something", TokenType.DoubleQuoteString, new Position(2, 1), new Position(2, 11)),
      new Token(";", TokenType.Semicolon, new Position(2, 12), new Position(2, 12)),
      new Token("</trans>", TokenType.CloseTransTag, new Position(3, 1), new Position(3, 8)),
      new Token("something out of scope", TokenType.DoubleQuoteString, new Position(5, 1), new Position(5, 24))
    ]
  },
];

describe('Lexer', function() {
  test.each(tests)('Tokenization', function(test: LexerTest) {
    const tokens = Lexer.tokenize(test.script);
    expect(tokens).toStrictEqual(test.tokens);
  });
});
