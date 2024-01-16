# Marine JS (experimental)

> This section is experimental as the API is not stable and probably will change.

## Intro

As you already know, Fluence carries a notion of serverless decentralized computation.
In that ecosystem JS client has been presented more like an HTTP gateway pointed to vast Fluence network consisted of Nox relays.

Nonetheless, there are some cases when you want to host some logic locally.
Local environment could be Node.js server or browser page.

### Example 1

Text editor application for multiple users.
For example, 5–10 users open a web page, and they are able to simultaneously edit text, add symbols or remove words.
Accordingly, each user has its own JS client up and running.
JS client hosts logic (in a dedicated service or services) for interacting with incoming particles.
Each particle carries a message of new typed symbol or added exclamation mark and more,
and the client contains logic to process it.

### Example 2

AI image library with an ability to execute incoming processing requests and distribute the work through Fluence network.
The lib should do some simple processing locally, e.g., edit a simple image directly in a browser and also parallelize the work on Fluence remote peers if necessary (applying heavy shader on a picture).

### Summary

These use cases have something in common—they need to host a logic locally which will be executed on the local device.
It saves you from the network latency and allows other peers to interact with and exchange your data. 
Moreover, sometimes writing a logic in pure JavaScript is not feasible.
For example, AI processing logic would be a lot effective if written in low-level language like Rust.

## Use cases

Here are the reasons why you might want to write a Marine JS Wasm service instead of writing a regular JavaScript service for JS client:
- A service which works both on Nox peer and JS client peer
- Heavy computations, CPU intensive tasks
- Would prefer to write a service in Rust or other language with compilation to WASM (at this moment only Rust is officially supported)

## What is Marine JS

When JS client starts up, it starts with initialization of Marine JS runtime.
The runtime hosts wasm services and even allows you to register your own wasm services.
For example, AquaVM service (which process particle data) resides in Marine JS.
That's why Marine JS is a foundation of JS client.

## Extending JS client with Marine services

> Currently only [pure](https://fluence.dev/docs/build/glossary#pure-module) single-module services are supported.

Using Marine services is pretty straight forward. The first thing to do is to load a compiled WASM file into your environment.

### Loading module binary

Here are the examples of how to load your wasm file in browser or Node.js

**Node.js**

```javascript
import { readFile } from 'fs/promises';

const wasm = await readFile('path/to/wasm/file.wasm', 'base64');
```

**Browser**

> Need to install additional external package in browser env - `js-base64`

```javascript
import { fromUint8Array } from 'js-base64';

const wasmBinary = await fetch('https://wasm.com/url/to/wasm').then(res => res.arrayBuffer());
const wasm = fromUint8Array(new Uint8Array(greetingWasm));
```


### Registering service in JS client

JS client doesn't provide any specific interface for creating services in Marine JS.
However, the client loads wasm content through its own special service called `Srv`. 
This is JS client's specific API that's why you need to add `Srv` definition in your Aqua project. 

Add the following aqua file in your project near the other aqua files.

```
data ServiceCreationResult:
    success: bool
    service_id: ?string
    error: ?string

data RemoveResult:
    success: bool
    error: ?string

alias ListServiceResult: []string

service Srv("single_module_srv"):
    -- Used to create a service on a certain node
    -- Arguments:
    --  bytes – a base64 string containing the .wasm module to add.
    -- Returns: service_id – the service ID of the created service.
    create(wasm_b64_content: string) -> ServiceCreationResult
    
    -- Used to remove a service from a certain node
    -- Arguments:
    --  service_id – ID of the service to remove
    remove(service_id: string) -> RemoveResult
    
    -- Returns a list of services ids running on a peer
    list() -> ListServiceResult
```
Also, you need Aqua function which will call the service above.
Here is an example of what that function could look like in a simple form.

> In this example, wasm binary loaded as a string (see above) passed to Aqua function param.

```
service GreetingService("service-id"): -- (1)
    greeting: string -> string

func hello(name: string, wasm_content: string) -> string:
    created_service <- Srv.create(wasm_content) -- (2) 
    Greeting created_service.service_id! -- (3)
    <- Greeting.greeting(name) -- (4)
```

- (1) Service definition for the passed module
- (2) Using JS client `Srv` service to register module as a service in Marine JS.
- (3) Creating service variable. It will allow you to call methods from service definition
- (4) Interacting with your single module service

Then you need to pass `wasm` variable above as a second parameter in the function.

> You can load and register as many WASM modules as you want. Remember to keep each of them in a separate service.

There is a working marine service example in [examples repo](https://github.com/fluencelabs/examples/tree/main/js-client-examples/marine-service).
