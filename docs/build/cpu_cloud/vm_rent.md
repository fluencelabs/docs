# Renting an instance

This guide walks you through launching a virtual machine in the Fluence Console, on the **Public cloud → Compute** page. For resources, statuses and billing, see the [CPU Cloud concepts](./overview.md). To do the same through the API, see [CPU Cloud API → Deploy a VM](../api/cpu_cloud.md#deploy-a-vm).

:::info
If the page shows **Request access**, your account can't create VMs yet. Click it, and the Fluence team will review your request.
:::

Nothing is prepaid when you launch a VM, but your balance must cover all your resources for at least 6 hours. See the [billing model](./overview.md#billing-model).

## Steps to launch a VM

### 1. Start a new VM

On the **Compute** page, click **Create Virtual Machine**. The console creates a draft and opens the **Create new VM** page. The draft is saved as you edit and is not billed. Drafts are listed on the **Compute** page with the `Draft` status, where you can open or discard them.

### 2. Basic settings

- **VM name**: lowercase letters, digits and hyphens, up to 25 characters.
- **Available locations**: the data center to run the VM in. Hover over the tier badge to see the data center's certifications.

### 3. Choose a plan

Under **Available plans**, pick the **Dedicated CPU** or **Shared CPU** tab and select a plan. Each plan shows its vCPU and RAM, and its monthly and hourly price.

### 4. Set up disks

Under **Disk setup**, configure the **Boot disk**: the operating system, the disk size in GB and the storage type. For a custom image, provide a publicly downloadable URL and select the boot mode (BIOS or EFI); see [supported formats](./overview.md#os-images).

You can also add an **Additional disk**. Disks are billed separately from VMs, and you keep paying for a disk until you delete it, even if it isn't attached to a VM.

### 5. Configure the network

Under **Network settings**, each network interface has a **Connection**:

- **Public IPv4 address**: the VM gets an address reachable from the internet. A VM can have one public IPv4 address. You need it to connect over SSH from outside Fluence.
- **Private subnet**: the interface joins a subnet of one of your private networks.

Choose a **Security group** for the interface. Use **Add network interface** to add more interfaces; one of them carries the default route.

### 6. Add SSH keys

Under **Access**, select one or more **SSH-keys**, or click **Add key** to add a new one. Supported formats: RSA, DSA, ECDSA and ED25519.

### 7. Add cloud-init (optional)

Turn on **Enable custom cloud-init config** to provide cloud-init user data that runs on the VM's first boot.

### 8. Review and launch

The **Review** panel shows the configuration and its price, and marks sections that need attention. Click **Launch** and confirm. The VM appears on the **Compute** page; provisioning usually takes a few minutes, until the status is `Launched`.
