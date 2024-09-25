# Fluence key concepts for stakers

## Introduction

This article provides an overview of the Fluence Network's key concepts for stakers. It explains how the Fluence Network operates, the role of stakers, and the rewards they can earn. This document explains the essential concepts used across the Fluence Network documentation and applications.
As the result, you will understand how Fluence works and how to stake on the Fluence Network effectively.

If you want to learn more about Fluence Network, please visit the [Learn](../learn/overview.md) section of the Fluence Docs.

## The Fluence Network

Fluence is a decentralized computing marketplace powered by blockchain economics.

The Fluence Network utilizes Proof of Capacity (PoC) mechanism to ensure that compute providers can deliver the computational capacity they committed to the Marketplace. Providers define their compute resources as compute Units (CUs), each CU consisting of 1 core, 4 GB of RAM, and an additional storage space.

To demonstrate continuous readiness to provide computing power for user applications, CUs send cryptographic proofs (PoC) to the blockchain. In each epoch (24 hours) of capacity provisioned but not utilized by user applications, submitted proofs determine the reward paid in FLT tokens.

## The incentivization layer

Collateral must be staked to incentivize providers to act honestly. If anyone acts dishonestly—for example if Compute Units fail to submit proofs—this collateral is slashed.

This mechanism involves two parties: the Compute Provider with compute power, who earns from proof submission and renting compute power through the Marketplace, and the Staker, who earns rewards from providing the collateral. Only staked CUs are considered active in the Marketplace, a prerequisite for participating in the reward and user computing programs.

It's in both parties' interests to act wisely. The compute Provider puts their reputation at risk—no one wants to stake for or rent from an untrustworthy provider. The continued failure of the CU to provide the expected proofs leads to penalties and partial slashing of the collateral. If the slashing threshold is reached, the staking agreement is canceled.

## Capacity commitments

A Capacity Commitment is a formal declaration by a provider stating their intention to offer a specific amount of computing capacity to the Fluence network for a set period. This commitment is made for each Compute Peer (physical server) that a provider wants to commit to the Fluence network.

Each CC has its characteristics, most of which are defined by the Provider during registration and some by the Network.

**CC parameters set by Provider:**

- **Duration:** The period during which the staked collateral is held—generally, longer durations yield higher rewards for stakers
- **Staking rate:** The share of rewards allocated to the staker—providers set this rate, but it's in the staker's interest to choose CCs with higher rates
- **Staker address** (Optional): Provider may grant exclusive staking rights for a CC to a specific address

**CC parameters set by the Network:**

- **Collateral:** The FLT tokens amount required to activate a Capacity Commitment (CC), calculated as: `collateralPerUnit` \* `UnitCount.`

:::info[**Important numbers**]

Current collateral per CU: USD 200 in **FLT** **equivalent**
:::

Once a Capacity Commitment (CC) is chosen and staked, the Compute Peer tied to it must start generating proofs for capacity starting the next epoch when it will be considered active. From the moment of activation, the Peer must submit the specified number of proofs for their capacity every epoch. The DAO determines the epoch length, which is currently set at 24 hours.

## Staker rewards

### Rewards for Capacity Commitment proofs

:::info[**Important numbers**]

Current target revenue per CU: USD 0.33 per epoch in **FLT** equivalent
:::

As previously explained, the collateral in the **Capacity Commitment** acts as a security measure. It incentivizes the Peer linked to the **Capacity Commitment** to consistently submit the required number of proofs for each **Compute Unit** (CU) within every epoch throughout the **Capacity Commitment's** duration.

At the end of each epoch, the smart contract tallies the number of correct proofs submitted by a **Compute Unit**. If a CU \*\*\*\*meets or exceeds the required number of correct proofs, it receives rewards. However, if a CU fails to submit enough proofs in an epoch, it's penalized by having a portion of its collateral slashed.

The reward for a Compute Unit in an epoch fluctuates around the target value. It's determined by the proportion of correct proofs submitted by the CU relative to the total number of correct proofs submitted in that epoch. This algorithm ensures that the rewards pool stays close to the target value in FLT, making smooth adjustments when necessary.

_The rewards earned by a CU for submitting proofs are shared between the compute provider and the staker. This division is determined by the staking rate outlined in the Capacity Commitment terms set by the compute Provider created it._

### Rewards for Deals

An active Capacity Commitment, in which Compute Units submit proofs that they're ready to serve users' workloads, can be rented and participate in **Deals** created by users (developers). A Deal published by a developer specifies the required number of CUs to participate in the Deal.

The compute marketplace smart contract automatically matches the **Deal** with providers whose capacity meets the specified conditions. CUs then transition from the **Capacity Commitment Proofs submission** mode to the **Deal** service mode.

For the time spent computing resources in a Deal, CC's Staker **continues to earn rewards in FLT—** the target revenue of CUs in Capacity Commitment proofs submission mode in FLT equivalent, multiplied by the staking rate.

This arrangement ensures that stakers' rewards generate stable and predictable revenue, making staking as risk-free as possible.

### Vesting

:::info[**Important numbers**]

**Duration of one vesting period:** 1 epoch (24 hours)

**Total number of vesting periods:** 182 (6 months)

:::

**FLT** rewards earned each epoch are unlocked (vested) over time to encourage long-term commitment to the Network and consistent value contribution.

Vesting (unlock) schemes for staker rewards vary slightly:

- **Rewards for Capacity Commitment proofs:** Unlocked proportionally every epoch (24 hours). Each unlock releases a fraction of the rewards earned in that period. This process continues for six months with a daily unlock of 1/182 total rewards.
- **Rewards for epochs spent in Deals:** Unlocked on an epoch-by-epoch basis, with the total vesting duration matching that of CCP rewards.

### Slashing

:::info[**Important numbers**]

Currently, the slashing rate for one failed epoch per compute Unit is set to 0 % for the first month of the Mainnet. It will be increased in the future.

:::

Slashing penalizes Capacity Commitments in which CUs fail to prove claimed capacity or act maliciously against the Network. Currently, it is set to zero.

As previously explained, the collateral in the **Capacity Commitment** acts as a security measure. It ensures that the Peer linked to the **Capacity Commitment** consistently submits the necessary number of proofs for each **Compute Unit** (CU) within every epoch throughout the **Capacity Commitment's** lifetime. If a peer fails to send the required number of proofs for some CUs during an epoch, the CC collateral is slashed according to the slashing rate at the end of the epoch.

The formula that determines how much collateral will be slashed in total:

`totalSlashedCollateral` = `totalFailCount` \* `collateralPerUnit` \* `slashingRate`

**Where:**

- `totalFailCount`: The total number of CUs that failed to send the required proof amount during the CC activity time.
- `collateralPerUnit`: The collateral for 1 Compute Unit set by the **DAO**.
- `slashingRate`: The percentage of slashing for 1 compute Unit in 1 failed epoch.

If the total slashed FLT amount exceeds the allowed threshold, the CC is marked as `FAILED`, and the Peer is removed from the Network, preventing further collateral slashing. Withdrawal of slashed collateral has a lock-in period of 30 days.

## Conclusion

Now you're familiar with all the essentials for stakers and is ready to stake your money effectively, earn rewards and become of the DePIN world. Next, you can learn more about the Fluence Staking Application and how to stake your FLT tokens in the following [article](./staking_app_guide/staking_app_guide.md).
