---
description: Stake FLT on Ethereum in the Fluence Token App to earn FLT rewards and a share of protocol revenue.
---

# Stake FLT

FLT is the token of the Fluence DAO, an ERC-20 token on Ethereum. You stake FLT in the [Fluence Token App](https://flt.fluence.ai/stake). Staked FLT earns FLT rewards and a share of protocol revenue.

If you held FLT, pFLT, or USDC on the Fluence chain, claim them on Ethereum first. See [Claim tokens from the Fluence chain](./chain_migration.md).

## How staking works

- Any FLT holder can stake, and there is no minimum amount.
- Staking is non-custodial and runs on Ethereum mainnet. Your FLT goes to the staking contract.
- Staked FLT earns rewards without a fixed commitment period. You can unstake it at any time.
- The Token App shows the current APR, the total value staked, your stake, and the rewards you can claim.

The Token App also describes locking FLT for a fixed period for a higher rewards multiplier. The **Lock** tab in the app is marked **Soon** and cannot be used yet.

| Contract on Ethereum mainnet | Address |
|---|---|
| FLT token | [`0x236501327e701692a281934230AF0b6BE8Df3353`](https://etherscan.io/address/0x236501327e701692a281934230AF0b6BE8Df3353) |
| Staking contract | [`0x60dBDe4Bdcf2fD8D6466f67CAB26F7dc905aa179`](https://etherscan.io/address/0x60dBDe4Bdcf2fD8D6466f67CAB26F7dc905aa179) |

Before you connect a wallet or approve a transaction, check that the app shows these addresses.

## Stake FLT

You need FLT and ETH for gas in a wallet on Ethereum mainnet. The FAQ on the staking page lists where FLT trades.

1. Open [flt.fluence.ai/stake](https://flt.fluence.ai/stake) and click **Connect Wallet**.
2. On the **Stake** tab, enter the amount in **You Stake**, or click **Max** to stake your whole balance.
3. Confirm the transaction in your wallet.

Your stake appears under **Your position** in **Your Stake**. Rewards add up in **Available to Claim**. To unstake, use the **Withdraw** tab.

## Show FLT in your wallet

Some wallets do not show FLT until you add the token. Add a custom token on Ethereum mainnet with the address `0x236501327e701692a281934230AF0b6BE8Df3353`. The wallet then fills in the symbol FLT and 18 decimals. In MetaMask, see [How to display tokens in MetaMask](https://support.metamask.io/managing-my-tokens/custom-tokens/how-to-display-tokens-in-metamask/).
