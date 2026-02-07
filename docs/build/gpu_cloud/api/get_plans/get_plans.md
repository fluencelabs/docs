---
sidebar_position: 2
---

# Browse available GPU plans

The Fluence GPU compute marketplace offers pre-configured GPU plans that you can browse and rent. Each plan is a fixed package of GPU hardware, vCPU, memory, and storage available from a specific provider at a set hourly price. Plans are organized by workload type: containers, VMs, and bare metal.

In this document, you'll learn:

1. How GPU plans are organized by workload type
2. How to retrieve available container plans
3. How to retrieve available VM and bare metal plans
4. How to interpret plan details and pricing

## Overview

A **plan** represents a ready-to-deploy GPU configuration. Each plan includes a GPU model, a set of allocated resources (vCPU, RAM, storage), and an hourly price in USDC. Plans are pre-defined by providers — you select one that fits your requirements and deploy an instance from it.

The API provides three endpoints, one for each workload type:

| Endpoint | Workload type | Method |
|----------|---------------|--------|
| `/gpu/plans/` | Containers | `GET` |
| `/gpu/plans/vms` | VMs | `GET` |
| `/gpu/plans/baremetal` | Bare metal | `GET` |

All endpoints are simple `GET` requests with no request body or query parameters. They return the currently available plans with pricing and location data.

:::info
All endpoints require the `X-API-KEY` header for authentication. See the [API introduction](../overview.md) for details on authentication and request format.
:::

### Pricing model

All GPU plans use hourly billing in USDC. Each plan includes an `upfront_hours` value (currently 3) — this is the number of hours charged from your balance when you deploy an instance. For more details on how billing works, see the [billing model](../../instance_rent/instance_rent.md#billing-model) section.

## Container plans

Container plans are fixed configurations for deploying containerized GPU workloads. Each plan bundles a specific GPU model with allocated vCPU, memory, and storage resources.

### Endpoint

To retrieve all available container plans, send a `GET` request:

```sh
GET https://api.fluence.dev/gpu/plans/
```

**Example request:**

```sh
curl -X GET https://api.fluence.dev/gpu/plans/ \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

### Response structure

The response is a JSON array of plan objects. Each object contains the plan details and its availability attributes.

**General structure:**

```json
[
  {
    "plan": {
      "id": string,
      "name": string,
      "supply": {
        "vcpu": { "count": number },
        "memory": { "count": number, "units": string },
        "storage": { "count": number, "units": string },
        "gpu_count": number
      },
      "gpu_model": {
        "vendor": string,
        "model": string,
        "vram": string,
        "interface": string
      },
      "pricing": {
        "hour": number,
        "upfront_hours": number,
        "currency": string
      }
    },
    "attributes": {
      "location": [string]
    }
  }
  // More plans...
]
```

### Response fields

#### Plan

The `plan` object contains the configuration details and pricing for the plan.

- **`id`** (string): Unique identifier for the plan. Use this ID when creating an instance from this plan.
- **`name`** (string): Human-readable plan slug that encodes the key specs. Follows the pattern `{gpu}-{vram}-{interface}-{gpu_count}gpu-{vcpu}cpu-{ram}gb-{storage}gb` (e.g., `h200-141gi-sxm-1gpu-16cpu-128gb-120gb`).
- **`supply`**: Resources allocated to instances created from this plan:
  - `vcpu.count` (integer): Number of virtual CPU cores
  - `memory.count` (integer): Amount of system memory
  - `memory.units` (string): Memory unit (e.g., `"Gi"` for gibibytes)
  - `storage.count` (integer): Amount of disk storage
  - `storage.units` (string): Storage unit (e.g., `"Gi"` for gibibytes)
  - `gpu_count` (integer): Number of GPUs allocated
- **`gpu_model`**: GPU hardware details:
  - `vendor` (string): GPU manufacturer (e.g., `"nvidia"`)
  - `model` (string): GPU model name (e.g., `"h200"`, `"a100"`)
  - `vram` (string): GPU memory amount (e.g., `"141Gi"`, `"80Gi"`)
  - `interface` (string): GPU connection type — `"SXM"` or `"PCIE"`. SXM offers higher memory bandwidth, typically used for multi-GPU training workloads.
- **`pricing`**: Cost information:
  - `hour` (number): Hourly price in the specified currency
  - `upfront_hours` (integer): Number of hours charged upfront when deploying
  - `currency` (string): Payment currency (e.g., `"USDC"`)

#### Attributes

The `attributes` object provides additional metadata about where the plan is available.

- **`location`** (array of strings): Regions where this plan can be deployed (e.g., `["US"]`).

### Example response

```json
[
  {
    "plan": {
      "id": "36cdb646-1246-42d8-b2d1-9480ca546536",
      "name": "h200-141gi-sxm-1gpu-16cpu-128gb-120gb",
      "supply": {
        "vcpu": { "count": 16 },
        "memory": { "count": 128, "units": "Gi" },
        "storage": { "count": 120, "units": "Gi" },
        "gpu_count": 1
      },
      "gpu_model": {
        "vendor": "nvidia",
        "model": "h200",
        "vram": "141Gi",
        "interface": "SXM"
      },
      "pricing": {
        "hour": 2.96,
        "upfront_hours": 3,
        "currency": "USDC"
      }
    },
    "attributes": {
      "location": ["US"]
    }
  },
  {
    "plan": {
      "id": "472ea881-73d9-423a-8e61-19addd34424c",
      "name": "a100-80gi-sxm-1gpu-1cpu-1gb-1gb",
      "supply": {
        "vcpu": { "count": 1 },
        "memory": { "count": 1, "units": "Gi" },
        "storage": { "count": 1, "units": "Gi" },
        "gpu_count": 1
      },
      "gpu_model": {
        "vendor": "nvidia",
        "model": "a100",
        "vram": "80Gi",
        "interface": "SXM"
      },
      "pricing": {
        "hour": 1.22,
        "upfront_hours": 3,
        "currency": "USDC"
      }
    },
    "attributes": {
      "location": ["US"]
    }
  }
  // More plans...
]
```

## VM and Bare Metal plans

VM and bare metal plans provide full OS-level access with GPU passthrough. VMs run on a hypervisor, while bare metal gives you a dedicated physical server. Both workload types share the same API response structure — they use separate endpoints but return data in the same format.

:::info
`/gpu/plans/vms` and `/gpu/plans/baremetal` return identical response structures. The only difference is the `deployment_type` field value in each configuration option (`"VM"` vs `"BAREMETAL"`).
:::

### Endpoints

To retrieve available VM plans:

```sh
GET https://api.fluence.dev/gpu/plans/vms
```

To retrieve available bare metal plans:

```sh
GET https://api.fluence.dev/gpu/plans/baremetal
```

**Example request:**

```sh
curl -X GET https://api.fluence.dev/gpu/plans/vms \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

### Response structure

The response is a JSON object with a `data` array. Plans are grouped by GPU model, and within each group, availability is organized by GPU count. Each GPU count level contains individual configuration options from specific providers and locations.

**General structure:**

```json
{
  "data": [
    {
      "gpu_model": {
        "vendor": string,
        "model": string,
        "vram": string,
        "interface": string
      },
      "minimum_price": number,
      "availability_by_number": [
        {
          "gpu_count": number,
          "minimum_price": number,
          "options_available_total": number,
          "providers_available_total": number,
          "data_center_available_total": number,
          "locations": [string],
          "providers": [string],
          "options": [
            {
              "id": string,
              "location": string,
              "provider": string,
              "vcpu": { "count": number },
              "memory": { "count": number, "units": string },
              "storage": { "count": number, "units": string },
              "deployment_type": string,
              "pricing": {
                "hour": number,
                "upfront_hours": number,
                "currency": string
              },
              "nvlink": boolean,
              "os_options": [string]
            }
            // More options...
          ]
        }
        // More GPU count levels...
      ]
    }
    // More GPU model groups...
  ]
}
```

### Response fields

#### GPU model group

Each element in the `data` array represents a distinct GPU model available on the marketplace.

- **`gpu_model`**: GPU hardware details:
  - `vendor` (string): GPU manufacturer (e.g., `"nvidia"`)
  - `model` (string): GPU model name (e.g., `"a100"`, `"a10"`)
  - `vram` (string): GPU memory amount (e.g., `"80Gi"`)
  - `interface` (string): GPU connection type — `"pcie"` or `"sxm"`
- **`minimum_price`** (number): Lowest hourly price in USDC across all configurations for this GPU model.
- **`availability_by_number`** (array): Availability grouped by the number of GPUs per instance.

#### Availability by GPU count

Each element in the `availability_by_number` array groups all configuration options that offer a specific number of GPUs.

- **`gpu_count`** (integer): Number of GPUs in this group (e.g., 1, 2, 4, 8).
- **`minimum_price`** (number): Lowest hourly price among all options at this GPU count.
- **`options_available_total`** (integer): Total number of configuration options available.
- **`providers_available_total`** (integer): Number of distinct providers offering this configuration.
- **`data_center_available_total`** (integer): Number of data centers where this configuration is available.
- **`locations`** (array of strings): List of data center locations (e.g., `["dulles-usa-1", "sanjose-usa-2"]`).
- **`providers`** (array of strings): List of provider names (e.g., `["sesterce", "massed-compute"]`).
- **`options`** (array): Individual configuration options you can deploy.

#### Configuration option

Each element in the `options` array represents a specific deployable configuration from a provider at a location.

- **`id`** (string): Unique configuration identifier. Use this ID when creating an instance.
- **`location`** (string): Data center location identifier (e.g., `"us-central-3"`).
- **`provider`** (string): Compute provider name (e.g., `"massed-compute"`).
- **`vcpu`**: Virtual CPU allocation:
  - `count` (integer): Number of vCPU cores
- **`memory`**: System memory allocation:
  - `count` (integer): Amount of memory
  - `units` (string): Memory unit (e.g., `"Gi"`)
- **`storage`**: Disk storage allocation:
  - `count` (integer): Amount of storage
  - `units` (string): Storage unit (e.g., `"Gi"`)
- **`deployment_type`** (string): Workload type — `"VM"` or `"BAREMETAL"`.
- **`pricing`**: Cost information:
  - `hour` (number): Hourly price in the specified currency
  - `upfront_hours` (integer): Number of hours charged upfront when deploying
  - `currency` (string): Payment currency (e.g., `"USDC"`)
- **`nvlink`** (boolean): Whether NVLink GPU interconnect is available. NVLink provides high-bandwidth direct communication between GPUs, beneficial for multi-GPU training workloads.
- **`os_options`** (array of strings): Available OS images for this configuration (e.g., `["ubuntu22.04_cuda12.4_shade_os"]`).

### Example response

```json
{
  "data": [
    {
      "gpu_model": {
        "vendor": "nvidia",
        "model": "a10",
        "vram": "24Gi",
        "interface": "pcie"
      },
      "minimum_price": 0.99,
      "availability_by_number": [
        {
          "gpu_count": 1,
          "minimum_price": 0.99,
          "options_available_total": 2,
          "providers_available_total": 1,
          "data_center_available_total": 2,
          "locations": [
            "dulles-usa-1",
            "sanjose-usa-2"
          ],
          "providers": [
            "sesterce"
          ],
          "options": [
            {
              "id": "3f6cd2d1-19ac-49fb-95a5-9088bb2dcb49",
              "location": "sanjose-usa-2",
              "provider": "sesterce",
              "vcpu": { "count": 30 },
              "memory": { "count": 186, "units": "Gi" },
              "storage": { "count": 1303, "units": "Gi" },
              "deployment_type": "VM",
              "pricing": {
                "hour": 0.99,
                "upfront_hours": 3,
                "currency": "USDC"
              },
              "nvlink": false,
              "os_options": [
                "ubuntu22.04_cuda12.4_shade_os"
              ]
            },
            {
              "id": "0e311c31-1e31-4fc7-b27d-4b73f3f27bc2",
              "location": "dulles-usa-1",
              "provider": "sesterce",
              "vcpu": { "count": 30 },
              "memory": { "count": 186, "units": "Gi" },
              "storage": { "count": 1303, "units": "Gi" },
              "deployment_type": "VM",
              "pricing": {
                "hour": 0.99,
                "upfront_hours": 3,
                "currency": "USDC"
              },
              "nvlink": false,
              "os_options": [
                "ubuntu22.04_cuda12.4_shade_os"
              ]
            }
          ]
        }
      ]
    },
    {
      "gpu_model": {
        "vendor": "nvidia",
        "model": "a100",
        "vram": "80Gi",
        "interface": "pcie"
      },
      "minimum_price": 1.07,
      "availability_by_number": [
        {
          "gpu_count": 1,
          "minimum_price": 1.07,
          "options_available_total": 8,
          "providers_available_total": 2,
          "data_center_available_total": 7,
          "locations": [
            "culpeper-usa-1",
            "kristiansand-norway-2",
            "newyork-usa-1",
            "tokyo-japan-2",
            "us-central-2",
            "us-central-3",
            "us-east-1"
          ],
          "providers": [
            "massed-compute",
            "sesterce"
          ],
          "options": [
            {
              "id": "d8312018-c50c-4278-89db-69e40013414d",
              "location": "us-central-3",
              "provider": "massed-compute",
              "vcpu": { "count": 14 },
              "memory": { "count": 93, "units": "Gi" },
              "storage": { "count": 582, "units": "Gi" },
              "deployment_type": "VM",
              "pricing": {
                "hour": 1.07,
                "upfront_hours": 3,
                "currency": "USDC"
              },
              "nvlink": false,
              "os_options": [
                "Ubuntu Server 22.04"
              ]
            }
            // More options...
          ]
        }
      ]
    }
    // More GPU model groups...
  ]
}
```

## Next steps

Now that you know how to browse and compare available GPU plans, proceed to the [Deploy GPU instances](../deploy_instance/deploy_instance.md) guide to learn how to create instances from these plans.
