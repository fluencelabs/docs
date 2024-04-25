# Setting up the development environment

:::info
The environment will be setup for you automatically if you use [Fluence CLI](../../build/setting-up/installing_cli.md)
:::

To build Marine modules you need to install a CLI tool called `marine` that uses the Rust `wasm32-wasi` target and Marine environment to compile Wasm modules.

First, install Rust and supplementary tools:
<!-- cSpell:disable -->
```sh
# install the Rust compiler and tools to `~/.cargo/bin`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# add Rust tools to the current PATH
source $HOME/.cargo/env

# install the nightly toolchain 
rustup install nightly-2023-12-06
```

To be able to compile Rust in Wasm, install the `wasm32-wasi` compilation target:

```sh
# install wasm32-wasi target for WebAssembly
rustup +nightly-2023-12-06 target add wasm32-wasi
```
<!-- cSpell:enable -->

To be able to use `generate` subcommand of marine, install the `cargo-generate` tool:

```sh
# install cargo-generate target for the marine tool
cargo install cargo-generate
```

Then, install `marine` and `mrepl`:

```sh
# install marine
    cargo +nightly-2023-12-06 install marine

# install mrepl, it requires nightly toolchain
cargo +nightly-2023-12-06 install mrepl
```
