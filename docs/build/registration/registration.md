# Registration

## Self-Custodial Wallet

As a decentralized project, self-custody over your wallet is a critical requirement for you stay in control over your data and resources. Yet, managing crypto wallets not only comes with certain limitations and pitfalls but also decouple users from well-known processes when it comes to account registration and log-ins.

To address these concerns while still providing you with the self-custodial powers, our registration and login system uses the [Web3Auth](https://web3auth.io/docs/how-web3auth-works) solution, which works as follows: after you register through **Fluence Console**, a unique (wallet) address is generated and only you have access to the private key. However, the private key is securely stored in parts on Web3Auth's [MPC](https://web3auth.io/docs/features/mpc) (Multi-Party Computation) network.  As a result, you have a self-custodial wallet that eliminates catastrophic (loss) failures commonly encountered with traditional, self-managed and seed-based wallets.

Of course, Fluence Console only has access to your wallet's public key.

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
