import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Conversion functions', function() {
  test('BinaryToHex(binary)', function() {
    const script = `<trans>hex = BinaryToHex(bin = HexToBinary("ABCDEF"))</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("binary");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('BinaryToUUID(binary)', function() {
    const script = `<trans>uuid = BinaryToHex(bin = HexToBinary("ABCDEF"))</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("binary");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Bool(binary)', function() {
    const script = `<trans>bool = Bool(bin = HexToBinary("ABCDEF"))</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("binary");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });
  
  test('Date(null)', function() {
    const script = `<trans>date = Date(null = Null())</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("null");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });
  
  test('Double(array)', function() {
    const script = `<trans>dbl = Double(arr = {});</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('Float(null)', function() {
    const script = `<trans>flt = Float(null = Null());</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("null");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('HexToBinary(string)', function() {
    const script = `<trans>bin = HexToBinary("ABCDEF");</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("binary");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
  
  test('HexToString(hex) - UTF-8', function() {
    const script = `<trans>str = HexToString("68656c6c6f");</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Int(dictionary)', function() {
    const script = `<trans>int = Int(dict = Dict());</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("dictionary");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Long(date)', function() {
    const script = `<trans>long = Long(date = Now());</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("date");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('String(unassigned)', function() {
    const script = `<trans>str = String(x);</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("error");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('StringToHex(string)', function() {
    const script = `<trans>str = StringToHex("1234");</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('UUIDToBinary(string)', function() {
    const script = `<trans>bin = UUIDToBinary("0b1f88b9-a4fd-4d9f-8619-6096e7e72826")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("binary");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
