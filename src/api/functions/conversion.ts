import { JbBinary, JbString } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

export class HexToBinaryFunc extends Func {
  constructor() {
    super();
    this.name = "HexToBinary";
    this.module = "dict/array";
    this.signatures = [
      // the signature's return type in the Jitterbit docs is wrong
      new Signature("binary", [
        new Parameter("string", "arg")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[]) {
    this.chooseSignature(args);
    // TODO: this error should be thrown by type checker (too)
    // POD: originally the argument is implicitly converted to string
    if(args[0].type !== "string")
      throw new Error(`${this.name} can only be called on ${this.signature.params[0].type} data elements. The '${this.signature.params[0].name}' argument is of type ${args[0].type}`);
    const hex = args[0] as JbString;
    return JbBinary.fromHex(hex.value);
  }

  protected chooseSignature(args: RuntimeVal[]): void {
    this.signature = this.signatures[0];
  }
}
