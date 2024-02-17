# Glossary

## General terms

### Fluence Network

Fluence network is an open, permissionless network of [Fluence protocol](#fluence-protocol)-compliant [Peer](#peer)s. You can use it to make [Deployments](#cloudless-deployment), execute and choreograph [Cloudless Functions](#cloudless-function) to perform your computations.

- `kras` is the main Fluence Network
- `dar` is the non-incentivized test network that is expected to follow exactly the same protocol as `kras`

### Fluence Protocol

Fluence Protocol is an open, off-chain protocol that [matches](#matching) resource [provider](#provider)s and consumers to enable secure, verifiable decentralized serverless [compute](#compute). The protocol is defined by a set of behaviors of [Peer](#peer)s, on top of Libp2p and [Aquamarine](#aquamarine), that enables emergent abilities of the [Fluence network](#fluence-network): to resolve, serve, execute and verify [Cloudless Functions](#cloudless-function).

### Fluence Blockchain

Fluence Blockchain is a L2/L3 application-specific EVM-compatible blockchain dedicated to the [Compute Marketplace](#compute-marketplace), which includes both [Deployments](#cloudless-deployment) and [Capacity Commitments](#capacity-commitment). As of now, Fluence Blockchain is bridged with Filecoin and Ethereum Mainnet.

### Fluence CLI

Fluence CLI is the main entry point into [Fluence App](#fluence-app) lifecycle: 
 - Develop or reuse [Compute Functions](#compute-function)s
 - Develop or reuse distributed [Cloudless Functions](#cloudless-function) to run in the [Fluence Network](#fluence-network)
 - Configure [Cloudless Scheduler](#cloudless-scheduler) to run [Cloudless Functions](#cloudless-function)
 - Prepare [Cloudless Distributive](#cloudless-distributive)
 - Using [Compute Marketplace](#compute-marketplace), make a [Cloudless Deployment](#cloudless-deployment)
 - Run, use, upgrade, your [Fluence App](#fluence-app)

### Fluence App

Fluence App is the actual end-user application that includes [Cloudless Deployment](#cloudless-deployment) but may also embrace a [Gateway](#gateway) to call Cloudless Functions from HTTP endpoints, DApp with event listeners, browser application and other integration.

### Fluence JS Client

A JS library that enables full-fledged, bi-direction interactions between JS applications (both node.js and browser-based, Electron.js is also an option) and [Fluence Network](#fluence-network). 

Fluence JS [Client](#client-peer) is embedded into [Fluence CLI](#fluence-cli).

### Cloudless Function

Cloudless Function is a piece of useful [compute](#compute) work defined by developer. It contains one or more [Compute Function](#compute-function) calls, and an [Aqua](#aqua) script that orchestrates it – connects outputs and inputs, denotes parallelism and defines success and failure.

With help of Aqua, developer may choose redundancy and fault-tolerance policies for their Cloudless Functions, incur parallelism across different machines, pass data from peer to peer, and many more.

### Cloudless Deployment

Cloudless Deployment is [Compute Functions](#compute-function) and [Scheduled Cloudless](#cloudless-scheduler) Functions configured, deployed and ready for use. It is derived from [Cloudless Distributive](#cloudless-distributive), managed with a [Deal](#deal), running on [Workers](#worker).

### Cloudless Distributive

Prototype for a [Cloudless Deployment](#cloudless-deployment). Includes:

- [Worker Definition](#worker-definition), that consists of:
    - [Compute Functions](#compute-function) binary sources (in form of [WASM](#webassembly-wasm) [modules](#marine-module) for [Marine Services](#marine-service), and respective resources and [module linking](#module-linking) configuration)
    - [Scheduled Cloudless](#cloudless-scheduler) [Functions](#cloudless-function) (in form of compiled [AIR](#air) files), with triggers config
- [Cloudless Deployment](#cloudless-deployment) configuration (needed resources such as [effectors](#effector-module), replication factor – desired size of a [Subnet](#subnet))

Cloudless Distributive is structured with IPLD and uploaded to the storage for future CID-addressable use.

### Cloudless Scheduler

Cloudless Scheduler triggers a [Cloudless Function](#cloudless-function) without [client](#client-peer) interaction, based on events. Implemented as a part of [Cloudless Deployment](#cloudless-deployment). See [Spells](#spell) for low level details.

Kinds of triggers that the Scheduler is capable to handle:
- time-based, such as cronjobs
- event-based, such as chain events

### Proofs

[Fluence Protocol](#fluence-protocol) enables a set of Proofs that drives its economy model.

#### Proof of Capacity

Proof that a compute [peer](#peer) ([Host](#host)) has certain capacity allocated and available for [Cloudless Deployments](#cloudless-deployment). Every [Host](#host) must provide Proofs of Capacity in order to participate in [Deployments](#cloudless-deployment).

Conducted by [Capacity Commitments Prover (CCP)](#capacity-commitment-prover).

#### Proof of Processing

Proof that a [Cloudless Function](#cloudless-function) was executed as described – in a distributed manner.

Conducted and checked by [AquaVM](#aquavm) during execution on every step.

See [Golden Particles](#golden-particle) to learn more about Proof of Processing use for payments.

#### Proof of Execution

Proof of [Compute Function](#compute-function) – a single function execution that runs on a [Peer](#peer), verifies that computation was done correctly.

PoE is pluggable, so that different workloads can benefit from decentralization of compute. The options might include:
- zk
- TEE
- Verification of cryptographic function execution for MPC
- Repetition for [pure](#pure-module) code
- Consensus for external [effects](#effect), [Managed Effects](#managed-effects)
- and more

## Distributed

### AIR

Aqua Intermediate Representation (AIR) results from compiling your [Aqua](#Aqua) scripts. AIR is used by the [AquaVM](#aquavm)s deployed on [Fluence Peer](#Peer)s to execute the workflows and [Compute Function](#compute-function) compositions specified in your Aqua scripts.
AIR contains a very limited set of instructions, like `(seq A B)` or `(par A B)` for control flow, and `(call peerId (serviceId functionName) [...args] exportVariable)` to execute compute operations using [Marine](#marine) services or [Peer](#Peer) API.

### Aqua

Aqua is the Fluence’s language for choreography and orchestration of distributed [Cloudless Functions](#cloudless-function).
Aqua describes distributed control flow in developer-friendly terms, and delegates computations to [Compute Function](#compute-function)s on particular [Peer](#Peer)s.
Aqua follows [structural typing](https://en.wikipedia.org/wiki/Structural_type_system) paradigm to simplify composition and reuse of different libraries and [Cloudless Functions](#cloudless-function). Read more in [Aqua Book](/docs/aqua-book/introduction.md).

### AquaVM

Interprets [Aqua IR](#air) to orchestrate local function calls or conduct choreography of the [Cloudless Function](#cloudless-function). Checks and provides all the Cloudless Function [proofs](#proof-of-processing).

AquaVM is a State Machine that takes a [Particle](#particle) received by a particular [Peer](#peer), interprets an [AIR](#air) script of this [Particle](#particle) along with the [Particle Data](#particle-data), and gives the [Peer](#peer) a set of commands: what [Compute Function](#compute-function)s to call locally (if any), to what [Peer](#peer)s to send this [Particle](#particle) to (if any), and how the [Particle Data](#particle-data) should be updated (if should).

AquaVM takes its place for [Proof of Processing](#proof-of-processing), running on-chain to verify the [Particle](#particle), identify [Deal](#deal)s involved, and distribute the rewards.

### Aquamarine

Aquamarine is a technology stack that enables the off-chain [Fluence Protocol](#fluence-protocol): [Aqua](#Aqua) with [AIR](#air) and [AquaVM](#aquavm), and [Marine](#marine). In other words, Aquamarine is Fluence without incentives and [system services](#system-services).

### Particle

Particle is a network package that forms a single-use software-defined network (SDN) for a single request of a single [AIR](#air) script.

Particle contains an immutable header (with an [AIR](#air) script and some metadata, including the [initiator](#init-peer)'s signature) and a [mutable body](#particle-data) (results of [compute function](#compute-function) calls triggered by the script execution, along with the signatures of involved [Peer](#peer)s).

### Particle Data

Particle data is an audit log of the distributed execution flow of a Particle;
a mutable part of the [Particle](#particle) that contains [Compute Function](#compute-function) responses and [Peer](#peer) signatures.

Particle data has a CRDT-like format to handle fork-join behavior when the same [Particle](#particle) is sent to several different destinations in parallel, and then is observed on third [Peer](#peer) in different states. In this case, data converges in deterministic way.

### Pi-calculus

Pi-calculus, π-calculus, process calculus is an extension of lambda calculus that takes parallel execution of processes.

The [AIR](#air) and [AquaVM](#aquavm) execution model is built on top of the fundamental principles of pi-calculus, which serves as the foundation layer for these technologies.

### Spell

Spell is a single-peer representation of [Cloudless Deployment](#cloudless-deployment) used for [Cloudless Scheduler](#cloudless-scheduler). It consists of a special [Marine Service](#marine-service) and an [AIR](#air) script.

Spell script is executed periodically or based on event to run a predefined [Cloudless Functions](#cloudless-function).

> TODO: See Spell docs here.

## Compute

### Nox

Nox is the reference implementation of a full-fledged [Fluence Protocol](#fluence-protocol)-compliant [Peer](#peer) capable to serve [Cloudless Deployments](#cloudless-deployment). Nox serves as a [Host](#host) for many [Workers](#worker), each Worker devoted to a distinct Deployment. Read more below.

#### System Services

[Marine Services](#marine-service) that are required for a [Fluence Peer](#peer) to operate according to the [Fluence Protocol](#fluence-protocol), e.g. resolve [Subnets](#subnet), make [Deployments](#deployment), maintain [Workers](#worker).

Part of [Nox](#nox).

#### Builtin Services

Low-level [Compute Function](#compute-function)s made in peer’s native language (in case of [Nox](#nox), Rust), required to serve [Aqua](#aqua) properly. Includes math and string operations, etc. See more in [aqua-lib](https://github.com/fluencelabs/aqua-lib) repo.

### Marine

Marine is a general purpose Wasm runtime intended to execute [Compute Functions](#compute-function) in form of linked [Wasm](#webassembly-wasm) [Module](#marine-module)s (aka [Services](#marine-service)) on some [Peer](#peer).

It is the main way to express computations in the [Fluence Protocol](#fluence-protocol).

Developers have three ways to define computations:
 - Write and use [Marine module](#marine-module)s to build a [Service](#marine-service) from them
 - Write and use Marine [effector module](#effector-module)s to access an external [effect](#effect), e.g. [binary](#mounted-binary) or API
 - Implement computations in Fluence [Peer](#peer)'s native language – cannot be a part of [Cloudless Deployment](#cloudless-deployment)
 
With Marine, computations are portable and safe for the [Provider](#provider).

#### Marine Service

Service is a virtual construct combining one or more [linked](#module-linking) [Marine modules](#marine-module), one of them being a [Facade Module](#facade-module) and exposing one or more [Compute Function](#compute-function)s via [Webassembly IT](#webassembly-it).

Service:
- Can be called from [Aqua](#Aqua) as a part of [Cloudless Function](#cloudless-function)
- May be a Marine service, in this case it's a set of [Module](#marine-module)s linked together
- May be implemented as a [Peer](#peer) native functionality, see [Builtins](#builtins) as an example. This includes JavaScript callbacks provided to [Fluence JS Client](#fluence-js-client)

Service is identified by a Service ID that's bound to the Peer ID that provides this service.

Service exposes one or more [Compute Function](#compute-function)s. So finally to call a function developer needs to provide [peer id](#peerid), service id, and function name.

Service function calls within the [Fluence protocol](#fluence-protocol) are possible only via [AIR](#air) instructions – from developer perspective, it means using [Aqua](#Aqua) language and [Fluence CLI](#fluence-cli) or another [Client](#client-peer).

#### Marine SDK

[Marine SDK](/docs/marine-book/marine-rust-sdk/) is a set of tools that help developers write and compile Rust code as [Marine](#marine) [module](#marine-module)s and [Service](#marine-service)s.

#### Marine JS

Implementation of [Marine](#marine) running on JS, includes [Marine SDK](#marine-sdk) support and [Module Linking](#module-linking). [Marine Modules](#marine-module), [Pure](#pure-module) ones, can run in any Marine setup.

#### Marine Module

Marine Module is a single .wasm file compiled with [Wasm IT](#webassembly-it) support, e.g., using Rust language with [Marine SDK](#marine-sdk).

#### Module Linking

Modules can use each other using shared nothing linking scheme.

#### Pure Module

[Module](#marine-module) with no external [effects](#effect) (including [WASI](#wasi)) that takes only inputs and maybe an internal sandboxed state, produces new state and outputs. May have import declarations of other modules – for [Module Linking](#module-linking).

#### Wasi Module

A [Marine Module](#marine-module) that uses basic [WASI](#wasi) effects such as access to time and file system.

#### Facade Module

A [Module](#facade-module), that is the only module accessible from the outside – it constitutes API of a [Service](#marine-service), a set of [Compute Function](#compute-function) declarations.

For modules that are intended to be shared as API, developers often need to write a Facade module to protect internal APIs from unauthorized access, enforce business-invariants, etc.

#### Webassembly (Wasm)

[Webassembly](https://webassembly.org/) is a binary instruction format for a stack-based virtual machine. Wasm is intended to provide a memory-safe, sandboxed execution environment with a flexible set of settings, such as memory size and allowed imports. There are a lot of languages (Rust, C/C++, tinyGo) that support Wasm as a compilation target. 

Fluence provides an [SDK for Rust](#marine-sdk), but supports any compiled Wasm module following [particular conventions](/docs/marine-book/marine-rust-sdk/module-abi.md).

#### Webassembly IT

Webassembly Interface Types (Wasm IT, WIT) is a part of the Component model proposal that allows using complex types, like strings, structs, enums and arrays, in the Wasm modules API.

#### WASI

[WASI](https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-intro.md) stands for WebAssembly System Interface. It's an API that provides access to several OS-like features defining a standardized set of POSIX-like imports to access the OS. It has integrated capability-based security, extending WebAssembly's characteristic sandboxing to include I/O.

### Managed Effects

Managed Effects is an approach to solve a problem:

- Compute without effects is useless
- Compute with effects might be dangerous

With Managed Effects, every [effect](#effect) is accessed only with an [Effector Module](#effector-module). Effector Module is audited by the community to check that its API is useful for developers, and its effects are safe for [Compute Providers](#provider).

Compute Providers whitelist only the known Effector Modules and forbid effects in any other module. If Effector Module requires Provider to have certain capabilities, e.g. locally deployed service, an installed binary, etc., Provider has to take care of that.

Developer can access this effect safely using [Module Linking](#module-linking).

#### Effector Module

A [Marine Module](#marine-module) that implements [Managed Effects](#managed-effects) approach, providing access to an [Effect](#effect) in a safe and useful way. Effector is what developer can use via [Module Linking](#module-linking).

Effector modules have a special section in their config that describes binary imports, socket imports, or similar things.

#### Effect

What [Effector Module](#effector-module) actually executes on the host system, external to [Marine](#marine). Examples: curl, ipfs, websocket.

#### Mounted Binary

Mounted Binary is a special interface that provides an [effector module](#effector-module) with the capability to call any external binary with the provided set of arguments and obtain a result of this call. It makes it possible to integrate almost any other software (such as IPFS, Ceramic, and databases) in the Fluence ecosystem.

### Particle File Vault

Particle File Vault is a temporary folder that is created on the [Peer](#peer) for every incoming [Particle](#particle) and removed when the [Particle](#particle) expires. All the services within this [Peer](#peer) have access to this folder.

Particle File Vault is expected to be used to pass data between [Compute Function](#compute-function)s (distributed in the form of [Marine Service](#marine-service)s) within a single [AIR](#air) script, making them more composable and avoiding revealing this data to other [Peer](#peer)s involved into this [Particle](#particle)'s execution, which could happen if the data is returned as a plain text.

### Compute Function

A single computational action executed on a single peer. [Marine Service](#marine-service)s is the default and preferred way to deliver [Compute Function](#compute-function)s. Other options are [builtins](#builtin-services), and native code – e.g. Javascript callbacks for [JS client](#fluence-js-client).

### Compute Unit

Smallest divisible compute capacity [provider](#provider)s allocate and stake to the [Marketplace](#compute-marketplace) and available to allocate to a [Worker](#worker). Proved by [Proof of Capacity](#proof-of-capacity) as a part of [Capacity Commitment](#capacity-commitment). Every Worker has exactly this amount of resources.

### Tetraplet

Tetraplet is a data structure describing the origin of an argument to a function call. It contains four fields:

- `peer_id`
- `service_id`
- `function_name`
- `functor`

Tetraplets are the mean to check and enforce distributed security invariants of a function by putting restrictions on its arguments, e.g.: the argument “is_authorized” must be provided by a function “check_auth” from “security” [Compute Function](#compute-function) run on the same [Peer](#peer). Both [Marine SDK](#marine-sdk) and [Fluence JS Client](#fluence-js-client) provides access to tetraplets.

Read more about Security Tetraplets [here](/docs/build-mvm/security.md).

## Network

### Peer

A participant of the Fluence Protocol identified with Peer ID.

> TODO

A Fluence Peer is the result of implementing the [Fluence protocol](#fluence-protocol) to host and execute general purpose compute functions to provide users with a serverless experience. 

Fluence reference peers are comprised of the following components:
- Libp2p to manage connection pool
- A pool of [AquaVM](#aquavm) processes to handle [Particle](#particle)s
- A pool of Marine [Service](#service)s ready to be called from these [Particle](#particle)s
- A scheduler for [Spell](#spell)s
- A pool of [Worker](#worker)s to logically isolate Marine [Service](#service)s and [Spell](#spell)s to avoid interference

Fluence peers are identified by Peer ID which is derived from the Peer's Public Key.

### PeerId

Logical address of a segregated cloudless functions execution environment. Derived from a private key, can be used to verify Peer’s signatures which is a part of Proof of Processing verified by AquaVM on every step of Cloudless Function.

### Host

A Fluence Peer that participates in the Fluence’s Kademlia network. Nox is the reference implementation.

Hosts are capable to act as Relays for Workers and Clients.

> TODO

Host is the closest full-featured (neither a [Client](#client-peer), nor a [Worker](#worker)) Fluence [Peer](#peer).

[Host Peer ID](/docs/aqua-book/language/topology.md#host_peer_id) can always be accessed from [Aqua](#Aqua).

### Deployment

#### Worker

A single instance of a Cloudless Deployment: Compute Unit allocated for Cloudless Functions in form of Marine Services and Cloudless Scheduler in form of Spells.

So Cloudless Deployment is one or many Workers, each having the same code installed.

> TODO

Worker is a part of [Peer](#peer)'s resources that, together with other Workers, constitutes a Subnet, handles the [Deal](#deal), and isolates some resources. It has:
- Its own keypair and Peer ID
- One or more deployed [Spell](#spell)s
- Zero or more deployed [Service](#service)s

Workers are deployed and removed as a whole. [Service](#service)s of a single worker may share some resources like filesystem access, etc.

#### Worker Definition

Services and spells of a worker, used to bake a single worker. Part of Cloudless Distribution – Deal.

#### Subnet

Interconnected set of all Workers of a single Cloudless Deployment, that can be used in runtime for redundancy, durability, fault tolerance, load balancing and better security of Cloudless Functions.

> TODO

A Subnetwork is a virtual partition (overlay) of the [Fluence p2p network](#fluence-network) defined by the terms and life of a Deal and accessed and managed with [Aqua](#Aqua). The behavior of a Subnetwork is defined by the set of [Worker](#worker)s specified by the [Deal](#deal).  

Subnetworks are an integral part of the [Fluence protocol](#fluence-protocol) and offer additional qualities, like fault tolerance or read consensus. That depends on the [Aqua](#Aqua) code that is deployed on the Subnet [Worker](#worker)s to maintain emergent qualities, and on the [Aqua](#Aqua) code that is used to work with the subnet.

To use Subnet, a developer needs to provide the [Deal](#deal) ID and possibly some additional authorization information.

#### Gateway

A HTTP-facing Fluence Peer that is capable of running Cloudless Functions based on incoming requests. See this repo for more.


### Init Peer

The Peer that initiates a Cloudless Function – creates a Particle and sends it over Fluence Protocol.

> TODO

The [Peer](#peer)eer that takes initiative to create a brand new [Particle](#particle) with a particular [AIR](#air) script in it, and begin its execution. Init Peer provides a signature for the initial [Particle](#particle) structure.

[Init Peer ID](/docs/aqua-book/language/topology.md#init_peer_id) can always be accessed from [Aqua](#Aqua).

### Client (peer)

A Fluence Peer connected to a Relay, but not participating in the Fluence Kademlia network – so not a Host. Most likely a Fluence JS Client (browser, CLI).

> TODO

Client peer is a [Peer](#peer) that might be not publicly accessible to the rest of the [network](#fluence-network) without a Relay, and is not advertised to the Kademlia network – e.g., a Fluence [Peer](#peer) running inside a Web Browser, or a [Worker](#worker). Clients might be represented by short-living [Peer](#peer)s implementing just request-response or even fire-and-forget behavior. Clients might not offer full capabilities of the Fluence protocol, e.g. they don't route requests to Kademlia or [Subnetwork](#subnetwork)s, don't enter [Deal](#deal)s, etc.

### Relay

A Fluence Peer, a Host, that participates in Cloudless Functions by providing its advanced connectivity capabilities, which includes:

- Ability of a Host to send messages internally to hosted Workers
- Ability of a Host to send messages to connected Client Peers

> TODO

Relay is a [Host](#host) that a [Client](#client-peer) is connected to, or a [Host](#host) that a [Worker](#worker) resides on. [Worker](#worker)s and [Client](#client-peer)s are [Peer](#peer)s not involved into Kademlia discovery. To send or receive a [Particle](#particle), they are assisted by a Relay.

To execute code on a [Peer](#peer) that's behind a Relay, [use `on peer via relay:` construct](/docs/aqua-book/language/topology#accessing-peers-via-other-peers) in [Aqua](#Aqua).

## Compute Marketplace

Compute Marketplace is a set of smart contracts on the Fluence IPC Subnet where developers put Deals, Matching happens, resulting in Cloudless Deployment to occur off-chain.

The Fluence marketplace is an on-chain institution comprised of a set of smart contracts that maintains provider offers to sell compute capacity, accepts developer offers to purchase compute capacity and attempts to match developer offers with suitable provider offers in a trustless manner. A successful match results in a Deal.

### Deal

Requirements of a Cloudless Deployment represented on IPC Subnet.

A Deal governs capacity supply and demand among providers and developers over a set of attributes including capacity pricing and deal duration. Deals are the result of the IPC marketplace matching provider and developer offers. Moreover, Deals contain the immutable reference data that specify (define?) off-chain subnetworks in terms of topology, duration and application (function?) homogeneity (type?) and provide the event data necessary for providers to host the developer’s compute artifacts ready for invocation. Hence, a Deal is the necessary condition for the trustless provisioning, execution and billing of Fluence Cloudless Compute.

> TODO

Deal is a description of a job that a customer is willing to run on the [Fluence network](#fluence-network). It contains a Content Identifier (CID) that points to [Service](#service)s and [Spell](#spell)s expected to run as the Deal Subnet [Worker](#worker)s. Moreover, Deal describes payment options, desired Subnet size, and the [effector module](#effector-module)(s) required for [Peer](#peer)s to join the Deal.

To join the Deal, a [PAT](#provider-access-token-pat) must be created by [Provider](#provider).

### Provider

An organization that participates in the Fluence Protocol by providing hardware resources for use.

The Fluence protocol is open and permissionless and open to all providers. In order to be able to participate in capacity rewards, a provider needs to have delegated stake for their capacity commitments and generate Proofs of Capacity.

> TODO

Provider is an agent that operates [Peer](#peer)s in the [network](#fluence-network) identified by a public key, holding private key to sign blockchain transactions when entering [Deal](#deal)s. Provider generates [PAT](#provider-access-token-pat)s, fetches [PATE](#pat-envelope-pate)s from [PAT](#provider-access-token-pat)s, uses them to issue [PDT](#peer-deal-token-pdt)s for Peers and therefore to assign them to [Deal](#deal)s.

### Matching

The process of mapping a Deal with its requirements and Offers with its capabilities, resulting in Workers allocation on particular Hosts.

### Offer

Market Offer is a description of capabilities. Offer must present a Capacity Commitment and send Proofs of Capacity to participate in the Matching process, so only PoC providers are eligible to provide capacity to the network, staking is not enough.

#### Provider Offer

A provider offer includes the CU capacity, provider metadata, such as data center attributes, desired revenue, etc. for hosting a developer’s Cloudless Distributive.

#### Developer Offer

The developer’s Cloudless Distributive combined with their capacity selection criteria, such as payment offer, data center type, duration, payment offer, etc., and an (USDC) escrow payment

> TODO

The description, capabilities and expected payment for a developer’s deployment plan. In order to be able to register an offer with the marketplace, the developer needs to escrow their payment.

### Capacity Commitment

A provider’s capacity commitment to the network backed by Proofs Of Capacity and eligible for capacity rewards.

A provider can seamlessly switch their resource allocation between Proof of Capacity and fulfilling Deals.

### Capacity Commitment Prover

> TODO

A process that makes Capacity Commitments. Made for Providers.

A piece of software augmenting each Nox peer tasked with generating Proofs of Capacity for that/Nox’s (?) hardware zone.

### Golden Particle

> TODO