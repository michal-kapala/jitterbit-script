# Overview
This is an experimental standalone community interpreter shell for [Jitterbit Script Language](https://github.com/tlaceby/guide-to-interpreters-series) created for dedicated [LSP server](https://github.com/michal-kapala/vscode-jitterbit). It aims to provide editor support for Jitterbit Script outside of proprietary [Jitterbit Studio (Jitterbit Harmony Design Studio)](https://success.jitterbit.com/design-studio/) and extend the script-scoped error handling.
 
 This repo is a fork of [tlaceby/guide-to-interpreters-series](https://github.com/tlaceby/guide-to-interpreters-series).
 
<table>
  <tr>
    <th>Language</th>
    <td>TypeScript</td>
  </tr>
  <tr>
    <th>Platform</th>
    <td>NodeJS</td>
  </tr>
  <tr>
    <th>Stable version</th>
    <td>-</td>
  </tr>
</table>

# Disclaimer

Please note this is **not** an official Jitterbit interpreter. It *may* differ in behaviour and support from actual Jitterbit runtimes which execute scipts in Jitterbit Harmony.

[Jitterbit LSP server](https://github.com/michal-kapala/vscode-jitterbit) which utilizes this interpreter provides original editor and runtime error messages from Jitterbit Studio, extended where needed. It also provides additional warnings about potential runtime errors.

# Language support

Below tables track the current language feature support for both this interpreter and its Jitterbit Studio equivalent.

| Interpreter | Version |
|---|---|
| jitterbit-interpreter | - |
| Jitterbit Studio |  10.55.0.27 |

## Tokens

The tables below shows the lexer's symbol support.

### Literals

#### Identifiers

| Symbol | jitterbit-interpreter | Jitterbit Studio |
|---|---|---|
| Local variables   |  |  |
| Global variables  |  |  |
| System variables  |  |  |

#### Constants

| Symbol | jitterbit-interpreter | Jitterbit Studio |
|---|---|---|
| Integer |  |  |
| Float   |  |  |
| String  |  |  |
| Boolean |  |  |
| Null    |  |  |


#### Objects

| Symbol | jitterbit-interpreter | Jitterbit Studio |
|----|---|---|
| {} |  |  |

### Keywords
As of current version, no keywords are supported by Jitterbit Script Language. Control statements like branching and loops are implemented as [Logical Functions](https://success.jitterbit.com/design-studio/design-studio-reference/formula-builder/logical-functions/).

### Operators
The list of recognized operator tokens.

#### Comparison

| Symbol | jitterbit-interpreter | Jitterbit Studio |
|-----|---|---|
| <   |  |  |
| >   |  |  |
| <=  |  |  |
| >=  |  |  |
| ==  |  |  |
| !=  |  |  |

#### Assignment

| Symbol | jitterbit-interpreter | Jitterbit Studio |
|-----|---|---|
| =   |  |  |
| +=  |  |  |
| -=  |  |  |
| *=  |  |  |
| /=  |  |  |

#### Other binary operators

| Symbol | jitterbit-interpreter | Jitterbit Studio |
|-------|---|---|
| +     |  |  |
| -     |  |  |
| *     |  |  |
| /     |  |  |
| %     |  |  |
| &&    |  |  |
| \|\|  |  |  |

#### Unary

| Symbol | jitterbit-interpreter | Jitterbit Studio |
|----|---|---|
| !  |  |  |
| ++ |  |  |
| -- |  |  |
| [] |  |  |


## Statements/Expressions

The list of statements and expressions supported by the interpreter.

| Expr | jitterbit-interpreter | Jitterbit Studio |
|---|---|---|
| <trans></trans>       |  |  |
| ()                    |  |  |
| Function calls        |  |  |
| Array element access  |  |  |

## APIs

Currently supported Jitterbit API members are defined in separate files:
- [system variables]()
- [functions]()
