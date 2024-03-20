import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Salesforce functions', function() {
  test('GetSalesforceTimestamp(string, string, string)', async function() {
    const script = `<trans>time = GetSalesforceTimestamp(url="some saleforce url", ses="some sesId", tz="GMT")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('LoginToSalesforceAndGetTimeStamp(string, string)', async function() {
    const script = `<trans>time = LoginToSalesforceAndGetTimeStamp(org="some org", tz="GMT")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SalesforceLogin(string)', async function() {
    const script = `<trans>success = SalesforceLogin(org="some org")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SetSalesforceSession(string, string, string)', async function() {
    const script = `<trans>void = SetSalesforceSession(org="some org", ses="sesId", url="sf url")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SfCacheLookup(string, string)', async function() {
    const script = `<trans>result = SfCacheLookup(org="some org", soql="SOQL query")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SfLookup(string, string)', async function() {
    const script = `<trans>result = SfLookup(org="some org", soql="SOQL query")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SfLookupAll(string, string)', async function() {
    const script = `<trans>result = SfLookupAll(org="some org", soql="SOQL query")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SfLookupAllToFile(string, string, string)', async function() {
    const script = `<trans>result = SfLookupAllToFile(org="some org", soql="SOQL query", file="file target")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
