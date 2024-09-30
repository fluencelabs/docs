# Bridge Application User Guide

## Introduction

Fluence is a Layer 2 (L2) network bridging to Ethereum. To participate in the Fluence Network, you must first transfer your funds from Ethereum to the Fluence network, which is done with the Fluence blockchain Bridge Application.
This guide will walk you through using the Application and showing you how to move your assets between Ethereum and Fluence.

### Key concepts

Fluence Chain (FC) uses an Optimistic Rollup system:

- **Optimistic Rollup**: A scaling solution that assumes all transactions are valid unless proven otherwise. This approach allows for faster processing but requires a security mechanism called "fraud proofs."
- **Challenge Period**: When withdrawing funds from Fluence to Ethereum, there's a 7-day waiting period. This period allows enough time for any potentially fraudulent transactions to be identified and disputed.

The transfer times vary for deposit and withdrawal operations:

- **Deposits (Ethereum to Fluence)**: Up to 15 minutes to provide the maximum security for your transactions.
- **Withdrawals (Fluence to Ethereum)**: Take seven days due to the challenge period, ensuring maximum security for your funds. When the challenge period ends, you can _claim_ your funds in the Bridge App.

### Supported tokens

Currently, the Fluence Bridge supports two types of ERC20 tokens:

1. **FLT (Fluence Token)**: The primary Fluence token, used to reward Providers and Stakers for Capacity Commitment Proofs and for gas payments in the Fluence Network.
2. **USDC (USD Coin)**: Used as a payment token for renting compute resources from Compute Providers by users.

### Fee Structure for Cross-Chain Transfers

You can transfer both tokens (FLT and USDC) between Ethereum and the Fluence chain in either direction. However, it's essential to understand the fee structure for these transfers.

#### Ethereum to Fluence Transfers

When moving funds from Ethereum to Fluence, you'll need to pay transaction fees in two currencies _simultaneously_:

- ETH: for the Ethereum network fees
- FLT: for the minimum transaction fees on the Fluence network

#### Fluence to Ethereum Transfers

When moving funds from Fluence to Ethereum, you'll need to pay transaction fees in two currencies _separately_:

1. FLT: for the Fluence network fees when you initiate the withdrawal
2. ETH: for the Ethereum network fees when you claim the withdrawal after the challenge period

### Prepare your wallet

You'll first need to connect a compatible crypto wallet to use the Bridge Application.

:::tip

Read the comprehensive [guide](../wallets_guide/wallets_guide.md) on using crypto wallets with Fluence web applications.

:::

To ensure your wallet is ready for the Bridge application, verify the following:

1. Your wallet is compatible with Fluence authentication methods
2. You've added the Fluence network to your wallet's list of networks
3. You've imported the FLT token, and it's visible in your wallet's token list

Once you've ensured that your wallet can interact with the Fluence Network and obtained tokens for bridging, you can use the Bridge application to deposit tokens from Ethereum to Fluence and withdraw tokens from Fluence to Ethereum.

:::note

MetaMask is used as the wallet for the examples and demonstrations, but the actions shown are similar to most crypto wallets.

:::

## The Bridge App guide

### Overview

You can find the link to the Bridge in the navigation bar of the Staker application, "Bridge" section, or use the official [link](https://bridge.fluence.network):

:::note

Be cautious and use only the official Bridge Application at [https://bridge.fluence.network](https://bridge.fluence.network). Never share your private keys or seed phrases with anyone, and always double-check the URL before signing the transactions.

:::

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/bridge_app_view.png').default}
    alt="The main view of the Bridge Application"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the Bridge Application main page</p>
</div>

The Bridge application consists of the following parts:

- Authentication button (top right corner):
  - For unauthenticated users: **"Connect"** button for logging in with a crypto wallet
  - For authenticated users: a panel displaying your wallet address and icons to log out
- The main bridge panel (in the center) with two options:
  - Deposit tab: Transfer tokens from the Ethereum network to Fluence
  - Withdraw tab: Move tokens from Fluence back to the Ethereum network
- History (only for authenticated users): The time face icon to the left of the auth panel. Displays a record of your prior withdrawals from Fluence to Ethereum. Refer to the [Withdrawals history page](#withdrawals-history-page) section below for more details.

To start using the Bridge application, you must first authenticate by connecting your crypto wallet to the application. To do so, press the button at the top right corner and select your preferred wallet.

Let's start by exploring how to deposit tokens from Ethereum to Fluence — a quick and straightforward process.

### Depositing Tokens (Ethereum to Fluence)

To bridge tokens from the Ethereum Mainnet to the Fluence Mainnet:

1.  Select the **"Deposit"** tab in the main panel of the bridge application.
2.  Choose the token you want to bridge. In this example, we're bridging FLT tokens.
3.  Enter the number of tokens you wish to bridge.
4.  Verify that the correct amount is displayed in the bridge panel and that you have enough FLT tokens in your wallet to cover the transaction fee specified in the "Estimated fees" field.
      <div style={{ textAlign: "center" }}>
        <img

            src={require('./assets/bridge_view_deposit_main.png').default}
            alt="The view of the wallet window with the token amount to deposit."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

5.  Click the **"Bridge Funds"** button.
6.  Your wallet application will ask you to sign several transactions, one after another:

    - Allow the bridge app to send the amount of tokens you specified. Ensure that the spending cap corresponds to the actual amount and confirm the transaction
      <div style={{ textAlign: "center" }}>
        <img

            src={require('./assets/bridge_allow_spending.png').default}
            alt="The view of the wallet window asking to allow the bridge app to spend the tokens."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

      />
        </div>

    - To initiate bridging
        <div style={{ textAlign: "center" }}>
        <img

            src={require('./assets/wallet_initiate_bridging.png').default}
            alt="The view of the wallet window asking to initiate the bridging."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

      />
        </div>

7.  If the token bridging transaction is successful, you will be redirected to the Bridge application, and the success message will be displayed.
    This window contains two critical links: to the L1 bridge transaction info (on [Etherscan](https://etherscan.io/)) and the L2 block scanner ([Blockscanner](https://blockscout.mainnet.fluence.dev/)) with the transaction info.

    <div style={{ textAlign: "center" }}>
        <img

            src={require('./assets/success_deposit_window.png').default}
            alt="The view of the application window with the success message."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

        :::note

        **Bridging** from the Ethereum Mainnet to Fluence **takes** approximately **15 minutes**. This is done to ensure a high level of security for your funds.

        :::

8.  Once your tokens are bridged to the Fluence Mainnet, it will be reflected in the block scanner mentioned previously as a successful token transfer. You can check the transaction by hand by visiting the block scanner and entering your wallet address in the placeholder: [https://blockscout.mainnet.fluence.dev/address/](https://blockscout.mainnet.fluence.dev/address/)`<YOUR_WALLET_ADDRESS>`

    <div style={{ textAlign: "center" }}>
        <img

            src={require('./assets/blockscout_success_deposit.png').default}
            alt="The view of the block scanner with the successful transaction."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

9.  The transferred tokens will be reflected in your wallet as well. To see the transferred tokens, you need to switch the network of your wallet to the Fluence Mainnet and ensure that the FLT token was previously added to your wallet, or it won't be displayed (read more in the "Prepare your wallet" section)

    <div style={{ textAlign: "center" }}>
    <img

            src={require('./assets/deposit_show_added_tokens.png').default}
            alt="The view of the wallet window with the added tokens."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

Congratulations! You successfully and safely bridged your FLT tokens from the Ethereum Mainnet to the Fluence Mainnet network. Now, you can freely use your funds and stake your FLTs!

### Withdrawing Tokens (Fluence to Ethereum)

:::note

Tokens withdrawal from the Fluence Mainnet to the Ethereum Mainnet takes seven days.

The Fluence L2 Network uses Optimistic Rollups, which rely on a security mechanism called "fraud proofs." When a user initiates a withdrawal from an L2 network to Ethereum, the protocol enters a challenge period (7 days) to ensure that no fraudulent transactions have occurred.

:::

To bridge tokens from the Fluence Mainnet to the Ethereum Mainnet :

1.  Choose the “withdraw” tab in the central panel of the bridge application
2.  Choose the token you want to bridge. In this example, the FLT token is bridged
3.  Enter the amount of token you want to withdraw from Fluence to Ethereum to your connected account
4.  Ensure that in the bridge panel, the correct amount is displayed
5.  Press **“Withdraw Funds”** button
6.  Your wallet application will ask you to sign a transaction of token withdrawal:

    <div style={{ textAlign: "center" }}>
    <img

            src={require('./assets/withdraw_confirm_in_wallet.png').default}
            alt="The view of the wallet window asking to confirm the withdrawal."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

7.  If the transaction to withdraw the tokens is successful, you will be redirected to the bridge app and will see the success message:

    <div style={{ textAlign: "center" }}>
    <img

            src={require('./assets/success_withdrawal_message.png').default}
            alt="The view of the application window with the success message."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

8.  You can track your withdrawal status on the **Withdrawals history** page. To open it, press **“History”** button in the information message. Read more about **Withdrawals history** in the next [section](#withdrawals-history-page).
9.  You can also visit the Fluence blockscanner and ensure that the withdrawal initialization transaction has appeared. For that, open the link with your wallet address put in the placeholder: [https://blockscout.mainnet.fluence.dev/address/](https://blockscout.mainnet.fluence.dev/address/)`<YOUR_WALLET_ADDRESS>`.
    <div style={{ textAlign: "center" }}>
    <img

            src={require('./assets/blockscout_withdraw_info.png').default}
            alt="The view of the block scanner with the withdrawal transaction"
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

### Withdrawals history page

The Withdrawals history page provides users with an overview of their withdrawal transactions and their statuses. To open this page, you have to connect the wallet you've made transactions with first.

To access the Withdrawals history page, users have two options:

1. After initiating a funds withdrawal, a **"History"** button appears in the confirmation message. Clicking this button provides immediate access to recent activity.
2. Alternatively, you can click the time face icon located in the top-right corner, next to the account information.

It's important to note that the Withdrawals history data is only visible when your wallet is connected to the Ethereum Mainnet. Otherwise, the **"Switch network"** button will appear, which, when clicked, will initiate the network change process in the user's wallet application.

<div style={{ textAlign: "center" }}>
<img

    src={require('./assets/withdraw_history_wrong_network.png').default}
    alt="The view of the application window with the switch network message"
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

<p>The view of the Withdrawals history page for wallets not connected to Ethereum</p>
</div>

The "History" page serves as a personal ledger, offering updates on the progress of funds withdrawal. There you can see all of your pending and completed transactions with date, amount, status and the Tx hash with the link to the block scanner.

A withdrawal transaction may have following statuses:

- `Waiting`: The seven day challenge period hasn’t passed yet.
- `Claim`: The funds are ready to be claimed. User can press the **“Claim”** button to withdraw the funds. Read more about the withdrawal process in the section below.
- `Completed`: The funds has been withdrawn successfully.

<div style={{ textAlign: "center" }}>
<img

src={require('./assets/view_withdraw_history.png').default}
alt="The view of the application window with the withdrawals history"
style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

<p>The view of the Withdrawals history page</p>
</div>

#### Funds withdrawal after the challenge period has passed

Once the challenge period for your withdrawal transaction has expired (7 days), you will be able to safely withdraw your funds. You will see the **"Claim"** button in the **"Status"** field of the relevant withdrawal request. To withdraw the funds, follow these steps:

1.  Press the **"Claim"** button to initialize the withdrawal of the funds to your wallet

    <div style={{ textAlign: "center" }}>
      <img

               src={require('./assets/view_withdraw_history.png').default}
               alt="The view of the application window with the transaction history"
               style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
     </div>

2.  Confirm the transaction in your wallet

    <div style={{ textAlign: "center" }}>
    <img

               src={require('./assets/confirm_withdrawal_claim.png').default}
               alt="The view of the wallet window asking to confirm the withdrawal"
               style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
     </div>

3.  The withdrawal status should change to **"Completed"** and the funds transferred should be added to your wallet balance

    <div style={{ textAlign: "center" }}>

    <img

               src={require('./assets/claimed_withdraw_view.png').default}
               alt="The view of the application window with the claimed withdrawal"
               style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
     </div>
