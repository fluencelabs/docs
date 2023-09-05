# Structures

The `#[marine]` macro can also wrap a `struct` making it possible to use it as a function argument or return type. Note that

* only macro-wrapped structures can be used as function arguments and return types
* all fields of the wrapped structure must be public and of the `mtype`
* it is possible to have inner records in the macro-wrapped structure and to import wrapped structs from other crates

## Structure passing requirements

* wrap a structure with the `#[marine]` macro
* all structures fields must be of the `mtype`
* the structure must be pointed to without preceding package import in a function signature, i.e. `StructureName` but not `package_name::module_name::StructureName`
* wrapped structures can be imported from crates

## Examples

See the examples below for wrapping `struct`:

<Tabs>
<TabItem value="Example 1" label="Example 1" default>

```rust
#[marine]
pub struct TestRecord0 {
    pub field_0: i32,
}

#[marine]
pub struct TestRecord1 {
    pub field_0: i32,
    pub field_1: String,
    pub field_2: Vec<u8>,
    pub test_record_0: TestRecord0,
}

#[marine]
pub struct TestRecord2 {
    pub test_record_0: TestRecord0,
    pub test_record_1: TestRecord1,
}

#[marine]
fn foo(mut test_record: TestRecord2) -> TestRecord2 { unimplemented!(); }
```

</TabItem>
<TabItem value="Example 2" label="Example 2" default>

```rust
#[marine]
pub struct TestRecord0 {
    pub field_0: i32,
}

#[marine]
pub struct TestRecord1 {
    pub field_0: i32,
    pub field_1: String,
    pub field_2: Vec<u8>,
    pub test_record_0: TestRecord0,
}

#[marine]
pub struct TestRecord2 {
    pub test_record_0: TestRecord0,
    pub test_record_1: TestRecord1,
}

#[marine]
#[link(wasm_import_module = "some_module")]
extern "C" {
  fn foo(mut test_record: TestRecord2) -> TestRecord2;
}
```

</TabItem>
<TabItem value="Example 3" label="Example 3" default>

```rust
mod data_crate {
    use fluence::marine;
    #[marine]
    pub struct Data {
        pub name: String,
        pub data: f64,
    }
}

use data_crate::Data;
use fluence::marine;

fn main() {}

#[marine]
fn some_function() -> Data {
    Data {
        name: "example".into(),
        data: 1.0,
    }
}
```

</TabItem>
</Tabs>
