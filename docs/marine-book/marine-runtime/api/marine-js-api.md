# Marine-JS API

Web runtime is support not all features of the Rust Marine side, it supports now only pure single-module services. `FluenceAppService` is the central pillar of the web runtime, it could be reflected to the Runtime component despite its name. In the future on the milestone 4 of the web runtime JS `FluenceAppService` will have a one-to-one correspondence with Rust one.

## Loading Wasm

Before registering the service corresponding Wasm file must be loaded. Fluence JS package exports three helper functions for that:

### loadWasmFromFileSystem

```javascript
export const loadWasmFromFileSystem = async (filePath: string):
    Promise<SharedArrayBuffer>
```

Loads a WASM file from the filesystem. It accepts the path to the file and returns a buffer compatible with `FluencePeer` API.

This function can only be used in node.js. Trying to call it inside the browser will result throw an error.

### loadWasmFromNpmPackage

```javascript
export const loadWasmFromNpmPackage = async (source: { package: string; file: string }):
    Promise<SharedArrayBuffer>
```

Locates WASM file in the specified npm package and loads it. This function can only be used in nodejs. Trying to call it inside browser will result throw an error.

### loadWasmFromServer

```rust
export const loadWasmFromServer = async (filePath: string): 
    Promise<SharedArrayBuffer | Buffer>
```

Loads WASM file from the service hosting the application. It accepts the file path on the server and returns a buffer compatible with `FluencePeer` API. This function can only be used in a browser. Trying to call it inside node.js will result throw an error.

## Playing with FluenceAppService

### initialization

```javascript
init: (controlModuleWasm: SharedArrayBuffer | Buffer) => Promise<void>
```

Initializes a new instance of FluenceAppService.

### creating a service

```javascript
createService(
        serviceModule: SharedArrayBuffer | Buffer,
        serviceId: string,
        faaSConfig?: FaaSConfig,
        envs?: Env,
    ): Promise<void>
```

Creates a service from the provided config.

### calling a service

```javascript
callService(
        serviceId: string,
        functionName: string,
        args: string,
        callParams: any
    ): Promise<string>
```

Invokes a function of a module inside `FluenceAppService` by given function name with given arguments in Json string.
