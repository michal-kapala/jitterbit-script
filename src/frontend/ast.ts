// -----------------------------------------------------------
// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

import { Token } from "./types";

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
 * Statements do not result in a value at runtime.
 They contain one or more expressions internally */
export interface Stmt {
  kind: NodeType;
}

/**
 * Defines a block which contains many statements.
 * -  Only one program will be contained in a file.
 */
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

/**  Expressions result in a value at runtime unlike statements.*/
export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assignee: Expr;
  value: Expr;
  operator: Token;
}

/**
 * Expressions with LHS/RHS operands and a binary operator.
 */
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string; // needs to be of type BinaryOperator
}

export interface CallExpr extends Expr {
  kind: "CallExpr";
  args: Expr[];
  caller: Identifier;
}

export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;
  key: Expr;
  computed: boolean;
}

// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * Represents a user-defined variable or symbol in source.
 */
export interface Identifier extends Expr {
  kind: "Identifier" | "GlobalIdentifier";
  symbol: string;
}

export interface GlobalIdentifier extends Identifier {
  kind: "GlobalIdentifier";
  // project variables are currently unsupported as they require project-scoped knowledge
  type: "global" | "project" | "system";
}

/**
 * Represents a numeric constant inside the soure code.
 */
export interface NumericLiteral extends Expr {
  // to be extended with IntLiteral and FloatLiteral
  kind: "NumericLiteral";
  value: number;
}

/**
 * Represents an integer number literal.
 */
export interface IntegerLiteral extends NumericLiteral {}

/**
 * Represents a floating point number literal.
 */
export interface FloatLiteral extends NumericLiteral {}

export interface ArrayLiteral extends Expr {
  kind: "ArrayLiteral";
  members: Expr[];
}

export interface StringLiteral extends Expr {
  kind: "StringLiteral"
  value: string
}

export interface BooleanLiteral extends Expr {
  kind: "BooleanLiteral",
  value: boolean
}

export interface UnaryExpr extends Expr {
  kind: "UnaryExpr",
  value: Expr,
  operator: string,
  lhs: boolean
}
