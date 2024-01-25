import { describe, expect, test } from '@jest/globals';
import { Api } from '../../../src/api';
import Scope from '../../../src/runtime/scope';
import { JbDate, JbNumber, JbString } from '../../../src/runtime/types';
import { UnimplementedError } from '../../../src/errors';
import { makeDate } from '../../utils';

describe('Date and time functions', function() {
  test('ConvertTimeZone()', function() {
    const func = Api.getFunc("ConvertTimeZone");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("1/13/24"),
        new JbString("fromTZ"),
        new JbString("toTZ")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('CVTDate()', function() {
    const func = Api.getFunc("CVTDate");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("1/13/24"),
        new JbString("inputFormat"),
        new JbString("outputFormat")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('DateAdd()', function() {
    const func = Api.getFunc("DateAdd");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("inputFormat"),
        new JbNumber(17),
        new JbString("1/13/24")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  describe('DayOfMonth()', function() {
    test('DayOfMonth(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("DayOfMonth");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbNumber(13));
    });
  
    test('DayOfMonth(date) - ISO', function() {
      const func = Api.getFunc("DayOfMonth");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbNumber(13));
    });
  });

  describe('DayOfWeek()', function() {
    test('DayOfWeek(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("DayOfWeek");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbNumber(6));
    });
  
    test('DayOfWeek(date) - ISO', function() {
      const func = Api.getFunc("DayOfWeek");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbNumber(6));
    });
  });

  test('FormatDate()', function() {
    const func = Api.getFunc("FormatDate");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("1/13/24"),
        new JbString("format")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });
  
  describe('GeneralDate()', function() {
    test('GeneralDate(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("GeneralDate");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbString("01/13/2024 00:00:00 AM"));
    });
  
    test('GeneralDate(date) - ISO', function() {
      const func = Api.getFunc("GeneralDate");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbString("01/13/2024 11:59:59 PM"));
    });
  });

  test('GetUTCFormattedDate()', function() {
    const func = Api.getFunc("GetUTCFormattedDate");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("1/13/24"),
        new JbString("UTC")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetUTCFormattedDateTime()', function() {
    const func = Api.getFunc("GetUTCFormattedDateTime");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("1/13/24"),
        new JbString("UTC")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  describe('LastDayOfMonth()', function() {
    test('LastDayOfMonth(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("LastDayOfMonth");
      expect(func).toBeDefined();
      const date = makeDate("2024-01-31T00:00:00Z");
      date.isUTC = false;
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(date);
    });
  
    test('LastDayOfMonth(date) - ISO', function() {
      const func = Api.getFunc("LastDayOfMonth");
      expect(func).toBeDefined();
      const expected = makeDate("2024-02-29T00:00:00Z");
      expected.isUTC = false;
      expect(
        func?.call([makeDate("2024-02-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(expected);
    });
  });

  describe('LongDate()', function() {
    test('LongDate(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("LongDate");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbString("Saturday, January 13, 2024"));
    });
  
    test('LongDate(date) - ISO', function() {
      const func = Api.getFunc("LongDate");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbString("Saturday, January 13, 2024"));
    });
  });

  describe('LongTime()', function() {
    test('LongTime(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("LongTime");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbString("00:00:00 AM"));
    });
  
    test('LongTime(date) - ISO', function() {
      const func = Api.getFunc("LongTime");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbString("11:59:59 PM"));
    });
  });

  describe('MediumDate()', function() {
    test('MediumDate(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("MediumDate");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbString("13-Jan-24"));
    });
  
    test('MediumDate(date) - ISO', function() {
      const func = Api.getFunc("MediumDate");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbString("13-Jan-24"));
    });
  });

  describe('MediumTime()', function() {
    test('MediumTime(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("MediumTime");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbString("00:00 AM"));
    });
  
    test('MediumTime(date) - ISO', function() {
      const func = Api.getFunc("MediumTime");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbString("11:59 PM"));
    });
  });

  describe('MonthOfYear()', function() {
    test('MonthOfYear(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("MonthOfYear");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbNumber(1));
    });
  
    test('MonthOfYear(date) - ISO', function() {
      const func = Api.getFunc("MonthOfYear");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-12-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbNumber(12));
    });
  });

  test('Now()', function() {
    const func = Api.getFunc("Now");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const result = func?.call([], new Scope()) as JbDate;
    const curTime = new Date();
    // the difference should be less than 1s
    expect(
      result.value.getTime() - curTime.getTime()
    ).toBeLessThan(1000);
  });

  test('Now_()', function() {
    const func = Api.getFunc("Now_");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    const result = func?.call([], new Scope()) as JbDate;
    const curTime = new Date();
    // the difference should be less than 1s
    expect(
      result.value.getTime() - curTime.getTime()
    ).toBeLessThan(1000);
  });

  describe('ShortDate()', function() {
    test('ShortDate(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("ShortDate");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbString("1/13/24"));
    });
  
    test('ShortDate(date) - ISO', function() {
      const func = Api.getFunc("ShortDate");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbString("1/13/24"));
    });
  });

  describe('ShortTime()', function() {
    test('ShortTime(string) - (M)M/(D)D/YY', function() {
      const func = Api.getFunc("ShortTime");
      expect(func).toBeDefined();
      expect(
        func?.call([new JbString("1/13/24")], new Scope())
      ).toStrictEqual(new JbString("00:00"));
    });
  
    test('ShortTime(date) - ISO', function() {
      const func = Api.getFunc("ShortTime");
      expect(func).toBeDefined();
      expect(
        func?.call([makeDate("2024-01-13T23:59:59.999Z")], new Scope())
      ).toStrictEqual(new JbString("23:59"));
    });
  });
});
