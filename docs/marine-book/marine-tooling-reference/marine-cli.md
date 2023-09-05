# Marine CLI

The [Marine CLI](https://github.com/fluencelabs/marine/tree/master/tools/cli) provides a convenience wrapper over several of the Marine tools and utilities.

## Installation

Install `marine` with:

```sh
cargo +nightly install marine
```

## List of commands

The CLI functionality is available with:

```sh
marine --help

Fluence Marine command line tool 0.12.7
Fluence Labs

USAGE:
    marine [SUBCOMMAND]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

SUBCOMMANDS:
    aqua        Shows data types of provided module in a format suitable for Aqua
    build       Builds provided Rust project to Wasm
    generate    Generates a template project for a Marine Wasm module
    help        Prints this message or the help of the given subcommand(s)
    info        Shows manifest and sdk version of the provided Wasm file
    it          Shows IT of the provided Wasm file
    repl        Starts Fluence application service REPL
    set         Sets interface types and version to the provided Wasm file
```

### aqua: show types in an Aqua-compatible way

Shows all data types defined in a Marine module in the Aqua-compatible way:

```sh
marine help aqua

USAGE:
    marine aqua [OPTIONS] <in-wasm-path>

OPTIONS:
    -i, --id <service-id>           optional service id
    -s, --service <service-name>    optional service name

ARGS:
    <in-wasm-path>    a path to a Wasm file
```
```sh
marine aqua -i TestServiceId -s TestServiceName artifacts/records_effector.wasm

module TestServiceName declares *

data TestRecord:
  field_0: bool
  field_1: i8
  field_2: i16
  field_3: i32
  field_4: i64
  field_5: u8
  field_6: u16
  field_7: u32
  field_8: u64
  field_9: f32
  field_10: f64
  field_11: string
  field_12: []u8

service TestServiceName("TestServiceId"):
  mutate_struct(test_record: TestRecord) -> TestRecord
```

### build: compile Marine module

Compiles Rust project to a Marine Wasm module. Under the hood, it calls `cargo build` providing all given arguments, then compiles and embeds interface-types to compiled Wasm binary.

```sh
marine help build

USAGE:
    marine build [optional]...

ARGS:
    <optional>...    cargo build arguments
```

### generate: generate Marine project templates

Uses the power `cargo-generate` to generate a new project from [this](https://github.com/fluencelabs/marine-template) template. Note that `cargo-generate` should be installed (by `cargo install cargo-generate`) to use this subcommand.

```sh
marine help generate

USAGE:
    marine generate [FLAGS] [OPTIONS]

FLAGS:
    -i, --init       generate the template into the current dir without creating a new one

OPTIONS:
    -n, --name <generate-project-name>    a project name; if the name isn't in kebab-case, it'll be converted to kebab-
                                          case
```

### info: prints embedded into Wasm file info

The `marine_manifest` macro embeds some info into compiled Wasm module that could be obtained with this command:

```sh
marine info artifacts/greeting.wasm

it version:  0.23.0
sdk version: 0.6.0
authors:     Fluence Labs
version:     0.1.0
description: The greeting module for the Fluence network
repository:  https://github.com/fluencelabs/marine/tree/master/examples/greeting
build time:  2022-04-12 18:16:34.487366668 +00:00 UTC
```

### it: shows interface-types of the Wasm binary

Interface-types are embedded into a custom section of a Wasm binary while building with `marine build`

```sh
marine it artifacts/greeting.wasm

(@interface it_version "0.23.0")

;; Types
(@interface type (func
  (param $size: i32)
    (result i32)))   ;; 0
...
;; Exports
(@interface export "allocate" (func 0))
(@interface export "release_objects" (func 1))
...

;; Implementations
(@interface implement (func 12) (func 11))
(@interface implement (func 14) (func 13))
```

### repl: run mrepl

Runs the `Marine REPL`:

```sh
marine repl

Welcome to the Marine REPL (version 0.16.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = aadec167-2a68-44de-b046-f5838ea77a77
elapsed time 720.874¬µs

1>
```

### set: set IT or SDK version

```sh
marine help set

USAGE:
    marine set [SUBCOMMAND]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

SUBCOMMANDS:
    help       Prints this message or the help of the given subcommand(s)
    it         Sets given interface types to the provided Wasm file
    version    Sets given sdk version to the provided Wasm file
```
For example:
```sh
marine set version -i artifacts/greeting.wasm -v 0.7.0

the version was successfully embedded
```
Lets check it worked:
```sh
marine info artifacts/greeting.wasm

it version:  0.23.0
sdk version: 0.7.0
authors:     Fluence Labs
version:     0.1.0
description: The greeting module for the Fluence network
repository:  https://github.com/fluencelabs/marine/tree/master/examples/greeting
build time:  2022-04-12 18:16:34.487366668 +00:00 UTC
```
