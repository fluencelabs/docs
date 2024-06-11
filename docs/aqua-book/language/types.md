# Types

## Scalars

Scalar types in Aqua follow the Wasm IT notation.

* Unsigned numbers: `u8`, `u16`, `u32`, `u64`
* Signed numbers: `i8`, `i16`, `i32`, `i64`
* Floats: `f32`, `f64`
* Boolean: `bool`
* String: `string`

## Data Types

In Aqua terminology, data types are types that actually represent value at runtime. In other words, it is any type that is an immutable combination of scalars:
- [Scalars](#scalars)
- [Immutable Collections](#immutable-collections)
- [Structures](#structures)

## Collection Types

There are two kinds of collections in Aqua: immutable and appendable. To denote a collection of a given type `T`, use the quantifier before the type name like so:
- `?T` for an immutable option of `T`, e.g. `?[]i64`, `?string`
- `[]T` for an immutable array of `T`, e.g. `[]u32`, `[]?Result`
- `*T` for an appendable stream of `T`, e.g. `*[]Response`, `*?string`
- `%T` for an appendable map-like collection of `T` with `string` keys, e.g. `%[]Response`, `%?string`

Only [data types](#data-types) can be used as elements of any collection, e.g. `[]u32`, `?[]string`, `*[]?u64` are valid types, but `[]*u32`, `?*string`, `**u64` are not.

For every collection type functor `length` is defined, e.g. `option.length`, `arr.length`, `stream.length`. It returns the number of elements in the collection.

To see collections usage examples, see [Collections](../language/values.md#collections).

### Immutable Collections

Aqua has two types of immutable collections: 
- Arrays containing a fixed number of elements of the same type. The quantifier is `[]`, e.g. `[]string`, `[]?Report`, `[][]i64` are all valid array types. To access an element of an array, use: 
  - The square brackets notation with any expression of integer type inside, e.g. `arr[10]`, `arr[arr.length - 1]`.
  - The bang notation, optionally followed by a number or a variable, e.g. `arr!10`, `arr!index`, `arr!` (the same as `arg!0`).
- Options containing none or one element of a given type. The quantifier is `?`, e.g. `?string`, `?[]Error` are all valid option types. To access an element of an option, use the bang notation, e.g. `opt!` or `opt!0`. There is a literal that represents an empty option: `nil`.

### Appendable Streams

Aqua has appendable [streams](./crdt-streams.md). The quantifier is `*`, e.g. `*?string`, `*Result`, `*[]i64` are all valid stream types. To access an element of a stream, use:
  - The square brackets notation, with any expression of integer type inside, e.g. `stream[10]`, `stream[requests.length - 1]`.
  - The bang notation, optionally followed by a number or a variable, e.g. `stream!5`, `stream!index`, `stream!` (the same as `stream!0`). 
Note that accessing an element of a stream could trigger [join behavior](../language/flow/parallel.md#join-behavior) on the stream.

### Appendable Maps

Appendable [maps](./crdt-maps.md) are streams of key-value pairs with key always being a `string`. The quantifier is `%`, e.g. `%?string`, `%Result`, `%[]i64` are all valid map types. There are various methods to access elements of a map:
  - `get` and `getStream` methods that return array of elements and stream of elements by key.
  - `keys` and `keysStream` methods that return array of keys and stream of keys.
  - `contains` method that returns if key is exist in map or not.
Note that accessing an element of a map could trigger [join behavior](../language/flow/parallel.md#join-behavior) on the stream.



## Structures

Structure types are product types of [data types](#data-types). They are defined with the `data` keyword:

```aqua
data InnerStruct:
    arr: []string
    num: u32

data SomeStruct:
    str: string
    num: u64
    inner: InnerStruct
```

Structures could be instantiated with the following syntax:

```aqua
func createStruct(i: []u32) -> SomeStruct:
    <- SomeStruct(
        str = "some str",
        num = 4,
        inner = InnerStruct(arr = ["a", "b", "c"], num = i[2])
    )
```

Note that the order of fields does not matter and it is possible to pass just a variable if it has the same name as a field:

```aqua
func createStruct(i: []u32) -> SomeStruct:
    str = "some str"
    inner = InnerStruct(["a", "b", "c"], i[2])
    <- SomeStruct(
      str, -- short for `str = str`
      num = 4,
      inner -- short for `inner = inner`
    )
```

To modify a structure value, there's a method called 'copy'. It creates a copy with values of specified fields changed.
Note that copy operates in an immutable way: it does not modify original structure value.

```aqua
func changeStr(someStruct: SomeStruct) -> SomeStruct:
    <- someStruct.copy(str = "new string")
```

Passing just a variable is also possible with `copy`:

```aqua
func changeStr(someStruct: SomeStruct) -> SomeStruct:
    str = "new string"
    <- someStruct.copy(str) -- short for `str = str`
```

Fields are accessible with the dot operator `.` , e.g. `product.field`.

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

It is possible to alias a type to a name.
It may help with self-documented code and refactoring.

```aqua
alias PeerId: string
alias MyDomain: DomainType
```

## Type Variance

Aqua is made for composing data on the open network. That means that you want to compose things if they do compose, even if you don't control its source code.

Therefore Aqua follows the structural typing paradigm: if a type contains all the expected data, then it fits. For example, you can pass `u8` in place of `u16` or `i16`, `?bool` in place of `[]bool` (or vice-versa), `*string` instead of `?string` or `[]string`. The same holds for products.

But note that [immutable collections](#immutable-collections) could not be used in place of [appendable streams](#appendable-collections), e.g. `[]string` is not a subtype of `*string`.

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

## Service type

A service type is a product of arrows.

```aqua
service MyService:
  foo(arg: string) -> bool
```

See [services](services.md)

## Ability type

An ability type is a product of arrows, scalars, structures and other abilities.

```aqua
ability Ability:
    arrow(x: i32) -> i32
    field: string
    struct: SomeStruct
    ab: AnotherAbility
```

See [abilities](abilities.md)

## Type of a file

A file is a product of all defined constants and functions (treated as arrows). Type definitions in the file do not go to the file type.

```aqua
-- MyFile.aqua

func foo(arg: string) -> bool:
  ...

const FLAG ?= true
```

See [Imports and Exports](header/header.md#module) for module declarations.

See the [types system implementation](https://github.com/fluencelabs/aqua/blob/main/types/src/main/scala/aqua/types/Type.scala)
