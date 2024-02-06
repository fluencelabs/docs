# Using local Fluence Network

The simplest way to test and debug your code is to run it on a local Fluence Network using docker.

## Prerequisites

- Install [Fluence CLI](https://github.com/fluencelabs/fluence-cli)

- Ths simplest way to use docker is to install [Docker Desktop](https://docs.docker.com/desktop/) (We recommend using [this guide](https://docs.docker.com/desktop/) to install docker from official documentation for you OS)


## Run local Fluence Network

Right now CLI works with 4 different environments `kras` (production environment), `testnet`, `stage` (bleeding edge) and `local`. The environment you select controls which chain, IPFS, Nox addresses, etc. will be used when you running CLI commands 

If you already have a Fluence Project `cd` into it and set local environment as default like this:
```sh
fluence default env local
``` 
Or you can init a new Fluence Project and choose a local environment for it like this
```sh
fluence init --env local
```

Make sure docker daemon is running (e.g. by just running Docker Desktop application) and then run:
```sh
fluence local up
```

After that you will see a `docker-compose.yaml` file generated in your project's `.fluence` dir. Then CLI will run `docker compose up -d` for you and it will also register a default provider and offer on your local Fluence Network. Currently CLI has a couple of convenience commands that wrap common docker commands (run `fluence local --help` to learn more), but we encourage you to use docker itself as you please

The default local Fluence Network at this moment has:
- 3 Nox containers
- IPFS container
- Couple of containers required for operations related to blockchain

If you want to change amount of Noxes or change default provider and offer you can update `provider.yaml` file and run `fluence local init` to generate a new `.fluence/docker-compose.yaml`. Required `secrets` and `configs` in `.fluence` will be also generated for you automatically

You can also change `.fluence/docker-compose.yaml` directly any way you want

Don't forget to run
```sh
fluence local down
fluence local up
```
To restart your local Fluence Network with the new configuration

## Use local Fluence Network addresses

As you might already know Nox network addresses (that you need to connect to Nox using e.g. [Fluence JS Client](./js-client/1-js-client.md)) contain `peer id`. And that `peer id` is derived from the secret key that is stored at `.fluence/provider-secrets.yaml` and also stored in the form of the files in `.fluence/secrets` (these files are generated from `.fluence/provider-secrets.yaml` and passed to docker compose)

To get the actual network addresses you can run a CLI command like this:
```sh
fluence default peers local
```

You can also add one or more paths to `fluence.yaml`'s `relayPaths` property. When you run e.g. `fluence build` — `relay.json` files will be generated in these directories that contain these network addresses. You can read, import and use these `relay.json` files as you like. With this you don't need to change your actual JS code when switching environments using `fluence default env`
