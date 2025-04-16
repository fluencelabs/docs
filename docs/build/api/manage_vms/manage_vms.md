---
sidebar_position: 3
---

# Managing Your Virtual Machines on Fluence

After deploying virtual machines on the Fluence marketplace, you'll need to monitor and manage them throughout their lifecycle. This guide explains how to view your active VMs, understand their status, and perform management operations like deletion when needed.

In this guide, we'll walk through how to:

1. View your active VMs
2. Understand VM status and resource details
3. Delete VMs when they are no longer needed

## Viewing Your Active VMs

To view all your currently active virtual machines, you can use the following API endpoint:

```bash
GET https://api.fluence.dev/vms/v2
```

### Response structure

The response will contain an array of VM objects, each representing a virtual machine you have deployed. Each VM object includes detailed information about its configuration, status, and the resources allocated to it.

Here's an example of a VM object in the response:

```json
{
  "id": "0x0000000000000000000000000000000000000001",
  "vmName": "vm-name",
  "status": "ACTIVE", // TODO: maybe add `LAUNCHING` to reflect Console UI statuses
  "pricePerEpoch": 298160, // TODO: field without precision - may be changed to string with precision 6
  "resources": [
    {
      "type": "VCPU",
      "quantity": 2,
      "details": {
        "model": "7702p"
      },
      "metadata": {
        "architecture": "Zen",
        "brand": "EPYC",
        "generation": "2",
        "manufacturer": "AMD"
      }
    },
    {
      "type": "RAM",
      "quantity": 4096, // TODO: quantity is in MiB. So it's not very readable
      "details": {
        "manufacturer": "Samsung",
        "model": "DGX",
        "speed": 3600
      },
      "metadata": {
        "generation": "4",
        "type": "DDR"
      }
    },
    {
      "type": "STORAGE",
      "quantity": 25600,
      "details": {
        "manufacturer": "WD",
        "sequentialWriteSpeed": 15000
      },
      "metadata": {
        "type": "SSD"
      }
    },
    {
      "type": "PUBLIC_IP",
      "quantity": 1,
      "details": {},
      "metadata": {
        "version": "4"
      }
    }
  ]
}
```

Let's break down the key components of each VM object:

### Response Fields

#### Basic VM Information

- **`id`**: The unique identifier for the VM on the Fluence network
- **`vmName`**: The name you assigned to the VM when creating it
- **`status`**: Current operational status of the VM (currently - only `ACTIVE` is shown) // TODO: maybe add `LAUNCHING` to reflect Console UI statuses
- **`pricePerEpoch`**: The cost of the VM per epoch (24 hours) in USDC (with 6 decimals)

#### Resources

The `resources` array contains detailed information about all resources allocated to your VM. Each resource is represented by an object with the following fields:

- **`type`**: The type of resource, which can be one of:
  - `VCPU`: Virtual CPU cores
  - `RAM`: Memory in MB
  - `STORAGE`: Disk space in MB
  - `PUBLIC_IP`: Public IP address
  - `NETWORK_BANDWIDTH`: Network bandwidth allocation
- **`quantity`**: The amount of this resource allocated to the VM (units depend on the resource type)
- **`metadata`**: Categorization and descriptive information about the resource. Corresponds to hardware resource characteristics from [Hardware Specifications](../get_offerings/get_offerings.md#hardware-specifications)
- **`details`**: Additional technical specifications about the resource. This field is optional for compute providers and may be empty or contain arbitrary data.

## VM Status Values

The `status` field in the VM object indicates the current state of your virtual machine. Here are the possible status values and what they mean:

- **`ACTIVE`**: The VM is running normally and available for use // TODO: maybe add `LAUNCHING` to reflect Console UI statuses

## Deleting a VM

When you no longer need a VM, you can delete it to release the resources and stop incurring charges. To delete a VM, use the following API endpoint:

```bash
DELETE https://api.fluence.dev/vms/v3
```

### Request Format

To delete a VM, you need to specify its ID in the request body:

```json
{
  "vmId": "0x0B08D9233ed01f4697d4b6C5814bc6d9f0cB8F99"
}
```

Where:

- **`vmId`**: The unique identifier of the VM you want to delete (from the list of your active VMs)

A successful deletion request will return a 200 status code. The VM will be marked for deletion and will no longer appear in your list of active VMs once the deletion process is complete.

:::info
You will be billed for the resources for each epoch of utilization. This means that if an epoch changes at 5:55 PM UTC and you delete the VM at 6:00 PM UTC, you will be charged for work in epoch started at 5:55 PM UTC as well.
:::
