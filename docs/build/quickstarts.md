# Blockchain-based deployments quickstart

Fluence's mode of a decentralized cloud allows to deploy WebAssembly functions and pay with tokens for their execution. Payments go to Providers, who host these functions.

## What are deals

Deal represents a request from Developer to host a set of WebAssembly functions for a specified price. Providers are able to join these deals in order to host functions and receive tokens for that.

In essense, Deal specifies what to deploy, and how much to pay for that.

Among parameters described above, each Deal specifies an `AppCID`. `AppCID` is an IPFS CID that points to the `Worker Definition` data structure stored on IPFS.


### Where `Worker Definition` comes from

As we will see in `step-by-step` section below, there's a certain structure to the Fluence Projects. That structure is defined by `fluence cli`, which provides means to initialize and maintain Fluence Projects.

Fluence Project can hold any number of Rust and WebAssembly -based functions and timer-based recurrent Aqua scripts.

A set of functions defined by a single Rust project or a set of linked WebAssembly modules is called a `service`. You can read more about services [HERE](https://www.youtube.com/watch?v=tgTUtfb0Ok8).

A timer-based recurrent Aqua scripts are called Spells. It's like a cron, but for distributed choreography. You can read more about spells [HERE](https://www.youtube.com/watch?v=tgTUtfb0Ok8).

Developers can group Services and Spells to Deals, and then deploy each deal via `fluence deal deploy` command in `fluence cli`. Before Deal is registered on Chain, its settings and artifacts are uploaded to IPFS to produce `Worker Definition`, which is again stored on IPFS to produce `AppCID`.

### How deals are matched

In order for a Deal to be deployed, there should be Providers willing to host it. That process is governed by the `Matcher` smart contract.

It's important that Matcher makes it possible for a single Deal to be deployed on several hosts to provide High Availability.

A Deal specifies different parameters, like `price per epoch`, `minimum collateral`, `effectors` and `target number of workers`.

These parameters are matched against Providers' Market Offers, which specify `minimum price per epoch`, `maximum collateral` and `available effectors`.

You can read more about effectors [HERE](https://www.youtube.com/watch?v=tgTUtfb0Ok8).

Providers register their Market Offers on chain in a contract called `Matcher`, and each `deal deploy` calls that contract to find Offers compatible with that Deal. It should match the price, collateral and available `effectors`.

Each match should find at least `target number of workers` Providers whose offers are compatible with a given Deal.

After match happened, Providers recieve an event from Chain that commands them to deploy Deal to their chosen Compute Peer.

You can read a more detailed description of Matching process [HERE](https://www.youtube.com/watch?v=tgTUtfb0Ok8).

## What are workers

When Deal is matched against Market Offers, it gets deployed to a number of Compute Peers.

For every deal, a Compute Peer creates a secure samespace to isolate functions of that Deal from other Deals. That secure namespace is called a Worker. After succesful deployment, a Worker holds all Services and Spells.

Since Workers are isolated from each other, Service and Spells names and aliases will never have a collision with Services and Spells in other Workers.

In order to reach these Services and Spells and call functions on them, it's required to know two things: Compute Peer ID and Worker ID.

For purposes of this document, it's enough to know that a Worker is what holds a set of Services and Spells for a single Deal.

## What are subnets

Subnet is a set of Workers each holding the same Deal.

It's important to diversify where Deal is hosted to provide High Availability. So Workers of a single Deal will always be on different Compute Peers, and most likely these Compute Peers will come from different Providers.

So, Subnet unites several Compute Peers of several Providers. A single Subnet corresponds to a single Deal, so each Compute Peer of a Subnet hosts a Worker which contains all the Services and Spells defined by the Deal's `AppCID`.

Information about Subnet participants is stored on Chain. So it's a public information that's easy to retrieve from Chain knowing a Deal ID. Clients use that information to resolve Subnets to a list of Workers, and access Services and Spells inside these Workers.

## Deployment step-by-step
### Gathering tokens

- Add Mumbai to Metamask
- Gather tokens from Faucet

### Install Fluence CLI

Fluence CLI is published to NPM Registry, so you can use any compatible tool to install it. `npm` and `yarn` are among the most popular onces.

```bash
yarn global add @fluencelabs/cli@unstable
```

### Project init

First things first, we need to initialize a Fluence Project to hold our Services and Spells.

```bash
fluence init --template quickstart
```

It will ask you for a path to store project, and then proceed to install different dependencies. It may take some time, and finally you will see

```
Successfully initialized Fluence CLI project template at /your/path/to/project
```

The project is ready to be deployed right away. However, you may take your time to look around, poke at `fluence.yml` which holds the principal configuration of your newly created project.

You can see that this config defines a single service named `myService`, a worker named `defaultWorker` that holds that single service, and finally a deal called `defaultWorker` that specifies that it needs from 1 to 3 Compute Peers to be hosted.

```yaml
services:
  myService:
    get: src/services/myService
workers:
  defaultWorker:
    services: [ myService ]
    spells: []
deals:
  defaultWorker:
    minWorkers: 1
    targetWorkers: 3
```

### Deal deploy

`fluence deal deploy` will deploy all deals defined in `fluence.yml`.

See `fluence deal deploy --help` for information on more settings to `deal deploy` command.

As deployment happens through blockchain, you will be prompted to open a URL to sign Transaction with your Metamask wallet.

```
To approve transactions to your wallet using metamask, open the following url:

https://cli-connector.fluence.dev/?wc=000000000000000000000%402&relay-protocol=irn&symKey=000000000000000
```

Open it, and connect Metamask. After a short while, you will see a Metamask prompt to sign Transaction.

TODO: METAMASK_PROMPT_SCREENSHOT.JPG

After a short while, you will see a message like this one:

```
# Waiting for transaction to be mined......

Success!

created deals:
  defaultWorker:
    deal: https://mumbai.polygonscan.com/address/0x00000000000000000000000000000000
    worker definition: bafkreigu3u3swrzq4tingjbp77ozozacbcsujm3wnnr7x4xbeliwr5zkvi
    timestamp: 2023-08-31T18:07:01.122Z
```

That means your Deal was deployed succesfully. After a short while, Providers will catch up and deploy it.

### Call a function over the subnet

In your freshly-initialized project, there's a file `src/aqua/main.aqua`. Among others, it contains a function `runDeployedServices` which resolves a Subnet, and calls a function on each of the Workers in the Subnet.

To run it, simply run the following command:
```bash
fluence run -f 'runDeployedServices()'
```

You will see a list of Answers printed. Some of them may contain no answer, and `worker_id` will be null. That means that this specific Compute Peer has not deployed the Deal yet. Try again in a while, and it should appear.

### Inspect deployed deal
```bash
fluence run -f 'showSubnet()'`
```

```json
[
    {
        "services": [
            "myService",
            "worker-spell"
        ],
        "worker_id": "12D3KooLANJSDNdoandjqlwkDNIBNnnao12nWNj0uaJIKSALn"
    },
    {
        "services": [
            "myService",
            "worker-spell"
        ],
        "worker_id": "12D3KooWKGU8FFyw5Ek7wWREX2KKEs2AjxnaojsndoJOWNSJd"
    },
    {
        "services": [
            "myService",
            "worker-spell"
        ],
        "worker_id": "12D3KoonONmakW291NlajwyrnbLSAMNpqNAO21NQJWJSnsnwo"
    }
]
```

### Update deal

Now, if you want to change something in one of your Services or Spells, you can do that, and simply call `deal deploy` again will update existing Deal in place.

Try it: modify code in `src/services/myService/modules/myService/src/main.rs` and execute `deal deploy` again.

## Current limitations

Right now, there's no way to remove a Deal once it is deployed. It will be possible shortly!

Also, there's no billing yet, so you won't be charged any tokens and Deals will remain deployed forever. That will be fixed soon, as well.
