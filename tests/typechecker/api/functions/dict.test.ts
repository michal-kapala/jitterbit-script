import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Dictionary functions', function() {
  describe('AddToDict', function() {
    test('AddToDict(dictionary, number, string)', function() {
      const script = `<trans>dict = AddToDict(dict=Dict(), key=3, val="new value")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('AddToDict(array, null, string)', function() {
      const script = `<trans>result = AddToDict(arr={}, key=Null(), val="the value")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("null");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(true);
      expect(result.diagnostics[1].error).toStrictEqual(true);
    });

    test('AddToDict(dictionary, null, string)', function() {
      const script = `<trans>dict = AddToDict(dict=Dict(), key=Null(), val="new value")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("null");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });
  });

  test('CollectValues(dictionary, array)', function() {
    const script = `<trans>dict = CollectValues(dict=Dict(), arr={"name1", "name2"})</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("dictionary");
    expect(result.vars[2].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Dict()', function() {
    const script = `<trans>dict = Dict()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("dictionary");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetKeys()', function() {
    const script = `<trans>arr = GetKeys(dict=Dict())</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("dictionary");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetSourceInstanceMap(string)', function() {
    const script = `<trans>dict = GetSourceInstanceMap(n="something")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("dictionary");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('GetSourceInstanceElementMap(number)', function() {
    const script = `<trans>dict = GetSourceInstanceElementMap(n=3)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("dictionary");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  describe('HasKey()', function() {
    test('HasKey(dictionary, string)', function() {
      const script = `<trans>result = HasKey(dict=Dict(), key="the key")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('HasKey(array, number)', function() {
      const script = `<trans>result = HasKey(arr={}, key=42)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(true);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });
  
  test('Map()', function() {
    const script = `<trans>dict = Map()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("dictionary");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('MapCache', function() {
    test('MapCache(dictionary, string, string)', function() {
      const script = `<trans>value = MapCache(dict=Dict(), key="null", def="false")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('MapCache(array, null, bool)', function() {
      const script = `<trans>value = MapCache(arr={}, key=null(), def=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("null");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(3);
      expect(result.diagnostics[0].error).toStrictEqual(true);
      expect(result.diagnostics[1].error).toStrictEqual(false);
      expect(result.diagnostics[2].error).toStrictEqual(false);
    });
  });

  describe('RemoveKey', function() {
    test('RemoveKey(dictionary, string)', function() {
      const script = `<trans>value = RemoveKey(dict=Dict(), key="null")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('RemoveKey(type, null)', function() {
      const script = `<trans>value = RemoveKey(dict=if(true,true,false), key=Null())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("bool");
      expect(result.vars[2].type).toStrictEqual("null");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(true);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });
});
