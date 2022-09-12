# Module manifest

The `module_manifest!` macro embeds the Interface Type, SDK, and Rust project version as well as additional project and build information into a Wasm module. For the macro to be usable, it needs to be imported and initialized:

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;    // import manifest macro

module_manifest!(
  "Fluence Labs",                                // authors
  "0.1.0",                                       // version
  "The greeting module for the Fluence network", // description
  ".../marine/examples/greeting",                // repository
);

fn main() {}

#[marine]
fn greeting(name: &str) {...}
```

Using the Marine CLI, we can inspect a module's manifest with `marine info`:

```sh
marine info -i artifacts/greeting.wasm
```
```
it version:  0.23.0
sdk version: 0.6.0
authors:     Fluence Labs
version:     0.1.0
description: The greeting module for the Fluence network
repository:  https://github.com/fluencelabs/marine/tree/master/examples/greeting
build time:  2022-04-12 18:16:34.487366668 +00:00 UTC
```

It's possible to omit arguments in the `module_manifest`, in this case it'll get them from  `Cargo.toml`:

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;    // import manifest macro

module_manifest!(st);

fn main() {}

#[marine]
fn greeting(name: &str) {...}
```
