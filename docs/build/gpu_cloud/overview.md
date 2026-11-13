---
sidebar_position: 0
description: "GPU Cloud concepts: offers and providers, containers, GPU VMs and bare metal, on-demand and spot instances, instance statuses, and per-minute GPU billing."
---

# GPU Cloud concepts

Fluence GPU Cloud rents GPUs from several providers in data centers around the world. You can run three types of GPU workloads: containers, VMs, and bare metal servers, on demand or as spot instances. In the Fluence Console you rent them under **GPU cloud** > **Marketplace** and manage them under **GPU cloud** > **Instances**. To do the same from code, use the [GPU Cloud API](../api/gpu_cloud.md).

## Offers

An offer is one machine configuration that you can rent: a provider, a region, a GPU model and count, vCPU, memory, local storage, and a price. Each offer is for one workload type and one rental type. Offers also show:

- Availability. An offer that recently ran out of capacity can stay on sale. If a launch fails because the provider has no capacity, nothing is charged.
- An estimate of how long provisioning takes.
- What the instance supports, for example logs, events, container updates, and private registries.

Most offers are one machine type of a provider. Some Akash offers fix only the hardware and the highest price: Akash picks the host from provider bids when you launch the instance.

Prices and availability change as providers change them.

## Workload types

| | Container | VM | Bare metal |
|---|---|---|---|
| What it is | A container with access to the GPUs of its host | A virtual machine with GPU passthrough | A dedicated physical server |
| Image | A container image | An OS image | An OS image |
| Connection | A host with forwarded ports | SSH | SSH |
| What you can change after launch | Name. If the offer supports updates: image, startup command, environment variables, and registry credentials. The console changes only the image. | Name | Name |

A container runs an image that you choose, with an optional startup command, environment variables, and ports. The platform maps each of your ports to an external port. For example, your port `22` can become port `30694` on the host.

A VM and a bare metal server both run an OS image with GPU drivers, and you connect to them over SSH. A VM runs on a hypervisor. A bare metal server is a physical machine with no virtualization layer.

## On-demand and spot instances

An on-demand instance runs until you terminate it, your balance runs out, or the provider ends it. Fluence can also end an instance that stays not ready for too long. The instance page in the console and `statusDetail` in the API give the reason.

A spot instance usually costs less. It runs on capacity that the provider can take back at any time, without warning. A spot instance has one life:

- When the provider takes the machine back, the instance ends.
- Any stop ends a spot instance, including a shutdown from inside the machine.
- When a spot instance ends, its disk and data are deleted.

Use spot instances for work that can stop and start again, and keep your data outside the instance.

## Instance statuses

| Status | Meaning |
|---|---|
| `pending` | Fluence is reserving funds on your balance |
| `provisioning` | The provider is creating the instance |
| `running` | The instance is running, and its connection details are available |
| `updating` | The provider is applying a container change |
| `terminating` | The provider is closing the instance |
| `ended` | The instance ended, for example because you terminated it, the provider took back a spot machine, or your balance ran out. The API gives the reason in `statusDetail`, and the console on the instance page. |
| `failed` | The instance was not created, or it did not survive creation |

`ended` and `failed` are final. A final instance stays in your list, so you can see its history and its total charge.

## Billing model

GPU instances are billed in USD from your account balance, for the time they run.

- Billing starts when the instance becomes `running`. An instance that fails before it runs costs nothing.
- Each offer has a billing step and a minimum period. Most offers bill per minute with a minimum of 20 minutes. Some offers bill per hour with a minimum of 1 hour. The offer and the instance show their terms.
- An instance that starts running costs at least the minimum charge: the price for the minimum period. After the minimum period, you pay per billing step.
- When you terminate an instance, billing continues while it is `terminating`, and stops when the provider has closed it. The total charge is final a few minutes after the instance ends.

To launch an instance, your balance must cover its minimum charge on top of the amount that your running resources already hold.

When your balance runs out, Fluence ends your GPU instances within minutes. Their disks and data are deleted. Keep enough balance to keep instances running. See [Payment and balance management](../balance.md).
