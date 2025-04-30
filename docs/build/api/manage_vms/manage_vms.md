---
sidebar_position: 3
---

# Manage your deployments

After deploying virtual machines on the Fluence marketplace, you can monitor and manage them throughout their lifecycle. This guide explains how to view your active VMs, understand their status, and perform management operations like deletion when needed.

In this guide, you'll learn how to:

1. View your active VMs
2. Understand VM status and resource details
3. Delete VMs when they are no longer needed

## View your active VMs

To view all your currently active virtual machines, use the following API endpoint:

```bash
GET https://api.fluence.dev/vms/v3
```

### Response structure

The response contains an array of VM objects, each representing a virtual machine you have deployed. Each VM object includes detailed information about its configuration, status, and the resources allocated to it.

**Example of a VM object in the response:**

```json
{
  "id": "0x311edB209b61EaA8c3e67c6B96D03288DB5Bc020",
  "vmName": "vm-name",
  "status": "Active",
  "pricePerEpoch": "2.4352",
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
      "supply": 4,
      "units": "GiB",
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
      "supply": 25,
      "units": "GiB",
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
  ],
  "createdAt": "2025-04-30T11:23:05Z",
  "nextBillingAt": "2025-04-30T11:55:09Z",
  "osImage": "https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-amd64.img",
  "datacenter": {
    "countryCode": "FR",
    "cityCode": "PAR",
    "cityIndex": 1,
    "tier": 4,
    "certifications": ["PCI DSS", "ISO 9001:2015", "ISO/IEC 27001:2022"]
  },
  "publicIp": "154.42.3.159",
  "ports": [
    {
      "port": 22,
      "protocol": "tcp"
    }
  ],
  "reservedBalance": "2.4352",
  "totalSpent": "2.4352"
}
```

Let's break down the key components of each VM object:

#### Basic VM information

- **`id`**: The unique identifier for the VM on the Fluence network
- **`vmName`**: The name you assigned to the VM when creating it
- **`status`**: Current operational status of the VM. Statuses:
  - `Launching`: The VM is being launched and does not yet has a public IP address to accept connections
  - `Active`: The VM is running and operational
- **`pricePerEpoch`**: The cost of the VM per epoch (24 hours) in USDC (with 6 decimals)
- **`createdAt`**: Timestamp indicating when the VM was created
- **`nextBillingAt`**: Timestamp indicating when the next billing cycle will start
- **`osImage`**: URL of the operating system image used for the VM
- **`publicIp`**: The public IP address assigned to your VM. If a VM is not active, the `publicIp` field will be `null`.
- **`reservedBalance`**: The amount of USDC (with 6 decimals) currently reserved for this VM's operation
- **`totalSpent`**: The total amount of USDC (with 6 decimals) spent on this VM since creation

#### Datacenter information

The `datacenter` object provides detailed information about where your VM is physically hosted:

```json
"datacenter": {
  "countryCode": "FR",
  "cityCode": "PAR",
  "cityIndex": 1,
  "tier": 4,
  "certifications": ["PCI DSS", "ISO 9001:2015", "ISO/IEC 27001:2022"]
}
```

- **`id`**: Unique identifier for the datacenter
- **`countryCode`**: ISO country code where the datacenter is located
- **`cityCode`**: LOCODE code for the city
- **`cityIndex`**: Index if multiple datacenters exist in the same city
- **`tier`**: Datacenter tier level (1-4, with 4 being highest reliability)
- **`certifications`**: Array of compliance certifications this datacenter holds

#### Network configuration

The **`ports`** array indicates which network ports are open on your VM. Each open port is represented by an object with the following fields:

- `port`: The port number that is open
- `protocol`: The network protocol for this port (e.g., "tcp", "udp")

```json
"ports": [
  {
    "port": 22,
    "protocol": "tcp"
  }
]
```

Open ports are essential for accessing services running on your VM. For example, port 22 is typically used for SSH access.

#### Resources

The **`resources`** array contains detailed information about all resources allocated to your VM. Each resource is represented by an object with the following fields:

- `type`: The type of resource, which can be one of:
  - `VCPU`: Virtual CPU cores
  - `RAM`: Memory in MB
  - `STORAGE`: Disk space in MB
  - `PUBLIC_IP`: Public IP address
- `quantity`: The amount of this resource allocated to the VM (units depend on the resource type)
- `metadata`: Categorization and descriptive information about the resource. Corresponds to hardware resource characteristics from [Available Hardware Specifications](../get_offerings/get_offerings.md#available-hardware-specifications)
- `details`: Additional technical specifications about the resource. This field is optional for compute providers and may be empty or contain arbitrary data.

## Update VM ports and name

Fluence allows you to update certain VM properties after deployment, including the VM name and the network ports that are open to external connections.

In this section, you'll learn how to:

1. Update your VM's name
2. Manage open network ports to control access to your services

### Request parameters

To update your VM's configuration, use the following API endpoint:

```bash
PATCH https://api.fluence.dev/vms/v2
```

This endpoint allows you to change the following properties:

- The VM's display name
- The network ports that are open on the VM

Here's how to structure your request to update a VM:

```json
{
  "id": "0x730eB2c518c881AEB05299DDf38ca546F3513a93", // required
  "vmName": "new-vm-name", // optional
  "openPorts": [
    // optional
    {
      "port": 22,
      "protocol": "tcp"
    },
    {
      "port": 9000,
      "protocol": "tcp"
    }
  ]
}
```

- **`id`**: (Required) The unique identifier of the VM you want to modify
- **`vmName`**: (Optional) A new name for your VM to help with organization and identification
- **`openPorts`**: (Optional) An array of port objects that define which network ports should be open on the VM

### Managing open ports

When updating the `openPorts` array, there are a few important things to understand:

1. When specifying `openPorts`, you must include **ALL** ports that should be open, not just new ones. Any ports not included in your update request will be closed.
2. Currently, port 10250 is reserved for service purposes and will be available for exposure in upcoming releases.

For example, if your VM currently has port 5050 (TCP) open and you want to add port 9000 (TCP) for a web application, your `openPorts` array should include both:

```json
"openPorts": [
  {
    "port": 5050,
    "protocol": "tcp"
  },
  {
    "port": 9000,
    "protocol": "tcp"
  }
]
```

If you were to only include port 9000 in your request, port 5050 would be closed, potentially locking you out of your VM.

### Example scenarios

#### Scenario 1: Renaming a VM

If you want to rename a VM without changing its port configuration:

```json
{
  "id": "0x730eB2c518c881AEB05299DDf38ca546F3513a93",
  "vmName": "new-vm-name"
}
```

#### Scenario 2: Opening Additional Ports

If your VM has port 5050 open and you want to also open ports 80 and 443 for web traffic:

```json
{
  "id": "0x730eB2c518c881AEB05299DDf38ca546F3513a93",
  "openPorts": [
    {
      "port": 5050,
      "protocol": "tcp"
    },
    {
      "port": 80,
      "protocol": "tcp"
    },
    {
      "port": 443,
      "protocol": "tcp"
    }
  ]
}
```

#### Scenario 3: Updating both name and ports

You can update both properties in a single request:

```json
{
  "id": "0x730eB2c518c881AEB05299DDf38ca546F3513a93",
  "vmName": "new-vm-name",
  "openPorts": [
    {
      "port": 5050,
      "protocol": "tcp"
    },
    {
      "port": 80,
      "protocol": "tcp"
    },
    {
      "port": 443,
      "protocol": "tcp"
    }
  ]
}
```

### Response

A successful update request will return a 204 status code. The changes will take effect immediately, and you'll see the updated configuration when you next retrieve your VM details.

## Delete a VM

When you no longer need a VM, you can delete it to release the resources and stop incurring charges. To delete a VM, use the following API endpoint:

```bash
DELETE https://api.fluence.dev/vms/v3
```

### Request parameters

You can delete one or multiple VMs at once by specifying their IDs in the request body:

```json
{
  "vmIds": [
    "0x311edB209b61EaA8c3e67c6B96D03288DB5Bc020",
    "0x79F7D3F8c1A2D7B4A890a1B5cE3EfCd8D6E7F8a9"
  ]
}
```

Where:

- **`vmIds`**: An array of unique identifiers of the VMs you want to delete (from the list of your active VMs)

A successful deletion request will return a 200 status code. The VMs will be marked for deletion and will no longer appear in your list of active VMs once the deletion process is complete.

:::info
You will be billed for the resources for each epoch of utilization. This means that if an epoch changes at 5:55 PM UTC and you delete the VM at 6:00 PM UTC, you will be charged for work in epoch started at 5:55 PM UTC as well.
:::

## Manage SSH keys

Fluence allows you to manage your SSH keys, which can be automatically deployed to your VMs.

In this section, you'll learn how to:

1. List your registered SSH keys
2. Add new SSH keys to your account
3. Remove SSH keys when they're no longer needed

:::warning
Without any SSH keys registered, you won't be able to access your VMs. Please ensure you have at least one SSH key registered before creating a VM.
:::

### List SSH keys

To view all SSH keys registered in your account, use the following API endpoint:

```bash
GET https://api.fluence.dev/ssh_keys
```

This endpoint returns an array of SSH key objects representing all the keys you've registered.

**Example response:**

```json
[
  {
    "name": "name-ed25519",
    "fingerprint": "SHA256:fingerprint",
    "algorithm": "ssh-ed25519",
    "comment": "comment",
    "publicKey": "ssh-ed25519 key",
    "active": true,
    "createdAt": "+002025-03-28T16:26:38.808750000Z"
  }
]
```

#### Response fields

Each SSH key object includes the following information:

- **`active`**: Indicates whether the key is currently active and can be used
- **`algorithm`**: The cryptographic algorithm used for the key (e.g., `ssh-ed25519`, `ssh-rsa`)
- **`comment`**: A comment included with the key, often indicating the user and machine that created it
- **`createdAt`**: Timestamp when the key was added to your account
- **`fingerprint`**: A unique identifier for the key, used when deleting keys
- **`name`**: The friendly name you assigned to the key
- **`publicKey`**: The full public key string

### Add an SSH key

To add a new SSH key to your account, use the following API endpoint:

```bash
POST https://api.fluence.dev/ssh_keys
```

#### Request parameters

```json
{
  "name": "my-key",
  "publicKey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKgJIjnDg1DjqOOxINs78oU3f7PJXIyq9uiNocNVhXNx user@example.com"
}
```

- **`name`**: A friendly name for identifying this key in your account
- **`publicKey`**: The full SSH public key string, which typically includes the algorithm, the key itself, and optionally a comment

:::tip
Read how to [generate SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) if you don't have them yet.
:::

#### Response fields

If the key already exists in your account, the endpoint returns a 200 status code with the existing key details:

```json
[
  {
    "active": true,
    "algorithm": "ssh-ed25519",
    "comment": "user@example.com",
    "createdAt": "+002025-03-01T00:00:000000000Z",
    "fingerprint": "SHA256:sINcLA/hlKG0nDpE9n233xEnXAgSISxq0/nVWbbx5A4",
    "name": "my-key",
    "public_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKgJIjnDg1DjqOOxINs78oU3f7PJXIyq9uiNocNVhXNx user@example.com"
  }
]
```

If a new key is created, the endpoint returns a 201 status code with the newly created key details in the same format.

### Delete an SSH key

When you no longer need an SSH key, you can remove it from your account using the following API endpoint:

```bash
DELETE https://api.fluence.dev/ssh_keys
```

#### Request parameters

To delete a key, specify its unique fingerprint in the request body:

```json
{
  "fingerprint": "SHA256:sINcLA/hlKG0nDpE9n233xEnXAgSISxq0/nVWbbx5A4"
}
```

- **`fingerprint`**: The unique fingerprint of the SSH key you want to delete

A successful deletion request will return a 200 status code.
