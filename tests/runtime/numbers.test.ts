import { describe, expect, test } from '@jest/globals';
import run from '../utils';
import { JbNumber } from '../../src/runtime/types';

describe('Tests for runtime implementations of JbNumber operators', function() {
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

  test('number / number', function() {
    const test = `
      <trans>
        13 / 4
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.type).toBe("number");
    expect(result.value).toBeCloseTo(3.25);
  });

  test('number / 0', function() {
    expect(() => {
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
});
