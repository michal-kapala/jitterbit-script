import Scope from "../../runtime/scope";
import { JbBool, JbDate } from "../../runtime/types";
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
        new Parameter("bool", "is_european_format", false),
        new Parameter("bool", "ignoreDST", false, new JbBool(false)),
      ]),
      new Signature("string", [
        new Parameter("string", "d"),
        new Parameter("string", "fromTZ"),
        new Parameter("string", "toTZ"),
        // TODO: the default to be determined
        new Parameter("bool", "is_european_format", false),
        new Parameter("bool", "ignoreDST", false, new JbBool(false)),
      ])
    ];
  }

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `` function.
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
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
  
  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `GeneralDate` function.
 * 
 * Returns a string in the general date format for a date object or date string.
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `LastDayOfMonth` function.
 * 
 * Returns a date object representing the last day of the month for a date object or date string.
 */
export class LastDayOfMonth extends Func {
  constructor() {
    super();
    this.name = "LastDayOfMonth";
    this.module = "datetime";
    this.minArgs = 1;
    this.maxArgs = 1;
    this.signatures = [
      new Signature("string", [new Parameter("date", "d")]),
      new Signature("string", [new Parameter("string", "d")])
    ];
  }
  
  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `LongDate` function.
 * 
 * Returns a string in the long date format for a date object or date string.
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
  
  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `LongTime` function.
 * 
 * Returns a string in the long time format for a date object or date string.
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
  
  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `MediumDate` function.
 * 
 * Returns a string in the medium date format for a date object or date string.
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `MediumTime` function.
 * 
 * Returns a string in the medium time format for a date object or date string.
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `MonthOfYear` function.
 * 
 * Returns the month (1-12) for a date object or date string.
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `Now` function.
 * 
 * Returns a date object representing the date and time values at the moment the function was run.
 * The fraction of the second is truncated.
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

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `Now_` function.
 * 
 * Returns a date object representing the date and time values at the moment the function was run.
 * The time value includes the fraction of second (milliseconds).
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

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `ShortDate` function.
 * 
 * Returns a string in the short date format for a date object or date string.
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }
  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * The implementation of `ShortTime` function.
 * 
 * Returns a string in the short time format for a date object or date string.
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

  call(args: RuntimeVal[], scope: Scope): RuntimeVal {
    this.chooseSignature(args);
    throw new Error("Method not implemented.");
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    throw new Error("Method not implemented.");
  }
}
