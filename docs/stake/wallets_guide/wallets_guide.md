# How to use wallets with Fluence web applications

## Introduction

In the Web3 world, authentication relies on a private/public key scheme—a more secure method than traditional password-based approaches. Web3 wallets offer a convenient way to manage these keys and prove identity when logging in or signing transactions.

Fluence applications, like most Web3 services, use wallet-based authentication. You can use your preferred crypto wallet with our services, as we've added support for most wallets on both desktop and mobile platforms.

This guide will walk you through setting up your wallet and connecting to the Fluence network.

We'll then explain how to connect to Fluence web applications using your chosen wallet.

All Fluence web services employ the same authentication method. While the examples in this guide focus on the Fluence Bridge application, the user experience is similar across other Fluence applications.

## Prepare your wallet

Before using Fluence web services, you must set up a compatible cryptocurrency wallet. This section will guide you through connecting your wallet to a Fluence web application and outline the supported wallet options.

You can connect with either desktop or mobile wallets — choose whichever you prefer!

:::tip

You should already have a cryptocurrency wallet. If you don't, we recommend creating one using [MetaMask's beginner guide](https://support.metamask.io/getting-started/getting-started-with-metamask/)

:::

### Supported wallets

Fluence authentication supports various wallet options through either direct app integration or WalletConnect. WalletConnect, an open-source protocol, enables a wide range of wallets to connect with decentralized applications (dApps) via QR codes or deep links.

#### Direct Connection Options

The following wallets can directly connect to Fluence services:

- Metamask
- Rainbow
- Coinbase Wallet

#### WalletConnect

If your preferred wallet isn't directly supported, you can use WalletConnect.

Through WalletConnect, you can use:

- All the wallets listed above
- Many other popular wallets, including Ledger, Binance Wallet, and Phantom

For a comprehensive list of supported wallets, visit the [WalletConnect Explorer](https://explorer.walletconnect.com/?type=wallet)

:::note

Further Metamask is used as the main wallet for the examples, but the shown actions are mostly the same for the other wallets.

:::

### Import FLT tokens to your Ethereum wallet

:::note

You can skip this part if you have already added FLT tokens to your wallet and they are displayed in the list of available assets.

:::

Initially, FLT tokens are not displayed in your wallet connected to the Ethereum network and need to be added.

To display FLT tokens in your assets list (Metamask example is shown below):

1. User the address of the FLT token contract address: [0x236501327e701692a281934230AF0b6BE8Df3353](https://etherscan.io/token/0x236501327e701692a281934230AF0b6BE8Df3353)
2. Copy this string and open your wallet, find the “Import tokens” button, and press it
3. In the opened window, paste the token address to the input field and wait till the token symbol and the token decimal are loaded
4. Confirm the token addition and proceed
5. The token should appear in the list of your assets

:::note

To resolve any issues on the Metamask side, check the official [documentation](https://support.metamask.io/managing-my-tokens/custom-tokens/how-to-display-tokens-in-metamask/)

:::

<figure>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <img src={require('./assets/mm_import_tokens_1.png').default} alt="Import tokens step 1" style={{ width: '30%' }} />
    <img src={require('./assets/mm_import_tokens_2.png').default} alt="Import tokens step 2" style={{ width: '30%' }} />
    <img src={require('./assets/mm_import_tokens_3.png').default} alt="Import tokens step 3" style={{ width: '30%' }} />
  </div>
  <figcaption style={{ textAlign: 'center', marginTop: '10px' }}>How to add the FLT token in MetaMask</figcaption>
</figure>

### Add Fluence Network to your wallet

Your wallet does not include Fluence by default. This section will show you how to add Fluence Network to your wallet with Chainlist or manually.

#### Using Chainlist

You can add Fluence network with Chainlist:

1.  Fluence can be found on Chainlist by this [link](https://chainlist.org/chain/9999999). Proceed to the site.
2.  Press **“Connect Wallet”** button.

    <div style={{ textAlign: "center" }}>
        <img
        src={require('./assets/fluence_on_chainlist_view.png').default}
        alt="Fluence network on Chainlist"
        style={{ display: "block", margin: "auto", maxWidth: "70%" }}
        />
        <p>Fluence network listing on Chainlist</p>

    </div>

3.  In the opened window of your wallet approve the action of adding Fluence network to your wallet. Confirm the action by pressing the **"Approve"** button.

<div style={{ textAlign: "center" }}>
<img
    src={require('./assets/mm_add_fluence_from_chainlist.png').default}
    alt="Adding Fluence network to MetaMask"
    style={{ display: "block", margin: "auto", maxWidth: "70%" }}
/>
<p>Approving the addition of Fluence network in MetaMask</p>
</div>

4. Then in this window, the wallet will prompt you to switch the current network to Fluence. Confirm the switch by pressing the **"Switch network"** button.

<div style={{ textAlign: "center" }}>
  <img
    src={require('./assets/mm_switch_network_fluence_chainlist.png').default}
    alt="Switching to Fluence network in MetaMask"
    style={{ display: "block", margin: "auto", maxWidth: "70%" }}
  />
  <p>Switching to Fluence network in MetaMask</p>
</div>

#### Manually

To add Fluence Network manually:

1. Open the setting of your wallet app and find the **“Networks”** section or something similar

    <div style={{ textAlign: "center" }}>
     <img
       src={require('./assets/mm_settings_networks_list.png').default}
       alt="Switching to Fluence network in MetaMask"
       style={{ display: "block", margin: "auto", maxWidth: "70%" }}
     />
     <p>List of networks in the Metamask settings</p>
   </div>

2. Click the **“Add a Network”** button or similar
3. Fill the fields as follows:
   - **Network:** Fluence
   - **Network URL/ RPC URL:** [https://rpc.mainnet.fluence.dev](https://rpc.mainnet.fluence.dev)
   - **Chain ID:** 9999999
   - **Currency symbol:** FLT
   - **Block explorer URL:** [https://blockscout.mainnet.fluence.dev](https://blockscout.mainnet.fluence.dev/)
4. Click the **“Save”** button
5. Go to the list of your networks and ensure that Fluence is found in the list
6. Switch to Fluence Network

Now you have Fluence network on the list of the available networks in your wallet and is ready to connect to Fluence services.

## Connect your wallet

Now when you are ready to use your wallet, let’s authenticate by connecting your wallet in the application. This guide shows you how to use Metamask as a direct wallet and Trust Wallet mobile with WalletConnect to log in to Fluence services like the Fluence Staking App.

First, press the **“Connect Wallet”** button in the top right corner.

<div style={{ textAlign: "center" }}>
    <img
    src={require('./assets/staking_app_not_connected.png').default}
    alt="Staking app view without user's wallet connected"
    style={{ display: "block", margin: "auto", maxWidth: "90%" }}
    />
    <p>Fluence App top part view without the user's wallet connected</p>

</div>

### Connect with direct app

1. Choose a wallet to connect from the list of available ones

<div style={{ textAlign: "center" }}>
    <img
    src={require('./assets/staking_app_window_choose_wallets.png').default}
    alt="Example of choosing a wallet in the staking app"
    style={{ display: "block", margin: "auto", maxWidth: "70%" }}
    />

</div>

2. In the open wallet window, select the account for connection and confirm the action.

   <div style={{ textAlign: "center" }}>
    <img
    src={require('./assets/staking_app_choose_account_mm.png').default}
    alt="Example of choosing an account to connect"
    style={{ display: "block", margin: "auto", maxWidth: "70%" }}
    />
    </div>

3. **Optional step:** If your wallet is connected to a different network, you will need to switch to the Fluence Mainnet first. The application will prompt you to switch the network. Confirm the switch.

<div style={{ textAlign: "center" }}>
    <img
    src={require('./assets/staking_app_switch_network_mm.png').default}
    alt="Example of switching the network"
    style={{ display: "block", margin: "auto", maxWidth: "70%" }}
    />
</div>

4. When the wallet is connected, the “Connect” button in the top right corner will be replaced with new buttons: one with the network name and one with the connected wallet address on it.

      <div style={{ textAlign: "center" }}>
       <img
       src={require('./assets/staking_app_connected.png').default}
       alt="Staking app view with user's wallet connected"
       style={{ display: "block", margin: "auto", maxWidth: "90%" }}
       />
   </div>

5. You can press the button with the wallet address to see the connected wallet details and log out.

      <div style={{ textAlign: "center" }}>
       <img
       src={require('./assets/staking_app_connected_wallet_details.png').default}
       alt="Staking app view with user's wallet connected"
       style={{ display: "block", margin: "auto", maxWidth: "70%" }}
       />
   </div>

### Connect with WalletConnect

If your preferred wallet isn't directly supported, you can use WalletConnect to link it to the Fluence Bridge. The actions are similar to the direct connection, but the process starts with a QR code scan.

1. Select WalletConnect from the list of available wallets.
2. A QR code will appear on your screen.
   <div style={{ textAlign: "center" }}>
    <img
    src={require('./assets/staking_app_wc.png').default}
    alt="Example of WalletConnect QR code"
    style={{ display: "block", margin: "auto", maxWidth: "70%" }}
    />
    </div>

3. Choose the app for authentication:

   - For mobile: open your preferred wallet app on the phone and scan the QR code displayed
   - For desktop: press the “Open” button under the QR. Choose the desktop app for authentication you prefer

   In this guide, **Metamask mobile app** is used as an example.

4. Open your mobile wallet app and look for a scan or WalletConnect option (usually in the settings or the main menu).
5. Use your wallet app to scan the QR code displayed on the Fluence Bridge website.
6. Your wallet app will ask for confirmation to connect. Approve the connection.
7. **Optional step:** If your wallet is connected to a different network, you will need to switch to the Fluence Mainnet first. The application will prompt you to switch the network. Confirm the switch.

<figure>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <img src={require('./assets/mm_mobile_wallet_view.png').default} alt="Metamask mobile WalletConnect QR" style={{ width: '30%' }} />
    <img src={require('./assets/mm_mobile_connect_account.png').default} alt="Metamask mobile connect account request" style={{ width: '30%' }} />
    <img src={require('./assets/mm_mobile_switch_network.png').default} alt="Metamask mobile switch network request" style={{ width: '30%' }} />
  </div>
  <figcaption style={{ textAlign: 'center', marginTop: '10px' }}>How to connect to a Fluence Application through WalletConnect and a mobile application</figcaption>
</figure>

Now that you've connected your wallet to a Fluence Application, you're all set to start using it and participate in the Fluence Network.
