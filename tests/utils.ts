import Parser from "../src/frontend/parser";
import Scope from "../src/runtime/scope";
import { evaluate } from "../src/runtime/interpreter";

export default function run(testScript: string) {
  const program = new Parser().parse(testScript);
  return evaluate(program, new Scope());
}
