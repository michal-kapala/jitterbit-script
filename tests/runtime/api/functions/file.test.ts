import Api from "../../../../src/api";
import { AsyncFunc } from "../../../../src/api/types";
import { UnimplementedError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbString } from "../../../../src/runtime/types";

describe('File functions', function() {
  test('ArchiveFile', async function() {
    const func = Api.getFunc("ArchiveFile");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("sourceId"),
        new JbString("targetId")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('DeleteFile', async function() {
    const func = Api.getFunc("DeleteFile");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("sourceId")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('DeleteFiles', async function() {
    const func = Api.getFunc("DeleteFiles");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("sourceId")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('DirList', function() {
    const func = Api.getFunc("DirList");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("sourceId")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('FileList', function() {
    const func = Api.getFunc("FileList");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("sourceId")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('FlushAllFiles', async function() {
    const func = Api.getFunc("FlushAllFiles");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('FlushFile', async function() {
    const func = Api.getFunc("FlushFile");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("targetId")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('ReadFile', async function() {
    const func = Api.getFunc("ReadFile");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("sourceId")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('WriteFile', async function() {
    const func = Api.getFunc("WriteFile");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
        new JbString("targetId"),
        new JbString("fileContents")
      ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });
});
