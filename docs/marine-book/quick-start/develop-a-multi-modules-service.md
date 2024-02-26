---
description: How to develop the url-downloader service
---

# Develop a multi-modules service

Each service in the Fluence network consists of at least one module, and there is a special configuration file that manages the service creation process. In particular, it controls the order in which the modules are instantiated, the permissions that each module will have, the maximum memory limit, and some other parameters. This section explains how to develop a simple multi-module service based on the [url-downloader](https://github.com/fluencelabs/fce/tree/master/examples/url-downloader) example.

## Creating a url-downloader service

To demonstrate the capabilities of Wasm multi-modules in Marine, let us build a service that is able to download a site by its url and store it locally with a specified name. For demonstration purposes, this service will contain three modules: `curl` for downloading files, `local_storage` for saving files to the file system, and `facade` as a facade module that combines two previous ones. And let us give the whole service the name `url-downloader`.

### Preparation

First, create an empty directory with the `url-downloader` name (further, we will call it the service root directory) for our service and initialize three new modules:

```sh
# create a root directory for service and go to it
mkdir url-downloader & cd url-downloader

# create three new Rust projects for modules
cargo new curl-adapter --bin
cargo new local-storage --bin
cargo new facade --bin
```

Then add `marine-rs-sdk = "0.10.2"` to the `dependencies` section of each `Cargo.toml` file.

### Curl module

The main purpose of this module is to simply provide a wrapper for the `curl` CLI tool. This is done by importing the `curl` function from the host (in the same way as described in [mounted binaries](../marine-runtime/mounted-binaries.md) section and exporting the function called `get`.

Open the `curl-adapter/src/main.rs` file in an editor and paste the code of the `curl` module there:

```rust
use marine_rs_sdk::marine;

pub fn main() {}

#[marine]
pub fn download(url: String) -> String {
    curl(url)
}

#[marine]
#[link(wasm_import_module = "host")]
extern "C" {
    fn curl(url: String) -> String;
}
```

Note that errors are not handled in these examples for simplicity.

### Local-storage module

This module is intended for loading and storing files in the file system. It provides two exported functions: `get`, which returns the content of a file by its name in the `sites` directory, and `put`, which saves a file in the same directory and gives it the specified name.

Open the `local-storage/src/main.rs` file in an editor and paste the code of the `local-storage` module there:

```rust
use marine_rs_sdk::marine;
use std::path::PathBuf;

const SITES_DIR: &str = "/sites/";

pub fn main() {}

#[marine]
pub fn put(name: String, file_content: Vec<u8>) {
    let rpc_tmp_filepath = format!("{}{}", SITES_DIR, name);
    let _ = std::fs::write(PathBuf::from(rpc_tmp_filepath.clone()), file_content);
}

#[marine]
pub fn get(file_name: String) -> Vec<u8> {
    let tmp_filepath = format!("{}{}", SITES_DIR, file_name);
    fs::read(tmp_filepath).unwrap()
}
```

### Facade module

The `facade` module combines the logic of the previous modules in one exported function: `get_n_save`. This function downloads the site with the specified name using the `get` function from the `curl_adapter` module and then saves it into a file on the file system using the `put` function from the `local-storage` module. To import functions from another module, their signatures must be declared in an extern block wrapped with the `#[marine]` procedure macro.

Open the `facade/src/main.rs` file in an editor and paste the code of the `facade` module there:

```rust
use marine_rs_sdk::marine;

pub fn main() {}

#[marine]
fn get_n_save(url: String, file_name: String) -> String {
    let downloaded = download(url);
    file_put(file_name, downloaded.into_bytes());

    String::from("Ok")
}

#[marine]
#[link(wasm_import_module = "curl_adapter")]
extern "C" {
    pub fn download(url: String) -> String;
}

#[marine]
#[link(wasm_import_module = "local_storage")]
extern "C" {
    // this link_name attribute allows using "file_get" name 
    // for function imported by "get" name
    #[link_name = "get"]
    pub fn file_get(file_name: String) -> Vec<u8>;

    #[link_name = "put"]
    pub fn file_put(name: String, file_content: Vec<u8>);
}
```

### Building all modules

Now the modules are ready to be built, so let us do it:

```sh
# cd to the root service directory where all services located

# compile the curl_adapter module
cd curl_adapter & marine build & cd ..

# compile the local-storage module
cd local-storage & marine build & cd ..

# compile the facade module
cd facade & marine build & cd ..
```

### Url-downloader service config

To run a module with the Marine [REPL](../marine-tooling-reference/marine-repl.md), we should create a config file where some necessary module loading details will be described. For more details about the structure of this file please refer to [this](../marine-runtime/configuration-file.md) section.

The configuration of the `url-downloader` service should look as follows:

```toml
modules_dir = "artifacts/"
total_memory_limit = "Infinity"

[[module]]
    name = "local_storage"
    logger_enabled = true

    [module.wasi]
    preopened_files = ["./sites"]
    # this is an alias to a full path for the sites dir
    mapped_dirs = { "sites" = "./sites" }

[[module]]
    name = "curl_adapter"
    logger_enabled = true

    [module.mounted_binaries]
    curl = "/usr/bin/curl"

[[module]]
    name = "facade"
    logger_enabled = true
```

The important things here are:

* `local_storage` is allowed to use  `sites` directory; it'll be used for storing downloaded files
* `curl_adapter` is allowed to use the `curl` binary in the OS
* `facade` module is actually the facade module for the service because it's the last module in the list

Save this config as the `Config.toml` file in the service root directory.

## Run url-downloader with REPL

Let's start with creating a directory called `artifacts` in the root of the `url-downloader` service and copying the three resulting `.wasm` file into it:

```sh
# create an artifacts folder
mkdir artifacts

# copy compiled services into it
cp target/wasm32-wasi/debug/local_storage.wasm artifacts/
cp target/wasm32-wasi/debug/curl.wasm artifacts/
cp target/wasm32-wasi/debug/facade.wasm artifacts/
```

Alternatively, you can find the ready-to-run `url-downloader` service [here](https://github.com/fluencelabs/fce/tree/master/examples/url-downloader).

Before running it, create a directory named `sites`, which is required by the `local-storage` module to store the downloaded data.

Then run the REPL with the `Config.toml` file and examine the `url-downloader` service interface:

```sh
# create sites directory
mkdir sites

# start REPL with Config.toml
mrepl Config.toml
```
```sh
Welcome to the Marine REPL (version 0.16.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 732f4136-7542-4101-851e-511cc83e6ac0
elapsed time 1.444318ms

1> interface
Application service interface:

local_storage:
  fn put(name: String, file_content: Array<U8>) -> String
  fn get(file_name: String) -> Array<U8>

curl:
  fn get(cmd: String) -> String

facade:
  fn get_n_save(url: String, file_name: String) -> String
```

There are three interface modules here. Note that the service interface is only represented by the `facade` module. However, the REPL allows all loaded modules to be called for debugging purposes.

Let us download the `google.com` page:
<!-- cSpell:disable -->
```sh
2> call facade get_n_save ["google.com", "google"]
INFO: Running "/usr/bin/curl google.com" ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   219  100   219    0     0   2105      0 --:--:-- --:--:-- --:--:--  2105
result: String("Ok")
 elapsed time: 111.1222ms
```
<!-- cSpell:enable -->

The downloaded page can be found at `sites/google`. As already mentioned, each module within a service can be called directly, for example, `local_storage` can be treated as a separate module:

```sh
3> call local_storage put ["array", [1,2,3]]
result: String("Ok")
 elapsed time: 322.108µs

4> call local_storage get "array"
result: Array([Number(1), Number(2), Number(3)])
 elapsed time: 194.216µs
```
