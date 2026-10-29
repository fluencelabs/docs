---
description: View, connect to, update, and terminate GPU containers, VMs, and bare metal servers on the GPU instances page of the Fluence Console.
---

# Manage GPU instances

You manage rented GPU instances on the **GPU instances** page of the Fluence Console. It has a tab for each type: **Container**, **VM**, and **Bare Metal**. To do the same from code, see the [GPU Cloud API](../api/gpu_cloud.md).

## Instance list

The list shows each instance with its **Location**, **Configuration** (GPU, vRAM, interface, vCPU, RAM, and disk), **Domain**, and **Status**. To find an instance, filter the list by name, or by status: Running, Initialized, Provisioning, Ended, or Failed.

The buttons on a row depend on the instance:

- The arrow opens the instance page. Every instance has it.
- The trash button terminates the instance. Only running instances have it.
- The pencil renames the instance. Only running containers have it.

## Instance page

The instance page refreshes every 30 seconds. It shows:

- **Configuration**: GPU, vRAM, interface, vCPU, RAM, and disk.
- **Network**:
  - For a container: the **Domain**, the **Forwarded ports**, and the **URI** if port 80 serves HTTP. The platform maps each of your ports to an external port on the domain. For example, `22:30694` means that you connect to port `30694` of the domain to reach port `22` of the container.
  - For a VM or a bare metal server: the **Domain**, the **SSH key**, and an **SSH command** that you can copy.
- The image of the instance. The heading reads **Container image** for every type.
- **Renting information**: **Deployment Date**, **Next billing time**, **Hourly usage**, and **Total spendings**. See the [billing model](./overview.md#billing-model).

## Containers

### Logs and events

The **Logs** tab shows the output of the container. The **Events** tab shows cluster events, such as scheduling, image pulls, and container starts. Read the events when a container doesn't start.

### Update a running container

To change a running container, click **Update deployment** on its page. You can change:

- The container image, predefined or custom.
- The container start command.
- The environment variables.
- The SSH key.

The ports cannot be changed after launch. The fields work as in [Configure a container](./instance_rent.md#configure-a-container). Click **Redeploy** and confirm. The container restarts with the new settings.

### Rename a container

Click the pencil next to the name of a running container.

## VMs and bare metal servers

You cannot change a running VM or bare metal server in the console. To use other settings, terminate the instance and rent a new one. The API can rename these instances. See the [GPU Cloud API](../api/gpu_cloud.md).

## Terminate an instance

Click the trash button on the instance page or in the list, and confirm with **Terminate**. The status changes to Ended, and billing stops. The unused part of the current hour is not returned.
