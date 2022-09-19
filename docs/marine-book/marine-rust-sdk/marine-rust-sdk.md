# Marine Rust SDK

The Marine SDK is comprised of two main crates: [marine-rs-sdk](https://github.com/fluencelabs/marine-rs-sdk/) and [marine-rs-sdk-test](https://github.com/fluencelabs/marine-rs-sdk-test).

The `marine-rs-sdk` empowers developers to create suitable hosting on peers of the peer-to-peer network. Such services are constructed from one or more Wasm modules, where each is the result of Rust code compiled to `wasm32-wasi` compile target, executable by the Marine runtime.

The `marine-rs-sdk-test` allows developers to write comprehensive tests for their modules and services.

The main purpose of the SDK that influenced its design is to allow a developer to write modules on "vanilla" Rust wrapping necessary blocks with the provided macros.
