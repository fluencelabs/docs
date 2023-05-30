# Conditional

Aqua supports branching, you can:
- Check boolean expression with [`if`](#if)
- Recover from error with [`try`](#try) or [`otherwise`](#otherwise)
- Return different results with [conditional return](#conditional-return)

## Contract

* The second branch of the conditional operator is executed if and only if the first block failed.
* The second branch has no access to the first branch's data.
* A conditional block is considered "executed" if and only if any branch was executed successfully.
* A conditional block is considered "failed" if and only if the second (recovery) branch failed.

## Conditional operations

### `if`

`if` corresponds to `match`, `mismatch` extension of π-calculus.

```aqua
x = true
if x:
  -- always executed
  foo()

if x == false:
  -- never executed
  bar()

if x != false:
  -- always executed
  baz()
```

Currently, you may only use one `==`, `!=` operator or compare with `true` in the `if` expression.

Both operands can be variables.

### `else`

The second branch of `if`, executed only in case the condition did not hold.

```aqua
if false:
  foo() -- skipped
else:
  bar() -- executed
```

If you want to set a variable based on condition, see [conditional return](#conditional-return).

### `try`

Tries to perform operations, swallows produced error (if there's no `catch`, otherwise executes `catch`).

```aqua
try:
   -- If foo fails with an error, execution will continue
   -- You should write your logic in a non-blocking fashion:
   -- If your code below depends on `x`, it may halt as `x` is not resolved.
   -- See conditional return below for workaround
   x <- foo()
```

### `catch`

Catches the standard error from the `try` block.

```aqua
try:
   foo()
catch e:
   logError(e)
```

Type of `e` is:

```aqua
data LastError:
  instruction: string -- What AIR instruction failed
  msg: string -- Human-readable error message
  peer_id: string -- On what peer the error happened
```

### `otherwise`

You may add `otherwise` to provide recovery for any block or expression:

```aqua
x <- foo()
otherwise:
  -- if foo can't be executed, then do bar()
  y <- bar()
```

## Conditional return

In Aqua, functions may have only one return expression, which is the very last.

So to get the value based on condition, we need to use a [writeable collection](../types.md#collection-types).

```aqua
-- result may have 0 or more values of type string and is writeable
resultBox: *string
try:
  resultBox <- foo()
otherwise:
  resultBox <- bar()

-- now result contains only one value, let's extract it!
result = resultBox!

-- Type of result is string
-- Please note that if there were no writes to resultBox, 
-- the first use of result will halt.
-- So you need to be careful about it and ensure that there's always a value.
```
