# Mounted binaries

Due to the inherent limitations of Wasm modules, such as a lack of sockets, it may be necessary for a module to interact with its host to bridge such gaps, e.g. use a https transport provider like _curl_. In order for a Wasm module to use a host's _curl_ capabilities, we need to provide access to the binary, which at the code level is achieved through the Rust `extern` block:

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::MountedBinaryResult;

pub fn main() {}

#[marine]
pub fn curl_request(curl_cmd: Vec<String>) -> MountedBinaryResult {
    let response = curl(curl_cmd);
    response
}

#[marine]
#[link(wasm_import_module = "host")]
extern "C" {
    fn curl(cmd: Vec<String>) -> MountedBinaryResult;
}
```

Note that to import functions from a host, not from other Wasm modules, `wasm_import_module` must be equal to `"host"`.

The code above creates a "curl adapter", i.e., a Wasm module that allows other Wasm modules to use the the `curl_request` function, which calls the imported _curl_ binary in this case, to make http calls. Please note that we are wrapping the `extern` block with the `[marine]` macro and introduce a Marine-native data structure  `MountedBinaryResult` as the linked-function return value.

To play with it in the Marine REPL you need to specify a path to `curl` on your local system, it is described in more details [here](../../marine-runtime/mounted-binaries.md).
