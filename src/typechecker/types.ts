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
  NumericLiteral,
  StringLiteral,
  UnaryExpr
} from "../frontend/ast";
import { Position, Token } from "../frontend/types";
import { ValueType } from "../runtime/values";
import TypeEnv from "./environment";
import Typechecker from "./typechecker";

/**
 * Static type information of an expression.
 */
export interface TypeInfo {
  type: StaticType;
  error?: string;
  warning?: string;
}

/**
 * Union type, allows for ambiguous expressions such as polymorphic function calls and error recovery.
 * 
 * Only accepts runtime types.
 */
export interface UnionType {
  union: ValueType[];
};

/**
 * Static analysis-time types.
 */
export type StaticType = ValueType | "error" | "unassigned" | UnionType;

/**
 * Statically-typed expression.
 */
export abstract class TypedExpr implements TypeInfo {
  type!: StaticType;
  start!: Position;
  end!: Position;
  error?: string | undefined;
  warning?: string | undefined;

  public abstract checkType(env: TypeEnv): StaticType;
}

/**
 * Array literal expression with type information.
 */
export class TypedArrayLiteral extends TypedExpr {
  type: "array";
  members: TypedExpr[];

  constructor(expr: ArrayLiteral, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "array";
    this.members = [];
    for(const mem of expr.members)
      this.members.push(Typechecker.convertExpr(mem));
  }

  public checkType(env: TypeEnv) {
    return this.type;
  }
}

/**
 * Bool literal expression with type information.
 */
export class TypedBoolLiteral extends TypedExpr {
  type: "bool";

  constructor(expr: BooleanLiteral, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "bool";
  }

  public checkType(env: TypeEnv) {
    return this.type;
  }
}

/**
 * String literal expression with type information.
 */
export class TypedStringLiteral extends TypedExpr {
  type: "string";

  constructor(expr: StringLiteral, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "string";
  }

  public checkType(env: TypeEnv) {
    return this.type;
  }
}

/**
 * Numeric literal expression with type information.
 */
export class TypedNumericLiteral extends TypedExpr {
  type: "number";

  constructor(expr: NumericLiteral, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "number";
  }

  public checkType(env: TypeEnv) {
    return this.type;
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
  assignee: TypedExpr;
  operator: Token;
  value: TypedExpr;

  constructor(expr: AssignmentExpr, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.assignee = Typechecker.convertExpr(expr.assignee);
    this.operator = expr.operator;
    this.value = Typechecker.convertExpr(expr.value);
  }

  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Method not implemented.");
  }
}

/**
 * Binary expression with type information.
 */
export class TypedBinaryExpr extends TypedExpr {
  left: TypedExpr;
  operator: string;
  right: TypedExpr;

  constructor(expr: BinaryExpr, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.left = Typechecker.convertExpr(expr.left);
    this.operator = expr.operator;
    this.right = Typechecker.convertExpr(expr.right);
  }
  
  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Method not implemented.");
  }
}

/**
 * Block expression with type information.
 */
export class TypedBlockExpr extends TypedExpr {
  body: TypedExpr[];

  constructor(expr: BlockExpr, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.body = [];
    for(const ex of expr.body)
      this.body.push(Typechecker.convertExpr(ex));
  }
  
  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Method not implemented.");
  }
}

/**
 * Call expression with type information.
 */
export class TypedCall extends TypedExpr {
  caller: TypedFunctionIdentifier;
  args: TypedExpr[];

  constructor(expr: CallExpr, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.caller = Typechecker.convertExpr(expr.caller) as TypedFunctionIdentifier;
    this.args = [];
    for(const arg of expr.args)
      this.args.push(Typechecker.convertExpr(arg));
  }

  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Method not implemented.");
  }
}

/**
 * Member expression with type information.
 */
export class TypedMemberExpr extends TypedExpr {
  object: TypedExpr;
  key: TypedExpr;

  constructor(expr: MemberExpr, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.object = Typechecker.convertExpr(expr.object);
    this.key = Typechecker.convertExpr(expr.key);
  }

  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Method not implemented.");
  }
}

/**
 * Local variable identifier with type information.
 */
export class TypedIdentifier extends TypedExpr {
  symbol: string;

  constructor(expr: Identifier, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.symbol = expr.symbol;
  }
  
  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Method not implemented.");
  }
}

/**
 * Function identifier.
 */
export class TypedFunctionIdentifier extends TypedIdentifier {
  constructor(expr: FunctionIdentifier, error?: string, warning?: string) {
    super(expr, error, warning);
  }

  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Function identifiers cannot have a type.");
  }
}

/**
 * Global variable identifier with type information.
 */
export class TypedGlobalIdentifier extends TypedIdentifier {
  kind: GlobalVarKind;

  constructor(expr: GlobalIdentifier, error?: string, warning?: string) {
    super(expr, error, warning);
    this.kind = expr.type;
  }

  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Method not implemented.");
  }
}

/**
 * Unary expression with type information.
 */
export class TypedUnaryExpr extends TypedExpr {
  value: TypedExpr;
  operator: Token;
  lhs: boolean;

  constructor(expr: UnaryExpr, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.value = Typechecker.convertExpr(expr.value);
    this.operator = expr.operator;
    this.lhs = expr.lhs;
  }

  public checkType(env: TypeEnv): StaticType {
    throw new TcError("Method not implemented.");
  }
}
