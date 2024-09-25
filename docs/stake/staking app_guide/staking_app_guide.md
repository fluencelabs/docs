# The Staking Application User Guide

## Introduction

This guide will help you understand the role of stakers in the Fluence Protocol and how to become one using the Fluence Staking Application. Learn to earn substantial rewards by powering the decentralized physical infrastructure (DePIN).

First, you'll learn about the mechanics and economics behind the rewards earned.

Second, you'll be introduced to the Staking application—the main control panel for analyzing staking opportunities and monitoring the metrics of staked assets.

Finally, you'll read a step-by-step guide on becoming part of the Fluence network and stake for your first Capacity Commitment.

## Key concepts

Fluence is a decentralized compute marketplace & computing marketplace powered by blockchain economics.

Proof of Capacity (PoC) is a mechanism the Fluence network utilizes to ensure that compute providers can deliver the computational capacity they committed to the Marketplace. Providers define their compute resources as compute Units (CUs), each CU consisting of 1 core, 4 GB of RAM, and an additional storage space.

To demonstrate continuous readiness to provide computing power for user applications, CUs send cryptographic proofs (PoC) to the blockchain. In each epoch (24 hours) of capacity provisioned but not utilized by user applications, submitted proofs determine the reward paid in FLT tokens.

### The incentivization layer

Collateral must be staked to incentivize providers to act honestly. If anyone acts dishonestly—for example if Compute Units fail to submit proofs—this collateral is slashed.

This mechanism involves two parties: the Compute Provider with compute power, who earns from proof submission and renting compute power through the Marketplace, and the Staker, who earns rewards from providing the collateral. Only staked CUs are considered active in the Marketplace, a prerequisite for participating in the reward and user computing programs.

It's in both parties' interests to act wisely. The compute Provider puts their reputation at risk—no one wants to stake for or rent from an untrustworthy provider. The continued failure of the CU to provide the expected proofs leads to penalties and partial slashing of the collateral. If the slashing threshold is reached, the staking agreement is canceled.

### Capacity commitments

A Capacity Commitment is a formal declaration by a provider stating their intention to offer a specific amount of computing capacity to the Fluence network for a set period. This commitment is made for each Compute Peer (physical server) that a provider wants to commit to the Fluence network.

Each CC has its characteristics, most of which are defined by the Provider during registration and some by the Network.

**CC parameters set by Provider:**

- **Duration:** The period during which the staked collateral is held—generally, longer durations yield higher rewards for stakers
- **Staking rate:** The share of rewards allocated to the staker—providers set this rate, but it's in the staker's interest to choose CCs with higher rates
- **Staker address** (Optional): Provider may grant exclusive staking rights for a CC to a specific address

**CC parameters set by the Network:**

- **Collateral:** The FLT tokens amount required to activate a Capacity Commitment (CC), calculated as: `collateralPerUnit` \* `UnitCount.`

:::info[**Important numbers**]

Current collateral per CU: USD 200 in FLT equivalent
:::

Once a Capacity Commitment (CC) is chosen and staked, the Compute Peer tied to it must start generating proofs for capacity starting the next epoch when it will be considered active. From the moment of activation, the Peer must submit the specified number of proofs for their capacity every epoch. The DAO determines the epoch length, which is currently set at 24 hours.

### Staker rewards

#### Rewards for Capacity Commitment proofs

:::info[**Important numbers**]

Current target revenue per CU: USD 0.33 per epoch in **FLT** equivalent
:::

As previously explained, the collateral in the **Capacity Commitment** acts as a security measure. It incentivizes the Peer linked to the **Capacity Commitment** to consistently submit the required number of proofs for each **Compute Unit** (CU) within every epoch throughout the **Capacity Commitment's** duration.

At the end of each epoch, the smart contract tallies the number of correct proofs submitted by a **Compute Unit**. If a CU \*\*\*\*meets or exceeds the required number of correct proofs, it receives rewards. However, if a CU fails to submit enough proofs in an epoch, it's penalized by having a portion of its collateral slashed.

The reward for a Compute Unit in an epoch fluctuates around the target value. It's determined by the proportion of correct proofs submitted by the CU relative to the total number of correct proofs submitted in that epoch. This algorithm ensures that the rewards pool stays close to the target value in FLT, making smooth adjustments when necessary.

_The rewards earned by a CU for submitting proofs are shared between the compute provider and the staker. This division is determined by the staking rate outlined in the Capacity Commitment terms set by the compute Provider created it._

#### Rewards for Deals

An active Capacity Commitment, in which Compute Units submit proofs that they're ready to serve users' workloads, can be rented and participate in **Deals** created by users (developers). A Deal published by a developer specifies the required number of CUs to participate in the Deal.

The compute marketplace smart contract automatically matches the **Deal** with providers whose capacity meets the specified conditions. CUs then transition from the **Capacity Commitment Proofs submission** mode to the **Deal** service mode.

For the time spent computing resources in a Deal, CC's Staker **continues to earn rewards in FLT—** the target revenue of CUs in Capacity Commitment proofs submission mode in FLT equivalent, multiplied by the staking rate.

This arrangement ensures that stakers' rewards generate stable and predictable revenue, making staking as risk-free as possible.

#### Vesting

:::info[**Important numbers**]

**Duration of one vesting period:** 1 epoch (24 hours)

**Total number of vesting periods:** 182 (6 months)

:::

**FLT** rewards earned each epoch are unlocked (vested) over time to encourage long-term commitment to the Network and consistent value contribution.

Vesting (unlock) schemes for staker rewards vary slightly:

- **Rewards for Capacity Commitment proofs:** Unlocked proportionally every epoch (24 hours). Each unlock releases a fraction of the rewards earned in that period. This process continues for six months with a daily unlock of 1/182 total rewards.
- **Rewards for epochs spent in Deals:** Unlocked on an epoch-by-epoch basis, with the total vesting duration matching that of CCP rewards.

#### Slashing

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

Now that you're familiar with all the essentials for stakers, let's introduce you to the primary tool to help you find a suitable provider, stake effectively, and earn rewards!

:::note
Fluence is an L2 network, and to use your FLT and USDC tokens in the Fluence network, you first have to bridge them from Ethereum. Read more on how to use the blockchain bridge in the [corresponding article](https://www.notion.so/Bridge-Application-User-Guide-491f7d11ce05415da7444419e838dab8?pvs=21).
:::

## The staking application overview

The Staking application is a web-based tool created by Fluence. It provides stakers with all the necessary resources to analyze available Capacity Commitments for staking and monitor active commitments' performance and rewards.

:::note
Be cautious and use only the official application at [stake.fluence.network](https://stake.fluence.network). Never share your private keys or seed phrases with anyone, and always double-check the URL before signing the transactions.
:::

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/app_view_main.png').default}
    alt="The view of the main page of the Staking Application"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the main page of the Staking Application</p>
</div>

The Staking application consists of the following main parts:

- Navigation bar with links to the blockchain Bridge Application and Fluence NFT Collection on the Fluence Marketplace
- Button to connect your wallet to the application. Read more on how to connect your wallet to Fluence in this [article](../wallets_guide/wallets_guide.md)
- Panels with a summary of the activated Capacity Commitment performance:
  - **"Capacity commitments"** - distribution of activated CCs by statuses
  - **"Rewards"** - summary of rewards earned by CCs so far
- **Available for Staking:** List of Capacity Commitments available for staking
- **Staked Capacity Commitments:** Real-time information on the performance of active Capacity Commitments. If you are logged in, then the section will change to "**Your Capacity Commitments**"

:::info[**The page layout differs for authenticated and unauthenticated users:**]

Depending on whether you have logged in by connecting your wallet, the list of Capacity Commitments available for staking will remain the same.

But the information in the **Panels** and the **Staked Capacity Commitments** sections will be different:

- Without a connected wallet, you'll see all Capacity Commitments listed, allowing you to track and analyze overall Network performance and rewards
- When logged in with your wallet, you'll only see CCs you've activated, along with buttons to withdraw rewards and collateral

:::

The following sections will first guide you through the application interface, demonstrate how to stake for a Capacity Commitment for the first time, and then monitor its performance.

### Capacity commitments statuses panel

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/cc_status_panel.png').default}
    alt="The view of the Capacity Commitments statuses panel"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the Capacity Commitments statuses panel</p>
</div>

This panel displays current information about the number of CCs in different states:

- `Funded`: CC is activated and awaits becoming active at the start of the next epoch
- `Active`: CC is operational, and its CUs are either submitting CC proofs or participating in Deals
- `Completed`: CC has successfully finished, but the staker hasn't yet withdrawn the collateral and rewards
- `Failed`: CC has failed, but the staker hasn't yet withdrawn the collateral and rewards
- `Removed`: Completed CCs from which the staker has withdrawn both collateral and rewards

#### The CC Lifecycle

After staking and activating a Capacity Commitment, it progresses through the following stages:

- It initially enters the `Funded` status
- In the subsequent epoch, the CC transitions to `Active` and begins participating in the Network
- Upon completion or failure, the CC remains in either the `Completed` or `Failed` status until the staker withdraws the collateral.
  The CC's Provider can start the collateral withdrawal process before the staker. This happens when the Provider unregisters the compute resources from the ended CC. In this case, the collateral is transferred to the staker's wallet.
- Finally, the CC transitions to the `Removed` status, when all rewards and collateral are withdrawn

### Capacity commitments rewards panel

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/cc_rewards_panel.png').default}
    alt="The view of the Capacity Commitments rewards panel"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the Capacity Commitments rewards panel</p>
</div>

This panel summarizes rewards earned in Capacity Commitments (CCs) across the Network or activated by the user. Rewards accumulate each epoch and vest over time. For more details, refer to the "Key Concepts" section above.

Rewards can have the following statuses:

- `In vesting`: Earned rewards that are locked and will be vested later
- `Available to claim`: Rewards that can be withdrawn immediately
- `Claimed`: Rewards already withdrawn from the CC. Both the CC's Provider and staker can initiate the withdrawal process. If the Provider initiates withdrawal first, rewards will be automatically sent to the staker's wallet

:::note

For logged-in users, the panel displays a button to withdraw all available rewards from all CCs.

:::

### Available for Staking section

In this section, you'll find the list of Capacity Commitments available for staking.

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/available_for_staking_view.png').default}
    alt="The view of the Available for staking section"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the Available for staking section</p>
</div>

This section has the following components:

- A list of CCs available for staking, with each CC displayed as an expandable card
- Search bar: You can filter the list of Capacity Commitments by entering either:
  - Capacity Commitment ID
  - Provider name
- For users with a connected wallet, an "only for me" toggle is available. This filter displays CCs where Providers have set your wallet address as the only possible staker

#### Individual Capacity Commitment card data fields

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/available_for_staking_collapsed_cards.png').default}
    alt="The view of the available for staking Capacity Commitment cards collapsed"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the available for staking Capacity Commitment cards collapsed</p>
</div>

In the folded state, each CC card provides the following information:

- `Capacity Commitment ID`: A unique identifier for the CC with a hyperlink to the Fluence Explorer, offering detailed information such as a list of CUs
- `Provider name`: The name set by the Provider for public display. Use this to identify the Provider and find more details in both the Staking Application and [Fluence Explorer](https://explorer.fluence.dev/)
- `Staking duration`: The maximum time your assets will be staked
- `Required collateral`: The amount of FLT tokens needed to activate the CC
- `Staking reward`: The staker's share of rewards for Capacity Commitment Proofs submission. For more details, refer to the "Key Concepts" section above
- `Expected APR`: The projected annual percentage rate based on the target revenue per CU per epoch

:::tip
You can sort the list by clicking on any numeric field (following the provider name). This allows you to arrange the list in either descending or ascending order.

:::

Example of the Stake page list of CCs information cards collapsed.

#### Individual Capacity Commitment card extended view fields

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/available_cc_card_extended.png').default}
    alt="The view of the available for staking Capacity Commitment card extended"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the available for staking Capacity Commitment card extended</p>
</div>

Clicking on an individual CC card expands it, revealing more detailed information about the Capacity Commitment and the Provider. This expanded view also allows you to stake for the CC.

**Commitment Information:**

- `Created at`: The date when the Provider created the CC
- `Peer ID`: The identifier of the Peer you're staking for. Find more information about this Peer in the CC explorer: explorer.fluence.dev/peer/`<Peer ID>`
- `Compute Capacity`: The number of Compute Units participating in the CC. For more details on how Fluence measures compute resources, refer to the "Key concepts" section above

**Provider Information:**

- `Provider lifetime`: The duration since the Provider registered in the Network
- `Total CCs over time`: The number of CCs the Provider has created to date. For detailed information about the Provider's published CCs and their status, visit the Provider's page in the Explorer: [https://explorer.fluence.dev/provider/](https://explorer.fluence.dev/provider/)`<Provider id>`/capacity

#### Stake button view

The "Stake" button view depends on whether you have authenticated by connecting your wallet to the web application and have an NFT that grants you the right to stake tokens for Capacity Commitments:

- If you haven't connected your wallet to the application yet, you'll see a "Connect wallet" button.
    <div style={{ textAlign: "center" }}>
    <img

  src={require('./assets/stake_button_unauth.png').default}
  alt="The Stake button view for unauthenticated users"
  style={{ display: "block", margin: "auto", maxWidth: "50%" }}

  />
    </div>

- If you've connected your wallet but don't have a Fluence NFT, you'll see an "NFT required" button with an information message below it. Read more about Fluence NFTs and how to get one in the corresponding guide.
  <div style={{ textAlign: "center" }}>
  <img

  src={require('./assets/stake_button_nft.png').default}
  alt="The Stake button view for authenticated users without Fluence NFT"
  style={{ display: "block", margin: "auto", maxWidth: "50%" }}

  />
    </div>

- If you've connected your wallet and have a Fluence NFT, you're free to stake to any CC you like.
  However, if a provider has set exclusive staking rights for another address, the "Stake" button will be inactive. In that case, you need to choose another CC for staking.
  <div style={{ textAlign: "center" }}>
  <img

  src={require('./assets/stake_button_reserved.png').default}
  alt="The Stake button view for authenticated users with a Fluence NFT, who cannot stake because the CC's provider has set exclusive staking rights for another address"
  style={{ display: "block", margin: "auto", maxWidth: "50%" }}

  />
    </div>

- If you've connected your wallet and have a Fluence NFT, you're free to stake to any CC you like. In an individual CC card, a "Stake" button will be active. Read more about how to choose a CC for staking in the section below.
  <div style={{ textAlign: "center" }}>
  <img

  src={require('./assets/stake_button_active.png').default}
  alt="The active Stake button view for authenticated users with Fluence NFT"
  style={{ display: "block", margin: "auto", maxWidth: "50%" }}

  />
    </div>

### Staked Capacity Commitments section

This section lists of Capacity Commitments (CCs) activated by the logged-in user or all users. CCs are displayed as expandable cards, providing various information about their performance.

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/staked_cc_section_view.png').default}
    alt="The view of the Staked Capacity Commitments section"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the Staked Capacity Commitments section</p>
</div>

You can filter the list by the Capacity Commitment status by clicking on the "Status" collapsable list and choosing the target status of CCs to show.

:::info
Depending on whether you have logged in by connecting your wallet, the CCs listed will be different:

- Without a connected wallet, you'll see all Capacity Commitments listed, allowing you to track and analyze overall Network performance and rewards
- When logged in with your wallet, you'll only see CCs you've activated, along with buttons to withdraw rewards and collateral

:::

#### Individual CC card general information fields

In the collapsed state, each card shows the following general information about a CC:

- `Capacity Commitment ID`: A unique identifier for the CC, with a hyperlink to the Fluence Explorer. This link provides detailed information about the CC, including a list of its Compute Units (CUs)
- `Provider name`: The name set by the Provider for public display. You can use this name to identify the Provider and find more information in both the Staking Application and [Fluence Explorer](https://explorer.fluence.dev/)
- `Expiration`: The period during which the CC will remain active and earn rewards unless it fails earlier
- `Staking reward`: The share of rewards the staker earns for Capacity Commitment activity
- `Status`: The current status of the CC

#### Individual CC card data fields

By clicking on an individual CC card, you can expand it to view additional information about the CC's performance, collateral, and current rewards:

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/staked_cc_card_extended.png').default}
    alt="The view of a staked Capacity Commitment card extended"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of a staked Capacity Commitment card extended</p>
</div>

**Statistics:**

- `Total CPU cores`: Number of Compute Units (CU) in this Capacity Commitment (CC)
- `Staked at`: The date when this Capacity Commitment was staked
- `Expiration`: The date when this Capacity Commitment will end and stop earning rewards unless it fails earlier
- `Missed proofs / Threshold`: How many times have this CC's CUs failed to submit Proofs; How many failures are allowed before it's considered failed.
- `Average CC APR`: The estimated yearly return rate, based on the average of rewards earned so far

**Collateral:**

- `Staked collateral`: The amount of FLT staked for the CC
- `Current collateral`: Present value of collateral to be returned to the staker; equals the staked amount if not slashed. **May be zero for already ended CCs with collateral withdrawn**

**Rewards:**

Current CC rewards information mirrors the fields in the total capacity commitments rewards panel. If you're logged in and have staked for the CC, you can withdraw available rewards.

## How to Stake for a Capacity Commitment with the Staking Application

This section provides a step-by-step guide to staking for Capacity Commitments in the Fluence Staking Application.

### Prepare Your Wallet

You'll first need to connect a compatible crypto wallet to use the Staking Application. This section will guide you through ensuring your wallet is ready for use with the Staking Application.

:::tip

Read the comprehensive [guide](../wallets_guide/wallets_guide.md) on using crypto wallets with Fluence web applications.

:::

To ensure your wallet is ready for the Staking Application, verify the following:

1. Your wallet is compatible with Fluence authentication methods.
2. You've added the Fluence network to your wallet's list of networks.
3. You've imported the FLT token, and it's visible in your wallet's token list.
4. You have FLT tokens _in the Fluence Network_. As Fluence is an L2 Network, you must first bridge your FLT tokens from Ethereum to Fluence using the official Bridge. Click "Bridge" in the top center navigation bar to access the Bridge.
5. You have a Fluence NFT that grants you the right to stake for Capacity Commitments. For more information, refer to the corresponding official [guide](PUT THE LINK).

Once your wallet is connected to Fluence, it's time to choose the Capacity Commitment to stake for!

### Find the CC that meets your requirements

To find a CC that matches your requirements, let's review the most important criteria:

- **Expected APR and staking rate:** These values determine your potential rewards. A low staking rate means the Provider shares fewer rewards, but this is relative. A high-performance Compute Peer with a low rate might still outperform a smaller peer with a high rate.
- **Duration:** This is the period your funds will be staked for, if they do not fail earlier because the collateral slashing threshold has been reached. Shorter terms allow quicker fund retrieval and re-staking, while longer terms yield higher rewards.
- **Provider reputation:** Use the Staking Application and Fluence Explorer to assess provider performance.

### Stake

After you've found the CC(s) you want to stake on, it's time to delegate your FLT tokens:

1.  Expand the target CC's card by clicking it
2.  Ensure you're eligible to stake: your wallet is connected to the application, and you own a Fluence NFT in that wallet
3.  Click the "Stake" button

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/stake_view_of_card_for_staking.png').default}
        alt="The view of a card of CC available for staking."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

4.  Confirm that you agree with the staking terms in the popped-up window
    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/stake_confirm_depo_app_view.png').default}
        alt="The view of a confirmation window for staking."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

5.  Sign the transaction in your wallet

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/stake_sign_tx.png').default}
        alt="The view of a transaction signing window in the wallet."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

6.  A message informing about a successful staking will pop up. This message has the link to the transaction in the block explorer under the "Tx: …" text

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/stake_confirmed_depo_view.png').default}
        alt="The view of a successful staking confirmation message."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

7.  You can proceed to the "**Your Capacity Commitments**" section under the list of available for staking CCs section and monitor the status and performance of the staked CC, or stay on this page and choose other CCs for staking

:::info

If someone else has staked a CC before you while you were sending the transaction, or if the transaction has reverted, you will see a message informing you of this!

:::

## How to withdraw rewards

:::info
A Capacity Commitment provider is eligible to initiate the rewards withdrawal process before a staker. In this case, the rewards are automatically transferred to the staker wallet, and the process described below is skipped.
:::

To withdraw rewards, log in to the application using the wallet address you used to activate Capacity Commitments.

The Rewards panel will then display your rewards' current status. "Available to claim" shows the rewards that have been unlocked and are ready to be claimed.

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/withdraw_rew_panel_view.png').default}
    alt="The view of the rewards panel with available rewards to withdraw."
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the rewards panel with available rewards to withdraw</p>
</div>

### Withdraw rewards from an individual CC

If you want to withdraw rewards from a CC where they are available, do the following:

1.  Find the CC in the list and click its card to expand it

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/card_for_withdraw_view.png').default}
        alt="The view of a card of a CC available for rewards withdrawal."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

2.  Click the "withdraw rewards" button
3.  Confirm the withdrawal in the popped-up window

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdraw_rew_card_confirm_in_app.png').default}
        alt="The view of a confirmation window for rewards withdrawal."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

4.  Confirm the transaction in your wallet. Notice that the information window in the Staking Application contains the ID of commitment you are withdrawing from

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdraw_rew_card_confirm_in_wallet.png').default}
        alt="The view of a transaction signing window in the wallet."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

5.  An information message confirming the successful withdrawal will pop up

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdraw_rew_one_cards_success.png').default}
        alt="The view of a successful rewards withdrawal confirmation message."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

6.  Ensure that the correct amount of rewards has been transferred to your account and that in the individual CC card:
    - The amount of rewards available to claim has reduced (to zero or a smaller positive value if, during the withdrawal, a new reward was vested)
    - The total claimed value has increased by the amount of rewards withdrawn.

### Withdraw all available rewards

If you want to withdraw rewards from only one CC where they are available, do the following:

1.  Click the "Withdraw available rewards" button in the top right panel "Rewards."
2.  Confirm the withdrawal in the popped-up window

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdr_rew_all_confirm_app.png').default}
        alt="The view of a confirmation window for rewards withdrawal."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

3.  Confirm the transaction in your wallet. Notice that the information window in the Staking Application contains the number of commitments you are withdrawing from

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdr_rew_all_confirm_wallet.png').default}
        alt="The view of a transaction signing window in the wallet."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

4.  An information message confirming the successful withdrawal will pop up

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdr_rew_all_success.png').default}
        alt="The view of a successful rewards withdrawal confirmation message."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

5.  Ensure that the correct amount of rewards has been transferred to your account and that in the rewards panel:

    - The amount of rewards available to claim has reduced (to zero or a smaller positive value if, during the withdrawal, a new reward was vested)
    - The total claimed amount value has increased by the amount of rewards withdrawn

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/panel_all_rewards_withdrawn.png').default}
        alt="The view of a panel with all rewards withdrawn."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

### How to withdraw collateral

:::info
The Capacity Commitment provider is eligible to initiate the collateral withdrawal process before the staker removes its Compute Units from the ended CC. In this case, the collateral is automatically transferred to the staker's wallet, and the process described below is skipped.
:::

A staker can withdraw their collateral from a CC once it has completed or failed. The process for withdrawing collateral is essentially the same for completed and failed Capacity Commitments.

However, there's one important difference: _Failed CCs have a cooldown period_, during which stakers cannot withdraw collateral. In such cases, the withdrawal button won't appear in the interface until the cooldown period has passed.

:::note[**Important numbers**]

The cooldown period for withdrawing collateral from a **Failed CC** **now** is **0 epochs** - instant withdrawal is available.
In the **future**, it will be set to **30 days** during which stakers cannot withdraw collateral.

:::

To withdraw collateral from a Capacity Commitment, do the following:

1.  Find the CC in the list and click its card to expand it

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdraw_collateral_cc_card_view.png').default}
        alt="The view of a card of a CC available for collateral withdrawal"
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

2.  Click the "withdraw collateral" button
3.  Confirm the withdrawal in the popped-up window

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdraw_collateral_confirm.png').default}
        alt="The view of a confirmation window for collateral withdrawal"
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

4.  Confirm the transaction in your wallet
5.  An information message confirming the successful withdrawal will pop up

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdraw_collateral_success.png').default}
        alt="The view of a successful collateral withdrawal confirmation message"
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

6.  Ensure that the correct amount of tokens has been transferred to your account and that in the individual CC card:

    - The current collateral field now has 0 tokens available
    - The withdraw collateral button now displays "already withdrawn"
    - The status field in the card is now "withdrawn"

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/withdraw_collateral_card_after_view.png').default}
        alt="The view of a card of a CC after collateral withdrawal"
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>
