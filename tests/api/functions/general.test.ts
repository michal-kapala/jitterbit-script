import { Api } from "../../../src/api";
import { AsyncFunc, DeferrableFunc } from "../../../src/api/types";
import { RuntimeError, UnimplementedError } from "../../../src/errors";
import { 
  AssignmentExpr,
  BinaryExpr,
  BlockExpr,
  CallExpr,
  Identifier,
  NumericLiteral,
  StringLiteral
} from "../../../src/frontend/ast";
import { Position, Token, TokenType } from "../../../src/frontend/types";
import Scope from "../../../src/runtime/scope";
import { 
  JbArray,
  JbBinary,
  JbBool,
  JbDate,
  JbNull,
  JbNumber,
  JbString
} from "../../../src/runtime/types";
import { makeDict } from '../../utils';

describe('General functions', function() {
  test('ArgumentList()', function() {
    const func = Api.getFunc("ArgumentList");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("hello there")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('AutoNumber()', function() {
    const func = Api.getFunc("AutoNumber");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('CancelOperation()', async function() {
    const func = Api.getFunc("CancelOperation");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("operationInstanceGUID")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('CancelOperationChain()', async function() {
    const func = Api.getFunc("CancelOperationChain");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("message")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('Eval()', async function() {
    const func = Api.getFunc("Eval");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    // 3 ^ Null() - throws
    const pos = new Position();
    const expToEvaluate = new BinaryExpr(
      new NumericLiteral(new Token("3", TokenType.Integer, pos, pos)),
      new CallExpr(
        [],
        new Identifier(new Token("Null", TokenType.Identifier, pos, pos)),
        pos
      ),
      "^"
    );
    // "whoopsie"
    const defaultResult = new StringLiteral(
      new Token("whoopsie", TokenType.DoubleQuoteString, pos, pos)
    );
    await expect(
      (func as DeferrableFunc)?.callEval([expToEvaluate, defaultResult], new Scope())
    ).resolves.toStrictEqual(new JbString("whoopsie"));
  });

  test('Get()', function() {
    const func = Api.getFunc("Get");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbString("name")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetChunkDataElement()', function() {
    const func = Api.getFunc("GetChunkDataElement");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("name")], new Scope())
    }).toThrow(UnimplementedError);
  });

  describe('GetHostByIP()', function() {
    test('GetHostByIP() - resolvable IPv4', async function() {
      const func = Api.getFunc("GetHostByIP");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        await (func as AsyncFunc)?.callAsync([new JbString("8.8.8.8")], new Scope())
      ).toStrictEqual(new JbString("dns.google"));
    });

    test('GetHostByIP() - unresolvable IPv4', async function() {
      const func = Api.getFunc("GetHostByIP");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      await expect(async function() {
        await (func as AsyncFunc)?.callAsync([new JbString("0.0.0.0")], new Scope())
      }).rejects.toThrow();
    });

    test('GetHostByIP() - invalid IPv4', async function() {
      const func = Api.getFunc("GetHostByIP");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      await expect(async function() {
        await (func as AsyncFunc)?.callAsync([new JbString("256.0.0.0 or sth idk")], new Scope())
      }).rejects.toThrow(RuntimeError);
    });

    test('GetHostByIP() - invalid type', async function() {
      const func = Api.getFunc("GetHostByIP");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      await expect(async function() {
        // POD: localhost number - the original implementation unofficially supports it
        await (func as AsyncFunc)?.callAsync([new JbNumber(2130706433)], new Scope())
      }).rejects.toThrow(RuntimeError);
    });
  });
  
  test('GetInputString()', function() {
    const func = Api.getFunc("GetInputString");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("global var")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetLastOperationRunStartTime()', function() {
    const func = Api.getFunc("GetLastOperationRunStartTime");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("operationId")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetName()', function() {
    const func = Api.getFunc("GetName");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("global var")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetOperationQueue()', function() {
    const func = Api.getFunc("GetOperationQueue");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("operation tag")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('GetServerName()', function() {
    const func = Api.getFunc("GetServerName");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const hostname = func?.call([], new Scope()) as JbString;
    expect(
      hostname.value.length
    ).toBeGreaterThan(0);
  });

  test('GUID()', function() {
    const func = Api.getFunc("GUID");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/gi;
    const result = func?.call([], new Scope()) as JbString;
    expect(result.value).toMatch(pattern);
  });

  test('IfEmpty()', async function() {
    const func = Api.getFunc("IfEmpty");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const pos = new Position();
    const arg = new StringLiteral(new Token("", TokenType.DoubleQuoteString, pos, pos));
    const defaultResult = new StringLiteral(new Token("got u", TokenType.DoubleQuoteString, pos, pos));
    await expect(
      (func as DeferrableFunc)?.callEval([arg, defaultResult], new Scope())
    ).resolves.toStrictEqual(new JbString("got u"));
  });
  
  test('IfNull()', async function() {
    const func = Api.getFunc("IfNull");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const pos = new Position();
    const arg = new CallExpr(
      [],
      new Identifier(new Token("Null", TokenType.Identifier, pos, pos)),
      pos
    );
    const defaultResult = new StringLiteral(
      new Token("got u", TokenType.DoubleQuoteString, pos, pos)
    );
    await expect(
      (func as DeferrableFunc)?.callEval([arg, defaultResult], new Scope())
    ).resolves.toStrictEqual(new JbString("got u"));
  });

  test('InitCounter()', function() {
    const func = Api.getFunc("InitCounter");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("$global_var")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('InList()', function() {
    const func = Api.getFunc("InList");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("just a value"),
        new JbNumber(),
        new JbBool(),
        new JbString("just a value")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  describe('IsInteger()', function() {
    test('IsInteger(int)', function() {
      const func = Api.getFunc("IsInteger");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(3)], new Scope())
      ).toStrictEqual(new JbBool(true));
    });

    test('IsInteger(float)', function() {
      const func = Api.getFunc("IsInteger");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(3.3)], new Scope())
      ).toStrictEqual(new JbBool(false));
    });
  });

  describe('IsNull()', function() {
    test('IsNull(null)', function() {
      const func = Api.getFunc("IsNull");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNull()], new Scope())
      ).toStrictEqual(new JbBool(true));
    });

    test('IsNull(0)', function() {
      const func = Api.getFunc("IsNull");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(0)], new Scope())
      ).toStrictEqual(new JbBool(false));
    });

    test('IsNull("null")', function() {
      const func = Api.getFunc("IsNull");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("null")], new Scope())
      ).toStrictEqual(new JbBool(false));
    });
  });
  
  describe('IsValid()', function() {
    test('IsValid() - valid expr', function() {
      const func = Api.getFunc("IsValid");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const pos = new Position();
      expect(
        (func as DeferrableFunc)?.callEval(
          [
            new CallExpr(
              [],
              new Identifier(new Token("Null", TokenType.Identifier, pos, pos)),
              pos
            )
          ],
          new Scope()
        )
      ).resolves.toStrictEqual(new JbBool(true));
    });

    test('IsValid() - runtime error', async function() {
      const func = Api.getFunc("IsValid");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const scope = new Scope();
      scope.assignVar("str", new JbString("whatever"));
      // str += " works"; 3 ^ ""
      const pos = new Position();
      const expr = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("str", TokenType.DoubleQuoteString, pos, pos)),
          new StringLiteral(new Token(" works", TokenType.DoubleQuoteString, pos, pos)),
          new Token("+=", TokenType.Assignment, pos, pos)
        ),
        new BinaryExpr(
          new NumericLiteral(new Token("3", TokenType.Integer, pos, pos)),
          new StringLiteral(new Token("", TokenType.DoubleQuoteString, pos, pos)),
          "^"
        )
      ]);
      await expect(
        (func as DeferrableFunc)?.callEval([expr], scope)
      ).resolves.toStrictEqual(new JbBool(false));
      expect(scope.lookupVar("str")).toStrictEqual(new JbString("whatever works"));
    });
  });

  describe('Length()', function() {
    test('Length(number)', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // leading zero is added
      const str = new JbNumber(.45);
      expect(
        func?.call([str], new Scope())
      ).toStrictEqual(new JbNumber(4));
    });

    test('Length(string)', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const str = new JbString(" €123.45");
      expect(
        func?.call([str], new Scope())
      ).toStrictEqual(new JbNumber(8));
    });

    test('Length(bool)', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbBool()], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });

    test('Length(null)', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNull()], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });

    test('Length(array)', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbArray([new JbArray(), new JbNull()])], new Scope())
      ).toStrictEqual(new JbNumber(2));
    });

    test('Length(dictionary)', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });

    test('Length(binary)', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const bin = new JbBinary(new Uint8Array([1,2,3,4,5,6]));
      expect(
        func?.call([bin], new Scope())
      ).toStrictEqual(new JbNumber(6));
    });

    test('Length(Now())', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbDate()], new Scope())
      ).toStrictEqual(new JbNumber(19));
    });

    test('Length(Now_())', function() {
      const func = Api.getFunc("Length");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = new JbDate(new Date(), false);
      expect(
        func?.call([date], new Scope())
      ).toStrictEqual(new JbNumber(23));
    });
  });

  test('Null()', function() {
    const func = Api.getFunc("Null");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([], new Scope())
    ).toStrictEqual(new JbNull());
  });

  describe('Random()', function() {
    test('Random(1, 1)', function() {
      const func = Api.getFunc("Random");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(1), new JbNumber(1)], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });

    test('Random(-5.5, 10)', function() {
      const func = Api.getFunc("Random");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const result = func?.call(
        [new JbNumber(-5.5), new JbNumber(10)],
        new Scope()
      ) as JbNumber;
      expect(result.value).toBeGreaterThanOrEqual(-5);
      expect(result.value).toBeLessThanOrEqual(10);
    });
  });

  describe('RandomString()', function() {
    test('RandomString(7, "aaa")', function() {
      const func = Api.getFunc("RandomString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(7), new JbString("aaa")], new Scope())
      ).toStrictEqual(new JbString("aaaaaaa"));
    });

    test('RandomString(13)', function() {
      const func = Api.getFunc("RandomString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const result = func?.call([new JbNumber(13)], new Scope()) as JbString;
      expect(result.type).toStrictEqual("string");
      expect(result.value.length).toStrictEqual(13);
    });

    test('RandomString(-1)', function() {
      const func = Api.getFunc("RandomString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const result = func?.call([new JbNumber(-1)], new Scope()) as JbString;
      expect(result).toStrictEqual(new JbString(""));
    });
  });

  test('ReadArrayString()', function() {
    const func = Api.getFunc("ReadArrayString");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("{1,2,{3},[],null}")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('RecordCount()', function() {
    const func = Api.getFunc("RecordCount");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('ReRunOperation()', async function() {
    const func = Api.getFunc("ReRunOperation");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('RunOperation()', async function() {
    const func = Api.getFunc("RunOperation");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("operationId")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('RunPlugin()', async function() {
    const func = Api.getFunc("RunPlugin");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("pluginId")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('RunScript()', async function() {
    const func = Api.getFunc("RunScript");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("scriptId"), new JbString("some arg")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('Set()', function() {
    const func = Api.getFunc("Set");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbString("$global_var"), new JbString("new value")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SetChunkDataElement()', function() {
    const func = Api.getFunc("SetChunkDataElement");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbString("chunk_var"), new JbString("new value")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Sleep(1)', async function() {
    const func = Api.getFunc("Sleep");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const start = new Date();
    expect(
      await (func as AsyncFunc)?.callAsync([new JbNumber(1)], new Scope())
    ).toStrictEqual(new JbNull());
    expect(new Date().getTime() - start.getTime()).toBeGreaterThanOrEqual(1000);
  });

  test('SourceInstanceCount()', function() {
    const func = Api.getFunc("SourceInstanceCount");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('TargetInstanceCount()', function() {
    const func = Api.getFunc("TargetInstanceCount");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('WaitForOperation()', async function() {
    const func = Api.getFunc("WaitForOperation");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });
});
