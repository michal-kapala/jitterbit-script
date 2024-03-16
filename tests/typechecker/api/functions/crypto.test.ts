import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Crypto functions', function() {
  test('AESDecryption()', function() {
    const script = `<trans>
decrypted = AESDecryption(
  enc = "534tg#%t3",
  pass = "xd",
  salt = "1234",
  len = 321,
  iters = 25
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("number");
    expect(result.vars[4].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('AESEncryption()', function() {
    const script = `<trans>
encrypted = AESEncryption(
  plain = "hello",
  pass = "xd",
  salt = "1234",
  len = 321,
  iters = 25
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("number");
    expect(result.vars[4].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Base64Decode(binary)', function() {
    const script = `<trans>decoded = Base64Decode(bin = HexToBinary("ABCDEF"))</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("binary");
    expect(result.vars[1].type).toStrictEqual("binary");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Base64Encode()', function() {
    const script = `<trans>encoded = Base64Encode(bin = HexToBinary("ABCDEF"))</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("binary");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Base64EncodeFile(string, bool)', function() {
    const script = `<trans>encoded = Base64EncodeFile(srcId = "<TAG>some path</TAG>", false);</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('MD5()', function() {
    const script = `<trans>hash = MD5(value = Null());</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('MD5AsTwoNumbers()', function() {
    const script = `<trans>numbers = MD5AsTwoNumbers(value = Null());</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('SHA256()', function() {
    const script = `<trans>hash = SHA256(value = HexToBinary("123456"));</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("binary");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });
});
