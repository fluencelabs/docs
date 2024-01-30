# Changelog

Aqua compiler's versioning scheme is the following: `0.BREAKING.ENHANCING.RELEASE`

* `0` shows that Aqua does not meet its vision yet, so syntax and semantics can change quickly
* `BREAKING` part is incremented for each breaking change when old `.aqua` files need to be updated to compile with the new version
* `ENHANCING` part is incremented for every syntax addition
* `RELEASE` is the release number, shows internal compiler changes, bugfixes that keep the language untouched

## [0.14.0](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.14.0) - January 30, 2024

* BREAKING CHANGE: **compiler:** Force `aqua` header for all aqua files. See [Header](./language/header/header.md). ([LNG-308](https://linear.app/fluence/issue/LNG-308)) ([#1028](https://github.com/fluencelabs/aqua/issues/1028))
* FIX: **compiler:** Correctly rename stream captured by closure. See [Streams](./language/crdt-streams.md) and [Closures](./language/closures.md). ([LNG-325](https://linear.app/fluence/issue/LNG-325))([#1055](https://github.com/fluencelabs/aqua/issues/1055))
* PERFORMANCE: **compiler:** Optimize `Inliner` ([LNG-322](https://linear.app/fluence/issue/LNG-322)) ([#1047](https://github.com/fluencelabs/aqua/issues/1047))
* PERFORMANCE: **compiler:** Optimize `Linker` ([LNG-321](https://linear.app/fluence/issue/LNG-321)) ([#1049](https://github.com/fluencelabs/aqua/issues/1049))

### [0.13.4](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.13.4) - January 11, 2024

* **compiler:** `for ... rec` instruction (not documented). ([LNG-307](https://linear.app/fluence/issue/LNG-307)) ([#1026](https://github.com/fluencelabs/aqua/issues/1026))
* **compiler:** Enhance type error message on [ability](./language/abilities.md) or [structure](./language/types.md#structures) creation (report missing fields, excessive arguments passed and types mismatch). ([LNG-313](https://linear.app/fluence/issue/LNG-313)) ([#1033](https://github.com/fluencelabs/aqua/issues/1033))
* FIX: **compiler:** Correctly capture arrows from context in nested [closures](./language/closures.md). ([LNG-317](https://linear.app/fluence/issue/LNG-317)) ([#1038](https://github.com/fluencelabs/aqua/issues/1038))
* FIX: **compiler:** Correctly capture abilities in [closures](./language/closures.md). ([LNG-314](https://linear.app/fluence/issue/LNG-314)) ([#1035](https://github.com/fluencelabs/aqua/issues/1035))
* FIX: **compiler:** Correctly type check calls to [services](./language/services.md) and [abilities](./language/abilities.md) methods (check number of arguments and their types). ([LNG-315](https://linear.app/fluence/issue/LNG-315)) ([#1037](https://github.com/fluencelabs/aqua/issues/1037))

### [0.13.3](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.13.3) - December 22, 2023

* **api:** Refactor JS API interfaces. See [JS API](./aqua-js-api.md). ([#1024](https://github.com/fluencelabs/aqua/issues/1024))
* **compiler:** By default, do not generate topological hops back to `INIT_PEER_ID` when function has no return value. In other words, function without a return value has fire-and-forget semantics by default. ([LNG-305](https://linear.app/fluence/issue/LNG-305)) ([#1019](https://github.com/fluencelabs/aqua/issues/1019))

### [0.13.2](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.13.2) - December 14, 2023

* **api:** Accept structured imports to allow correct resolving of transitive dependencies. See [Aqua JS API](./aqua-js-api.md) for more info. ([LNG-288](https://linear.app/fluence/issue/LNG-288)) ([#989](https://github.com/fluencelabs/aqua/issues/989))

### [0.13.1](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.13.1) - December 7, 2023

* **language-server:** Pass types of variables tokens to LSP to display them. See [Aqua Extension for VSCode](./getting-started/installation/installation.md). ([LNG-285](https://linear.app/fluence/issue/LNG-285)) ([#999](https://github.com/fluencelabs/aqua/issues/999))
* **compiler:** Allow returning resolved service as ability. See [Services](./language/types.md#service-type) and [Abilities](./language/types.md#ability-type). ([LNG-266](https://linear.app/fluence/issue/LNG-266)) ([#977](https://github.com/fluencelabs/aqua/issues/977))
* **compiler:** Support `*[]` (anonymous empty stream) as a function argument. See [Collections](./language/values.md#collections). ([LNG-280](https://linear.app/fluence/issue/LNG-280)) ([#967](https://github.com/fluencelabs/aqua/issues/967)) 

### [0.13.0](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.13.0) - November 22, 2023

* BREAKING CHANGE: **compiler:** Change type of `nil` literal from `*⟂` to `?⟂`. Refer to [Literals](./language/values.md#literals) to learn more about `nil`.  ([LNG-279](https://linear.app/fluence/issue/LNG-279)) ([#968](https://github.com/fluencelabs/aqua/issues/968))
* BREAKING CHANGE: **compiler:** Prohibit mutating options ([LNG-277](https://linear.app/fluence/issue/LNG-277)) ([#960](https://github.com/fluencelabs/aqua/issues/960))
* **api:** Use `js.UndefOr` for `defaultServiceId` ([#980](https://github.com/fluencelabs/aqua/issues/980))
* **compiler:** Allow omitting field name in struct creation ([LNG-261](https://linear.app/fluence/issue/LNG-261)) ([#943](https://github.com/fluencelabs/aqua/issues/943))
* **compiler:** Always generate `last` argument of `fold` ([LNG-265](https://linear.app/fluence/issue/LNG-265)) ([#947](https://github.com/fluencelabs/aqua/issues/947))
* **compiler:** Generate empty calls to `responseHandlerSrv` ([LNG-286](https://linear.app/fluence/issue/LNG-286)) ([#979](https://github.com/fluencelabs/aqua/issues/979))
* FIX: **compiler:** Generate correct stream name in AIR ([LNG-276](https://linear.app/fluence/issue/LNG-276)) ([#958](https://github.com/fluencelabs/aqua/issues/958))
* FIX: **compiler:** Do not throw exception on compilation error construction ([LNG-274](https://linear.app/fluence/issue/LNG-274)) ([#959](https://github.com/fluencelabs/aqua/issues/959))
* FIX: **compiler:** Correctly handle multiple closure returned from function calls ([LNG-262](https://linear.app/fluence/issue/LNG-262)) ([#941](https://github.com/fluencelabs/aqua/issues/941))
* FIX: **compiler:** Correctly handle incorrect creation of aliased type value ([LNG-231](https://linear.app/fluence/issue/LNG-231)) ([#946](https://github.com/fluencelabs/aqua/issues/946))
* FIX: **compiler:** Report error on unknown service or ability method call ([LNG-273](https://linear.app/fluence/issue/LNG-273)) ([#957](https://github.com/fluencelabs/aqua/issues/957))

### [0.12.4](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.12.4) - October 23, 2023
* **compiler:** Handle error function exit in tracing mode ([LNG-250](https://linear.app/fluence/issue/LNG-250)) ([#921](https://github.com/fluencelabs/aqua/issues/921))
* **compiler:** Optimize math in compile time ([LNG-245](https://linear.app/fluence/issue/LNG-245)) ([#922](https://github.com/fluencelabs/aqua/issues/922))
* **compiler:** Fix gate inlining ([LNG-253](https://linear.app/fluence/issue/LNG-253)) ([#924](https://github.com/fluencelabs/aqua/issues/924))
* **compiler:** Fix topology for adjacent `on`s ([LNG-257](https://linear.app/fluence/issue/LNG-257)) ([#929](https://github.com/fluencelabs/aqua/issues/929))
* **compiler:** Fix: passed function is not handled correctly ([LNG-260](https://linear.app/fluence/issue/LNG-260)) ([#940](https://github.com/fluencelabs/aqua/issues/940))
* **compiler:** Fix: return ability arrow ([LNG-258](https://linear.app/fluence/issue/LNG-258)) ([#935](https://github.com/fluencelabs/aqua/issues/935))

### [0.12.3](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.12.3) - September 28, 2023
* **compiler:** Make `if` propagate errors ([LNG-202](https://linear.app/fluence/issue/LNG-202)) ([#779](https://github.com/fluencelabs/aqua/issues/779))
* **compiler:** Replace `%last_error%` with `:error:` ([LNG-239](https://linear.app/fluence/issue/LNG-239)) ([#883](https://github.com/fluencelabs/aqua/issues/883))
* **compiler:** Create structs with stream maps ([LNG-244](https://linear.app/fluence/issue/LNG-244)) ([#893](https://github.com/fluencelabs/aqua/issues/893))
* **compiler:** Handle errors from result handling ([LNG-247](https://linear.app/fluence/issue/LNG-247)) ([#913](https://github.com/fluencelabs/aqua/issues/913))

### [0.12.2](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.12.2) - September 26, 2023
* **compiler:** Add warnings subsystem ([LNG-117](https://linear.app/fluence/issue/LNG-117)) ([#906](https://github.com/fluencelabs/aqua/issues/906))
* **compiler:** Fail on internal error ([LNG-229](https://linear.app/fluence/issue/LNG-229)) ([#905](https://github.com/fluencelabs/aqua/issues/905))
* **compiler:** Services as abilities ([LNG-206](https://linear.app/fluence/issue/LNG-206)) ([#873](https://github.com/fluencelabs/aqua/issues/873))
* **api:** Export types from aqua-api ([#904](https://github.com/fluencelabs/aqua/issues/904))
* **language-server:** Pass errors to LSP context ([LNG-243](https://linear.app/fluence/issue/LNG-243)) ([#888](https://github.com/fluencelabs/aqua/issues/888))
* **api:** Rethrow errors to capture stacktrace ([#907](https://github.com/fluencelabs/aqua/issues/907))
* **compiler:** Do not restrict stream args when ability is present ([LNG-233](https://linear.app/fluence/issue/LNG-233)) ([#902](https://github.com/fluencelabs/aqua/issues/902))
* **compiler:** Fix arrows capture in closures ([LNG-242](https://linear.app/fluence/issue/LNG-242)) ([#903](https://github.com/fluencelabs/aqua/issues/903))

### [0.12.1](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.12.1) - September 11, 2023
* **compiler:** Error on not arrow call after `<-` ([#876](https://github.com/fluencelabs/aqua/issues/876))
* **compiler:** Fix closure stream capture ([LNG-58](https://linear.app/fluence/issue/LNG-58)) ([#857](https://github.com/fluencelabs/aqua/issues/857))

### [0.12.0](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.12.0) - August 25, 2023
* **js-client:** Move to new js-client interface ([#855](https://github.com/fluencelabs/aqua/issues/855))
* **compiler:** Restrict abilities usage ([LNG-208](https://linear.app/fluence/issue/LNG-208)) ([#854](https://github.com/fluencelabs/aqua/issues/854))
* **compiler:** Fix nested abilities ([LNG-220](https://linear.app/fluence/issue/LNG-220)) ([#852](https://github.com/fluencelabs/aqua/issues/852))

### [0.11.9](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.9) - August 9, 2023
* **compiler:** Introduce boolean algebra ([LNG-211](https://linear.app/fluence/issue/LNG-211)) ([#814](https://github.com/fluencelabs/aqua/issues/814))
* **compiler:** Introduce equality operators ([LNG-217](https://linear.app/fluence/issue/LNG-217)) ([#820](https://github.com/fluencelabs/aqua/issues/820))
* **compiler:** Restrict exporting functions that return arrow types or ability types ([LNG-209](https://linear.app/fluence/issue/LNG-209)) ([#815](https://github.com/fluencelabs/aqua/issues/815))
* **compiler:** Fix math ops for `u64` ([LNG-204](https://linear.app/fluence/issue/LNG-204)) ([#811](https://github.com/fluencelabs/aqua/issues/811))
* **compiler:** Add support for nested abilities ([LNG-214](https://linear.app/fluence/issue/LNG-214)) ([#816](https://github.com/fluencelabs/aqua/issues/816))

### [0.11.8](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.8) - July 20, 2023
* **compiler:** Introduce abilities ([#731](https://github.com/fluencelabs/aqua/issues/731))
* **compiler:** Find and display link cycles ([#787](https://github.com/fluencelabs/aqua/issues/787))
* **compiler:** Make `on` propagate errors ([LNG-203](https://linear.app/fluence/issue/LNG-203)) ([#788](https://github.com/fluencelabs/aqua/issues/788))
* **compiler:** Make topology hop with non-FFI snippet ([LNG-125](https://linear.app/fluence/issue/LNG-123)) ([#764](https://github.com/fluencelabs/aqua/issues/764))

### [0.11.7](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.7) – June 16, 2023
* **compiler:** Fix incorrect service method renaming ([LNG-199](https://linear.app/fluence/issue/LNG-199)) ([#757](https://github.com/fluencelabs/aqua/issues/757))

### [0.11.6](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.6) – June 15, 2023
* **compiler:** Fix SO in Topology ([LNG-149](https://linear.app/fluence/issue/LNG-149)) ([#752](https://github.com/fluencelabs/aqua/issues/752))
* generate JS in Aqua API properly ([#755](https://github.com/fluencelabs/aqua/issues/755))

### [0.11.5](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.5) – June 14, 2023
* **compiler:** Fix closure passing ([LNG-92](https://linear.app/fluence/issue/LNG-92)) ([#747](https://github.com/fluencelabs/aqua/issues/747))
* **parser:** Fix compare ops parsing ([#748](https://github.com/fluencelabs/aqua/issues/748))

### [0.11.4](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.4) – June 13, 2023
* **tracing:** Introduce function calls tracing ([LNG-169](https://linear.app/fluence/issue/LNG-169)) ([#732](https://github.com/fluencelabs/aqua/issues/732))
* **aqua-api:** Compilation to js/ts for file without exports ([LNG-196](https://linear.app/fluence/issue/LNG-196))  ([#744](https://github.com/fluencelabs/aqua/issues/744))
* **compiler:** Fix closure call compilation ([LNG-193](https://linear.app/fluence/issue/LNG-193)) ([#741](https://github.com/fluencelabs/aqua/issues/741))

### [0.11.3](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.3) – June 09, 2023
* **devcontainer:** Add js-client to devcontainer ([#736](https://github.com/fluencelabs/aqua/issues/736))
* **aqua-api:** Add default constants to Aqua API ([LNG-194](https://linear.app/fluence/issue/LNG-194)) ([#738](https://github.com/fluencelabs/aqua/issues/738))

### [0.11.2](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.2) – June 07, 2023
* **aqua-api:** return JS and TS sources from API ([LNG-164](https://linear.app/fluence/issue/LNG-164)) ([#730](https://github.com/fluencelabs/aqua/issues/730))
* **language-server:** Go-to definition for path in `use` expression ([LNG-187](https://linear.app/fluence/issue/LNG-187)) ([#733](https://github.com/fluencelabs/aqua/issues/733))

### [0.11.1](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.1) – June 01, 2023
* **inline:** Fix nullable value in a nested struct ([LNG-160](https://linear.app/fluence/issue/LNG-160)) ([#724](https://github.com/fluencelabs/aqua/issues/724))

### [0.11.0](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.11.0) – May 29, 2023
* BREAKING CHANGE: add name scopes to if/else/try blocks ([LNG-55](https://linear.app/fluence/issue/LNG-55)) ([#715](https://github.com/fluencelabs/aqua/issues/715))
* **devcontainer:** Add devcontainer spec ([LNG-148](https://linear.app/fluence/issue/LNG-148)) ([#712](https://github.com/fluencelabs/aqua/issues/712))
* BREAKING CHANGE: **parser:** Strict indentation ([LNG-135](https://linear.app/fluence/issue/LNG-135)) ([#714](https://github.com/fluencelabs/aqua/issues/714))
* use new blueprint ([#708](https://github.com/fluencelabs/aqua/issues/708))

### [0.10.6](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.10.6) – May 3, 2023
* bug fix: click-to-definition for modules and abilities ([LNG-144](https://linear.app/fluence/issue/LNG-144)) ([#705](https://github.com/fluencelabs/aqua/issues/705))
* refactoring: move LSP compiler code to LSP package ([LNG-141](https://linear.app/fluence/issue/LNG-141)) ([#705](https://github.com/fluencelabs/aqua/issues/705))
* refactoring: move struct/service definitions logic to separate algebra, create locations algebra for LSP ([LNG-143](https://linear.app/fluence/issue/LNG-143)) ([#705](https://github.com/fluencelabs/aqua/issues/705))

### [0.10.5](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.10.5) – April 17, 2023
* return arrows from functions ([LNG-131](https://linear.app/fluence/issue/LNG-131)) ([#693](https://github.com/fluencelabs/aqua/issues/693))
* dependency updates

### [0.10.4](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.10.4) – April 10, 2023
* add aqua native compilation ([#681](https://github.com/fluencelabs/aqua/issues/681))
* multiline collections and objects creation ([#684](https://github.com/fluencelabs/aqua/issues/684))
* remove bangs in lambdas in AIR ([#688](https://github.com/fluencelabs/aqua/issues/688))
* bug fix: check if expression can be added to a block. Fix returning arrow in inner blocks ([#685](https://github.com/fluencelabs/aqua/issues/685))
* dependency updates

### [0.10.3](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.10.3) – February 28, 2023
* bug fix: fix type resolving for functors ([LNG-119](https://linear.app/fluence/issue/LNG-119)) ([#677](https://github.com/fluencelabs/aqua/issues/677))

### [0.10.2](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.10.2) – February 25, 2023
* bug fix: name uniquness in stream gates in AIR ([#676](https://github.com/fluencelabs/aqua/issues/676))

### [0.10.1](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.10.1) – February 16, 2023
* bug fix: parse long strings JSON ([#672](https://github.com/fluencelabs/aqua/issues/672))

### [0.10.0](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.10.0) – February 16, 2023
* BREAKING CHANGE: support new JS client ([DXJ-283](https://linear.app/fluence/issue/DXJ-283)) ([#668](https://github.com/fluencelabs/aqua/issues/668))

### [0.9.4](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.9.4) – February 1, 2023
* bug fix: Canonicalize variable in an object creation or a copy if a variable is a stream ([#649](https://github.com/fluencelabs/aqua/issues/649)) ([fedd743](https://github.com/fluencelabs/aqua/commit/fedd743721c33ccee51b2b6b8efff2b032586329))
* performance: Unfold variables in parallel where it is possible ([#656](https://github.com/fluencelabs/aqua/issues/656)) ([439f2cd](https://github.com/fluencelabs/aqua/commit/439f2cde03b5bca99b072bf7cad389168b8ad0fa))

### [0.9.3](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.9.3) – January 20, 2023
* Add `copy` method to modify a structure field while preserving immutability ([example](/docs/aqua-book/language/types.md#structures), PR: [#646](https://github.com/fluencelabs/aqua/pull/646))
* bug fix: sometimes `nil` cannot be returned from a function properly ([#629](https://github.com/fluencelabs/aqua/pull/629))
* bug fix: incorrect number of arguments error message ([#645](https://github.com/fluencelabs/aqua/pull/645))

### [0.9.2](https://github.com/fluencelabs/aqua/releases/tag/aqua-v0.9.2) – January 20, 2023
* update dependency @fluencelabs/fluence to v0.28.0

### [0.9.1](https://github.com/fluencelabs/aqua/releases/tag/0.9.1) – January 17, 2023
* Huge refactoring to make it possible to use compiler API as a JS library. Introduce new JS library ([@fluencelabs/aqua-api](https://www.npmjs.com/package/@fluencelabs/aqua-api)) with API to control Aqua compiler inside JS programs.
* many Scala and JS libraries updated

### [0.8.0](https://github.com/fluencelabs/aqua/releases/tag/0.8.0) – November 30, 2022
* Structures can be instantiated right in the code ([example](/docs/aqua-book/language/types.md#structures), PR: [#592](https://github.com/fluencelabs/aqua/pull/592))
* `module` key word was renamed to `aqua` ([docs](/docs/aqua-book/language/header/header.md#aqua-source-file-header), PR: [#592](https://github.com/fluencelabs/aqua/pull/592))
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
* Run builtin services directly from aqua run without any input
* Run services in aqua run
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

* JSON services for `aqua run`. ([#520](https://github.com/fluencelabs/aqua/pull/520)).
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

* Moving all features from deprecated `fldist` to `aqua`. All interactions with peers moved to `aqua remote` subcommand. ([#457](https://github.com/fluencelabs/aqua/pull/457))
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
* Schedule scripts using Aqua CLI ([#440](https://github.com/fluencelabs/aqua/pull/440))
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
* New network monitoring functions are added to Aqua CLI ([#393](https://github.com/fluencelabs/aqua/pull/393))
* Small improvements and bug fixes ([#395](https://github.com/fluencelabs/aqua/pull/395), [#396](https://github.com/fluencelabs/aqua/pull/396), [#394](https://github.com/fluencelabs/aqua/pull/394), [#392](https://github.com/fluencelabs/aqua/pull/392))

### [0.5.2](https://github.com/fluencelabs/aqua/releases/tag/0.5.2) – December 24, 2021

* [Topology transformations](https://github.com/fluencelabs/aqua/tree/main/model/transform) were completely rewritten: the same Aqua scripts may produce different AIR, probably more efficient, but new bugs might be introduced as well ([#371](https://github.com/fluencelabs/aqua/pull/371))
* CLI: as an effort to move all the Fluence services management routines to Aqua, uploading files to Fluence's companion IPFS is now available via Aqua CLI ([#390](https://github.com/fluencelabs/aqua/pull/390))
* CLI: bugfixes ([#388](https://github.com/fluencelabs/aqua/pull/388))

### [0.5.1](https://github.com/fluencelabs/aqua/releases/tag/0.5.1) – December 10, 2021

* CLI: Support for secret key in `aqua run` ([#375](https://github.com/fluencelabs/aqua/pull/375))
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
* You need to update _FluenceJS to 0.15.0_+ and [Fluence Node to v0.0.23](https://github.com/fluencelabs/node-distro/releases/tag/v0.0.23)+ for Aqua 0.5 support, previous versions will not work.

### [0.4.1](https://github.com/fluencelabs/aqua/releases/tag/0.4.1) – November 10, 2021

* New language feature: [closures](language/closures.md) ([#327](https://github.com/fluencelabs/aqua/pull/327))
* New CLI option `--scheduled` to compile Aqua for the Fluence's [Script Storage](libraries/aqua-lib.md) ([#355](https://github.com/fluencelabs/aqua/pull/355))
* Bugfixes for using streams to construct more complex streams ([#277](https://github.com/fluencelabs/aqua/issues/277))
* Better errors rendering ([#322](https://github.com/fluencelabs/aqua/issues/322), [#337](https://github.com/fluencelabs/aqua/issues/337))
* Bugfix for comparing Option types ([#343](https://github.com/fluencelabs/aqua/issues/343))

### [0.4.0](https://github.com/fluencelabs/aqua/releases/tag/0.4.0) – October 25, 2021

* Now Aqua compiler emits JS/TS code for [Fluence JS 0.14](https://www.npmjs.com/package/@fluencelabs/fluence). The new JS/TS SDK is heavily rewritten to _support async service functions declaration_. It also embeds a deeply refactored [AquaVM](https://github.com/fluencelabs/aquavm). ([#334](https://github.com/fluencelabs/aqua/pull/334))
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

### [0.1.10](https://github.com/fluencelabs/aqua/releases/tag/0.1.10) – July 26, 2021

* Added `<<-` operator to push a value into a stream, see #[214](https://github.com/fluencelabs/aqua/pull/214), [#209](https://github.com/fluencelabs/aqua/issues/209).
