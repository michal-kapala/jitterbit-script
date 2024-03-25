import Api from "../../../../src/api";
import { UnimplementedError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbBool, JbString } from "../../../../src/runtime/types";

test('Validate()', function() {
  const func = Api.getFunc("Validate");
  expect(func).toBeDefined();
  expect(func?.signature).toBeDefined();
  expect(function() {
    func?.call([
      new JbString("op"),
      new JbString("arg"),
      new JbBool(true)
    ], new Scope())
  }).toThrow(UnimplementedError);
});
