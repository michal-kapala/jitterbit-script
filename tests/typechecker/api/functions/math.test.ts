import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Math functions', function() {
  describe('Ceiling()', function() {
    test('Ceiling(number)', function() {
      const script = `<trans>ceil = Ceiling(nb=14.564)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Ceiling(string)', function() {
      const script = `<trans>ceil = Ceiling(nb="14.564")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Exp()', function() {
    test('Exp(number)', function() {
      const script = `<trans>exp = Exp(nb=14.564)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Exp(string)', function() {
      const script = `<trans>exp = Exp(nb="14.564")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Floor()', function() {
    test('Floor(number)', function() {
      const script = `<trans>floor = Floor(nb=-14.564)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Floor(string)', function() {
      const script = `<trans>floor = Floor(nb="14.564")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Log()', function() {
    test('Log(number)', function() {
      const script = `<trans>ln = Log(nb=14.564)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Log(string)', function() {
      const script = `<trans>ln = Log(nb="14.564")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Log10()', function() {
    test('Log10(number)', function() {
      const script = `<trans>log = Log10(nb=14.564)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Log10(string)', function() {
      const script = `<trans>log = Log10(nb="14.564")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Mod()', function() {
    test('Mod(number, number)', function() {
      const script = `<trans>mod = Mod(num=14.564, denom=2)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Mod(string, string)', function() {
      const script = `<trans>mod = Mod(num="14.564", denom="2")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('Pow()', function() {
    test('Pow(number, number)', function() {
      const script = `<trans>pow = Pow(base=14.564, exp=2)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Pow(string, string)', function() {
      const script = `<trans>pow = Pow(base="14.564", exp="2")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('Round()', function() {
    test('Round(number, number)', function() {
      const script = `<trans>rounded = Round(d=14.564, prec=2)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Round(string, string)', function() {
      const script = `<trans>rounded = Round(d="14.564", prec="2")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('RoundToInt()', function() {
    test('RoundToInt(number)', function() {
      const script = `<trans>rounded = RoundToInt(nb=14.564)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('RoundToInt(string)', function() {
      const script = `<trans>rounded = RoundToInt(nb="14.564")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Sqrt()', function() {
    test('Sqrt(number)', function() {
      const script = `<trans>sqrt = Sqrt(nb=14.564)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Sqrt(string)', function() {
      const script = `<trans>sqrt = Sqrt(nb="14.564")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });
});
