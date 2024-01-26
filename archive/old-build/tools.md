# Tools

## Fluence CLI

[Fluence CLI](fluence-cli.md) is designed to be the only tool that you need to manage the life cycle of applications written on Fluence. It provides project scaffolding, compilation, service deployment, dependency management and installation, storage of keys and ids, etc.

## Aqua JS API

Please see the [Aqua JS API](../aqua-book/aqua-js-api.md) documentation.

## Fluence JS Client

Fluence JS Client is a limited implementation of the Fluence Peer in JS.
It runs in Node.js and browser, has Marine-JS inside to execute Webassembly, runs AquaVM as a Marine-driven Wasm as well as other Fluence protocol-level services.
Fluence JS Client is embedded into Fluence CLI.
Aqua compiler has JS and TS targets that uses Fluence JS Client to actually run compiled AIR code, and provides relevant types.

Please see [Fluence JS Client Github](https://github.com/fluencelabs/js-client) for more details.

## Marine Tools

Marine offers multiple tools including the Marine CLI, REPL and SDK. Please see the [Marine section](./aquamarine/marine/marine.md) for more detail.
