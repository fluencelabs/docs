# Bridge Application User Guide

## Introduction

Fluence is a Layer 2 (L2) network bridging to Ethereum. To participate in the Fluence Compute Marketplace and stake tokens, you need to transfer your funds from Ethereum to the Fluence network, which is done using the Fluence blockchain bridge.

We've developed a user-friendly bridge to facilitate funds transfer between Ethereum and the Fluence Network. This guide will walk you through moving your assets between the Ethereum Mainnet and the Fluence L2.

### Key concepts

Fluence Chain (FC) uses an Optimistic Rollup system:

- **Optimistic Rollup**: A scaling solution that assumes all transactions are valid unless proven otherwise. This approach allows for faster processing but requires a security mechanism called "fraud proofs."
- **Challenge Period**: When withdrawing funds from Fluence to Ethereum, there's a 7-day waiting period. This period allows enough time for any potentially fraudulent transactions to be identified and disputed.

Transfer Times:

- **Deposits (Ethereum to Fluence)**: Nearly instant, as they only require confirmation on the Ethereum blockchain.
- **Withdrawals (Fluence to Ethereum)**: Take seven days due to the challenge period, ensuring maximum security for your funds.

### Supported tokens

Currently, the Fluence Bridge supports two types of ERC20 tokens:

1. **FLT (Fluence Token)**: The main token is used to pay capacity rewards to providers, delegate staking to Capacity Commitments, and pay for gas within the Fluence network.
2. **USDC (USD Coin)**: Used as a payment token for renting compute resources from Compute Providers

Both tokens can be bridged from Ethereum to Fluence chain and vice versa. Note that on Ethereum, gas needs to be paid in ETH.

### Prepare your wallet

You'll first need to connect a compatible crypto wallet to use the Bridge Application. This section will guide you through ensuring your wallet is ready for use with the Bridge Application.

:::tip

Read the comprehensive [guide](../wallets_guide/wallets_guide.md) on using crypto wallets with Fluence web applications.

:::

To ensure your wallet is ready for the Bridge application, verify the following:

1. Your wallet is compatible with Fluence authentication methods
2. You've added the Fluence network to your wallet's list of networks
3. You've imported the FLT token, and it's visible in your wallet's token list

You can transfer tokens between networks once your wallet is connected to Fluence. The following sections explain how to use the Bridge application to deposit tokens from Ethereum to Fluence and withdraw tokens from Fluence to Ethereum.

:::note

MetaMask is used as the wallet for the examples and demonstrations, but the actions shown are mostly similar to those of other wallets.

:::

## Open the bridge application

You can find the link to the Bridge in the navigation bar of the Staker application under the "Bridge" section, or use the official links:

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
  - For unauthenticated users: "Connect" button for logging in with a crypto wallet
  - For authenticated users: a panel displaying your wallet address and icons to log out
- The main bridge panel (in the center) with two options:
  - Deposit tab: Transfer tokens from the Ethereum network to Fluence
  - Withdraw tab: Move tokens from Fluence back to the Ethereum network
- History (only for authenticated users, the time face icon to the left of the auth panel): Displays a record of your prior withdrawals from Fluence to Ethereum. Refer to the "Transactions history tab" section below for more details.

To start using the Bridge application, you must authenticate by connecting your crypto wallet to the dApp. Simply click the button at the top right corner and select your preferred wallet.

For a comprehensive guide on using crypto wallets with Fluence web applications, check out [this link](https://www.notion.so/User-s-guide-to-using-wallets-with-Fluence-web-applications-1025b9b0bcba80479589dc0136f5c791?pvs=21).

Let's start by exploring how to deposit tokens from Ethereum to Fluence — a quick and straightforward process.

## Depositing Tokens (Ethereum to Fluence)

To bridge tokens from the Ethereum Mainnet to the Fluence Mainnet:

1.  Select the "Deposit" tab in the main panel of the bridge application.
2.  Choose the token you want to bridge. In this example, we're bridging FLT tokens.
3.  Enter the number of tokens you wish to bridge.
4.  Verify that the correct amount is displayed in the bridge panel.
5.  Click the "Bridge Funds" button.
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
    This window contains two critical links: to the L1 bridge transaction info (on Etherscan) and the L2 block scanner with your wallet address transaction info.

    <div style={{ textAlign: "center" }}>
        <img

            src={require('./assets/success_deposit_window.png').default}
            alt="The view of the application window with the success message."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

        :::note

        Bridging from the Ethereum Mainnet to Fluence takes approximately 15 minutes. This is done to ensure a high level of security for your funds.

        :::

8.  Once your tokens are bridged to the Fluence Mainnet, it will be reflected in the block scanner mentioned previously as a successful token transfer.

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

## Withdrawing Tokens (Fluence to Ethereum)

:::note

Tokens withdrawal from the Fluence Mainnet to the Ethereum Mainnet takes seven days.

The Fluence L2 Network uses Optimistic Rollups, which rely on a security mechanism called "fraud proofs." When a user initiates a withdrawal from an L2 network to Ethereum, the protocol enters a challenge period (7 days) to ensure that no fraudulent transactions have occurred.

:::

To bridge tokens from the Fluence Mainnet to the Ethereum Mainnet :

1.  Choose the “withdraw” tab in the central panel of the bridge application
2.  Choose the token you want to bridge. In this example, the FLT token is bridged
3.  Enter the amount of token you want to withdraw from Fluence to Ethereum to your connected account
4.  Ensure that in the bridge panel, the correct amount is displayed
5.  Press “Withdraw Funds” button
6.  Your wallet application will ask you to sign a transaction of token withdrawal:

    <div style={{ textAlign: "center" }}>
    <img

            src={require('./assets/withdraw_confirm_in_wallet.png').default}
            alt="The view of the wallet window asking to confirm the withdrawal."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

7.  If the transaction to withdraw the tokens is successful, you will be redirected to the bridge app, and the success message that the withdrawal has been initialized will be shown:

    <div style={{ textAlign: "center" }}>
    <img

            src={require('./assets/success_withdrawal_message.png').default}
            alt="The view of the application window with the success message."
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

8.  You can track your withdrawal status in the “History” tab. To open it, press “History” button in the information message. Read more about “History” tab in the next section
9.  You can also visit the Fluence blockscanner and ensure that the withdrawal initialization transaction has appeared. For that, open the link with your wallet address put in the placeholder: [https://blockscout.mainnet.fluence.dev/address/](https://blockscout.mainnet.fluence.dev/address/)`<YOUR_WALLET_ADDRESS>`.
    <div style={{ textAlign: "center" }}>
    <img

            src={require('./assets/blockscout_withdraw_info.png').default}
            alt="The view of the block scanner with the withdrawal transaction"
            style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
    </div>

## Transaction history tab

### Overview

You can track the withdrawal process on the "History" page. To access it:

1.  Press the "History" button in the information message after initializing a funds withdrawal.
2.  Click the clock icon in the top right corner, next to your account information.
3.  Withdrawal history is displayed when you're connected to the Ethereum Mainnet network. If you're not connected, you'll be prompted to switch networks in your wallet. To do this, click the "Switch network" button and confirm the action in your wallet application.

    <div style={{ textAlign: "center" }}>
    <img

             src={require('./assets/withdraw_history_wrong_network.png').default}
             alt="The view of the application window with the switch network message"
             style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
     </div>

4.  In the transactions history tab, you can see all of your pending and completed transactions with date, amount, status and the Tx hash with the link to the block scanner.

    A withdrawal transaction may have following statuses:

    - `Waiting` - the seven day challenge period hasn’t passed yet.
    - `Claim` - the withdrawal is ready to be claimed. User can press the “Claim” button to withdraw the funds. Read more about the withdrawal process below.
    - `Completed` - the funds has been withdrawn successfully.
       <div style={{ textAlign: "center" }}>
         <img

      src={require('./assets/view_withdraw_history.png').default}
      alt="The view of the application window with the transaction history"
      style={{ display: "block", margin: "auto", maxWidth: "80%" }}

      />
      </div>

### Funds withdrawal after the challenge period has passed

1.  Once the challenge period for your withdrawal transaction has expired (7 days), you will be able to safely withdraw your funds. You will see the "Claim" button in the "Status" field of the relevant withdrawal request.
2.  Press the "Claim" button to initialize the withdrawal of the funds to your wallet

    <div style={{ textAlign: "center" }}>
      <img

               src={require('./assets/view_withdraw_history.png').default}
               alt="The view of the application window with the transaction history"
               style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
     </div>

3.  Confirm the transaction in your wallet

    <div style={{ textAlign: "center" }}>
    <img

               src={require('./assets/confirm_withdrawal_claim.png').default}
               alt="The view of the wallet window asking to confirm the withdrawal"
               style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
     </div>

4.  The withdrawal status should change to "Completed" and the funds transferred should be added to your wallet balance

    <div style={{ textAlign: "center" }}>

    <img

               src={require('./assets/claimed_withdraw_view.png').default}
               alt="The view of the application window with the claimed withdrawal"
               style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />
     </div>
