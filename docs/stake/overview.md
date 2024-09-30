# Overview

Stakers, also referred to as Delegators, play a crucial role in the Fluence Network.
The process of becoming a Staker in the Fluence Network is straightforward, though it may vary based on the size of the deposit and the desired level of network involvement. The general steps to become a staker are illustrated in the image below:

Becoming a Staker on the Fluence Network is a simple process and may vary depending on the deposit size and the level of involvement you want in the network. The general flow of becoming a staker is shown in the image below:

<div style={{ textAlign: "center" }}>
<img

src={require('./assets/staking_user_flow.png').default}
alt="The flow of becoming a staker in the Fluence Network."
style={{ display: "block", margin: "auto", maxWidth: "90%" }}

/>

<p>The flow diagram showing how to become a staker in the Fluence Network.</p>
</div>

The flow presented is a general overview of the staking process for **a token holder**. This documentation also covers the preparations steps, such as preparing and grasping the essential concepts of the Fluence Network for stakers.

It is recommended to read the documentation in the following order:

- **Fluence Key Concepts for stakers**: If you are unfamiliar with how the Fluence Network operates, the role of stakers, and the nature of rewards they earn, read the [Key Concepts for Stakers](#fluence-key-concepts-for-stakers) first to understand the basics of the Fluence Network.
- **Prepare your wallet**: To interact with the Fluence Network and Fluence Web Apps, you must prepare your crypto wallet or create one. Read the comprehensive [guide](./wallets_guide/wallets_guide.md) on using crypto wallets with Fluence web applications.
- **Bridge Funds to Fluence**: Fluence is an L2 network, and to use your FLT and USDC tokens in the Fluence network, you first have to bridge them from Ethereum. Read the [guide](./bridge_guide/bridge_guide.md) on bridging your funds with the Fluence Bridge App.
- **Obtain an NFT**: Fluence NFTs enable access to staking and can be purchased or sold on the official Fluence [NFT Marketplace](https://nft.fluence.network/). Read the official [guide](./nft_guide/nft_guide.md) on obtaining an NFT.
- **Stake**: You can stake your FLT tokens to the Fluence Network differently depending on the deposit size and the level of involvement you want to have in the network:
  - **The Fluence Staking App**: use the official [Staking App](https://staking.fluence.network/) to stake for Capacity Commitments. Read the official [guide](./staking_app_guide/staking_app_guide.md) to find more.
  - **Staking Pool**: If your deposit is not large enough to stake for a Capacity Commitment directly, or you want to abstract most of the staking process - you can join the Staking Pool. The Pool is created with a re-staking protocol [Parasail](https://www.parasail.network). Head to [Fluence’s Delegation Pool](https://www.parasail.network/delegate/fluence) on Parasail and start delegating your tokens. Find out more [here](https://docs.parasail.network/restaking-guides/guide-for-fluence-stakers/).

## Fluence key concepts for stakers

:::tip

If you want to learn more about Fluence Network, please visit the [Learn](../learn/overview.md) section of the Fluence Docs.

:::

### The Fluence Network

Fluence is a decentralized computing marketplace powered by blockchain economics.

The Fluence Network utilizes the Proof of Capacity (PoC) mechanism to ensure that compute providers can deliver the computational capacity they committed to the Marketplace. Providers define their compute resources as compute Units (CUs), each CU consisting of 1 core, 4 GB of RAM, and an additional storage space.

To demonstrate continuous readiness to provide computing power for user applications, CUs send cryptographic proofs (PoC) to the blockchain. In each epoch (24 hours) of capacity provisioned but not utilized by user applications, submitted proofs determine the reward paid in FLT tokens.

### The incentivization layer

A collateral must be staked to allow the provision of providers' compute on Fluence and incentivize them to act honestly. If anyone acts dishonestly—for example, if Compute Units fail to submit capacity proofs — this collateral is partially slashed.

This mechanism involves two parties: the **Compute Provider** with compute power, who earns from proof submission and renting compute power through the Marketplace, and the **Staker**, who earns rewards from providing the collateral. Only staked CUs are considered active in the Marketplace, which is a prerequisite for participating in the reward and user computing programs.

It's in both parties' interests to act wisely. The compute Provider puts their reputation at risk — no one wants to stake for or rent from an untrustworthy provider. The continued failure of the CU to provide the expected proofs leads to penalties and partial slashing of the collateral. If the slashing threshold is reached, the staking agreement is canceled.

### Capacity commitments

A Capacity Commitment is a formal declaration by a provider stating their intention to offer a specific amount of computing capacity to the Fluence network for a set period. This commitment is made for each Compute Peer (physical server) that a provider wants to commit to the Fluence network.

Each CC has its characteristics, most of which are defined by the Provider during registration and some by the Network.

**CC parameters set by Provider:**

- **Duration:** The period during which the staked collateral is held—generally, longer durations yield higher rewards for stakers.
- **Staking rate:** The share of rewards allocated to the staker—providers set this rate, but it's in the staker's interest to choose CCs with higher rates.
- **Staker address** (Optional): The address to which CC's provider granted exclusive staking rights if it wanted.

**CC parameters set by the Network:**

- **Collateral:** The FLT tokens amount required to activate a Capacity Commitment (CC), calculated as: `collateralPerUnit` \* `UnitCount.`

:::info[**Important numbers**]

Current collateral per CU: USD 200 in **FLT** **equivalent**
:::

Once a Capacity Commitment (CC) is chosen and staked, the Compute Peer tied to it must start generating proofs for capacity _starting the next epoch_ when it will be considered active. From the moment of activation, the Peer must submit the specified number of proofs for their capacity every epoch. The DAO determines the epoch length, which is currently set at 24 hours.

### Staker rewards

#### Rewards for Capacity Commitment proofs

:::info[**Important numbers**]

Current target revenue per CU: USD 0.33 per epoch in **FLT** equivalent

:::

As previously explained, the collateral for the **Capacity Commitment** acts as a security measure. It incentivizes the Peer linked to the **Capacity Commitment** to consistently submit the required number of proofs for each **Compute Unit** (CU) within every epoch throughout the **Capacity Commitment's** duration.

At the end of each epoch, the smart contract tallies the number of correct proofs submitted by a **Compute Unit**. If a CU meets or exceeds the required number of correct proofs, it receives rewards. However, if a CU fails to submit enough proofs in an epoch, it's penalized by having a portion of its collateral slashed.

The reward for a Compute Unit in an epoch fluctuates around the target value. It's determined by the proportion of correct proofs submitted by the CU relative to the total number of correct proofs submitted in that epoch. This algorithm ensures that the rewards pool stays close to the target value in FLT, making smooth adjustments when necessary.

_The rewards earned by a CU for submitting proofs are shared between the compute provider and the staker. This division is determined by the staking rate outlined in the Capacity Commitment terms set by the compute Provider created it._

#### Rewards for Deals

An active Capacity Commitment, in which Compute Units submit proofs that they're ready to serve users' workloads, can be rented and participate in **Deals** created by users. A Deal published by a developer specifies the required number of CUs to participate in the Deal.

The compute marketplace smart contract automatically matches the **Deal** with providers whose capacity meets the specified conditions. CUs then transition from the **Capacity Commitment Proofs submission** mode to the **Deal** service mode.

For the time spent computing resources in a Deal, CC's Staker **continues to earn rewards in FLT** - the target revenue of CUs in Capacity Commitment proofs submission mode in FLT equivalent, multiplied by the staking rate.

This arrangement ensures that _stakers' rewards generate stable and predictable revenue_, making staking as risk-free as possible.

#### Vesting

:::info[**Important numbers**]

**Duration of one vesting period:** 1 epoch (24 hours)

**Total number of vesting periods:** 182 epochs (6 months)

:::

**FLT** rewards earned each epoch are unlocked (vested) over time to encourage long-term commitment to the Network and consistent value contribution.

Rewards unlocked proportionally every epoch (24 hours). Each unlock releases a fraction of the rewards earned in that period. This process continues for six months with a daily unlock of 1/182 total rewards.

Let's break this down with a simple example:

1. In the 5th epoch, you earn 182 FLT.
2. Starting from this moment, for the next 182 days (about 6 months):

   - Every day (which is one epoch), 1 FLT from this reward becomes available for you to use.
   - This continues until all 182 FLT are unlocked.

3. Now, let's say in the 6th epoch, you earn another 182 FLT.
4. The same process starts again for this new reward:
   - Every day for the next 182 days, another 1 FLT from this second reward becomes available.

This pattern continues for each epoch where you earn rewards. It's like having multiple timers running at once, each slowly releasing your earned FLT over time.

#### Slashing

:::info[**Important numbers**]

Currently, the **slashing rate** for one failed epoch per compute Unit is set to **0 %** for the **first month** of the Mainnet. It will be increased in the future.

:::

Slashing penalizes Capacity Commitments in which CUs fail to prove claimed capacity or act maliciously against the Network. Currently, it is set to zero.

As previously explained, the collateral in the **Capacity Commitment** acts as a security measure. It ensures that the Peer linked to the **Capacity Commitment** consistently submits the necessary number of proofs for each **Compute Unit** (CU) within every epoch throughout the **Capacity Commitment's** lifetime. If a peer fails to send the required number of proofs for some CUs during an epoch, the CC collateral is slashed according to the slashing rate at the end of the epoch.

The formula that determines how much collateral will be slashed in total:

`totalSlashedCollateral` = `totalFailCount` \* `collateralPerUnit` \* `slashingRate`

**Where:**

- `totalFailCount`: The total number of CUs that failed to send the required proof amount during the overall CC activity time.
- `collateralPerUnit`: The collateral for 1 Compute Unit set by the **DAO**.
- `slashingRate`: The percentage of slashing for 1 compute Unit in 1 failed epoch.

If the total slashed FLT amount exceeds the allowed threshold, the CC is marked as `FAILED`, and the Peer is removed from the Network, preventing further collateral slashing. Withdrawal of slashed collateral has a lock-in period of 30 days.

### Conclusion

Now you're familiar with all the essentials for stakers and is ready to stake your money effectively, earn rewards and become a part of the DePIN world.
