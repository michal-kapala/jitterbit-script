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
    const test = `
      <trans>
        -7.4
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(-7.4);
  });

  test('!number', function() {
    const test = `
      <trans>
        !7.4
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(false);
  });

  test('!0', function() {
    const test = `
      <trans>
        !.0
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(true);
  });

  test('= number', function() {
    const test = `
      <trans>
        result = 6.9;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBe(6.9);
  });

  test('--number', function() {
    const test = `
      <trans>
        num = 3.3;
        result = --num;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBe(2.3);
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
    expect(result.value).toBe(5.6);
  });

  test('++number', function() {
    const test = `
      <trans>
        num = 3.3;
        result = ++num;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBe(4.3);
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
    expect(result.value).toBe(7.6);
  });

  test('number -= number', function() {
    const test = `
      <trans>
        num = 6.9;
        num -= -.1;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBe(7);
  });

  test('number += number', function() {
    const test = `
      <trans>
        num = 6.9;
        num += .1;
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBe(7);
  });

  test('number + number', function() {
    const test = `
      <trans>
        1.234 + .5
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(1.734);
  });

  test('number - number', function() {
    const test = `
      <trans>
        1 - 1.2
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(-0.2);
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
    const test = `
      <trans>
        3 ^ 4
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBe(81);
  });

  test('number < number', function() {
    const test = `
      <trans>
        3.46 < 3.461
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(true);
  });

  test('number > number', function() {
    const test = `
      <trans>
        3.46 > 3.461
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(false);
  });

  test('number <= number', function() {
    const test = `
      <trans>
        3.461 <= 3.461
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(true);
  });

  test('number >= number', function() {
    const test = `
      <trans>
        3.460 >= 3.461
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(false);
  });

  test('number == number', function() {
    const test = `
      <trans>
        0 == 0.0
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(true);
  });

  test('number != number', function() {
    const test = `
      <trans>
        0 != 0.0
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(false);
  });

  test('number && number', function() {
    const test = `
      <trans>
        0 && 0.0
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(false);
  });

  test('number & number', function() {
    const test = `
      <trans>
        0 & 0.0
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(false);
  });

  test('number || number', function() {
    const test = `
      <trans>
        0 || 0.1
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(true);
  });

  test('number | number', function() {
    const test = `
      <trans>
        0 | 0.1
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("bool");
    expect(result.value).toBe(true);
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
    const num = new JbNumber(5.5);
    expect(
      Scope.assign(num, "-=", new JbNull())
    ).toEqual(num);
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
});
