# Marine Runtime

Marine is a modern general purpose Wasm runtime based on the [component model](https://github.com/WebAssembly/component-model) capable of running multi-module Wasm applications, aka services, with [interface-types](https://github.com/WebAssembly/interface-types) and a [shared-nothing linking](https://training.linuxfoundation.org/blog/how-and-why-to-link-webassembly-modules/) scheme. This execution model is well suited for a variety of scenarios and especially applicable to implementations following the [entity component system](https://en.wikipedia.org/wiki/Entity_component_system) (ECS) pattern or plugin-based architectures.

Fluence peers, such as Fluence [Rust node](https://github.com/fluencelabs/fluence), include Marine to execute the hosted Wasm services composed with [Aqua](https://github.com/fluencelabs/aqua).

This section is devoted to developers who want to understand the architecture of Marine or want to integrate it as a runtime to their projects.
