import { 
  ArrayLiteral,
  BooleanLiteral,
  NumericLiteral,
  StringLiteral
} from "../frontend/ast";
import { Position } from "../frontend/types";
import { ValueType } from "../runtime/values";
import TypeEnv from "./environment";

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

  constructor(expr: ArrayLiteral, error?: string, warning?: string) {
    super();
    this.error = error;
    this.warning = warning;
    this.start = expr.start;
    this.end = expr.end;
    this.type = "array";
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
