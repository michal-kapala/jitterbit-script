import { BinaryExpr } from "../../../frontend/ast";
import Scope from "../../scope";
import { evaluate } from "../../interpreter";
import { 
  ArrayVal,
  BooleanVal,
  MK_NULL,
  NullVal,
  NumberVal,
  RuntimeVal,
  StringVal,
  jbCompareStringToBool,
  jbStringToBool,
  jbStringToNumber
} from "../../values";

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
 * Evaluaes binary expressions on null values.
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
 * Evaluates binary expressions for number-string operand types.
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
 * Evaluates binary expressions for bool-string operand types.
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
 * Evaluates binary expressions for number-bool operand types.
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
 * Evaluates binary expressions for null-string operand types.
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
 * Evaluates binary expressions for null-number operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_numnull_binary_expr(lhs: NullVal | NumberVal, rhs: NullVal | NumberVal, operator: string): NumberVal | BooleanVal {
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
 * Evaluates binary expressions for null-bool operand types.
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
 * Evaluates binary expressions for array-array operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_array_binary_expr(lhs: ArrayVal, rhs: ArrayVal, operator: string): ArrayVal {
  if(lhs.members.length !== rhs.members.length)
    throw `The operator ${operator} operating on two array data elements with inconsistent sizes n1/n2: ${lhs.members.length}/${rhs.members.length}`;

  const lMembers = lhs.members;
  const rMembers = rhs.members;

  for(const idx in lMembers) {
    switch (lMembers[idx].type) {
      case "number":
        switch (rMembers[idx].type) {
          case "number":
            lMembers[idx] = eval_numeric_binary_expr(
              lMembers[idx] as NumberVal,
              rMembers[idx] as NumberVal,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_numbool_binary_expr(
              lMembers[idx] as NumberVal,
              rMembers[idx] as BooleanVal,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_numstring_binary_expr(
              lMembers[idx] as NumberVal,
              rMembers[idx] as StringVal,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_numnull_binary_expr(
              lMembers[idx] as NumberVal,
              rMembers[idx] as NullVal,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_arraynum_binary_expr(
              lMembers[idx] as NumberVal,
              rMembers[idx] as ArrayVal,
              operator);
            break;
          case "dictionary":
            // TODO
          default:
            throw `Unsupported RHS array member type: ${rMembers[idx].type}`;
        }
        break;
      case "bool":
        switch (rMembers[idx].type) {
          case "number":
            lMembers[idx] = eval_numbool_binary_expr(
              lMembers[idx] as BooleanVal,
              rMembers[idx] as NumberVal,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_bool_binary_expr(
              lMembers[idx] as BooleanVal,
              rMembers[idx] as BooleanVal,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_boolstring_binary_expr(
              lMembers[idx] as BooleanVal,
              rMembers[idx] as StringVal,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_nullbool_binary_expr(
              lMembers[idx] as BooleanVal,
              rMembers[idx] as NullVal,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_arraybool_binary_expr(
              lMembers[idx] as BooleanVal,
              rMembers[idx] as ArrayVal,
              operator);
            break;
          case "dictionary":
            // TODO
          default:
            throw `Unsupported RHS array member type: ${rMembers[idx].type}`;
        }
        break;
      case "string":
        switch (rMembers[idx].type) {
          case "number":
            lMembers[idx] = eval_numstring_binary_expr(
              lMembers[idx] as StringVal,
              rMembers[idx] as NumberVal,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_boolstring_binary_expr(
              lMembers[idx] as StringVal,
              rMembers[idx] as BooleanVal,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_string_binary_expr(
              lMembers[idx] as StringVal,
              rMembers[idx] as StringVal,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_nullstring_binary_expr(
              lMembers[idx] as StringVal,
              rMembers[idx] as NullVal,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_arraystring_binary_expr(
              lMembers[idx] as StringVal,
              rMembers[idx] as ArrayVal,
              operator);
            break;
          case "dictionary":
            // TODO
          default:
            throw `Unsupported RHS array member type: ${rMembers[idx].type}`;
        }
        break;
      case "null":
        switch (rMembers[idx].type) {
          case "number":
            lMembers[idx] = eval_numnull_binary_expr(
              lMembers[idx] as NullVal,
              rMembers[idx] as NumberVal,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_nullbool_binary_expr(
              lMembers[idx] as NullVal,
              rMembers[idx] as BooleanVal,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_nullstring_binary_expr(
              lMembers[idx] as NullVal,
              rMembers[idx] as StringVal,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_null_binary_expr(
              lMembers[idx] as NullVal,
              rMembers[idx] as NullVal,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_arraynull_binary_expr(
              lMembers[idx] as NullVal,
              rMembers[idx] as ArrayVal,
              operator);
            break;
          case "dictionary":
            // TODO
          default:
            throw `Unsupported RHS array member type: ${rMembers[idx].type}`;
        }
        break;
      case "array":
        switch (rMembers[idx].type) {
          case "number":
            lMembers[idx] = eval_arraynum_binary_expr(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as NumberVal,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_arraybool_binary_expr(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as BooleanVal,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_arraystring_binary_expr(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as StringVal,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_arraynull_binary_expr(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as NullVal,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_array_binary_expr(
              lMembers[idx] as ArrayVal,
              rMembers[idx] as ArrayVal,
              operator);
            break;
          case "dictionary":
            // TODO
          default:
            throw `Unsupported RHS array member type: ${rMembers[idx].type}`;
        }
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported LHS array member type: ${lMembers[idx].type}`;
    }
  }
  return lhs;
}

/**
 * Evaluates binary expressions for array-number operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_arraynum_binary_expr(lhs: ArrayVal | NumberVal, rhs: ArrayVal | NumberVal, operator: string): ArrayVal {
  const isLhs = lhs.type === "number";
  const numVal = (isLhs ? lhs : rhs) as NumberVal;
  const arrVal = (isLhs ? rhs : lhs) as ArrayVal;
  const members = arrVal.members;

  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = isLhs
          ? eval_numeric_binary_expr(numVal, members[idx] as NumberVal, operator)
          : eval_numeric_binary_expr(members[idx] as NumberVal, numVal, operator);
        break;
      case "bool":
        members[idx] = isLhs
          ? eval_numbool_binary_expr(numVal, members[idx] as BooleanVal, operator)
          : eval_numbool_binary_expr(members[idx] as BooleanVal, numVal, operator);
        break;
      case "string":
        members[idx] = isLhs
          ? eval_numstring_binary_expr(numVal, members[idx] as StringVal, operator)
          : eval_numstring_binary_expr(members[idx] as StringVal, numVal, operator);
        break;
      case "null":
        members[idx] = isLhs
          ? eval_numnull_binary_expr(numVal, members[idx] as NullVal, operator)
          : eval_numnull_binary_expr(members[idx] as NullVal, numVal, operator);
        break;
      case "array":
        members[idx] = isLhs
          ? eval_arraynum_binary_expr(numVal, members[idx] as ArrayVal, operator)
          : eval_arraynum_binary_expr(members[idx] as ArrayVal, numVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }

  return arrVal;
}

/**
 * Evaluates binary expressions for array-bool operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_arraybool_binary_expr(lhs: ArrayVal | BooleanVal, rhs: ArrayVal | BooleanVal, operator: string): ArrayVal {
  const isLhs = lhs.type === "bool";
  const boolVal = (isLhs ? lhs : rhs) as BooleanVal;
  const arrVal = (isLhs ? rhs : lhs) as ArrayVal;
  const members = arrVal.members;

  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = isLhs
          ? eval_numbool_binary_expr(boolVal, members[idx] as NumberVal, operator)
          : eval_numbool_binary_expr(members[idx] as NumberVal, boolVal, operator);
        break;
      case "bool":
        members[idx] = isLhs
          ? eval_bool_binary_expr(boolVal, members[idx] as BooleanVal, operator)
          : eval_bool_binary_expr(members[idx] as BooleanVal, boolVal, operator);
        break;
      case "string":
        members[idx] = isLhs
          ? eval_boolstring_binary_expr(boolVal, members[idx] as StringVal, operator)
          : eval_boolstring_binary_expr(members[idx] as StringVal, boolVal, operator);
        break;
      case "null":
        members[idx] = isLhs
          ? eval_nullbool_binary_expr(boolVal, members[idx] as NullVal, operator)
          : eval_nullbool_binary_expr(members[idx] as NullVal, boolVal, operator);
        break;
      case "array":
        members[idx] = isLhs
          ? eval_arraybool_binary_expr(boolVal, members[idx] as ArrayVal, operator)
          : eval_arraybool_binary_expr(members[idx] as ArrayVal, boolVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }

  return arrVal;
}

/**
 * Evaluates binary expressions for array-string operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_arraystring_binary_expr(lhs: ArrayVal | StringVal, rhs: ArrayVal | StringVal, operator: string): ArrayVal {
  const isLhs = lhs.type === "string";
  const strVal = (isLhs ? lhs : rhs) as StringVal;
  const arrVal = (isLhs ? rhs : lhs) as ArrayVal;
  const members = arrVal.members;

  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = isLhs
          ? eval_numstring_binary_expr(strVal, members[idx] as NumberVal, operator)
          : eval_numstring_binary_expr(members[idx] as NumberVal, strVal, operator);
        break;
      case "bool":
        members[idx] = isLhs
          ? eval_boolstring_binary_expr(strVal, members[idx] as BooleanVal, operator)
          : eval_boolstring_binary_expr(members[idx] as BooleanVal, strVal, operator);
        break;
      case "string":
        members[idx] = isLhs
          ? eval_string_binary_expr(strVal, members[idx] as StringVal, operator)
          : eval_string_binary_expr(members[idx] as StringVal, strVal, operator);
        break;
      case "null":
        members[idx] = isLhs
          ? eval_nullstring_binary_expr(strVal, members[idx] as NullVal, operator)
          : eval_nullstring_binary_expr(members[idx] as NullVal, strVal, operator);
        break;
      case "array":
        members[idx] = isLhs
          ? eval_arraystring_binary_expr(strVal, members[idx] as ArrayVal, operator)
          : eval_arraystring_binary_expr(members[idx] as ArrayVal, strVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }

  return arrVal;
}

/**
 * Evaluates binary expressions for array-null operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_arraynull_binary_expr(lhs: ArrayVal | NullVal, rhs: ArrayVal | NullVal, operator: string): ArrayVal {
  const isLhs = lhs.type === "null";
  const nullVal = (isLhs ? lhs : rhs) as NullVal;
  const arrVal = (isLhs ? rhs : lhs) as ArrayVal;
  const members = arrVal.members;

  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = isLhs
          ? eval_numnull_binary_expr(nullVal, members[idx] as NumberVal, operator)
          : eval_numnull_binary_expr(members[idx] as NumberVal, nullVal, operator);
        break;
      case "bool":
        members[idx] = isLhs
          ? eval_nullbool_binary_expr(nullVal, members[idx] as BooleanVal, operator)
          : eval_nullbool_binary_expr(members[idx] as BooleanVal, nullVal, operator);
        break;
      case "string":
        members[idx] = isLhs
          ? eval_nullstring_binary_expr(nullVal, members[idx] as StringVal, operator)
          : eval_nullstring_binary_expr(members[idx] as StringVal, nullVal, operator);
        break;
      case "null":
        members[idx] = isLhs
          ? eval_null_binary_expr(nullVal, members[idx] as NullVal, operator)
          : eval_null_binary_expr(members[idx] as NullVal, nullVal, operator);
        break;
      case "array":
        members[idx] = isLhs
          ? eval_arraynull_binary_expr(nullVal, members[idx] as ArrayVal, operator)
          : eval_arraynull_binary_expr(members[idx] as ArrayVal, nullVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }

  return arrVal;
}

/**
 * Evaluates expressions following the binary operation type.
 * @param binop 
 * @param scope 
 * @returns 
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
      return eval_numnull_binary_expr(
        lhs as NullVal,
        rhs as NumberVal,
        binop.operator,
      );

    return eval_numnull_binary_expr(
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

  // arrays

  // array-array
  if(lhs.type == "array" && rhs.type == "array") {
    return eval_array_binary_expr(
      lhs as ArrayVal,
      rhs as ArrayVal,
      binop.operator,
    );
  }

  // array-number
  if(
    (lhs.type == "array" && rhs.type == "number") ||
    (lhs.type == "number" && rhs.type == "array")
  ) {
    if (lhs.type === "array")
      return eval_arraynum_binary_expr(
        lhs as ArrayVal,
        rhs as NumberVal,
        binop.operator,
      );

    return eval_arraynum_binary_expr(
      lhs as NumberVal,
      rhs as ArrayVal,
      binop.operator,
    );
  }

  // array-bool
  if(
    (lhs.type == "array" && rhs.type == "bool") ||
    (lhs.type == "bool" && rhs.type == "array")
  ) {
    if (lhs.type === "array")
      return eval_arraybool_binary_expr(
        lhs as ArrayVal,
        rhs as BooleanVal,
        binop.operator,
      );

    return eval_arraybool_binary_expr(
      lhs as BooleanVal,
      rhs as ArrayVal,
      binop.operator,
    );
  }

  // array-string
  if(
    (lhs.type == "array" && rhs.type == "string") ||
    (lhs.type == "string" && rhs.type == "array")
  ) {
    if (lhs.type === "array")
      return eval_arraystring_binary_expr(
        lhs as ArrayVal,
        rhs as StringVal,
        binop.operator,
      );

    return eval_arraystring_binary_expr(
      lhs as StringVal,
      rhs as ArrayVal,
      binop.operator,
    );
  }

  // array-null
  if(
    (lhs.type == "array" && rhs.type == "null") ||
    (lhs.type == "null" && rhs.type == "array")
  ) {
    if (lhs.type === "array")
      return eval_arraynull_binary_expr(
        lhs as ArrayVal,
        rhs as NullVal,
        binop.operator,
      );

    return eval_arraynull_binary_expr(
      lhs as NullVal,
      rhs as ArrayVal,
      binop.operator,
    );
  }

  // Add JB error:
  // Illegal operation, <operation name, ex. SUBTRACT> with incompatible data types: <lhs.type> <operator> <rhs.type>
  throw `Illegal operation, ${binop.operator} with incompatible data types: ${lhs.type} ${binop.operator} ${rhs.type}`;
}
