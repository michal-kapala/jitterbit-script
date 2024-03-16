import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Database functions', function() {
  test('CacheLookup(string, string)', function() {
    const script = `<trans>cached = CacheLookup(db = "some db", sql = "select * from users")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('CallStoredProcedure(string, string, array, date)', function() {
    const script = `<trans>
spRes = CallStoredProcedure(
  db = "some db",
  sp = "stored proc",
  {},
  ioVar = Now()
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("type");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("date");
    expect(result.diagnostics.length).toStrictEqual(2);
    expect(result.diagnostics[0].error).toStrictEqual(false);
    expect(result.diagnostics[1].error).toStrictEqual(false);
  });

  test('DBCloseConnection(string)', function() {
    const script = `<trans>void = DBCloseConnection(db = "some db")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  describe('DBExecute()', function() {
    test('DBExecute(string, string)', function() {
      const script = `<trans>rows = DBExecute(db = "some db", sql = "select * from users")</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("array");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.diagnostics.length).toStrictEqual(0);
    });
  
    test('DBExecute(string, string, unassigned)', function() {
      const script = `<trans>rows = DBExecute(db = "some db", sql = "drop table users", outVar)</trans>`;
      const result = typecheck(script);
      expect(result.vars[0].type).toStrictEqual("number");
      expect(result.vars[1].type).toStrictEqual("string");
      expect(result.vars[2].type).toStrictEqual("string");
      expect(result.vars[3].type).toStrictEqual("error");
      expect(result.diagnostics.length).toStrictEqual(1);
      expect(result.diagnostics[0].error).toStrictEqual(true);
    });
  });
  
  test('DBLoad()', function() {
    const script = `<trans>
void = DBLoad(
  src = "some src",
  target = "some target",
  mode = 1,
  tablename = "some_table",
  columns = "a,b,c",
  keys = "a,b",
  lines = 1.,
  dateFrmt = "YYYY-DD-MM",
  timeFrmt = "YYYY-DD-MM HH:MM:SS.mmm"
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.vars[4].type).toStrictEqual("string");
    expect(result.vars[5].type).toStrictEqual("string");
    expect(result.vars[6].type).toStrictEqual("string");
    expect(result.vars[7].type).toStrictEqual("number");
    expect(result.vars[8].type).toStrictEqual("string");
    expect(result.vars[9].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DBLookup(string, string)', function() {
    const script = `<trans>rows = DBLookup(db = "some db", sql = "select * from users where id='1'")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DBLookupAll()', function() {
    const script = `<trans>rows = DBLookupAll(db = "some db", sql = "select * from users")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("array");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DBRollbackTransaction()', function() {
    const script = `<trans>void = DBRollbackTransaction(db = "some db")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('DBWrite()', function() {
    const script = `<trans>
void = DBWrite(
  src = "some src",
  target = "some target",
  mode = 1,
  table = "some_table",
  columns = "a,b,c",
  keys = "a,b",
  lines = 1.,
  dateFrmt = "YYYY-DD-MM",
  timeFrmt = "YYYY-DD-MM HH:MM:SS.mmm"
)
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("number");
    expect(result.vars[4].type).toStrictEqual("string");
    expect(result.vars[5].type).toStrictEqual("string");
    expect(result.vars[6].type).toStrictEqual("string");
    expect(result.vars[7].type).toStrictEqual("number");
    expect(result.vars[8].type).toStrictEqual("string");
    expect(result.vars[9].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SetDBInsert()', function() {
    const script = `<trans>void = SetDBInsert()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SetDBUpdate()', function() {
    const script = `<trans>void = SetDBUpdate()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SQLEscape(string, dictionary)', function() {
    const script = `<trans>escaped = SQLEscape(sql = "select * from users where name like 'dbo.%'", Dict())</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('Unmap()', function() {
    const script = `<trans>void = Unmap()</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("void");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
