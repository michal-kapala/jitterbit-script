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
        "Expected ')' at the call expression's end."
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

  test('Backtick outside the script scope.', function() {
    const script = `<trans>
msg = Case(
  $condition == true, x=1,
  $condition == false, x=0; y=Null(),
  true, x=-1;
);
</trans>\``;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(4);
    // unknown token
    expect(result.diagnostics[0].error).toStrictEqual(true);
    // cross-type comparison
    expect(result.diagnostics[1].error).toStrictEqual(false);
    // global variable without assignment
    expect(result.diagnostics[2].error).toStrictEqual(false);
    // cross-type comparison
    expect(result.diagnostics[3].error).toStrictEqual(false);
  });

  test('Missing script opening tag.', function() {
    const script = `a=Dict(); a["1"] = 3;</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Missing script closing tag.', function() {
    const script = `<trans>a=Dict(); a["1"] = 3;`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Missing opening bracket.', function() {
    const script = `<trans>a=Dict(); a"1"] = 3;</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(4);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
    expect(result.diagnostics[2].error).toStrictEqual(true);
    expect(result.diagnostics[3].error).toStrictEqual(true);
  });

  test('Missing closing bracket.', function() {
    const script = `<trans>a=Dict(); a["1" = 3;</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(3);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(false);
    expect(result.diagnostics[2].error).toStrictEqual(true);
  });

  test('Missing opening brace.', function() {
    const script = `<trans>a=1,3,"2"}; WriteToOperationLog(a)</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(6);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
    expect(result.diagnostics[2].error).toStrictEqual(true);
    expect(result.diagnostics[3].error).toStrictEqual(true);
    expect(result.diagnostics[4].error).toStrictEqual(true);
    expect(result.diagnostics[5].error).toStrictEqual(true);
  });

  test('Missing closing brace.', function() {
    const script = `<trans>a={1,3,"2"; WriteToOperationLog(a)</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
  });

  test('Missing opening call paren.', function() {
    const script = `<trans>a = 2; WriteToOperationLog"a"); 3</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(5);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
    expect(result.diagnostics[2].error).toStrictEqual(true);
    expect(result.diagnostics[3].error).toStrictEqual(true);
    expect(result.diagnostics[4].error).toStrictEqual(true);
  });

  test('Missing closing call paren.', function() {
    const script = `<trans>a = 2; WriteToOperationLog("a"; 3</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Missing opening grouping paren.', function() {
    const script = `<trans>a = 2; "a" + "b"); 3</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
  });

  test('Missing closing grouping paren.', function() {
    const script = `<trans>a = 2; ("a" + "b"; 3</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Missing top-level expression semicolon.', function() {
    const script = `<trans>a=Dict() a["0"] = 3;</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Use of unassigned local variable.', function() {
    const script = `<trans>a</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Trailing array literal comma.', function() {
    const script = `<trans>a={1,2,3,}</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
  });

  test('Trailing call expression comma.', function() {
    const script = `<trans>a=Round(2.13, 1,}</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(3);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
    expect(result.diagnostics[2].error).toStrictEqual(true);
  });

  test('Missing assignment LHS.', function() {
    const script = `<trans>=3;</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
  });

  test('Missing assignment RHS.', function() {
    const script = `<trans>a=;</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Missing binary expression LHS.', function() {
    const script = `<trans>a=*3;</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
  });

  test('Missing binary expression RHS.', function() {
    const script = `<trans>a=2+;</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Invalid function identifier.', function() {
    const script = `<trans>callme(1,2,3)</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Too little arguments.', function() {
    const script = `<trans>Sqrt()</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Too many arguments.', function() {
    const script = `<trans>Sqrt(2,3)</trans>`;
    const result = typecheck(script);
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });
});
