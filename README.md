# Jitterbit Script
![tests](https://github.com/michal-kapala/jitterbit-script/actions/workflows/tests.yml/badge.svg)

Community-made Node.js package for static code analysis and execution of [Jitterbit scripts](https://success.jitterbit.com/design-studio/design-studio-reference/scripts/jitterbit-script-language/).

Provides language support capabilities for [Jitterbit VS Code extension](https://github.com/michal-kapala/vscode-jitterbit).
 
<table>
  <tr>
    <th>Language</th>
    <td>TypeScript</td>
  </tr>
  <tr>
    <th>Platform</th>
    <td>NodeJS</td>
  </tr>
</table>

## Usage

### Static analysis

Create a typed AST along with detected errors and warnings.

```ts
import {Diagnostic, Parser, Typechecker} from 'jitterbit-script';

const script = '<trans> $hi = "hello world!" </trans>';
const diagnostics: Diagnostic[] = [];
const parser = new Parser();

const ast = parser.parse(script, diagnostics);
const analysis = Typechecker.analyze(ast, diagnostics);
```

The above code should never throw, if it does please raise an issue with a bug report.

### Runtime

Execute a script.

```ts
import {evaluate, Parser, Scope} from 'jitterbit-script';

async function run(script: string) {
  const parser = new Parser();
  try {
    const ast = parser.parse(script);
    return await evaluate(ast, new Scope());
  } catch(err) {
    // error handling
  }
}

const result = run('<trans> $hi = "hello world!" </trans>');
```

## Disclaimer

Please note this is **not** official Jitterbit tooling. It **does** differ in behaviour and support from the original Jitterbit runtimes executing scripts in Jitterbit Harmony.

The static analysis system was redesigned to provide static typing and improve problem reporting for better DX and high quality code development.

Currently the support for runtime APIs is limited. See [README](https://github.com/michal-kapala/jitterbit-script/tree/main/src/api#readme) for details on runtime API support.

The runtime implementation's behaviour is based on the cloud agent and editor versions below.

| Component | Version |
|---|---|
| Cloud agent | 11.23.0.9 |
| Jitterbit Studio |  10.55.0.27 |

This repo is a fork of [tlaceby/guide-to-interpreters-series](https://github.com/tlaceby/guide-to-interpreters-series).
