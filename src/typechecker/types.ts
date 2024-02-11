import { TcError } from "../errors";
import { TypeInfo } from "./ast";

/**
 * Static analysis-time number type.
 */
export class NumberType {
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
        return {type: "string"};
      case "-":
        return {type: "error", error: `Illegal operation, SUBTRACT with incompatible types: number ${operator} string`};
      case "*":
        return {type: "error", error: `Illegal operation, MULTIPLICATION with incompatible types: number ${operator} string`};
      case "/":
        return {type: "error", error: `Illegal operation, DIVISION with incompatible types: number ${operator} string`};
      case "^":
        return {type: "error", error: `Illegal operation, POW with incompatible types: number ${operator} string`};
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
        return {
          type: "bool",
          warning: `Cross-type comparison of number and string types results in implicit string parsing at runtime.`
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
        return {type: "error", error: `Illegal operation: number Add bool`};
      case "-":
        return {type: "error", error: `Illegal operation, SUBTRACT with incompatible types: number ${operator} bool`};
      case "*":
        return {type: "error", error: `Illegal operation, MULTIPLICATION with incompatible types: number ${operator} bool`};
      case "/":
        return {type: "error", error: `Illegal operation, DIVISION with incompatible types: number ${operator} bool`};
      case "^":
        return {type: "error", error: `Illegal operation, POW with incompatible types: number ${operator} bool`};
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
        return {
          type: "bool",
          warning: `Cross-type comparison of number and bool types results in implicit bool->number conversion at runtime.`
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
        return {type: "number", warning: `Null values are converted to 0 at runtime (number ${operator} 0).`};
      case "/":
        return {type: "error", error: `Illegal operation, division by null (converted to 0 at runtime).`};
      case "^":
        return {type: "error", error: `Illegal operation, POW with incompatible types: number ${operator} null`};
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return {
          type: "bool",
          warning: `Cross-type null comparison (number ${operator} null), always false.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Null values are converted to 'false', this expression is always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Null values are converted to 'false', this expression is always true.`
        };
      case "||":
      case "|":
        return {
          type: "bool",
          warning: `Cross-type comparison of number and bool types results in implicit bool->number conversion at runtime.`
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
          warning: `Cross-type expression of number ${operator} array applies the operation to each element.`
        };
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "!=":
        return {
          type: "array",
          warning: `Cross-type comparison of number and array types returns an array of element comparisons.`
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
          error: `Unsupported cross-type expression of number ${operator} dictionary (results in runtime conversion error).`
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
          warning: "Cross-type comparison of number and dictionary types, the dictionary is implicitly converted to 0 at runtime."
        };
      case "==":
        return {
          type: "bool",
          warning: `Cross-type comparison of number and dictionary types, always false.`
        };
      case "!=":
        return {
          type: "bool",
          warning: `Cross-type comparison of number and dictionary types, always true.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Dictionaries are always converted to false for logical expressions, this expression is always false.`
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
          error: `Unsupported cross-type expression of number ${operator} binary (results in runtime conversion error).`
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
          error: `Cross-type comparison of number and binary types ('compare (${operator}) with binary data').`
        };
      case "==":
      case "!=":
        return {
          type: "error",
          error: `Cross-type comparison of number and binary types ('compare (${operator}) binary data with data of other type').`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Binary data is always converted to false for logical expressions, this expression is always false.`
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
          warning: `Cross-type expression of number ${operator} date, the number is interpreted as time in seconds.`
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
          error: `Cross-type comparison of number and date types, the date is converted to epoch timestamp in seconds.`
        };
      case "&&":
      case "&":
        return {
          type: "bool",
          warning: `Dates are always converted to false for logical expressions, this expression is always false.`
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
