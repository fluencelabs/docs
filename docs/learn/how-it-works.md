# How It Works

### Computing marketplace

The Fluence protocol organizes the on-chain marketplace that matches compute providers with customers who pay for using the compute resources offered by providers. The marketplace is completely permissionless, so any providers may participate and publish their available capacity.

Customers may select providers or publish work available to be picked up by any provider.


### Deals

Customers create deals on-chain with providers when they need to deploy their application to the network. Deals include financial detail (prices and required collaterals from providers), technical requirements related to required services (access to certain data, binaries or web API), and a link to code installations in the network.


### Subnets

All deployments on the network are organized as subnets formed from multiple nodes. Subnets serve dual purpose: to provide fault tolerance in the event a node becomes unavailable due to a hardware fault or network disruption; and to group peers serving the same application or its component. Subnets are fully customizable by the application owner and enable failovers, load balancing, or consensus algorithms.

Subnets are useful not only to provide fault-tolerance, but also as a highly available data store. While storing large amounts of data is outsourced to external storage networks (e.g. Filecoin or Arweave), Fluence subnets may provide hot caching, RPC access, or data indexing.


### Aqua

The Fluence network runs entirely on the Aqua protocol which provides secure distributed execution without centralized coordination. The Aqua name is also used for a domain specific scripting language that is compiled down to pi-calculus operations and allows the expression of deadlock-free distributed algorithms. The Aqua protocol is deploy-free: Aqua scripts are packaged into data packets and are executed as they go over the network as programmed by scripts themselves. Additionally, Aqua guarantees cryptographic security on script execution: all requests and their step by step execution are signed by participating peers, making executed scripts auditable and verifiable.

Network system subprotocols including Subnets, Registry, and Kademlia are all written as Aqua algorithms. Service discovery, routing, load balancing, subnets deployment and operation, scaling, and fault tolerance algorithms are all implemented in Aqua.

Customers’ applications use Aqua to customize deployments, subnets routine, and implement new distributed execution scenarios they need for their use cases.


### Marine

While Aqua operates the topology and flow of the execution, algorithms essentially describe a queue of function calls on some nodes. For running computation on nodes, Fluence uses Marine, a WebAssembly runtime allowing multi-module execution, incorporating interface-types and WASI for effector access.

Customers’ applications deploy Marine functions as WebAssembly modules similarly to cloud functions. Marine supports Rust and C++ as source languages, but more languages are coming with the development of the WebAssembly standard.


### Proofs of execution

The Fluence protocol enforces generation of cryptographic proofs for all execution in the network. Providers generate proofs for their computation and validate some of previous execution done by others in order to earn rewards. Customers pay only for the work accompanied by proofs that the work was validated and correct.

There are three types of proofs:

#### Proof of Processing
A proof protocol for probabilistic on-chain verification of computations executed on a network. The protocol sets up rules that enforce providers submitting pieces of computations for on-chain validation in order to earn rewards.

#### Proof of Execution
A cryptographic proof for particular code execution on Fluence. Every function execution is accompanied with this proof produced by Fluence’s Marine WebAssembly runtime. These proofs are validated by nodes participating in follow-on execution and included in Proof of Processing.

#### Proof of Resource Allocation
A proof protocol to ensure providers allocated certain compute capacity and memory to the network. Providers submit such proofs on-chain to earn additional Idle Capacity Rewards.


### Network

The Fluence network can be thought of as a global set of interconnected nodes, each of which runs AquaVM and Marine, capable of receiving commands for deploying and executing code locally and collaborating with other nodes as specified by the received algo. Most of these nodes are constantly involved in economic activity: they monitor and enter into Deals, form new Subnets or adjust participation in Subnets, install applications as specified by Deals, coordinate execution and serve incoming requests. They also produce proofs of the execution and submit them as specified by proof algorithms to receive rewards.

Additionally, to ensure the stability and performance of the network, nodes participate in serving shared network resources such Registry, which provides service and subnet discovery, and Trust Graph, which is used for authentication and permissioning.
