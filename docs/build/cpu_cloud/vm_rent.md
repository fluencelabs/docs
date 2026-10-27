---
description: Create and launch a CPU virtual machine in the Public cloud section of the Fluence Console, from plan and disks to network, SSH keys, and cloud-init.
---

# Create a VM

This guide shows how to create and launch a virtual machine on the **Public cloud** > **Compute** page of the Fluence Console. For resources, statuses, and billing, see [CPU Cloud concepts](./overview.md). To create a VM from code, see [CPU Cloud API: Create a VM](../api/cpu_cloud.md#create-a-vm).

Before you start:

- Your account needs access to Public cloud. If the **Compute** page shows **Request access** instead of **Create new VM**, see [Account access](../overview.md#account-access).
- Your balance must keep all your resources, including the new VM, running for at least 6 hours. See the [billing model](./overview.md#billing-model).

## 1. Create a draft

On the **Compute** page, click **Create new VM**. The console creates a draft, opens the **Create new VM** page, and saves the draft as you edit it. A draft is not billed.

Drafts appear on the **Compute** page with the **Draft** status. From the list you can resume the setup of a draft or discard it.

## 2. Set the name and the location

Under **Basic settings**:

- **VM name**: up to 25 characters, lowercase letters, digits, and hyphens. The name cannot start or end with a hyphen.
- **Available locations**: the data center for the VM. Each location shows its tier. Hover over the tier to see the certifications of the data center.

If you change the location after you set up disks or network interfaces, the console asks you to confirm, because the disks are detached and the interfaces lose their settings.

## 3. Choose a plan

Under **Available plans**, open the **Dedicated CPU** or **Shared CPU** tab and select a plan. Each plan shows its vCPU, RAM, and price per month and per hour.

## 4. Set up the disks

Under **Disk setup**:

1. Click **Edit boot disk**. In the **Boot disk** dialog:
   - On the **New disk** tab, enter a **Name**, choose the **Operating system**, the storage type, and the **Size**. To boot from your own image, choose **Custom Image**, enter its URL, and choose the **Boot mode**: BIOS or EFI. See [OS images](./overview.md#os-images).
   - On the **Existing disk** tab, choose a disk you already have in this location.
2. Optional: to add a data disk, click **Attach disk**. In the **Attach disk to VM** dialog, create a new disk or choose an existing one.

A disk created in the draft is free until you launch the VM. An existing disk stays billed on its own.

## 5. Configure the network

Under **Network settings**, each network interface has a **Connection**:

- **Public IPv4 address**: the VM gets a public IP address reachable from the internet. You need it to connect over SSH from outside Fluence. A VM can have one public IP address.
- **Private subnet**: the interface joins a subnet of one of your VPCs. Choose the **Subnet**, or click **Create subnet**. Subnets marked **no outbound** have no internet access. Optionally set a static private IPv4 address.

For each interface, choose a **Security group**: **None**, an existing group, or **Create security group**. See [Security groups](./manage_vm.md#security-groups). If the group blocks outbound traffic, the console warns you that the VM cannot reach the internet through this interface.

To add another interface, click **Add network interface**. Use **Make default route** in the menu of an interface to choose the one that carries the default route.

If the VM has no public IP address, you can still reach it from the **Console** tab of the VM page or from your private network.

## 6. Add SSH keys

Under **Access**, choose one or more keys in **SSH keys**, or click **Add key** to add a new one. Supported formats: RSA, DSA, ECDSA, and ED25519.

SSH keys are optional. Without a key, you sign in through the **Console** tab of the VM page with a root password that you generate there.

## 7. Add cloud-init (optional)

Under **Custom cloud-init config**, turn on **Enable custom cloud-init config** and enter cloud-init user data. The user data runs on the first boot of the VM. After you save the user data, the console doesn't show its content again. You can replace or clear the user data.

## 8. Review and launch

The **Review** panel shows the configuration and its price, and lists the problems to fix in each section.

Click **Launch**. Launching starts billing, and the settings of the draft become read-only. The console opens the page of the new VM. Provisioning usually takes a few minutes. Wait until the status is **Launched**.

If the console cannot confirm that the launch started, click **Check status** before you try again.
