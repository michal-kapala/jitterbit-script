import { NumberType } from "../../../src/typechecker/types";

describe('Number inference', function() {
  describe('unary operators', function() {
    test("!number", function() {
      const result = NumberType.unop("!");
      expect(result.type).toStrictEqual("bool");
    });

    test("+number", function() {
      const result = NumberType.unop("+");
      expect(result.type).toStrictEqual("number");
    });

    test("-number", function() {
      const result = NumberType.unop("-");
      expect(result.type).toStrictEqual("number");
    });

    test("++number", function() {
      const result = NumberType.unop("++");
      expect(result.type).toStrictEqual("number");
    });

    test("--number", function() {
      const result = NumberType.unop("--");
      expect(result.type).toStrictEqual("number");
    });
  });

  describe('number op number', function() {
    test('number + number', function() {
      const result = NumberType.binop("+", "number");
      expect(result.type).toStrictEqual("number");
    });

    test('number - number', function() {
      const result = NumberType.binop("-", "number");
      expect(result.type).toStrictEqual("number");
    });

    test('number * number', function() {
      const result = NumberType.binop("*", "number");
      expect(result.type).toStrictEqual("number");
    });

    test('number / number', function() {
      const result = NumberType.binop("/", "number");
      expect(result.type).toStrictEqual("number");
    });

    test('number ^ number', function() {
      const result = NumberType.binop("^", "number");
      expect(result.type).toStrictEqual("number");
    });

    test('number > number', function() {
      const result = NumberType.binop(">", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number < number', function() {
      const result = NumberType.binop("<", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number >= number', function() {
      const result = NumberType.binop(">=", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number <= number', function() {
      const result = NumberType.binop("<=", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number == number', function() {
      const result = NumberType.binop("==", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number != number', function() {
      const result = NumberType.binop("!=", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number && number', function() {
      const result = NumberType.binop("&&", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number & number', function() {
      const result = NumberType.binop("&", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number || number', function() {
      const result = NumberType.binop("||", "number");
      expect(result.type).toStrictEqual("bool");
    });

    test('number | number', function() {
      const result = NumberType.binop("|", "number");
      expect(result.type).toStrictEqual("bool");
    });
  });

  describe('number op string', function() {
    test('number + string', function() {
      const result = NumberType.binop("+", "string");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('number - string', function() {
      const result = NumberType.binop("-", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number * string', function() {
      const result = NumberType.binop("*", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number / string', function() {
      const result = NumberType.binop("/", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number ^ string', function() {
      const result = NumberType.binop("^", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number > string', function() {
      const result = NumberType.binop(">", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number < string', function() {
      const result = NumberType.binop("<", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number >= string', function() {
      const result = NumberType.binop(">=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number <= string', function() {
      const result = NumberType.binop("<=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number == string', function() {
      const result = NumberType.binop("==", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number != string', function() {
      const result = NumberType.binop("!=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number && string', function() {
      const result = NumberType.binop("&&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number & string', function() {
      const result = NumberType.binop("&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number || string', function() {
      const result = NumberType.binop("||", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | string', function() {
      const result = NumberType.binop("|", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('number op bool', function() {
    test('number + bool', function() {
      const result = NumberType.binop("+", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number - bool', function() {
      const result = NumberType.binop("-", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number * bool', function() {
      const result = NumberType.binop("*", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number / bool', function() {
      const result = NumberType.binop("/", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number ^ bool', function() {
      const result = NumberType.binop("^", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number > bool', function() {
      const result = NumberType.binop(">", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number < bool', function() {
      const result = NumberType.binop("<", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number >= bool', function() {
      const result = NumberType.binop(">=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number <= bool', function() {
      const result = NumberType.binop("<=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number == bool', function() {
      const result = NumberType.binop("==", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number != bool', function() {
      const result = NumberType.binop("!=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number && bool', function() {
      const result = NumberType.binop("&&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number & bool', function() {
      const result = NumberType.binop("&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number || bool', function() {
      const result = NumberType.binop("||", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | bool', function() {
      const result = NumberType.binop("|", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('number op null', function() {
    test('number + null', function() {
      const result = NumberType.binop("+", "null");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('number - null', function() {
      const result = NumberType.binop("-", "null");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('number * null', function() {
      const result = NumberType.binop("*", "null");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('number / null', function() {
      const result = NumberType.binop("/", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number ^ null', function() {
      const result = NumberType.binop("^", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number > null', function() {
      const result = NumberType.binop(">", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number < null', function() {
      const result = NumberType.binop("<", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number >= null', function() {
      const result = NumberType.binop(">=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number <= null', function() {
      const result = NumberType.binop("<=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number == null', function() {
      const result = NumberType.binop("==", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number != null', function() {
      const result = NumberType.binop("!=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number && null', function() {
      const result = NumberType.binop("&&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number & null', function() {
      const result = NumberType.binop("&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number || null', function() {
      const result = NumberType.binop("||", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | null', function() {
      const result = NumberType.binop("|", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('number op array', function() {
    test('number + array', function() {
      const result = NumberType.binop("+", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number - array', function() {
      const result = NumberType.binop("-", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number * array', function() {
      const result = NumberType.binop("*", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number / array', function() {
      const result = NumberType.binop("/", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number ^ array', function() {
      const result = NumberType.binop("^", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number > array', function() {
      const result = NumberType.binop(">", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number < array', function() {
      const result = NumberType.binop("<", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number >= array', function() {
      const result = NumberType.binop(">=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number <= array', function() {
      const result = NumberType.binop("<=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number == array', function() {
      const result = NumberType.binop("==", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number != array', function() {
      const result = NumberType.binop("!=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number && array', function() {
      const result = NumberType.binop("&&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number & array', function() {
      const result = NumberType.binop("&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number || array', function() {
      const result = NumberType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | array', function() {
      const result = NumberType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('number op dictionary', function() {
    test('number + dictionary', function() {
      const result = NumberType.binop("+", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number - dictionary', function() {
      const result = NumberType.binop("-", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number * dictionary', function() {
      const result = NumberType.binop("*", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number / dictionary', function() {
      const result = NumberType.binop("/", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number ^ dictionary', function() {
      const result = NumberType.binop("^", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number > dictionary', function() {
      const result = NumberType.binop(">", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number < dictionary', function() {
      const result = NumberType.binop("<", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number >= dictionary', function() {
      const result = NumberType.binop(">=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number <= dictionary', function() {
      const result = NumberType.binop("<=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number == dictionary', function() {
      const result = NumberType.binop("==", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number != dictionary', function() {
      const result = NumberType.binop("!=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number && dictionary', function() {
      const result = NumberType.binop("&&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number & dictionary', function() {
      const result = NumberType.binop("&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number || array', function() {
      const result = NumberType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | array', function() {
      const result = NumberType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('number op binary', function() {
    test('number + binary', function() {
      const result = NumberType.binop("+", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number - binary', function() {
      const result = NumberType.binop("-", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number * binary', function() {
      const result = NumberType.binop("*", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number / binary', function() {
      const result = NumberType.binop("/", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number ^ binary', function() {
      const result = NumberType.binop("^", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number > binary', function() {
      const result = NumberType.binop(">", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number < binary', function() {
      const result = NumberType.binop("<", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number >= binary', function() {
      const result = NumberType.binop(">=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number <= binary', function() {
      const result = NumberType.binop("<=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number == binary', function() {
      const result = NumberType.binop("==", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number != binary', function() {
      const result = NumberType.binop("!=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number && binary', function() {
      const result = NumberType.binop("&&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number & binary', function() {
      const result = NumberType.binop("&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number || binary', function() {
      const result = NumberType.binop("||", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | binary', function() {
      const result = NumberType.binop("|", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('number op date', function() {
    test('number + date', function() {
      const result = NumberType.binop("+", "date");
      expect(result.type).toStrictEqual("date");
      expect(result.warning).toBeDefined();
    });

    test('number - date', function() {
      const result = NumberType.binop("-", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number * date', function() {
      const result = NumberType.binop("*", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number / date', function() {
      const result = NumberType.binop("/", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number ^ date', function() {
      const result = NumberType.binop("^", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('number > date', function() {
      const result = NumberType.binop(">", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number < date', function() {
      const result = NumberType.binop("<", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number >= date', function() {
      const result = NumberType.binop(">=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number <= date', function() {
      const result = NumberType.binop("<=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number == date', function() {
      const result = NumberType.binop("==", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number != date', function() {
      const result = NumberType.binop("!=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number && date', function() {
      const result = NumberType.binop("&&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number & date', function() {
      const result = NumberType.binop("&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number || date', function() {
      const result = NumberType.binop("||", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | date', function() {
      const result = NumberType.binop("|", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });
});
