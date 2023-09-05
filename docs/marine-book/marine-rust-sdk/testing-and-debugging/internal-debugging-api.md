# Internal debugging API

The `Marine SDK` has an internal feature called `debug`, it allows debugging some of the internal details of the IT execution. 

## Enabling debug API

To enable logging please specify the logger feature of the Marine SDK in `Config.toml`:

```toml
[dependencies]
marine-rs-sdk = { version = "0.7.1", features = ["debug"] }
```

## Using debug API

Normally, this feature should not be used by a backend developer. Below you can see examples of such details for the greeting service compiled with the `debug` feature. Please note, that it's [necessary](../../marine-tooling-reference/marine-repl.md#enabling-logger) to run REPL with `RUST_LOG`.

```sh
# running the greeting service compiled with debug feature
RUST_LOG="info" mrepl Config.toml

Welcome to the Marine REPL (version 0.16.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 0ba05b05-4e92-48bf-ac30-2b8b59efe189
elapsed time 746.509µs

1> call greeting greeting "user"
[greeting] sdk.allocate: 4
[greeting] sdk.set_result_ptr: 1114240
[greeting] sdk.set_result_size: 8
[greeting] sdk.get_result_ptr, returns 1114240
[greeting] sdk.get_result_size, returns 8
[greeting] sdk.get_result_ptr, returns 1114240
[greeting] sdk.get_result_size, returns 8
[greeting] sdk.deallocate: 0x110080 8

result: String("Hi, user")
 elapsed time: 222.675µs
```

The most important information these logs relates to the `allocate`/`deallocate` function calls. The `sdk.allocate: 4` line corresponds to passing the 4-byte `user` string to the Wasm module, with the memory allocated inside the module, and the string is copied there. Whereas `sdk.deallocate: 0x110080 8` refers to passing the 8-byte resulting string `Hi, user` to the host side. Since all arguments and results are passed by value, `deallocate` is called to delete unnecessary memory inside the Wasm module.
