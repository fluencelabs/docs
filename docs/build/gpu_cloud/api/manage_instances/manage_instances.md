---
sidebar_position: 4
---

# Manage GPU instances

After [deploying GPU instances](../deploy_instance/deploy_instance.md), you can monitor their status, retrieve connection details, update running deployments, and terminate instances when they are no longer needed.

In this guide, you'll learn how to:

1. List your GPU instances and check their status
2. Retrieve instance details and connection information
3. Update a running container deployment
4. Retrieve container logs and cluster events
5. Rename a VM or bare metal instance
6. Terminate instances

## Instance statuses

All GPU instances go through the same lifecycle statuses:

| Status | Description |
|--------|-------------|
| `INITIALIZED` | The instance is being provisioned |
| `ACTIVE` | The instance is running and operational |
| `FAILED` | The instance failed to provision |
| `ENDED` | The instance was terminated by the user or the system |

:::info
Only instances with `ACTIVE` status can be terminated. Instances that have already ended or failed cannot be deleted.
:::

Container instances have an additional `container_status` field that indicates whether the container process itself is running:

| Container status | Description |
|------------------|-------------|
| `NOT_STARTED` | The container is not yet running — it may still be starting up, or it failed to start |
| `STARTED` | The container is running |

:::tip
Check `container_status` to distinguish between an instance that is active at the infrastructure level (`instance_status: ACTIVE`) but whose container hasn't started yet. This is useful for diagnosing startup issues.
:::

## GPU container

### List instances

To retrieve all your container instances, send a `GET` request:

```sh
GET https://api.fluence.dev/gpu/instances/
```

**Example request:**

```sh
curl -X GET https://api.fluence.dev/gpu/instances/ \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

#### Response structure

The response is a JSON array of container instance objects:

```json
[
  {
    "id": string,
    "name": string,
    "instance_status": string,
    "resources": {
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
      }
    },
    "domain": string | null,
    "location": string,
    "created_at": string,
    "updated_at": string
  }
]
```

#### Response fields

- **`id`** (string): Unique instance identifier.
- **`name`** (string): The instance name.
- **`instance_status`** (string): Current [instance status](#instance-statuses) — `INITIALIZED`, `ACTIVE`, `FAILED`, or `ENDED`.
- **`resources`**: Hardware allocated to the instance:
  - `supply.vcpu.count` (integer): Number of virtual CPU cores
  - `supply.memory.count` / `supply.memory.units`: System memory amount and unit (e.g., `1` / `"Gi"`)
  - `supply.storage.count` / `supply.storage.units`: Disk storage amount and unit
  - `supply.gpu_count` (integer): Number of GPUs
- **`resources.gpu_model`**: GPU hardware details:
  - `vendor` (string): GPU manufacturer (e.g., `"nvidia"`)
  - `model` (string): GPU model name (e.g., `"a100"`)
  - `vram` (string): GPU memory (e.g., `"80Gi"`)
  - `interface` (string): Connection type — `"sxm"` or `"pcie"`
- **`domain`** (string or null): The domain name or IP address assigned to the instance. May be `null` for active instances while the provider is setting up networking, and always `null` for non-active instances.
- **`location`** (string): Data center location.
- **`created_at`** (string): Instance creation timestamp (ISO 8601).
- **`updated_at`** (string): Last update timestamp (ISO 8601).

#### Example response

```json
[
  {
    "id": "b54672e2-0a8b-490f-81ee-7d5a868471fc",
    "name": "fuchsia-hawk-4706",
    "instance_status": "ACTIVE",
    "resources": {
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
        "interface": "sxm"
      }
    },
    "domain": "provider.a100.kci.val.akash.pub",
    "location": "US",
    "created_at": "2026-02-07T14:42:29.472381Z",
    "updated_at": "2026-02-07T14:43:41.901135Z"
  },
  {
    "id": "9933463e-4b49-4a56-867d-e66d4200e649",
    "name": "white-chimpanzee-8445",
    "instance_status": "ENDED",
    "resources": {
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
        "interface": "sxm"
      }
    },
    "domain": null,
    "location": "US",
    "created_at": "2026-02-05T13:13:08.778635Z",
    "updated_at": "2026-02-06T05:42:03.280836Z"
  }
]
```

### Get instance details

To retrieve detailed information about a specific container instance:

```sh
GET https://api.fluence.dev/gpu/instances/{instance_id}
```

**Example request:**

```sh
curl -X GET https://api.fluence.dev/gpu/instances/b54672e2-0a8b-490f-81ee-7d5a868471fc \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

#### Response structure

```json
{
  "id": string,
  "name": string,
  "instance_status": string,
  "container_status": string,
  "resources": {
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
    }
  },
  "location": string,
  "container_info": {
    "image": string,
    "expose": [
      { "port": string, "protocol": string }
    ],
    "environment": [
      { "name": string, "value": string }
    ],
    "startup_command": string | null
  },
  "billing": {
    "hourly_usage": number,
    "total_spendings": number,
    "reserved_amount": number,
    "next_billing_period": string | null
  },
  "network": {
    "domain": string | null,
    "forwarded_ports": [
      { "port": string, "external_port": string, "protocol": string }
    ],
    "uri": string | null
  } | null,
  "created_at": string,
  "updated_at": string
}
```

#### Response fields

The detail response includes all fields from the [list response](#response-fields), plus the following:

- **`container_status`** (string): Whether the container process is running — `STARTED` or `NOT_STARTED`. See [container statuses](#instance-statuses) above.

##### Container info

The `container_info` object contains the current container configuration:

- **`image`** (string): Container image running on the instance.
- **`expose`** (array): Ports exposed on the container. Each entry has:
  - `port` (string): The port number
  - `protocol` (string): The protocol (`"tcp"`, `"udp"`, or `"http"`)
- **`environment`** (array): Environment variables set in the container. Each entry has:
  - `name` (string): Variable name
  - `value` (string): Variable value
- **`startup_command`** (string or null): The startup command, if one was specified during deployment.

##### Network

The `network` object contains connectivity details. It is `null` when the instance is not active.

- **`domain`** (string or null): The domain name or IP address assigned to the container. May briefly be `null` on an active instance until the provider assigns networking.
- **`forwarded_ports`** (array): Port mappings from your container ports to externally accessible ports. Each entry has:
  - `port` (string): Your container port
  - `external_port` (string): The externally accessible port assigned by the cluster
  - `protocol` (string): The protocol

  Use the domain together with the external port to connect (e.g., `ssh -p 32345 root@provider.a100.kci.val.akash.pub`).

- **`uri`** (string or null): The HTTP address for the container, available when port 80 was exposed with the `"http"` protocol during deployment.

##### Billing

The `billing` object contains current billing information:

- **`hourly_usage`** (number): Hourly cost in USDC.
- **`total_spendings`** (number): Total amount spent on this instance since creation, in USDC.
- **`reserved_amount`** (number): Amount currently reserved on the instance balance, in USDC. See the [billing model](../../instance_rent/instance_rent.md#billing-model) for details on how the reserve works.
- **`next_billing_period`** (string or null): Timestamp of the next billing period start (ISO 8601). `null` when the instance is not active.

#### Example: active instance

```json
{
  "id": "b54672e2-0a8b-490f-81ee-7d5a868471fc",
  "name": "fuchsia-hawk-4706",
  "instance_status": "ACTIVE",
  "container_status": "STARTED",
  "resources": {
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
      "interface": "sxm"
    }
  },
  "location": "US",
  "container_info": {
    "image": "docker.io/fluencelabs/debian-ssh-root:11",
    "expose": [
      { "port": "22", "protocol": "tcp" }
    ],
    "environment": [
      { "name": "SSH_PUBKEY", "value": "ssh-ed25519 AAAAC3..." }
    ],
    "startup_command": null
  },
  "billing": {
    "hourly_usage": 1.22,
    "total_spendings": 1.22,
    "reserved_amount": 2.44,
    "next_billing_period": "2026-02-07T15:00:00Z"
  },
  "network": {
    "domain": "provider.a100.kci.val.akash.pub",
    "forwarded_ports": [
      { "port": "22", "external_port": "32345", "protocol": "tcp" }
    ],
    "uri": null
  },
  "created_at": "2026-02-07T14:42:29.472381Z",
  "updated_at": "2026-02-07T14:43:41.901135Z"
}
```

#### Example: ended instance

When an instance is no longer active, `network` is `null`, `billing.next_billing_period` is `null`, and `reserved_amount` is `0`:

```json
{
  "id": "4fe394f8-215c-42c3-8cef-f5f0381f7d9c",
  "name": "coral-fowl-8570",
  "instance_status": "ENDED",
  "container_status": "NOT_STARTED",
  "resources": {
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
      "interface": "sxm"
    }
  },
  "location": "US",
  "container_info": {
    "image": "docker.io/fluencelabs/debian-ssh-root:11",
    "expose": [
      { "port": "22", "protocol": "tcp" }
    ],
    "environment": [
      { "name": "SSH_PUBKEY", "value": "ssh-ed25519 AAAAC3..." }
    ],
    "startup_command": null
  },
  "billing": {
    "hourly_usage": 0,
    "total_spendings": 26.8,
    "reserved_amount": 0,
    "next_billing_period": null
  },
  "network": null,
  "created_at": "2026-02-05T08:31:28.676135Z",
  "updated_at": "2026-02-06T05:42:00.193483Z"
}
```

### Update a container deployment

You can update a running container's configuration by sending a `PUT` request with the full updated deployment description:

```sh
PUT https://api.fluence.dev/gpu/instances/{instance_id}
```

This is a full replacement — you must include all fields that define the deployment, not just the ones you want to change.

**Example request:**

```sh
curl -X PUT https://api.fluence.dev/gpu/instances/b54672e2-0a8b-490f-81ee-7d5a868471fc \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: <YOUR_API_KEY>" \
  -d '{
    "name": "my-updated-container",
    "container_settings": {
      "image": "docker.io/fluencelabs/debian-ssh-root:11",
      "environment": [
        { "name": "MODEL_PATH", "value": "/models/llama-v2" }
      ],
      "startup_command": "python3 serve.py --port 8000"
    },
    "ssh_key": "ssh-ed25519 AAAAC3... user@host"
  }'
```

#### Request body

```json
{
  "name": string,
  "container_settings": {
    "image": string,
    "credentials": {
      "host": string,
      "username": string,
      "password": string
    },
    "environment": [
      { "name": string, "value": string }
    ],
    "startup_command": string
  },
  "ssh_key": string
}
```

The request fields and validation rules are the same as the [container deployment request](../deploy_instance/deploy_instance.md#container_settings).

:::warning
Exposed ports cannot be changed after deployment. The port configuration from the original deployment remains in effect regardless of what you specify in the update.
:::

:::info
A new update cannot be submitted while a previous update is still being applied. The instance details will reflect the updated configuration once the update completes.
:::

A successful update returns a **204** status code with no response body.

### Get container logs

To retrieve the stdout/stderr output from a running container:

```sh
GET https://api.fluence.dev/gpu/instances/{instance_id}/logs
```

**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `last` | integer | No | Return only the last N lines. If omitted, all available logs are returned. |

**Example request:**

```sh
curl -X GET "https://api.fluence.dev/gpu/instances/b54672e2-0a8b-490f-81ee-7d5a868471fc/logs?last=50" \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

**Example response:**

```json
[
  "[service-1-b4fcd99f7-f5xr5] Server listening on 0.0.0.0 port 22.",
  "[service-1-b4fcd99f7-f5xr5] Server listening on :: port 22."
]
```

The response is a JSON array of strings, where each string is a log line.

### Get container events

To retrieve cluster-level lifecycle events for a container instance:

```sh
GET https://api.fluence.dev/gpu/instances/{instance_id}/events
```

Events track the instance lifecycle at the infrastructure level — scheduling, image pulling, container creation, and startup. They are useful for diagnosing issues when a container fails to start.

**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `last` | integer | No | Return only the last N events. If omitted, all available events are returned. |

**Example request:**

```sh
curl -X GET "https://api.fluence.dev/gpu/instances/b54672e2-0a8b-490f-81ee-7d5a868471fc/events?last=10" \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

**Example response:**

```json
[
  "[service-1-b4fcd99f7-f5xr5]: [Normal] [Scheduled] Successfully assigned pod to node2",
  "[service-1-b4fcd99f7-f5xr5]: [Normal] [Pulled] Container image \"docker.io/fluencelabs/debian-ssh-root:11\" already present on machine",
  "[service-1-b4fcd99f7-f5xr5]: [Normal] [Created] Created container: service-1",
  "[service-1-b4fcd99f7-f5xr5]: [Normal] [Started] Started container service-1"
]
```

The response is a JSON array of strings, where each string is an event message.

### Terminate a container

To terminate a running container instance:

```sh
DELETE https://api.fluence.dev/gpu/instances/{instance_id}
```

**Example request:**

```sh
curl -X DELETE https://api.fluence.dev/gpu/instances/b54672e2-0a8b-490f-81ee-7d5a868471fc \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

A successful termination returns a **204** status code with no response body.

:::info
Only instances with `ACTIVE` status can be terminated. Any unused funds on the instance balance are returned to your account. See the [billing model](../../instance_rent/instance_rent.md#billing-model) for details.
:::

## VM and Bare Metal

VM and bare metal instances provide full OS-level access with GPU passthrough. Both use identical API endpoints and response structures — only the URL path differs.

:::info
All examples below use the `/gpu/instances/vms` path. For bare metal instances, replace `/vms` with `/baremetal` in each endpoint URL.
:::

### List instances

To retrieve all your VM or bare metal instances:

```sh
GET https://api.fluence.dev/gpu/instances/vms
```

```sh
GET https://api.fluence.dev/gpu/instances/baremetal
```

**Example request:**

```sh
curl -X GET https://api.fluence.dev/gpu/instances/vms \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

#### Response structure

The response is a JSON array of instance objects:

```json
[
  {
    "id": string,
    "name": string,
    "status": string,
    "resources": {
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
      }
    },
    "domain": string | null,
    "location": string,
    "created_at": string,
    "updated_at": string
  }
]
```

#### Response fields

- **`id`** (string): Unique instance identifier.
- **`name`** (string): The instance name.
- **`status`** (string): Current [instance status](#instance-statuses) — `INITIALIZED`, `ACTIVE`, `FAILED`, or `ENDED`.
- **`resources`**: Hardware allocated to the instance. Same structure as [container instances](#response-fields).
- **`domain`** (string or null): The IP address or domain assigned to the instance. `null` while the provider is setting up networking or when the instance is not active.
- **`location`** (string): Data center location.
- **`created_at`** (string): Instance creation timestamp (ISO 8601).
- **`updated_at`** (string): Last update timestamp (ISO 8601).

#### Example response

```json
[
  {
    "id": "05cdd5fc-d384-4fbc-8861-5e3e2a66397c",
    "name": "azure-booby-3323",
    "status": "ACTIVE",
    "resources": {
      "supply": {
        "vcpu": { "count": 14 },
        "memory": { "count": 119, "units": "Gi" },
        "storage": { "count": 582, "units": "Gi" },
        "gpu_count": 1
      },
      "gpu_model": {
        "vendor": "nvidia",
        "model": "l40",
        "vram": "48Gi",
        "interface": "pcie"
      }
    },
    "domain": "216.81.248.90",
    "location": "us-central-3",
    "created_at": "2026-02-07T14:43:43.993091Z",
    "updated_at": "2026-02-07T14:45:42.054932Z"
  },
  {
    "id": "74c722a1-645c-4799-ad2b-731e8f45def8",
    "name": "crimson-chinchilla-3483",
    "status": "FAILED",
    "resources": {
      "supply": {
        "vcpu": { "count": 8 },
        "memory": { "count": 22, "units": "Gi" },
        "storage": { "count": 465, "units": "Gi" },
        "gpu_count": 1
      },
      "gpu_model": {
        "vendor": "nvidia",
        "model": "v100",
        "vram": "32Gi",
        "interface": "sxm"
      }
    },
    "domain": null,
    "location": "Texas",
    "created_at": "2026-02-07T14:42:40.089261Z",
    "updated_at": "2026-02-07T14:43:13.543334Z"
  }
]
```

### Get instance details

To retrieve full details for a specific VM or bare metal instance:

```sh
GET https://api.fluence.dev/gpu/instances/vms/{instance_id}
```

```sh
GET https://api.fluence.dev/gpu/instances/baremetal/{instance_id}
```

**Example request:**

```sh
curl -X GET https://api.fluence.dev/gpu/instances/vms/05cdd5fc-d384-4fbc-8861-5e3e2a66397c \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

#### Response structure

```json
{
  "id": string,
  "name": string,
  "status": string,
  "availability": string,
  "resources": {
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
    }
  },
  "location": string,
  "os_image": string,
  "ssh_connection": string | null,
  "billing": {
    "hourly_usage": number,
    "total_spendings": number,
    "reserved_amount": number,
    "next_billing_period": string | null
  },
  "network": {
    "domain": string | null,
    "forwarded_ports": [],
    "uri": string | null
  } | null,
  "ssh_key": string,
  "created_at": string,
  "updated_at": string
}
```

#### Response fields

The detail response includes all fields from the [list response](#response-fields-1), plus:

- **`availability`** (string): The deployment type — `"vm"` or `"baremetal"`.
- **`os_image`** (string): The operating system image installed on the instance.
- **`ssh_connection`** (string or null): A ready-to-use SSH command (e.g., `"ssh ubuntu@216.81.248.90"`). `null` when the instance is not active.
- **`ssh_key`** (string): The public SSH key associated with the instance.

##### Network

The `network` object contains connectivity details. It is `null` when the instance is not active.

- **`domain`** (string or null): The IP address or domain assigned to the instance.
- **`forwarded_ports`** (array): Port forwarding entries (typically empty for VMs and bare metal, which use direct IP access).
- **`uri`** (string or null): HTTP address, if applicable.

##### Billing

Same structure as [container billing](#billing). See the [billing model](../../instance_rent/instance_rent.md#billing-model) for details on hourly charges and reserves.

#### Example: active instance

```json
{
  "id": "05cdd5fc-d384-4fbc-8861-5e3e2a66397c",
  "name": "azure-booby-3323",
  "status": "ACTIVE",
  "availability": "vm",
  "resources": {
    "supply": {
      "vcpu": { "count": 14 },
      "memory": { "count": 119, "units": "Gi" },
      "storage": { "count": 582, "units": "Gi" },
      "gpu_count": 1
    },
    "gpu_model": {
      "vendor": "nvidia",
      "model": "l40",
      "vram": "48Gi",
      "interface": "pcie"
    }
  },
  "location": "us-central-3",
  "os_image": "Ubuntu Server 22.04",
  "ssh_connection": "ssh ubuntu@216.81.248.90",
  "billing": {
    "hourly_usage": 0.76,
    "total_spendings": 1.51,
    "reserved_amount": 0.76,
    "next_billing_period": "2026-02-07T16:00:00Z"
  },
  "network": {
    "domain": "216.81.248.90",
    "forwarded_ports": [],
    "uri": null
  },
  "ssh_key": "ssh-ed25519 AAAAC3... user@host",
  "created_at": "2026-02-07T14:43:43.993091Z",
  "updated_at": "2026-02-07T14:45:42.054932Z"
}
```

#### Example: ended instance

When an instance is no longer active, `network` is `null`, `ssh_connection` is `null`, and billing fields reset:

```json
{
  "id": "74c722a1-645c-4799-ad2b-731e8f45def8",
  "name": "crimson-chinchilla-3483",
  "status": "ENDED",
  "availability": "vm",
  "resources": {
    "supply": {
      "vcpu": { "count": 8 },
      "memory": { "count": 22, "units": "Gi" },
      "storage": { "count": 465, "units": "Gi" },
      "gpu_count": 1
    },
    "gpu_model": {
      "vendor": "nvidia",
      "model": "v100",
      "vram": "32Gi",
      "interface": "sxm"
    }
  },
  "location": "Texas",
  "os_image": "ubuntu24.04",
  "ssh_connection": null,
  "billing": {
    "hourly_usage": 0,
    "total_spendings": 0,
    "reserved_amount": 0,
    "next_billing_period": null
  },
  "network": null,
  "ssh_key": "ssh-ed25519 AAAAC3... user@host",
  "created_at": "2026-02-07T14:42:40.089261Z",
  "updated_at": "2026-02-07T14:43:13.543334Z"
}
```

### Rename an instance

To rename a VM or bare metal instance, send a `PUT` request with the new name:

```sh
PUT https://api.fluence.dev/gpu/instances/vms/{instance_id}
```

```sh
PUT https://api.fluence.dev/gpu/instances/baremetal/{instance_id}
```

**Example request:**

```sh
curl -X PUT https://api.fluence.dev/gpu/instances/vms/05cdd5fc-d384-4fbc-8861-5e3e2a66397c \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: <YOUR_API_KEY>" \
  -d '{ "name": "my-training-vm" }'
```

#### Request body

```json
{
  "name": string
}
```

- **`name`** (string): The new instance name. Same naming rules as deployment: 1–25 characters, lowercase letters, digits, or hyphens, cannot start or end with a hyphen.

A successful rename returns a **204** status code with no response body.

:::info
For VM and bare metal instances, only the name can be updated. To change other configuration, terminate the instance and create a new one.
:::

### Terminate an instance

To terminate a running VM or bare metal instance:

```sh
DELETE https://api.fluence.dev/gpu/instances/vms/{instance_id}
```

```sh
DELETE https://api.fluence.dev/gpu/instances/baremetal/{instance_id}
```

**Example request:**

```sh
curl -X DELETE https://api.fluence.dev/gpu/instances/vms/05cdd5fc-d384-4fbc-8861-5e3e2a66397c \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

A successful termination returns a **204** status code with no response body.

:::info
Only instances with `ACTIVE` status can be terminated. Any unused funds on the instance balance are returned to your account. See the [billing model](../../instance_rent/instance_rent.md#billing-model) for details.
:::

## Error responses

All management endpoints return errors in the same format as the [deployment endpoints](../deploy_instance/deploy_instance.md#error-responses):

- **422 (Validation errors)**: Returned when request parameters are invalid. The response contains a `detail` array describing each validation issue.
- **400 (Business logic errors)**: Returned when the request is valid but cannot be fulfilled (e.g., trying to terminate a non-active instance). The response contains a `detail` string.

## Manage SSH keys

To access your GPU instances via SSH, you need at least one SSH key registered in your account. SSH keys can be managed through the API endpoints described in the [Manage SSH keys](../../../cpu_cloud/api/manage_vms/manage_vms.md#manage-ssh-keys) guide.

## Next steps

- [Browse available GPU plans](../get_plans/get_plans.md) — find compute resources for your workload
- [Deploy GPU instances](../deploy_instance/deploy_instance.md) — create new instances from plans
- [Manage GPU instances in the console](../../manage_instances/manage_instances.md) — use the web UI to view and manage instances
- [Billing model](../../instance_rent/instance_rent.md#billing-model) — understand how hourly billing and reserves work
