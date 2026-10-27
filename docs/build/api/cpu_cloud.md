---
sidebar_position: 3
description: "Create a CPU virtual machine with the Fluence API v3: pick a cluster and configuration, create and estimate a draft, provision it, connect over SSH, and delete it."
---

# CPU Cloud API

This page shows how to run a CPU virtual machine with the Fluence API v3: create a draft, check its price, provision it, connect to it, and delete it. For authentication, permissions, retries, and errors, see the [API overview](./overview.md). For every field of every operation, see the [API reference](https://api.fluence.dev/scalar).

## How a VM is built

A VM runs in one cluster, which is a data center location. The VM is made of separately billed resources:

- A VM configuration: vCPU and RAM, for example `cpu-shared-2vcpu-2gb`.
- A boot disk, created from an OS image or from an existing disk. A VM can also have data disks.
- Network interfaces. A public interface gives the VM a public IP address. A private interface connects it to a subnet of a VPC.

In v3 you first create a draft. A draft is not running and is not billed. You can edit and estimate it, and then provision it. Provisioning starts the VM and its billing. Each resource is billed per second from the moment it is ready. See [CPU Cloud billing](../cpu_cloud/overview.md#billing-model).

## Before you start

You need an API key with these scopes: `clusters:read`, `vm:list`, `prices:read`, `vms:read`, `vms:write`, `ssh_key:list`, and `ssh_key:create`. To delete disks and public IP addresses afterwards, the key also needs `storage:write` and `public_ip:write`. See [Permissions](./overview.md#permissions).

The examples read the key from the `FLUENCE_API_KEY` environment variable:

```sh
export FLUENCE_API_KEY=<YOUR_API_KEY>
```

## Create a VM

### 1. Choose a cluster

```sh
curl https://api.fluence.dev/v3/clusters \
  -H "X-API-KEY: $FLUENCE_API_KEY"
```

Each item has an `id`, a `name`, and a `location` with `countryCode`, `cityCode`, and `cityName`.

### 2. Choose a configuration

```sh
curl https://api.fluence.dev/v3/clusters/<cluster_id>/vm-offerings \
  -H "X-API-KEY: $FLUENCE_API_KEY"
```

The response lists the configurations that you can run in this cluster now. Each item has a `configuration` with `id`, `slug`, `vcpu`, `ramGb`, `dedicated`, and `cpuFamilies`, and a `priceInfo` with your price in USD per VM per hour in `pricePerHourPerQty`. The price does not include disks and public IP addresses. The list is a snapshot of free capacity, not a reservation.

### 3. Choose an OS image

```sh
curl https://api.fluence.dev/v3/images \
  -H "X-API-KEY: $FLUENCE_API_KEY"
```

Each image has an `id`, a `name`, a `distribution`, and the `username` that you log in with. The default image has `isDefault: true`.

### 4. Add an SSH key

If your account has no SSH key yet, add one and keep its `id`. See [SSH keys](./ssh_keys.md).

```sh
curl -X POST https://api.fluence.dev/v3/ssh-keys \
  -H "X-API-KEY: $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-key", "publicKey": "ssh-ed25519 AAAA..."}'
```

### 5. Create a draft

`POST /v3/vms` requires an `Idempotency-Key` header. Generate one value for this VM and keep it. If the response is lost, send the same request with the same key. You get the same draft, not a second one.

```sh
curl -X POST https://api.fluence.dev/v3/vms \
  -H "X-API-KEY: $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: create-my-vm-1" \
  -d '{
    "name": "my-vm",
    "clusterId": "<cluster_id>",
    "configurationId": "<configuration_id>",
    "bootDisk": {
      "kind": "new",
      "source": { "type": "catalog", "imageId": "<image_id>" },
      "volumeGb": 25
    },
    "interfaces": [
      { "kind": "public", "addressType": "V4", "default": true }
    ],
    "sshKeyIds": ["<ssh_key_id>"]
  }'
```

The response is `201` with the VM `id`, `acceptedStatus: "draft"`, and `createdResources` with the IDs of the new disks and public IP addresses. Keep these IDs. You use them to delete the resources later.

How the API fills fields that you leave out:

| Field | If you leave it out | Notes |
|---|---|---|
| `interfaces` | One private interface on your default subnet in the cluster. The VM has no public IP address. | To reach the VM from the internet, add a public interface as in the example. `[]` creates no interfaces. |
| `sshKeyIds` | All active SSH keys of your account | `[]` adds no keys |
| `bootDisk` | A 25 GB disk from the default image | `volumeGb` is at least 25 |
| `name`, `clusterId`, `configurationId` | Chosen by the platform | |

The boot disk can also come from your own image. Set `source` to `{"type": "http", "url": "<https_url>", "bootMode": "BIOS"}`. The URL must use HTTPS, and the file must end in `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, or `.img.gz`. The disk imports the image after the VM is provisioned, and the import can fail later.

To run a script on first boot, add `cloudInit` with cloud-init user data as a string, up to 16 KiB. The API never returns the content.

### 6. Check the price

```sh
curl https://api.fluence.dev/v3/vms/<vm_id>/estimate \
  -H "X-API-KEY: $FLUENCE_API_KEY"
```

The estimate returns USD amounts as decimal strings:

- `hourlyTotal` and `monthlyTotal` are the cost of all resources of the VM. A month is 730 hours.
- `hourlyIncremental` and `monthlyIncremental` leave out resources that are already billed, for example an existing disk.
- `breakdown` splits the cost into `vm`, `storage`, and `publicIp`.

An estimate reserves neither capacity nor balance. To estimate a full specification without creating a draft, use `POST /v3/vm-estimates`.

### 7. Provision the VM

```sh
curl -X POST https://api.fluence.dev/v3/vms/<vm_id>/provision \
  -H "X-API-KEY: $FLUENCE_API_KEY"
```

The API checks the draft again before it starts the VM. Your balance must be enough to keep all your resources, including the new ones, running for at least 6 hours. If the draft cannot start, the response lists the reasons in `violations`, for example `missingBootDisk`, `unboundInterface`, or `priceUnavailable`.

A `200` response means that provisioning started, not that the VM is running. Provisioning has no `Idempotency-Key`. If the response is lost, read the VM before you send the request again.

### 8. Wait for the address

Read the VM every 20 to 30 seconds until `status` is `launched`:

```sh
curl https://api.fluence.dev/v3/vms/<vm_id> \
  -H "X-API-KEY: $FLUENCE_API_KEY"
```

A launched VM might not have an IP address yet. Read its interfaces until the public interface has a non-empty `assignedIps`:

```sh
curl https://api.fluence.dev/v3/vms/<vm_id>/interfaces \
  -H "X-API-KEY: $FLUENCE_API_KEY"
```

Stop waiting after a timeout that suits you. A timeout on your side does not cancel provisioning.

### 9. Connect

```sh
ssh <username>@<address>
```

`<username>` is the `username` of the image from step 3. An address does not mean that SSH is ready. The guest OS can still be booting or running cloud-init. If the interface has a security group, the group must allow inbound TCP port 22.

## Delete a VM

Terminating a VM stops billing for the VM only. Its disks and public IP addresses stay, and you pay for them until you delete them.

1. Terminate the VM. The request requires an `Idempotency-Key`:

   ```sh
   curl -X POST https://api.fluence.dev/v3/vms/<vm_id>/terminate \
     -H "X-API-KEY: $FLUENCE_API_KEY" \
     -H "Idempotency-Key: terminate-my-vm-1"
   ```

   The response is `202` with `retainedResources`: the IDs of the disks and public IP addresses that the VM leaves behind. Keep the response. A retry with a new key cannot return the list again.

2. Wait until the VM `status` is `terminated`.
3. Delete each retained public IP address with `DELETE /v3/public-ips/<public_ip_id>`.
4. Delete each retained disk with `DELETE /v3/storages/<storage_id>`. This deletes the data on the disk.

To delete a draft that you never provisioned, use `DELETE /v3/vms/<vm_id>`. This also removes the disks and addresses that the draft created.

## VM statuses

| Status | Meaning |
|---|---|
| `draft` | Created, not provisioned, not billed |
| `new`, `launching` | Provisioning has started |
| `launched` | The platform sees the VM as running. It does not check SSH or your applications. |
| `updating`, `restarting`, `softRebooting` | A change or a reboot is in progress |
| `suspending`, `suspended` | The platform is stopping the VM, or has stopped it |
| `terminating`, `terminated` | The VM is being terminated, or has been terminated |
| `failed` | The VM failed. `failure.code` and `failure.message` say why. |
| `unknown` | The platform could not confirm that the VM is running. The status can return to `launched`. |

## Manage a VM

| Method | Path | What it does |
|---|---|---|
| `GET` | `/v3/vms` | Lists your VMs. Filters: `ids`, `name`, `statuses`, `clusterId`. |
| `PATCH` | `/v3/vms/{vm_id}` | Renames a VM. On a draft, also changes `configurationId`. |
| `POST` | `/v3/vms/{vm_id}/restart` | Restarts a VM |
| `POST` | `/v3/vms/{vm_id}/softreboot` | Reboots the guest OS |
| `POST` | `/v3/vms/{vm_id}/storages` | Attaches a ready disk, or creates a data disk on a draft |
| `DELETE` | `/v3/vms/{vm_id}/storages/{storage_id}` | Detaches a disk |
| `POST` | `/v3/vms/{vm_id}/interfaces` | Adds a network interface |
| `PATCH` | `/v3/vms/{vm_id}/interfaces/{interface_id}` | Changes the subnet or security group of an interface |
| `PUT` | `/v3/vms/{vm_id}/ssh-keys` | Replaces the SSH keys of a draft |
| `PUT`, `DELETE` | `/v3/vms/{vm_id}/cloud-init` | Sets or removes the cloud-init data of a draft |

Restart and reboot have no `Idempotency-Key`. Repeating one of them can reboot the VM again.

## Disks, networks, and public IP addresses

| Resource | Paths | Scopes |
|---|---|---|
| Disks | `/v3/storages`, `/v3/storages/{storage_id}` | `storage:read`, `storage:write` |
| VPCs | `/v3/vpcs`, `/v3/vpcs/{vpc_id}` | `vpc:read`, `vpc:write` |
| Subnets | `/v3/vpcs/{vpc_id}/subnets`, `/v3/subnets/{subnet_id}` | `subnet:read`, `subnet:write` |
| Security groups | `/v3/security-groups`, `/v3/security-groups/{security_group_id}` | `security_groups:read`, `security_groups:write` |
| Public IP addresses | `/v3/public-ips`, `/v3/public-ips/{public_ip_id}` | `public_ip:read`, `public_ip:write` |

- A disk can only grow. You cannot delete a disk that is attached to a VM.
- A security group has inbound and outbound rule lists. If you leave a list out, the group allows all traffic in that direction. An empty list denies all traffic in that direction. Before you attach a new group to an interface, read it until its `status` is `ready`.
- A public IP address that is not attached to a VM is still billed.

## Earlier API versions

The v1 catalog paths (`/v1/clusters`, `/v1/prices/...`, `/v1/storages/default_images`) and the v2 VM paths (`/v2/vms`) still work. The main differences from v3:

- `POST /v2/vms` creates and starts a VM in one request, with the status `new`. It has no drafts and no `Idempotency-Key`.
- `POST /v1/prices/cost` uses the field names `resource_id` and `volume_gb`. `POST /v3/prices/cost` uses `resourceId` and `volumeGb`.
- `GET /v1/clusters/resources` returns `availableConfigurations` and `volumeGb`. `GET /v3/clusters/resources` returns `availableConfigurationIds` and `maxVolumeGb`.
- v1 and v2 errors have the shape `{"code": "...", "error": "..."}`.

Use v3 for new code.
