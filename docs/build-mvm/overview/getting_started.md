# Getting Started

Let's explore the obligatory **Hello World** example as an end-to-end Fluence Cloudless App, which includes the following steps:

* Scaffold a Fluence Cloud Function project with the [Fluence CLI](../glossary.md/#fluence-cli)
* Create the Hello World example and compile it to Wasm
* Distribute the Wasm module to capacity (hardware) providers
* Execute your Fluence Functions Hello World application

But first, let's get set up.

## Setting Up

The recommended way to interact with the Fluence serverless network is to use the Fluence CLI. The CLI provides full lifecycle management for your Fluence Functions as well as your tooling and development dependencies.

Fluence CLI requires [node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) version 18 and can be installed as a binary:

```bash
curl -qsL https://raw.githubusercontent.com/fluencelabs/cli/main/install.sh | bash
```

:::note
Currently, Fluence CLI does not support native Windows OS but supports Windows Linux Subsystem (WLS).
:::


:::info
During the installation process, you may be asked to provide *sudo* access to set the symlink for the binary.
Alternative installation approaches can be found in the [Readme](https://github.com/fluencelabs/cli?tab=readme-ov-file#installation-and-usage).
:::

After the installation process is complete, you should be able to use FLuence CLI and determine its version:

```bash
fluence --version
@fluencelabs/cli/0.12.7 darwin-arm64 node-v18.17.1
```

If you get the above CLI version, or higher, you are good to go but should run `fluence update` just for good measure. Any trouble? Contact us on the Fluence discord  [development channel](https://fluence.chat).

## Hello World

With the Fluence CLI installed, let's create our *hello world* project:

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

Select the (default) *quickstart* template and in the subsequent network selection prompt continue to stay with the default (*kras*) network. Fluence CLI now scaffolds a project with the quickstart template and for the *kras* test network. Since this is your first use of the Fluence CLI, several dependencies may be downloaded and installed. Once the project has been successfully installed, you should see a message similar to:

```bash
Successfully initialized Fluence CLI project template at <your path>/hello-fluence
```

Now *cd* into the *hello-fluence* directory and feel free to poke around the project. Our next step is to run *hello world* 

```bash
$ fluence run -f 'helloWorldRemote("Fluence")' --quiet
```
Which results in the following response:

```bash
"Hi, Fluence"
```

Congratulations! You just scaffolded your first Fluence project and executed your first *Hello World* on a remote peer on the *kras* network. We'll revisit our *Hello World* project in the [Quickstart](../Quickstarts/your_first_lambda.md) section.