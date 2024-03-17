import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Environment info functions', function() {
  test('GetAgentGroupID()', function() {
    const script = `<trans>id = GetAgentGroupID()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetAgentGroupName()', function() {
    const script = `<trans>name = GetAgentGroupName()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetAgentID()', function() {
    const script = `<trans>id = GetAgentID()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetAgentName()', function() {
    const script = `<trans>name = GetAgentName()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetAgentVersionID()', function() {
    const script = `<trans>id = GetAgentVersionID()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetAgentVersionName()', function() {
    const script = `<trans>name = GetAgentVersionName()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetEnvironmentID()', function() {
    const script = `<trans>id = GetEnvironmentID()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetEnvironmentName()', function() {
    const script = `<trans>name = GetEnvironmentName()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetOrganizationID()', function() {
    const script = `<trans>id = GetOrganizationID()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetOrganizationName()', function() {
    const script = `<trans>name = GetOrganizationName()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
