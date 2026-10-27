---
description: Top up a Fluence Cloud balance by card, in crypto, or with a promo code, and read the top-up statuses.
---

# Payment and balance management

Your Fluence account has a prepaid balance in USD. Fluence charges rent for your CPU and GPU resources from this balance, so top it up before you launch anything. For how rent is charged, see the billing sections of [CPU Cloud](./cpu_cloud/overview.md#billing-model) and [GPU Cloud](./gpu_cloud/overview.md#billing-model).

You can spend the balance only on Fluence resources, and you cannot withdraw it. If you need a refund, write to support@fluence.ai.

## Top-up methods

| Method | Provider | How you pay |
|--------|----------|-------------|
| **Crypto** | [NOWPayments](https://nowpayments.io/) | Cryptocurrency. You choose the coin and the network on the NOWPayments payment page |
| **Card** | [Stripe](https://stripe.com/) | Credit or debit card on the Stripe checkout page |
| **Promo code** | Fluence | A code you received from Fluence |

AI agents and scripts can also top up without the console. They [pay with x402](./api/x402.md) in USDC on Base over HTTP.

:::info
In the Fluence Console, the minimum top-up is 10 USD, and your balance cannot exceed 5,000 USD after the top-up.
:::

You enter the amount in USD. The payment page adds processing fees, if there are any, on top. Fluence credits your balance with the amount you entered.

## Top up the balance

### 1. Open the top-up dialog

Open the **Billing** page, for example by clicking the balance in the page header. In the **My balance** card, click **Top up**. The **Top up balance** dialog opens with **Crypto** selected.

### 2. Choose a method and enter the amount

Select **Crypto** or **Card**, enter the amount in USD, and click **Top up**. The payment page opens in a new tab.

If the console cannot confirm that the payment session was created, check the status of your top-up before you start another payment.

### 3. Complete the payment

- For **Crypto**, choose the coin and the network on the NOWPayments page. Then send the exact amount shown to the address shown.
- For **Card**, enter your card details on the Stripe checkout page and confirm the payment.

### 4. Wait for the payment to be credited

While the payment is in progress, the **My balance** card shows **Waiting for payment** and two buttons:

- **Complete** reopens the payment page, for example if you closed the tab.
- **Cancel** cancels the top-up.

When the payment is confirmed, Fluence adds the amount to your balance, and the top-up gets the `Completed` status. A card payment is usually credited right after checkout. A crypto payment is credited when its transaction is confirmed on the network.

:::info
You can have only one pending top-up at a time. To start a new one, complete or cancel the current one. An unpaid card top-up expires after 1 hour, and an unpaid crypto top-up expires after 24 hours.
:::

:::warning
Don't pay for a top-up that was canceled or has expired. If a payment arrives after that, write to support@fluence.ai to have it credited.
:::

## Top-up history

The **Top-up history** table on the **Billing** page lists your top-ups with their amount, deposit method, and status:

| Status | Meaning |
|--------|---------|
| `Pending` | Waiting for your payment |
| `Under review` | The payment was received but needs a manual check by the Fluence team before it is credited |
| `Completed` | The amount has been added to your balance |
| `Expired` | The top-up was not paid in time |
| `Canceled` | You canceled the top-up |
| `Failed` | The payment did not go through |

## Promo codes

To activate a promo code, open the **Promo code** card on the **Billing** page, or the **Promo code** tab in the top-up dialog. Enter the code and click **Activate**.

Promo credits can have an expiration date. Fluence spends them before your prepaid balance.
