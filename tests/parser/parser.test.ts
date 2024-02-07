import Parser from "../../src/frontend/parser";
import { 
  AssignmentExpr,
  BinaryExpr,
  BlockExpr,
  BooleanLiteral,
  CallExpr,
  GlobalIdentifier,
  Identifier,
  MemberExpr,
  NumericLiteral,
  Program,
  StringLiteral,
  UnaryExpr
} from "../../src/frontend/ast";
import { makeAST } from "../utils";
import { Position, Token, TokenType } from "../../src/frontend/types";
import { ParserError } from "../../src/errors";

type ParserTest = {script: string, ast: Program};

const parser = new Parser();
const astTests: ParserTest[] = [
  {
    script: `<trans> </trans>`,
    ast: makeAST([])
  },
  {
    script:
`<trans>
  /* this is a comment
  comments dont make it to token list*/
  result = Null();
</trans>`,
    ast: makeAST([
      new AssignmentExpr(
        new Identifier("result"),
        new CallExpr(
          [],
          new Identifier("Null")
        ),
        new Token("=", TokenType.Assignment, new Position(4, 10), new Position(4, 10)))
    ])
  },
  {
    script:
`<trans>
  // test for Round function
  result = Round(123.123456789, -7.7);
  DebugBreak();

</trans>
`,
    ast: makeAST([
      new AssignmentExpr(
        new Identifier("result"),
        new CallExpr(
          [
            new NumericLiteral(123.123456789),
            new UnaryExpr(new NumericLiteral(7.7), "-", true)
          ],
          new Identifier("Round")),
        new Token("=", TokenType.Assignment, new Position(3, 10), new Position(3, 10))
      ),
      new CallExpr([], new Identifier("DebugBreak"))
    ])
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
    ast: makeAST([
      new CallExpr([], new Identifier("DebugBreak")),
      new AssignmentExpr(new Identifier("sendEmail"), new BooleanLiteral(false), new Token("=", TokenType.Assignment, new Position(3, 11), new Position(3, 11))),
      new AssignmentExpr(new GlobalIdentifier("$jb.cache.expirationSeconds", "global"), new NumericLiteral(2592000), new Token("=", TokenType.Assignment, new Position(7, 29), new Position(7, 29))),
      new AssignmentExpr(new GlobalIdentifier("$jb.cache.scope.justProject", "global"), new BooleanLiteral(true), new Token("=", TokenType.Assignment, new Position(8, 29), new Position(8, 29))),
      new AssignmentExpr(
        new GlobalIdentifier("$jb.cache.value", "global"),
        new CallExpr([], new Identifier("Null")),
        new Token("=", TokenType.Assignment, new Position(9, 17), new Position(9, 17))
      ),
      new AssignmentExpr(
        new GlobalIdentifier("$jb.cache.name", "global"),
        new BinaryExpr(
          new GlobalIdentifier("$jitterbit.operation.name", "system"),
          new StringLiteral("-SendEmailMessage"),
          "+"
        ),
        new Token("=", TokenType.Assignment, new Position(10, 16), new Position(10, 16))
      ),
      new CallExpr(
        [
          new UnaryExpr(
            new CallExpr(
              [new StringLiteral("<TAG>Operations/jitterbit/core/jb.core.cache.read</TAG>")],
              new Identifier("RunOperation")
            ),
            "!",
            true
          ),
          new CallExpr(
            [new CallExpr([], new Identifier("GetLastError"))],
            new Identifier("RaiseError")
          )
        ],
        new Identifier("If")
      ),
      new CallExpr([], new Identifier("DebugBreak")),
      new CallExpr(
        [
          new BinaryExpr(
            new CallExpr([new GlobalIdentifier("$jb.cache.value", "global")], new Identifier("Length")),
            new NumericLiteral(0),
            "=="
          ),
          new AssignmentExpr(
            new Identifier("sendEmail"),
            new BooleanLiteral(true),
            new Token("=", TokenType.Assignment, new Position(17, 19), new Position(17, 19))
          ),
          new BlockExpr([
            new AssignmentExpr(
              new Identifier("date"),
              new CallExpr(
                [
                  new StringLiteral("dd"),
                  new NumericLiteral(1),
                  new GlobalIdentifier("$jb.cache.value", "global")
                ],
                new Identifier("DateAdd")
              ),
              new Token("=", TokenType.Assignment, new Position(19, 14), new Position(19, 14))
            ),
            new CallExpr(
              [
                new BinaryExpr(
                  new Identifier("date"),
                  new CallExpr([], new Identifier("Now")),
                  "<"
                ),
                new AssignmentExpr(
                  new Identifier("sendEmail"),
                  new BooleanLiteral(true),
                  new Token("=", TokenType.Assignment, new Position(20, 35), new Position(20, 35))
                )
              ],
              new Identifier("If")
            )
          ])
        ],
        new Identifier("If")
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new Identifier("sendEmail"),
            new BooleanLiteral(true),
            "=="
          ),
          new BlockExpr([
            new CallExpr(
              [new StringLiteral("<TAG>Email Messages/jitterbit/core/jb.core.email</TAG>")],
              new Identifier("SendEmailMessage")
            ),
            new AssignmentExpr(
              new GlobalIdentifier("$jb.cache.value", "global"),
              new CallExpr([], new Identifier("Now")),
              new Token("=", TokenType.Assignment, new Position(27, 25), new Position(27, 25))
            ),
            new CallExpr(
              [
                new UnaryExpr(
                  new CallExpr(
                    [new StringLiteral("<TAG>Operations/jitterbit/core/jb.core.cache.write</TAG>")],
                    new Identifier("RunOperation")
                  ),
                  "!",
                  true
                ),
                new CallExpr(
                  [new CallExpr([], new Identifier("GetLastError"))],
                  new Identifier("RaiseError")
                )
              ],
              new Identifier("If")
            )
          ])
        ],
        new Identifier("If")
      ),
      new CallExpr([], new Identifier("DebugBreak"))
    ])
  },
  {
    script:
`<trans>
$jb.log.message=' api.request.body = ' + $jitterbit.api.request.body
+' api.request.enum.body = ' + $jitterbit.api.request.enum.body
+' api.request.enum.headers = ' + $jitterbit.api.request.enum.headers
+' api.request.enum.parameters = ' + $jitterbit.api.request.enum.parameters
+' api.request.headers.fulluri = ' + $jitterbit.api.request.headers.fulluri;
RunScript("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",$jb.log.message);
</trans>`,
    ast: makeAST([
      new AssignmentExpr(
        new GlobalIdentifier("$jb.log.message", "global"),
        new BinaryExpr(
          new BinaryExpr(
            new BinaryExpr(
              new BinaryExpr(
                new BinaryExpr(
                  new BinaryExpr(
                    new BinaryExpr(
                      new BinaryExpr(
                        new BinaryExpr(
                          new StringLiteral(" api.request.body = "),
                          new GlobalIdentifier("$jitterbit.api.request.body", "system"),
                          "+"
                        ),
                        new StringLiteral(" api.request.enum.body = "),
                        "+"
                      ),
                      new GlobalIdentifier("$jitterbit.api.request.enum.body", "system"),
                      "+"
                    ),
                    new StringLiteral(" api.request.enum.headers = "),
                    "+"
                  ),
                  new GlobalIdentifier("$jitterbit.api.request.enum.headers", "system"),
                  "+"
                ),
                new StringLiteral(" api.request.enum.parameters = "),
                "+"
              ),
              new GlobalIdentifier("$jitterbit.api.request.enum.parameters", "system"),
              "+"
            ),
            new StringLiteral(" api.request.headers.fulluri = "),
            "+"
          ),
          new GlobalIdentifier("$jitterbit.api.request.headers.fulluri", "system"),
          "+"
        ),
        new Token("=", TokenType.Assignment, new Position(2, 16), new Position(2, 16))
      ),
      new CallExpr(
        [
          new StringLiteral("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>"),
          new GlobalIdentifier("$jb.log.message", "global")
        ],
        new Identifier("RunScript")
      )
    ])
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
    ast: makeAST([
      new AssignmentExpr(
        new Identifier("headers"),
        new StringLiteral("Headers: \r\n"),
        new Token("=", TokenType.Assignment, new Position(3, 9), new Position(3, 9))
      ),
      new AssignmentExpr(
        new Identifier("enum"),
        new GlobalIdentifier("$jitterbit.api.request.enum.headers", "system"),
        new Token("=", TokenType.Assignment, new Position(4, 6), new Position(4, 6))
      ),
      new AssignmentExpr(
        new Identifier("i"),
        new NumericLiteral(0),
        new Token("=", TokenType.Assignment, new Position(5, 3), new Position(5, 3))
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new Identifier("i"),
            new CallExpr([new Identifier("enum")], new Identifier("length")),
            "<"
          ),
          new BlockExpr([
            new AssignmentExpr(
              new Identifier("name"),
              new MemberExpr(
                new Identifier("enum"),
                new Identifier("i")
              ),
              new Token("=", TokenType.Assignment, new Position(7, 8), new Position(7, 8))
            ),
            new AssignmentExpr(
              new Identifier("headers"),
              new BinaryExpr(
                new BinaryExpr(
                  new BinaryExpr(
                    new BinaryExpr(
                      new BinaryExpr(
                        new Identifier("headers"),
                        new StringLiteral("$"),
                        "+"
                      ),
                      new Identifier("name"),
                      "+"
                    ),
                    new StringLiteral(": "),
                    "+"
                  ),
                  new CallExpr([new Identifier("name")], new Identifier("Get")),
                  "+"
                ),
                new StringLiteral(" \r\n"),
                "+"
              ),
              new Token("=", TokenType.Assignment, new Position(8, 11), new Position(8, 11))
            ),
            new AssignmentExpr(
              new Identifier("i"),
              new BinaryExpr(
                new Identifier("i"),
                new NumericLiteral(1),
                "+"
              ),
              new Token("=", TokenType.Assignment, new Position(9, 5), new Position(9, 5))
            )
          ])
        ],
        new Identifier("while")
      ),
      new CallExpr(
        [
          new BinaryExpr(new Identifier("i"), new NumericLiteral(0), "=="),
          new AssignmentExpr(
            new Identifier("headers"),
            new BinaryExpr(
              new Identifier("headers"),
              new StringLiteral("(none)\r\n"),
              "+"
            ),
            new Token("=", TokenType.Assignment, new Position(11, 18), new Position(11, 18))
          )
        ],
        new Identifier("if")
      ),
      new CallExpr(
        [
          new StringLiteral("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>"),
          new Identifier("headers")
        ],
        new Identifier("RunScript")
      )
    ])
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
    ast: makeAST([
      new AssignmentExpr(
        new Identifier("work"),
        new CallExpr(
          [new GlobalIdentifier("$jitterbit.api.request.headers.Accept", "system")],
          new Identifier("ToLower")
        ),
        new Token("=", TokenType.Assignment, new Position(8, 5), new Position(8, 5))
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new Identifier("work"),
            new StringLiteral("application/json"),
            "=="
          ),
          new BlockExpr([
            new AssignmentExpr(
              new GlobalIdentifier("$jb.core.operation.contentType", "global"),
              new StringLiteral("json"),
              new Token("=", TokenType.Assignment, new Position(11, 39), new Position(11, 39))
            ),
            new AssignmentExpr(
              new GlobalIdentifier("$jitterbit.api.response.headers.Content_Type", "system"),
              new StringLiteral("application/json"),
              new Token("=", TokenType.Assignment, new Position(12, 53), new Position(12, 53))
            )
          ]),
          new BinaryExpr(
            new Identifier("work"),
            new StringLiteral("application/xml"),
            "=="
          ),
          new BlockExpr([
            new AssignmentExpr(
              new GlobalIdentifier("$jb.core.operation.contentType", "global"),
              new StringLiteral("xml"),
              new Token("=", TokenType.Assignment, new Position(14, 39), new Position(14, 39))
            ),
            new AssignmentExpr(
              new GlobalIdentifier("$jitterbit.api.response.headers.Content_Type", "system"),
              new StringLiteral("application/xml"),
              new Token("=", TokenType.Assignment, new Position(15, 53), new Position(15, 53))
            )
          ]),
          new BinaryExpr(
            new Identifier("work"),
            new StringLiteral("text/html"),
            "=="
          ),
          new BlockExpr([
            new AssignmentExpr(
              new GlobalIdentifier("$jb.core.operation.contentType", "global"),
              new StringLiteral("json"),
              new Token("=", TokenType.Assignment, new Position(17, 39), new Position(17, 39))
            ),
            new AssignmentExpr(
              new GlobalIdentifier("$jitterbit.api.response.headers.Content_Type", "system"),
              new StringLiteral("text/html"),
              new Token("=", TokenType.Assignment, new Position(18, 53), new Position(18, 53))
            )
          ]),
          new BooleanLiteral(true),
          new BlockExpr([
            new AssignmentExpr(
              new GlobalIdentifier("$jb.core.operation.contentType", "global"),
              new StringLiteral("xml"),
              new Token("=", TokenType.Assignment, new Position(20, 39), new Position(20, 39))
            ),
            new AssignmentExpr(
              new GlobalIdentifier("$jitterbit.api.response.headers.Content_Type", "system"),
              new StringLiteral("application/xml"),
              new Token("=", TokenType.Assignment, new Position(21, 53), new Position(21, 53))
            )
          ]),
        ],
        new Identifier("case")
      )
    ])
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
    ast: makeAST([
      new AssignmentExpr(
        new GlobalIdentifier("$jb.postgres.db.tableName", "global"),
        new StringLiteral("sdfsf"),
        new Token("=", TokenType.Assignment, new Position(12, 27), new Position(12, 27))
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new CallExpr(
              [new GlobalIdentifier("$jb.postgres.db.tableName", "global")],
              new Identifier("Length")
            ),
            new NumericLiteral(0),
            "=="
          ),
          new CallExpr(
            [new StringLiteral("jb.postgres.db.tableName is empty")],
            new Identifier("RaiseError")
          ),
          new BlockExpr([
            new AssignmentExpr(
              new Identifier("sql_str"),
              new BinaryExpr(
                new BinaryExpr(
                  new StringLiteral("SELECT '"),
                  new GlobalIdentifier("$jb.postgres.db.tableName", "global"),
                  "+"
                ),
                new StringLiteral("'::regclass"),
                "+"
              ),
              new Token("=", TokenType.Assignment, new Position(18, 17), new Position(18, 17))
            ),
            new CallExpr(
              [
                new StringLiteral("<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>"),
                new Identifier("sql_str")
              ],
              new Identifier("RunScript")
            ),
            new CallExpr(
              [
                new CallExpr(
                  [
                    new StringLiteral("<TAG>Sources/jitterbit/postgres/jb.postgres.jdbc</TAG>"),
                    new Identifier("sql_str")
                  ],
                  new Identifier("DbExecute")
                ),
                new BlockExpr([
                  new CallExpr([], new Identifier("DebugBreak")),
                  new CallExpr(
                    [new CallExpr([], new Identifier("GetLastError"))],
                    new Identifier("RaiseError")
                  )
                ])
              ],
              new Identifier("Eval")
            )
          ])
        ],
        new Identifier("If")
      )
    ])
  },
  {
    script:
`13 ^ 2;
<trans>
</trans>`,
    ast: makeAST([])
  },
  {
    script: 
`<trans>
"something";
</trans>
// look we're out of scope
"something out of scope"`,
    ast: makeAST([new StringLiteral("something")])
  },
];

describe('Parser', function() {
  test.each(astTests)('AST construction', function(test: ParserTest) {
    const ast = parser.parse(test.script);
    expect(ast).toStrictEqual(test.ast);
  });

  describe('Error handling', function() {
    test('Unary operator injection', function() {
      const script = `<trans>"!"false</trans>`;
      expect(function() { parser.parse(script) }).toThrow(ParserError);
    });
  
    test('Binary operator injection', function() {
      const script = `<trans>wannabeNumber "=" 13; WriteToOperationLog(wannabeNumber)</trans>`;
      expect(function() { parser.parse(script) }).toThrow(ParserError);
    });

    test('Missing semicolon - top-level expressions', function() {
      const script =
      `<trans>
        wannabeNumber = 13
        WriteToOperationLog(wannabeNumber)
      </trans>`;
      expect(function() { parser.parse(script) }).toThrow(ParserError);
    });

    test('Missing semicolon - call expression blocks', function() {
      const script =
      `<trans>
        If(true,
          var1 = "some value",
          var2 = "some other value"
          WriteToOperationLog(var2);
        )
      </trans>`;
      expect(function() { parser.parse(script) }).toThrow(ParserError);
    });
  });
});
