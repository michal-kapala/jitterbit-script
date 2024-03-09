import { Api } from "../../../../src/api";
import Scope from "../../../../src/runtime/scope";
import { JbString } from "../../../../src/runtime/types";

describe('Log functions', function() {
  test('WriteToOperationLog()', function() {
    const func = Api.getFunc("WriteToOperationLog");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(
      func?.call([new JbString("hello there")], new Scope())
    ).toStrictEqual(new JbString("hello there"));
  });
});
