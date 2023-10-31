# Call Aqua functions

# TODO: adapt to JS Client

# TODO: mention aqua arrays and their types convertion

## Bullets

- write aqua
- export function
- compile
- call from code

## Understanding the compiler output

For every exported function definition in Aqua, the compiler generated two overloads. One accepting the `FluencePeer` instance as the first argument, and one without it. Otherwise, arguments are the same and correspond to the arguments of Aqua functions. The last argument is always an optional config object with the following properties:

- `ttl`: an optional parameter which specifies TTL (time to live) of a particle with execution logic for the function

The return type is always a promise of the Aqua function return type. If the function does not return anything, the return type will be `Promise<void>`.

Consider the following example:

```aqua
func myFunc(arg0: string, arg1: string):
    -- implementation
```

The compiler will generate the following overloads:

```typescript
export async function myFunc(
  arg0: string,
  arg1: string,
  config?: { ttl?: number }
): Promise<void>;

export async function callMeBack(
  peer: FluencePeer,
  arg0: string,
  arg1: string,
  config?: { ttl?: number }
): Promise<void>;
```

### Type conversion

Basic type conversion is pretty straightforward:

- `string` is converted to `string` in typescript
- `bool` is converted to `boolean` in typescript
- All number types (`u8`, `u16`, `u32`, `u64`, `s8`, `s16`, `s32`, `s64`, `f32`, `f64`) are converted to `number` in typescript.

Arrow types translate to functions in typescript which have their arguments translated to typescript types. In addition to arguments defined in Aqua, typescript counterparts have an additional argument for call params. For the majority of use cases, this parameter is not needed and can be omitted.

The type conversion works the same way for `service` and `func` definitions. For example, a `func` with a callback might look like this:

```aqua
func callMeBack(callback: string, i32 -> ()):
    callback("hello, world", 42)
```

The type for `callback` argument will be:

```typescript
callback: (arg0: string, arg1: number, callParams: CallParams<'arg0' | 'arg1'>) => void | Promise<void>,
```
