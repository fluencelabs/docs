# Changelog

Aqua compiler's versioning scheme is the following: `0.BREAKING.ENHANCING.RELEASE`

* `0` shows that Aqua does not meet its vision yet, so syntax and semantics can change quickly
* `BREAKING` part is incremented for each breaking change when old `.aqua` files need to be updated to compile with the new version
* `ENHANCING` part is incremented for every syntax addition
* `RELEASE` is the release number, shows internal compiler changes, bugfixes that keep the language untouched

### [0.8.0](https://github.com/fluencelabs/aqua/releases/tag/0.8.0) – November 30, 2022
* Structures can be instantiated right in the code ([example](https://fluence.dev/docs/aqua-book/language/types.md#structures), PR: [#592](https://github.com/fluencelabs/aqua/pull/592))
* `module` key word was renamed to `aqua` ([docs](https://fluence.dev/docs/aqua-book/language/header/header.md#aqua), PR: [#592](https://github.com/fluencelabs/aqua/pull/592))
* Syntax checking has been disabled in generated JS/TS files ([#585](https://github.com/fluencelabs/aqua/pull/585))
* a lot of bug fixes ([#590](https://github.com/fluencelabs/aqua/pull/590), [#584](https://github.com/fluencelabs/aqua/pull/584), [#582](https://github.com/fluencelabs/aqua/pull/582), [#581](https://github.com/fluencelabs/aqua/pull/581), [#580](https://github.com/fluencelabs/aqua/pull/580), [#578](https://github.com/fluencelabs/aqua/pull/578), [#579](https://github.com/fluencelabs/aqua/pull/579))
* bump fluence-js to version 0.27.3

### [0.7.7](https://github.com/fluencelabs/aqua/releases/tag/0.7.7) – October 18, 2022
* Fix `--timeout` flag in `aqua run`, which didn't work
* AquaVM: add null and never modes to fold instruction
* AquaVM: Canonicalize streams in service calls and if statements
* AquaVM: Stream canonicalization
* bug fixes
* bump fluence-js to latest version

### [0.7.6](https://github.com/fluencelabs/aqua/releases/tag/0.7.6) – September 22, 2022
* Run builtin services directly from aqua run without any input ([docs](https://fluence.dev/docs/aqua-book/aqua-cli/#run))
* Run services in aqua run ([docs](https://fluence.dev/docs/aqua-book/aqua-cli/#run))
* Forbid streams in structures. Restrict assignment with empty streams and arrays
* bump fluence-js to v0.25.1
* a lot of bugs fixed

### [0.7.5](https://github.com/fluencelabs/aqua/releases/tag/0.7.5) – August 22, 2022

* added AIR validation on Aqua compilation
* Aqua parser will throw an error on negative array indexes
* plugins feature added. Read here for more details
* improvements in go-to definition feature in VSCode
* a lot of bugs fixed

### [0.7.4](https://github.com/fluencelabs/aqua/releases/tag/0.7.4) – June 24, 2022

* JSON services for `aqua run.` Read [here](./aqua-cli/aqua-cli.md#run) for more details. ([#520](https://github.com/fluencelabs/aqua/pull/520)).
* Use JSON for arguments in `aqua run` without extra brackets for optional fields ([#517](https://github.com/fluencelabs/aqua/pull/517))

### [0.7.3](https://github.com/fluencelabs/aqua/releases/tag/0.7.3) – June 10, 2022

* Language server for VSCode ([#512](https://github.com/fluencelabs/aqua/pull/512))
* Go-to definitions for VSCode ([#514](https://github.com/fluencelabs/aqua/pull/514) [#516](https://github.com/fluencelabs/aqua/pull/516))
* `PARTICLE_TTL` and `PARTICLE_TIMESTAMP` constants ([#505](https://github.com/fluencelabs/aqua/pull/505))
* Bug fix: [#519](https://github.com/fluencelabs/aqua/pull/519) [#518](https://github.com/fluencelabs/aqua/pull/518) [#509](https://github.com/fluencelabs/aqua/pull/509) [#507](https://github.com/fluencelabs/aqua/pull/507) [#508](https://github.com/fluencelabs/aqua/pull/508) [#510](https://github.com/fluencelabs/aqua/pull/510) [#513](https://github.com/fluencelabs/aqua/pull/513) [#504](https://github.com/fluencelabs/aqua/pull/504)

### [0.7.2](https://github.com/fluencelabs/aqua/releases/tag/0.7.2) – April 26, 2022

* FluenceJS was updated to 0.23.0 ([#503](https://github.com/fluencelabs/aqua/pull/503))
* `noXor`, `noRelay`, `const` and `verbose` options in `aqua run (`[#473](https://github.com/fluencelabs/aqua/issues/473) [#475](https://github.com/fluencelabs/aqua/issues/475))
* `aqua run` functions can now handle arrays as arguments ([#497](https://github.com/fluencelabs/aqua/pull/497))
* `aqua run` will match JSON arguments with given types ([#492](https://github.com/fluencelabs/aqua/pull/492))
* aqua fully supports mathematical expressions ([#476](https://github.com/fluencelabs/aqua/pull/476))
* A lot of help and error messages were rewritten ([#494](https://github.com/fluencelabs/aqua/pull/494))
* A lot of bug fixes: ([#499](https://github.com/fluencelabs/aqua/issues/499) [#463](https://github.com/fluencelabs/aqua/issues/463) [#85](https://github.com/fluencelabs/aqua/issues/85) [#166](https://github.com/fluencelabs/aqua/issues/166) [#435](https://github.com/fluencelabs/aqua/issues/435) [#460](https://github.com/fluencelabs/aqua/issues/460) [#473](https://github.com/fluencelabs/aqua/issues/473) [#478](https://github.com/fluencelabs/aqua/issues/478) [#385](https://github.com/fluencelabs/aqua/issues/385))

### [0.7.1](https://github.com/fluencelabs/aqua/releases/tag/0.7.1) – March 25, 2022

* Now Aqua supports [arithmetic operators](./language/values.md#arithmetic-operators) (e.g. `1 + x`), arrow calls in any place (e.g. `for x <- foo(3 + bar()) par`...) and simple comparison (e.g. `if a > 3`) ([#461](https://github.com/fluencelabs/aqua/pull/461) -> [#410](https://github.com/fluencelabs/aqua/issues/410))
* Aqua CLI fixes ([#466](https://github.com/fluencelabs/aqua/pull/466), [#465](https://github.com/fluencelabs/aqua/pull/465), [#464](https://github.com/fluencelabs/aqua/pull/464), [#462](https://github.com/fluencelabs/aqua/pull/462))

### [0.7.0](https://github.com/fluencelabs/aqua/releases/tag/0.7.0) – March 22, 2022

* Moving all features from deprecated `fldist` to `aqua`. All interactions with peers moved to `aqua remote` subcommand. Descriptions of all commands can be found in [here](./aqua-cli/aqua-cli.md) ([#457](https://github.com/fluencelabs/aqua/pull/457))
* Update FluenceJS to 0.21.5 ([#456](https://github.com/fluencelabs/aqua/pull/456))
* Switching to v3 FluenceJS API. Improves JS support for optional Aqua types ([#453](https://github.com/fluencelabs/aqua/pull/453))
* Add message when function not found ([#454](https://github.com/fluencelabs/aqua/pull/454))

### [0.6.4](https://github.com/fluencelabs/aqua/releases/tag/0.6.4) – March 15, 2022

* [Closures capture their topological context](language/closures.md) now ([#356](https://github.com/fluencelabs/aqua/issues/356))
* Small changes ([#452](https://github.com/fluencelabs/aqua/pull/452), [#449](https://github.com/fluencelabs/aqua/pull/449), [#450](https://github.com/fluencelabs/aqua/pull/450))

### [0.6.3](https://github.com/fluencelabs/aqua/releases/tag/0.6.3) – March 4, 2022

* Added [collections creation syntax](language/values.md#collections) ([#445](https://github.com/fluencelabs/aqua/pull/445))

### [0.6.2](https://github.com/fluencelabs/aqua/releases/tag/0.6.2) – February 24, 2022

* Added top and bottom types to the parser – will be used for debugging functions ([#442](https://github.com/fluencelabs/aqua/pull/442))
* [Schedule scripts](aqua-cli/scheduling-scripts.md) using Aqua CLI ([#440](https://github.com/fluencelabs/aqua/pull/440))
* Better timeouts handling for CLI ([#437](https://github.com/fluencelabs/aqua/pull/437))

### [0.6.1](https://github.com/fluencelabs/aqua/releases/tag/0.6.1) – February 16, 2022

* `aqua dist deploy` to deploy a service to the Fluence network ([#413](https://github.com/fluencelabs/aqua/pull/413), [#419](https://github.com/fluencelabs/aqua/pull/419), [#422](https://github.com/fluencelabs/aqua/pull/422), [#431](https://github.com/fluencelabs/aqua/pull/431))
* `aqua dist remove` to remove a deployed service ([#428](https://github.com/fluencelabs/aqua/pull/428))
* `aqua env` to show a list of known Fluence peers ([#434](https://github.com/fluencelabs/aqua/pull/434))
* Many, many bugfixes ([#414](https://github.com/fluencelabs/aqua/pull/414), [#415](https://github.com/fluencelabs/aqua/pull/415), [#420](https://github.com/fluencelabs/aqua/pull/420), [#426](https://github.com/fluencelabs/aqua/issues/426), [#427](https://github.com/fluencelabs/aqua/issues/427))
* Dependencies updated ([#430](https://github.com/fluencelabs/aqua/pull/430))

### [0.6.0](https://github.com/fluencelabs/aqua/releases/tag/0.6.0) – February 4, 2022

* Big internal refactoring for better testability & inline syntax additions ([#403](https://github.com/fluencelabs/aqua/pull/403)) – breaks backward compatibility due to breaking change in Fluence-JS
* Join expression was changed to generate `noop` ([#406](https://github.com/fluencelabs/aqua/pull/406))
* Now can use default imports for `aqua` compile just like in `aqua run` ([#400](https://github.com/fluencelabs/aqua/issues/400))
* Added helper for `aqua run` development process ([#407](https://github.com/fluencelabs/aqua/pull/407))
* Various bugfixes ([#412](https://github.com/fluencelabs/aqua/pull/412), [#405](https://github.com/fluencelabs/aqua/pull/405), [#397](https://github.com/fluencelabs/aqua/issues/397))

### [0.5.3](https://github.com/fluencelabs/aqua/releases/tag/0.5.3) – January 13, 2022

* New expression: [explicit `join` to wait](language/flow/parallel.md#explicit-join-expression) for results computed in parallel branches ([#402](https://github.com/fluencelabs/aqua/pull/402))
* New syntax to [access a collection element by index](language/values.md#getters): `array[5]`. With this syntax, non-literal indices are allowed, like `array[conf.length]` ([#401](https://github.com/fluencelabs/aqua/pull/401))
* Refactoring of the compiler's internals: introducing `raw` model for values ([#398](https://github.com/fluencelabs/aqua/pull/398))
* New network monitoring functions are added to [CLI](aqua-cli/aqua-cli.md#run) ([#393](https://github.com/fluencelabs/aqua/pull/393))
* Small improvements and bug fixes ([#395](https://github.com/fluencelabs/aqua/pull/395), [#396](https://github.com/fluencelabs/aqua/pull/396), [#394](https://github.com/fluencelabs/aqua/pull/394), [#392](https://github.com/fluencelabs/aqua/pull/392))

### [0.5.2](https://github.com/fluencelabs/aqua/releases/tag/0.5.2) – December 24, 2021

* [Topology transformations](https://github.com/fluencelabs/aqua/tree/main/model/transform) were completely rewritten: the same Aqua scripts may produce different AIR, probably more efficient, but new bugs might be introduced as well ([#371](https://github.com/fluencelabs/aqua/pull/371))
* CLI: as an effort to move all the Fluence services management routines to Aqua, uploading files to Fluence's companion IPFS is now available via Aqua CLI ([#390](https://github.com/fluencelabs/aqua/pull/390))
* CLI: bugfixes ([#388](https://github.com/fluencelabs/aqua/pull/388))

### [0.5.1](https://github.com/fluencelabs/aqua/releases/tag/0.5.1) – December 10, 2021

* CLI: Support for [secret key](aqua-cli/aqua-cli.md#create-key-pair) in `aqua run` ([#375](https://github.com/fluencelabs/aqua/pull/375))
* CLI: Add log level, print generated AIR ([#368](https://github.com/fluencelabs/aqua/pull/368))
* Improved topology calculation in `par` blocks ([#369](https://github.com/fluencelabs/aqua/pull/369))
* JAR file is not pushed to releases anymore. JS is the sole compilation target now
* CLI: path to [@fluencelabs/aqua-lib](./libraries/aqua-lib.md) is provided as an imports folder by default. `import "@fluencelabs/aqua-lib/builtin.aqua"` should always work now, even outside of an NPM project ([#384](https://github.com/fluencelabs/aqua/pull/384))
* CLI: Pass arguments to `aqua run` as JSON via `--data` or `--data-path` flag ([#386](https://github.com/fluencelabs/aqua/pull/386))

### [0.5.0](https://github.com/fluencelabs/aqua/releases/tag/0.5.0) – November 24, 2021
<!-- cSpell:ignore httpsgithubcomfluencelabsfluence-jsreleasestagv -->
* Breaking semantic change: [Stream restrictions](language/crdt-streams.md#stream-restrictions). This fixes many obscure bugs which happened when using streams inside `for` cycles ([#321](https://github.com/fluencelabs/aqua/issues/321))
* This version of Aqua is not compatible with `fldist` so far (cannot run the emitted `AIR` via `fldist`). Use `aqua run` to run Aqua instead ([#358](https://github.com/fluencelabs/aqua/pull/358))
* Added timeout parameter support for `aqua run` ([#360](https://github.com/fluencelabs/aqua/pull/360))
* You need to update [FluenceJS to 0.15.0](../build/fluence-js/changelog.md#0150httpsgithubcomfluencelabsfluence-jsreleasestagv0150-–-november-17-2021)+ and [Fluence Node to v0.0.23](https://github.com/fluencelabs/node-distro/releases/tag/v0.0.23)+ for Aqua 0.5 support, previous versions will not work.

### [0.4.1](https://github.com/fluencelabs/aqua/releases/tag/0.4.1) – November 10, 2021

* New language feature: [closures](language/closures.md) ([#327](https://github.com/fluencelabs/aqua/pull/327))
* New CLI option `--scheduled` to compile Aqua for the Fluence's [Script Storage](libraries/aqua-lib.md) ([#355](https://github.com/fluencelabs/aqua/pull/355))
* Bugfixes for using streams to construct more complex streams ([#277](https://github.com/fluencelabs/aqua/issues/277))
* Better errors rendering ([#322](https://github.com/fluencelabs/aqua/issues/322), [#337](https://github.com/fluencelabs/aqua/issues/337))
* Bugfix for comparing Option types ([#343](https://github.com/fluencelabs/aqua/issues/343))

### [0.4.0](https://github.com/fluencelabs/aqua/releases/tag/0.4.0) – October 25, 2021

* Now Aqua compiler emits JS/TS code for [Fluence JS 0.14](https://www.npmjs.com/package/@fluencelabs/fluence). The new JS/TS SDK is heavily rewritten to [support async service functions declaration](../build/fluence-js/in-depth.md#using-asynchronous-code-in-callbacks). It also embeds a deeply refactored [AquaVM](https://github.com/fluencelabs/aquavm). ([#334](https://github.com/fluencelabs/aqua/pull/334))
* Various bugfixes for AIR generation and the compiler behavior ([#328](https://github.com/fluencelabs/aqua/pull/328), [#335](https://github.com/fluencelabs/aqua/pull/335), [#336](https://github.com/fluencelabs/aqua/pull/336), [#338](https://github.com/fluencelabs/aqua/pull/338))

### [0.3.2](https://github.com/fluencelabs/aqua/releases/tag/0.3.2) – October 13, 2021

* Experimental feature: now can run Aqua from Aqua CLI ([#324](https://github.com/fluencelabs/aqua/pull/324)):

```sh
aqua run -i aqua/caller.aqua -f "callFunc(\"arg1\",\"arg2\")"
```

* Many performance-related updates, compiler now runs faster ([#308](https://github.com/fluencelabs/aqua/pull/308), [#324](https://github.com/fluencelabs/aqua/pull/324))
* UX improvements for CLI and JS/TS backend ([#307](https://github.com/fluencelabs/aqua/pull/307), [#313](https://github.com/fluencelabs/aqua/pull/313), [#303](https://github.com/fluencelabs/aqua/pull/303), [#305](https://github.com/fluencelabs/aqua/pull/305), [#301](https://github.com/fluencelabs/aqua/pull/301), [#302](https://github.com/fluencelabs/aqua/pull/302))

### [0.3.1](https://github.com/fluencelabs/aqua/releases/tag/0.3.1) – September 13, 2021

* Now `.aqua` extension in imports is optional: you may `import "file.aqua"` or just `import "file"` with the same effect ([#292](https://github.com/fluencelabs/aqua/pull/292))
* CLI improvements: `--dry` run ([#290](https://github.com/fluencelabs/aqua/pull/290)), output directory is created if not present ([#287](https://github.com/fluencelabs/aqua/pull/287))
* Many bugfixes: for imports ([#289](https://github.com/fluencelabs/aqua/pull/289)), TypeScript backend ([#285](https://github.com/fluencelabs/aqua/pull/285), [#294](https://github.com/fluencelabs/aqua/pull/294), [#298](https://github.com/fluencelabs/aqua/pull/298)), and language semantics ([#275](https://github.com/fluencelabs/aqua/issues/275)).

### [0.3.0](https://github.com/fluencelabs/aqua/releases/tag/0.3.0) – September 8, 2021

* TypeScript output of the compiler now targets a completely rewritten TypeScript SDK ([#251](https://github.com/fluencelabs/aqua/pull/251))
* Constants are now `UPPER_CASED`, including always-available `HOST_PEER_ID` and `INIT_PEER_ID` ([#260](https://github.com/fluencelabs/aqua/pull/260))
* The compiler is now distributed as [@fluencelabs/aqua](https://www.npmjs.com/package/@fluencelabs/aqua) package (was `aqua-cli`) ([#278](https://github.com/fluencelabs/aqua/pull/278))
* `aqua` is the name of the compiler CLI command now (was `aqua-cli`) ([#278](https://github.com/fluencelabs/aqua/pull/278))
* JVM version of the compiler is now available with `aqua-j` command; JS build is called by default – so no more need to have JVM installed ([#278](https://github.com/fluencelabs/aqua/pull/278))
* Now you can have a file that contains only a header with imports, uses, declares, and exports, and no new definitions ([#274](https://github.com/fluencelabs/aqua/pull/274))

### [0.2.1](https://github.com/fluencelabs/aqua/releases/tag/0.2.1) – August 31, 2021

* Javascript build of the compiler is now distributed via NPM: to run without Java, use `aqua-js` command ([#256](https://github.com/fluencelabs/aqua/pull/256))
* Now dots are allowed in the module declarations: `module Space.Module` & many bugfixes ([#258](https://github.com/fluencelabs/aqua/pull/258))

### [0.2.0](https://github.com/fluencelabs/aqua/releases/tag/0.2.0) – August 27, 2021

* Now the compiler emits AIR with the new `(ap` instruction, hence it's not backwards compatible ([#241](https://github.com/fluencelabs/aqua/pull/241))
* Many performance optimizations and bugfixes ([#255](https://github.com/fluencelabs/aqua/pull/255), [#254](https://github.com/fluencelabs/aqua/pull/254), [#252](https://github.com/fluencelabs/aqua/pull/252), [#249](https://github.com/fluencelabs/aqua/pull/249))

### [0.1.14](https://github.com/fluencelabs/aqua/releases/tag/0.1.14) – August 20, 2021

* Aqua file header changes: `module`, `declares`, `use`, `export` expressions ([#245](https://github.com/fluencelabs/aqua/pull/245)), see [Imports and Exports](language/header/header.md) for the docs.
* Experimental Scala.js build of the compiler ([#247](https://github.com/fluencelabs/aqua/pull/247))

### [0.1.13](https://github.com/fluencelabs/aqua/releases/tag/0.1.13) – August 10, 2021

* Functions can export (return) several values, see [#229](https://github.com/fluencelabs/aqua/pull/229)
* Internal changes: migrate to Scala3 ([#228](https://github.com/fluencelabs/aqua/pull/228)), added Product type ([#168](https://github.com/fluencelabs/aqua/pull/225))

### [0.1.12](https://github.com/fluencelabs/aqua/releases/tag/0.1.12) – August 4, 2021

* Can have functions consisting of a return operand only, returning a literal or an argument

### [0.1.11](https://github.com/fluencelabs/aqua/releases/tag/0.1.11) – August 3, 2021

* Added `host_peer_id` , a predefined constant that points on the relay if Aqua compilation is configured so, and on `%init_peer_id%` otherwise, see [#218](https://github.com/fluencelabs/aqua/issues/218).

### 0.1.10 – July 26, 2021

* Added `<<-` operator to push a value into a stream, see #[214](https://github.com/fluencelabs/aqua/pull/214), [#209](https://github.com/fluencelabs/aqua/issues/209).
