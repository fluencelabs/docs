# Marine REPL

Marine REPL (`mrepl`) is a CLI tool to run modules and services locally and make calls to them. The main purpose of this tool is to provide you with a way to test your service during development.

## Installation

Please note that `mrepl` could be run only on nightly Rust, install with:

```sh
cargo install mrepl
```

## Run REPL

```sh
mrepl --help
```
```
Usage: mrepl [CONFIG_FILE_PATH]

Fluence Application service REPL

0.16.0

Parameters:
  [CONFIG_FILE_PATH]    Path to a service config

Options:
  -h, --help            Show this help message.
```

`CONFIG_FILE_PATH` is an optional path to a service `*.toml` config file that describes a combination of modules required for service creation.

To run REPL just call a command in a terminal:

```sh
mrepl
```
```
Welcome to the Marine REPL (version 0.16.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 732f4136-7542-4101-851e-511cc83e6ac0
elapsed time 1.444318ms
```

Virtual (life cycle is only in REPL) service will be created.

## Enabling logger

Marine Wasm module support a custom logging mechanism, it's described in this [section](../marine-rust-sdk/developing/logging.md), but **by default all logging is disabled in the REPL except for the `error` level**. There is an additional mechanism in REPL to control this behavior, it's based on two environment variables.

### RUST_LOG

It behaves similar to the Rust [env_logger](https://rust-lang-nursery.github.io/rust-cookbook/development_tools/debugging/config_log.html), you could use specify the minimum logging level for all loaded in the REPL modules. Let's consider an example:

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::WasmLoggerBuilder;

fn main() {
   WasmLoggerBuilder::new()
        .with_log_level(log::LevelFilter::Trace)
        .build()
        .unwrap();
}

#[marine]
fn log() {
   log::trace("logging with a trace level");
   log::info("logging with an info level");
}
```

```sh
RUST_LOG="info" mrepl --quiet Config.toml
```
```
1> call log_module log
"logging with an info level"
result: Null
 elapsed time: 160.923µs
```

### WASM\_LOG

`WASM_LOG` allows you to specify a log level for every module. The value of this environment variable is a comma-separated list of logging directives. A logging directive is of the form: `module_name = log level`, or `global_log_level`.

Consider the following string

`WASM_LOG="module_name_1=log_level_1,module_name_2=log_level_2,global_level"`

It sets `log_level_1` for the module with name `module_name_1`, `log_level_2` for `module_name_2` and `global_level` for all other modules.

## List of commands

This section briefly describes all supported by the REPL commands. Note that every command has a short and a long name (such as `l` and `load` for module loading) - they are separated by a bar sign.

### help: show help

```
1> help
Commands:

n/new [config_path]                                   create a new service (current will be removed)
l/load <module_name> <module_path>                    load a new Wasm module
u/unload <module_name>                                unload a Wasm module
c/call <module_name> <func_name> <args> [call_params] call function with given name from given module
i/interface                                           print public interface of all loaded modules
s/stats                                               print memory size of all loaded modules
e/envs <module_name>                                  print environment variables of a module
f/fs <module_name>                                    print filesystem state of a module
s/stats                                               print consumed memory size of each module
h/help                                                print this message
q/quit/Ctrl-C                                         exit

<args> and [call_params] should be in json
```

### new: create a local service

Creates a new virtual service with empty modules. It could be useful when you need to load a service from config or need to completely remove the previous service with all its modules.

```
1> new Config.toml
app service was created with service id = 4b9985d0-cf9e-42c7-b44e-29ec9213eff1
elapsed time 77.144723ms
```

### load: load module

A module could be loaded dynamically right in a REPL

```
1> load greeting artifacts/greeting.wasm
module successfully loaded into App service
elapsed time: 74.451281ms
```

### unload: unload module

Use it carefully. It could crash service after the call if the module that linked with another will be unloaded.

```
1> unload greeting
module successfully unloaded from App service
elapsed time: 421.775µs
```

### call: call a function

Allows you to call the specified module's function. Please note that from Aqua only the `facade` module could be called. To provide several arguments to the function, pass them as a JSON array.

```
1> call greeting greeting "Fluence"
result: String("Hi, Fluence")
 elapsed time: 160.923µs
```

As an unrelated example, here is how the AquaVM invocation might look like:
```
2> call avm invoke ["(null)", [], [], {"init_peer_id": "init", "current_peer_id": "some", "timestamp": 1500000000000, "ttl": 120000}, [123, 125]]
result: ...
 elapsed time: 45.712375ms
```

### interface: show interfaces

Interface in this context is a set of all exported functions from every loaded in the REPL module.

```
1> interface
Loaded modules interface:

greeting:
  fn greeting(name: String) -> String
```

### stats: show a memory statistics

Shows memory statistics of each loaded module:

```
1> stats
Loaded modules heap sizes:
greeting - 1.1 MB
```

### envs: show environment variables of a module

Shows all environment variables that the provided module has (they are able to use with the standard Rust [std::env](https://doc.rust-lang.org/std/env) module):

```
1> envs greeting
Environment variables:
tmp=/tmp/403e91d4-cd7e-433e-a940-8e21ed6e9351/tmp
service_id=403e91d4-cd7e-433e-a940-8e21ed6e9351
local=/tmp/403e91d4-cd7e-433e-a940-8e21ed6e9351/local
```

### fs: info about filesystem usage

This is mostly debugging info, but you can check which files are opened by a module.
<!-- cSpell:disable -->
```
1> fs greeting
preopened file descriptors:
[3]

name map:

file descriptors map:
2 - Fd { rights: 136315089, rights_inheriting: 0, flags: 1, offset: 0, open_flags: 0, inode: Index { index: 2, generation: 0 } }
...

orphan file descriptors:

inodes:
0: (Index { index: 0, generation: 0 }, InodeVal { stat: __wasi_filestat_t { st_dev: 0, st_ino: 1024, st_filetype: "Character device (2)", st_nlink: 1, st_size: 0, st_atim: "Thu, 01 Jan 1970 03:00:00  (0)", st_mtim: "Thu, 01 Jan 1970 03:00:00  (0)", st_ctim: "Thu, 01 Jan 1970 03:00:00  (0)" }, is_preopened: true, name: "stdin", kind: File { handle: Some(Stdin), path: "", fd: Some(0) } })
...
```
<!-- cSpell:enable -->
