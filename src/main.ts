import Parser from "./frontend/parser";
import Scope from "./runtime/scope";
import { evaluate } from "./runtime/interpreter";
import fs from "fs";

run("./test.jb");

async function run(filename: string) {
  const parser = new Parser();
  const globalScope = new Scope();

  fs.readFile(filename, 'utf8', async function (err, data) {
    if (err)
      return console.error(err);
    
    const program = parser.parse(data);
    let result;
    try {
      result = await evaluate(program, globalScope);
      console.log("\nScript result:\n", result);
    } catch(e) {
      console.error(e);
    }
  });
}
