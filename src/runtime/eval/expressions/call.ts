import { Api } from "../../../api";
import { CallExpr, Expr } from "../../../frontend/ast";
import { evaluate } from "../../interpreter";
import Scope from "../../scope";
import { RuntimeVal } from "../../values";

export function eval_call_expr(call: CallExpr, scope: Scope): RuntimeVal {
  const func = Api.getFunc(call.caller.symbol);
  const args = eval_args(call.args, scope);

  // this is for type safety only, the error is thrown by parser
  if(func === undefined)
    throw `Function ${call.caller.symbol} does not exist, refer to Jitterbit function API docs`;

  return func.call(args);
}

function eval_args(args: Expr[], scope: Scope): RuntimeVal[] {
  const result: RuntimeVal[] = [];
  for(const expr of args)
    result.push(evaluate(expr, scope));
  return result;
}
