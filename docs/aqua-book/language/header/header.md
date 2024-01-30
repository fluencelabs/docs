# Imports And Exports

An Aqua source file has a header and a body. The body contains [function definitions](../expressions/functions.md), [services](../services.md), [types](../types.md), [constants](../values.md#constants). The header manages what is imported from other files and what is exported for external usage.

## Aqua source file header

Every aqua source file should begin with `aqua` keyword followed by the the name of the aqua module presented by the file.

```aqua
-- `aqua` expression may only be on the very first line of the file
aqua AquaFile
```

Module name can contain dots, e.g. `aqua Aqua.File`.

The `aqua AquaFile` expression may optionally include a `declares` section. This section enumerates the elements that the module will make available for use in other modules that import it. If the `declares` section is omitted, the module does not declare anything for external use.

`AquaFile` can be used as the aqua's name when this file is [`use`d](#use-expression). In this case, only what is enumerated in `declares` section will be available. `declares *` allows you to declare everything in the file as the module interface.

```aqua
aqua AquaFile declares CONST_NAME, ServiceName, MyType, fn
-- -- would have same effect:
-- aqua AquaFile declares *

const CONST_NAME = "something"

service ServiceName:
  do_something()
  
data MyType:
  result: i32  

function fn() -> string:
  <- CONST_NAME
```

## Import Expression

The main way to import a file is via `import` expression:

```aqua
aqua AquaFile declares foo

import "@fluencelabs/aqua-lib/builtin.aqua"

func foo():
  Op.noop()
```

To learn how compiler resolves the import path, see [JS Aqua API](../../aqua-js-api.md).

:::info
`.aqua` extension in `import` and `use` expressions can be omitted. So, `import "builtin.aqua"` does exactly the same as `import "builtin"`.
:::

Everything declared in the file is imported into the current namespace.

You can cherry-pick and rename imports using `import ... from` expression:

```aqua
import Op as Noop from "@fluencelabs/aqua-lib/builtin"

func foo():
  Noop.noop()
```

## Use Expression

The `use` expression makes it possible to import a file into a named scope.

```aqua
use "@fluencelabs/aqua-lib/builtin.aqua"
-- Assume that builtin.aqua's header is `aqua BuiltIn declares *`

func foo():
  BuiltIn.Op.noop()
```

It is possible to rename the imported module with `use ... as ...` expression:

```aqua
use "@fluencelabs/aqua-lib/builtin" as Renamed

func foo():
  Renamed.Op.noop()
```

## Export

While it's useful to split the code into several functions into different files, it's not always a good idea to compile everything into the host language.

Another problem is libraries distribution. If a developer wants to deliver an `.aqua` library, she often needs to provide it in the compiled form as well.

`export` lets a developer decide what exactly is going to be exported to the host language. Exporting imported symbols is allowed.

```aqua
aqua Lib

import bar from "lib"

-- Exported functions and services will be compiled for the host language
-- You can use several `export` expressions
export foo as my_foo
export bar, MySrv

service MySrv:
  call_something()

func foo() -> bool:
  <- true  
```
