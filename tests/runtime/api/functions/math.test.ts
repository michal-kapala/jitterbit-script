import { Api } from "../../../../src/api";
import { RuntimeError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbDictionary, JbNumber, JbString } from "../../../../src/runtime/types";

describe('Math functions', function() {
  describe('Ceiling()', function() {
    test('Ceiling(number) - positive', function() {
      const func = Api.getFunc("Ceiling");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(13579.1)], new Scope())
      ).toStrictEqual(new JbNumber(13580));
    });

    test('Ceiling(number) - negative', function() {
      const func = Api.getFunc("Ceiling");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-13579.1)], new Scope())
      ).toStrictEqual(new JbNumber(-13579));
    });

    test('Ceiling(string) - parsable', function() {
      const func = Api.getFunc("Ceiling");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("-1.34xyz")], new Scope())
      ).toStrictEqual(new JbNumber(-1));
    });

    test('Ceiling(string) - NaN', function() {
      const func = Api.getFunc("Ceiling");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("hello there")], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });

    test('Ceiling(dictionary)', function() {
      const func = Api.getFunc("Ceiling");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow(RuntimeError);
    });
  });
  
  describe('Exp()', function() {
    test('Exp(2)', function() {
      const func = Api.getFunc("Exp");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const result = func?.call([new JbNumber(2)], new Scope());
      expect(result?.type).toStrictEqual("number");
      expect((result as JbNumber).value).toBeCloseTo(7.38905609893065, 14);
    });

    test('Exp(0)', function() {
      const func = Api.getFunc("Exp");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(0)], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });

    test('Exp(-1)', function() {
      const func = Api.getFunc("Exp");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const result = func?.call([new JbNumber(-1)], new Scope());
      expect(result?.type).toStrictEqual("number");
      expect((result as JbNumber).value).toBeCloseTo(0.36787944117144233, 14);
    });

    test('Exp(string) - NaN', function() {
      const func = Api.getFunc("Exp");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("whatever")], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  });

  describe('Floor()', function() {
    test('Floor(number) - positive', function() {
      const func = Api.getFunc("Floor");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(13579.1)], new Scope())
      ).toStrictEqual(new JbNumber(13579));
    });

    test('Floor(number) - negative', function() {
      const func = Api.getFunc("Floor");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-13579.1)], new Scope())
      ).toStrictEqual(new JbNumber(-13580));
    });

    test('Floor(string) - parsable', function() {
      const func = Api.getFunc("Floor");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("-1.34xyz")], new Scope())
      ).toStrictEqual(new JbNumber(-2));
    });

    test('Floor(string) - NaN', function() {
      const func = Api.getFunc("Floor");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("hello there")], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });

    test('Floor(dictionary)', function() {
      const func = Api.getFunc("Floor");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('Log()', function() {
    test('Log(2)', function() {
      const func = Api.getFunc("Log");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const result = func?.call([new JbNumber(2)], new Scope());
      expect(result?.type).toStrictEqual("number");
      expect((result as JbNumber).value).toBeCloseTo(0.6931471805599453 , 14);
    });

    test('Log(0)', function() {
      const func = Api.getFunc("Log");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(0)], new Scope())
      }).toThrow(RuntimeError);
    });

    test('Log(-1)', function() {
      const func = Api.getFunc("Log");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(-1)], new Scope())
      }).toThrow(RuntimeError);
    });

    test('Log(string) - NaN', function() {
      const func = Api.getFunc("Log");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("whatever")], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('Log10()', function() {
    test('Log10(2)', function() {
      const func = Api.getFunc("Log10");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const result = func?.call([new JbNumber(2)], new Scope());
      expect(result?.type).toStrictEqual("number");
      expect((result as JbNumber).value).toBeCloseTo(0.3010299956639812, 14);
    });

    test('Log10(0)', function() {
      const func = Api.getFunc("Log10");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(0)], new Scope())
      }).toThrow(RuntimeError);
    });

    test('Log10(-1)', function() {
      const func = Api.getFunc("Log10");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(-1)], new Scope())
      }).toThrow(RuntimeError);
    });

    test('Log10(string) - NaN', function() {
      const func = Api.getFunc("Log10");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbString("whatever")], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('Mod()', function() {
    test('Mod(123.3, 3.3)', function() {
      const func = Api.getFunc("Mod");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(123.3), new JbNumber(3.3)], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });

    test('Mod(-123, 0)', function() {
      const func = Api.getFunc("Mod");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-123), new JbNumber(0)], new Scope())
      ).toStrictEqual(new JbNumber(-123));
    });

    test('Mod(-13, 7)', function() {
      const func = Api.getFunc("Mod");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-13), new JbNumber(7)], new Scope())
      ).toStrictEqual(new JbNumber(-6));
    });

    test('Mod(number, string) - NaN', function() {
      const func = Api.getFunc("Mod");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(14), new JbString("whatever")], new Scope())
      ).toStrictEqual(new JbNumber(14));
    });
  });

  describe('Pow()', function() {
    test('Pow(123.3, 3.3)', function() {
      const func = Api.getFunc("Pow");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const result = func?.call([new JbNumber(123.3), new JbNumber(3.3)], new Scope());
      expect(result?.type).toStrictEqual("number");
      expect((result as JbNumber).value).toBeCloseTo(7946541.444625663, 8);
    });

    test('Pow(-123, 0)', function() {
      const func = Api.getFunc("Pow");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-123), new JbNumber(0)], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });

    test('Pow(-13, 7)', function() {
      const func = Api.getFunc("Pow");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-13), new JbNumber(7)], new Scope())
      ).toStrictEqual(new JbNumber(-62748517));
    });

    test('Pow(number, dictionary)', function() {
      const func = Api.getFunc("Pow");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(14), new JbDictionary()], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('Round()', function() {
    test('Round(123.123456789, 7.7)', function() {
      const func = Api.getFunc("Round");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(123.123456789), new JbNumber(7.7)], new Scope())
      ).toStrictEqual(new JbString("123.1234568"));
    });

    test('Round(123.123456789, -7.7)', function() {
      const func = Api.getFunc("Round");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(123.123456789), new JbNumber(-7.7)], new Scope())
      }).toThrow(RuntimeError);
    });

    test('Round(-13.3215)', function() {
      const func = Api.getFunc("Round");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-13.3215)], new Scope())
      ).toStrictEqual(new JbString("-13"));
    });

    test('Round(number, dictionary)', function() {
      const func = Api.getFunc("Round");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(14), new JbDictionary()], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('RoundToInt()', function() {
    test('RoundToInt(123.123456789)', function() {
      const func = Api.getFunc("RoundToInt");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(123.123456789)], new Scope())
      ).toStrictEqual(new JbNumber(123));
    });

    test('RoundToInt(123.5)', function() {
      const func = Api.getFunc("RoundToInt");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(123.5)], new Scope())
      ).toStrictEqual(new JbNumber(124));
    });

    test('RoundToInt(-13.3215)', function() {
      const func = Api.getFunc("RoundToInt");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-13.3215)], new Scope())
      ).toStrictEqual(new JbNumber(-13));
    });

    test('RoundToInt(-13.6215)', function() {
      const func = Api.getFunc("RoundToInt");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(-13.6215)], new Scope())
      ).toStrictEqual(new JbNumber(-14));
    });

    test('RoundToInt(dictionary)', function() {
      const func = Api.getFunc("RoundToInt");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbDictionary()], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('Sqrt()', function() {
    test('Sqrt(2.25)', function() {
      const func = Api.getFunc("Sqrt");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(2.25)], new Scope())
      ).toStrictEqual(new JbNumber(1.5));
    });

    test('Sqrt(0)', function() {
      const func = Api.getFunc("Sqrt");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbNumber(0)], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });

    test('Sqrt(-1)', function() {
      const func = Api.getFunc("Sqrt");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(function() {
        func?.call([new JbNumber(-1)], new Scope())
      }).toThrow(RuntimeError);
    });
  });
});
