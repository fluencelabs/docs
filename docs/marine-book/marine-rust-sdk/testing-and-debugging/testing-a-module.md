# Testing a module

To use the `[marine-test]` macro add `marine-rs-sdk-test` crate to the `[dev-dependencies]` section of `Config.toml`:

```toml
[dev-dependencies]
marine-rs-sdk-test = "0.7.0"
```

Let's have a look at an implementation example:

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

module_manifest!();

pub fn main() {}

#[marine]
pub fn greeting(name: String) -> String {    // 1  
    format!("Hi, {}", name)
}

#[cfg(test)]
mod tests {
    use marine_rs_sdk_test::marine_test;   // 2

    #[marine_test(config_path = "../Config.toml", modules_dir = "../artifacts")] // 3
    fn empty_string(greeting: marine_test_env::greeting::ModuleInterface) {
        let actual = greeting.greeting(String::new());  // 4 
        assert_eq!(actual, "Hi, ");
    }

    #[marine_test(config_path = "../Config.toml", modules_dir = "../artifacts")]
    fn non_empty_string(greeting: marine_test_env::greeting::ModuleInterface) {
        let actual = greeting.greeting("name".to_string());
        assert_eq!(actual, "Hi, name");
    }
}
```

1. We wrap a basic _greeting_ function with the `[marine]` macro which results in the greeting.wasm module.
2. We wrap our tests as usual with `[cfg(test)]` and import the marine _test crate._ Do **not** import _super_ or the _local crate_.
3. Instead, we apply the `[marine_test]` macro to each of the test functions by providing the path to the config file, e.g., Config.toml, and the directory containing the Wasm module we obtained after compiling our project with `marine build`. Moreover, we add the type of the test as an argument in the function signature. It is imperative that the project build precedes the test runner otherwise the required Wasm file will be missing.
4. The target of our tests is the `pub fn greeting` function. Since we are calling the function from the Wasm module we must prefix the function name with the module namespace -- `greeting` in this example case as specified in the function argument.

Now that we have our Wasm module and tests in place, we can proceed with `cargo test --release.` Note that using the `release`flag vastly improves the import speed of the necessary Wasm modules.

The full example could be found [here](https://github.com/fluencelabs/marine/tree/master/examples/greeting).
