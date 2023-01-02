import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  ObjectLiteral,
} from "../../frontend/ast";
import Scope from "../scope";
import { evaluate } from "../interpreter";
import { MK_NULL, NumberVal, ObjectVal, RuntimeVal } from "../values";

function eval_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string,
): NumberVal {
  let result: number;
  if (operator == "+") {
    result = lhs.value + rhs.value;
  } else if (operator == "-") {
    result = lhs.value - rhs.value;
  } else if (operator == "*") {
    result = lhs.value * rhs.value;
  } else if (operator == "/") {
    // TODO: Division by zero checks
    result = lhs.value / rhs.value;
  } else {
    result = lhs.value % rhs.value;
  }

  return { value: result, type: "number" };
}

/**
 * Evaulates expressions following the binary operation type.
 */
export function eval_binary_expr(
  binop: BinaryExpr,
  scope: Scope,
): RuntimeVal {
  const lhs = evaluate(binop.left, scope);
  const rhs = evaluate(binop.right, scope);

  // Only currently support numeric operations
  if (lhs.type == "number" && rhs.type == "number") {
    return eval_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator,
    );
  }

  // One or both are NULL
  return MK_NULL();
}

export function eval_identifier(
  ident: Identifier,
  scope: Scope,
): RuntimeVal {
  const val = scope.lookupVar(ident.symbol);
  return val;
}

export function eval_assignment(
  node: AssignmentExpr,
  scope: Scope,
): RuntimeVal {
  if (node.assignee.kind !== "Identifier") {
    throw `Invalid LHS inaide assignment expr ${JSON.stringify(node.assignee)}`;
  }

  const varname = (node.assignee as Identifier).symbol;
  return scope.assignVar(varname, evaluate(node.value, scope));
}

export function eval_object_expr(
  obj: ObjectLiteral,
  scope: Scope,
): RuntimeVal {
  const object = { type: "object", properties: new Map() } as ObjectVal;
  for (const { key, value } of obj.properties) {
    const runtimeVal = (value == undefined)
      ? scope.lookupVar(key)
      : evaluate(value, scope);

    object.properties.set(key, runtimeVal);
  }

  return object;
}
