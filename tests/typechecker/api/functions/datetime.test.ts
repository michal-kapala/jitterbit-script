import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Date and time functions', function() {
  describe('ConvertTimeZone()', function() {
    test('ConvertTimeZone(date)', function() {
      const script = `<trans>tz = ConvertTimeZone(date=Now(), fromTZ="GMT", toTZ="GMT+1", eu=true, ignoreDst=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.vars[4].type).toStrictEqual("bool");
      expect(result.vars[5].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('ConvertTimeZone(string)', function() {
      const script = `<trans>tz = ConvertTimeZone(date="99-03-11", fromTZ="GMT", toTZ="GMT+1", eu=true, ignoreDst=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.vars[4].type).toStrictEqual("bool");
      expect(result.vars[5].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('CVTDate()', function() {
    test('CVTDate(date)', function() {
      const script = `<trans>tz = CVTDate(date=Now(), in="DD-MM-YY", out="MM-DD-YY")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('CVTDate(string)', function() {
      const script = `<trans>tz = CVTDate(date='12-12-12', in="DD-MM-YY", out="MM-DD-YY")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('DateAdd()', function() {
    test('DateAdd(date)', function() {
      const script = `<trans>d = DateAdd(part="dd", n=123, date=Now())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('DateAdd(string)', function() {
      const script = `<trans>d = DateAdd(part="dd", n=123, date="13/02/2006")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('DayOfMonth()', function() {
    test('DayOfMonth(date)', function() {
      const script = `<trans>d = DayOfMonth(date=Now())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
    
    test('DayOfMonth(string)', function() {
      const script = `<trans>d = DayOfMonth(date="13/02/2006")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('DayOfWeek()', function() {
    test('DayOfWeek(date)', function() {
      const script = `<trans>d = DayOfWeek(date=Now())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('DayOfWeek(string)', function() {
      const script = `<trans>d = DayOfWeek(date="4/8/66")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('FormatDate()', function() {
    test('FormatDate(date)', function() {
      const script = `<trans>d = FormatDate(date=Now(), format="%w")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('FormatDate(string)', function() {
      const script = `<trans>d = FormatDate(date="31/01/24", format=Null())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("null");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });
  });
  
  describe('GeneralDate()', function() {
    test('GeneralDate(date)', function() {
      const script = `<trans>d = GeneralDate(date=Now())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('GeneralDate(string)', function() {
      const script = `<trans>d = GeneralDate(date='2/3/2015')</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('GetUTCFormattedDate()', function() {
    test('GetUTCFormattedDate(date, string, bool)', function() {
      const script = `<trans>d = GetUTCFormattedDate(date=Now(), tz="PST", eu=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('GetUTCFormattedDate(string, string, bool)', function() {
      const script = `<trans>d = GetUTCFormattedDate(date="04-23-1978", tz="PST", eu=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('GetUTCFormattedDateTime()', function() {
    test('GetUTCFormattedDateTime(date, string, bool)', function() {
      const script = `<trans>d = GetUTCFormattedDateTime(date=Now(), tz="PST", eu=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('GetUTCFormattedDateTime(string, string, bool)', function() {
      const script = `<trans>d = GetUTCFormattedDateTime(date=If(true, "not a date", false), tz="PST", eu=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("type");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });
  });

  describe('LastDayOfMonth()', function() {
    test('LastDayOfMonth(date)', function() {
      const script = `<trans>d = LastDayOfMonth(date=Now_())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("date");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('LastDayOfMonth(bool)', function() {
      const script = `<trans>d = LastDayOfMonth(date=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("date");
      expect(result.vars[1].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });
  });

  describe('LongDate()', function() {
    test('LongDate(date)', function() {
      const script = `<trans>d = LongDate(date=Now_())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('LongDate(string)', function() {
      const script = `<trans>d = LongDate(date="13/03/2020")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('LongTime()', function() {
    test('LongTime(date)', function() {
      const script = `<trans>d = LongTime(date=Now_())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('LongTime(string)', function() {
      const script = `<trans>d = LongTime(date="1/1/1988")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('MediumDate()', function() {
    test('MediumDate(date)', function() {
      const script = `<trans>d = MediumDate(date=Now_())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('MediumDate(string)', function() {
      const script = `<trans>d = MediumDate(date="22/08/2013")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('MediumTime()', function() {
    test('MediumTime(date)', function() {
      const script = `<trans>d = MediumTime(date=Now_())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('MediumTime(string)', function() {
      const script = `<trans>d = MediumTime(date="22/08/2013")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('MonthOfYear()', function() {
    test('MonthOfYear(date)', function() {
      const script = `<trans>d = MonthOfYear(date=Now_())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('MonthOfYear(string)', function() {
      const script = `<trans>d = MonthOfYear(date="22/08/2013")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  test('Now()', function() {
    const script = `<trans>d = Now();</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("date");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Now_()', function() {
    const script = `<trans>d = Now_();</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("date");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('ShortDate()', function() {
    test('ShortDate(date)', function() {
      const script = `<trans>d = ShortDate(date=Now_())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('ShortDate(string)', function() {
      const script = `<trans>d = ShortDate(date="22/08/2013")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  describe('ShortTime()', function() {
    test('ShortTime(date)', function() {
      const script = `<trans>d = ShortTime(date=Now_())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("date");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('ShortTime(string)', function() {
      const script = `<trans>d = ShortTime(date="22/08/2013")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("string");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });
});
