import Api from "../../../../src/api";
import { DeferrableFunc } from "../../../../src/api/types";
import { RuntimeError } from "../../../../src/errors";
import {
  AssignmentExpr,
  BinaryExpr,
  BlockExpr,
  BooleanLiteral,
  CallExpr,
  Identifier,
  NumericLiteral,
  StringLiteral,
  UnaryExpr
} from "../../../../src/frontend/ast";
import { Position, Token, TokenType } from "../../../../src/frontend/types";
import Scope from "../../../../src/runtime/scope";
import {
  JbArray,
  JbBinary,
  JbBool,
  JbNull,
  JbNumber,
  JbString
} from "../../../../src/runtime/types";
import { makeDict } from "../../../utils";

describe('Logical functions', function() {
  describe('Case()', function() {
    test('Case() - match', async function() {
      const func = Api.getFunc("Case");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      //  Case(
      //    true & false,
      //      $result = "branch 1";
      //      1;
      //    ,
      //    true | false,
      //      $result = "branch 2";
      //      2;
      //    ,
      //    false,
      //      $result = "branch 3";
      //      3;
      //  );
      const pos = new Position();
      const cond1 = new BinaryExpr(
        new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos)),
        new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos)),
        "&"
      );
      const branch1 = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("branch 1", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("1", TokenType.Integer, pos, pos))
      ]);
      const cond2 = new BinaryExpr(
        new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos)),
        new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos)),
        "|"
      );
      const branch2 = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("branch 2", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("2", TokenType.Integer, pos, pos))
      ]);
      const cond3 = new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos));
      const branch3 = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("branch 3", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("3", TokenType.Integer, pos, pos))
      ]);
      const scope = new Scope();
      await expect(
        (func as DeferrableFunc)?.callEval(
          [cond1, branch1, cond2, branch2, cond3, branch3],
          scope
        )
      ).resolves.toStrictEqual(new JbNumber(2));
      expect(scope.lookupVar("$result")).toStrictEqual(new JbString("branch 2"));
    });

    test('Case() - no match', async function() {
      const func = Api.getFunc("Case");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      //  Case(
      //    true & false,
      //      $result = "branch 1";
      //      1;
      //    ,
      //    DebugBreak(false),
      //      $result = "branch 2";
      //      2;
      //    ,
      //    false,
      //      $result = "branch 3";
      //      3;
      //  );
      const pos = new Position();
      const cond1 = new BinaryExpr(
        new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos)),
        new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos)),
        "&"
      );
      const branch1 = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("branch 1", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("1", TokenType.Integer, pos, pos))
      ]);
      const cond2 = new CallExpr(
        [new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos))],
        new Identifier(new Token("DebugBreak", TokenType.Identifier, pos, pos)),
        pos
      );
      const branch2 = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("branch 2", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("2", TokenType.Integer, pos, pos))
      ]);
      const cond3 = new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos));
      const branch3 = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("branch 3", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("3", TokenType.Integer, pos, pos))
      ]);
      const scope = new Scope();
      await expect(
        (func as DeferrableFunc)?.callEval(
          [cond1, branch1, cond2, branch2, cond3, branch3],
          scope
        )
      ).resolves.toStrictEqual(new JbNull());
      expect(scope.lookupVar("$result")).toBeUndefined();
    });
  });

  describe('Equal()', function() {
    test('Equal(array, array) - match', async function() {
      const func = Api.getFunc("Equal");
      expect(func).toBeDefined();
      //  Equal({3, {"true"}}, {"3", {true}})
      //  Equal({3, {"true"}}, {3, {"true"}}})
      const arr1 = new JbArray([
        new JbNumber(3),
        new JbArray([new JbString("true")])
      ]);
      const arr2 = arr1.clone();
      const scope = new Scope();
      expect(
        func?.call([arr1, arr2], scope)
      ).toStrictEqual(new JbBool(true));
    });

    test('Equal(array, array) - mismatch', async function() {
      const func = Api.getFunc("Equal");
      expect(func).toBeDefined();
      //  Equal({3, {"true"}}, {"3", {true}})
      const arr1 = new JbArray([
        new JbNumber(3),
        new JbArray([new JbString("true")])
      ]);
      const arr2 = new JbArray([
        new JbString("3"),
        new JbArray([new JbBool(true)])
      ]);
      const scope = new Scope();
      // POD: returns false due to type difference
      // the original implementation returns true for this test
      expect(
        func?.call([arr1, arr2], scope)
      ).toStrictEqual(new JbBool(false));
    });

    test('Equal(string, string) - mismatch', async function() {
      const func = Api.getFunc("Equal");
      expect(func).toBeDefined();
      const dict1 = new JbString("abc");
      const dict2 = dict1.clone();
      dict1.value = "abc123";
      expect(
        func?.call([dict1, dict2], new Scope())
      ).toStrictEqual(new JbBool(false));
    });

    test('Equal(binary, binary) - match', async function() {
      const func = Api.getFunc("Equal");
      expect(func).toBeDefined();
      const bin1 = new JbBinary(new Uint8Array([
        0, 1, 0, 1, 2, 3, 4, 129, 255, 32
      ]));
      const bin2 = bin1.clone();
      expect(
        func?.call([bin1, bin2], new Scope())
      ).toStrictEqual(new JbBool(true));
    });

    test('Equal(dictionary, dictionary) - mismatch', async function() {
      const func = Api.getFunc("Equal");
      expect(func).toBeDefined();
      const dict1 = makeDict("testKey", new JbString("value"));
      const dict2 = dict1.clone();
      dict1.set(new JbString("testKey2"), new JbNull());
      expect(
        func?.call([dict1, dict2], new Scope())
      ).toStrictEqual(new JbBool(false));
    });
  });

  describe('If()', function() {
    test('If(true, x)', async function() {
      const func = Api.getFunc("If");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const pos = new Position();
      // true | false
      const condition = new BinaryExpr(
        new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos)),
        new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos)),
        "|"
      );
      // $result = "success"; 7;
      const trueBranch = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("success", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("7", TokenType.Integer, pos, pos))
      ]);
      const scope = new Scope();
      await expect(
        (func as DeferrableFunc)?.callEval([condition, trueBranch], scope)
      ).resolves.toStrictEqual(new JbNumber(7));
      expect(scope.lookupVar("$result")).toStrictEqual(new JbString("success"));
    });

    test('If(false, x)', async function() {
      const func = Api.getFunc("If");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const pos = new Position();
      // true & false
      const condition = new BinaryExpr(
        new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos)),
        new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos)),
        "&"
      );
      // $result = "success"; 7;
      const trueBranch = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("success", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("7", TokenType.Integer, pos, pos))
      ]);
      const scope = new Scope();
      await expect(
        (func as DeferrableFunc)?.callEval([condition, trueBranch], scope)
      ).resolves.toStrictEqual(new JbNull());
      expect(scope.lookupVar("$result")).toBeUndefined();
    });

    test('If(true, x, y)', async function() {
      const func = Api.getFunc("If");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const pos = new Position();
      // true | false
      const condition = new BinaryExpr(
        new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos)),
        new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos)),
        "|"
      );
      // $result = "true branch"; 7;
      const trueBranch = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("true branch", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("7", TokenType.Integer, pos, pos))
      ]);
      // $result = "false branch"; -7;
      const falseBranch = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("false branch", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("-7", TokenType.Integer, pos, pos))
      ]);
      const scope = new Scope();
      await expect(
        (func as DeferrableFunc)?.callEval([condition, trueBranch, falseBranch], scope)
      ).resolves.toStrictEqual(new JbNumber(7));
      expect(scope.lookupVar("$result")).toStrictEqual(new JbString("true branch"));
    });

    test('If(false, x, y)', async function() {
      const func = Api.getFunc("If");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const pos = new Position();
      // true & false
      const condition = new BinaryExpr(
        new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos)),
        new BooleanLiteral(false, new Token("false", TokenType.False, pos, pos)),
        "&"
      );
      // $result = "true branch"; 7;
      const trueBranch = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("true branch", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("7", TokenType.Integer, pos, pos))
      ]);
      // $result = "false branch"; -7;
      const falseBranch = new BlockExpr([
        new AssignmentExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new StringLiteral(new Token("false branch", TokenType.DoubleQuoteString, pos, pos)),
          new Token("=", TokenType.Assignment, pos, pos)
        ),
        new NumericLiteral(new Token("-7", TokenType.Integer, pos, pos))
      ]);
      const scope = new Scope();
      await expect(
        (func as DeferrableFunc)?.callEval([condition, trueBranch, falseBranch], scope)
      ).resolves.toStrictEqual(new JbNumber(-7));
      expect(scope.lookupVar("$result")).toStrictEqual(new JbString("false branch"));
    });
  });

  describe('While()', function() {
    test('While() - 0 iters', async function() {
      const func = Api.getFunc("While");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      //  $result = 0;
      //  While(false, ++$result);
      const pos = new Position();
      const cond = new BooleanLiteral(false, new Token("true", TokenType.True, pos, pos));
      const body = new BlockExpr([
        new UnaryExpr(
          new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos)),
          new Token("++", TokenType.UnaryOperator, pos, pos),
          true
        )
      ]);
      const scope = new Scope();
      scope.assignVar("$result", new JbNumber(0));
      await expect(
        (func as DeferrableFunc)?.callEval([cond, body], scope)
      ).resolves.toStrictEqual(new JbNull());
      expect(scope.lookupVar("$result")).toStrictEqual(new JbNumber(0));
    });

    test('While() - 10 iters', async function() {
      const func = Api.getFunc("While");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      //  $result = 0;
      //  While($result <= 10, ++$result);
      const pos = new Position();
      const resultId = new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos));
      const cond = new BinaryExpr(
        resultId,
        new NumericLiteral(new Token("10", TokenType.Integer, pos, pos)),
        "<="
      );
      const body = new BlockExpr([
        new UnaryExpr(resultId, new Token("++", TokenType.UnaryOperator, pos, pos), true)
      ]);
      const scope = new Scope();
      scope.assignVar(resultId.symbol, new JbNumber(0));
      await expect(
        (func as DeferrableFunc)?.callEval([cond, body], scope)
      ).resolves.toStrictEqual(new JbNull());
      expect(scope.lookupVar(resultId.symbol)).toStrictEqual(new JbNumber(11));
    });

    test('While() - max iters (default)', async function() {
      const func = Api.getFunc("While");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      //  $result = 0;
      //  While(true, ++$result);
      const pos = new Position();
      const resultId = new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos));
      const cond = new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos));
      const body = new BlockExpr([
        new UnaryExpr(resultId, new Token("++", TokenType.UnaryOperator, pos, pos), true)
      ]);
      const scope = new Scope();
      scope.assignVar(resultId.symbol, new JbNumber(0));
      await expect(async function() {
        await (func as DeferrableFunc)?.callEval([cond, body], scope)
      }).rejects.toThrow(RuntimeError);
      expect(scope.lookupVar(resultId.symbol)).toStrictEqual(new JbNumber(50000));
    });

    test('While() - 50k iters (custom)', async function() {
      const func = Api.getFunc("While");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      //  $result = 0;
      //  $jitterbit.scripting.while.max_iterations = 50001;
      //  While($result < 50000, ++$result);
      const pos = new Position();
      const resultId = new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos));
      const cond = new BinaryExpr(
        resultId,
        new NumericLiteral(new Token("50000", TokenType.Integer, pos, pos)),
        "<"
      );
      const body = new BlockExpr([
        new UnaryExpr(
          resultId,
          new Token("++", TokenType.UnaryOperator, pos, pos),
          true
        )
      ]);
      const scope = new Scope();
      scope.assignVar(resultId.symbol, new JbNumber(0));
      scope.assignVar("$jitterbit.scripting.while.max_iterations", new JbNumber(50001));
      await expect(
        (func as DeferrableFunc)?.callEval([cond, body], scope)
      ).resolves.toStrictEqual(new JbNull());
      expect(scope.lookupVar(resultId.symbol)).toStrictEqual(new JbNumber(50000));
    });

    test('While() - max iters (custom)', async function() {
      const func = Api.getFunc("While");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      //  $result = 0;
      //  $jitterbit.scripting.while.max_iterations = 50;
      //  While(true, ++$result);
      const pos = new Position();
      const resultId = new Identifier(new Token("$result", TokenType.GlobalIdentifier, pos, pos));
      const cond = new BooleanLiteral(true, new Token("true", TokenType.True, pos, pos));
      const body = new BlockExpr([
        new UnaryExpr(
          resultId,
          new Token("++", TokenType.UnaryOperator, pos, pos),
          true
        )
      ]);
      const scope = new Scope();
      scope.assignVar(resultId.symbol, new JbNumber(0));
      scope.assignVar("$jitterbit.scripting.while.max_iterations", new JbNumber(50));
      await expect(async function() {
        await (func as DeferrableFunc)?.callEval([cond, body], scope)
      }).rejects.toThrow(RuntimeError);
      expect(scope.lookupVar(resultId.symbol)).toStrictEqual(new JbNumber(50));
    });
  });
});
