import { 
  ArrayVal,
  BinaryVal,
  BooleanVal,
  DateVal,
  DictVal,
  NullVal,
  NumberVal,
  RuntimeVal,
  StringVal
} from "./values";

/**
 * Runtime array type.
 */
export class JbArray implements ArrayVal {
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
    const newMembers: RuntimeVal[] = [];
    for(const rv of this.members)
      newMembers.push(rv.clone());

    return new JbArray(newMembers);
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
      this.members[idx] = this.members[idx].negate();
    
    return this;
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
        `${mem.toString()}`
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
  get(key: RuntimeVal) {
    const index = JbArray.keyValueToNumber(key);
  
    if (!JbArray.checkIndex(index)) {
      return new JbNull();
    }

    // POD: Jitterbit Studio errors for large enough indices
    if(index > JbArray.MAX_ARRAY_SIZE)
      return new JbNull();
    
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
  set(index: number, newValue: RuntimeVal) {
    // POD: Jitterbit Studio errors for large enough indices
    if(index > JbArray.MAX_ARRAY_SIZE)
      return new JbNull();

    // handle out-of-bounds index
    if (index >= this.members.length) {
      for(let i = index; i > this.members.length; i--) {
        console.warn(`InterpreterWarning: Specified index value out of bounds, the original array is resized to ${index+1} with null values`);
        this.members.push(new JbNull());
      }
  
      this.members.push(newValue);
      return newValue;
    }
    
    // negative indices are converted to string keys
    // which makes them inaccessible from get()
    // from the user's perspective those assignments seem to be ignored
    this.members[index] = newValue;
    return newValue;
  }

  /**
   * Converts a key value of any type to a number.
   * @param key 
   * @returns 
   */
  static keyValueToNumber(key: RuntimeVal) {
    switch (key.type) {
      case "number":
      case "bool":
      case "null":
      case "date":
        return key.toNumber();
      case "string":
        return (key as JbString).value === "" ? 0 : NaN;
      case "array":
      case "dictionary":
      case "binary":
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
  static checkIndex(index: number) {
    if(index < 0)
      throw `Invalid array index: ${index}`;
  
    // limit testing warning
    if(index > JbArray.MAX_ARRAY_SIZE)
      console.warn(`RuntimeWarning: Array index of ${index} exceeds maximum array size for Jitterbit Studio's default Java heap (1GB)`);
  
    // non-empty strings evaluate to NaN and dont affect the array size
    // float indices return null values
    if (Number.isNaN(index) || !Number.isInteger(index)) {
      return false;
    }
  
    return true;
  }

  /**
   * Applies a binary operator to array (always LHS).
   * The RHS value is a number.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNumber(operator: string, rhs: JbNumber) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
    }

    for(const idx in this.members)
      this.members[idx] = this.members[idx].binopNumber(operator, rhs);
    return this;
  }

  /**
   * Applies a binary operator to array (always LHS).
   * The RHS value is a bool.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBool(operator: string, rhs: JbBool) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
    }

    for(const idx in this.members)
      this.members[idx] = this.members[idx].binopBool(operator, rhs);
    return this;
  }

  /**
   * Applies a binary operator to array (always LHS).
   * The RHS value is a string.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopString(operator: string, rhs: JbString) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
    }

    for(const idx in this.members)
      this.members[idx] = this.members[idx].binopString(operator, rhs);
    return this;
  }

  /**
   * Applies a binary operator to array (always LHS).
   * The RHS value is a null.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNull(operator: string, rhs: JbNull) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
    }

    for(const idx in this.members)
      this.members[idx] = this.members[idx].binopNull(operator, rhs);
    return this;
  }

  /**
   * Applies a binary operator to array (always LHS).
   * The RHS value is an array too.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopArray(operator: string, rhs: JbArray) {
    if(this.members.length !== rhs.members.length)
      throw `The operator ${operator} operating on two array data elements with inconsistent sizes n1/n2: ${this.members.length}/${rhs.members.length}`;

      switch(operator) {
        case "&&":
        case "&":
        case "||":
        case "|":
          return new JbBool(false);
      }
  
    const lMembers = this.members;
    const rMembers = rhs.members;
  
    for(const idx in lMembers) {
      switch (rMembers[idx].type) {
        case "number":
          lMembers[idx] = lMembers[idx].binopNumber(
            operator,
            rMembers[idx] as JbNumber
          );
          break;
        case "bool":
          lMembers[idx] = lMembers[idx].binopBool(
            operator,
            rMembers[idx] as JbBool
          );
          break;
        case "string":
          lMembers[idx] = lMembers[idx].binopString(
            operator,
            rMembers[idx] as JbString
          );
          break;
        case "null":
          lMembers[idx] = lMembers[idx].binopNull(
            operator,
            rMembers[idx] as JbNull
          );
          break;
        case "array":
          lMembers[idx] = lMembers[idx].binopArray(
            operator,
            rMembers[idx] as JbArray
          );
          break;
        case "dictionary":
          lMembers[idx] = lMembers[idx].binopDict(
            operator,
            rMembers[idx] as JbDictionary
          );
        case "binary":
          lMembers[idx] = lMembers[idx].binopBin(
              operator,
              rMembers[idx] as JbBinary
          );
          break;
        case "date":
          lMembers[idx] = lMembers[idx].binopDate(
              operator,
              rMembers[idx] as JbDate
          );
          break;
        default:
          throw `Unsupported RHS array member type: ${rMembers[idx].type}`;
      }
    }
    return this;
  }

  /**
   * Applies a binary operator to array (always LHS).
   * The RHS value is a dictionary.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopDict(operator: string, rhs: JbDictionary) {
    switch(operator) {
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
    }

    const members = this.members;
    for(const idx in members)
      members[idx] = members[idx].binopDict(operator, rhs);
    return this;
  }

  /**
   * Applies a binary operator to array (always LHS).
   * The RHS value is binary data.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBin(operator: string, rhs: JbBinary) {
    switch(operator) {
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
    }

    const members = this.members;
    for(const idx in members) 
      members[idx] = members[idx].binopBin(operator, rhs);
    return this;
  }

  /**
   * Applies a binary operator to array (always LHS).
   * The RHS value is a date.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopDate(operator: string, rhs: JbDate) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
    }

    const members = this.members;
    for(const idx in members)
      members[idx] = members[idx].binopDate(operator, rhs);
    return this;
  }
}

/**
 * Runtime dictionary type.
 */
export class JbDictionary implements DictVal {
  type: "dictionary";
  members: Map<string, RuntimeVal>;

  constructor(m = new Map<string, RuntimeVal>()) {
    this.type = "dictionary";
    this.members = m;
  }

  clone(): RuntimeVal {
    return new JbDictionary(this.members);
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
    const key = JbDictionary.keyValueToString(keyVal);
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
    const key = JbDictionary.keyValueToString(keyVal);
    this.members.set(key, newValue);
    return newValue;
  }

  /**
   * Converts a member expression key value into a dictionary key.
   * @param key 
   * @returns 
   */
  static keyValueToString(key: RuntimeVal) {
    switch (key.type) {
      case "number":
      case "bool":
      case "string":
      case "array":
      case "dictionary":
      case "binary":
      case "date":
        return key.toString();
      case "null":
        throw new Error(`A dictionary key can't be NULL`);
      default:
        throw `Unsupported member expression key type: ${key.type}`;
    }
  }

  /**
   * Compares two dictionaries by number conversions of the members.
   * @param dict `RHS` dictionary
   * @returns 
   */
  private compareDict(dict: JbDictionary) {
    if(this.members.size !== dict.members.size)
      return false;

    for (let [key, val] of this.members) {
      // missing key
      if(!dict.members.has(key))
        return false;

      // missing value
      const testVal = dict.members.get(key);
      if(testVal === undefined)
        return false;

      // value comparison - conversion to numbers
      // this is very wrong but reflects the original behaviour
      if (testVal.toNumber() !== val.toNumber())
        return false;
    }
    return true;
  }

  /**
   * Applies a binary operator to dictionary (always LHS).
   * The RHS value is a number.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNumber(operator: string, rhs: JbNumber) {
    switch(operator) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
        throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
      case "<":
        // dictionary is implicitly converted to 0
        return new JbBool(0 < rhs.value);
      case ">":
        // dictionary is implicitly converted to 0
        return new JbBool(0 > rhs.value);
      case "<=":
        // dictionary is implicitly converted to 0
        return new JbBool(0 <= rhs.value);
      case ">=":
        // dictionary is implicitly converted to 0
        return new JbBool(0 >= rhs.value);
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to dictionary (always LHS).
   * The RHS value is a bool.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBool(operator: string, rhs: JbBool) {
    switch(operator) {
      case "+":
        throw new Error(`Illegal operation: ${this.type} Add ${rhs.type}`);
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} - ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} * ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} / ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ^ ${rhs.type}`);
      case "<":
        // dictionary is implicitly converted to 0
        return new JbBool(0 < rhs.toNumber());
      case ">":
        // dictionary is implicitly converted to 0
        return new JbBool(0 > rhs.toNumber());
      case "<=":
        // dictionary is implicitly converted to 0
        return new JbBool(0 <= rhs.toNumber());
      case ">=":
        // dictionary is implicitly converted to 0
        return new JbBool(0 >= rhs.toNumber());
      case "==":
        return new JbBool(!rhs.value);
      case "!=":
        return new JbBool(rhs.value);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.value);
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to dictionary (always LHS).
   * The RHS value is a string.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopString(operator: string, rhs: JbString) {
    switch(operator) {
      case "+":
        throw new Error(`Transform Error: DE_TYPE_CONVERT_FAILED`);
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} - ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} * ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} / ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ^ ${rhs.type}`);
      case "<":
        // dictionary is implicitly converted to 0
        return new JbBool(0 < rhs.toNumber());
      case ">":
        // dictionary is implicitly converted to 0
        return new JbBool(0 > rhs.toNumber());
      case "<=":
        // dictionary is implicitly converted to 0
        return new JbBool(0 <= rhs.toNumber());
      case ">=":
        // dictionary is implicitly converted to 0
        return new JbBool(0 >= rhs.toNumber());
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBoolAsNumber());
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to dictionary (always LHS).
   * The RHS value is a null.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNull(operator: string, rhs: JbNull) {
    switch(operator) {
      case "+":
      case "-":
      case "*":
        throw new Error(`Transform Error: DE_TYPE_CONVERT_FAILED`);
      case "/":
        throw new Error(`Illegal operation, division by Null`);
      case "^":
        throw new Error(`Illegal operation: ${this.type} POW ${rhs.type}`);
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
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to dictionary (always LHS).
   * The RHS value is an array.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopArray(operator: string, rhs: JbArray) {
    switch(operator) {
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
    }

    const rMembers = rhs.members;
    for(const idx in rMembers) {
      switch (rMembers[idx].type) {
        case "number":
          rMembers[idx] = this.binopNumber(operator, rMembers[idx] as JbNumber);
          break;
        case "bool":
          rMembers[idx] = this.binopBool(operator, rMembers[idx] as JbBool);
          break;
        case "string":
          rMembers[idx] = this.binopString(operator, rMembers[idx] as JbString);
          break;
        case "null":
          rMembers[idx] = this.binopNull(operator, rMembers[idx] as JbNull);
          break;
        case "array":
          rMembers[idx] = this.binopArray(operator, rMembers[idx] as JbArray);
          break;
        case "dictionary":
          rMembers[idx] = this.binopDict(operator, rMembers[idx] as JbDictionary);
          break;
        case "binary":
          rMembers[idx] = this.binopBin(operator, rMembers[idx] as JbBinary);
          break;
        case "date":
          rMembers[idx] = this.binopDate(operator, rMembers[idx] as JbDate);
          break;
        default:
          throw `Unsupported LHS array member type: ${rMembers[idx].type}`;
      }
    }
    return rhs;
  }

  /**
   * Applies a binary operator to dictionary (always LHS).
   * The RHS value is a dictionary too.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopDict(operator: string, rhs: JbDictionary) {
    switch(operator) {
      case "+":
      case "-":
      case "*":
      case "^":
        throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
      // POD: original error:
      // Illegal operation: division by 0.
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "<":
      case ">":
        // always false
        return new JbBool(false);
      case "<=":
      case ">=":
      case "==":
        return new JbBool(this.compareDict(rhs));
      case "!=":
        return new JbBool(!this.compareDict(rhs));
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to dictionary (always LHS).
   * The RHS value is binary data.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBin(operator: string, rhs: JbBinary) {
    switch(operator) {
      case "+":
        throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
        // ref comparison, only true if compared with self
        return new JbBool(false);
      case "!=":
        // ref comparison, only false if compared with self
        return new JbBool(true);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to a dictionary (always LHS).
   * The RHS value is a date.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDate(operator: string, rhs: JbDate) {
    switch (operator) {
      case "+":
        throw `Illegal operation: ${this.type} Add ${rhs.type}`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case "<=":
      case "!=":
        return new JbBool(true);
      case ">":
      case ">=":
      case "==":
        return new JbBool(false);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }
}

/**
 * Runtime boolean type.
 */
export class JbBool implements BooleanVal {
  type: "bool";
  value: boolean;

  constructor(b = true) {
    this.type = "bool";
    this.value = b;
  }

  clone() {
    return new JbBool(this.value);
  }

  decrement() {
    this.value = !this.value;
    return this;
  }

  increment() {
    this.value = true;
    return this;
  }

  negate() {
    this.value = !this.value;
    return this;
  }

  negative() {
    // -true is true
    // -false is false
    return this;
  }

  toBool() {
    return this.value;
  }

  toString() {
    return this.value ? "1" : "0";
  }

  toNumber() {
    return this.value ? 1 : 0
  }

  /**
   * Applies a binary operator to bool (always LHS).
   * The RHS value is a bool.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBool(operator: string, rhs: JbBool) {
    let result: boolean;
    switch(operator) {
      case "+":
        throw `Illegal operation, ADDITION with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "-":
        throw `Illegal operation, SUBTRACTION with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw `Illegal operation: A boolean can only be compared to another boolean using the equals or not-equals operators. You need to convert it to a type for which the less-than operator is defined.`;
      case "==":
        result = this.value === rhs.value;
        break;
      case "!=":
        result = this.value !== rhs.value;
        break;
      case "&&":
      case "&":
        result = this.value && rhs.value;
        break;
      case "||":
      case "|":
        result = this.value || rhs.value;
        break;
      default:
        throw `Unsupported operator ${operator}`;
    }
    return new JbBool(result);
  }

  /**
   * Applies a binary operator to bool (always LHS).
   * The RHS value is a string.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopString(operator: string, rhs: JbString) {
    switch (operator) {
      case "+":
        return new JbString(this.toString() + rhs.value);
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      // logical and comparison operators follow Jitterbit's implementation
      case "<":
        return new JbBool(rhs.compareWithBool(">", this));
      case ">":
        return new JbBool(rhs.compareWithBool("<", this));
      case "<=":
        return new JbBool(rhs.compareWithBool(">=", this));
      case ">=":
        return new JbBool(rhs.compareWithBool("<=", this));
      case "==":
        return new JbBool(this.value === rhs.toBool());
      case "!=":
        return new JbBool(this.value !== rhs.toBool());
      case "&&":
      case "&":
        if(rhs.toBool() && this.value)
          return new JbBool(true);
        return new JbBool(false);
      case "||":
      case "|":
        if(rhs.toBool() || this.value)
          return new JbBool(true);
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to bool (always LHS).
   * The RHS value is a number.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNumber(operator: string, rhs: JbNumber) {
    switch (operator) {
      case "+":
        throw `Illegal operation: ${this.type} Add {${rhs.type}}`
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      // logical and comparison operators follow Jitterbit's implementation
      case "<":
        return new JbBool(this.value
          ? 1 < rhs.value
          : 0 < rhs.value
        );
      case ">":
        return new JbBool(this.value
          ? 1 > rhs.value
          : 0 > rhs.value
        );
      case "<=":
        return new JbBool(this.value
          ? 1 <= rhs.value
          : 0 <= rhs.value
        );
      case ">=":
        return new JbBool(this.value
          ? 1 >= rhs.value
          : 0 >= rhs.value
        );
      case "==":
        return new JbBool(this.value === rhs.toBool());
      case "!=":
        return new JbBool(this.value !== rhs.toBool());
      case "&&":
      case "&":
        return new JbBool(this.value && rhs.toBool());
      case "||":
      case "|":
        return new JbBool(this.value || rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to bool (always LHS).
   * The RHS value is a null.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNull(operator: string, rhs: JbNull) {
    switch (operator) {
      case "+":
        return new JbBool(this.value);
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
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
        return new JbBool(this.value);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to bool (always LHS).
   * The RHS value is an array.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopArray(operator: string, rhs: JbArray) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
    }

    const members = rhs.members;
    for(const idx in members) {
      switch (members[idx].type) {
        case "number":
          members[idx] = this.binopNumber(operator, members[idx] as JbNumber);
          break;
        case "bool":
          members[idx] = this.binopBool(operator, members[idx] as JbBool);
          break;
        case "string":
          members[idx] = this.binopString(operator, members[idx] as JbString);
          break;
        case "null":
          members[idx] = this.binopNull(operator, members[idx] as JbNull);
          break;
        case "array":
          members[idx] = this.binopArray(operator, members[idx] as JbArray);
          break;
        case "dictionary":
          members[idx] = this.binopDict(operator, members[idx] as JbDictionary);
          break;
        case "binary":
          members[idx] = this.binopBin(operator, members[idx] as JbBinary);
          break;
        case "date":
          members[idx] = this.binopDate(operator, members[idx] as JbDate);
          break;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return rhs;
  }

  /**
   * Applies a binary operator to bool (always LHS).
   * The RHS value is a dictionary.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopDict(operator: string, rhs: JbDictionary) {
    switch(operator) {
      case "+":
        throw new Error(`Illegal operation: ${this.type} Add ${rhs.type}`);
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} - ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} * ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} / ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ^ ${rhs.type}`);
      case "<":
        // originally always false
        // POD: perhaps this should be changed
        return new JbBool(false);
      case ">":
        // dictionary is implicitly converted to 0
        return new JbBool(this.toNumber() > 0);
      case "<=":
      case ">=":
      case "==":
        return new JbBool(!this.value);
      case "!=":
        return new JbBool(this.value);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.value);
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to boolean (always LHS).
   * The RHS value is binary data.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBin(operator: string, rhs: JbBinary) {
    switch(operator) {
      case "+":
        throw new Error(`Illegal operation: ${this.type} Add ${rhs.type}`);
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
        return new JbBool(this.value === false);
      case "!=":
        return new JbBool(this.value !== false);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.value);
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to a boolean (always LHS).
   * The RHS value is a date.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDate(operator: string, rhs: JbDate) {
    switch (operator) {
      case "+":
        throw `Illegal operation: ${this.type} Add ${rhs.type}`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.toNumber() < rhs.toNumber());
      case ">":
        return new JbBool(this.toNumber() > rhs.toNumber());
      case "<=":
        return new JbBool(this.toNumber() <= rhs.toNumber());
      case ">=":
        return new JbBool(this.toNumber() >= rhs.toNumber());
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.value);
      default:
        throw `Unsupported operator ${operator}`;
    }
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

  toString() {
    return "null";
  }

  /**
   * Applies a binary operator to null (always LHS).
   * The RHS value is a null.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNull(operator: string, rhs: JbNull) {
    switch (operator) {
      case "+":
      case "-":
        return new JbNull();
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation: ${this.type} POW ${rhs.type}`;
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
   * Applies a binary operator to null (always LHS).
   * The RHS value is a string.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopString(operator: string, rhs: JbString) {
    switch (operator) {
      case "+":
        return new JbString(rhs.value);
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
      case "!=":
        return new JbBool(true);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to null (always LHS).
   * The RHS value is a number.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNumber(operator: string, rhs: JbNumber) {
    switch (operator) {
      case "+":
        return new JbNumber(rhs.value);
      case "-":
        return new JbNumber(0 - rhs.value);
      case "*":
        return new JbNumber();
      case "/":
        if(rhs.value === 0)
          throw `Illegal operation: division by 0`;
        return new JbNumber();
      case "^":
        throw `Illegal operation: ${this.type} POW ${rhs.type}`;
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
        return new JbBool(rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to null (always LHS).
   * The RHS value is a bool.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBool(operator: string, rhs: JbBool) {
    switch (operator) {
      case "+":
        return new JbBool(rhs.value);
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
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
        return new JbBool(rhs.value);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to null (always LHS).
   * The RHS value is an array.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopArray(operator: string, rhs: JbArray) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
    }

    const members = rhs.members;
    for(const idx in members) {
      switch (members[idx].type) {
        case "number":
          members[idx] = this.binopNumber(operator, members[idx] as JbNumber);
          break;
        case "bool":
          members[idx] = this.binopBool(operator, members[idx] as JbBool);
          break;
        case "string":
          members[idx] = this.binopString(operator, members[idx] as JbString);
          break;
        case "null":
          members[idx] = this.binopNull(operator, members[idx] as JbNull);
          break;
        case "array":
          members[idx] = this.binopArray(operator, members[idx] as JbArray);
          break;
        case "dictionary":
          members[idx] = this.binopDict(operator, members[idx] as JbDictionary);
          break;
        case "binary":
          members[idx] = this.binopBin(operator, members[idx] as JbBinary);
          break;
        case "date":
          members[idx] = this.binopDate(operator, members[idx] as JbDate);
          break;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return rhs;
  }

  /**
   * Applies a binary operator to null (always LHS).
   * The RHS value is a dictionary.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopDict(operator: string, rhs: JbDictionary) {
    switch(operator) {
      case "+":
      case "-":
      case "*":
        throw new Error(`Transform Error: DE_TYPE_CONVERT_FAILED`);
      // POD: original error:
      // Illegal operation: division by 0.
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation: ${this.type} POW ${rhs.type}`);
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
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to null (always LHS).
   * The RHS value is binary data.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBin(operator: string, rhs: JbBinary) {
    switch(operator) {
      case "+":
        return rhs;
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":      
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to a null (always LHS).
   * The RHS value is a date.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDate(operator: string, rhs: JbDate) {
    switch (operator) {
      case "+":
        return rhs;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
        return new JbBool(false);
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
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

  /**
   * Applies a binary operator to number (always LHS).
   * The RHS value is a number.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNumber(operator: string, rhs: JbNumber) {
    let result: number;
    switch(operator) {
      case "+":
        result = this.value + rhs.value;
        break;
      case "-":
        result = this.value - rhs.value;
        break;
      case "*":
        result = this.value * rhs.value;
        break;
      case "/":
        // Division by 0
        if (rhs.value == 0)
          throw "Division by 0";
        result = this.value / rhs.value;
        break;
      case "^":
        result = this.value ** rhs.value;
        break;
      case "<":
        return new JbBool(this.value < rhs.value);
      case ">":
        return new JbBool(this.value > rhs.value);
      case "<=":
        return new JbBool(this.value <= rhs.value);
      case ">=":
        return new JbBool(this.value >= rhs.value);
      case "==":
        return new JbBool(this.value === rhs.value);
      case "!=":
        return new JbBool(this.value !== rhs.value);
      case "&&":
      case "&":
        // 'This is always a short-circuit operator, meaning that if the left-hand argument evaluates to false, the right-hand argument is not evaluated.'
        // This executes after expression evaluation
        return new JbBool(this.value !== 0 && rhs.value !== 0);
      case "||":
      case "|":
        // 'This is always a short-circuit operator, meaning that if the left-hand argument evaluates to true, the right-hand argument is not evaluated.'
        // This executes after expression evaluation
        return new JbBool(this.value !== 0 || rhs.value !== 0);
      default:
        throw `Unsupported operator ${operator}`;
    }
  
    return new JbNumber(result);
  }

  /**
   * Applies a binary operator to number (always LHS).
   * The RHS value is a string.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopString(operator: string, rhs: JbString) {
    switch (operator) {
      case "+":
        // here it's the number that gets converted for concat
        // consistency is key
        return new JbString(this.value.toString() + rhs.value.toString());
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.value < rhs.toNumber());
      case ">":
        return new JbBool(this.value > rhs.toNumber());
      case "<=":
        return new JbBool(this.value <= rhs.toNumber());
      case ">=":
        return new JbBool(this.value >= rhs.toNumber());
      case "==":
        return new JbBool(this.value === rhs.toNumber());
      case "!=":
        return new JbBool(this.value !== rhs.toNumber());
      case "&&":
      case "&":
        return new JbBool(this.toBool() && rhs.toBool());
      case "||":
      case "|":
        return new JbBool(this.toBool() || rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to number (always LHS).
   * The RHS value is a bool.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBool(operator: string, rhs: JbBool) {
    switch (operator) {
      case "+":
        throw `Illegal operation: ${this.type} Add {${rhs.type}}`
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      // logical and comparison operators follow Jitterbit's implementation
      case "<":
        return new JbBool(rhs.value
          ? this.value < 1
          : this.value < 0
        );
      case ">":
        return new JbBool(rhs.value
          ? this.value > 1
          : this.value > 0
        );
      case "<=":
        return new JbBool(rhs.value
          ? this.value <= 1
          : this.value <= 0
        );
      case ">=":
        return new JbBool(rhs.value
          ? this.value >= 1
          : this.value >= 0
        );
      case "==":
        return new JbBool(this.toBool() === rhs.value);
      case "!=":
        return new JbBool(this.toBool() !== rhs.value);
      case "&&":
      case "&":
        return new JbBool(this.toBool() && rhs.value);
      case "||":
      case "|":
        return new JbBool(this.toBool() || rhs.value);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to number (always LHS).
   * The RHS value is a null.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNull(operator: string, rhs: JbNull) {
    switch (operator) {
      case "+":
        return new JbNumber(this.value);
      case "-":
        return new JbNumber(this.value);
      case "*":
        return new JbNumber();
      case "/":
        throw `Illegal operation, division by Null`;
      case "^":
        throw `Illegal operation: ${this.type} POW ${rhs.type}`;
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
        return new JbBool(this.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to number (always LHS).
   * The RHS value is an array.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopArray(operator: string, rhs: JbArray) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
    }

    const members = rhs.members;
    for(const idx in members) {
      switch (members[idx].type) {
        case "number":
          members[idx] = this.binopNumber(operator, members[idx] as JbNumber);
          break;
        case "bool":
          members[idx] = this.binopBool(operator, members[idx] as JbBool);
          break;
        case "string":
          members[idx] = this.binopString(operator, members[idx] as JbString);
          break;
        case "null":
          members[idx] = this.binopNull(operator, members[idx] as JbNull);
          break;
        case "array":
          members[idx] = this.binopArray(operator, members[idx] as JbArray);
          break;
        case "dictionary":
          members[idx] = this.binopDict(operator, members[idx] as JbDictionary);
          break;
        case "binary":
          members[idx] = this.binopBin(operator, members[idx] as JbBinary);
          break;
        case "date":
          members[idx] = this.binopDate(operator, members[idx] as JbDate);
          break;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return rhs;
  }

  /**
   * Applies a binary operator to number (always LHS).
   * The RHS value is a dictionary.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopDict(operator: string, rhs: JbDictionary) {
    switch (operator) {
      case "+":
      case "-":
      case "*":
      case "^":
        throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
      // POD: original error:
      // Illegal operation: division by 0.
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "<":
        // dictionary is implicitly converted to 0
        return new JbBool(this.value < 0);
      case ">":
        // dictionary is implicitly converted to 0
        return new JbBool(this.value > 0);
      case "<=":
        // dictionary is implicitly converted to 0
        return new JbBool(this.value <= 0);
      case ">=":
        // dictionary is implicitly converted to 0
        return new JbBool(this.value >= 0);
      case "==":
      case "&&":
      case "&":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "||":
      case "|":
        return new JbBool(this.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to number (always LHS).
   * The RHS value is binary data.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBin(operator: string, rhs: JbBinary) {
    switch(operator) {
      case "+":
        throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":      
      case "!=":
        throw new Error(`compare (${operator}) binary data with data of other type`);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to a number (always LHS).
   * The RHS value is a date.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDate(operator: string, rhs: JbDate) {
    switch (operator) {
      case "+":
        return new JbDate(
          new Date(
            // getTime returns local time
            rhs.value.getTime() + rhs.value.getTimezoneOffset() * 60000 + this.value * 1000
          )
        );
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.value < rhs.toNumber());
      case ">":
        return new JbBool(this.value > rhs.toNumber());
      case "<=":
        return new JbBool(this.value <= rhs.toNumber());
      case ">=":
        return new JbBool(this.value >= rhs.toNumber());
      case "==":
        return new JbBool(this.value === rhs.toNumber());
      case "!=":
        return new JbBool(this.value !== rhs.toNumber());
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
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
    // POD: "T"/"t" strings are not supported
    // see: https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/conversion-functions/#description_2
    return (!Number.isNaN(parseResult) && parseResult !== 0) || this.value === "true";
  }

  /**
   * Performs Jitterbit's string2number conversion (float-based).
   * 
   * If there's a number at the beginning of the string, Jitterbit truncates the string and tries to parse the longest possible number literal.
   * When successful, the value is returned, otherwise returns 0.
   * @returns 
   */
  toNumber() {
    // regular strings evaluate to 0, e.g. 0 == "abcd1234"
    // strings beginning with a parsable number are truncated and parsed
    // for example the below expressions return true:
    // 1234 == "1234abcd5"
    // -0.8 == "-.8abc.-.5"

    const pattern = /^(-{0,1}\.{0,1}[0-9]|\.)+/g;
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
    let strIntVal = this.toNumber();
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

  /**
   * Applies a binary operator to string (always LHS).
   * The RHS value is a string.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopString(operator: string, rhs: JbString) {
    let result: string | boolean;
    switch (operator) {
      case "+":
        result = this.value + rhs.value;
        return new JbString(result);
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible data types: ${this.type} ${operator} ${rhs.type}`;
      case "<":
        result = this.value < rhs.value;
        return new JbBool(result);
      case ">":
        result = this.value > rhs.value;
        return new JbBool(result);
      case "<=":
        result = this.value <= rhs.value;
        return new JbBool(result);
      case ">=":
        result = this.value >= rhs.value;
        return new JbBool(result);
      case "==":
        result = this.value === rhs.value;
        return new JbBool(result);
      case "!=":
        result = this.value !== rhs.value;
        return new JbBool(result);
      case "&&":
      case "&":
        return new JbBool(this.toBool() && rhs.toBool());
      case "||":
      case "|":
        return new JbBool(this.toBool() || rhs.toBool());
      default:
        // Add JB error:
        // Illegal operation, <operation name, ex. SUBTRACT> with incompatible data types: string <operator> string
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to string (always LHS).
   * The RHS value is a number.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNumber(operator: string, rhs: JbNumber) {
    switch (operator) {
      case "+":
        // here it's the number that gets converted for concat
        // consistency is key
        return new JbString(this.value + rhs.value.toString());
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.toNumber() < rhs.value);
      case ">":
        return new JbBool(this.toNumber() > rhs.value);
      case "<=":
        return new JbBool(this.toNumber() <= rhs.value);
      case ">=":
        return new JbBool(this.toNumber() >= rhs.value);
      case "==":
        return new JbBool(this.toNumber() === rhs.value);
      case "!=":
        return new JbBool(this.toNumber() !== rhs.value);
      case "&&":
      case "&":
        return new JbBool(this.toBool() && rhs.toBool());
      case "||":
      case "|":
        return new JbBool(this.toBool() || rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to string (always LHS).
   * The RHS value is a bool.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBool(operator: string, rhs: JbBool) {
    switch (operator) {
      case "+":
        return new JbString(this.value + rhs.toString());
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      // logical and comparison operators follow Jitterbit's implementation
      case "<":
        return new JbBool(this.compareWithBool("<", rhs));
      case ">":
        return new JbBool(this.compareWithBool(">", rhs));
      case "<=":
        return new JbBool(this.compareWithBool("<=", rhs));
      case ">=":
        return new JbBool(this.compareWithBool(">=", rhs));
      case "==":
        return new JbBool(this.toBool() === rhs.value);
      case "!=":
        return new JbBool(this.toBool() !== rhs.value);
      case "&&":
      case "&":
        if(this.toBool() && rhs.value)
          return new JbBool(true);
        return new JbBool(false);
      case "||":
      case "|":
        if(this.toBool() || rhs.value)
          return new JbBool(true);
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to string (always LHS).
   * The RHS value is a null.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopNull(operator: string, rhs: JbNull) {
    switch (operator) {
      case "+":
        return new JbString(this.value);
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
      case "!=":
        return new JbBool(true);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to string (always LHS).
   * The RHS value is an array.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopArray(operator: string, rhs: JbArray) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
    }

    const members = rhs.members;
    for(const idx in members) {
      switch (members[idx].type) {
        case "number":
          members[idx] = this.binopNumber(operator, members[idx] as JbNumber);
          break;
        case "bool":
          members[idx] = this.binopBool(operator, members[idx] as JbBool);
          break;
        case "string":
          members[idx] = this.binopString(operator, members[idx] as JbString);
          break;
        case "null":
          members[idx] = this.binopNull(operator, members[idx] as JbNull);
          break;
        case "array":
          members[idx] = this.binopArray(operator, members[idx] as JbArray);
          break;
        case "dictionary":
          members[idx] = this.binopDict(operator, members[idx] as JbDictionary);
          break;
        case "binary":
          members[idx] = this.binopBin(operator, members[idx] as JbBinary);
          break;
        case "date":
          members[idx] = this.binopDate(operator, members[idx] as JbDate);
          break;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return rhs;
  }

  /**
   * Applies a binary operator to string (always LHS).
   * The RHS value is a dictionary.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopDict(operator: string, rhs: JbDictionary) {
    switch(operator) {
      case "+":
        throw new Error(`Transform Error: DE_TYPE_CONVERT_FAILED`);
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} - ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} * ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} / ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ^ ${rhs.type}`);
      case "<":
        // dictionary is implicitly converted to 0
        return new JbBool(this.toNumber() < 0);
      case ">":
        // dictionary is implicitly converted to 0
        return new JbBool(this.toNumber() > 0);
      case "<=":
        // dictionary is implicitly converted to 0
        return new JbBool(this.toNumber() <= 0);
      case ">=":
        // dictionary is implicitly converted to 0
        return new JbBool(this.toNumber() >= 0);
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBoolAsNumber());
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to string (always LHS).
   * The RHS value is binary data.
   * @param rhs 
   * @param operator 
   * @returns 
   */
  binopBin(operator: string, rhs: JbBinary) {
    switch(operator) {
      case "+":
        throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
      case "-":
        throw new Error(`Illegal operation, SUBTRACT with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "*":
        throw new Error(`Illegal operation, MULTIPLICATION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "/":
        throw new Error(`Illegal operation, DIVISION with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "^":
        throw new Error(`Illegal operation, POW with incompatible data types: ${this.type} ${operator} ${rhs.type}`);
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
      case "!=":
        throw new Error(`compare (${operator}) binary data with data of other type`);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
      default:
        throw new Error(`Unsupported operator ${operator}`);
    }
  }

  /**
   * Applies a binary operator to a string (always LHS).
   * The RHS value is a date.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDate(operator: string, rhs: JbDate) {
    switch (operator) {
      case "+":
        return new JbString(this.toString() + rhs.toStringTruncMillis());
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.toNumber() < rhs.toNumber());
      case ">":
        return new JbBool(this.toNumber() > rhs.toNumber());
      case "<=":
        return new JbBool(this.toNumber() <= rhs.toNumber());
      case ">=":
        return new JbBool(this.toNumber() >= rhs.toNumber());
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }
}

/**
 * Runtime type for binary data.
 */
export class JbBinary implements BinaryVal {
  type: "binary";
  value: Uint8Array;

  constructor(bin: Uint8Array = new Uint8Array()) {
    this.type = "binary";
    this.value = bin;
  }

  clone() {
    return new JbBinary(this.value);
  }

  decrement(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: --");
  }

  increment(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: ++");
  }

  negate(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: !");
  }

  negative(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: -");
  }

  toBool(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
  }

  toNumber(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED");
  }

  /**
   * Returns a hexadecimal representation of the data.
   * @returns 
   */
  toString() {
    return Buffer.from(this.value).toString('hex');
  }

  /**
   * Creates an binary value instance from hex string.
   * @param hex 
   * @returns 
   */
  static fromHex(hex: string) {
    if(hex.length % 2 !== 0)
      throw new Error(`Invalid hex string '${hex}'. The length of the hex string has to be even.`);

    const pattern = /^([a-fA-F0-9])+$/g;
    const matches = hex.match(pattern);
    
    // invalid input
    if(matches === null)
      throw new Error(`Invalid hex string '${hex}'. A hex string can only contain hexadecimal numbers (0 through F, case insensitive).`);
    
    const bytes = this.hexToBytes(hex);
    return new JbBinary(bytes);
  }

  /**
   * Converts a hex string into a byte array.
   * @param hex 
   * @returns 
   */
  static hexToBytes(hex: string) {
    const result = new Uint8Array(hex.length / 2);
    let left: number;
    let right: number;
    let i = 0;
    const bytes: number[] = [];
    for(i = 0; i < hex.length; i) {
      left = this.hexDigitToByte(hex[i++]) * 16;
      right = this.hexDigitToByte(hex[i++]);
      bytes.push(left+right);
    }
    for(i = 0; i < hex.length / 2; i++)
      result.set([bytes[i]], i);

    return result;
  }

  /**
   * Converts a 0-F hex digit into a numeric value.
   * @param hex 
   * @returns
   */
  static hexDigitToByte(hex: string): number {
    switch(hex) {
      case "0":
        return 0;
      case "1":
        return 1;
      case "2":
        return 2;
      case "3":
        return 3;
      case "4":
        return 4;
      case "5":
        return 5;
      case "6":
        return 6;
      case "7":
        return 7;
      case "8":
        return 8;
      case "9":
        return 9;
      case "a":
      case "A":
        return 10;
      case "b":
      case "B":
        return 11;
      case "c":
      case "C":
        return 12;
      case "d":
      case "D":
        return 13;
      case "e":
      case "E":
        return 14;
      case "f":
      case "F":
        return 15;
      default:
        throw new Error(`hexToDigit internal error, invalid character`);
    }
  }

  /**
   * Converts the binary data to a lowercase UUID.
   * @returns 
   */
  toUUID() {
    const hex = this.toString().toLowerCase();
    if(this.value.length !== 16)
      throw new Error(`Input is not 16-byte binary data. The size of your input is ${this.value.length}.`);

    let result = "";
    for (let idx = 0; idx < hex.length; idx++) {
      if(idx === 8 || idx === 12 || idx === 16 || idx === 20)
        result += "-";
      result += hex[idx];
    }
    return result;
  }

  /**
   * Creates binary data from a UUID string.
   * @param uuid 
   * @returns 
   */
  static fromUUID(uuid: string) {
    if(uuid.length !== 36)
      throw new Error(`Invalid UUID string '${uuid}'. A UUID string has to be 36 characters long.`);

    const pattern = /^([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})$/g;
    if(uuid.match(pattern) === null)
      throw new Error(`Invalid UUID string ${uuid}. A UUID has to be of the format: 2f46dad9-e5c2-457e-b1fd-ad1b49b99aff`);
    return this.fromHex(uuid.replaceAll("-", ""));
  }

  /**
   * Encodes binary data into UTF-8 hex string.
   * @returns
   */
  bytes2utf8() {
    let result = "";
    for(const b of this.value) {
      // 00-7f -> 00-7f
      if(b < 128)
        result += b.toString(16).length === 1
          ? `0${b.toString(16)}`
          : b.toString(16);
      // 80-9F -> 00
      else if(b >= 128 && b < 160)
        result += "00";
      // A0-BF -> C2 A0..BF
      else if(b >= 160 && b < 192)
        result += `C2${b.toString(16)}`;
      // C0-FF -> C3 80..BF
      else
        result += `C3${(b - 64).toString(16)}`;
    }
    return result;
  }

  /**
   * Applies a binary operator to binary data (always LHS).
   * The RHS value is a number.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopNumber(operator: string, rhs: JbNumber) {
    switch (operator) {
      case "+":
        throw `Transformation Error: DE_TYPE_CONVERT_FAILED`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
      case "!=":
        throw new Error(`compare (${operator}) binary data with data of other type`);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to binary data (always LHS).
   * The RHS value is a boolean.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopBool(operator: string, rhs: JbBool) {
    switch (operator) {
      case "+":
        throw `Illegal operation: ${this.type} Add ${rhs.type}`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
        return new JbBool(rhs.value === false);
      case "!=":
        return new JbBool(rhs.value !== false);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.value);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to binary data (always LHS).
   * The RHS value is a string.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopString(operator: string, rhs: JbString) {
    switch (operator) {
      case "+":
        throw `Transformation Error: DE_TYPE_CONVERT_FAILED`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
      case "!=":
        throw new Error(`compare (${operator}) binary data with data of other type`);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to binary data (always LHS).
   * The RHS value is a null.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopNull(operator: string, rhs: JbNull) {
    switch (operator) {
      case "+":
      case "-":
        return this;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
        return new JbBool(false);
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to binary data (always LHS).
   * The RHS value is an array.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopArray(operator: string, rhs: JbArray) {
    switch(operator) {
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
    }

    const members = rhs.members;
    for(const idx in members) {
      switch (members[idx].type) {
        case "number":
          members[idx] = this.binopNumber(operator, members[idx] as JbNumber);
          break;
        case "bool":
          members[idx] = this.binopBool(operator, members[idx] as JbBool);
          break;
        case "string":
          members[idx] = this.binopString(operator, members[idx] as JbString);
          break;
        case "null":
          members[idx] = this.binopNull(operator, members[idx] as JbNull);
          break;
        case "array":
          members[idx] = this.binopArray(operator, members[idx] as JbArray);
          break;
        case "dictionary":
          members[idx] = this.binopDict(operator, members[idx] as JbDictionary);
          break;
        case "binary":
          members[idx] = this.binopBin(operator, members[idx] as JbBinary);
          break;
        case "date":
          members[idx] = this.binopDate(operator, members[idx] as JbDate);
          break;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return rhs;
  }

  /**
   * Applies a binary operator to binary data (always LHS).
   * The RHS value is a dictionary.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDict(operator: string, rhs: JbDictionary) {
    switch (operator) {
      case "+":
        throw `Transformation Error: DE_TYPE_CONVERT_FAILED`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to binary data (always LHS).
   * The RHS value is binary data too.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopBin(operator: string, rhs: JbBinary) {
    switch (operator) {
      case "+":
        throw `Transformation Error: DE_TYPE_CONVERT_FAILED`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
        // ref comparison, only true if compared with self
        return new JbBool(this === rhs);
      case "!=":
        // ref comparison, only false if compared with self
        return new JbBool(this !== rhs);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to binary data (always LHS).
   * The RHS value is a date.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDate(operator: string, rhs: JbDate) {
    switch (operator) {
      case "+":
        throw `Illegal operation: ${this.type} Add ${rhs.type}`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
      case "!=":
        throw new Error(`compare (${operator}) binary data with data of other type`);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }
}

/**
 * Runtime date type.
 */
export class JbDate implements DateVal {
  type: "date";
  value: Date;

  constructor(date: Date = new Date(), truncMillis = true) {
    this.type = "date";
    // truncate milliseconds
    if(truncMillis)
      date.setMilliseconds(0)
    this.value = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  clone() {
    return new JbDate(this.value);
  }

  decrement(): never {
    // org.apache.http.NoHttpResponseException: localhost:port failed to respond
    throw new Error("Unary operator -- is unsupported for date objects.");
  }

  increment(): never {
    // org.apache.http.NoHttpResponseException: localhost:port failed to respond
    throw new Error("Unary operator ++ is unsupported for date objects.");
  }

  negate(): never {
    throw new Error("Transform Error: DE_TYPE_CONVERT_FAILED\nThe problematic token is at the end of the following expression: !");
  }

  negative(): never {
    // org.apache.http.NoHttpResponseException: localhost:port failed to respond
    throw new Error("Unary operator - is unsupported for date objects.");
  }

  toBool() {
    return false;
  }

  /**
   * Returns the epoch timestamp in seconds.
   * @returns 
   */
  toNumber() {
    return Math.floor(this.value.getTime() / 1000);
  }

  /**
   * Converts the date to ISO 8601 format (`YYYY-MM-DD HH:MM:SS.mmm`).
   * @param date 
   * @returns
   */
  toString() {
    let isoStr = this.value.toISOString();
    return isoStr.replace("T", " ").replace("Z", "");
  }

  /**
   * Similar to `toString` but truncates the milliseconds.
   * @returns
   */
  toStringTruncMillis() {
    const result = this.toString();
    // truncates the milliseconds
    const matches = result.match(/(^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2})\.[0-9]{3}$/g);
    if (!matches)
      return result;
    return matches[0];
  }

  /**
   * Creates a date from a `JbString` or `JbDate` value.
   * 
   * The supported strings format are identical with those of native JS `Date.parse`.
   * @param date 
   * @returns 
   */
  static parse(date: RuntimeVal) {
    let result: Date;
    // POD: supports JS implementation rather than JB's
    if(date.type === "string") {
      const timestamp = Date.parse((date as JbString).value);
      if(isNaN(timestamp))
        throw new Error(`[${this.name}] Invalid date string: '${(date as JbString).value}'`);
      result = new Date(timestamp - new Date().getTimezoneOffset() * 60000);
    }
    else
      result = (date as JbDate).value;

    return result;
  }

  /**
   * Applies a binary operator to a date (always LHS).
   * The RHS value is a number.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopNumber(operator: string, rhs: JbNumber) {
    switch (operator) {
      case "+":
        return new JbDate(
          new Date(
            // getTime returns local time
            this.value.getTime() + this.value.getTimezoneOffset() * 60000 + rhs.value * 1000
          )
        );
      case "-":
        return new JbDate(
          new Date(
            // getTime returns local time
            this.value.getTime() + this.value.getTimezoneOffset() * 60000 - rhs.value * 1000
          )
        );
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.toNumber() < rhs.value);
      case ">":
        return new JbBool(this.toNumber() > rhs.value);
      case "<=":
        return new JbBool(this.toNumber() <= rhs.value);
      case ">=":
        return new JbBool(this.toNumber() >= rhs.value);
      case "==":
        return new JbBool(this.toNumber() === rhs.value);
      case "!=":
        return new JbBool(this.toNumber() !== rhs.value);
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to a date (always LHS).
   * The RHS value is a boolean.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopBool(operator: string, rhs: JbBool) {
    switch (operator) {
      case "+":
        throw `Illegal operation: ${this.type} Add ${rhs.type}`;
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.toNumber() < rhs.toNumber());
      case ">":
        return new JbBool(this.toNumber() > rhs.toNumber());
      case "<=":
        return new JbBool(this.toNumber() <= rhs.toNumber());
      case ">=":
        return new JbBool(this.toNumber() >= rhs.toNumber());
      case "==":
        return new JbBool(this.toNumber() === rhs.toNumber());
      case "!=":
        return new JbBool(this.toNumber() !== rhs.toNumber());
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to a date (always LHS).
   * The RHS value is a string.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopString(operator: string, rhs: JbString) {
    switch (operator) {
      case "+":
        return new JbString(this.toString() + rhs.toString());
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.toNumber() < rhs.toNumber());
      case ">":
        return new JbBool(this.toNumber() > rhs.toNumber());
      case "<=":
        return new JbBool(this.toNumber() <= rhs.toNumber());
      case ">=":
        return new JbBool(this.toNumber() >= rhs.toNumber());
      case "==":
        return new JbBool(this.toNumber() === rhs.toNumber());
      case "!=":
        return new JbBool(this.toNumber() !== rhs.toNumber());
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(rhs.toBool());
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to a date (always LHS).
   * The RHS value is a null.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopNull(operator: string, rhs: JbNull) {
    switch (operator) {
      case "+":
      case "-":
        return this;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to a date (always LHS).
   * The RHS value is an array.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopArray(operator: string, rhs: JbArray) {
    switch(operator) {
      case "&&":
      case "&":
        return new JbBool(false);
      case "||":
      case "|":
        return new JbBool(this.toBool());
    }

    const members = rhs.members;
    for(const idx in members) {
      switch (members[idx].type) {
        case "number":
          members[idx] = this.binopNumber(operator, members[idx] as JbNumber);
          break;
        case "bool":
          members[idx] = this.binopBool(operator, members[idx] as JbBool);
          break;
        case "string":
          members[idx] = this.binopString(operator, members[idx] as JbString);
          break;
        case "null":
          members[idx] = this.binopNull(operator, members[idx] as JbNull);
          break;
        case "array":
          members[idx] = this.binopArray(operator, members[idx] as JbArray);
          break;
        case "dictionary":
          members[idx] = this.binopDict(operator, members[idx] as JbDictionary);
          break;
        case "binary":
          members[idx] = this.binopBin(operator, members[idx] as JbBinary);
          break;
        case "date":
          members[idx] = this.binopDate(operator, members[idx] as JbDate);
          break;
        default:
          throw `Unsupported array member type: ${members[idx].type}`;
      }
    }
    return rhs;
  }

  /**
   * Applies a binary operator to a date (always LHS).
   * The RHS value is a dictionary.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDict(operator: string, rhs: JbDictionary) {
    switch (operator) {
      case "+":
        throw new Error(`Illegal operation: ${this.type} Add ${rhs.type}`);
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(false);
      case "<=":
        return new JbBool(this.toNumber() === 0);
      case ">":
        return new JbBool(this.toNumber() > 0);
      case ">=":
        return new JbBool(this.toNumber() >= 0);
      case "==":
        return new JbBool(false);
      case "!=":
        return new JbBool(true);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to a date (always LHS).
   * The RHS value is binary data.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopBin(operator: string, rhs: JbBinary) {
    switch (operator) {
      case "+":
        throw new Error(`Illegal operation: ${this.type} Add ${rhs.type}`);
      case "-":
        throw `Illegal operation, SUBTRACT with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
      case "<=":
      case ">":
      case ">=":
        throw new Error(`compare (${operator}) with binary data`);
      case "==":
      case "!=":
        throw new Error(`compare (${operator}) binary data with data of other type`);
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }

  /**
   * Applies a binary operator to a date (always LHS).
   * The RHS value is a date too.
   * @param operator 
   * @param rhs 
   * @returns 
   */
  binopDate(operator: string, rhs: JbDate) {
    switch (operator) {
      case "+":
        throw `Illegal operation, ADDITION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // for some reason date subtraction is supported instead of addition
      // originally returns a long
      case "-":
        return new JbNumber(this.toNumber() - rhs.toNumber());
      case "*":
        throw `Illegal operation, MULTIPLICATION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "/":
        throw `Illegal operation, DIVISION with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      case "^":
        throw `Illegal operation, POW with incompatible types: ${this.type} ${operator} ${rhs.type}`;
      // 'Comparing arguments of different data types is not supported.'
      case "<":
        return new JbBool(this.value < rhs.value);
      case "<=":
        return new JbBool(this.value <= rhs.value);
      case ">":
        return new JbBool(this.value > rhs.value);
      case ">=":
        return new JbBool(this.value >= rhs.value);
      case "==":
        return new JbBool(this.toNumber() === rhs.toNumber());
      case "!=":
        return new JbBool(this.toNumber() !== rhs.toNumber());
      case "&&":
      case "&":
      case "||":
      case "|":
        return new JbBool(false);
      default:
        throw `Unsupported operator ${operator}`;
    }
  }
}
