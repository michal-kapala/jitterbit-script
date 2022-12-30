import Parser from "./frontend/parser";
import Environment, { createGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import fs from "fs";

// repl();
run("./test.txt");

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    const program = parser.produceAST(data);
    const result = evaluate(program, env);
    console.log(result);
  });
}

function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();
  // INITIALIZE REPL
  console.log("\nRepl v0.1");

  // Continue Repl Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");
    // Check for no user input or exit keyword.
    if (!input || input.includes("exit")) {
      return;
    }

    // Produce AST From sourc-code
    const program = parser.produceAST(input ?? "");

    const result = evaluate(program, env);
    console.log(result);
  }
}
