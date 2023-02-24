# **Overview**

Fluence decentralized FaaS is a Web3 alternative to FaaS provided by centralized cloud providers such as AWS Lambda or Google Cloud Functions. Fluence decentralized FaaS allows developers to benefit not only from verifiable service execution, high availability and easily portable code but also highly competitive pricing.

Fluence decentralized FaaS, aka services, are implemented as Webassembly Interface Types (Wasm IT) modules and executed by hardware providers, aka peers, in a public, permissionless peer-to-peer network with global reach. Your code, i.e., Wasm modules, and peer(s) are linked by an on-chain marketplace that allows you, the developer, to specify your willingness to pay in stablecoin, such as USDC, and for peers to decide which payloads to host and execute based on their economic rationale.

Before we dive in, let’s get a bird’s eye view of the anatomy of decentralized serverless built on the Fluence protocol.

Business logic is implemented in Rust and compiled to Wasm. The resulting Wasm module(s) with associated linking and host resource access request specifications are deployed to one or more peers willing to host said modules. ***Note that we call the linked modules a service***. If all goes as planned, you now have your business logic distributed to the peer-to-per network and available to be called. See Figure 1.

```mermaid
sequenceDiagram

participant D as Developer
participant C as Blockchain
participant I as IPFS
participant P as Peer(s)

D ->> D: Implement business logic
D ->> D: Compile to Wasm
D ->> C: Create Deal
D ->> I: Deploy Wasm module(s)
alt
	P ->> C: Agree to host module(s) based on Deal
	P ->> I: Fetch module(s)
	P ->> P: Deploy module(s)
	P ->> P: Wait for request
	alt received and executed request
		P ->> D: return result
		P ->> C: Request payment from Deal
	end
else
	P ->> D: Reject hosting of modules
end
alt
	D -->> P: Remove modules request
	P -->> P: Remove modules
end

```

Now that we have our business logic deployed to one or more peers of the Fluence peer-to-peer network, we need to implement our application workflow with Aqua. [Aqua](https://github.com/fluencelabs/aqua), as you may recall, is your distributed choreography and composition tool necessary since your distributed services are not callable by REST or JSON-RPC but over the networks peer-to-peer layer. Once you implemented your workflow and service composition, tooling is available to create the previously discussed particle, i.e., compiled Aqua, data and metadata, and deploy it to the network. Note that the entry point of your workflow program can be any publicly accessible peer, aka relay peer, in the network. See Figure 2.

```mermaid
sequenceDiagram

participant D as Developer
participant N as P2P Network

D ->> D: Create workflow in Aqua
D ->> D: Create particle
D ->> N: Deploy particle to network via (any) relay peer
N ->> N: Execute specified worklflow step(s)
```

Your go-to tool for accomplishing almost all tasks except for coding business logic is Fluence CLI. See Figure 3.

```mermaid
stateDiagram
    
    state "Rust Marine Code" as Code
    state "Build wasm32-wasi Module" as Build
    state "Test Wasm App With Cargo" as Test
    state "REPL Locally Interact With Modules" as Repl
    state "Module Configuration" as Config
    state "Service Configuration" as Service
    state "Deploy Service To Network" as Deploy
	  state "Remove Service From Network" as Remove

    Code -->  Build
		state FluenceCLI {
	    Build --> Repl
	    Config --> Repl
	    Config --> Test
	    Build --> Test
	    Build --> Deploy
	    Service --> Deploy
	    Remove
	  }
```