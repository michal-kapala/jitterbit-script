import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Logical functions', function() {
  describe('Case()', function() {
    test('Case(even args)', async function() {
      const script = `<trans>
msg = Case(
  $condition == true, x=1,
  $condition == false, x=0; y=Null(),
  true, x=-1;
);
</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("null");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("null");
      expect(result.vars[4].type).toStrictEqual("number");
      expect(result.vars[5].type).toStrictEqual("null");
      expect(result.vars[6].type).toStrictEqual("number");
      // unassigned global + 2x cross-type comparison
      expect(result.diagnostics.length).toStrictEqual(3);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
      expect(result.diagnostics[2].error).toStrictEqual(false);
    });

    test('Case(odd args)', async function() {
      const script = `<trans>
msg = Case(
  $condition == true, x=1,
  $condition == false, x=0; y=Null(),
  true
);
</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("null");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("null");
      expect(result.vars[4].type).toStrictEqual("number");
      expect(result.vars[5].type).toStrictEqual("null");
      // unassigned global + 2x cross-type comparison + missing expression
      expect(result.diagnostics.length).toStrictEqual(4);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
      expect(result.diagnostics[2].error).toStrictEqual(false);
      expect(result.diagnostics[3].error).toStrictEqual(false);
    });
  });

  describe('Equal()', function() {
    test('Equal(array, array)', async function() {
      const script = `<trans>equal = Equal(arr1={}, arr2={1,2})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Equal(string, string)', async function() {
      const script = `<trans>equal = Equal(str1="", str2="something")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Equal(string, binary)', async function() {
      const script = `<trans>equal = Equal(str="AAAA", bin=HexToBinary("65656565"))</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("binary");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('If()', function() {
    test('If(bool, void)', async function() {
      const script = `<trans>result = If(cond=true, void=CancelOperation("some operation"))</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("bool");
      expect(result.vars[2].type).toStrictEqual("void");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('If(bool, array, array)', async function() {
      const script = `<trans>result = If(cond=true, arr1=Array(), arr2=Array())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("array");
      expect(result.vars[1].type).toStrictEqual("bool");
      expect(result.vars[2].type).toStrictEqual("array");
      expect(result.vars[3].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('If(number, array, dictionary)', async function() {
      const script = `<trans>result = If(cond=4, arr=Array(), dict=Map())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("array");
      expect(result.vars[3].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('While()', function() {
    test('While(bool, string)', async function() {
      const script = `<trans>
i=0;
result = While(cond=i<5, log=WriteToOperationLog(i++););
</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("null");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.vars[3].type).toStrictEqual("number");
      expect(result.vars[4].type).toStrictEqual("string");
      expect(result.vars[5].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('While(number, unassigned)', async function() {
      const script = `<trans>i=0; result = While(cond=i, log;);</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("null");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("number");
      expect(result.vars[4].type).toStrictEqual("error");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(true);
    });
  });
});
