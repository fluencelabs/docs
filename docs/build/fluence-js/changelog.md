# Changelog

Fluence JS versioning scheme is the following: `0.BREAKING.ENHANCING`

- `0` shows that Fluence JS does not meet its vision yet, so API can change quickly
- `BREAKING` part is incremented for each breaking API change
- `ENHANCING` part is incremented for every fix and update which is compatible on API level

## [0.26.3](https://github.com/fluencelabs/fluence-js/releases/tag/0.26.3) - Oct 26, 2022

**Fluence Peer:**

Implement new builtin to work with JSON-like structures ([#195](https://github.com/fluencelabs/fluence-js/pull/195))

## [0.26.2](https://github.com/fluencelabs/fluence-js/releases/tag/0.26.2) - Oct 9, 2022

Update AVM to 0.30.11 ([#191](https://github.com/fluencelabs/fluence-js/pull/191))

## [0.26.1](https://github.com/fluencelabs/fluence-js/releases/tag/0.26.1) - Oct 9, 2022

**Compiler support:**

Add v4 version of compiler support. It makes possible to use any name for functions and data structures in aqua without colliding with variable names in FluenceJS ([#190](https://github.com/fluencelabs/fluence-js/pull/190))

## [0.26.0](https://github.com/fluencelabs/fluence-js/releases/tag/0.26.0) - Oct 7, 2022

Update AVM to version 0.30.10 ([#189](https://github.com/fluencelabs/fluence-js/pull/189))

## [0.25.2](https://github.com/fluencelabs/fluence-js/releases/tag/0.25.2) - Sep 30, 2022

Update AVM to version 0.30.5 and MarineJS to version 0.3.18 ([#187](https://github.com/fluencelabs/fluence-js/pull/187))

## [0.25.1](https://github.com/fluencelabs/fluence-js/releases/tag/0.25.1) - Sep 23, 2022

Accommodate new marine-js and avm interface ([#181](https://github.com/fluencelabs/fluence-js/pull/181))
fix(sig): update Sig guards according to new registry API ([#185](https://github.com/fluencelabs/fluence-js/pull/185))

## [0.24.1](https://github.com/fluencelabs/fluence-js/releases/tag/0.24.1) - Sep 06, 2022

Update @fluencelabs/avm to v0.27.8 and @fluencelabs/marine-js to v0.3.10 ([#180](https://github.com/fluencelabs/fluence-js/pull/180))

## [0.24.0](https://github.com/fluencelabs/fluence-js/releases/tag/0.24.0) - Sep 05, 2022

**Fluence Peer:**

Rename toB58String to getPeerId ([#178](https://github.com/fluencelabs/fluence-js/pull/178))

## [0.23.8](https://github.com/fluencelabs/fluence-js/releases/tag/0.23.8) - Sep 05, 2022

**Fluence Peer:**

Fix issue when FluenceJS was not working in webpack-based web projects ([#176](https://github.com/fluencelabs/fluence-js/pull/176))

## [0.23.7](https://github.com/fluencelabs/fluence-js/releases/tag/0.23.7) - Sep 01, 2022

**Marine JS:**

Update Marine JS to v0.3.9 ([#173](https://github.com/fluencelabs/fluence-js/pull/173))

## [0.23.6](https://github.com/fluencelabs/fluence-js/releases/tag/0.23.6) - Sep 01, 2022

**AVM:**

Update AVM to 0.27.0 ([#169](https://github.com/fluencelabs/fluence-js/pull/169))

## [0.23.5](https://github.com/fluencelabs/fluence-js/releases/tag/0.23.5) - Aug 25, 2022

Migrated to monorepo and pnpm ([#163](https://github.com/fluencelabs/fluence-js/pull/163))

## [0.23.4](https://github.com/fluencelabs/fluence-js/releases/tag/0.23.4) - Aug 05, 2022

**Fluence Peer:**

Ephemeral networks core implementation. Please note that the API is till in beta and is intended for internal use only ([#160](https://github.com/fluencelabs/fluence-js/pull/160))

## [0.23.2](https://github.com/fluencelabs/fluence-js/releases/tag/0.23.2) - Aug 04, 2022

Expose parse ast method from AVM ([#161](https://github.com/fluencelabs/fluence-js/pull/161))

## [0.23.1](https://github.com/fluencelabs/fluence-js/releases/tag/0.23.1) - Jul 07, 2022

**Fluence Peer:**

Minor updates to Fluence Peer:

- FluenceConnection: update libp2p to v0.36.2 ([#155](https://github.com/fluencelabs/fluence-js/pull/155))
- Pass logging level to AVM correctly ([#158](https://github.com/fluencelabs/fluence-js/pull/158))

## [0.23.0](https://github.com/fluencelabs/fluence-js/releases/tag/0.23.0) - Apr 26, 2022

**Marine JS:**

This is made possible thanks to Marine-JS (milestone 2). The provided API allows hosting marine services on js peer and making them accessible from aqua code. This feature blurs the line between two types of peers and enables service reuse between them.

Please note that a little upgrade is required to switch to v0.23.0: https://doc.fluence.dev/docs/fluence-js/4_run_in_browser-1#configuring-application-to-run-in-browser
If you want to learn more check out the documentation and the demo project:

https://doc.fluence.dev/docs/fluence-js/3_in_depth#using-marine-services-in-fluence-js
https://github.com/fluencelabs/marine-js-demo

Related changes:

- [#149](https://github.com/fluencelabs/fluence-js/pull/149)
- [#150](https://github.com/fluencelabs/fluence-js/pull/150)
- [#151](https://github.com/fluencelabs/fluence-js/pull/151)

**AVM:**

Passing updated RunParameters structure and support AVM v0.24.2 ([#152](https://github.com/fluencelabs/fluence-js/pull/152))

## [0.22.0](https://github.com/fluencelabs/fluence-js/releases/tag/0.22.0) - Apr 13, 2022

**SIG:**

Following the update in version _0.21.2_ changed the name of `get_key_bytes` function to `get_route_bytes` in tetraplet definition ([#148](https://github.com/fluencelabs/fluence-js/pull/148))

## [0.21.8](https://github.com/fluencelabs/fluence-js/releases/tag/0.21.8) - Apr 06, 2022

**Fluence Peer:**

Add option to print initiated particle ids. Take advantage of `debug.printParticleId` options:

```typescript
const peer = new FluencePeer();
await peer.start({
  // ...
  debug: {
    printParticleId: true,
  },
});
```

([#147](https://github.com/fluencelabs/fluence-js/pull/147))

## [0.21.7](https://github.com/fluencelabs/fluence-js/releases/tag/0.21.7) - Apr 01, 2022

**Fluence Peer:**

Throwing human-readable error for unsupported node.js versions ([#145](https://github.com/fluencelabs/fluence-js/pull/145))

## [0.21.6](https://github.com/fluencelabs/fluence-js/releases/tag/0.21.6) - Mar 23, 2022

**SIG:**

Compile signing service definition using the latest Aqua compiler ([#141](https://github.com/fluencelabs/fluence-js/pull/141))

## [0.21.4](https://github.com/fluencelabs/fluence-js/releases/tag/0.21.4) - Mar 17, 2022

**Compiler support:**

Fix issue when undefined or missing object entries were incorrectly converted to aqua ([#140](https://github.com/fluencelabs/fluence-js/pull/140))

## [0.21.3](https://github.com/fluencelabs/fluence-js/releases/tag/v0.21.3) - Mar 17, 2022

**Fluence Peer:**

Add math builtins implementation ([#139](https://github.com/fluencelabs/fluence-js/pull/139))

**Compiler support:**

Fix issue, when optional type in recursive data structures has been incorrectly translated to\from aqua into\from typescript ([#136](https://github.com/fluencelabs/fluence-js/pull/136))

## [0.21.2](https://github.com/fluencelabs/fluence-js/releases/tag/v0.21.2) - Mar 11, 2022

**SIG:**

Function `get_key_bytes` has been renamed to `get_route_bytes` according to the [change](https://github.com/fluencelabs/aqua-lib/pull/28) in aqua-lib ([#138](https://github.com/fluencelabs/fluence-js/pull/138))

## [0.21.1](https://github.com/fluencelabs/fluence-js/releases/tag/v0.21.1) - Mar 10, 2022

**AVM:**

Update AVM to v0.21.3 ([#137](https://github.com/fluencelabs/fluence-js/pull/137))

## [0.20.2](https://github.com/fluencelabs/fluence-js/releases/tag/v0.20.2) – February 23, 2022

Fix copy-avm-public script: include marine-js.wasm to the copy process ([#134](https://github.com/fluencelabs/fluence-js/pull/134))

## [0.20.1](https://github.com/fluencelabs/fluence-js/releases/tag/v0.20.1) – February 21, 2022

Add missing builtins, Implement timestamps_ms and timestamps_sec ([#133](https://github.com/fluencelabs/fluence-js/pull/133))

## ​[0.20.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.20.0) – February 18, 2022

Switch to marine-web based AquaVM runner ([#132](https://github.com/fluencelabs/fluence-js/pull/132))

## [0.19.2](https://github.com/fluencelabs/fluence-js/releases/tag/v0.19.2) – February 17, 2022

Using polyfill for Buffer in browsers ([#129](https://github.com/fluencelabs/fluence-js/pull/129))

Implement additional builtins: array_length, sha256_string, concat_strings ([#130](https://github.com/fluencelabs/fluence-js/pull/130))

Implement debug.stringify service ([#125](https://github.com/fluencelabs/fluence-js/pull/125))

Update avm version to 0.20.5 ([#131](https://github.com/fluencelabs/fluence-js/pull/131))

## [0.19.1](https://github.com/fluencelabs/fluence-js/releases/tag/v0.19.1) – February 4, 2022

Sig service redesign. ([#126](https://github.com/fluencelabs/fluence-js/pull/126))

## [0.19.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.19.0) – January 27, 2022

Update libp2p-related packages versions. Fix 'stream reset' error. ([#123](https://github.com/fluencelabs/fluence-js/pull/123))

## [0.18.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.18.0) – December 29, 2021

FluencePeer: Update AVM version to 0.20.0 ([#120](https://github.com/fluencelabs/fluence-js/pull/120))

## [0.17.1](https://github.com/fluencelabs/fluence-js/releases/tag/v0.17.1) – December 29, 2021

FluencePeer: Update AvmRunner to 0.1.2 (fix issue with incorrect baseUrl) ([#119](https://github.com/fluencelabs/fluence-js/pull/119))

## [0.17.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.17.0) – December 28, 2021

JS Peer does not embed AVM interpreter any more. Instead [AVM Runner](https://github.com/fluencelabs/avm-runner-background) is used to run AVM in background giving huge performance boost. This is a **breaking change**: all browser applications now not need to bundle `avm.wasm` file and the runner script. See [documentation](./run-in-browser.md) for more info.

([#111](https://github.com/fluencelabs/fluence-js/pull/120))

## [0.16.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.16.0) – December 22, 2021

FluencePeer: Update AVM version to 0.19.3 ([#115](https://github.com/fluencelabs/fluence-js/pull/115))

## [0.15.4](https://github.com/fluencelabs/fluence-js/releases/tag/v0.15.4) – December 13, 2021

FluencePeer: Update AVM version to 0.17.7 ([#113](https://github.com/fluencelabs/fluence-js/pull/113))

## [0.15.3](https://github.com/fluencelabs/fluence-js/releases/tag/v0.15.3) – December 10, 2021

**FluencePeer:**

- Add built-in service to sign data and verify signatures ([#110](https://github.com/fluencelabs/fluence-js/pull/110))
- Update AVM version to 0.17.6 ([#112](https://github.com/fluencelabs/fluence-js/pull/112))

## [0.15.2](https://github.com/fluencelabs/fluence-js/releases/tag/v0.15.2) – November 30, 2021

Add particleId to error message when an aqua function times out ([#106](https://github.com/fluencelabs/fluence-js/pull/106))

## [0.15.1](https://github.com/fluencelabs/fluence-js/releases/tag/v0.15.0) – November 28, 2021

**FluencePeer:**

- Fix timeout builtin error message ([#103](https://github.com/fluencelabs/fluence-js/pull/103))

**Compiler support:**

Issue fixes for `registerService` function

- Throwing error if registerService was called on a non-initialized peer.
- Fix issue with incorrect context being passed to class-based implementations of user services
- Fix typo in JSDoc

([#104](https://github.com/fluencelabs/fluence-js/pull/104))

## [0.15.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.15.0) – November 17, 2021

**FluencePeer:**

- Implement peer.timeout built-in function ([#101](https://github.com/fluencelabs/fluence-js/pull/101))
- Update AVM: add support for the restriction operator ([#102](https://github.com/fluencelabs/fluence-js/pull/102))

## [0.14.3](https://github.com/fluencelabs/fluence-js/releases/tag/v0.14.3) – November 10, 2021

**FluencePeer:**

- Extend error handling. Now aqua function calls fail early with the user-friendly error message ([#91](https://github.com/fluencelabs/fluence-js/pull/98))

**Compiler support:**

- Define and export FnConfig interface ([#97](https://github.com/fluencelabs/fluence-js/pull/97))
- Fix issue with incorrect TTL value in function calls config ([#100](https://github.com/fluencelabs/fluence-js/pull/100))

## [0.14.2](https://github.com/fluencelabs/fluence-js/releases/tag/v0.14.2) – October 21, 2021

FluencePeer: add option to specify default TTL for all new particles ([#91](https://github.com/fluencelabs/fluence-js/pull/91))

## [0.14.1](https://github.com/fluencelabs/fluence-js/releases/tag/v0.14.1) – October 20, 2021

Compiler support: fix issue with incorrect check for missing fields in service registration ([#90](https://github.com/fluencelabs/fluence-js/pull/90))

## [0.14.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.14.0) – October 20, 2021

Compiler support: added support for asynchronous code in service definitions and callback parameters of functions. ([#83](https://github.com/fluencelabs/fluence-js/pull/83))

## [0.12.1](https://github.com/fluencelabs/fluence-js/releases/tag/v0.12.1) – September 14, 2021

- `KeyPair`: add fromBytes, toEd25519PrivateKey ([#78](https://github.com/fluencelabs/fluence-js/pull/78))

## [0.12.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.13.0) – September 10, 2021

<!-- cSpell:ignore uninit -->

- The API to work with the default Fluence Peer has been put under the facade `Fluence`. Method `init` was renamed to `start` and `uninit` renamed to `stop`. `connectionStatus` migrated to `getStatus`.

To migrate from 0.11.0 to 0.12.0

1. `import { Fluence } from "@fluencelabs/fluence"`; instead of `FluencePeer`
2. replace `Fluence.default` with just `Fluence`
3. replace `init` with `start` and `uninit` with `stop`
4. replace `connectionInfo()` with `getStatus()`

([#72](https://github.com/fluencelabs/fluence-js/pull/72))

## [0.11.0](https://github.com/fluencelabs/fluence-js/releases/tag/v0.11.0) – September 08, 2021

- Update JS SDK api to the new version ([#61](https://github.com/fluencelabs/fluence-js/pull/61))
