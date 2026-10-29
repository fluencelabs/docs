---
description: Connect to, reboot, resize, and remove CPU virtual machines, and manage disks, public IP addresses, VPCs, and security groups in the Fluence Console.
---

# Manage VMs

You manage virtual machines and their resources in the **Public cloud** section of the Fluence Console. To do the same from code, see the [CPU Cloud API](../api/cpu_cloud.md).

## VM list

The **Compute** page lists your VMs and drafts. Filter the list by name and by status. See [VM statuses](./overview.md#vm-statuses).

## VM page

Open a VM to see its page. It has four tabs:

- **Overview** shows the resources of the VM and a **Connect** card with the **SSH command** to copy and the SSH **Public keys** of the VM. The SSH command uses the user name of the OS image and the public IP address.
- **Disks** lists the disks of the VM. The menu of a disk has **Config instructions**, **Increase size**, and **Detach disk**.
- **Networking** lists the network interfaces of the VM.
- **Console** opens a serial console of the VM in your browser, available after the VM boots. Use it when the VM has no public IP address or no SSH key. The tab shows the login and a root password that you can copy and reveal. To set a new password, click **Generate new** and confirm.

## Change a VM

The **Manage VM** menu has:

- **Reboot** restarts the VM.
- **Edit name** renames the VM.
- **Remove VM** removes the VM. See [Remove a VM](#remove-a-vm).

The **Attach resources** menu has:

- **Attach disk** attaches an existing disk or a new one.
- **Attach public IP** attaches a public IP address. A VM can have one.

To make a disk larger, use **Increase size** on the **Disks** tab. The VM may need a reboot to see the new size.

## Remove a VM

1. In the **Manage VM** menu, click **Remove VM**.
2. Optional: under **Remove assigned public IP addresses** and **Remove attached disks**, select the resources to delete with the VM, or click **Remove all**. Nothing is selected by default.
3. Type the name of the VM and click **Yes**.

The disks and addresses you don't select stay and are billed until you delete them. A boot disk cannot be removed while it is attached to its VM. To delete it, select it in this dialog.

## Disks

The **Storage** page lists all your disks, including the ones not attached to any VM. By default the list hides removed disks. To see them, filter by status.

- To create a disk, click **Create new disk**. Choose the name, the data center, and the disk type: boot disk or additional disk. For a boot disk, also choose the operating system. Then choose the storage type and the size, and click **Create disk**.
- The menu of a disk has **Config instructions**, **Increase size**, **Edit name**, and **Remove**.
- You can only remove a detached disk. Detach it from its VM first.

## Public IP addresses

The **Network** > **Public IP** tab lists your public IP addresses with their location, IP address, VM, and status. Filter the list by name, status, and location.

- To reserve an address, click **Create IP**.
- The menu of an address has **Edit name** and **Remove**. Detach the address from its VM before you remove it.

An address that is not attached to a VM is still billed.

## VPCs and subnets

The **Network** > **VPC** tab lists your private networks. To create one, click **Create VPC**.

Open a VPC to manage its subnets. To create a subnet, click **Create subnet** and enter a name and an IPv4 CIDR range. The menu of a subnet has:

- **Edit name** renames the subnet.
- **Set as default** makes it the default subnet of the VPC for new VMs.
- **Enable egress** allows outbound internet traffic from the subnet. **Disable egress** blocks it.
- **Remove** deletes the subnet.

## Security groups

A security group filters the traffic of the network interfaces it is attached to. The **Network** > **Security group** tab lists your groups and their inbound and outbound rules.

To create a group, click **Create security group**. Choose the VPC, enter a name, and set a policy for **INBOUND TRAFFIC** and for **OUTBOUND TRAFFIC**:

- **Allow all traffic** lets all traffic through in this direction.
- **Allow selected traffic** lets through only the traffic that matches a rule. Add rules with **Add inbound rule** or **Add outbound rule**.
- **Block all traffic** blocks new connections in this direction. Blocking outbound traffic also blocks internet access.

A new group starts with **Block all traffic** in both directions. To connect over SSH, allow inbound TCP port `22`.

Each rule has:

- A **Protocol**: All, TCP, UDP, or ICMP.
- A **Port range** for TCP and UDP.
- A **Source** for inbound rules, or a **Destination** for outbound rules. It is an IP range in CIDR notation, such as `0.0.0.0/0`, or another security group.

A group can have up to 50 rules. To change a group, use **Edit** in its menu.

A VM can reach the internet only if both the security group and the subnet allow outbound traffic.

## Usage and charges

The **Billing** page shows your balance and a usage statement for Public cloud resources. Choose a month to see:

- **Usage runway**: how long your balance will last.
- **Month to date usage**: what you have spent this month.
- The estimated cost for the month.
- The usage and cost of each VM, disk, and public IP address.

To download the statement for the month, click **Export usage**.

If your balance runs out, Fluence removes your resources after a while. See [If your balance runs out](./overview.md#if-your-balance-runs-out).
