import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Log functions', function() {
  test('WriteToOperationLog(string)', function() {
    const script = `<trans>msg = WriteToOperationLog(msg="a little bit of important words")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('WriteToOperationLog(array)', function() {
    const script = `<trans>msg = WriteToOperationLog(msg={"please dont format your logs like this"})</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
