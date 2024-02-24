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

After that you will see a `docker-compose.yaml` file generated in your project's `.fluence` dir. You will also be automatically switched to `local` environment if it wasn't selected already. Then CLI will run `docker compose up -d` for you and it will also register a default provider and offer on your local Fluence Network. Currently CLI has a couple of convenience commands that wrap common docker commands (run `fluence local --help` to learn more), but we encourage you to use docker itself as you please.

The default local Fluence Network at this moment has:
- 3 Nox containers
- IPFS container
- Couple of containers required for operations related to blockchain

If you want to change amount of Noxes or change default provider and offer you can update `provider.yaml` file and run `fluence local init` to generate a new `.fluence/docker-compose.yaml`. Required `secrets` and `configs` in `.fluence` will be also generated for you automatically.

You can also change `.fluence/docker-compose.yaml` directly any way you want, but be aware that it will be regenerated on `fluence local init`, and your changes might be lost.
And don't forget to run:
```sh
fluence local down
fluence local up
```
To restart your local Fluence Network with the new configuration.

Your first `fluence local up` initiates the container downloads, which may take a while, and the network configurations. Once it's all set and done, you should see something like this:

```bash
Using local blockchain environment
<...>
Successfully deposited 100 to nox-0 with tx hash: 0xfae650fcd2fdcda6ef73b158797faf5d428530ad7836d54629fc7f5f9997542d
Successfully deposited 100 to nox-1 with tx hash: 0x421eef681f3e601446491f48ef634b686b533620cad3d9c3ddfa8c149336e757
Successfully deposited 100 to nox-2 with tx hash: 0x75065283ffd42a3fe39b51dee2450518c1958fdbd33b2e7a51fd6afe0b5c461c
setProviderInfo transaction 0x993282a1bee2b320dff25a45a75365c879dce0a34453afc61edc4dd09c2caaa7 was mined successfuly

Provider successfully registered!

Provider name: defaultProvider

Provider address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

registerMarketOffer transaction 0x9be7e50cac3e277ac28ffffbecf6b8ac619bd5a6a05926843d85e2874ec1094d was mined successfuly

Offers defaultOffer successfully created!


Got offers info from chain:

Offer: defaultOffer
Provider ID: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
Offer ID: "0x8767e6c1d5c2fbc464acd39e8881e7e50af2feb589474f4a791b846ff1f668f8"
Price Per Epoch: "0.00001"
Peer Count: "3"


multicall transaction 0x404d8e9e45c084dc73777570851ce42ade9236b1dc6599414a74bd795c74e6cd was mined successfuly
Commitments 0xd9c9ebe9a4bf369087cda827745ac23a9d8e1f0baf8a84a3ea074f1d5f486df2, 0xdb2116e34ca871b8b0ac7cf225e9d1180bd02d4a276a4cef972589590d99ff74, 0xf17db8e2592c1d35c6a473ebbe78c507dfc6523bf747c2b507e7287fa62e5c93 were registered
Found created commitments for the following peers: nox-0, nox-1, nox-2
depositCollateral transaction 0xc37b8996fa9265769fc8f2f70b0b0347660e2feaf9770a852fe8debf10f02cde was mined successfuly
3 capacity commitments have been successfully activated by adding collateral!
ATTENTION: Capacity proofs are expected to be sent in next epochs!
Deposited 0.000000000000000096 collateral in total

Capacity commitment for nox-0 successfully activated!
Commitment ID: 0xd9c9ebe9a4bf369087cda827745ac23a9d8e1f0baf8a84a3ea074f1d5f486df2
Collateral: 0.000000000000000032
Peer ID: 12D3KooWDqEkeA6CSTM5mMMyGoZB4MAYoXBDj42uvKDHWWVmPqdT
Number of compute units: 32


Capacity commitment for nox-1 successfully activated!
Commitment ID: 0xdb2116e34ca871b8b0ac7cf225e9d1180bd02d4a276a4cef972589590d99ff74
Collateral: 0.000000000000000032
Peer ID: 12D3KooWMJCMCFSYkFebSy4REhchixWso8VbVBmyzAVmHmAhFuZJ
Number of compute units: 32


Capacity commitment for nox-2 successfully activated!
Commitment ID: 0xf17db8e2592c1d35c6a473ebbe78c507dfc6523bf747c2b507e7287fa62e5c93
Collateral: 0.000000000000000032
Peer ID: 12D3KooWLN8M1E6nYP6FE8gq6hxFA3BZm7JidRypPY12vDBDngEC
Number of compute units: 32
```

The local network setup handles both sides of the marketplace, provider and developer. You see the various contracts being deployed, funding allocated and commitment capacities allocated. For more details on standing up the local network, check out the docker logs. 


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

Each Nox network address contains `peer id`. Each `peer id` is derived from one of the secret keys that are stored at `.fluence/provider-secrets.yaml`. That `peer id` is also stored in the files in `.fluence/secrets`. These files are generated from `.fluence/provider-secrets.yaml` and passed to docker compose.

### Deploying To Local Network

The local network operates a little differently from the (remote) test network when it comes to signing the transactions necessary to deploy. Specifically, you need to append a private key to the deploy command rather than use your wallet to sign.

Form `fluence chain info` you see the list of accounts available on the local network. You cna pick any account, such as the last one and copy the private key.

```bash
fluence deploy --priv-key <private key you copied>
```
