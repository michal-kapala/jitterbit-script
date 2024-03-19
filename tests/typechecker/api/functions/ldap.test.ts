import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('LDAP functions', function() {
  test('ArrayToMultipleValues(array)', function() {
    const script = `<trans>xml = ArrayToMultipleValues(arr={"instance 1", "instance 2"})</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("array");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('LDAPAdd(string, string)', async function() {
    const script = `<trans>success = LDAPAdd(type="objectClass", value="user")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
  
  test('LDAPConnect(string, string, string, number, number)', async function() {
    const script = `<trans>
success = LDAPConnect(
  host="example",
  user="admin",
  pass="Admin_1234",
  mode=1,
  port=389
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("number");
    expect(result.vars[5].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('LDAPDeleteEntry(number)', async function() {
    const script = `<trans>success = LDAPDeleteEntry(name=13)</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(true);
  });

  test('LDAPExecute(string)', async function() {
    const script = `<trans>success = LDAPExecute(name="CN=wright,CN=Users,DC=company,DC=example,DC=com")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('LDAPRemove(string, string)', async function() { 
    const script = `<trans>success = LDAPRemove(type="objectClass", value="user")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('LDAPRename(string, string, string, bool)', async function() {
    const script = `<trans>
success = LDAPRename(
  name="telephoneNumber",
  new="telephoneNumberHome",
  parent="telephoneNumbers",
  delOld=true
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("bool");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('LDAPReplace()', async function() {
    const script = `<trans>success = LDAPReplace(type="objectClass", value="user")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("bool");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('LDAPSearch()', async function() {
    const script = `<trans>
result = LDAPSearch(
  path="some path here",
  filter="some filter too",
  detail=true,
  attr1="some attr",
  attr2="some other attr"
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("bool");
    expect(result.vars[4].type).toStrictEqual("string");
    expect(result.vars[5].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });
});
