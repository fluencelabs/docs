# TODO: adapt to JS Client

## Using Marine services in Fluence JS

Fluence JS can host Marine services with Marine JS. Currently only pure single-module services are supported.

Before registering the service corresponding WASM file must be loaded. Fluence JS package exports three helper functions for that.

#### loadWasmFromFileSystem

Loads the WASM file from file system. It accepts the path to the file and returns buffer compatible with `FluencePeer` API.

This function can only be used in nodejs. Trying to call it inside browser will result throw an error.

**loadWasmFromNpmPackage**

Locates WASM file in the specified npm package and loads it. The function accepts two arguments:

- Name of npm package
- Path to WASM file relative to the npm package

This function can only be used in nodejs. Trying to call it inside browser will result throw an error.

#### loadWasmFromServer

Loads WASM file from the service hosting the application. It accepts the file path on server and returns buffer compatible with `FluencePeer` API.

:::info
The function will try load file into SharedArrayBuffer if the site is cross-origin isolated.

Otherwise the return value fall backs to Buffer which is less performant but is still compatible with `FluencePeer API`.

We strongly recommend to set-up cross-origin headers. For more details see: See [MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements) for more info
:::

This function can only be used in browser. Trying to call it inside nodejs will result throw an error.

### Registering services in FluencePeer

After the file has been loaded it can be registered in `FluencePeer`. To do so use `registerMarineService function.`

To remove service use `registerMarineService` function.

You can pick any unique service id. Once the service has been registered it can be referred in aqua code by the specified id

For example:

```typescript
import { Fluence, loadWasmFromFileSystem } from '@fluencelabs/fluence';

async function main()
    await Fluence.start({connectTo: relay});

    const path = path.join(__dirname, './service.wasm');
    const service = await loadWasmFromFileSystem(path);

    // to register service
    await Fluence.registerMarineService(service, 'my_service_id');

    // to remove service
    Fluence.removeMarineService('my_service_id');
}
```

See [https://github.com/fluencelabs/marine-js-demo](https://github.com/fluencelabs/marine-js-demo) for a complete demo.
