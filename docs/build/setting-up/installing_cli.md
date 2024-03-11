# Installing And Working With Fluence CLI

[Fluence CLI](./../glossary#fluence-cli) is your one-stop command line interface to creating, deploying, paying, running, monitoring and removing Fluence Cloudless resources to/from the network.

:::info
Fluence CLI works on Linux, macOS and currently has experimental support for Windows. Learn more [here](https://github.com/fluencelabs/cli?tab=readme-ov-file#windows)
:::

## Installing Fluence CLI

Before you can install Fluence CLI, you need to have node
The easiest and quickest way to install Fluence CLI is using the install script. Copy and paste below to your command line and hit return:

```bash
curl -qsL https://raw.githubusercontent.com/fluencelabs/cli/main/install.sh | bash
```

This may make take some time and depending on your setup, you be prompted to *sudo* a symlink. Once the installation is complete make sure you update to the latest version with `fluence update stable` and then check the version, which should be similar to below or higher:

```bash
$ fluence --version
@fluencelabs/cli/0.15.10 darwin-arm64 node-v18.19.
```

Alternatively, you can update CLI to specific network versions, e.g., **dar** or **kras**, with `fluence update dar` or `fluence update kras`, respectively. Updating to `stable` is the preferred and mostly safe choice. See the [Fluence CLI](https://github.com/fluencelabs/cli/tree/main) repo for additional documentation.


### Dependencies

The install script takes care of the installation process, which includes the installation of node and npm. Moreover, CLI installs, at time lazily, a set of Fluence libraries and SDKs and Rust. 

You can list and manage your dependencies with Fluence CLI. Let's see what's installed:

```bash
$ fluence dep v
```

If this is the first time you are using Fluence CLI, your output may differ:

```bash
Fluence CLI version: 0.15.5
nox version: fluencelabs/nox:0.20.1
rust toolchain: nightly-2023-08-27-x86_64
aqua dependencies that you can install or update using 'fluence dep i <name>@<version>':
  "@fluencelabs/aqua-lib": 0.9.1
  "@fluencelabs/spell": 0.6.9
marine and mrepl dependencies that can be overridden in fluence.yaml using marineVersion and mreplVersion properties:
  marine: 0.19.2
  mrepl: 0.26.2
internal dependencies:
  "@fluencelabs/air-beautify-wasm": 0.3.6
  "@fluencelabs/aqua-api": 0.14.2
  "@fluencelabs/aqua-to-js": 0.3.5
  "@fluencelabs/deal-ts-clients": 0.6.1
  "@fluencelabs/fluence-network-environment": 1.1.2
  "@fluencelabs/js-client": 0.8.3
  "@fluencelabs/npm-aqua-compiler": 0.0.3
internal aqua dependencies:
  "@fluencelabs/installation-spell": 0.6.9
js-client dependencies:
  "@fluencelabs/avm": 0.59.0
  "@fluencelabs/marine-worker": 0.5.1
  "@fluencelabs/threads": ^2.0.0
  "@fluencelabs/interfaces": 0.11.0
  "@fluencelabs/js-client-isomorphic": 0.5.0

```

Fluence CLI only installs what it needs and lazily adds what it doesn't have. This especially pertains to dependencies needed for the development of your compute functions such as Rust and various [Marine](./../glossary#marine) dependencies. However, you can install all dependencies at once including Rust, if needed, with:

```bash
$ fluence dep i
```
In addition, you have `fluence dep reset` and `fluence dep uninstall` to reset your dependencies to the default of you CLI version or to uninstall a version, respectively. 

::: info
Your Rust setup requires the `wasm32-wasi` compile target to be able to generate the Wasm modules. You can check your system with `rustup target list --installed|grep wasm3`. If the `wasm32-wasi` target is missing, install it with `rustup target install wasm32-wasi`.
:::


Dependencies are installed and managed in the `~/.fluence` directory. Let's have a look:

```bash
bebo.mbpM2 ~ $ tree -L 3 ~/.fluence
/Users/bebo/.fluence
├── cargo
│   ├── marine
│   │   ├── 0.17.0
│   │   ├── 0.19.0
│   │   └── 0.19.2
│   └── mrepl
│       ├── 0.24.0
│       ├── 0.26.0
│       └── 0.26.2
├── cli
│   ├── LICENSE
│   ├── README.md
│   ├── bin
│   │   ├── dev.js
│   │   ├── fluence
│   │   ├── fluence.cmd
│   │   ├── node
│   │   └── run.js
│   ├── dist
│   │   ├── baseCommand.d.ts
│   │   ├── baseCommand.js
│   │   <...>
│   │   └── versions.json
│   ├── node_modules
│   │   ├── @achingbrain
│   │   <...>
│   │   └── zod
│   ├── package.json
│   └── yarn.lock
├── config.yaml
├── npm
│   └── @fluencelabs
│       ├── aqua-lib
│       ├── registry
│       └── spell
├── schemas
│   └── config.json
├── secrets
│   └── auto-generated.txt
└── tmp
    ├── cargo
    └── npm
        └── @fluencelabs

615 directories, 25 files
```

Your output may look very differently but you should note that different versions for a particular package can be installed globally, i.e., in the `.~/.fluence` directory and pinned to a particular CLI project. More on that latter.

Note that if you want to use the Fluence local network, you need to have [Docker](https://www.docker.com/products/docker-desktop/) installed.


### Target Audience

The Fluence CLI supports the needs of  developers, capacity providers and delegators. Some functionality is shared, others is more target specific and bundled under the `fluence provider` and `fluence delegator` topics, respectively.

## A Quick Tour Of CLI

As mentioned earlier, the Fluence Cloudless development and production ecosystem is comprised of different networks ranging from production mainnet to a local network. At times, these networks represent different forks and require different dependency versions to function properly. Fluence CLI allows you to switch your development environment depending on your target choice and maintain the appropriate dependencies.

### CLI Versioning

To update yur CLI version to the correct environment, use the `fluence update` command:

```bash
$ fluence update [CHANNEL] [-a] [--force] [-i | -v <value>]
```

If you wanted to update you version to the latest `dar` (testnet) version, you run:

```bash
$ fluence update kras
```

See `fluence update --help` for mor examples.


### Fluence CLI Templates

The CLI ships with several templates that allow you to scaffold a project quickly and in line with your requirements:

* minimal
    * basic scaffold with no pre-population of compute services 
* quickstart
    * scaffold with installed compute service
* ts
    * scaffold suitable for compute services with TypeScript frontend
* js
    * scaffold suitable for compute services with JS frontend

### Fluence CLI Key Management

In order for Fluence CLI to be able to securely interact and communicate with peers in Fluence’s peer-to-peer network, cryptographic keys are required for encryption and authentication. By defaut, CLI creates and manages such keys for you in the `~/.fluence/secrets` directory, which apply to all of your projects unless create a project-specific key. Project keys are by default stored in the `.fluence/secrets` dir of your project or any other location you specify.

```bash
$ fluence key new

? Enter secret key name to generate at
<your path>/keys-demo/.fluence/secrets: my-project-keys
? Do you want to set my-project-keys as default secret key at
<your path>/keys-demo/fluence.yaml: Yes
Secret key with name my-project-keys successfully generated and saved to <your path>/keys-demo/.fluence/secrets
```

Check out all things key-related with `fluence key --help`.

:::info
The keys created and managed by Fluence CLI are for the purpose of peer identification and content encryption related to Fluence's off-chain, peer-to-peer compute network. Fluence CLI is not involved in managing your crypto (wallet) keys.
:::

### Creating a Project

You create a Fluence project with the `fluence init` command, which gives you a few options to name and configure your scaffold:

```bash
 $ fluence init [PATH] [--no-input] [-t <value>] [--env <value>] [--noxes <value>]

ARGUMENTS
  PATH  Project path

FLAGS
  -t, --template=<value>                           Template to use for the project. One of: quickstart, minimal, ts, js
      --env=<dar | stage | kras | local | custom>  Fluence Environment to use when running the command
      --no-input                                   Don't interactively ask for any input from the user
      --noxes=<value>                              Number of Compute Peers to generate when a new provider.yaml is created

```

If we wanted to scaffold a new project called *cli-tour*, with a minimal scaffold and the `dar` deployment target, you:

```bash
$ fluence init cli-tour -t minimal --env dar
```

You should see `Successfully initialized Fluence CLI project template at <your path>/cli-tour`. `cd` into you new dir and poke around a bit:

```bash
$ tree -L 3 -a
.
├── .fluence                                   (1)
│   ├── aqua
│   │   ├── deals.aqua
│   │   ├── hosts.aqua
│   │   └── services.aqua
│   ├── aqua-dependencies
│   │   ├── node_modules
│   │   ├── package-lock.json
│   │   └── package.json
│   ├── env.yaml
│   ├── schemas
│   │   ├── env.json
│   │   ├── fluence.json
│   │   └── workers.json
│   └── workers.yaml
├── .gitignore
├── .vscode
│   └── extensions.json
├── README.md
├── fluence.yaml                                 (2)
└── src                                          (3)
    └── aqua
        └── main.aqua

9 directories, 15 files
```

Let's focus on the three numbered sections:

* (1) The `.fluence` directory holds the various artifacts necessary to manage both the project and deployment. That includes *schemas* and project-specific dependencies as well as a reference to the active environment in the *env.yaml* file. As your project evolves through adding services, spells and aqua scripts, and deploying to the `dar` network, `.fluence` is updated and holds the latest references, meta data and data pertaining to your project
* (2) The *fluence.yaml* file holds all the information about dependencies, [Cloudless Deployment](./../glossary#cloudless-deployment) and compilation specific references. 
* (3) The `src` directory holds all the source fils including aqua scripts. As you add [Marine Services](./../glossary#marine-service) or [Spells](./../glossary#spell), these artifacts are recorded and referenced in *fluence.yaml* and provide the canonical reference for CLI when the time comes to package all artifacts fro deployment. A valid CLI project requires an aqua file and the minimal template accounts for that requirement. go ahead and check out the scripts in *main.aqua*.  

Feel free to check out the various files and go ahead and initiated additional projects with the different templates and do some comparison. For a complete enumeration and annotation of all files, see the [Configs](https://github.com/fluencelabs/cli/blob/main/docs/configs/README.md) reference.





