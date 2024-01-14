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

describe('JbBool operators', function() {
  test('-true', function() {
    const bool = new JbBool(true);
    expect(
      bool.negative()
    ).toStrictEqual(bool);
  });

  test('-false', function() {
    const bool = new JbBool(false);
    expect(
      bool.negative()
    ).toStrictEqual(bool);
  });

  test('!true', function() {
    expect(
      new JbBool(true).negate()
    ).toEqual(new JbBool(false));
  });

  test('!false', function() {
    expect(
      new JbBool(false).negate()
    ).toEqual(new JbBool(true));
  });

  test('= bool', function() {
    const rhs = new JbBool(true);
    expect(
      Scope.assign(new Array(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--bool', function() {
    const test = `
      <trans>
        value = true;
        result = --value;
      </trans>`;
    expect(run(test)).toEqual(new JbBool(false));
  });

  test('bool--', function() {
    const test = `
      <trans>
        value = true;
        result = value--;
      </trans>`;
    expect(run(test)).toEqual(new JbBool(true));
  });

  test('++bool', function() {
    const test = `
      <trans>
        value = false;
        result = ++value;
      </trans>`;
    expect(run(test)).toEqual(new JbBool(true));
  });

  test('bool++', function() {
    const test = `
      <trans>
        value = false;
        result = value++;
      </trans>`;
      expect(run(test)).toEqual(new JbBool(false));
  });

  test('bool -= bool', function() {
    expect(function() {
      return Scope.assign(new JbBool(true), "-=", new JbBool(true))
    }).toThrow();
  });

  test('bool += bool', function() {
    expect(function() {
      return Scope.assign(new JbBool(true), "+=", new JbBool(true))
    }).toThrow();
  });

  test('bool + bool', function() {
    expect(function() {
      return new JbBool().binopBool("+", new JbBool())
    }).toThrow();
  });

  test('bool - bool', function() {
    expect(function() {
      return new JbBool().binopBool("-", new JbBool())
    }).toThrow();
  });

  test('bool * bool', function() {
    expect(function() {
      return new JbBool().binopBool("*", new JbBool())
    }).toThrow();
  });

  test('bool / bool', function() {
    expect(function() {
      return new JbBool().binopBool("/", new JbBool())
    }).toThrow();
  });

  test('bool ^ bool', function() {
    expect(function() {
      return new JbBool().binopBool("^", new JbBool())
    }).toThrow();
  });

  test('bool < bool', function() {
    expect(function() {
      new JbBool().binopBool("<", new JbBool())
    }).toThrow();
  });

  test('bool > bool', function() {
    expect(function() {
      new JbBool().binopBool(">", new JbBool())
    }).toThrow();
  });

  test('bool <= bool', function() {
    expect(function() {
      new JbBool().binopBool("<=", new JbBool())
    }).toThrow();
  });

  test('bool >= bool', function() {
    expect(function() {
      new JbBool().binopBool(">=", new JbBool())
    }).toThrow();
  });

  test('bool == bool', function() {
    expect(
      // tests the default value (true)
      new JbBool().binopBool("==", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('bool != bool', function() {
    expect(
      new JbBool(false).binopBool("!=", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('bool && bool', function() {
    expect(
      new JbBool(true).binopBool("&&", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('bool & bool', function() {
    expect(
      new JbBool(true).binopBool("&", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('bool || bool', function() {
    expect(
      new JbBool(false).binopBool("||", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('bool | bool', function() {
    expect(
      new JbBool(false).binopBool("|", new JbBool(true))
    ).toEqual(new JbBool(true));
  });
});

describe('JbBool cross-type interactions', function() {
  test('bool -= number', function() {
    expect(function() {
      return Scope.assign(new JbBool(true), "-=", new JbNumber(7))
    }).toThrow();
  });

  test('bool -= string', function() {
    expect(function() {
      return Scope.assign(new JbBool(true), "-=", new JbString("-3.5abc"))
    }).toThrow();
  });

  test('bool -= null', function() {
    expect(function() {
      return Scope.assign(new JbBool(true), "-=", new JbNull())
    }).toThrow();
  });

  test('bool -= array', function() {
    expect(function() {
      return Scope.assign(
        new JbBool(true),
        "-=",
        new Array([new JbNumber(3.5), new JbString("6")])
      );
    }).toThrow();
  });

  test('bool -= {}', function() {
    const emptyArray = new Array();
    expect(
      Scope.assign(
        new JbBool(false),
        "-=",
        emptyArray
      )
    ).toEqual(emptyArray);
  });

  test('bool -= dictionary', function() {
    expect(function() {
      return Scope.assign(new JbBool(true), "-=", new Dictionary())
    }).toThrow();
  });

  test('bool -= binary', function() {
    expect(function() {
      return Scope.assign(new JbBool(true), "-=", new JbBinary())
    }).toThrow();
  });

  test('bool -= date', function() {
    expect(function() {
      return Scope.assign(new JbBool(true), "-=", new JbDate())
    }).toThrow();
  });

  test('bool += number', function() {
    expect(function() {
      return Scope.assign(new JbBool(), "+=", new JbNumber(5.5))
    }).toThrow();
  });

  test('bool += string', function() {
    expect(
      Scope.assign(new JbBool(true), "+=", new JbString("-2.7abcd"))
    ).toEqual(new JbString("1-2.7abcd"));
  });

  test('bool += null', function() {
    const lhs = new JbBool(true);
    expect(
      Scope.assign(lhs, "+=", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('bool += array', function() {
    expect(
      Scope.assign(
        new JbBool(true),
        "+=",
        new Array([new JbString("3.5"), new JbString("6")])
      )
    ).toEqual(new Array([new JbString("13.5"), new JbString("16")]));
  });

  test('bool += {}', function() {
    const emptyArray = new Array();
    expect(
      Scope.assign(
        new JbBool(true),
        "+=",
        emptyArray
      )
    ).toEqual(emptyArray);
  });

  test('bool += dictionary', function() {
    expect(function() {
      return Scope.assign(new JbBool(), "+=", new Dictionary())
    }).toThrow();
  });

  test('bool += binary', function() {
    expect(function() {
      return Scope.assign(new JbBool(), "+=", new JbBinary())
    }).toThrow();
  });

  test('bool += date', function() {
    expect(function() {
      return Scope.assign(new JbBool(), "+=", new JbDate())
    }).toThrow();
  });

  test('bool + number', function() {
    expect(function() {
      return new JbBool().binopNumber("+", new JbNumber(3))
    }).toThrow();
  });

  test('bool + string', function() {
    expect(
      new JbBool(false).binopString("+", new JbString("-420.69"))
    ).toEqual(new JbString("0-420.69"));
  });

  test('bool + null', function() {
    const lhs = new JbBool();
    expect(
      lhs.binopNull("+", new JbNull())
    ).toEqual(lhs);
  });

  test('bool + array', function() {
    expect(function() {
      return new JbBool(true).binopArray("+", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('bool + {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("+", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool + dictionary', function() {
    expect(function() {
      return new JbBool().binopDict("+", new Dictionary())
    }).toThrow();
  });

  test('bool + binary', function() {
    expect(function() {
      return new JbBool().binopBin("+", new JbBinary())
    }).toThrow();
  });

  test('bool + date', function() {
    expect(function() {
      return new JbBool().binopDate("+", new JbDate())
    }).toThrow();
  });

  test('bool - number', function() {
    expect(function() {
      return new JbBool().binopNumber("-", new JbNumber())
    }).toThrow();
  });

  test('bool - string', function() {
    expect(function() {
      return new JbBool().binopString("-", new JbString("-420.69"))
    }).toThrow();
  });

  test('bool - null', function() {
    expect(function() {
      new JbBool().binopNull("-", new JbNull())
    }).toThrow();
  });

  test('bool - array', function() {
    expect(function() {
      return new JbBool().binopArray("-", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('bool - {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("-", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool - dictionary', function() {
    expect(function() {
      return new JbBool().binopDict("-", new Dictionary())
    }).toThrow();
  });

  test('bool - binary', function() {
    expect(function() {
      return new JbBool().binopBin("-", new JbBinary())
    }).toThrow();
  });

  test('bool - date', function() {
    expect(function() {
      return new JbBool().binopDate("-", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('bool * number', function() {
    expect(function() {
      return new JbBool().binopNumber("*", new JbNumber(2))
    }).toThrow();
  });

  test('bool * string', function() {
    expect(function() {
      return new JbBool().binopString("*", new JbString("-420.69"))
    }).toThrow();
  });

  test('bool * null', function() {
    expect(function() {
      new JbBool().binopNull("*", new JbNull())
    }).toThrow();
  });

  test('bool * array', function() {
    expect(function() {
      return new JbBool().binopArray("*", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('bool * {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("*", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool * dictionary', function() {
    expect(function() {
      return new JbBool().binopDict("*", new Dictionary())
    }).toThrow();
  });

  test('bool * binary', function() {
    expect(function() {
      return new JbBool().binopBin("*", new JbBinary())
    }).toThrow();
  });

  test('bool * date', function() {
    expect(function() {
      return new JbBool().binopDate("*", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('bool / number', function() {
    expect(function() {
      return new JbBool().binopNumber("/", new JbNumber(2))
    }).toThrow();
  });

  test('bool / string', function() {
    expect(function() {
      return new JbBool().binopString("/", new JbString("-420.69"))
    }).toThrow();
  });

  test('bool / null', function() {
    expect(function() {
      return new JbBool().binopNull("/", new JbNull())
    }).toThrow();
  });

  test('bool / array', function() {
    expect(function() {
      return new JbBool().binopArray("/", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('bool / {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("/", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool / dictionary', function() {
    expect(function() {
      return new JbBool().binopDict("/", new Dictionary())
    }).toThrow();
  });

  test('bool / binary', function() {
    expect(function() {
      return new JbBool().binopBin("/", new JbBinary())
    }).toThrow();
  });

  test('bool / date', function() {
    expect(function() {
      return new JbBool().binopDate("/", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('bool ^ number', function() {
    expect(function() {
      return new JbBool().binopNumber("^", new JbNumber(2))
    }).toThrow();
  });

  test('bool ^ string', function() {
    expect(function() {
      return new JbBool().binopString("^", new JbString("-420.69"))
    }).toThrow();
  });

  test('bool ^ null', function() {
    expect(function() {
      return new JbBool().binopNull("^", new JbNull())
    }).toThrow();
  });

  test('bool ^ array', function() {
    expect(function() {
      return new JbBool().binopArray("^", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('bool ^ {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("^", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool ^ dictionary', function() {
    expect(function() {
      return new JbBool().binopDict("^", new Dictionary())
    }).toThrow();
  });

  test('bool ^ binary', function() {
    expect(function() {
      return new JbBool().binopBin("^", new JbBinary())
    }).toThrow();
  });

  test('bool ^ date', function() {
    expect(function() {
      return new JbBool().binopDate("^", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('bool < number', function() {
    expect(
      new JbBool().binopNumber("<", new JbNumber())
    ).toEqual(new JbBool(false));
  });

  test('bool < string', function() {
    expect(
      new JbBool().binopString("<", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('bool < null', function() {
    expect(
      new JbBool().binopNull("<", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('bool < array', function() {
    const result = new JbBool(true).binopArray(
      "<", new Array([new JbNumber(0.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(true)])
    );
  });

  test('bool < {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("<", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool < dictionary', function() {
    expect(
      new JbBool().binopDict("<", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('bool < binary', function() {
    expect(function() {
      return new JbBool().binopBin("<", new JbBinary())
    }).toThrow();
  });

  test('bool < date', function() {
    expect(
      new JbBool().binopDate("<", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('bool > number', function() {
    expect(
      new JbBool().binopNumber(">", new JbNumber(0.5))
    ).toEqual(new JbBool(true));
  });

  test('bool > string', function() {
    expect(
      new JbBool().binopString(">", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(false));
  });

  test('bool > null', function() {
    expect(
      new JbBool().binopNull(">", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('bool > array', function() {
    const result = new JbBool().binopArray(
      ">", new Array([new JbNumber(3.5), new JbString("6"), new JbNumber(-3.5)])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(false), new JbBool(true)])
    );
  });

  test('bool > {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray(">", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool > dictionary', function() {
    expect(
      new JbBool(false).binopDict(">", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('bool > binary', function() {
    expect(function() {
      return new JbBool().binopBin(">", new JbBinary())
    }).toThrow();
  });

  test('bool > date', function() {
    expect(
      new JbBool().binopDate(">", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('bool <= number', function() {
    expect(
      new JbBool(false).binopNumber("<=", new JbNumber(0))
    ).toEqual(new JbBool(true));
  });

  test('bool <= string', function() {
    expect(
      new JbBool(true).binopString("<=", new JbString("1.00000niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('bool <= null', function() {
    expect(
      new JbBool().binopNull("<=", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('bool <= array', function() {
    const result = new JbBool(false).binopArray(
      "<=", new Array([new JbNumber(-3.5), new JbString("6"), new JbString("whatever")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(true), new JbBool(true)])
    );
  });

  test('bool <= {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("<=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool <= dictionary', function() {
    expect(
      new JbBool(true).binopDict("<=", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('bool <= binary', function() {
    expect(function() {
      return new JbBool().binopBin("<=", new JbBinary())
    }).toThrow();
  });

  test('bool <= date', function() {
    expect(
      new JbBool().binopDate("<=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('bool >= number', function() {
    expect(
      new JbBool().binopNumber(">=", new JbNumber(1))
    ).toEqual(new JbBool(true));
  });

  test('bool >= string', function() {
    expect(
      new JbBool().binopString(">=", new JbString("1.0000000niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('bool >= null', function() {
    expect(
      new JbBool().binopNull(">=", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('bool >= array', function() {
    const result = new JbBool(true).binopArray(
      ">=", new Array([new JbNumber(1), new JbString("6"),new JbNumber(-4)])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(true), new JbBool(false), new JbBool(true)])
    );
  });

  test('bool >= {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray(">=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool >= dictionary', function() {
    expect(
      new JbBool(false).binopDict(">=", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('bool >= binary', function() {
    expect(function() {
      return new JbBool().binopBin(">=", new JbBinary())
    }).toThrow();
  });

  test('bool >= date', function() {
    expect(
      new JbBool().binopDate(">=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('bool == number', function() {
    expect(
      new JbBool(true).binopNumber("==", new JbNumber(1))
    ).toEqual(new JbBool(true));
  });

  test('bool == string', function() {
    expect(
      new JbBool(true).binopString("==", new JbString("whatever"))
    ).toEqual(new JbBool(false));
  });

  test('bool == null', function() {
    expect(
      new JbBool().binopNull("==", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('bool == array', function() {
    const result = new JbBool(true).binopArray(
      "==", new Array([new JbNumber(3.5), new JbString("6"), new JbString("1")])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(true), new JbBool(true), new JbBool(true)])
    );
  });

  test('bool == {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("==", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool == dictionary', function() {
    expect(
      new JbBool(false).binopDict("==", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('bool == binary', function() {
    expect(
      new JbBool(false).binopBin("==", new JbBinary())
    ).toEqual(new JbBool(true));
  });

  test('bool == date', function() {
    expect(
      new JbBool(true).binopDate("==", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('bool != number', function() {
    expect(
      new JbBool(false).binopNumber("!=", new JbNumber(0))
    ).toEqual(new JbBool(false));
  });

  test('bool != string', function() {
    expect(
      new JbBool(true).binopString("!=", new JbString("true"))
    ).toEqual(new JbBool(false));
  });

  test('bool != null', function() {
    expect(
      new JbBool(false).binopNull("!=", new JbNull())
    ).toEqual(new JbBool(true));
  });

  test('bool != array', function() {
    const result = new JbBool(true).binopArray(
      "!=", new Array([new JbNumber(3.5), new JbString("true"), new JbNumber(0)])
    );
    expect(result).toStrictEqual(
      new Array([new JbBool(false), new JbBool(false), new JbBool(true)])
    );
  });

  test('bool != {}', function() {
    const emptyArray = new Array();
    expect(
      new JbBool().binopArray("!=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('bool != dictionary', function() {
    expect(
      new JbBool(true).binopDict("!=", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('bool != binary', function() {
    expect(
      new JbBool(true).binopBin("!=", new JbBinary())
    ).toEqual(new JbBool(true));
  });

  test('bool != date', function() {
    expect(
      new JbBool(true).binopDate("!=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('bool && number', function() {
    expect(
      new JbBool(true).binopNumber("&&", new JbNumber(0))
    ).toEqual(new JbBool(false));
  });

  test('bool && string', function() {
    expect(
      new JbBool(true).binopString("&&", new JbString("whatever"))
    ).toEqual(new JbBool(false));
  });

  test('bool && null', function() {
    expect(
      new JbBool(true).binopNull("&&", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('bool && array', function() {
    const result = new JbBool(true).binopArray(
      "&&", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('bool && {}', function() {
    expect(
      new JbBool().binopArray("&&", new Array())
    ).toEqual(new JbBool(false));
  });

  test('bool && dictionary', function() {
    expect(
      new JbBool().binopDict("&&", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('bool && binary', function() {
    expect(
      new JbBool().binopBin("&&", new JbBinary())
    ).toEqual(new JbBool(false));
  });

  test('bool && date', function() {
    expect(
      new JbBool().binopDate("&&", new JbDate())
    ).toEqual(new JbBool(false));
  });

  test('bool & number', function() {
    expect(
      new JbBool(true).binopNumber("&", new JbNumber(-3))
    ).toEqual(new JbBool(true));
  });

  test('bool & string', function() {
    expect(
      new JbBool(true).binopString("&", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('bool & null', function() {
    expect(
      new JbBool(true).binopNull("&", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('bool & array', function() {
    const result = new JbBool(true).binopArray(
      "&", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('bool & {}', function() {
    expect(
      new JbBool().binopArray("&", new Array())
    ).toEqual(new JbBool(false));
  });

  test('bool & dictionary', function() {
    expect(
      new JbBool(true).binopDict("&", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('bool & binary', function() {
    expect(
      new JbBool().binopBin("&", new JbBinary())
    ).toEqual(new JbBool(false));
  });

  test('bool & date', function() {
    expect(
      new JbBool(false).binopDate("&", new JbDate())
    ).toEqual(new JbBool(false));
  });

  test('bool || number', function() {
    expect(
      new JbBool(false).binopNumber("||", new JbNumber(0))
    ).toEqual(new JbBool(false));
  });

  test('bool || string', function() {
    expect(
      new JbBool(false).binopString("||", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('bool || null', function() {
    expect(
      new JbBool(true).binopNull("||", new JbNull())
    ).toEqual(new JbBool(true));
  });

  test('bool || array', function() {
    const result = new JbBool(false).binopArray(
      "||", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('bool || {}', function() {
    expect(
      new JbBool().binopArray("||", new Array())
    ).toEqual(new JbBool(true));
  });

  test('bool || dictionary', function() {
    expect(
      new JbBool(true).binopDict("||", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('bool || binary', function() {
    expect(
      new JbBool(true).binopBin("||", new JbBinary())
    ).toEqual(new JbBool(true));
  });

  test('bool || date', function() {
    expect(
      new JbBool(false).binopDate("||", new JbDate())
    ).toEqual(new JbBool(false));
  });

  test('bool | number', function() {
    expect(
      new JbBool(false).binopNumber("|", new JbNumber(-1.4))
    ).toEqual(new JbBool(true));
  });

  test('bool | string', function() {
    expect(
      new JbBool(true).binopString("|", new JbString("whatever"))
    ).toEqual(new JbBool(true));
  });

  test('bool | null', function() {
    expect(
      new JbBool(false).binopNull("|", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('bool | array', function() {
    const result = new JbBool(true).binopArray(
      "|", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(true));
  });

  test('bool | {}', function() {
    expect(
      new JbBool(true).binopArray("|", new Array())
    ).toEqual(new JbBool(true));
  });

  test('bool | dictionary', function() {
    expect(
      new JbBool(true).binopDict("|", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('bool | binary', function() {
    expect(
      new JbBool(true).binopBin("|", new JbBinary())
    ).toEqual(new JbBool(true));
  });

  test('bool | date', function() {
    expect(
      new JbBool(false).binopDate("|", new JbDate())
    ).toEqual(new JbBool(false));
  });
});
