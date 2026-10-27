---
sidebar_position: 0
description: "GPU Cloud concepts: containers, GPU VMs and bare metal, instance statuses, and how hourly GPU billing works."
---

# GPU Cloud concepts

Fluence GPU Cloud rents GPUs from providers in data centers around the world. You can run three types of GPU workloads: containers, VMs, and bare metal servers. In the Fluence Console you rent them in the **GPU Marketplace** and manage them on the **GPU instances** page. To do the same from code, use the [GPU Cloud API](../api/gpu_cloud.md).

## Workload types

| | Container | VM | Bare metal |
|---|---|---|---|
| What it is | A container on a shared host with full access to its GPUs | A virtual machine with GPU passthrough | A dedicated physical server |
| Image | A container image | An OS image | An OS image |
| Connection | A domain with forwarded ports | SSH to a public IP address | SSH to a public IP address |
| What you can change after launch | Image, start command, environment variables, and SSH key | Name, through the API only | Name, through the API only |

A container runs a Docker image that you choose, with an optional start command, environment variables, and ports. The platform gives the container a domain and maps each of your ports to an external port. For example, your port `22` can become port `30694` on the domain.

A VM and a bare metal server both run an OS image with GPU drivers, and you connect to them over SSH. A VM runs on a hypervisor. A bare metal server is a physical machine with no virtualization layer. The console and the API rent both the same way.

## Instance statuses

| API status | Console label | Meaning |
|---|---|---|
| `INITIALIZED` | Initialized or Provisioning | The instance is being provisioned. For a container, the console shows the provisioning step, from 1/4 to 4/4. |
| `ACTIVE` | Running | The instance is running. Its connection details are available. |
| `FAILED` | Failed | Provisioning failed. Nothing was charged. |
| `ENDED` | Ended | You terminated the instance, or the platform ended it |

Provisioning usually takes 2 to 3 minutes.

## Billing model

GPU instances are billed by the hour in USD, from your account balance.

- Billing starts when the instance becomes Running. At that moment Fluence charges the first hour.
- After that, Fluence charges one hour at a time, every hour counted from the moment the instance started. For example, an instance that started at 11:13 is charged at 11:13, 12:13, 13:13, and so on. **Next billing time** on the instance page shows the next charge.
- Every started hour is charged in full. When an instance ends, the unused part of the hour is not returned.
- Nothing is reserved or held on the instance. A failed instance is not charged.
- To launch an instance in the console, your balance must cover the first 2 hours. The console shows this as **Upfront** on the review panel. Through the API, the balance must cover 1 hour.

If your balance cannot cover the next hour, Fluence still charges the hour, and your balance goes below zero. At the following charge, Fluence ends the instance. Fluence can also end all your GPU instances earlier, when your balance runs low. GPU instances do not get the grace period that CPU resources get. To keep instances running, keep enough balance. See [Payment and balance management](../balance.md).
