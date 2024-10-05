# Getting Started

Let's explore the obligatory **Hello World** example as an end-to-end Fluence Cloudless App, which includes the following steps:

- Scaffold a Fluence Cloud Function project with the [Fluence CLI](./../glossary#fluence-cli)
- Create the Hello World example and compile it to Wasm
- Distribute the Wasm module to capacity (hardware) providers
- Execute your Fluence Functions Hello World application

But first, let's get set up.

## Setting Up

The recommended way to interact with the Fluence serverless network is to use the Fluence CLI. The CLI provides full lifecycle management for your Fluence Functions as well as your tooling and development dependencies. If you haven't installed the Fluence CLI already, use the install script provided below or check out the [Setting up](./../setting-up/setting-up/setting-up.md) section.

```bash
curl -qsL https://raw.githubusercontent.com/fluencelabs/cli/main/install.sh | bash
```

:::note
Currently, Fluence CLI does not support Windows OS but supports Windows Linux Subsystem (WLS).
:::

:::info
During the installation process, you may be asked to provide _sudo_ access to set the symlink for the binary.
Alternative installation approaches can be found in the [Readme](https://github.com/fluencelabs/cli?tab=readme-ov-file#installation-and-usage).
:::

After the installation process is complete, update the CLI with `fluence update stable` and check the version:

```bash
fluence --version
@fluencelabs/cli/0.15.10 darwin-arm64 node-v18.19.1
```

If you get the above CLI version, or higher, you are good to go.

## Hello World

With the Fluence CLI installed, let's create our _hello world_ project:

```bash
fluence init hello-fluence
```

You will be asked to choose from different scaffolding templates:

```bash
 fluence init hello-fluence
? Select template (Use arrow keys)
❯ quickstart
  minimal
  ts
  js
```

Select the (default) _quickstart_ template and in the subsequent network selection prompt continue to stay with the default (_kras_) network. Fluence CLI now scaffolds a project with the quickstart template and for the _kras_ test network. Since this is your first use of the Fluence CLI, several dependencies may be downloaded and installed. Once the project has been successfully installed, you should see a message similar to:

```bash
Successfully initialized Fluence CLI project template at <your path>/hello-fluence
```

Now _cd_ into the _hello-fluence_ directory and feel free to poke around the project. Our next step is to run _hello world_

```bash
$ fluence run -f 'helloWorldRemote("Fluence")' --quiet
```

Which results in the following response:

```bash
"Hi, Fluence"
```

Congratulations! You just scaffolded your first Fluence project and executed your first _Hello World_ on a remote peer on the _dar_ test network. We'll revisit our _Hello World_ project in the [Quickstart](./../quickstarts/your_first_function.md) section.
