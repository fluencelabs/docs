# Marine JS

> This section is experimental as the API is not stable and probably will change.

## Using Marine services in JS client

JS client can host Marine services with Marine JS. Currently only pure single-module services are supported.

Before registering the service, the corresponding WASM file must be loaded.

Here are the examples of how to load your wasm file in browser or node

**Node.JS**

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


### Registering services in FluencePeer

JS client loads wasm content through its own special service called `Srv`.
You need to add the service definition if you want to use it. 

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

```
func hello(name: string, wasm_content: string) -> string:
    created_service <- Srv.create(wasm_content)
    Greeting created_service.service_id!
    <- Greeting.greeting(name)
```

Then you need to pass `wasm` variable above as a second parameter in the function.

You can write more sophisticated functions by yourself, but let's hope you're got an idea.

There is an additional marine service example in [examples repo](https://github.com/fluencelabs/examples).
