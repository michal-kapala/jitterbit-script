import { describe, expect, test } from '@jest/globals';
import { Api } from '../../../src/api';
import Scope from '../../../src/runtime/scope';
import { JbArray, JbBool, JbNull, JbNumber, JbString } from '../../../src/runtime/types';
import { UnimplementedError } from '../../../src/errors';

describe('Array functions', function() {
  test('Array()', function() {
    const func = Api.getFunc("Array");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([], new Scope())
    ).toStrictEqual(new JbArray());
  });

  test('Collection()', function() {
    const func = Api.getFunc("Collection");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([], new Scope())
    ).toStrictEqual(new JbArray());
  });

  test('GetSourceAttrNames()', function() {
    const func = Api.getFunc("GetSourceAttrNames");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      // node type unsupported
      func?.call([], new Scope())
    }).toThrowError(UnimplementedError);
  });

  test('GetSourceElementNames()', function() {
    const func = Api.getFunc("GetSourceElementNames");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      // node type unsupported
      func?.call([], new Scope())
    }).toThrowError(UnimplementedError);
  });

  test('GetSourceInstanceArray()', function() {
    const func = Api.getFunc("GetSourceInstanceArray");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      // node type unsupported
      func?.call([], new Scope())
    }).toThrowError(UnimplementedError);
  });

  test('GetSourceInstanceElementArray()', function() {
    const func = Api.getFunc("GetSourceInstanceElementArray");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      // node type unsupported
      func?.call([], new Scope())
    }).toThrowError(UnimplementedError);
  });

  test('SortArray() - ascending (default)', function() {
    const func = Api.getFunc("SortArray");
    expect(func).toBeDefined();
    const array = new JbArray([
      new JbNumber(-1.1), new JbString("16"), new JbNumber(0), new JbNumber(22), new JbBool(true)
    ]);
    expect(
      func?.call([array], new Scope())
    ).toStrictEqual(new JbNull());
    expect(array).toStrictEqual(
      new JbArray([
        new JbNumber(-1.1), new JbNumber(0), new JbBool(true),
        new JbString("16"),  new JbNumber(22)
      ])
    );
  });

  test('SortArray() - ascending', function() {
    const func = Api.getFunc("SortArray");
    expect(func).toBeDefined();
    const array = new JbArray([
      new JbNumber(-1.1), new JbString("16"), new JbNumber(0), new JbNumber(22), new JbBool(true)
    ]);
    const ascending = new JbBool(true);
    expect(
      func?.call([array, ascending], new Scope())
    ).toStrictEqual(new JbNull());
    expect(array).toStrictEqual(
      new JbArray([
        new JbNumber(-1.1), new JbNumber(0), new JbBool(true),
        new JbString("16"),  new JbNumber(22)
      ])
    );
  });

  test('SortArray() - descending', function() {
    const func = Api.getFunc("SortArray");
    expect(func).toBeDefined();
    const array = new JbArray([
      new JbNumber(-1.1), new JbString("16"), new JbNumber(0), new JbNumber(22), new JbBool(true)
    ]);
    const ascending = new JbBool(false);
    expect(
      func?.call([array, ascending], new Scope())
    ).toStrictEqual(new JbNull());
    expect(array).toStrictEqual(
      new JbArray([
        new JbNumber(22), new JbString("16"),  new JbBool(true),
        new JbNumber(0), new JbNumber(-1.1)
      ])
    );
  });

  test('SortArray() - index, descending', function() {
    const func = Api.getFunc("SortArray");
    expect(func).toBeDefined();
    const array = new JbArray([
      new JbArray([new JbString("a"), new JbNumber(20), new JbNumber(1)]),
      new JbArray([new JbString("bc"), new JbNumber(7), new JbNumber(12)]),
      new JbArray([new JbString("x"), new JbNumber(20), new JbNumber(13)]),
      new JbArray([new JbString("d"), new JbNumber(5), new JbNumber(4)])
    ]);
    // sorts by 3rd column
    const index = new JbNumber(2);
    const ascending = new JbBool(false);
    expect(
      func?.call([array, index, ascending], new Scope())
    ).toStrictEqual(new JbNull());
    expect(array).toStrictEqual(
      new JbArray([
        new JbArray([new JbString("x"), new JbNumber(20), new JbNumber(13)]),
        new JbArray([new JbString("bc"), new JbNumber(7), new JbNumber(12)]),
        new JbArray([new JbString("d"), new JbNumber(5), new JbNumber(4)]),
        new JbArray([new JbString("a"), new JbNumber(20), new JbNumber(1)])
      ])
    );
  });

  test('ReduceDimension()', function() {
    const func = Api.getFunc("ReduceDimension");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const array = new JbArray([
      new JbArray([
        new JbArray([new JbNumber(1)]),
        new JbArray([new JbNumber(2), new JbString("xd")])
      ]),
      new JbArray([
        new JbArray([new JbNumber(3)]),
        new JbArray([new JbNumber(4)]),
        new JbArray([new JbNumber(5)])
      ])
    ]);
    expect(
      func?.call([array], new Scope())
    ).toStrictEqual(
      new JbArray([
        new JbArray([new JbNumber(1), new JbNumber(2), new JbString("xd")]),
        new JbArray([new JbNumber(3), new JbNumber(4), new JbNumber(5)])
      ])
    );
  });
});
