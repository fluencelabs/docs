# Learning Fundamentals

I~~f you have followed the introduction or even played with the some of the examples, you know that ... If you haven't read through the [Getting Started](https://hackmd+.vscode-resource.vscode-cdn.net/Fluence%20Developer%20Documentation.md#Getting-Started) section, this is w good time to do so.~~

~~The Fluence solution~~

- ~~Business Logic aka FaaS aka Services~~
- ~~Aqua~~

### **Marine**

~~The Marine stack includes the Marine VM, the Wasm runtime installed on every Rust reference peer, marine-sdks, the ?? you use to develop and test your Rust code, Marine REPL, the run time you …, and the marine cli. Note that both the REPL and the CLI are available to you through Fluence CLI. A detailed account of all things Marine can be found in the [Marine book](/docs/marine-book/introduction).~~

### **Aqua**

Aqua is a purposefully lean language but easily extensible. In order to extend Aqua to meet your requirements, you do what you with all the business logic you need implemented: you implement your code as Wasm module(s), deploy the service to the peer(s) you desire and implement the necessary Aqua interfaces to work with …

Some requirements you may deem missing may by others and instead of everybody doing their own one-off, it may make sense to organize such features into libraries.

Let’s look at a simple example:

For all things Aqua, consult the Aqua book.

### **Particle**

Marine is all about implementing and executing your business logic distributed across the peer-to-peer network. Aqua is all about choreographing and composing distributed business logic into decentralized applications.

Particles are the “medium” or smart package that aqua uses to capture state changes between

At the state level, [particles](https://hackmd+.vscode-resource.vscode-cdn.net/Fluence%20Developer%20Documentation.md) connect Aqua language instructions with the intended Marine Wasm execution. Specifically, a particle is a "smart package" data structure that encapsulates user data, the compiled Aqua script, i.e., AIR, and
