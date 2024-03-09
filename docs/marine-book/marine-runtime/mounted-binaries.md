# Mounted binaries

The `mounted binaries` section is for using external services inside a Wasm module. Each record of the form `cli_tool_name = cli-tool-path` within this section allows you to call a CLI tool located in the `cli-tool-path` directory.

Consider the following example:

```toml
[[module]]
    name = "curl_adapter"
    logger_enabled = true

    [module.mounted_binaries]
    curl = "/usr/bin/curl"
```

Using this config with adding the following lines in your source code:

```rust
#[marine]
#[host_import]
extern "C" {
    fn curl(cmd: Vec<String>) -> String;
}
```

allows you to pass an argument as a string to the CLI tool and receive its output as a string.

This import function is a host import function, meaning that wasm\_import\_module must be equal to `"host"`. Note that the signature of such functions must follow the pattern shown above: `cli_tool_name(Vec<String>) -> MountedBinaryResult`. This pattern reflects the Rust process [API](https://doc.rust-lang.org/std/process/index.html).

Then this function can be used as an ordinary Rust FFI function, but without `unsafe` block:

```rust
#[marine]
pub fn download(url: String) -> String {
    let result = curl(vec![url]);
    String::from_utf8(result.stdout).unwrap()
}
```
