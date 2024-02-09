import { evaluate } from "../runtime/interpreter";
import Scope from "../runtime/scope";
import { RuntimeVal } from "../runtime/values";
import { Position, Token } from "./types";
import { Api } from "../api";
import {
  JbArray,
  JbDictionary,
  JbBinary,
  JbBool,
  JbDate,
  JbNull,
  JbNumber,
  JbString
} from "../runtime/types";
import { AsyncFunc, DeferrableFunc } from "../api/types";
import { RuntimeError } from "../errors";

/**
 * Statement and expression types.
 */
export type NodeType =
  // STATEMENTS
  | "Program"
  // EXPRESSIONS
  | "AssignmentExpr"
  | "MemberExpr"
  | "CallExpr"
  | "BinaryExpr"
  | "UnaryExpr"
  | "BlockExpr"
  // Literals
  | "NumericLiteral"
  | "StringLiteral"
  | "BooleanLiteral"
  | "Identifier"
  | "GlobalIdentifier"
  | "ArrayLiteral";

/**
 * Statements do not return a runtime value.
 */
export interface Stmt {
  kind: NodeType;
}

/**
 * A program is but a list of statements.
 */
export class Program implements Stmt {
  kind: "Program";
  body: Stmt[];

  constructor(body: Stmt[] = []) {
    this.kind = "Program";
    this.body = body;
  }

  /**
   * Executes the script and returns the last evaluated statement.
   * @param scope 
   * @returns 
   */
  async execute(scope: Scope) {
    let lastEval: RuntimeVal = new JbNull();
    try {
      for (const statement of this.body)
        lastEval = await evaluate(statement, scope);
    }
    catch(e) {
      // TODO: this should be added as an error
      throw new RuntimeError(`${e}`)
    }
    return lastEval;
  }
}

/**
 * A list of subsequent expressions delimited by semicolons.
 * 
 * The evaluation of the last expression yields the runtime value.
 */
export class BlockExpr implements Expr {
  kind: "BlockExpr";
  body: Expr[];
  start: Position;
  end: Position;

  constructor(body: Expr[] = []) {
    this.kind = "BlockExpr";
    this.body = body;
    this.start = body[0].start;
    this.end = body[body.length-1].end;
  }

  async eval(scope: Scope) {
    let lastValue: RuntimeVal = new JbNull();
    for (const expr of this.body)
      lastValue = await evaluate(expr, scope);
    return lastValue;
  }
}

/**
 * Expressions return a runtime value.
 * */
export abstract class Expr implements Stmt {
  kind!: NodeType;
  start!: Position;
  end!: Position;
  /**
   * Evaluates the expression at runtime.
   * @param scope 
   */
  abstract eval(scope: Scope): Promise<RuntimeVal>;
}

/**
 * Assignment expressions (`=`, `-=`, `+=`).
 */
export class AssignmentExpr implements Expr {
  kind: "AssignmentExpr";
  assignee: Expr;
  value: Expr;
  operator: Token;
  start: Position;
  end: Position;

  constructor(assignee: Expr, value: Expr, operator: Token) {
    this.kind = "AssignmentExpr";
    this.assignee = assignee;
    this.value = value;
    this.operator = operator;
    this.start = assignee.start;
    this.end = value.end;
  }

  async eval(scope: Scope) {
    switch (this.assignee.kind) {
      case "Identifier":
      case "GlobalIdentifier":
        const varName = (this.assignee as Identifier).symbol;
        return scope.assignVar(varName, await evaluate(this.value, scope), this.operator.value);
      case "MemberExpr":
        return await (this.assignee as MemberExpr).evalAssignment(this, scope);
      default:
        // POD: the original error:
        // The left hand side of the assignment operator '=' must be a local or global data element, such as x=... or $x=... error occured
        throw `Invalid LHS inside assignment expr ${JSON.stringify(this.assignee)}`;
    }
  }
}

/**
 * Expressions with LHS/RHS operands and a binary operator.
 */
export class BinaryExpr implements Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  /**
   * One of `TokenType.BinaryOperator`s.
   */
  operator: string;
  start: Position;
  end: Position;

  constructor(left: Expr, right: Expr, operator: string) {
    this.kind = "BinaryExpr";
    this.left = left;
    this.right = right;
    this.operator = operator;
    this.start = left.start;
    this.end = right.end;
  }

  async eval(scope: Scope) {
    const lhs = await evaluate(this.left, scope);
    const rhs = await evaluate(this.right, scope);

    // math
    if (lhs.type === "number" && rhs.type === "number")
      return (lhs as JbNumber).binopNumber(this.operator, rhs as JbNumber);

    // string concatenation
    if (lhs.type === "string" && rhs.type === "string")
      return (lhs as JbString).binopString(this.operator, rhs as JbString);

    // booleans
    if (lhs.type === "bool" && rhs.type === "bool")
      return (lhs as JbBool).binopBool(this.operator, rhs as JbBool);

    // wild implicit conversions and unusual behaviour
    // all the functions below should always return a warning (except for null checks)

    // number-string
    if (lhs.type === "number" && rhs.type === "string")
      return (lhs as JbNumber).binopString(this.operator, rhs as JbString);
    
    if (lhs.type === "string" && rhs.type === "number")
      return (lhs as JbString).binopNumber(this.operator, rhs as JbNumber);

    // bool-string
    if (lhs.type === "bool" && rhs.type === "string")
      return (lhs as JbBool).binopString(this.operator, rhs as JbString);

    if (lhs.type === "string" && rhs.type === "bool")
      return (lhs as JbString).binopBool(this.operator, rhs as JbBool);

    // number-bool
    if (lhs.type === "bool" && rhs.type === "number")
      return (lhs as JbBool).binopNumber(this.operator, rhs as JbNumber);

    if (lhs.type === "number" && rhs.type === "bool")
      return (lhs as JbNumber).binopBool(this.operator, rhs as JbBool);

    // null interactions

    // null-null
    if (lhs.type === "null" && lhs.type === rhs.type)
      return (lhs as JbNull).binopNull(this.operator, rhs as JbNull);

    // null-string
    if (lhs.type === "null" && rhs.type === "string")
      return (lhs as JbNull).binopString(this.operator, rhs as JbString);

    if (lhs.type === "string" && rhs.type === "null")
      return (lhs as JbString).binopNull(this.operator, rhs as JbNull);

    // null-number
    if (lhs.type === "null" && rhs.type === "number") 
      return (lhs as JbNull).binopNumber(this.operator, rhs as JbNumber);

    if (lhs.type === "number" && rhs.type === "null")
      return (lhs as JbNumber).binopNull(this.operator, rhs as JbNull);

    // null-bool
    if (lhs.type === "null" && rhs.type === "bool")
      return (lhs as JbNull).binopBool(this.operator, rhs as JbBool);

    if (lhs.type === "bool" && rhs.type === "null")
      return (lhs as JbBool).binopNull(this.operator, rhs as JbNull);

    // arrays

    // array-array
    if (lhs.type === "array" && rhs.type === "array")
      return (lhs as JbArray).binopArray(this.operator, rhs as JbArray);

    // array-number
    if (lhs.type === "array" && rhs.type === "number")
      return (lhs as JbArray).binopNumber(this.operator, rhs as JbNumber);

    if (lhs.type === "number" && rhs.type === "array")
      return (lhs as JbNumber).binopArray(this.operator, rhs as JbArray);

    // array-bool
    if(lhs.type === "array" && rhs.type === "bool")
      return (lhs as JbArray).binopBool(this.operator, rhs as JbBool);

    if (lhs.type === "bool" && rhs.type === "array")
      return (lhs as JbBool).binopArray(this.operator, rhs as JbArray);

    // array-string
    if(lhs.type === "array" && rhs.type === "string")
      return (lhs as JbArray).binopString(this.operator, rhs as JbString);

    if (lhs.type === "string" && rhs.type === "array")
      return (lhs as JbString).binopArray(this.operator, rhs as JbArray);

    // array-null
    if(lhs.type === "array" && rhs.type === "null")
      return (lhs as JbArray).binopNull(this.operator, rhs as JbNull);

    if (lhs.type === "null" && rhs.type === "array")
      return (lhs as JbNull).binopArray(this.operator, rhs as JbArray);

    // array-dict
    if(lhs.type === "array" && rhs.type === "dictionary")
      return (lhs as JbArray).binopDict(this.operator, rhs as JbDictionary);

    if (lhs.type === "dictionary" && rhs.type === "array")
      return (lhs as JbDictionary).binopArray(this.operator, rhs as JbArray);

    // array-binary
    if(lhs.type === "array" && rhs.type === "binary")
      return (lhs as JbArray).binopBin(this.operator, rhs as JbBinary);

    if (lhs.type === "binary" && rhs.type === "array")
      return (lhs as JbBinary).binopArray(this.operator, rhs as JbArray);

    // array-date
    if(lhs.type === "array" && rhs.type === "date")
      return (lhs as JbArray).binopDate(this.operator, rhs as JbDate);

    if (lhs.type === "date" && rhs.type === "array")
      return (lhs as JbDate).binopArray(this.operator, rhs as JbArray);

    // dicts

    // dict-dict
    if (lhs.type === "dictionary" && rhs.type === "dictionary")
      return (lhs as JbDictionary).binopDict(this.operator, rhs as JbDictionary);

    // dict-number
    if (lhs.type === "dictionary" && rhs.type === "number")
      return (lhs as JbDictionary).binopNumber(this.operator, rhs as JbNumber);

    if (lhs.type === "number" && rhs.type === "dictionary")
      return (lhs as JbNumber).binopDict(this.operator, rhs as JbDictionary);

    // dict-bool
    if (lhs.type === "dictionary" && rhs.type === "bool")
      return (lhs as JbDictionary).binopBool(this.operator, rhs as JbBool);

    if (lhs.type === "bool" && rhs.type === "dictionary")
      return (lhs as JbBool).binopDict(this.operator, rhs as JbDictionary);

    // dict-string
    if (lhs.type === "dictionary" && rhs.type === "string")
      return (lhs as JbDictionary).binopString(this.operator, rhs as JbString);

    if (lhs.type === "string" && rhs.type === "dictionary")
      return (lhs as JbString).binopDict(this.operator, rhs as JbDictionary);

    // dict-null
    if (lhs.type === "dictionary" && rhs.type === "null")
      return (lhs as JbDictionary).binopNull(this.operator, rhs as JbNull);

    if (lhs.type === "null" && rhs.type === "dictionary")
      return (lhs as JbNull).binopDict(this.operator, rhs as JbDictionary);

    // dict-binary
    if (lhs.type === "dictionary" && rhs.type === "binary")
      return (lhs as JbDictionary).binopBin(this.operator, rhs as JbBinary);

    if (lhs.type === "binary" && rhs.type === "dictionary")
      return (lhs as JbBinary).binopDict(this.operator, rhs as JbDictionary);

    // dict-date
    if (lhs.type === "dictionary" && rhs.type === "date")
      return (lhs as JbDictionary).binopDate(this.operator, rhs as JbDate);

    if (lhs.type === "date" && rhs.type === "dictionary")
      return (lhs as JbDate).binopDict(this.operator, rhs as JbDictionary);

    // binary

    // binary-binary
    if (lhs.type === "binary" && rhs.type === "binary")
      return (lhs as JbBinary).binopBin(this.operator, rhs as JbBinary);

    // binary-number
    if (lhs.type === "binary" && rhs.type === "number")
      return (lhs as JbBinary).binopNumber(this.operator, rhs as JbNumber);

    if (lhs.type === "number" && rhs.type === "binary")
      return (lhs as JbNumber).binopBin(this.operator, rhs as JbBinary);

    // binary-bool
    if (lhs.type === "binary" && rhs.type === "bool")
      return (lhs as JbBinary).binopBool(this.operator, rhs as JbBool);

    if (lhs.type === "bool" && rhs.type === "binary")
      return (lhs as JbBool).binopBin(this.operator, rhs as JbBinary);

    // binary-string
    if (lhs.type === "binary" && rhs.type === "string")
      return (lhs as JbBinary).binopString(this.operator, rhs as JbString);

    if (lhs.type === "string" && rhs.type === "binary")
      return (lhs as JbString).binopBin(this.operator, rhs as JbBinary);

    // binary-null
    if (lhs.type === "binary" && rhs.type === "null")
      return (lhs as JbBinary).binopNull(this.operator, rhs as JbNull);

    if (lhs.type === "null" && rhs.type === "binary")
      return (lhs as JbNull).binopBin(this.operator, rhs as JbBinary);

    // binary-date
    if (lhs.type === "binary" && rhs.type === "date")
      return (lhs as JbBinary).binopDate(this.operator, rhs as JbDate);

    if (lhs.type === "date" && rhs.type === "binary")
      return (lhs as JbDate).binopBin(this.operator, rhs as JbBinary);

    // date

    // date-date
    if (lhs.type === "date" && rhs.type === "date")
      return (lhs as JbDate).binopDate(this.operator, rhs as JbDate);

    // date-number
    if (lhs.type === "date" && rhs.type === "number")
      return (lhs as JbDate).binopNumber(this.operator, rhs as JbNumber);

    if (lhs.type === "number" && rhs.type === "date")
      return (lhs as JbNumber).binopDate(this.operator, rhs as JbDate);

    // date-bool
    if (lhs.type === "date" && rhs.type === "bool")
      return (lhs as JbDate).binopBool(this.operator, rhs as JbBool);

    if (lhs.type === "bool" && rhs.type === "date")
      return (lhs as JbBool).binopDate(this.operator, rhs as JbDate);

    // date-string
    if (lhs.type === "date" && rhs.type === "string")
      return (lhs as JbDate).binopString(this.operator, rhs as JbString);

    if (lhs.type === "string" && rhs.type === "date")
      return (lhs as JbString).binopDate(this.operator, rhs as JbDate);

    // date-null
    if (lhs.type === "date" && rhs.type === "null")
      return (lhs as JbDate).binopNull(this.operator, rhs as JbNull);

    if (lhs.type === "null" && rhs.type === "date")
      return (lhs as JbNull).binopDate(this.operator, rhs as JbDate);

    // Add JB error:
    // Illegal operation, <operation name, ex. SUBTRACT> with incompatible data types: <lhs.type> <operator> <rhs.type>
    throw `Illegal operation, ${this.operator} with incompatible data types: ${lhs.type} ${this.operator} ${rhs.type}`;
  }
}

/**
 * System function call expressions.
 */
export class CallExpr implements Expr {
  kind: "CallExpr";
  args: Expr[];
  caller: Identifier;
  start: Position;
  end: Position;

  constructor(args: Expr[], caller: Identifier, end: Position) {
    this.kind = "CallExpr";
    this.args = args;
    this.caller = caller;
    this.start = caller.start;
    this.end = end;
  }

  async eval(scope: Scope) {
    const func = Api.getFunc(this.caller.symbol);

    // this is for type safety only, the error is thrown by parser
    if(func === undefined)
      throw `Function ${this.caller.symbol} does not exist, refer to Jitterbit function API docs`;

    // deferred argument list evaluation functions (logical/general modules)
    if((func as DeferrableFunc).callEval !== undefined) {
      try {
        return await (func as DeferrableFunc).callEval(this.args, scope);
      } catch(e) {
        // TODO: add an error
        console.error(`${e}`);
        return new JbNull();
      }
    }

    const args = await this.evalArgs(this.args, scope);

    // async calls
    if((func as AsyncFunc).callAsync !== undefined) {
      try {
        return await (func as AsyncFunc).callAsync(args, scope);
      } catch(e) {
        // TODO: add an error
        console.error(`${e}`);
        return new JbNull();
      }
    }
    try {
      return func.call(args, scope);
    }
    catch(e) {
      // TODO: add an error
      console.error(`${e}`);
      return new JbNull();
    }
  }

  /**
   * Evaluates the argument list.
   * @param args 
   * @param scope 
   * @returns 
   */
  private async evalArgs(args: Expr[], scope: Scope) {
    const result: RuntimeVal[] = [];
    for(const expr of args)
      result.push(await evaluate(expr, scope));
    return result;
  }
}

/**
 * Dictionary or array member access expression `x[y]`.
 */
export class MemberExpr implements Expr {
  kind: "MemberExpr";
  object: Expr;
  key: Expr;
  computed: boolean;
  start: Position;
  end: Position;

  constructor(object: Expr, key: Expr, end: Position, computed = true) {
    this.kind = "MemberExpr";
    this.object = object;
    this.key = key;
    this.computed = computed;
    this.start = object.start;
    this.end = end;
  }

  async eval(scope: Scope) {
    const key = await evaluate(this.key, scope);

    switch(this.object.kind) {
      // {1,2,3}[1]
      case "ArrayLiteral":
        const arr = await evaluate(this.object as ArrayLiteral, scope) as JbArray;
        return arr.get(key);
      case "CallExpr":
        const callResult = await evaluate(this.object as CallExpr, scope);
        switch (callResult.type) {
          case "array":
            return (callResult as JbArray).get(key);
          case "dictionary":
            return (callResult as JbDictionary).get(key);
          default:
            throw `[] operator applied to a data element of unsupported type: ${callResult.type}`;
        }
      // a[1], $a[1]
      case "Identifier":
      case "GlobalIdentifier":
        const name = (this.object as Identifier).symbol;
        const val = scope.lookupVar(name);
        // check the value type
        switch (val.type) {
          case "array":
            return (val as JbArray).get(key);
          case "dictionary":
            return (val as JbDictionary).get(key);
          default:
            throw `[] operator applied to a data element of unsupported type: ${val.type}`;
        }
      // a[1][1]
      case "MemberExpr":
        const left = await evaluate(this.object, scope);
        switch(left.type) {
          case "array":
            return (left as JbArray).get(key);
          case "dictionary":
            return (left as JbDictionary).get(key);
          default:
            throw `[] operator applied to a data element of unsupported type: ${left.type}`;
        }
      default:
        throw `[] operator applied to a ${this.object.kind} data element.\nIf in the script testing screen, try clicking 'Reset' and run again`;
    }
  }

  /**
   * Evaluates an assignment to an LHS member expression.
   * @param assignment 
   * @param scope 
   * @returns 
   */
  async evalAssignment(assignment: AssignmentExpr, scope: Scope) {
    const kind = this.object.kind;
    // only identifiers allowed
    if(kind !== "Identifier" && kind !== "GlobalIdentifier" && kind !== "MemberExpr")
      throw `Invalid LHS inside assignment expr ${JSON.stringify(assignment.assignee)}; must be a local or global data element identifier or member expression`;

    // for a[1][2] expr, this evaluates a[1]
    const lhs = await evaluate(this.object, scope);

    switch (lhs.type) {
      case "array":
        const index = JbArray.keyValueToNumber(await evaluate(this.key, scope));
        let rhs = JbArray.checkIndex(index)
          ? await evaluate(assignment.value, scope)
          : new JbNull();
        const newValue = Scope.assign(
          await evaluate(this, scope),
          assignment.operator.value,
          rhs
        );
        // set appends null values if index is out of bounds
        return  (lhs as JbArray).set(index, newValue);
      case "dictionary":
        const key = await evaluate(this.key, scope);
        const newVal = Scope.assign(
          await evaluate(this, scope),
          assignment.operator.value,
          await evaluate(assignment.value, scope)
        );
        return (lhs as JbDictionary).set(key, newVal);
      default:
        throw `[] operator applied to a ${lhs.type} data element.\nIf in the script testing screen, try clicking 'Reset' and run again`;
    }
  }
}

/**
 * Represents a user-defined variable or symbol in source.
 */
export class Identifier implements Expr {
  kind: "Identifier" | "GlobalIdentifier";
  symbol: string;
  start: Position;
  end: Position;

  constructor(token: Token) {
    this.kind = "Identifier";
    this.symbol = token.value;
    this.start = token.begin;
    this.end = token.end;
  }

  async eval(scope: Scope) {
    const val = scope.lookupVar(this.symbol);
    return val;
  }
}

/**
 * Jitterbit global, project or system variable identifier that lives in the global scope.
 */
export class GlobalIdentifier extends Identifier {
  kind: "GlobalIdentifier";
  // project variables are currently unsupported as they require project-scoped knowledge
  type: "global" | "project" | "system";

  constructor(token: Token, type: "global" | "project" | "system") {
    super(token);
    this.kind = "GlobalIdentifier";
    this.type = type;
  }
}

/**
 * Represents a numeric constant inside the soure code.
 */
export class NumericLiteral implements Expr {
  kind: "NumericLiteral";
  value: number;
  start: Position;
  end: Position;

  constructor(token: Token) {
    this.kind = "NumericLiteral";
    this.value = parseFloat(token.value);
    this.start = token.begin;
    this.end = token.end
  }

  async eval(scope: Scope) {
    return new JbNumber(this.value);
  }
}

/**
 * Represents an integer number literal.
 */
export interface IntegerLiteral extends NumericLiteral {}

/**
 * Represents a floating point number literal.
 */
export interface FloatLiteral extends NumericLiteral {}

/**
 * Initialization lists for arrays.
 */
export class ArrayLiteral implements Expr {
  kind: "ArrayLiteral";
  members: Expr[];
  start: Position;
  end: Position;

  constructor(m: Expr[] = [], start: Position, end: Position) {
    this.kind = "ArrayLiteral";
    this.members = m;
    this.start = start;
    this.end = end;
  }

  async eval(scope: Scope) {
    let members: RuntimeVal[] = [];
    for (let elem of this.members)
      members.push(await evaluate(elem, scope));

    return new JbArray(members);
  }
}

/**
 * Strings.
 */
export class StringLiteral implements Expr {
  kind: "StringLiteral";
  value: string;
  start: Position;
  end: Position;

  constructor(token: Token) {
    this.kind = "StringLiteral";
    this.value = token.value;
    this.start = token.begin;
    this.end = token.end;
  }

  async eval(scope: Scope) {
    return new JbString(this.value);
  }
}

/**
 * `true`/`false`.
 */
export class BooleanLiteral implements Expr { 
  kind: "BooleanLiteral";
  value: boolean;
  start: Position;
  end: Position;

  constructor(value: boolean, token: Token) {
    this.kind = "BooleanLiteral";
    this.value = value;
    this.start = token.begin;
    this.end = token.end;
  }

  async eval(scope: Scope) {
    return new JbBool(this.value);
  }
}

/**
 * Unary operator expressions.
 */
export class UnaryExpr implements Expr {
  kind: "UnaryExpr";
  value: Expr;
  operator: Token;
  lhs: boolean;
  start: Position;
  end: Position;

  constructor(value: Expr, operator: Token, lhs: boolean) {
    this.kind = "UnaryExpr";
    this.value = value;
    this.operator = operator;
    this.lhs = lhs;
    if(lhs) {
      this.start = operator.begin;
      this.end = value.end;
    } else {
      this.start = value.start;
      this.end = operator.end;
    }
    
  }

  async eval(scope: Scope) {
    const operand = await evaluate(this.value, scope);
    switch(this.operator.value) {
      case "!":
        if(this.lhs)
          return operand.negate();
        // POD: Jitterbit Studio supports RHS ! for ArrayLiteral (only), this is unsupported
        // POD: original error:
        // Operator ! cannot be proceeded with an operand: X
        throw `RHS unary operator ${this.operator} unsupported`;
      case "-":
        if(this.lhs)
          return operand.negative();
        // POD: the original error for a = Null()-;
        // Not enough operands for the operation: ";"
        throw `RHS unary operator ${this.operator} unsupported`;
      case "--":
        if(this.lhs) {
          // --x
          switch (this.value.kind) {
            case "Identifier":
            case "GlobalIdentifier":
            case "MemberExpr":
              return operand.decrement();
            default:
              // POD: original error:
              // Invalid argument to operator ++/--
              throw `Unsupported argument type for ${this.operator} LHS unary operator: ${this.value.kind}`;
          }
        } else {
          // x--
          switch (this.value.kind) {
            case "Identifier":
            case "GlobalIdentifier":            
              const oldValue = operand.clone();
              operand.decrement();
              return oldValue;
            case "MemberExpr":
              // post-decrementation is not supported for member expressions, e.g. b = a[4]--;
            default:
              // POD: original error:
              // Invalid argument to operator ++/--
              throw `Unsupported argument type for ${this.operator} RHS unary operator: ${this.value.kind}`;
          }
        }
      case "++":
        if(this.lhs) {
          // ++x
          switch (this.value.kind) {
            case "Identifier":
            case "GlobalIdentifier":
            case "MemberExpr":
              return operand.increment();
            default:
              // POD: original error:
              // Invalid argument to operator ++/--
              throw `Unsupported argument type for ${this.operator} LHS unary operator: ${this.value.kind}`;
          }
        } else {
          // x++
          switch (this.value.kind) {
            case "Identifier":
            case "GlobalIdentifier":            
              const oldValue = operand.clone();
              operand.increment();
              return oldValue;
            case "MemberExpr":
              // post-incrementation is not supported for member expressions, e.g. b = a[4]++;
            default:
              // POD: original error:
              // Invalid argument to operator ++/--
              throw `Unsupported argument type for ${this.operator} RHS unary operator: ${this.value.kind}`;
          }
        }
      default:
        throw `Evaluation of unary operator ${this.operator} unsupported`;
    }
  }
}
