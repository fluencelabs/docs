# Working With A Local Network

The simplest way to test and debug your code is to run it on a local Fluence Network using docker.

## Prerequisites

- Install [Fluence CLI](https://github.com/fluencelabs/fluence-cli) or make sure you have the latest version of CLI by running `fluence update latest`

- Running docker daemon. The simplest way to use docker is to install [Docker Desktop](https://docs.docker.com/desktop/) (We recommend using [this guide](https://docs.docker.com/desktop/) to install docker from official documentation for you OS). Don't forget to run it after installation


## Run local Fluence Network

Right now CLI works with 4 different environments `kras` (production environment), `dar`, `stage` (bleeding edge) and `local`. The environment you select controls which chain, IPFS, Nox multiaddrs, etc. will be used when you are running CLI commands

By default most of the Fluence CLI commands will prompt you to select a default environment. For working with local environment please select `local`

If you already have a Fluence Project `cd` into it and set local environment as default like this:
```sh
fluence default env local
``` 
If you're starting from scratch, init a new Fluence Project and choose a local environment for it like this:
```sh
fluence init myFluenceProject --env local
cd myFluenceProject
fluence local up
```

After that you will see a `docker-compose.yaml` file generated in your project's `.fluence` dir. You will also be automatically switched to `local` environment if it wasn't selected already. Then CLI will run `docker compose up -d` for you and it will also register a default provider and offer on your local Fluence Network. Currently CLI has a couple of convenience commands that wrap common docker commands (run `fluence local --help` to learn more), but we encourage you to use docker itself as you please

The default local Fluence Network at this moment has:
- 3 Nox containers
- IPFS container
- Couple of containers required for operations related to blockchain

If you want to change amount of Noxes or change default provider and offer you can update `provider.yaml` file and run `fluence local init` to generate a new `.fluence/docker-compose.yaml`. Required `secrets` and `configs` in `.fluence` will be also generated for you automatically

You can also change `.fluence/docker-compose.yaml` directly any way you want, but be aware that it will be regenerated on `fluence local init`, and your changes might be lost.
And don't forget to run:
```sh
fluence local down
fluence local up
```
To restart your local Fluence Network with the new configuration

## Use local Fluence Network

Now, when running e.g. `fluence run` and other CLI commands — local network will be used for all of them automatically. For the commands that require blockchain — default private key will be used automatically. You don't need Metamask when working with local network. If you want to use one of the other default private keys you can run:
```sh
fluence chain info
```
You will see `defaultAccounts` property in the output of this command. You can take any `privateKey` from there and in order to use it — just pass it as a `--priv-key` flag when running CLI commands
:::warning
We recommend to use this feature only for local development. Passing private keys as flags is not secure
:::

### Get local Fluence Network addresses

You will need Nox network [addresses](https://multiformats.io/multiaddr/) to connect to Nox using Fluence JS Client

When using `fluence run` or other CLI commands that require connecting to Fluence Network — CLI will select a random network address for your environment. You can connect to a specific address by using `--relay` flag

To get the actual network addresses you can run a CLI command:
```sh
fluence default peers local
```

You can also add one or more paths to `fluence.yaml`'s `relayPaths` property. When you run e.g. `fluence build` — `relay.json` files (that contain these network addresses) will be generated in these directories. You can read, import and use these `relay.json` files as you like. With this you don't need to change your actual JS code when switching environments using `fluence default env`

Each Nox network address contains `peer id`. Each `peer id` is derived from one of the secret keys that are stored at `.fluence/provider-secrets.yaml`. That `peer id` is also stored in the files in `.fluence/secrets`. These files are generated from `.fluence/provider-secrets.yaml` and passed to docker compose
