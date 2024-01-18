import Parser from "../src/frontend/parser";
import Scope from "../src/runtime/scope";
import { evaluate } from "../src/runtime/interpreter";
import { RuntimeVal } from "../src/runtime/values";
import { JbDictionary, JbNull } from "../src/runtime/types";

export function run(testScript: string) {
  const program = new Parser().parse(testScript);
  return evaluate(program, new Scope());
}

export function makeDict(key: string, value: RuntimeVal = new JbNull()) {
  return new JbDictionary(new Map([[key, value]]));
}
