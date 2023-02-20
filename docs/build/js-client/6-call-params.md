# Security andd call params

# Call params, tetraplets and security

Each service call is accompanied by additional information specific to Fluence Protocol. Including `initPeerId` - the peer which initiated the particle execution, particle signature and most importantly security tetraplets. All this data is contained inside the last `callParams` argument in every generated function definition. These data is passed to the handler on each function call can be used in the application.

Tetraplets have the form of:

```typescript
{
  argName0: SecurityTetraplet[],
  argName1: SecurityTetraplet[],
  // ...
}
```

To learn more about tetraplets and application security see [Security](../security.md)

To see full specification of `CallParams` type see [API reference](https://fluence.one/fluence-js/)
