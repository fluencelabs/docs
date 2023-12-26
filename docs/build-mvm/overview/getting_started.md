# Getting Started

Let's explore the obligatory **Hello World** example as an end-to-end Fluence Lambda application, which includes the following steps:

* Scaffold a Fluence Lambda project
* Create the Hello World example and compile it to Wasm
* Distribute the Wasm module to capacity (hardware) providers
* Execute your Fluence Lambda Hello World application

But first, let's get set up.

## Setup

### Fluence CLI

The best and recommended way to interact with the serverless hosting network is the Fluence CLI, which provides full lifecycle management for your Fluence Lambdas as well as your tooling and development dependencies.

Fluence CLI requires [node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) version 18 and can be installed as a binary:

```bash
curl -qsL https://raw.githubusercontent.com/fluencelabs/cli/main/install.sh | bash
```

:::note
No Windows support. Use Windows Linux Subsystem (WLS).
:::

:::info
You may be asked to provide sudo access to set the symlink for the binary.
Alternative installation approaches can be found in the ??? section.
:::

After the installation process is complete, you should be able to use the cli and determine its version:

```bash
fluence --version
@fluencelabs/cli/0.12.7 darwin-arm64 node-v18.17.1
```

If you get the above cli version, or higher, you are good to go. Any trouble? Contact us on the [Discord development channel](https://fluence.chat).

### Payment

Go to ??? site and follow the instructions to fund your account with <compute tokens, USDC tokens>. 
You check the availability of your <compute tokens, USDC tokens> ...



## Hello World

With the FLuence CLI installed and your billing setup, let's setup up our first project:

```bash
fluence init hello-fluence
```

You will be asked to choose between different scaffolding templates:

```bash
 fluence init hello-fluence
? Select template (Use arrow keys)
❯ quickstart
  minimal
  ts
  js
```

Select the (default) *quickstart* option and in the subsequent network selection prompt stay with the default (*kras*). Fluence CLI now scaffolds a project with the quickstart template. Since this is your first use of the Fluence CLI, several dependencies may be downloaded and installed. Once the project has been successfully scaffolded, you should see a message similar to:

```bash
Successfully initialized Fluence CLI project template at <your path>/hello-fluence
```

If you are running into any trouble, reach out in [Fluence discord]("https://fluence.chat"), otherwise cd into the *hello-fluence* directory.

Feel free to poke around the project directories and files but our next move is to build the project:

```bash
fluence build
```

** Can't do the next step. It's still deal deploy but we need Fiat onramp based logic. **

Now that your Lambda is deployed, let's call it using the Fluence CLI:

```bash
    fluence run -f 'hello_fluence("Fluence")'
```
Which results in the following response:

```
"Hi, Fluence"
```
** THe above request and response does currently not exist. The templated source does not support a simple example. **



## Aqua Workflow Engine

## Function Hosting
