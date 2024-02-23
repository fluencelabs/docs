# Connecting To A Peer's Filesystem

Like all serverless compute protocols, Fluence Functions is an inherently stateless protocol and persistent data storage, e.g., to Ceramic or S3, is a complementary solution developers need integrate into their application stack. However, just like in AWS Lambda, Fluence Functions provides ephemeral storage to developers that can be utilized during the course of a Lambda execution with no expectation of data durability beyond that execution epoch. Hence, ephemeral storage is of limited use and must not be confused with durable storage. On that cautionary note, let's dive in. 

Fluence Functions Ephemeral Storage follows the common file-based (Rust) IO process and is implemented as a Wasm module using [MountedBinaries](https://fluence.dev/docs/marine-book/marine-runtime/mounted-binaries), which you already encountered in the previous section.

Let's set up a new project with Fluence CLI using the minimal template and the default, i.e., *kras*, environment with `fluence init ephemeral-storage` and *cd* into the new directory. Recall that our first step in setting up our project is to create a new (Marine) service and the appropriate modules with `fluence service new eph_storage` and accept the proposed default:

```bash
Added eph_storage to /Users/bebo/localdev/fluence-code/mvm-docs-code/ephemeral-storage/fluence.yaml
? Do you want to add service eph_storage to a default deal dealName: Yes
Added eph_storage to dealName
```

Now we can add our local storage module with `fluence module new local_storage --path src/services/eph_storage/modules/`:

```bash
Successfully generated template for new module at src/services/eph_storage/modules/local_storage
```

With the final scaffolding out of the way, let's get our *local-storage* module developed by replacing the template content in `src/services/eph_storage/modules/local_storage/sc/main.rs`:

```rust
#![allow(non_snake_case)]
use marine_rs_sdk::marine;

use std::{fs, io::Write};
use std::path::PathBuf;

// this is the reference to the directory location for our temporary files
// in the associated module.file
const SITES_DIR: &str = "/tmp/";

pub fn main() {}

fn file_writer(content: Vec<u8>, file_handler: Result<fs::File, std::io::Error>) -> String {
    match file_handler {
        Ok(mut fh) => {
            match fh.write_all(&content) {
                Ok(_) => return String::from("Ok"),
                Err(e) => return format!("Write Error: {}", e),
            };
        },
        Err(e) => format!("Write Error: {}", e)
    }
}

#[marine]
pub fn put(name: String, content: Vec<u8>) -> String {
    let f_path = format!("{}{}", SITES_DIR, name);
    let file_handler = fs::File::create(f_path);
    let res = file_writer(content, file_handler);
    res
}

#[marine]
pub fn put_append(name: String, content: Vec<u8>) -> String {
    let f_path = format!("{}{}", SITES_DIR, name);
    let file_handler:Result<fs::File, _> = fs::OpenOptions::new().create(true).append(true). open(PathBuf::from(f_path));
    file_writer(content, file_handler)
}

#[marine]
pub fn get(file_name: String) -> Vec<u8> {
    let tmp_filepath = format!("{}{}", SITES_DIR, file_name);

    match fs::read(tmp_filepath) {
        Ok(data) => data,
        Err(e) => format!("Read error: {}", e).as_bytes().to_vec(),
    }
}

#[marine]
pub fn rm(file_name: String) -> bool {
    let tmp_filepath = format!("{}{}", SITES_DIR, file_name);
    match fs::remove_file(tmp_filepath) {
        Ok(_) => true,
        Err(_) => false,
    }
}
```

Our Wasm module handling file access follows the Rust IO convention, e.g., [Rust Cookbook](https://rust-lang-nursery.github.io/rust-cookbook/file/read-write.html). Note that we specify our location directory `/tmp/`, which needs to align with the corresponding section in *module.yaml*, to which we get in a minute. We expose read from, write to and delete a file with the added caveat that the user has a choice to write-append. Note that we don't need to call the *file_writer* function outside of the code module and therefore don't need to *marine* wrap it.

Before we can check out our new and shinny adapter to the host's filesystem, we need to update its module.yaml as well as the service.yaml file.

```yaml
# module.yaml
version: 0

type: rust

name: local_storage
volumes:
  sites: ./tmp
```

Update the default module.yaml to above, which maps the system level directory `tmp` to the *SITES_DIR* in the Rust code using a bit of Marine magic. Make sure the target host system, local or remote, actually exists or is able to create the specified directory! Now we need to update the *service.yaml* file to reflect our adapter:

```yaml
version: 0

name: eph_storage

modules:
  facade:
    get: modules/eph_storage
  MountedBinaries:
    get: modules/local_storage
```

Go ahead, update your file. As you can see, we link the adapter path to [*MountedBinary*](https://fluence.dev/docs/marine-book/marine-runtime/mounted-binaries) and are ready to use our multi-module Wasm in the REPL. `fluence build` the project and load the modules into the REPL `fluence service repl eph_storage`:

```bash
Welcome to the Marine REPL (version 0.24.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = e7ccc518-a197-4910-85c9-2a049bbf28c1
elapsed time 49.076417ms

1> i
Loaded modules interface:
exported data types (combined from all modules):
data IOResult:
  stdout: []u8
  stderr: string

exported functions:
local_storage:
  func put_append(name: string, content: []u8) -> string
  func get(file_name: string) -> []u8
  func rm(file_name: string) -> bool
  func put(name: string, content: []u8) -> string

2> call local_storage put  ["my_file.txt", [100, 101, 102]]
result: "Ok"
 elapsed time: 7.738208ms

3> call local_storage get  ["my_file.txt"]
result: [
  100,
  101,
  102
]
 elapsed time: 1.509541ms

4> call local_storage put_append  ["my_file.txt", [103, 104, 105]]
result: "Ok"
 elapsed time: 1.224459ms

5> call local_storage get  ["my_file.txt"]
result: [
  100,
  101,
  102,
  103,
  104,
  105
]
 elapsed time: 1.18825ms

6>
```

All our *marine* wrapped interfaces are exposed, are ready to be called and seem to be working as intended! Go ahead and test the remaining functionality.

Before we move on, you might be considering to improve the *local_storage* code and introduce a nice results struct, such as, say:

```rust
#[marine]
pub struct IOResult {
    stderr: String,
    stdout: Vec<u8>
}
```

to get a nice, consistent return type for all the exposed functions to provide a much better experience processing return values. Alas, this is not going to work in the sense we can link exposed functions in the facade module, for example, as all linked FFI functions must be on of the WASM IT [IType](https://fluence.dev/docs/marine-book/marine-runtime/i-value-and-i-type). In order to get around this restriction and still have a decent developer experience, we can introduce a struct, like above, convert it to a json string using the [serde_json](https://crates.io/crates/serde_json) and [serde](https://crates.io/crates/serde) crates. Go ahead and `cargo add serde serde_json` to the *local_storage* workspace and revisit our code:

```rust
#![allow(non_snake_case)]
use marine_rs_sdk::marine;
use serde::{Deserialize, Serialize};

use std::{fs, io::Write};
use std::path::PathBuf;

const SITES_DIR: &str = "/tmp/";

pub fn main() {}

#[marine]
#[derive(Debug, Deserialize, Serialize)]
pub struct IOResult {
    pub stderr: String,
    pub stdout: Vec<u8>
}

impl IOResult {
    fn new(stderr: String, stdout: Vec<u8>) -> Self {
        IOResult { stderr, stdout}
    }

    fn to_string(&self) -> String {
        serde_json::to_string(&self).unwrap()
    }
}

fn file_writer(content: Vec<u8>, file_handler: Result<fs::File, std::io::Error>) -> String {
    let res = match file_handler {
        Ok(mut fh) => {

            let inner_res = match fh.write_all(&content) {
                Ok(_) => IOResult::new("".to_owned(), u32::from(true).to_le_bytes().to_vec()),
                Err(e) => IOResult::new(format!("write error: {}", e), vec!()),
            };
            inner_res
        },
        Err(e) => IOResult::new(format!("file handler error: {}", e),vec!()),
    };

    res.to_string()
}

#[marine]
pub fn put(name: String, content: Vec<u8>) -> String {
    let f_path = format!("{}{}", SITES_DIR, name);
    let file_handler = fs::File::create(f_path);
    let res = file_writer(content, file_handler);
    res.to_string()
}

#[marine]
pub fn put_append(name: String, content: Vec<u8>) -> String {
    let f_path = format!("{}{}", SITES_DIR, name);
    let file_handler:Result<fs::File, _> = fs::OpenOptions::new().create(true).append(true). open(PathBuf::from(f_path));
    let res = file_writer(content, file_handler);
    res.to_string()
}

#[marine]
pub fn get(file_name: String) -> String {
    let tmp_filepath = format!("{}{}", SITES_DIR, file_name);

    let res = match fs::read(tmp_filepath) {
        Ok(data) => IOResult::new("".to_owned(), data),
        Err(e) => IOResult::new(format!("read failure: {}", e),vec!()),
    };

    res.to_string()
}

#[marine]
pub fn rm(file_name: String) -> String {
    let tmp_filepath = format!("{}{}", SITES_DIR, file_name);
    let res = match fs::remove_file(tmp_filepath) {
        Ok(_) => IOResult::new("".to_owned(), u32::from(true).to_le_bytes().to_vec()),
        Err(e) => IOResult::new(format!("remove failure: {}", e), u32::from(false).to_le_bytes().to_vec()),
    };
    res.to_string()
}
```

Instead of some akward string parsing to figure out what whether we got an error or success result, e.g., `if result.contains("Read error:") {...}` we can process our stderr and stdout once we converted the json string back to the IOResult struct. Build the Wasm module and let's checkout the revised code in the REPL:

```bash
Welcome to the Marine REPL (version 0.24.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = e08364ac-ba81-4695-ba41-ada23cfe1eab
elapsed time 50.068125ms

1> call local_storage put  ["my_file.txt", [100, 101, 102]]
result: "{\"stderr\":\"\",\"stdout\":[1,0,0,0]}"
 elapsed time: 6.878875ms

2> call local_storage get  ["my_file.txt"]
result: "{\"stderr\":\"\",\"stdout\":[100,101,102]}"
 elapsed time: 2.292292ms

3>
```
As expected, we are now getting json strings over the IOResult interface for our results, which is a lot more useful. As always, feel free to check out the remaining functions as well as the available interfaces.

Now that we have another reusable Wasm module utilizing permissioned host resources, let's use it from the facade module. We're not going to build anything fancy, feel free to do so yourself, but wrap the adapter functions to illustrate what needs to be done to link the module. Make sure you the *serde* and *serde_json* dependencies to the facade workspace and replace the template code in the facade source file with below:

```rust
#![allow(non_snake_case)]
use marine_rs_sdk::marine;
use serde::Deserialize;
use serde_json;

pub fn main() {}

#[marine]
#[derive(Deserialize)]
pub struct IOResult {
    pub stdout: Vec<u8>,
    pub stderr: String,
}

#[marine]
pub fn read_file(name: String) -> IOResult {
    let data = get(name);   
    serde_json::from_str(&data).unwrap()
}

#[marine]
pub fn write_file(name: String, payload: String) -> IOResult {
    let content = payload.as_bytes().to_vec();
    let res = put(name, content);
    serde_json::from_str(&res).unwrap()
}

#[marine]
pub fn rm_file(name: String) -> String {
    let res = remove_file(name);
    serde_json::from_str(&res).unwrap()
}

#[marine]
#[link(wasm_import_module = "local_storage")]
extern "C" {
    pub fn get(file_name: String) -> String;

    pub fn put(name: String, file_content: Vec<u8>) -> String;

    pub fn put_append(name: String, file_content: Vec<u8>) -> String;

    #[link_name = "rm"]
    pub fn remove_file(name: String) -> String;
}

```

Before building and inspecting the modules in the REPL, have a look at the [FFI](https://doc.rust-lang.org/rust-by-example/std_misc/ffi.html) linkng section at the bottom of the file. Just like in the curl-adapter example, we link to the module name, *local_storage*, and enumerate the public function interfaces we want to use. As mentioned earlier, there is no commensurate approach for arbitrary data interfaces outside the ITypes. We also introduce function aliasing with the `#[link_name = "<exported function interface name>"]`, which may come in handy. Additional wrinkle: our *write_file* method takes the file data as a *String*. 

Build the project and load the modules into the REPL:

```bash
Welcome to the Marine REPL (version 0.24.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 163e2fa8-f861-42ef-9f8b-2aef67783059
elapsed time 65.800542ms

1> i
Loaded modules interface:
exported data types (combined from all modules):
data IOResult:
  stdout: []u8
  stderr: string

exported functions:
eph_storage:
  func write_file(name: string, payload: string) -> IOResult
  func rm_file(name: string) -> string
  func read_file(name: string) -> IOResult
local_storage:
  func put_append(name: string, content: []u8) -> string
  func get(file_name: string) -> string
  func put(name: string, content: []u8) -> string
  func rm(file_name: string) -> string

2>
```

As you can see, both modules are loaded and all the *marine* wrapped function and data interfaces are available to be called. At this time, we are interested in the *eph_storage*, our facade module, namespace:

```bash
2> call eph_storage write_file ["my_file.txt", "some data"]
result: {
  "stderr": "",
  "stdout": [
    1,
    0,
    0,
    0
  ]
}
 elapsed time: 12.637416ms

3> call eph_storage read_file ["my_file.txt"]
result: {
  "stderr": "",
  "stdout": [
    115,
    111,
    109,
    101,
    32,
    100,
    97,
    116,
    97
  ]
}
 elapsed time: 1.714541ms

4>
```

Go ahead, add more "wrapper" functions to the facade module for full "linking" coverage and check things out in the REPL.


**Payment, Deployment section skipped for now**
