import Api from "../../../../src/api";
import { UnimplementedError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbBinary, JbNumber, JbString } from "../../../../src/runtime/types";

describe('Crypto functions', function() {
  test('AESDecryption()', function() {
    const func = Api.getFunc("AESDecryption");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([
        new JbString(""),
        new JbString("password"),
        new JbString("00FFAE01"),
        new JbNumber(256),
        new JbNumber(1024)
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('AESEncryption()', function() {
    const func = Api.getFunc("AESEncryption");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("Hello world!"),
        new JbString("password"),
        new JbString("00FFAE01"),
        new JbNumber(256),
        new JbNumber(1024)
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Base64Decode()', function() {
    const func = Api.getFunc("Base64Decode");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbBinary()], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Base64Encode()', function() {
    const func = Api.getFunc("Base64Encode");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("hello there")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Base64EncodeFile()', function() {
    const func = Api.getFunc("Base64EncodeFile");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("srcId"), new JbString("filename")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('MD5()', function() {
    const func = Api.getFunc("MD5");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("hello there")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('MD5AsTwoNumbers()', function() {
    const func = Api.getFunc("MD5AsTwoNumbers");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("hello there")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SHA256()', function() {
    const func = Api.getFunc("SHA256");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("hello there")], new Scope())
    }).toThrow(UnimplementedError);
  });
});
