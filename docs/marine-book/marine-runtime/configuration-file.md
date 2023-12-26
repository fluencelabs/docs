# Configuration file

Service configuration files use TOML format. The most basic config for the `greeting` service might look like this:

```toml
modules_dir = "artifacts/"
total_memory_limit = "10 MiB"

[[module]]
    name = "greeting"
```

This config contains the following information:

* **modules\_dir**  - default directory for searching modules
* **\[\[module]]** - a list of modules that the service consists of
* **total\_memory\_limit** - total maximum memory the entire service can allocate for modules in a service
* **name** - the name of the Wasm file in the modules\_dir directory

Tools will interpret all relative paths in the config as relative to the config file location. Absolute paths will be used unchanged.

### Config structure

A more complex example of a service configuration file is shown below:

```toml
modules_dir = "artifacts/"
total_memory_limit = "10 MiB"

[[module]]
    name = "effector"
    logger_enabled = true
    logging_mask = 0
    file_name = "effector-patched.wasm"
    load_from = "downloaded-artifacts/"

    [module.wasi]
    preopened_files = ["./dir"]
    mapped_dirs = { "alias" = "./dir" }
    envs = { "ENV1" = "arg1", "ENV2" = "arg2" }
    
    [module.mounted_binaries]
    curl = "/usr/bin/curl"
    
[[module]]
    name = "pure"
    logger_enabled = true

[[module]]
    name = "facade"
    logger_enabled = true
```

There are several additional fields here:

#### **total\_memory\_limit**

the maximum size of the Wasm heap that a service could allocate. This limit is a shared pool for all modules in the service. This setting should be specified as a string, that has the following format:

`<number><whitespace?><specificator?>|Infinity|infinity`

where `?` represents an optional field, `|` divides options and `specificator` is one from the following list:

* `K`, `Kb` - kilobyte
* `Ki`, `KiB` - kibibyte
* `M`, `Mb` - megabyte
* `Mi`, `MiB` - mebibyte
* `G`, `Gb` - gigabyte
* `Gi`, `GiB` - gibibyte
* `T`, `Tb` - terabyte
* `Ti`, `TiB`  - tebibyte
* `P`, `Pb` - petabyte
* `Pi`, `PiB` - pebibyte

Note, that practically the current limit of Wasm memory is limited to 4 GiB per module, so a service cannot consume more than `modules_number * 4 GiB`. Additionally, all specificators are case-insensitive.

Wasm modules specify their initial memory size. If a limit is lower than the sum of initial memory sizes, the service will fail to load into runtime. Setting less than `2 MiB` per module will likely cause this kind of error.

Allocating memory exceeding the limit triggers a (Rust) panic at runtime time. 
In this case the function call will be interrupted immediately, and the caller, i.e., the library using the marine-runtime, will be given an error detailing the out-of-memory (OOM) exception.

Let's consider a few examples:

total\_memory\_limit = "100" - 100 bytes

total\_memory\_limit = "100K" - 100 kilobytes

total\_memory\_limit = "100 Ki" - 100 kibibytes

#### **logger\_enabled**

true, if it allows the corresponding Wasm module to use the Marine SDK logger.

#### **logging\_mask**

manages the logging targets, described in detail [here](../marine-rust-sdk/developing/logging.md#using-target-map).

#### file\_name

overrides the file name for loading, which by default is `$name.wasm`

#### load\_from

overrides `modules_dir` for this module. Path can contain file name, in this case it will be incompatible with `file_name` field.

**module.wasi**

a list of files available for reading/writing by the corresponding _effector_ module.

#### **module.mounted\_binaries**

a list of mounted binary executable files (more details in the previous [section](mounted-binaries.md)).

#### **preopened\_files**

describes a list of files and directories that this module could access with WASI. In the example above the `effector` module will have access only to a directory called `dir.`

#### **mapped\_dirs**

a map of accessible files and their aliases. Aliases should be normally used in Marine module development because it's hard to know the full path to a file.

#### **envs**

describes the environment variables accessible by a particular module with standard Rust [env](https://doc.rust-lang.org/std/env/index.html) API like this `std::env::var(IPFS_ADDR_ENV_NAME)`. Please note that Marine adds three additional environment variables.

Module environment variables could be examined with mrepl, see the guide [here](https://fluence.dev/docs/marine-book/marine-tooling-reference/marine-repl#envs-show-environment-variables-of-a-module).

### Module types

The service configuration defines the type of each module: the last one in the list becomes a **facade** module, the modules without `[module.wasi]` and `[module.mounted_binaries]` are **pure** modules, and the rest are **effectors**.

More info about module types could be found [here](configuration-file.md#module-types).
