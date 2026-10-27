---
description: Rent a GPU container, GPU VM, or bare metal server in the GPU Marketplace of the Fluence Console.
---

# Rent a GPU instance

This guide shows how to rent a GPU instance in the **GPU Marketplace** of the Fluence Console. For workload types, statuses, and billing, see [GPU Cloud concepts](./overview.md). To rent from code, see the [GPU Cloud API](../api/gpu_cloud.md).

Before you start, make sure your balance covers at least 2 hours of the instance's price. The console doesn't let you launch with less. See the [billing model](./overview.md#billing-model).

## Choose the GPU and the configuration

These steps are the same for all workload types.

1. Open **GPU Marketplace** and choose a tab: **Containers**, **VM**, or **Baremetal**.
2. In **Select GPU Model**, choose a row. The table shows each GPU model with its **vRAM**, **Interface** (PCIe or SXM), the lowest **Price** per hour, and a **Count** of GPUs. If a model comes with several vRAM sizes or interfaces, pick one in the row. Pick the number of GPUs in **Count**.
3. In the configuration table, choose an offer. Each row shows the **GPU**, its **Locations**, **vCPU**, **RAM**, **Storage**, and the **Price** per hour. If the offers are in several locations, filter them with **All locations**. To see only offers with NVLink between GPUs, turn on **NVLink supported**. The switch appears only when such offers exist.
4. Under **Configure deployment**, in **Basic information**, keep the generated name or enter your own.

The next steps depend on the workload type.

## Configure a container

1. Under **Container image**, choose a predefined image in **Select image**, or click **Custom image** to use your own:
   - In **Image**, enter the full image reference, for example `ghcr.io/owner/image:tag`.
   - For an image in a private registry, turn on **Private mode**. Choose the registry, **Docker Hub - docker.io** or **GitHub container registry - ghcr.io**, and enter your **Username** and **Password** or access token.
   - Click **Set image**.
2. Optional: in **Container Start Command**, enter a command that replaces the entry point of the image.
3. In **Port**, enter the ports to open, separated by commas:
   - A port number, for example `443`. It opens the port for all protocols.
   - A port with a protocol, for example `7090/tcp` or `53/udp`.
   - A range, for example `5000-5005`.

   For a predefined image, the console adds port `22` for SSH. For a custom image, add every port yourself. Port `10250` is reserved. To serve HTTP on port 80, select **Enable http on port 80**.
4. Optional: to add environment variables, click **Add variable** and enter a **Name** and a **Value** for each.
5. Optional: in **SSH key (optional)**, choose one SSH key, or click **Add key** to add one. You cannot choose a key for a custom image in private mode.

:::warning
With a predefined image, the platform uses the environment variable `SSH_PUBKEY` to pass your SSH key into the container. If you also define `SSH_PUBKEY`, the deployment fails.
:::

## Configure a VM or a bare metal server

1. In **OS image**, choose the image. The images come with GPU drivers.
2. In **SSH key**, choose the key to sign in with, or click **Add key** to add one. A VM and a bare metal server need an SSH key.

## Review and launch

For a container, the review panel shows the name, the location, and the image. For a VM or a bare metal server, it shows the name, the data center, and the type. It also shows the hardware: GPU, vRAM, interface, vCPU, RAM, and disk or storage. Under **Payment** it shows the **Hourly** price, the **Upfront** hours, and the **Total**: the hourly price times 2 hours.

Click **Launch**. The console opens the **GPU instances** page, where you can follow the status. If your balance is lower than the total, the button reads **Top up balance** and opens the **Billing** page instead.

If the console cannot confirm that the instance was created, check the **GPU instances** page before you launch again. Otherwise you can end up with two instances.
