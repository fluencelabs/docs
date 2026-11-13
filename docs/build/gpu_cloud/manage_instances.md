---
description: View, connect to, rename, update, and terminate GPU containers, VMs, and bare metal servers in the GPU cloud section of the Fluence Console.
---

# Manage GPU instances

You manage rented GPU instances in the Fluence Console under **GPU cloud** > **Instances**. To do the same from code, see the [GPU Cloud API](../api/gpu_cloud.md).

## Instance list

The list shows each instance with its **Name** and location, **GPU**, **Workload**, **Rental**, **Price** per hour, **Created at**, and **Status**.

By default, the list shows active instances only. Ended and failed instances are hidden. To see them, set the status filter to **All**, or click **Show all**. You can also filter by name, status, workload, and rental type.

The statuses are **Pending**, **Provisioning**, **Running**, **Updating**, **Terminating**, **Ended**, and **Failed**. See [Instance statuses](./overview.md#instance-statuses). Hover over a status to see more detail, for example **Reserving your balance** or **Looking for capacity**. A spot instance that the provider took back shows **Reclaimed**.

A running instance can show a warning that it is still billed:

- **Powered off — still billed**: the VM was powered off from inside. It is still billed, and its disk is kept. Terminate it to stop the charges.
- **Container not running — still billed**: the container stopped, or it did not start after an update. Update the image to start it again, or terminate the instance to stop the charges.

The list and the instance page refresh by themselves: every 5 seconds while an instance is changing status, and every 30 seconds otherwise.

## Instance page

Click an instance to open its page. The **Overview** tab has three parts:

- Configuration: **Instance ID**, **Offer ID**, GPU, VRAM per GPU, vCPU, RAM, **Local disk**, location, workload, image or OS, command, SSH key, and environment variables. Secret values show as **Hidden**.
- Connection: the **Host**, and for each port the external address in the form `host:port`, which you can copy. For a VM, a bare metal server, or a container with SSH, the page shows a ready SSH command. Connection details appear once the instance is running.
- Billing: **Created**, **Started**, and **Ended** times, the **Price** per hour, how often the instance is **Billed**, the **Minimum charge**, and **Charged so far**. After the instance ends, the last value reads **Total charged**.

While an instance provisions, the page shows how long it usually takes to be ready.

When an instance ends or fails, the page explains why and what you were charged. To rent the same configuration again, click **Launch again**. The console copies the settings into a new instance, except secret values, which you enter again.

### Logs and events

The **Logs** and **Events** tabs appear while the instance is running, if its provider offers them. **Logs** shows the output of the container. **Events** shows provider events, such as scheduling, image pulls, and container starts. Click **Refresh** to load new lines.

## Change an instance

Open **Manage instance** on the instance page. The menu shows only the actions that the instance supports.

- **Rename**: enter a new **Name** and click **Confirm**.
- **Update image**: for a running container, enter a new **Container image** and click **Update**. The container restarts with the new image. It may be unavailable during the restart.

Nothing else changes after launch. To use other settings, terminate the instance and launch a new one.

## Terminate an instance

1. Open **Manage instance** and click **Terminate**.
2. Type the instance name to confirm, and click **Terminate**.

The instance stops, and its disk is erased. Billing stops when termination completes.
