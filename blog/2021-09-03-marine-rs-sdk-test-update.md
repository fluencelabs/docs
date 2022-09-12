---
slug: marine-rs-sdk-test-v0.2.0
title: marine-rs-sdk-test v0.2.0
authors: mikevoronov
tags: [marine]
---

Updated the marine-rs-sdk-test to the 0.2.0 version with the following changes:

- `#[marine_test]` defines `marine_test_env` namespace with module interfaces

- module interface type can be accessed by `marine_test_env::<module_name>::ModuleInterface`

- structs exported by a module can be accessed by `marine_test_env::<module_name>::<StructName>`

- functions under `#[marine_test]` must specify in the arguments modules they use

Chosen naming and passing modules interfaces in arguments should make tests more readable.
Here is an example of a test written in old and new ways:

old:
```rust
#[marine_test(config_path = "../Config.toml", modules_dir = "../artifacts")]
fn empty_string() {
    let actual = greeting.greeting(String::new());
    assert_eq!(actual, "Hi, ");
 }
```

new:
```rust
#[marine_test(config_path = "../Config.toml", modules_dir = "../artifacts")]
fn empty_string(greeting: marine_test_env::greeting::ModuleInterface {
    let actual = greeting.greeting(String::new());
    assert_eq!(actual, "Hi, ");
}
```

Also the update the solves problem with the same structures from different modules: they are now linked and have the same type.

If you need more examples, please look at tests in [call_parameters](https://github.com/fluencelabs/marine/blob/master/examples/call_parameters/src/main.rs#L43) and [greeting](https://github.com/fluencelabs/marine/blob/master/examples/greeting/src/main.rs#L30), they are already using new interface.
