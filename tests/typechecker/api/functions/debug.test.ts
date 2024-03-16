import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Debug functions', function() {
  test('DebugBreak()', function() {
    const script = `<trans>result = DebugBreak()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DebugBreak(bool)', function() {
    const script = `<trans>tz = DebugBreak(false)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DebugBreak(string)', function() {
    const script = `<trans>tz = DebugBreak("true")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });
});
