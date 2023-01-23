# Types

## Scalars

Scalar types follow the Wasm IT notation.

* Unsigned numbers: `u8`, `u16`, `u32`, `u64`
* Signed numbers: `i8`, `i16`, `i32`, `i64`
* Floats: `f32`, `f64`
* Boolean: `bool`
* String: `string`
* Structures (product type): see below
* Arrays: see [Collection Types](types.md#collection-types) below

## Literals

You can pass booleans (true, false), numbers, double-quoted strings as literals.

## Structures

```aqua
data InnerStruct:
    arr: []string
    num: u32

data SomeStruct:
    str: string
    num: u64
    inner: InnerStruct

-- Structures can be created in aqua code
func createStruct(i: []u32) -> SomeStruct:
    <- SomeStruct(
        str = "some str",
        num = 4,
        inner = InnerStruct(arr = ["a", "b", "c"], num = i[2])
    )
    
-- To modify a structure value, there's a method called 'copy'. It creates a copy with values of specified fields changed.
-- Note that copy operates in an immutable way: it does not modify original structure value.
func changeStr(someStruct: SomeStruct) -> SomeStruct:
    <- someStruct.copy(str = "new string")
```

Fields are accessible with the dot operator `.` , e.g. `product.field`.

## Collection Types

Aqua has three different types with variable length, denoted by quantifiers `[]`, `*`, and `?`.

Immutable collection with 0..N values: `[]`

Immutable collection with 0 or 1 value: `?`

Appendable collection (More about it here: [CRDT Streams](crdt-streams.md)) with 0..N values: `*`

Any data type can be prepended with a quantifier, e.g. `*u32`, `[][]string`, `?ProductType` are all correct type specifications.

You can access a distinct value of a collection with `!` operator, optionally followed by an index.

It is possible to fill any collection with an empty one using `nil`.

Examples:

```aqua
strict_array: []u32
array_of_arrays: [][]u32
element_5 = strict_array!5
element_0 = strict_array!0
also_element_0 = strict_array!

-- It could be an argument or any other collection
maybe_value: ?string
-- This ! operator will FAIL if maybe_value is backed by a read-only data structure
-- And will WAIT if maybe_value is backed with a stream (*string)
value = maybe_value!

-- Consider a function that takes a collection as an argument
func foo(a: ?string, b: []u32, c: *bool): ...

-- To call that function with empty collection, use nil, [], ?[], or *[]:
foo(nil, [], *[])
-- Nil fits into any collection

-- Arrays can be instantiated in aqua code
func getArray(arr: []string) -> []string:
  <- ["some string", Serv.getString(), arr[1], "some string 2"]
```

## Arrow Types

Every function has an arrow type that maps a list of input types to an optional output type.

It can be denoted as: `Type1, Type2 -> Result`

In the type definition, the absence of a result is denoted with `()`, e.g., `string -> ()`

The absence of arguments is denoted `-> ()`.That is, this mapping takes no argument and has no return type.

Note that there's no `Unit` type in Aqua: you cannot assign a non-existing result to a value.

```aqua
-- Assume that arrow has type: -> ()

-- This is possible:
arrow()

-- This will lead to error:
x <- arrow()
```

## Type Alias

For convenience, you can alias a type:

```aqua
alias MyAlias : ?string
```

## Type Variance

Aqua is made for composing data on the open network. That means that you want to compose things if they do compose, even if you don't control its source code.

Therefore Aqua follows the structural typing paradigm: if a type contains all the expected data, then it fits. For example, you can pass `u8` in place of `u16` or `i16`. Or `?bool` in place of `[]bool`. Or `*string` instead of `?string` or `[]string`. The same holds for products.

For arrow types, Aqua checks the variance on arguments and contravariance on the return type.

```aqua
-- We expect u32
xs: *u32

-- u16 is less then u32
foo1: -> u16
-- works
xs <- foo1()

-- i32 has sign, so cannot fit into u32
foo2: -> i32
-- will fail
xs <- foo2()

-- Function takes an arrow as an argument
func bar(callback: u32 -> u32): ...


foo3: u16 -> u16

-- Will not work
bar(foo3)  

foo4: u64 -> u16

-- Works
bar(foo4)
```

Arrow type `A: D -> C` is a subtype of `A1: D1 -> C1`, if `D1` is a subtype of `D` and `C` is a subtype of `C1`.

## Type Of A Service And A File

A service type is a product of arrows.

```aqua
service MyService:
  foo(arg: string) -> bool

-- type of this service is:
data MyServiceType:
  foo: string -> bool
```

The file is a product of all defined constants and functions (treated as arrows). Type definitions in the file do not go to the file type.

```aqua
-- MyFile.aqua

func foo(arg: string) -> bool:
  ...

const FLAG ?= true  

-- type of MyFile.aqua
data MyServiceType:
  foo: string -> bool
  flag: bool
```

See [Imports and Exports](header/header.md#module) for module declarations.

See the [types system implementation](https://github.com/fluencelabs/aqua/blob/main/types/src/main/scala/aqua/types/Type.scala)
