import { BooleanVal, DictVal, MK_NULL, NumberVal, RuntimeVal, StringVal } from "../../values";

/**
 * Returns a value stored in the dictionary or `null` if it doesn't exist.
 * @param dict 
 * @param keyVal 
 * @returns 
 */
export function getDictMember(dict: DictVal, keyVal: RuntimeVal): RuntimeVal {
  const key = keyValueToString(keyVal);
  const result = dict.members.get(key);
  return result ?? MK_NULL();
}

/**
 * Adds or updates a K-V pair and returns the new value.
 * @param dict 
 * @param newValue 
 * @param key 
 * @returns 
 */
export function setDictMember(dict: DictVal, newValue: RuntimeVal, key: string): RuntimeVal {
  dict.members.set(key, newValue);
  return newValue;
}

/**
 * Converts a key value of any type to a string.
 * @param key 
 * @returns 
 */
export function keyValueToString(key: RuntimeVal): string {
  switch (key.type) {
    case "number":
      return (key as NumberVal).value.toString();
    case "bool":
      return (key as BooleanVal).value ? "1": "0";
    case "string":
      return (key as StringVal).value;
    case "null":
      throw `A dictionary key can't be NULL`;
    // object types are stringified
    case "array":
      // TODO: array.toString()
    case "dictionary":
      // TODO: dict.toString()
    default:
      throw `Unsupported member expression key type: ${key.type}`;
  }
}
