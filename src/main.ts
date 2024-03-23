import Parser from "./frontend/parser";
import Scope from "./runtime/scope";
import evaluate from "./runtime/interpreter";
import fs from "fs";
import Typechecker from "./typechecker/typechecker";
import Diagnostic from "./diagnostic";

run("./test.jb");

async function run(filename: string) {
  const parser = new Parser();
  const globalScope = new Scope();

  fs.readFile(filename, 'utf8', async function (err, data) {
    if(err)
      return console.error(err);
    
    try {
      const script = process.env.npm_lifecycle_event;
      if(script === "exec") {
        const program = parser.parse(data);
        const result = await evaluate(program, globalScope);
        console.log("\nScript result:\n", result);
      }
      else if(script === "typecheck") {
        const diagnostics: Diagnostic[] = [];
        const program = parser.parse(data, diagnostics);
        const result = Typechecker.analyze(program, diagnostics);
        console.log(JSON.stringify(result.ast));
        console.log(result.diagnostics);
        console.log(result.vars);
        console.log(result.callees);
      }
    } catch(e) {
      console.error(e);
    }
  });
}
