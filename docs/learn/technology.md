# Technology

Fluence proposes the new paradigm in distributed computing: programmable data control plane.

Traditionally distributed applications are organized as a frontend client and a set of backend services running in the cloud. Such architecture introduces a single point of failure at the backend API gateway, where all client requests go and where the orchestration of backend services is managed. The motivation for such application architecture is the ability to hide the backend under the common security perimeter (e.g. cloud platform) and scale within that while keeping the client relatively light.

With the shift towards to the world of decentralized data, where applications do not create central repositories of user data on their backends, such architecture is not efficient anymore. Frontend clients become more substantial and may leverage decentralized protocols to communicate with each other and offload data to blockchains or decentralized storage, while maintaining access control via private keys on the user device. Such P2P scenarios require more comprehensive tech to be deployed than legacy WebRTC or HTTP client-server.

## Aqua: P2P programming language

[Aqua](../build/aquamarine/aqua.md) is the new programming language specifically created for writing P2P workflows and scenarios. Aqua simplifies programming of business logic across distributed peers and allows to decouple network algorithms from computations. It is Turing-complete, based on [process-calculus](https://en.wikipedia.org/wiki/Process_calculus), and allows to implement algorithms for any network topology.

```aqua
-- ask a remote peer to say hello to us
func sayHello(remotePeer: PeerId, relayPeer: PeerId) -> string:
    on remotePeer via relayPeer:
        res <- HelloPeer.hello(%init_peer%)
    <- res
```

Compared to traditional programming languages, Aqua code is not fully "executed" at the computer where it was deployed. Instead, the code processed into a bunch of [particles](../build/concepts/concepts.md#particles): programmable requests. Particles travel over the network following the programmed scenario, and triggering functions on remote peers over the route. Essentially the runtime of Aqua language is represented by a particle messaging protocol, where messages are cryptographically secure, verifiable data structures containing remote computation results.

This allows to program any network algorithms: from simple browser-to-browser communication via relay peers to comprehensive consensus engines where multiple peers select a leader and then gather certain amount of cryptographic signatures for a piece of data. Such algorithms were [complex](https://github.com/etcd-io/etcd) pieces of software and are now commoditized as language libraries. With Aqua, peer discovery, routing, data sharing, replication, computation consensus are easily added to any application.

## Marine: portable runtime

[Marine](../build/aquamarine/marine/marine.md) is Fluence's universal WebAssembly runtime that executes computations triggered by Aqua programs. Computations are executed as lightweight and portable WebAssembly services, that may provide both pure computation and proxy to external legacy APIs or binaries.

Marine provides secure code sandbox, which guarantees that hosted code can't access the node system without explicit permission. Services are lightweight and fast, which allows to achieve high atomicity of computations, and effectively compose a distributed serverless engine.

Marine serves as a universal middleware for API wrappers, indexes, data cache, processing,  transformation, and formatting. Combined with Aqua, it enables standardization for open source components for distributed data processing and API composition.

## Fluence: P2P computing network

With Aqua and Marine, layered architecture of cloud backends is replaced with the P2P network of nodes and clients. Backend services become exposed into the external network and being used across multiple applications. Nodes may re-host services, providing additional availability, resiliency, and compete for quality of service. Application developers may leverage services of their own or access services hosted by other network members, benefiting from redundancy of service instances.

As the application data is now served mainly from client devices or decentralized storage, the Fluence network of nodes works as a collective global computer that provides on-demand resources. Workers across the world pop in and out whenever incentivized by demand, providing automated load balancing, increased availability, computations close to data. All of this is choreographed by Aqua programs and customizable by every application.
