# Setting Up

## Introduction

In order to get your [Cloudless App](../glossary.md#cloudless-app) developed and running, some housekeeping with respect to both development and payment environments are required. 

Fluence Cloudless offers you, the developer, a great degree of control over almost every aspect of your Cloudless App: 

* which data center(s) host you cloudless code, e.g., geo-location or carbon footprint requirements
* what capacity capabilities execute your functions, e.g., CPU and RAM type
* what level of resources you want to power your functions, e.g., number of CPUs
*  what level of availability you want for your Cloudless App. 

Moreover, in Fluence's *"verify, don't trust"* paradigm, providers have to submit [cryptographic proofs](../glossary.md/#proofs) attesting to the correct execution of your Cloudless Functions in order to be able to collect the pre-agreed price for their compute services rendered. Hence, the underlying billing and payment models also are different.

Instead of a credit card on file that is (for the most part) charged at the end of the month for compute service charges incurred over the billing period, e.g., the last calendar month, as reported by the cloud provider, Fluence Cloudless operates on a pre-payment and token model putting you, the developer, fully into control of your payments. 

### Fluence Networks

In order to create and operate your Cloudless App, you need to interact with two different networks: the Fluence Compute Network and the Fluence Compute Marketplace. The Fluence Compute Network is a peer-to-peer network connecting peers, i.e., servers in various data centers, hosting and executing your Cloudless Deployments on demand. The Fluence Compute Marketplace is a blockchain hosting the necessary smart contracts to allow you to commit your [developer offer](../glossary.md/#developer-offer) for matching with [provider offers](../glossary.md/#provider-offer) and to manage the proof-based charges from each peer owner, i.e., provider, running your [Cloudless Deployments](../glossary.md/#cloudless-deployment). Each network is available in a production, i.e., mainnet, or testing, i.e., testnet, flavor. In addition, the remote testnets can be stood-up locally to further ease development.

Table 1: Network Names

|  | Compute Network | Marketplace Network |
|---|---|---|
| testnet| `dar`| TBD|
| mainnet| `kras` | TBD |
| local | `dar` | TBD|

Testnet deployments require the same token types than the mainnet except that those tokens have no trading value and are freely available in small quantities to cloudless developers from the testnet *faucet*, i.e., a web app that facilitates the distribution of free tokens. In the case of the Fluence testnet. Again, both **tFLT** and **tUSD**C carry no trading value and are freely available to developers in small but sufficient quantities to develop and test their Cloudless Apps.

## Setting Up For Payment

In order to handle tokens, testnet or otherwise, you need a crypto wallet. If you are unfamiliar with crypto wallets, have a look at this [introduction](https://www.coindesk.com/learn/your-first-crypto-wallet-how-to-use-it-and-why-you-need-one/) but [DuckDuckGo](https://duckduckgo.com/?q=introduction+to+crypto+wallets&df=y&ia=web) is your friend. Note that you will be storing ERC 20 type tokens and interacting with an EVM-compatible blockchain. That is, select a [wallet that is compatible with the Ethereum Virtual Machine](https://shardeum.org/blog/what-is-evm-wallet/). For our illustrative purposes, we'll be using [MetaMask](https://metamask.io/). Moreover, we will primarily focus on testnet deployments. See [Migrating to Mainnet](../tutorials/deploying_to_mainnet.md) before you deploy to mainnet.

Assuming you have your wallet ready to go, you need to add the testnet and testnet tokens **tFLT** and **tUSDC**, respectively, request test tokens from the Fluence faucet.

### Creating An Account

It is recommended to use a dedicated development account for your testnet. That is, create a new account in your wallet and name it, say, *Fluence Dev Testnet* and use this account only to manage your testnet tokens and chain interactions. 

TODO: screenshot

### Setting Up For The Fluence Testnet

In order to be able for your wallet to received and send transactions to the testnet, you need to add it to your wallet networks and select it before interacting with the blockchain.

TODO: chain id and settings to add Fluence IPC testnet to MM

### Requesting Test Tokens From The Faucet

Now that your account and wallet are setup, select the Fluence network you just added and grab the account address you want to use to hold your testnet tokens. Go to the Fluence [testnet faucet](https://faucet-kras.fluence.dev/), which prompts you to sign in with an email address. Use an address you can check. Once you provide your email address, you will receive an email from `Faucet` in short order and make sure to check your spam folder. Follow the instructions, enter your address and, if you haven't done so already, import the test tokens into your wallet.

TODO: Add screenshots of testnet faucet

At this point, you should have ?? **tFLT** and ?? **tUSDC** in your wallet. If you need more tokens in the future, just head back to the Faucet. You are now equipped to handle Cloudless Deployment on the Fluence testnet!

Note that in addition to the Fluence testnet, you have the option to deploy a local network comprised of Nox peers, blockchain, IPFS and indexer -- see [Working With A Local Network](./working_with_local_networks.md). Information on how to migrate you Cloudless App to the Fluence mainnet `kras` is coming soon.

Regardless of your deployment target, you should have the [Fluence CLI](./installing_cli.md) installed and ready to go.






