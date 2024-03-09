import { describe, expect, test } from '@jest/globals';
import { Api } from '../../../../src/api';
import Scope from '../../../../src/runtime/scope';
import { JbBool } from '../../../../src/runtime/types';

describe('Debug functions', function() {
  test('DebugBreak()', function() {
    const func = Api.getFunc("DebugBreak");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([], new Scope())
    ).toStrictEqual(new JbBool(true));
  });

  test('DebugBreak(false)', function() {
    const func = Api.getFunc("DebugBreak");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([new JbBool(false)], new Scope())
    ).toStrictEqual(new JbBool(false));
  });
});
