import { Api } from "../../../src/api";
import { UnimplementedError } from "../../../src/errors";
import Scope from "../../../src/runtime/scope";
import { JbBool, JbNumber, JbString } from "../../../src/runtime/types";

describe('Database functions', function() {
  test('CacheLookup()', function() {
    const func = Api.getFunc("CacheLookup");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("databaseId"), new JbString("--select * from users")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('CallStoredProcedure()', function() {
    const func = Api.getFunc("CallStoredProcedure");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("databaseId"),
        new JbString("spName"),
        new JbString("resultSet")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('DBCloseConnection()', function() {
    const func = Api.getFunc("DBCloseConnection");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("databaseId")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('DBExecute()', function() {
    const func = Api.getFunc("DBExecute");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([new JbString("databaseId"), new JbString("--select * from users")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('DBLoad()', function() {
    const func = Api.getFunc("DBLoad");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("source"),
        new JbString("target"),
        new JbNumber(1),
        new JbString("tablename"),
        new JbString("columnNames"),
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('DBLookup()', function() {
    const func = Api.getFunc("DBLookup");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("databaseId"),
        new JbString("--select * from users")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('DBLookupAll()', function() {
    const func = Api.getFunc("DBLookupAll");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("databaseId"),
        new JbString("--select * from users")
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('DBRollbackTransaction()', function() {
    const func = Api.getFunc("DBRollbackTransaction");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([new JbString("databaseId")], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('DBWrite()', function() {
    const func = Api.getFunc("DBWrite");
    expect(func).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("source"),
        new JbString("target"),
        new JbNumber(1),
        new JbString("tablename"),
        new JbString("columnNames"),
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SetDBInsert()', function() {
    const func = Api.getFunc("SetDBInsert");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SetDBUpdate()', function() {
    const func = Api.getFunc("SetDBUpdate");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('SQLEscape()', function() {
    const func = Api.getFunc("SQLEscape");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([
        new JbString("--select * from users where id = '1'"),
        new JbBool(false)
      ], new Scope())
    }).toThrow(UnimplementedError);
  });

  test('Unmap()', function() {
    const func = Api.getFunc("Unmap");
    expect(func).toBeDefined();
    expect(func?.signature).toBeDefined();
    expect(function() {
      func?.call([], new Scope())
    }).toThrow(UnimplementedError);
  });
});
