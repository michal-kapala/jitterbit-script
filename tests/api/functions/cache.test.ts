import { describe, expect, test } from '@jest/globals';
import { Api } from '../../../src/api';
import Scope from '../../../src/runtime/scope';
import { UnimplementedError } from '../../../src/errors';
import { AsyncFunc } from '../../../src/api/types';
import { JbString } from '../../../src/runtime/types';

describe('Cache functions', function() {
  test('ReadCache()', async function() {
    const func = Api.getFunc("ReadCache");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("testKey")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('WriteCache()', async function() {
    const func = Api.getFunc("WriteCache");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync(
        [new JbString("testKey"), new JbString("the value")],
        new Scope()
      )
    }).rejects.toThrow(UnimplementedError);
  });
});
