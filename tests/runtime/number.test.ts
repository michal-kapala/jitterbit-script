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

describe('JbNumber operators', function() {
  test('-number', function() {
    expect(
      new JbNumber(7.4).negative()
    ).toEqual(new JbNumber(-7.4));
  });

  test('!number', function() {
    expect(
      new JbNumber(7.4).negate()
    ).toEqual(new JbBool(false));
  });

  test('!0', function() {
    expect(
      new JbNumber(0).negate()
    ).toEqual(new JbBool(true));
  });

  test('= number', function() {
    const rhs = new JbNumber(6.9);
    expect(
      Scope.assign(new Array(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--number', function() {
    const test = `
      <trans>
        num = 3.3;
        result = --num;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(2.3);
  });

  test('number--', function() {
    const test = `
      <trans>
        num = 3.3;
        result = num--;
        result + num;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(5.6);
  });

  test('++number', function() {
    const test = `
      <trans>
        num = 3.3;
        result = ++num;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(4.3);
  });

  test('number++', function() {
    const test = `
      <trans>
        num = 3.3;
        result = num++;
        result + num;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(7.6);
  });

  test('number -= number', function() {
    expect(
      Scope.assign(new JbNumber(6.9), "-=", new JbNumber(-0.1))
    ).toEqual(new JbNumber(7));
  });

  test('number += number', function() {
    expect(
      Scope.assign(new JbNumber(6.9), "+=", new JbNumber(0.1))
    ).toEqual(new JbNumber(7));
  });

  test('number + number', function() {
    expect(
      new JbNumber(1.234).binopNumber("+", new JbNumber(0.5)).value
    ).toBeCloseTo(1.734);
  });

  test('number - number', function() {
    expect(
      new JbNumber(1).binopNumber("-", new JbNumber(1.2)).value
    ).toBeCloseTo(-0.2);
  });

  test('number * number', function() {
    const test = `
      <trans>
        13 * -5 * -2
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBe(130);
  });

  test('number / number', function() {
    const test = `
      <trans>
        13 / 4 / 3.25
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(1);
  });

  test('number / 0', function() {
    expect(function() {
      return new JbNumber(13).binopNumber("/", new JbNumber(0))
    }).toThrow();
  });

  test('number ^ number', function() {
    expect(
      new JbNumber(3).binopNumber("^", new JbNumber(4))
    ).toEqual(new JbNumber(81));
  });

  test('number < number', function() {
    expect(
      new JbNumber(3.46).binopNumber("<", new JbNumber(3.461))
    ).toEqual(new JbBool(true));
  });

  test('number > number', function() {
    expect(
      new JbNumber(3.46).binopNumber(">", new JbNumber(3.461))
    ).toEqual(new JbBool(false));
  });

  test('number <= number', function() {
    expect(
      new JbNumber(3.46).binopNumber("<=", new JbNumber(3.461))
    ).toEqual(new JbBool(true));
  });

  test('number >= number', function() {
    expect(
      new JbNumber(3.46).binopNumber(">=", new JbNumber(3.461))
    ).toEqual(new JbBool(false));
  });

  test('number == number', function() {
    expect(
      new JbNumber(0).binopNumber("==", new JbNumber(0.0))
    ).toEqual(new JbBool(true));
  });

  test('number != number', function() {
    expect(
      new JbNumber(0).binopNumber("!=", new JbNumber(0.0))
    ).toEqual(new JbBool(false));
  });

  test('number && number', function() {
    expect(
      new JbNumber(0).binopNumber("&&", new JbNumber(0.0))
    ).toEqual(new JbBool(false));
  });

  test('number & number', function() {
    expect(
      new JbNumber(0).binopNumber("&", new JbNumber(0.0))
    ).toEqual(new JbBool(false));
  });

  test('number || number', function() {
    expect(
      new JbNumber(0).binopNumber("||", new JbNumber(0.1))
    ).toEqual(new JbBool(true));
  });

  test('number | number', function() {
    expect(
      new JbNumber(0).binopNumber("|", new JbNumber(0.1))
    ).toEqual(new JbBool(true));
  });
});

describe('JbNumber cross-type interactions', function() {
  test('number -= bool', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "-=", new JbBool())
    }).toThrow();
  });

  test('number -= string', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "-=", new JbString("-3.5abc"))
    }).toThrow();
  });

  test('number -= null', function() {
    const lhs = new JbNumber(5.5);
    expect(
      Scope.assign(lhs, "-=", new JbNull())
    ).toEqual(lhs);
  });

  test('number -= array', function() {
    expect(
      Scope.assign(
        new JbNumber(5.5),
        "-=",
        new Array([new JbNumber(3.5), new JbNumber(6)])
      )
    ).toEqual(new Array([new JbNumber(2), new JbNumber(-0.5)]));
  });

  test('number -= {}', function() {
    const emptyArray = new Array();
    expect(
      Scope.assign(
        new JbNumber(5.5),
        "-=",
        emptyArray
      )
    ).toEqual(emptyArray);
  });

  test('number -= dictionary', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "-=", new Dictionary())
    }).toThrow();
  });

  test('number -= binary', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "-=", new JbBinary())
    }).toThrow();
  });

  test('number -= date', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "-=", new JbDate())
    }).toThrow();
  });

  test('number += bool', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "+=", new JbBool())
    }).toThrow();
  });

  test('number += string', function() {
    expect(
      Scope.assign(new JbNumber(-3.3), "+=", new JbString("-2.7abcd"))
    ).toEqual(new JbString("-3.3-2.7abcd"));
  });

  test('number += null', function() {
    const lhs = new JbNumber(5.5);
    expect(
      Scope.assign(lhs, "+=", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('number += array', function() {
    expect(
      Scope.assign(
        new JbNumber(5.5),
        "+=",
        new Array([new JbNumber(3.5), new JbNumber(6)])
      )
    ).toEqual(new Array([new JbNumber(9), new JbNumber(11.5)]));
  });

  test('number += {}', function() {
    const emptyArray = new Array();
    expect(
      Scope.assign(
        new JbNumber(5.5),
        "+=",
        emptyArray
      )
    ).toEqual(emptyArray);
  });

  test('number += dictionary', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "+=", new Dictionary())
    }).toThrow();
  });

  test('number += binary', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "+=", new JbBinary())
    }).toThrow();
  });

  test('number += date', function() {
    const test = `
      <trans>
        num = 5;
        num += LastDayOfMonth("1/13/24");
      </trans>
    `;
    const result = run(test) as JbDate;
    expect(result.type).toBe("date");
    expect(result.toString()).toBe("2024-01-31 00:00:05.000");
  });

  test('number + bool', function() {
    expect(function() {
      return new JbNumber(1).binopBool("+", new JbBool())
    }).toThrow();
  });

  test('number + string', function() {
    expect(
      new JbNumber(5).binopString("+", new JbString("-420.69"))
    ).toEqual(new JbString("5-420.69"));
  });

  test('number + null', function() {
    const lhs = new JbNumber(5.5);
    expect(
      lhs.binopNull("+", new JbNull())
    ).toEqual(lhs);
  });

  test('number + array', function() {
    expect(
      new JbNumber(5.5).binopArray("+", new Array([new JbNumber(3.5), new JbString("6")]))
    ).toEqual(new Array([new JbNumber(9), new JbString("5.56")]));
  });

  test('number + {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("+", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number + dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("+", new Dictionary())
    }).toThrow();
  });

  test('number + binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("+", new JbBinary())
    }).toThrow();
  });

  test('number + date', function() {
    const test = `
      <trans>
        5 + LastDayOfMonth("1/13/24");
      </trans>
    `;
    const result = run(test) as JbDate;
    expect(result.type).toBe("date");
    expect(result.toString()).toBe("2024-01-31 00:00:05.000");
  });

  test('number - bool', function() {
    expect(function() {
      return new JbNumber(1).binopBool("-", new JbBool())
    }).toThrow();
  });

  test('number - string', function() {
    expect(function() {
      return new JbNumber(5).binopString("-", new JbString("-420.69"))
    }).toThrow();
  });

  test('number - null', function() {
    const lhs = new JbNumber(5.5);
    expect(
      lhs.binopNull("-", new JbNull())
    ).toEqual(lhs);
  });

  test('number - array', function() {
    expect(function() {
      return new JbNumber(5.5).binopArray("-", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('number - {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("-", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number - dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("-", new Dictionary())
    }).toThrow();
  });

  test('number - binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("-", new JbBinary())
    }).toThrow();
  });

  test('number - date', function() {
    expect(function() {
      return new JbNumber(5.5).binopDate("-", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('number * bool', function() {
    expect(function() {
      return new JbNumber(1).binopBool("*", new JbBool())
    }).toThrow();
  });

  test('number * string', function() {
    expect(function() {
      return new JbNumber(5).binopString("*", new JbString("-420.69"))
    }).toThrow();
  });

  test('number * null', function() {
    expect(
      new JbNumber(5.5).binopNull("*", new JbNull())
    ).toEqual(new JbNumber(0));
  });

  test('number * array', function() {
    expect(function() {
      return new JbNumber(5.5).binopArray("*", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('number * {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("*", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number * dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("*", new Dictionary())
    }).toThrow();
  });

  test('number * binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("*", new JbBinary())
    }).toThrow();
  });

  test('number * date', function() {
    expect(function() {
      return new JbNumber(5.5).binopDate("*", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('number / bool', function() {
    expect(function() {
      return new JbNumber(1).binopBool("/", new JbBool())
    }).toThrow();
  });

  test('number / string', function() {
    expect(function() {
      return new JbNumber(5).binopString("/", new JbString("-420.69"))
    }).toThrow();
  });

  test('number / null', function() {
    expect(function() {
      return new JbNumber(5.5).binopNull("/", new JbNull())
    }).toThrow();
  });

  test('number / array', function() {
    expect(function() {
      return new JbNumber(5.5).binopArray("/", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('number / {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("/", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number / dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("/", new Dictionary())
    }).toThrow();
  });

  test('number / binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("/", new JbBinary())
    }).toThrow();
  });

  test('number / date', function() {
    expect(function() {
      return new JbNumber(5.5).binopDate("/", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('number ^ bool', function() {
    expect(function() {
      return new JbNumber(1).binopBool("^", new JbBool())
    }).toThrow();
  });

  test('number ^ string', function() {
    expect(function() {
      return new JbNumber(5).binopString("^", new JbString("-420.69"))
    }).toThrow();
  });

  test('number ^ null', function() {
    expect(function() {
      return new JbNumber(5.5).binopNull("^", new JbNull())
    }).toThrow();
  });

  test('number ^ array', function() {
    expect(function() {
      return new JbNumber(5.5).binopArray("^", new Array([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('number ^ {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("^", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number ^ dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("^", new Dictionary())
    }).toThrow();
  });

  test('number ^ binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("^", new JbBinary())
    }).toThrow();
  });

  test('number ^ date', function() {
    expect(function() {
      return new JbNumber(5.5).binopDate("^", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('number < bool', function() {
    expect(
      new JbNumber(0.7).binopBool("<", new JbBool())
    ).toEqual(new JbBool(true));
  });

  test('number < string', function() {
    expect(
      new JbNumber(421).binopString("<", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(false));
  });

  test('number < null', function() {
    expect(
      new JbNumber(5.5).binopNull("<", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number < array', function() {
    const result = new JbNumber(5.5).binopArray(
      "<", new Array([new JbNumber(3.5), new JbString("6")])
    );
    expect(result.members[0]).toEqual(new JbBool(false));
    expect(result.members[1]).toEqual(new JbBool(true));
  });

  test('number < {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("<", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number < dictionary', function() {
    expect(
      new JbNumber(-1).binopDict("<", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('number < binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("<", new JbBinary())
    }).toThrow();
  });

  test('number < date', function() {
    expect(
      new JbNumber(5.5).binopDate("<", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('number > bool', function() {
    expect(
      new JbNumber(1.1).binopBool(">", new JbBool())
    ).toEqual(new JbBool(true));
  });

  test('number > string', function() {
    expect(
      new JbNumber(421).binopString(">", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('number > null', function() {
    expect(
      new JbNumber(5.5).binopNull(">", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number > array', function() {
    const result = new JbNumber(5.5).binopArray(
      ">", new Array([new JbNumber(3.5), new JbString("6")])
    );
    expect(result.members[0]).toEqual(new JbBool(true));
    expect(result.members[1]).toEqual(new JbBool(false));
  });

  test('number > {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray(">", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number > dictionary', function() {
    expect(
      new JbNumber(1).binopDict(">", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('number > binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin(">", new JbBinary())
    }).toThrow();
  });

  test('number > date', function() {
    // timezone-proof
    const localTimestamp = Math.floor(Date.UTC(2024, 0, 13) / 1000);
    expect(
      new JbNumber(
        localTimestamp + new Date().getTimezoneOffset() * 60
      ).binopDate(">", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('number <= bool', function() {
    expect(
      new JbNumber(1).binopBool("<=", new JbBool())
    ).toEqual(new JbBool(true));
  });

  test('number <= string', function() {
    expect(
      new JbNumber(420.69).binopString("<=", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('number <= null', function() {
    expect(
      new JbNumber(5.5).binopNull("<=", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number <= array', function() {
    const result = new JbNumber(6).binopArray(
      "<=", new Array([new JbNumber(3.5), new JbString("6")])
    );
    expect(result.members[0]).toEqual(new JbBool(false));
    expect(result.members[1]).toEqual(new JbBool(true));
  });

  test('number <= {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("<=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number <= dictionary', function() {
    expect(
      new JbNumber(0).binopDict("<=", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('number <= binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("<=", new JbBinary())
    }).toThrow();
  });

  test('number <= date', function() {
    expect(
      new JbNumber(5.5).binopDate("<=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('number >= bool', function() {
    expect(
      new JbNumber(1).binopBool(">=", new JbBool())
    ).toEqual(new JbBool(true));
  });

  test('number >= string', function() {
    expect(
      new JbNumber(420.69).binopString(">=", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('number >= null', function() {
    expect(
      new JbNumber(5.5).binopNull(">=", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number >= array', function() {
    const result = new JbNumber(3.5).binopArray(
      ">=", new Array([new JbNumber(3.5), new JbString("6")])
    );
    expect(result.members[0]).toEqual(new JbBool(true));
    expect(result.members[1]).toEqual(new JbBool(false));
  });

  test('number >= {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray(">=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number >= dictionary', function() {
    expect(
      new JbNumber(0).binopDict(">=", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('number >= binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin(">=", new JbBinary())
    }).toThrow();
  });

  test('number >= date', function() {
    // timezone-proof
    const localTimestamp = Math.floor(Date.UTC(2024, 0, 13) / 1000);
    expect(
      new JbNumber(
        localTimestamp + new Date().getTimezoneOffset() * 60
      ).binopDate(">=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('number == bool', function() {
    expect(
      new JbNumber(1).binopBool("==", new JbBool(true))
    ).toEqual(new JbBool(true));
  });

  test('number == string', function() {
    expect(
      new JbNumber(420.69).binopString("==", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('number == null', function() {
    expect(
      new JbNumber(5.5).binopNull("==", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number == array', function() {
    const result = new JbNumber(6).binopArray(
      "==", new Array([new JbNumber(3.5), new JbString("6")])
    );
    expect(result.members[0]).toEqual(new JbBool(false));
    expect(result.members[1]).toEqual(new JbBool(true));
  });

  test('number == {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("==", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number == dictionary', function() {
    expect(
      new JbNumber(0).binopDict("==", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('number == binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("==", new JbBinary())
    }).toThrow();
  });

  test('number == date', function() {
    // timezone-proof
    const localTimestamp = Math.floor(Date.UTC(2024, 0, 13) / 1000);
    expect(
      new JbNumber(
         localTimestamp + new Date().getTimezoneOffset() * 60
      ).binopDate("==", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(true));
  });

  test('number != bool', function() {
    expect(
      new JbNumber(0).binopBool("!=", new JbBool(false))
    ).toEqual(new JbBool(false));
  });

  test('number != string', function() {
    expect(
      new JbNumber(420.69).binopString("!=", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(false));
  });

  test('number != null', function() {
    expect(
      new JbNumber(0).binopNull("!=", new JbNull())
    ).toEqual(new JbBool(true));
  });

  test('number != array', function() {
    const result = new JbNumber(6).binopArray(
      "!=", new Array([new JbNumber(3.5), new JbString("6")])
    );
    expect(result.members[0]).toEqual(new JbBool(true));
    expect(result.members[1]).toEqual(new JbBool(false));
  });

  test('number != {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("!=", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number != dictionary', function() {
    expect(
      new JbNumber(0).binopDict("!=", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('number != binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("!=", new JbBinary())
    }).toThrow();
  });

  test('number != date', function() {
    // timezone-proof
    const localTimestamp = Math.floor(Date.UTC(2024, 0, 13) / 1000);
    expect(
      new JbNumber(
         localTimestamp + new Date().getTimezoneOffset() * 60
      ).binopDate("!=", new JbDate(new Date("1/13/24")))
    ).toEqual(new JbBool(false));
  });

  test('number && bool', function() {
    expect(
      new JbNumber(1.1).binopBool("&&", new JbBool())
    ).toEqual(new JbBool(true));
  });

  test('number && string', function() {
    expect(
      new JbNumber(421).binopString("&&", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('number && null', function() {
    expect(
      new JbNumber(5.5).binopNull("&&", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number && array', function() {
    const result = new JbNumber(5.5).binopArray(
      "&&", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result.members[0]).toEqual(new JbBool(true));
    expect(result.members[1]).toEqual(new JbBool(false));
  });

  test('number && {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("&&", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number && dictionary', function() {
    expect(
      new JbNumber(1).binopDict("&&", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('number && binary', function() {
    expect(
      new JbNumber(5.5).binopBin("&&", new JbBinary())
    ).toEqual(new JbBool(false));
  });

  test('number && date', function() {
    expect(
      new JbNumber(5.5).binopDate("&&", new JbDate())
    ).toEqual(new JbBool(false));
  });

  test('number & bool', function() {
    expect(
      new JbNumber(1.1).binopBool("&", new JbBool())
    ).toEqual(new JbBool(true));
  });

  test('number & string', function() {
    expect(
      new JbNumber(421).binopString("&", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('number & null', function() {
    expect(
      new JbNumber(5.5).binopNull("&", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number & array', function() {
    const result = new JbNumber(5.5).binopArray(
      "&", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result.members[0]).toEqual(new JbBool(true));
    expect(result.members[1]).toEqual(new JbBool(false));
  });

  test('number & {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("&", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number & dictionary', function() {
    expect(
      new JbNumber(1).binopDict("&", new Dictionary())
    ).toEqual(new JbBool(false));
  });

  test('number & binary', function() {
    expect(
      new JbNumber(5.5).binopBin("&", new JbBinary())
    ).toEqual(new JbBool(false));
  });

  test('number & date', function() {
    expect(
      new JbNumber(5.5).binopDate("&", new JbDate())
    ).toEqual(new JbBool(false));
  });

  test('number || bool', function() {
    expect(
      new JbNumber(1.1).binopBool("||", new JbBool(false))
    ).toEqual(new JbBool(true));
  });

  test('number || string', function() {
    expect(
      new JbNumber(0).binopString("||", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('number || null', function() {
    expect(
      new JbNumber(0).binopNull("||", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number || array', function() {
    const result = new JbNumber(0).binopArray(
      "||", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result.members[0]).toEqual(new JbBool(true));
    expect(result.members[1]).toEqual(new JbBool(false));
  });

  test('number || {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("||", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number || dictionary', function() {
    expect(
      new JbNumber(1).binopDict("||", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('number || binary', function() {
    expect(
      new JbNumber(5.5).binopBin("||", new JbBinary())
    ).toEqual(new JbBool(true));
  });

  test('number || date', function() {
    expect(
      new JbNumber(-5.5).binopDate("||", new JbDate())
    ).toEqual(new JbBool(true));
  });

  test('number | bool', function() {
    expect(
      new JbNumber(1.1).binopBool("|", new JbBool(false))
    ).toEqual(new JbBool(true));
  });

  test('number | string', function() {
    expect(
      new JbNumber(0).binopString("|", new JbString("420.69niceinnit"))
    ).toEqual(new JbBool(true));
  });

  test('number | null', function() {
    expect(
      new JbNumber(0).binopNull("|", new JbNull())
    ).toEqual(new JbBool(false));
  });

  test('number | array', function() {
    const result = new JbNumber(0).binopArray(
      "|", new Array([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result.members[0]).toEqual(new JbBool(true));
    expect(result.members[1]).toEqual(new JbBool(false));
  });

  test('number | {}', function() {
    const emptyArray = new Array();
    expect(
      new JbNumber(5.5).binopArray("|", emptyArray)
    ).toEqual(emptyArray);
  });

  test('number | dictionary', function() {
    expect(
      new JbNumber(1).binopDict("|", new Dictionary())
    ).toEqual(new JbBool(true));
  });

  test('number | binary', function() {
    expect(
      new JbNumber(5.5).binopBin("|", new JbBinary())
    ).toEqual(new JbBool(true));
  });

  test('number | date', function() {
    expect(
      new JbNumber(-5.5).binopDate("|", new JbDate())
    ).toEqual(new JbBool(true));
  });
});
