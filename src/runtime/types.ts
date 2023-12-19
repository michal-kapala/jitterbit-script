import { 
  ArrayVal,
  BooleanVal,
  DictVal,
  NullVal,
  NumberVal,
  RuntimeVal,
  StringVal
} from "./values";

/**
 * Runtime value of an array object.
 */
export class Array implements ArrayVal {
  type: "array";
  members: RuntimeVal[];

  /**
   * Max array size in null values; around 226500, with 227000 Jitterbit Studio throws Java heap limit exception.
   * Tested on a bare script with default heap settings (`-Xms512m -Xmx1024m`).
   */
  static readonly MAX_ARRAY_SIZE = 226500;

  constructor(m: RuntimeVal[] = []) {
    this.type = "array";
    this.members = m;
  }

  clone() {
    return new Array(this.members);
  }

  decrement() {
    for(const idx in this.members)
      this.members[idx].decrement();

    return this;
  }

  increment() {
    for(const idx in this.members)
      this.members[idx].increment();
    
    return this;
  }

  negate() {
    for(const idx in this.members)
      this.members[idx].negate();
    
    return this as Array;
  }

  negative() {
    for(const idx in this.members)
      this.members[idx].negative();
    
    return this;
  }

  toBool(): never {
    throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
  }

  toNumber(): never {
    throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
  }

  toString() {
    let result = "{";
    for(const mem of this.members) {
      result = result.concat(
        result.length === 1 ? "": ",",
        `${mem.toString()}"`
      );
    }
    result += "}";
    return result;
  }

  /**
   * Returns a reference to the accessed member.
   * @param key 
   * @returns 
   */
  get(key: RuntimeVal): RuntimeVal {
    const index = Array.keyValueToNumber(key);
  
    if (!Array.checkIndex(index)) {
      return new JbNull();
    }
    
    // computed index out of bounds
    if (index >= this.members.length) {
      this.members.push(new JbNull());
      // Inserts the null values and mutates the scope
      // Resizes to index of elements with null values
      if(index >= this.members.length)
        console.warn(`InterpreterWarning: Specified index value out of bounds, the original array is resized to ${index} with null values`);
      for(let i = index; i >= this.members.length; i--)
        this.members.push(new JbNull());
  
      return new JbNull();
    }
    
    return this.members[index];
  }

  /**
   * Performs member assignment via LHS member expression.
   * @param newValue 
   * @param index 
   * @returns 
   */
  set(index: number, newValue: RuntimeVal): RuntimeVal {
    // handle out-of-bounds index
    if (index >= this.members.length) {
      
      for(let i = index; i > this.members.length; i--) {
        console.warn(`InterpreterWarning: Specified index value out of bounds, the original array is resized to ${index+1} with null values`);
        this.members.push(new JbNull());
      }
  
      this.members.push(newValue);
      return newValue;
    }
    
    this.members[index] = newValue;
    return newValue;
  }

  /**
   * Converts a key value of any type to a number.
   * @param key 
   * @returns 
   */
  static keyValueToNumber(key: RuntimeVal): number {
    switch (key.type) {
      case "number":
        return (key as JbNumber).value;
      case "bool":
        return (key as JbBool).toNumber();
      case "string":
        return (key as JbString).value === "" ? 0 : NaN;
      case "null":
        return (key as JbNull).toNumber();
      case "array":
      case "dictionary":
        // same for dict
        throw `Evaluation of array index error`;
      default:
        throw `Unsupported member expression key type: ${key.type}`;
    }
  }

  /**
   * Checks if the number is a valid array index.
   * @param index 
   * @returns 
   */
  static checkIndex(index: number): boolean {
    if(index < 0)
      throw `Invalid array index: ${index}`;
  
    // limit testing warning
    if(index > Array.MAX_ARRAY_SIZE)
      console.warn(`Index of ${index} exceeds maximum array size for Jitterbit Studio's default Java heap (1GB)`);
  
    // non-empty strings evaluate to NaN and dont affect the array size
    // float indices return null values
    if (Number.isNaN(index) || !Number.isInteger(index)) {
      return false;
    }
  
    return true;
  }

  /**
   * Performs additive number assignments on all the members (recursively for member arrays).
   * @param numVal 
   * @param operator `-=` or `+=`
   * @param lhs Determines if `numVal` is LHS, true by default.
   * @returns 
   */
  assignNumber(numVal: JbNumber, operator: string, lhs = true) {
    const members = this.members;
    for(const idx in members)
    {
      switch (members[idx].type) {
        case "number":
          if(operator === "+=")
            (members[idx] as JbNumber).value += numVal.value;
          else if(lhs)
            (members[idx] as JbNumber).value = numVal.value - (members[idx] as JbNumber).value;
          else
            (members[idx] as JbNumber).value -= numVal.value;
          break;
        case "string":
          // if the string is a parseable number or empty, concatenate the number as string
          // note - cannot reproduce this case
          // if(Number.isNaN(parseFloat((members[idx] as StringVal).value)) && (members[idx] as StringVal).value !== "")
          //   throw `Cannot set the data element of array type with a string: "<array literal>"`;
  
          if(operator === "+=") {
            if(lhs)
              (members[idx] as JbString).value = numVal.toString() + (members[idx] as JbString).value;
            else
              (members[idx] as JbString).value += numVal.toString();
          } 
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? numVal.type : members[idx].type } - ${lhs ? members[idx].type : numVal.type }`;
          break;
        case "null":
          if(operator === "+=" || lhs)
            members[idx] = numVal;
          else
            members[idx] = numVal.negative();
          break;
        case "array":
          members[idx] = (members[idx] as Array).assignNumber(numVal, operator, lhs);
          break;
        case "bool":
        case "dictionary":
          throw `Cannot set the data element of array type with a string: "<array literal>"`;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return this;
  }

  /**
   * Performs additive null assignments on all the members (recursively for member arrays).
   * @param nullVal 
   * @param operator `-=` or `+=`
   * @param lhs Determines if `nullVal` is LHS, true by default.
   * @returns 
   */
  assignNull(nullVal: JbNull, operator: string, lhs = true) {
    const members = this.members;
    for(const idx in members)
    {
      switch (members[idx].type) {
        case "number":
          if(operator === "+=" || !lhs)
            break;
          else
            (members[idx] as JbNumber).negative();
          break;
        case "string":
          if(operator === "+=" || !lhs)
            break;
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? nullVal.type : members[idx].type} - ${lhs ? members[idx].type : nullVal.type}`;
        case "bool":
          if(operator === "+=")
            break;
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? nullVal.type : members[idx].type} - ${lhs ? members[idx].type : nullVal.type}`;
        case "null":
          break;
        case "array":
          members[idx] = (members[idx] as Array).assignNull(nullVal, operator, lhs);
          break;
        case "dictionary":
          throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return this;
  }

  /**
   * Performs additive bool assignments on all the members (recursively for member arrays).
   * @param boolVal 
   * @param operator `-=` or `+=`
   * @param lhs Determines if `boolVal` is LHS, true by default.
   * @returns 
   */
  assignBool(boolVal: JbBool, operator: string, lhs = true) {
    const members = this.members;
    for(const idx in members) {
      switch (members[idx].type) {
        case "number":
          throw `Illegal operation: ${lhs ? members[idx].type : boolVal.type} ${operator} ${lhs ? boolVal.type : members[idx].type}`;
        case "bool":
          throw `Illegal operation, ${operator === "+=" ? "ADDITION" : "SUBTRACT"} with incompatible data types: bool ${operator === "+=" ? "+" : "-"} bool`;
        case "string":
          if(operator === "+=")
            (members[idx] as JbString).value += boolVal.toString();
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? boolVal.type : members[idx].type} - ${lhs ? members[idx].type : boolVal.type}`;
          break;
        case "null":
          if(operator === "+=")
            members[idx] = boolVal;
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? boolVal.type : members[idx].type} - ${lhs ? members[idx].type : boolVal.type}`;
          break;
        case "array":
          members[idx] = (members[idx] as Array).assignBool(boolVal, operator, lhs);
          break;
        case "dictionary":
          if(operator === "+=")
            throw `Illegal operation: ${members[idx].type} += ${boolVal.type}`;
          throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? boolVal.type : members[idx].type} - ${lhs ? members[idx].type : boolVal.type}`;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return this;
  }

  /**
   * Performs additive string assignments on all the members (recursively for member arrays).
   * @param strVal
   * @param operator `-=` or `+=`
   * @param lhs Determines if `strVal` is LHS, true by default.
   * @returns 
   */
  assignString(strVal: JbString, operator: string, lhs = true) {
    const members = this.members;
    for(const idx in members) {
      switch (members[idx].type) {
        case "number":
          if(operator === "+=") {
            // concat
            if(lhs)
              members[idx] = new JbString(strVal.value + (members[idx] as JbNumber).toString());
            else
              members[idx] = new JbString((members[idx] as JbNumber).toString() + strVal.value);
          }
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? strVal.type : members[idx].type} - ${lhs ? members[idx].type : strVal.type}`;
          break;
        case "bool":
          // bool2int2string and concat
          if(operator === "+=") {
            if(lhs)
              members[idx] = new JbString(strVal.value + (members[idx] as JbBool).toString());
            else
              members[idx] = new JbString((members[idx] as JbBool).toString() + strVal.value);
          }
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? strVal.type : members[idx].type} - ${lhs ? members[idx].type : strVal.type}`;
          break;
        case "string":
          // concat
          if(operator === "+=") {
            if(lhs)
              (members[idx] as JbString).value = strVal.value + (members[idx] as JbString).value;
            else
              (members[idx] as JbString).value += strVal.value;
          }
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? strVal.type : members[idx].type} - ${lhs ? members[idx].type : strVal.type}`;
          break;
        case "null":
          // assign string
          if(operator === "+=" || lhs)
            members[idx] = strVal;
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${members[idx].type} - ${strVal.type}`;
          break;
        case "array":
          // nested arrays
          members[idx] = (members[idx] as Array).assignString(strVal, operator, lhs);
          break;
        case "dictionary":
          if(operator === "+=")
            throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
          else
            throw `Illegal operation, SUBTRACT with incompatible data types: ${lhs ? strVal.type : members[idx].type} - ${lhs ? members[idx].type : strVal.type}`;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return this;
  }

  /**
   * Performs additive array assignments on all the members (recursively for member arrays).
   * @param rhs 
   * @param operator 
   * @returns 
   */
  assignArray(rhs: Array, operator: string) {
    if(this.members.length !== rhs.members.length)
      throw `The operator ${operator} operating on two array data elements with inconsistent sizes n1/n2: ${this.members.length}/${rhs.members.length}`;
  
    switch (operator) {
      case "-=":
        return this.assignArraySub(rhs);
      case "+=":
        return this.assignArrayAdd(rhs);
      default:
        throw `Unsupported array assignment operator: ${operator}`;
    }
  }

  /**
   * Performs `array -= array` assignments.
   * @param rhs 
   * @returns 
   */
  private assignArraySub(rhs: Array) {
    const lMembers = this.members;
    const rMembers = rhs.members;
    for (const idx in lMembers) {
      switch (lMembers[idx].type) { 
        case "number":
          switch (rMembers[idx].type) {
            case "number":
              (lMembers[idx] as JbNumber).value -= (rMembers[idx] as JbNumber).value;
              break;
            case "bool":
            case "string":
              throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
            case "null":
              break;
            case "array":
              lMembers[idx] = (rMembers[idx] as Array).assignNumber(
                lMembers[idx] as JbNumber,
                "-=");
              break;
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "bool":
          switch (rMembers[idx].type) {
            case "number":
            case "bool":
            case "string":
            case "null":
            case "dictionary":
              throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
            case "array":
              lMembers[idx] = (rMembers[idx] as Array).assignBool(
                lMembers[idx] as JbBool,
                "-=");
              break;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "string":
          switch (rMembers[idx].type) {
            case "number":
            case "bool":
            case "string":
            case "dictionary":
              throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
            case "null":
              break;
            case "array":
              lMembers[idx] = (rMembers[idx] as Array).assignString(
                lMembers[idx] as JbString,
                "-=");
              break;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "null":
          switch (rMembers[idx].type) {
            case "number":
              lMembers[idx] = new JbNumber((rMembers[idx] as JbNumber).negative().value);
              break;
            case "bool":
            case "string":
              throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
            case "null":
              break;
            case "array":
              lMembers[idx] = (rMembers[idx] as Array).assignNull(
                lMembers[idx] as JbNull,
                "-=");
              break;
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "array":
          switch (rMembers[idx].type) {
            case "number":
              lMembers[idx] = (lMembers[idx] as Array).assignNumber(
                rMembers[idx] as JbNumber,
                "-=", false);
              break;
            case "bool":
              lMembers[idx] = (lMembers[idx] as Array).assignBool(
                rMembers[idx] as JbBool,
                "-=", false);
              break;
            case "string":
              lMembers[idx] = (lMembers[idx] as Array).assignString(
                rMembers[idx] as JbString,
                "-=", false);
              break;
            case "null":
              lMembers[idx] = (lMembers[idx] as Array).assignNull(
                rMembers[idx] as JbNull,
                "-=", false);
              break;
            case "array":
              lMembers[idx] = (lMembers[idx] as Array).assignArraySub(rMembers[idx] as Array);
              break;
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "dictionary":
          switch (rMembers[idx].type) {
            case "bool":
            case "string":
              throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
            case "number":
            case "null":
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            case "array":
              // TODO: recursive function for dict +- array
              throw `Handling for dictionary -= array not yet implemented`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
        default:
          throw `Unsupported LHS array member type: ${lMembers[idx].type}`;
      }
    }
    return this;
  }

  /**
   * Performs `array += array` assignments.
   * @param rhs 
   * @returns 
   */
  private assignArrayAdd(rhs: Array) {
    const lMembers = this.members;
    const rMembers = rhs.members;
    for (const idx in lMembers) {
      switch (lMembers[idx].type) { 
        case "number":
          switch (rMembers[idx].type) {
            case "number":
              (lMembers[idx] as JbNumber).value += (rMembers[idx] as JbNumber).value;
              break;
            case "bool":
              throw `Illegal operation: ${lMembers[idx].type} += ${rMembers[idx].type}`;
            case "string":
              lMembers[idx] = new JbString(
                (lMembers[idx] as JbNumber).toString() + (rMembers[idx] as JbString).value
              );
              break;
            case "null":
              break;
            case "array":
              lMembers[idx] = (rMembers[idx] as Array).assignNumber(
                lMembers[idx] as JbNumber,
                "+=");
              break;
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "bool":
          switch (rMembers[idx].type) {
            case "number":
            case "dictionary":
              throw `Illegal operation: ${lMembers[idx].type} += ${rMembers[idx].type}`;
            case "bool":
              throw `Illegal operation, ADDITION with incompatible data types: ${lMembers[idx].type} + ${rMembers[idx].type}`;
            case "string":
              lMembers[idx] = new JbString(
                (lMembers[idx] as JbBool).toString() + (rMembers[idx] as JbString).value
              );
              break;
            case "null":
              break;
            case "array":
              lMembers[idx] = (rMembers[idx] as Array).assignBool(
                lMembers[idx] as JbBool,
                "+=");
              break;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "string":
          switch (rMembers[idx].type) {
            case "number":
              (lMembers[idx] as JbString).value += (rMembers[idx] as JbNumber).toString();
              break;
            case "bool":
              (lMembers[idx] as JbString).value += (rMembers[idx] as JbBool).toString();
              break;
            case "string":
              (lMembers[idx] as JbString).value += (rMembers[idx] as JbString).value;
              break;
            case "null":
              break;
            case "array":
              lMembers[idx] = (rMembers[idx] as Array).assignString(
                lMembers[idx] as JbString,
                "+=");
              break;
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "null":
          switch (rMembers[idx].type) {
            case "number":
            case "bool":
            case "string":
              lMembers[idx] = rMembers[idx];
              break;
            case "null":
              break;
            case "array":
              lMembers[idx] = (rMembers[idx] as Array).assignNull(
                lMembers[idx] as JbNull,
                "+=");
              break;
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "array":
          switch (rMembers[idx].type) {
            case "number":
              lMembers[idx] = (lMembers[idx] as Array).assignNumber(
                rMembers[idx] as JbNumber,
                "+=", false);
              break;
            case "bool":
              lMembers[idx] = (lMembers[idx] as Array).assignBool(
                rMembers[idx] as JbBool,
                "+=", false);
              break;
            case "string":
              lMembers[idx] = (lMembers[idx] as Array).assignString(
                rMembers[idx] as JbString,
                "+=", false);
              break;
            case "null":
              lMembers[idx] = (lMembers[idx] as Array).assignNull(
                rMembers[idx] as JbNull,
                "+=", false);
              break;
            case "array":
              lMembers[idx] = (lMembers[idx] as Array).assignArrayAdd(rMembers[idx] as Array);
              break;
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
          break;
        case "dictionary":
          switch (rMembers[idx].type) {
            case "bool":
            case "string":
              throw `Illegal operation, SUBTRACT with incompatible data types: ${lMembers[idx].type} - ${rMembers[idx].type}`;
            case "number":
            case "null":
            case "dictionary":
              throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
            case "array":
              // TODO: recursive function for dict +- array
              throw `Handling for dictionary += array not yet implemented`;
            default:
              throw `Unsupported RHS array member type: ${lMembers[idx].type}`;
          }
        default:
          throw `Unsupported LHS array member type: ${lMembers[idx].type}`;
      }
    }
    return this;
  }
}

/**
   * Jitterbit dictionary object.
   */
export class Dictionary implements DictVal {
  type: "dictionary";
  members: Map<string, RuntimeVal>;

  constructor(m = new Map<string, RuntimeVal>()) {
    this.type = "dictionary";
    this.members = m;
  }

  clone(): RuntimeVal {
    return new Dictionary(this.members);
  }

  decrement(): RuntimeVal {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: --");
  }

  increment(): RuntimeVal {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: ++");
  }

  negate(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: !");
  }

  negative(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: -");
  }

  toBool(): never {
    throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
  }

  toNumber(): never {
    throw `Transform Error: DE_TYPE_CONVERT_FAILED`;
  }

  toString(): string {
    let result = "[";
    for(const mem of this.members) {
      result = result.concat(
        result.length === 1 ? "": ",",
        `${mem[0]}=>"${mem[1].toString()}"`
      );
    }
    result += "]";
    return result;
  }

  /**
   * Returns a dictionary member.
   * @param keyVal 
   * @returns 
   */
  get(keyVal: RuntimeVal): RuntimeVal {
    const key = this.keyValueToString(keyVal);
    const result = this.members.get(key);
    return result ?? new JbNull();
  }

  /**
   * Adds or updates a dictionary member value.
   * @param keyVal 
   * @param newValue 
   * @returns 
   */
  set(keyVal: RuntimeVal, newValue: RuntimeVal): RuntimeVal {
    const key = this.keyValueToString(keyVal);
    this.members.set(key, newValue);
    return newValue;
  }

  /**
   * Converts a member expression key value into a dictionary key.
   * @param key 
   * @returns 
   */
  private keyValueToString(key: RuntimeVal) {
    switch (key.type) {
      case "number":
        return (key as JbNumber).toString();
      case "bool":
        return (key as JbBool).toString();
      case "string":
        return (key as JbString).value;
      case "null":
        throw `A dictionary key can't be NULL`;
      // object types are stringified
      case "dictionary":
        return (key as Dictionary).toString();
      case "array":
        return (key as Array).toString();
      default:
        throw `Unsupported member expression key type: ${key.type}`;
    }
  }
}

/**
 * Runtime bool values.
 */
export class JbBool implements BooleanVal {
  type: "bool";
  value: boolean;

  constructor(b = true) {
    this.type = "bool";
    this.value = b;
  }

  clone(): RuntimeVal {
    return new JbBool(this.value);
  }

  decrement(): RuntimeVal {
    this.value = !this.value;
    return this;
  }

  increment(): RuntimeVal {
    this.value = true;
    return this;
  }

  negate(): RuntimeVal {
    this.value = !this.value;
    return this;
  }

  negative(): RuntimeVal {
    // -true is true
    // -false is false
    return this;
  }

  toBool(): boolean {
    return this.value;
  }

  toString(): string {
    return this.value ? "1" : "0";
  }

  /**
   * Returns the integer representation.
   * @returns 
   */
  toNumber(): number {
    return this.value ? 1 : 0
  }

}

/**
 * Runtime null type.
 */
export class JbNull implements NullVal {
  type: "null";
  value: null;

  constructor() {
    this.type = "null";
    this.value = null;
  }

  clone() {
    return new JbNull();
  }

  decrement(): never {
    // TODO: error message to be changed
    throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: --`;
  }

  increment(): never {
    // TODO: error message to be changed
    throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: ++`;
  }

  negate() {
    return new JbBool(true);
  }

  negative(): never {
    throw `Transform Error: UNKNOWN_DE_TYPE\nThe problematic token is at the end of the following expression: -`;
  }

  toBool() {
    return false;
  }

  toNumber() {
    return 0;
  }

  toString(): string {
    return "null";
  }
}

/**
 * Runtime number type.
 */
export class JbNumber implements NumberVal {
  type: "number";
  value: number;

  constructor(n = 0) {
    this.type = "number";
    this.value = n;
  }

  clone() {
    return new JbNumber(this.value);
  }

  decrement() {
    --this.value;
    return this;
  }

  increment() {
    ++this.value;
    return this;
  }

  negate() {
    return new JbBool(this.value === 0);
  }

  negative() {
    this.value *= -1;
    return this;
  }

  /**
   * Performs Jitterbit's int2bool or float2bool conversion.
   * @returns 
   */
  toBool() {
    return this.value !== 0;
  }

  toNumber() {
    return this.value;
  }

  toString() {
    return this.value.toString();
  }
}

/**
 * Runtime string type.
 */
export class JbString implements StringVal {
  type: "string";
  value: string;

  constructor(s = "") {
    this.type = "string";
    this.value = s;
  }

  clone() {
    return new JbString(this.value);
  }

  decrement() {
    this.value = (this.toNumber() - 1).toString();
    return this;
  }

  increment() {
    this.value = (this.toNumber() + 1).toString();
    return this;
  }

  negate() {
    return new JbBool(this.toNumber() === 0);
  }

  negative() {
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
    let nb = this.toNumber();
    if(this.value[0] === "-") {
      prefix = "";
      nb *= -1;
    }
    return new JbString(prefix + nb.toString());
  }

  toBool() {
    let parseResult = parseFloat(this.value);
    return (!Number.isNaN(parseResult) && parseResult !== 0) || this.value === "true";
  }

  /**
   * Performs Jitterbit's string2number conversion (float-based).
   * 
   * If there's a number at the beginning of the string, Jitterbit truncates the string and tries to parse the longest possible number literal.
   * When successful, the value is returned, otherwise returns 0.
   * @returns 
   */
  toNumber(): number {
    // regular strings evaluate to 0, e.g. 0 == "abcd1234"
    // strings beginning with a parsable number are truncated and parsed
    // for example the below expressions return true:
    // 1234 == "1234abcd5"
    // -0.8 == "-.8abc.-.5"

    const pattern = /^(-{0,1}[0-9]|\.)+/g;
    const matches = this.value.match(pattern);
    
    // regular strings evaluate to 0, e.g. 0 == "abcd1234" is true
    if(matches === null) {
      return 0;
    }

    // always parsable
    return parseFloat(matches[0]);
  }

  toString() {
    return this.value;
  }

  /**
   * Similar to `toBool` but truncates text behind a number literal before parsing.
   * @returns 
   */
  toBoolAsNumber(): boolean {
    let parseResult = this.toNumber();
    return (!Number.isNaN(parseResult) && parseResult !== 0) || this.value === "true";
  }

  /**
   * Performs Jitterbit's string2bool and bool2int conversions to evaluate <, >, <= and >= cross-type binary expressions.
   * 
   * The string value is always LHS.
   * 
   * In lt/gt comparisons, Jitterbit evaluates "true" string to `false`, as well as negative numbers and fractions.
   * @param operator
   * @param boolVal
   * @returns 
   */
  compareWithBool(operator: string, boolVal: JbBool): boolean {
    let parseResult = parseFloat(this.value);
    let strBoolVal = !Number.isNaN(parseResult) && parseResult >= 1;
    let strIntVal = strBoolVal ? 1 : 0;
    let boolIntVal = boolVal.toNumber();

    switch(operator) {
      case "<":
        return strIntVal < boolIntVal;
      case ">":
        return strIntVal > boolIntVal;
      case "<=":
        return strIntVal <= boolIntVal;
      case ">=":
        return strIntVal >= boolIntVal;
      default:
        throw `Unsupported comparison operator ${operator}`;
    } 
  }
}
