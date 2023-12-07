import {
  AssignmentExpr,
  BinaryExpr,
  GlobalIdentifier,
  Identifier,
  ObjectLiteral,
  UnaryExpr,
} from "../../frontend/ast";
import Scope from "../scope";
import { evaluate } from "../interpreter";
import { 
  BooleanVal,
  MK_NULL,
  NullVal,
  NumberVal,
  ObjectVal,
  RuntimeVal,
  StringVal,
  jbCompareStringToBool,
  jbStringToBool,
  jbStringToNumber
} from "../values";

/**
 * Evaluates binary expressions on numeric literals.
 * @param lhs Left-hand side numeric literal.
 * @param rhs Right-hand side numeric literal.
 * @param operator Binary operator.
 * @returns 
 */
function eval_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string,
): NumberVal | BooleanVal {
  let result: number;
  switch(operator) {
    case "+":
      result = lhs.value + rhs.value;
      break;
    case "-":
      result = lhs.value - rhs.value;
      break;
    case "*":
      result = lhs.value * rhs.value;
      break;
    case "/":
      // Division by 0
      if (rhs.value == 0)
        throw "Division by 0";
      result = lhs.value / rhs.value;
      break;
    case "^":
      result = lhs.value ** rhs.value;
      break;
    case "<":
      return { type: "bool", value: lhs.value < rhs.value };
    case ">":
      return { type: "bool", value: lhs.value > rhs.value };
    case "<=":
      return { type: "bool", value: lhs.value <= rhs.value };
    case ">=":
      return { type: "bool", value: lhs.value >= rhs.value };
    case "==":
      return { type: "bool", value: lhs.value === rhs.value };
    case "!=":
      return { type: "bool", value: lhs.value !== rhs.value };
    case "&&":
    case "&":
      // 'This is always a short-circuit operator, meaning that if the left-hand argument evaluates to false, the right-hand argument is not evaluated.'
      // This executes after expression evaluation
      return { type: "bool", value: (lhs.value !== 0) && (rhs.value !== 0) };
    case "||":
    case "|":
      // 'This is always a short-circuit operator, meaning that if the left-hand argument evaluates to true, the right-hand argument is not evaluated.'
      // This executes after expression evaluation
      return { type: "bool", value: (lhs.value !== 0) || (rhs.value !== 0) };
    default:
      throw `Unsupported operator ${operator}`;
  }

  return { value: result, type: "number" };
}

/**
 * Evaluates binary expressions on string literals.
 * @param lhs Left-hand side string literal.
 * @param rhs Right-hand side string literal.
 * @param operator Binary operator.
 */
function eval_string_binary_expr(
  lhs: StringVal,
  rhs: StringVal,
  operator: string,
): StringVal | BooleanVal | NullVal {
  let result: string | boolean;
  switch (operator) {
    case "+":
      result = lhs.value + rhs.value;
      return { type: "string", value: result };
    case "-":
      throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "*":
      throw `Illegal operation, MULTIPLICATION with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "/":
      throw `Illegal operation, DIVISION with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "^":
      throw `Illegal operation, POW with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "<":
      result = lhs.value < rhs.value;
      return { type: "bool", value: result };
    case ">":
      result = lhs.value > rhs.value;
      return { type: "bool", value: result };
    case "<=":
      result = lhs.value <= rhs.value;
      return { type: "bool", value: result };
    case ">=":
      result = lhs.value >= rhs.value;
      return { type: "bool", value: result };
    case "==":
      result = lhs.value === rhs.value;
      return { type: "bool", value: result };
    case "!=":
      result = lhs.value !== rhs.value;
      return { type: "bool", value: result };
    // Logical operators are valid but the expressions like str1 || str2 always return false (unless negated)
    case "&&":
    case "&":
    case "||":
    case "|":
      return { type: "bool", value: false };
    default:
      // Add JB error:
      // Illegal operation, <operation name, ex. SUBTRACT> with incompatible data types: string <operator> string
      throw `Unsupported operator ${operator}`;
  }
}

/**
 * Evaluates binary expressions on boolean values.
 * @param lhs Left-hand side boolean literal.
 * @param rhs Right-hand side boolean literal.
 * @param operator 
 * @returns 
 */
function eval_bool_binary_expr(lhs: BooleanVal, rhs: BooleanVal, operator: string): BooleanVal {
  let result: boolean;
  switch(operator) {
    case "+":
      throw `Illegal operation, ADDITION with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "-":
      throw `Illegal operation, SUBTRACTION with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "*":
      throw `Illegal operation, MULTIPLICATION with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "/":
      throw `Illegal operation, DIVISION with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "^":
      throw `Illegal operation, POW with incompatible data types: ${lhs.type} ${operator} ${rhs.type}`;
    case "<":
    case ">":
    case "<=":
    case ">=":
      throw `Illegal operation: A boolean can only be compared to another boolean using the equals or not-equals operators. You need to convert it to a type for which the less-than operator is defined.`;
    case "==":
      result = lhs.value === rhs.value;
      break;
    case "!=":
      result = lhs.value !== rhs.value;
      break;
    case "&&":
    case "&":
      result = lhs.value && rhs.value;
      break;
    case "||":
    case "|":
      result = lhs.value || rhs.value;
      break;
    
    default:
      throw `Unsupported operator ${operator}`;
  }
  return { value: result, type: "bool" };
}

/**
 * Evaluates binary expressions on null values.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_null_binary_expr(lhs: NullVal, rhs: NullVal, operator: string): NullVal | BooleanVal {
  switch (operator) {
    case "+":
    case "-":
      return MK_NULL();
    case "*":
      throw `Illegal operation, MULTIPLICATION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "/":
      throw `Illegal operation, DIVISION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "^":
      throw `Illegal operation: ${lhs.type} POW ${rhs.type}`;
    case "<":
    case ">":
    case "<=":
    case ">=":
    case "==":
    case "&&":
    case "&":
    case "||":
    case "|":
      return { type: "bool", value: false };
    case "!=":
      // nulls are individuals
      return { type: "bool", value: true };
    default:
      throw `Unsupported operator ${operator}`;
  }
}

/**
 * Evalutates binary expressions for number-string operand types.
 * 
 * For the supported operators, the string is converted to a number depending on whether there's a parsable number in its beginning.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_numstring_binary_expr(lhs: NumberVal | StringVal, rhs: NumberVal | StringVal, operator: string): StringVal | BooleanVal {
  switch (operator) {
    case "+":
      // here it's the number gets converted for concat
      // consistency is key
      return { type: "string", value: lhs.value.toString() + rhs.value.toString() };
    case "-":
      throw `Illegal operation, SUBTRACT with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "*":
      throw `Illegal operation, MULTIPLICATION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "/":
      throw `Illegal operation, DIVISION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "^":
      throw `Illegal operation, POW with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    // 'Comparing arguments of different data types is not supported.'
    case "<":
      if(lhs.type === "number")
        return { type: "bool", value: lhs.value < jbStringToNumber(rhs as StringVal) };

      return { type: "bool", value: jbStringToNumber(lhs) < (rhs as NumberVal).value };
    case ">":
      if(lhs.type === "number")
        return { type: "bool", value: lhs.value > jbStringToNumber(rhs as StringVal) };

      return { type: "bool", value: jbStringToNumber(lhs) > (rhs as NumberVal).value };
    case "<=":
      if(lhs.type === "number")
        return { type: "bool", value: lhs.value <= jbStringToNumber(rhs as StringVal) };

      return { type: "bool", value: jbStringToNumber(lhs) <= (rhs as NumberVal).value };
    case ">=":
      if(lhs.type === "number")
        return { type: "bool", value: lhs.value >= jbStringToNumber(rhs as StringVal) };
      
      return { type: "bool", value: jbStringToNumber(lhs) >= (rhs as NumberVal).value };
    case "==":
      if(lhs.type === "number")
        return { type: "bool", value: lhs.value === jbStringToNumber(rhs as StringVal) };

      return { type: "bool", value: jbStringToNumber(lhs) === (rhs as NumberVal).value };
    case "!=":
      if(lhs.type === "number") 
        return { type: "bool", value: lhs.value !== jbStringToNumber(rhs as StringVal) };
      
      return { type: "bool", value: jbStringToNumber(lhs) !== (rhs as NumberVal).value };
    case "&&":
    case "&":
      if(lhs.type === "number") 
        return { 
          type: "bool",
          value: lhs.value !== 0 && jbStringToNumber(rhs as StringVal) !== 0
        };
      
      return {
        type: "bool",
        value: jbStringToNumber(lhs) !== 0 && (rhs as NumberVal).value !== 0
      };
    case "||":
    case "|":
      if(lhs.type === "number") 
        return { 
          type: "bool",
          value: lhs.value !== 0 || jbStringToNumber(rhs as StringVal) !== 0
        };

      return {
        type: "bool",
        value: jbStringToNumber(lhs) !== 0 || (rhs as NumberVal).value !== 0
      };
    default:
      throw `Unsupported operator ${operator}`;
  }
}

/**
 * Evalutates binary expressions for bool-string operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_boolstring_binary_expr(lhs: BooleanVal | StringVal, rhs: BooleanVal | StringVal, operator: string): StringVal | BooleanVal {
  switch (operator) {
    case "+":
      return lhs.type === "bool"
        ? { type: "string", value: (lhs.value ? "1" : "0") + (rhs as StringVal).value }
        : { type: "string", value: lhs.value + ((rhs as BooleanVal).value ? "1" : "0") };
    case "-":
      throw `Illegal operation, SUBTRACT with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "*":
      throw `Illegal operation, MULTIPLICATION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "/":
      throw `Illegal operation, DIVISION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "^":
      throw `Illegal operation, POW with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    // 'Comparing arguments of different data types is not supported.'
    // logical and comparison operators follow Jitterbit's implementation
    case "<":
      if(lhs.type === "bool")
        return { type: "bool", value: jbCompareStringToBool(rhs as StringVal, ">", lhs) };
      
      return { type: "bool", value: jbCompareStringToBool(lhs, "<", rhs as BooleanVal) };
    case ">":
      if(lhs.type === "bool")
        return { type: "bool", value: jbCompareStringToBool(rhs as StringVal, "<", lhs) };
      
      return { type: "bool", value: jbCompareStringToBool(lhs, ">", rhs as BooleanVal) };
    case "<=":
      if(lhs.type === "bool")
        return { type: "bool", value: jbCompareStringToBool(rhs as StringVal, ">=", lhs) };
      
      return { type: "bool", value: jbCompareStringToBool(lhs, "<=", rhs as BooleanVal) };
    case ">=":
      if(lhs.type === "bool")
        return { type: "bool", value: jbCompareStringToBool(rhs as StringVal, "<=", lhs) };
      
      return { type: "bool", value: jbCompareStringToBool(lhs, ">=", rhs as BooleanVal) };
    case "==":
      if(lhs.type === "bool")
        return { type: "bool", value: lhs.value === jbStringToBool(rhs as StringVal) };
      
      return { type: "bool", value: jbStringToBool(lhs) === (rhs as BooleanVal).value };
    case "!=":
      if(lhs.type === "bool")
        return { type: "bool", value: lhs.value !== jbStringToBool(rhs as StringVal) };
      
      return { type: "bool", value: jbStringToBool(lhs) !== (rhs as BooleanVal).value };
    case "&&":
    case "&":
      // bool || string
      if(lhs.type === "bool") {
        if(jbStringToBool(rhs as StringVal) && lhs.value)
          return { type: "bool", value: true };
        
        return { type: "bool", value: false };
      }
      // string || bool
      if(jbStringToBool(lhs) && (rhs as BooleanVal).value)
        return { type: "bool", value: true };
      
      return { type: "bool", value: false };
    case "||":
    case "|":
      // bool || string
      if(lhs.type === "bool") {
        if(jbStringToBool(rhs as StringVal) || lhs.value)
          return { type: "bool", value: true };
        
        return { type: "bool", value: false };
      }
      // string || bool
      if(jbStringToBool(lhs) || (rhs as BooleanVal).value)
        return { type: "bool", value: true };
      
      return { type: "bool", value: false };
    default:
      throw `Unsupported operator ${operator}`;
  }
}

/**
 * Evalutates binary expressions for number-bool operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_numbool_binary_expr(lhs: BooleanVal | NumberVal, rhs: BooleanVal | NumberVal, operator: string): StringVal | BooleanVal {
  switch (operator) {
    case "+":
      throw `Illegal operation: ${lhs.type} Add {${rhs.type}}`
    case "-":
      throw `Illegal operation, SUBTRACT with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "*":
      throw `Illegal operation, MULTIPLICATION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "/":
      throw `Illegal operation, DIVISION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "^":
      throw `Illegal operation, POW with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    // 'Comparing arguments of different data types is not supported.'
    // logical and comparison operators follow Jitterbit's implementation
    case "<":
      if(lhs.type === "bool")
        return {
          type: "bool",
          value: lhs.value 
            ? 1 < (rhs as NumberVal).value
            : 0 < (rhs as NumberVal).value
        };
      
      return { 
        type: "bool",
        value: (rhs as BooleanVal).value
          ? (lhs as NumberVal).value < 1
          : (lhs as NumberVal).value < 0
      };
    case ">":
      if(lhs.type === "bool")
        return {
          type: "bool",
          value: lhs.value 
            ? 1 > (rhs as NumberVal).value
            : 0 > (rhs as NumberVal).value
        };
      
      return {
        type: "bool",
        value: (rhs as BooleanVal).value
          ? (lhs as NumberVal).value > 1
          : (lhs as NumberVal).value > 0
      };
    case "<=":
      if(lhs.type === "bool")
        return {
          type: "bool",
          value: lhs.value 
            ? 1 <= (rhs as NumberVal).value
            : 0 <= (rhs as NumberVal).value
        };
      
      return {
        type: "bool",
        value: (rhs as BooleanVal).value
          ? (lhs as NumberVal).value <= 1
          : (lhs as NumberVal).value <= 0
      };
    case ">=":
      if(lhs.type === "bool")
        return {
          type: "bool",
          value: lhs.value 
            ? 1 >= (rhs as NumberVal).value
            : 0 >= (rhs as NumberVal).value
        };
      
      return {
        type: "bool",
        value: (rhs as BooleanVal).value
          ? (lhs as NumberVal).value >= 1
          : (lhs as NumberVal).value >= 0
      };
    case "==":
      if(lhs.type === "bool")
        return {
          type: "bool",
          value: lhs.value 
            ? 1 === (rhs as NumberVal).value
            : 0 === (rhs as NumberVal).value
        };
      
      return {
        type: "bool",
        value: (rhs as BooleanVal).value
          ? (lhs as NumberVal).value === 1
          : (lhs as NumberVal).value === 0
      };
    case "!=":
      if(lhs.type === "bool")
        return {
          type: "bool",
          value: lhs.value 
            ? 1 !== (rhs as NumberVal).value
            : 0 !== (rhs as NumberVal).value
        };
      
      return {
        type: "bool",
        value: (rhs as BooleanVal).value
          ? (lhs as NumberVal).value !== 1
          : (lhs as NumberVal).value !== 0
      };
    case "&&":
    case "&":
      if(lhs.type === "bool")
        return {
          type: "bool",
          value: lhs.value && (rhs as NumberVal).value !== 0
        };
      
      return {
        type: "bool",
        value: (lhs as NumberVal).value !== 0 && (rhs as BooleanVal).value
      };
    case "||":
    case "|":
      if(lhs.type === "bool")
        return {
          type: "bool",
          value: lhs.value || (rhs as NumberVal).value !== 0
        };
      
      return {
        type: "bool",
        value: (lhs as NumberVal).value !== 0 || (rhs as BooleanVal).value
      };
    default:
      throw `Unsupported operator ${operator}`;
  }
}

/**
 * Evalutates binary expressions for null-string operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_nullstring_binary_expr(lhs: NullVal | StringVal, rhs: NullVal | StringVal, operator: string): StringVal | BooleanVal {
  switch (operator) {
    case "+":
      return lhs.type === "null"
        ? { type: "string", value: (rhs as StringVal).value }
        : { type: "string", value: lhs.value };
    case "-":
      throw `Illegal operation, SUBTRACT with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "*":
      throw `Illegal operation, MULTIPLICATION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "/":
      throw `Illegal operation, DIVISION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "^":
      throw `Illegal operation, POW with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "<":
    case ">":
    case "<=":
    case ">=":
    case "==":
    case "&&":
    case "&":
    case "||":
    case "|":
      return { type: "bool", value: false };
    case "!=":
      return { type: "bool", value: true };
    default:
      throw `Unsupported operator ${operator}`;
  }
}

/**
 * Evalutates binary expressions for null-number operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_nullnumber_binary_expr(lhs: NullVal | NumberVal, rhs: NullVal | NumberVal, operator: string): NumberVal | BooleanVal {
  switch (operator) {
    case "+":
      return lhs.type === "null"
        ? { type: "number", value: (rhs as NumberVal).value }
        : { type: "number", value: lhs.value };
    case "-":
      if (lhs.type === "null")
        return { type: "number", value: 0 - (rhs as NumberVal).value };
      return { type: "number", value: lhs.value };
    case "*":
      return { type: "number", value: 0 };
    case "/":
      if(lhs.type === "null") {
        if((rhs as NumberVal).value === 0)
          throw `Illegal operation: division by 0`;
        return { type: "number", value: 0 };
      }
      throw `Illegal operation, division by Null`;
    case "^":
      throw `Illegal operation: ${lhs.type} POW ${rhs.type}`;
    case "<":
    case ">":
    case "<=":
    case ">=":
    case "==":
    case "&&":
    case "&":
      return { type: "bool", value: false };
    case "!=":
      return { type: "bool", value: true };
    case "||":
    case "|":
      if(lhs.type === "null")
        return { type: "bool", value: (rhs as NumberVal).value !== 0 };
      return { type: "bool", value: lhs.value !== 0 };
    default:
      throw `Unsupported operator ${operator}`;
  }
}

/**
 * Evalutates binary expressions for null-bool operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_nullbool_binary_expr(lhs: NullVal | BooleanVal, rhs: NullVal | BooleanVal, operator: string): NumberVal | BooleanVal {
  switch (operator) {
    case "+":
      return lhs.type === "null"
        ? { type: "number", value: (rhs as BooleanVal).value ? 1 : 0 }
        : { type: "number", value: lhs.value ? 1 : 0 };
    case "-":
      throw `Illegal operation, SUBTRACT with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "*":
      throw `Illegal operation, MULTIPLICATION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "/":
      throw `Illegal operation, DIVISION with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "^":
      throw `Illegal operation, POW with incompatible types: ${lhs.type} ${operator} ${rhs.type}`;
    case "<":
    case ">":
    case "<=":
    case ">=":
    case "==":
    case "&&":
    case "&":
      return { type: "bool", value: false };
    case "!=":
      return { type: "bool", value: true };
    case "||":
    case "|":
      if(lhs.type === "null")
        return { type: "bool", value: (rhs as BooleanVal).value };
      return { type: "bool", value: lhs.value };
    default:
      throw `Unsupported operator ${operator}`;
  }
}

/**
 * Evaulates expressions following the binary operation type.
 */
export function eval_binary_expr(
  binop: BinaryExpr,
  scope: Scope,
): RuntimeVal {
  const lhs = evaluate(binop.left, scope);
  const rhs = evaluate(binop.right, scope);

  // math
  if (lhs.type == "number" && rhs.type == "number") {
    return eval_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator,
    );
  }

  // string concatenation
  if (lhs.type == "string" && rhs.type == "string") {
    return eval_string_binary_expr(
      lhs as StringVal,
      rhs as StringVal,
      binop.operator,
    );
  }

  // booleans
  if (lhs.type == "bool" && rhs.type == "bool") {
    return eval_bool_binary_expr(
      lhs as BooleanVal,
      rhs as BooleanVal,
      binop.operator,
    );
  }

  // wild implicit conversions and unusual behaviour
  // all the functions below should always return a warning (except for null checks)

  // number-string
  if (
    (lhs.type == "number" && rhs.type == "string") ||
    (lhs.type == "string" && rhs.type == "number")
  ) {
    if (lhs.type === "number")
      return eval_numstring_binary_expr(
        lhs as NumberVal,
        rhs as StringVal,
        binop.operator,
      );

    return eval_numstring_binary_expr(
      lhs as StringVal,
      rhs as NumberVal,
      binop.operator,
    );
  }

  // bool-string
  if (
    (lhs.type == "bool" && rhs.type == "string") ||
    (lhs.type == "string" && rhs.type == "bool")
  ) {
    if (lhs.type === "bool")
      return eval_boolstring_binary_expr(
        lhs as BooleanVal,
        rhs as StringVal,
        binop.operator,
      );

    return eval_boolstring_binary_expr(
      lhs as StringVal,
      rhs as BooleanVal,
      binop.operator,
    );
  }

  // number-bool
  if (
    (lhs.type == "bool" && rhs.type == "number") ||
    (lhs.type == "number" && rhs.type == "bool")
  ) {
    if (lhs.type === "bool")
      return eval_numbool_binary_expr(
        lhs as BooleanVal,
        rhs as NumberVal,
        binop.operator,
      );

    return eval_numbool_binary_expr(
      lhs as NumberVal,
      rhs as BooleanVal,
      binop.operator,
    );
  }

  // null interactions

  // null-null
  if (lhs.type === "null" && lhs.type === rhs.type)
    return eval_null_binary_expr(
      lhs as NullVal,
      rhs as NullVal,
      binop.operator,
    );

  // null-string
  if (
    (lhs.type == "null" && rhs.type == "string") ||
    (lhs.type == "string" && rhs.type == "null")
  ) {
    if (lhs.type === "null")
      return eval_nullstring_binary_expr(
        lhs as NullVal,
        rhs as StringVal,
        binop.operator,
      );

    return eval_nullstring_binary_expr(
      lhs as StringVal,
      rhs as NullVal,
      binop.operator,
    );
  }

  // null-number
  if (
    (lhs.type == "null" && rhs.type == "number") ||
    (lhs.type == "number" && rhs.type == "null")
  ) {
    if (lhs.type === "null")
      return eval_nullnumber_binary_expr(
        lhs as NullVal,
        rhs as NumberVal,
        binop.operator,
      );

    return eval_nullnumber_binary_expr(
      lhs as NumberVal,
      rhs as NullVal,
      binop.operator,
    );
  }

  // null-bool
  if (
    (lhs.type == "null" && rhs.type == "bool") ||
    (lhs.type == "bool" && rhs.type == "null")
  ) {
    if (lhs.type === "null")
      return eval_nullbool_binary_expr(
        lhs as NullVal,
        rhs as BooleanVal,
        binop.operator,
      );

    return eval_nullbool_binary_expr(
      lhs as BooleanVal,
      rhs as NullVal,
      binop.operator,
    );
  }

  // Add JB error:
  // Illegal operation, <operation name, ex. SUBTRACT> with incompatible data types: <lhs.type> <operator> <rhs.type>
  throw `Illegal operation, ${binop.operator} with incompatible data types: ${lhs.type} ${binop.operator} ${rhs.type}`;
}

/**
 * Evaluates unary operator expressions (!, -, --, ++).
 */
export function eval_unary_expr(unop: UnaryExpr, scope: Scope): RuntimeVal {
  const operand = evaluate(unop.value, scope);

  switch(unop.operator) {
    case "!":
      if(unop.lhs) {
        switch (operand.type) {
          case "number":
            return { type: "bool", value: (operand as NumberVal).value === 0 } as BooleanVal;
          case "bool":
            return { type: "bool", value: !(operand as BooleanVal).value } as BooleanVal;
          case "string":
            return { type: "bool", value: jbStringToNumber(operand as StringVal) === 0 } as BooleanVal;
          case "null":
            return { type: "bool", value: true } as BooleanVal;
          case "object":
            // TODO
          default:
            throw `Unsupported type for ${unop.operator} unary operator: ${operand.type}`;
        }
      }
      // the original error for a = Null()!
      // Operator ! cannot be proceeded with an operand: )
      throw `RHS unary operator ${unop.operator} unsupported`;
    case "-":
      if(unop.lhs) {
        switch (operand.type) {
          case "number":
            return {
              type: "number",
              value: -1 * (operand as NumberVal).value
            } as NumberVal;
          // all the below should probably return warnings
          case "bool":
            // -true is true
            // -false is false
            return operand;
          case "string":
            // returns a string
            // performs string->number->string conversion, the result is prefixed with "-"
            // examples:
            // -"abcd1234" results in "-0"
            // -"0" results in "-0"
            // -"1" results in "-1"
            // -"1.2" results in "-1.2"
            // -"-12310.4jbb35" results in "12310.4"
            // -"321.4" + 69 results in "-321.469"
            let prefix = "-";
            let nb = jbStringToNumber(operand as StringVal);
            if((operand as StringVal).value[0] === "-") {
              prefix = "";
              nb *= -1;
            }
            return { type: "string", value: prefix + nb.toString() } as StringVal;
          case "null":
            // The original error shows the tokens of the faulty expr before null expr
            // for example, a = -Null(); results in:
            // at line <x>
            // a = -
            throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ${unop.operator}`;
          case "object":
            // TODO
          default:
            throw `Unsupported type for ${unop.operator} unary operator: ${operand.type}`;
        }
      }
      // the original error for a = Null()-;
      // Not enough operands for the operation: ";"
      throw `RHS unary operator ${unop.operator} unsupported`;
    case "--":
      if(unop.lhs) {
        // --x
        switch (operand.type) {
          case "number":
            let numValue: RuntimeVal;
            let numId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                numId = (unop.value as Identifier).symbol;
                numValue = {
                  type: "number",
                  value: (operand as NumberVal).value - 1
                } as NumberVal;
                // resolves global and local identifiers
                scope.assignVar(numId, numValue);
                return numValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "bool":
            let boolValue: RuntimeVal;
            let boolId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                boolId = (unop.value as Identifier).symbol;
                // returns a negated bool
                boolValue = {
                  type: "bool",
                  value: !(operand as BooleanVal).value
                } as BooleanVal;
                // resolves global and local identifiers
                scope.assignVar(boolId, boolValue);
                return boolValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "string":
            let strValue: RuntimeVal;
            let strId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                strId = (unop.value as Identifier).symbol;
                // returns a string
                // tries to parse a number off the string and decrement it, then converts back
                strValue = {
                  type: "string",
                  value: (jbStringToNumber(operand as StringVal) - 1).toString()
                } as StringVal;
                // resolves global and local identifiers
                scope.assignVar(strId, strValue);
                return strValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "null":
            throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ${unop.operator}`;
          case "object":
            // TODO
          default:
            throw `Unsupported type for ${unop.operator} LHS unary operator: ${operand.type}`;
        }
      } else {
        // x--
        switch (operand.type) {
          case "number":
            let numValue: RuntimeVal;
            let numId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                numId = (unop.value as Identifier).symbol;
                numValue = {
                  type: "number",
                  value: (operand as NumberVal).value
                } as NumberVal;
                // resolves global and local identifiers
                scope.assignVar(numId,
                  {
                    ...numValue,
                    value: (numValue as NumberVal).value - 1
                  } as NumberVal
                );
                return numValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "bool":
            let boolValue: RuntimeVal;
            let boolId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                boolId = (unop.value as Identifier).symbol;
                // returns a negated bool
                boolValue = {
                  type: "bool",
                  value: (operand as BooleanVal).value
                } as BooleanVal;
                // resolves global and local identifiers
                scope.assignVar(boolId,
                  {
                    ...boolValue,
                    value: !(boolValue as BooleanVal).value
                  } as BooleanVal 
                );
                return boolValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "string":
            let strValue: RuntimeVal;
            let strId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                strId = (unop.value as Identifier).symbol;
                // returns a string
                // tries to parse a number off the string and decrement it, then converts back
                let oldNumValue = jbStringToNumber(operand as StringVal);
                strValue = {
                  type: "string",
                  value: oldNumValue.toString()
                } as StringVal;
                // resolves global and local identifiers
                scope.assignVar(strId,
                  {
                    ...strValue,
                    value: (oldNumValue - 1).toString()
                  } as StringVal
                );
                return strValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "null":
            throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ${unop.operator}`;
          case "object":
            // TODO
          default:
            throw `Unsupported type for ${unop.operator} RHS unary operator: ${operand.type}`;
        }
      }
    case "++":
      if(unop.lhs) {
        // ++x
        switch (operand.type) {
          case "number":
            let numValue: RuntimeVal;
            let numId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                numId = (unop.value as Identifier).symbol;
                numValue = {
                  type: "number",
                  value: (operand as NumberVal).value + 1
                } as NumberVal;
                // resolves global and local identifiers
                scope.assignVar(numId, numValue);
                return numValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "bool":
            let boolValue: RuntimeVal;
            let boolId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                boolId = (unop.value as Identifier).symbol;
                // always returns true
                boolValue = {
                  type: "bool",
                  value: true
                } as BooleanVal;
                // resolves global and local identifiers
                scope.assignVar(boolId, boolValue);
                return boolValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "string":
            let strValue: RuntimeVal;
            let strId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                strId = (unop.value as Identifier).symbol;
                // returns a string
                // tries to parse a number off the string and decrement it, then converts back
                strValue = {
                  type: "string",
                  value: (jbStringToNumber(operand as StringVal) + 1).toString()
                } as StringVal;
                // resolves global and local identifiers
                scope.assignVar(strId, strValue);
                return strValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "null":
            throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ${unop.operator}`;
          case "object":
            // TODO
          default:
            throw `Unsupported type for ${unop.operator} LHS unary operator: ${operand.type}`;
        }
      } else {
        // x++
        switch (operand.type) {
          case "number":
            let numValue: RuntimeVal;
            let numId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                numId = (unop.value as Identifier).symbol;
                numValue = {
                  type: "number",
                  value: (operand as NumberVal).value
                } as NumberVal;
                // resolves global and local identifiers
                scope.assignVar(numId,
                  {
                    ...numValue,
                    value: (numValue as NumberVal).value + 1
                  } as NumberVal
                );
                return numValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "bool":
            let boolValue: RuntimeVal;
            let boolId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                boolId = (unop.value as Identifier).symbol;
                // returns the previous value
                boolValue = {
                  type: "bool",
                  value: (operand as BooleanVal).value
                } as BooleanVal;
                // resolves global and local identifiers
                scope.assignVar(boolId,
                  {
                    ...boolValue,
                    value: true
                  } as BooleanVal 
                );
                return boolValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "string":
            let strValue: RuntimeVal;
            let strId: string;
            switch(unop.value.kind) {
              case "GlobalIdentifier":
              case "Identifier":
                strId = (unop.value as Identifier).symbol;
                // returns a string
                // tries to parse a number off the string and decrement it, then converts back
                let oldNumValue = jbStringToNumber(operand as StringVal);
                strValue = {
                  type: "string",
                  value: oldNumValue.toString()
                } as StringVal;
                // resolves global and local identifiers
                scope.assignVar(strId,
                  {
                    ...strValue,
                    value: (oldNumValue + 1).toString()
                  } as StringVal
                );
                return strValue;
              case "MemberExpr":
                // TODO
              default:
                // original error:
                // Invalid argument to operator ++/--
                throw `Unsupported expression type for ${unop.operator} LHS unary operator: ${unop.value.kind}`;
            }
          case "null":
            throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ${unop.operator}`;
          case "object":
            // TODO
          default:
            throw `Unsupported type for ${unop.operator} RHS unary operator: ${operand.type}`;
        }
      }
    default:
      throw `Evaluation of unary operator ${unop.operator} unsupported`;
  }
}

export function eval_identifier(
  ident: Identifier,
  scope: Scope,
): RuntimeVal {
  const val = scope.lookupVar(ident.symbol);
  return val;
}

export function eval_assignment_expr(
  node: AssignmentExpr,
  scope: Scope,
): RuntimeVal {
  if (node.assignee.kind !== "Identifier" && node.assignee.kind !== "GlobalIdentifier") {
    throw `Invalid LHS inside assignment expr ${JSON.stringify(node.assignee)}`;
  }
  const varName = (node.assignee as Identifier).symbol;

  return scope.assignVar(varName, evaluate(node.value, scope), node.operator.value);
}

export function eval_object_expr(
  obj: ObjectLiteral,
  scope: Scope,
): RuntimeVal {
  const object = { type: "object", properties: new Map() } as ObjectVal;
  for (const { key, value } of obj.properties) {
    const runtimeVal = (value == undefined)
      ? scope.lookupVar(key)
      : evaluate(value, scope);

    object.properties.set(key, runtimeVal);
  }

  return object;
}
