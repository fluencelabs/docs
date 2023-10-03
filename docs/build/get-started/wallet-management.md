# Wallet Management and How to Get the Testnet Tokens

## Wallet, Payment token and Gas Token

You need a [WalletConnect](https://walletconnect.com/) compatible wallet, such as [MetaMask](https://metamask.io/), to be able to fund the hosting and execution of your distributed services with (testnet) USDC.

Fluence Testnet is integrated with Polygon Mumbai Testnet, and you will need the following tokens on your wallet in order to deploy and run your functions:
- Polygon Mumbai Testnet MATIC (gas token for transacting on the network)
- Fluence Testnet USDC (for funding deals on Fluence Testnet)
- (Optional) Fluence Testnet FLT (for funding the provider collateral on Fluence Testnet)

Resources:

- [Mumbai Chainlist RPC](https://chainlist.org/?testnets=true&search=mumbai)
- [Mumbai Faucet](https://faucet.polygon.technology)
- [Mumbai Explorer](https://mumbai.polygonscan.com)
- Fluence testnet [USDC faucet](https://faucet-kras.fluence.dev)

### Adding Mumbai Testnet to MetaMask

#### 1. Open MetaMask and click on the network menu at the top and select "Add Network".

> **Important! The Polygon network that automatically pops up in the list of networks is not the one you need; we'll be adding the Mumbai testnet.**

<div style={{ textAlign: "center" }}>
    <img src="/img/metamask-add-network.png" alt="Add Network on MetaMask" style={{ display: "block", margin: "auto", width: "50%" }} />
    <p>Figure 1: Add Network on MetaMask</p>
</div>

#### 2. Scroll down and click on "Add a network manually"

<div style={{ textAlign: "center" }}>
    <img src="/img/metamask-add-manually.png" alt="Add Manual Network on MetaMask" style={{ display: "block", margin: "auto", width: "50%" }} />
    <p>Figure 2: Add Manual Network on MetaMask</p>
</div>

#### 3. Fill in the following information and click "Save"

- **Network Name**: Mumbai Testnet
- **New RPC URL**: https://polygon-mumbai-bor.publicnode.com
- **Chain ID**: 80001
- **Symbol**: MATIC
- **Block Explorer URL**: https://mumbai.polygonscan.com

<div style={{ textAlign: "center" }}>
  <img
    src="/img/metamask-mumbai-chain-info.png"
    alt="Populate Mumbai Testnet Information on MetaMask"
    style={{ display: "block", margin: "auto", maxWidth: "50%" }}
  />
  <p>Figure 3: Populate Mumbai Testnet Information on MetaMask</p>
</div>

Now that we have enabled the Mumbai testnet on our wallet, visit the [Mumbai Faucet](https://faucet.polygon.technology) to get some tokens.

### Requesting MATIC Tokens from Polygon Testnet Faucet

#### 1. Head over to the [Mumbai Faucet](https://faucet.polygon.technology)
#### 2. Connect through Dicsord and paste your wallet address

<div style={{ textAlign: "center" }}>
  <img
    src="/img/metamask-request-mumbai-tokens.png"
    alt="Connect MetaMask to Polygon Faucet"
    style={{ display: "block", margin: "auto", maxWidth: "50%" }}
  />
  <p>Figure 4: Request Mumbai Matic tokens from Polygon Testnet Faucet</p>
</div>

#### 3. Check your account to confirm that you have received the requested tokens

<div style={{ textAlign: "center" }}>
  <img
    src="/img/metamask-updated-MATIC-balance.png"
    alt="MetaMask wallet with MATIC balance"
    style={{ display: "block", margin: "auto", maxWidth: "50%" }}
  />
  <p>Figure 5: MetaMask wallet with MATIC balance</p>
</div>

Finally, head over to the Fluence faucet, located [here](https://faucet-kras.fluence.dev).

### Fluence Faucet

#### 1. Head over to the [Fluence faucet](https://faucet-kras.fluence.dev)
#### 2. Click the "Login" button at the centre of the page

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-login.png"
    alt="Login into the Fluence Interface"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 6: Login into the Fluence Interface</p>
</div>

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-sign-up.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 7: Create an account or Login</p>
</div>

#### 3. After logging in, click on the "Add tUSDC to metamask" button

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-add-tUSDC.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 8: Fluence Interface for Adding tUSDC to Account</p>
</div>

MetaMask will automatically populate the token symbol and decimals of precision fields.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-add-tUSDC-metamask.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 9: Adding Suggested tUSDC Token on MetaMask</p>
</div>

#### 4. Verify that you've successfully added tUSDC to your account

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-add-tUSDC.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 10: Verify Addition of tUSDC on MetaMask</p>
</div>

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-confirm-tUSDC-added.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 11: Confirm tUSDC Addition to Account</p>
</div>

#### 5. Navigate back to the Fluence Faucet. In the "Token Contract Address" field, enter your account address and click "Get tUSDC"

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-request-tUSDC.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 12: Request tUSDC using Account Address</p>
</div>

The faucet will confirm the transfer with the following information:

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-tUSDC-transfer-update.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 13: Metadata for tUSDC Faucet Transfer</p>
</div>

#### 6. Confirm the tUSDC tokens were received.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/fluence-faucet-confirm-fluence-transfer.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 14: Check tUSDC Account Balance</p>
</div>

#### 7. To see the transaction data info for both MATIC and tUSDC transfers into your account, head over to the [explorer](https://mumbai.polygonscan.com).

<div style={{ textAlign: "center" }}>
  <img
    src="/img/aurora-explorer-inspect-transfers.png"
    alt="Create an account or Login"
    style={{ display: "block", margin: "auto", maxWidth: "100%" }}
  />
  <p>Figure 15: Inspect Transfers via Polygon Faucet</p>
</div>