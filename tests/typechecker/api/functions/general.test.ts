import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('General functions', function() {
  test('ArgumentList(unassigned, unassigned, string)', function() {
    const script = `<trans>null = ArgumentList(src, filter, "not a var")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("null");
    expect(result.vars[1].type).toStrictEqual("unknown");
    expect(result.vars[2].type).toStrictEqual("unknown");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('AutoNumber()', function() {
    const script = `<trans>nb = AutoNumber()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('CancelOperation(number, number)', async function() {
    const script = `<trans>void = CancelOperation(opId=534129)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('CancelOperationChain(void, number)', async function() {
    const script = `<trans>void = CancelOperationChain(msg=534129)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('Eval(number, number)', async function() {
    const script = `<trans>result = Eval(msg=If(Null(), x=1, x=-1), x=0)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.vars[4].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  describe('Get()', function() {
    test('Get(string, number, bool)', function() {
      const script = `<trans>result = Get(name="anything", idx1=1, idx2=false)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('Get(array, number, number)', function() {
      const script = `<trans>result = Get(name={}, idx1=1, idx2=2)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("type");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.vars[3].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  test('GetChunkDataElement(null)', function() {
    const script = `<trans>result = GetChunkDataElement(name=Null())</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("type");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('GetHostByIP(number)', async function() {
    const script = `<trans>result = GetHostByIP(ip=2130706433)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });
  
  test('GetInputString(number)', function() {
    const script = `<trans>result = GetInputString(arg=2130706433)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('GetLastOperationRunStartTime(string)', function() {
    const script = `<trans>result = GetLastOperationRunStartTime(arg="operation id")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("date");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetName(string)', function() {
    const script = `<trans>result = GetName(arg="operation id")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetOperationQueue(string)', function() {
    const script = `<trans>result = GetOperationQueue(tag="operation tag")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GetServerName()', function() {
    const script = `<trans>result = GetServerName()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('GUID()', function() {
    const script = `<trans>guid = GUID()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('IfEmpty(null, bool)', async function() {
    const script = `<trans>result = IfEmpty(empty=Null(), def=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.vars[2].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
  
  test('IfNull(null, bool)', async function() {
    const script = `<trans>result = IfNull(empty=Null(), def=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.vars[2].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('InitCounter()', function() {
    test('InitCounter(global, number)', function() {
      const script = `<trans>result = InitCounter($counter, init=13)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("null");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('InitCounter(string, number)', function() {
      const script = `<trans>result = InitCounter(cnt="counter", init=13)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('InitCounter(null, number)', function() {
      const script = `<trans>result = InitCounter(cnt=Null(), init=13)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("unknown");
      expect(result.vars[1].type).toStrictEqual("null");
      expect(result.vars[2].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });
  });

  test('InList(null, number, string)', function() {
    const script = `<trans>result = InList(x=Null(), y=11, z="nice")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('IsInteger(date)', function() {
    const script = `<trans>result = IsInteger(x=Now())</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("date");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('IsNull(global)', function() {
    const script = `<trans>result = IsNull($someGlobal)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });
  
  test('IsValid(global)', function() {
    const script = `<trans>result = IsValid($someGlobal)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  describe('Length()', function() {
    test('Length(string)', function() {
      const script = `<trans>len = Length(x="some string")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Length(array)', function() {
      const script = `<trans>len = Length(x={4})</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Length(dictionary)', function() {
      const script = `<trans>len = Length(x=Dict())</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("dictionary");
      expect(result.diagnostics.length).toStrictEqual(0);
    });

    test('Length(binary)', function() {
      const script = `<trans>len = Length(x=HexToBinary("00112233"))</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("binary");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  test('Null()', function() {
    const script = `<trans>null = Null()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("null");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Random(number, string)', function() {
    const script = `<trans>rnd = Random(x=-5.5, y="10")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('RandomString(number, number)', function() {
    const script = `<trans>rndStr = RandomString(x=-5.5, y=10)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('ReadArrayString(array, bool)', function() {
    const script = `<trans>arr = ReadArrayString(x={}, y=true)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("array");
    expect(result.vars[2].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(false);
    expect(result.diagnostics[1].error).toStrictEqual(true);
  });

  test('RecordCount()', function() {
    const script = `<trans>rowCnt = RecordCount()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('ReRunOperation(bool)', async function() {
    const script = `<trans>queued = ReRunOperation(sync=false)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('RunOperation(string, number)', async function() {
    const script = `<trans>queued = RunOperation(op="operation id", sync=0)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('RunPlugin(string)', async function() {
    const script = `<trans>success = RunPlugin(plugin="some plugin id")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('RunScript(string, global, string)', async function() {
    const script = `<trans>scriptArg="do stuff"; result=RunScript(script="some script id", $globalArg, scriptArg)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("null");
    expect(result.vars[4].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  describe('Set()', function() {
    test('Set(string, dictionary, bool, bool, number)', function() {
      const script = `<trans>result = Set(name="someVar", value=Dict(), idx1=false, idx2=1)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("dictionary");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("dictionary");
      expect(result.vars[3].type).toStrictEqual("bool");
      expect(result.vars[4].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(false);
    });

    test('Set(array, dictionary, number)', function() {
      const script = `<trans>result = Set(name={}, value=Dict(), idx1=1)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("dictionary");
      expect(result.vars[1].type).toStrictEqual("array");
      expect(result.vars[2].type).toStrictEqual("dictionary");
      expect(result.vars[3].type).toStrictEqual("number");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  });

  test('SetChunkDataElement()', function() {
    const script = `<trans>result = SetChunkDataElement(name="chunk DE name", value=Now())</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("date");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("date");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('Sleep(string)', async function() {
    const script = `<trans>void = Sleep(seconds="1")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('SourceInstanceCount()', function() {
    const script = `<trans>cnt = SourceInstanceCount()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('TargetInstanceCount()', function() {
    const script = `<trans>cnt = TargetInstanceCount()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('WaitForOperation(string, number, number)', async function() {
    const script = `<trans>void = WaitForOperation(op="operationId", timeout=15, interval=5)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
