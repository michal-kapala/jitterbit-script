import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Cache functions', function() {
  test('ReadCache()', async function() {
    const script = `<trans>data = ReadCache(name = "someData", expSec = 30000, scope = "project")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("type");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('WriteCache()', async function() {
    const script = `<trans>data = WriteCache(name = "someData", value = Null(), expSec = 30000, scope = "project")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("null");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.vars[4].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
