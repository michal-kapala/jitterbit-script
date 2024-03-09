import { TcError } from "../../../src/errors";
import { NullType } from "../../../src/typechecker/types";

describe('Null inference', function() {
  describe('unary operators', function() {
    test("!null", function() {
      const result = NullType.unop("!");
      expect(result.type).toStrictEqual("bool");
    });

    test("+null", function() {
      expect(function() { NullType.unop("+"); }).toThrow(TcError);
    });

    test("-null", function() {
      const result = NullType.unop("-");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("++null", function() {
      const result = NullType.unop("++");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("--null", function() {
      const result = NullType.unop("--");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });
  });

  describe('null op number', function() {
    test('null + number', function() {
      const result = NullType.binop("+", "number");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('null - number', function() {
      const result = NullType.binop("-", "number");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('null * number', function() {
      const result = NullType.binop("*", "number");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('null / number', function() {
      const result = NullType.binop("/", "number");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('null ^ number', function() {
      const result = NullType.binop("^", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null > number', function() {
      const result = NullType.binop(">", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null < number', function() {
      const result = NullType.binop("<", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null >= number', function() {
      const result = NullType.binop(">=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null <= number', function() {
      const result = NullType.binop("<=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null == number', function() {
      const result = NullType.binop("==", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null != number', function() {
      const result = NullType.binop("!=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null && number', function() {
      const result = NullType.binop("&&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null & number', function() {
      const result = NullType.binop("&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null || number', function() {
      const result = NullType.binop("||", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null | number', function() {
      const result = NullType.binop("|", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('null op string', function() {
    test('null + string', function() {
      const result = NullType.binop("+", "string");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('null - string', function() {
      const result = NullType.binop("-", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null * string', function() {
      const result = NullType.binop("*", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null / string', function() {
      const result = NullType.binop("/", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null ^ string', function() {
      const result = NullType.binop("^", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null > string', function() {
      const result = NullType.binop(">", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null < string', function() {
      const result = NullType.binop("<", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null >= string', function() {
      const result = NullType.binop(">=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null <= string', function() {
      const result = NullType.binop("<=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null == string', function() {
      const result = NullType.binop("==", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null != string', function() {
      const result = NullType.binop("!=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null && string', function() {
      const result = NullType.binop("&&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null & string', function() {
      const result = NullType.binop("&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null || string', function() {
      const result = NullType.binop("||", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null | string', function() {
      const result = NullType.binop("|", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('null op bool', function() {
    test('null + bool', function() {
      const result = NullType.binop("+", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null - bool', function() {
      const result = NullType.binop("-", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null * bool', function() {
      const result = NullType.binop("*", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null / bool', function() {
      const result = NullType.binop("/", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null ^ bool', function() {
      const result = NullType.binop("^", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null > bool', function() {
      const result = NullType.binop(">", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null < bool', function() {
      const result = NullType.binop("<", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null >= bool', function() {
      const result = NullType.binop(">=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null <= bool', function() {
      const result = NullType.binop("<=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null == bool', function() {
      const result = NullType.binop("==", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null != bool', function() {
      const result = NullType.binop("!=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null && bool', function() {
      const result = NullType.binop("&&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null & bool', function() {
      const result = NullType.binop("&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null || bool', function() {
      const result = NullType.binop("||", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null | bool', function() {
      const result = NullType.binop("|", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('null op null', function() {
    test('null + null', function() {
      const result = NullType.binop("+", "null");
      expect(result.type).toStrictEqual("null");
    });

    test('null - null', function() {
      const result = NullType.binop("-", "null");
      expect(result.type).toStrictEqual("null");
    });

    test('null * null', function() {
      const result = NullType.binop("*", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null / null', function() {
      const result = NullType.binop("/", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null ^ null', function() {
      const result = NullType.binop("^", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null > null', function() {
      const result = NullType.binop(">", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null < null', function() {
      const result = NullType.binop("<", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null >= null', function() {
      const result = NullType.binop(">=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null <= null', function() {
      const result = NullType.binop("<=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null == null', function() {
      const result = NullType.binop("==", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null != null', function() {
      const result = NullType.binop("!=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null && null', function() {
      const result = NullType.binop("&&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null & null', function() {
      const result = NullType.binop("&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null || null', function() {
      const result = NullType.binop("||", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null | null', function() {
      const result = NullType.binop("|", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('null op array', function() {
    test('null + array', function() {
      const result = NullType.binop("+", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null - array', function() {
      const result = NullType.binop("-", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null * array', function() {
      const result = NullType.binop("*", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null / array', function() {
      const result = NullType.binop("/", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null ^ array', function() {
      const result = NullType.binop("^", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null > array', function() {
      const result = NullType.binop(">", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null < array', function() {
      const result = NullType.binop("<", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null >= array', function() {
      const result = NullType.binop(">=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null <= array', function() {
      const result = NullType.binop("<=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null == array', function() {
      const result = NullType.binop("==", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null != array', function() {
      const result = NullType.binop("!=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('null && array', function() {
      const result = NullType.binop("&&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null & array', function() {
      const result = NullType.binop("&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null || array', function() {
      const result = NullType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null | array', function() {
      const result = NullType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('null op dictionary', function() {
    test('null + dictionary', function() {
      const result = NullType.binop("+", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null - dictionary', function() {
      const result = NullType.binop("-", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null * dictionary', function() {
      const result = NullType.binop("*", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null / dictionary', function() {
      const result = NullType.binop("/", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null ^ dictionary', function() {
      const result = NullType.binop("^", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null > dictionary', function() {
      const result = NullType.binop(">", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null < dictionary', function() {
      const result = NullType.binop("<", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null >= dictionary', function() {
      const result = NullType.binop(">=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null <= dictionary', function() {
      const result = NullType.binop("<=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null == dictionary', function() {
      const result = NullType.binop("==", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null != dictionary', function() {
      const result = NullType.binop("!=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null && dictionary', function() {
      const result = NullType.binop("&&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null & dictionary', function() {
      const result = NullType.binop("&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null || dictionary', function() {
      const result = NullType.binop("||", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null | dictionary', function() {
      const result = NullType.binop("|", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('null op binary', function() {
    test('null + binary', function() {
      const result = NullType.binop("+", "binary");
      expect(result.type).toStrictEqual("binary");
      expect(result.warning).toBeDefined();
    });

    test('null - binary', function() {
      const result = NullType.binop("-", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null * binary', function() {
      const result = NullType.binop("*", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null / binary', function() {
      const result = NullType.binop("/", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null ^ binary', function() {
      const result = NullType.binop("^", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null > binary', function() {
      const result = NullType.binop(">", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null < binary', function() {
      const result = NullType.binop("<", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null >= binary', function() {
      const result = NullType.binop(">=", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null <= binary', function() {
      const result = NullType.binop("<=", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null == binary', function() {
      const result = NullType.binop("==", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null != binary', function() {
      const result = NullType.binop("!=", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null && binary', function() {
      const result = NullType.binop("&&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null & binary', function() {
      const result = NullType.binop("&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null || binary', function() {
      const result = NullType.binop("||", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null | binary', function() {
      const result = NullType.binop("|", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('null op date', function() {
    test('null + date', function() {
      const result = NullType.binop("+", "date");
      expect(result.type).toStrictEqual("date");
      expect(result.warning).toBeDefined();
    });

    test('null - date', function() {
      const result = NullType.binop("-", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null * date', function() {
      const result = NullType.binop("*", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null / date', function() {
      const result = NullType.binop("/", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null ^ date', function() {
      const result = NullType.binop("^", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('null > date', function() {
      const result = NullType.binop(">", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null < date', function() {
      const result = NullType.binop("<", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null >= date', function() {
      const result = NullType.binop(">=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null <= date', function() {
      const result = NullType.binop("<=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null == date', function() {
      const result = NullType.binop("==", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null != date', function() {
      const result = NullType.binop("!=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null && date', function() {
      const result = NullType.binop("&&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null & date', function() {
      const result = NullType.binop("&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null || date', function() {
      const result = NullType.binop("||", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('null | date', function() {
      const result = NullType.binop("|", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });
});
