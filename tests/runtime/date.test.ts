import { describe, expect, test } from '@jest/globals';
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
import { run, makeDate } from '../utils';

describe('JbDate operators', function() {
  test('-date', function() {
    expect(function() {
      return new JbDate().negative()
    }).toThrow();
  });

  test('!date', function() {
    expect(function() {
      new JbDate().negate()
    }).toThrow();
  });

  test('= date', function() {
    const rhs = new JbDate();
    expect(
      Scope.assign(new JbArray(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--date', function() {
    expect(function() {
      return new JbDate().decrement()
    }).toThrow();
  });

  test('date--', function() {
    expect(function() {
      return new JbDate().decrement()
    }).toThrow();
  });

  test('++date', function() {
    expect(function() {
      return new JbDate().increment()
    }).toThrow();
  });

  test('date++', function() {
    expect(function() {
      return new JbDate().increment()
    }).toThrow();
  });

  test('date -= date', function() {
    const date = new JbDate();
    expect(
      Scope.assign(date, "-=", date)
    ).toStrictEqual(new JbNumber(0));
  });

  test('date += date', function() {
    const date = new JbDate();
    expect(function() {
      Scope.assign(date, "+=", date)
    }).toThrow();
  });

  test('date + date', function() {
    const date = makeDate("1/13/24");
    expect(function() {
      date.binopDate("+", makeDate("1970-01-01T00:00:01Z"))
    }).toThrow();
  });

  test('date - date', function() {
    const date = makeDate("1970-01-01T01:00:00Z");
    expect(
      date.binopDate("-", makeDate("1970-01-01T00:00:01Z"))
    ).toStrictEqual(new JbNumber(3599));
  });

  test('date * date', function() {
    const date = new JbDate();
    expect(function() {
      return date.binopDate("*", date);
    }).toThrow();
  });

  test('date / date', function() {
    const date = new JbDate();
    expect(function() {
      return date.binopDate("/", date)
    }).toThrow();
  });

  test('date ^ date', function() {
    const date = new JbDate();
    expect(function() {
      return date.binopDate("^", date)
    }).toThrow();
  });

  test('date < date', function() {
    const date = makeDate("1970-01-01T00:00:01.001Z");
    expect(
      date.binopDate("<", makeDate("1970-01-01T00:00:01.002Z"))
    ).toStrictEqual(new JbBool(true));
  });

  test('date > date', function() {
    const date = makeDate("2024-01-13T00:00:01.001Z");
    // safe local date
    expect(
      date.binopDate(">", makeDate("1/14/24"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date <= date', function() {
    const date = makeDate("2050-01-01T00:00:01.001Z");
    expect(
      date.binopDate("<=", makeDate("2050-01-01T00:00:01.002Z"))
    ).toStrictEqual(new JbBool(true));
  });

  test('date >= date', function() {
    const date = makeDate("2000-01-01T00:00:00.000Z");
    expect(
      date.binopDate(">=", makeDate("1999-12-31T23:59:59.999Z"))
    ).toStrictEqual(new JbBool(true));
  });

  test('date == date', function() {
    const date = makeDate("1/13/24");
    expect(
      date.binopDate("==", makeDate("1/13/24"))
    ).toStrictEqual(new JbBool(true));
  });

  test('date != date', function() {
    // milliseconds truncated
    const date = makeDate("2000-01-01T00:00:00.000Z");
    expect(
      date.binopDate("!=", makeDate("2000-01-01T00:00:00.999Z"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date && date', function() {
    expect(
      new JbDate().binopDate("&&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('date & date', function() {
    expect(
      new JbDate().binopDate("&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('date || date', function() {
    expect(
      new JbDate().binopDate("||", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('date | date', function() {
    expect(
      new JbDate().binopDate("|", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('date[date]', async function() {
    const test = `
      <trans>
        result = Now()[Now()];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[date] =', async function() {
    const test = `
      <trans>
        value = Now();
        value[Now()] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });
});

describe('JbDate cross-type interactions', function() {
  test('date -= number', function() {
    const num = new JbNumber(7.5);
    expect(
      Scope.assign(makeDate("2000-01-01T00:00:00.000Z"), "-=", num)
    ).toStrictEqual(makeDate("1999-12-31T23:59:53.000Z"));
  });

  test('date -= string', function() {
    expect(function() {
      return Scope.assign(new JbDate(), "-=", new JbString("-3.5abc"))
    }).toThrow();
  });

  test('date -= bool', function() {
    expect(function() {
      return Scope.assign(new JbDate(), "-=", new JbBool(true))
    }).toThrow();
  });

  test('date -= array', function() {
    expect(
      Scope.assign(
        makeDate("2000-01-01T00:00:00.000Z"),
        "-=",
        new JbArray([new JbNumber(3.5), new JbNumber(-6)])
      )
    ).toStrictEqual(new JbArray([
      makeDate("1999-12-31T23:59:57.000Z"),
      makeDate("2000-01-01T00:00:06.000Z")
    ]));
  });

  test('date -= {}', function() {
    const emptyArray = new JbArray();
    expect(
      Scope.assign(new JbDate(), "-=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date -= dictionary', function() {
    expect(function() {
      return Scope.assign(new JbDate(), "-=", new JbDictionary())
    }).toThrow();
  });

  test('date -= binary', function() {
    expect(function() {
      return Scope.assign(new JbDate(), "-=", new JbBinary())
    }).toThrow();
  });

  test('date -= null', function() {
    const date = new JbDate();
    expect(
      Scope.assign(date, "-=", new JbNull())
    ).toStrictEqual(date);
  });

  test('date += number', function() {
    const rhs = new JbNumber(5.5);
    expect(
      Scope.assign(makeDate("2000-01-01T00:00:00.000Z"), "+=", rhs)
    ).toStrictEqual(makeDate("2000-01-01T00:00:05.000Z"));
  });

  test('date += string', function() {
    const rhs = new JbString("-2.7abcd");
    expect(
      Scope.assign(makeDate("2000-01-01T00:00:00.000Z"), "+=", rhs)
    ).toStrictEqual(new JbString("2000-01-01 00:00:00.000-2.7abcd"));
  });

  test('date += bool', function() {
    const rhs = new JbBool(true);
    expect(function() {
      Scope.assign(new JbDate(), "+=", rhs)
    }).toThrow();
  });

  test('date += array', function() {
    const rhs = new JbArray([new JbString("3.5"), new JbString("6")]);
    expect(
      Scope.assign(makeDate("2000-01-01T00:00:00.000Z"), "+=", rhs)
    ).toStrictEqual(new JbArray([
      new JbString("2000-01-01 00:00:00.0003.5"),
      new JbString("2000-01-01 00:00:00.0006")
    ]));
  });

  test('date += {}', function() {
    const emptyArray = new JbArray();
    expect(
      Scope.assign(new JbDate(), "+=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date += dictionary', function() {
    expect(function() {
      return Scope.assign(new JbDate(), "+=", new JbDictionary())
    }).toThrow();
  });

  test('date += binary', function() {
    expect(function() {
      Scope.assign(new JbDate(), "+=", new JbBinary())
    }).toThrow();
  });

  test('date += null', function() {
    const lhs = new JbDate();
    expect(
      Scope.assign(lhs, "+=", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('date + number', function() {
    const rhs = new JbNumber(-0.9);
    const lhs = makeDate("2000-01-01T00:00:00.000Z");
    expect(
      lhs.binopNumber("+", rhs)
    ).toStrictEqual(lhs);
  });

  test('date + string', function() {
    const rhs = new JbString(" idk");
    expect(
      makeDate("1/18/24").binopString("+", rhs)
    ).toStrictEqual(
      new JbString("2024-01-18 00:00:00.000 idk")
    );
  });

  test('date + bool', function() {
    expect(function() {
      new JbDate().binopBool("+", new JbBool())
    }).toThrow();
  });

  test('date + array', function() {
    const rhs = new JbArray([new JbNumber(3.5), new JbString("6")]);
    // input in ISO format (UTC), expected in local format
    const expectedDate = makeDate("2000-01-01 00:00:03.000");
    expectedDate.isUTC = true;
    expect(
      makeDate("2000-01-01T00:00:00.000Z").binopArray("+", rhs)
    ).toStrictEqual(
      new JbArray([
        expectedDate,
        new JbString("2000-01-01 00:00:00.0006")
      ])
    );
  });

  test('date + {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("+", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date + dictionary', function() {
    expect(function() {
      return new JbDate().binopDict("+", new JbDictionary())
    }).toThrow();
  });

  test('date + binary', function() {
    expect(function() {
      new JbDate().binopBin("+", new JbBinary())
    }).toThrow();
  });

  test('date + null', function() {
    const lhs = new JbDate();
    expect(
      lhs.binopNull("+", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('date - number', function() {
    const rhs = new JbNumber(2);
    expect(
      makeDate("1970-01-01T00:00:01Z").binopNumber("-", rhs)
    ).toStrictEqual(
      makeDate("1969-12-31T23:59:59Z")
    );
  });

  test('date - string', function() {
    expect(function() {
      return new JbDate().binopString("-", new JbString("-420.69"))
    }).toThrow();
  });

  test('date - bool', function() {
    expect(function() {
      new JbDate().binopBool("-", new JbBool())
    }).toThrow();
  });

  test('date - array', function() {
    expect(function() {
      return new JbDate().binopArray("-", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('date - {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("-", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date - dictionary', function() {
    expect(function() {
      return new JbDate().binopDict("-", new JbDictionary())
    }).toThrow();
  });

  test('date - binary', function() {
    expect(function() {
      return new JbDate().binopBin("-", new JbBinary())
    }).toThrow();
  });

  test('date - null', function() {
    const lhs = makeDate("1/13/24");
    expect(
      lhs.binopNull("-", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('date * number', function() {
    expect(function() {
      new JbDate().binopNumber("*", new JbNumber(2))
    }).toThrow();
  });

  test('date * string', function() {
    expect(function() {
      new JbDate().binopString("*", new JbString("-420.69"))
    }).toThrow();
  });

  test('date * bool', function() {
    expect(function() {
      new JbDate().binopBool("*", new JbBool(true))
    }).toThrow();
  });

  test('date * array', function() {
    expect(function() {
      new JbDate().binopArray("*", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('date * {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("*", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date * dictionary', function() {
    expect(function() {
      return new JbDate().binopDict("*", new JbDictionary())
    }).toThrow();
  });

  test('date * binary', function() {
    expect(function() {
      return new JbDate().binopBin("*", new JbBinary())
    }).toThrow();
  });

  test('date * null', function() {
    expect(function() {
      return new JbDate().binopNull("*", new JbNull())
    }).toThrow();
  });

  test('date / number', function() {
    expect(function() {
      return new JbDate().binopNumber("/", new JbNumber(1))
    }).toThrow();
  });

  test('date / string', function() {
    expect(function() {
      new JbDate().binopString("/", new JbString("-420.69"))
    }).toThrow();
  });

  test('date / bool', function() {
    expect(function() {
      new JbDate().binopBool("/", new JbBool())
    }).toThrow();
  });

  test('date / array', function() {
    expect(function() {
      new JbDate().binopArray("/", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('date / {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("/", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date / dictionary', function() {
    expect(function() {
      new JbDate().binopDict("/", new JbDictionary())
    }).toThrow();
  });

  test('date / binary', function() {
    expect(function() {
      new JbDate().binopBin("/", new JbBinary())
    }).toThrow();
  });

  test('date / null', function() {
    expect(function() {
      return new JbDate().binopNull("/", new JbNull())
    }).toThrow();
  });

  test('date ^ number', function() {
    expect(function() {
      return new JbDate().binopNumber("^", new JbNumber(2))
    }).toThrow();
  });

  test('date ^ string', function() {
    expect(function() {
      return new JbDate().binopString("^", new JbString("-420.69"))
    }).toThrow();
  });

  test('date ^ bool', function() {
    expect(function() {
      return new JbDate().binopBool("^", new JbBool())
    }).toThrow();
  });

  test('date ^ array', function() {
    expect(function() {
      return new JbDate().binopArray("^", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('date ^ {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("^", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date ^ dictionary', function() {
    expect(function() {
      return new JbDate().binopDict("^", new JbDictionary())
    }).toThrow();
  });

  test('date ^ binary', function() {
    expect(function() {
      return new JbDate().binopBin("^", new JbBinary())
    }).toThrow();
  });

  test('date ^ null', function() {
    expect(function() {
      return new JbDate().binopNull("^", new JbNull())
    }).toThrow();
  });

  test('date < number', function() {
    expect(
      makeDate("1969-12-31T23:59:59.999Z").binopNumber("<", new JbNumber(0))
    ).toStrictEqual(new JbBool(true));
  });

  test('date < string', function() {
    expect(
      new JbDate().binopString("<", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date < bool', function() {
    expect(
      new JbDate().binopBool("<", new JbBool())
    ).toStrictEqual(new JbBool(false));
  });

  test('date < array', function() {
    const result = new JbDate().binopArray(
      "<", new JbArray([new JbNumber(0.5), new JbString("6")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false)])
    );
  });

  test('date < {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("<", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date < dictionary', function() {
    expect(
      new JbDate().binopDict("<", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date < binary', function() {
    expect(function() {
      new JbDate().binopBin("<", new JbBinary())
    }).toThrow();
  });

  test('date < null', function() {
    expect(
      new JbDate().binopNull("<", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date > number', function() {
    expect(
      makeDate("1969-12-31T23:59:59Z").binopNumber(">", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('date > string', function() {
    expect(
      makeDate("1970-01-01T00:07:00Z").binopString(">", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date > bool', function() {
    expect(
      new JbDate().binopBool(">", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('date > array', function() {
    const result = makeDate("1969-12-31T23:59:59.999Z").binopArray(
      ">", new JbArray([new JbNumber(0), new JbString("6"), new JbNumber(-3.5)])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false), new JbBool(true)])
    );
  });

  test('date > {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray(">", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date > dictionary', function() {
    expect(
      new JbDate().binopDict(">", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('date > binary', function() {
    expect(function() {
      new JbDate().binopBin(">", new JbBinary())
    }).toThrow();
  });

  test('date > null', function() {
    expect(
      makeDate("1/13/24").binopNull(">", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date <= number', function() {
    expect(
      makeDate("1/13/24").binopNumber("<=", new JbNumber(100000))
    ).toStrictEqual(new JbBool(false));
  });

  test('date <= string', function() {
    expect(
      makeDate("2024-01-13T00:00:00Z").binopString("<=", new JbString("1705104000"))
    ).toStrictEqual(new JbBool(true));
  });

  test('date <= bool', function() {
    expect(
      makeDate("1970-01-01T00:00:01Z").binopBool("<=", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('date <= array', function() {
    const result = new JbDate().binopArray(
      "<=", new JbArray([new JbNumber(-3.5), new JbString("6"), new JbString("whatever")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false), new JbBool(false)])
    );
  });

  test('date <= {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("<=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date <= dictionary', function() {
    expect(
      makeDate("1969-12-21T12:34:56Z").binopDict("<=", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('date <= binary', function() {
    expect(function() {
      new JbDate().binopBin("<=", new JbBinary())
    }).toThrow();
  });

  test('date <= null', function() {
    expect(
      new JbDate().binopNull("<=", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date >= number', function() {
    expect(
      makeDate("2024-01-13T00:00:00Z").binopNumber(">=", new JbNumber(1705104000.1))
    ).toStrictEqual(new JbBool(false));
  });

  test('date >= string', function() {
    expect(
      makeDate("2024-01-13T00:00:00Z").binopString(">=", new JbString("1705104000.1niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date >= bool', function() {
    expect(
      new JbDate().binopBool(">=", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('date >= array', function() {
    const result = new JbDate().binopArray(
      ">=", new JbArray([new JbNumber(1), new JbString("6"),new JbNumber(-4)])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(true), new JbBool(true), new JbBool(true)])
    );
  });

  test('date >= {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray(">=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date >= dictionary', function() {
    expect(
      // milliseconds should be truncated by toNumber
      makeDate("1970-01-01T00:00:00.123Z").binopDict(">=", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('date >= binary', function() {
    expect(function() {
      new JbDate().binopBin(">=", new JbBinary())
    }).toThrow();
  });

  test('date >= null', function() {
    expect(
      makeDate("1/13/24").binopNull(">=", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date == number', function() {
    expect(
      makeDate("2024-01-13T00:00:00Z").binopNumber("==", new JbNumber(1705104000))
    ).toStrictEqual(new JbBool(true));
  });

  test('date == string', function() {
    expect(
      makeDate("2024-01-13T00:00:00Z").binopString("==", new JbString("1705104000.0"))
    ).toStrictEqual(new JbBool(true));
  });

  test('date == bool', function() {
    expect(
      makeDate("1970-01-01T00:00:01Z").binopBool("==", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('date == array', function() {
    const result = makeDate("1970-01-01T00:00:01Z").binopArray(
      "==", new JbArray([new JbNumber(3.5), new JbString("1"), new JbString("1970-01-01T00:00:01Z")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(true), new JbBool(false)])
    );
  });

  test('date == {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("==", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date == dictionary', function() {
    expect(
      new JbDate().binopDict("==", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date == binary', function() {
    expect(function() {
      new JbDate().binopBin("==", new JbBinary())
    }).toThrow();
  });

  test('date == null', function() {
    expect(
      makeDate("1/13/24").binopNull("==", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date != number', function() {
    expect(
      makeDate("1970-01-01T00:00:01Z").binopNumber("!=", new JbNumber(1))
    ).toStrictEqual(new JbBool(false));
  });

  test('date != string', function() {
    expect(
      makeDate("1970-01-01T00:00:01Z").binopString("!=", new JbString("1.0"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date != bool', function() {
    expect(
      makeDate("2/1/99").binopBool("!=", new JbBool())
    ).toStrictEqual(new JbBool(true));
  });

  test('date != array', function() {
    const result = makeDate("1970-01-01T00:00:00Z").binopArray(
      "!=", new JbArray([new JbNumber(3.5), new JbString("true"), new JbNull()])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(true), new JbBool(false), new JbBool(true)])
    );
  });

  test('date != {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDate().binopArray("!=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('date != dictionary', function() {
    expect(
      new JbDate().binopDict("!=", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('date != binary', function() {
    expect(function() {
      new JbDate().binopBin("!=", new JbBinary())
    }).toThrow();
  });

  test('date != null', function() {
    expect(
      makeDate("1/13/24").binopNull("!=", new JbNull())
    ).toStrictEqual(new JbBool(true));
  });

  test('date && number', function() {
    expect(
      new JbDate().binopNumber("&&", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('date && string', function() {
    expect(
      new JbDate().binopString("&&", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date && bool', function() {
    expect(
      new JbDate().binopBool("&&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('date && array', function() {
    const result = new JbDate().binopArray(
      "&&", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('date && {}', function() {
    expect(
      new JbDate().binopArray("&&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('date && dictionary', function() {
    expect(
      new JbDate().binopDict("&&", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date && binary', function() {
    expect(
      new JbDate().binopBin("&&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date && null', function() {
    expect(
      new JbDate().binopNull("&&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date & number', function() {
    expect(
      new JbDate().binopNumber("&", new JbNumber(-3))
    ).toStrictEqual(new JbBool(false));
  });

  test('date & string', function() {
    expect(
      new JbDate().binopString("&", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date & bool', function() {
    expect(
      new JbDate().binopBool("&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('date & array', function() {
    const result = new JbDate().binopArray(
      "&", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('date & {}', function() {
    expect(
      new JbDate().binopArray("&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('date & dictionary', function() {
    expect(
      new JbDate().binopDict("&", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date & binary', function() {
    expect(
      new JbDate().binopBin("&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date & null', function() {
    expect(
      new JbDate().binopNull("&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date || number', function() {
    expect(
      new JbDate().binopNumber("||", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('date || string', function() {
    expect(
      new JbDate().binopString("||", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('date || bool', function() {
    expect(
      new JbNull().binopBool("||", new JbBool(false))
    ).toStrictEqual(new JbBool(false));
  });

  test('date || array', function() {
    const result = new JbDate().binopArray(
      "||", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('date || {}', function() {
    expect(
      new JbDate().binopArray("||", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('date || dictionary', function() {
    expect(
      new JbDate().binopDict("||", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date || binary', function() {
    expect(
      new JbDate().binopBin("||", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date || null', function() {
    expect(
      new JbDate().binopNull("||", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date | number', function() {
    expect(
      new JbDate().binopNumber("|", new JbNumber(-1.4))
    ).toStrictEqual(new JbBool(true));
  });

  test('date | string', function() {
    expect(
      new JbDate().binopString("|", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('date | bool', function() {
    expect(
      new JbDate().binopBool("|", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('date | array', function() {
    const result = new JbDate().binopArray(
      "|", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('date | {}', function() {
    expect(
      new JbDate().binopArray("|", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('date | dictionary', function() {
    expect(
      new JbDate().binopDict("|", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date | binary', function() {
    expect(
      new JbDate().binopBin("|", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('date | null', function() {
    expect(
      new JbDate().binopNull("|", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('date[number]', async function() {
    const test = `
      <trans>
        result = Now()[0];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[bool]', async function() {
    const test = `
      <trans>
        result = Now()[false];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[string]', async function() {
    const test = `
      <trans>
        result = Now()["0"];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[array]', async function() {
    const test = `
      <trans>
        result = Now()[{0}];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[dictionary]', async function() {
    const test = `
      <trans>
        result = Now()[Dict()];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[binary]', async function() {
    const test = `
      <trans>
        result = Now()[HexToBinary("00")];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[null]', async function() {
    const test = `
      <trans>
        result = Now()[Null()];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[number] =', async function() {
    const test = `
      <trans>
        value = Now();
        value[0] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[bool] =', async function() {
    const test = `
      <trans>
        value = Now();
        value[true] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[string] =', async function() {
    const test = `
      <trans>
        value = Now();
        value["1"] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[array] =', async function() {
    const test = `
      <trans>
        value = Now();
        value[{1}] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[dictionary] =', async function() {
    const test = `
      <trans>
        value = Now();
        value[Dict()] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[binary] =', async function() {
    const test = `
      <trans>
        value = Now();
        value[HexToBinary("01")] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('date[null] =', async function() {
    const test = `
      <trans>
        value = Now();
        value[Null()] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });
});
