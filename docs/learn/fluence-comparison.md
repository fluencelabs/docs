# Fluence Comparison

## Fluence vs Cloud platforms

Proprietary cloud platforms have a clear economic incentive to create closed ecosystems of software services to make switching so hard that customers are effectively locked in within the platform. If a customer needs multiple cloud services, it is easier to buy from the same provider because the cost of integration between providers for typical tasks is usually quite high. Additionally, providers attempt to capture customers by setting up data pricing barriers: cheap inbound bandwidth but expensive outbound bandwidth to make the lock in even stronger.

Once captured, a customer is vulnerable to platform risk as their business relies on a particular provider. When scaling a business and utilizing more resources from the cloud, sharp price movements might put a lot of pressure on business continuity. And as many companies have belatedly realized, switching a codebase to another cloud provider or to private infrastructure requires a significant investment of time and resources.

The Fluence protocol frees developers from this proprietary tooling and allows applications to switch providers at will. Fluence enables developers to use any connected providers and easily switch between them. Additionally, the Fluence protocol enforces cryptographic proofs for any customer code execution, enabling better security and resilience.

Unlike traditional clouds, Fluence provides infrastructure that is manageable via Web3 native organizations like DAOs. Digital organizations can pay using their multisig wallets, update their codebase via collective voting, and invite their community members to contribute into providing infrastructure for their project via the Fluence network.

## Fluence vs Blockchain app platforms

Blockchain application platforms are based on replicated ledgers of transactions and require a consensus algorithm to update the ledger. This design, which prevents adversarial ledger updates and protects the information from tampering, is very useful for “digital value” use cases such as cryptocurrencies, decentralized finance, NFTs, or DAOs. However, the consensus model which requires verification of multiple network nodes is suited to relatively simple, deterministic computations on limited data. Additionally, blockchains add a new per transaction pricing model, where users have to pay gas for every on-chain operation.

Fluence takes a different approach to decentralized computation where applications do not sit on top of distributed ledger. Applications are hosted off chain, similarly to centralized cloud platforms but because the protocol is open,applications can be hosted by multiple providers, and developers can switch between providers dynamically. This architecture dramatically reduces the importance of any particular provider and drives pricing down. Additionally, Fluence adds computation verifiability required for many applications by adding proofs of execution. Every provider in the Fluence network must submit cryptographic proofs that demonstrate they are serving applications correctly. Not submitting proofs results in losses as their stake is slashed and payments are stopped.

Also Fluence accounts for the complexity of computations in a gas analogy as blockchains, but in Fluence by default a developer who deploys the application is responsible for covering the hosting cost, not the end user. And regarding the developer’s choice, there are built-in possibilities to transfer the requirement to pay for hosting to multisigs, DAOs, or end-users themselves if there is such a desire.

Similarly to decentralized storage protocols (e.g. Filecoin) which store data off chain but use blockchain to track, validate and compensate the storage, the computation on Fluence happens off chain on the network nodes while proofs, and payments are submitted and validated on-chain.


## Fluence vs Rollups (optimistic and zk)

Rollups provide a scaling mechanism for blockchains by creating additional blockspace and transaction processing capacity outside of L1s. To be compatible with wallets and L1 apps, rollups also use blocks and transactions and employ the same execution model (e.g. EVM). Rollups generate proofs of its chain state and these proofs (merkle or zero-knowledge) are validated on the relevant L1 to ensure roll-up validity at certain points in time.

The Fluence execution and validation models are distinct as Fluence does not put execution into blocks and transactions, it runs applications as a traditional cloud but requires providers to submit proof of execution on-chain. This architecture allows it to be useful for distributed or non deterministic compute and be applicable where the “pay per transaction execution” model isn't natural. For example, backend API, data processing, indexing, message routing, multi-party computation, Internet-of-Things, etc. All of this doesn't really exist on chain or in rollups and isn’t suitable to be put on chain.


## Fluence Comparison

|                 | Scalability | Censorship resistance | Verifiability |  Payment model  | Cost |
|-----------------|:-----------:|:---------------------:|:-------------:|:---------------:|:----:|
| Blockchains     | Low         | Yes                   | Yes           | Per transaction | $$$$ |
| Rollups         | Medium      | Yes*                  | Yes           | Per transaction | $$$  |
| Other d-compute | Medium      | Yes**                 | No**          | Per transaction | $$   |
| Cloud           | High        | No                    | No            | Per resource*** | $$   |
| **Fluence**         | **High**        | **Yes**                   | **Yes**           | **Per resource**    | **$**    |

\* Rollups with a single node operator or low amount of operators are subject for potential censorship

\** Decentralized computing implementations vary but usually do not provide strong cryptographic proofs of execution correctness

\*** Clouds account for and charge for computations, memory and data bandwidth directly or using synthetic metrics
