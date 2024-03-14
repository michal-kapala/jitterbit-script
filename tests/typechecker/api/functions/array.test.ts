import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Array functions', function() {
  test('Array()', function() {
    const script = `<trans>arr = Array()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
  });

  test('Collection()', function() {
    const script = `<trans>arr = Collection()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
  });

  test('GetSourceAttrNames()', function() {
    const script = `<trans>arr = GetSourceAttrNames("some node")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(1);
  });

  test('GetSourceElementNames()', function() {
    const script = `<trans>arr = GetSourceElementNames(3)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(1);
  });

  test('GetSourceInstanceArray()', function() {
    const script = `<trans>arr = GetSourceInstanceArray(true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(1);
  });

  test('GetSourceInstanceElementArray()', function() {
    const script = `<trans>arr = GetSourceInstanceElementArray($a)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(1);
  });

  test('SortArray()', function() {
    const script = `<trans>arr = SortArray({3,1,2}, true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
  });

  test('ReduceDimension()', function() {
    const script = `<trans>arr = ReduceDimension({ {3,1}, {2} })</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
  });
});
