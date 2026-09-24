# Payment and balance management

Your Fluence account has a prepaid balance in USD. Rent for your CPU and GPU instances is charged from this balance, so top it up before you deploy. See the billing sections of [CPU Cloud](./cpu_cloud/overview.md) and [GPU Cloud](./gpu_cloud/overview.md) for how rent is charged.

The balance can only be spent on Fluence resources and cannot be withdrawn. If you need a refund, contact the Fluence team.

## Top-up methods

| Method | Provider | How you pay |
|--------|----------|-------------|
| **Crypto** | [NOWPayments](https://nowpayments.io/) | Cryptocurrency. You choose the coin and the network on the NOWPayments payment page |
| **Card** | [Stripe](https://stripe.com/) | Credit or debit card on the Stripe checkout page |
| **Promo code** | — | Enter a code you received from the Fluence team |

:::info
The minimum top-up is **10 USD**. Your balance cannot exceed **5,000 USD** after the top-up.
:::

You enter the amount in USD. Processing fees, if any, are added on top and shown on the payment page. Your balance is credited with the amount you entered.

## Topping up the balance

### 1. Open the top-up dialog

Go to the **Billing** page and click **Top up** in the **My balance** card.

### 2. Choose a method and enter the amount

Select **Crypto** or **Card**, enter the amount in USD and click **Top up**. The payment page opens in a new tab.

### 3. Complete the payment

- **Crypto**: on the NOWPayments page, choose the coin and network, then send the exact amount shown to the address shown.
- **Card**: enter your card details on the Stripe checkout page and confirm the payment.

### 4. Wait for the payment to be credited

While the payment is in progress, the **My balance** card shows **Waiting for payment** with two buttons:

- **Complete** reopens the payment page, for example if you closed the tab.
- **Cancel** cancels the top-up.

Once the payment is confirmed, the amount is added to your balance and the top-up gets the `Completed` status. Card payments are usually credited right after checkout, crypto payments once the transaction is confirmed on its network.

:::info
You can have only one pending top-up at a time. To start a new one, complete or cancel the current one. An unpaid top-up expires automatically: a card top-up after 1 hour, a crypto top-up after 24 hours.
:::

:::warning
Don't pay for a top-up that has been canceled or has expired. If a payment arrives after that, contact the Fluence team to have it credited.
:::

## Top-up history

The **Top-up history** table on the **Billing** page lists your top-ups with their amount, deposit method and status:

| Status | Meaning |
|--------|---------|
| `Pending` | Waiting for your payment |
| `Under review` | The payment was received but needs a manual check by the Fluence team before it is credited |
| `Completed` | The amount has been added to your balance |
| `Expired` | The top-up was not paid in time |
| `Canceled` | You canceled the top-up |
| `Failed` | The payment did not go through |

## Promo codes

To activate a promo code, open the **Promo code** card on the **Billing** page (or the **Promo code** method in the top-up dialog), enter the code and click **Activate**.

Promo credits may have an expiration date. They are spent before your prepaid balance.
