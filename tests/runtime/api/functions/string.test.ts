import Api from "../../../../src/api";
import { RuntimeError, UnimplementedError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbArray, JbBool, JbDictionary, JbNumber, JbString } from "../../../../src/runtime/types";
import { makeDict } from "../../../utils";

describe('String functions', function() {
  describe('CountSubString()', function() {
    test('CountSubString("whatever", "")', function() {
      const func = Api.getFunc("CountSubString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("whatever"), new JbString("")], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });

    test('CountSubString("", "")', function() {
      const func = Api.getFunc("CountSubString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString(""), new JbString("")], new Scope())
      ).toStrictEqual(new JbNumber(0));
    });

    test('CountSubString("Mississippi", "iss")', function() {
      const func = Api.getFunc("CountSubString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("Mississippi"), new JbString("iss")], new Scope())
      ).toStrictEqual(new JbNumber(2));
    });

    test('CountSubString("aaaaaaa", "aa")', function() {
      const func = Api.getFunc("CountSubString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      // POD: overlapping matches are unsupported
      expect(
        func?.call([new JbString("aaaaaaa"), new JbString("aa")], new Scope())
      ).toStrictEqual(new JbNumber(3));
    });

    test('CountSubString("[]", dictionary)', function() {
      const func = Api.getFunc("CountSubString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("[]"), new JbDictionary()], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  });

  describe('DQuote()', function() {
    test('DQuote("")', function() {
      const func = Api.getFunc("DQuote");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("")], new Scope())
      ).toStrictEqual(new JbString('""'));
    });

    test('DQuote(\'""\')', function() {
      const func = Api.getFunc("DQuote");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString('""')], new Scope())
      ).toStrictEqual(new JbString('""""'));
    });

    test('DQuote(dictionary)', function() {
      const func = Api.getFunc("DQuote");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict], new Scope())
      ).toStrictEqual(new JbString('"[key=>"value"]"'));
    });
  });

  test('Format()', function() {
    const func = Api.getFunc("Format");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("%s"), new JbString("whatever")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Index()', function() {
    const func = Api.getFunc("Index");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("something"), new JbString("some")], new Scope())
    }).toThrow(UnimplementedError);
  });

  describe('IsValidString()', function() {
    test('IsValidString("")', function() {
      const func = Api.getFunc("IsValidString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString()], new Scope())
      ).toStrictEqual(new JbBool(true));
    });

    test('IsValidString(\'""\')', function() {
      const func = Api.getFunc("IsValidString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString('""')], new Scope())
      ).toStrictEqual(new JbBool(true));
    });

    test('IsValidString("€")', function() {
      const func = Api.getFunc("IsValidString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString('€')], new Scope())
      ).toStrictEqual(new JbBool(false));
    });

    test('IsValidString("some\\r\\n\\tthing")', function() {
      const func = Api.getFunc("IsValidString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString('some\r\n\tthing')], new Scope())
      ).toStrictEqual(new JbBool(true));
    });

    test('IsValidString("\\0")', function() {
      const func = Api.getFunc("IsValidString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString('\0')], new Scope())
      ).toStrictEqual(new JbBool(false));
    });

    test('IsValidString("\\u1234")', function() {
      const func = Api.getFunc("IsValidString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString('\u1234')], new Scope())
      ).toStrictEqual(new JbBool(false));
    });

    test('IsValidString(dictionary)', function() {
      const func = Api.getFunc("IsValidString");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict], new Scope())
      ).toStrictEqual(new JbBool(true));
    });
  });

  describe('Left()', function() {
    test('Left("", 2)', function() {
      const func = Api.getFunc("Left");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString(""), new JbNumber(2)], new Scope())
      ).toStrictEqual(new JbString(""));
    });

    test('Left("cockroach", 4)', function() {
      const func = Api.getFunc("Left");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("cockroach"), new JbNumber(4)], new Scope())
      ).toStrictEqual(new JbString("cock"));
    });

    test('Left(dictionary, 200)', function() {
      const func = Api.getFunc("Left");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict, new JbNumber(200)], new Scope())
      ).toStrictEqual(new JbString('[key=>"value"]'));
    });
  });

  describe('LPad()', function() {
    test('LPad("(4 spaces)", 14)', function() {
      const func = Api.getFunc("LPad");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("(4 spaces)"), new JbNumber(14)], new Scope())
      ).toStrictEqual(new JbString("    (4 spaces)"));
    });

    test('LPad("rest gets truncated", 9)', function() {
      const func = Api.getFunc("LPad");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("rest gets truncated"), new JbNumber(9)], new Scope())
      ).toStrictEqual(new JbString("rest gets"));
    });

    test('LPad(dictionary, 20)', function() {
      const func = Api.getFunc("LPad");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict, new JbNumber(20)], new Scope())
      ).toStrictEqual(new JbString('      [key=>"value"]'));
    });
  });

  describe('LPadChar()', function() {
    test('LPadChar("(4 @s)", "@", 10)', function() {
      const func = Api.getFunc("LPadChar");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("(4 @s)"), new JbString("@"), new JbNumber(10)], new Scope())
      ).toStrictEqual(new JbString("@@@@(4 @s)"));
    });

    test('LPadChar("unchangeable", "", 15)', function() {
      const func = Api.getFunc("LPadChar");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("unchangeable"), new JbString(), new JbNumber(15)], new Scope())
      ).toStrictEqual(new JbString("unchangeable"));
    });

    test('LPadChar("rest gets truncated", "@", 9)', function() {
      const func = Api.getFunc("LPadChar");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("rest gets truncated"), new JbString("@"), new JbNumber(9)], new Scope())
      ).toStrictEqual(new JbString("rest gets"));
    });

    test('LPadChar(dictionary, "@", 20)', function() {
      const func = Api.getFunc("LPadChar");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict, new JbString("@!#"), new JbNumber(20)], new Scope())
      ).toStrictEqual(new JbString('@@@@@@[key=>"value"]'));
    });
  });

  describe('LTrim()', function() {
    test('LTrim("   blahblahblah")', function() {
      const func = Api.getFunc("LTrim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("   blahblahblah")], new Scope())
      ).toStrictEqual(new JbString("blahblahblah"));
    });

    test('LTrim("\\tblahblahblah\\n")', function() {
      const func = Api.getFunc("LTrim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("\tblahblahblah\n")], new Scope())
      ).toStrictEqual(new JbString("blahblahblah\n"));
    });

    test('LTrim("\\r\\nblah blah blah\\t")', function() {
      const func = Api.getFunc("LTrim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("\r\nblah blah blah\tnice\t")], new Scope())
      ).toStrictEqual(new JbString("blah blah blah\tnice\t"));
    });
  });

  describe('LTrimChars()', function() {
    test('LTrimChars("   blah_blahblah", " blah")', function() {
      const func = Api.getFunc("LTrimChars");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("   blah_blahblah"), new JbString(" blah")], new Scope())
      ).toStrictEqual(new JbString("_blahblah"));
    });

    test('LTrimChars("@#$xdxdxd@", "$#@")', function() {
      const func = Api.getFunc("LTrimChars");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("@#$xdxdxd@"), new JbString("$#@")], new Scope())
      ).toStrictEqual(new JbString("xdxdxd@"));
    });
  });

  test('Mid()', function() {
    const func = Api.getFunc("Mid");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([new JbString("@#$xdxdxd@"), new JbNumber(3), new JbNumber(9)], new Scope())
    ).toStrictEqual(new JbString("xdxdxd"));
  });

  describe('ParseURL()', function() {
    test('ParseURL() - docs example', function() {
      const func = Api.getFunc("ParseURL");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("http://hostname/user?email=john1990%40example.com&name=John%20Smith");
      expect(
        func?.call([url], new Scope())
      ).toStrictEqual(new JbArray([
        new JbString("john1990@example.com"),
        new JbString("John Smith")
      ]));
    });

    test('ParseURL() - HTTPS example', function() {
      const func = Api.getFunc("ParseURL");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/string-functions/?flag=get%20me#stringfunctions-parseurl");
      expect(
        func?.call([url], new Scope())
      ).toStrictEqual(new JbArray([new JbString("get me")]));
    });

    test('ParseURL() - SFTP example', function() {
      const func = Api.getFunc("ParseURL");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("sftp://some%208.8.8.8/thing.json?item1=very&item2=nice%2B%2B");
      expect(
        func?.call([url], new Scope())
      ).toStrictEqual(new JbArray([
        new JbString("very"),
        new JbString("nice++")
      ]));
    });

    test('ParseURL() - localhost', function() {
      const func = Api.getFunc("ParseURL");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("localhost:80?a=a&b=b&c=c");
      expect(
        func?.call([url], new Scope())
      ).toStrictEqual(new JbArray([
        new JbString("a"),
        new JbString("b"),
        new JbString("c")
      ]));
    });

    test('ParseURL() - invalid URI', function() {
      const func = Api.getFunc("ParseURL");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString(":/success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/string-functions/?flag=get%20me");
      expect(function() {
        func?.call([url], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('Quote()', function() {
    test('Quote("")', function() {
      const func = Api.getFunc("Quote");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("")], new Scope())
      ).toStrictEqual(new JbString("''"));
    });

    test('Quote("\'\'")', function() {
      const func = Api.getFunc("Quote");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("''")], new Scope())
      ).toStrictEqual(new JbString("''''"));
    });

    test('Quote(dictionary)', function() {
      const func = Api.getFunc("Quote");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict], new Scope())
      ).toStrictEqual(new JbString("'[key=>\"value\"]'"));
    });
  });

  test('RegExMatch()', function() {
    const func = Api.getFunc("RegExMatch");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const scope = new Scope();
    expect(
      func?.call([
        new JbString("[abc]"),
        new JbString("(\\[)(.*)(\\])"),
        new JbString("dummy"),
        new JbString("value"),
        new JbString("value2"),
        new JbString("value3"),
        new JbString("value4")
      ], scope)
    ).toStrictEqual(new JbNumber(4));
    expect(scope.lookupVar("$dummy")).toStrictEqual(new JbString("[abc]"));
    expect(scope.lookupVar("$value")).toStrictEqual(new JbString("["));
    expect(scope.lookupVar("$value2")).toStrictEqual(new JbString("abc"));
    expect(scope.lookupVar("$value3")).toStrictEqual(new JbString("]"));
    expect(scope.lookupVar("$value4")).toBeUndefined();
  });

  test('RegExReplace()', function() {
    const func = Api.getFunc("RegExReplace");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const scope = new Scope();
    expect(function() {
      func?.call([
        new JbString("[abc]"),
        new JbString("(\\[)(.*)(\\])"),
        new JbString("format")
      ], scope)
    }).toThrow(UnimplementedError);
  });

  describe('Replace()', function() {
    test('Replace() - docs example', function() {
      const func = Api.getFunc("Replace");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const scope = new Scope();
      expect(
        func?.call([
          new JbString("Monday Tuesday"),
          new JbString("day"),
          new JbString("night")
        ], scope)
      ).toStrictEqual(new JbString("Monnight Tuesnight"));
    });

    test('Replace() - empty old', function() {
      const func = Api.getFunc("Replace");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const scope = new Scope();
      expect(
        func?.call([
          new JbString("Monday Tuesday"),
          new JbString(),
          new JbString("night")
        ], scope)
      ).toStrictEqual(new JbString("Monday Tuesday"));
    });

    test('Replace() - empty new', function() {
      const func = Api.getFunc("Replace");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const scope = new Scope();
      expect(
        func?.call([
          new JbString("Monday Tuesday"),
          new JbString("day"),
          new JbString()
        ], scope)
      ).toStrictEqual(new JbString("Mon Tues"));
    });
  });

  describe('Right()', function() {
    test('Right("", 2)', function() {
      const func = Api.getFunc("Right");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString(""), new JbNumber(2)], new Scope())
      ).toStrictEqual(new JbString(""));
    });

    test('Right("peacock", 4)', function() {
      const func = Api.getFunc("Right");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("peacock"), new JbNumber(4)], new Scope())
      ).toStrictEqual(new JbString("cock"));
    });

    test('Right(dictionary, 200)', function() {
      const func = Api.getFunc("Right");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict, new JbNumber(200)], new Scope())
      ).toStrictEqual(new JbString('[key=>"value"]'));
    });
  });

  describe('RPad()', function() {
    test('RPad("(4 spaces)", 14)', function() {
      const func = Api.getFunc("RPad");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("(4 spaces)"), new JbNumber(14)], new Scope())
      ).toStrictEqual(new JbString("(4 spaces)    "));
    });

    test('RPad("rest gets truncated", 9)', function() {
      const func = Api.getFunc("RPad");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("rest gets truncated"), new JbNumber(9)], new Scope())
      ).toStrictEqual(new JbString("truncated"));
    });

    test('RPad(dictionary, 20)', function() {
      const func = Api.getFunc("RPad");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict, new JbNumber(20)], new Scope())
      ).toStrictEqual(new JbString('[key=>"value"]      '));
    });
  });

  describe('RPadChar()', function() {
    test('RPadChar("(4 @s)", "@", 10)', function() {
      const func = Api.getFunc("RPadChar");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("(4 @s)"), new JbString("@"), new JbNumber(10)], new Scope())
      ).toStrictEqual(new JbString("(4 @s)@@@@"));
    });

    test('RPadChar("unchangeable", "", 15)', function() {
      const func = Api.getFunc("RPadChar");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("unchangeable"), new JbString(), new JbNumber(15)], new Scope())
      ).toStrictEqual(new JbString("unchangeable"));
    });

    test('RPadChar("rest gets truncated", "@", 9)', function() {
      const func = Api.getFunc("RPadChar");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("rest gets truncated"), new JbString("@"), new JbNumber(9)], new Scope())
      ).toStrictEqual(new JbString("truncated"));
    });

    test('RPadChar(dictionary, "@#", 20)', function() {
      const func = Api.getFunc("RPadChar");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict, new JbString("@!#"), new JbNumber(20)], new Scope())
      ).toStrictEqual(new JbString('[key=>"value"]@@@@@@'));
    });
  });

  describe('RTrim()', function() {
    test('RTrim("   blahblahblah   ")', function() {
      const func = Api.getFunc("RTrim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("   blahblahblah   ")], new Scope())
      ).toStrictEqual(new JbString("   blahblahblah"));
    });

    test('RTrim("\\tblahblahblah\\n")', function() {
      const func = Api.getFunc("RTrim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("\tblahblahblah\n")], new Scope())
      ).toStrictEqual(new JbString("\tblahblahblah"));
    });

    test('RTrim("\\r\\nblah blah blah\\t")', function() {
      const func = Api.getFunc("RTrim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("\r\nblah blah blah\tnice\t")], new Scope())
      ).toStrictEqual(new JbString("\r\nblah blah blah\tnice"));
    });
  });

  describe('RTrimChars()', function() {
    test('RTrimChars("   blah_blahblah", " blah")', function() {
      const func = Api.getFunc("RTrimChars");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("   blah_blahblah"), new JbString(" blah")], new Scope())
      ).toStrictEqual(new JbString("   blah_"));
    });

    test('RTrimChars("@#$xdxdxd@", "$#@")', function() {
      const func = Api.getFunc("RTrimChars");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("@#$xdxdxd@"), new JbString("$#@")], new Scope())
      ).toStrictEqual(new JbString("@#$xdxdxd"));
    });
  });

  describe('Split()', function() {
    test('Split() - regular', function() {
      const func = Api.getFunc("Split");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("a@b@c@"), new JbString("@")], new Scope())
      ).toStrictEqual(new JbArray([
        new JbString("a"),
        new JbString("b"),
        new JbString("c")
      ]));
    });

    test('Split() - uniform characters', function() {
      const func = Api.getFunc("Split");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("@@@@@@@"), new JbString("@")], new Scope())
      ).toStrictEqual(new JbArray([
        new JbString(),
        new JbString(),
        new JbString(),
        new JbString(),
        new JbString(),
        new JbString(),
        new JbString()
      ]));
    });

    test('Split() - no splits', function() {
      const func = Api.getFunc("Split");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("whatever#"), new JbString("@")], new Scope())
      ).toStrictEqual(new JbArray([new JbString("whatever#")]));
    });

    test('Split() - begin split', function() {
      const func = Api.getFunc("Split");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("@whatever#"), new JbString("@")], new Scope())
      ).toStrictEqual(new JbArray([
        new JbString(),
        new JbString("whatever#")
      ]));
    });

    test('Split() - end split', function() {
      const func = Api.getFunc("Split");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("whatever@"), new JbString("@")], new Scope())
      ).toStrictEqual(new JbArray([new JbString("whatever")]));
    });
  });

  test('SplitCSV()', function() {
    const func = Api.getFunc("SplitCSV");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("a@b@c@"), new JbString("@")], new Scope())
    }).toThrow(UnimplementedError);
  });

  describe('StringLength()', function() {
    test('StringLength(string)', function() {
      const func = Api.getFunc("StringLength");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("Just measure me it's whatever")], new Scope())
      ).toStrictEqual(new JbNumber(29));
    });

    test('StringLength(array)', function() {
      const func = Api.getFunc("StringLength");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbArray([
          new JbString("Just measure me it's whatever"),
          makeDict("key", new JbString("value"))
        ])], new Scope())
      ).toStrictEqual(new JbArray([
        new JbNumber(29),
        new JbNumber(14)
      ]));
    });
  });

  describe('ToLower()', function() {
    test('ToLower(string)', function() {
      const func = Api.getFunc("ToLower");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("WHY IS THIS LANGUAGE SO ARGHHH...")], new Scope())
      ).toStrictEqual(new JbString("why is this language so arghhh..."));
    });

    test('ToLower(dictionary)', function() {
      const func = Api.getFunc("ToLower");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDict("!@#$%ABCD1234€")], new Scope())
      ).toStrictEqual(new JbString('[!@#$%abcd1234€=>"null"]'));
    });
  });

  test('ToProper()', function() {
    const func = Api.getFunc("ToProper");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbString(" pAul mccartney")], new Scope())
    }).toThrow(UnimplementedError);
  });

  describe('ToUpper()', function() {
    test('ToUpper(string)', function() {
      const func = Api.getFunc("ToUpper");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("why is this language so arghhh...")], new Scope())
      ).toStrictEqual(new JbString("WHY IS THIS LANGUAGE SO ARGHHH..."));
    });

    test('ToUpper(dictionary)', function() {
      const func = Api.getFunc("ToUpper");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDict('this=>"null",that')], new Scope())
      ).toStrictEqual(new JbString('[THIS=>"NULL",THAT=>"NULL"]'));
    });
  });

  describe('Trim()', function() {
    test('Trim("   blahblahblah   ")', function() {
      const func = Api.getFunc("Trim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("   blahblahblah   ")], new Scope())
      ).toStrictEqual(new JbString("blahblahblah"));
    });

    test('Trim("\\tblahblahblah\\n")', function() {
      const func = Api.getFunc("Trim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("\tblahblahblah\n")], new Scope())
      ).toStrictEqual(new JbString("blahblahblah"));
    });

    test('Trim("\\r\\nblah blah blah\\t")', function() {
      const func = Api.getFunc("Trim");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("\r\nblah blah blah\tnice\t")], new Scope())
      ).toStrictEqual(new JbString("blah blah blah\tnice"));
    });
  });

  describe('TrimChars()', function() {
    test('TrimChars("   blah_blahblah", " blah")', function() {
      const func = Api.getFunc("TrimChars");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("   blah_blahblah"), new JbString(" blah")], new Scope())
      ).toStrictEqual(new JbString("_"));
    });

    test('TrimChars("@#$xdxdxd@", "$#@")', function() {
      const func = Api.getFunc("TrimChars");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("@#$xdxdxd@"), new JbString("$#@")], new Scope())
      ).toStrictEqual(new JbString("xdxdxd"));
    });
  });

  describe('Truncate()', function() {
    test('Truncate("", 2, 3)', function() {
      const func = Api.getFunc("Truncate");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString(""), new JbNumber(2), new JbNumber(3)], new Scope())
      ).toStrictEqual(new JbString(""));
    });

    test('Truncate("peacock", 3, 0)', function() {
      const func = Api.getFunc("Truncate");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      expect(
        func?.call([new JbString("peacock"), new JbNumber(3), new JbNumber(0)], new Scope())
      ).toStrictEqual(new JbString("cock"));
    });

    test('Truncate(dictionary, 1, 1)', function() {
      const func = Api.getFunc("Truncate");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const dict = makeDict("key", new JbString("value"));
      expect(
        func?.call([dict, new JbNumber(1), new JbBool(true)], new Scope())
      ).toStrictEqual(new JbString('key=>"value"'));
    });
  });

  describe('URLDecode()', function() {
    test('URLDecode() - docs example', function() {
      const func = Api.getFunc("URLDecode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("http://hostname/user?email=john1990%40example.com&name=John%20Smith");
      expect(
        func?.call([url, new JbString("email")], new Scope())
      ).toStrictEqual(new JbString("john1990@example.com"));
    });

    test('URLDecode() - HTTPS example', function() {
      const func = Api.getFunc("URLDecode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/string-functions/?flag=get%20me#stringfunctions-parseurl");
      expect(
        func?.call([url, new JbString("flag")], new Scope())
      ).toStrictEqual(new JbString("get me"));
    });

    test('URLDecode() - SFTP example', function() {
      const func = Api.getFunc("URLDecode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("sftp://some%208.8.8.8/thing.json?item1=very&item2=nice%2B%2B");
      expect(
        func?.call([url, new JbString("item1")], new Scope())
      ).toStrictEqual(new JbString("very"));
    });

    test('URLDecode() - localhost', function() {
      const func = Api.getFunc("URLDecode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("localhost:80?a=a&b=b&c=c");
      expect(
        func?.call([url, new JbString("a")], new Scope())
      ).toStrictEqual(new JbString("a"));
    });

    test('URLDecode() - non-existent param', function() {
      const func = Api.getFunc("URLDecode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("localhost:80?a=a&b=b&c=c");
      expect(
        func?.call([url, new JbString("d")], new Scope())
      ).toStrictEqual(new JbString());
    });

    test('URLDecode() - invalid URI', function() {
      const func = Api.getFunc("URLDecode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString(":/success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/string-functions/?flag=get%20me");
      expect(function() {
        func?.call([url, new JbString("flag")], new Scope())
      }).toThrow(RuntimeError);
    });
  });

  describe('URLEncode()', function() {
    test('URLEncode() - docs example', function() {
      const func = Api.getFunc("URLEncode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("http://hostname/user?email=john1990@example.com&name=John Smith");
      expect(
        func?.call([url], new Scope())
      ).toStrictEqual(
        new JbString("http%3A%2F%2Fhostname%2Fuser%3Femail%3Djohn1990%40example.com%26name%3DJohn%20Smith")
      );
    });

    test('URLEncode() - HTTPS example', function() {
      const func = Api.getFunc("URLEncode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/string-functions/?flag=get me#stringfunctions-parseurl");
      // POD: the encoding option is always ignored
      expect(
        func?.call([url, new JbNumber(1)], new Scope())
      ).toStrictEqual(
        new JbString("https%3A%2F%2Fsuccess.jitterbit.com%2Fcloud-studio%2Fcloud-studio-reference%2Ffunctions%2Fstring-functions%2F%3Fflag%3Dget%20me%23stringfunctions-parseurl")
      );
    });

    test('URLEncode() - SFTP example', function() {
      const func = Api.getFunc("URLEncode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("sftp://some@8.8.8.8/thing.json?item1=very&item2=nice++");
      expect(
        func?.call([url], new Scope())
      ).toStrictEqual(new JbString("sftp%3A%2F%2Fsome%408.8.8.8%2Fthing.json%3Fitem1%3Dvery%26item2%3Dnice%2B%2B"));
    });

    test('URLEncode() - localhost', function() {
      const func = Api.getFunc("URLEncode");
      expect(func).toBeDefined();
      expect(func?.signature).toBeDefined();
      const url = new JbString("localhost:80?a=a&b=b&c=c");
      expect(
        func?.call([url], new Scope())
      ).toStrictEqual(new JbString("localhost%3A80%3Fa%3Da%26b%3Db%26c%3Dc"));
    });
  });
});
