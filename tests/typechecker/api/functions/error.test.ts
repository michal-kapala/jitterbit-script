import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Error functions', function() {
  test('GetLastError()', function() {
    const script = `<trans>err = GetLastError()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('RaiseError()', function() {
    const script = `<trans>void = RaiseError(msg="whoopsie")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('ResetLastError()', function() {
    const script = `<trans>void = ResetLastError()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SetLastError()', function() {
    const script = `<trans>void = SetLastError(msg="whoopsie")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
