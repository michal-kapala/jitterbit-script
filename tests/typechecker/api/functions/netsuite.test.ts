import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('NetSuite functions', function() {
  test('NetSuiteGetSelectValue(string, string, string, string)', async function() {
    const script = `<trans>
value = NetSuiteGetSelectValue(
  org="some NS org",
  recType="some record type",
  field="id",
  sublist="some NS sublist"
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("dictionary");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('NetSuiteGetServerTime(string)', async function() {
    const script = `<trans>time = NetSuiteGetServerTime(org="some org")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('NetSuiteLogin(string)', async function() {
    const script = `<trans>sesId = NetSuiteLogin(org="some org")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
