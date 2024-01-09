import Parser from "./frontend/parser";
import Scope from "./runtime/scope";
import { evaluate } from "./runtime/interpreter";
import fs from "fs";

//repl();
run("./test.txt");

async function run(filename: string) {
  const parser = new Parser();
  const globalScope = new Scope();

  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) {
      return console.error(err);
    }
    const program = parser.parse(data);
    const result = evaluate(program, globalScope);
    console.log("\nScript result:\n", result);
  });
}
