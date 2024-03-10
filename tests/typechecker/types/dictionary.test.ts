import { TcError } from "../../../src/errors";
import { DictionaryType } from "../../../src/typechecker/types";

describe('Dictionary inference', function() {
  describe('unary operators', function() {
    test("!dictionary", function() {
      const result = DictionaryType.unop("!");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("+dictionary", function() {
      expect(function() { DictionaryType.unop("+"); }).toThrow(TcError);
    });

    test("-dictionary", function() {
      const result = DictionaryType.unop("-");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("++dictionary", function() {
      const result = DictionaryType.unop("++");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test("--dictionary", function() {
      const result = DictionaryType.unop("--");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });
  });

  describe('dictionary op number', function() {
    test('dictionary + number', function() {
      const result = DictionaryType.binop("+", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary - number', function() {
      const result = DictionaryType.binop("-", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary * number', function() {
      const result = DictionaryType.binop("*", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary / number', function() {
      const result = DictionaryType.binop("/", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary ^ number', function() {
      const result = DictionaryType.binop("^", "number");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary > number', function() {
      const result = DictionaryType.binop(">", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary < number', function() {
      const result = DictionaryType.binop("<", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary >= number', function() {
      const result = DictionaryType.binop(">=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary <= number', function() {
      const result = DictionaryType.binop("<=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary == number', function() {
      const result = DictionaryType.binop("==", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary != number', function() {
      const result = DictionaryType.binop("!=", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary && number', function() {
      const result = DictionaryType.binop("&&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary & number', function() {
      const result = DictionaryType.binop("&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary || number', function() {
      const result = DictionaryType.binop("||", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary | number', function() {
      const result = DictionaryType.binop("|", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('dictionary op string', function() {
    test('dictionary + string', function() {
      const result = DictionaryType.binop("+", "string");
      expect(result.type).toStrictEqual("string");
      expect(result.warning).toBeDefined();
    });

    test('dictionary - string', function() {
      const result = DictionaryType.binop("-", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary * string', function() {
      const result = DictionaryType.binop("*", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary / string', function() {
      const result = DictionaryType.binop("/", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary ^ string', function() {
      const result = DictionaryType.binop("^", "string");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary > string', function() {
      const result = DictionaryType.binop(">", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary < string', function() {
      const result = DictionaryType.binop("<", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary >= string', function() {
      const result = DictionaryType.binop(">=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary <= string', function() {
      const result = DictionaryType.binop("<=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary == string', function() {
      const result = DictionaryType.binop("==", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary != string', function() {
      const result = DictionaryType.binop("!=", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary && string', function() {
      const result = DictionaryType.binop("&&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary & string', function() {
      const result = DictionaryType.binop("&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary || string', function() {
      const result = DictionaryType.binop("||", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary | string', function() {
      const result = DictionaryType.binop("|", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('dictionary op bool', function() {
    test('dictionary + bool', function() {
      const result = DictionaryType.binop("+", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary - bool', function() {
      const result = DictionaryType.binop("-", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary * bool', function() {
      const result = DictionaryType.binop("*", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary / bool', function() {
      const result = DictionaryType.binop("/", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary ^ bool', function() {
      const result = DictionaryType.binop("^", "bool");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary > bool', function() {
      const result = DictionaryType.binop(">", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary < bool', function() {
      const result = DictionaryType.binop("<", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary >= bool', function() {
      const result = DictionaryType.binop(">=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary <= bool', function() {
      const result = DictionaryType.binop("<=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary == bool', function() {
      const result = DictionaryType.binop("==", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary != bool', function() {
      const result = DictionaryType.binop("!=", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary && bool', function() {
      const result = DictionaryType.binop("&&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary & bool', function() {
      const result = DictionaryType.binop("&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary || bool', function() {
      const result = DictionaryType.binop("||", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary | bool', function() {
      const result = DictionaryType.binop("|", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('dictionary op null', function() {
    test('dictionary + null', function() {
      const result = DictionaryType.binop("+", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary - null', function() {
      const result = DictionaryType.binop("-", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary * null', function() {
      const result = DictionaryType.binop("*", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary / null', function() {
      const result = DictionaryType.binop("/", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary ^ null', function() {
      const result = DictionaryType.binop("^", "null");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary > null', function() {
      const result = DictionaryType.binop(">", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary < null', function() {
      const result = DictionaryType.binop("<", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary >= null', function() {
      const result = DictionaryType.binop(">=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary <= null', function() {
      const result = DictionaryType.binop("<=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary == null', function() {
      const result = DictionaryType.binop("==", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary != null', function() {
      const result = DictionaryType.binop("!=", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary && null', function() {
      const result = DictionaryType.binop("&&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary & null', function() {
      const result = DictionaryType.binop("&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary || null', function() {
      const result = DictionaryType.binop("||", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary | null', function() {
      const result = DictionaryType.binop("|", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('dictionary op array', function() {
    test('dictionary + array', function() {
      const result = DictionaryType.binop("+", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary - array', function() {
      const result = DictionaryType.binop("-", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary * array', function() {
      const result = DictionaryType.binop("*", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary / array', function() {
      const result = DictionaryType.binop("/", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary ^ array', function() {
      const result = DictionaryType.binop("^", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary > array', function() {
      const result = DictionaryType.binop(">", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary < array', function() {
      const result = DictionaryType.binop("<", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary >= array', function() {
      const result = DictionaryType.binop(">=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary <= array', function() {
      const result = DictionaryType.binop("<=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary == array', function() {
      const result = DictionaryType.binop("==", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary != array', function() {
      const result = DictionaryType.binop("!=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('dictionary && array', function() {
      const result = DictionaryType.binop("&&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary & array', function() {
      const result = DictionaryType.binop("&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary || array', function() {
      const result = DictionaryType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary | array', function() {
      const result = DictionaryType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('dictionary op dictionary', function() {
    test('dictionary + dictionary', function() {
      const result = DictionaryType.binop("+", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary - dictionary', function() {
      const result = DictionaryType.binop("-", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary * dictionary', function() {
      const result = DictionaryType.binop("*", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary / dictionary', function() {
      const result = DictionaryType.binop("/", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary ^ dictionary', function() {
      const result = DictionaryType.binop("^", "dictionary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary > dictionary', function() {
      const result = DictionaryType.binop(">", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary < dictionary', function() {
      const result = DictionaryType.binop("<", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary >= dictionary', function() {
      const result = DictionaryType.binop(">=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary <= dictionary', function() {
      const result = DictionaryType.binop("<=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary == dictionary', function() {
      const result = DictionaryType.binop("==", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary != dictionary', function() {
      const result = DictionaryType.binop("!=", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary && dictionary', function() {
      const result = DictionaryType.binop("&&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary & dictionary', function() {
      const result = DictionaryType.binop("&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary || dictionary', function() {
      const result = DictionaryType.binop("||", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary | dictionary', function() {
      const result = DictionaryType.binop("|", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('dictionary op binary', function() {
    test('dictionary + binary', function() {
      const result = DictionaryType.binop("+", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary - binary', function() {
      const result = DictionaryType.binop("-", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary * binary', function() {
      const result = DictionaryType.binop("*", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary / binary', function() {
      const result = DictionaryType.binop("/", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary ^ binary', function() {
      const result = DictionaryType.binop("^", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary > binary', function() {
      const result = DictionaryType.binop(">", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary < binary', function() {
      const result = DictionaryType.binop("<", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary >= binary', function() {
      const result = DictionaryType.binop(">=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary <= binary', function() {
      const result = DictionaryType.binop("<=", "binary");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary == binary', function() {
      const result = DictionaryType.binop("==", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary != binary', function() {
      const result = DictionaryType.binop("!=", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary && binary', function() {
      const result = DictionaryType.binop("&&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary & binary', function() {
      const result = DictionaryType.binop("&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary || binary', function() {
      const result = DictionaryType.binop("||", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary | binary', function() {
      const result = DictionaryType.binop("|", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('dictionary op date', function() {
    test('dictionary + date', function() {
      const result = DictionaryType.binop("+", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary - date', function() {
      const result = DictionaryType.binop("-", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary * date', function() {
      const result = DictionaryType.binop("*", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary / date', function() {
      const result = DictionaryType.binop("/", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary ^ date', function() {
      const result = DictionaryType.binop("^", "date");
      expect(result.type).toStrictEqual("error");
      expect(result.error).toBeDefined();
    });

    test('dictionary > date', function() {
      const result = DictionaryType.binop(">", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary < date', function() {
      const result = DictionaryType.binop("<", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary >= date', function() {
      const result = DictionaryType.binop(">=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary <= date', function() {
      const result = DictionaryType.binop("<=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary == date', function() {
      const result = DictionaryType.binop("==", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary != date', function() {
      const result = DictionaryType.binop("!=", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary && date', function() {
      const result = DictionaryType.binop("&&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary & date', function() {
      const result = DictionaryType.binop("&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary || date', function() {
      const result = DictionaryType.binop("||", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('dictionary | date', function() {
      const result = DictionaryType.binop("|", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });
});
