---
sidebar_position: 3
---

# CPU Cloud

The CPU Cloud API lets you pick a location and a VM configuration, check prices, deploy virtual machines and manage them throughout their lifecycle.

For authentication and general request format, see the [API introduction](./overview.md). For complete request and response schemas, see the [API reference](https://api.fluence.dev/docs) or the [OpenAPI spec](https://api.fluence.dev/docs/fluence-public.yaml).

## Resources

A VM is built from separately billed resources in one **cluster** (a data center location):

- **VM configuration**: vCPU and RAM, identified by an id and a slug such as `cpu-shared-2vcpu-2gb`.
- **Boot disk**: a storage volume created from an OS image.
- **Public IP**: an IPv4 address to reach the VM from the internet.

Each resource is billed per second while it exists. Terminating a VM does not delete its boot disk or public IP; delete them separately to stop paying for them. See [billing](../cpu_cloud/overview.md#billing-model).

## Endpoints

Base URL: `https://api.fluence.dev`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/clusters` | List clusters (id and name) |
| `GET` | `/v1/clusters/resources` | Per cluster: available VM configurations, public IPs and storage |
| `GET` | `/v1/clusters/{cluster_id}/resources` | The same for one cluster |
| `GET` | `/v1/prices/vm` | Hourly VM prices per configuration and cluster |
| `GET` | `/v1/prices/storage` | Storage prices |
| `GET` | `/v1/prices/public-ip` | Public IP prices |
| `POST` | `/v1/prices/cost` | Cost of a set of resources over a period |
| `GET` | `/v1/storages/default_images` | Pre-built OS images |
| `POST` | `/v2/vms` | Create a VM |
| `GET` | `/v2/vms` | List your VMs |
| `GET` | `/v2/vms/{vm_id}` | Get a VM |
| `PATCH` | `/v2/vms/{vm_id}` | Update a VM |
| `POST` | `/v2/vms/{vm_id}/restart` | Restart a VM |
| `POST` | `/v2/vms/{vm_id}/softreboot` | Reboot the guest OS |
| `POST` | `/v2/vms/{vm_id}/terminate` | Terminate a VM |
| `DELETE` | `/v1/storages/{storage_id}` | Delete a disk |
| `DELETE` | `/v1/public_ips/{public_ip_id}` | Release a public IP |

VM operations need the `vms:read` / `vms:write` permissions. SSH keys are managed with the [SSH keys](./ssh_keys.md) endpoints.

## Deploy a VM

### 1. Choose a cluster and a configuration

`GET /v1/clusters/resources` returns, for each cluster id, `availableConfigurations` (each with `id`, `slug`, `vcpu`, `ramGb`), the number of available public IPs (`availablePublicIps.V4`) and available storage. `GET /v1/clusters` maps cluster ids to names.

### 2. Check the price

`GET /v1/prices/vm` returns `items`, each with `vmTypeId.vmConfigurationId`, `vmTypeId.clusterId` and `priceInfo.pricePerHourPerQty`. Match on your configuration and cluster. Storage and public IP prices come from `/v1/prices/storage` and `/v1/prices/public-ip`.

To get the total for a set of resources, use `POST /v1/prices/cost`. `secs` is the period in seconds:

```json
{
  "secs": 86400,
  "resources": [
    { "vm": { "resource_id": { "vmConfigurationId": "<configuration_id>", "clusterId": "<cluster_id>" } } },
    { "storage": { "resource_id": { "storageType": "NVME", "replicated": false, "clusterId": "<cluster_id>" }, "volume_gb": 25 } },
    { "publicIp": { "resource_id": { "addressType": "V4", "clusterId": "<cluster_id>" } } }
  ]
}
```

The response carries `totalCost` in USD.

### 3. Pick an OS image

`GET /v1/storages/default_images` returns `items`, each with a `downloadUrl` and the `username` to log in with. You can also use your own publicly downloadable image in one of these formats: `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, `.img.gz`.

### 4. Register an SSH key

Add your public key with `POST /v1/ssh_keys` and keep the returned `id`. See [SSH keys](./ssh_keys.md).

### 5. Create the VM

`POST /v2/vms`:

```json
{
  "name": "my-vm",
  "clusterId": "<cluster_id>",
  "configurationId": "<configuration_id>",
  "bootDisk": {
    "clusterId": "<cluster_id>",
    "name": "my-vm-boot",
    "storageType": "NVME",
    "volumeGb": 25,
    "replicated": false,
    "osImage": "<downloadUrl>"
  },
  "publicIp": {
    "clusterId": "<cluster_id>",
    "name": "my-vm-ip",
    "addressType": "V4"
  },
  "sshKeys": ["<ssh_key_id>"]
}
```

Names use lowercase letters, digits and hyphens, up to 25 characters. The response contains the VM `id`, its `status` (`new`), and the ids of the created boot disk (`bootDisk`) and public IP (`publicIp`); keep them for cleanup.

Your balance must be enough to run all your resources, including the new ones, for at least 6 hours; otherwise the request is rejected.

### 6. Wait until the VM is running

Poll `GET /v2/vms/<vm_id>?expand=publicIp` every 20–30 seconds until `status` is `launched`. This usually takes a few minutes. The address is in `expanded.publicIp.address`.

### 7. Connect

```sh
ssh <username>@<address>
```

`<username>` is the one listed for the image in step 3. Port 22 is reachable without extra setup.

## Stop paying

Terminating a VM stops billing for the VM only:

1. `POST /v2/vms/<vm_id>/terminate`. The status goes to `terminating`, then `terminated`.
2. `DELETE /v1/public_ips/<public_ip_id>` releases the address.
3. `DELETE /v1/storages/<storage_id>` deletes the boot disk and its data.

## VM statuses

| Status | Meaning |
|--------|---------|
| `new` | Accepted, waiting to be provisioned |
| `launching` | Being provisioned |
| `launched` | Running |
| `updating`, `restarting`, `softRebooting` | A change or reboot is in progress |
| `suspending`, `suspended` | The platform is stopping the VM, or has stopped it |
| `terminating`, `terminated` | Being terminated, terminated |
| `failed` | Provisioning failed |

## Error responses

Errors return a JSON body with a `code` and an `error` message:

```json
{
  "code": "unauthorized",
  "error": "No Access/Api Key token found"
}
```
