---
sidebar_position: 0
---

# Concepts

Fluence GPU Cloud is a marketplace of GPU compute from providers in data centers around the world. You can deploy three types of GPU workloads — containers, VMs, and bare metal instances — and manage them through the console or the API.

## Workload types

GPU Cloud supports three deployment types. Each suits a different use case:

| | Container | VM | Bare Metal |
|---|---|---|---|
| **What it is** | A containerized workload running on a shared host with full GPU access | A virtual machine with GPU passthrough | A dedicated physical server with direct GPU access |
| **Image** | Container image (Docker) | OS image | OS image |
| **Connectivity** | Domain with forwarded ports | Direct SSH via public IP | Direct SSH via public IP |
| **Updatable** | Yes — image, start command, env vars, SSH keys | Rename only | Rename only |
| **Best for** | ML inference, training jobs, GPU-accelerated apps packaged as containers | Workloads that need full OS control with GPU access | Maximum performance with no virtualization overhead |

**Containers** are lightweight deployments ideal for running GPU workloads packaged as Docker images. You specify a container image, optional start command, environment variables, and exposed ports. The platform assigns a domain and maps your ports to externally accessible forwarded ports — for example, your port `22` may be forwarded to `30694`.

**VMs** provide a full virtual machine with GPU passthrough. You choose an OS image and connect directly via SSH over a public IP.

**Bare metal** instances give you a dedicated physical server with direct GPU access and no virtualization overhead. The deployment flow and management are identical to VMs — the only difference is the underlying hardware isolation.

## Instance lifecycle

Each instance goes through the following statuses:

| Status | Description |
|--------|-------------|
| `Initiated` | Instance is being provisioned |
| `Active` | Instance is running and accessible |
| `Failed` | Provisioning failed — funds are returned to your account |
| `Ended` | Instance was terminated by the user or the system |

Provisioning typically takes 2–3 minutes. Once active, connection details become available — a domain with forwarded ports for containers, or an SSH connection for VMs and bare metal.

## Billing model

GPU Cloud uses hourly pre-paid billing in USD. Billing periods are fixed hourly intervals (e.g., 15:00–16:00, 16:00–17:00 UTC) regardless of when the instance was started. At each billing period, one hour of rent is charged from the instance's balance.

### Instance balance

Every instance has its own reserved balance that covers ongoing rent. When you deploy an instance, the system deducts an amount equivalent to 3 hours of rent from your account balance and transfers it to the instance's reserved balance. One hour is charged immediately for the current billing period, while the remaining 2 hours stay as a reserve.

If provisioning fails, the full amount is returned to your account balance.

### Automatic top-ups

The system maintains a reserve of 2 hours of rent on each instance's balance. When the reserve drops below this target — typically after each hourly charge — the system automatically tops it up from your account balance.

### Insufficient funds

If your account balance cannot cover a top-up, the system keeps retrying the top-up. Your instance continues running through any billing period that has already been paid for. Termination happens only when the next charge fails because the reserved balance has been fully spent — at that point the instance is deleted.

### Refunds on termination

When an instance is stopped or terminated — whether by you or the system — all unused funds remaining on the instance's reserved balance are returned to your account balance.
