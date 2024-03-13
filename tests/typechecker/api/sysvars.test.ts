import { Api } from "../../../src/api";
import { UnimplementedError } from "../../../src/errors";
import { GlobalIdentifier } from "../../../src/frontend/ast";
import { Position, Token, TokenType } from "../../../src/frontend/types";
import { TypedGlobalIdentifier } from "../../../src/typechecker/ast";
import TypeEnv from "../../../src/typechecker/environment";

const env = new TypeEnv();
const pos = new Position();

describe('System variable inference', function() {
  test.each(Api.sysVars.static)('Static system variables', async function(sysVar) {
    const id = new TypedGlobalIdentifier(
      new GlobalIdentifier(
        new Token(sysVar.name, TokenType.GlobalIdentifier, pos, pos),
        "system"
      )
    );
    const typeInfo = id.typeExpr(env);
    switch(sysVar.dataType) {
      case "Array":
        expect(typeInfo.type).toStrictEqual("array");
        break;
      case "Boolean":
        expect(typeInfo.type).toStrictEqual("bool");
        break;
      case "Integer":
        expect(typeInfo.type).toStrictEqual("number");
        break;
      case "String":
        expect(typeInfo.type).toStrictEqual("string");
        break;
      default:
        throw new UnimplementedError(`Unsupported system variable type for ${sysVar.name}: ${sysVar.dataType}`);
    }
  });

  test.each(Api.sysVars.extendable)('Extendable system variables', async function(sysVar) {
    const id = new TypedGlobalIdentifier(
      new GlobalIdentifier(
        new Token(sysVar.name + ".userValue", TokenType.GlobalIdentifier, pos, pos),
        "system"
      )
    );
    const typeInfo = id.typeExpr(env);
    expect(sysVar.default).toBeUndefined();
    expect(typeInfo.type).toStrictEqual("string");
  });
});
