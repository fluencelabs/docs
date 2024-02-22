# Glossary

## General terms

### Fluence Network

Fluence network is an open, permissionless network of [Fluence protocol](#fluence-protocol)-compliant [Peer](#peer)s. You can use it to make [Deployments](#cloudless-deployment), execute and choreograph [Cloudless Functions](#cloudless-function) to perform your computations.

- `kras` is the main Fluence Network
- `dar` is the non-incentivized test network that is expected to follow exactly the same protocol as `kras`

### Fluence Protocol

Fluence Protocol is an open, off-chain protocol that [matches](#matching) resource [provider](#provider)s and consumers to enable secure, verifiable decentralized serverless [compute](#compute). The protocol is defined by a set of behaviors of [Peer](#peer)s, on top of Libp2p and [Aquamarine](#aquamarine), that enables emergent abilities of the [Fluence network](#fluence-network): to resolve, serve, execute and verify [Cloudless Functions](#cloudless-function).

### Fluence Blockchain

Fluence Blockchain is a L2/L3 application-specific EVM-compatible blockchain dedicated to the [Compute Marketplace](#compute-marketplace), which includes both [Deployments](#cloudless-deployment) and [Capacity Commitments](#capacity-commitment). As of now, Fluence Blockchain is bridged with Filecoin and Ethereum Mainnets.

### Fluence CLI

Fluence CLI is the main entry point into a [Fluence App](#fluence-app) lifecycle: 
 - Develop or reuse [Compute Function](#compute-function)s
 - Develop or reuse distributed [Cloudless Functions](#cloudless-function) to run in the [Fluence Network](#fluence-network)
 - Configure [Cloudless Scheduler](#cloudless-scheduler) to run [Cloudless Functions](#cloudless-function)
 - Prepare [Cloudless Distributive](#cloudless-distributive)
 - Use [Compute Marketplace](#compute-marketplace), make a [Cloudless Deployment](#cloudless-deployment)
 - Run, use and upgrade your [Fluence App](#fluence-app)

### Fluence App

Fluence App is the actual end-user application that includes [Cloudless Deployment](#cloudless-deployment) but may be paired with a [Gateway](#gateway) to call Cloudless Functions from HTTP endpoints and enable HTTP event listeners, browser application and other integration.

### Fluence JS Client

A JS library that enables full-fledged, bi-directional interactions between JS applications (both node.js and browser-based, Electron.js is also an option) and [Fluence Network](#fluence-network). 

Fluence JS [Client](#client-peer) is embedded into [Fluence CLI](#fluence-cli).

### Cloudless Function

Cloudless Function is a piece of useful [compute](#compute) work defined by developer. It contains one or more [Compute Function](#compute-function)s and an [Aqua](#aqua) script to orchestrate them by connecting outputs and inputs, denoting parallelism and defining success and failure.

With the help of Aqua, a developer can implement redundancy and fault-tolerance policies for their Cloudless Functions, facilitate parallelism across different machines, pass data from peer to peer, and much more.

### Cloudless Deployment

Cloudless Deployment is a [Compute Function](#compute-function) and/or [Cloudless Scheduler](#cloudless-scheduler) configured, deployed and ready for use. It is an instantiated [Cloudless Distributive](#cloudless-distributive), managed by a [Deal](#deal), and running on [Workers](#worker).

### Cloudless Distributive

Prototype for a [Cloudless Deployment](#cloudless-deployment). Includes:

- [Worker Definition](#worker-definition), that consists of:
    - [Compute Functions](#compute-function) binary sources (in form of [WASM](#webassembly-wasm) [modules](#marine-module) for [Marine Services](#marine-service), and respective resources and [module linking](#module-linking) configuration)
    - [Cloudless Scheduler](#cloudless-scheduler) for [Cloudless Functions](#cloudless-function) (in form of compiled [AIR](#air) files), with trigger configuration
- [Cloudless Deployment](#cloudless-deployment) configuration and required resources, such as [effectors](#effector-module) or replication factor, i.e., the desired size and provider diversity of a [Subnet](#subnet).

Cloudless Distributive is structured with [IPLD](https://ipld.io/) resulting in a unique [CID](https://docs.ipfs.tech/concepts/content-addressing/) and uploaded to network storage for future content-addressable retrieval. 

### Cloudless Scheduler

Cloudless Scheduler triggers a [Cloudless Function](#cloudless-function) without [client](#client-peer) interaction, based on events. Implemented as a part of [Cloudless Deployment](#cloudless-deployment). See [Spells](#spell) for low level details.

Trigger types a Scheduler is capable to handle:
- time-based, such as cronjobs
- event-based, such as chain events

### Proofs

[Fluence Protocol](#fluence-protocol) enables a set of Proofs that drives its cryptonomic model.

#### Proof of Capacity

Proof that a compute [peer](#peer) ([Host](#host)) has certain capacity allocated and available for [Cloudless Deployments](#cloudless-deployment). Every [Host](#host) must provide Proofs of Capacity in order to participate in [Deployments](#cloudless-deployment).

Proofs generation is managed by the [Capacity Commitment Prover (CCP)](#capacity-commitment-prover).

#### Proof of Processing

Proof that a [Cloudless Function](#cloudless-function) was executed as described – in a distributed manner.

Conducted and checked by [AquaVM](#aquavm) during execution on every step.

See [Golden Particles](#golden-particle) to learn more about the use of Proof of Processing to facilitate verifiable deal settlement, i.e. payment for Cloudless Function executions.

#### Proof of Execution

Proof of [Compute Function](#compute-function): an attestation that a computation of a single function, running on a [Peer](#peer), was done correctly.

PoE is pluggable, so that different workloads can benefit from the decentralization of compute. The options might include:
- zero knowledge proofs (ZKP)
- Trusted Execution Environments (TEE)
- Verification of cryptographic function execution for MPC
- Repeated execution of [pure](#pure-module) code
- Consensus for external [effects](#effect), [Managed Effects](#managed-effects)
- and more

## Distributed

### AIR

Aqua Intermediate Representation (AIR) results from compiling your [Aqua](#Aqua) scripts. AIR is used by the [AquaVM](#aquavm)s deployed on [Fluence Peer](#Peer)s to execute the workflows and [Compute Function](#compute-function) compositions specified in your Aqua scripts.
AIR contains a very limited set of instructions, like `(seq A B)` or `(par A B)` for control flow, and `(call peerId (serviceId functionName) [...args] exportVariable)` to execute compute operations using [Marine](#marine) services or [Peer](#Peer) API.

### Aqua

Aqua is Fluence’s language, designed especially to program choreography of distributed [Cloudless Function](#cloudless-function)s and orchestration of local functions.
Aqua describes distributed control flow in developer-friendly terms, and delegates computations to [Compute Function](#compute-function)s on particular [Peer](#Peer)s.
Aqua follows the [structural typing](https://en.wikipedia.org/wiki/Structural_type_system) paradigm to simplify composition and reuse of different libraries and [Cloudless Functions](#cloudless-function). Read more in the [Aqua Book](/docs/aqua-book/introduction.md).

### AquaVM

Interprets [Aqua IR](#air) to orchestrate local function calls or choreograph [Cloudless Function](#cloudless-function)s. Checks and provides all the Cloudless Function [proofs](#proof-of-processing).

AquaVM is a State Machine that takes a [Particle](#particle) received by a particular [Peer](#peer), interprets an [AIR](#air) script of this [Particle](#particle) along with the [Particle Data](#particle-data), and gives the [Peer](#peer) a set of commands: what [Compute Function](#compute-function)s to call locally (if any), to what [Peer](#peer)s to send this [Particle](#particle) to (if any), and how the [Particle Data](#particle-data) should be updated (if should).

AquaVM enables [Proof of Processing](#proof-of-processing) by also running on-chain to verify [Particle](#particle)s, identify the [Deal](#deal)s involved, and distribute the rewards.

### Aquamarine

Aquamarine is a technology stack that enables the off-chain [Fluence Protocol](#fluence-protocol): [Aqua](#Aqua) with [AIR](#air) and [AquaVM](#aquavm), and [Marine](#marine). In other words, Aquamarine is Fluence without incentives and [system services](#system-services).

### Particle

A Particle is a network package that forms a single-use software-defined network (SDN) for a single request of a single [AIR](#air) script.

Every Particle contains an immutable header and a mutable body. The immutable header includes an [AIR](#air) script and some metadata including the [initiator](#init-peer)'s signature; the [mutable body](#particle-data) contains the results of [compute function](#compute-function) calls triggered by the script execution along with the signatures of involved [Peer](#peer)s.

### Particle Data

Particle data is an audit log of the distributed execution flow of a Particle;
the mutable part of the [Particle](#particle) that contains [Compute Function](#compute-function) responses and [Peer](#peer) signatures.

Particle data has a CRDT-like format capable to handle fork-join behavior resulting in response data converging in a (eventually) deterministic way. Fork-join behavior in Aqua arises when the same [Particle](#particle) is executed in parallel on one or more peers.

### Pi-calculus

[Pi-calculus](https://en.wikipedia.org/wiki/%CE%A0-calculus), aka π-calculus, is a [process calculus](https://en.wikipedia.org/wiki/Process_calculus) that is an extension of [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) that describes the parallel execution of processes for dynamic network configurations.

The [AIR](#air) and [AquaVM](#aquavm) execution model is built on fundamental principles of pi-calculus.

### Spell

A Spell is a single-peer representation of [Cloudless Deployment](#cloudless-deployment) used by the [Cloudless Scheduler](#cloudless-scheduler). It consists of a special [Marine Service](#marine-service) and an [AIR](#air) script.

A Spell script is executed periodically or based on an event to run a predefined [Cloudless Functions](#cloudless-function).

> TODO: See Spell docs here.

### Topology

Here: exact way the execution of Cloudless Function flows from Peer to Peer, including sequential transitions, fork/join convergent executions, and more.

Topology is expressed and handled with the help of [Aqua](#aqua).

## Compute

### Nox

Nox is the reference implementation of a fully [Fluence Protocol](#fluence-protocol)-compliant [Peer](#peer) capable to serve [Cloudless Deployments](#cloudless-deployment). Nox serves as a [Host](#host) for many [Workers](#worker), where each Worker is devoted to a distinct Deployment.

#### System Services

[Marine Services](#marine-service) that are required for a [Fluence Peer](#peer) to operate according to the [Fluence Protocol](#fluence-protocol), e.g. resolve [Subnets](#subnet), make [Deployments](#deployment), maintain [Workers](#worker).

Part of [Nox](#nox).

#### Builtin Services

Low-level [Compute Function](#compute-function)s implemented in a peer’s native language, ie. Rust for [Nox](#nox). Builtins allow the protocol-compliant execution of [Aqua](#aqua), such a math and string operators. See more in [aqua-lib](https://github.com/fluencelabs/aqua-lib) repo.

### Marine

Marine is a general purpose Wasm runtime, intended to execute [Compute Functions](#compute-function)s in form of linked [Wasm](#webassembly-wasm) [Module](#marine-module)s (aka [Services](#marine-service)) on a [Peer](#peer).

It is the main way to express computations in the [Fluence Protocol](#fluence-protocol).

Developers have three ways to define computations:
 - Write and use [Marine module](#marine-module)s to build a [Service](#marine-service)
 - Write and use Marine [effector module](#effector-module)s to access an external [effect](#effect), e.g. [binary](#mounted-binary) or API
 - Implement computations in Fluence [Peer](#peer)'s native language, which  **cannot** be a part of a [Cloudless Deployment](#cloudless-deployment)
 
With Marine, computations are portable and safe for the [Provider](#provider).

#### Marine Service

Service is a virtual construct combining one or more [linked](#module-linking) [Marine modules](#marine-module), one of them being a [Facade Module](#facade-module), and exposing one or more [Compute Function](#compute-function)s via [Webassembly IT](#webassembly-it).

Service:
- Can be called from [Aqua](#Aqua) as a part of [Cloudless Function](#cloudless-function)
- May be a Marine service, in this case it's a set of linked [Module](#marine-module)s 
- May be implemented as a [Peer](#peer) native functionality, see [Builtins](#builtin-services) as an example. This includes JavaScript callbacks provided to [Fluence JS Client](#fluence-js-client)

Service is identified by a Service ID that's bound to the Peer ID that provides this service.

Service exposes one or more [Compute Function](#compute-function)s and a developer needs to provide [peer id](#peerid), service id, and function name to invoke the function.

[AIR](#air) instructions is the only legitimate way in the [Fluence protocol](#fluence-protocol) to call a service function. For a developer, it entails using [Aqua](#Aqua) language and [Fluence CLI](#fluence-cli).

#### Marine SDK

[Marine SDK](/docs/marine-book/marine-rust-sdk/) is a set of tools that help developers write and compile Rust code as [Marine](#marine) [module](#marine-module)s and [Service](#marine-service)s.

#### Marine JS

Implementation of [Marine](#marine) running on JS. This  includes support for [Marine SDK](#marine-sdk) and [Module Linking](#module-linking). Only [Pure](#pure-module) [module](#marine-modules) can run in JS Marine.

#### Marine Module

Marine Module is a single .wasm file compiled with [Wasm IT](#webassembly-it) support, e.g., using Rust language with the [Marine SDK](#marine-sdk).

#### Module Linking

Modules can use each other using the shared nothing linking scheme.

#### Pure Module

[Module](#marine-module) with no external [effects](#effect) (including [WASI](#wasi)) that takes only inputs and maybe an internal sandboxed state, and produces new state and outputs. May have (foreign function) interface declarations for other modules via [Module Linking](#module-linking).

#### Wasi Module

A [Marine Module](#marine-module) that uses basic [WASI](#wasi) effects such as access to time and file system.

#### Facade Module

A [Module](#facade-module), that is the only module accessible from the outside – it constitutes the API of a [Service](#marine-service) exposing a set of [Compute Function](#compute-function) declarations.

For modules that are intended to be shared as an API, developers often need to write a Facade module to protect internal APIs from unauthorized access, enforce business-invariants, etc.

#### Webassembly (Wasm)

[Webassembly](https://webassembly.org/) is a binary instruction format for a stack-based virtual machine. Wasm is intended to provide a memory-safe, sandboxed execution environment with a flexible set of settings, such as memory size and allowed imports. Multiple languages, such as Rust, C/C++ or tinyGo, support the Wasm compile target. 

Fluence provides a [Rust SDK](#marine-sdk) but supports any compiled Wasm module following [the Module ABI conventions](/docs/marine-book/marine-rust-sdk/module-abi.md).

#### Webassembly IT

Webassembly Interface Types (Wasm IT, WIT) is a part of the Component model proposal that allows using complex types, like strings, structs, enums and arrays, in a Wasm module's API.

#### WASI

[WASI](https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-intro.md) stands for WebAssembly System Interface. It's an API that provides access to several OS-like features defining a standardized set of POSIX-like imports to access the OS. It has integrated capability-based security, extending WebAssembly's characteristic sandboxing to include I/O.

### Managed Effects

Managed Effects is an architectural approach that addresses the following contradiction:

- Compute without effects is useless
- Compute with effects might be dangerous

With Managed Effects, every [effect](#effect) is accessed only with an [Effector Module](#effector-module). Effector Module is audited by the community to check that its API is useful for developers, and its effects are safe for [Compute Providers](#provider).

Compute Providers whitelist only the known Effector Modules and forbid effects in any other module. If some Effector Module requires Provider to have certain capabilities, like locally deployed service or installed binary, it is the Provider's responsibility to ensure the capabilities are available.

Developer can access this effect safely using [Module Linking](#module-linking).

#### Effector Module

A [Marine Module](#marine-module) that implements [Managed Effects](#managed-effects) providing access to an [Effect](#effect) in a safe and useful way. An Effector is what a developer can use via [Module Linking](#module-linking).

Effector modules have a special section in their config that describes binary imports, socket imports, or similar things.

#### Effect

What an [Effector Module](#effector-module) actually executes on the host system and is external to [Marine](#marine), such as curl, IPFS, Ceramic or websocket.

#### Mounted Binary

A Mounted Binary is a special interface that provides an [effector module](#effector-module) the capability to call any binary, hosted by a peer, with the provided set of arguments to obtain a result. It makes it possible to integrate almost any other software (such as IPFS, Ceramic, and databases) in the Fluence ecosystem.

### Particle File Vault

Particle File Vault is a temporary folder that is created on the [Peer](#peer) for every incoming [Particle](#particle) and removed when the [Particle](#particle) expires. All the services within this [Peer](#peer) have access to this folder.

Particle File Vault is expected to be used to pass data between [Compute Function](#compute-function)s (distributed in the form of [Marine Service](#marine-service)s) within a single [AIR](#air) script, making them more composable and avoiding revealing this data to other [Peer](#peer)s involved into this [Particle](#particle)'s execution, which could happen if the data is returned as a plain text.

### Compute Function

An individual computational action, executed on a single peer. [Marine Service](#marine-service)s is the default and preferred way to run [Compute Function](#compute-function)s. Other options are [builtins](#builtin-services), and native code, e.g. Javascript callbacks for [JS client](#fluence-js-client).

### Compute Unit

Smallest divisible compute capacity [provider](#provider)s allocate and stake to the [Marketplace](#compute-marketplace) and available to allocate to a [Worker](#worker). Proved by [Proof of Capacity](#proof-of-capacity) as a part of [Capacity Commitment](#capacity-commitment). Every Worker has exactly this amount of resources.

### Tetraplet

Tetraplet is a data structure describing the origin of an argument to a function call. It contains four fields:

- `peer_id`
- `service_id`
- `function_name`
- `functor`

Tetraplets are the means to check and enforce distributed security invariants of a function by putting restrictions on its arguments, e.g.: the argument “is_authorized” must be provided by a function “check_auth” from “security” [Compute Function](#compute-function) run on the same [Peer](#peer). Both [Marine SDK](#marine-sdk) and [Fluence JS Client](#fluence-js-client) provides access to tetraplets.

Read more about Security Tetraplets [here](/docs/build-mvm/security.md).

## Network

### Peer

A Fluence Peer is a node in the [Fluence Network](#fluence-network), which behaves according to the [Fluence protocol](#fluence-protocol), therefore hosts and executes general purpose [Compute Function](#compute-functions)s, thus providing users cloudless experience. 

Fluence reference peers are comprised of the following components:
- Libp2p to manage connection pool
- A pool of [AquaVM](#aquavm) processes to handle [Particle](#particle)s
- A pool of [Marine Service](#marine-service)s ready to be called from these [Particle](#particle)s
- A scheduler for [Spell](#spell)s
- A pool of [Worker](#worker)s to logically isolate [Marine Service](#marine-service)s and [Spell](#spell)s for security and locked resource availability

Fluence peers are identified by an unique [Peer ID](#peerid) derived from the Peer's Public Key.

### PeerId

Logical address of a segregated [Compute Function](#compute-function)s execution environment. It is derived from a Public key and used to verify a Peer’s signatures, which itself is a part of [Proof of Processing](#proof-of-processing) verified by [AquaVM](#aquavm) for every step of a [Cloudless Function](#cloudless-function).

### Host

A Fluence [Peer](#peer) that participates in Fluence’s [Kademlia](https://en.wikipedia.org/wiki/Kademlia) network. [Nox](#nox) is the reference peer implementation.

Hosts are capable to act as [Relay](#relay)s for [Worker](#worker)s and [Client](#client-peer)s.

[Host Peer ID](/docs/aqua-book/language/topology.md#host_peer_id) can always be accessed from [Aqua](#Aqua).

### Deployment

#### Worker

A single instance of a [Cloudless Deployment](#cloudless-deployment): [Compute Unit](#compute-unit) allocated for [Compute Function](#compute-function)s in form of [Marine Service](#marine-service)s and [Cloudless Scheduler](#cloudless-scheduler) in form of [Spell](#spell)s.

So [Cloudless Deployment](#cloudless-deployment) forms or many Workers, each having the same code installed, the same behavior expected.

A Worker is a part of a [Peer](#peer)'s resources that, together with other Workers, constitutes a [Subnet](#subnet), handles the [Deal](#deal), and isolates some resources. It has its own keypair and [Peer ID](#peerid).

#### Worker Definition

A Worker Definition is a transportable deployment configuration of a Worker. It is built with the help of [Fluence CLI](#fluence-cli), and used by [Nox](#nox) to deploy and update a [Worker](#worker). It is part of [Cloudless Distributive](#cloudless-distributive) and registered in [Deal](#deal)s.

Consists of:
- [Compute Functions](#compute-function) binary sources (in form of [WASM](#webassembly-wasm) [modules](#marine-module) for [Marine Services](#marine-service), and respective resources and [module linking](#module-linking) configuration)
- [Scheduled Cloudless](#cloudless-scheduler) [Functions](#cloudless-function) (in form of compiled [AIR](#air) files) with trigger configurations

#### Subnet

A set of all [Worker](#worker)s, instantiated from an individual [Cloudless Deployment](#cloudless-deployment) and interconnected by runtime communication, which serves to provide redundancy, durability, fault tolerance, load balancing and better security of [Cloudless Function](#cloudless-function)' distributed execution.

#### Gateway

A HTTP-facing Fluence [Client Peer](#client-peer) that is capable of running [Cloudless Function](#cloudless-function)s based on incoming requests.

> TODO See this repo for more.

### Init Peer

The [Peer](#peer) that initiates a [Cloudless Function](#cloudless-function) by creating a [Particle](#particle) and sending it over [Fluence Protocol](#fluence-protocol).

[Init Peer ID](/docs/aqua-book/language/topology.md#init_peer_id) can always be accessed from [Aqua](#Aqua) or via the [Marine SDK](#marine-sdk).

### Client (peer)

A Fluence [Peer](#peer) connected to a Relay but is not participating in the Fluence Kademlia network, i.e., not a [Host](#host). Most likely a running [Fluence JS Client](#fluence-js-client) (browser, CLI).

Client peers, as well as [Worker](#worker)s, cannot be discovered using their respective [PeerId](#peerid)s. Developer needs to discover what [Host](#host) or [Relay](#relay) is advertized to Kademlia network, and use [Aqua](#aqua) to ensure the right path is used.

### Relay

A  [Host](#host), that participates in serving [Cloudless Function](#cloudless-function)s by providing its advanced connectivity capabilities, which includes:

- Ability of a Host to send messages internally to hosted [Worker](#worker)s
- Ability of a Host to send messages to connected [Client Peer](#client-peer)s

To execute code on a [Peer](#peer) that's behind a Relay, e.g., if using a web browser or behind a NAT, use the [`on peer via relay:`](/docs/aqua-book/language/topology#accessing-peers-via-other-peers) construct available in [Aqua](#Aqua).

## Compute Marketplace

The Fluence's Compute Marketplace is an on-chain institution comprised of a set of smart contracts that maintains [provider offer](#provider-offer)s to sell compute capacity, accepts [developer offer](#developer-offer)s to purchase compute capacity and attempts to [match](#matching) developer offers with suitable provider offers in a trustless manner. A successful match results in a [Deal](#deal).

### Deal

A Deal governs capacity supply and demand among [provider](#provider)s and developers over a set of attributes including capacity pricing and deal duration. Deals are the result of the [Compute Marketplace](#compute-marketplace) [matching](#matching) [provider](#provider-offer) and [developer](#developer-offer) offers. Moreover, Deals contain a content-addressable reference (CID) of [Cloudless Distributive](#cloudless-distributive) that specify off-chain [subnet](#subnet)s in terms of [topology](#topology), [Scheduled](#cloudless-scheduler) [Cloudless Function](#cloudless-function)s, [Compute Function](#compute-function)s, and initial data.

Hence, a Deal is the necessary condition for the trustless provisioning, execution and billing of Fluence Cloudless Compute.

### Provider

An organization that participates in the [Fluence Protocol](#fluence-protocol) by providing hardware resources for use.

### Matching

The process of mapping a Developer Offer with its requirements and Provider Offers with its capabilities, resulting in assigning [Worker](#worker) allocations on particular [Host](#host)s, as described inside a [Deal](#deal).

### Offer

#### Provider Offer

Provider Offer is a description of capabilities. In order to participate in the [Matching](#matching) process, Offer must present a [Capacity Commitment](#capacity-commitment) and send [Proofs of Capacity](#proof-of-capacity), so only PoC providers are eligible to provide capacity to the network, staking is not enough.

A provider offer includes the [CU](#compute-unit) capacity, provider metadata, such as data center attributes, desired revenue, etc.

#### Developer Offer

A [Cloudless Distributive](#cloudless-distributive), combined with the capacity selection criteria, such as payment offer, data center type, duration, payment offer, etc., and an escrow payment.

### Capacity Commitment

A provider’s capacity commitment to the network backed by Proofs Of Capacity and eligible for capacity rewards.

A provider can seamlessly switch their resource allocation between Proof of Capacity and fulfilling Deals.

### Capacity Commitment Prover

A piece of software, augmenting each [Nox](#nox) peer, tasked with generating [Proofs of Capacity](#proof-of-capacity) for that Nox’s hardware zone.

### Golden Particle

Golden Particle is a Particle at a certain step of its life time, when its Particle Data contains a solution of a cryptographic puzzle, so it can act as a winning lottery ticket to distribute the rewards among all the participants contributing to the execution of this Particle.

A Golden Particle represents sampled [Cloudless Function](#cloudless-function) executions used by the [Proof of Processing](#proof-of-processing) for reward distribution.