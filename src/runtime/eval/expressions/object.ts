import { AssignmentExpr, Identifier, ObjectLiteral } from "../../../frontend/ast";
import Scope from "../../scope";
import { evaluate } from "../../interpreter";
import { ObjectVal, RuntimeVal } from "../../values";

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
