import Parser from "./frontend/parser";
import Diagnostic from "./diagnostic";
import Scope from "./runtime/scope";
import evaluate from "./runtime/interpreter";
import Typechecker from "./typechecker/typechecker";

export {Parser, Scope, evaluate, Typechecker, Diagnostic};