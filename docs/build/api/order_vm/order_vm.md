# Deploy virtual machines

After [finding available compute resources](../get_offerings/get_offerings.md) that match your requirements, the next step is to deploy your virtual machines (VMs). This guide walks you through the process of ordering and deploying VMs on the Fluence marketplace.

In this guide, you'll learn how to:

1. Prepare your deployment configuration
2. Specify VM requirements and settings
3. Submit your VM deployment request
4. Understand the deployment response

## Create a VM deployment

To deploy VMs on the Fluence marketplace, use the following endpoint:

```bash
POST https://api.fluence.dev/vms/v3
```

### Request parameters

Your deployment request has three key components:

1. **Resource constraints (optional)** - Constraints on the compute resources, location, and price if you have any specific requirements. For options that are not constrained, the system will automatically select the best available option for you.
2. **Number of instances** - How many VMs to deploy.
3. **VM configuration** - Settings for your VM deployment.

**An example request body:**

```json
{
  "constraints": {
    // optional
    "basicConfiguration": "cpu-4-ram-8gb-storage-25gb",
    "additionalResources": {
      "storage": [
        {
          "type": "NVMe",
          "megabytes": 20480 // in MiB
        }
      ]
    },
    "hardware": null,
    "datacenter": null,
    "maxTotalPricePerEpochUsd": "1.5"
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
    "osImage": "https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img",
    "sshKeys": ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCxV4JJjOCRCnPkvf9h..."]
  }
}
```

Let's break down each component in detail:

#### Resource constraints (optional)

The `constraints` object specifies the compute resources you need for your VMs if you have any specific requirements. This field is optional. This uses the same parameters you learned about in the [Finding Compute Resources](../get_offerings/get_offerings.md) guide:

Fields:

- **`basicConfiguration`**: A predefined resource profile. If no basic configuration is chosen, the system will automatically select the smallest available option. Read more about basic configurations in the [Basic Configurations section](../get_offerings/get_offerings.md#basic-configuration).
- **`additionalResources`**: Extra resources beyond the basic configuration. Read more about additional resources in the [Additional Resources section](../get_offerings/get_offerings.md#additional-resources).
- **`hardware`**: Specific hardware requirements like CPU manufacturer or storage type. Read more about hardware specifications in the [Hardware Specifications section](../get_offerings/get_offerings.md#hardware-specifications-constraints). If you use this field, you must use all the fields of the added hardware type.
- **`datacenter`**: Geographic constraints for your deployment. Read more about datacenter constraints in the [Datacenter Countries section](../get_offerings/get_offerings.md#datacenter-constraints).
- **`maxTotalPricePerEpochUsd`**: Maximum price you're willing to pay per VM per epoch (24 hours). If no max price is chosen, the system will automatically select the cheapest available option. Read more about max price constraint in the [Maximum Price Per Epoch section](../get_offerings/get_offerings.md#maximum-price-per-epoch-constraint).

:::info
You only need to include the constraints that matter to you. For example, if you only care about the basic configuration and price, you can omit the other fields or set them to `null`.
:::

#### Number of instances

The `instances` field is straightforward - it specifies how many identical VMs you want to deploy:

**Example:**

```json
"instances": 2
```

This will create two VMs with identical configurations.

#### VM configuration

The `vmConfiguration` object defines the deployment details for your VMs:

```json
"vmConfiguration": {
  "name": "my-vm",
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
  "osImage": "https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img",
  "sshKeys": [
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCxV4JJjOCR..."
  ]
}
```

- **`name`** : A human-readable name for your VM(s). Can contain only alphanumeric characters and hyphens.

- **`openPorts`** : An array of port configurations that should be accessible from the internet:

  - `port`: The port number to open
  - `protocol`: The protocol for this port (either `tcp`, `udp`)

- **`osImage`**: The URL to the OS image to use for your VM. Supported image formats are:

  - `.qcow2`
  - `.img`
  - `.raw`
  - `.raw.xz`
  - `.raw.gz`
  - `.img.xz`
  - `.img.gz`

- **`sshKeys`**: An array of public SSH keys that will be authorized to access your VMs. These keys allow you to securely connect to your VMs via SSH. Read how to [generate SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) if you don't have them yet.

:::info
By default, only 22 port (TCP) is open for SSH access. You must explicitly specify which ports you want to open for your application.
:::

### Response structure

When you submit your deployment request, the API will respond with an array of objects, one for each VM being deployed:

```json
[
  {
    "vmId": "0xCbfC94101AE30f212790B6Da340fD071B5eee86D",
    "vmName": "my-vm"
  },
  {
    "vmId": "0x79F7D3F8c1A2D7B4A890a1B5cE3EfCd8D6E7F8a9",
    "vmName": "my-vm-2"
  }
]
```

Each object in the response contains these important identifiers:

- **`vmId`**: The unique identifier for your VM.
- **`vmName`**: The name you assigned to the VM.

Save these identifiers as they are essential for managing your deployment later.

:::info
In case if no offers match your requirements, you will receive an error response.
_Currently, the error response has 500 status code and the body contains the error message "Internal server error"._
:::

:::info
Please note payment for VMs occurs every day at **`5:55 PM UTC`** and is currently only possible for full days regardless of the rental start time. Thus, if you rent a VM at `5:45 PM UTC`, you will pay for a **FULL** day for the ten minutes of use. At `5:55 PM UTC`, the next full payment is due. This limitation is expected to be remedied in the very near future.
:::

### Practical workflow

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
         "basicConfiguration": "cpu-4-ram-8gb-storage-25gb",
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
         "osImage": "https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img",
         "sshKeys": [
           "ssh-rsa AAAAB3NzaC1yc2EAAA..."
         ]
       }
     }'
   ```

4. **Save the response data**:

   - Store the `vmId` and `vmName` values
   - These will be needed to manage your deployment

5. **Connect to your VM**:
   VM launching will take a few minutes. Once the VM is launched, you can connect to it using SSH with the private key corresponding to your public key. To get the connection details, you can visit UI of Fluence Console [described here](../../manage_vm/manage_vm.md). Or you can use a view endpoint to get the connection details using API, which is described in the next document.

## Next steps

After deploying your VMs, you might want to:

1. **View your deployments**: Get the list of your deployed VMs and their statuses
2. **Delete your deployments**: Terminate instances when no longer needed

In the next guide, we'll cover how to [manage your running VMs](../manage_vms/manage_vms.md).
