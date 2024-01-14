import { describe, expect, test } from '@jest/globals';
import run from '../utils';
import {
  JbBool,
  JbNull,
  JbNumber,
  JbString,
  Array,
  Dictionary,
  JbBinary,
  JbDate
} from '../../src/runtime/types';
import Scope from '../../src/runtime/scope';

describe('JbString operators', function() {
  test('-string', function() {
    expect(
      new JbString("-12310.4jbb35").negative()
    ).toStrictEqual(new JbString("12310.4"));
  });

  test('!string', function() {
    expect(
      new JbString("0").negate()
    ).toStrictEqual(new JbBool(true));
  });

  test('= string', function() {
    const rhs = new JbString("true123");
    expect(
      Scope.assign(new Array(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--string', function() {
    const test = `
      <trans>
        value = "13";
        result = --value;
      </trans>`;
    expect(run(test)).toStrictEqual(new JbString("12"));
  });

  test('string--', function() {
    const test = `
      <trans>
        value = "13";
        result = value--;
      </trans>`;
    expect(run(test)).toStrictEqual(new JbString("13"));
  });

  test('++string', function() {
    const test = `
      <trans>
        value = "13";
        result = ++value;
      </trans>`;
    expect(run(test)).toEqual(new JbString("14"));
  });

  test('string++', function() {
    const test = `
      <trans>
        value = "13";
        result = value++;
      </trans>`;
    expect(run(test)).toEqual(new JbString("13"));
  });

  test('string -= string', function() {
    expect(function() {
      return Scope.assign(new JbString("17.5"), "-=", new JbString("-2.5"))
    }).toThrow();
  });

  test('string += string', function() {
    expect(
      Scope.assign(new JbString("17.5"), "+=", new JbString("-2.5"))
    ).toStrictEqual(new JbString("17.5-2.5"));
  });

  test('string + string', function() {
    expect(
      new JbString("17.5").binopString("+", new JbString("-2.5"))
    ).toStrictEqual(new JbString("17.5-2.5"));
  });

  test('string - string', function() {
    expect(function() {
      return new JbString("2a").binopString("-", new JbString("1"))
    }).toThrow();
  });

  test('string * string', function() {
    expect(function() {
      return new JbString().binopString("*", new JbString())
    }).toThrow();
  });

  test('string / string', function() {
    expect(function() {
      return new JbString().binopString("/", new JbString())
    }).toThrow();
  });

  test('string ^ string', function() {
    expect(function() {
      return new JbString().binopString("^", new JbString())
    }).toThrow();
  });

  test('string < string', function() {
    expect(
      new JbString("abcd").binopString("<", new JbString("bcde"))
    ).toStrictEqual(new JbBool(true));
  });

  test('string > string', function() {
    expect(
      new JbString("1234").binopString(">", new JbString("01234"))
    ).toStrictEqual(new JbBool(true));
  });

  test('string <= string', function() {
    expect(
      new JbString("0").binopString("<=", new JbString("0.0"))
    ).toStrictEqual(new JbBool(true));
  });

  test('string >= string', function() {
    expect(
      new JbString("whatever").binopString(">=", new JbString("1whatever1"))
    ).toStrictEqual(new JbBool(true));
  });

  test('string == string', function() {
    expect(
      // tests the default value ("")
      new JbString().binopString("==", new JbString())
    ).toEqual(new JbBool(true));
  });

  test('string != string', function() {
    expect(
      new JbString("true").binopString("!=", new JbString("t"))
    ).toEqual(new JbBool(true));
  });

  test('string && string', function() {
    // POD: "t" strings dont evaluate to true
    expect(
      new JbString("true").binopString("&&", new JbString("t"))
    ).toEqual(new JbBool(false));
  });

  test('string & string', function() {
    expect(
      new JbString("true").binopString("&", new JbString("-1.1"))
    ).toEqual(new JbBool(true));
  });

  test('string || string', function() {
    expect(
      new JbString("0").binopString("||", new JbString("hi"))
    ).toEqual(new JbBool(false));
  });

  test('string | string', function() {
    expect(
      new JbString("1").binopString("|", new JbString("hi"))
    ).toEqual(new JbBool(true));
  });
});

describe('JbString cross-type interactions', function() {
  test('string -= number', function() {
    expect(function() {
      return Scope.assign(new JbString("25"), "-=", new JbNumber(7))
    }).toThrow();
  });

  test('string -= bool', function() {
    expect(function() {
      return Scope.assign(new JbString("-3.5abc"), "-=", new JbBool(true))
    }).toThrow();
  });

  test('string -= null', function() {
    expect(function() {
      return Scope.assign(new JbString(), "-=", new JbNull())
    }).toThrow();
  });

  test('string -= array', function() {
    expect(function() {
      return Scope.assign(
        new JbString("5.5"),
        "-=",
        new Array([new JbNumber(3.5), new JbString("6")])
      );
    }).toThrow();
  });

  test('string -= {}', function() {
    const emptyArray = new Array();
    expect(
      Scope.assign(
        new JbString(),
        "-=",
        emptyArray
      )
    ).toEqual(emptyArray);
  });

  test('string -= dictionary', function() {
    expect(function() {
      return Scope.assign(new JbString(), "-=", new Dictionary())
    }).toThrow();
  });

  test('string -= binary', function() {
    expect(function() {
      return Scope.assign(new JbString(), "-=", new JbBinary())
    }).toThrow();
  });

  test('string -= date', function() {
    expect(function() {
      return Scope.assign(new JbString(), "-=", new JbDate())
    }).toThrow();
  });

  test('string += number', function() {
    expect(
      Scope.assign(new JbString("2.5"), "+=", new JbNumber(5.5))
    ).toStrictEqual(new JbString("2.55.5"));
  });

  test('string += bool', function() {
    expect(
      Scope.assign(new JbString("-2.7abcd"), "+=", new JbBool(true))
    ).toEqual(new JbString("-2.7abcd1"));
  });

  test('string += null', function() {
    const lhs = new JbString();
    expect(
      Scope.assign(lhs, "+=", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('string += array', function() {
    expect(
      Scope.assign(
        new JbString("1true"),
        "+=",
        new Array([new JbString("3.5"), new JbString("6")])
      )
    ).toEqual(new Array([new JbString("1true3.5"), new JbString("1true6")]));
  });

  test('string += {}', function() {
    const emptyArray = new Array();
    expect(
      Scope.assign(
        new JbString("€"),
        "+=",
        emptyArray
      )
    ).toEqual(emptyArray);
  });

  test('string += dictionary', function() {
    expect(function() {
      return Scope.assign(new JbString(), "+=", new Dictionary())
    }).toThrow();
  });

  test('string += binary', function() {
    expect(function() {
      return Scope.assign(new JbString(), "+=", new JbBinary())
    }).toThrow();
  });

  test('string += date', function() {
    expect(
      Scope.assign(new JbString("2date: "), "+=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbString("2date: 2024-01-13 00:00:00.000"));
  });

  test('string + number', function() {
    expect(
      new JbString().binopNumber("+", new JbNumber(3))
    ).toStrictEqual(new JbString("3"));
  });

  test('string + bool', function() {
    expect(
      new JbString("boolean: ").binopBool("+", new JbBool(true))
    ).toEqual(new JbString("boolean: 1"));
  });

  test('string + null', function() {
    const lhs = new JbString();
    expect(
      lhs.binopNull("+", new JbNull())
    ).toEqual(lhs);
  });

  test('string + array', function() {
    expect(
      new JbString("2this").binopArray("+",
        new Array([new JbNumber(3.5), new JbString("6")])
      )
    ).toStrictEqual(new Array([new JbString("2this3.5"), new JbString("2this6")]));
  });

  test('string + {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("+", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string + dictionary', function() {
    expect(function() {
      return new JbString().binopDict("+", new Dictionary())
    }).toThrow();
  });

  test('string + binary', function() {
    expect(function() {
      return new JbString().binopBin("+", new JbBinary())
    }).toThrow();
  });

  test('string + date', function() {
    expect(
      new JbString("someDate: ").binopDate("+", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbString("someDate: 2024-01-13 00:00:00.000"));
  });

  test('string - number', function() {
    expect(function() {
      return new JbString().binopNumber("-", new JbNumber())
    }).toThrow();
  });

  test('string - bool', function() {
    expect(function() {
      return new JbString().binopBool("-", new JbBool(true))
    }).toThrow();
  });

  test('string - null', function() {
    expect(function() {
      new JbString().binopNull("-", new JbNull())
    }).toThrow();
  });

  test('string - array', function() {
    expect(function() {
      return new JbString().binopArray("-", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('string - {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("-", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string - dictionary', function() {
    expect(function() {
      return new JbString().binopDict("-", new Dictionary())
    }).toThrow();
  });

  test('string - binary', function() {
    expect(function() {
      return new JbString().binopBin("-", new JbBinary())
    }).toThrow();
  });

  test('string - date', function() {
    expect(function() {
      return new JbString().binopDate("-", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('string * number', function() {
    expect(function() {
      return new JbString().binopNumber("*", new JbNumber(2))
    }).toThrow();
  });

  test('string * bool', function() {
    expect(function() {
      return new JbString().binopBool("*", new JbBool())
    }).toThrow();
  });

  test('string * null', function() {
    expect(function() {
      new JbString().binopNull("*", new JbNull())
    }).toThrow();
  });

  test('string * array', function() {
    expect(function() {
      return new JbString().binopArray("*", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('string * {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("*", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string * dictionary', function() {
    expect(function() {
      return new JbString().binopDict("*", new Dictionary())
    }).toThrow();
  });

  test('string * binary', function() {
    expect(function() {
      return new JbString().binopBin("*", new JbBinary())
    }).toThrow();
  });

  test('string * date', function() {
    expect(function() {
      return new JbString().binopDate("*", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('string / number', function() {
    expect(function() {
      return new JbString().binopNumber("/", new JbNumber(2))
    }).toThrow();
  });

  test('string / bool', function() {
    expect(function() {
      return new JbString().binopBool("/", new JbBool(true))
    }).toThrow();
  });

  test('string / null', function() {
    expect(function() {
      return new JbString().binopNull("/", new JbNull())
    }).toThrow();
  });

  test('string / array', function() {
    expect(function() {
      return new JbString().binopArray("/", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('string / {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("/", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string / dictionary', function() {
    expect(function() {
      return new JbString().binopDict("/", new Dictionary())
    }).toThrow();
  });

  test('string / binary', function() {
    expect(function() {
      return new JbString().binopBin("/", new JbBinary())
    }).toThrow();
  });

  test('string / date', function() {
    expect(function() {
      return new JbString().binopDate("/", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('string ^ number', function() {
    expect(function() {
      return new JbString().binopNumber("^", new JbNumber(2))
    }).toThrow();
  });

  test('string ^ bool', function() {
    expect(function() {
      return new JbString().binopBool("^", new JbBool())
    }).toThrow();
  });

  test('string ^ null', function() {
    expect(function() {
      return new JbString().binopNull("^", new JbNull())
    }).toThrow();
  });

  test('string ^ array', function() {
    expect(function() {
      return new JbString().binopArray("^", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('string ^ {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("^", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string ^ dictionary', function() {
    expect(function() {
      return new JbString().binopDict("^", new Dictionary())
    }).toThrow();
  });

  test('string ^ binary', function() {
    expect(function() {
      return new JbString().binopBin("^", new JbBinary())
    }).toThrow();
  });

  test('string ^ date', function() {
    expect(function() {
      return new JbString().binopDate("^", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('string < number', function() {
    expect(
      new JbString("-56.1 this gets truncated").binopNumber("<", new JbNumber(0))
    ).toEqual(new JbBool(true));
  });

  test('string < bool', function() {
    expect(
      new JbString("whatever").binopBool("<", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('string < null', function() {
    expect(
      new JbString("1").binopNull("<", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('string < array', function() {
    const result = new JbString("true").binopArray(
      "<", new Array([new JbNumber(0.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(true), new JbBool(false)])
    );
  });

  test('string < {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("<", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string < dictionary', function() {
    expect(
      new JbString("-1").binopDict("<", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('string < binary', function() {
    expect(function() {
      return new JbString().binopBin("<", new JbBinary())
    }).toThrow();
  });

  test('string < date', function() {
    expect(
      new JbString("1705190400").binopDate("<", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('string > number', function() {
    expect(
      new JbString("1").binopNumber(">", new JbNumber(0.5))
    ).toEqual(new JbBool(true));
  });

  test('string > bool', function() {
    expect(
      new JbString("1.01").binopBool(">", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('string > null', function() {
    expect(
      new JbString().binopNull(">", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('string > array', function() {
    const result = new JbString("€").binopArray(
      ">", new Array([new JbNumber(3.5), new JbString("6"), new JbNumber(-3.5)])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(true), new JbBool(true)])
    );
  });

  test('string > {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString("whatever").binopArray(">", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string > dictionary', function() {
    expect(
      new JbString("0.01").binopDict(">", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('string > binary', function() {
    expect(function() {
      return new JbString().binopBin(">", new JbBinary())
    }).toThrow();
  });

  test('string > date', function() {
    expect(
      // equal timestamp
      new JbString("1705104000").binopDate(">", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('string <= number', function() {
    expect(
      new JbString("false").binopNumber("<=", new JbNumber(-0))
    ).toEqual(new JbBool(true));
  });

  test('string <= bool', function() {
    expect(
      new JbString("1.1").binopBool("<=", new JbBool(true))
    ).toEqual(new JbBool(false));
  });

  test('string <= null', function() {
    expect(
      new JbString().binopNull("<=", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('string <= array', function() {
    const result = new JbString("-1").binopArray(
      "<=", new Array([new JbNumber(-3.5), new JbString("6"), new JbString("whatever")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(true), new JbBool(true)])
    );
  });

  test('string <= {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("<=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string <= dictionary', function() {
    expect(
      new JbString("whatever").binopDict("<=", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('string <= binary', function() {
    expect(function() {
      return new JbString().binopBin("<=", new JbBinary())
    }).toThrow();
  });

  test('string <= date', function() {
    expect(
      // timestamp + 1
      new JbString("1705104001").binopDate("<=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('string >= number', function() {
    expect(
      new JbString("whatever123").binopNumber(">=", new JbNumber(1))
    ).toEqual(new JbBool(false));
  });

  test('string >= bool', function() {
    expect(
      new JbString("true").binopBool(">=", new JbBool(true))
    ).toEqual(new JbBool(false));
  });

  test('string >= null', function() {
    expect(
      new JbString().binopNull(">=", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('string >= array', function() {
    const result = new JbString("true").binopArray(
      ">=", new Array([new JbNumber(1), new JbString("6"), new JbString("whatever")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(true), new JbBool(false)])
    );
  });

  test('string >= {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray(">=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string >= dictionary', function() {
    expect(
      new JbString(".1").binopDict(">=", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('string >= binary', function() {
    expect(function() {
      return new JbString().binopBin(">=", new JbBinary())
    }).toThrow();
  });

  test('string >= date', function() {
    expect(
      // timestamp + 1
      new JbString("1705104001").binopDate(">=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('string == number', function() {
    expect(
      new JbString("1").binopNumber("==", new JbNumber(1))
    ).toEqual(new JbBool(true));
  });

  test('string == bool', function() {
    expect(
      new JbString("whatever").binopBool("==", new JbBool(true))
    ).toEqual(new JbBool(false));
  });

  test('string == null', function() {
    expect(
      new JbString("null").binopNull("==", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('string == array', function() {
    const result = new JbString("3.5e10").binopArray(
      "==", new Array([new JbNumber(3.5), new JbString("6"), new JbString("1")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(true), new JbBool(false), new JbBool(false)])
    );
  });

  test('string == {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("==", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string == dictionary', function() {
    expect(
      new JbString().binopDict("==", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('string == binary', function() {
    expect(function() {
      return new JbString().binopBin("==", new JbBinary())
    }).toThrow();
  });

  test('string == date', function() {
    expect(
      new JbString("1/13/24").binopDate("==", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('string != number', function() {
    expect(
      new JbString("0").binopNumber("!=", new JbNumber(0))
    ).toEqual(new JbBool(false));
  });

  test('string != bool', function() {
    expect(
      new JbString("true").binopBool("!=", new JbBool(true))
    ).toEqual(new JbBool(false));
  });

  test('string != null', function() {
    expect(
      new JbString().binopNull("!=", new JbNull())
    ).toEqual(new JbBool(true));
  });

  test('string != array', function() {
    const result = new JbString("false").binopArray(
      "!=", new Array([new JbNumber(3.5), new JbString("true"), new JbNumber(0)])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(true), new JbBool(true), new JbBool(false)])
    );
  });

  test('string != {}', function() {
    const emptyArray = new Array();
    expect(
      new JbString().binopArray("!=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('string != dictionary', function() {
    expect(
      new JbString("[]").binopDict("!=", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('string != binary', function() {
    expect(function() {
      return new JbString().binopBin("!=", new JbBinary())
    }).toThrow();
  });

  test('string != date', function() {
    expect(
      new JbString("2024-01-13 00:00:00.000").binopDate("!=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('string && number', function() {
    expect(
      new JbString("$whatever").binopNumber("&&", new JbNumber(0))
    ).toEqual(new JbBool(false));
  });

  test('string && bool', function() {
    expect(
      new JbString("true").binopBool("&&", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('string && null', function() {
    expect(
      new JbString("true").binopNull("&&", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('string && array', function() {
    expect(
      new JbString("-.5").binopArray(
        "&&", new Array([new JbNumber(3.5), new JbString("true")])
      )
    ).toStrictEqual(new JbBool(false));
  });

  test('string && {}', function() {
    expect(
      new JbString().binopArray("&&", new Array())
    ).toEqual(new JbBool(false));
  });

  test('string && dictionary', function() {
    expect(
      new JbString("true").binopDict("&&", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('string && binary', function() {
    expect(
      new JbString("true").binopBin("&&", new JbBinary())
    ).toEqual(new JbBool(false));
  });

  test('string && date', function() {
    expect(
      new JbString("true").binopDate("&&", new JbDate())
    ).toEqual(new JbBool(false));
  });

  test('string & number', function() {
    expect(
      new JbString("true").binopNumber("&", new JbNumber(0))
    ).toEqual(new JbBool(false));
  });

  test('string & bool', function() {
    expect(
      new JbString("E420.69niceinnit").binopBool("&", new JbBool(true))
    ).toEqual(new JbBool(false));
  });

  test('string & null', function() {
    expect(
      new JbString("false").binopNull("&", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('string & array', function() {
    const result = new JbString("false").binopArray(
      "&", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('string & {}', function() {
    expect(
      new JbString().binopArray("&", new Array())
    ).toEqual(new JbBool(false));
  });

  test('string & dictionary', function() {
    expect(
      new JbString("true").binopDict("&", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('string & binary', function() {
    expect(
      new JbString("true").binopBin("&", new JbBinary())
    ).toEqual(new JbBool(false));
  });

  test('string & date', function() {
    expect(
      new JbString("1705104000").binopDate("&", new JbDate())
    ).toEqual(new JbBool(false));
  });

  test('string || number', function() {
    expect(
      new JbString("0").binopNumber("||", new JbNumber(0))
    ).toEqual(new JbBool(false));
  });

  test('string || bool', function() {
    expect(
      // POD: "t"/"T" is not a truthy value
      new JbString("T").binopBool("||", new JbBool(false))
    ).toEqual(new JbBool(false));
  });

  test('string || null', function() {
    expect(
      new JbString("true").binopNull("||", new JbNull())
    ).toEqual(new JbBool(true));
  });

  test('string || array', function() {
    const result = new JbString("false").binopArray(
      "||", new Array([new JbNumber(3.5), new JbString("NaN"), new JbBool(true)])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('string || {}', function() {
    expect(
      new JbString().binopArray("||", new Array())
    ).toEqual(new JbBool(false));
  });

  test('string || dictionary', function() {
    expect(
      new JbString("true").binopDict("||", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('string || binary', function() {
    expect(
      new JbString("true").binopBin("||", new JbBinary())
    ).toEqual(new JbBool(true));
  });

  test('string || date', function() {
    expect(
      new JbString("true").binopDate("||", new JbDate())
    ).toEqual(new JbBool(true));
  });

  test('string | number', function() {
    expect(
      new JbString("true").binopNumber("||", new JbNumber(0))
    ).toEqual(new JbBool(true));
  });

  test('string | bool', function() {
    expect(
      new JbString("0xABCD1234").binopBool("|", new JbBool(false))
    ).toEqual(new JbBool(false));
  });

  test('string | null', function() {
    expect(
      new JbString().binopNull("|", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('string | array', function() {
    const result = new JbString("0").binopArray(
      "|", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('string | {}', function() {
    expect(
      new JbString("true").binopArray("|", new Array())
    ).toEqual(new JbBool(true));
  });

  test('string | dictionary', function() {
    expect(
      new JbString().binopDict("|", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('string | binary', function() {
    expect(
      new JbString().binopBin("|", new JbBinary())
    ).toEqual(new JbBool(false));
  });

  test('string | date', function() {
    expect(
      new JbString().binopDate("|", new JbDate())
    ).toEqual(new JbBool(false));
  });
});
