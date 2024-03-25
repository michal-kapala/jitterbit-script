import Api from "../../../../src/api";
import { RuntimeError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbNull, JbString } from "../../../../src/runtime/types";

describe('Error functions', function() {
  test('GetLastError()', function() {
    const func = Api.getFunc("GetLastError");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const scope = new Scope();
    scope.assignVar("$jitterbit.operation.last_error", new JbString("a very fatal error"));
    expect(func?.call([], scope)).toStrictEqual(new JbString("a very fatal error"));
  });

  test('RaiseError()', function() {
    const func = Api.getFunc("RaiseError");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const scope = new Scope();
    scope.assignVar("$jitterbit.operation.last_error", new JbString("a very fatal error"));
    expect(function() {
      func?.call([new JbString("a less fatal error")], scope)
    }).toThrow(RuntimeError);
    expect(
      scope.lookupVar("$jitterbit.operation.previous.error")
    ).toStrictEqual(new JbString("a very fatal error"));
    expect(
      scope.lookupVar("$jitterbit.operation.last_error")
    ).toStrictEqual(new JbString("a less fatal error"));
  });

  test('ResetLastError()', function() {
    const func = Api.getFunc("ResetLastError");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const scope = new Scope();
    scope.assignVar("$jitterbit.operation.last_error", new JbString("a very fatal error"));
    expect(func?.call([], scope)).toStrictEqual(new JbNull());
    expect(
      scope.lookupVar("$jitterbit.operation.last_error")
    ).toStrictEqual(new JbString());
  });

  test('SetLastError()', function() {
    const func = Api.getFunc("SetLastError");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const scope = new Scope();
    scope.assignVar("$jitterbit.operation.last_error", new JbString("a very fatal error"));
    expect(
      func?.call([new JbString("a user-defined error")], scope)
    ).toStrictEqual(new JbNull());
    expect(
      scope.lookupVar("$jitterbit.operation.last_error")
    ).toStrictEqual(new JbString("a user-defined error"));
  });
});