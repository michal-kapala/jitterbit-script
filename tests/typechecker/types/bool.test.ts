import { TcError } from "../../../src/errors";
import { BoolType } from "../../../src/typechecker/types";

describe('Bool inference', function() {
  describe('unary operators', function() {
    test("!bool", function() {
      const result = BoolType.unop("!");
      expect(result.type).toStrictEqual("bool");
    });

    test("+bool", function() {
      expect(function() { BoolType.unop("+"); }).toThrow(TcError);
    });

    test("-bool", function() {
      const result = BoolType.unop("-");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test("++bool", function() {
      const result = BoolType.unop("++");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test("--bool", function() {
      const result = BoolType.unop("--");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('bool op number', function() {
    test('bool + number', function() {
      const result = BoolType.binop("+", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool - number', function() {
      const result = BoolType.binop("-", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool * number', function() {
      const result = BoolType.binop("*", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool / number', function() {
      const result = BoolType.binop("/", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool ^ number', function() {
      const result = BoolType.binop("^", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool > number', function() {
      const result = BoolType.binop(">", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool < number', function() {
      const result = BoolType.binop("<", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool >= number', function() {
      const result = BoolType.binop(">=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool <= number', function() {
      const result = BoolType.binop("<=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool == number', function() {
      const result = BoolType.binop("==", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool != number', function() {
      const result = BoolType.binop("!=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool && number', function() {
      const result = BoolType.binop("&&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool & number', function() {
      const result = BoolType.binop("&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool || number', function() {
      const result = BoolType.binop("||", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool | number', function() {
      const result = BoolType.binop("|", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('bool op string', function() {
    test('bool + string', function() {
      const result = BoolType.binop("+", "string");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('bool - string', function() {
      const result = BoolType.binop("-", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool * string', function() {
      const result = BoolType.binop("*", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool / string', function() {
      const result = BoolType.binop("/", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool ^ string', function() {
      const result = BoolType.binop("^", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool > string', function() {
      const result = BoolType.binop(">", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool < string', function() {
      const result = BoolType.binop("<", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool >= string', function() {
      const result = BoolType.binop(">=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool <= string', function() {
      const result = BoolType.binop("<=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool == string', function() {
      const result = BoolType.binop("==", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool != string', function() {
      const result = BoolType.binop("!=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool && string', function() {
      const result = BoolType.binop("&&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool & string', function() {
      const result = BoolType.binop("&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool || string', function() {
      const result = BoolType.binop("||", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool | string', function() {
      const result = BoolType.binop("|", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('bool op bool', function() {
    test('bool + bool', function() {
      const result = BoolType.binop("+", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool - bool', function() {
      const result = BoolType.binop("-", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool * bool', function() {
      const result = BoolType.binop("*", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool / bool', function() {
      const result = BoolType.binop("/", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool ^ bool', function() {
      const result = BoolType.binop("^", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool > bool', function() {
      const result = BoolType.binop(">", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool < bool', function() {
      const result = BoolType.binop("<", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool >= bool', function() {
      const result = BoolType.binop(">=", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool <= bool', function() {
      const result = BoolType.binop("<=", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool == bool', function() {
      const result = BoolType.binop("==", "bool");
      expect(result.type).toStrictEqual("bool");
    });

    test('bool != bool', function() {
      const result = BoolType.binop("!=", "bool");
      expect(result.type).toStrictEqual("bool");
    });

    test('bool && bool', function() {
      const result = BoolType.binop("&&", "bool");
      expect(result.type).toStrictEqual("bool");
    });

    test('bool & bool', function() {
      const result = BoolType.binop("&", "bool");
      expect(result.type).toStrictEqual("bool");
    });

    test('bool || bool', function() {
      const result = BoolType.binop("||", "bool");
      expect(result.type).toStrictEqual("bool");
    });

    test('bool | bool', function() {
      const result = BoolType.binop("|", "bool");
      expect(result.type).toStrictEqual("bool");
    });
  });

  describe('bool op null', function() {
    test('bool + null', function() {
      const result = BoolType.binop("+", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool - null', function() {
      const result = BoolType.binop("-", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool * null', function() {
      const result = BoolType.binop("*", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool / null', function() {
      const result = BoolType.binop("/", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool ^ null', function() {
      const result = BoolType.binop("^", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool > null', function() {
      const result = BoolType.binop(">", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool < null', function() {
      const result = BoolType.binop("<", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool >= null', function() {
      const result = BoolType.binop(">=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool <= null', function() {
      const result = BoolType.binop("<=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool == null', function() {
      const result = BoolType.binop("==", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool != null', function() {
      const result = BoolType.binop("!=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool && null', function() {
      const result = BoolType.binop("&&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool & null', function() {
      const result = BoolType.binop("&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool || null', function() {
      const result = BoolType.binop("||", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool | null', function() {
      const result = BoolType.binop("|", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('bool op array', function() {
    test('bool + array', function() {
      const result = BoolType.binop("+", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool - array', function() {
      const result = BoolType.binop("-", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool * array', function() {
      const result = BoolType.binop("*", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool / array', function() {
      const result = BoolType.binop("/", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool ^ array', function() {
      const result = BoolType.binop("^", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool > array', function() {
      const result = BoolType.binop(">", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool < array', function() {
      const result = BoolType.binop("<", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool >= array', function() {
      const result = BoolType.binop(">=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool <= array', function() {
      const result = BoolType.binop("<=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool == array', function() {
      const result = BoolType.binop("==", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool != array', function() {
      const result = BoolType.binop("!=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('bool && array', function() {
      const result = BoolType.binop("&&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool & array', function() {
      const result = BoolType.binop("&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool || array', function() {
      const result = BoolType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool | array', function() {
      const result = BoolType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('bool op dictionary', function() {
    test('bool + dictionary', function() {
      const result = BoolType.binop("+", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool - dictionary', function() {
      const result = BoolType.binop("-", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool * dictionary', function() {
      const result = BoolType.binop("*", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool / dictionary', function() {
      const result = BoolType.binop("/", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool ^ dictionary', function() {
      const result = BoolType.binop("^", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool > dictionary', function() {
      const result = BoolType.binop(">", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool < dictionary', function() {
      const result = BoolType.binop("<", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool >= dictionary', function() {
      const result = BoolType.binop(">=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool <= dictionary', function() {
      const result = BoolType.binop("<=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool == dictionary', function() {
      const result = BoolType.binop("==", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool != dictionary', function() {
      const result = BoolType.binop("!=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool && dictionary', function() {
      const result = BoolType.binop("&&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool & dictionary', function() {
      const result = BoolType.binop("&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool || dictionary', function() {
      const result = BoolType.binop("||", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool | dictionary', function() {
      const result = BoolType.binop("|", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('bool op binary', function() {
    test('bool + binary', function() {
      const result = BoolType.binop("+", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool - binary', function() {
      const result = BoolType.binop("-", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool * binary', function() {
      const result = BoolType.binop("*", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool / binary', function() {
      const result = BoolType.binop("/", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool ^ binary', function() {
      const result = BoolType.binop("^", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool > binary', function() {
      const result = BoolType.binop(">", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool < binary', function() {
      const result = BoolType.binop("<", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool >= binary', function() {
      const result = BoolType.binop(">=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool <= binary', function() {
      const result = BoolType.binop("<=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool == binary', function() {
      const result = BoolType.binop("==", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool != binary', function() {
      const result = BoolType.binop("!=", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool && binary', function() {
      const result = BoolType.binop("&&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool & binary', function() {
      const result = BoolType.binop("&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool || binary', function() {
      const result = BoolType.binop("||", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool | binary', function() {
      const result = BoolType.binop("|", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('bool op date', function() {
    test('bool + date', function() {
      const result = BoolType.binop("+", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool - date', function() {
      const result = BoolType.binop("-", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool * date', function() {
      const result = BoolType.binop("*", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool / date', function() {
      const result = BoolType.binop("/", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool ^ date', function() {
      const result = BoolType.binop("^", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('bool > date', function() {
      const result = BoolType.binop(">", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool < date', function() {
      const result = BoolType.binop("<", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool >= date', function() {
      const result = BoolType.binop(">=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool <= date', function() {
      const result = BoolType.binop("<=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool == date', function() {
      const result = BoolType.binop("==", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool != date', function() {
      const result = BoolType.binop("!=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool && date', function() {
      const result = BoolType.binop("&&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool & date', function() {
      const result = BoolType.binop("&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool || date', function() {
      const result = BoolType.binop("||", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('bool | date', function() {
      const result = BoolType.binop("|", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });
});
