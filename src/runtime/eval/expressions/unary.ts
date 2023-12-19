import { UnaryExpr } from "../../../frontend/ast";
import Scope from "../../scope";
import { evaluate } from "../../interpreter";
import { RuntimeVal } from "../../values";

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
        return operand.negate();
      // POD: Jitterbit Studio supports RHS ! for ArrayLiteral (only), this is unsupported
      // POD: original error:
      // Operator ! cannot be proceeded with an operand: X
      throw `RHS unary operator ${unop.operator} unsupported`;
    case "-":
      if(unop.lhs)
        return operand.negative();
      // POD: the original error for a = Null()-;
      // Not enough operands for the operation: ";"
      throw `RHS unary operator ${unop.operator} unsupported`;
    case "--":
      if(unop.lhs) {
        // --x
        switch (unop.value.kind) {
          case "Identifier":
          case "GlobalIdentifier":
          case "MemberExpr":
            return operand.decrement();
          default:
            // POD: original error:
            // Invalid argument to operator ++/--
            throw `Unsupported argument type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
        }
      } else {
        // x--
        switch (unop.value.kind) {
          case "Identifier":
          case "GlobalIdentifier":            
            const oldValue = operand.clone();
            operand.decrement();
            return oldValue;
          case "MemberExpr":
            // post-decrementation is not supported for member expressions, e.g. b = a[4]--;
          default:
            // POD: original error:
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
            return operand.increment();
          default:
            // POD: original error:
            // Invalid argument to operator ++/--
            throw `Unsupported argument type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
        }
      } else {
        // x++
        switch (unop.value.kind) {
          case "Identifier":
          case "GlobalIdentifier":            
            const oldValue = operand.clone();
            operand.increment();
            return oldValue;
          case "MemberExpr":
            // post-incrementation is not supported for member expressions, e.g. b = a[4]++;
          default:
            // POD: original error:
            // Invalid argument to operator ++/--
            throw `Unsupported argument type for ${unop.operator} RHS unary operator: ${unop.value.kind}`;
        }
      }
    default:
      throw `Evaluation of unary operator ${unop.operator} unsupported`;
  }
}
