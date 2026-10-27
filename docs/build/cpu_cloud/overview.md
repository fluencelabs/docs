---
sidebar_position: 0
description: "CPU Cloud concepts: the resources a VM is made of, VM statuses, OS images, and how per-second billing and unpaid balances work."
---

# CPU Cloud concepts

Fluence CPU Cloud runs virtual machines in data centers of independent providers. In the Fluence Console it is the **Public cloud** section. To work with it from code, use the [CPU Cloud API](../api/cpu_cloud.md).

New accounts need access to Public cloud before they can create VMs. See [Account access](../overview.md#account-access).

## Resources

A VM is made of resources that are created, billed, and deleted separately:

| Resource | What it is |
|----------|------------|
| Location | A data center, called a cluster in the API. The console shows its city, tier, and certifications. All resources of a VM are in one location. |
| Plan | The vCPU and RAM of the VM, called a configuration in the API, for example `cpu-shared-2vcpu-2gb`. Plans have dedicated or shared CPU. |
| Disk | Network-attached block storage. The boot disk is created from an OS image or is an existing disk. A VM can have more disks. A disk exists on its own: you can resize it, detach it, and attach it to another VM in the same location. |
| Public IP address | An IPv4 address that makes the VM reachable from the internet. A VM can have one public IP address. |
| Network | Private networks (VPCs) with subnets, and security groups that filter the traffic of a network interface |

## VM statuses

| API status | Console label | Meaning |
|--------|------|---------|
| `draft` | Draft | Being configured. Not running and not billed. |
| `new`, `launching` | New, Launching | Provisioning has started |
| `launched` | Launched | The platform sees the VM as running |
| `updating`, `restarting`, `softRebooting` | Updating, Restarting, Soft rebooting | A change or a reboot is in progress |
| `suspending`, `suspended` | Suspending, Suspended | The platform is stopping the VM, or has stopped it |
| `terminating`, `terminated` | Terminating, Terminated | The VM is being removed, or has been removed |
| `failed` | Failed | The VM failed |
| `unknown` | Checking | The platform is checking the health of the VM. The status can return to Launched. |

## Billing model

- Every resource has an hourly price in USD and is billed per second while it exists. Fluence takes the charges from your balance as the resources run.
- Nothing is reserved or prepaid when you launch a VM. You pay only for the time your resources exist, so there is nothing to refund when you remove them.
- A draft is not billed. The disks and addresses created with a draft are billed from the launch.
- Disks and public IP addresses are billed until you delete them, even when they are not attached to a VM. Removing a VM keeps its disks and addresses unless you choose to delete them.
- To launch a VM, your balance must keep all your resources, including the new ones, running for at least 6 hours.

The **Billing** page shows your usage this month, the estimated cost for the month, and how long your balance will last.

### If your balance runs out

Your resources keep running for a while, and the unpaid amount grows:

1. Fluence emails you when your balance is expected to run out in 7 days, 3 days, and 1 day. Accounts created with a wallet get no emails.
2. When the unpaid amount exceeds 5 USD or stays unpaid for 3 days, Fluence removes your VMs. Your disks and public IP addresses stay and are still billed.
3. When the unpaid amount then exceeds 20 USD or stays unpaid for 10 more days, Fluence deletes all your resources, including disks and public IP addresses. The data on the disks is lost.

To avoid this, top up your balance. See [Payment and balance management](../balance.md).

## OS images

You can boot a VM from a Fluence image or from your own image. Each Fluence image lists the user name to sign in with over SSH.

Your own image must be publicly downloadable and prepared for cloud use. Look for images labeled `Generic Cloud` or `Cloud`. The image can boot with BIOS or EFI firmware. Supported formats: `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, `.img.gz`.
