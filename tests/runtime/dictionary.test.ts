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
import { makeDict } from '../utils';

describe('JbDictionary operators', function() {
  test('-dictionary', function() {
    expect(function() {
      return makeDict("testKey", new JbBool(true)).negative()
    }).toThrow();
  });

  test('!dictionary', function() {
    expect(function() {
      makeDict("testKey", new JbBool(true)).negate()
    }).toThrow();
  });

  test('= dictionary', function() {
    const rhs = makeDict("testKey", );
    expect(
      Scope.assign(new JbArray(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--dictionary', function() {
    expect(function() {
      return makeDict("testKey", ).decrement()
    }).toThrow();
  });

  test('dictionary--', function() {
    expect(function() {
      return makeDict("testKey", ).decrement()
    }).toThrow();
  });

  test('++dictionary', function() {
    expect(function() {
      return makeDict("testKey", ).increment()
    }).toThrow();
  });

  test('dictionary++', function() {
    expect(function() {
      return makeDict("testKey", ).increment()
    }).toThrow();
  });

  test('dictionary -= dictionary', function() {
    expect(function() {
      Scope.assign(makeDict("testKey", new JbBool()), "-=", new JbDictionary())
    }).toThrow();
  });

  test('dictionary += dictionary', function() {
    expect(function() {
      Scope.assign(makeDict("testKey", new JbBool()), "+=", new JbDictionary())
    }).toThrow();
  });

  test('dictionary + dictionary', function() {
    expect(function() {
      makeDict("testKey", new JbBool()).binopDict("+", new JbDictionary())
    }).toThrow();
  });

  test('dictionary - dictionary', function() {
    expect(function() {
      makeDict("testKey", new JbBool()).binopDict("-", new JbDictionary())
    }).toThrow();
  });

  test('dictionary * dictionary', function() {
    expect(function() {
      makeDict("testKey", new JbBool()).binopDict("*", new JbDictionary())
    }).toThrow();
  });

  test('dictionary / dictionary', function() {
    expect(function() {
      makeDict("testKey", new JbBool()).binopDict("/", new JbDictionary())
    }).toThrow();
  });

  test('dictionary ^ dictionary', function() {
    expect(function() {
      makeDict("testKey", new JbBool()).binopDict("^", new JbDictionary())
    }).toThrow();
  });

  test('dictionary < dictionary', function() {
    expect(
      makeDict("testKey", new JbBool()).binopDict("<", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary > dictionary', function() {
    expect(
      makeDict("testKey", new JbBool()).binopDict(">", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary <= dictionary', function() {
    const dict = makeDict("testKey", new JbBool());
    expect(
      dict.binopDict("<=", dict)
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary >= dictionary', function() {
    const dict = makeDict("testKey", new JbBool());
    expect(
      dict.binopDict(">=", dict)
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary == dictionary', function() {
    expect(
      makeDict("testKey", new JbBool()).binopDict("==", makeDict("testKey", new JbBool()))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary != dictionary', function() {
    expect(
      makeDict("testKey", new JbBool(true)).binopDict("!=", makeDict("testKey", new JbString("1whatever")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary && dictionary', function() {
    expect(
      makeDict("testKey", new JbBool(true)).binopDict("&&", makeDict("testKey", new JbString("1whatever")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary & dictionary', function() {
    expect(
      makeDict("testKey", new JbBool(true)).binopDict("&", makeDict("testKey", new JbString("1whatever")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary || dictionary', function() {
    expect(
      makeDict("testKey", new JbBool(true)).binopDict("||", makeDict("testKey", new JbString("1whatever")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary | dictionary', function() {
    expect(
      makeDict("testKey", new JbBool(true)).binopDict("|", makeDict("testKey", new JbString("1whatever")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary[string]', function() {
    const value = new JbNumber(3);
    expect(
      makeDict("", value).get(new JbString())
    ).toStrictEqual(value);
  });

  test('dictionary[string] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbNumber(4);
    const dict = makeDict("1", value);
    const key = new JbString("1");
    dict.set(key, newValue);
    expect(
      dict.get(key)
    ).toStrictEqual(newValue);
  });
});

describe('JbDictionary cross-type interactions', function() {
  test('dictionary -= number', function() {
    expect(function() {
      Scope.assign(makeDict("testKey", ), "-=", new JbNumber(7))
    }).toThrow();
  });

  test('dictionary -= string', function() {
    expect(function() {
      Scope.assign(makeDict("testKey", ), "-=", new JbString("nice"))
    }).toThrow();
  });

  test('dictionary -= bool', function() {
    expect(function() {
      Scope.assign(makeDict("testKey", ), "-=", new JbBool(true))
    }).toThrow();
  });

  test('dictionary -= array', function() {
    expect(function() {
      Scope.assign(
        new JbDictionary(),
        "-=",
        new JbArray([new JbNumber(3.5), new JbNumber(-6)])
      )
    }).toThrow();
  });

  test('dictionary -= {}', function() {
    const emptyArray = new JbArray();
    expect(
      Scope.assign(new JbDictionary(), "-=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary -= null', function() {
    expect(function() {
      return Scope.assign(new JbDictionary(), "-=", new JbNull())
    }).toThrow();
  });

  test('dictionary -= binary', function() {
    expect(function() {
      return Scope.assign(new JbDictionary(), "-=", new JbBinary())
    }).toThrow();
  });

  test('dictionary -= date', function() {
    expect(function() {
      return Scope.assign(new JbDictionary(), "-=", new JbDate())
    }).toThrow();
  });

  test('dictionary += number', function() {
    expect(function() {
      Scope.assign(new JbDictionary(), "+=", new JbNumber(5.5))
    }).toThrow();
  });

  test('dictionary += string', function() {
    expect(function() {
      Scope.assign(new JbDictionary(), "+=", new JbString("-2.7abcd"))
    }).toThrow();
  });

  test('dictionary += bool', function() {
    expect(function() {
      Scope.assign(new JbDictionary(), "+=", new JbBool(true))
    }).toThrow();
  });

  test('dictionary += array', function() {
    expect(function() {
      Scope.assign(
        new JbDictionary(),
        "+=",
        new JbArray([new JbString("3.5"), new JbString("6")])
      )
    }).toThrow();
  });

  test('dictionary += {}', function() {
    const emptyArray = new JbArray();
    expect(
      Scope.assign(new JbDictionary(), "+=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary += null', function() {
    expect(function() {
      return Scope.assign(new JbDictionary(), "+=", new JbNull())
    }).toThrow();
  });

  test('dictionary += binary', function() {
    expect(function() {
      Scope.assign(new JbDictionary(), "+=", new JbBinary())
    }).toThrow();
  });

  test('dictionary += date', function() {
    expect(function() {
      Scope.assign(new JbDictionary(), "+=", new JbDate())
    }).toThrow();
  });

  test('dictionary + number', function() {
    expect(function() {
      new JbDictionary().binopNumber("+", new JbNumber(3))
    }).toThrow();
  });

  test('dictionary + string', function() {
    expect(function() {
      new JbDictionary().binopString("+", new JbString("-420.69"))
    }).toThrow();
  });

  test('dictionary + bool', function() {
    expect(function() {
      new JbDictionary().binopBool("+", new JbBool())
    }).toThrow();
  });

  test('dictionary + array', function() {
    expect(function() {
      new JbDictionary().binopArray("+", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('dictionary + {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("+", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary + null', function() {
    expect(function() {
      return new JbDictionary().binopNull("+", new JbNull())
    }).toThrow();
  });

  test('dictionary + binary', function() {
    expect(function() {
      new JbDictionary().binopBin("+", new JbBinary())
    }).toThrow();
  });

  test('dictionary + date', function() {
    expect(function() {
      new JbDictionary().binopDate("+", new JbDate())
    }).toThrow();
  });

  test('dictionary - number', function() {
    expect(function() {
      new JbDictionary().binopNumber("-", new JbNumber(5.6))
    }).toThrow();
  });

  test('dictionary - string', function() {
    expect(function() {
      return new JbDictionary().binopString("-", new JbString("-420.69"))
    }).toThrow();
  });

  test('dictionary - bool', function() {
    expect(function() {
      new JbDictionary().binopBool("-", new JbBool())
    }).toThrow();
  });

  test('dictionary - array', function() {
    expect(function() {
      return new JbDictionary().binopArray("-", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('dictionary - {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("-", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary - null', function() {
    expect(function() {
      return new JbDictionary().binopNull("-", new JbNull())
    }).toThrow();
  });

  test('dictionary - binary', function() {
    expect(function() {
      return new JbDictionary().binopBin("-", new JbBinary())
    }).toThrow();
  });

  test('dictionary - date', function() {
    expect(function() {
      return new JbDictionary().binopDate("-", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('dictionary * number', function() {
    expect(function() {
      new JbDictionary().binopNumber("*", new JbNumber(2))
    }).toThrow();
  });

  test('dictionary * string', function() {
    expect(function() {
      return new JbDictionary().binopString("*", new JbString("-420.69"))
    }).toThrow();
  });

  test('dictionary * bool', function() {
    expect(function() {
      new JbDictionary().binopBool("*", new JbBool(true))
    }).toThrow();
  });

  test('dictionary * array', function() {
    expect(function() {
      makeDict("testKey", ).binopArray("*", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('dictionary * {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("*", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary * null', function() {
    expect(function() {
      return new JbDictionary().binopNull("*", new JbNull())
    }).toThrow();
  });

  test('dictionary * binary', function() {
    expect(function() {
      return new JbDictionary().binopBin("*", new JbBinary())
    }).toThrow();
  });

  test('dictionary * date', function() {
    expect(function() {
      return new JbDictionary().binopDate("*", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('dictionary / number', function() {
    expect(function() {
      return new JbDictionary().binopNumber("/", new JbNumber(0))
    }).toThrow();
  });

  test('dictionary / string', function() {
    expect(function() {
      return new JbDictionary().binopString("/", new JbString("-420.69"))
    }).toThrow();
  });

  test('dictionary / bool', function() {
    expect(function() {
      return new JbDictionary().binopBool("/", new JbBool())
    }).toThrow();
  });

  test('dictionary / array', function() {
    expect(function() {
      makeDict("testKey", ).binopArray("/", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('dictionary / {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("/", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary / null', function() {
    expect(function() {
      return new JbDictionary().binopNull("/", new JbNull())
    }).toThrow();
  });

  test('dictionary / binary', function() {
    expect(function() {
      return new JbDictionary().binopBin("/", new JbBinary())
    }).toThrow();
  });

  test('dictionary / date', function() {
    expect(function() {
      return new JbDictionary().binopDate("/", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('dictionary ^ number', function() {
    expect(function() {
      return new JbDictionary().binopNumber("^", new JbNumber(2))
    }).toThrow();
  });

  test('dictionary ^ string', function() {
    expect(function() {
      return new JbDictionary().binopString("^", new JbString("-420.69"))
    }).toThrow();
  });

  test('dictionary ^ bool', function() {
    expect(function() {
      return new JbDictionary().binopBool("^", new JbBool())
    }).toThrow();
  });

  test('dictionary ^ array', function() {
    expect(function() {
      return new JbDictionary().binopArray("^", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('dictionary ^ {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("^", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary ^ null', function() {
    expect(function() {
      return new JbDictionary().binopDict("^", new JbDictionary())
    }).toThrow();
  });

  test('dictionary ^ binary', function() {
    expect(function() {
      return new JbDictionary().binopBin("^", new JbBinary())
    }).toThrow();
  });

  test('dictionary ^ date', function() {
    expect(function() {
      return new JbDictionary().binopDate("^", new JbDate(new Date("1/13/24")))
    }).toThrow();
  });

  test('dictionary < number', function() {
    expect(
      new JbDictionary().binopNumber("<", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary < string', function() {
    expect(
      new JbDictionary().binopString("<", new JbString("1niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary < bool', function() {
    expect(
      new JbDictionary().binopBool("<", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary < array', function() {
    expect(
      new JbDictionary().binopArray(
        "<", new JbArray([new JbNumber(0.5), new JbString("-6")])
      )
    ).toStrictEqual(
      new JbArray([new JbBool(true), new JbBool(false)])
    );
  });

  test('dictionary < {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("<", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary < null', function() {
    expect(
      new JbDictionary().binopNull("<", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary < binary', function() {
    expect(function() {
      new JbDictionary().binopBin("<", new JbBinary())
    }).toThrow();
  });

  test('dictionary < date', function() {
    expect(
      new JbDictionary().binopDate("<", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary > number', function() {
    expect(
      new JbDictionary().binopNumber(">", new JbNumber(-0.5))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary > string', function() {
    expect(
      new JbDictionary().binopString(">", new JbString("-420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary > bool', function() {
    expect(
      new JbDictionary().binopBool(">", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary > array', function() {
    const result = new JbDictionary().binopArray(
      ">", new JbArray([new JbNumber(3.5), new JbString("6"), new JbNumber(-3.5)])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false), new JbBool(true)])
    );
  });

  test('dictionary > {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray(">", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary > null', function() {
    expect(
      new JbDictionary().binopNull(">", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary > binary', function() {
    expect(function() {
      new JbDictionary().binopBin(">", new JbBinary())
    }).toThrow();
  });

  test('dictionary > date', function() {
    expect(
      new JbDictionary().binopDate(">", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary <= number', function() {
    expect(
      makeDict("testKey", ).binopNumber("<=", new JbNumber(0))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary <= string', function() {
    expect(
      new JbDictionary().binopString("<=", new JbString("whatever"))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary <= bool', function() {
    expect(
      new JbDictionary().binopBool("<=", new JbBool(false))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary <= array', function() {
    expect(
      new JbDictionary().binopArray(
        "<=", new JbArray([new JbNumber(-3.5), new JbString("6"), new JbString("whatever")])
      )
    ).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(true), new JbBool(true)])
    );
  });

  test('dictionary <= {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("<=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary <= null', function() {
    expect(
      new JbDictionary().binopNull("<=", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary <= binary', function() {
    expect(function() {
      new JbDictionary().binopBin("<=", new JbBinary())
    }).toThrow();
  });

  test('dictionary <= date', function() {
    expect(
      new JbDictionary().binopDate("<=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary >= number', function() {
    expect(
      new JbDictionary().binopNumber(">=", new JbNumber(0.1))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary >= string', function() {
    expect(
      new JbDictionary().binopString(">=", new JbString("1.0000000niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary >= bool', function() {
    expect(
      new JbDictionary().binopBool(">=", new JbBool(false))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary >= array', function() {
    expect(
      new JbDictionary().binopArray(
        ">=", new JbArray([new JbNumber(1), new JbString("6"), new JbNumber(-4)])
      )
    ).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false), new JbBool(true)])
    );
  });

  test('dictionary >= {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray(">=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary >= null', function() {
    expect(
      new JbDictionary().binopNull(">=", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary >= binary', function() {
    expect(function() {
      new JbDictionary().binopBin(">=", new JbBinary())
    }).toThrow();
  });

  test('dictionary >= date', function() {
    expect(
      new JbDictionary().binopDate(">=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary == number', function() {
    expect(
      new JbDictionary().binopNumber("==", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary == string', function() {
    expect(
      new JbDictionary().binopString("==", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary == bool', function() {
    expect(
      new JbDictionary().binopBool("==", new JbBool(false))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary == array', function() {
    const result = new JbDictionary().binopArray(
      "==", new JbArray([new JbNumber(3.5), new JbString("6"), new JbString("null")])
    );
    expect(result).toStrictEqual(
      new JbArray([new JbBool(false), new JbBool(false), new JbBool(false)])
    );
  });

  test('dictionary == {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("==", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary == null', function() {
    expect(
      new JbDictionary().binopNull("==", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary == binary', function() {
    expect(
      new JbDictionary().binopBin("==", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary == date', function() {
    expect(
      new JbDictionary().binopDate("==", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary != number', function() {
    expect(
      new JbDictionary().binopNumber("!=", new JbNumber(0))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary != string', function() {
    expect(
      new JbDictionary().binopString("!=", new JbString(""))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary != bool', function() {
    expect(
      new JbDictionary().binopBool("!=", new JbBool(false))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary != array', function() {
    expect(
      new JbDictionary().binopArray(
        "!=", new JbArray([new JbNumber(3.5), new JbString("true"), new JbDictionary()])
      )
    ).toStrictEqual(
      new JbArray([new JbBool(true), new JbBool(true), new JbBool(false)])
    );
  });

  test('dictionary != {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbDictionary().binopArray("!=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('dictionary != null', function() {
    expect(
      new JbDictionary().binopNull("!=", new JbNull())
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary != binary', function() {
    expect(
      new JbDictionary().binopBin("!=", new JbBinary())
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary != date', function() {
    expect(
      new JbDictionary().binopDate("!=", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary && number', function() {
    expect(
      new JbDictionary().binopNumber("&&", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary && string', function() {
    expect(
      new JbDictionary().binopString("&&", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary && bool', function() {
    expect(
      makeDict("testKey", ).binopBool("&&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary && array', function() {
    const result = makeDict("testKey", new JbBool(true)).binopArray(
      "&&", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('dictionary && {}', function() {
    expect(
      new JbDictionary().binopArray("&&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary && null', function() {
    expect(
      new JbDictionary().binopNull("&&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary && binary', function() {
    expect(
      new JbDictionary().binopBin("&&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary && date', function() {
    expect(
      new JbDictionary().binopDate("&&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary & number', function() {
    expect(
      makeDict("testKey", new JbNumber(1.1)).binopNumber("&", new JbNumber(-3))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary & string', function() {
    expect(
      makeDict("testKey", ).binopString("&", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary & bool', function() {
    expect(
      makeDict("testKey", new JbBool(true)).binopBool("&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary & array', function() {
    const result = makeDict("testKey", new JbBool(true)).binopArray(
      "&", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('dictionary & {}', function() {
    expect(
      new JbDictionary().binopArray("&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary & null', function() {
    expect(
      makeDict("testKey", ).binopNull("&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary & binary', function() {
    expect(
      new JbDictionary().binopBin("&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary & date', function() {
    expect(
      makeDict("testKey", new JbDate()).binopDate("&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary || number', function() {
    expect(
      new JbDictionary().binopNumber("||", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary || string', function() {
    expect(
      makeDict("testKey", ).binopString("||", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary || bool', function() {
    expect(
      new JbDictionary().binopBool("||", new JbBool(false))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary || array', function() {
    const result = new JbDictionary().binopArray(
      "||", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('dictionary || {}', function() {
    expect(
      new JbDictionary().binopArray("||", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary || null', function() {
    expect(
      new JbDictionary().binopNull("||", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary || binary', function() {
    expect(
      makeDict("testKey", new JbBool(true)).binopBin("||", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary || date', function() {
    expect(
      new JbDictionary().binopDate("||", new JbDate(new Date("1/13/24")))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary | number', function() {
    expect(
      makeDict("testKey", ).binopNumber("|", new JbNumber(-1.4))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary | string', function() {
    expect(
      makeDict("testKey", new JbBool(true)).binopString("|", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary | bool', function() {
    expect(
      makeDict("testKey", ).binopBool("|", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('dictionary | array', function() {
    const result = makeDict("testKey", ).binopArray(
      "|", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('dictionary | {}', function() {
    expect(
      new JbDictionary().binopArray("|", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary | null', function() {
    expect(
      new JbDictionary().binopNull("|", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary | binary', function() {
    expect(
      makeDict("testKey", ).binopBin("|", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary | date', function() {
    expect(
      new JbDictionary().binopDate("|", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('dictionary[number]', function() {
    const value = new JbNumber(3);
    // non-existent key
    expect(
      makeDict("1", value).get(new JbNumber(2))
    ).toStrictEqual(new JbNull());
  });

  test('dictionary[bool]', function() {
    const value = new JbNumber(3);
    expect(
      makeDict("1", value).get(new JbBool(true))
    ).toStrictEqual(value);
  });

  test('dictionary[null]', function() {
    expect(function() {
      makeDict("null", new JbNumber(3)).get(new JbNull())
    }).toThrow();
  });

  test('dictionary[array]', function() {
    const value = new JbNumber(3);
    expect(
      makeDict("{}", value).get(new JbArray())
    ).toStrictEqual(value);
  });

  test('dictionary[dictionary]', function() {
    const value = new JbNumber(3);
    expect(
      makeDict("[]", value).get(new JbDictionary())
    ).toStrictEqual(value);
  });

  test('dictionary[binary]', function() {
    const value = new JbNumber(3);
    expect(
      makeDict("00", value).get(new JbBinary(new Uint8Array([0])))
    ).toStrictEqual(value);
  });

  test('dictionary[date]', function() {
    const value = new JbNumber(3);
    expect(
      makeDict("2024-01-13 00:00:00.000", value).get(new JbDate(new Date("1/13/24")))
    ).toStrictEqual(value);
  });

  test('dictionary[number] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbNumber(4);
    const dict = makeDict("1", value);
    const key = new JbNumber(1);
    dict.set(key, newValue);
    expect(
      dict.get(key)
    ).toStrictEqual(newValue);
  });

  test('dictionary[bool] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbBool(true);
    const dict = makeDict("1", value);
    const key = new JbBool(true);
    dict.set(key, newValue);
    expect(
      dict.get(key)
    ).toStrictEqual(newValue);
  });

  test('dictionary[null] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("the value");
    const dict = makeDict("null", value);
    const key = new JbNull();
    expect(function() {
      dict.set(key, newValue);
    }).toThrow();
  });

  test('dictionary[array] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("the value");
    const dict = makeDict("{0}", value);
    const key = new JbArray([new JbNumber(0)]);
    dict.set(key, newValue);
    expect(
      dict.get(key)
    ).toStrictEqual(newValue);
  });

  test('dictionary[dictionary] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("the value");
    const dict = makeDict("[key=>\"value\"]", value);
    const key = makeDict("key", new JbString("value"));
    dict.set(key, newValue);
    expect(
      dict.get(key)
    ).toStrictEqual(newValue);
  });

  test('dictionary[binary] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("the value");
    const dict = makeDict("00", value);
    const key = new JbBinary(new Uint8Array([0]));
    dict.set(key, newValue);
    expect(
      dict.get(key)
    ).toStrictEqual(newValue);
  });

  test('dictionary[date] =', function() {
    const value = new JbNumber(3);
    const newValue = new JbString("the value");
    const dict = makeDict("2024-01-13 00:00:00.000", value);
    const key = new JbDate(new Date("1/13/24"));
    dict.set(key, newValue);
    expect(
      dict.get(key)
    ).toStrictEqual(newValue);
  });
});
