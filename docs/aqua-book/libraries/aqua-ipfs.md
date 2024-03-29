---
description: IPFS API bindings in Aqua
---

# @fluencelabs/aqua-ipfs

`aqua-ipfs` lets you call the API of an IPFS daemon, e.g. to transfer files between peers & services or to orchestrate IPFS nodes.

## API

```aqua
service Ipfs("ipfs-adapter"):
  -- upload file on 'file_path' to associated IPFS node
  put(file_path: string) -> IpfsPutResult
  -- 'ipfs get', download file $cid from the associated IPFS node
  get(cid: string) -> IpfsGetResult
  -- download file $cid from $external_multiaddr to local filesystem
  get_from(cid: string, external_multiaddr: string) -> IpfsGetResult
  -- `ipfs swarm connect`, connect associated IPFS node to $multiaddr
  connect(multiaddr: string) -> IpfsResult
  -- address on which IPFS RPC is available (usually port 5001)
  get_external_api_multiaddr() -> IpfsMultiaddrResult
  -- address on which IPFS SWARM is available (usually port 4001)
  get_external_swarm_multiaddr() -> IpfsMultiaddrResult
  
  -- the following is internal API that isn't of much interest  
  get_local_api_multiaddr() -> IpfsMultiaddrResult
  set_external_api_multiaddr(multiaddr: string) -> IpfsResult
  set_external_swarm_multiaddr(multiaddr: string) -> IpfsResult
  set_local_api_multiaddr(multiaddr: string) -> IpfsResult
  set_timeout(timeout_sec: u64)  
```

## Terminology

* **@fluencelabs/aqua-ipfs** - Aqua library on NPM. Provide IPFS API to develop custom Aqua scripts. Suits more advanced use-cases.
* **ipfs-adapter** - WebAssembly service. Pre-deployed to all Fluence nodes, but it's possible to deploy your own if you need it.
* **particle file vault** - a special temporary directory that is shared between services participating in an Aqua script execution. That directory is local to each peer (i.e., it's not shared between services on different peers). It's accessible inside services by path `/tmp/vault/$particle-id`.
* **particle** - signed network packets that contain script and data. Each script execution produces a single particle with unique `particle id`
* **associated IPFS node** - IPFS daemon that is distributed with each Fluence node. See [_Pre-deployed ipfs-adapter_](#Pre-Deployed-IPFS-Adapter) for more details

## Concepts

### Where Files Are Located

On the disk, in the **particle file vault** directory: `/tmp/vault/$particle-id`.

### How Files Are Shared

When a node downloads a file via `Ipfs.get_from`, the file is stored at the **particle file vault** and the `path` is returned. Other services can read or write to that `path` if there's a command to do so in the Aqua script. That is possible because **particle file vault** is shared between all services in the context of script execution.

In effect, it's possible to share files between different services. In order to prevent data leakage, these files are accessible only by services used in the script.

So, to share a file, the service puts it in the **particle file vault** and returns a path relative to the vault.

## How To Use

### Process File From IPFS

Applications often need to apply different kinds of processing to files. Resize an image, extract JSON data, parse, compress, etc.

To achieve that, you'll need to write a simple Aqua script that would download a file from IPFS, and give the resulting path to a service that implements desired processing logic.

Here's a simple example of calculating the size of the file specified by IPFS CID:

:::note
Take a look  at `ProcessFiles` service [Rust implementation](https://github.com/fluencelabs/examples/blob/2f4679ad01ca64f2863a55389df034120d65d131/intro/4-ipfs-code-execution/service/src/main.rs#L34) and its [Aqua API](https://github.com/fluencelabs/examples/blob/2f4679ad01ca64f2863a55389df034120d65d131/intro/4-ipfs-code-execution/aqua/src/process.aqua)
:::

```aqua
-- define type aliases for code readability
type CID: string
type PeerId: string
type Multiaddr: string
type File: string

-- service that implements size calculation
service ProcessFiles:
  file_size(file_path: string) -> u64
  write_file_size(size: u32) -> File

-- download file & calculate its size
func get_file_size(cid: CID, remote_ipfs: Multiaddr) -> u32:
    result <- Ipfs.get_from(cid, remote_ipfs)
    size <- ProcessFiles.file_size(get.path)
    <- size
    
```

:::info
This is a simplified code that doesn't handle errors or topology.

For the full example, take a look at [process.aqua](https://github.com/fluencelabs/examples/blob/2f4679ad01ca64f2863a55389df034120d65d131/intro/4-ipfs-code-execution/aqua/src/process.aqua#L44-L73).
:::

### Upload Files To IPFS

To upload a file to the _associated_ IPFS node, use `Ipfs.put`. It reads the file from the **particle file vault** and uploads it to the _associated_ IPFS node.

Let's take a look at the example.

Using `get_file_size` function from the previous example it's possible to calculate the size of a file. But now let's upload the size to IPFS, so anyone can download it.

```aqua
-- store calculated size on IPFS
func store_file_size(cid: CID, remote_ipfs: Multiaddr) -> CID:
    size <- get_file_size(cid, remote_ipfs)
    file <- ProcessFiles.write_file_size(size)
    put <- Ipfs.put(file)
    <- put.hash
```

### Get The Address Of The Associated IPFS Node

To download something from the associated IPFS node, you need to know its multiaddress.

Use `Ipfs.get_external_api_multiaddr` function to achieve that.

For example, after the processed file is uploaded to IPFS, you might want to download it in the browser. For that, in TS code you would do something like this:

```typescript
import { Multiaddr } from 'multiaddr';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
const { create } = require('ipfs-http-client');

// retrieve RPC multiaddr
let multiaddr = get_external_api_multiaddr(krasnodar[1]);
// remove /p2p/123D... from multiaddr
let rpcMultiaddr = new Multiaddr(rpcAddr).decapsulateCode(protocols.names.p2p.code);
// connect ipfs-js to the RPC multiaddr
const ipfs = create(rpcMultiaddr);
// download file via ipfs-js
let file = await ipfs.get(cid);
```

## Fluence And IPFS

### Pre-Deployed IPFS-Adapter

Each Fluence node comes with an associated IPFS daemon to handle file transfers and caching. When a Fluence node starts, an instance of `ipfs-adapter` service is created and connected to the associated IPFS daemon.

In effect, each Fluence node provides a WebAssembly service with an id `"ipfs-adapter"` that you can use to orchestrate file transfers between apps, download .wasm modules and deploy services from them. In that sense, Fluence provides a compute layer on top of IPFS, while IPFS takes care of file storage.

When you're using the `@fluencelabs/aqua-ipfs` library, it connects to the `"ipfs-adapter"` service by default.

:::note
It is possible to create a custom setup of the `ipfs-adapter` service or to associate it with an external IPFS node. Please contact us in [Discord](https://discord.gg/hDNdaBP45e) and we'll help you with that.

Alternatively, check out how IPFS is set up in our [Dockerfile](https://github.com/fluencelabs/node-distro/blob/308e5b2be852e56bcc4b6d0242b6913af99be939/Dockerfile).
:::

### How The Interaction With An IPFS Daemon Works

The Marine WASM runtime provides us with a secure yet powerful way to interact with external programs: run binaries on the host. That mechanic is called "mounted binaries".

`ipfs-adapter` "mounts" IPFS CLI utility internally, and uses it to interact with associated IPFS daemon. That is: when you call `Ipfs.put(multiaddr)`, it's just `ipfs put $multiaddr` like you would do in the terminal, and when you call `Ipfs.connect` it's just `ipfs swarm connect`.

That makes it very easy to express any existing IPFS API in Aqua. So if you miss some IPFS methods, please let us know!
