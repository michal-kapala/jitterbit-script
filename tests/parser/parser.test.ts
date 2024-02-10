import Parser from "../../src/frontend/parser";
import { 
  AssignmentExpr,
  BinaryExpr,
  BlockExpr,
  BooleanLiteral,
  CallExpr,
  FunctionIdentifier,
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
        new Identifier(
          new Token("result", TokenType.Identifier, new Position(4, 3), new Position(4, 8))
        ),
        new CallExpr(
          [],
          new FunctionIdentifier(
            new Token("Null", TokenType.Identifier, new Position(4, 12), new Position(4, 15))
          ),
          new Position(4, 17)
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
        new Identifier(
          new Token("result", TokenType.DoubleQuoteString, new Position(3, 3), new Position(3, 8))
        ),
        new CallExpr(
          [
            new NumericLiteral(
              new Token("123.123456789", TokenType.Float, new Position(3, 18), new Position(3, 30))
            ),
            new UnaryExpr(
              new NumericLiteral(new Token("7.7", TokenType.Float, new Position(3, 34), new Position(3, 36))),
              new Token("-", TokenType.Minus, new Position(3, 33), new Position(3, 33)),
              true
            )
          ],
          new FunctionIdentifier(new Token("Round", TokenType.Identifier, new Position(3, 12), new Position(3, 16))),
          new Position(3, 37)
        ),
        new Token("=", TokenType.Assignment, new Position(3, 10), new Position(3, 10))
      ),
      new CallExpr(
        [],
        new FunctionIdentifier(
          new Token("DebugBreak", TokenType.Identifier, new Position(4, 3), new Position(4, 12))
        ),
        new Position(4, 14)
      )
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
      new CallExpr(
        [],
        new FunctionIdentifier(
          new Token("DebugBreak", TokenType.Identifier, new Position(2, 1), new Position(2, 10))
        ),
        new Position(2, 12)
      ),
      new AssignmentExpr(
        new Identifier(
          new Token("sendEmail", TokenType.Identifier, new Position(3, 1), new Position(3, 9))
        ),
        new BooleanLiteral(
          false,
          new Token("false", TokenType.False, new Position(3, 13), new Position(3, 17))
        ),
        new Token("=", TokenType.Assignment, new Position(3, 11), new Position(3, 11))
      ),
      new AssignmentExpr(
        new GlobalIdentifier(
          new Token("$jb.cache.expirationSeconds", TokenType.GlobalIdentifier, new Position(7, 1), new Position(7, 27)),
          "global"
        ),
        new NumericLiteral(new Token("2592000", TokenType.Integer, new Position(7, 31), new Position(7, 37))),
        new Token("=", TokenType.Assignment, new Position(7, 29), new Position(7, 29))
      ),
      new AssignmentExpr(
        new GlobalIdentifier(
          new Token("$jb.cache.scope.justProject", TokenType.GlobalIdentifier, new Position(8, 1), new Position(8, 27)),
          "global"
        ),
        new BooleanLiteral(
          true,
          new Token("true", TokenType.True, new Position(8, 31), new Position(8, 34))
        ),
        new Token("=", TokenType.Assignment, new Position(8, 29), new Position(8, 29))
      ),
      new AssignmentExpr(
        new GlobalIdentifier(
          new Token("$jb.cache.value", TokenType.GlobalIdentifier, new Position(9, 1), new Position(9, 15)),
          "global"
        ),
        new CallExpr(
          [],
          new FunctionIdentifier(new Token("Null", TokenType.Identifier, new Position(9, 19), new Position(9, 22))),
          new Position(9, 24)
        ),
        new Token("=", TokenType.Assignment, new Position(9, 17), new Position(9, 17))
      ),
      new AssignmentExpr(
        new GlobalIdentifier(
          new Token("$jb.cache.name", TokenType.GlobalIdentifier, new Position(10, 1), new Position(10, 14)),
          "global"
        ),
        new BinaryExpr(
          new GlobalIdentifier(
            new Token("$jitterbit.operation.name", TokenType.GlobalIdentifier, new Position(10, 18), new Position(10, 42)),
            "system"
          ),
          new StringLiteral(
            new Token("-SendEmailMessage", TokenType.SingleQuoteString, new Position(10, 44), new Position(10, 62))
          ),
          "+"
        ),
        new Token("=", TokenType.Assignment, new Position(10, 16), new Position(10, 16))
      ),
      new CallExpr(
        [
          new UnaryExpr(
            new CallExpr(
              [
                new StringLiteral(
                  new Token(
                    "<TAG>Operations/jitterbit/core/jb.core.cache.read</TAG>",
                    TokenType.DoubleQuoteString,
                    new Position(11, 18),
                    new Position(11, 74)
                  )
                )
              ],
              new FunctionIdentifier(
                new Token(
                  "RunOperation",
                  TokenType.Identifier,
                  new Position(11, 5),
                  new Position(11, 16)
                )
              ),
              new Position(11, 75)
            ),
            new Token("!", TokenType.UnaryOperator, new Position(11, 4), new Position(11, 4)),
            true
          ),
          new CallExpr(
            [
              new CallExpr(
                [],
                new FunctionIdentifier(
                  new Token(
                    "GetLastError",
                    TokenType.Identifier,
                    new Position(11, 92),
                    new Position(11, 103)
                  )
                ),
                new Position(11, 105)
              )
            ],
            new FunctionIdentifier(
              new Token(
                "RaiseError",
                TokenType.Identifier,
                new Position(11, 81),
                new Position(11, 90)
              )
            ),
            new Position(11, 106)
          )
        ],
        new FunctionIdentifier(
          new Token("If", TokenType.Identifier, new Position(11, 1), new Position(11, 2))
        ),
        new Position(11, 107)
      ),
      new CallExpr(
        [],
        new FunctionIdentifier(
          new Token("DebugBreak", TokenType.Identifier, new Position(13, 1), new Position(13, 10))
        ),
        new Position(13, 12)
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new CallExpr(
              [
                new GlobalIdentifier(
                  new Token(
                    "$jb.cache.value",
                    TokenType.GlobalIdentifier,
                    new Position(15, 11),
                    new Position(15, 25)
                  ),
                  "global"
                )
              ],
              new FunctionIdentifier(
                new Token(
                  "Length",
                  TokenType.Identifier,
                  new Position(15, 4),
                  new Position(15, 9)
                )
              ),
              new Position(15, 26)
            ),
            new NumericLiteral(
              new Token("0", TokenType.Integer, new Position(15, 31), new Position(15, 31))
            ),
            "=="
          ),
          new AssignmentExpr(
            new Identifier(
              new Token("sendEmail", TokenType.Identifier, new Position(17, 9), new Position(17, 17))
            ),
            new BooleanLiteral(
              true,
              new Token("true", TokenType.True, new Position(17, 21), new Position(17, 24))
            ),
            new Token("=", TokenType.Assignment, new Position(17, 19), new Position(17, 19))
          ),
          new BlockExpr([
            new AssignmentExpr(
              new Identifier(
                new Token("date", TokenType.Identifier, new Position(19, 9), new Position(19, 12))
              ),
              new CallExpr(
                [
                  new StringLiteral(
                    new Token(
                      "dd",
                      TokenType.SingleQuoteString,
                      new Position(19, 24),
                      new Position(19, 27)
                    )
                  ),
                  new NumericLiteral(
                    new Token("1", TokenType.Integer, new Position(19, 29), new Position(19, 29))
                  ),
                  new GlobalIdentifier(
                    new Token(
                      "$jb.cache.value",
                      TokenType.GlobalIdentifier,
                      new Position(19, 31),
                      new Position(19, 45)
                    ),
                    "global"
                  )
                ],
                new FunctionIdentifier(
                  new Token("DateAdd", TokenType.Identifier, new Position(19, 16), new Position(19, 22))
                ),
                new Position(19, 46)
              ),
              new Token("=", TokenType.Assignment, new Position(19, 14), new Position(19, 14))
            ),
            new CallExpr(
              [
                new BinaryExpr(
                  new Identifier(
                    new Token("date", TokenType.Identifier, new Position(20, 12), new Position(20, 15))
                  ),
                  new CallExpr(
                    [],
                    new FunctionIdentifier(
                      new Token("Now", TokenType.Identifier, new Position(20, 19), new Position(20, 21))
                    ),
                    new Position(20, 23)
                  ),
                  "<"
                ),
                new AssignmentExpr(
                  new Identifier(
                    new Token(
                      "sendEmail",
                      TokenType.Identifier,
                      new Position(20, 25),
                      new Position(20, 33)
                    )
                  ),
                  new BooleanLiteral(
                    true,
                    new Token("true", TokenType.True, new Position(20, 37), new Position(20, 40))
                  ),
                  new Token("=", TokenType.Assignment, new Position(20, 35), new Position(20, 35))
                )
              ],
              new FunctionIdentifier(
                new Token("If", TokenType.Identifier, new Position(20, 9), new Position(20, 10))
              ),
              new Position(20, 41)
            )
          ])
        ],
        new FunctionIdentifier(
          new Token("If", TokenType.Identifier, new Position(15, 1), new Position(15, 2))
        ),
        new Position(22, 1)
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new Identifier(
              new Token("sendEmail", TokenType.Identifier, new Position(24, 4), new Position(24, 12))
            ),
            new BooleanLiteral(
              true,
              new Token("true", TokenType.True, new Position(24, 17), new Position(24, 20))
            ),
            "=="
          ),
          new BlockExpr([
            new CallExpr(
              [
                new StringLiteral(
                  new Token(
                    "<TAG>Email Messages/jitterbit/core/jb.core.email</TAG>",
                    TokenType.DoubleQuoteString,
                    new Position(26, 26),
                    new Position(26, 81)
                  )
                )
              ],
              new FunctionIdentifier(
                new Token("SendEmailMessage", TokenType.Identifier, new Position(26, 9), new Position(26, 24))
              ),
              new Position(26, 82)
            ),
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jb.cache.value",
                  TokenType.GlobalIdentifier,
                  new Position(27, 9),
                  new Position(27, 23)
                ),
                "global"
              ),
              new CallExpr(
                [],
                new FunctionIdentifier(
                  new Token("Now", TokenType.Identifier, new Position(27, 27), new Position(27, 29))
                ),
                new Position(27, 31)
              ),
              new Token("=", TokenType.Assignment, new Position(27, 25), new Position(27, 25))
            ),
            new CallExpr(
              [
                new UnaryExpr(
                  new CallExpr(
                    [
                      new StringLiteral(
                        new Token(
                          "<TAG>Operations/jitterbit/core/jb.core.cache.write</TAG>",
                          TokenType.DoubleQuoteString,
                          new Position(28, 26),
                          new Position(28, 83)
                        )
                      )
                    ],
                    new FunctionIdentifier(
                      new Token(
                        "RunOperation",
                        TokenType.Identifier,
                        new Position(28, 13),
                        new Position(28, 24)
                      )
                    ),
                    new Position(28, 84)
                  ),
                  new Token("!", TokenType.UnaryOperator, new Position(28, 12), new Position(28, 12)),
                  true
                ),
                new CallExpr(
                  [
                    new CallExpr(
                      [],
                      new FunctionIdentifier(
                        new Token(
                          "GetLastError",
                          TokenType.Identifier,
                          new Position(28, 97),
                          new Position(28, 108)
                        )
                      ),
                      new Position(28, 110)
                    )
                  ],
                  new FunctionIdentifier(
                    new Token(
                      "RaiseError",
                      TokenType.Identifier,
                      new Position(28, 86),
                      new Position(28, 95)
                    )
                  ),
                  new Position(28, 111)
                )
              ],
              new FunctionIdentifier(
                new Token("If", TokenType.Identifier, new Position(28, 9), new Position(28, 10))
              ),
              new Position(28, 112)
            )
          ])
        ],
        new FunctionIdentifier(
          new Token("If", TokenType.Identifier, new Position(24, 1), new Position(24, 2))
        ),
        new Position(29, 1)
      ),
      new CallExpr(
        [],
        new FunctionIdentifier(
          new Token("DebugBreak", TokenType.Identifier, new Position(30, 1), new Position(30, 10))
        ),
        new Position(30, 12)
      )
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
        new GlobalIdentifier(
          new Token(
            "$jb.log.message",
            TokenType.GlobalIdentifier,
            new Position(2, 1),
            new Position(2, 15)
          ),
          "global"
        ),
        new BinaryExpr(
          new BinaryExpr(
            new BinaryExpr(
              new BinaryExpr(
                new BinaryExpr(
                  new BinaryExpr(
                    new BinaryExpr(
                      new BinaryExpr(
                        new BinaryExpr(
                          new StringLiteral(
                            new Token(
                              " api.request.body = ",
                              TokenType.SingleQuoteString,
                              new Position(2, 17),
                              new Position(2, 38)
                            )
                          ),
                          new GlobalIdentifier(
                            new Token(
                              "$jitterbit.api.request.body",
                              TokenType.GlobalIdentifier,
                              new Position(2, 42),
                              new Position(2, 68)
                            ),
                            "system"
                          ),
                          "+"
                        ),
                        new StringLiteral(
                          new Token(
                            " api.request.enum.body = ",
                            TokenType.SingleQuoteString,
                            new Position(3, 2),
                            new Position(3, 28)
                          )
                        ),
                        "+"
                      ),
                      new GlobalIdentifier(
                        new Token(
                          "$jitterbit.api.request.enum.body",
                          TokenType.GlobalIdentifier,
                          new Position(3, 32),
                          new Position(3, 63)
                        ),
                        "system"
                      ),
                      "+"
                    ),
                    new StringLiteral(
                      new Token(
                        " api.request.enum.headers = ",
                        TokenType.SingleQuoteString,
                        new Position(4, 2),
                        new Position(4, 31)
                      )
                    ),
                    "+"
                  ),
                  new GlobalIdentifier(
                    new Token(
                      "$jitterbit.api.request.enum.headers",
                      TokenType.GlobalIdentifier,
                      new Position(4, 35),
                      new Position(4, 69)
                    ),
                    "system"
                  ),
                  "+"
                ),
                new StringLiteral(
                  new Token(
                    " api.request.enum.parameters = ",
                    TokenType.SingleQuoteString,
                    new Position(5, 2),
                    new Position(5, 34)
                  )
                ),
                "+"
              ),
              new GlobalIdentifier(
                new Token(
                  "$jitterbit.api.request.enum.parameters",
                  TokenType.GlobalIdentifier,
                  new Position(5, 38),
                  new Position(5, 75)
                ),
                "system"
              ),
              "+"
            ),
            new StringLiteral(
              new Token(
                " api.request.headers.fulluri = ",
                TokenType.SingleQuoteString,
                new Position(6, 2),
                new Position(6, 34)
              )
            ),
            "+"
          ),
          new GlobalIdentifier(
            new Token(
              "$jitterbit.api.request.headers.fulluri",
              TokenType.GlobalIdentifier,
              new Position(6, 38),
              new Position(6, 75)
            ),
            "system"
          ),
          "+"
        ),
        new Token("=", TokenType.Assignment, new Position(2, 16), new Position(2, 16))
      ),
      new CallExpr(
        [
          new StringLiteral(
            new Token(
              "<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",
              TokenType.DoubleQuoteString,
              new Position(7, 11), new Position(7, 58)
            )
          ),
          new GlobalIdentifier(
            new Token(
              "$jb.log.message",
              TokenType.GlobalIdentifier,
              new Position(7, 60),
              new Position(7, 74)
            ),
            "global"
          )
        ],
        new FunctionIdentifier(
          new Token("RunScript", TokenType.Identifier, new Position(7, 1), new Position(7, 9))
        ),
        new Position(7, 75)
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
        new Identifier(
          new Token("headers", TokenType.Identifier, new Position(3, 1), new Position(3, 7))
        ),
        new StringLiteral(
          new Token(
            "Headers: \r\n",
            TokenType.DoubleQuoteString,
            new Position(3, 11),
            new Position(3, 25)
          )
        ),
        new Token("=", TokenType.Assignment, new Position(3, 9), new Position(3, 9))
      ),
      new AssignmentExpr(
        new Identifier(
          new Token("enum", TokenType.Identifier, new Position(4, 1), new Position(4, 4))
        ),
        new GlobalIdentifier(
          new Token(
            "$jitterbit.api.request.enum.headers",
            TokenType.GlobalIdentifier,
            new Position(4, 8),
            new Position(4, 42)
          ),
          "system"
        ),
        new Token("=", TokenType.Assignment, new Position(4, 6), new Position(4, 6))
      ),
      new AssignmentExpr(
        new Identifier(
          new Token("i", TokenType.Identifier, new Position(5, 1), new Position(5, 1))
        ),
        new NumericLiteral(
          new Token("0", TokenType.Integer, new Position(5, 5), new Position(5, 5))
        ),
        new Token("=", TokenType.Assignment, new Position(5, 3), new Position(5, 3))
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new Identifier(
              new Token("i", TokenType.Identifier, new Position(6, 7), new Position(6, 7))
            ),
            new CallExpr(
              [
                new Identifier(
                  new Token("enum", TokenType.Identifier, new Position(6, 16), new Position(6, 19))
                )
              ],
                new FunctionIdentifier(
                  new Token("length", TokenType.Identifier, new Position(6, 9), new Position(6, 14))
                ),
                new Position(6, 20)
            ),
            "<"
          ),
          new BlockExpr([
            new AssignmentExpr(
              new Identifier(
                new Token("name", TokenType.Identifier, new Position(7, 3), new Position(7, 6))
              ),
              new MemberExpr(
                new Identifier(
                  new Token("enum", TokenType.Identifier, new Position(7, 10), new Position(7, 13))
                ),
                new Identifier(
                  new Token("i", TokenType.Identifier, new Position(7, 15), new Position(7, 15))
                ),
                new Position(7, 16)
              ),
              new Token("=", TokenType.Assignment, new Position(7, 8), new Position(7, 8))
            ),
            new AssignmentExpr(
              new Identifier(
                new Token("headers", TokenType.Identifier, new Position(8, 3), new Position(8, 9))
              ),
              new BinaryExpr(
                new BinaryExpr(
                  new BinaryExpr(
                    new BinaryExpr(
                      new BinaryExpr(
                        new Identifier(
                          new Token("headers", TokenType.Identifier, new Position(8, 13), new Position(8, 19))
                        ),
                        new StringLiteral(
                          new Token("$", TokenType.DoubleQuoteString, new Position(8, 23), new Position(8, 25))
                        ),
                        "+"
                      ),
                      new Identifier(
                        new Token("name", TokenType.Identifier, new Position(8, 29), new Position(8, 32))
                      ),
                      "+"
                    ),
                    new StringLiteral(
                      new Token(": ", TokenType.DoubleQuoteString, new Position(8, 36), new Position(8, 39))
                    ),
                    "+"
                  ),
                  new CallExpr(
                    [
                      new Identifier(
                        new Token("name", TokenType.Identifier, new Position(8, 47), new Position(8, 50))
                      )
                    ],
                    new FunctionIdentifier(
                      new Token("Get", TokenType.Identifier, new Position(8, 43), new Position(8, 45))
                    ),
                    new Position(8, 51)
                  ),
                  "+"
                ),
                new StringLiteral(
                  new Token(" \r\n", TokenType.DoubleQuoteString, new Position(8, 55), new Position(8, 61))
                ),
                "+"
              ),
              new Token("=", TokenType.Assignment, new Position(8, 11), new Position(8, 11))
            ),
            new AssignmentExpr(
              new Identifier(
                new Token("i", TokenType.Identifier, new Position(9, 3), new Position(9, 3))
              ),
              new BinaryExpr(
                new Identifier(
                  new Token("i", TokenType.Identifier, new Position(9, 7), new Position(9, 7))
                ),
                new NumericLiteral(
                  new Token("1", TokenType.Integer, new Position(9, 9), new Position(9, 9))
                ),
                "+"
              ),
              new Token("=", TokenType.Assignment, new Position(9, 5), new Position(9, 5))
            )
          ])
        ],
        new FunctionIdentifier(
          new Token("while", TokenType.Identifier, new Position(6, 1), new Position(6, 5))
        ),
        new Position(10, 3)
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new Identifier(
              new Token("i", TokenType.Identifier, new Position(11, 4), new Position(11, 4))
            ),
            new NumericLiteral(
              new Token("0", TokenType.Integer, new Position(11, 7), new Position(11, 7))
            ),
            "=="
          ),
          new AssignmentExpr(
            new Identifier(
              new Token("headers", TokenType.Identifier, new Position(11, 10), new Position(11, 16))
            ),
            new BinaryExpr(
              new Identifier(
                new Token("headers", TokenType.Identifier, new Position(11, 20), new Position(11, 26))
              ),
              new StringLiteral(
                new Token("(none)\r\n", TokenType.DoubleQuoteString, new Position(11, 30), new Position(11, 41))
              ),
              "+"
            ),
            new Token("=", TokenType.Assignment, new Position(11, 18), new Position(11, 18))
          )
        ],
        new FunctionIdentifier(
          new Token("if", TokenType.Identifier, new Position(11, 1), new Position(11, 2))
        ),
        new Position(11, 42)
      ),
      new CallExpr(
        [
          new StringLiteral(
            new Token(
              "<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",
              TokenType.DoubleQuoteString,
              new Position(13, 11),
              new Position(13, 58)
            )
          ),
          new Identifier(
            new Token("headers", TokenType.Identifier, new Position(13, 60), new Position(13, 66))
          )
        ],
        new FunctionIdentifier(
          new Token("RunScript", TokenType.Identifier, new Position(13, 1), new Position(13, 9))
        ),
        new Position(13, 67)
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
        new Identifier(
          new Token("work", TokenType.Identifier, new Position(8, 1), new Position(8, 4))
        ),
        new CallExpr(
          [
            new GlobalIdentifier(
              new Token(
                "$jitterbit.api.request.headers.Accept",
                TokenType.GlobalIdentifier,
                new Position(8, 14),
                new Position(8, 50)
              ),
              "system"
            )
          ],
          new FunctionIdentifier(
            new Token("ToLower", TokenType.Identifier, new Position(8, 6), new Position(8, 12))
          ),
          new Position(8, 51)
        ),
        new Token("=", TokenType.Assignment, new Position(8, 5), new Position(8, 5))
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new Identifier(
              new Token("work", TokenType.Identifier, new Position(10, 5), new Position(10, 8))
            ),
            new StringLiteral(
              new Token(
                "application/json",
                TokenType.SingleQuoteString,
                new Position(10, 11),
                new Position(10, 28)
              )
            ),
            "=="
          ),
          new BlockExpr([
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jb.core.operation.contentType",
                  TokenType.GlobalIdentifier,
                  new Position(11, 9),
                  new Position(11, 38)
                ),
                "global"
              ),
              new StringLiteral(
                new Token("json", TokenType.SingleQuoteString, new Position(11, 40), new Position(11, 45))
              ),
              new Token("=", TokenType.Assignment, new Position(11, 39), new Position(11, 39))
            ),
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jitterbit.api.response.headers.Content_Type",
                  TokenType.GlobalIdentifier,
                  new Position(12, 9),
                  new Position(12, 52)
                ),
                "system"
              ),
              new StringLiteral(
                new Token(
                  "application/json",
                  TokenType.DoubleQuoteString,
                  new Position(12, 54),
                  new Position(12, 71)
                )
              ),
              new Token("=", TokenType.Assignment, new Position(12, 53), new Position(12, 53))
            )
          ]),
          new BinaryExpr(
            new Identifier(
              new Token("work", TokenType.Identifier, new Position(13, 5), new Position(13, 8))
            ),
            new StringLiteral(
              new Token(
                "application/xml",
                TokenType.SingleQuoteString,
                new Position(13, 11),
                new Position(13, 27)
              )
            ),
            "=="
          ),
          new BlockExpr([
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jb.core.operation.contentType",
                  TokenType.GlobalIdentifier,
                  new Position(14, 9),
                  new Position(14, 38)
                ),
                "global"
              ),
              new StringLiteral(
              new Token("xml", TokenType.SingleQuoteString, new Position(14, 40), new Position(14, 44))
              ),
              new Token("=", TokenType.Assignment, new Position(14, 39), new Position(14, 39))
            ),
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jitterbit.api.response.headers.Content_Type",
                  TokenType.GlobalIdentifier,
                  new Position(15, 9),
                  new Position(15, 52)
                ),
                "system"
              ),
              new StringLiteral(
                new Token(
                  "application/xml",
                  TokenType.DoubleQuoteString,
                  new Position(15, 54),
                  new Position(15, 70)
                )
              ),
              new Token("=", TokenType.Assignment, new Position(15, 53), new Position(15, 53))
            )
          ]),
          new BinaryExpr(
            new Identifier(
              new Token("work", TokenType.Identifier, new Position(16, 5), new Position(16, 8))
            ),
            new StringLiteral(
              new Token(
                "text/html",
                TokenType.SingleQuoteString,
                new Position(16, 11),
                new Position(16, 21)
              )
            ),
            "=="
          ),
          new BlockExpr([
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jb.core.operation.contentType",
                  TokenType.GlobalIdentifier,
                  new Position(17, 9),
                  new Position(17, 38)
                ),
                "global"
              ),
              new StringLiteral(
                new Token("json", TokenType.SingleQuoteString, new Position(17, 40), new Position(17, 45))
              ),
              new Token("=", TokenType.Assignment, new Position(17, 39), new Position(17, 39))
            ),
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jitterbit.api.response.headers.Content_Type",
                  TokenType.GlobalIdentifier,
                  new Position(18, 9),
                  new Position(18, 52)
                ),
                "system"
              ),
              new StringLiteral(
                new Token("text/html", TokenType.DoubleQuoteString, new Position(18, 54), new Position(18, 64))
              ),
              new Token("=", TokenType.Assignment, new Position(18, 53), new Position(18, 53))
            )
          ]),
          new BooleanLiteral(
            true,
            new Token("true", TokenType.True, new Position(19, 5), new Position(19, 8))
          ),
          new BlockExpr([
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jb.core.operation.contentType",
                  TokenType.GlobalIdentifier,
                  new Position(20, 9),
                  new Position(20, 38)
                ),
                "global"
              ),
              new StringLiteral(
                new Token(
                  "xml",
                  TokenType.SingleQuoteString,
                  new Position(20, 40),
                  new Position(20, 44)
                )
              ),
              new Token("=", TokenType.Assignment, new Position(20, 39), new Position(20, 39))
            ),
            new AssignmentExpr(
              new GlobalIdentifier(
                new Token(
                  "$jitterbit.api.response.headers.Content_Type",
                  TokenType.GlobalIdentifier,
                  new Position(21, 9),
                  new Position(21, 52)
                ),
                "system"
              ),
              new StringLiteral(
                new Token(
                  "application/xml",
                  TokenType.DoubleQuoteString,
                  new Position(21, 54),
                  new Position(21, 70)
                )
              ),
              new Token("=", TokenType.Assignment, new Position(21, 53), new Position(21, 53))
            )
          ]),
        ],
        new FunctionIdentifier(
          new Token("case", TokenType.Identifier, new Position(9, 1), new Position(9, 4))
        ),
        new Position(22, 1)
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
        new GlobalIdentifier(
          new Token(
            "$jb.postgres.db.tableName",
            TokenType.GlobalIdentifier,
            new Position(12, 1),
            new Position(12, 25)
          ),
          "global"
        ),
        new StringLiteral(
          new Token("sdfsf", TokenType.SingleQuoteString, new Position(12, 29), new Position(12, 35))
        ),
        new Token("=", TokenType.Assignment, new Position(12, 27), new Position(12, 27))
      ),
      new CallExpr(
        [
          new BinaryExpr(
            new CallExpr(
              [
                new GlobalIdentifier(
                  new Token(
                    "$jb.postgres.db.tableName",
                    TokenType.GlobalIdentifier,
                    new Position(14, 11),
                    new Position(14, 35)
                  ),
                  "global"
                )
              ],
              new FunctionIdentifier(
                new Token("Length", TokenType.Identifier, new Position(14, 4), new Position(14, 9))
              ),
              new Position(14, 36)
            ),
            new NumericLiteral(new Token("0", TokenType.Integer, new Position(14, 41), new Position(14, 41))),
            "=="
          ),
          new CallExpr(
            [
              new StringLiteral(
                new Token(
                  "jb.postgres.db.tableName is empty",
                  TokenType.SingleQuoteString,
                  new Position(16, 20),
                  new Position(16, 54)
                )
              )
            ],
            new FunctionIdentifier(
              new Token("RaiseError", TokenType.Identifier, new Position(16, 9), new Position(16, 18))
            ),
            new Position(16, 55)
          ),
          new BlockExpr([
            new AssignmentExpr(
              new Identifier(
                new Token("sql_str", TokenType.Identifier, new Position(18, 9), new Position(18, 15))
              ),
              new BinaryExpr(
                new BinaryExpr(
                  new StringLiteral(
                    new Token(
                      "SELECT '",
                      TokenType.DoubleQuoteString,
                      new Position(18, 19),
                      new Position(18, 28)
                    )
                  ),
                  new GlobalIdentifier(
                    new Token(
                      "$jb.postgres.db.tableName",
                      TokenType.GlobalIdentifier,
                      new Position(18, 30),
                      new Position(18, 54)
                    ),
                    "global"
                  ),
                  "+"
                ),
                new StringLiteral(
                  new Token(
                    "'::regclass",
                    TokenType.DoubleQuoteString,
                    new Position(18, 56),
                    new Position(18, 68)
                  )
                ),
                "+"
              ),
              new Token("=", TokenType.Assignment, new Position(18, 17), new Position(18, 17))
            ),
            new CallExpr(
              [
                new StringLiteral(
                  new Token(
                    "<TAG>Scripts/jitterbit/core/jb.core.wtol</TAG>",
                    TokenType.DoubleQuoteString,
                    new Position(19, 19),
                    new Position(19, 66)
                  )
                ),
                new Identifier(
                  new Token("sql_str", TokenType.Identifier, new Position(19, 68), new Position(19, 74))
                )
              ],
              new FunctionIdentifier(
                new Token("RunScript", TokenType.Identifier, new Position(19, 9), new Position(19, 17))
              ),
              new Position(19, 75)
            ),
            new CallExpr(
              [
                new CallExpr(
                  [
                    new StringLiteral(
                      new Token(
                        "<TAG>Sources/jitterbit/postgres/jb.postgres.jdbc</TAG>",
                        TokenType.DoubleQuoteString,
                        new Position(20, 24),
                        new Position(20, 79)
                      )
                    ),
                    new Identifier(
                      new Token(
                        "sql_str",
                        TokenType.Identifier,
                        new Position(20, 81),
                        new Position(20, 87)
                      )
                    )
                  ],
                  new FunctionIdentifier(
                    new Token("DbExecute", TokenType.Identifier, new Position(20, 14), new Position(20, 22))
                  ),
                  new Position(20, 88)
                ),
                new BlockExpr([
                  new CallExpr(
                    [],
                    new FunctionIdentifier(
                      new Token(
                        "DebugBreak",
                        TokenType.Identifier,
                        new Position(20, 90),
                        new Position(20, 99)
                      )
                    ),
                    new Position(20, 101)
                  ),
                  new CallExpr(
                    [
                      new CallExpr(
                        [],
                        new FunctionIdentifier(
                          new Token(
                            "GetLastError",
                            TokenType.Identifier,
                            new Position(20, 114),
                            new Position(20, 125)
                          )
                        ),
                        new Position(20, 127)
                      )
                    ],
                    new FunctionIdentifier(
                      new Token(
                        "RaiseError",
                        TokenType.Identifier,
                        new Position(20, 103),
                        new Position(20, 112)
                      )
                    ),
                    new Position(20, 128)
                  )
                ])
              ],
              new FunctionIdentifier(
                new Token("Eval", TokenType.Identifier, new Position(20, 9), new Position(20, 12))
              ),
              new Position(20, 129)
            )
          ])
        ],
        new FunctionIdentifier(
          new Token("If", TokenType.Identifier, new Position(14, 1), new Position(14, 2))
        ),
        new Position(23, 1)
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
    ast: makeAST([
      new StringLiteral(
        new Token("something", TokenType.DoubleQuoteString, new Position(2, 1), new Position(2, 11))
      )
    ])
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
