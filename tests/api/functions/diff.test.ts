import { Api } from "../../../src/api";
import { UnimplementedError } from "../../../src/errors";
import Scope from "../../../src/runtime/scope";
import { JbBool, JbNumber, JbString } from "../../../src/runtime/types";

describe('Diff functions', function() {
  test('DiffAdd()', function() {
    const func = Api.getFunc("DiffAdd");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('DiffComplete()', function() {
    const func = Api.getFunc("DiffComplete");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('DiffDelete()', function() {
    const func = Api.getFunc("DiffDelete");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('DiffKeyList()', function() {
    const func = Api.getFunc("DiffKeyList");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("testKey")], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('DiffNode()', function() {
    const func = Api.getFunc("DiffNode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("nodeName")], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('DiffUpdate()', function() {
    const func = Api.getFunc("DiffUpdate");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('InitializeDiff()', function() {
    const func = Api.getFunc("InitializeDiff");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("diffId")], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('OrderedDiffKeyList()', function() {
    const func = Api.getFunc("OrderedDiffKeyList");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("testKey"), new JbBool(true)], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('ResetDiff()', function() {
    const func = Api.getFunc("ResetDiff");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("diffId"), new JbNumber(1)], new Scope())
      }).toThrow(UnimplementedError);
  });

  test('SetDiffChunkSize()', function() {
    const func = Api.getFunc("SetDiffChunkSize");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(1000)], new Scope())
      }).toThrow(UnimplementedError);
  });
});
