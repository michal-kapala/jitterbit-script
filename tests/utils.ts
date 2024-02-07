import Parser from "../src/frontend/parser";
import Scope from "../src/runtime/scope";
import { evaluate } from "../src/runtime/interpreter";
import { RuntimeVal } from "../src/runtime/values";
import { JbDate, JbDictionary, JbNull, JbString } from "../src/runtime/types";
import { Expr, Program } from "../src/frontend/ast";

export async function run(testScript: string) {
  const program = new Parser().parse(testScript);
  return await evaluate(program, new Scope());
}

export function makeDict(key: string, value: RuntimeVal = new JbNull()) {
  return new JbDictionary(new Map([[key, value]]));
}

export function makeDate(date: string) {
  return JbDate.parse(new JbString(date));
}

export function makeAST(exprs: Expr[]) {
  const ast = new Program();
  ast.body = exprs;
  return ast;
}
