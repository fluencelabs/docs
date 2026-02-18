---
sidebar_position: 0
---

# CPU Cloud overview

The Fluence CPU Cloud is a decentralized compute marketplace where you can rent virtual machines from enterprise-grade providers worldwide, predominantly in Tier-3 and Tier-4 data centers.

## Marketplace model

The marketplace connects you to compute resources through several layers:

- **Offer** — an on-chain listing from a provider that includes one or more compute peers with identical specifications, located in the same data center, available at a set price.
- **Compute peer** — a physical server referenced in an offer. Each peer has its own hardware resources and is the actual machine that runs your workload.
- **Resource** — a distinct resource on a peer: vCPU, RAM, storage, or public IP.
- **Hardware specification** — metadata describing a resource (CPU architecture, memory generation, storage medium, etc.).

## VM lifecycle

VMs go through the following statuses:

| Status | Description |
|--------|-------------|
| `Launching` | VM is being provisioned, no public IP yet |
| `Active` | VM is running and accessible |
| `SmallBalance` | Not enough funds for the next billing period |
| `InsufficientFunds` | VM balance is 0 |
| `Terminated` | VM was terminated by the provider — workload is no longer running. See [provider termination handling](../manage_vm/provider_vm_termination.md). |
| `Stopped` | VM was ended by the user |

## Billing model

CPU Cloud uses daily billing in USDC:

- **Epoch** — a 24-hour billing period. All prices are quoted per epoch.
- **Billing time** — charges are processed daily at **5:55 PM UTC**.
- **Deposit** — when you deploy a VM, a prepayment equivalent to one day's rent is deducted from your account balance to cover the next day.
- **Full-day charges** — billing is currently for full epochs regardless of when you start. If you rent a VM at 5:45 PM UTC, you pay for a full day for those 10 minutes, and the next charge happens at 5:55 PM UTC.
- **Insufficient funds** — if your balance can't cover the next epoch, the reserved prepayment is used. If that's also exhausted, the VM is terminated and deleted.

:::warning
VMs have a maximum rental period. The exact limit is shown in the Fluence Console.
:::

## OS images

You can use a pre-defined OS image from Fluence or provide a URL to a custom image. Custom images must be publicly downloadable and configured for remote instances. Recommended image tags: `Generic Cloud` or `Cloud`.

Supported formats: `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, `.img.gz`.
