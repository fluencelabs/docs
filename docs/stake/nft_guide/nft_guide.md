# Fluence NFT Marketplace User documentation

## About Fluence NFT Collection

Anyone with sufficient FLT tokens can stake on the Fluence network and join us in our mission to enable decentralized computing worldwide. Access to staking is enabled by Fluence NFTs, which were initially distributed to the winners of the first [FLT Stake Race](https://race.fluence.network/) last month.
To participate, you must first purchase an NFT from the newly launched [NFT Marketplace](https://nft.fluence.network/), where existing NFT holders can list their NFTs for sale.

Once you have purchased your NFT, you can start staking FLT Tokens by going to the [Fluence Staking App](https://stake.fluence.network/), where you'll see a list of all available Capacity Commitments.

If you are unfamiliar with the Fluence Network and the role of stakers, we recommend first reading the official [Key Concepts for Stakers](../overview.md#fluence-key-concepts-for-stakers).

:::note

Additional NFTs will be released to the upcoming second Stake Race campaign winners.

:::

This guide will walk you through using the Fluence NFT Marketplace, where you can buy, sell, or transfer NFTs on the Fluence Network. We'll start with an overview of the Marketplace interface. Then, we'll provide step-by-step instructions on how to buy a Fluence NFT and what to do with it once you own it, including how to sell or transfer it.

### Prepare Your Wallet

Before diving into the Marketplace, it's crucial to set up a compatible crypto wallet. Ensure your wallet meets the following criteria to interact with the Fluence Web Applications:

1. Your wallet is compatible with Fluence authentication methods.
2. You've added the Fluence network to your wallet's list of networks.
3. You've imported the FLT token, and it's visible in your wallet's token list.
4. You have FLT tokens _on the Fluence Network_. As Fluence is an L2 Network, you must first bridge your FLT tokens from Ethereum to Fluence using the official [Bridge](https://bridge.fluence.network/bridge/fluence). Read more on using the bridge in the official [documentation](../bridge_guide/bridge_guide.md).

:::tip

Read the comprehensive [guide](../wallets_guide/wallets_guide.md) on using crypto wallets with Fluence web applications.

:::

With your wallet configured and connected to the Fluence NFT Marketplace, you can now buy or sell Fluence NFTs.

## The Marketplace interface overview

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/main_page_view.png').default}
    alt="The view of the Fluence NFT Marketplace main page."
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the Fluence NFT Marketplace main page</p>
</div>

:::note

Be cautious and use only the official application at [https://nft.fluence.network/](https://nft.fluence.network/). Never share your private keys or seed phrases with anyone, and always double-check the URL before signing the transactions.

:::

The main page of the Fluence NFT Marketplace features three key elements:

- **Top right:** An authentication button to connect your wallet. For a detailed guide on using crypto wallets with Fluence web applications, read the official [guide](../wallets_guide/wallets_guide.md).
- **Bottom left:** A link to the Fluence NFT collection page, where you can buy and sell NFTs and link to the user documentation.

Now, let’s look at the Fluence NFT collection page.

### Fluence NFT collection page

You can find all the minted Fluence NFTs on the main page of the NFT collection site.

<div style={{ textAlign: "center" }}>
  <img

    src={require('./assets/collection_main_view.png').default}
    alt="The view of the Fluence NFT Collection main page."
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

  <p>The view of the Fluence NFT Collection main page</p>
</div>

You can apply the filters by pressing the buttons:

- `All NFTs`: All NFTs on the Marketplace.
- `For sale`: All NFTs currently sold on the Marketplace.
- `My NFTs` (only for logged-in users): NFTs you own.

## How to buy an NFT

You can buy an NFT from the Fluence NFT Collections in a few simple steps:

1.  First, find NFTs sold on the marketplace by clicking the **“For Sale”** button. In the opened list, choose an NFT that meets your needs.

    <div style={{ textAlign: "center" }}>
    <img

        src={require('./assets/for_sale_view.png').default}
        alt="The view of the For Sale NFTs page."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

    </div>

2.  Click on the NFT card you want to purchase and press the “Buy NFT " button.

    <div style={{ textAlign: "center" }}>

    <img

        src={require('./assets/nft_card_for_purchase.png').default}
        alt="The view of an NFT card for purchase."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

    </div>

3.  Confirm the transaction in your wallet

    <div style={{ textAlign: "center" }}>

    <img

        src={require('./assets/confirm_purchase_view.png').default}
        alt="The view of the wallet window to confirm the purchase."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

    </div>

4.  Go to “My NFTs” and find your newly bought NFT by its name. Note that the purchased NFT is no longer available for purchase, as indicated by its “Not for sale” status.

    <div style={{ textAlign: "center" }}>

    <img

        src={require('./assets/my_nfts_page.png').default}
        alt="The view of the My NFTs page."
        style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

    </div>

5.  Now you can stake for Capacity Commitments with the NFT you’ve purchased or keep it until you want to sell it or transfer it to someone

## How to Sell or Transfer an NFT

You can list your NFTs for sale at a price you set or transfer them to another address.

First, open the card of the NFT you wish to sell or transfer by pressing the 'My NFTs' button and clicking on the target NFT.

<div style={{ textAlign: "center" }}>

<img

    src={require('./assets/owned_nft_card_view.png').default}
    alt="The view of the owned NFT card."
    style={{ display: "block", margin: "auto", maxWidth: "80%" }}

/>

</div>

### Transfer an NFT

You can transfer your NFT regardless of its sale status. For that, open the NFT card to be transferred and follow these steps:

1.  Enter the recipient's address.
2.  Press the 'Transfer' button.
    <div style={{ textAlign: "center" }}>

    <img

         src={require('./assets/nft_card_for_transfer_view.png').default}
         alt="The view of the owned NFT card prepared transfer button."
         style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

     </div>

3.  Confirm the transaction in your wallet.

    <div style={{ textAlign: "center" }}>

    <img

         src={require('./assets/confirm_nft_transfer.png').default}
         alt="The view of the wallet window to confirm the NFT transfer."
         style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

     </div>

**Note:** NFTs are sold and transferred on the Fluence Network. For the recipient to see the NFT in their wallet, the Fluence Network should be added first. Read more on preparing the wallet to work with Fluence Network in the corresponding [guide](../wallets_guide/wallets_guide.md).

### Set NFT for sale

When you list an NFT for sale, and someone buys it, the funds are automatically transferred to your address. To sell an NFT, open the NFT card to be sold and follow these steps:

1.  Approve the Marketplace to manage all your NFTs - to transfer them automatically to a buyer; if you haven’t done it before - press the “Approve collection” button.

     <div style={{ textAlign: "center" }}>

    <img

          src={require('./assets/nft_card_approve_collection.png').default}
          alt="The view of the NFT card with the approve collection button."
          style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

    </div>

2.  Confirm the approval in your wallet.

    <div style={{ textAlign: "center" }}>

    <img

          src={require('./assets/nft_approve_collection_wallet.png').default}
          alt="The view of the wallet window to confirm the NFT collection approval."
          style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

    </div>

3.  Set your desired selling price for the NFT. Press the "Set to Sell" button and confirm the transaction in your wallet.

    <div style={{ textAlign: "center" }}>

    <img

          src={require('./assets/confirm_sell_nft_wallet.png').default}
          alt="The view of the wallet window to confirm the NFT sale."
          style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

    </div>

4.  Check that the listed NFT has the correct price.
5.  Wait for the NFT to be sold to someone. Once sold, you'll automatically receive your tokens.

:::note

Even if your NFT is set for sale, you still can transfer it manually without changing the “for sale” status. To do so, open its card and follow the steps described above in the “Transfer NFT” section.

:::

### How to Change the price or Delist an NFT from a sale

You can easily adjust the price or remove an NFT you've listed for sale. Click on the card of the NFT on sale and choose your action:

- To remove the NFT from sale, press the "Delist" button and confirm the transaction in your wallet.
- To change the price, enter the new amount, press the "Change price" button, and confirm the transaction in your wallet.

![Screenshot 2024-09-17 at 17.43.35.png](assets/nft_delist_button.png)

<div style={{ textAlign: "center" }}>

    <img

          src={require('./assets/nft_delist_button.png').default}
          alt="The view of the NFT card with the delist button."
          style={{ display: "block", margin: "auto", maxWidth: "80%" }}

    />

    </div>