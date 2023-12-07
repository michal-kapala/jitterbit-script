import { Identifier } from "../../../frontend/ast";
import Scope from "../../scope";
import { RuntimeVal } from "../../values";

/**
 * Returns the value of an identifier.
 * @param ident 
 * @param scope 
 * @returns 
 */
export function eval_identifier(
  ident: Identifier,
  scope: Scope,
): RuntimeVal {
  const val = scope.lookupVar(ident.symbol);
  return val;
}
