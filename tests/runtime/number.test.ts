import { describe, expect, test } from '@jest/globals';
import { run } from '../utils';
import {
  JbBool,
  JbNull,
  JbNumber,
  JbString,
  JbArray,
  JbDictionary,
  JbBinary,
  JbDate
} from '../../src/runtime/types';
import Scope from '../../src/runtime/scope';

describe('JbNumber operators', function() {
  test('-number', function() {
    expect(
      new JbNumber(7.4).negative()
    ).toStrictEqual(new JbNumber(-7.4));
  });

  test('!number', function() {
    expect(
      new JbNumber(7.4).negate()
    ).toStrictEqual(new JbBool(false));
  });

  test('!0', function() {
    expect(
      new JbNumber(0).negate()
    ).toStrictEqual(new JbBool(true));
  });

  test('= number', function() {
    const rhs = new JbNumber(6.9);
    expect(
      Scope.assign(new JbArray(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--number', function() {
    const test = `
      <trans>
        value = 3.3;
        result = --value;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(2.3);
  });

  test('number--', function() {
    const test = `
      <trans>
        value = 3.3;
        result = value--;
        result + value;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(5.6);
  });

  test('++number', function() {
    const test = `
      <trans>
        value = 3.3;
        result = ++value;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(4.3);
  });

  test('number++', function() {
    const test = `
      <trans>
        value = 3.3;
        result = value++;
        result + value;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(7.6);
  });

  test('number -= number', function() {
    expect(
      Scope.assign(new JbNumber(6.9), "-=", new JbNumber(-0.1))
    ).toStrictEqual(new JbNumber(7));
  });

  test('number += number', function() {
    expect(
      Scope.assign(new JbNumber(6.9), "+=", new JbNumber(0.1))
    ).toStrictEqual(new JbNumber(7));
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
    ).toStrictEqual(new JbNumber(81));
  });

  test('number < number', function() {
    expect(
      new JbNumber(3.46).binopNumber("<", new JbNumber(3.461))
    ).toStrictEqual(new JbBool(true));
  });

  test('number > number', function() {
    expect(
      new JbNumber(3.46).binopNumber(">", new JbNumber(3.461))
    ).toStrictEqual(new JbBool(false));
  });

  test('number <= number', function() {
    expect(
      new JbNumber(3.46).binopNumber("<=", new JbNumber(3.461))
    ).toStrictEqual(new JbBool(true));
  });

  test('number >= number', function() {
    expect(
      new JbNumber(3.46).binopNumber(">=", new JbNumber(3.461))
    ).toStrictEqual(new JbBool(false));
  });

  test('number == number', function() {
    expect(
      new JbNumber(0).binopNumber("==", new JbNumber(0.0))
    ).toStrictEqual(new JbBool(true));
  });

  test('number != number', function() {
    expect(
      new JbNumber(0).binopNumber("!=", new JbNumber(0.0))
    ).toStrictEqual(new JbBool(false));
  });

  test('number && number', function() {
    expect(
      new JbNumber(0).binopNumber("&&", new JbNumber(0.0))
    ).toStrictEqual(new JbBool(false));
  });

  test('number & number', function() {
    expect(
      new JbNumber(0).binopNumber("&", new JbNumber(0.0))
    ).toStrictEqual(new JbBool(false));
  });

  test('number || number', function() {
    expect(
      new JbNumber(0).binopNumber("||", new JbNumber(0.1))
    ).toStrictEqual(new JbBool(true));
  });

  test('number | number', function() {
    expect(
      new JbNumber(0).binopNumber("|", new JbNumber(0.1))
    ).toStrictEqual(new JbBool(true));
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
    ).toStrictEqual(lhs);
  });

  test('number -= array', function() {
    expect(
      Scope.assign(
        new JbNumber(5.5),
        "-=",
        new JbArray([new JbNumber(3.5), new JbNumber(6)])
      )
    ).toStrictEqual(new JbArray([new JbNumber(2), new JbNumber(-0.5)]));
  });

  test('number -= {}', function() {
    const emptyArray = new JbArray();
    expect(
      Scope.assign(
        new JbNumber(5.5),
        "-=",
        emptyArray
      )
    ).toStrictEqual(emptyArray);
  });

  test('number -= dictionary', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "-=", new JbDictionary())
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
    ).toStrictEqual(new JbString("-3.3-2.7abcd"));
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
        new JbArray([new JbNumber(3.5), new JbNumber(6)])
      )
    ).toStrictEqual(new JbArray([new JbNumber(9), new JbNumber(11.5)]));
  });

  test('number += {}', function() {
    const emptyArray = new JbArray();
    expect(
      Scope.assign(
        new JbNumber(5.5),
        "+=",
        emptyArray
      )
    ).toStrictEqual(emptyArray);
  });

  test('number += dictionary', function() {
    expect(function() {
      return Scope.assign(new JbNumber(5.5), "+=", new JbDictionary())
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
    ).toStrictEqual(new JbString("5-420.69"));
  });

  test('number + null', function() {
    const lhs = new JbNumber(5.5);
    expect(
      lhs.binopNull("+", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('number + array', function() {
    expect(
      new JbNumber(5.5).binopArray("+", new JbArray([new JbNumber(3.5), new JbString("6")]))
    ).toStrictEqual(new JbArray([new JbNumber(9), new JbString("5.56")]));
  });

  test('number + {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("+", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number + dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("+", new JbDictionary())
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
    ).toStrictEqual(lhs);
  });

  test('number - array', function() {
    expect(function() {
      return new JbNumber(5.5).binopArray("-", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('number - {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("-", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number - dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("-", new JbDictionary())
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
    ).toStrictEqual(new JbNumber(0));
  });

  test('number * array', function() {
    expect(function() {
      return new JbNumber(5.5).binopArray("*", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('number * {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("*", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number * dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("*", new JbDictionary())
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
      return new JbNumber(5.5).binopArray("/", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('number / {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("/", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number / dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("/", new JbDictionary())
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
      return new JbNumber(5.5).binopArray("^", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('number ^ {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("^", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number ^ dictionary', function() {
    expect(function() {
      return new JbNumber(5.5).binopDict("^", new JbDictionary())
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
    ).toStrictEqual(new JbBool(true));
  });

  test('number < string', function() {
    expect(
      new JbNumber(421).binopString("<", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('number < null', function() {
    expect(
      new JbNumber(5.5).binopNull("<", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number < array', function() {
    const result = new JbNumber(5.5).binopArray(
      "<", new JbArray([new JbNumber(3.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(true)])
    );
  });

  test('number < {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("<", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number < dictionary', function() {
    expect(
      new JbNumber(-1).binopDict("<", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number < binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("<", new JbBinary())
    }).toThrow();
  });

  test('number < date', function() {
    expect(
      new JbNumber(5.5).binopDate("<", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(true));
  });

  test('number > bool', function() {
    expect(
      new JbNumber(1.1).binopBool(">", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('number > string', function() {
    expect(
      new JbNumber(421).binopString(">", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('number > null', function() {
    expect(
      new JbNumber(5.5).binopNull(">", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number > array', function() {
    const result = new JbNumber(5.5).binopArray(
      ">", new JbArray([new JbNumber(3.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(true), new JbBool(false)])
    );
  });

  test('number > {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray(">", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number > dictionary', function() {
    expect(
      new JbNumber(1).binopDict(">", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number > binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin(">", new JbBinary())
    }).toThrow();
  });

  test('number > date', function() {
    const timestamp = Math.floor(Date.UTC(2024, 0, 13) / 1000);
    expect(
      new JbNumber(timestamp).binopDate(">", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('number <= bool', function() {
    expect(
      new JbNumber(1).binopBool("<=", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('number <= string', function() {
    expect(
      new JbNumber(420.69).binopString("<=", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('number <= null', function() {
    expect(
      new JbNumber(5.5).binopNull("<=", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number <= array', function() {
    const result = new JbNumber(6).binopArray(
      "<=", new JbArray([new JbNumber(3.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(true)])
    );
  });

  test('number <= {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("<=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number <= dictionary', function() {
    expect(
      new JbNumber(0).binopDict("<=", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number <= binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("<=", new JbBinary())
    }).toThrow();
  });

  test('number <= date', function() {
    expect(
      new JbNumber(5.5).binopDate("<=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(true));
  });

  test('number >= bool', function() {
    expect(
      new JbNumber(1).binopBool(">=", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('number >= string', function() {
    expect(
      new JbNumber(420.69).binopString(">=", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('number >= null', function() {
    expect(
      new JbNumber(5.5).binopNull(">=", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number >= array', function() {
    const result = new JbNumber(3.5).binopArray(
      ">=", new JbArray([new JbNumber(3.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(true), new JbBool(false)])
    );
  });

  test('number >= {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray(">=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number >= dictionary', function() {
    expect(
      new JbNumber(0).binopDict(">=", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number >= binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin(">=", new JbBinary())
    }).toThrow();
  });

  test('number >= date', function() {
    const timestamp = Math.floor(Date.UTC(2024, 0, 13) / 1000);
    expect(
      new JbNumber(timestamp).binopDate(">=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(true));
  });

  test('number == bool', function() {
    expect(
      new JbNumber(1).binopBool("==", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('number == string', function() {
    expect(
      new JbNumber(420.69).binopString("==", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('number == null', function() {
    expect(
      new JbNumber(5.5).binopNull("==", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number == array', function() {
    const result = new JbNumber(6).binopArray(
      "==", new JbArray([new JbNumber(3.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(true)])
    );
  });

  test('number == {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("==", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number == dictionary', function() {
    expect(
      new JbNumber(0).binopDict("==", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('number == binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("==", new JbBinary())
    }).toThrow();
  });

  test('number == date', function() {
    const timestamp = Math.floor(Date.UTC(2024, 0, 13) / 1000);
    expect(
      new JbNumber(timestamp).binopDate("==", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(true));
  });

  test('number != bool', function() {
    expect(
      new JbNumber(0).binopBool("!=", new JbBool(false))
    ).toStrictEqual(new JbBool(false));
  });

  test('number != string', function() {
    expect(
      new JbNumber(420.69).binopString("!=", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('number != null', function() {
    expect(
      new JbNumber(0).binopNull("!=", new JbNull())
    ).toStrictEqual(new JbBool(true));
  });

  test('number != array', function() {
    const result = new JbNumber(6).binopArray(
      "!=", new JbArray([new JbNumber(3.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(true), new JbBool(false)])
    );
  });

  test('number != {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbNumber(5.5).binopArray("!=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('number != dictionary', function() {
    expect(
      new JbNumber(0).binopDict("!=", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number != binary', function() {
    expect(function() {
      return new JbNumber(5.5).binopBin("!=", new JbBinary())
    }).toThrow();
  });

  test('number != date', function() {
    const timestamp = Math.floor(Date.UTC(2024, 0, 13) / 1000);
    expect(
      new JbNumber(timestamp).binopDate("!=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('number && bool', function() {
    expect(
      new JbNumber(1.1).binopBool("&&", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('number && string', function() {
    expect(
      new JbNumber(421).binopString("&&", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('number && null', function() {
    expect(
      new JbNumber(5.5).binopNull("&&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number && array', function() {
    const result = new JbNumber(5.5).binopArray(
      "&&", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('number && {}', function() {
    expect(
      new JbNumber(5.5).binopArray("&&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('number && dictionary', function() {
    expect(
      new JbNumber(1).binopDict("&&", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('number && binary', function() {
    expect(
      new JbNumber(5.5).binopBin("&&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('number && date', function() {
    expect(
      new JbNumber(5.5).binopDate("&&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('number & bool', function() {
    expect(
      new JbNumber(1.1).binopBool("&", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('number & string', function() {
    expect(
      new JbNumber(421).binopString("&", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('number & null', function() {
    expect(
      new JbNumber(5.5).binopNull("&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number & array', function() {
    const result = new JbNumber(5.5).binopArray(
      "&", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('number & {}', function() {
    expect(
      new JbNumber(5.5).binopArray("&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('number & dictionary', function() {
    expect(
      new JbNumber(1).binopDict("&", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('number & binary', function() {
    expect(
      new JbNumber(5.5).binopBin("&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('number & date', function() {
    expect(
      new JbNumber(5.5).binopDate("&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('number || bool', function() {
    expect(
      new JbNumber(1.1).binopBool("||", new JbBool(false))
    ).toStrictEqual(new JbBool(true));
  });

  test('number || string', function() {
    expect(
      new JbNumber(0).binopString("||", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('number || null', function() {
    expect(
      new JbNumber(0).binopNull("||", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number || array', function() {
    const result = new JbNumber(0).binopArray(
      "||", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('number || {}', function() {
    expect(
      new JbNumber(5.5).binopArray("||", new JbArray())
    ).toStrictEqual(new JbBool(true));
  });

  test('number || dictionary', function() {
    expect(
      new JbNumber(1).binopDict("||", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number || binary', function() {
    expect(
      new JbNumber(5.5).binopBin("||", new JbBinary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number || date', function() {
    expect(
      new JbNumber(-5.5).binopDate("||", new JbDate())
    ).toStrictEqual(new JbBool(true));
  });

  test('number | bool', function() {
    expect(
      new JbNumber(1.1).binopBool("|", new JbBool(false))
    ).toStrictEqual(new JbBool(true));
  });

  test('number | string', function() {
    expect(
      new JbNumber(0).binopString("|", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('number | null', function() {
    expect(
      new JbNumber(0).binopNull("|", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('number | array', function() {
    const result = new JbNumber(0).binopArray(
      "|", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('number | {}', function() {
    expect(
      new JbNumber(5.5).binopArray("|", new JbArray())
    ).toStrictEqual(new JbBool(true));
  });

  test('number | dictionary', function() {
    expect(
      new JbNumber(1).binopDict("|", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number | binary', function() {
    expect(
      new JbNumber(5.5).binopBin("|", new JbBinary())
    ).toStrictEqual(new JbBool(true));
  });

  test('number | date', function() {
    expect(
      new JbNumber(-5.5).binopDate("|", new JbDate())
    ).toStrictEqual(new JbBool(true));
  });
});
