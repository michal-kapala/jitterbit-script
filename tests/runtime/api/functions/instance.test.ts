import Api from "../../../../src/api";
import { UnimplementedError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbArray, JbNull, JbNumber, JbString } from "../../../../src/runtime/types";

describe('Instance functions', function() {
  test('Count()', function() {
    const func = Api.getFunc("Count");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbArray([new JbString("hello there"), new JbNull()])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('CountSourceRecords()', function() {
    const func = Api.getFunc("CountSourceRecords");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Exist()', function() {
    const func = Api.getFunc("Exist");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbString("findme"), new JbArray([new JbNumber(4), new JbString("findme")])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('FindByPos()', function() {
    const func = Api.getFunc("FindByPos");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbNumber(1), new JbArray([new JbNumber(4), new JbString("findme")])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('FindValue()', function() {
    const func = Api.getFunc("FindValue");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("findme"), new JbString("de1"), new JbString("de2")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetInstance()', function() {
    const func = Api.getFunc("GetInstance");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Max()', function() {
    const func = Api.getFunc("Max");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbArray([new JbNumber(4), new JbString("findme")])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Min()', function() {
    const func = Api.getFunc("Min");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbArray([new JbNumber(4), new JbString("findme")])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('ResolveOneOf()', function() {
    const func = Api.getFunc("ResolveOneOf");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbArray([new JbNumber(4), new JbString("findme")])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SetInstances()', function() {
    const func = Api.getFunc("SetInstances");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("nodeName"), new JbArray([new JbNumber(4), new JbString("findme")])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SortInstances()', function() {
    const func = Api.getFunc("SortInstances");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("nodeName"), new JbArray([new JbNumber(4), new JbString("findme")])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Sum()', function() {
    const func = Api.getFunc("Sum");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbArray([new JbNumber(4), new JbNumber(6)])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SumCSV()', function() {
    const func = Api.getFunc("SumCSV");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbArray([new JbNumber(4), new JbNumber(6)])], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SumString()', function() {
    const func = Api.getFunc("SumString");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbArray([new JbNumber(4), new JbNumber(6)])], new Scope())
    }).toThrow(UnimplementedError);
  });
});