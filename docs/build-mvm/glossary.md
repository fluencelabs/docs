# Glossary

## AIR

Aqua Intermediate Representation (AIR) results from compiling your [Aqua](#Aqua) scripts. AIR is used by the [AquaVM](#aquavm)s deployed on [Fluence peer](#Peer)s to execute the workflows and [Service](#service) compositions specified in your Aqua scripts.
AIR contains a very limited set of instructions, like `(seq A B)` or `(par A B)` for control flow, and `(call peerId (serviceId functionName) [...args] exportVariable)` to execute compute operations using [Marine](#marine) services or [Peer](#Peer) API.

## Aqua

Aqua is a language for distributed systems and peer-to-peer networks.
Aqua describes distributed control flow in developer-friendly terms, and delegates computations to [Service](#Service)s on particular [Peer](#Peer)s.
Aqua follows [structural typing](https://en.wikipedia.org/wiki/Structural_type_system) paradigm to simplify composition and reuse of different libraries and [Service](#service)s. Read more in [Aqua Book](/docs/aqua-book/introduction.md).

## AquaVM

AquaVM is a Finite State Machine (FSM) that takes a [Particle](#particle) received by a particular [Peer](#peer), interprets an [AIR](#air) script of this [Particle](#particle) along with the [Particle Data](#particle-data), and gives the [Peer](#peer) a set of commands: what [Service](#service)s to call locally (if any), to what [Peer](#peer)s to send this [Particle](#particle) to (if any), and how the [Particle Data](#particle-data) should be updated (if should).

AquaVM takes its place for Proof of Processing as well, running on-chain to verify the [Particle](#particle), identify [Deal](#deal)s involved, and distribute the rewards.

## Aquamarine

Aquamarine is a technology stack that enables the Fluence protocol: [Aqua](#Aqua) with [AIR](#air) and [AquaVM](#aquavm), and [Marine](#marine). In other words, Aquamarine is Fluence without incentives and builtins.

## Builtins

[Service](#service)s available on Fluence [Peer](#peer)s by default: [Registry](/docs/aqua-book/libraries/registry.md), TrustGraph, [Peer](#peer) info (timestamp, identify, ...), [IPFS service](/docs/aqua-book/libraries/aqua-ipfs.md), [Spell](#spell)s service, and more. For the whole list, see the [builtins repo](/docs/aqua-book/libraries/libraries.md).

Builtin services can be used via [Aqua](#Aqua).

## Client (peer)

Client peer is a [Peer](#peer) that might be not publicly accessible to the rest of the [network](#fluence-network) without a Relay, and is not advertised to the Kademlia network – e.g., a Fluence [Peer](#peer) running inside a Web Browser, or a [Worker](#worker). Clients might be represented by short-living [Peer](#peer)s implementing just request-response or even fire-and-forget behavior. Clients might not offer full capabilities of the Fluence protocol, e.g. they don't route requests to Kademlia or [Subnetwork](#subnetwork)s, don't enter [Deal](#deal)s, etc.

## Deal

Deal is a description of a job that a customer is willing to run on the [Fluence network](#fluence-network). It contains a Content Identifier (CID) that points to [Service](#service)s and [Spell](#spell)s expected to run as the Deal Subnet [Worker](#worker)s. Moreover, Deal describes payment options, desired Subnet size, and the [effector module](#effector-module)(s) required for [Peer](#peer)s to join the Deal.

To join the Deal, a [PAT](#provider-access-token-pat) must be created by [Provider](#provider).

## Fluence Protocol

Fluence Protocol is an open, off-chain protocol that matches resource [provider](#provider)s and consumers to enable secure, verifiable decentralized serverless compute. The protocol is defined by a set of behaviors of [Peer](#peer)s, on top of Libp2p and [Aquamarine](#aquamarine), that enables emergent capabilities of the [Fluence network](#fluence-network): ability to resolve Subnets, manage TrustGraph, run [Worker](#worker)s, join [Deal](#deal)s, etc.

## Fluence Network

Fluence network is an open, permissionless network of [Fluence protocol](#fluence-protocol)-compliant [Peer](#peer)s.

## Fluence CLI

Fluence CLI is the main entry point into Fluence-based application lifecycle: 
 - Develop or reuse Marine [Service](#service)s
 - Develop [Aqua](#Aqua) to run in the [Fluence network](#fluence-network)
 - Deploy the application composed of [Aqua](#Aqua) scripts, Marine [Service](#service)s, and [Spell](#spell)s to the [Fluence network](#fluence-network) by creating a [Deal](#deal) and initiating creation of Subnet from [Worker](#worker)s
 - Use the deployed Subnet via [Fluence JS Client](#fluence-js-client)

## Fluence JS Client

Fluence JS Client is a [limited](#client-peer) implementation of the Fluence [Peer](#peer) in JS.
It runs in Node.js and a browser, has [Marine](#marine)-JS inside to execute Webassembly, runs [AquaVM](#aquavm) as a [Marine](#marine)-driven Wasm as well as other [Fluence protocol](#fluence-protocol)-level [Service](#service)s.

Fluence JS Client is embedded into [Fluence CLI](#fluence-cli).

Aqua compiler has JS and TS targets that uses Fluence JS Client to actually run compiled [AIR](#air) code, and provides relevant types.

## Host

Host is the closest full-featured (neither a [Client](#client-peer), nor a [Worker](#worker)) Fluence [Peer](#peer).

[Host Peer ID](/docs/aqua-book/language/topology.md#host_peer_id) can always be accessed from [Aqua](#Aqua).

## Init Peer

The p[Peer](#peer)eer that takes initiative to create a brand new [Particle](#particle) with a particular [AIR](#air) script in it, and begin its execution. Init Peer provides a signature for the initial [Particle](#particle) structure.

[Init Peer ID](/docs/aqua-book/language/topology.md#init_peer_id) can always be accessed from [Aqua](#Aqua).

## Marine

Marine is a general purpose Wasm runtime intended to execute compute functions in form of linked Wasm [Module](#marine-module)s (aka Services) on some [Peer](#peer).

It is the main way to express computations in the [Fluence protocol](#fluence-protocol).

Developers have three ways to define computations:
 - Write and use [Marine module](#marine-module)s to build a [Service](#service) from them
 - Write and use Marine [effector module](#effector-module)s to access an external effect, e.g. binary or API
 - Implement computations in Fluence [Peer](#peer)'s native language
 
With Marine, computations are portable and safe for the [Provider](#provider).

## Marine SDK

[Marine SDK](/docs/marine-book/marine-rust-sdk/) is a set of tools that help developers write and compile Rust code as [Marine](#marine) [module](#marine-module)s and [Service](#service)s.

## Marine Module

Marine Module is a single .wasm file compiled with Wasm IT support, e.g., using Rust language with [Marine SDK](#marine-sdk).

## Pure Module

[Module](#marine-module) with no effects that takes only inputs and maybe an internal sandboxed state, produces new state and outputs. May have import declarations of other modules.

## Facade Module

A [Module](#marine-module), usually [pure](#pure-module), that is the only module accessible from the outside – it constitutes API of a [Service](#service).

For modules that are intended to be shared as API, developers often need to write a Facade module to protect internal APIs from unauthorized access, enforce business-invariants, etc.

## Effector Module

Effector Module has a reference to effects external to Marine [Service](#service), e.g. to a CLI, binary interface, HTTP client, etc.

Effector modules have a special section in their config that describes binary imports, socket imports, or similar things.

## Mounted Binary

Mounted Binary is a special interface that provides an [effector module](#effector-module) with the capability to call any external binary with the provided set of arguments and obtain a result of this call. It makes it possible to integrate almost any other software (such as IPFS, Ceramic, and databases) in the Fluence ecosystem.

## Particle

Particle is a network package that forms a single-use software-defined network (SDN) for a single request of a single [AIR](#air) script.

Particle contains an immutable header (with an [AIR](#air) script and some metadata, including the [initiator](#init-peer)'s signature) and a [mutable body](#particle-data) (results of service calls triggered by the script execution, along with the signatures of involved [Peer](#peer)s).

## Particle File Vault

Particle File Vault is a temporary folder that is created on the [Peer](#peer) for every incoming [Particle](#particle) and removed when the [Particle](#particle) expires. All the services within this [Peer](#peer) have access to this folder.

Particle File Vault is expected to be used to pass data between [Service](#service)s in a single [AIR](#air) script, making them more composable and avoiding revealing this data to other [Peer](#peer)s involved into this [Particle](#particle)'s coordination network, which could happen if the data is returned as a plain text.

## Particle Data

A mutable part of the [Particle](#particle) that contains [Service](#service) responses and [Peer](#peer) signatures.

Particle data has a CRDT-like format to handle fork-join behavior when the same [Particle](#particle) is sent to several different destinations in parallel, and then is observed on third [Peer](#peer) in different states. In this case, data converges in deterministic way.

## Provider Access Token (PAT)

Evidence that a [Provider](#provider) put up the Collateral to join a [Deal](#deal) that stored and verified on-chain.

## PAT Envelope (PATE)

A [PAT](#provider-access-token-pat) with a Merkle proof of a blockchain state that allows checking that the given [PAT](#provider-access-token-pat) is a part of this [Deal](#deal) on a target block hash. Required for non-interactive checking of P[PAT](#provider-access-token-pat)AT validity.

## Peer Deal Token (PDT)

[PATE](#pat-envelope-pate) used by [Provider](#provider) to authorize a particular [Peer](#peer) to serve the [Deal](#deal). Proves that this [Peer](#peer) is a legitimate member of the [Deal](#deal)'s [Subnetwork](#subnetwork), can handle the load, has stake as a collateral on-chain, will be rewarded for the job done.

## Pi-calculus

Pi-calculus, π-calculus, process calculus is an extension of lambda calculus that takes parallel execution of processes.

The [AIR](#air) and [AquaVM](#aquavm) execution model is built on top of the fundamental principles of pi-calculus, which serves as the foundation layer for these technologies.

## Peer

A Fluence Peer is the result of implementing the [Fluence protocol](#fluence-protocol) to host and execute general purpose compute functions to provide users with a serverless experience. 

Fluence reference peers are comprised of the following components:
- Libp2p to manage connection pool
- A pool of [AquaVM](#aquavm) processes to handle [Particle](#particle)s
- A pool of Marine [Service](#service)s ready to be called from these [Particle](#particle)s
- A scheduler for [Spell](#spell)s
- A pool of [Worker](#worker)s to logically isolate Marine [Service](#service)s and [Spell](#spell)s to avoid interference

Fluence peers are identified by Peer ID which is derived from the Peer's Public Key.

## Provider

Provider is an agent that operates [Peer](#peer)s in the [network](#fluence-network) identified by a public key, holding private key to sign blockchain transactions when entering [Deal](#deal)s. Provider generates [PAT](#provider-access-token-pat)s, fetches [PATE](#pat-envelope-pate)s from [PAT](#provider-access-token-pat)s, uses them to issue [PDT](#peer-deal-token-pdt)s for Peers and therefore to assign them to [Deal](#deal)s.

## Relay

Relay is a [Host](#host) that a [Client](#client-peer) is connected to, or a [Host](#host) that a [Worker](#worker) resides on. [Worker](#worker)s and [Client](#client-peer)s are [Peer](#peer)s not involved into Kademlia discovery. To send or receive a [Particle](#particle), they are assisted by a Relay.

To execute code on a [Peer](#peer) that's behind a Relay, [use `on peer via relay:` construct](/docs/aqua-book/language/topology#accessing-peers-via-other-peers) in [Aqua](#Aqua).

## Registry

Registry is a part of the [Fluence protocol](#fluence-protocol) – a purpose-built [Distributed Hash Table (DHT)](https://en.wikipedia.org/wiki/Distributed_hash_table), designed for [Service](#service) discovery: to find a path to [Peer](#peer)(s) providing a particular [Service](#service), without knowing these [Peer](#peer)’s IDs in advance.

 - Registry Key is derived from a public key of the owner, and an arbitrary label
 - Registry Record holds a Peer ID with optional [Relay](#relay) ID and [Service](#service) ID, so that it can be used as a location of a particular piece of code on a particular [Peer](#peer)

Registry can be used to make a [Client](#client-peer) discoverable on the [network](#fluence-network), as well as for [Subnetwork](#subnetwork)s formation.

## Rust Peer

Rust Peer is the reference implementation of Fluence [Peer](#peer).

It is used as a [Relay](#relay) for Fluence [Client](#client-peer)s and as a [Host](#host) for Workers.

## Service

Service is a virtual construct combining [Marine Wasm module](#marine-module)s and linking instructions into a discoverable resource.

Service:
- Can be called from [Aqua](#Aqua)
- May be a Marine service, in this case it's a set of [Module](#marine-module)s linked together
- May be implemented as a [Peer](#peer) native functionality, see [Builtins](#builtins) as an example. This includes JavaScript callbacks provided to [Fluence JS Client](#fluence-js-client)

Service is identified by a Service ID that's bound to the Peer ID that provides this service.

Service exposes one or more functions. So finally to call a function developer needs to provide peer id, service id, and function name.

Service function calls within the [Fluence protocol](#fluence-protocol) are possible only via AIR instructions – from developer perspective, it means using [Aqua](#Aqua) language and [Fluence CLI](#fluence-cli) or another [Client](#client-peer).

## Subnetwork

A Subnetwork is a virtual partition (overlay) of the [Fluence p2p network](#fluence-network) defined by the terms and life of a Deal and accessed and managed with [Aqua](#Aqua). The behavior of a Subnetwork is defined by the set of [Worker](#worker)s specified by the [Deal](#deal).  

Subnetworks are an integral part of the [Fluence protocol](#fluence-protocol) and offer additional qualities, like fault tolerance or read consensus. That depends on the [Aqua](#Aqua) code that is deployed on the Subnet [Worker](#worker)s to maintain emergent qualities, and on the [Aqua](#Aqua) code that is used to work with the subnet.

To use Subnet, a developer needs to provide the [Deal](#deal) ID and possibly some additional authorization information.

## Spell

Spell is an [AIR](#air) script hosted on a [Peer](#peer) that is triggered periodically, similar to a cron job, or by an external event.

Spell has its own small KV store and a mailbox, that makes it very close to the Actor model.

## Tetraplet

Tetraplet is a data structure describing the origin of an argument to a function call. It contains four fields:

- `peer_id`
- `service_id`
- `function_name`
- `functor`

Tetraplets are the mean to check and enforce distributed security invariants of a function by putting restrictions on its arguments, e.g.: the argument “is_authorized” must be provided by a function “check_auth” from “security” [Service](#service) run on the same [Peer](#peer). Read more about Security Tetraplets [here](/docs/build-mvm/security.md).

## TrustGraph

TrustGraph is a part of the [Fluence protocol](#fluence-protocol). It is a [Builtin](#builtins) [Service](#service) that stores and operates relationships between public keys, secured by signatures. Paths in this graph can be used for authorization on service or function level, as well as for network spam protection.

## Worker

Worker is a part of [Peer](#peer)'s resources that, together with other Workers, constitutes a Subnet, handles the [Deal](#deal), and isolates some resources. It has:
- Its own keypair and Peer ID
- One or more deployed [Spell](#spell)s
- Zero or more deployed [Service](#service)s

Workers are deployed and removed as a whole. [Service](#service)s of a single worker may share some resources like filesystem access, etc.

## [Webassembly](https://webassembly.org/) (Wasm)

Webassembly is a binary instruction format for a stack-based virtual machine. Wasm is intended to provide a memory-safe, sandboxed execution environment with a flexible set of settings, such as memory size and allowed imports. There are a lot of languages (Rust, C/C++, tinyGo) that support Wasm as a compilation target. 

Fluence provides an [SDK for Rust](#marine-sdk), but supports any compiled Wasm module following [particular conventions](/docs/marine-book/marine-rust-sdk/module-abi.md).

## Webassembly IT

Webassembly Interface Types (Wasm IT, WIT) is a part of the Component model proposal that allows using complex types, like strings, structs, enums and arrays, in the Wasm modules API.

## [WASI](https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-intro.md)

WASI stands for WebAssembly System Interface. It's an API that provides access to several OS-like features defining a standardized set of POSIX-like imports to access the OS. It has integrated capability-based security, extending WebAssembly's characteristic sandboxing to include I/O.