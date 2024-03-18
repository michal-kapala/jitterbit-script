import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Instance functions', function() {
  describe('Count()', function() {
    test('Count(string)', function() {
      const script = `<trans>nb = Count(de="something")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("null");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('Count(array)', function() {
      const script = `<trans>nb = Count(arr={2,1,3})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  test('CountSourceRecords()', function() {
    const script = `<trans>nb = CountSourceRecords()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('Exist()', function() {
    test('Exist(number, string)', function() {
      const script = `<trans>nb = Exist(val=2, de="something")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });

    test('Exist(number, array)', function() {
      const script = `<trans>nb = Exist(val=2, arr={2,1,3})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('FindByPos()', function() {
    test('FindByPos(number, string)', function() {
      const script = `<trans>nb = FindByPos(pos=2, de="something")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('FindByPos(number, array)', function() {
      const script = `<trans>nb = FindByPos(pos=2, arr={2,1,3})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });
  
  describe('FindValue()', function() {
    test('FindValue(number, string, string)', function() {
      const script = `<trans>value = FindValue(v=2, de1="something", de2="else")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('FindValue(number, array, array)', function() {
      const script = `<trans>value = FindValue(v=2, de1={2}, de2=de1)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("array");
      expect(result.vars[3].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  test('GetInstance()', function() {
    const script = `<trans>instance = GetInstance()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("type");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('Max()', function() {
    test('Max(string)', function() {
      const script = `<trans>value = Max(de="hi")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('Max(array literal)', function() {
      // literals narrow the type
      const script = `<trans>value = Max({2,3,0})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Max(array identifier)', function() {
      // identifiers dont narrow the type
      const script = `<trans>value = Max(arr={2,3,0})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Max(multiple type array literal)', function() {
      // identifiers dont narrow the type
      const script = `<trans>value = Max({2,3,"0"})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });
  });

  describe('Min()', function() {
    test('Min(string)', function() {
      const script = `<trans>value = Min(de="hi")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('Min(array literal)', function() {
      // literals narrow the type
      const script = `<trans>value = Min({2,3,0})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Min(array identifier)', function() {
      // identifiers dont narrow the type
      const script = `<trans>value = Min(arr={2,3,0})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Min(multiple type array literal)', function() {
      // identifiers dont narrow the type
      const script = `<trans>value = Min({2,3,"0"})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });
  });
  
  describe('ResolveOneOf()', function() {
    test('ResolveOneOf(string)', function() {
      const script = `<trans>value = ResolveOneOf(de="hi")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('ResolveOneOf(array identifier)', function() {
      const script = `<trans>value = ResolveOneOf(arr={1})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('ResolveOneOf(array literal)', function() {
      const script = `<trans>value = ResolveOneOf({Null(), 1})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  test('SetInstances(string, array)', function() {
    const script = `<trans>null = SetInstances(de="hi", arr={})</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("null");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SortInstances(string, array, bool, array)', function() {
    const script = `<trans>null = SortInstances(node="hi", arr1={1,2}, order1=true, arr2={4,5})</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("null");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('Sum()', function() {
    test('Sum(string)', function() {
      const script = `<trans>result = Sum(de="hi")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("null");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('Sum(array identifier)', function() {
      const script = `<trans>result = Sum(arr={3,2,1})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Sum(array literal)', function() {
      const script = `<trans>result = Sum({3,2,1})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('SumCSV()', function() {
    test('SumCSV(string)', function() {
      const script = `<trans>result = SumCSV(de="something")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("null");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('SumCSV(array)', function() {
      const script = `<trans>result = SumCSV(arr={3,2,1})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('SumString()', function() {
    test('SumString(string, string, bool)', function() {
      const script = `<trans>result = SumString(de="something", delim=";", omit=true)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("null");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('SumString(array, string, string)', function() {
      const script = `<trans>result = SumString(de={1,2,3}, delim=";", omit='true')</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });
});
