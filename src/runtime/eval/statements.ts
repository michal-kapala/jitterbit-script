import { Program, VarDeclaration } from "../../frontend/ast";
import Scope from "../scope";
import { evaluate } from "../interpreter";
import { MK_NULL, RuntimeVal } from "../values";

export function eval_program(program: Program, env: Scope): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

export function eval_var_declaration(
  declaration: VarDeclaration,
  env: Scope,
): RuntimeVal {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MK_NULL();

  return env.declareVar(declaration.identifier, value, declaration.constant);
}
