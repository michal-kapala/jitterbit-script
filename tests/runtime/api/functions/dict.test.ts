import { describe, expect, test } from '@jest/globals';
import Api from '../../../../src/api';
import Scope from '../../../../src/runtime/scope';
import { JbArray, JbBool, JbDictionary, JbNull, JbNumber, JbString } from '../../../../src/runtime/types';
import { RuntimeError, UnimplementedError } from '../../../../src/errors';
import { makeDict } from '../../../utils';
import { RuntimeVal } from '../../../../src/runtime/values';

describe('Dictionary functions', function() {
  describe('AddToDict', function() {
    test('AddToDict() - insert', function() {
      const func = Api.getFunc("AddToDict");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key1", new JbString("value1"));
      expect(
        func?.call([dict, new JbString("key2"), new JbString("value2")], new Scope())
      ).toStrictEqual(new JbBool(true));
      expect(dict.toString()).toStrictEqual('[key1=>"value1",key2=>"value2"]');
    });

    test('AddToDict() - upsert', function() {
      const func = Api.getFunc("AddToDict");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key1", new JbString("value1"));
      expect(
        func?.call([dict, new JbString("key1"), new JbString("value2")], new Scope())
      ).toStrictEqual(new JbBool(false));
      expect(dict.toString()).toStrictEqual('[key1=>"value2"]');
    });

    test('AddToDict() - null key', function() {
      const func = Api.getFunc("AddToDict");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key1", new JbString("value1"));
      expect(function() {
        func?.call([dict, new JbNull(), new JbString("value2")], new Scope())
      }).toThrow(RuntimeError);
      expect(dict.toString()).toStrictEqual('[key1=>"value1"]');
    });
  });

  test('CollectValues()', function() {
    const func = Api.getFunc("CollectValues");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const dict = new JbDictionary(new Map<string, RuntimeVal>([
      ["nullKey", new JbNull()],
      ["arrayKey", new JbArray([new JbString("array member")])],
      ["numKey", new JbNumber(13)]
    ]));
    const names = new JbArray([
      new JbString("arrayKey"),
      new JbString("numKey"),
      // non-existent
      new JbString("something")
    ]);
    expect(
      func?.call([dict, names], new Scope())
    ).toStrictEqual(new JbArray([
      new JbArray([new JbString("array member")]),
      new JbNumber(13),
      // non-existent key
      new JbNull()
    ]));
  });

  test('Dict()', function() {
    const func = Api.getFunc("Dict");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([], new Scope())
    ).toStrictEqual(new JbDictionary());
  });

  test('GetKeys()', function() {
    const func = Api.getFunc("GetKeys");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const dict = new JbDictionary(new Map<string, RuntimeVal>([
      ["nullKey", new JbNull()],
      ["arrayKey", new JbArray([new JbString("array member")])],
      ["numKey", new JbNumber(13)]
    ]));
    expect(
      func?.call([dict], new Scope())
    ).toStrictEqual(new JbArray([
      new JbString("nullKey"),
      new JbString("arrayKey"),
      new JbString("numKey")
    ]));
  });

  test('GetSourceInstanceMap()', function() {
    const func = Api.getFunc("GetSourceInstanceMap");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      // node type unsupported
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetSourceInstanceElementMap()', function() {
    const func = Api.getFunc("GetSourceInstanceElementMap");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      // node type unsupported
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  describe('HasKey()', function() {
    test('HasKey() - existing key', function() {
      const func = Api.getFunc("HasKey");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = new JbDictionary(new Map<string, RuntimeVal>([
        ["nullKey", new JbNull()],
        ["arrayKey", new JbArray([new JbString("array member")])],
        ["numKey", new JbNumber(13)]
      ]));
      expect(
        func?.call([dict, new JbString("nullKey")], new Scope())
      ).toStrictEqual(new JbBool(true));
    });

    test('HasKey() - non-existent key', function() {
      const func = Api.getFunc("HasKey");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = new JbDictionary(new Map<string, RuntimeVal>([
        ["nullKey", new JbNull()],
        ["arrayKey", new JbArray([new JbString("array member")])],
        ["numKey", new JbNumber(13)]
      ]));
      expect(
        func?.call([dict, new JbString("stringKey")], new Scope())
      ).toStrictEqual(new JbBool(false));
    });
  });
  
  test('Map()', function() {
    const func = Api.getFunc("Map");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([], new Scope())
    ).toStrictEqual(new JbDictionary());
  });

  describe('MapCache', function() {
    test('MapCache() - existing key', function() {
      const func = Api.getFunc("MapCache");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key1", new JbString("value1"));
      expect(
        func?.call([dict, new JbString("key1"), new JbNumber(-1)], new Scope())
      ).toStrictEqual(new JbString("value1"));
      expect(dict.toString()).toStrictEqual('[key1=>"value1"]');
    });

    test('MapCache() - non-existent key', function() {
      const func = Api.getFunc("MapCache");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key1", new JbString("value1"));
      expect(
        func?.call([dict, new JbString("something"), new JbNumber(-1)], new Scope())
      ).toStrictEqual(new JbString("-1"));
      expect(dict.toString()).toStrictEqual('[key1=>"value1",something=>"-1"]');
      expect(dict.get(new JbString("something"))).toStrictEqual(new JbNumber(-1));
    });
  });

  describe('RemoveKey', function() {
    test('RemoveKey() - existing key', function() {
      const func = Api.getFunc("RemoveKey");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key1", new JbString("value1"));
      expect(
        func?.call([dict, new JbString("key1")], new Scope())
      ).toStrictEqual(new JbBool(true));
      expect(dict.toString()).toStrictEqual('[]');
    });

    test('RemoveKey() - non-existent key', function() {
      const func = Api.getFunc("RemoveKey");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key1", new JbString("value1"));
      expect(
        func?.call([dict, new JbString("something")], new Scope())
      ).toStrictEqual(new JbBool(false));
      expect(dict.toString()).toStrictEqual('[key1=>"value1"]');
    });

    test('RemoveKey() - null key', function() {
      const func = Api.getFunc("RemoveKey");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("null", new JbString("value1"));
      expect(
        func?.call([dict, new JbNull()], new Scope())
      ).toStrictEqual(new JbBool(false));
      expect(dict.toString()).toStrictEqual('[null=>"value1"]');
    });
  });
});
