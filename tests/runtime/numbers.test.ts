import { describe, expect, test } from '@jest/globals';
import Parser from "../../src/frontend/parser";
import Scope from "../../src/runtime/scope";
import { evaluate } from "../../src/runtime/interpreter";
import { JbNumber } from '../../src/runtime/types';

function run(testScript: string) {
  const program = new Parser().parse(testScript);
  return evaluate(program, new Scope());
}

describe('Tests for runtime implementations of JbNumber operators', function() {
  test('number + number', function() {
    const test = `
      <trans>
        1 + 2
      </trans>`;
    const result = run(test);
    expect((result as JbNumber).value).toBe(3);
  });
});
