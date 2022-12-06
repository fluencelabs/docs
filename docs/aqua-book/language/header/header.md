# Imports And Exports

An Aqua source file has a head and a body. The body contains function definitions, services, types, constants. The header manages what is imported from other files and what is exported.

## Aqua source file header

When header is omitted, `.aqua` file exports and declares everything it contains. With `aqua` header you can control what gets exported from the aqua file.

```aqua
-- `aqua` expression may be only on the very first line of the file
aqua FileName declares *
```

`Aqua.Name` may contain dots.

`AquaName` can be used as the aqua's name when this file is `use`d. In this case, only what is enumerated in `declares` section will be available. `declares *` allows you to declare everything in the file as the module interface.

```aqua
aqua AquaName declares CONST_NAME, ServiceName, MyType, fn

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
import "@fluencelabs/aqua-lib/builtin.aqua"

func foo():
  Op.noop()
```

Aqua compiler takes a source directory and a list of import directories (usually with `node_modules` as a default). You can use relative paths to `.aqua` files, relatively to the current file's path, and to import folders.

:::info
`.aqua` extension in `import` and `use` expressions can be omitted. So, `import "builtin.aqua"` does exactly the same as `import "builtin"`.
:::

Everything defined in the file is imported into the current namespace.

You can cherry-pick and rename imports using `import ... from` expression:

```aqua
import Op as Noop from "@fluencelabs/aqua-lib/builtin"

func foo():
  Noop.noop()
```

## Use Expression

The `use` expression makes it possible to import a file into a named scope.

```aqua
use Op from "@fluencelabs/aqua-lib/builtin" as BuiltIn

func foo():
  BuiltIn.Op.noop()
```

If the imported file has a `aqua` header, `from` and `as` sections of `use` may be omitted.

```aqua
use "@fluencelabs/aqua-lib/builtin.aqua"
-- Assume that builtin.aqua's header is `aqua BuiltIn declares *`

func foo():
  BuiltIn.Op.noop()
```

## Export

While it's useful to split the code into several functions into different files, it's not always a good idea to compile everything into the host language.

Another problem is libraries distribution. If a developer wants to deliver an `.aqua` library, he or she often needs to provide it in compiled form as well.

`export` lets a developer decide what exactly is going to be exported, including imported functions.

```aqua
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
