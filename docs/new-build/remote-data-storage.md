## Remote Data Storage

### IPFS

[IPFS](https://ipfs.tech/) is a critical component of the Web3 ecosystem and can be considered distributed "hot" storage as opposed to Arweave's or Filecoin's "cold" storage and a great companion to decentralized, serverless compute. Hence, it shouldn't come as a surprise Fluence Rust peers provide IPFS sidecars as IPFS is used throughout the Fluence stack including service uploads for deployment. Moreover, ...

[Aqua IPFS](https://fluence.dev/docs/aqua-book/libraries/aqua-ipfs) builtins with Aqua bindings.

At this point, only a limited set of the IPFS API has been implemented as builtin services. If you need additional methods, please create a PR or Issue in the [Rust peer](notion://www.notion.so/fluencenetwork/Fluence-Developer-Documentation-bdf8d06ad52e493fb765456dbd5480cd) repo.

Based on the groundwork already done by Fluence including providing an IPFS binary, we'll develop and IPFS adapter and a simple facade module.

Conceptually, ... FFI host import

```rust
use marine_rs_sdk::{marine, MountedBinaryResult};

fn main() {}

#[marine]
pub fn ipfs_request(cmd: Vec<String>) -> MountedBinaryResult {
    ipfs(cmd)
}

#[marine]
#[link(wasm_import_module = "host")]
extern "C" {
    pub fn ipfs(cmd: Vec<String>) -> MountedBinaryResult;
}

```

for REPl use ...

to be continued

### Ceramic ComposeDB

Coming soon.