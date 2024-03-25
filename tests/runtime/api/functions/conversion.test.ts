import { describe, expect, test } from '@jest/globals';
import Api from '../../../../src/api';
import Scope from '../../../../src/runtime/scope';
import {
  JbArray,
  JbBinary,
  JbBool,
  JbDate,
  JbDictionary,
  JbNull,
  JbNumber,
  JbString
} from '../../../../src/runtime/types';
import { RuntimeError } from '../../../../src/errors';
import { makeDate } from '../../../utils';

describe('Conversion functions', function() {
  test('BinaryToHex()', function() {
    const func = Api.getFunc("BinaryToHex");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([new JbBinary(new Uint8Array([186, 77, 240, 13]))], new Scope())
    ).toStrictEqual(new JbString("ba4df00d"));
  });

  test('BinaryToUUID()', function() {
    const func = Api.getFunc("BinaryToUUID");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([new JbBinary(new Uint8Array([
        186, 77, 240, 13, 186, 77, 240, 13, 186, 77, 240, 13, 186, 77, 240, 13
      ]))], new Scope())
    ).toStrictEqual(new JbString("ba4df00d-ba4d-f00d-ba4d-f00dba4df00d"));
  });

  describe('Bool()', function() {
    test('Bool(bool)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbBool(true)], new Scope())
      ).toStrictEqual(new JbBool(true));
    });
  
    test('Bool(number)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-5.2)], new Scope())
      ).toStrictEqual(new JbBool(true));
    });
  
    test('Bool(0)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(0)], new Scope())
      ).toStrictEqual(new JbBool(false));
    });
  
    test('Bool(string)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("This is some piece of casual text.")], new Scope())
      ).toStrictEqual(new JbBool(false));
    });
  
    test('Bool("true")', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("true")], new Scope())
      ).toStrictEqual(new JbBool(true));
    });
  
    test('Bool("-.1x2")', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("-.1x2")], new Scope())
      ).toStrictEqual(new JbBool(true));
    });
  
    test('Bool(null)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNull()], new Scope())
      ).toStrictEqual(new JbBool(false));
    });
  
    test('Bool(array)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbArray()], new Scope())
      }).toThrow(`Transform Error: DE_TYPE_CONVERT_FAILED`);
    });
  
    test('Bool(dictionary)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow(`Transform Error: DE_TYPE_CONVERT_FAILED`);
    });
  
    test('Bool(binary)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbBinary()], new Scope())
      }).toThrow(`Transform Error: DE_TYPE_CONVERT_FAILED`);
    });
  
    test('Bool(date)', function() {
      const func = Api.getFunc("Bool");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDate()], new Scope())
      }).toThrow(`Transform Error: DE_TYPE_CONVERT_FAILED`);
    });
  });
  
  describe('Date()', function() {
    test('Date(bool)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbBool(true)], new Scope())
      }).toThrow(new RuntimeError(`Cannot convert a bool to a date object`));
    });
  
    test('Date(number)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = makeDate("1969-12-31T23:59:55.000Z");
      date.isUTC = false;
      expect(
        func?.call([new JbNumber(-5.2)], new Scope())
      ).toStrictEqual(date);
    });
  
    test('Date(0)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = makeDate("1970-01-01T00:00:00.000Z");
      date.isUTC = false;
      expect(
        func?.call([new JbNumber(0)], new Scope())
      ).toStrictEqual(date);
    });
  
    test('Date(string)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("This is some piece of casual text.")], new Scope())
      }).toThrow(RuntimeError);
    });
  
    test('Date("true")', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("true")], new Scope())
      }).toThrow(RuntimeError);
    });
  
    test('Date("(M)M/(D)D/YY")', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(makeDate("1/13/24"));
    });
  
    test('Date(null)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original function returns null
      expect(function() {
        func?.call([new JbNull()], new Scope())
      }).toThrow('Cannot convert null to a date object');
    });
  
    test('Date(array)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbArray()], new Scope())
      }).toThrow('Cannot convert array to a date object');
    });
  
    test('Date(dictionary)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow('Cannot convert dictionary to a date object');
    });
  
    test('Date(binary)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbBinary()], new Scope())
      }).toThrow('Cannot convert binary to a date object');
    });
  
    test('Date(date)', function() {
      const func = Api.getFunc("Date");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = new JbDate();
      expect(
        func?.call([date], new Scope())
      ).toStrictEqual(date);
    });
  });
  
  describe('Double()', function() {
    test('Double(bool)', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbBool(true)], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('Double(number)', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const num = new JbNumber(-5.2);
      expect(
        func?.call([num], new Scope())
      ).toStrictEqual(num);
    });
  
    test('Double(string)', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("-420.69deez")], new Scope())
      ).toStrictEqual(new JbNumber(-420.69));
    });
  
    test('Double("true")', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("true")], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });
  
    test('Double("(M)M/(D)D/YY")', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('Double(null)', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original behaviour is returning a null
      // that's against the function's return type
      expect(
        func?.call([new JbNull()], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });
  
    test('Double(array)', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original function returns an array of converted elements
      // that's against the function's return type
      expect(function() {
        func?.call([new JbArray()], new Scope())
      }).toThrow('Cannot convert array to a number.');
    });
  
    test('Double(dictionary)', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow('Transform Error: DE_TYPE_CONVERT_FAILED');
    });
  
    test('Double(binary)', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbBinary()], new Scope())
      }).toThrow('Transform Error: DE_TYPE_CONVERT_FAILED');
    });
  
    test('Double(date)', function() {
      const func = Api.getFunc("Double");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = makeDate("2024-01-13T00:00:00.000Z");
      expect(
        func?.call([date], new Scope())
      ).toStrictEqual(new JbNumber(1705104000));
    });
  });

  describe('Float()', function() {
    test('Float(bool)', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbBool(true)], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('Float(number)', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const num = new JbNumber(-5.2);
      expect(
        func?.call([num], new Scope())
      ).toStrictEqual(num);
    });
  
    test('Float(string)', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("-420.69deez")], new Scope())
      ).toStrictEqual(new JbNumber(-420.69));
    });
  
    test('Float("true")', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("true")], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });
  
    test('Float("(M)M/(D)D/YY")', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('Float(null)', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original behaviour is returning a null
      // that's against the function's return type
      expect(
        func?.call([new JbNull()], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });
  
    test('Float(array)', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original function returns an array of converted elements
      // that's against the function's return type
      expect(function() {
        func?.call([new JbArray()], new Scope())
      }).toThrow('Cannot convert array to a number.');
    });
  
    test('Float(dictionary)', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow('Transform Error: DE_TYPE_CONVERT_FAILED');
    });
  
    test('Float(binary)', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbBinary()], new Scope())
      }).toThrow('Transform Error: DE_TYPE_CONVERT_FAILED');
    });
  
    test('Float(date)', function() {
      const func = Api.getFunc("Float");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = makeDate("2024-01-13T00:00:00.000Z");
      expect(
        func?.call([date], new Scope())
      ).toStrictEqual(new JbNumber(1705104000));
    });
  });

  describe('HexToBinary()', function() {
    test('HexToBinary(hex)', function() {
      const func = Api.getFunc("HexToBinary");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("BA4DF00D")], new Scope())
      ).toStrictEqual(new JbBinary(new Uint8Array([186, 77, 240, 13])));
    });
  
    test('HexToBinary(invalid hex)', function() {
      const func = Api.getFunc("HexToBinary");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("BA4DF00")], new Scope())
      }).toThrow(RuntimeError);
    });

    test('HexToBinary(invalid type)', function() {
      const func = Api.getFunc("HexToBinary");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(2144600)], new Scope())
      }).toThrow(RuntimeError);
    });
  });
  
  describe('HexToString()', function() {
    test('HexToString(hex) - UTF-8', function() {
      const func = Api.getFunc("HexToString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const scope = new Scope();
      // UTF-8 enabled
      scope.assignVar("$jitterbit.scripting.hex.enable_unicode_support", new JbBool(true));
      expect(
        func?.call([new JbString("BA4DF00D")], scope)
      ).toStrictEqual(new JbString("ºMð\r"));
    });
  
    test('HexToString(hex) - ASCII', function() {
      const func = Api.getFunc("HexToString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // UTF-8 disabled by default
      expect(
        func?.call([new JbString("BA4DF00D")], new Scope())
      ).toStrictEqual(new JbString("�M�\r"));
    });

    test('HexToString(invalid hex)', function() {
      const func = Api.getFunc("HexToString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("BA4DF00")], new Scope())
      }).toThrow(RuntimeError);
    });

    test('HexToString(invalid type)', function() {
      const func = Api.getFunc("HexToString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(2144600)], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('Int()', function() {
    test('Int(bool)', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbBool(true)], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('Int(number)', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const num = new JbNumber(-5.2);
      expect(
        func?.call([num], new Scope())
      ).toStrictEqual(new JbNumber(-5));
    });
  
    test('Int(string)', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("-420.69deez")], new Scope())
      ).toStrictEqual(new JbNumber(-420));
    });
  
    test('Int("true")', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("true")], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });
  
    test('Int("(M)M/(D)D/YY")', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('Int(null)', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original behaviour is returning a null
      // that's against the function's return type
      expect(
        func?.call([new JbNull()], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });
  
    test('Int(array)', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original function returns an array of converted elements
      // that's against the function's return type
      expect(function() {
        func?.call([new JbArray()], new Scope())
      }).toThrow('Cannot convert array to a number.');
    });
  
    test('Int(dictionary)', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow('Transform Error: DE_TYPE_CONVERT_FAILED');
    });
  
    test('Int(binary)', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbBinary()], new Scope())
      }).toThrow('Transform Error: DE_TYPE_CONVERT_FAILED');
    });
  
    test('Int(date)', function() {
      const func = Api.getFunc("Int");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = makeDate("2024-01-13T00:00:00.000Z");
      expect(
        func?.call([date], new Scope())
      ).toStrictEqual(new JbNumber(1705104000));
    });
  });

  describe('Long()', function() {
    test('Long(bool)', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbBool(true)], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('Long(number)', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const num = new JbNumber(-5.2);
      expect(
        func?.call([num], new Scope())
      ).toStrictEqual(new JbNumber(-5));
    });
  
    test('Long(string)', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("-420.69deez")], new Scope())
      ).toStrictEqual(new JbNumber(-420));
    });
  
    test('Long("true")', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("true")], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });
  
    test('Long("(M)M/(D)D/YY")', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('Long(null)', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original behaviour is returning a null
      // that's against the function's return type
      expect(
        func?.call([new JbNull()], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });
  
    test('Long(array)', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: the original function returns an array of converted elements
      // that's against the function's return type
      expect(function() {
        func?.call([new JbArray()], new Scope())
      }).toThrow('Cannot convert array to a number.');
    });
  
    test('Long(dictionary)', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow('Transform Error: DE_TYPE_CONVERT_FAILED');
    });
  
    test('Long(binary)', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbBinary()], new Scope())
      }).toThrow('Transform Error: DE_TYPE_CONVERT_FAILED');
    });
  
    test('Long(date)', function() {
      const func = Api.getFunc("Long");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = makeDate("2024-01-13T00:00:00.000Z");
      expect(
        func?.call([date], new Scope())
      ).toStrictEqual(new JbNumber(1705104000));
    });
  });

  describe('String()', function() {
    test('String(bool)', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbBool(true)], new Scope())
      ).toStrictEqual(new JbString("1"));
    });
  
    test('String(number)', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-5.2)], new Scope())
      ).toStrictEqual(new JbString("-5.2"));
    });
  
    test('String(string)', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const str = new JbString("-420.69deez");
      expect(
        func?.call([str], new Scope())
      ).toStrictEqual(str);
    });
  
    test('String("true")', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const str = new JbString("true");
      expect(
        func?.call([str], new Scope())
      ).toStrictEqual(str);
    });
  
    test('String("(M)M/(D)D/YY")', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const str = new JbString("1/13/24");
      expect(
        func?.call([str], new Scope())
      ).toStrictEqual(str);
    });
  
    test('String(null)', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNull()], new Scope())
      ).toStrictEqual(new JbString("null"));
    });
  
    test('String(array)', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbArray([new JbString("nice"), new JbNull()])], new Scope())
      ).toStrictEqual(new JbString('{nice,null}'));
    });
  
    test('String(dictionary)', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = new JbDictionary();
      dict.set(new JbString("testKey"), new JbString("the value"));
      dict.set(new JbString("deez"), new JbNumber(13));
      // POD: the original implementation sorts the KV pairs by key
      // this implementation returns a FIFO representation
      expect(
        func?.call([dict], new Scope())
      ).toStrictEqual(new JbString('[testKey=>"the value",deez=>"13"]'));
    });
  
    test('String(binary)', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbBinary(new Uint8Array([186, 77, 240, 13]))], new Scope())
      ).toStrictEqual(new JbString('ba4df00d'));
    });
  
    test('String(date)', function() {
      const func = Api.getFunc("String");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const date = makeDate("2024-01-13T00:00:00.000Z");
      expect(
        func?.call([date], new Scope())
      ).toStrictEqual(new JbString("2024-01-13 00:00:00"));
    });
  });

  describe('StringToHex()', function() {
    test('StringToHex() - UTF-8', function() {
      const func = Api.getFunc("StringToHex");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const scope = new Scope();
      // UTF-8 enabled
      scope.assignVar("$jitterbit.scripting.hex.enable_unicode_support", new JbBool(true));
      expect(
        func?.call([new JbString("ºMð\r")], scope)
      ).toStrictEqual(new JbString("ba4df00d"));
    });
  
    test('StringToHex() - ASCII', function() {
      const func = Api.getFunc("StringToHex");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // UTF-8 disabled by default
      expect(
        func?.call([new JbString("ºMð\r")], new Scope())
      ).toStrictEqual(new JbString("c2ba4dc3b00d"));
    });

    test('StringToHex(invalid type)', function() {
      const func = Api.getFunc("StringToHex");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(2144600)], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('UUIDToBinary()', function() {
    test('UUIDToBinary(uuid)', function() {
      const func = Api.getFunc("UUIDToBinary");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("2f46dad9-e5c2-457e-b1fd-ad1b49b99aff")], new Scope())
      ).toStrictEqual(
        new JbBinary(new Uint8Array([
          47, 70, 218, 217, 229, 194, 69, 126, 177, 253, 173, 27, 73, 185, 154, 255
        ]))
      );
    });

    test('UUIDToBinary() - invalid length', function() {
      const func = Api.getFunc("UUIDToBinary");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("2f46dad9-e5c2-45-b1fd-ad1b49b99aff")], new Scope())
      }).toThrow(RuntimeError);
    });

    test('UUIDToBinary() - invalid characters', function() {
      const func = Api.getFunc("UUIDToBinary");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("Qf46dad9-e5c2-457e-b1fd_ad1b49b99aff")], new Scope())
      }).toThrow(RuntimeError);
    });

    test('UUIDToBinary(invalid type)', function() {
      const func = Api.getFunc("UUIDToBinary");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(918273645)], new Scope())
      }).toThrow(RuntimeError);
    });
  });
});
