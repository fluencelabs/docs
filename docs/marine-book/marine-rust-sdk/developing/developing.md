# Developing

The Marine Rust SDK exports several main components:

* `[marine]` procedure macro - can be applied to a function, external block or structure.
* call parameters interface - intended to extract a special structure called `CallParameters` that contains some module start parameters
* mounted binaries interface - can be used to extract a result of CLI interface call
* `module_manifest` macro -  intended to embed some info into a compiled Wasm
* logging stuff - allows adjusting a special Wasm logging mechanism
