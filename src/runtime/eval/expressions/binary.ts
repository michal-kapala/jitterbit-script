import { BinaryExpr } from "../../../frontend/ast";
import Scope from "../../scope";
import { evaluate } from "../../interpreter";
import { RuntimeVal } from "../../values";
import {
  Array,
  JbNull,
  JbBool,
  JbNumber,
  JbString
} from "../../types";

/**
 * Evaluates binary expressions on numeric literals.
 * @param lhs Left-hand side numeric literal.
 * @param rhs Right-hand side numeric literal.
 * @param operator Binary operator.
 * @returns 
 */
function eval_numeric_binary_expr(
  lhs: JbNumber,
  rhs: JbNumber,
  operator: string,
): JbNumber | JbBool {
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
      return new JbBool(lhs.value < rhs.value);
    case ">":
      return new JbBool(lhs.value > rhs.value);
    case "<=":
      return new JbBool(lhs.value <= rhs.value);
    case ">=":
      return new JbBool(lhs.value >= rhs.value);
    case "==":
      return new JbBool(lhs.value === rhs.value);
    case "!=":
      return new JbBool(lhs.value !== rhs.value);
    case "&&":
    case "&":
      // 'This is always a short-circuit operator, meaning that if the left-hand argument evaluates to false, the right-hand argument is not evaluated.'
      // This executes after expression evaluation
      return new JbBool(lhs.value !== 0 && rhs.value !== 0);
    case "||":
    case "|":
      // 'This is always a short-circuit operator, meaning that if the left-hand argument evaluates to true, the right-hand argument is not evaluated.'
      // This executes after expression evaluation
      return new JbBool(lhs.value !== 0 || rhs.value !== 0);
    default:
      throw `Unsupported operator ${operator}`;
  }

  return new JbNumber(result);
}


/**
 * Evaluates binary expressions on string literals.
 * @param lhs Left-hand side string literal.
 * @param rhs Right-hand side string literal.
 * @param operator Binary operator.
 */
function eval_string_binary_expr(
  lhs: JbString,
  rhs: JbString,
  operator: string,
): JbString | JbBool | JbNull {
  let result: string | boolean;
  switch (operator) {
    case "+":
      result = lhs.value + rhs.value;
      return new JbString(result);
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
      return new JbBool(result);
    case ">":
      result = lhs.value > rhs.value;
      return new JbBool(result);
    case "<=":
      result = lhs.value <= rhs.value;
      return new JbBool(result);
    case ">=":
      result = lhs.value >= rhs.value;
      return new JbBool(result);
    case "==":
      result = lhs.value === rhs.value;
      return new JbBool(result);
    case "!=":
      result = lhs.value !== rhs.value;
      return new JbBool(result);
    // Logical operators are valid but the expressions like str1 || str2 always return false (unless negated)
    case "&&":
    case "&":
    case "||":
    case "|":
      return new JbBool(false);
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
function eval_bool_binary_expr(lhs: JbBool, rhs: JbBool, operator: string): JbBool {
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
  return new JbBool(result);
}


/**
 * Evaluaes binary expressions on null values.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_null_binary_expr(lhs: JbNull, rhs: JbNull, operator: string): JbNull | JbBool {
  switch (operator) {
    case "+":
    case "-":
      return new JbNull();
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
      return new JbBool(false);
    case "!=":
      // nulls are individuals
      return new JbBool(true);
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
function eval_numstring_binary_expr(lhs: JbNumber | JbString, rhs: JbNumber | JbString, operator: string): JbString | JbBool {
  switch (operator) {
    case "+":
      // here it's the number gets converted for concat
      // consistency is key
      return new JbString(lhs.value.toString() + rhs.value.toString());
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
        return new JbBool(lhs.value < (rhs as JbString).toNumber());

      return new JbBool((lhs as JbString).toNumber() < (rhs as JbNumber).value);
    case ">":
      if(lhs.type === "number")
        return new JbBool(lhs.value > (rhs as JbString).toNumber());

      return new JbBool((lhs as JbString).toNumber() > (rhs as JbNumber).value);
    case "<=":
      if(lhs.type === "number")
        return new JbBool(lhs.value <= (rhs as JbString).toNumber());

      return new JbBool((lhs as JbString).toNumber() <= (rhs as JbNumber).value);
    case ">=":
      if(lhs.type === "number")
        return new JbBool(lhs.value >= (rhs as JbString).toNumber());
      
      return new JbBool((lhs as JbString).toNumber() >= (rhs as JbNumber).value);
    case "==":
      if(lhs.type === "number")
        return new JbBool(lhs.value === (rhs as JbString).toNumber());

      return new JbBool((lhs as JbString).toNumber() === (rhs as JbNumber).value);
    case "!=":
      if(lhs.type === "number")
        return new JbBool(lhs.value !== (rhs as JbString).toNumber());
      
      return new JbBool((lhs as JbString).toNumber() !== (rhs as JbNumber).value);
    case "&&":
    case "&":
      if(lhs.type === "number") 
        return new JbBool(lhs.value !== 0 && (rhs as JbString).toNumber() !== 0);
      
      return new JbBool(lhs.toNumber() !== 0 && (rhs as JbNumber).value !== 0);
    case "||":
    case "|":
      if(lhs.type === "number")
        return new JbBool(lhs.value !== 0 || (rhs as JbString).toNumber() !== 0);

      return new JbBool(lhs.toNumber() !== 0 || (rhs as JbNumber).value !== 0);
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
function eval_boolstring_binary_expr(lhs: JbBool | JbString, rhs: JbBool | JbString, operator: string): JbString | JbBool {
  switch (operator) {
    case "+":
      return lhs.type === "bool"
        ? new JbString(lhs.toString() + (rhs as JbString).value)
        : new JbString(lhs.value + ((rhs as JbBool).toString()))
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
        return new JbBool((rhs as JbString).compareWithBool(">", lhs));
      
      return new JbBool((lhs as JbString).compareWithBool("<", rhs as JbBool));
    case ">":
      if(lhs.type === "bool")
        return new JbBool((rhs as JbString).compareWithBool("<", lhs));
      
      return new JbBool((lhs as JbString).compareWithBool(">", rhs as JbBool));
    case "<=":
      if(lhs.type === "bool")
        return new JbBool((rhs as JbString).compareWithBool(">=", lhs));
      
      return new JbBool((lhs as JbString).compareWithBool("<=", rhs as JbBool));
    case ">=":
      if(lhs.type === "bool")
        return new JbBool((rhs as JbString).compareWithBool("<=", lhs));
      
      return new JbBool((lhs as JbString).compareWithBool(">=", rhs as JbBool));
    case "==":
      if(lhs.type === "bool")
        return new JbBool(lhs.value === (rhs as JbString).toBool());
      
      return new JbBool(lhs.toBool() === (rhs as JbBool).value);
    case "!=":
      if(lhs.type === "bool")
        return new JbBool(lhs.value !== (rhs as JbString).toBool());
      
      return new JbBool(lhs.toBool() !== (rhs as JbBool).value);
    case "&&":
    case "&":
      // bool || string
      if(lhs.type === "bool") {
        if((rhs as JbString).toBool() && lhs.value)
          return new JbBool(true);
        
        return new JbBool(false);
      }
      // string || bool
      if(lhs.toBool() && (rhs as JbBool).value)
        return new JbBool(true);
      
      return new JbBool(false);
    case "||":
    case "|":
      // bool || string
      if(lhs.type === "bool") {
        if((rhs as JbString).toBool() || lhs.value)
          return new JbBool(true);
        
        return new JbBool(false);
      }
      // string || bool
      if(lhs.toBool() || (rhs as JbBool).value)
        return new JbBool(true);
      
      return new JbBool(false);
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
function eval_numbool_binary_expr(lhs: JbBool | JbNumber, rhs: JbBool | JbNumber, operator: string): JbString | JbBool {
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
        return new JbBool(lhs.value
          ? 1 < (rhs as JbNumber).value
          : 0 < (rhs as JbNumber).value
        );
      
      return new JbBool((rhs as JbBool).value
        ? lhs.value < 1
        : lhs.value < 0
      );
    case ">":
      if(lhs.type === "bool")
        return new JbBool(lhs.value
          ? 1 > (rhs as JbNumber).value
          : 0 > (rhs as JbNumber).value
        );
      
      return new JbBool((rhs as JbBool).value
        ? lhs.value > 1
        : lhs.value > 0
      );
    case "<=":
      if(lhs.type === "bool")
        return new JbBool(lhs.value
          ? 1 <= (rhs as JbNumber).value
          : 0 <= (rhs as JbNumber).value
        );
      
      return new JbBool((rhs as JbBool).value
        ? lhs.value <= 1
        : lhs.value <= 0
      );
    case ">=":
      if(lhs.type === "bool")
        return new JbBool(lhs.value
          ? 1 >= (rhs as JbNumber).value
          : 0 >= (rhs as JbNumber).value
        );
      
      return new JbBool((rhs as JbBool).value
        ? lhs.value >= 1
        : lhs.value >= 0
      );
    case "==":
      if(lhs.type === "bool")
        return new JbBool(lhs.value
          ? 1 === (rhs as JbNumber).value
          : 0 === (rhs as JbNumber).value
        );
      
      return new JbBool((rhs as JbBool).value
        ? lhs.value === 1
        : lhs.value === 0
      );
    case "!=":
      if(lhs.type === "bool")
        return new JbBool(lhs.value
          ? 1 !== (rhs as JbNumber).value
          : 0 !== (rhs as JbNumber).value
        );
      
      return new JbBool((rhs as JbBool).value
        ? lhs.value !== 1
        : lhs.value !== 0
      );
    case "&&":
    case "&":
      if(lhs.type === "bool")
        return new JbBool(lhs.value && (rhs as JbNumber).toBool());

      return new JbBool(lhs.toBool() && (rhs as JbBool).value);
    case "||":
    case "|":
      if(lhs.type === "bool")
        return new JbBool(lhs.value || (rhs as JbNumber).toBool());
      
      return new JbBool(lhs.toBool() || (rhs as JbBool).value);
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
function eval_nullstring_binary_expr(lhs: JbNull | JbString, rhs: JbNull | JbString, operator: string): JbString | JbBool {
  switch (operator) {
    case "+":
      return lhs.type === "null"
        ? new JbString((rhs as JbString).value)
        : new JbString(lhs.value);
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
      return new JbBool(false);
    case "!=":
      return new JbBool(true);
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
function eval_numnull_binary_expr(lhs: JbNull | JbNumber, rhs: JbNull | JbNumber, operator: string): JbNumber | JbBool {
  switch (operator) {
    case "+":
      return lhs.type === "null"
        ? new JbNumber((rhs as JbNumber).value)
        : new JbNumber(lhs.value);
    case "-":
      if (lhs.type === "null")
        return new JbNumber(0 - (rhs as JbNumber).value);
      return new JbNumber(lhs.value);
    case "*":
      return new JbNumber();
    case "/":
      if(lhs.type === "null") {
        if((rhs as JbNumber).value === 0)
          throw `Illegal operation: division by 0`;
        return new JbNumber();
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
      return new JbBool(false);
    case "!=":
      return new JbBool(true);
    case "||":
    case "|":
      if(lhs.type === "null")
        return new JbBool((rhs as JbNumber).toBool());
      return new JbBool(lhs.toBool());
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
function eval_nullbool_binary_expr(lhs: JbNull | JbBool, rhs: JbNull | JbBool, operator: string): JbNumber | JbBool {
  switch (operator) {
    case "+":
      return lhs.type === "null"
        ? new JbNumber((rhs as JbBool).toNumber())
        : new JbNumber(lhs.toNumber());
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
      return new JbBool(false);
    case "!=":
      return new JbBool(true);
    case "||":
    case "|":
      if(lhs.type === "null")
        return new JbBool((rhs as JbBool).value);
      return new JbBool(lhs.value);
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
function eval_array_binary_expr(lhs: Array, rhs: Array, operator: string) {
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
              lMembers[idx] as JbNumber,
              rMembers[idx] as JbNumber,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_numbool_binary_expr(
              lMembers[idx] as JbNumber,
              rMembers[idx] as JbBool,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_numstring_binary_expr(
              lMembers[idx] as JbNumber,
              rMembers[idx] as JbString,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_numnull_binary_expr(
              lMembers[idx] as JbNumber,
              rMembers[idx] as JbNull,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_arraynum_binary_expr(
              lMembers[idx] as JbNumber,
              rMembers[idx] as Array,
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
              lMembers[idx] as JbBool,
              rMembers[idx] as JbNumber,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_bool_binary_expr(
              lMembers[idx] as JbBool,
              rMembers[idx] as JbBool,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_boolstring_binary_expr(
              lMembers[idx] as JbBool,
              rMembers[idx] as JbString,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_nullbool_binary_expr(
              lMembers[idx] as JbBool,
              rMembers[idx] as JbNull,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_arraybool_binary_expr(
              lMembers[idx] as JbBool,
              rMembers[idx] as Array,
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
              lMembers[idx] as JbString,
              rMembers[idx] as JbNumber,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_boolstring_binary_expr(
              lMembers[idx] as JbString,
              rMembers[idx] as JbBool,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_string_binary_expr(
              lMembers[idx] as JbString,
              rMembers[idx] as JbString,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_nullstring_binary_expr(
              lMembers[idx] as JbString,
              rMembers[idx] as JbNull,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_arraystring_binary_expr(
              lMembers[idx] as JbString,
              rMembers[idx] as Array,
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
              lMembers[idx] as JbNull,
              rMembers[idx] as JbNumber,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_nullbool_binary_expr(
              lMembers[idx] as JbNull,
              rMembers[idx] as JbBool,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_nullstring_binary_expr(
              lMembers[idx] as JbNull,
              rMembers[idx] as JbString,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_null_binary_expr(
              lMembers[idx] as JbNull,
              rMembers[idx] as JbNull,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_arraynull_binary_expr(
              lMembers[idx] as JbNull,
              rMembers[idx] as Array,
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
              lMembers[idx] as Array,
              rMembers[idx] as JbNumber,
              operator);
            break;
          case "bool":
            lMembers[idx] = eval_arraybool_binary_expr(
              lMembers[idx] as Array,
              rMembers[idx] as JbBool,
              operator);
            break;
          case "string":
            lMembers[idx] = eval_arraystring_binary_expr(
              lMembers[idx] as Array,
              rMembers[idx] as JbString,
              operator);
            break;
          case "null":
            lMembers[idx] = eval_arraynull_binary_expr(
              lMembers[idx] as Array,
              rMembers[idx] as JbNull,
              operator);
            break;
          case "array":
            lMembers[idx] = eval_array_binary_expr(
              lMembers[idx] as Array,
              rMembers[idx] as Array,
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
function eval_arraynum_binary_expr(lhs: Array | JbNumber, rhs: Array | JbNumber, operator: string) {
  const isLhs = lhs.type === "number";
  const numVal = (isLhs ? lhs : rhs) as JbNumber;
  const arr = (isLhs ? rhs : lhs) as Array;
  const members = arr.members;

  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = isLhs
          ? eval_numeric_binary_expr(numVal, members[idx] as JbNumber, operator)
          : eval_numeric_binary_expr(members[idx] as JbNumber, numVal, operator);
        break;
      case "bool":
        members[idx] = isLhs
          ? eval_numbool_binary_expr(numVal, members[idx] as JbBool, operator)
          : eval_numbool_binary_expr(members[idx] as JbBool, numVal, operator);
        break;
      case "string":
        members[idx] = isLhs
          ? eval_numstring_binary_expr(numVal, members[idx] as JbString, operator)
          : eval_numstring_binary_expr(members[idx] as JbString, numVal, operator);
        break;
      case "null":
        members[idx] = isLhs
          ? eval_numnull_binary_expr(numVal, members[idx] as JbNull, operator)
          : eval_numnull_binary_expr(members[idx] as JbNull, numVal, operator);
        break;
      case "array":
        members[idx] = isLhs
          ? eval_arraynum_binary_expr(numVal, members[idx] as Array, operator)
          : eval_arraynum_binary_expr(members[idx] as Array, numVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }

  return arr;
}

/**
 * Evaluates binary expressions for array-bool operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_arraybool_binary_expr(lhs: Array | JbBool, rhs: Array | JbBool, operator: string) {
  const isLhs = lhs.type === "bool";
  const boolVal = (isLhs ? lhs : rhs) as JbBool;
  const arr = (isLhs ? rhs : lhs) as Array;
  const members = arr.members;

  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = isLhs
          ? eval_numbool_binary_expr(boolVal, members[idx] as JbNumber, operator)
          : eval_numbool_binary_expr(members[idx] as JbNumber, boolVal, operator);
        break;
      case "bool":
        members[idx] = isLhs
          ? eval_bool_binary_expr(boolVal, members[idx] as JbBool, operator)
          : eval_bool_binary_expr(members[idx] as JbBool, boolVal, operator);
        break;
      case "string":
        members[idx] = isLhs
          ? eval_boolstring_binary_expr(boolVal, members[idx] as JbString, operator)
          : eval_boolstring_binary_expr(members[idx] as JbString, boolVal, operator);
        break;
      case "null":
        members[idx] = isLhs
          ? eval_nullbool_binary_expr(boolVal, members[idx] as JbNull, operator)
          : eval_nullbool_binary_expr(members[idx] as JbNull, boolVal, operator);
        break;
      case "array":
        members[idx] = isLhs
          ? eval_arraybool_binary_expr(boolVal, members[idx] as Array, operator)
          : eval_arraybool_binary_expr(members[idx] as Array, boolVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }

  return arr;
}

/**
 * Evaluates binary expressions for array-string operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_arraystring_binary_expr(lhs: Array | JbString, rhs: Array | JbString, operator: string) {
  const isLhs = lhs.type === "string";
  const strVal = (isLhs ? lhs : rhs) as JbString;
  const arr = (isLhs ? rhs : lhs) as Array;
  const members = arr.members;

  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = isLhs
          ? eval_numstring_binary_expr(strVal, members[idx] as JbNumber, operator)
          : eval_numstring_binary_expr(members[idx] as JbNumber, strVal, operator);
        break;
      case "bool":
        members[idx] = isLhs
          ? eval_boolstring_binary_expr(strVal, members[idx] as JbBool, operator)
          : eval_boolstring_binary_expr(members[idx] as JbBool, strVal, operator);
        break;
      case "string":
        members[idx] = isLhs
          ? eval_string_binary_expr(strVal, members[idx] as JbString, operator)
          : eval_string_binary_expr(members[idx] as JbString, strVal, operator);
        break;
      case "null":
        members[idx] = isLhs
          ? eval_nullstring_binary_expr(strVal, members[idx] as JbNull, operator)
          : eval_nullstring_binary_expr(members[idx] as JbNull, strVal, operator);
        break;
      case "array":
        members[idx] = isLhs
          ? eval_arraystring_binary_expr(strVal, members[idx] as Array, operator)
          : eval_arraystring_binary_expr(members[idx] as Array, strVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }

  return arr;
}

/**
 * Evaluates binary expressions for array-null operand types.
 * @param lhs 
 * @param rhs 
 * @param operator 
 * @returns 
 */
function eval_arraynull_binary_expr(lhs: Array | JbNull, rhs: Array | JbNull, operator: string) {
  const isLhs = lhs.type === "null";
  const nullVal = (isLhs ? lhs : rhs) as JbNull;
  const arr = (isLhs ? rhs : lhs) as Array;
  const members = arr.members;

  for(const idx in members) {
    switch (members[idx].type) {
      case "number":
        members[idx] = isLhs
          ? eval_numnull_binary_expr(nullVal, members[idx] as JbNumber, operator)
          : eval_numnull_binary_expr(members[idx] as JbNumber, nullVal, operator);
        break;
      case "bool":
        members[idx] = isLhs
          ? eval_nullbool_binary_expr(nullVal, members[idx] as JbBool, operator)
          : eval_nullbool_binary_expr(members[idx] as JbBool, nullVal, operator);
        break;
      case "string":
        members[idx] = isLhs
          ? eval_nullstring_binary_expr(nullVal, members[idx] as JbString, operator)
          : eval_nullstring_binary_expr(members[idx] as JbString, nullVal, operator);
        break;
      case "null":
        members[idx] = isLhs
          ? eval_null_binary_expr(nullVal, members[idx] as JbNull, operator)
          : eval_null_binary_expr(members[idx] as JbNull, nullVal, operator);
        break;
      case "array":
        members[idx] = isLhs
          ? eval_arraynull_binary_expr(nullVal, members[idx] as Array, operator)
          : eval_arraynull_binary_expr(members[idx] as Array, nullVal, operator);
        break;
      case "dictionary":
        // TODO
      default:
        throw `Unsupported array member type: ${members[idx].type}`;
    }
  }

  return arr;
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
      lhs as JbNumber,
      rhs as JbNumber,
      binop.operator,
    );
  }

  // string concatenation
  if (lhs.type == "string" && rhs.type == "string") {
    return eval_string_binary_expr(
      lhs as JbString,
      rhs as JbString,
      binop.operator,
    );
  }

  // booleans
  if (lhs.type == "bool" && rhs.type == "bool") {
    return eval_bool_binary_expr(
      lhs as JbBool,
      rhs as JbBool,
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
        lhs as JbNumber,
        rhs as JbString,
        binop.operator,
      );

    return eval_numstring_binary_expr(
      lhs as JbString,
      rhs as JbNumber,
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
        lhs as JbBool,
        rhs as JbString,
        binop.operator,
      );

    return eval_boolstring_binary_expr(
      lhs as JbString,
      rhs as JbBool,
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
        lhs as JbBool,
        rhs as JbNumber,
        binop.operator,
      );

    return eval_numbool_binary_expr(
      lhs as JbNumber,
      rhs as JbBool,
      binop.operator,
    );
  }

  // null interactions

  // null-null
  if (lhs.type === "null" && lhs.type === rhs.type)
    return eval_null_binary_expr(
      lhs as JbNull,
      rhs as JbNull,
      binop.operator,
    );

  // null-string
  if (
    (lhs.type == "null" && rhs.type == "string") ||
    (lhs.type == "string" && rhs.type == "null")
  ) {
    if (lhs.type === "null")
      return eval_nullstring_binary_expr(
        lhs as JbNull,
        rhs as JbString,
        binop.operator,
      );

    return eval_nullstring_binary_expr(
      lhs as JbString,
      rhs as JbNull,
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
        lhs as JbNull,
        rhs as JbNumber,
        binop.operator,
      );

    return eval_numnull_binary_expr(
      lhs as JbNumber,
      rhs as JbNull,
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
        lhs as JbNull,
        rhs as JbBool,
        binop.operator,
      );

    return eval_nullbool_binary_expr(
      lhs as JbBool,
      rhs as JbNull,
      binop.operator,
    );
  }

  // arrays

  // array-array
  if(lhs.type == "array" && rhs.type == "array") {
    return eval_array_binary_expr(
      lhs as Array,
      rhs as Array,
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
        lhs as Array,
        rhs as JbNumber,
        binop.operator,
      );

    return eval_arraynum_binary_expr(
      lhs as JbNumber,
      rhs as Array,
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
        lhs as Array,
        rhs as JbBool,
        binop.operator,
      );

    return eval_arraybool_binary_expr(
      lhs as JbBool,
      rhs as Array,
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
        lhs as Array,
        rhs as JbString,
        binop.operator,
      );

    return eval_arraystring_binary_expr(
      lhs as JbString,
      rhs as Array,
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
        lhs as Array,
        rhs as JbNull,
        binop.operator,
      );

    return eval_arraynull_binary_expr(
      lhs as JbNull,
      rhs as Array,
      binop.operator,
    );
  }

  // Add JB error:
  // Illegal operation, <operation name, ex. SUBTRACT> with incompatible data types: <lhs.type> <operator> <rhs.type>
  throw `Illegal operation, ${binop.operator} with incompatible data types: ${lhs.type} ${binop.operator} ${rhs.type}`;
}
