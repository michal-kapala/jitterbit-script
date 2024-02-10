import { Program } from "../frontend/ast";
import TypeEnv from "./environment";
import { TypedExpr } from "./types";

export default class Typechecker {
  static rebuildAst(ast: Program): TypedExpr[] {
    const typedAst: TypedExpr[] = [];
    for(const expr of ast.body) {
      // TODO
    }
    return typedAst;
  }

  static check(ast: Program) {
    const typedAst = this.rebuildAst(ast);
    const env = new TypeEnv();
    // Jitterbit uses expressions only
    for(const expr of typedAst) {
      // TODO
    }
    return typedAst;
  }
}
