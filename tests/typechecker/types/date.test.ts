import { TcError } from "../../../src/errors";
import { DateType } from "../../../src/typechecker/types";

describe('Date inference', function() {
  describe('unary operators', function() {
    test("!date", function() {
      const result = DateType.unop("!");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("+date", function() {
      expect(function() { DateType.unop("+"); }).toThrow(TcError);
    });

    test("-date", function() {
      const result = DateType.unop("-");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("++date", function() {
      const result = DateType.unop("++");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("--date", function() {
      const result = DateType.unop("--");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });
  });

  describe('date op number', function() {
    test('date + number', function() {
      const result = DateType.binop("+", "number");
      expect(result.type).toStrictEqual("date");
      expect(result.warning).toBeDefined();
    });

    test('date - number', function() {
      const result = DateType.binop("-", "number");
      expect(result.type).toStrictEqual("date");
      expect(result.warning).toBeDefined();
    });

    test('date * number', function() {
      const result = DateType.binop("*", "number");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('date / number', function() {
      const result = DateType.binop("/", "number");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('date ^ number', function() {
      const result = DateType.binop("^", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date > number', function() {
      const result = DateType.binop(">", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date < number', function() {
      const result = DateType.binop("<", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date >= number', function() {
      const result = DateType.binop(">=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date <= number', function() {
      const result = DateType.binop("<=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date == number', function() {
      const result = DateType.binop("==", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date != number', function() {
      const result = DateType.binop("!=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date && number', function() {
      const result = DateType.binop("&&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date & number', function() {
      const result = DateType.binop("&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date || number', function() {
      const result = DateType.binop("||", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date | number', function() {
      const result = DateType.binop("|", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('date op string', function() {
    test('date + string', function() {
      const result = DateType.binop("+", "string");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('date - string', function() {
      const result = DateType.binop("-", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date * string', function() {
      const result = DateType.binop("*", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date / string', function() {
      const result = DateType.binop("/", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date ^ string', function() {
      const result = DateType.binop("^", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date > string', function() {
      const result = DateType.binop(">", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date < string', function() {
      const result = DateType.binop("<", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date >= string', function() {
      const result = DateType.binop(">=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date <= string', function() {
      const result = DateType.binop("<=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date == string', function() {
      const result = DateType.binop("==", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date != string', function() {
      const result = DateType.binop("!=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date && string', function() {
      const result = DateType.binop("&&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date & string', function() {
      const result = DateType.binop("&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date || string', function() {
      const result = DateType.binop("||", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date | string', function() {
      const result = DateType.binop("|", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('date op bool', function() {
    test('date + bool', function() {
      const result = DateType.binop("+", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date - bool', function() {
      const result = DateType.binop("-", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date * bool', function() {
      const result = DateType.binop("*", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date / bool', function() {
      const result = DateType.binop("/", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date ^ bool', function() {
      const result = DateType.binop("^", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date > bool', function() {
      const result = DateType.binop(">", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date < bool', function() {
      const result = DateType.binop("<", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date >= bool', function() {
      const result = DateType.binop(">=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date <= bool', function() {
      const result = DateType.binop("<=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date == bool', function() {
      const result = DateType.binop("==", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date != bool', function() {
      const result = DateType.binop("!=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date && bool', function() {
      const result = DateType.binop("&&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date & bool', function() {
      const result = DateType.binop("&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date || bool', function() {
      const result = DateType.binop("||", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date | bool', function() {
      const result = DateType.binop("|", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('date op null', function() {
    test('date + null', function() {
      const result = DateType.binop("+", "null");
      expect(result.type).toStrictEqual("date");
      expect(result.warning).toBeDefined();
    });

    test('date - null', function() {
      const result = DateType.binop("-", "null");
      expect(result.type).toStrictEqual("date");
      expect(result.warning).toBeDefined();
    });

    test('date * null', function() {
      const result = DateType.binop("*", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date / null', function() {
      const result = DateType.binop("/", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date ^ null', function() {
      const result = DateType.binop("^", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date > null', function() {
      const result = DateType.binop(">", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date < null', function() {
      const result = DateType.binop("<", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date >= null', function() {
      const result = DateType.binop(">=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date <= null', function() {
      const result = DateType.binop("<=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date == null', function() {
      const result = DateType.binop("==", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date != null', function() {
      const result = DateType.binop("!=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date && null', function() {
      const result = DateType.binop("&&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date & null', function() {
      const result = DateType.binop("&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date || null', function() {
      const result = DateType.binop("||", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date | null', function() {
      const result = DateType.binop("|", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('date op array', function() {
    test('date + array', function() {
      const result = DateType.binop("+", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date - array', function() {
      const result = DateType.binop("-", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date * array', function() {
      const result = DateType.binop("*", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date / array', function() {
      const result = DateType.binop("/", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date ^ array', function() {
      const result = DateType.binop("^", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date > array', function() {
      const result = DateType.binop(">", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date < array', function() {
      const result = DateType.binop("<", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date >= array', function() {
      const result = DateType.binop(">=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date <= array', function() {
      const result = DateType.binop("<=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date == array', function() {
      const result = DateType.binop("==", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date != array', function() {
      const result = DateType.binop("!=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('date && array', function() {
      const result = DateType.binop("&&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date & array', function() {
      const result = DateType.binop("&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date || array', function() {
      const result = DateType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date | array', function() {
      const result = DateType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('date op dictionary', function() {
    test('date + dictionary', function() {
      const result = DateType.binop("+", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date - dictionary', function() {
      const result = DateType.binop("-", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date * dictionary', function() {
      const result = DateType.binop("*", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date / dictionary', function() {
      const result = DateType.binop("/", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date ^ dictionary', function() {
      const result = DateType.binop("^", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date > dictionary', function() {
      const result = DateType.binop(">", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date < dictionary', function() {
      const result = DateType.binop("<", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date >= dictionary', function() {
      const result = DateType.binop(">=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date <= dictionary', function() {
      const result = DateType.binop("<=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date == dictionary', function() {
      const result = DateType.binop("==", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date != dictionary', function() {
      const result = DateType.binop("!=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date && dictionary', function() {
      const result = DateType.binop("&&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date & dictionary', function() {
      const result = DateType.binop("&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date || dictionary', function() {
      const result = DateType.binop("||", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date | dictionary', function() {
      const result = DateType.binop("|", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('date op binary', function() {
    test('date + binary', function() {
      const result = DateType.binop("+", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date - binary', function() {
      const result = DateType.binop("-", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date * binary', function() {
      const result = DateType.binop("*", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date / binary', function() {
      const result = DateType.binop("/", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date ^ binary', function() {
      const result = DateType.binop("^", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date > binary', function() {
      const result = DateType.binop(">", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date < binary', function() {
      const result = DateType.binop("<", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date >= binary', function() {
      const result = DateType.binop(">=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date <= binary', function() {
      const result = DateType.binop("<=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date == binary', function() {
      const result = DateType.binop("==", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date != binary', function() {
      const result = DateType.binop("!=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date && binary', function() {
      const result = DateType.binop("&&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date & binary', function() {
      const result = DateType.binop("&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date || binary', function() {
      const result = DateType.binop("||", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date | binary', function() {
      const result = DateType.binop("|", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('date op date', function() {
    test('date + date', function() {
      const result = DateType.binop("+", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date - date', function() {
      const result = DateType.binop("-", "date");
      expect(result.type).toStrictEqual("number");
      expect(result.warning).toBeDefined();
    });

    test('date * date', function() {
      const result = DateType.binop("*", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date / date', function() {
      const result = DateType.binop("/", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date ^ date', function() {
      const result = DateType.binop("^", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('date > date', function() {
      const result = DateType.binop(">", "date");
      expect(result.type).toStrictEqual("bool");
    });

    test('date < date', function() {
      const result = DateType.binop("<", "date");
      expect(result.type).toStrictEqual("bool");
    });

    test('date >= date', function() {
      const result = DateType.binop(">=", "date");
      expect(result.type).toStrictEqual("bool");
    });

    test('date <= date', function() {
      const result = DateType.binop("<=", "date");
      expect(result.type).toStrictEqual("bool");
    });

    test('date == date', function() {
      const result = DateType.binop("==", "date");
      expect(result.type).toStrictEqual("bool");
    });

    test('date != date', function() {
      const result = DateType.binop("!=", "date");
      expect(result.type).toStrictEqual("bool");
    });

    test('date && date', function() {
      const result = DateType.binop("&&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date & date', function() {
      const result = DateType.binop("&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date || date', function() {
      const result = DateType.binop("||", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('date | date', function() {
      const result = DateType.binop("|", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });
});
