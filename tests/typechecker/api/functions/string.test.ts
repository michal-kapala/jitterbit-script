import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('String functions', function() {
  describe('CountSubString()', function() {
    test('CountSubString(string, string)', function() {
      const script = `<trans>cnt = CountSubString(str="some string", sub="find me")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('CountSubString(array, dictionary)', function() {
      const script = `<trans>cnt = CountSubString(str={}, sub=Map())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('DQuote()', function() {
    test('DQuote(string)', function() {
      const script = `<trans>quoted = DQuote(str="some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('DQuote(dictionary)', function() {
      const script = `<trans>quoted = DQuote(str=Dict())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  test('Format(string, number)', function() {
    const script = `<trans>fmted = Format(fmt="some string", de=13)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Index(string, array, bool)', function() {
    const script = `<trans>index = Index(str="some string", sub={}, n=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("array");
    expect(result.vars[3].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(false);
    expect(result.diagnostics[1].error).toStrictEqual(false);
  });

  describe('IsValidString()', function() {
    test('IsValidString(string)', function() {
      const script = `<trans>isStr = IsValidString(str="some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('IsValidString(binary)', function() {
      const script = `<trans>isStr = IsValidString(str=HexToBinary("223344"))</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("bool");
      expect(result.vars[1].type).toStrictEqual("binary");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Left()', function() {
    test('Left(string, number)', function() {
      const script = `<trans>str = Left(str="some string", n=5)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Left(dictionary, string)', function() {
      const script = `<trans>str = Left(str=dict(), n="5")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('LPad()', function() {
    test('LPad(string, number)', function() {
      const script = `<trans>str = LPad(str="some string", n=5)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('LPad(dictionary, string)', function() {
      const script = `<trans>str = LPad(str=dict(), n="5")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('LPadChar()', function() {
    test('LPadChar(string, string, number)', function() {
      const script = `<trans>str = LPadChar(str="some string", char="_", n=5)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('LPadChar(array, bool, string)', function() {
      const script = `<trans>str = LPadChar(str={}, char=false, n="5")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(3);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
      expect(result.diagnostics[2].error).toStrictEqual(false);
    });
  });

  describe('LTrim()', function() {
    test('LTrim(string)', function() {
      const script = `<trans>str = LTrim(str="some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('LTrim(bool)', function() {
      const script = `<trans>str = LTrim(str=true)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('LTrimChars()', function() {
    test('LTrimChars(string, string)', function() {
      const script = `<trans>str = LTrimChars(str="some string", chars="mnop")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('LTrimChars(number, bool)', function() {
      const script = `<trans>str = LTrimChars(str=1234, chars=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  test('Mid(string, number, number)', function() {
    const script = `<trans>str = Mid(str="some string", m=1, n=2)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('ParseURL()', function() {
    test('ParseURL(string)', function() {
      const script = `<trans>params = ParseURL(url="https://example.com?a=1")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("array");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('ParseURL(array)', function() {
      const script = `<trans>params = ParseURL(url={"https://example.com?a=1"})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("array");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });
  });

  describe('Quote()', function() {
    test('Quote(string)', function() {
      const script = `<trans>quoted = Quote(str="some str")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Quote(dictionary)', function() {
      const script = `<trans>quoted = Quote(str=dict())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  test('RegExMatch(string, string, string, number)', function() {
    const script = `<trans>matches = RegExMatch(str="some str", regex=".*", v1="var1", v2=13)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('RegExReplace(string, string, string)', function() {
    const script = `<trans>replaced = RegExReplace(str="some str", regex="\\\\s", fmt="")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('Replace()', function() {
    test('Replace(string, string, string)', function() {
      const script = `<trans>replaced = Replace(str="some str", old="some", new="a pretty")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Replace(string, string, number)', function() {
      const script = `<trans>replaced = Replace(str="some str", old="some", new=1)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Right()', function() {
    test('Right(string, number)', function() {
      const script = `<trans>str = Right(str="some string", n=5)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Right(dictionary, string)', function() {
      const script = `<trans>str = Right(str=dict(), n="5")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('RPad()', function() {
    test('RPad(string, number)', function() {
      const script = `<trans>str = RPad(str="some string", n=5)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('RPad(dictionary, string)', function() {
      const script = `<trans>str = RPad(str=dict(), n="5")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('RPadChar()', function() {
    test('RPadChar(string, string, number)', function() {
      const script = `<trans>str = RPadChar(str="some string", char="_", n=5)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('RPadChar(array, bool, string)', function() {
      const script = `<trans>str = RPadChar(str={}, char=false, n="5")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(3);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
      expect(result.diagnostics[2].error).toStrictEqual(false);
    });
  });

  describe('RTrim()', function() {
    test('RTrim(string)', function() {
      const script = `<trans>str = RTrim(str="some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('RTrim(bool)', function() {
      const script = `<trans>str = RTrim(str=true)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('RTrimChars()', function() {
    test('RTrimChars(string, string)', function() {
      const script = `<trans>str = RTrimChars(str="some string", chars="mnop")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('RTrimChars(number, bool)', function() {
      const script = `<trans>str = RTrimChars(str=1234, chars=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('Split()', function() {
    test('Split(string, string)', function() {
      const script = `<trans>str = Split(str="some string", delim=" ")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("array");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Split(number, bool)', function() {
      const script = `<trans>str = Split(str=13, delim=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("array");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  test('SplitCSV(string, number, number)', function() {
    const script = `<trans>str = SplitCSV(str="some string", delim=32, q=78)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('StringLength()', function() {
    test('StringLength(string)', function() {
      const script = `<trans>len = StringLength(str="some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('StringLength(array)', function() {
      const script = `<trans>len = StringLength(arr={})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("array");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('StringLength(dictionary)', function() {
      const script = `<trans>len = StringLength(dict=dict())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('ToLower()', function() {
    test('ToLower(string)', function() {
      const script = `<trans>str = ToLower(str="Some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('ToLower(dictionary)', function() {
      const script = `<trans>str = ToLower(str=map())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('ToProper()', function() {
    test('ToProper(string)', function() {
      const script = `<trans>str = ToProper(str="Some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('ToProper(dictionary)', function() {
      const script = `<trans>str = ToProper(str=map())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('ToUpper()', function() {
    test('ToUpper(string)', function() {
      const script = `<trans>str = ToUpper(str="Some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('ToUpper(dictionary)', function() {
      const script = `<trans>str = ToUpper(str=map())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('Trim()', function() {
    test('Trim(string)', function() {
      const script = `<trans>str = Trim(str=" Some string ")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Trim(bool)', function() {
      const script = `<trans>str = Trim(str=true)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('TrimChars()', function() {
    test('TrimChars(string, string)', function() {
      const script = `<trans>str = TrimChars(str=" Some string ", chars="S g")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('TrimChars(bool, bool)', function() {
      const script = `<trans>str = TrimChars(str=true, chars=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("bool");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });

  describe('Truncate()', function() {
    test('Truncate(string, number, number)', function() {
      const script = `<trans>str = Truncate(str=" Some string ", first=1, last=7)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Truncate(dictionary, string, bool)', function() {
      const script = `<trans>str = Truncate(str=dict(), first="1", last=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(3);
      expect(result.diagnostics[0].error).toStrictEqual(false);
      expect(result.diagnostics[1].error).toStrictEqual(false);
      expect(result.diagnostics[2].error).toStrictEqual(false);
    });
  });

  describe('URLDecode()', function() {
    test('URLDecode(string, string)', function() {
      const script = `<trans>str = URLDecode(url="http://localhost:80?u=2", param="u")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('URLDecode(number, bool) - HTTPS example', function() {
      const script = `<trans>str = URLDecode(url=5834795348534, param=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(true);
      expect(result.diagnostics[1].error).toStrictEqual(true);
    });
  });

  describe('URLEncode()', function() {
    test('URLEncode(string, number)', function() {
      const script = `<trans>str = URLEncode(url="http://localhost:80?u=2", encOpt=3)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('URLEncode(number, bool)', function() {
      const script = `<trans>str = URLEncode(url=867546543, encOpt=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("number");
      expect(result.vars[2].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(2);
      expect(result.diagnostics[0].error).toStrictEqual(true);
      expect(result.diagnostics[1].error).toStrictEqual(false);
    });
  });
});
