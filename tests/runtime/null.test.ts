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

describe('JbNull operators', function() {
  test('-null', function() {
    expect(function() {
      return new JbNull().negative()
    }).toThrow();
  });

  test('!null', function() {
    expect(
      new JbNull().negate()
    ).toStrictEqual(new JbBool(true));
  });

  test('= null', function() {
    const rhs = new JbNull();
    expect(
      Scope.assign(new Array(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--null', function() {
    expect(function() {
      return new JbNull().decrement()
    }).toThrow();
  });

  test('null--', function() {
    expect(function() {
      return new JbNull().decrement()
    }).toThrow();
  });

  test('++null', function() {
    expect(function() {
      return new JbNull().increment()
    }).toThrow();
  });

  test('null++', function() {
    expect(function() {
      return new JbNull().increment()
    }).toThrow();
  });

  test('null -= null', function() {
    const nil = new JbNull();
    expect(
      Scope.assign(nil, "-=", nil)
    ).toStrictEqual(nil);
  });

  test('null += null', function() {
    const nil = new JbNull();
    expect(
      Scope.assign(nil, "+=", nil)
    ).toStrictEqual(nil);
  });

  test('null + null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull("+", nil)
    ).toStrictEqual(nil);
  });

  test('null - null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull("-", nil)
    ).toStrictEqual(nil);
  });

  test('null * null', function() {
    const nil = new JbNull();
    expect(function() {
      return nil.binopNull("*", nil);
    }).toThrow();
  });

  test('null / null', function() {
    const nil = new JbNull();
    expect(function() {
      return nil.binopNull("/", nil)
    }).toThrow();
  });

  test('null ^ null', function() {
    const nil = new JbNull();
    expect(function() {
      return nil.binopNull("^", nil)
    }).toThrow();
  });

  test('null < null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull("<", nil)
    ).toStrictEqual(new JbBool(false));
  });

  test('null > null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull(">", nil)
    ).toStrictEqual(new JbBool(false));
  });

  test('null <= null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull("<=", nil)
    ).toStrictEqual(new JbBool(false));
  });

  test('null >= null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull(">=", nil)
    ).toStrictEqual(new JbBool(false));
  });

  test('null == null', function() {
    // reference checks such as the below fail too:
    // $a = Null();
    // $a == $a
    const nil = new JbNull();
    expect(
      nil.binopNull("==", nil)
    ).toStrictEqual(new JbBool(false));
  });

  test('null != null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull("!=", nil)
    ).toStrictEqual(new JbBool(true));
  });

  test('null && null', function() {
    expect(
      new JbNull().binopNull("&&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('null & null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull("&", nil)
    ).toStrictEqual(new JbBool(false));
  });

  test('null || null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull("||", nil)
    ).toStrictEqual(new JbBool(false));
  });

  test('null | null', function() {
    const nil = new JbNull();
    expect(
      nil.binopNull("|", nil)
    ).toStrictEqual(new JbBool(false));
  });
});

describe('JbNull cross-type interactions', function() {
  test('null -= number', function() {
    const num = new JbNumber(7);
    expect(
      Scope.assign(new JbNull(), "-=", num)
    ).toStrictEqual(num.negative());
  });

  test('null -= string', function() {
    expect(function() {
      return Scope.assign(new JbNull(), "-=", new JbString("-3.5abc"))
    }).toThrow();
  });

  test('null -= bool', function() {
    expect(function() {
      return Scope.assign(new JbNull(), "-=", new JbBool(true))
    }).toThrow();
  });

  test('null -= array', function() {
    expect(
      Scope.assign(
        new JbNull(),
        "-=",
        new Array([new JbNumber(3.5), new JbNumber(-6)])
      )
    ).toStrictEqual(new Array([new JbNumber(-3.5), new JbNumber(6)]));
  });

  test('null -= {}', function() {
    const emptyArray = new Array();
    expect(
      Scope.assign(new JbNull(), "-=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null -= dictionary', function() {
    expect(function() {
      return Scope.assign(new JbNull(), "-=", new Dictionary())
    }).toThrow();
  });

  test('null -= binary', function() {
    expect(function() {
      return Scope.assign(new JbNull(), "-=", new JbBinary())
    }).toThrow();
  });

  test('null -= date', function() {
    expect(function() {
      return Scope.assign(new JbNull(), "-=", new JbDate())
    }).toThrow();
  });

  test('null += number', function() {
    const rhs = new JbNumber(5.5);
    expect(
      Scope.assign(new JbNull(), "+=", rhs)
    ).toStrictEqual(rhs);
  });

  test('null += string', function() {
    const rhs = new JbString("-2.7abcd");
    expect(
      Scope.assign(new JbNull(), "+=", rhs)
    ).toStrictEqual(rhs);
  });

  test('null += bool', function() {
    const rhs = new JbBool(true);
    expect(
      Scope.assign(new JbNull(), "+=", rhs)
    ).toStrictEqual(rhs);
  });

  test('null += array', function() {
    const rhs = new Array([new JbString("3.5"), new JbString("6")]);
    expect(
      Scope.assign(new JbNull(), "+=", rhs)
    ).toStrictEqual(rhs);
  });

  test('null += {}', function() {
    const emptyArray = new Array();
    expect(
      Scope.assign(new JbNull(), "+=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null += dictionary', function() {
    expect(function() {
      return Scope.assign(new JbNull(), "+=", new Dictionary())
    }).toThrow();
  });

  test('null += binary', function() {
    const rhs = new JbBinary();
    expect(
      Scope.assign(new JbNull(), "+=", rhs)
    ).toStrictEqual(rhs);
  });

  test('null += date', function() {
    const rhs = new JbDate();
    expect(
      Scope.assign(new JbNull(), "+=", rhs)
    ).toStrictEqual(rhs);
  });

  test('null + number', function() {
    const rhs = new JbNumber(3);
    expect(
      new JbNull().binopNumber("+", rhs)
    ).toStrictEqual(rhs);
  });

  test('null + string', function() {
    const rhs = new JbString("-420.69");
    expect(
      new JbNull().binopString("+", rhs)
    ).toStrictEqual(rhs);
  });

  test('null + bool', function() {
    const rhs = new JbBool();
    expect(
      new JbNull().binopBool("+", rhs)
    ).toStrictEqual(rhs);
  });

  test('null + array', function() {
    const rhs = new Array([new JbNumber(3.5), new JbString("6")]);
    expect(
      new JbNull().binopArray("+", rhs)
    ).toStrictEqual(rhs);
  });

  test('null + {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("+", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null + dictionary', function() {
    expect(function() {
      return new JbNull().binopDict("+", new Dictionary())
    }).toThrow();
  });

  test('null + binary', function() {
    const rhs = new JbBinary();
    expect(
      new JbNull().binopBin("+", rhs)
    ).toStrictEqual(rhs);
  });

  test('null + date', function() {
    const rhs = new JbDate();
    expect(
      new JbNull().binopDate("+", rhs)
    ).toStrictEqual(rhs);
  });

  test('null - number', function() {
    const rhs = new JbNumber(5.6);
    expect(
      new JbNull().binopNumber("-", rhs)
    ).toStrictEqual(rhs.negative());
  });

  test('null - string', function() {
    expect(function() {
      return new JbNull().binopString("-", new JbString("-420.69"))
    }).toThrow();
  });

  test('null - bool', function() {
    expect(function() {
      new JbNull().binopBool("-", new JbBool())
    }).toThrow();
  });

  test('null - array', function() {
    expect(function() {
      return new JbNull().binopArray("-", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('null - {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("-", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null - dictionary', function() {
    expect(function() {
      return new JbNull().binopDict("-", new Dictionary())
    }).toThrow();
  });

  test('null - binary', function() {
    expect(function() {
      return new JbNull().binopBin("-", new JbBinary())
    }).toThrow();
  });

  test('null - date', function() {
    expect(function() {
      return new JbNull().binopDate("-", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('null * number', function() {
    expect(
      new JbNull().binopNumber("*", new JbNumber(2))
    ).toStrictEqual(new JbNumber(0));
  });

  test('null * string', function() {
    expect(function() {
      return new JbNull().binopString("*", new JbString("-420.69"))
    }).toThrow();
  });

  test('null * null', function() {
    expect(function() {
      new JbNull().binopNull("*", new JbNull())
    }).toThrow();
  });

  test('null * array', function() {
    expect(function() {
      return new JbNull().binopArray("*", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('null * {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("*", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null * dictionary', function() {
    expect(function() {
      return new JbNull().binopDict("*", new Dictionary())
    }).toThrow();
  });

  test('null * binary', function() {
    expect(function() {
      return new JbNull().binopBin("*", new JbBinary())
    }).toThrow();
  });

  test('null * date', function() {
    expect(function() {
      return new JbNull().binopDate("*", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('null / number', function() {
    expect(function() {
      return new JbNull().binopNumber("/", new JbNumber(0))
    }).toThrow();
  });

  test('null / string', function() {
    expect(function() {
      return new JbNull().binopString("/", new JbString("-420.69"))
    }).toThrow();
  });

  test('null / bool', function() {
    expect(function() {
      return new JbNull().binopBool("/", new JbBool())
    }).toThrow();
  });

  test('null / array', function() {
    expect(function() {
      return new JbNull().binopArray("/", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('null / {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("/", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null / dictionary', function() {
    expect(function() {
      return new JbNull().binopDict("/", new Dictionary())
    }).toThrow();
  });

  test('null / binary', function() {
    expect(function() {
      return new JbNull().binopBin("/", new JbBinary())
    }).toThrow();
  });

  test('null / date', function() {
    expect(function() {
      return new JbNull().binopDate("/", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('null ^ number', function() {
    expect(function() {
      return new JbNull().binopNumber("^", new JbNumber(2))
    }).toThrow();
  });

  test('null ^ string', function() {
    expect(function() {
      return new JbNull().binopString("^", new JbString("-420.69"))
    }).toThrow();
  });

  test('null ^ bool', function() {
    expect(function() {
      return new JbNull().binopBool("^", new JbBool())
    }).toThrow();
  });

  test('null ^ array', function() {
    expect(function() {
      return new JbNull().binopArray("^", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('null ^ {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("^", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null ^ dictionary', function() {
    expect(function() {
      return new JbNull().binopDict("^", new Dictionary())
    }).toThrow();
  });

  test('null ^ binary', function() {
    expect(function() {
      return new JbNull().binopBin("^", new JbBinary())
    }).toThrow();
  });

  test('null ^ date', function() {
    expect(function() {
      return new JbNull().binopDate("^", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('null < number', function() {
    expect(
      new JbNull().binopNumber("<", new JbNumber())
    ).toStrictEqual(new JbBool(false));
  });

  test('null < string', function() {
    expect(
      new JbNull().binopString("<", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('null < bool', function() {
    expect(
      new JbNull().binopBool("<", new JbBool())
    ).toStrictEqual(new JbBool(false));
  });

  test('null < array', function() {
    const result = new JbNull().binopArray(
      "<", new Array([new JbNumber(0.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(false)])
    );
  });

  test('null < {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("<", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null < dictionary', function() {
    expect(
      new JbNull().binopDict("<", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null < binary', function() {
    expect(
      new JbNull().binopBin("<", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null < date', function() {
    expect(
      new JbNull().binopDate("<", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('null > number', function() {
    expect(
      new JbNull().binopNumber(">", new JbNumber(0.5))
    ).toStrictEqual(new JbBool(false));
  });

  test('null > string', function() {
    expect(
      new JbNull().binopString(">", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('null > bool', function() {
    expect(
      new JbNull().binopBool(">", new JbBool())
    ).toStrictEqual(new JbBool(false));
  });

  test('null > array', function() {
    const result = new JbNull().binopArray(
      ">", new Array([new JbNumber(3.5), new JbString("6"), new JbNumber(-3.5)])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(false), new JbBool(false)])
    );
  });

  test('null > {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray(">", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null > dictionary', function() {
    expect(
      new JbNull().binopDict(">", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null > binary', function() {
    expect(
      new JbNull().binopBin(">", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null > date', function() {
    expect(
      new JbNull().binopDate(">", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('null <= number', function() {
    expect(
      new JbNull().binopNumber("<=", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('null <= string', function() {
    expect(
      new JbNull().binopString("<=", new JbString("1.00000niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('null <= bool', function() {
    expect(
      new JbNull().binopBool("<=", new JbBool())
    ).toStrictEqual(new JbBool(false));
  });

  test('null <= array', function() {
    const result = new JbNull().binopArray(
      "<=", new Array([new JbNumber(-3.5), new JbString("6"), new JbString("whatever")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(false), new JbBool(false)])
    );
  });

  test('null <= {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("<=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null <= dictionary', function() {
    expect(
      new JbNull().binopDict("<=", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null <= binary', function() {
    expect(
      new JbNull().binopBin("<=", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null <= date', function() {
    expect(
      new JbNull().binopDate("<=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('null >= number', function() {
    expect(
      new JbNull().binopNumber(">=", new JbNumber(1))
    ).toStrictEqual(new JbBool(false));
  });

  test('null >= string', function() {
    expect(
      new JbNull().binopString(">=", new JbString("1.0000000niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('null >= bool', function() {
    expect(
      new JbNull().binopBool(">=", new JbBool())
    ).toStrictEqual(new JbBool(false));
  });

  test('null >= array', function() {
    const result = new JbNull().binopArray(
      ">=", new Array([new JbNumber(1), new JbString("6"),new JbNumber(-4)])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(false), new JbBool(false)])
    );
  });

  test('null >= {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray(">=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null >= dictionary', function() {
    expect(
      new JbNull().binopDict(">=", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null >= binary', function() {
    expect(
      new JbNull().binopBin(">=", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null >= date', function() {
    expect(
      new JbNull().binopDate(">=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('null == number', function() {
    expect(
      new JbNull().binopNumber("==", new JbNumber(1))
    ).toStrictEqual(new JbBool(false));
  });

  test('null == string', function() {
    expect(
      new JbNull().binopString("==", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('null == bool', function() {
    expect(
      new JbNull().binopBool("==", new JbBool())
    ).toStrictEqual(new JbBool(false));
  });

  test('null == array', function() {
    const result = new JbNull().binopArray(
      "==", new Array([new JbNumber(3.5), new JbString("6"), new JbString("null")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(false), new JbBool(false)])
    );
  });

  test('null == {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("==", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null == dictionary', function() {
    expect(
      new JbNull().binopDict("==", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null == binary', function() {
    expect(
      new JbNull().binopBin("==", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null == date', function() {
    expect(
      new JbNull().binopDate("==", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('null != number', function() {
    expect(
      new JbNull().binopNumber("!=", new JbNumber(0))
    ).toStrictEqual(new JbBool(true));
  });

  test('null != string', function() {
    expect(
      new JbNull().binopString("!=", new JbString(""))
    ).toStrictEqual(new JbBool(true));
  });

  test('null != bool', function() {
    expect(
      new JbNull().binopBool("!=", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('null != array', function() {
    const result = new JbNull().binopArray(
      "!=", new Array([new JbNumber(3.5), new JbString("true"), new JbNull()])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(true), new JbBool(true), new JbBool(true)])
    );
  });

  test('null != {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNull().binopArray("!=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('null != dictionary', function() {
    expect(
      new JbNull().binopDict("!=", new Dictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('null != binary', function() {
    expect(
      new JbNull().binopBin("!=", new JbBinary())
    ).toStrictEqual(new JbBool(true));
  });

  test('null != date', function() {
    expect(
      new JbNull().binopDate("!=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(true));
  });

  test('null && number', function() {
    expect(
      new JbNull().binopNumber("&&", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('null && string', function() {
    expect(
      new JbNull().binopString("&&", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('null && bool', function() {
    expect(
      new JbNull().binopBool("&&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('null && array', function() {
    const result = new JbNull().binopArray(
      "&&", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('null && {}', function() {
    expect(
      new JbNull().binopArray("&&", new Array())
    ).toStrictEqual(new JbBool(false));
  });

  test('null && dictionary', function() {
    expect(
      new JbNull().binopDict("&&", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null && binary', function() {
    expect(
      new JbNull().binopBin("&&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null && date', function() {
    expect(
      new JbNull().binopDate("&&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('null & number', function() {
    expect(
      new JbNull().binopNumber("&", new JbNumber(-3))
    ).toStrictEqual(new JbBool(false));
  });

  test('null & string', function() {
    expect(
      new JbNull().binopString("&", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('null & bool', function() {
    expect(
      new JbNull().binopBool("&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('null & array', function() {
    const result = new JbNull().binopArray(
      "&", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('null & {}', function() {
    expect(
      new JbNull().binopArray("&", new Array())
    ).toStrictEqual(new JbBool(false));
  });

  test('null & dictionary', function() {
    expect(
      new JbNull().binopDict("&", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null & binary', function() {
    expect(
      new JbNull().binopBin("&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null & date', function() {
    expect(
      new JbNull().binopDate("&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('null || number', function() {
    expect(
      new JbNull().binopNumber("||", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('null || string', function() {
    expect(
      new JbNull().binopString("||", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('null || bool', function() {
    expect(
      new JbNull().binopBool("||", new JbBool(false))
    ).toStrictEqual(new JbBool(false));
  });

  test('null || array', function() {
    const result = new JbNull().binopArray(
      "||", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('null || {}', function() {
    expect(
      new JbNull().binopArray("||", new Array())
    ).toStrictEqual(new JbBool(false));
  });

  test('null || dictionary', function() {
    expect(
      new JbNull().binopDict("||", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null || binary', function() {
    expect(
      new JbNull().binopBin("||", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null || date', function() {
    expect(
      new JbNull().binopDate("||", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('null | number', function() {
    expect(
      new JbNull().binopNumber("|", new JbNumber(-1.4))
    ).toStrictEqual(new JbBool(true));
  });

  test('null | string', function() {
    expect(
      new JbNull().binopString("|", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('null | bool', function() {
    expect(
      new JbNull().binopBool("|", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('null | array', function() {
    const result = new JbNull().binopArray(
      "|", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('null | {}', function() {
    expect(
      new JbNull().binopArray("|", new Array())
    ).toStrictEqual(new JbBool(false));
  });

  test('null | dictionary', function() {
    expect(
      new JbNull().binopDict("|", new Dictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null | binary', function() {
    expect(
      new JbNull().binopBin("|", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('null | date', function() {
    expect(
      new JbNull().binopDate("|", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });
});
