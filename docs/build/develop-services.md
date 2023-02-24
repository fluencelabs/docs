# Develop services

## Prerequisites
This doc assumes that you already have a fluence project, if not, go to [doc that describes it]

## What is service and why is it needed
A Marine service is a bunch of wasm modules linked together by a config. It is the computation part of the network. When deployed to a Peer, a service is accessible from Aqua.

## Basic example
To create a sample service, use `fluence service new`, like that:
```sh
fluence service new services/some_service --name some_service
```
This will create a service structure at `services/some_service`:
```
services/some_service
├── modules              <- modules for this service
│   └── some_service
│       ├── Cargo.toml   <- rust crate config
│       ├── module.yaml  <- module configuration file
│       └── src
│           └── main.rs  <- rust source of main module of the service
└── service.yaml         <- service configuration file
```
The default source, `main.rs`, is pretty much a hello world:
```rust
#![allow(non_snake_case)]
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

module_manifest!();                       // some required stuff, just keep it here

pub fn main() {}                          // will be called one module is started

#[marine]                                 // macro makes function appear in this module interface
pub fn greeting(name: String) -> String {
    format!("Hi, {}", name)
}
```
This service `some_service` now consists of only one module. You can run this service locally in a repl to test. Deployment to the network will be covered by other doc pages (link).

### Repl testing
Run repl using fluence CLI. It accepts service name or path to the directory with `service.yaml` 
```sh
fluence service repl some_service
```

You will see some hints and setup information, as well as promt to execute a command:
```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Execute help inside repl to see available commands.
Current service <module_name> is: some_service
Call some_service service functions in repl like this:

call some_service <function_name> [<arg1>, <arg2>]

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
Welcome to the Marine REPL (version 0.19.1)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 3b0aaf21-a499-4092-b2ef-890620b285c5
elapsed time 71.005084ms

1> 
```
The most useful commands are `help`, `call`, `interface`, and the commands have shortcats. Here is the output of the `interface command`:
```
1> i
Loaded modules interface:
exported data types (combined from all modules):
<no exported data types>

exported functions:
some_service:
  func greeting(name: string) -> string
```
The output says that module has no non-default data structures in interface, and has a `greeting` function, exported from `some_service` module that takes a string as an argument and returns a string.

Using information about interface it can be called:
```
2> c some_service greeting "World"
result: "Hi, World"
 elapsed time: 5.047333ms
```
That is the simplest way to execute the service and look if it works. To exit repl press `ctrl + C`.

## More complicated examples
After basic example works its time to go try more features:
 * structs in interfaces
 * mounted binaries and filesystem access
 * multi-module services

### Structs in interfaces
`#[marine]` functions can have numbers, strings, vectors and custom structs in signatures. To be used in signature, a structure must:
* be marked with `#[marine]` macro
* have only numbers, strings, vectors or other `#[marine]` structs as fields

Lets add a structure and a new function in our service:
```rust
#![allow(non_snake_case)]
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

module_manifest!();

pub fn main() {}

#[marine]
pub struct SomeStruct {
    number: i32,
    string: String,
    vector: Vec<i32>
}

#[marine]
pub fn process_struct(arg: SomeStruct) -> SomeStruct {
    SomeStruct {
        number: arg.number + 1,
        string: format!("{} {}", arg.string, 1),
        vector: vec![arg.vector[0]; 2],
    }
}

#[marine]
pub fn greeting(name: String) -> String {
    format!("Hi, {}", name)
}
```
And then use `fluence service repl some_service` again to run it. Then, `interface` command will show how interface changed:

```
1> i
Loaded modules interface:
exported data types (combined from all modules):
data SomeStruct:
  number: i32
  string: string
  vector: []i32

exported functions:
some_service:
  func process_struct(arg: SomeStruct) -> SomeStruct
  func greeting(name: string) -> string 
```

The structure added as `data SomeStruct`, and `process_struct` appeared in the exported function section. Lets call the function then. But how to represent the structure? The answer is as JSON. Repl interprets function arguments as JSON, so it must be a single json value (string, number, array or object). The top-level array or object is always interpreted as a container for function arguments, to handle functions with more than one argument. So, if function has only one argument and it is an array or an object, it is required to wrap it with `[]`. So, here is the call:
```
2> c some_service process_struct [{"number": 1, "string": "test", "vector": [4]}]
result: {
  "number": 2,
  "string": "test 1",
  "vector": [
    4,
    4
  ]
}
 elapsed time: 10.09025ms
```
Also, an array can be used instead of object:
```
3> c some_service process_struct [[1,"test", [4]]]
result: {
  "number": 2,
  "string": "test 1",
  "vector": [
    4,
    4
  ]
}
 elapsed time: 211.125µs
 ```