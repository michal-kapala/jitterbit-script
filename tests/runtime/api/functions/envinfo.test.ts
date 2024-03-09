import { Api } from "../../../../src/api";
import { UnimplementedError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";

describe('Environment info functions', function() {
  test('GetAgentGroupID()', function() {
    const func = Api.getFunc("GetAgentGroupID");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetAgentGroupName()', function() {
    const func = Api.getFunc("GetAgentGroupName");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetAgentID()', function() {
    const func = Api.getFunc("GetAgentID");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetAgentName()', function() {
    const func = Api.getFunc("GetAgentName");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetAgentVersionID()', function() {
    const func = Api.getFunc("GetAgentVersionID");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetAgentVersionName()', function() {
    const func = Api.getFunc("GetAgentVersionName");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetEnvironmentID()', function() {
    const func = Api.getFunc("GetEnvironmentID");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetEnvironmentName()', function() {
    const func = Api.getFunc("GetEnvironmentName");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetOrganizationID()', function() {
    const func = Api.getFunc("GetOrganizationID");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetOrganizationName()', function() {
    const func = Api.getFunc("GetOrganizationName");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });
});
