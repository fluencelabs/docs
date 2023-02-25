
## Local Data Storage

A peer hosting services may agree to provide access to their filesystem or allocate additional RAM to store data in memory. However, such persistence provisioning generally comes with no guarantees of availability. For example, a peer reboot will wipe a SQLite database stored in memory. Moreover, by the very nature of their local provisioning, such data sources are only available through the "sponsoring" service: there is no direct data access and when the service ceases to exist so does the data.While local data persistence has its use cases, developers need to be aware of their limitations.

### Local Filesystem

While Wasm modules in general are sandboxed so that the modules do not have access to host resources, Marine Wasm modules may be granted access to a variety of host resources iff the host peer agrees to such access. The request for resource access and allocation come in form of deployment parameters, which we'll see very soon

The [accompanying repo](notion://www.notion.so/fluencenetwork/Fluence-Developer-Documentation-bdf8d06ad52e493fb765456dbd5480cd).

Let's start by creating a new, minimal Fluence CLI project by the name of your choice:

```
fluence init write-to-file
? Select template minimal

Successfully initialized Fluence project template at ~/localdev/write-to-file

cd write-to-file

```

In the new project directory, we scaffold a new service:

```
fluence service new
? Enter service path services
? Do you want to use services as the name of your new service? No
? Enter service name (must start with a lowercase letter and contain only letters, numbers, and underscores)
filesys_adapter
Successfully generated template for new service at services
...
Added filesys_adapter to fluence.yaml
? Do you want to add service filesys_adapter to a default worker defaultWorker Yes
Added filesys_adapter to defaultWorker
```

Which gives us project scaffold:

```
tree services -L 4 -I target
services
|-- modules
|   `-- filesys_adapter
|       |-- Cargo.lock
|       |-- Cargo.toml
|       |-- module.yaml
|       `-- src
|           `-- main.rs
`-- service.yaml
```

And the Rust template:

```rust
// services/modules/filesys_adapter/src/main.rs
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

Which we'll have to modify. In addition to the adapter, which handles the access to the local resource, we also want a to add some minimal business logic to use our adapter.

```bash
fluence module new
? Enter module path services/modules/use_filesys
Successfully generated template for new module at services/modules/use_filesys
```

```Shell
fluence service new
? Enter service path services
? Do you want to use services as the name of your new service? No
? Enter service name (must start with a lowercase letter and contain only letters, numbers, and underscores)
use_filesys
Successfully generated template for new service at services
...
Added use_filesys to fluence.yaml
? Do you want to add service use_filesys to a default worker defaultWorker Yes
Added use_filesys to defaultWorker
```

Here is the project scaffold again after adding the second service:

```
tree services -L 4 -I target
services
|-- modules
|   |-- filesys_adapter
|   |   |-- Cargo.lock
|   |   |-- Cargo.toml
|   |   |-- module.yaml
|   |   `-- src
|   |       `-- main.rs
|   `-- use_filesys
|       |-- Cargo.toml
|       |-- module.yaml
|       `-- src
|           `-- main.rs
`-- service.yaml
```

With the scaffolding out of the way, let's code our modules. First, we create our general-purpose, reusable "adapter" module to handle the put/get operations to/from the local, i.e., host peer, filesystem and add a file removal method, `rm`, as well. Here is the "adapter" code from the services/modules/filesys_adapter/src/main.rs file:

```rust
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

The code is pretty straight forward read/write but a few lines are noteworthy: The `const SITES_DIR` is the *alias* to the local path and needs to match up with the mapping in `module.yaml`.

The scaffolded default file looks like this:

```yaml
version: 0
type: rust
name: filesys_adapter

```

This is not enough. We need to specify that we want this module to be able to access the hosts filesystem via some specified directory and we do this my mounting a named directory mapped to the SITES_DIR alias:

```
//services/modules/filesys_adapter/module.yaml
version: 0
type: rust
name: filesys_adapter
volumes:
  sites: ./tmp

```

where the *volumes* section contains the mapping of the actual directory to the alias we set as in the  . For more information on configuring Marine modules, see the [Marine book](https://fluence.dev/docs/marine-book/marine-runtime/configuration-file).

For more effective ways to read/write files, see the [Rust documentation](https://doc.rust-lang.org/std/fs/struct.File.html) and [cookbook](https://rust-lang-nursery.github.io/rust-cookbook/file/read-write.html) and create your own custom file IO adapter!

For more information on import functions see the [Marine book](https://fluence.dev/docs/marine-book/marine-runtime/configuration-file) and the [configuration properties](https://github.com/fluencelabs/fluence-cli/tree/main/docs/configs/module.md) provided by Fluence CLI.

With our configuration in place, let's build our adapter:

```bash
# in the project root directory
Fluence build
Making sure all services are downloaded... done
   Compiling filesys_adapter v0.1.0 (/Users/bebo/localdev/write-to-file/services/modules/filesys_adapter)
    Finished release [optimized] target(s) in 0.40s
Making sure all modules are downloaded and built... done

```

Now that we have our [effector module](https://fluence.dev/docs/marine-book/basic-concepts/) in place, let's code our [facade module](https://fluence.dev/docs/build/fluence-js/concepts#facade-api), which in our case consists of simple read and write methods essentially wrapping the effector methods with a little convenience: instead of byte arrays we can use human readable strings to write and read our file content.

Recall that Wasm IT modules are shared nothing and that we need to explicitly link dependencies. Before we code our facade, let's have a look at what we need to do to link our effector, aka adapter, module:

```rust
#[marine]
#[link(wasm_import_module = "filesys_adapter")] // 1
extern "C" {
    #[link_name = "get"]
    pub fn file_get(file_name: String) -> Vec<u8>; // 2

    #[link_name = "put"]
    pub fn file_put(name: String, file_content: Vec<u8>) -> String;
}

```

- (1): here we use [Rust's FFI](https://doc.rust-lang.org/nomicon/ffi.html) to specify the module name we want to [import](https://fluence.dev/docs/marine-book/marine-rust-sdk/developing/import-functions)
- (2): for each (public) method in our effector module, we create a link reference and assign a link name, i.e. *get* or *put*, which are now available to the facade module.

Let's put it all together:

```rust
// services/modules/use_filesys/src/main.rs
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
#[link(wasm_import_module = "filesys_adapter")] // 1
extern "C" {
    #[link_name = "get"]
    pub fn file_get(file_name: String) -> Vec<u8>; // 2

    #[link_name = "put"]
    pub fn file_put(name: String, file_content: Vec<u8>) -> String;

    #[link_name = "rm"]
    pub fn file_remove(name: String) -> String;
}

```

Now that our business logic is in place we can compile our code into Wasm modules:

```
fluence build
Making sure all services are downloaded... done
    Blocking waiting for file lock on package cache
    <...>
    Finished release [optimized] target(s) in 0.20s
    Finished release [optimized] target(s) in 0.20s
Making sure all modules are downloaded and built... done

```

All looks good and we now have two Wasm module we'd like to use as a service. See the respective `target\\wasm32-wasi\\release` directories for the corresponding *.wasm files.

We are one step away from creating a service that uses our Wasm modules. We need to specify the linking configuration in the `services/services.yaml` file by naming the appropriate facade and linked module(s). Update your *services.yaml* to:

```yaml
version: 0
name: local_storage
modules:
  facade:
    get: modules/use_filesys
  filesys_adapter:
    get: modules/filesys_adapter

```

Now we can use our service, aptly called *local_storage*, even without deployment to the network in the [Marine REPL](notion://www.notion.so/fluencenetwork/Fluence-Developer-Documentation-bdf8d06ad52e493fb765456dbd5480cd):

```bash
fluence service repl
? Enter service name from fluence.yaml, path to a service or url to .tar.gz archive services
    Blocking waiting for file lock on package cache
    Blocking waiting for file lock on package cache
    Blocking waiting for file lock on package cache
    Blocking waiting for file lock on package cache
    Blocking waiting for file lock on package cache
    Blocking waiting for file lock on package cache
    Finished release [optimized] target(s) in 0.19s
    Finished release [optimized] target(s) in 0.18s
Making sure service and modules are downloaded and built... done

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Execute help inside repl to see available commands.
Current service <module_name> is: use_filesys
Call use_filesys service functions in repl like this:

call use_filesys <function_name> [<arg1>, <arg2>]

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Welcome to the Marine REPL (version 0.18.8)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0
app service was created with service id = 940e0492-86c0-493d-887d-d306dfde024d
elapsed time 86.652549ms

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
  fn put(name: string, file_content: []u8) -> string
  fn rm(name: string) -> string
  fn get(file_name: string) -> []u8
use_filesys:
  fn rm_file(name: string) -> IOResult
  fn read_file(name: string) -> IOResult
  fn write_file(name: string, payload: string) -> IOResult

```

Recall, our facade, i.e., entry, API is *use_filesys*. Let's interact with our service by writing a file, reading the file, removing the file and reading the files again:

```bash
2> call use_filesys write_file  ["test-file.txt", "Hello, Fluence!"]
result: Object {"stderr": String(""), "stdout": String("OK")}
 elapsed time: 639.177µs

3> call use_filesys read_file ["test-file.txt"]
result: Object {"stderr": String(""), "stdout": String("Hello, Fluence!")}
 elapsed time: 309.581µs

4> call use_filesys rm_file ["test-file.txt"]
result: Object {"stderr": String(""), "stdout": String("OK")}
 elapsed time: 383.201µs

5> call use_filesys read_file ["test-file.txt"]
result: Object {"stderr": String("error reading file"), "stdout": String("")}
 elapsed time: 180.241µs

6>

```

**todo**: worker deploy

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

Let us make an example of a simple SQL REPL service that leverages:
- pre-built SQLite library Wasm module. You can find  the module code  and build instructions [here](https://github.com/fluencelabs/sqlite)
- marine-sqlite-connector Rust crate that is a fork for sqlite-connector modified to use SQLite Wasm module mentioned previously

```
fluence init sql-repl
? Select template minimal

Successfully initialized Fluence project template at ~/localdev/sql-repl

cd sql-repl

```

In the new project directory, we scaffold a new service:

```
fluence service new
? Enter service path services
? Do you want to use services as the name of your new service? No
? Enter service name (must start with a lowercase letter and contain only letters, numbers, and underscores)
sql_repl
Successfully generated template for new service at services
...
Added sql_repl to fluence.yaml
? Do you want to add service sql_repl to a default worker defaultWorker Yes
Added sql_repl to defaultWorker
```

Which gives us project scaffold:

```
tree services -L 4 -I target
services
|-- modules
|   `-- sql_repl
|       |-- Cargo.toml
|       |-- module.yaml
|       `-- src
|           `-- main.rs
`-- service.yaml
```

And the Rust template:

```rust
// services/modules/sql_repl/src/main.rs
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

We will change this main.rs later adding REPL functionality.  Now we add a pre-built SQLite module. Plz note that tar archive both contains Wasm module itself and module.yaml file that describes the module and its properties. You can find a yaml schema with available options for module.yaml in ./.fluence/schemas in this project's directory.
```bash
$fluence module add
? Enter path to a module or url to .tar.gz archive https://github.com/fluencelabs/sqlite/releases/download/v0.18.0_w/sqlite3.wasm.tar.gz
? Enter service name from fluence.yaml or path to the service directory services
Added sqlite3 to /git/some/sql-repl/services
```

With the scaffolding out of the way, let's code the module. Let us add marine-sqlite-connector dependency into sql_repl module's Cargo.toml.

```rust
// services/modules/sql_repl/Cargo.toml
[package]
name = "sql_repl"
version = "0.1.0"
edition = "2018"

[[bin]]
name = "sql_repl"
path = "src/main.rs"

[dependencies]
marine-rs-sdk = "0.7.1"
marine-sqlite-connector = "0.5.1"

[dev-dependencies]
marine-rs-sdk-test = "0.8.1"

```

Next let code the module itself.


```rust
// services/modules/sql_repl/src/main.rs

use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use std::io::{self, Write};

use marine_sqlite_connector;
use marine_sqlite_connector::Value;

module_manifest!();

pub fn main() {}

#[marine]
pub fn sql_repl() {
    let connection = marine_sqlite_connector::open(":memory:").unwrap();
    let delimiter = ';';
    println!("For exit type QUIT;");
    loop {
        print!("SQL> ");
        io::stdout().flush().unwrap();

        let mut input_lines = io::stdin().lines();
        let mut sql_string: String = String::new();
        while let Some(line) = input_lines.next() {
            let l = line.unwrap();
            let l_no_spaces = l.trim();
            if let Some(pos) = l_no_spaces.find(delimiter) {
                sql_string.push_str(&l_no_spaces[..pos]);
                break;
            }
            sql_string.push_str(l_no_spaces);
            sql_string.push(' ');
        }

        println!("{}", sql_string);
        if let Some(first_word) = sql_string.split_whitespace().next() {
            match first_word.to_uppercase().as_str() {
                "SELECT" => {
                    let mut cursor = connection.prepare(sql_string).unwrap().cursor();
                    while let Some(row) = cursor.next().unwrap() {
                        for column in row.iter() {
                            match column {
                                Value::Binary(_) => print!(
                                    "{:} ",
                                    String::from_utf8_lossy(column.as_binary().unwrap())
                                ),
                                Value::Float(_) => print!("{} ", column.as_float().unwrap()),
                                Value::Integer(_) => print!("{} ", column.as_integer().unwrap()),
                                Value::String(_) => print!("{} ", column.as_string().unwrap()),
                                Value::Null => print!("NULL "),
                            }
                        }
                    }
                    println!();
                }
                "QUIT" => break,
                _ => connection.execute(sql_string).unwrap(),
            };
        }

        println!();
    }
}

```

Having everything in place let us build our SQL REPL Wasm module:

```bash
# in the project root directory
Fluence build
Making sure all services are downloaded... done
   Compiling getrandom v0.2.8
   Compiling marine-rs-sdk-main v0.6.15
   Compiling marine-timestamp-macro v0.6.15
   Compiling uuid v0.8.2
   Compiling marine-macro-impl v0.6.15
   Compiling marine-macro v0.6.15
   Compiling polyplets v0.2.0
   Compiling marine-rs-sdk v0.6.15
   Compiling marine-sqlite-connector v0.5.2
   Compiling sql_repl v0.1.0 (/git/some/sql-repl/services/modules/sql_repl)
    Finished release [optimized] target(s) in 2.67s

```

All looks good and we now have two Wasm module we'd like to use as a service. One is built by us and second is taken from a list of released SQLite Wasm module.

Now we can use our sql_repl service, even without deployment to the network in the [Marine REPL](https://fluence.dev/docs/marine-book/marine-tooling-reference/marine-repl.md):

```bash
fluence service repl
? Enter service name from fluence.yaml, path to a service or url to .tar.gz archive services
Making sure service and modules are downloaded and built... ⣾
Making sure service and modules are downloaded and built... done

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Execute help inside repl to see available commands.
Current service <module_name> is: sql_repl
Call sql_repl service functions in repl like this:

call sql_repl <function_name> [<arg1>, <arg2>]

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Welcome to the Marine REPL (version 0.19.1)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 92b60dee-a786-42cf-bff7-c4166a283027
elapsed time 1.161987582s

1>

```

Let us take a look at the list of exported functions:

```Shell
1> interface
Loaded modules interface:
exported data types (combined from all modules):
data DBPrepareDescriptor:
  ret_code: i32
  stmt_handle: u32
  tail: u32
data DBExecDescriptor:
  ret_code: i32
  err_msg: string
data DBOpenDescriptor:
  ret_code: i32
  db_handle: u32

exported functions:
sql_repl:
  func sql_repl()
sqlite3:
  func sqlite3_close(db_handle: u32) -> i32
  func sqlite3_bind_blob(stmt_handle: u32, pos: i32, blob: []u8, xDel: i32) -> i32
  func sqlite3_bind_null(stmt_handle: u32, pos: i32) -> i32
  func sqlite3_column_name(stmt_handle: u32, N: u32) -> string
  func sqlite3_changes(db_handle: u32) -> i32
  func sqlite3_hard_heap_limit64(size: i64) -> i64
  func sqlite3_bind_double(stmt_handle: u32, pos: i32, value: f64) -> i32
  func sqlite3_column_int64(stmt_handle: u32, icol: u32) -> i64
  func sqlite3_busy_timeout(db_handle: u32, ms: u32) -> i32
  func sqlite3_column_type(stmt_handle: u32, icol: u32) -> i32
  func sqlite3_total_changes(db_handle: u32) -> i32
  func sqlite3_bind_text(stmt_handle: u32, pos: i32, text: string, xDel: i32) -> i32
  func sqlite3_column_count(stmt_handle: u32) -> i32
  func sqlite3_open_v2(filename: string, flags: i32, vfs: string) -> DBOpenDescriptor
  func sqlite3_column_bytes(stmt_handle: u32, icol: u32) -> i32
  func sqlite3_bind_int64(stmt_handle: u32, pos: i32, value: i64) -> i32
  func sqlite3_reset(stmt_handle: u32) -> i32
  func sqlite3_libversion_number() -> i32
  func sqlite3_prepare_v2(db_handle: u32, sql: string) -> DBPrepareDescriptor
  func sqlite3_exec(db_handle: u32, sql: string, callback_id: i32, callback_arg: i32) -> DBExecDescriptor
  func sqlite3_step(stmt_handle: u32) -> i32
  func sqlite3_column_double(stmt_handle: u32, icol: i32) -> f64
  func sqlite3_finalize(stmt_handle: u32) -> i32
  func sqlite3_column_text(stmt_handle: u32, icol: u32) -> string
  func sqlite3_errcode(db: u32) -> i32
  func sqlite3_column_blob(stmt_handle: u32, icol: i32) -> []u8
  func sqlite3_errmsg(db_handle: u32) -> string
  func sqlite3_soft_heap_limit64(size: i64) -> i64
```

As you can sqlite3 module exposes SQLite API functions whilst the facade sql_repl module has a single function sql_repl. Let us try SQL REPL.

```Shell
2> call sql_repl sql_repl []
For exit type QUIT;
SQL> CREATE TABLE tab1(i bigint);
CREATE TABLE tab1(i bigint)

SQL> INSERT INTO tab1 VALUES(42);
INSERT INTO tab1 VALUES(42)

SQL> SELECT * FROM tab1;
SELECT * FROM tab1
42

SQL>
```


**todo**: deploy, aqua and run