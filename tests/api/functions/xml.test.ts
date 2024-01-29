import { Api } from "../../../src/api";
import { AsyncFunc } from "../../../src/api/types";
import { UnimplementedError } from "../../../src/errors";
import Scope from "../../../src/runtime/scope";
import { JbBool, JbString } from "../../../src/runtime/types";

describe('XML functions', function() {
  test('Attribute()', function() {
    const func = Api.getFunc("Attribute");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("attrName"), new JbString("attrValue")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('CreateNode()', function() {
    const func = Api.getFunc("CreateNode");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("namespace"),
        new JbString("nodeName"),
        new JbString("attributeSubelement"),
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetNodeName()', function() {
    const func = Api.getFunc("GetNodeName");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("path")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetNodeValue()', function() {
    const func = Api.getFunc("GetNodeValue");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("path")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('GetXMLString()', function() {
    const func = Api.getFunc("GetXMLString");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("path"), new JbBool()], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('IsNil()', function() {
    const func = Api.getFunc("IsNil");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("path")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('RunXSLT()', async function() {
    const func = Api.getFunc("RunXSLT");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      (func as AsyncFunc)?.callAsync([
        new JbString("xslt"),
        new JbString("xml")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SelectNodeFromXMLAny()', function() {
    const func = Api.getFunc("SelectNodeFromXMLAny");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("nodeName"), new JbString("anyNodes")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SelectNodes()', function() {
    const func = Api.getFunc("SelectNodes");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("node"), new JbString("xPathQuery")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SelectNodesFromXMLAny()', function() {
    const func = Api.getFunc("SelectNodesFromXMLAny");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("xPathQuery"), new JbString("anyNodes")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SelectSingleNode()', function() {
    const func = Api.getFunc("SelectSingleNode");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("node"), new JbString("xPath")], new Scope())
    }).toThrow(UnimplementedError);
  });
});
