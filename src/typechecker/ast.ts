import { Api } from "../api";
import { TcError } from "../errors";
import { 
  ArrayLiteral,
  AssignmentExpr,
  BinaryExpr,
  BlockExpr,
  BooleanLiteral,
  CallExpr,
  FunctionIdentifier,
  GlobalIdentifier,
  GlobalVarKind,
  Identifier,
  MemberExpr,
  NodeType,
  NumericLiteral,
  StringLiteral,
  UnaryExpr
} from "../frontend/ast";
import { Position, Token } from "../frontend/types";
import { ValueType } from "../runtime/values";
import TypeEnv from "./environment";
import Typechecker from "./typechecker";
import { 
  ArrayType,
  BinaryType,
  BoolType,
  DateType,
  DictionaryType,
  NullType,
  NumberType,
  StringType
} from "./types";

/**
 * Static type information of an expression.
 */
export interface TypeInfo {
  type: StaticTypeName;
  error?: string;
  warning?: string;
}

/**
 * Static analysis-time types.
 */
export type StaticTypeName = ValueType | "error" | "unassigned" | "unknown";

/**
 * Statically-typed expression.
 */
export abstract class TypedExpr implements TypeInfo {
  kind!: NodeType;
  type!: StaticTypeName;
  start!: Position;
  end!: Position;
  error?: string | undefined;
  warning?: string | undefined;

  /**
   * Assigns the runtime type of the expression.
   * @param env
   */
  public abstract typeExpr(env: TypeEnv): TypeInfo;
  /**
   * Sets the type information.
   * @param info 
   */
  public setTypeInfo(info: TypeInfo): void {
    this.type = info.type;
    this.error = info.error;
    this.warning = info.warning;
  };
}

/**
 * Array literal expression with type information.
 */
export class TypedArrayLiteral extends TypedExpr {
  kind: "ArrayLiteral";
  type: "array";
  members: TypedExpr[];

  constructor(expr: ArrayLiteral, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "array";
    this.members = [];
    for(const mem of expr.members)
      this.members.push(Typechecker.convertExpr(mem));
  }

  public typeExpr(env: TypeEnv) {
    return {type: this.type} as TypeInfo;
  }
}

/**
 * Bool literal expression with type information.
 */
export class TypedBoolLiteral extends TypedExpr {
  kind: "BooleanLiteral"
  type: "bool";

  constructor(expr: BooleanLiteral, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "bool";
  }

  public typeExpr(env: TypeEnv) {
    return {type: this.type} as TypeInfo;
  }
}

/**
 * String literal expression with type information.
 */
export class TypedStringLiteral extends TypedExpr {
  kind: "StringLiteral";
  type: "string";

  constructor(expr: StringLiteral, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "string";
  }

  public typeExpr(env: TypeEnv) {
    return {type: this.type} as TypeInfo;
  }
}

/**
 * Numeric literal expression with type information.
 */
export class TypedNumericLiteral extends TypedExpr {
  kind: "NumericLiteral";
  type: "number";

  constructor(expr: NumericLiteral, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "number";
  }

  public typeExpr(env: TypeEnv) {
    return {type: this.type} as TypeInfo;
  }
}

/**
 * Integer literal expression with type information.
 */
export class TypedIntegerLiteral extends TypedNumericLiteral {}

/**
 * Float literal expression with type information.
 */
export class TypedFloatLiteral extends TypedNumericLiteral {}

/**
 * Assignment expression with type information.
 */
export class TypedAssignment extends TypedExpr {
  kind: "AssignmentExpr";
  assignee: TypedExpr;
  operator: Token;
  value: TypedExpr;

  constructor(expr: AssignmentExpr, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.assignee = Typechecker.convertExpr(expr.assignee);
    this.operator = expr.operator;
    this.value = Typechecker.convertExpr(expr.value);
  }

  public typeExpr(env: TypeEnv) {
    const rhs = this.value.typeExpr(env);
    if(rhs.type === "error")
      this.type = "unknown";

    if(rhs.type === "unassigned") {
      this.value.type = "error";
      this.value.error = `Local variable '${(this.value as TypedIdentifier).symbol}' hasn't been initialized.`;
      this.type = "unknown";
    }

    switch(this.assignee.kind) {
      case "ArrayLiteral":
      case "AssignmentExpr":
      case "BinaryExpr":
      case "BlockExpr":
      case "BooleanLiteral":
      case "CallExpr":
      case "FunctionIdentifier":
      case "NumericLiteral":
      case "Program":
      case "StringLiteral":
      case "UnaryExpr":
        this.assignee.type = "error";
        this.assignee.error = `Cannot assign to LHS expression: ${this.assignee.kind}.`;
        if(rhs.type !== "error" && rhs.type !== "unassigned")
          this.type = rhs.type;
        this.warning = rhs.warning;
        return rhs;
      case "GlobalIdentifier":
      case "Identifier":
        const id = this.assignee as TypedIdentifier;
        id.setTypeInfo(rhs);
        env.set(id.symbol, rhs);
        if(rhs.type !== "error" && rhs.type !== "unassigned")
          this.type = rhs.type;
        this.warning = rhs.warning;
        return rhs;
      case "MemberExpr":
        const memExpr = this.assignee as TypedMemberExpr;
        const memExprType = memExpr.typeExpr(env);
        // TODO: array/dict environments?
        if(rhs.type !== "unassigned")
          this.type = rhs.type;
        this.warning = rhs.warning;
        return rhs;
    }
  }
}

/**
 * Binary expression with type information.
 */
export class TypedBinaryExpr extends TypedExpr {
  kind: "BinaryExpr";
  left: TypedExpr;
  operator: string;
  right: TypedExpr;

  constructor(expr: BinaryExpr, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.left = Typechecker.convertExpr(expr.left);
    this.operator = expr.operator;
    this.right = Typechecker.convertExpr(expr.right);
  }
  
  public typeExpr(env: TypeEnv) {
    const rhs = this.right.typeExpr(env);
    const lhs = this.left.typeExpr(env);

    // handle static analysis types
    if(lhs.type === "error" || rhs.type === "error") {
      this.type = "unknown";
      return {type: this.type} as TypeInfo;
    }

    if(lhs.type === "unassigned") {
      this.left.type = "error";
      this.left.error = `Local variable '${(this.left as TypedIdentifier).symbol}' hasn't been initialized.`;
      this.type = "unknown";
    }

    if(rhs.type === "unassigned") {
      this.right.type = "error";
      this.right.error = `Local variable '${(this.right as TypedIdentifier).symbol}' hasn't been initialized.`;
      this.type = "unknown";
    }

    if(lhs.type === "unassigned" || rhs.type === "unassigned")
      return {type: this.type} as TypeInfo;

    if(lhs.type === "unknown" || rhs.type === "unknown")
      this.type = "unknown";

    // handle runtime types
    let resultType = {type: "unknown"} as TypeInfo;
    switch(lhs.type) {
      case "array":
        resultType = ArrayType.binop(this.operator, rhs.type as ValueType);
        break;
      case "binary":
        resultType = BinaryType.binop(this.operator, rhs.type as ValueType);
        break;
      case "bool":
        resultType = BoolType.binop(this.operator, rhs.type as ValueType);
        break;
      case "date":
        resultType = DateType.binop(this.operator, rhs.type as ValueType);
        break;
      case "dictionary":
        resultType = DictionaryType.binop(this.operator, rhs.type as ValueType);
        break;
      case "void":
      case "null":
        resultType = NullType.binop(this.operator, rhs.type as ValueType);
        break;
      case "number":
        resultType = NumberType.binop(this.operator, rhs.type as ValueType);
        break;
      case "string":
        resultType = StringType.binop(this.operator, rhs.type as ValueType);
        break;
      case "type":
        // TODO: could be unified with "unknown" in future
        return resultType;
      case "node":
      case "unknown":
        break;
      default:
        throw new TcError(`Binary expression with unsupported type: ${this.type}.`);
    }
    this.setTypeInfo(resultType);
    // reset the warning before bubbling it up
    resultType.warning = undefined;
    return resultType;
  }
}

/**
 * Block expression with type information.
 */
export class TypedBlockExpr extends TypedExpr {
  kind: "BlockExpr";
  body: TypedExpr[];

  constructor(expr: BlockExpr, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.body = [];
    for(const ex of expr.body)
      this.body.push(Typechecker.convertExpr(ex));
  }
  
  public typeExpr(env: TypeEnv): TypeInfo {
    throw new TcError("Method not implemented.");
  }
}

/**
 * Call expression with type information.
 */
export class TypedCall extends TypedExpr {
  kind: "CallExpr";
  caller: TypedFunctionIdentifier;
  args: TypedExpr[];

  constructor(expr: CallExpr, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.caller = Typechecker.convertExpr(expr.caller) as TypedFunctionIdentifier;
    this.args = [];
    for(const arg of expr.args)
      this.args.push(Typechecker.convertExpr(arg));
  }

  public typeExpr(env: TypeEnv): TypeInfo {
    const func = Api.getFunc(this.caller.symbol)
    if(func === undefined)
      throw new TcError(`Unknown function found in call expression: ${this.caller.symbol}.`);

    const callInfo = func.analyzeCall(this.args, env);
    this.setTypeInfo(callInfo);
    // reset the warning before bubbling it up
    callInfo.warning = undefined;
    return callInfo;
  }
}

/**
 * Member expression with type information.
 */
export class TypedMemberExpr extends TypedExpr {
  kind: "MemberExpr";
  object: TypedExpr;
  key: TypedExpr;

  constructor(expr: MemberExpr, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.object = Typechecker.convertExpr(expr.object);
    this.key = Typechecker.convertExpr(expr.key);
  }

  public typeExpr(env: TypeEnv): TypeInfo {
    const idInfo = this.object.typeExpr(env);
    const keyInfo = this.key.typeExpr(env);

    // handle static analysis types
    if(idInfo.type === "error" || keyInfo.type === "error") {
      this.type = "unknown";
      return {type: this.type} as TypeInfo;
    }

    if(idInfo.type === "unassigned") {
      this.object.type = "error";
      this.object.error = `Local variable '${(this.object as TypedIdentifier).symbol}' hasn't been initialized.`;
      this.type = "unknown";
    }

    if(keyInfo.type === "unassigned") {
      this.key.type = "error";
      this.key.error = `Local variable '${(this.key as TypedIdentifier).symbol}' hasn't been initialized.`;
      this.type = "unknown";
    }

    if(idInfo.type === "unassigned" || keyInfo.type === "unassigned")
      return {type: this.type} as TypeInfo;

    if(idInfo.type === "unknown" || keyInfo.type === "unknown")
      this.type = "unknown";

    // handle runtime types
    // impossible to reliably type the members as arrays and dictionaries are dynamically typed
    let resultType = {type: "unknown"} as TypeInfo;
    switch(idInfo.type) {
      case "array":
        switch(keyInfo.type) {
          case "number":
            break;
          case "bool":
            resultType.warning = `Bool array indexes are implicitly converted to 0 (false) or 1 (true).`;
            break;
          case "string":
            resultType.warning = `String array indexes are implicitly converted to 0, strings with numbers result in a null return value.`;
            break;
          case "date":
            resultType.warning = `Date array indexes are implicitly converted to a timestamp, this may result in a runtime error due to large index values.`;
            break;
          case "void":
          case "null":
            resultType.warning = `Null array indexes are implicitly converted to 0.`;
            break;
          case "array":
            this.setTypeInfo({
              type: "error",
              error: `Arrays used as array indexes result in a runtime evaluation error.`
            });
            break;
          case "dictionary":
            this.setTypeInfo({
              type: "error",
              error: `Dictionaries used as an array index result in a runtime evaluation error.`
            });
            break;
          case "binary":
            this.setTypeInfo({
              type: "error",
              error: `Binary data used as an array index results in a runtime evaluation error.`
            });
            break;
          case "node":
          case "type":
          case "unknown":
            resultType = {type: "unknown"};
            break;
        };
        break;
      case "dictionary":
        switch(keyInfo.type) {
          case "number":
            resultType.warning = `Number dictionary keys are implicitly converted to strings.`;
            break;
          case "bool":
            resultType.warning = `Bool dictionary keys are implicitly converted to "0" (false) or "1" (true).`;
            break;
          case "string":
            break;
          case "date":
            resultType.warning = `Date dictionary keys are implicitly converted to strings, respectively YYYY-MM-DD format for dates and YYYY-MM-DD HH:MM:SS(.mmm) for time.`;
            break;
          case "void":
          case "null":
            this.setTypeInfo({
              type: "error",
              error: `Null dictionary keys result in a runtime error.`
            });
            break;
          case "array":
            resultType.warning = `Arrays used as dictionary keys are implicitly converted to their string representations.`;
            break;
          case "dictionary":
            resultType.warning = `Dictionaries used as dictionary keys are implicitly converted to their string representations.`;
            break;
          case "binary":
            resultType.warning = `Binary data used as a dictionary key is implicitly converted to its hexadecimal string representation.`;
            break;
          case "node":
          case "type":
          case "unknown":
            break;
        };
        break;
      case "binary":
      case "bool":
      case "date":
      case "void":
      case "null":
      case "number":
      case "string":
        this.setTypeInfo({
          type: "error",
          error: `Operator [] cannot be applied to ${idInfo.type} values.`
        });
        return resultType;
      case "type":
        // TODO: could be unified with "unknown" in future
        return resultType;
      case "node":
      case "unknown":
        break;
      default:
        throw new TcError(`Member expression on unsupported type: ${this.type}.`);
    }
    this.setTypeInfo(resultType);
    // reset the warning before bubbling it up
    resultType.warning = undefined;
    return resultType;
  }
}

/**
 * Local variable identifier with type information.
 */
export class TypedIdentifier extends TypedExpr {
  kind: "Identifier" | "GlobalIdentifier" | "FunctionIdentifier";
  symbol: string;

  constructor(expr: Identifier, error?: string, warning?: string) {
    super();
    this.kind = "Identifier";
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.symbol = expr.symbol;
  }
  
  public typeExpr(env: TypeEnv): TypeInfo {
    return env.lookup(this.symbol) ?? {type: "unassigned"};
  }
}

/**
 * Function identifier.
 */
export class TypedFunctionIdentifier extends TypedIdentifier {
  kind: "FunctionIdentifier";

  constructor(expr: FunctionIdentifier, error?: string, warning?: string) {
    super(expr, error, warning);
    this.kind = expr.kind;
  }

  public typeExpr(env: TypeEnv): TypeInfo {
    throw new TcError(`Standalone function identifier found: ${this.symbol}.`);
  }
}

/**
 * Global variable identifier with type information.
 */
export class TypedGlobalIdentifier extends TypedIdentifier {
  kind: "GlobalIdentifier";
  globalKind: GlobalVarKind;

  constructor(expr: GlobalIdentifier, error?: string, warning?: string) {
    super(expr, error, warning);
    this.kind = expr.kind;
    this.globalKind = expr.type;
  }

  public typeExpr(env: TypeEnv): TypeInfo {
    const lookup = env.lookup(this.symbol);
    // user-assigned
    if(lookup !== undefined)
      return lookup;

    // no explicit assignment
    let info: TypeInfo;
    switch(this.globalKind) {
      case "global":
        info = {
          type: "null",
          warning: `Global variable ${this.symbol} used without an explicit assignment. Make sure it is assigned upstream of this expression by the calling script or operation chain. If this is a project variable you can ignore this warning.`
        };
        this.setTypeInfo(info);
        env.set(this.symbol, info);
        // reset the warning before bubbling it up
        info.warning = undefined;
        return info;
      case "project":
        throw new TcError(`Project variable identifiers are not supported yet.`);
      case "system":
        const sysVar = Api.getSysVar(this.symbol);
        if(sysVar === undefined)
          throw new TcError(`Undefined system variable ${this.symbol} at type inference time.`);
        let type = sysVar.dataType.toLowerCase();
        if(type === "integer")
          type = "number";
        info = {type: type as ValueType};
        this.setTypeInfo(info);
        env.set(this.symbol, info);
        return info;
    }
  }
}

/**
 * Unary expression with type information.
 */
export class TypedUnaryExpr extends TypedExpr {
  kind: "UnaryExpr";
  value: TypedExpr;
  operator: Token;
  lhs: boolean;

  constructor(expr: UnaryExpr, error?: string, warning?: string) {
    super();
    this.kind = expr.kind;
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.value = Typechecker.convertExpr(expr.value);
    this.operator = expr.operator;
    this.lhs = expr.lhs;
  }

  public typeExpr(env: TypeEnv): TypeInfo {
    const valueInfo = this.value.typeExpr(env);

    // handle static analysis types
    if(valueInfo.type === "error") {
      this.type = "unknown";
      return {type: this.type} as TypeInfo;
    }

    if(valueInfo.type === "unassigned") {
      this.value.type = "error";
      this.value.error = `Local variable '${(this.value as TypedIdentifier).symbol}' hasn't been initialized.`;
      this.type = "unknown";
    }

    if(valueInfo.type === "unassigned")
      return {type: this.type} as TypeInfo;

    if(valueInfo.type === "unknown")
      this.type = "unknown";

    // handle runtime types
    let resultType = {type: "unknown"} as TypeInfo;
    switch(this.value.type) {
      case "array":
        resultType = ArrayType.unop(this.operator.value);
        break;
      case "binary":
        resultType = BinaryType.unop(this.operator.value);
        break;
      case "bool":
        resultType = BoolType.unop(this.operator.value);
        break;
      case "date":
        resultType = DateType.unop(this.operator.value);
        break;
      case "dictionary":
        resultType = DictionaryType.unop(this.operator.value);
        break;
      case "void":
      case "null":
        resultType = NullType.unop(this.operator.value);
        break;
      case "number":
        resultType = NumberType.unop(this.operator.value);
        break;
      case "string":
        resultType = StringType.unop(this.operator.value);
        break;
      case "type":
        // TODO: could be unified with "unknown" in future
        return resultType;
      case "node":
      case "unknown":
        break;
      default:
        throw new TcError(`Unary expression with unsupported type: ${this.type}.`);
    }
    this.setTypeInfo(resultType);
    // reset the warning before bubbling it up
    resultType.warning = undefined;
    return resultType;
  }
}