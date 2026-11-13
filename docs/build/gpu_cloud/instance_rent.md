---
description: Rent a GPU container, GPU VM, or bare metal server, on demand or as a spot instance, in the GPU cloud section of the Fluence Console.
---

# Rent a GPU instance

This guide shows how to rent a GPU instance in the **GPU cloud** section of the Fluence Console. For workload types, spot instances, statuses, and billing, see [GPU Cloud concepts](./overview.md). To rent from code, see the [GPU Cloud API](../api/gpu_cloud.md).

GPU Cloud is not open to every account. If the sidebar has no **GPU cloud** section, or the console shows **GPU Cloud is temporarily unavailable**, your account has no access to GPU Cloud yet. Contact support at support@fluence.ai.

Before you start, top up your balance. To launch, your balance must cover the minimum charge of the instance on top of what your running resources already hold. See the [billing model](./overview.md#billing-model).

## Choose a GPU

1. In the sidebar, open **GPU cloud** > **Marketplace**. The table lists GPU models with their lowest **Price** per hour, the **GPUs per instance** you can get, the **Locations**, and the number of **Offers**.
2. To narrow the list, use the filters:
   - The workload tabs: **All**, **Container**, **VM**, or **Bare metal**.
   - GPU class, minimum VRAM, GPUs per instance, and country.
   - **More filters**: **Max price**, **Min vCPU**, **Min RAM**, **Min local disk**, and **GPU interconnect**.
   - To see spot prices too, turn on **Include spot**.
3. Click a GPU model. The row expands.
4. Choose the number of GPUs under **GPUs per instance**. If the model has spot offers, choose **On-demand** or **Spot** under **Rental**.
5. Choose an offer:
   - To take the cheapest offer, click **Launch cheapest**.
   - To choose a location, find the offer in the table and click **Launch** on its row. The table shows each offer's **Location**, **Workload**, **vCPU**, **RAM**, **Disk**, **Ready in**, and **Price**.

An offer marked **Recently out of capacity** is still on sale. If the launch fails because the provider has no capacity, nothing is charged.

The console opens the **Create GPU instance** page.

## Configure the instance

1. In **Instance name**, keep the generated name or enter your own: 1 to 25 lowercase letters, numbers, or hyphens.
2. In the **GPU** section, check the GPU, the number of GPUs, and the rental type. To pick another GPU, click **Change GPU**. The location field shows **Cheapest available** by default. To rent in a specific location, choose it from the list.
3. If the GPU comes in several workload types, choose **Container**, **VM**, or **Bare metal**.

The next steps depend on the workload type.

### Configure a container

1. In **Image**, choose a predefined image, or choose **Custom image** and enter the **Image reference**, for example `registry/image:tag`.
2. Optional: in **Startup command (optional)**, enter a command that replaces the entry point of the image.
3. Optional: in **SSH key**, choose a key, or click **Add SSH key**. The console passes the key to the container in the `SSH_PUBKEY` variable. Only images that read `SSH_PUBKEY` use it. Some predefined images need a key.
4. In **Exposed ports**, set the ports to open and their protocol: TCP, UDP, or HTTP. Click **Add port** to add one. You cannot change the ports after launch.
5. Optional: in **Environment variables**, click **Add variable** and enter a **Name** and a **Value**. A name has uppercase letters, digits, and underscores, and starts with a letter. To hide a value after launch, select **Secret**. You cannot read a secret value back.
6. Optional: to pull the image from a private registry, select **Pull from a private registry** and enter the **Registry host**, **Registry username**, and **Registry password**. This option appears only where the offer supports it.

:::warning
The **SSH key** field sets the `SSH_PUBKEY` variable. Do not add `SSH_PUBKEY` to the environment variables yourself.
:::

### Configure a VM or a bare metal server

1. In **Operating system**, choose the OS image. The images come with GPU drivers.
2. In **SSH key**, choose the key to sign in with, or click **Add SSH key**. A VM and a bare metal server need an SSH key.

## Review and launch

The **Review** panel shows the name, the GPU, the location, the expected time to be ready, the rental type, the workload, the image or OS, and the SSH key. Then it shows the price:

- **Price per hour**: the hourly price of the instance.
- **Billing**: how often you are **Billed**, for example per minute, the **Minimum** time you pay for, and the amount **Reserved at launch**, which is the minimum charge.
- **If your balance runs out**: the instance is stopped within minutes, and its disk is erased.

If no offer matches your configuration, the panel says why and can suggest alternatives. Click **Use this** to switch to an alternative.

For a spot instance, select the checkbox that confirms you understand that the provider can reclaim the instance at any time, and that any stop ends it and erases its disk.

Click **Launch**. The console opens the instance page, where you can follow the status. See [Manage GPU instances](./manage_instances.md).

If your balance is too low, the console refuses the launch and shows a **Top up** link. Add funds, then launch again.

If the console cannot confirm the launch, open **GPU cloud** > **Instances** and check your instances before you launch again. Otherwise you can end up with two instances.
