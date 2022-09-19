---
description: Developing the greeting service
---

# Develop a single module service

In this section, we'll fly through the process of the creation of a simple [greeting](https://github.com/fluencelabs/marine/tree/master/examples/greeting) service.

For a backend module and a service to be compatible with the Marine runtime and able to link with other modules, they must follow a few conventions. With the Marine Rust SDK, these conventions will be enforced automatically.

## Create a Marine project

Let's start with the template project generation:

```sh
# create template Marine project
marine generate --name greeting

# go to the package directory
cd greeting 
```

This template project reflects the greeting service that we want to build, let's open `src/main.rs` and see what it's like to write a simple project with Marine:

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

module_manifest!();

pub fn main() {}

#[marine]
pub fn greeting(name: String) -> String {
    format!("Hi, {}", name)
}

// --snip--
```

This code imports the [Marine SDK](https://crates.io/crates/marine-rs-sdk) and wraps the `greeting` function with the `#[marine]` macro. Any function wrapped with the `#[marine]` macro will be exported from the compiled Wasm module.

## Compile to Wasm

To convert the module to a Wasm (`.wasm`) file, run the following command in the `greeting` directory:

```sh
# compile the project to Wasm in a compatible with Marine way
./build.sh
```

To make sure that module compiled correctly, let's retrieve some internal info from it:

```sh
# obtain some info from a compiled module
# (build.sh copies compiled Wasm binary to the artifacts folder)
marine info artifacts/greeting.wasm
```
```
it version:  0.23.1
sdk version: 0.6.0
authors:     <user-name>
version:     0.1.0
description:
repository:
build time:  2022-05-15 14:52:37.865550 +00:00 UTC
```

That's it, you have a module ready to run!

## Run greeting with REPL

To load a module, you need to specify the module name and path to the compiled binary of the module

```sh
# run mrepl and load the greeting module
mrepl

Welcome to the Marine REPL (version 0.16.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 11d28d35-de26-49a1-9dc5-ad9e0667ab52
elapsed time 46.371831ms

1> load greeting artifacts/greeting.wasm
module successfully loaded into App service
elapsed time: 52.153308ms
```

After loading the module, we can examine its interface using the `interface` command:

```sh
2> interface
Application service interface:

greeting:
  fn greeting(name: String) -> String
```

Now the function determined in the module can be called by specifying the module name, the function name, and its arguments in json:

```sh
3> call greeting greeting "user"
result: String("Hi, user")
 elapsed time: 132.021µs
```

The complete code of this example can be found on [GitHub](https://github.com/fluencelabs/marine/tree/master/examples/greeting).
