import { RuntimeError, UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { JbBool, JbDate, JbNumber, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `ConvertTimeZone` function.
 * 
 * Take a date and returns it converted from one time zone to another time zone.
 */
export class ConvertTimeZone extends Func {
  constructor() {
    super();
    this.name = "ConvertTimeZone";
    this.module = "datetime";
    this.minArgs = 3;
    this.maxArgs = 5;
    this.signatures = [
      new Signature("string", [
        new Parameter("date", "d"),
        new Parameter("string", "fromTZ"),
        new Parameter("string", "toTZ"),
        // TODO: the default to be determined
        new Parameter("bool", "is_european_format", false, new JbBool(false)),
        new Parameter("bool", "ignoreDST", false, new JbBool(false)),
      ]),
      new Signature("string", [
        new Parameter("string", "d"),
        new Parameter("string", "fromTZ"),
        new Parameter("string", "toTZ"),
        // TODO: the default to be determined
        new Parameter("bool", "is_european_format", false, new JbBool(false)),
        new Parameter("bool", "ignoreDST", false, new JbBool(false)),
      ])
    ];
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `CVTDate` function.
 * 
 * Converts a date object or date string in the input format to a date string in the output format.
 */
export class CVTDate extends Func {
  constructor() {
    super();
    this.name = "CVTDate";
    this.module = "datetime";
    this.minArgs = 3;
    this.maxArgs = 5;
    this.signatures = [
      new Signature("string", [
        new Parameter("date", "d"),
        new Parameter("string", "inputFormat"),
        new Parameter("string", "outputFormat")
      ]),
      new Signature("string", [
        new Parameter("string", "d"),
        new Parameter("string", "inputFormat"),
        new Parameter("string", "outputFormat")
      ]),
    ];
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `DateAdd` function.
 * 
 * Returns a date string after adding a number to a specified part of a date object.
 */
export class DateAdd extends Func {
  constructor() {
    super();
    this.name = "DateAdd";
    this.module = "datetime";
    this.minArgs = 3;
    this.maxArgs = 3;
    this.signatures = [
      new Signature("string", [
        new Parameter("string", "datePath"),
        new Parameter("number", "number"),
        new Parameter("date", "d")
      ]),
      new Signature("string", [
        new Parameter("string", "datePath"),
        new Parameter("number", "number"),
        new Parameter("string", "d")
      ]),
    ];
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[2].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `DayOfMonth` function.
 * 
 * Returns the day of the month (1-31) of a date object or date string.
 */
export class DayOfMonth extends Func {
  constructor() {
    super();
    this.name = "DayOfMonth";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("number", [
        new Parameter("date", "d")
      ]),
      new Signature("number", [
        new Parameter("string", "d")
      ]),
    ];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);
    return new JbNumber(date.value.getDate());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `DayOfWeek` function.
 * 
 * Returns the day of the week for a date object or date string, with 0 for Sunday,
 * 1 for Monday, on through 6 for Saturday.
 * 
 * This definition is independent of locale. For the weekday name, call `FormatDate` instead.
 */
export class DayOfWeek extends Func {
  constructor() {
    super();
    this.name = "DayOfWeek";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("number", [
        new Parameter("date", "d")
      ]),
      new Signature("number", [
        new Parameter("string", "d")
      ]),
    ];
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);
    return new JbNumber(date.value.getDay());
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `FormatDate` function.
 * 
 * Converts a date object to a string according to a format string.
 * This is similar to the `CVTDate` function and uses the same format strings.
 */
export class FormatDate extends Func {
  constructor() {
    super();
    this.name = "FormatDate";
    this.module = "datetime";
    this.minArgs = 2;
    this.maxArgs = 2;
    this.signatures = [
      new Signature("string", [
        new Parameter("date", "d"),
        new Parameter("string", "format"),
      ]),
      new Signature("string", [
        new Parameter("string", "d"),
        new Parameter("string", "format"),
      ]),
    ];
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `GeneralDate` function.
 * 
 * Returns a string in the general date format for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class GeneralDate extends Func {
  constructor() {
    super();
    this.name = "GeneralDate";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("string", [new Parameter("date", "d")]),
      new Signature("string", [new Parameter("string", "d")]),
    ];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);

    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // "MM/DD/YYYY HH:MM:SS AM/PM"
    return new JbString(
      `${(date.value.getMonth()+1).toString().padStart(2, '0')}/${date.value.getDate().toString().padStart(2, '0')}/${date.value.getFullYear()} ${date.value.getHours() < 12 ? date.value.getHours().toString().padStart(2, '0') : (date.value.getHours()-12).toString().padStart(2, '0')}:${date.value.getMinutes().toString().padStart(2, '0')}:${date.value.getSeconds().toString().padStart(2, '0')} ${date.value.getHours() < 12 ? "AM" : "PM"}`
    );
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `GetUTCFormattedDate` function.
 * 
 * Returns a date string without time information.
 * Converts a date object or date string to a string according to a time zone code.
 */
export class GetUTCFormattedDate extends Func {
  constructor() {
    super();
    this.name = "GetUTCFormattedDate";
    this.module = "datetime";
    this.minArgs = 2;
    this.maxArgs = 3;
    this.signatures = [
      new Signature("string", [
        new Parameter("date", "d"),
        new Parameter("string", "time_zone_id"),
        new Parameter("bool", "is_european_format", false)
      ]),
      new Signature("string", [
        new Parameter("string", "d"),
        new Parameter("string", "time_zone_id"),
        new Parameter("bool", "is_european_format", false)
      ])
    ];
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `GetUTCFormattedDateTime` function.
 * 
 * Returns a date string with time information.
 * Converts a date object or date string to a string according to a time zone code.
 */
export class GetUTCFormattedDateTime extends Func {
  constructor() {
    super();
    this.name = "GetUTCFormattedDateTime";
    this.module = "datetime";
    this.minArgs = 2;
    this.maxArgs = 3;
    this.signatures = [
      new Signature("string", [
        new Parameter("date", "d"),
        new Parameter("string", "time_zone_id"),
        new Parameter("bool", "is_european_format", false)
      ]),
      new Signature("string", [
        new Parameter("string", "d"),
        new Parameter("string", "time_zone_id"),
        new Parameter("bool", "is_european_format", false)
      ])
    ];
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`${this.name} is currently unsupported`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `LastDayOfMonth` function.
 * 
 * Returns a date object representing the last day of the month for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class LastDayOfMonth extends Func {
  constructor() {
    super();
    this.name = "LastDayOfMonth";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("date", [new Parameter("date", "d")]),
      new Signature("date", [new Parameter("string", "d")])
    ];
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // local timezone-based last day of the month
    return new JbDate(
      new Date(
        date.value.getFullYear(),
        date.value.getMonth() + 1,
        0,
      )
    );
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `LongDate` function.
 * 
 * Returns a string in the long date format for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class LongDate extends Func {
  constructor() {
    super();
    this.name = "LongDate";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("string", [new Parameter("date", "d")]),
      new Signature("string", [new Parameter("string", "d")])
    ];
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // "Saturday, September 16, 2000"
    return new JbString(`${this.getWeekdayName(date.value)}, ${this.getMonthName(date.value)} ${date.value.getDate()}, ${date.value.getFullYear()}`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }

  /**
   * Returns the name of a weekday.
   * @param date 
   * @returns 
   */
  private getWeekdayName(date: Date) {
    switch (date.getDay()) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        // NaN
        throw new RuntimeError(`[${this.name} Invalid date]`);
    }
  }

  /**
   * Returns the name of the month.
   * @param date 
   * @returns 
   */
  private getMonthName(date: Date) {
    switch (date.getMonth()) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        // NaN
        throw new RuntimeError(`[${this.name} Invalid date]`);
    }
  }
}

/**
 * The implementation of `LongTime` function.
 * 
 * Returns a string in the long time format for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class LongTime extends Func {
  constructor() {
    super();
    this.name = "LongTime";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("string", [new Parameter("date", "d")]),
      new Signature("string", [new Parameter("string", "d")])
    ];
  }
  
  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // "HH:MM:SS AM/PM"
    // TODO: leading zero presence to be tested
    return new JbString(`${date.value.getHours() < 12 ? date.value.getHours().toString().padStart(2, '0') : (date.value.getHours() - 12).toString().padStart(2, '0')}:${date.value.getMinutes().toString().padStart(2, '0')}:${date.value.getSeconds().toString().padStart(2, '0')} ${date.value.getHours() < 12 ? "AM" : "PM"}`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `MediumDate` function.
 * 
 * Returns a string in the medium date format for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class MediumDate extends Func {
  constructor() {
    super();
    this.name = "MediumDate";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("string", [new Parameter("date", "d")]),
      new Signature("string", [new Parameter("string", "d")])
    ];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // "DD-Mth-YY"
    return new JbString(`${date.value.getDate().toString().padStart(2, '0')}-${this.getShortMonth(date.value.getMonth())}-${date.value.getFullYear().toString().substring(2)}`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }

  private getShortMonth(month: number) {
    switch (month) {
      case 0: 
        return "Jan";
      case 1: 
        return "Feb";
      case 2: 
        return "Mar";
      case 3: 
        return "Apr";
      case 4: 
        return "May";
      case 5: 
        return "Jun";
      case 6: 
        return "Jul";
      case 7: 
        return "Aug";
      case 8: 
        return "Sep";
      case 9: 
        return "Oct";
      case 10: 
        return "Nov";
      case 11: 
        return "Dec";
      default:
        throw new RuntimeError(`[${this.name}] Invalid month: ${month}`);
    }
  }
}

/**
 * The implementation of `MediumTime` function.
 * 
 * Returns a string in the medium time format for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class MediumTime extends Func {
  constructor() {
    super();
    this.name = "MediumTime";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("string", [new Parameter("date", "d")]),
      new Signature("string", [new Parameter("string", "d")])
    ];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // "HH:MM AM/PM"
    // TODO: leading zero presence to be tested
    return new JbString(`${date.value.getHours() < 12 ? date.value.getHours().toString().padStart(2, '0') : (date.value.getHours() - 12).toString().padStart(2, '0')}:${date.value.getMinutes().toString().padStart(2, '0')} ${date.value.getHours() < 12 ? "AM" : "PM"}`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `MonthOfYear` function.
 * 
 * Returns the month (1-12) for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class MonthOfYear extends Func {
  constructor() {
    super();
    this.name = "MonthOfYear";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("number", [new Parameter("date", "d")]),
      new Signature("number", [new Parameter("string", "d")])
    ];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    // TODO: to be moved into type checking
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // 1-12
    return new JbNumber(date.value.getMonth() + 1);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `Now` function.
 * 
 * Returns a date object representing the date and time values at the moment the function was run.
 * The fraction of the second is truncated.
 * 
 * This implementation always returns local time.
 */
export class Now extends Func {
  constructor() {
    super();
    this.name = "Now";
    this.module = "datetime";
    this.minArgs = 0;
    this.maxArgs = 0;
    this.signatures = [new Signature("date", [])];
    this.signature = this.signatures[0];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbDate();
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Now_` function.
 * 
 * Returns a date object representing the date and time values at the moment the function was run.
 * The time value includes the fraction of second (milliseconds).
 * 
 * This implementation always returns local time.
 */
export class Now_ extends Func {
  constructor() {
    super();
    this.name = "Now_";
    this.module = "datetime";
    this.minArgs = 0;
    this.maxArgs = 0;
    this.signatures = [new Signature("date", [])];
    this.signature = this.signatures[0];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    return new JbDate(new Date(), false);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `ShortDate` function.
 * 
 * Returns a string in the short date format for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class ShortDate extends Func {
  constructor() {
    super();
    this.name = "ShortDate";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("string", [new Parameter("date", "d")]),
      new Signature("string", [new Parameter("string", "d")])
    ];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // "(M)M/(D)D/YY"
    return new JbString(`${date.value.getMonth()+1}/${date.value.getDate()}/${date.value.getFullYear().toString().substring(2)}`);
  }
  
  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}

/**
 * The implementation of `ShortTime` function.
 * 
 * Returns a string in the short time format for a date object or date string.
 * 
 * The supported string formats are shared with the JavaScript `Date` object.
 * 
 * In this implementation the result is always UTC-based.
 */
export class ShortTime extends Func {
  constructor() {
    super();
    this.name = "ShortTime";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("string", [new Parameter("date", "d")]),
      new Signature("string", [new Parameter("string", "d")])
    ];
  }

  call(args: RuntimeVal[], scope: Scope) {
    this.chooseSignature(args);
    // TODO: probably uses an implicit conversion to string instead, to be tested
    if(args[0].type !== "string" && args[0].type !== "date")
      throw new RuntimeError(`${this.name} can only be called on date or string data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);

    let date = JbDate.parse(args[0]);

    // "HH:MM"
    return new JbString(`${date.value.getHours().toString().padStart(2, '0')}:${date.value.getMinutes().toString().padStart(2, '0')}`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[args[0].type === "string" ? 1 : 0];
  }
}
