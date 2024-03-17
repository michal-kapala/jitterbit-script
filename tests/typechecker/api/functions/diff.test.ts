import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Diff functions', function() {
  test('DiffAdd()', function() {
    const script = `<trans>void = DiffAdd()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DiffComplete()', function() {
    const script = `<trans>void = DiffComplete()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DiffDelete()', function() {
    const script = `<trans>void = DiffDelete()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DiffKeyList(bool, string, null)', function() {
    const script = `<trans>void = DiffKeyList(key1=true, key2="col2", key3=Null())</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("bool");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(false);
    expect(result.diagnostics[1].error).toStrictEqual(false);
  });

  test('DiffNode(dictionary)', function() {
    const script = `<trans>void = DiffNode(node=Dict())</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("dictionary");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('DiffUpdate()', function() {
    const script = `<trans>void = DiffUpdate()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('InitializeDiff(string)', function() {
    const script = `<trans>void = InitializeDiff(diffId="some diff id")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('OrderedDiffKeyList(string, bool, array, number)', function() {
    const script = `<trans>
void = OrderedDiffKeyList(
  k1="col1",
  asc1=true,
  k2={},
  asc2=1
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("bool");
    expect(result.vars[3].type).toStrictEqual("array");
    expect(result.vars[4].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(false);
  });

  test('ResetDiff(string, number)', function() {
    const script = `<trans>void = ResetDiff(diffId="some diff id", action=1)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SetDiffChunkSize(bool)', function() {
    const script = `<trans>void = SetDiffChunkSize(size=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });
});
