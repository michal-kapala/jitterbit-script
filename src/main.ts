import Parser from "./frontend/parser";
import Scope, { createGlobalScope } from "./runtime/scope";
import { evaluate } from "./runtime/interpreter";
import fs from "fs";

//repl();
run("./test.txt");

async function run(filename: string) {
  const parser = new Parser();
  const globalScope = createGlobalScope();

  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    const program = parser.produceAST(data);
    const result = evaluate(program, globalScope);
    console.log("\nScript result:\n", result);
  });
}

function repl() {
  const parser = new Parser();
  const globalScope = createGlobalScope();
  // INITIALIZE REPL
  const prompt = require('prompt-sync')({sigint: true});
  console.log("\nRepl v0.1");

  // Continue Repl Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");
    // Check for no user input or exit keyword.
    if (!input || input.includes("exit")) {
      return;
    }

    // Produce AST From source-code
    const program = parser.produceAST(input ?? "");

    const result = evaluate(program, globalScope);
    console.log(result);
  }
}
