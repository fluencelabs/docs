# Aqua JS API

Aqua JS API allows you to manage all aspects of [Aqua](../introduction.md) development from your JS projects.

To install the Aqua CLI package:

```sh
npm install --save @fluencelabs/aqua-api
```

# API
API turns high-level Aqua code into AIR language that can be used with Fluence JS client to make peer-to-peer calls.

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

- Path to `.aqua` file

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

Compilation result:
```typescript
export class CompilationResult {
    services: Record<string, ServiceDef>
    functions: Record<string, AquaFunction>
    functionCall?: AquaFunction
    errors: string[]
}
```

- `errors` - list of compilation errors in Aqua code. If not empty, then compilation failed and other fields will be empty
- `services` - list of compiled services. Can be useful to create handlers for this services
- `functions` - list of Aqua functions
- `functionCall` - information about function that is compiled with `Call` input