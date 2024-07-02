# Modularity

## Source File Structure

An Aqua source file has a header and a body. The body contains [function definitions](./expressions/functions.md), [services](./services.md), [types](./types.md), [constants](./values.md#constants). The header is dedicated to code management: it specifies [the name of the module](#giving-a-name-to-an-aqua-module-with-aqua), [what is declared by the module](#specifying-what-is-declared-by-the-module-with-declares), [what is exported from the module](#exporting-to-the-host-language-with-export) and [what is imported into the module](#importing-other-modules).

## Giving a name to an Aqua module with `aqua`

**Every** Aqua source file should begin with `aqua` keyword followed by the the name of the aqua module presented by the file.

```aqua
-- `aqua` expression may only be on the very first line of the file
aqua AquaFile
```

Module name can contain dots, e.g. `aqua Aqua.File`.

This name is used when the module is imported with `use`, see [Importing other modules with `use`](#with-use).

## Specifying what is declared by the module with `declares`

The `aqua AquaFile` expression may optionally include a `declares` section. This section enumerates the elements that the module will make available for **other modules that import it**. If the `declares` section is omitted, the module does not declare anything for other modules to use.

```aqua
-- This module declares `CONST_NAME`, `ServiceName`, `MyType` and `fn`
aqua AquaFile declares CONST_NAME, ServiceName, MyType, fn

const CONST_NAME = "something"

service ServiceName:
  do_something()
  
data MyType:
  result: i32  

func fn() -> string:
  <- CONST_NAME
```

To declare everything contained in the file, use `declares *`:

```aqua
-- This module declares `CONST_NAME`, `ServiceName`, `MyType` and `fn`
aqua AquaFile declares *

const CONST_NAME = "something"

service ServiceName:
  do_something()
  
data MyType:
  result: i32  

func fn() -> string:
  <- CONST_NAME
```

Note that symbols declared with `declares` are not exported to the host language. To export symbols to the host language, use [`export`](#exporting-to-the-host-language-with-export).

## Importing other modules

Aqua modules can import other modules to use their [declarations](#specifying-what-is-declared-by-the-module-with-declares). There are two ways to import a module: with [`import`](#with-import) and [`use`](#with-use).

### With `use`

The `use` expression makes it possible to import a module as a named scope. The name of the scope is taken from [`aqua` header](#giving-a-name-to-an-aqua-module-with-aqua) of the imported module. Everything declared in the imported module is available in the current namespace as a member of the scope.

```aqua
aqua AquaFile declares foo

-- builtin.aqua declares `Op`
use "@fluencelabs/aqua-lib/builtin.aqua"

func foo():
  BuiltIn.Op.noop()
```

It is possible to rename the imported module with `use ... as ...` expression:

```aqua
aqua AquaFile declares foo

-- builtin.aqua declares `Op`
use "@fluencelabs/aqua-lib/builtin" as Renamed

func foo():
  Renamed.Op.noop()
```

It is also possible to cherry-pick and rename imports using `use ... as ... from ... as ...`:

```aqua
aqua AquaFile declares foo

-- builtin.aqua declares `Op`
use Op as Noop from "@fluencelabs/aqua-lib/builtin" as Renamed
-- multiple imports are allowed
-- dependency.aqua declares functions `foo`, `baz` and `bar`
import foo as f, baz, bar as b from "dependency.aqua" as Dep

func foo():
  Dep.f()
  Dep.baz()
  Dep.b()
  Renamed.Noop.noop()
```

Creation of a scope with `use` makes it easier to avoid name clashes and to understand where the symbol comes from. Thus it is recommended to prefer `use` instead of `import` when possible.

### With `import`

Another way to import a module is via `import`. In this case, everything declared in the imported module comes into the current namespace directly.

```aqua
aqua AquaFile declares foo

-- builtin.aqua declares `Op`
import "@fluencelabs/aqua-lib/builtin.aqua"

func foo():
  Op.noop()
```

It is possible to cherry-pick and rename imports using `import ... as ... from ...`:

```aqua
aqua AquaFile declares foo

-- builtin.aqua declares `Op`
import Op as Noop from "@fluencelabs/aqua-lib/builtin"
-- multiple imports are allowed
-- dependency.aqua declares functions `foo`, `baz` and `bar`
import foo as f, baz, bar as b from "dependency.aqua"

func foo():
  f()
  baz()
  b()
  Noop.noop()
```

### Imports resolution

To learn how compiler resolves the import path, see [JS Aqua API](./../aqua-js-api.md).

:::info
`.aqua` extension in `import` and `use` expressions can be omitted. So, `import "builtin.aqua"` does exactly the same as `import "builtin"`.
:::

## Exporting to the host language with `export`

Inside Aqua language code modularity is achieved with [`declares`](#specifying-what-is-declared-by-the-module-with-declares), [`import`](#with-import) and [`use`](#with-use) on module level (see also [Abilities](./abilities.md) as more fine grained method of code organization). However, what should be exported to the host language depends on the particular use case of aqua code and has nothing to do with code management inside Aqua. This is why exporting to the host language is a separate concept inside Aqua.

It is possible to specify what should be exported to the host language with `export`. Exporting symbols that were imported from other modules is allowed. There could be several `export`s in a file and they are all merged into one.

```aqua
aqua Lib

import bar from "lib"

-- Exported functions and services will be compiled 
-- into the host language
export foo
export bar, MySrv

service MySrv:
  call_something()

func foo() -> bool:
  <- true  
```

To export a symbol under a different name, use `export ... as ...`:

```aqua
aqua Lib

export foo as foo_bar

func foo() -> bool:
  <- true  
```

Note that `export` does not make the symbol available for other modules that import the current module. To make a symbol available for other modules, use [`declares`](#specifying-what-is-declared-by-the-module-with-declares).