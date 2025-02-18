# Registration

## Self-Custodial Wallet

Smart contracts are used to rent and manage resources from the Fluence network, requiring users to use an [EVM wallet](https://blog.thirdweb.com/what-are-evm-wallets/). However, managing externally owned account (EOA) wallets, aka "regular" wallets, comes with certain limitations and pitfalls.

To address these concerns, our system uses a unique Self-Custodial Wallet based on a [solution from Web3Auth](https://web3auth.io/docs/how-web3auth-works), which operates on the [MPC](https://web3auth.io/docs/features/mpc) (Multi-Party Computation) protocol, instead of a standard EOA address. Thus, after a user registers through **Fluence Console**, a unique address is generated for them, and only the user has access to the private key. The private key is securely stored in parts within the distributed Web3Auth network and is protected by the MPC protocol. In turn, the Fluence protocol only has access to the user’s public address.

## Registration Process

:::warning
Please note that during registration, you must use the email address you provided in your Alpha VM testing program application.
:::

If you are using the Fluence Console for the first time, you need to register using one of the following methods:
1. [Email Passwordless Login](https://web3auth.io/docs/auth-provider-setup/social-providers/email-passwordless#helper-sdks-menu)
2. Google account
3. GitHub account

:::warning
If you register with the same email through Google and Email Passwordless, two different accounts will be created for you.
:::

![registration page](./assets/registration.webp)

After successful registration, you have access to the Fluence Console.
