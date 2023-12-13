import { AssignmentExpr, Identifier, MemberExpr } from "../../../frontend/ast";
import Scope from "../../scope";
import { evaluate } from "../../interpreter";
import { ArrayVal, BooleanVal, NullVal, NumberVal, RuntimeVal, StringVal } from "../../values";
import { eval_member_assignment } from "./member";
import { 
  eval_bool_assignment,
  eval_null_assignment,
  eval_number_assignment,
  eval_string_assignment
} from "./array";

/**
 * Executes assignment expressions (excluding incrementation/decrementation).
 * @param node 
 * @param scope 
 * @returns 
 */
export function eval_assignment_expr(
  node: AssignmentExpr,
  scope: Scope,
): RuntimeVal {
  switch (node.assignee.kind) {
    case "Identifier":
    case "GlobalIdentifier":
      const varName = (node.assignee as Identifier).symbol;
      return scope.assignVar(varName, evaluate(node.value, scope), node.operator.value);
    case "MemberExpr":
      return eval_member_assignment(node.assignee as MemberExpr, node, scope);
    default:
      // the original error:
      // The left hand side of the assignment operator '=' must be a local or global data element, such as x=... or $x=... error occured
      throw `Invalid LHS inside assignment expr ${JSON.stringify(node.assignee)}`;
  }
}

export function evalAssignment(lhs: RuntimeVal, rhs: RuntimeVal, operator: string): RuntimeVal {
  switch (operator) {
    case "=":
      return rhs;
    case "-=":
      if(lhs.type === rhs.type && lhs.type === "number") {
        let newValue = rhs as NumberVal;
        newValue.value = (lhs as NumberVal).value - (rhs as NumberVal).value;
        return newValue;
      }
      // simple type null interactions
      // string -= null
      // null -= string
      // bool -= null
      // null -= bool
      // number -= null
      // null -= number
      else if (
        lhs.type === "string" && rhs.type === "null" ||
        lhs.type === "null" && rhs.type === "string" ||
        lhs.type === "bool" && rhs.type === "null" ||
        lhs.type === "null" && rhs.type === "bool" ||
        lhs.type === "number" && rhs.type === "null" ||
        lhs.type === "null" && rhs.type === "number"
      ) {
        if(lhs.type === "null") {
          switch (rhs.type) {
            case "number":
              let newValue = {
                ...rhs,
                value: (rhs as NumberVal).value * -1
              } as NumberVal;
              return newValue;
            case "bool":
            case "string":
              throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs.type} - ${rhs.type}`
          }
        } 
        else {
          switch (lhs.type) {
            case "number":
            case "string":
              return lhs;
            case "bool":
              throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs.type} - ${rhs.type}`
          }
        }
      }

      // arrays

      // null -= array
      // array -= null
      else if (
        lhs.type === "null" && rhs.type === "array" ||
        lhs.type === "array" && rhs.type === "null"
      ) {
        // if(isGlobal)
        //   console.warn(`InterpreterWarning: Expression of type ${lhs.type} -= ${rhs.type} on a global variable. This and further operations on this array can result in errors and unstable behaviour.`);

        const isLhs = lhs.type === "null";
        const nullVal = (isLhs ? lhs : rhs) as NullVal;
        let arrVal = (isLhs ? rhs : lhs) as ArrayVal;
        arrVal = eval_null_assignment(arrVal, nullVal, operator, isLhs);
        return arrVal;
      }
      // number -= array
      // array -= number
      else if (
        lhs.type === "number" && rhs.type === "array" ||
        lhs.type === "array" && rhs.type === "number"
      ) {
        const isLhs = lhs.type === "number";
        const numVal = (isLhs ? lhs : rhs) as NumberVal;
        let arrVal = (isLhs ? rhs : lhs) as ArrayVal;
        arrVal = eval_number_assignment(arrVal, numVal, operator, isLhs);
        return arrVal;
      }
      // bool -= array
      // array -= bool
      else if (
        lhs.type === "bool" && rhs.type === "array" ||
        lhs.type === "array" && rhs.type === "bool"
      ) {
        const isLhs = lhs.type === "bool";
        const boolVal = (isLhs ? lhs : rhs) as BooleanVal;
        let arrVal = (isLhs ? rhs : lhs) as ArrayVal;
        arrVal = eval_bool_assignment(arrVal, boolVal, operator, isLhs);
        return arrVal;
      }
      // string -= array
      // array -= string
      else if (
        lhs.type === "string" && rhs.type === "array" ||
        lhs.type === "array" && rhs.type === "string"
      ) {
        const isLhs = lhs.type === "string";
        const strVal = (isLhs ? lhs : rhs) as StringVal;
        let arrVal = (isLhs ? rhs : lhs) as ArrayVal;
        arrVal = eval_string_assignment(arrVal, strVal, operator, isLhs);
        return arrVal;
      }
      else
        // currently returns interpreter types rather than strict JB types (e.g. 'number' instead of int/double)
        // string -= string
        // bool -= bool
        // null -= bool
        // bool -= null
        // string -= number
        // number -= string
        // string -= bool
        // bool -= string
        // number -= bool
        // bool -= number
        throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs.type} - ${rhs.type}`;
    case "+=":
      // number += number
      if(lhs.type === rhs.type && rhs.type === "number") {
        let newValue = rhs as NumberVal;
        newValue.value = (lhs as NumberVal).value + (rhs as NumberVal).value;
        return newValue;
      }
      // string += string
      else if (lhs.type === rhs.type && rhs.type === "string") {
        let newValue = rhs as StringVal;
        newValue.value = (lhs as StringVal).value + (rhs as StringVal).value;
        return newValue;
      }
      // bool + bool (unsupported)
      else if (lhs.type === rhs.type && rhs.type === "bool") {
        throw `Illegal operation, ADDITION with incompatible data types: ${lhs.type} + ${rhs.type}`;
      }
      // string += bool - implicit type conversion to string
      else if (lhs.type === "string" && rhs.type === "bool") {
        let stringVal = (lhs as StringVal).value;
        let boolValue = (rhs as BooleanVal).value;
        let newValue = {
          type: "string",
          value: stringVal + (boolValue ? "1" : "0")
        } as StringVal;
        return newValue;
      }
      // bool += string - implicit type conversion to string
      else if (lhs.type === "bool" && rhs.type === "string") {
        let boolValue = (lhs as BooleanVal).value;
        let stringVal = (rhs as StringVal).value;
        let newValue = {
          type: "string",
          value: (boolValue ? "1" : "0") + stringVal
        } as StringVal;
        return newValue;
      }
      // string += number - implicit type conversion to string
      else if (lhs.type === "string" && rhs.type === "number") {
        let stringVal = (lhs as StringVal).value;
        let numberValue = (rhs as NumberVal).value;
        let newValue = {
          type: "string",
          value: stringVal + numberValue.toString()
        } as StringVal;
        return newValue;
      }
      // number += string - implicit type conversion to string
      else if (lhs.type === "number" && rhs.type === "string") {
        let numberValue = (lhs as NumberVal).value;
        let stringVal = (rhs as StringVal).value;
        let newValue = {
          type: "string",
          value: numberValue.toString() + stringVal
        } as StringVal;
        return newValue;
      }
      // number += bool (unsupported)
      // bool += number (unsupported)
      else if (
        lhs.type === "number" && rhs.type === "bool" ||
        lhs.type === "bool" && rhs.type === "number"
      ) {
        throw `Illegal operation: ${lhs.type} += ${rhs.type}`
      }

      // arrays
      
      // null += array
      // array += null
      else if (
        lhs.type === "null" && rhs.type === "array" ||
        lhs.type === "array" && rhs.type === "null"
      ) {
        const isLhs = lhs.type === "null";
        const nullVal = (isLhs ? lhs : rhs) as NullVal;
        let arrVal = (isLhs ? rhs : lhs) as ArrayVal;
        arrVal = eval_null_assignment(arrVal, nullVal, operator, isLhs);
        return arrVal;
      }
      // number += array
      // array += number
      else if (
        lhs.type === "number" && rhs.type === "array" ||
        lhs.type === "array" && rhs.type === "number"
      ) {
        const isLhs = lhs.type === "number";
        const numVal = (isLhs ? lhs : rhs) as NumberVal;
        let arrVal = (isLhs ? rhs : lhs) as ArrayVal;
        arrVal = eval_number_assignment(arrVal, numVal, operator, isLhs);
        return arrVal;
      }
      // bool += array
      // array += bool
      else if (
        lhs.type === "bool" && rhs.type === "array" ||
        lhs.type === "array" && rhs.type === "bool"
      ) {
        const isLhs = lhs.type === "bool";
        const boolVal = (isLhs ? lhs : rhs) as BooleanVal;
        let arrVal = (isLhs ? rhs : lhs) as ArrayVal;
        arrVal = eval_bool_assignment(arrVal, boolVal, operator, isLhs);
        return arrVal;
      }
      // string += array
      // array += string
      else if (
        lhs.type === "string" && rhs.type === "array" ||
        lhs.type === "array" && rhs.type === "string"
      ) {
        const isLhs = lhs.type === "string";
        const strVal = (isLhs ? lhs : rhs) as StringVal;
        let arrVal = (isLhs ? rhs : lhs) as ArrayVal;
        arrVal = eval_string_assignment(arrVal, strVal, operator, isLhs);
        return arrVal;
      }
      else
        // currently returns interpreter types rather than strict JB types (e.g. 'number' instead of int/double)
        // call types should not be here, it should be their return value
        // TODO: dictionary and binary type handling
        throw `Illegal operation, ADDITION with incompatible data types: ${lhs.type} + ${rhs.type}`
    default:
      throw `Unknown assignment operator ${operator}`;
  }
}
