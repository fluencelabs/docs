# Meet Fluence

This article will help you understand the reasoning behind the main concepts of the Fluence Protocol and how it establishes the foundation for decentralized serverless applications.

## Intro to Cloudless Concepts

Fluence Protocol constitutes a network out of many compute peers, running on hardware servers, owned by many compute providers. The Fluence network, facilitated by the [Compute Marketplace](./concepts/marketplace.md), enables an off-chain, Cloudless experience. Since Fluence is not a blockchain where nodes are assumed to be uniform, compute providers’ peers that are integrated into the network differ in capabilities.

Implementing Cloudless compute needs addressing network navigation and execution coordination problems. This involves several steps: initially locating the appropriate peer or set of peers on the network, directing the request to these identified peers, and then executing the Compute Function. The execution strategy could vary - for instance, it may be aimed at securing the quickest response for read queries, ensuring a defined fraction of acknowledgements are received, or enabling fault tolerance.

The distributed workflow of Cloudless Function execution includes routing from peer to peer, invoking a computation on peers, connecting outputs to inputs, retrying calls, handling timeouts and other operations.

Compute Function is a part of Cloudless Function that does actual compute job on an assigned peer.

Interoperability of Fluence’s Cloudless Functions with web2 services or other web3 protocols is crucial. Fluence offers the Managed Effects approach that makes it possible to integrate and coordinate the external facilities into cloudless execution.

The three concepts: [Cloudless Function](#cloudless-function), [Compute Function](#compute-function), and [Managed Effects](#managed-effects), are the cornerstones of Fluence’s protocol design.

## Cloudless Function

Cloudless is a decentralized serverless. There must be no single coordinator that might be managing computation requests. Such a bottleneck and a single point of failure would bring us back to the traditional cloud, losing many benefits of DePIN. Cloudless Functions are designed for distributed, coordinator-free choreography, which include parallel execution, fail recovery, optional consensus.

Once upon a time, smart contracts added a huge variety of possibilities to simple blockchains. The same way, for a given DePIN setup, Cloudless Functions add flexibility of distributed behaviors, which can be redefined without hardforks or new network protocols or node redeployment.

Cloudless Function is a definition of how exactly your compute routine is discovered, executed, secured, verified in the open distributed cloudless Fluence network.

To let developers prescribe and run distributed behavior of Cloudless Functions, Fluence innovated [Aqua](../aqua-book/introduction.md): a programming language and a runtime. Distributed workflows, defined in Aqua scripts, delegate computation to Compute Functions on selected peers which are discovered during execution of the Cloudless Function.

Aqua, as both the language and the runtime, comes with certain guarantees, limitations, and flexibility benefits.

Guarantees include:
- No replay attack: there’s no way to intercept a Cloudless Function during its execution and reuse it in a way its originator didn’t set it to.
- No MitM attack: there’s no way to fake peer’s responses.
- Convergence: true parallelism with forking and joining should never end up with conflicting state of Cloudless Function.
- Audited execution: during each stage of distributed workflows, an audit log is created and checked. This process guarantees that the execution of the Cloudless Function adheres strictly to the developer's instructions.

Limitations include:
- Aqua only does choreography job: the task of computation is delegated to the Compute Functions.
- Not a data plane: big chunks of data must be moved around with data-focused solutions or protocols.
- Learning curve: Aqua is a brand new special language that developers need to use for Cloudless Functions.
- Yet not so many library algorithms: probably the algo you need you need to implement yourself.

Flexibility benefits include:
- Strong foundation: Aqua runtime ([AquaVM](https://github.com/fluencelabs/aquavm)+AIR) is implemented on top of π-calculus for distributed logic and lambda calculus for data manipulations, which means that almost anything that you can imagine is possible to implement as a part of Cloudless Function with Aqua.
- Execution strategies such as consensus, failover, load balancing and others, once implemented, can be reused as Aqua libraries.

In Cloudless Functions, all distributed capabilities, including key elements like failover, are optional and implemented only if chosen. Failover is a library function, among many others, which you may fork and make it fit your needs. Any sort of failover requires a certain degree of redundancy. Cloudless Deployments, replicated deployments of the same Cloudless Function’s code, form a Subnet of peers serving the same purpose together. This behavior is the default, with redundancy factor as a configuration parameter.

Consensus is another option a developer might or might not want. Consensus on write, on read, or particular consensus algorithm is a developer’s decision. To execute leader election or data synchronization, Cloudless Functions need to be independently initiated on Subnet nodes, without requiring user interaction. For example, Raft consensus means that the well-known set of authorized peers do rounds of leader election between them prior to user interactions.

Cloudless Scheduler enables scheduled execution of Cloudless Functions on all peers of a Subnet, triggered periodically or due to a blockchain event. This way a developer can register a Cloudless Function that secures leadership in the Subnet, syncs some data, pulls updates, or reacts to chain events with any possible compute.

## Compute Function

As Cloudless Functions are essentially distributed workflows that choreograph Compute Functions, the latter provide the substantial computations.

While Compute Functions can encompass any computations you prefer, only those considered safe for Compute Providers can be utilized for Cloudless Deployments. This necessitates both portability and sandboxing.

[Marine](../marine-book/introduction.md) is the default compute runtime for Compute Functions, delivered as a part of Cloudless Deployment in the Fluence Network. Marine is a general purpose Webassembly runtime that supports Wasm Module Linking with a shared-nothing linking scheme. 

With the Marine runtime, developers can use any language that compiles to WASM, with some limitations needed for safety and portability.

To achieve safety, Marine restricts host imports: Marine’s Webassembly modules, by default, cannot trigger any external effect, open a socket or execute a binary. Yet Marine makes an exception for capabilities provided by WASI system interface, such as reading a current host’s time or accessing file system.

Marine configures a number of directories to be accessible by Marine modules. The majority of these directories are situated in ephemeral storage, which is essentially RAM. Any state in this storage is lost if the host machine restarts. While a limited amount of persistent storage is also provided, to ensure data durability developers are required to use replication across peers in the Subnet and/or leverage external storage solutions.

Compute Function can be assembled from several Webassembly modules with the help of module linking. The module linking approach allows partial solutions to be crafted in any compatible language and distributed in the form of a content-addressable .wasm binary. This facilitates their reuse across numerous Compute Functions on the network.

For certain use cases, developers don't even need to code Rust or compile anything to Webassembly. One important case is Spell.

Spell is a special service that aggregates a set of Compute Functions, a local key-value storage that developers can build upon, and a Cloudless Function – an Aqua script that is executed based on a cron-like trigger.

Compute Functions may be and often are implemented outside of Marine. It is possible to expose a peer’s native code as a Compute Function, which cannot be a part of Cloudless Distributive, but still may take part in cloudless execution. For example, a Fluence JS Client in your web-browser can expose an API to show a notification with a result of Cloudless Function.

Compute Functions are provided access to Cloudless Function context, which includes various information like the caller’s ID, the timestamps etc. Also, every input argument of the function is also accompanied with metainformation of its origins. The reasons behind that is enforcement of security invariants and business rules on Compute Functions. The best practice is to ensure distributed security invariants based on the knowledge of the origin of the incoming arguments instead of whitelisting particular peer IDs or even Cloud Functions which could exclusively be executed – while the latter is also possible.

Compute Functions cannot trigger Cloudless Functions as a part of their execution, as this would easily lead to amplification and DDoS. Fluence peers may apply a variety of additional measurements to protect the network from spam that might come from connected external clients.

In the cloud infrastructures of web2, serverless is often used to integrate managed services like dynamicdb or s3 with lambda and step functions. With Fluence, interaction with both web2 services and web3 protocols can be established, as soon as they are exposed to the Fluence network as Compute Functions.

This statement, however, contradicts with Safety and Portability requirements.

## Managed Effects

Marine Wasm modules, as previously mentioned, serve as the delivery units for Compute Functions within a Cloudless Deployment. This is made possible due to their portability and broad applicability. The ability to link these modules and reuse compiled modules as foundational elements for multiple Compute Functions provides Compute Providers with the flexibility to deem certain modules as safe, even if they aren't fully sandboxed.

Meet Managed Effects approach:
- Some Marine modules have effects that go out of the sandbox; such a module is called Effector Module.
- Effector Modules must be explicitly whitelisted by Compute Providers.
- Developers have the capability to construct diverse Compute Functions by utilizing the necessary effects, all made possible through Effector Modules and the module linking feature of Marine.

Managed Effects make Fluence Protocol a Swiss knife for the task of integrating web2 services and web3 protocols into a user facing products, taking off the limits of Webassembly runtime and boundaries of Fluence Network.

There are two ways to use a web3 protocol: introduce a new Effector Module, or leverage capabilities of existing ones.

An example of the first approach is the Fluence’s default IPFS Effector. It requires IPFS client binary to be deployed on Compute Provider’s resources.

Example of the second one is Ceramic Effector, which utilizes the existing cURL effector to interact with Ceramic nodes via an HTTP API. Therefore, to establish a connection with the Ceramic protocol, a developer needs a Ceramic Marine module that is linked to a cURL Effector.

Compute Providers may introduce new effects, wrap them with Effectors, and register to [Compute Marketplace](./concepts/marketplace.md) so that developers choose resources for their Cloudless Deployments that fit the best. Compute Providers could gain an advantage by offering extra features on their Fluence nodes. This could include operating other protocols, accessing full nodes, or even providing exclusive services like databases and cloud services.

## Outro

Fluence’s Cloudless approach offers exceptional flexibility and versatility both to the developers and compute providers. Combined together, Cloudless Functions, Compute Functions, and Managed Effects serve as a bedrock for the protocols and applications that build the future.

See [Glossary](./glossary.md) to learn more about the Fluence's concepts.