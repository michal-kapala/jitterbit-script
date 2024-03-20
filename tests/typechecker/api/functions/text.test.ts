import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Text validation functions', function() {
  test('Validate(string, string, bool)', function() {
    const script = `<trans>valid = Validate(op="!=", arg="find me", case=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
  
  test('Validate(bool, bool, string)', function() {
    const script = `<trans>valid = Validate(op=false, arg=true, case="true")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("bool");
    expect(result.vars[2].type).toStrictEqual("bool");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(3);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
    expect(result.diagnostics[2].error).toStrictEqual(false);
  });
});
