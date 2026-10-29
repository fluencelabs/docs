# Instance info and management

After launching a VM, you manage it in the **Public cloud** section of the Fluence Console. To do the same through the API, see the [CPU Cloud API](../api/cpu_cloud.md).

## VM list

The **Compute** page lists your VMs and drafts with their name, plan, resources, creation time and status. You can filter the list by name and status, and sort it by name or creation time.

## VM details

Open a VM to see its details:

- **Overview**: the VM's resources, disks and network, and a **Connect** card with the **SSH command** (the user name of its OS image and its public IPv4 address) and the SSH **Public keys** installed on the VM.
- **Disks** and **Networking**: the VM's disks and network interfaces.
- **Console**: a terminal to the VM in your browser. It becomes available once the VM has booted.

## Managing a VM

The **Manage VM** menu on the VM page offers:

- **Edit name**: rename the VM.
- **Reboot**: restart the VM.
- **Remove VM**: remove the VM. In the confirmation dialog, select the attached disks and public IPv4 addresses to delete along with it, then type the VM name to confirm. Disks and addresses you don't select are kept and billed until you delete them.

The **Attach resources** menu adds a disk (an existing one or a new one) or a public IPv4 address to the VM. A disk's size can be increased; the VM may need a reboot to see the new size.

## Disks and network

- **Public cloud → Storage** lists all your disks, including the ones not attached to any VM. You can create disks, rename them, increase their size and remove them. Detach a disk from its VM before removing it.
- **Public cloud → Network** manages public IPv4 addresses, private networks (VPCs) and their subnets, and security groups.

## Usage and charges

The **Billing** page shows your balance and, under **Usage overview**, the month-to-date usage, the estimated cost for the month, how long your balance will last and the spend per resource type. Use **Export usage** to download the usage for a period.

If your balance runs out, your resources are removed after a while; see the [billing model](./overview.md#billing-model).
