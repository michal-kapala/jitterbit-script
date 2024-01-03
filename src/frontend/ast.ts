import { evaluate } from "../runtime/interpreter";
import Scope from "../runtime/scope";
import { RuntimeVal } from "../runtime/values";
import { Token } from "./types";
import { Api } from "../api";
import {
  Array,
  Dictionary,
  JbBool,
  JbNull,
  JbNumber,
  JbString
} from "../runtime/types";
import { DeferrableFunc } from "../api/types";

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
 * A program is a but a list of statements.
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
  execute(scope: Scope): RuntimeVal {
    let lastEvaluated: RuntimeVal = new JbNull();
    try {
      for (const statement of this.body)
        lastEvaluated = evaluate(statement, scope);
    }
    catch(e) {
      // TODO: this should be added as an error
      console.error(`InterpreterError: ${e}\nLast evaluated expression:\n`, lastEvaluated);
    }
    return lastEvaluated;
  }
}

/**
 * Expressions return a runtime value.
 * */
export interface Expr extends Stmt {
  /**
   * Evaluates the expression at runtime.
   * @param scope 
   */
  eval(scope: Scope): RuntimeVal;
}

/**
 * Assignment expressions (`=`, `-=`, `+=`).
 */
export class AssignmentExpr implements Expr {
  kind: "AssignmentExpr";
  assignee: Expr;
  value: Expr;
  operator: Token;

  constructor(assignee: Expr, value: Expr, operator: Token) {
    this.kind = "AssignmentExpr";
    this.assignee = assignee;
    this.value = value;
    this.operator = operator;
  }

  eval(scope: Scope) {
    switch (this.assignee.kind) {
      case "Identifier":
      case "GlobalIdentifier":
        const varName = (this.assignee as Identifier).symbol;
        return scope.assignVar(varName, evaluate(this.value, scope), this.operator.value);
      case "MemberExpr":
        return (this.assignee as MemberExpr).evalAssignment(this, scope);
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

  constructor(left: Expr, right: Expr, operator: string) {
    this.kind = "BinaryExpr";
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  eval(scope: Scope): RuntimeVal {
    const lhs = evaluate(this.left, scope);
    const rhs = evaluate(this.right, scope);

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
      return (lhs as Array).binopArray(this.operator, rhs as Array);

    // array-number
    if (lhs.type === "array" && rhs.type === "number")
      return (lhs as Array).binopNumber(this.operator, rhs as JbNumber);

    if (lhs.type === "number" && rhs.type === "array")
      return (lhs as JbNumber).binopArray(this.operator, rhs as Array);

    // array-bool
    if(lhs.type === "array" && rhs.type === "bool")
      return (lhs as Array).binopBool(this.operator, rhs as JbBool);

    if (lhs.type === "bool" && rhs.type === "array")
      return (lhs as JbBool).binopArray(this.operator, rhs as Array);

    // array-string
    if(lhs.type === "array" && rhs.type === "string")
      return (lhs as Array).binopString(this.operator, rhs as JbString);

    if (lhs.type === "string" && rhs.type === "array")
      return (lhs as JbString).binopArray(this.operator, rhs as Array);

    // array-null
    if(lhs.type === "array" && rhs.type === "null")
      return (lhs as Array).binopNull(this.operator, rhs as JbNull);

    if (lhs.type === "null" && rhs.type === "array")
      return (lhs as JbNull).binopArray(this.operator, rhs as Array);

    // array-dict
    if(lhs.type === "array" && rhs.type === "dictionary")
      return (lhs as Array).binopDict(this.operator, rhs as Dictionary);

    if (lhs.type === "dictionary" && rhs.type === "array")
      return (lhs as Dictionary).binopArray(this.operator, rhs as Array);

    // dicts

    // dict-dict
    if (lhs.type === "dictionary" && rhs.type === "dictionary")
      return (lhs as Dictionary).binopDict(this.operator, rhs as Dictionary);

    // dict-number
    if (lhs.type === "dictionary" && rhs.type === "number")
      return (lhs as Dictionary).binopNumber(this.operator, rhs as JbNumber);

    if (lhs.type === "number" && rhs.type === "dictionary")
      return (lhs as JbNumber).binopDict(this.operator, rhs as Dictionary);

    // dict-bool
    if (lhs.type === "dictionary" && rhs.type === "bool")
      return (lhs as Dictionary).binopBool(this.operator, rhs as JbBool);

    if (lhs.type === "bool" && rhs.type === "dictionary")
      return (lhs as JbBool).binopDict(this.operator, rhs as Dictionary);

    // dict-string
    if (lhs.type === "dictionary" && rhs.type === "string")
      return (lhs as Dictionary).binopString(this.operator, rhs as JbString);

    if (lhs.type === "string" && rhs.type === "dictionary")
      return (lhs as JbString).binopDict(this.operator, rhs as Dictionary);

    // dict-null
    if (lhs.type === "dictionary" && rhs.type === "null")
      return (lhs as Dictionary).binopNull(this.operator, rhs as JbNull);

    if (lhs.type === "null" && rhs.type === "dictionary")
      return (lhs as JbNull).binopDict(this.operator, rhs as Dictionary);

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

  constructor(args: Expr[], caller: Identifier) {
    this.kind = "CallExpr";
    this.args = args;
    this.caller = caller;
  }

  eval(scope: Scope): RuntimeVal {
    const func = Api.getFunc(this.caller.symbol);

    // this is for type safety only, the error is thrown by parser
    if(func === undefined)
      throw `Function ${this.caller.symbol} does not exist, refer to Jitterbit function API docs`;

    // deferred argument list evaluation functions (logical/general modules)
    if((func as DeferrableFunc).callEval !== undefined) {
      try {
        return (func as DeferrableFunc).callEval(this.args, scope);
      } catch(e) {
        // TODO: add an error
        console.error(`${e}`);
        return new JbNull();
      }
    }

    const args = this.evalArgs(this.args, scope);
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
  private evalArgs(args: Expr[], scope: Scope) {
    const result: RuntimeVal[] = [];
    for(const expr of args)
      result.push(evaluate(expr, scope));
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

  constructor(object: Expr, key: Expr, computed = true) {
    this.kind = "MemberExpr";
    this.object = object;
    this.key = key;
    this.computed = computed;
  }

  eval(scope: Scope) {
    const key = evaluate(this.key, scope);

    switch(this.object.kind) {
      // {1,2,3}[1]
      case "ArrayLiteral":
        const arr = evaluate(this.object as ArrayLiteral, scope) as Array;
        return arr.get(key);
      // a[1], $a[1]
      case "Identifier":
      case "GlobalIdentifier":
        const name = (this.object as Identifier).symbol;
        const val = scope.lookupVar(name);
        // check the value type
        switch (val.type) {
          case "array":
            return (val as Array).get(key);
          case "dictionary":
            return (val as Dictionary).get(key);
          default:
            throw `[] operator applied to a ${this.object.kind} data element of unsupported type: ${val.type}`;
        }
      // a[1][1]
      case "MemberExpr":
        const left = evaluate(this.object, scope);
        switch(left.type) {
          case "array":
            return (left as Array).get(key);
          case "dictionary":
            return (left as Dictionary).get(key);
          default:
            throw `[] operator applied to a ${this.object.kind} data element of unsupported type: ${left.type}`;
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
  evalAssignment(assignment: AssignmentExpr, scope: Scope) {
    const kind = this.object.kind;
    // only identifiers allowed
    if(kind !== "Identifier" && kind !== "GlobalIdentifier" && kind !== "MemberExpr")
      throw `Invalid LHS inside assignment expr ${JSON.stringify(assignment.assignee)}; must be a local or global data element identifier or member expression`;

    // for a[1][2] expr, this evaluates a[1]
    const lhs = evaluate(this.object, scope);

    switch (lhs.type) {
      case "array":
        const index = Array.keyValueToNumber(evaluate(this.key, scope));
        let rhs = Array.checkIndex(index)
          ? evaluate(assignment.value, scope)
          : new JbNull();
        const newValue = Scope.assign(
          evaluate(this, scope),
          rhs,
          assignment.operator.value
        );
        // setMember appends null values if index is out of bounds
        return  (lhs as Array).set(index, newValue);
      case "dictionary":
        const key = evaluate(this.key, scope);
        const newVal = Scope.assign(
          evaluate(this, scope),
          evaluate(assignment.value, scope),
          assignment.operator.value
        );
        return (lhs as Dictionary).set(key, newVal);
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

  constructor(s: string) {
    this.kind = "Identifier";
    this.symbol = s;
  }

  eval(scope: Scope) {
    const val = scope.lookupVar(this.symbol);
    return val;;
  }
}

/**
 * Jitterbit global, project or system variable identifier that lives in the global scope.
 */
export class GlobalIdentifier extends Identifier {
  kind: "GlobalIdentifier";
  // project variables are currently unsupported as they require project-scoped knowledge
  type: "global" | "project" | "system";

  constructor(s: string, type: "global" | "project" | "system") {
    super(s);
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

  constructor(n = 0) {
    this.kind = "NumericLiteral";
    this.value = n;
  }

  eval(scope: Scope): RuntimeVal {
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

  constructor(m: Expr[] = []) {
    this.kind = "ArrayLiteral";
    this.members = m;
  }

  eval(scope: Scope): RuntimeVal {
    let members: RuntimeVal[] = [];
    for (let elem of this.members)
      members.push(evaluate(elem, scope));

    return new Array(members);
  }
}

/**
 * Strings.
 */
export class StringLiteral implements Expr {
  kind: "StringLiteral";
  value: string;

  constructor(str = "") {
    this.kind = "StringLiteral";
    this.value = str;
  }

  eval(scope: Scope): RuntimeVal {
    return new JbString(this.value);
  }
}

/**
 * `true`/`false`.
 */
export class BooleanLiteral implements Expr { 
  kind: "BooleanLiteral";
  value: boolean;

  constructor(value: boolean) {
    this.kind = "BooleanLiteral";
    this.value = value;
  }

  eval(scope: Scope): RuntimeVal {
    return new JbBool(this.value);
  }
}

/**
 * Unary operator expressions.
 */
export class UnaryExpr implements Expr {
  kind: "UnaryExpr";
  value: Expr;
  operator: string;
  lhs: boolean;

  constructor(value: Expr, operator: string, lhs: boolean) {
    this.kind = "UnaryExpr";
    this.value = value;
    this.operator = operator;
    this.lhs = lhs;
  }

  eval(scope: Scope): RuntimeVal {
    const operand = evaluate(this.value, scope);
    switch(this.operator) {
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
