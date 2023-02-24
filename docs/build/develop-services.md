# Develop services

## Prerequisites
This doc assumes that you already have a fluence project, if not, go to [doc that describes it]

## What is service and why is it needed
A Marine service is a bunch of wasm modules linked together by a config. It is the computation part of the network. When deployed to a Peer, a service is accessible from Aqua.

## A simple example
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
This service `some_service` now consists of only one module. We can run this service locally in a repl to test, or deploy it to some Peer.

### Repl testing
Run repl using fluence CLI. It accepts service name or path to the directory with service.yaml 
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

TODO: module linking, mounted binaries

### Deploying to the network 
