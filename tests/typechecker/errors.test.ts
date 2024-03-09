import Diagnostic from "../../src/diagnostic";
import { Position } from "../../src/frontend/types";
import { typecheck } from "../utils";

describe('Error handling', function() {
  test('Missing closing parenthesis in a nested call + boolean literal caller.', function() {
    const script = 
`<trans>
  x = 1;
  If(true,
    true(x,
    "nice"; false
  );
</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0]).toStrictEqual(
      new Diagnostic(
        new Position(3, 3),
        new Position(6, 3),
        'Missing closing parenthesis of the call expression.'
      )
    );
    expect(result.diagnostics[1]).toStrictEqual(
      new Diagnostic(
        new Position(4, 5),
        new Position(4, 8),
        'Invalid call expression, the caller is not a function identifier.'
      )
    );
  });
});
