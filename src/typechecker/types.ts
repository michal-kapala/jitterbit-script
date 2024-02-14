import { TcError } from "../errors";
import { ValueType } from "../runtime/values";
import { TypeInfo } from "./ast";

/**
 * Static analysis-time number type.
 */
export class NumberType {
  /**
   * Returns the result type of a `number op *` expression.
   * @param operator 
   * @param rhs 
   */
  static binop(operator: string, rhs: ValueType) {
    switch(rhs) {
      case "array":
        return this.binopArray(operator);
      case "binary":
        return this.binopBin(operator);
      case "bool":
        return this.binopBool(operator);
      case "date":
        return this.binopDate(operator);
      case "dictionary":
        return this.binopDict(operator);
      case "void":
      case "null":
        return this.binopNull(operator);
      case "number":
        return this.binopNumber(operator);
      case "string":
        return this.binopString(operator);
      case "node":
        // TODO
      case "type":
        // TODO
      default:
        throw new TcError(`Unsupported RHS type in binary expression: ${rhs}.`);
    }
  }

  /**
   * Returns the result type of a `number op number` expression.
   * @param operator 
   * @returns 
   */
  static binopNumber(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
        return {type: "number"};
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
      case "&&":
      case "&":
      case "||":
      case "|":
        return {type: "bool"};
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `number op string` expression.
   * @param operator 
   * @returns 
   */
  static binopString(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "string",
          warning: `Cross-type concatenation of number ${operator} string, results in implicit number->string conversion at runtime.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: number ${operator} string`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: number ${operator} string`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: number ${operator} string`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: number ${operator} string`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of number ${operator} string, results in implicit string parsing at runtime.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of number ${operator} string, results in implicit string parsing at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `number op bool` expression.
   * @param operator 
   * @returns 
   */
  static binopBool(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Cross-type addition of number ${operator} bool, results in a runtime conversion error.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: number ${operator} bool`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: number ${operator} bool`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: number ${operator} bool`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: number ${operator} bool`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "bool",
          warning: `Cross-type comparison of number ${operator} bool, results in implicit bool->number conversion at runtime.`
        };
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of number ${operator} bool, results in implicit number->bool conversion at runtime.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of number ${operator} bool, results in implicit number->bool conversion at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `number op null` expression.
   * @param operator 
   * @returns 
   */
  static binopNull(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
      case "*":
        return {
          type: "number",
          warning: `Null values are converted to 0 at runtime (number ${operator} 0).`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, division by null (converted to 0 at runtime).`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: number ${operator} null`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of number ${operator} null, always false.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Null values are converted to 'false', always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Null values are converted to 'false', always true.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of number ${operator} bool, results in implicit bool->number conversion at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `number op array` expression.
   * @param operator 
   * @returns 
   */
  static binopArray(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
        return {
          type: "array",
          warning: `Cross-type operation of number ${operator} array, applies the operation to each element.`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "array",
          warning: `Cross-type comparison of number ${operator} array returns an array of element comparison results.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Arrays are always converted to false for logical expressions, this expression always returns false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Arrays are always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `number op dictionary` expression.
   * @param operator 
   * @returns 
   */
  static binopDict(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
      case "*":
      case "/":
        return {
          type: "error",
          error: `Cross-type operation of number ${operator} dictionary, results in a runtime conversion error.`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: number ${operator} dictionary`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "bool",
          warning: `Cross-type comparison of number ${operator} dictionary, the dictionary is implicitly converted to 0 at runtime.`
        };
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of number ${operator} dictionary, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of number ${operator} dictionary, always true.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Dictionaries are always converted to false for logical expressions, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Dictionaries are always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `number op binary` expression.
   * @param operator 
   * @returns 
   */
  static binopBin(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Cross-type addition of number ${operator} binary, results in a runtime conversion error.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: number ${operator} binary`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: number ${operator} binary`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: number ${operator} binary`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: number ${operator} binary`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "error",
          error: `Cross-type comparison of number ${operator} binary, results in a runtime error ('compare (${operator}) with binary data').`
        };
      case "==":
      case "!=":
        return {
          type: "error",
          error: `Cross-type comparison of number ${operator} binary ('compare (${operator}) binary data with data of other type').`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Binary data is always converted to false for logical expressions, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Binary data is always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `number op date` expression.
   * @param operator 
   * @returns 
   */
  static binopDate(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "date",
          warning: `Cross-type addition of number ${operator} date, the number is interpreted as time in seconds.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: number ${operator} date`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: number ${operator} date`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: number ${operator} date`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: number ${operator} date`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of number ${operator} date, the date is converted to epoch timestamp in seconds.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Dates are always converted to false for logical expressions, always false.`
        }
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Dates are always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }
}

/**
 * Static analysis-time boolean type.
 */
export class BoolType {
  /**
   * Returns the result type of a `bool op *` expression.
   * @param operator 
   * @param rhs 
   */
  static binop(operator: string, rhs: ValueType) {
    switch(rhs) {
      case "array":
        return this.binopArray(operator);
      case "binary":
        return this.binopBin(operator);
      case "bool":
        return this.binopBool(operator);
      case "date":
        return this.binopDate(operator);
      case "dictionary":
        return this.binopDict(operator);
      case "void":
      case "null":
        return this.binopNull(operator);
      case "number":
        return this.binopNumber(operator);
      case "string":
        return this.binopString(operator);
      case "node":
        // TODO
      case "type":
        // TODO
      default:
        throw new TcError(`Unsupported RHS type in binary expression: ${rhs}.`);
    }
  }

  /**
   * Returns the result type of a `bool op number` expression.
   * @param operator 
   * @returns 
   */
  static binopNumber(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Illegal operation: bool ${operator} number`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: bool ${operator} number`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: bool ${operator} number`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: bool ${operator} number`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: bool ${operator} number`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "bool",
          warning: `Cross-type comparison of bool and number types results in implicit bool->number conversion at runtime.`
        };
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of bool and number types results in implicit number->bool conversion at runtime.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of bool and number types results in implicit number->bool conversion at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `bool op string` expression.
   * @param operator 
   * @returns 
   */
  static binopString(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "string",
          warning: `Cross-type concatenation of bool ${operator} string, results in implicit bool->string conversion at runtime.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: number ${operator} bool`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: number ${operator} bool`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: number ${operator} bool`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: number ${operator} bool`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of number and string types results in implicit string parsing at runtime.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of number and string types results in implicit string parsing at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `bool op bool` expression.
   * @param operator 
   * @returns 
   */
  static binopBool(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Illegal operation, ADDITION with incompatible data types: bool ${operator} bool`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACTION with incompatible data types: bool ${operator} bool`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: bool ${operator} bool`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: bool ${operator} bool`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: bool ${operator} bool`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "error",
          error: `A boolean can only be compared to another boolean using == or != operators. You need to convert it to a type for which ${operator} operator is defined.`
        };
      case "==":
      case "!=":
      case "&&":
      case "&":
      case "||":
      case "|":
        return {type: "bool"};
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `bool op null` expression.
   * @param operator 
   * @returns 
   */
  static binopNull(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "bool",
          warning: `Cross-type addition of bool ${operator} null, the boolean value is returned unchanged.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: bool ${operator} null`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: bool ${operator} null`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: bool ${operator} null`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: bool ${operator} null`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type null comparison (bool ${operator} null), always false.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Cross-type logical expression of bool ${operator} null, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type null comparison (bool ${operator} null), always true.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of bool ${operator} null, the null value is implicitly converted to false.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `bool op array` expression.
   * @param operator 
   * @returns 
   */
  static binopArray(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
        return {
          type: "array",
          warning: `Cross-type operation of bool ${operator} array, applies the operation to each element.`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "array",
          warning: `Cross-type comparison of bool ${operator} array, returns an array of element comparisons.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Arrays are always converted to false for logical expressions, this expression always returns false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Arrays are always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `bool op dictionary` expression.
   * @param operator 
   * @returns 
   */
  static binopDict(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Cross-type addition of bool ${operator} dictionary results in a runtime error.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: bool ${operator} dictionary`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: bool ${operator} dictionary`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: bool ${operator} dictionary`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: bool ${operator} dictionary`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "bool",
          warning: `Cross-type comparison of bool ${operator} dictionary, both values are implicitly converted to numbers at runtime.`
        };
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of bool ${operator} dictionary, the dictionary is implicitly converted to false at runtime.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Dictionaries are always converted to false for logical expressions, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Dictionaries are always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `bool op binary` expression.
   * @param operator 
   * @returns 
   */
  static binopBin(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Cross-type addition of bool ${operator} binary, results in a runtime error.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: bool ${operator} binary`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: bool ${operator} binary`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: bool ${operator} binary`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: bool ${operator} binary`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "error",
          error: `Cross-type comparison of bool ${operator} binary, results in a runtime error ('compare (${operator}) with binary data').`
        };
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of bool ${operator} binary, binary data is implicitly converted to false at runtime.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Binary data is always converted to false for logical expressions, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Binary data is always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `bool op date` expression.
   * @param operator 
   * @returns 
   */
  static binopDate(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Cross-type addition of bool ${operator} date, results in a runtime error.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: bool ${operator} date`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: bool ${operator} date`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: bool ${operator} date`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: bool ${operator} date`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "bool",
          warning: `Cross-type comparison of bool ${operator} date, both values are implicitly converted to numbers.`
        };
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of bool ${operator} date, the date is implicitly converted to false at runtime.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Dates are always converted to false for logical expressions, always false.`
        }
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Dates are always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }
}

/**
 * Static analysis-time string type.
 */
export class StringType {
  /**
   * Returns the result type of a `string op *` expression.
   * @param operator 
   * @param rhs 
   */
  static binop(operator: string, rhs: ValueType) {
    switch(rhs) {
      case "array":
        return this.binopArray(operator);
      case "binary":
        return this.binopBin(operator);
      case "bool":
        return this.binopBool(operator);
      case "date":
        return this.binopDate(operator);
      case "dictionary":
        return this.binopDict(operator);
      case "void":
      case "null":
        return this.binopNull(operator);
      case "number":
        return this.binopNumber(operator);
      case "string":
        return this.binopString(operator);
      case "node":
        // TODO
      case "type":
        // TODO
      default:
        throw new TcError(`Unsupported RHS type in binary expression: ${rhs}.`);
    }
  }

  /**
   * Returns the result type of a `string op number` expression.
   * @param operator 
   * @returns 
   */
  static binopNumber(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "string",
          warning: `Cross-type concatenation of string ${operator} number, results in implicit number->string conversion at runtime.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: string ${operator} number`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: string ${operator} number`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: string ${operator} number`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: string ${operator} number`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} number, results in implicit string parsing at runtime.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of string ${operator} number, results in implicit conversions at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `string op string` expression.
   * @param operator 
   * @returns 
   */
  static binopString(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {type: "string"};
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: string ${operator} string`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: string ${operator} string`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: string ${operator} string`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: string ${operator} string`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {type: "bool"};
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of string ${operator} string, results in implicit conversions at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `string op bool` expression.
   * @param operator 
   * @returns 
   */
  static binopBool(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "string",
          warning: `Cross-type concatenation of string ${operator} bool, results in implicit bool->string conversion at runtime.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: string ${operator} bool`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: string ${operator} bool`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: string ${operator} bool`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: string ${operator} bool`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} bool, results in multiple implicit conversions at runtime.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of string ${operator} bool, results in multiple implicit conversions at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `string op null` expression.
   * @param operator 
   * @returns 
   */
  static binopNull(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "string",
          warning: `Cross-type concatenation of string ${operator} null, null values are implicitly converted to empty strings (string ${operator} "").`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: string ${operator} null`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: string ${operator} null`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: string ${operator} null`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: string ${operator} null`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} null, always false.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Null values are converted to 'false', always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} null, always true.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of number ${operator} bool, results in multiple implicit conversions at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `string op array` expression.
   * @param operator 
   * @returns 
   */
  static binopArray(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
        return {
          type: "array",
          warning: `Cross-type operation of string ${operator} array, applies the operation to each element.`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "array",
          warning: `Cross-type comparison of string ${operator} array returns an array of element comparison results.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Arrays are always converted to false for logical expressions, this expression always returns false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Arrays are always converted to false for logical expressions. Results in multiple implicit conversions at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `string op dictionary` expression.
   * @param operator 
   * @returns 
   */
  static binopDict(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Cross-type addition of string ${operator} dictionary, results in a runtime conversion error.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: number ${operator} dictionary`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: number ${operator} dictionary`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: number ${operator} dictionary`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: number ${operator} dictionary`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} dictionary, results in multiple implicit conversions at runtime.`
        };
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} dictionary, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} dictionary, always true.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Dictionaries are always converted to false for logical expressions, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Dictionaries are always converted to false for logical expressions. Results in implicit string parsing at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `string op binary` expression.
   * @param operator 
   * @returns 
   */
  static binopBin(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Cross-type concatenation of string ${operator} binary, results in a runtime conversion error.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: string ${operator} binary`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: string ${operator} binary`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: string ${operator} binary`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: string ${operator} binary`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "error",
          error: `Cross-type comparison of string ${operator} binary, results in a runtime error ('compare (${operator}) with binary data').`
        };
      case "==":
      case "!=":
        return {
          type: "error",
          error: `Cross-type comparison of number ${operator} binary ('compare (${operator}) binary data with data of other type').`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Binary data is always converted to false for logical expressions, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Binary data is always converted to false for logical expressions. Results in implicit string parsing at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `string op date` expression.
   * @param operator 
   * @returns 
   */
  static binopDate(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "string",
          warning: `Cross-type concatenation of string ${operator} date, date is converted to YYYY-MM-DD HH:MM:SS format.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: string ${operator} date`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: string ${operator} date`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: string ${operator} date`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: string ${operator} date`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} date, results in multiple implicit conversions at runtime.`
        };
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} date, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of string ${operator} date, always true.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Dates are always converted to false for logical expressions, always false.`
        }
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Dates are always converted to false for logical expressions.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }
}

/**
 * Static analysis-time null type.
 */
export class NullType {
  /**
   * Returns the result type of a `null op *` expression.
   * @param operator 
   * @param rhs 
   */
  static binop(operator: string, rhs: ValueType) {
    switch(rhs) {
      case "array":
        return this.binopArray(operator);
      case "binary":
        return this.binopBin(operator);
      case "bool":
        return this.binopBool(operator);
      case "date":
        return this.binopDate(operator);
      case "dictionary":
        return this.binopDict(operator);
      case "void":
      case "null":
        return this.binopNull(operator);
      case "number":
        return this.binopNumber(operator);
      case "string":
        return this.binopString(operator);
      case "node":
        // TODO
      case "type":
        // TODO
      default:
        throw new TcError(`Unsupported RHS type in binary expression: ${rhs}.`);
    }
  }

  /**
   * Returns the result type of a `null op number` expression.
   * @param operator 
   * @returns 
   */
  static binopNumber(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
        return {
          type: "number",
          warning: `Cross-type multiplication of null ${operator} number. Null values are converted to 0 at runtime.`
        };
      case "*":
        return {
          type: "number",
          warning: `Cross-type multiplication of null ${operator} number. Null values are converted to 0 at runtime, always 0.`
        };
      case "/":
        return {
          type: "number",
          warning: `Cross-type division of null ${operator} number. Null values are converted to 0 at runtime, this expression always results in 0 or error.`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: null ${operator} number`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} number, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} number, always true.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Cross-type logical expression of null ${operator} number, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of null ${operator} number, results in implicit number->bool conversion at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `null op string` expression.
   * @param operator 
   * @returns 
   */
  static binopString(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "string",
          warning: `Cross-type concatenation of null ${operator} string, the null value is implicitly converted to an empty string.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible types: null ${operator} bool`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: null ${operator} bool`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: null ${operator} bool`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: null ${operator} bool`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} string, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} string, always true.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Cross-type logical expression of null ${operator} string, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of null ${operator} string, results in implicit string parsing at runtime.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `null op bool` expression.
   * @param operator 
   * @returns 
   */
  static binopBool(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "error",
          error: `Illegal operation, ADDITION with incompatible data types: null ${operator} bool`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACTION with incompatible data types: null ${operator} bool`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: null ${operator} bool`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: null ${operator} bool`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: null ${operator} bool`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} bool, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} bool, always true.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Cross-type logical expression of null ${operator} bool, always false.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of null ${operator} bool, null value is implicitly converted to false.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `null op null` expression.
   * @param operator 
   * @returns 
   */
  static binopNull(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
        return {type: "null"};
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible types: null ${operator} null`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible types: null ${operator} null`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible types: null ${operator} null`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} null, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} null, always true.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type logical expression of null ${operator} null, always false.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `null op array` expression.
   * @param operator 
   * @returns 
   */
  static binopArray(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
        return {
          type: "array",
          warning: `Cross-type operation of null ${operator} array, applies the operation to each element.`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "array",
          warning: `Cross-type comparison of null ${operator} array, returns an array of element comparisons.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Arrays are always converted to false for logical expressions, this expression always returns false.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `null op dictionary` expression.
   * @param operator 
   * @returns 
   */
  static binopDict(operator: string): TypeInfo {
    switch(operator) {
      case "+":
      case "-":
      case "*":
        return {
          type: "error",
          error: `Cross-type operation of null ${operator} dictionary results in a runtime conversion error.`
        };
      case "/":
        return {
          type: "error",
          error: `Cross-type operation of null ${operator} dictionary results in a runtime error.`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: null ${operator} dictionary`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} dictionary, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} dictionary, always true.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Null values and dictionaries are always converted to false for logical expressions, always false.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `null op binary` expression.
   * @param operator 
   * @returns 
   */
  static binopBin(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "binary",
          warning: `Cross-type addition of null ${operator} binary, returns the binary value unchanged.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: null ${operator} binary`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: null ${operator} binary`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: null ${operator} binary`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: null ${operator} binary`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} binary, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} binary, always true.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Null values and binary data are converted to false for logical expressions, always false.`
        };
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }

  /**
   * Returns the result type of a `null op date` expression.
   * @param operator 
   * @returns 
   */
  static binopDate(operator: string): TypeInfo {
    switch(operator) {
      case "+":
        return {
          type: "date",
          warning: `Cross-type addition of null ${operator} date, returns the unchanged date object.`
        };
      case "-":
        return {
          type: "error",
          error: `Illegal operation, SUBTRACT with incompatible data types: null ${operator} date`
        };
      case "*":
        return {
          type: "error",
          error: `Illegal operation, MULTIPLICATION with incompatible data types: null ${operator} date`
        };
      case "/":
        return {
          type: "error",
          error: `Illegal operation, DIVISION with incompatible data types: null ${operator} date`
        };
      case "^":
        return {
          type: "error",
          error: `Illegal operation, POW with incompatible data types: null ${operator} date`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} date, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of null ${operator} date, always true.`
        };
      case "&&":
      case "&":
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Null values and dates are always converted to false for logical expressions, always false.`
        }
      default:
        throw new TcError(`Unsupported binary operator ${operator}`);
    }
  }
}
