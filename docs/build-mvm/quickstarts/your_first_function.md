# Your First Cloudless Function

In this section we pickup where we left off in the [Getting Started](../overview/getting_started.md) section and dive into the *Hello World* example a little deeper. You can continue to use the project you created earlier or create a new one. If you don't have Fluence CLI installed, make sure you have nodejs v 18 and continue to install the binary or use an [alternative approach](https://github.com/fluencelabs/cli?tab=readme-ov-file#installation-and-usage).

You install the Fluence CLI binary like so:
```bash
curl -qsL https://raw.githubusercontent.com/fluencelabs/cli/main/install.sh | bash
```
and follow up with `fluence update`. 

To create a new project scaffold:

```bash
fluence init hello-world
```

Which gets your to the template installation prompt:

```bash
? Select template (Use arrow keys)
❯ quickstart
  minimal
  ts
  js
```
Choose the default template option, `quickstart`, and stick with the default choice, *kras* for the next prompt which sets the environment:

```bash
? Select Fluence Environment to use by default with this project (Use arrow keys)
❯ kras (default)
  testnet
  stage
  local
  custom
```

Depending on your previous use, or lack thereof, Fluence CLI may install multiple dependencies including the [Rust toolchain](https://www.rust-lang.org/), which will take a minute. Eventually, you should see a message similar to:

```bash
Successfully initialized Fluence CLI project template at <your path>/hello-world
```

`cd` into the directory and look around a bit, e.g. with the `tree` command:

```bash
$ tree -L 2
.
├── Cargo.lock
├── Cargo.toml
├── README.md
├── fluence.yaml
├── src
│   ├── aqua
│   └── services
└── target
    ├── CACHEDIR.TAG
    ├── release
    └── wasm32-wasi

7 directories, 5 files
```

In essence, Fluence CLI comes with several scaffolding templates to make development a little easier and a little faster. The *quickstart* template provides the basic components you need to develop and deploy your Fluence Functions:

* Rust section including src/services dir
* Aqua section including src/aqua dir
* Internal section including the .fluence dir

For starters, the *quickstart* template created a `src/services/` directory and a default service called myService. 

:::info
In Marine terminology, a service is a namespace over the Wasm artifacts consisting of  modules and configuration files. Multiple Wasm modules can be linked but can only have a single (module) interface, called the facade module as reflected in the service.yaml file. See the [Glossary](https://fluence.dev/docs/build/glossary#facade-module) for more information about modules and module types.
:::

In your editor or IDE, have a look at the `src/services/myService/modules/myService/src/main.rs` file:

```rust
     1	#![allow(non_snake_case)]
     2	use marine_rs_sdk::marine;
     3	use marine_rs_sdk::module_manifest;
     4
     5	module_manifest!();
     6
     7	pub fn main() {}
     8
     9	#[marine]
    10	pub fn greeting(name: String) -> String {
    11	    format!("Hi, {}", name)
    12	}
```

For our quickstart purposes, lines 2 and 9 are the most pertinent. In line 2, we import the *marine macro* from the [marine_rs_sdk](https://crates.io/crates/marine-rs-sdk) crate. The SDK which builds on top of the [wasmtime](https://wasmtime.dev/) runtime to enable you to write performant, effective Fluence Functions for Fluence's serverless Wasm runtime. For a comprehensive overview and deep dive into Marine, see the [Marine book](https://fluence.dev/docs/marine-book/introduction).  Suffice it to say that in order for Rust to compile to the *wasm32-wasi* compile target usable by the Fluence stack, exposed functions, i.e., publicly accessible functions like `greeting`, need to be wrapped up with `#[marine]` (line 9) macro provided by the marine-rs-sdk.

Go ahead and change the function name from *greeting* to *hello* and run `fluence build` to recompile our code. You should see output similar to:

```bash
# Making sure all services are downloaded...
# Making sure all services are built...
   Compiling myService v0.1.0 (/Users/bebo/localdev/fluence-code/mvm-docs-code/hello-world/src/services/myService/modules/myService)
    Finished release [optimized] target(s) in 0.37s
```

When you look into the Rust *target** directory, specifically into the `target/wasm32-wasi/release` directory, you see the Wasm module `myService.wasm`, i.e., our Lambda, created by compiling our Rust code in the myService namespace:

```bash
ll target/wasm32-wasi/release|grep .wasm
-rwxr-xr-x@  1 bebo  staff    85K Jan  2 15:28 myService.wasm
```

Eventually, we'll deploy that module to the network for serverless usage. But before we do that, lets quickly review testing options with respect to both local and remote. Running defective code in serverless can be an expensive undertaking as billing is commensurate with execution and a run-away service, fro example, can be rather costly. Hence, testing is of even greater importance. The Fluence toolchain supports interactive and non-interactive testing of your Fluence Functions using [Marine Repl](https://crates.io/crates/mrepl) or the [marine-rs-test-sdk](https://crates.io/crates/mrepl). For our purposes, we'll constrain ourself to the REPL. See the [testing section](../how-to/test.md) for a comprehensive review of both tooling and strategy.

Back to the task at hand. We created some code, well, inherited it from the *quickstart* template, and compiled it to wasm32-wasi. So now what? Well, before we do anything else, we want to know if our *hello* function works. For that we use the Marine REPL. Use to the Fluence CLI to srat it up: `fluence service repl mYService`. If you haven't used the REPL yet, the CLI will download and install it for you. Once the installation is complete, you should see something similar to this:

```bash
# Making sure service and modules are downloaded and built...
    Finished release [optimized] target(s) in 0.09s
# Downloading mrepl@0.24.0 binary to /Users/bebo/.fluence/cargo/mrepl/0.24.0...


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Execute help inside repl to see available commands.
Current service <module_name> is: myService
Call myService service functions in repl like this:

call myService <function_name> [<arg1>, <arg2>]

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

}
Welcome to the Marine REPL (version 0.24.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 6179e0c3-e2ad-47b1-9cd5-0e5bb37da89e
elapsed time 27.941541ms

1>
```

Use the *help* command to see all your options but for now, enter *interface*:

```bash
1> interface
Loaded modules interface:
exported data types (combined from all modules):
<no exported data types>

exported functions:
myService:
  func hello(name: string) -> string

2>
```

Remember when we wrapped the *hello* functions with the `marine` macro to make the function callable? Well, here it is in the *myService* namespace (the template provided ) from our project scaffold. In order to use the function, we need to call it with the *call* command from its namespace:

```bash
2> call myService hello ["Fluence"]
result: "Hi, Fluence"
 elapsed time: 2.609542ms

3>
```

Looks like our *hello* function is working as intended. Try calling it with a parameter of a wrong type, e.g., an **int** or **float**, and check the error message.

Just to recap, we loaded our myService.wasm module into the REPl, identified our callable *hello* function and called it. Don't forgot, if you make changes to your source code, you need to recompile it and load the new Wasm module into the REPL to see any changes. Try changing the function name from *hello* to *hello_world*, compile the code and load the new Wasam module into the REPL:

```bash
1> call myService hello_world ["Fluence"]
result: "Hi, Fluence"
 elapsed time: 3.402667ms
```

Now that we are satisfied that our code is in working order, it's time to deploy our Fluence Functions.


**Need payment and deployment sorted before we can continue and finalize the section**




