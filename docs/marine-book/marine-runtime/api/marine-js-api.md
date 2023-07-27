# Marine-JS API

Web runtime does not support not all features of the Rust Marine side, it supports now only pure services and does not pass call parameters to the service, but supports multi-module services. `MarineService` is the central pillar of the web runtime, it has simplified interface of `AppService`. In the future on the milestone 4 of the web runtime JS `MarineService` will have a one-to-one correspondence with Rust one.

## Loading Wasm

Before registering the service corresponding Wasm files must be loaded, as well as the control module. Marine JS does not provide any API for doing this, but there is a quite simple implementations for node.js and web environments in js-client library.

## Playing with MarineService

### Constructing a service

```javascript
constructor(
        private readonly controlModule: WebAssembly.Module,
        private readonly serviceId: string,
        private logFunction: LogFunction,
        private serviceConfig: MarineServiceConfig,
        env?: Env,
    ) 
```
Constructs a `MarineService` object that is ready to be started. The 

The service module bytes, names and all other possible configuration is passed as `MarineServiceConfig`. Acually used values are `module_bytes`, `import_names` and logger and WASI related ones. 
```javascript
export interface MarineServiceConfig {
    /**
     * Settings for a module with particular name (not HashMap because the order is matter).
     */
    modules_config: Array<ModuleDescriptor>;

    /**
     * Settings for a module that name's not been found in modules_config.
     */
    default_modules_config?: MarineModuleConfig;
}

export interface ModuleDescriptor {
    wasm_bytes: Uint8Array;
    import_name: string;
    config: MarineModuleConfig;
}

export interface MarineModuleConfig {
    /**
     * Maximum memory size accessible by a module in Wasm pages (64 Kb).
     */
    mem_pages_count?: number;

    /**
     * Maximum memory size for heap of Wasm module in bytes, if it set, mem_pages_count ignored.
     */
    max_heap_size?: number;

    /**
     * Defines whether FaaS should provide a special host log_utf8_string function for this module.
     */
    logger_enabled: boolean;

    /**
     * Export from host functions that will be accessible on the Wasm side by provided name.
     */
    // host_imports: Map<string, HostImportDescriptor>;

    /**
     * A WASI config.
     */
    wasi: MarineWASIConfig;

    /**
     * Mask used to filter logs, for details see `log_utf8_string`
     */
    logging_mask: number;
}

export type Env = WASIEnv;

export type Args = WASIArgs;

export interface MarineWASIConfig {
    /**
     * A list of environment variables available for this module.
     */
    envs: Env;

    /**
     * A list of files available for this module.
     * A loaded module could have access only to files from this list.
     */
    preopened_files: Set<string>;

    /**
     * Mapping from a usually short to full file name.
     */
    mapped_dirs: Map<String, string>;
}

```
A marine service can produce logs during execution. All of its logs will be passed to the `logFunction` argument, which has the following type:
```javascript
export type LogFunction = (message: LogMessage) => void;

export interface LogMessage {
    service: string;
    message: string;
    level: LogLevel;
}
```

The logging is enabled by setting `logger_enabled: true` in `MarineModuleConfig`, the log level is set via environment variable `WASM_LOG` that works just like `RUST_LOG` for [env_logger crate](https://docs.rs/env_logger/latest/env_logger/). It defaults to `off` (disabled logging), other useful values are `error`, `warn`, `info`, `debug`, `trace`.


### Starting as service
```javascript
init: () => Promise<void>
```

Starts this `MarineService` object. This includes instantiating the control module, as well as compiling, linking and instantiating the provides service modules. 

### calling a service

```javascript
call(functionName: string, args: JSONArray | JSONObject, callParams?: CallParameters): unknown
```

Invokes a function of a module inside `MarineService` by given function name with given arguments in Json string. The module to call is the last module listed in `modules_config` field of `MarineServiceConfig` -- the facade module. Call parameters is a fluence-related argument, a `defaultCallParameters` constant can be used when call parameters are not needed. This method will throw an exception in case of module execution error. The return value is the JS object returned by the facade module.
