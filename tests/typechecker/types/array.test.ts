import { TcError } from "../../../src/errors";
import { ArrayType } from "../../../src/typechecker/types";

describe('Array inference', function() {
  describe('unary operators', function() {
    test("!array", function() {
      const result = ArrayType.unop("!");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test("+array", function() {
      expect(function() { ArrayType.unop("+"); }).toThrow(TcError);
    });

    test("-array", function() {
      const result = ArrayType.unop("-");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test("++array", function() {
      const result = ArrayType.unop("++");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test("--array", function() {
      const result = ArrayType.unop("--");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });
  });

  describe('array op number', function() {
    test('array + number', function() {
      const result = ArrayType.binop("+", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array - number', function() {
      const result = ArrayType.binop("-", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array * number', function() {
      const result = ArrayType.binop("*", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array / number', function() {
      const result = ArrayType.binop("/", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array ^ number', function() {
      const result = ArrayType.binop("^", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array > number', function() {
      const result = ArrayType.binop(">", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array < number', function() {
      const result = ArrayType.binop("<", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array >= number', function() {
      const result = ArrayType.binop(">=", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array <= number', function() {
      const result = ArrayType.binop("<=", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array == number', function() {
      const result = ArrayType.binop("==", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array != number', function() {
      const result = ArrayType.binop("!=", "number");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array && number', function() {
      const result = ArrayType.binop("&&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array & number', function() {
      const result = ArrayType.binop("&", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array || number', function() {
      const result = ArrayType.binop("||", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array | number', function() {
      const result = ArrayType.binop("|", "number");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('array op string', function() {
    test('array + string', function() {
      const result = ArrayType.binop("+", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array - string', function() {
      const result = ArrayType.binop("-", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array * string', function() {
      const result = ArrayType.binop("*", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array / string', function() {
      const result = ArrayType.binop("/", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array ^ string', function() {
      const result = ArrayType.binop("^", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array > string', function() {
      const result = ArrayType.binop(">", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array < string', function() {
      const result = ArrayType.binop("<", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array >= string', function() {
      const result = ArrayType.binop(">=", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array <= string', function() {
      const result = ArrayType.binop("<=", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array == string', function() {
      const result = ArrayType.binop("==", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array != string', function() {
      const result = ArrayType.binop("!=", "string");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array && string', function() {
      const result = ArrayType.binop("&&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array & string', function() {
      const result = ArrayType.binop("&", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array || string', function() {
      const result = ArrayType.binop("||", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array | string', function() {
      const result = ArrayType.binop("|", "string");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('array op bool', function() {
    test('array + bool', function() {
      const result = ArrayType.binop("+", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array - bool', function() {
      const result = ArrayType.binop("-", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array * bool', function() {
      const result = ArrayType.binop("*", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array / bool', function() {
      const result = ArrayType.binop("/", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array ^ bool', function() {
      const result = ArrayType.binop("^", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array > bool', function() {
      const result = ArrayType.binop(">", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array < bool', function() {
      const result = ArrayType.binop("<", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array >= bool', function() {
      const result = ArrayType.binop(">=", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array <= bool', function() {
      const result = ArrayType.binop("<=", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array == bool', function() {
      const result = ArrayType.binop("==", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array != bool', function() {
      const result = ArrayType.binop("!=", "bool");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array && bool', function() {
      const result = ArrayType.binop("&&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array & bool', function() {
      const result = ArrayType.binop("&", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array || bool', function() {
      const result = ArrayType.binop("||", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array | bool', function() {
      const result = ArrayType.binop("|", "bool");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('array op null', function() {
    test('array + null', function() {
      const result = ArrayType.binop("+", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array - null', function() {
      const result = ArrayType.binop("-", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array * null', function() {
      const result = ArrayType.binop("*", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array / null', function() {
      const result = ArrayType.binop("/", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array ^ null', function() {
      const result = ArrayType.binop("^", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array > null', function() {
      const result = ArrayType.binop(">", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array < null', function() {
      const result = ArrayType.binop("<", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array >= null', function() {
      const result = ArrayType.binop(">=", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array <= null', function() {
      const result = ArrayType.binop("<=", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array == null', function() {
      const result = ArrayType.binop("==", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array != null', function() {
      const result = ArrayType.binop("!=", "null");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array && null', function() {
      const result = ArrayType.binop("&&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array & null', function() {
      const result = ArrayType.binop("&", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array || null', function() {
      const result = ArrayType.binop("||", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array | null', function() {
      const result = ArrayType.binop("|", "null");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('array op array', function() {
    test('array + array', function() {
      const result = ArrayType.binop("+", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array - array', function() {
      const result = ArrayType.binop("-", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array * array', function() {
      const result = ArrayType.binop("*", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array / array', function() {
      const result = ArrayType.binop("/", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array ^ array', function() {
      const result = ArrayType.binop("^", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array > array', function() {
      const result = ArrayType.binop(">", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array < array', function() {
      const result = ArrayType.binop("<", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array >= array', function() {
      const result = ArrayType.binop(">=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array <= array', function() {
      const result = ArrayType.binop("<=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array == array', function() {
      const result = ArrayType.binop("==", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array != array', function() {
      const result = ArrayType.binop("!=", "array");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array && array', function() {
      const result = ArrayType.binop("&&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array & array', function() {
      const result = ArrayType.binop("&", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array || array', function() {
      const result = ArrayType.binop("||", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array | array', function() {
      const result = ArrayType.binop("|", "array");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('array op dictionary', function() {
    test('array + dictionary', function() {
      const result = ArrayType.binop("+", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array - dictionary', function() {
      const result = ArrayType.binop("-", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array * dictionary', function() {
      const result = ArrayType.binop("*", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array / dictionary', function() {
      const result = ArrayType.binop("/", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array ^ dictionary', function() {
      const result = ArrayType.binop("^", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array > dictionary', function() {
      const result = ArrayType.binop(">", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array < dictionary', function() {
      const result = ArrayType.binop("<", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array >= dictionary', function() {
      const result = ArrayType.binop(">=", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array <= dictionary', function() {
      const result = ArrayType.binop("<=", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array == dictionary', function() {
      const result = ArrayType.binop("==", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array != dictionary', function() {
      const result = ArrayType.binop("!=", "dictionary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array && dictionary', function() {
      const result = ArrayType.binop("&&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array & dictionary', function() {
      const result = ArrayType.binop("&", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array || dictionary', function() {
      const result = ArrayType.binop("||", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array | dictionary', function() {
      const result = ArrayType.binop("|", "dictionary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('array op binary', function() {
    test('array + binary', function() {
      const result = ArrayType.binop("+", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array - binary', function() {
      const result = ArrayType.binop("-", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array * binary', function() {
      const result = ArrayType.binop("*", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array / binary', function() {
      const result = ArrayType.binop("/", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array ^ binary', function() {
      const result = ArrayType.binop("^", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array > binary', function() {
      const result = ArrayType.binop(">", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array < binary', function() {
      const result = ArrayType.binop("<", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array >= binary', function() {
      const result = ArrayType.binop(">=", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array <= binary', function() {
      const result = ArrayType.binop("<=", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array == binary', function() {
      const result = ArrayType.binop("==", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array != binary', function() {
      const result = ArrayType.binop("!=", "binary");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array && binary', function() {
      const result = ArrayType.binop("&&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array & binary', function() {
      const result = ArrayType.binop("&", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array || binary', function() {
      const result = ArrayType.binop("||", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array | binary', function() {
      const result = ArrayType.binop("|", "binary");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });

  describe('array op date', function() {
    test('array + date', function() {
      const result = ArrayType.binop("+", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array - date', function() {
      const result = ArrayType.binop("-", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array * date', function() {
      const result = ArrayType.binop("*", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array / date', function() {
      const result = ArrayType.binop("/", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array ^ date', function() {
      const result = ArrayType.binop("^", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array > date', function() {
      const result = ArrayType.binop(">", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array < date', function() {
      const result = ArrayType.binop("<", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array >= date', function() {
      const result = ArrayType.binop(">=", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array <= date', function() {
      const result = ArrayType.binop("<=", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array == date', function() {
      const result = ArrayType.binop("==", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array != date', function() {
      const result = ArrayType.binop("!=", "date");
      expect(result.type).toStrictEqual("array");
      expect(result.warning).toBeDefined();
    });

    test('array && date', function() {
      const result = ArrayType.binop("&&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array & date', function() {
      const result = ArrayType.binop("&", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array || date', function() {
      const result = ArrayType.binop("||", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });

    test('array | date', function() {
      const result = ArrayType.binop("|", "date");
      expect(result.type).toStrictEqual("bool");
      expect(result.warning).toBeDefined();
    });
  });
});
