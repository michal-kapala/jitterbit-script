import { Program } from "../../frontend/ast";
import Scope from "../scope";
import { evaluate } from "../interpreter";
import { MK_NULL, RuntimeVal } from "../values";

export function eval_program(program: Program, env: Scope): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();
  try {
    for (const statement of program.body) {
      lastEvaluated = evaluate(statement, env);
    }
  }
  catch(e) {
    // TODO: this should be added as an error
    console.error(`InterpreterError: ${e}\nLast evaluated expression:\n`, lastEvaluated);
  }
  
  return lastEvaluated;
}
