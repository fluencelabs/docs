import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Using cargo build scripts

Testing sdk also has the interface for [cargo build scripts](https://doc.rust-lang.org/cargo/reference/build-scripts.html). Some IDEs can analyze files generated in build scripts, providing code completion and error highlighting for code generated in build scripts. But using it may be a little bit tricky because build scripts are not designed for such things.

To set up IDE you need to do the following:

#### CLion:

* in the `Help -> Actions -> Experimental Futures` enable `org.rust.cargo.evaluate.build.scripts`
* refresh cargo project in order to update generated code: change `Cargo.toml` and build from IDE or press `Refresh Cargo Project` in Cargo tab

#### VS Code:

* install the `rust-analyzer` plugin
* change `Cargo.toml` to let plugin update code from generated files

The update will not work instantly: you should build service to wasm, and then trigger `build.rs` run again, but for the native target.

And here is the example of using this:

<Tabs>
<TabItem value="build.rs" label="build.rs" default>

```rust
use marine_rs_sdk_test::generate_marine_test_env;
use marine_rs_sdk_test::ServiceDescription;

fn main() {
    let services = vec![ // <- 1
        ("greeting".to_string(), ServiceDescription {
            config_path: "Config.toml".to_string(),
            modules_dir: Some("artifacts".to_string()),
        })
    ];

    let target = std::env::var("CARGO_CFG_TARGET_ARCH").unwrap();
    if target != "wasm32" { // <- 2
        generate_marine_test_env(services, "marine_test_env.rs", file!()); // <- 3
    }

    println!("cargo:rerun-if-changed=src/main.rs"); // <- 4
}
```

</TabItem>
<TabItem value="src/main.rs" label="src/main.rs" default>

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

module_manifest!();

pub fn main() {}

#[marine]
pub fn greeting(name: String) -> String {
    format!("Hi, {}", name)
}

#[cfg(test)]
mod built_tests {
    marine_rs_sdk_test::include_test_env!("/marine_test_env.rs"); // <- 4
    #[test]
    fn non_empty_string() {
        let mut greeting = marine_test_env::greeting::ServiceInterface::new();
        let actual = greeting.greeting("name".to_string());
        assert_eq!(actual, "Hi, name");
    }
}t
```

</TabItem>
<TabItem value="Cargo.toml" label="Cargo.toml" default>

```toml
[package]
name = "wasm-build-rs"
version = "0.1.0"
authors = ["Fluence Labs"]
description = "The greeting module for the Fluence network"
repository = "https://github.com/fluencelabs/marine/tree/master/examples/build_rs"
edition = "2018"
publish = false

[[bin]]
name = "build_rs_test"
path = "src/main.rs"

[dependencies]
marine-rs-sdk = "0.6.11"

[dev-dependencies]
marine-rs-sdk-test = "0.5.0"

[build-dependencies]
marine-rs-sdk-test = "0.5.0"
```

</TabItem>
</Tabs>

1. We create a vector of pairs (service\_name, service\_description) to pass to the generator. The structure is the same with multi-service `marine_test`.
2. We check if we build for a non-wasm target. As we build this marine service only for `wasm32-wasi` and tests are built for native target, we can generate `marine_test_env` only for tests. This is needed because our generator depends on the artifacts from `wasm32-wasi` build. We suggest using a separate crate for using build scripts for testing purposes. It is here for simplicity.
3. We pass our services, the name of the file to generate, and a path to the build script file to the `marine_test_env` generator. Just always use `file!()` for the last argument. The generated file will be in the directory specified by the `OUT_DIR` variable, which is set by cargo. The build script must not change any files outside of this directory.
4. We set up conditions to re-run the build script. It must be customized, a good choice is to re-run the build script when .wasm files or `Config.toml` are changed.
5. We import the generated file with the `marine_test_env` definition to the project.
6. Do not forget to add `marine-rs-sdk-test` to the `build-dependencies` section of `Cargo.toml`.
