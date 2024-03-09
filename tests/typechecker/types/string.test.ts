import { TcError } from "../../../src/errors";
import { StringType } from "../../../src/typechecker/types";

describe('String inference', function() {
  describe('unary operators', function() {
    test("!string", function() {
      const result = StringType.unop("!");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test("+string", function() {
      expect(function() { StringType.unop("+"); }).toThrow(TcError);
    });

    test("-string", function() {
      const result = StringType.unop("-");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test("++string", function() {
      const result = StringType.unop("++");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test("--string", function() {
      const result = StringType.unop("--");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });
  });

  describe('string op number', function() {
    test('string + number', function() {
      const result = StringType.binop("+", "number");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('string - number', function() {
      const result = StringType.binop("-", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string * number', function() {
      const result = StringType.binop("*", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string / number', function() {
      const result = StringType.binop("/", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string ^ number', function() {
      const result = StringType.binop("^", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string > number', function() {
      const result = StringType.binop(">", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string < number', function() {
      const result = StringType.binop("<", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string >= number', function() {
      const result = StringType.binop(">=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string <= number', function() {
      const result = StringType.binop("<=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string == number', function() {
      const result = StringType.binop("==", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string != number', function() {
      const result = StringType.binop("!=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string && number', function() {
      const result = StringType.binop("&&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string & number', function() {
      const result = StringType.binop("&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string || number', function() {
      const result = StringType.binop("||", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string | number', function() {
      const result = StringType.binop("|", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('string op string', function() {
    test('string + string', function() {
      const result = StringType.binop("+", "string");
      expect(result.type).toStrictEqual("string");
    });

    test('string - string', function() {
      const result = StringType.binop("-", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string * string', function() {
      const result = StringType.binop("*", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string / string', function() {
      const result = StringType.binop("/", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string ^ string', function() {
      const result = StringType.binop("^", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string > string', function() {
      const result = StringType.binop(">", "string");
      expect(result.type).toStrictEqual("bool");
    });

    test('string < string', function() {
      const result = StringType.binop("<", "string");
      expect(result.type).toStrictEqual("bool");
    });

    test('string >= string', function() {
      const result = StringType.binop(">=", "string");
      expect(result.type).toStrictEqual("bool");
    });

    test('string <= string', function() {
      const result = StringType.binop("<=", "string");
      expect(result.type).toStrictEqual("bool");
    });

    test('string == string', function() {
      const result = StringType.binop("==", "string");
      expect(result.type).toStrictEqual("bool");
    });

    test('string != string', function() {
      const result = StringType.binop("!=", "string");
      expect(result.type).toStrictEqual("bool");
    });

    test('string && string', function() {
      const result = StringType.binop("&&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string & string', function() {
      const result = StringType.binop("&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string || string', function() {
      const result = StringType.binop("||", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | string', function() {
      const result = StringType.binop("|", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('string op bool', function() {
    test('string + bool', function() {
      const result = StringType.binop("+", "bool");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('string - bool', function() {
      const result = StringType.binop("-", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string * bool', function() {
      const result = StringType.binop("*", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string / bool', function() {
      const result = StringType.binop("/", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string ^ bool', function() {
      const result = StringType.binop("^", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string > bool', function() {
      const result = StringType.binop(">", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string < bool', function() {
      const result = StringType.binop("<", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string >= bool', function() {
      const result = StringType.binop(">=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string <= bool', function() {
      const result = StringType.binop("<=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string == bool', function() {
      const result = StringType.binop("==", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string != bool', function() {
      const result = StringType.binop("!=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string && bool', function() {
      const result = StringType.binop("&&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string & bool', function() {
      const result = StringType.binop("&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string || bool', function() {
      const result = StringType.binop("||", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string | bool', function() {
      const result = StringType.binop("|", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('string op null', function() {
    test('string + null', function() {
      const result = StringType.binop("+", "null");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('string - null', function() {
      const result = StringType.binop("-", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string * null', function() {
      const result = StringType.binop("*", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string / null', function() {
      const result = StringType.binop("/", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string ^ null', function() {
      const result = StringType.binop("^", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string > null', function() {
      const result = StringType.binop(">", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string < null', function() {
      const result = StringType.binop("<", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string >= null', function() {
      const result = StringType.binop(">=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string <= null', function() {
      const result = StringType.binop("<=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string == null', function() {
      const result = StringType.binop("==", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string != null', function() {
      const result = StringType.binop("!=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string && null', function() {
      const result = StringType.binop("&&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string & null', function() {
      const result = StringType.binop("&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string || null', function() {
      const result = StringType.binop("||", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string | null', function() {
      const result = StringType.binop("|", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('string op array', function() {
    test('string + array', function() {
      const result = StringType.binop("+", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number - array', function() {
      const result = StringType.binop("-", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number * array', function() {
      const result = StringType.binop("*", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number / array', function() {
      const result = StringType.binop("/", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number ^ array', function() {
      const result = StringType.binop("^", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number > array', function() {
      const result = StringType.binop(">", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number < array', function() {
      const result = StringType.binop("<", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number >= array', function() {
      const result = StringType.binop(">=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number <= array', function() {
      const result = StringType.binop("<=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number == array', function() {
      const result = StringType.binop("==", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number != array', function() {
      const result = StringType.binop("!=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('number && array', function() {
      const result = StringType.binop("&&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number & array', function() {
      const result = StringType.binop("&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number || array', function() {
      const result = StringType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('number | array', function() {
      const result = StringType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('string op dictionary', function() {
    test('string + dictionary', function() {
      const result = StringType.binop("+", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string - dictionary', function() {
      const result = StringType.binop("-", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string * dictionary', function() {
      const result = StringType.binop("*", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string / dictionary', function() {
      const result = StringType.binop("/", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string ^ dictionary', function() {
      const result = StringType.binop("^", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string > dictionary', function() {
      const result = StringType.binop(">", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string < dictionary', function() {
      const result = StringType.binop("<", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string >= dictionary', function() {
      const result = StringType.binop(">=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string <= dictionary', function() {
      const result = StringType.binop("<=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string == dictionary', function() {
      const result = StringType.binop("==", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string != dictionary', function() {
      const result = StringType.binop("!=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string && dictionary', function() {
      const result = StringType.binop("&&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string & dictionary', function() {
      const result = StringType.binop("&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string || dictionary', function() {
      const result = StringType.binop("||", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string | dictionary', function() {
      const result = StringType.binop("|", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('string op binary', function() {
    test('string + binary', function() {
      const result = StringType.binop("+", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string - binary', function() {
      const result = StringType.binop("-", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string * binary', function() {
      const result = StringType.binop("*", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string / binary', function() {
      const result = StringType.binop("/", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string ^ binary', function() {
      const result = StringType.binop("^", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string > binary', function() {
      const result = StringType.binop(">", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string < binary', function() {
      const result = StringType.binop("<", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string >= binary', function() {
      const result = StringType.binop(">=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string <= binary', function() {
      const result = StringType.binop("<=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string == binary', function() {
      const result = StringType.binop("==", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string != binary', function() {
      const result = StringType.binop("!=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string && binary', function() {
      const result = StringType.binop("&&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string & binary', function() {
      const result = StringType.binop("&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string || binary', function() {
      const result = StringType.binop("||", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string | binary', function() {
      const result = StringType.binop("|", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('string op date', function() {
    test('string + date', function() {
      const result = StringType.binop("+", "date");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('string - date', function() {
      const result = StringType.binop("-", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string * date', function() {
      const result = StringType.binop("*", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string / date', function() {
      const result = StringType.binop("/", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string ^ date', function() {
      const result = StringType.binop("^", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('string > date', function() {
      const result = StringType.binop(">", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string < date', function() {
      const result = StringType.binop("<", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string >= date', function() {
      const result = StringType.binop(">=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string <= date', function() {
      const result = StringType.binop("<=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string == date', function() {
      const result = StringType.binop("==", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string != date', function() {
      const result = StringType.binop("!=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string && date', function() {
      const result = StringType.binop("&&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string & date', function() {
      const result = StringType.binop("&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string || date', function() {
      const result = StringType.binop("||", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('string | date', function() {
      const result = StringType.binop("|", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });
});
