---
sidebar_position: 0
---

# Concepts

Fluence CPU Cloud is a decentralized compute marketplace where you can rent virtual machine instances from enterprise-grade providers worldwide, predominantly in Tier-3 and Tier-4 data centers.

## Marketplace

The marketplace aggregates compute supply from independent providers. The marketplace connects you with providers through several layers:

- **Offer** — a listing from a provider that includes one or more compute peers with identical specifications, located in the same data center, available at a set price.
- **Compute peer** — a physical server referenced in an offer. Each peer has its own hardware resources and is the actual machine that runs your workload.
- **Resource** — a distinct resource on a peer: vCPU, RAM, storage, or public IP.
- **Hardware specification** — metadata describing a resource (CPU architecture, memory generation, storage medium, etc.).

Compute resources are currently allocated in multiples of a **compute unit** — 2 vCPUs and 4 GB of RAM. Storage starts at a minimum of 25 GB.

## Instance lifecycle

Each instance goes through the following statuses during its lifetime:

| Status | Description |
|--------|-------------|
| `New` | Instance is created and is about to be provisioned |
| `Launching` | Instance is being provisioned, no public IP yet |
| `Active` | Instance is running and accessible |
| `SmallBalance` | Not enough funds for the next billing period |
| `InsufficientFunds` | Instance balance is 0 and the grace period passed |
| `Terminated` | Instance was terminated by the provider — workload is no longer running. See [provider termination handling](../manage_vm/provider_vm_termination.md). |
| `Stopped` | Instance was ended by the user |

## Billing model

CPU Cloud uses daily billing in USDC. All prices are quoted per **epoch** — a 24-hour billing period. Charges are processed daily at **5:55 PM UTC**.

:::warning
Billing is for full epochs regardless of when you start. If you deploy an instance at 5:45 PM UTC, you pay for a full day for those 10 minutes, and the next charge happens at 5:55 PM UTC.
:::

### Instance balance

Every instance has its own **reserved balance** that covers ongoing rent. When you deploy an instance, the system deducts an amount equivalent to **2 days' rent** from your account balance and transfers it to the instance's reserved balance. One day is charged immediately for the current epoch, while the other day stays as a reserve for the next one.

### Automatic top-ups

After each daily charge, the reserved balance drops. The system then automatically tops it back up from your account balance to maintain one epoch of reserve — enough to cover the next billing period.

### Insufficient funds

If your account balance cannot cover a top-up, the system keeps retrying. Your instance continues running through any epoch that has already been paid for. Termination happens only when the next charge fails because the reserved balance has been fully spent — at that point the instance is deleted.

### Refunds on termination

When an instance is stopped or terminated — whether by you or the system — any unused funds remaining on the instance's reserved balance are returned to your account balance.

:::warning
Instances have a maximum rental period. The exact limit is shown in the Fluence Console.
:::

## OS images

You can use a pre-defined OS image from Fluence or provide a URL to a custom image. Custom images must be publicly downloadable and configured for remote instances.

Supported formats: `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, `.img.gz`.
