import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('XML functions', function() {
  test('Attribute(bool, array)', function() {
    const script = `<trans>attr = Attribute(name=true, value={})</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("bool");
    expect(result.vars[2].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(false);
  });

  test('CreateNode(string, bool, array)', function() {
    const script = `<trans>node = CreateNode(ns="some ns", name=true, sub1={})</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("bool");
    expect(result.vars[3].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('GetNodeName(string)', function() {
    const script = `<trans>name = GetNodeName(node="some xml node")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetNodeValue(string)', function() {
    const script = `<trans>value = GetNodeValue(node="some xml node")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetXMLString(string, string)', function() {
    const script = `<trans>xmlStr = GetXMLString(path="some xml path", q="true")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('IsNil(number)', function() {
    const script = `<trans>isNil = IsNil(path=20)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('RunXSLT(string, string, string, bool)', async function() {
    const script = `<trans>arr = RunXSLT(xslt="some xslt", xml1="", xml2="", xml3=false)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('SelectNodeFromXMLAny(bool, string)', function() {
    const script = `<trans>node = SelectNodeFromXMLAny(name=false, nodes="")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("type");
    expect(result.vars[1].type).toStrictEqual("bool");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('SelectNodes(string, number, string, bool)', function() {
    const script = `<trans>nodes = SelectNodes(node="false", xpath=0, arg1="", arg2=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
  });

  test('SelectNodesFromXMLAny(number, string, string, bool)', function() {
    const script = `<trans>nodes = SelectNodesFromXMLAny(xpath=0, nodes="false", arg1="", arg2=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(true);
  });

  test('SelectSingleNode(number, string, string, bool)', function() {
    const script = `<trans>nodes = SelectNodes(node=10, xpath="xpath query", arg1="", arg2=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });
});
