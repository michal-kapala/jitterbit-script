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
  BoolType,
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
      case "binary":
      case "bool":
        resultType = BoolType.binop(this.operator, rhs.type as ValueType);
        break;
      case "date":
      case "dictionary":
      case "node":
      case "void":
      case "null":
      case "number":
        resultType = NumberType.binop(this.operator, rhs.type as ValueType);
        break;
      case "string":
        resultType = StringType.binop(this.operator, rhs.type as ValueType);
      case "type":
        // TODO: could be unified with "unknown" in future
        return resultType;
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
    throw new TcError("Method not implemented.");
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
    throw new TcError("Method not implemented.");
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
    throw new TcError("Method not implemented.");
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
    throw new TcError("Method not implemented.");
  }
}
