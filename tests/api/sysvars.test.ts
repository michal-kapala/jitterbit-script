import { Api } from "../../src/api";
import { UnimplementedError } from "../../src/errors";
import { GlobalIdentifier } from "../../src/frontend/ast";
import { evaluate } from "../../src/runtime/interpreter";
import Scope from "../../src/runtime/scope";
import { JbBool, JbNull, JbNumber, JbString } from "../../src/runtime/types";

const scope = new Scope();
const jbNull = new JbNull();
const jbTrue = new JbBool(true);
const jbFalse = new JbBool(false);

describe('System variable initialization', function() {
  test.each(Api.sysVars.static)('Static system variables', async function(sysVar) {
    const value = await evaluate(new GlobalIdentifier(sysVar.name, "system"), scope);
    if(sysVar.default !== undefined) {
      switch(sysVar.dataType) {
        case "Array":
          throw new UnimplementedError(`Default values for array system variables are not supported yet: ${sysVar.name}`);
        case "Boolean":
          expect(value).toStrictEqual(sysVar.default === "true" ? jbTrue : jbFalse);
          break;
        case "Integer":
          expect(value).toStrictEqual(new JbNumber(parseInt(sysVar.default)));
          break;
        case "String":
          expect(value).toStrictEqual(new JbString(sysVar.default));
          break;
        default:
          throw new UnimplementedError(`Unsupported system variable type for ${sysVar.name}: ${sysVar.dataType}`);
      }
    } else {
      expect(value).toStrictEqual(jbNull);
    }
  });

  test.each(Api.sysVars.extendable)('Extendable system variables', async function(sysVar) {
    const value = await evaluate(new GlobalIdentifier(sysVar.name + ".userValue", "system"), scope);
    expect(sysVar.default).toBeUndefined();
    expect(value).toStrictEqual(jbNull);
  });
});
