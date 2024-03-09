import { describe, expect, test } from '@jest/globals';
import { Api } from '../../../../src/api';
import Scope from '../../../../src/runtime/scope';
import { UnimplementedError } from '../../../../src/errors';
import { AsyncFunc } from '../../../../src/api/types';
import { JbString } from '../../../../src/runtime/types';

describe('Salesforce functions', function() {
  test('GetSalesforceTimestamp()', async function() {
    const func = Api.getFunc("GetSalesforceTimestamp");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("url"),
        new JbString("sessionId"),
        new JbString("timeZoneId"),
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('LoginToSalesforceAndGetTimeStamp()', async function() {
    const func = Api.getFunc("LoginToSalesforceAndGetTimeStamp");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("salesforceOrg")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SalesforceLogin()', async function() {
    const func = Api.getFunc("SalesforceLogin");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("salesforceOrg")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SetSalesforceSession()', async function() {
    const func = Api.getFunc("SetSalesforceSession");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("salesforceOrg"),
        new JbString("sessionId"),
        new JbString("serverURL")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SfCacheLookup()', async function() {
    const func = Api.getFunc("SfCacheLookup");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("salesforceOrg"),
        new JbString("soql")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SfLookup()', async function() {
    const func = Api.getFunc("SfLookup");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("salesforceOrg"),
        new JbString("soql")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SfLookupAll()', async function() {
    const func = Api.getFunc("SfLookupAll");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("salesforceOrg"),
        new JbString("soql")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SfLookupAllToFile()', async function() {
    const func = Api.getFunc("SfLookupAllToFile");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("salesforceOrg"),
        new JbString("soql"),
        new JbString("targetId")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });
});
