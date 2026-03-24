---
sidebar_position: 0
---

# Concepts

Fluence CPU Cloud is a compute marketplace where you can rent virtual machine instances from enterprise-grade providers
worldwide, predominantly in Tier-3 and Tier-4 data centers.

## Workload types

Fluence CPU Cloud allows following workload to be deployed and managed:

| Workload type     | Description                                                                                                        |
|-------------------|--------------------------------------------------------------------------------------------------------------------|
| `Virtual machine` | A virtualized compute instance with customizable resources (vCPU, RAM)                                             |
| `Storage`         | A block storage device that can be attached to a virtual machine for additional storage capacity or as a boot disk |
| `Public IP`       | A public IPv4 address that can be attached to a virtual machine for external access                                |

## Instance lifecycle

Each instance goes through the following statuses during its lifetime:

| Status          | Description                                                                            |
|-----------------|----------------------------------------------------------------------------------------|
| `New`           | Instance is created and is about to be provisioned                                     |
| `Launching`     | Instance is being provisioned by the provider — workload is not running yet            |
| `Launched`      | Instance is running and accessible                                                     |
| `Failed`        | Instance failed to launch due to a provisioning error — workload is no longer running. |
| `Updating`      | Instance is being updated after configuration changes                                  |
| `Terminating`   | Instance is being ended by the user or system                                          |
| `Terminated`    | Instance is terminated and the workload is no longer running                           |
| `Suspending`    | Instance is being suspended by the user or system                                      |
| `Suspended`     | Instance was suspended                                                                 |
| `Restarting`    | Instance is being restarted by the user or system                                      |
| `SoftRebooting` | Instance is being soft rebooted by the user or system                                  |

## Billing model

CPU Cloud uses hourly billing in USDC. Each instance has its own billing period that starts at activation time and
repeats every hour.
The system reports charges the user balance in the beginning of each billing period, and if the balance is insufficient,
user's vms are terminated. However, the storages are charged separately and are not terminated when the balance runs
out. If the balance is replenished, the user can deploy new instances and attach existing storages to them.

## OS images

You can use a pre-defined OS image from Fluence or provide a URL to a custom image for boot disks. Custom images must be
publicly downloadable and configured for remote instances.

Supported formats: `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, `.img.gz`.
