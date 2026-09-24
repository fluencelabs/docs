---
sidebar_position: 0
---

# Concepts

Fluence CPU Cloud runs virtual machines in data centers operated by independent providers. In the Fluence Console it is the **Public cloud** section; programmatically it is the [CPU Cloud API](../api/cpu_cloud.md).

## Access

If your account can't create VMs yet, the **Public cloud** pages show a **Request access** button. After you click it, the Fluence team reviews the request and the page shows *The Fluence team is reviewing your application* until it is approved.

## Resources

A VM is assembled from resources that are created, billed and deleted separately:

| Resource | What it is |
|----------|------------|
| **Location** | A data center (a *cluster* in the API). The console shows its city, tier and certifications. All resources of a VM are in one location. |
| **Plan** | The VM's vCPU and RAM (a *configuration* in the API, for example `cpu-shared-2vcpu-2gb`). Plans come with dedicated or shared CPU. |
| **Disk** | Network-attached block storage. The boot disk is created from an OS image; you can add more disks. A disk exists on its own: it can be resized, detached and attached to another VM in the same location. |
| **Public IPv4** | An address that makes the VM reachable from the internet. A VM can have one public IPv4 address. |
| **Network** | Private networks (VPCs) with subnets, and security groups for the VM's network interfaces. |

## VM statuses

| Status | Meaning |
|--------|---------|
| `draft` | Being configured in the console; not provisioned and not billed |
| `new` | Launched, waiting to be provisioned |
| `launching` | Being provisioned |
| `launched` | Running |
| `updating`, `restarting`, `softRebooting` | A change or a reboot is in progress |
| `suspending`, `suspended` | The platform is stopping the VM, or has stopped it |
| `terminating`, `terminated` | Being removed, removed |
| `failed` | Provisioning failed |

## Billing model

- Every resource has an hourly price in USD and is billed per second while it exists. Charges are taken from your account balance as the resources run.
- Nothing is reserved or prepaid when you launch a VM, so there is nothing to refund when you remove it: you pay only for the time your resources existed.
- Disks and public IPv4 addresses are billed until you delete them, even when they are not attached to a VM. Removing a VM does not delete its disks and addresses unless you choose to.
- To launch a VM, your balance must be enough to keep all your resources, including the new ones, running for at least 6 hours.
- If your balance runs out, your resources keep running for a while. When the unpaid amount exceeds 5 USD or stays unpaid for 3 days, your VMs and public IPv4 addresses are removed; if the debt reaches 20 USD or is still unpaid 10 days later, your disks are deleted as well. Top up your balance to avoid this; see [Payment and balance management](../balance.md).

Current usage, the estimated cost for the month and how long your balance will last are shown on the **Billing** page.

## OS images

You can boot a VM from a pre-built Fluence image or from a custom image. Each pre-built image lists the user name to log in with over SSH.

Custom images must be publicly downloadable and prepared for cloud use; look for images labeled `Generic Cloud` or `Cloud`. They can boot with BIOS or EFI firmware.

Supported formats: `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, `.img.gz`.
