import { Identifier, UnaryExpr } from "../../../frontend/ast";
import Scope from "../../scope";
import { evaluate } from "../../interpreter";
import { 
  BooleanVal,
  NumberVal,
  RuntimeVal,
  StringVal,
  jbStringToNumber
} from "../../values";

/**
 * Evaluates unary operator expressions (!, -, --, ++).
 * @param unop 
 * @param scope 
 * @returns 
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
