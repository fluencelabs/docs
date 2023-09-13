# Logging

Using logging is a simple way to assist in debugging without deploying the module(s) to a p2p node.

## Using logger

The `logger` feature allows you to use a special logger that is based at the top of the [log](https://crates.io/crates/log) crate. To enable logging please specify the logger feature of the Marine SDK in `Config.toml` and add the [log](https://crates.io/crates/log) crate:

```toml
[dependencies]
log = "0.4.14"
marine-rs-sdk = { version = "0.7.1", features = ["logger"] }
```

The logger should be initialized before its usage. This can be done in the `main` function as shown in the example below:

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::WasmLoggerBuilder;

pub fn main() {
    WasmLoggerBuilder::new()
        // with_log_level can be skipped,
        // logger will be initialized with Info level in this case.
        .with_log_level(log::LevelFilter::Info)
        .build()
        .unwrap();
}

#[marine]
pub fn put(file_name: String, _file_content: Vec<u8>) -> String {
    log::info!("put called with file name {}", file_name);
    unimplemented!()
}
```

To play with this logging stuff in REPL you need to

* specify the `logger_enabled=true` for this module in the configuration file (more details in this [section](../../marine-runtime/configuration-file.md#logger_enabled))
* use environment variables for REPL to guide it about minimal log level (details [here](../../marine-tooling-reference/marine-repl.md#enabling-logger))

## Using target map

In addition to the standard log creation features, the Fluence logger allows the so-called target map to be configured during the initialization step. This allows you to filter out logs by `logging_mask`, which can be set for each module in the service configuration. Let's consider an example:

```rust
use marine_rs_sdk::marine;

const TARGET_MAP: [(&str, i32); 4] = [
    ("instruction", 1 << 1),
    ("data_cache", 1 << 2),
    ("next_peer_pks", 1 << 3),
    ("subtree_complete", 1 << 4),
];

pub fn main() {
  use std::collections::HashMap;
  
  let target_map = HashMap::from_iter(TARGET_MAP.iter().cloned());
    
  marine_rs_sdk::WasmLoggerBuilder::new()
        .with_target_map(target_map)
        .build()
        .unwrap();
}

#[marine]
pub fn foo() {
    log::info!(target: "instruction", "this will print if (logging_mask & 1) != 0");
    log::info!(target: "data_cache", "this will print if (logging_mask & 2) != 0");
}
```

Here, an array called `TARGET_MAP` is defined and provided to a logger in the `main` function of a module. Each entry of this array contains a string (a target) and a number that represents the bit position in the 64-bit mask `logging_mask`. When you write a log message request `log::info!`, its target must coincide with one of the strings (the targets) defined in the `TARGET_MAP` array. The log will be printed if `logging_mask` for the module has the corresponding target bit set.

A more complex example of this feature usage can be found in the Aqua [interpreter](https://github.com/fluencelabs/aquamarine/blob/e5244db6a12034022a6750f5352583d0b3885401/interpreter-lib/src/log_targets.rs).
