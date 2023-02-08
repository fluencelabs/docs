# Aqua JS API

Aqua JS API allows you to manage all aspects of [Aqua](../introduction.md) development from your JS projects.

To install the Aqua API package:

```sh
npm install --save @fluencelabs/aqua-api
```

# API
API compiles high-level Aqua code into low-level AIR instructions that can be used with Fluence JS client to make peer-to-peer calls.

API has only one function:

```typescript
export class Compiler {
    compile(input: Input | Path | Call, imports: string[], config?: AquaConfig): Promise<CompilationResult>;
}
```

where input can be:

- Aqua code as a string

```typescript
export class Input {
    input: string
}
```

- Path to `.aqua` file or directory with `.aqua` files. 
- Note: paths must be absolute

```typescript
export class Path {
    path: string
}
```

- Information about a function that you want to call. It wraps aqua code to gather and print call result. Also, it
  checks correctness of arguments.

```typescript
export class Call {
    functionCall: string
    arguments: any
    input: Input | Path
}
```

- `imports` is a path to files that is necessary for compilation but not needed to be compiled into AIR functions. More information [here](language/header/header).
- `config`

```typescript
export class AquaConfig {
    // compiler log level
    logLevel?: string
    // constants can be defined or overrided by this option
    constants?: string[]
    // switches off error bubbling to initiator 
    noXor?: boolean
    // switches off first hop to relay peer
    noRelay?: boolean
}
```
More info about overridable constants [here](language/expressions/overridable-constants).

Compilation result:
```typescript
export class CompilationResult {
    // list of compiled services. Can be useful to create handlers for this services
    services: Record<string, ServiceDef>
    // list of Aqua functions
    functions: Record<string, AquaFunction>
    // information about function that is compiled with `Call` input
    functionCall?: AquaFunction
    // list of compilation errors in Aqua code. If not empty, then compilation failed and other fields will be empty
    errors: string[]
}
```

# Usage example
https://github.com/fluencelabs/aqua/tree/main/api/aqua-api-example/