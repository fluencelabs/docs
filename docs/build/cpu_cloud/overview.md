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
| `Terminated` | Instance was terminated by the provider — workload is no longer running. See [provider termination handling](./manage_vm.md#handling-provider-terminated-instances). |
| `Stopped` | Instance was ended by the user |

## Billing model

CPU Cloud uses daily billing in USDC. Each instance has its own 24-hour billing period that starts at activation time and repeats every 24 hours.

### Instance balance

Every instance has its own reserved balance that covers ongoing rent. When you deploy an instance, the system deducts 2 days' worth of rent from your account — one day is charged immediately, and the other stays as a reserve for the next billing period.

### Automatic top-ups

After each daily charge, the system automatically tops up the reserved balance from your account to maintain one day of reserve.

### Insufficient funds

If your account balance cannot cover a top-up, the system keeps retrying. Your instance continues running through any period that has already been paid for. Termination happens only when the next charge fails because the reserved balance has been fully spent.

### Refunds on termination

When you stop or terminate an instance, any unused funds on its reserved balance are returned to your account.

## OS images

You can use a pre-defined OS image from Fluence or provide a URL to a custom image. Custom images must be publicly downloadable and configured for remote instances.

Supported formats: `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, `.img.gz`.
