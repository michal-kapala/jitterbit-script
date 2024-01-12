import { describe, expect, test } from '@jest/globals';
import run from '../utils';
import { JbNumber } from '../../src/runtime/types';

describe('Tests for runtime implementations of JbNumber operators', function() {
  test('number + number', function() {
    const test = `
      <trans>
        1 + 2
      </trans>`;
    const result = run(test) as JbNumber;
    expect(result.value).toBe(3);
  });
});
