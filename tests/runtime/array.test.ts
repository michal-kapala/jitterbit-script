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
import { makeDate, run } from '../utils'

describe('JbArray operators', function() {
  test('-array', function() {
    expect(
      new JbArray([new JbNumber(5), new JbBool(true)]).negative()
    ).toStrictEqual(
      new JbArray([new JbNumber(-5), new JbBool(true)])
    );
  });

  test('!array', function() {
    expect(
      new JbArray([new JbNumber(5), new JbBool(true)]).negate()
    ).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false)])
    );
  });

  test('= array', function() {
    const rhs = new JbArray([
      new JbDictionary(
        new Map([["testKey", new JbBool()]])
      )
    ]);
    expect(
      Scope.assign(new JbArray(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--array', function() {
    const test = `
      <trans>
        value = {0, false};
        result = --value;
      </trans>
    `;
    expect(run(test)).toStrictEqual(
      new JbArray([new JbNumber(-1), new JbBool(true)])
    );
  });

  test('array--', function() {
    const test = `
      <trans>
        value = {0, false};
        result = value--;
      </trans>
    `;
    expect(run(test)).toStrictEqual(
      new JbArray([new JbNumber(0), new JbBool(false)])
    );
  });

  test('++array', function() {
    const test = `
      <trans>
        value = {0, false};
        result = ++value;
      </trans>
    `;
    expect(run(test)).toStrictEqual(
      new JbArray([new JbNumber(1), new JbBool(true)])
    );
  });

  test('array++', function() {
    const test = `
      <trans>
        value = {0, false};
        result = value++;
      </trans>
    `;
    expect(run(test)).toStrictEqual(
      new JbArray([new JbNumber(0), new JbBool(false)])
    );
  });

  test('array -= array', function() {
    expect(
      Scope.assign(
        new JbArray([new JbNumber(5)]),
        "-=",
        new JbArray([new JbArray([new JbNumber(3)])])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbNumber(2)])])
    );
  });

  test('array += array', function() {
    expect(
      Scope.assign(
        new JbArray([new JbNumber(5)]),
        "+=",
        new JbArray([new JbArray([new JbNumber(3)])])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbNumber(8)])])
    );
  });

  test('array + array', function() {
    expect(
      new JbArray([new JbNumber(-5)]).binopArray(
        "+",
        new JbArray([new JbArray([new JbNumber(3)])])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbNumber(-2)])])
    );
  });

  test('array - array', function() {
    expect(
      new JbArray([new JbNumber(0)]).binopArray(
        "-",
        new JbArray([new JbArray([new JbNumber(3)])])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbNumber(-3)])])
    );
  });

  test('array * array', function() {
    expect(
      new JbArray([new JbNumber(-5)]).binopArray(
        "*",
        new JbArray([new JbArray([new JbNumber(3), new JbNumber(0)])])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbNumber(-15), new JbNumber(-0)])])
    );
  });

  test('array / array', function() {
    // division by 0
    expect(function() {
      new JbArray([new JbNumber(-5)]).binopArray(
        "/",
        new JbArray([new JbArray([new JbNumber(3), new JbNumber(0)])])
      )
    }).toThrow();
  });

  test('array ^ array', function() {
    expect(
      new JbArray([new JbNumber(-5)]).binopArray(
        "^",
        new JbArray([new JbArray([new JbNumber(3), new JbNumber(0)])])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbNumber(-125), new JbNumber(1)])])
    );
  });

  test('array < array', function() {
    expect(
      new JbArray([new JbNumber(-5)]).binopArray(
        "<",
        new JbArray([new JbArray([new JbNumber(0), new JbNumber(-6.6)])])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbBool(true), new JbBool(false)])])
    );
  });

  test('array > array', function() {
    expect(
      new JbArray([new JbNumber(0)]).binopArray(
        ">",
        new JbArray([
          new JbArray([
            new JbNumber(0), new JbNumber(-6.6), new JbString("-.1whatever")
          ])
        ])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbBool(false), new JbBool(true), new JbBool(true)])])
    );
  });

  test('array <= array', function() {
    expect(
      new JbArray([new JbNumber(0)]).binopArray(
        "<=",
        new JbArray([
          new JbArray([
            new JbNumber(0), new JbNumber(-6.6), new JbString("-.1whatever")
          ])
        ])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbBool(true), new JbBool(false), new JbBool(false)])])
    );
  });

  test('array >= array', function() {
    expect(
      new JbArray([new JbNumber(0)]).binopArray(
        ">=",
        new JbArray([
          new JbArray([
            new JbString("whatever"), new JbNumber(-6.6), new JbString(".1whatever")
          ])
        ])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbBool(true), new JbBool(true), new JbBool(false)])])
    );
  });

  test('array == array', function() {
    expect(
      new JbArray([new JbNumber(0)]).binopArray(
        "==",
        new JbArray([new JbArray([new JbString("0")])])
      )
    ).toStrictEqual(
      new JbArray([new JbArray([new JbBool(true)])])
    );
  });

  test('array != array', function() {
    expect(function() {
      new JbArray().binopArray(
        "==",
        new JbArray([new JbArray()])
      )
    }).toThrow();
  });

  test('array && array', function() {
    expect(
      new JbArray([new JbBool(true)]).binopArray("&&", new JbArray([new JbNumber(1)]))
    ).toStrictEqual(new JbBool(false));
  });

  test('array & array', function() {
    expect(
      new JbArray([new JbBool(true)]).binopArray("&", new JbArray([new JbBool(true)]))
    ).toStrictEqual(new JbBool(false));
  });

  test('array || array', function() {
    expect(
      new JbArray([new JbBool(true)]).binopArray("||", new JbArray([new JbNumber(1)]))
    ).toStrictEqual(new JbBool(false));
  });

  test('array | array', function() {
    expect(
      new JbArray([new JbBool(true)]).binopArray("|", new JbArray([new JbString("true")]))
    ).toStrictEqual(new JbBool(false));
  });

  test('array[number]', function() {
    const value = new JbString("hello there");
    // underflow
    expect(function() {
      new JbArray([value]).get(new JbNumber(-1))
    }).toThrow();
  });

  test('array[number] =', function() {
    const newValue = new JbString("general kenobi");
    const arr = new JbArray([new JbNumber(3), new JbNumber(4)]);
    const key = new JbNumber(1);
    arr.set(key.toNumber(), newValue);
    expect(
      arr.get(key)
    ).toStrictEqual(newValue);
  });
});

describe('JbArray cross-type interactions', function() {
  test('array -= number', function() {
    expect(function() {
      Scope.assign(
        new JbArray([new JbNumber(9), new JbString("-7")]),
        "-=",
        new JbNumber(7))
    }).toThrow();
  });

  test('array -= string', function() {
    expect(function() {
      Scope.assign(
        new JbArray([new JbString("-7")]),
        "-=",
        new JbString("7"))
    }).toThrow();
  });

  test('array -= bool', function() {
    const lhs = new JbArray();
    expect(
      Scope.assign(lhs, "-=", new JbBool(true))
    ).toStrictEqual(lhs);
  });

  test('array -= null', function() {
    const lhs = new JbArray([new JbNumber(3.5), new JbNumber(-6)]);
    expect(
      Scope.assign(
        lhs,
        "-=",
        new JbNull()
      )
    ).toStrictEqual(lhs);
  });

  test('array -= {}', function() {
    expect(function() {
      Scope.assign(new JbArray([new JbArray()]), "-=", new JbArray())
    }).toThrow();
  });

  test('array -= dictionary', function() {
    const lhs = new JbArray();
    expect(
      Scope.assign(lhs, "-=", new JbDictionary())
    ).toStrictEqual(lhs);
  });

  test('array -= binary', function() {
    const lhs = new JbArray([new JbArray()]);
    expect(
      Scope.assign(lhs, "-=", new JbBinary())
    ).toStrictEqual(lhs);
  });

  test('array -= date', function() {
    const lhs = new JbArray();
    expect(
      Scope.assign(lhs, "-=", new JbDate())
    ).toStrictEqual(lhs);
  });

  test('array += number', function() {
    const rhs = new JbNumber(5.5);
    expect(
      Scope.assign(new JbArray([new JbNumber(0)]), "+=", rhs)
    ).toStrictEqual(new JbArray([rhs]));
  });

  test('array += string', function() {
    const rhs = new JbString("-2.7abcd");
    expect(
      Scope.assign(new JbArray([new JbNumber(0.1)]), "+=", rhs)
    ).toStrictEqual(new JbArray([new JbString("0.1-2.7abcd")]));
  });

  test('array += bool', function() {
    const rhs = new JbBool(true);
    expect(
      Scope.assign(new JbArray([new JbString("0.1")]), "+=", rhs)
    ).toStrictEqual(new JbArray([new JbString("0.11")]));
  });

  test('array += null', function() {
    const lhs = new JbArray([new JbString("3.5"), new JbString("6")]);
    expect(
      Scope.assign(lhs, "+=", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('array += {}', function() {
    const lhs = new JbArray([new JbBool(true)]);
    expect(function() {
      Scope.assign(lhs, "+=", new JbArray())
    }).toThrow();
  });

  test('array += dictionary', function() {
    const lhs = new JbArray();
    expect(
      Scope.assign(lhs, "+=", new JbDictionary())
    ).toStrictEqual(lhs);
  });

  test('array += binary', function() {
    const lhs = new JbArray();
    expect(
      Scope.assign(lhs, "+=", new JbBinary())
    ).toStrictEqual(lhs);
  });

  test('array += date', function() {
    const lhs = new JbArray([new JbBool(false)]);
    expect(function() {
      Scope.assign(lhs, "+=", new JbDate())
    }).toThrow();
  });

  test('array + number', function() {
    expect(
      new JbArray([new JbString("7.")]).binopNumber("+", new JbNumber(3))
    ).toStrictEqual(new JbArray([new JbString("7.3")]));
  });

  test('array + string', function() {
    const rhs = new JbString("-420.69");
    expect(
      new JbArray([new JbNull()]).binopString("+", rhs)
    ).toStrictEqual(new JbArray([rhs]));
  });

  test('array + bool', function() {
    const lhs = new JbArray([new JbArray([new JbString("body count: ")])]);
    expect(
      lhs.binopBool("+", new JbBool(true))
    ).toStrictEqual(new JbArray([new JbArray([new JbString("body count: 1")])]));
  });

  test('array + null', function() {
    const lhs = new JbArray([new JbNumber(3.5), new JbString("6")]);
    expect(
      lhs.binopNull("+", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('array + {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("+", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array + dictionary', function() {
    expect(function() {
      return new JbArray([new JbDictionary()]).binopDict("+", new JbDictionary())
    }).toThrow();
  });

  test('array + binary', function() {
    expect(function() {
      new JbArray([new JbString()]).binopBin("+", new JbBinary())
    }).toThrow();
  });

  test('array + date', function() {
    const rhs = new JbDate();
    expect(
      new JbArray([new JbNull()]).binopDate("+", rhs)
    ).toStrictEqual(new JbArray([rhs]));
  });

  test('array - number', function() {
    const rhs = new JbNumber(5.6);
    expect(
      new JbArray([new JbNull()]).binopNumber("-", rhs)
    ).toStrictEqual(new JbArray([rhs.negative()]));
  });

  test('array - string', function() {
    expect(function() {
      return new JbArray([new JbNumber(500)]).binopString("-", new JbString("-420.69"))
    }).toThrow();
  });

  test('array - bool', function() {
    expect(function() {
      new JbArray([new JbNull()]).binopBool("-", new JbBool())
    }).toThrow();
  });

  test('array - null', function() {
    expect(function() {
      return new JbArray([new JbNumber(3.5), new JbString("6")]).binopNull("-", new JbNull())
    }).toThrow();
  });

  test('array - {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("-", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array - dictionary', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopDict("-", new JbDictionary())
    }).toThrow();
  });

  test('array - binary', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopBin("-", new JbBinary())
    }).toThrow();
  });

  test('array - date', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopDate("-", makeDate("1/13/24"))
    }).toThrow();
  });

  test('array * number', function() {
    expect(
      new JbArray([new JbArray([new JbNumber(8)])]).binopNumber("*", new JbNumber(2))
    ).toStrictEqual(new JbArray([new JbArray([new JbNumber(16)])]));
  });

  test('array * bool', function() {
    expect(function() {
      new JbArray([new JbNull()]).binopBool("*", new JbBool())
    }).toThrow();
  });

  test('array * string', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopString("*", new JbString("-420.69"))
    }).toThrow();
  });

  test('array * null', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopNull("*", new JbNull())
    }).toThrow();
  });

  test('array * {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("*", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array * dictionary', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopDict("*", new JbDictionary())
    }).toThrow();
  });

  test('array * binary', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopBin("*", new JbBinary())
    }).toThrow();
  });

  test('array * date', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopDate("*", makeDate("1/13/24"))
    }).toThrow();
  });

  test('array / number', function() {
    const lhs = new JbArray([new JbNumber(9)]);
    expect(
      lhs.binopNumber("/", new JbNumber(1))
    ).toStrictEqual(lhs);
  });

  test('array / string', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopString("/", new JbString("-420.69"))
    }).toThrow();
  });

  test('array / bool', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopBool("/", new JbBool())
    }).toThrow();
  });

  test('array / null', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopNull("/", new JbNull())
    }).toThrow();
  });

  test('array / {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("/", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array / dictionary', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopDict("/", new JbDictionary())
    }).toThrow();
  });

  test('array / binary', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopBin("/", new JbBinary())
    }).toThrow();
  });

  test('array / date', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopDate("/", makeDate("1/13/24"))
    }).toThrow();
  });

  test('array ^ number', function() {
    expect(
      new JbArray([new JbNumber(-6.9)]).binopNumber("^", new JbNumber(0))
    ).toStrictEqual(new JbArray([new JbNumber(1)]));
  });

  test('array ^ string', function() {
    expect(function() {
      return new JbArray([new JbNumber(-6.9)]).binopString("^", new JbString("-420.69"))
    }).toThrow();
  });

  test('array ^ bool', function() {
    expect(function() {
      return new JbArray([new JbNumber(-6.9)]).binopBool("^", new JbBool())
    }).toThrow();
  });

  test('array ^ null', function() {
    expect(function() {
      return new JbArray([new JbNumber(-6.9)]).binopNull("^", new JbNull())
    }).toThrow();
  });

  test('array ^ {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("^", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array ^ dictionary', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopDict("^", new JbDictionary())
    }).toThrow();
  });

  test('array ^ binary', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopBin("^", new JbBinary())
    }).toThrow();
  });

  test('array ^ date', function() {
    expect(function() {
      return new JbArray([new JbNull()]).binopDate("^", makeDate("1/13/24"))
    }).toThrow();
  });

  test('array < number', function() {
    expect(
      new JbArray([new JbBool(true)]).binopNumber("<", new JbNumber(0.5))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array < string', function() {
    expect(
      new JbArray([new JbString("true")]).binopString("<", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array < bool', function() {
    expect(
      new JbArray([new JbString("true")]).binopBool("<", new JbBool(true))
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array < null', function() {
    expect(
      new JbArray([new JbString("true"), new JbBool(false)]).binopNull("<", new JbNull())
    ).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false)])
    );
  });

  test('array < {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("<", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array < dictionary', function() {
    expect(
      new JbArray([new JbString("true")]).binopDict("<", new JbDictionary())
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array < binary', function() {
    expect(function() {
      new JbArray([new JbString("true")]).binopBin("<", new JbBinary())
    }).toThrow();
  });

  test('array < date', function() {
    expect(
      new JbArray([new JbString("true"), new JbNumber(123456)]).binopDate(
        "<", makeDate("1/13/24")
      )
    ).toStrictEqual(new JbArray([new JbBool(true), new JbBool(true)]));
  });

  test('array > number', function() {
    expect(
      new JbArray([new JbString("true")]).binopNumber(">", new JbNumber(0.5))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array > string', function() {
    expect(
      new JbArray([new JbNumber(420)]).binopString(">", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array > bool', function() {
    expect(
      new JbArray([new JbString("true")]).binopBool(">", new JbBool(true))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array > null', function() {
    expect(
      new JbArray([new JbString("true"), new JbNull()]).binopNull(">", new JbNull())
    ).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false)])
    );
  });

  test('array > {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray(">", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array > dictionary', function() {
    expect(
      new JbArray([new JbString("true")]).binopDict(">", new JbDictionary())
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array > binary', function() {
    expect(function() {
      new JbArray([new JbString("true")]).binopBin(">", new JbBinary())
    }).toThrow();
  });

  test('array > date', function() {
    expect(
      new JbArray([new JbString("true")]).binopDate(">", makeDate("1/13/24"))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array <= number', function() {
    expect(
      new JbArray([new JbString("true")]).binopNumber("<=", new JbNumber(0.1))
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array <= string', function() {
    expect(
      new JbArray([new JbString("true")]).binopString("<=", new JbString("0.000001niceinnit"))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array <= bool', function() {
    expect(
      new JbArray([new JbString("true")]).binopBool("<=", new JbBool(false))
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array <= null', function() {
    expect(
      new JbArray([new JbString("true")]).binopNull("<=", new JbNull())
    ).toStrictEqual(
      new JbArray([new JbBool(false)])
    );
  });

  test('array <= {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("<=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array <= dictionary', function() {
    expect(
      new JbArray([new JbDictionary()]).binopDict("<=", new JbDictionary())
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array <= binary', function() {
    expect(function() {
      new JbArray([new JbString("true")]).binopBin("<=", new JbBinary())
    }).toThrow();
  });

  test('array <= date', function() {
    expect(
      new JbArray([makeDate("1/14/24")]).binopDate("<=", makeDate("1/13/24"))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array >= number', function() {
    expect(
      new JbArray([new JbString("true")]).binopNumber(">=", new JbNumber(1))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array >= string', function() {
    expect(
      new JbArray([new JbNumber(1)]).binopString(">=", new JbString("1.0000000niceinnit"))
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array >= bool', function() {
    expect(function() {
      new JbArray([new JbBool(false)]).binopBool(">=", new JbBool(true))
    }).toThrow();
  });

  test('array >= null', function() {
    expect(
      new JbArray([new JbString("true")]).binopNull(">=", new JbNull())
    ).toStrictEqual(
      new JbArray([new JbBool(false)])
    );
  });

  test('array >= {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray(">=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array >= dictionary', function() {
    expect(
      new JbArray([new JbBool(false)]).binopDict(">=", new JbDictionary())
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array >= binary', function() {
    expect(function() {
      new JbArray([new JbDictionary()]).binopBin(">=", new JbBinary())
    }).toThrow();
  });

  test('array >= date', function() {
    expect(
      new JbArray([makeDate("1/13/24")]).binopDate(">=", makeDate("1/13/24"))
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array == number', function() {
    expect(
      new JbArray(
        [new JbNumber(1), new JbString("1"), new JbBool(true)]
      ).binopNumber("==", new JbNumber(1))
    ).toStrictEqual(new JbArray([new JbBool(true), new JbBool(true), new JbBool(true)]));
  });

  test('array == string', function() {
    expect(
      new JbArray(
        [new JbNumber(1), new JbString("1"), new JbBool(true)]
      ).binopString("==", new JbString("true"))
    ).toStrictEqual(new JbArray([new JbBool(false), new JbBool(false), new JbBool(true)]));
  });

  test('array == bool', function() {
    expect(
      new JbArray(
        [new JbNumber(1), new JbString("1"), new JbBool(true)]
      ).binopBool("==", new JbBool(true))
    ).toStrictEqual(new JbArray([new JbBool(true), new JbBool(true), new JbBool(true)]));
  });

  test('array == null', function() {
    expect(
      new JbArray(
        [new JbNumber(1), new JbString("1"), new JbNull()]
      ).binopNull("==", new JbNull())
    ).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false), new JbBool(false)])
    );
  });

  test('array == {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("==", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array == dictionary', function() {
    expect(
      new JbArray([new JbBool(false)]).binopDict("==", new JbDictionary())
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array == binary', function() {
    expect(
      new JbArray([new JbBinary()]).binopBin("==", new JbBinary())
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array == date', function() {
    expect(
      new JbArray([makeDate("1/13/24")]).binopDate("==", makeDate("1/13/24"))
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array != number', function() {
    expect(
      new JbArray([new JbBool(false)]).binopNumber("!=", new JbNumber(0))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array != string', function() {
    expect(
      new JbArray([new JbBool(false)]).binopString("!=", new JbString("false"))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array != bool', function() {
    expect(
      new JbArray([new JbBool(false)]).binopBool("!=", new JbBool(true))
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array != null', function() {
    expect(
      new JbArray([new JbBool(false)]).binopNull("!=", new JbNull())
    ).toStrictEqual(
      new JbArray([new JbBool(true)])
    );
  });

  test('array != {}', function() {
    const emptyArray = new JbArray();
    expect(
      emptyArray.binopArray("!=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('array != dictionary', function() {
    expect(
      new JbArray([new JbDictionary()]).binopDict("!=", new JbDictionary())
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array != binary', function() {
    expect(
      new JbArray([new JbDictionary()]).binopBin("!=", new JbBinary())
    ).toStrictEqual(new JbArray([new JbBool(true)]));
  });

  test('array != date', function() {
    expect(
      new JbArray([makeDate("1/13/24")]).binopDate("!=", makeDate("1/13/24"))
    ).toStrictEqual(new JbArray([new JbBool(false)]));
  });

  test('array && number', function() {
    expect(
      new JbArray().binopNumber("&&", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('array && string', function() {
    expect(
      new JbArray([new JbBool(true)]).binopString("&&", new JbString("true"))
    ).toStrictEqual(new JbBool(false));
  });

  test('array && bool', function() {
    expect(
      new JbArray([new JbBool(true)]).binopBool("&&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('array && null', function() {
    expect(
      new JbArray([new JbBool(true)]).binopNull("&&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('array && {}', function() {
    expect(
      new JbArray().binopArray("&&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('array && dictionary', function() {
    expect(
      new JbArray([new JbBool(true)]).binopDict("&&", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('array && binary', function() {
    expect(
      new JbArray([new JbBool(true)]).binopBin("&&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('array && date', function() {
    expect(
      new JbArray([new JbBool(true)]).binopDate("&&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('array & number', function() {
    expect(
      new JbArray([new JbBool(true)]).binopNumber("&", new JbNumber(-3))
    ).toStrictEqual(new JbBool(false));
  });

  test('array & string', function() {
    expect(
      new JbArray([new JbBool(true)]).binopString("&", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('array & bool', function() {
    expect(
      new JbArray([new JbBool(true)]).binopBool("&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('array & null', function() {
    expect(
      new JbArray([new JbBool(true)]).binopNull("&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('array & {}', function() {
    expect(
      new JbArray().binopArray("&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('array & dictionary', function() {
    expect(
      new JbArray([new JbBool(true)]).binopDict("&", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('array & binary', function() {
    expect(
      new JbArray([new JbBool(true)]).binopBin("&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('array & date', function() {
    expect(
      new JbArray([new JbBool(true)]).binopDate("&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('array || number', function() {
    expect(
      new JbArray([new JbBool(true)]).binopNumber("||", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('array || string', function() {
    expect(
      new JbArray([new JbBool(true)]).binopString("||", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('array || bool', function() {
    expect(
      new JbArray([new JbBool(true)]).binopBool("||", new JbBool(false))
    ).toStrictEqual(new JbBool(false));
  });

  test('array || null', function() {
    expect(
      new JbArray([new JbBool(true)]).binopNull("||", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('array || {}', function() {
    expect(
      new JbArray().binopArray("||", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('array || dictionary', function() {
    expect(
      new JbArray([new JbBool(true)]).binopDict("||", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('array || binary', function() {
    expect(
      new JbArray([new JbBool(true)]).binopBin("||", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('array || date', function() {
    expect(
      new JbArray([new JbBool(true)]).binopDate("||", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('array | number', function() {
    expect(
      new JbArray([new JbBool(true)]).binopNumber("|", new JbNumber(-1.4))
    ).toStrictEqual(new JbBool(true));
  });

  test('array | string', function() {
    expect(
      new JbArray([new JbBool(true)]).binopString("|", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('array | bool', function() {
    expect(
      new JbArray([new JbBool(true)]).binopBool("|", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('array | null', function() {
    expect(
      new JbArray([new JbBool(true)]).binopNull("|", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('array | {}', function() {
    expect(
      new JbArray().binopArray("|", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('array | dictionary', function() {
    expect(
      new JbArray([new JbBool(true)]).binopDict("|", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('array | binary', function() {
    expect(
      new JbArray([new JbBool(true)]).binopBin("|", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('array | date', function() {
    expect(
      new JbArray().binopDate("|", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('array[string]', function() {
    const value = new JbNumber(3);
    // non-existent index
    expect(
      new JbArray([value]).get(new JbString("1"))
    ).toStrictEqual(new JbNull());
  });

  test('array[bool]', function() {
    expect(
      new JbArray([new JbNumber(3)]).get(new JbBool(true))
    ).toStrictEqual(new JbNull());
  });

  test('array[null]', function() {
    expect(
      new JbArray([new JbNumber(3), new JbNumber(4)]).get(new JbNull())
    ).toStrictEqual(new JbNumber(3));
  });

  test('array[array]', function() {
    expect(function() {
      new JbArray([new JbNumber(3)]).get(new JbArray())
    }).toThrow();
  });

  test('array[dictionary]', function() {
    expect(function() {
      new JbArray([new JbNumber(3)]).get(new JbDictionary())
    }).toThrow();
  });

  test('array[binary]', function() {
    expect(function() {
      new JbArray([new JbNumber(3)]).get(new JbBinary(new Uint8Array([0])))
    }).toThrow();
  });

  test('array[date]', function() {
    expect(
      new JbArray([new JbNumber(3)]).get(makeDate("1/13/24"))
    ).toStrictEqual(new JbNull());
  });

  test('array[string] =', function() {
    const newValue = new JbNumber(4);
    const arr = new JbArray([new JbNumber(3)]);
    // underflow, assignment should be ignored
    const key = new JbString("-1");
    arr.set(key.toNumber(), newValue);
    expect(
      arr.get(key)
    ).toStrictEqual(new JbNull());
  });

  test('array[bool] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("new value");
    const arr = new JbArray([value]);
    const key = new JbBool(true);
    arr.set(key.toNumber(), newValue);
    expect(
      arr.get(key)
    ).toStrictEqual(newValue);
  });

  test('array[null] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("new value");
    const arr = new JbArray([value]);
    const key = new JbNull();
    arr.set(key.toNumber(), newValue);
    expect(
      arr.get(key)
    ).toStrictEqual(newValue);
  });

  test('array[array] =', function() {
    const newValue = new JbString("the value");
    const arr = new JbArray([new JbNumber(3), new JbString()]);
    const key = new JbArray();
    expect(function() {
      arr.set(key.toNumber(), newValue);
      return arr.get(key);
    }).toThrow();
  });

  test('array[dictionary] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("the value");
    const arr = new JbArray([value]);
    const key = new JbDictionary();
    expect(function() {
      arr.set(key.toNumber(), newValue);;
      return arr.get(key);
    }).toThrow();
  });

  test('array[binary] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("the value");
    const arr = new JbArray([value]);
    const key = new JbBinary(new Uint8Array([0]));
    
    expect(function() {
      arr.set(key.toNumber(), newValue);
      return arr.get(key);
    }).toThrow();
  });

  test('array[date] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("the value");
    const arr = new JbArray([value]);
    const key = makeDate("1970-01-01T00:00:00Z");
    arr.set(key.toNumber(), newValue);
    expect(
      arr.get(key)
    ).toStrictEqual(newValue);
  });
});
