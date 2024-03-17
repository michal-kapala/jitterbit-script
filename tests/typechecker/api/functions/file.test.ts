import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('File functions', function() {
  test('ArchiveFile(string, date, number)', async function() {
    const script = `<trans>void = ArchiveFile(src="srcId", target=Now(), delSrc=1)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("date");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(true);
    expect(result.diagnostics[1].error).toStrictEqual(false);
  });

  test('DeleteFile(string, number)', async function() {
    const script = `<trans>deleted = DeleteFile(src="srcId", filter=1)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('DeleteFiles(string, number)', async function() {
    const script = `<trans>deleted = DeleteFiles(src="srcId", filter=1)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("number");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('DirList(string, string, number)', function() {
    const script = `<trans>dirs = DirList(src="srcId", path="some path", filter=1)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('FileList(string, string, number)', function() {
    const script = `<trans>files = FileList(src="srcId", path="some path", filter=1)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('FlushAllFiles(string)', async function() {
    const script = `<trans>void = FlushAllFiles(target="targetId")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('FlushFile(string, string)', async function() {
    const script = `<trans>void = FlushFile(target="targetId", name="cache.tmp")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('ReadFile(string, string)', async function() {
    const script = `<trans>file = ReadFile(src="srcId", filter="cache.tmp")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('WriteFile(string, bool, string)', async function() {
    const script = `<trans>void = WriteFile(target="targetId", content=true, filename="cache.tmp")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("bool");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });
});
