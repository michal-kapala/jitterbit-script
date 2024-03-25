import Api from "../../../../src/api";
import { AsyncFunc } from "../../../../src/api/types";
import { UnimplementedError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbString } from "../../../../src/runtime/types";

describe('Email functions', function() {
  test('SendEmail()', async function() {
    const func = Api.getFunc("SendEmail");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
          new JbString("from"),
          new JbString("to"),
          new JbString("subject"),
          new JbString("message")
        ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SendEmailMessage()', async function() {
    const func = Api.getFunc("SendEmailMessage");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("msgId")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('SendSystemEmail()', async function() {
    const func = Api.getFunc("SendSystemEmail");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([
          new JbString("to"),
          new JbString("subject"),
          new JbString("message")
        ], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });
});
