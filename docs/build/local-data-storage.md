# Local Data Storage

A peer hosting services may agree to provide access to their filesystem or allocate additional RAM. However, such persistence provisioning generally comes with no guarantees of availability. For example, a peer reboot will wipe a SQLite in-memory data base. Moreover, by the very nature of their local provisioning, such data sources are only available through the "sponsoring" service: there is no direct data access and when the service ceases to exist so does the data.While local data persistence has its use cases, developers need to be aware of their limitations.

### Local Filesystem

While Wasm modules in general are sandboxed to not have access to host resources, Marine Wasm modules may be granted access to a variety of host resources iff the host peer agrees to such access. The request for resource access and allocation come in form of deployment parameters, which we'll see very soon

Let's start by creating a new, minimal Fluence CLI project by the name of your choice:

```bash
fluence init write-to-file
```
```
vasd85@MacBook-Pro test % fluence init write-to-file
? Select template
  quickstart
❯ minimal
  ts
  js
```
```
? Select template minimal
? Select Fluence Environment to use by default with this project (Use arrow keys)
❯ kras (default)
  testnet
  stage
  local
  custom
```
```
? Select Fluence Environment to use by default with this project kras (default)

Successfully initialized Fluence CLI project template at /Users/vasd85/fluence/test/write-to-file
```

```bash
cd write-to-file
```

In the new project directory, we scaffold a new service:

```bash
fluence service new filesys_adapter
```
```
vasd85@MacBook-Pro write-to-file % fluence service new filesys_adapter
Successfully generated template for new service at /Users/vasd85/fluence/test/write-to-file/src/services/filesys_adapter
Added filesys_adapter to /Users/vasd85/fluence/test/write-to-file/fluence.yaml
? Do you want to add service filesys_adapter to a default deal dealName: (Y/n)
```
```
? Do you want to add service filesys_adapter to a default deal dealName: Yes
Added filesys_adapter to dealName
    Updating crates.io index
   Compiling proc-macro2 v1.0.76
    <...>
   Compiling filesys_adapter v0.1.0 (/Users/vasd85/fluence/test/write-to-file/src/services/filesys_adapter/modules/filesys_adapter)
    Finished release [optimized] target(s) in 29.95s
```

Which gives us the project scaffold:

```bash
tree src -L 6
```
```
src
├── aqua
│   └── main.aqua
└── services
    └── filesys_adapter
        ├── modules
        │   └── filesys_adapter
        │       ├── Cargo.toml
        │       ├── module.yaml
        │       └── src
        │           └── main.rs
        └── service.yaml

7 directories, 5 files
```

With the Rust template:

```rust
// src/services/filesys_adapter/modules/filesys_adapter/src/main.rs
#![allow(non_snake_case)]
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

module_manifest!();

pub fn main() {}

#[marine]
pub fn greeting(name: String) -> String {
    format!("Hi, {}", name)
}
```

Which we'll have to modify. In addition to the adapter, which handles the access to the local resource, we also want to add some minimal business logic to use our adapter.

```bash
fluence module new use_filesys
```
```
vasd85@MacBook-Pro write-to-file % fluence module new use_filesys
Successfully generated template for new module at /Users/vasd85/fluence/test/write-to-file/src/modules/use_filesys
```

```bash
tree src -L 6
```
```
src
├── aqua
│   └── main.aqua
├── modules
│   └── use_filesys
│       ├── Cargo.toml
│       ├── module.yaml
│       └── src
│           └── main.rs
└── services
    └── filesys_adapter
        ├── modules
        │   └── filesys_adapter
        │       ├── Cargo.toml
        │       ├── module.yaml
        │       └── src
        │           └── main.rs
        └── service.yaml

10 directories, 8 files
```

With our service and modules scaffolded, we can now proceed and code our (reusable) `use_filesys` module to handle the interaction with the host filesystem.```

```rust
// src/modules/use_filesys/src/main.rs
use marine_rs_sdk::marine;

use std::fs;
use std::path::PathBuf;

const SITES_DIR: &str = "/sites/";

pub fn main() {}

#[marine]
pub fn put(name: String, file_content: Vec<u8>) -> String {
    let rpc_tmp_filepath = format!("{}{}", SITES_DIR, name);

    let result = fs::write(PathBuf::from(rpc_tmp_filepath.clone()), file_content);
    if let Err(e) = result {
        return format!("file can't be written: {}", e);
    }

    String::from("Ok")
}

#[marine]
pub fn get(file_name: String) -> Vec<u8> {
    let tmp_filepath = format!("{}{}", SITES_DIR, file_name);
    fs::read(tmp_filepath).unwrap_or_else(|_| b"error while reading file".to_vec())
}

#[marine]
pub fn rm(name: String) -> String {
    let rpc_tmp_filepath = format!("{}{}", SITES_DIR, name);
    let result = fs::remove_file(rpc_tmp_filepath);
    match result {
        Ok(_) => "OK".to_string(),
        Err(e) => e.to_string(),
    }
}
```

The code is pretty straight forward but note `const SITES_DIR`:  This is the **alias** to the local path and needs to match up with the `volumes` mapping in `modules.yaml`, which we still need to add.

The scaffolded default `module.yaml` file looks like this:

```yaml
version: 0
type: rust
name: use_filesys
```

As mentioned earlier, we need to provide a reference to the location of the file directory on the host system. We do this by referencing the `.tmp`, which needs to be available on the host system. If the specified dir is not available on the host system, an error will occur at runtime.
By specifying the `sites` directory, we are enabling the mounting the named directory mapped to the SITES_DIR alias in our rust code.

```yaml
# src/modules/use_filesys/module.yaml
version: 0
type: rust
name: use_filesys
volumes:
  sites: ./tmp
```

For more information on import functions see the [Marine book](/docs/marine-book/marine-runtime/configuration-file) and the [configuration properties](https://github.com/fluencelabs/fluence-cli/tree/main/docs/configs/module.md) provided by Fluence CLI.

With our configuration in place, let's build our adapter:

```bash
fluence build
```
```
vasd85@MacBook-Pro write-to-file % fluence build
# Making sure all services are downloaded...
# Making sure all services are built...
    Finished release [optimized] target(s) in 0.73s
All services and spells built successfully
```

> :warning: For more effective ways to read/write files, see the [Rust documentation](https://doc.rust-lang.org/std/fs/struct.File.html) and [cookbook](https://rust-lang-nursery.github.io/rust-cookbook/file/read-write.html) and create your own custom file IO adapter!

Now that we have our [effector module](/docs/build/glossary#effector-module) in place, let's code our [facade module](/docs/build/glossary#facade-module), which in our case consists of simple read and write methods essentially wrapping the effector methods with a little convenience: instead of byte arrays we can use human-readable strings to write and read our file content.

Recall that Wasm IT modules are shared nothing and that we need to explicitly link dependencies. Before we code our facade, let's have a look at what we need to do to link our effector, aka adapter, module:

```rust
#[marine]
#[link(wasm_import_module = "use_filesys")] // 1
extern "C" {
    #[link_name = "get"]
    pub fn file_get(file_name: String) -> Vec<u8>; // 2

    #[link_name = "put"]
    pub fn file_put(name: String, file_content: Vec<u8>) -> String;
}
```

- (1): here we use [Rust's FFI](https://doc.rust-lang.org/nomicon/ffi.html) to specify the module name we want to [import](/docs/marine-book/marine-rust-sdk/developing/import-functions)
- (2): for each (public) method in our effector module, we create a link reference and assign a link name, i.e. *get* or *put*, which are now available to the facade module.

Let's put it all together:

```rust
// src/services/filesys_adapter/modules/filesys_adapter/src/main.rs
use marine_rs_sdk::marine;

pub fn main() {}

#[marine]
pub struct IOResult {
    pub stdout: String,
    pub stderr: String,
}

#[marine]
pub fn read_file(name: String) -> IOResult {
    let response: Vec<u8> = file_get(name);
    if response == b"error while reading file".to_vec() {
        return IOResult {
            stdout: "".to_string(),
            stderr: "error reading file".to_string(),
        };
    } else {
        IOResult {
            stdout: String::from_utf8_lossy(&response).to_string(),
            stderr: "".to_string(),
        }
    }
}

#[marine]
pub fn write_file(name: String, payload: String) -> IOResult {
    let content = payload.as_bytes().to_vec();
    let response = file_put(name, content);

    let result = response.as_str().contains("file can't be written:");
    if result {
        return IOResult {
            stdout: "".to_string(),
            stderr: response,
        };
    } else {
        IOResult {
            stdout: "OK".to_string(),
            stderr: "".to_string(),
        }
    }
}

#[marine]
pub fn rm_file(name: String) -> IOResult {
    let result = file_remove(name);
    if &result == "OK" {
        return IOResult {
            stdout: result,
            stderr: "".to_string(),
        };
    } else {
        IOResult {
            stdout: "".to_string(),
            stderr: result,
        }
    }
}

#[marine]
#[link(wasm_import_module = "use_filesys")]
extern "C" {
    #[link_name = "get"]
    pub fn file_get(file_name: String) -> Vec<u8>;

    #[link_name = "put"]
    pub fn file_put(name: String, file_content: Vec<u8>) -> String;

    #[link_name = "rm"]
    pub fn file_remove(name: String) -> String;
}
```

Now that our business logic is in place we can compile our code to the Wasm modules:

```bash
fluence build
```
```
vasd85@MacBook-Pro write-to-file % fluence build
# Making sure all services are downloaded...
# Making sure all services are built...
   Compiling filesys_adapter v0.1.0 (/Users/vasd85/fluence/test/write-to-file/src/services/filesys_adapter/modules/filesys_adapter)
    Finished release [optimized] target(s) in 1.47s
All services and spells built successfully
```

All looks good, and we now have two Wasm module we'd like to use as a service. See the respective `target/wasm32-wasi/release` directories for the *.wasm files.

We have one more step to complete the creation of a service from our Wasm modules: specify the linking configuration in the `services/filesys_adapter/service.yaml` file by naming the appropriate facade and linked module(s). Update your *services.yaml* to:

```yaml
version: 0
name: filesys_adapter
modules:
  facade:
    get: modules/filesys_adapter
  use_filesys:
    get: ../../modules/use_filesys
```

Now we can use our service, aptly called *local_storage*, even without deployment to the network in the [Marine REPL](/docs/marine-book/marine-tooling-reference/marine-repl):

```bash
fluence service repl
```
```
vasd85@MacBook-Pro write-to-file % fluence service repl
? Select service (Use arrow keys)
❯ filesys_adapter 
  Enter path to a service or url to .tar.gz archive 
```
```
? Select service filesys_adapter
# Making sure service and modules are downloaded and built...
   Compiling use_filesys v0.1.0 (/Users/vasd85/fluence/test/write-to-file/src/modules/use_filesys)
    Finished release [optimized] target(s) in 1.25s


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Execute help inside repl to see available commands.
Current service <module_name> is: filesys_adapter
Call filesys_adapter service functions in repl like this:

call filesys_adapter <function_name> [<arg1>, <arg2>]

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

}
Welcome to the Marine REPL (version 0.26.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 5eb8abcf-3cbf-4af5-aead-fbb2601d5002
elapsed time 71.630208ms

1> 
```

Note you can list the available/exposed interfaces with **i**:

```bash
1> i
Loaded modules interface:
exported data types (combined from all modules):
data IOResult:
  stdout: string
  stderr: string

exported functions:
filesys_adapter:
  func rm_file(name: string) -> IOResult
  func read_file(name: string) -> IOResult
  func write_file(name: string, payload: string) -> IOResult
use_filesys:
  func get(file_name: string) -> []u8
  func rm(name: string) -> string
  func put(name: string, file_content: []u8) -> string

2> 
```

Recall, our facade, i.e., entry, API is *filesys_adapter*. Let's interact with our service by writing a file, reading the file, removing the file and reading the files again:

```bash
2> call filesys_adapter write_file ["test-file.txt", "Hello, Fluence!"]
result: {
  "stderr": "",
  "stdout": "OK"
}
 elapsed time: 8.775125ms

3> call filesys_adapter read_file ["test-file.txt"]
result: {
  "stderr": "",
  "stdout": "Hello, Fluence!"
}
 elapsed time: 5.80975ms

4> call filesys_adapter rm_file ["test-file.txt"]
result: {
  "stderr": "",
  "stdout": "OK"
}
 elapsed time: 3.504709ms

5> call filesys_adapter read_file ["test-file.txt"]
result: {
  "stderr": "error reading file",
  "stdout": ""
}
 elapsed time: 642.292µs

```

**todo**: worker deploy

- * delete old deploy: **

```bash
fluence deploy
Making sure all services are downloaded... done
    Blocking waiting for file lock on package cache
    <...>
Making sure all modules are downloaded and built... done

Going to deploy services described in ~/localdev/documentation-examples/write-to-file/fluence.yaml:

filesys_adapter:
  get: services
  deploy:
    - deployId: default
use_filesys:
  get: services
  deploy:
    - deployId: default

? Do you want to deploy all of these services? Yes
Going to upload module: filesys_adapter
Going to upload module: use_filesys
Module 'filesys_adapter' was uploaded
Module 'use_filesys' was uploaded
Now time to make the blueprint...
{
  "blueprint_id": "5c6f2b9adb96ca87672fc9917f11b8c7249fce7b73c8769af73f83702ae0c68d",
  "service_id": "b1adf912-abbe-45e8-9b2f-ac26158ba7db"
}
Deploying:
  service: filesys_adapter
  deployId: default
  on: 12D3KooWD7CvsYcpF9HE9CCV9aY3SJ317tkXVykjtZnht2EbzDPm... done
Going to upload module: filesys_adapter
Going to upload module: use_filesys
Module 'filesys_adapter' was uploaded
Module 'use_filesys' was uploaded
Now time to make the blueprint...
{
  "blueprint_id": "5c6f2b9adb96ca87672fc9917f11b8c7249fce7b73c8769af73f83702ae0c68d",
  "service_id": "2a6b3077-67ad-43d8-a181-0d24e8683d08"
}
Deploying:
  service: use_filesys
  deployId: default
  on: 12D3KooWKnEqMfYo9zvfHmqTLpLdiHXPe4SVqUWcWHDJdFGrSmcA... done

Currently deployed services listed in ~/localdev/documentation-examples/write-to-file/.fluence/app.yaml:

filesys_adapter:
  default:
    - blueprintId: 5c6f2b9adb96ca87672fc9917f11b8c7249fce7b73c8769af73f83702ae0c68d
      serviceId: b1adf912-abbe-45e8-9b2f-ac26158ba7db
      peerId: 12D3KooWD7CvsYcpF9HE9CCV9aY3SJ317tkXVykjtZnht2EbzDPm
      keyPairName: auto-generated
use_filesys:
  default:
    - blueprintId: 5c6f2b9adb96ca87672fc9917f11b8c7249fce7b73c8769af73f83702ae0c68d
      serviceId: 2a6b3077-67ad-43d8-a181-0d24e8683d08
      peerId: 12D3KooWKnEqMfYo9zvfHmqTLpLdiHXPe4SVqUWcWHDJdFGrSmcA
      keyPairName: auto-generated

```

Now that we have our services deployed, we can turn our focus on writing the necessary Aqua code. First, we clear out the template code in the `src/aqua/main.aqua` file and start from scratch:

```python
-- src/aqua.main
aqua Main

import App from "deployed.app.aqua"
-- we get these params from .fluence/aqua/services/use_filesys.aqua
import IOResult, UseFilesys from "services/use_filesys.aqua"
export App, write_to_file, read_from_file, remove_file

func write_to_file(filename: string, content: string) -> IOResult:
    services <- App.services()
    on services.use_filesys.default!.peerId:
        UseFilesys services.use_filesys.default!.serviceId
        res <- UseFilesys.write_file(filename, content)
    <- res

func read_from_file(filename:string) -> IOResult:
    services <- App.services()
    on services.use_filesys.default!.peerId:
        UseFilesys services.use_filesys.default!.serviceId
        res <- UseFilesys.read_file(filename)
    <- res

func remove_file(filename: string) -> IOResult:
    services <- App.services()
    on services.use_filesys.default!.peerId:
        UseFilesys services.use_filesys.default!.serviceId
        res <- UseFilesys.rm_file(filename)
    <- res

```

We simply wrapped the exposed facade interfaces with Aqua code and just pass through the returned IOResult data. Let's run our Aqua against the deployed service with familiar parameters:

```bash
# write to file
fluence run
? Enter a function call that you want to execute write_to_file("test_file.txt", "Hello, Fluence!")
{
  "stderr": "",
  "stdout": "OK"
}
Running:
  function: write_to_file("test_file.txt", "Hello, Fluence!")
  relay: /dns4/kras-01.fluence.dev/tcp/19001/wss/p2p/12D3KooWKnEqMfYo9zvfHmqTLpLdiHXPe4SVqUWcWHDJdFGrSmcA... done

Result:

"{\\n  \\"stderr\\": \\"\\",\\n  \\"stdout\\": \\"OK\\"\\n}\\n"

# read from file
fluence run
? Enter a function call that you want to execute read_from_file("test_file.txt")
{
  "stderr": "",
  "stdout": "Hello, Fluence!"
}
Running:
  function: read_from_file("test_file.txt")
  relay: /dns4/kras-02.fluence.dev/tcp/19001/wss/p2p/12D3KooWHLxVhUQyAuZe6AHMB29P7wkvTNMn7eDMcsqimJYLKREf... done

Result:

"{\\n  \\"stderr\\": \\"\\",\\n  \\"stdout\\": \\"Hello, Fluence!\\"\\n}\\n"

# remove the file
fluence run
? Enter a function call that you want to execute remove_file("test_file.txt")
{
  "stderr": "",
  "stdout": "OK"
}
Running:
  function: remove_file("test_file.txt")
  relay: /dns4/kras-00.fluence.dev/tcp/19990/wss/p2p/12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e... done

Result:

"{\\n  \\"stderr\\": \\"\\",\\n  \\"stdout\\": \\"OK\\"\\n}\\n"

# try to read from delete file
fluence run
? Enter a function call that you want to execute read_from_file("test_file.txt")
{
  "stderr": "error reading file",
  "stdout": ""
}
Running:
  function: read_from_file("test_file.txt")
  relay: /dns4/kras-06.fluence.dev/tcp/19001/wss/p2p/12D3KooWDUszU2NeWyUVjCXhGEt1MoZrhvdmaQQwtZUriuGN1jTr... done

Result:

"{\\n  \\"stderr\\": \\"error reading file\\",\\n  \\"stdout\\": \\"\\"\\n}\\n"

```

All looks in order, well done! You now have the basic effector module for to write to hosts' filesystem, if permissioned, and a facade template to use.

### SQLite

coming soon.