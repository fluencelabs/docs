---
sidebar_position: 3
---

# CPU Cloud

The CPU Cloud API lets you search the decentralized compute marketplace, deploy virtual machine instances, and manage them throughout their lifecycle.

Before you begin, we recommend familiarizing yourself with the [CPU Cloud concepts](../cpu_cloud/overview.md) — it covers the marketplace model, instance lifecycle, and billing, which will help you make sense of the API's resources and responses.

For information on authentication and general request formatting, see the [API introduction](./overview.md). For complete request and response schemas, refer to the [API reference - OpenAPI spec](https://api.fluence.dev/docs/fluence-public.yaml), or try out the endpoints interactively in [Swagger UI](https://api.fluence.dev/).

## Endpoints

Base URL: `https://api.fluence.dev`

### Compute 

| Method | Path                                  | Description                                              |
|--------|---------------------------------------|----------------------------------------------------------| 
| `GET`  | `/v1/datacenters`                     | List available datacenters                               |
| `GET`  | `/v1/clusters`                        | List available clusters                                  | 
| `GET`  | `/v1/clusters/{cluster_id}/resources` | List available resources and configurations in a cluster |

### Virtual machines

| Method  | Path                        | Description              |
|---------|-----------------------------|--------------------------|
| `POST`  | `/v2/vms`                   | Deploy a VM              |
| `GET`   | `/v2/vms `                  | List  VMs                | 
| `PATCH` | `/v2/vms`                   | Update VM name           |
| `POST`  | `/v2/vms/{vm_id}/terminate` | Terminate VM             |
| `GET`   | `/v1/default_images`        | List default OS images   |
| `POST`  | `/v1/prices/cost`           | Estimate deployment cost |

### Basic configurations

The API uses predefined VM configuration slugs that follow the pattern `{configuration-family}-{vcpu_num}-{memory_gb}` (e.g., `cpu-regular-2vcpu-4gb`). Each represents a fixed package of vCPU and RAM. Storages and Public IPs are added on top of the basic configuration. 

### Discovery endpoints

Use these to find out entities IDs required for deployment and management, as well as available configuration options:

- `GET /v1/datacenters` — available data center locations
- `GET /v1/clusters` — available clusters (groupings of hardware resources within data centers)
- `GET /v1/clusters/{cluster_id}/resources` — available resources and configurations within a cluster


### Estimate cost

`POST /v1/prices/cost` estimates the cost of a deployment based on the specified configuration. The request body includes the cluster_id, vm configuration slug, storage type and public ips. The response returns the estimated total cost in USD.

## Deploy VMs

`POST /2/vms` deploys VMs. The request contain target cluster ID, VM configuration ID, name, SSH keys and optional parameters for storages (boot and data disks) public IPs. Existing entities are referenced by their IDs, while new ones are created on the fly based on the provided parameters. For example, you can specify a new storage by providing its type and size, or reference an existing one by ID.

Things to know:
 
- **SSH keys**: at least one key is required. You can provide a raw public key string or reference an existing key by name from your [SSH keys](./ssh_keys.md).

### After deployment

VMs start with in `New` and `Launching` status. Once provisioned (typically a few minutes), the status changes to `Launched`. Use `GET /v1/vms` with optional filter by vm ids to check. Read more about instance statuses and transitions in [CPU Cloud concepts](../cpu_cloud/overview.md).

## Manage VMs

### Update name 

`PATCH /v1/vms`provides a way to update the name of an active VM.

### Delete VMs

`POST /v2/vms/{vm_id}/terminate` terminates a VM. The instance is deprovisioned and removed from your account. 