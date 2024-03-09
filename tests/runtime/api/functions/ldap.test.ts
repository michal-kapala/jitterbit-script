import { Api } from "../../../../src/api";
import { AsyncFunc } from "../../../../src/api/types";
import { UnimplementedError } from "../../../../src/errors";
import Scope from "../../../../src/runtime/scope";
import { JbArray, JbNumber, JbString } from "../../../../src/runtime/types";

describe('LDAP functions', function() {
  test('ArrayToMultipleValues()', function() {
    const func = Api.getFunc("ArrayToMultipleValues");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call(
        [new JbArray([new JbString("ldapy thing"), new JbString("another ldapy thing")])],
        new Scope()
      )
    }).toThrow(UnimplementedError);
  });

  test('LDAPAdd()', async function() {
    const func = Api.getFunc("LDAPAdd");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync(
        [new JbString("ldapType"), new JbString("ldapValue")],
        new Scope()
      )
    }).rejects.toThrow(UnimplementedError);
  });
  
  test('LDAPConnect()', async function() {
    const func = Api.getFunc("LDAPConnect");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync(
        [new JbString("hostname"), new JbString("user"), new JbString("password")],
        new Scope()
      )
    }).rejects.toThrow(UnimplementedError);
  });

  test('LDAPDeleteEntry()', async function() {
    const func = Api.getFunc("LDAPDeleteEntry");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("distinguishedName")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('LDAPExecute()', async function() {
    const func = Api.getFunc("LDAPExecute");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync([new JbString("distinguishedName")], new Scope())
    }).rejects.toThrow(UnimplementedError);
  });

  test('LDAPRemove()', async function() {
    const func = Api.getFunc("LDAPRemove");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync(
        [new JbString("ldapType"), new JbString("ldapValue")],
        new Scope()
      )
    }).rejects.toThrow(UnimplementedError);
  });

  test('LDAPRename()', async function() {
    const func = Api.getFunc("LDAPRename");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync(
        [new JbString("distinguishedName"), new JbString("newRDN")],
        new Scope()
      )
    }).rejects.toThrow(UnimplementedError);
  });

  test('LDAPReplace()', async function() {
    const func = Api.getFunc("LDAPReplace");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync(
        [new JbString("ldapType"), new JbString("ldapValue")],
        new Scope()
      )
    }).rejects.toThrow(UnimplementedError);
  });

  test('LDAPSearch()', async function() {
    const func = Api.getFunc("LDAPSearch");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    await expect(async function() {
      await (func as AsyncFunc)?.callAsync(
        [
          new JbString("path"),
          new JbString("filter"),
          new JbNumber(0),
          new JbString("attribute1")
        ],
        new Scope()
      )
    }).rejects.toThrow(UnimplementedError);
  });
});
