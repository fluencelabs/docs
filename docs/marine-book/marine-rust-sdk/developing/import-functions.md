import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Import functions

The `[marine]` macro can also wrap a Rust [extern block](https://doc.rust-lang.org/std/keyword.extern.html). In this case, all functions declared in it are considered imported functions. If there are imported functions in some module, say, module A, then

* There should be another module, module B, that exports the same functions. The name of module B is indicated in the `link` macro (see examples below)
* Module B should be loaded into `Marine` by the moment the loading of module A starts. Module A cannot be loaded if at least one imported function is absent in `Marine`.

## **Function import requirements**

* wrap an extern block with the function(s) to be imported with the `[marine]` macro
* all function(s) arguments must be of the mtype type
* the return type of the function(s) must be mtype

## Examples

See the examples below of wrapped `extern` block usage:

<Tabs>
<TabItem value="Example 1" label="Example 1" default>

```rust
#[marine]
pub struct TestRecord {
    pub field_0: i32,
    pub field_1: Vec<Vec<u8>>,
}

// wrap the extern block with the marine macro to expose the function
// as an import to the Marine VM
#[marine]
#[link(wasm_import_module = "some_module")]
extern "C" {
    pub fn foo(arg: Vec<Vec<Vec<Vec<TestRecord>>>>, arg_2: String) -> Vec<Vec<Vec<Vec<TestRecord>>>>;
}
```

</TabItem>
<TabItem value="Example 2" label="Example 2" default>

```rust
[marine]
#[link(wasm_import_module = "some_module")]
extern "C" {
  pub fn foo(arg: Vec<Vec<Vec<Vec<u8>>>>) -> Vec<Vec<Vec<Vec<u8>>>>;
}
```

</TabItem>
</Tabs>
