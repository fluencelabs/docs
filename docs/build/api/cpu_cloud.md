---
sidebar_position: 3
---

# CPU Cloud

The CPU Cloud API lets you search the decentralized compute marketplace, deploy virtual machine instances, and manage them throughout their lifecycle.

Before you begin, we recommend familiarizing yourself with the [CPU Cloud concepts](../cpu_cloud/overview.md) — it covers the marketplace model, instance lifecycle, and billing, which will help you make sense of the API's resources and responses.

For information on authentication and general request formatting, see the [API introduction](./overview.md). For complete request and response schemas, refer to the [API reference - OpenAPI spec](https://api.fluence.dev/docs/fluence-public.yaml), or try out the endpoints interactively in [Swagger UI](https://api.fluence.dev/).

## Endpoints

Base URL: `https://api.fluence.dev`

### Marketplace

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/marketplace/offers` | Search for available offers |
| `GET` | `/marketplace/basic_configurations` | List available basic configurations |
| `GET` | `/marketplace/countries` | List available data center countries |
| `GET` | `/marketplace/hardware` | List available hardware specifications |
| `GET` | `/v1/marketplace/datacenters` | List available data centers |

### Virtual machines

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/vms/v3` | Deploy one or more VMs |
| `GET` | `/vms/v3` | List running VMs |
| `GET` | `/vms/v3/status` | Get VM statuses and IP info |
| `PATCH` | `/vms/v3` | Update VM name and ports |
| `DELETE` | `/vms/v3` | Delete one or more VMs |
| `GET` | `/vms/v3/default_images` | List default OS images |
| `POST` | `/vms/v3/estimate` | Estimate deployment cost |

## Browse the marketplace

`POST /marketplace/offers` accepts optional filters in the request body. All filters are optional — send an empty `{}` to get all available offers.

Available filters: basic configuration, hardware specs (CPU, memory, storage), data center country, and maximum price per epoch.

### Basic configurations

The API uses predefined configuration slugs that follow the pattern `cpu-{cores}-ram-{memory}gb-storage-{size}gb` (e.g., `cpu-4-ram-8gb-storage-25gb`). Each represents a fixed package of vCPU, RAM, and base storage. You can request additional storage on top.

### Discovery endpoints

Use these to list valid filter values:

- `GET /marketplace/basic_configurations` — available configuration slugs
- `GET /marketplace/countries` — ISO country codes with active offers
- `GET /marketplace/hardware` — available CPU architectures, memory types, storage types

:::info
`additionalResources` (extra storage beyond the basic configuration) can only be used together with the `hardware.storage` filter.
:::

:::tip
You can skip marketplace exploration entirely and just submit a deploy request with your constraints — the system will automatically match you with the best available offer.
:::

### Estimate cost

`POST /vms/v3/estimate` accepts the same constraints as the deploy endpoint plus an `instances` count, and returns the expected deposit amount and per-epoch pricing without committing to a deployment.

## Deploy VMs

`POST /vms/v3` deploys one or more VMs. The request has three parts:

- **constraints** (optional) — same filters as marketplace search. If omitted or partially specified, the system auto-selects (smallest configuration, cheapest price).
- **instances** — number of VMs to deploy with this configuration.
- **vmConfiguration** — name, open ports, hostname, OS image URL, and SSH keys.

Things to know:

- **OS image**: provide a download URL. Use `GET /vms/v3/default_images` for pre-built options, or supply your own (must be publicly downloadable; supported formats: `.qcow2`, `.img`, `.raw`, `.raw.xz`, `.raw.gz`, `.img.xz`, `.img.gz`).
- **Ports**: only port 22 (TCP) is open by default. You must explicitly specify any additional ports. Port 10250 is reserved.
- **SSH keys**: at least one key is required. You can provide a raw public key string or reference an existing key by name from your [SSH keys](./ssh_keys.md).

### After deployment

VMs start with in `New` and `Launching` status. Once provisioned (typically a few minutes), the status changes to `Active` and a public IP is assigned. Use `GET /vms/v3` or `GET /vms/v3/status` to check. Read more about instance statuses and transitions in [CPU Cloud concepts](../cpu_cloud/overview.md).

## Manage VMs

### Update name and ports

`PATCH /vms/v3` accepts an array of updates, each targeting a VM by ID. You can change the name and/or open ports.

:::warning
When updating `openPorts`, you must include **all** ports that should remain open. Any ports omitted from the update will be closed. This can lock you out if you forget to include port 22.
:::

### Delete VMs

`DELETE /vms/v3` accepts an array of VM IDs to delete in a single request.

## Error responses

All CPU Cloud API errors return a JSON body with an `error` string:

```json
{
  "error": "No suitable offer found"
}
```
