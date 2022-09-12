# Configuration file

Service configuration files use TOML format. The most basic config for the `greeting` service might look like this:

```toml
modules_dir = "artifacts/"

[[module]]
    name = "greeting"
```

This config contains the following information:

* **modules\_dir**  - default directory for searching modules
* **\[\[module]]** - a list of modules that the service consists of
* **name** - the name of the Wasm file in the modules\_dir directory

Tools will interpret all relative paths in the config as relative to the config file location. Absolute paths will be used unchanged.

### Config structure

A more complex example of a service configuration file is shown below:

```toml
modules_dir = "artifacts/"

[[module]]
    name = "effector"
    mem_pages_count = 1
    max_heap_size = "1 KiB"
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

#### **max\_heap\_size**

the maximum size of the Wasm heap that a module could allocate. This setting should be specified as a string, that has the following format:

`<number><whitespace?><specificator?>`

where `?` represents an optional field and `specificator` is one from the following list:

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

Note, that practically the current limit of Wasm memory is limited to 4 GiB, so you shouldn't use specifiers bigger than gibibyte. Additionally, all specificators are case-insensitive.

Let's consider a few examples:

max\_heap\_size = "100" - 100 bytes

max\_heap\_size = "100K" - 100 kilobytes

max\_heap\_size = "100 Ki" - 100 kibibytes

#### **mem\_pages\_count (obsolete)**

the maximum number of Wasm memory pages that the corresponding loaded module can use. Each Wasm page is 65536 (64 Kb) bytes long. This is an obsolete setting and will be removed in the future, use `max_heap_size` instead.

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

Module environment variables could be examined with mrepl, see the guide here.

### Module types

The service configuration defines the type of each module: the last one in the list becomes a **facade** module, the modules without `[module.wasi]` and `[module.mounted_binaries]` are **pure** modules, and the rest are **effectors**.

More info about module types could be found [here](configuration-file.md#module-types).
