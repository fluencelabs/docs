import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Export functions

Applying the `[marine]` macro to a function results in its export, which means that it can be called from other modules or AIR scripts.

## mtype

For the function to be compatible with this macro, its arguments must be of the `mtype`, which is defined as follows:

`mtype` = `bool`, `u8`, `u16`, `u32`, `u64`, `i8`, `i16`, `i32`, `i64`, `f32`, `f64`, `String`\
`mtype` = `mtype` | `Vec`<`mtype`>\
`mtype` = `mtype` | `Record`<`mtype`>

## Function Export Requirements

In other words, the arguments must be one of the types listed below:

* one of the following Rust basic types: `bool`, `u8`, `u16`, `u32`, `u64`, `i8`, `i16`, `i32`, `i64`, `f32`, `f64`, `String`
* a vector of elements of the above types
* a vector composed of vectors of the above type, where recursion is acceptable, e.g. the type `Vec<Vec<Vec<u8>>>` is permissible
* a record, where all fields are of the basic Rust types
* a record, where all fields are of any above types or other records

The return type of a function must follow the same rules, but currently, only one return type is possible.

## Examples

See the example below of an exposed function with a complex type signature and return value:

<Tabs>
<TabItem value="Example 1" label="Example 1" default>

```rust
// export TestRecord as a public data structure bound by 
// the IT type constraints
#[marine]
pub struct TestRecord {
    pub field_0: i32,
    pub field_1: Vec<Vec<u8>>,
}

// export foo as a public function bound by the 
// the IT type constraints 
#[marine]
pub fn foo(arg_1: Vec<Vec<Vec<Vec<TestRecord>>>>, arg_2: String) -> Vec<Vec<Vec<Vec<TestRecord>>>> { 
    unimplemented!() 
}
```

</TabItem>
<TabItem value="Example 2" label="Example 2" default>

```rust
// export Data and Input as a public data structures bound by 
// the IT type constraints
#[marine]
pub struct Data {
    pub name: String,
}

#[marine]
pub struct Input {
    pub first_name: String,
    pub last_name: String,
}

// export produce as a public function bound by the 
// the IT type constraints
#[marine]
pub fn produce(data: Input) -> Data {
    unimplemented!()
}
```

</TabItem>
</Tabs>
