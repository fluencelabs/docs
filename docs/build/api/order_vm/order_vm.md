# Deploying Virtual Machines on the Fluence Marketplace

After [finding available compute resources](../get_offerings/get_offerings.md) that match your requirements, the next step is to deploy your virtual machines (VMs). This guide walks you through the process of ordering and deploying VMs on the Fluence marketplace.

In this guide, you'll learn how to:

1. Prepare your deployment configuration
2. Specify VM requirements and settings
3. Submit your VM deployment request
4. Understand the deployment response
5. Manage your running VMs

## Creating a VM Deployment

To deploy VMs on the Fluence marketplace, use the following endpoint:

```bash
POST https://api.fluence.dev/vms/v3
```

### Building Your Deployment Request

Your deployment request has three key components:

1. **Resource constraints (optional)** - Constraints on the compute resources, location, and price if you have any specific requirements. For options that are not constrained, the system will automatically select the best available option for you.
2. **Number of instances** - How many VMs to deploy // TODO: What if not basic configuration chosen, what will happen?
3. **VM configuration** - Settings for your VM deployment.

Let's look at a complete example request:

```json
{
  "constraints": {
    "basicConfiguration": "cpu-4-ram-8gb-storage-25gb", // If no basic configuration is chosen, the system will automatically select the smallest available option.
    "additionalResources": null, // Null means no additional resources are needed. You can just omit this field, it is present here for example only.
    "hardware": null,
    "datacenter": null,
    "maxTotalPricePerEpochUsd": "1.5" // If no max price is chosen, the system will automatically select the cheapest available option.
  },
  "instances": 2,
  "vmConfiguration": {
    "name": "web-server",
    "openPorts": [
      {
        "port": 80,
        "protocol": "tcp"
      },
      {
        "port": 443,
        "protocol": "tcp"
      }
    ],
    "osImage": "https://fluence-os-images.fra1.digitaloceanspaces.com/disk.img.gz",
    "sshKeys": ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCxV4JJjOCRCnPkvf9h..."]
  }
}
```

Let's break down each component in detail:

### Resource Constraints

The `constraints` object specifies the compute resources you need for your VMs if you have any specific requirements. This field is optional. This uses the same parameters you learned about in the [Finding Compute Resources](../get_offerings/get_offerings.md) guide:

```json
"constraints": {
  "basicConfiguration": "cpu-4-ram-8gb-storage-25gb",
  "additionalResources": null,
  "hardware": null,
  "datacenter": null,
  "maxTotalPricePerEpochUsd": "1.5"
}
```

- **`basicConfiguration`**: A predefined resource profile (e.g., `cpu-4-ram-8gb-storage-25gb` for 4 CPUs, 8GB RAM, 25GB storage)
- **`additionalResources`**: Extra resources beyond the basic configuration. Corresponds to the `additionalResources` field in the [Finding Compute Resources](../get_offerings/get_offerings.md#additional-resources) guide.
- **`hardware`**: Specific hardware requirements like CPU manufacturer or storage type. Corresponds to the `hardware` field in the [Finding Compute Resources](../get_offerings/get_offerings.md#hardware-specifications) guide.
- **`datacenter`**: Geographic constraints for your deployment. Corresponds to the `datacenter` field constraint in the [Finding Compute Resources](../get_offerings/get_offerings.md#geographic-constraints) guide.
- **`maxTotalPricePerEpochUsd`**: Maximum price you're willing to pay per VM per epoch (24 hours). Corresponds to the `maxTotalPricePerEpochUsd` field constraint in the [Finding Compute Resources](../get_offerings/get_offerings.md#budget-constraint) guide.

You only need to include the constraints that matter to you. For example, if you only care about the basic configuration and price, you can omit the other fields or set them to `null`.

### Number of Instances

The `instances` field is straightforward - it specifies how many identical VMs you want to deploy:

```json
"instances": 2
```

This will create two VMs with identical configurations.

### VM Configuration

The `vmConfiguration` object defines the settings for your VMs:

```json
"vmConfiguration": {
  "name": "web-server",
  "openPorts": [
    {
      "port": 80,
      "protocol": "tcp"
    },
    {
      "port": 443,
      "protocol": "tcp"
    }
  ],
  "osImage": "https://fluence-os-images.fra1.digitaloceanspaces.com/disk.img.gz",
  "sshKeys": [
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCxV4JJjOCRCnPkvf9h..."
  ]
}
```

Let's examine each field:

#### VM Name

- **`name`**: A human-readable name for your VM(s). Can contain only alphanumeric characters and hyphens.

#### Network Configuration

- **`openPorts`**: An array of port configurations that should be accessible from the internet:
  - **`port`**: The port number to open
  - **`protocol`**: The protocol for this port (either `tcp`, `udp`)

For security reasons, all ports are closed by default. You must explicitly specify which ports you want to open for your application.

#### Operating System

- **`osImage`**: The URL to the OS image to use for your VM. Supported image formats are:
  - `.qcow2`
  - `.img`
  - `.raw`
  - `.raw.xz`
  - `.raw.gz`
  - `.img.xz`
  - `.img.gz`

#### Access Configuration

- **`sshKeys`**: An array of public SSH keys that will be authorized to access your VMs. These keys allow you to securely connect to your VMs via SSH. Read how to [generate SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) if you don't have them yet.

## Understanding the Deployment Response

When you submit your deployment request, the API will respond with an array of objects, one for each VM being deployed:

```json
[
  {
    "appCid": "bafkreihqjkkphghotzkjd5h4bnzh6n2ysmg6qbm2mk6dnlsm3r7zfwoo4y", // TODO: currently discussing to remove this field. Remove once it is decided.
    "dealId": "0xCbfC94101AE30f212790B6Da340fD071B5eee86D", // TODO: currently discussing to name it vmId
    "peerId": "12D3KooWHnPKNkhfvwEVQ5TJGEnD5LaXo6UHEG5eVXnhRLixfhXm" // TODO: currently discussing to remove this field. Remove once it is decided.
    // TODO: currently discussing to add vmName here
  },
  {
    "appCid": "bafkreifj2m7jpmnun4tsmdihaupf3l5egm2xz35jv2sdwqmhakxrjoeyq",
    "dealId": "0x79F7D3F8c1A2D7B4A890a1B5cE3EfCd8D6E7F8a9",
    "peerId": "12D3KooWRtgFEFGHiJkLmNoPQrStUvX7Ld3LHSVxMC7Nf8UEmTq3"
  }
]
```

Each object in the response contains these important identifiers:

- **`appCid`**: The Content Identifier (CID) for your deployment. This is a unique identifier of service file with information of your VM deployment stored on IPFS.
- **`dealId`**: The blockchain deal identifier. This represents the smart contract that manages your deployment on the blockchain.
- **`peerId`**: The peer identifier for your VM in the Fluence network. You'll use this to communicate with your VM.

Save these identifiers as they are essential for managing your deployment later.

## Practical Workflow

Let's walk through a typical workflow for deploying VMs on the Fluence marketplace:

1. **Define your requirements**:

   - Determine the size and number of VMs you need
   - Decide which ports need to be accessible
   - Prepare your SSH public keys
   - Prepare your OS image download URL

2. **Create your deployment request**:

   - Specify your basic configuration and constraints
   - Configure VM settings (name, ports, OS image)
   - Add your SSH keys for secure access

3. **Submit your deployment**:

   ```bash
   curl -X POST https://api.fluence.dev/vms/v3 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $API_KEY" \
     -d '{
       "constraints": {
         "basicConfiguration": "cpu-2-ram-8gb-storage-25gb",
         "maxTotalPricePerEpochUsd": "1.5"
       },
       "instances": 1,
       "vmConfiguration": {
         "name": "my-vm",
         "openPorts": [
           {
             "port": 8080,
             "protocol": "tcp"
           }
         ],
         "osImage": "https://fluence-os-images.fra1.digitaloceanspaces.com/disk.img.gz",
         "sshKeys": [
           "ssh-rsa AAAAB3NzaC1yc2EAAA..."
         ]
       }
     }'
   ```

4. **Save the response data**:

   - Store the `appCid`, `dealId`, and `peerId` values // TODO: fix later when fields are changed
   - These will be needed to manage your deployment

5. **Connect to your VM**:
   - Use SSH with the private key corresponding to your public key
   - The connection details will be provided in a separate response or dashboard

## Next Steps

After deploying your VMs, you might want to:

1. **View your deployments**: Get the list of your deployed VMs and their statuses
2. **Delete your deployments**: Terminate instances when no longer needed

In the next guide, we'll cover how to [manage your running VMs](../manage_vms/manage_vms.md).
