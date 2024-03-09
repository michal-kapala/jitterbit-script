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
} from '../../../src/runtime/types';
import Scope from '../../../src/runtime/scope';
import { makeDate, run } from '../../utils';

describe('JbBinary operators', function() {
  test('-binary', function() {
    expect(function() {
      return new JbBinary().negative()
    }).toThrow();
  });

  test('!binary', function() {
    expect(function() {
      return new JbBinary().negate()
    }).toThrow();
  });

  test('= binary', function() {
    const rhs = new JbBinary(new Uint8Array([0]));
    expect(
      Scope.assign(new JbArray(), "=", rhs)
    ).toStrictEqual(rhs);
  });

  test('--binary', function() {
    expect(function() {
      return new JbBinary().decrement()
    }).toThrow();
  });

  test('binary--', function() {
    expect(function() {
      return new JbBinary().decrement()
    }).toThrow();
  });

  test('++binary', function() {
    expect(function() {
      return new JbBinary().increment()
    }).toThrow();
  });

  test('binary++', function() {
    expect(function() {
      return new JbBinary().increment()
    }).toThrow();
  });

  test('binary -= binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return Scope.assign(bin, "-=", bin)
    }).toThrow();
  });

  test('binary += binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return Scope.assign(bin, "+=", bin)
    }).toThrow();
  });

  test('binary + binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin("+", bin)
    }).toThrow();
  });

  test('binary - binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin("-", bin)
    }).toThrow();
  });

  test('binary * binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin("*", bin);
    }).toThrow();
  });

  test('binary / binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin("/", bin)
    }).toThrow();
  });

  test('binary ^ binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin("^", bin)
    }).toThrow();
  });

  test('binary < binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin("<", bin)
    }).toThrow();
  });

  test('binary > binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin(">", bin)
    }).toThrow();
  });

  test('binary <= binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin("<=", bin)
    }).toThrow();
  });

  test('binary >= binary', function() {
    const bin = new JbBinary();
    expect(function() {
      return bin.binopBin(">=", bin)
    }).toThrow();
  });

  test('binary == binary', function() {
    const bin = new JbBinary(new Uint8Array([3, 2, 1, 0]));
    expect(
      bin.binopBin("==", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary != binary', function() {
    expect(
      new JbBinary(
        new Uint8Array([3, 2, 1, 0])
      ).binopBin("!=", new JbBinary(new Uint8Array([3, 2, 1, 0])))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary && binary', function() {
    expect(
      new JbBinary().binopBin("&&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & binary', function() {
    expect(
      new JbBinary().binopBin("&", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary || binary', function() {
    expect(
      new JbBinary().binopBin("||", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary | binary', function() {
    expect(
      new JbBinary().binopBin("|", new JbBinary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary[binary]', async function() {
    const test = `
      <trans>
        result = HexToBinary("11FF")[HexToBinary("FF11")];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[binary] =', async function() {
    const test = `
      <trans>
        value = HexToBinary("11FF");
        value[HexToBinary("FF11")] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });
});

describe('JbBinary cross-type interactions', function() {
  test('binary -= number', function() {
    const num = new JbNumber(7);
    expect(function() {
      Scope.assign(new JbBinary(), "-=", num)
    }).toThrow();
  });

  test('binary -= string', function() {
    expect(function() {
      return Scope.assign(new JbBinary(), "-=", new JbString("-3.5abc"))
    }).toThrow();
  });

  test('binary -= bool', function() {
    expect(function() {
      return Scope.assign(new JbBinary(), "-=", new JbBool(true))
    }).toThrow();
  });

  test('binary -= array', function() {
    expect(function() {
      Scope.assign(
        new JbBinary(),
        "-=",
        new JbArray([new JbNumber(3.5), new JbNumber(-6)])
      )
    }).toThrow();
  });

  test('binary -= {}', function() {
    const emptyArray = new JbArray();
    expect(
      Scope.assign(new JbBinary(), "-=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary -= dictionary', function() {
    expect(function() {
      return Scope.assign(new JbBinary(), "-=", new JbDictionary())
    }).toThrow();
  });

  test('binary -= null', function() {
    const lhs = new JbBinary();
    expect(
      Scope.assign(lhs, "-=", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('binary -= date', function() {
    expect(function() {
      return Scope.assign(new JbBinary(), "-=", new JbDate())
    }).toThrow();
  });

  test('binary += number', function() {
    const rhs = new JbNumber(5.5);
    expect(function() {
      Scope.assign(new JbBinary(), "+=", rhs)
    }).toThrow();
  });

  test('binary += string', function() {
    const rhs = new JbString("-2.7abcd");
    expect(function() {
      Scope.assign(new JbBinary(), "+=", rhs)
    }).toThrow();
  });

  test('binary += bool', function() {
    const rhs = new JbBool(true);
    expect(function() {
      Scope.assign(new JbBinary(), "+=", rhs)
    }).toThrow();
  });

  test('binary += array', function() {
    const rhs = new JbArray([new JbString("3.5"), new JbString("6")]);
    expect(function() {
      Scope.assign(new JbBinary(), "+=", rhs)
    }).toThrow();
  });

  test('binary += {}', function() {
    const emptyArray = new JbArray();
    expect(
      Scope.assign(new JbBinary(), "+=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary += dictionary', function() {
    expect(function() {
      return Scope.assign(new JbBinary(), "+=", new JbDictionary())
    }).toThrow();
  });

  test('binary += null', function() {
    const lhs = new JbBinary();
    expect(
      Scope.assign(lhs, "+=", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('binary += date', function() {
    expect(function() {
      Scope.assign(new JbBinary(), "+=", new JbDate())
    }).toThrow();
  });

  test('binary + number', function() {
    expect(function() {
      new JbBinary().binopNumber("+", new JbNumber(3))
    }).toThrow();
  });

  test('binary + string', function() {
    expect(function() {
      new JbBinary().binopString("+", new JbString("-420.69"))
    }).toThrow();
  });

  test('binary + bool', function() {
    expect(function() {
      new JbBinary().binopBool("+", new JbBool())
    }).toThrow();
  });

  test('binary + array', function() {
    const rhs = new JbArray([new JbNumber(3.5), new JbString("6")]);
    expect(function() {
      new JbBinary().binopArray("+", rhs)
    }).toThrow();
  });

  test('binary + {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("+", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary + dictionary', function() {
    expect(function() {
      return new JbBinary().binopDict("+", new JbDictionary())
    }).toThrow();
  });

  test('binary + null', function() {
    const lhs = new JbBinary(new Uint8Array([77, 22]));
    expect(
      lhs.binopNull("+", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('binary + date', function() {
    expect(function() {
      new JbBinary().binopDate("+", new JbDate())
    }).toThrow();
  });

  test('binary - number', function() {
    expect(function() {
      new JbBinary().binopNumber("-", new JbNumber(5.6))
    }).toThrow();
  });

  test('binary - string', function() {
    expect(function() {
      return new JbBinary().binopString("-", new JbString("-420.69"))
    }).toThrow();
  });

  test('binary - bool', function() {
    expect(function() {
      new JbBinary().binopBool("-", new JbBool())
    }).toThrow();
  });

  test('binary - array', function() {
    expect(function() {
      return new JbBinary().binopArray("-", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('binary - {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("-", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary - dictionary', function() {
    expect(function() {
      return new JbBinary().binopDict("-", new JbDictionary())
    }).toThrow();
  });

  test('binary - null', function() {
    const lhs = new JbBinary();
    expect(
      lhs.binopNull("-", new JbNull())
    ).toStrictEqual(lhs);
  });

  test('binary - date', function() {
    expect(function() {
      return new JbBinary().binopDate("-", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary * number', function() {
    expect(function() {
      new JbBinary().binopNumber("*", new JbNumber(2))
    }).toThrow();
  });

  test('binary * string', function() {
    expect(function() {
      return new JbBinary().binopString("*", new JbString("-420.69"))
    }).toThrow();
  });

  test('binary * bool', function() {
    expect(function() {
      new JbBinary().binopBool("*", new JbBool(true))
    }).toThrow();
  });

  test('binary * array', function() {
    expect(function() {
      return new JbBinary().binopArray("*", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('binary * {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("*", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary * dictionary', function() {
    expect(function() {
      return new JbBinary().binopDict("*", new JbDictionary())
    }).toThrow();
  });

  test('binary * null', function() {
    expect(function() {
      return new JbBinary().binopNull("*", new JbNull())
    }).toThrow();
  });

  test('binary * date', function() {
    expect(function() {
      return new JbBinary().binopDate("*", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary / number', function() {
    expect(function() {
      return new JbBinary().binopNumber("/", new JbNumber(0))
    }).toThrow();
  });

  test('binary / string', function() {
    expect(function() {
      return new JbBinary().binopString("/", new JbString("-420.69"))
    }).toThrow();
  });

  test('binary / bool', function() {
    expect(function() {
      return new JbBinary().binopBool("/", new JbBool())
    }).toThrow();
  });

  test('binary / array', function() {
    expect(function() {
      return new JbBinary().binopArray("/", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('binary / {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("/", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary / dictionary', function() {
    expect(function() {
      return new JbBinary().binopDict("/", new JbDictionary())
    }).toThrow();
  });

  test('binary / null', function() {
    expect(function() {
      return new JbBinary().binopNull("/", new JbNull())
    }).toThrow();
  });

  test('binary / date', function() {
    expect(function() {
      return new JbBinary().binopDate("/", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary ^ number', function() {
    expect(function() {
      return new JbBinary().binopNumber("^", new JbNumber(2))
    }).toThrow();
  });

  test('binary ^ string', function() {
    expect(function() {
      return new JbBinary().binopString("^", new JbString("-420.69"))
    }).toThrow();
  });

  test('binary ^ bool', function() {
    expect(function() {
      return new JbBinary().binopBool("^", new JbBool())
    }).toThrow();
  });

  test('binary ^ array', function() {
    expect(function() {
      return new JbBinary().binopArray("^", new JbArray([new JbNumber(3.5), new JbString("6")]))
    }).toThrow();
  });

  test('binary ^ {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("^", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary ^ dictionary', function() {
    expect(function() {
      return new JbBinary().binopDict("^", new JbDictionary())
    }).toThrow();
  });

  test('binary ^ null', function() {
    expect(function() {
      return new JbBinary().binopNull("^", new JbNull())
    }).toThrow();
  });

  test('binary ^ date', function() {
    expect(function() {
      return new JbBinary().binopDate("^", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary < number', function() {
    expect(function() {
      new JbBinary().binopNumber("<", new JbNumber())
    }).toThrow();
  });

  test('binary < string', function() {
    expect(function() {
      new JbBinary().binopString("<", new JbString("420.69niceinnit"))
    }).toThrow();
  });

  test('binary < bool', function() {
    expect(function() {
      new JbBinary().binopBool("<", new JbBool())
    }).toThrow();
  });

  test('binary < array', function() {
    expect(function() {
      new JbBinary().binopArray(
        "<", new JbArray([new JbNumber(0.5), new JbString("6")])
      )
    }).toThrow();
  });

  test('binary < {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("<", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary < dictionary', function() {
    expect(function() {
      new JbBinary().binopDict("<", new JbDictionary())
    }).toThrow();
  });

  test('binary < null', function() {
    expect(
      new JbBinary().binopNull("<", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary < date', function() {
    expect(function() {
      new JbBinary().binopDate("<", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary > number', function() {
    expect(function() {
      new JbBinary().binopNumber(">", new JbNumber(0.5))
    }).toThrow();
  });

  test('binary > string', function() {
    expect(function() {
      new JbBinary().binopString(">", new JbString("420.69niceinnit"))
    }).toThrow();
  });

  test('binary > bool', function() {
    expect(function() {
      new JbBinary().binopBool(">", new JbBool())
    }).toThrow();
  });

  test('binary > array', function() {
    expect(function() {
      new JbBinary().binopArray(
        ">", new JbArray([new JbNumber(3.5), new JbString("6"), new JbNumber(-3.5)])
      )
    }).toThrow();
  });

  test('binary > {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray(">", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary > dictionary', function() {
    expect(function() {
      new JbBinary().binopDict(">", new JbDictionary())
    }).toThrow();
  });

  test('binary > null', function() {
    expect(
      new JbBinary().binopNull(">", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary > date', function() {
    expect(function() {
      new JbBinary().binopDate(">", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary <= number', function() {
    expect(function() {
      new JbBinary().binopNumber("<=", new JbNumber(0))
    }).toThrow();
  });

  test('binary <= string', function() {
    expect(function() {
      new JbBinary().binopString("<=", new JbString("1.00000niceinnit"))
    }).toThrow();
  });

  test('binary <= bool', function() {
    expect(function() {
      new JbBinary().binopBool("<=", new JbBool())
    }).toThrow();
  });

  test('binary <= array', function() {
    expect(function() {
      new JbBinary().binopArray(
        "<=", new JbArray([new JbNumber(-3.5), new JbString("6"), new JbString("whatever")])
      )
    }).toThrow();
  });

  test('binary <= {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("<=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary <= dictionary', function() {
    expect(function() {
      new JbBinary().binopDict("<=", new JbDictionary())
    }).toThrow();
  });

  test('binary <= null', function() {
    expect(
      new JbBinary().binopNull("<=", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary <= date', function() {
    expect(function() {
      new JbBinary().binopDate("<=", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary >= number', function() {
    expect(function() {
      new JbBinary().binopNumber(">=", new JbNumber(1))
    }).toThrow();
  });

  test('binary >= string', function() {
    expect(function() {
      new JbBinary().binopString(">=", new JbString("1.0000000niceinnit"))
    }).toThrow();
  });

  test('binary >= bool', function() {
    expect(function() {
      new JbBinary().binopBool(">=", new JbBool())
    }).toThrow();
  });

  test('binary >= array', function() {
    expect(function() {
      new JbBinary().binopArray(
        ">=", new JbArray([new JbNumber(1), new JbString("6"),new JbNumber(-4)])
      )
    }).toThrow();
  });

  test('binary >= {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray(">=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary >= dictionary', function() {
    expect(function() {
      new JbBinary().binopDict(">=", new JbDictionary())
    }).toThrow();
  });

  test('binary >= null', function() {
    expect(
      new JbBinary().binopNull(">=", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary >= date', function() {
    expect(function() {
      new JbBinary().binopDate(">=", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary == number', function() {
    expect(function() {
      new JbBinary().binopNumber("==", new JbNumber(1))
    }).toThrow();
  });

  test('binary == string', function() {
    expect(function() {
      new JbBinary().binopString("==", new JbString("whatever"))
    }).toThrow();
  });

  test('binary == bool', function() {
    expect(
      new JbBinary().binopBool("==", new JbBool(false))
    ).toStrictEqual(new JbBool(true));
  });

  test('binary == array', function() {
    expect(function() {
      new JbBinary().binopArray(
        "==", new JbArray([new JbNumber(3.5), new JbString("6"), new JbString("null")])
      )
    }).toThrow();
  });

  test('binary == {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("==", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary == dictionary', function() {
    expect(
      new JbBinary().binopDict("==", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary == null', function() {
    expect(
      new JbBinary().binopNull("==", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary == date', function() {
    expect(function() {
      new JbBinary().binopDate("==", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary != number', function() {
    expect(function() {
      new JbBinary().binopNumber("!=", new JbNumber(0))
    }).toThrow();
  });

  test('binary != string', function() {
    expect(function() {
      new JbBinary().binopString("!=", new JbString(""))
    }).toThrow();
  });

  test('binary != bool', function() {
    expect(
      new JbBinary().binopBool("!=", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('binary != array', function() {
    expect(function() {
      new JbBinary().binopArray(
        "!=", new JbArray([new JbNumber(3.5), new JbString("true"), new JbNull()])
      )
    }).toThrow();
  });

  test('binary != {}', function() {
    const emptyArray = new JbArray();
    expect(
      new JbBinary().binopArray("!=", emptyArray)
    ).toStrictEqual(emptyArray);
  });

  test('binary != dictionary', function() {
    expect(
      new JbBinary().binopDict("!=", new JbDictionary())
    ).toStrictEqual(new JbBool(true));
  });

  test('binary != null', function() {
    expect(
      new JbBinary().binopNull("!=", new JbNull())
    ).toStrictEqual(new JbBool(true));
  });

  test('binary != date', function() {
    expect(function() {
      new JbBinary().binopDate("!=", makeDate("1/13/24"))
    }).toThrow();
  });

  test('binary && number', function() {
    expect(
      new JbBinary().binopNumber("&&", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary && string', function() {
    expect(
      new JbBinary().binopString("&&", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary && bool', function() {
    expect(
      new JbBinary().binopBool("&&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary && array', function() {
    const result = new JbBinary().binopArray(
      "&&", new JbArray([new JbNumber(3.5), new JbString("NaN")])
    );
    expect(result).toStrictEqual(new JbBool(false));
  });

  test('binary && {}', function() {
    expect(
      new JbBinary().binopArray("&&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary && dictionary', function() {
    expect(
      new JbBinary().binopDict("&&", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary && null', function() {
    expect(
      new JbBinary().binopNull("&&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary && date', function() {
    expect(
      new JbBinary().binopDate("&&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & number', function() {
    expect(
      new JbBinary().binopNumber("&", new JbNumber(-3))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & string', function() {
    expect(
      new JbBinary().binopString("&", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & bool', function() {
    expect(
      new JbBinary().binopBool("&", new JbBool(true))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & array', function() {
    expect(
      new JbBinary().binopArray(
        "&", new JbArray([new JbNumber(3.5), new JbString("NaN")])
      )
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & {}', function() {
    expect(
      new JbBinary().binopArray("&", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & dictionary', function() {
    expect(
      new JbBinary().binopDict("&", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & null', function() {
    expect(
      new JbBinary().binopNull("&", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary & date', function() {
    expect(
      new JbBinary().binopDate("&", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary || number', function() {
    expect(
      new JbBinary().binopNumber("||", new JbNumber(0))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary || string', function() {
    expect(
      new JbBinary().binopString("||", new JbString("420.69niceinnit"))
    ).toStrictEqual(new JbBool(true));
  });

  test('binary || bool', function() {
    expect(
      new JbBinary().binopBool("||", new JbBool(false))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary || array', function() {
    expect(
      new JbBinary().binopArray(
        "||", new JbArray([new JbNumber(3.5), new JbString("NaN")])
      )
    ).toStrictEqual(new JbBool(false));
  });

  test('binary || {}', function() {
    expect(
      new JbBinary().binopArray("||", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary || dictionary', function() {
    expect(
      new JbBinary().binopDict("||", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary || null', function() {
    expect(
      new JbBinary().binopNull("||", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary || date', function() {
    expect(
      new JbBinary().binopDate("||", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary | number', function() {
    expect(
      new JbBinary().binopNumber("|", new JbNumber(-1.4))
    ).toStrictEqual(new JbBool(true));
  });

  test('binary | string', function() {
    expect(
      new JbBinary().binopString("|", new JbString("whatever"))
    ).toStrictEqual(new JbBool(false));
  });

  test('binary | bool', function() {
    expect(
      new JbBinary().binopBool("|", new JbBool(true))
    ).toStrictEqual(new JbBool(true));
  });

  test('binary | array', function() {
    expect(
      new JbBinary().binopArray(
        "|", new JbArray([new JbNumber(3.5), new JbString("NaN")])
      )
    ).toStrictEqual(new JbBool(false));
  });

  test('binary | {}', function() {
    expect(
      new JbBinary().binopArray("|", new JbArray())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary | dictionary', function() {
    expect(
      new JbBinary().binopDict("|", new JbDictionary())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary | null', function() {
    expect(
      new JbBinary().binopNull("|", new JbNull())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary | date', function() {
    expect(
      new JbBinary().binopDate("|", new JbDate())
    ).toStrictEqual(new JbBool(false));
  });

  test('binary[number]', async function() {
    const test = `
      <trans>
        result = HexToBinary("11FF")[0];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[bool]', async function() {
    const test = `
      <trans>
        result = HexToBinary("11FF")[false];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[string]', async function() {
    const test = `
      <trans>
        result = HexToBinary("11FF")["0"];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[array]', async function() {
    const test = `
      <trans>
        result = HexToBinary("11FF")[{0}];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[dictionary]', async function() {
    const test = `
      <trans>
        result = HexToBinary("11FF")[Dict()];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[binary]', async function() {
    const test = `
      <trans>
        result = HexToBinary("11FF")[HexToBinary("00")];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[date]', async function() {
    const test = `
      <trans>
        result = HexToBinary("11FF")[Now()];
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[number] =', async function() {
    const test = `
      <trans>
        value = HexToBinary("11FF");
        value[0] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[bool] =', async function() {
    const test = `
      <trans>
        value = HexToBinary("11FF");
        value[true] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[string] =', async function() {
    const test = `
      <trans>
        value = HexToBinary("00");
        value["1"] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[array] =', async function() {
    const test = `
      <trans>
        value = HexToBinary("11FF");
        value[{1}] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[dictionary] =', async function() {
    const test = `
      <trans>
        value = HexToBinary("11FF");
        value[Dict()] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[null] =', async function() {
    const test = `
      <trans>
        value = HexToBinary("01");
        value[Null()] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });

  test('binary[date] =', async function() {
    const test = `
      <trans>
        value = HexToBinary("11FF");
        value[Now()] = "new value";
      </trans>
    `;
    await expect(async function() {
      return await run(test)
    }).rejects.toThrow();
  });
});
