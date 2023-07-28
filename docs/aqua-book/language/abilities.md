# Abilities

Abilities are a way to organize code in modules and implement inversion of control pattern in Aqua.

<!-- TODO: Add services here too -->
Ability is a product of [scalars](types.md#scalars), [structures](types.md#structures), [arrows](types.md#arrow-types) and other abilities.

```aqua
data Struct:
    int: i8

ability Simple:
    st: Struct
    arrow(x: i8) -> bool

ability Complex:
    simple: Simple
    field: string
```

## Creating abilities

Abilities could be created inside functions just like [structures](types.md#structures).

<!-- TODO: Syntax of creating abilities is a subject to change -->
```aqua
func main():
    closure = (x: i8) -> bool:
        <- x > 0

    MyComplex = Complex(
        simple = Simple(
            st = Struct(int = 0),
            arrow = closure
        ),
        field = "complex"
    )
```

## Passing abilities

Abilities could be passed to and returned from functions, althrough they require special syntax:
- Abilities required by function are listed before arguments without names
- Abilities returned by function are listed in return types just as any other types

```aqua
ability Additional:
    value: string

func createComplex{Simple, Additional}(int: i8) -> Complex, string:
    MyComplex = Complex(
        simple = Simple(
            st = Struct(int = int),
            arrow = Simple.arrow
        ),
        field = Additional.value
    )

    <- MyComplex, Additional.value

func main() -> string, string:
    closure = (x: i8) -> bool:
        <- x > 0

    MySimple = Simple(
        st = Struct(int = 0),
        arrow = closure
    )

    MyAdditional = Additional(value = "additional")

    MyComplex, value = createComplex{MySimple, MyAdditional}(42)

    <- MyComples.field, value
```

<!-- TODO: Add section about structual subtyping -->

## Why abilities are special

Abilities are fully resolved in compile time and do not affect runtime by any means.
In this sense they are more like a context or trait implementation in other languages.
For this reason special syntax is used.

## Limitations

As abilities do not exist in runtime, they could not be put into a [collection](types.md#collection-types).