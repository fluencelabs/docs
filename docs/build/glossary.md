# Glossary

## AIR

Aqua Intermediate Representation (AIR) results from compiling your [Aqua](#Aqua) scripts. AIR is used by the [AquaVM](#aquavm)s deployed on [Fluence peer](#Peer)s to execute the workflows and service compositions specified in your Aqua scripts.
AIR contains a very limited set of instructions, like `(seq A B)` or `(par A B)` for control flow, and `(call peerId (serviceId functionName) [...args] exportVariable)` to execute compute operations using [Marine](#marine) services or [Peer](#Peer) API.

## Aqua

Aqua is a language for distributed systems and peer-to-peer networks.
Aqua describes distributed control flow in developer-friendly terms, and delegates computations to [Service](#Service)s on particular [Peer](#Peer)s.
Aqua follows [structural typing](https://en.wikipedia.org/wiki/Structural_type_system) paradigm to simplify composition and reuse of different libraries and services. Read more in [Aqua Book](/docs/aqua-book/).

## AquaVM

AquaVM is a Finite State Machine (АЫЬ) that takes a Particle received by a particular Peer, interprets an AIR script of this Particle along with the Particle Data, and gives the Peer a set of commands: what services to call locally (if any), to what peers to send this particle to (if any), and how the Particle Data should be updated (if should).

AquaVM takes its place for Proof of Processing as well, running on-chain to verify the Particle, identify Deals involved, and distribute the rewards.

## Aquamarine

Aquamarine is a technology stack that enables the Fluence protocol: Aqua with AIR and AquaVM, and Marine. In other words, Aquamarine is Fluence without incentives and builtins.

## Builtins

Services available on Fluence Peers by default: Registry, TrustGraph, Peer info (timestamp, identify, ...), IPFS service, spells service, and more. For the whole list, see the [builtins repo](/docs/aqua-book/libraries/libraries.md).

Builtin services can be used via Aqua.

## Client (peer)

Client peer is a Peer that might be not publicly accessible to the rest of the network without a Relay, and is not advertised to the Kademlia network – e.g., a Fluence peer running inside a Web Browser, or a Worker. Clients might be represented by short-living peers implementing just request-response or even fire-and-forget behavior. Clients might not offer full capabilities of the Fluence protocol, e.g. they don't route requests to Kademlia or Subnetworks, don't enter Deals, etc.

## Deal

Deal is a description of a job that a customer is willing to run on the Fluence network. It contains a Content Identifier (CID) that points to Services and Spells expected to run as the Deal Subnet Workers. Moreover, Deal describes payment options, desired Subnet size, and the effector module(s) required for Peers to join the Deal.

To join the Deal, a PAT must be created by Provider.

## Fluence Protocol

Fluence Protocol is an open, off-chain protocol that matches resource providers and consumers to enable secure, verifiable decentralized serverless compute. The protocol is defined by a set of behaviors of Peers, on top of Libp2p and Aquamarine, that enables emergent capabilities of the Fluence network: ability to resolve Subnets, manage TrustGraph, run Workers, join Deals, etc.

## Fluence Network

Fluence network is an open, permissionless network of Fluence protocol-compliant peers.

## Fluence CLI

Fluence CLI is the main entry point into Fluence-based application lifecycle: 
 - Develop or reuse Marine services
 - Develop Aqua to run in the Fluence Network
 - Deploy the application composed of Aqua scripts, Marine services, and Spells to the Fluence Network by creating a Deal and initiating creation of Subnet from Workers
 - Use the deployed Subnet via Fluence JS Client

## Fluence JS Client

Fluence JS Client is a limited implementation of the Fluence Peer in JS.
It runs in Node.js and a browser, has Marine-JS inside to execute Webassembly, runs AquaVM as a Marine-driven Wasm as well as other Fluence protocol-level services.

Fluence JS Client is embedded into Fluence CLI.

Aqua compiler has JS and TS targets that uses Fluence JS Client to actually run compiled AIR code, and provides relevant types.

## Host

Host is the closest full-featured (neither a Client, nor a Worker) Fluence Peer.

## Init Peer

The peer that takes initiative to create a brand new Particle with a particular AIR script in it, and begin its execution. Init Peer provides a signature for the initial Particle structure.

Init Peer ID can always be accessed from Aqua.

## Marine

Marine is a general purpose Wasm runtime intended to execute compute functions in form of linked Wasm modules (aka Services) on some Peer.

It is the main way to express computations in the Fluence protocol. Developers have three ways to define computations:
 - Write and use Marine modules to build a Service from them
 - Write and use Marine effector modules to access an external effect, e.g. binary or API
 - Fork the Fluence Peer implementation to provide computations implemented in the host language
 
With Marine, computations are portable and safe for the Host operator.

## Marine SDK

Marine SDK is a set of tools that help developers write and compile Rust code as Marine modules and services.

## Marine Module

Marine Module is a single .wasm file compiled with Wasm IT support, e.g., using Rust language with Marine SDK.

## Pure Module

Module with no effects that takes only inputs and maybe an internal sandboxed state, produces new state and outputs. May have import declarations of other modules.

## Facade Module

A module, usually pure, that is the only module accessible from the outside – it constitutes API of a service.
For modules that are intended to be shared as API, developers often need to write a Facade module to protect internal APIs from unauthorized access, enforce business-invariants, etc.

## Effector Module

Effector Module has a reference to effects external to Marine Service, e.g. to a CLI, binary interface, HTTP client, etc.

Effector modules have a special section in their config that describes binary imports, socket imports, or similar things.

## Mounted Binary

Mounted Binary is a special interface that provides a module with the capability to call any external binary with the provided set of arguments and obtain a result of this call. It makes it possible to integrate almost any other software (such as IPFS, Ceramic, and databases) in the Fluence ecosystem.

## Particle

Particle is a network package that forms a single-use software-defined network (SDN) for a single request of a single AIR script.

Particle contains an immutable header (with an AIR script and some metadata, including the initiator's signature) and a mutable body (results of service calls triggered by the script execution, along with the signatures of involved peers).

Particle data has a CRDT-like format to handle fork-join behavior when the same Particle is sent to several different destinations in parallel, and then is observed on third peer in different states. In this case, data converges in deterministic way.

## Particle File Vault

Particle File Vault is a temporary folder that is created on the Peer for every incoming Particle and removed when the particle expires. All the services within this Peer have access to this folder.

Particle File Vault is expected to be used to pass data between services in a single AIR script, making them more composable and avoiding revealing this data to other Peers involved into this Particle's single-use coordination network, which could happen if it is returned as a plain text.

## Provider Access Token (PAT)

Provider Access Token
Evidence that a Provider put up the Collateral to join a Deal that stored and verified on-chain.

## PAT Envelope (PATE)

A PAT with a Merkle proof of a blockchain state that allows checking that the given PAT is a part of this Deal on a target block hash. Required for non-interactive checking of PAT validity.

## Peer Deal Token (PDT)

PATE used by Provider to authorize a particular Peer to serve the Deal. Proves that this particular peer is a legitimate member of the Deal's Subnetwork, can handle the load, has stake as a collateral on-chain, will be rewarded for the job done.

## Pi-calculus

Pi-calculus, π-calculus, process calculus is an extension of lambda calculus that takes parallel execution of processes.

The AIR and AquaVM execution model is built on top of the fundamental principles of pi-calculus, which serves as the foundation layer for these technologies.

## Peer

A Fluence Peer is the result of implementing the Fluence protocol to host and execute general purpose compute functions to provide users with a serverless experience. 

Fluence reference peers are comprised of the following components:
- Libp2p to manage connection pool
- A pool of AquaVM processes to handle Particles
- A pool of Marine services ready to be called from these Particles
- A scheduler for Spells
- A pool of Workers to logically isolate Marine services and Spells to avoid interference

Fluence peers are identified by Peer ID which is derived from the Peer's Public Key.

## Provider

Provider is an agent that operates Peers in the network identified by a public key, holding private key to sign blockchain transactions when entering Deals. Provider generates PATs, fetches PATEs from PATs, uses them to issue PDTs for Peers and therefore to assign them to Deals.

## Relay

Relay is a Host that a Client is connected to, or a Host that a Worker resides on. Workers and Clients are Peers not involved into Kademlia discovery. To send or receive a Particle, they are assisted by a Relay.

To execute code on a peer that's behind a Relay, use `on peer via relay:` construct in Aqua.

## Registry

Registry is a part of the Fluence protocol – a purpose-built [Distributed Hash Table (DHT)](https://en.wikipedia.org/wiki/Distributed_hash_table), designed for service discovery: to find a path to Peer(s) providing a particular service, without knowing these Peer’s IDs in advance.

 - Registry Key is derived from a public key of the owner, and an arbitrary label
 - Registry Record holds a Peer ID with optional Relay ID and Service ID, so that it can be used as a location of a particular piece of code on a particular Peer

Registry can be used to make a Client discoverable on the network, as well as for Subnetworks formation.

## Rust Peer

Rust Peer is the reference implementation of Fluence Peer.

It is used as a Relay for Fluence Clients and as a Host for Workers.

## Service

Service is a virtual construct combining Wasm modules and linking instructions into a discoverable resource.

Service:
- Can be called from Aqua
- May be a Marine service, in this case it's a set of modules linked together
- May be implemented as a Peer native functionality, see Builtins as an example. This includes JavaScript callbacks provided to Fluence JS Client

Service is identified by a Service ID that's bound to the Peer ID that provides this service.

Service exposes one or more functions. So finally to call a function developer needs to provide peer id, service id, and function name.

Service function calls within the Fluence protocol are possible only via AIR instructions – from developer perspective, it means using Aqua language and Fluence CLI or another Client.

## Subnetwork

A Subnetwork is a virtual partition (overlay) of the Fluence p2p network defined by the terms and life of a Deal and accessed and managed with Aqua. The behavior of a Subnetwork is defined by the set of Workers specified by the  Deal.  

Subnetworks are an integral part of the Fluence protocol and offer additional qualities, like fault tolerance or read consensus. That depends on the Aqua code that is deployed on the Subnet Workers to maintain emergent qualities, and on the Aqua code that is used to work with the subnet.

To use Subnet, a developer needs to provide Deal ID and possibly some additional authorization information.

## Spell

Spell is an AIR script hosted on a Peer that is triggered periodically, similar to a cron job, or by an external event.

Spell has its own small KV store and a mailbox, that makes it very close to the Actor model.

## Tetraplet

Tetraplet is a data structure describing the origin of an argument to a function call. It contains four fields:

- `peer_id`
- `service_id`
- `function_name`
- `functor`

Tetraplets are the mean to check and enforce distributed security invariants of a function by putting restrictions on its arguments, e.g.: the argument “is_authorized” must be provided by a function “check_auth” from “security” service run on the same Peer. Read more about Security Tetraplets [here](/docs/build/security.md).

## TrustGraph

TrustGraph is a part of the Fluence protocol. It is a Builtin service that stores and operates relationships between public keys, secured by signatures. Paths in this graph can be used for authorization on service or function level, as well as for network spam protection.

## Worker

> Worker is a part of Peer's resources that, together with other Workers, constitutes a Subnet, handles the Deal, and isolates some resources. It has:
- Its own keypair and Peer ID
- One or more deployed Spells
- Zero or more deployed Services

Workers are deployed and removed as a whole. Services of a single worker may share some resources like filesystem access, etc.

## [Webassembly](https://webassembly.org/) (Wasm)

Webassembly is a binary instruction format for a stack-based virtual machine. Wasm is intended to provide a memory-safe, sandboxed execution environment with a flexible set of settings, such as memory size and allowed imports. There are a lot of languages (Rust, C/C++, tinyGo) that support Wasm as a compilation target. 

Fluence provides an SDK for Rust but supports any compiled Wasm module following [particular conventions](/docs/marine-book/marine-rust-sdk/module-abi.md).

## Webassembly IT

Webassembly Interface Types (Wasm IT, WIT) is a part of the Component model proposal that allows using complex types, like strings, structs, enums and arrays, in the Wasm modules API.

## [WASI](https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-intro.md)

WASI stands for WebAssembly System Interface. It's an API that provides access to several OS-like features defining a standardized set of POSIX-like imports to access the OS. It has integrated capability-based security, extending WebAssembly's characteristic sandboxing to include I/O.