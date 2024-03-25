import { describe, expect, test } from '@jest/globals';
import Api from '../../../../src/api';
import Scope from '../../../../src/runtime/scope';
import { UnimplementedError } from '../../../../src/errors';
import { AsyncFunc } from '../../../../src/api/types';
import { JbString } from '../../../../src/runtime/types';

describe('NetSuite functions', function() {
  test('NetSuiteGetSelectValue()', async function() {
    const func = Api.getFunc("NetSuiteGetSelectValue");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("netSuiteOrg"),
        new JbString("recordType"),
        new JbString("field"),
        new JbString("sublist")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('NetSuiteGetServerTime()', async function() {
    const func = Api.getFunc("NetSuiteGetServerTime");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("netSuiteOrg")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('NetSuiteLogin()', async function() {
    const func = Api.getFunc("NetSuiteLogin");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("netSuiteOrg")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });
});
