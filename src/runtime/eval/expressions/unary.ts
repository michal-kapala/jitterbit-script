import { UnaryExpr } from "../../../frontend/ast";
import Scope from "../../scope";
import { evaluate } from "../../interpreter";
import { 
  RuntimeVal,
  clone,
  decrement,
  increment,
  negate,
  negative
} from "../../values";

/**
 * Evaluates unary operator expressions (!, -, --, ++).
 * @param unop 
 * @param scope 
 * @returns 
 */
export function eval_unary_expr(unop: UnaryExpr, scope: Scope): RuntimeVal {
  const operand = evaluate(unop.value, scope);

  switch(unop.operator) {
    case "!":
      if(unop.lhs)
        return negate(operand);
      // Jitterbit Studio supports RHS ! for ArrayLiteral (only), this is unsupported
      // original error:
      // Operator ! cannot be proceeded with an operand: X
      throw `RHS unary operator ${unop.operator} unsupported`;
    case "-":
      if(unop.lhs)
        return negative(operand);
      // the original error for a = Null()-;
      // Not enough operands for the operation: ";"
      throw `RHS unary operator ${unop.operator} unsupported`;
    case "--":
      if(unop.lhs) {
        // --x
        switch (unop.value.kind) {
          case "Identifier":
          case "GlobalIdentifier":
          case "MemberExpr":
            return decrement(operand);
          default:
            // original error:
            // Invalid argument to operator ++/--
            throw `Unsupported argument type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
        }
      } else {
        // x--
        switch (unop.value.kind) {
          case "Identifier":
          case "GlobalIdentifier":            
            const oldValue = clone(operand);
            decrement(operand);
            return oldValue;
          case "MemberExpr":
            // post-decrementation is not supported for member expressions, e.g. b = a[4]--;
          default:
            // original error:
            // Invalid argument to operator ++/--
            throw `Unsupported argument type for ${unop.operator} RHS unary operator: ${unop.value.kind}`;
        }
      }
    case "++":
      if(unop.lhs) {
        // ++x
        switch (unop.value.kind) {
          case "Identifier":
          case "GlobalIdentifier":
          case "MemberExpr":
            return increment(operand);
          default:
            // original error:
            // Invalid argument to operator ++/--
            throw `Unsupported argument type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
        }
      } else {
        // x++
        switch (unop.value.kind) {
          case "Identifier":
          case "GlobalIdentifier":            
            const oldValue = clone(operand);
            increment(operand);
            return oldValue;
          case "MemberExpr":
            // post-incrementation is not supported for member expressions, e.g. b = a[4]++;
          default:
            // original error:
            // Invalid argument to operator ++/--
            throw `Unsupported argument type for ${unop.operator} RHS unary operator: ${unop.value.kind}`;
        }
      }
    default:
      throw `Evaluation of unary operator ${unop.operator} unsupported`;
  }
}
