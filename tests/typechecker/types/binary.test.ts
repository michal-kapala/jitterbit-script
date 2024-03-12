import { TcError } from "../../../src/errors";
import { BinaryType } from "../../../src/typechecker/types";

describe('Binary inference', function() {
  describe('unary operators', function() {
    test("!binary", function() {
      const result = BinaryType.unop("!");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("+binary", function() {
      expect(function() { BinaryType.unop("+"); }).toThrow(TcError);
    });

    test("-binary", function() {
      const result = BinaryType.unop("-");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("++binary", function() {
      const result = BinaryType.unop("++");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("--binary", function() {
      const result = BinaryType.unop("--");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });
  });

  describe('binary op number', function() {
    test('binary + number', function() {
      const result = BinaryType.binop("+", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary - number', function() {
      const result = BinaryType.binop("-", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary * number', function() {
      const result = BinaryType.binop("*", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary / number', function() {
      const result = BinaryType.binop("/", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary ^ number', function() {
      const result = BinaryType.binop("^", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary > number', function() {
      const result = BinaryType.binop(">", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary < number', function() {
      const result = BinaryType.binop("<", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary >= number', function() {
      const result = BinaryType.binop(">=", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary <= number', function() {
      const result = BinaryType.binop("<=", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary == number', function() {
      const result = BinaryType.binop("==", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary != number', function() {
      const result = BinaryType.binop("!=", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary && number', function() {
      const result = BinaryType.binop("&&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary & number', function() {
      const result = BinaryType.binop("&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary || number', function() {
      const result = BinaryType.binop("||", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary | number', function() {
      const result = BinaryType.binop("|", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('binary op string', function() {
    test('binary + string', function() {
      const result = BinaryType.binop("+", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary - string', function() {
      const result = BinaryType.binop("-", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary * string', function() {
      const result = BinaryType.binop("*", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary / string', function() {
      const result = BinaryType.binop("/", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary ^ string', function() {
      const result = BinaryType.binop("^", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary > string', function() {
      const result = BinaryType.binop(">", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary < string', function() {
      const result = BinaryType.binop("<", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary >= string', function() {
      const result = BinaryType.binop(">=", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary <= string', function() {
      const result = BinaryType.binop("<=", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary == string', function() {
      const result = BinaryType.binop("==", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary != string', function() {
      const result = BinaryType.binop("!=", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary && string', function() {
      const result = BinaryType.binop("&&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary & string', function() {
      const result = BinaryType.binop("&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary || string', function() {
      const result = BinaryType.binop("||", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary | string', function() {
      const result = BinaryType.binop("|", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('binary op bool', function() {
    test('binary + bool', function() {
      const result = BinaryType.binop("+", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary - bool', function() {
      const result = BinaryType.binop("-", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary * bool', function() {
      const result = BinaryType.binop("*", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary / bool', function() {
      const result = BinaryType.binop("/", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary ^ bool', function() {
      const result = BinaryType.binop("^", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary > bool', function() {
      const result = BinaryType.binop(">", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary < bool', function() {
      const result = BinaryType.binop("<", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary >= bool', function() {
      const result = BinaryType.binop(">=", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary <= bool', function() {
      const result = BinaryType.binop("<=", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary == bool', function() {
      const result = BinaryType.binop("==", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary != bool', function() {
      const result = BinaryType.binop("!=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary && bool', function() {
      const result = BinaryType.binop("&&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary & bool', function() {
      const result = BinaryType.binop("&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary || bool', function() {
      const result = BinaryType.binop("||", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary | bool', function() {
      const result = BinaryType.binop("|", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('binary op null', function() {
    test('binary + null', function() {
      const result = BinaryType.binop("+", "null");
      expect(result.type).toStrictEqual("binary");
      expect(result.warning).toBeDefined();
    });

    test('binary - null', function() {
      const result = BinaryType.binop("-", "null");
      expect(result.type).toStrictEqual("binary");
      expect(result.warning).toBeDefined();
    });

    test('binary * null', function() {
      const result = BinaryType.binop("*", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary / null', function() {
      const result = BinaryType.binop("/", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary ^ null', function() {
      const result = BinaryType.binop("^", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary > null', function() {
      const result = BinaryType.binop(">", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary < null', function() {
      const result = BinaryType.binop("<", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary >= null', function() {
      const result = BinaryType.binop(">=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary <= null', function() {
      const result = BinaryType.binop("<=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary == null', function() {
      const result = BinaryType.binop("==", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary != null', function() {
      const result = BinaryType.binop("!=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary && null', function() {
      const result = BinaryType.binop("&&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary & null', function() {
      const result = BinaryType.binop("&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary || null', function() {
      const result = BinaryType.binop("||", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary | null', function() {
      const result = BinaryType.binop("|", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('binary op array', function() {
    test('binary + array', function() {
      const result = BinaryType.binop("+", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary - array', function() {
      const result = BinaryType.binop("-", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary * array', function() {
      const result = BinaryType.binop("*", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary / array', function() {
      const result = BinaryType.binop("/", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary ^ array', function() {
      const result = BinaryType.binop("^", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary > array', function() {
      const result = BinaryType.binop(">", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary < array', function() {
      const result = BinaryType.binop("<", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary >= array', function() {
      const result = BinaryType.binop(">=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary <= array', function() {
      const result = BinaryType.binop("<=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary == array', function() {
      const result = BinaryType.binop("==", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary != array', function() {
      const result = BinaryType.binop("!=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('binary && array', function() {
      const result = BinaryType.binop("&&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary & array', function() {
      const result = BinaryType.binop("&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary || array', function() {
      const result = BinaryType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary | array', function() {
      const result = BinaryType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('binary op dictionary', function() {
    test('binary + dictionary', function() {
      const result = BinaryType.binop("+", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary - dictionary', function() {
      const result = BinaryType.binop("-", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary * dictionary', function() {
      const result = BinaryType.binop("*", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary / dictionary', function() {
      const result = BinaryType.binop("/", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary ^ dictionary', function() {
      const result = BinaryType.binop("^", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary > dictionary', function() {
      const result = BinaryType.binop(">", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary < dictionary', function() {
      const result = BinaryType.binop("<", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary >= dictionary', function() {
      const result = BinaryType.binop(">=", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary <= dictionary', function() {
      const result = BinaryType.binop("<=", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary == dictionary', function() {
      const result = BinaryType.binop("==", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary != dictionary', function() {
      const result = BinaryType.binop("!=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary && dictionary', function() {
      const result = BinaryType.binop("&&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary & dictionary', function() {
      const result = BinaryType.binop("&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary || dictionary', function() {
      const result = BinaryType.binop("||", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary | dictionary', function() {
      const result = BinaryType.binop("|", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('binary op binary', function() {
    test('binary + binary', function() {
      const result = BinaryType.binop("+", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary - binary', function() {
      const result = BinaryType.binop("-", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary * binary', function() {
      const result = BinaryType.binop("*", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary / binary', function() {
      const result = BinaryType.binop("/", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary ^ binary', function() {
      const result = BinaryType.binop("^", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary > binary', function() {
      const result = BinaryType.binop(">", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary < binary', function() {
      const result = BinaryType.binop("<", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary >= binary', function() {
      const result = BinaryType.binop(">=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary <= binary', function() {
      const result = BinaryType.binop("<=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary == binary', function() {
      const result = BinaryType.binop("==", "binary");
      expect(result.type).toStrictEqual("bool");
    });

    test('binary != binary', function() {
      const result = BinaryType.binop("!=", "binary");
      expect(result.type).toStrictEqual("bool");
    });

    test('binary && binary', function() {
      const result = BinaryType.binop("&&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary & binary', function() {
      const result = BinaryType.binop("&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary || binary', function() {
      const result = BinaryType.binop("||", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary | binary', function() {
      const result = BinaryType.binop("|", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('binary op date', function() {
    test('binary + date', function() {
      const result = BinaryType.binop("+", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary - date', function() {
      const result = BinaryType.binop("-", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary * date', function() {
      const result = BinaryType.binop("*", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary / date', function() {
      const result = BinaryType.binop("/", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary ^ date', function() {
      const result = BinaryType.binop("^", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary > date', function() {
      const result = BinaryType.binop(">", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary < date', function() {
      const result = BinaryType.binop("<", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary >= date', function() {
      const result = BinaryType.binop(">=", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary <= date', function() {
      const result = BinaryType.binop("<=", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary == date', function() {
      const result = BinaryType.binop("==", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary != date', function() {
      const result = BinaryType.binop("!=", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('binary && date', function() {
      const result = BinaryType.binop("&&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary & date', function() {
      const result = BinaryType.binop("&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary || date', function() {
      const result = BinaryType.binop("||", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('binary | date', function() {
      const result = BinaryType.binop("|", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });
});
