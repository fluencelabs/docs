---
sidebar_position: 4
---

# GPU Cloud

The GPU Cloud API lets you browse available GPU plans, deploy instances, and manage them throughout their lifecycle. It supports three workload types — containers, VMs, and bare metal — each accessed through a consistent URL pattern.

For authentication and general request format, see the [API introduction](./overview.md).

For complete request/response schemas, see the [API reference](https://api.fluence.dev/gpu/api-docs/openapi.json) ([Swagger UI](https://api.fluence.dev/gpu/api-docs)).

## Endpoints

Base URL: `https://api.fluence.dev/gpu`

### Plans

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/gpu/plans/` | List container plans |
| `GET` | `/gpu/plans/vms` | List VM plans |
| `GET` | `/gpu/plans/baremetal` | List bare metal plans |

### Instances — containers

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/gpu/instances/` | Deploy a container |
| `GET` | `/gpu/instances/` | List container instances |
| `GET` | `/gpu/instances/{instance_id}` | Get container details |
| `PUT` | `/gpu/instances/{instance_id}` | Update a container |
| `DELETE` | `/gpu/instances/{instance_id}` | Terminate a container |
| `GET` | `/gpu/instances/{instance_id}/logs` | Get container logs |
| `GET` | `/gpu/instances/{instance_id}/events` | Get container events |

### Instances — VMs and bare metal

VMs and bare metal use identical request/response structures. Replace `/vms` with `/baremetal` for bare metal instances.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/gpu/instances/vms` | Deploy a VM |
| `GET` | `/gpu/instances/vms` | List VM instances |
| `GET` | `/gpu/instances/vms/{instance_id}` | Get VM details |
| `PUT` | `/gpu/instances/vms/{instance_id}` | Rename a VM |
| `DELETE` | `/gpu/instances/vms/{instance_id}` | Terminate a VM |

### Other

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/gpu/default-images/` | List default container images |

## Browse plans

The plan endpoints return available GPU configurations with pricing and location data.

**Container plans** return a flat array. Each plan represents a group of resource offerings that can be placed in different locations.
When deploying a container, use the plan ID and optionally pass a location as a constraint.

**VM and bare metal plans** return plans grouped by GPU model, then by GPU count. Each group contains individual options tied to a specific provider and location. Use the option ID to deploy. Each option includes `os_options` — you must pass one of these values as `os_image` in the deploy request.

## Deploy instances

### Containers

Deploy with `POST /gpu/instances/`. Every deployment should contain at least: plan ID, instance name, and container settings (at minimum an image and at least one exposed port). Additionally you can specify: environment variables, startup command, private registry credentials, location constraint, SSH key.

Restrictions to be aware of:

- Only port 80 supports the `"http"` protocol; all others must use `"tcp"` or `"udp"`
- Maximum 10 exposed ports, 64 environment variables
- The environment variable `SSH_PUBKEY` is reserved for ssh key — defining it along with a key will fail the deployment
- Private registries: only `docker.io` and `ghcr.io` are supported
- You can use pre-built images from `GET /gpu/default-images/` as a starting point

### VMs and bare metal

Deploy with `POST /gpu/instances/vms` or `POST /gpu/instances/baremetal`. To deploy an instance, provide chosen option ID (as `plan_id`), instance name, SSH key, and OS image.

The `os_image` value must match one of the `os_options` from the selected plan option. If it doesn't match, the error response lists the valid values.

### After deployment

Provisioning typically takes 2–3 minutes. Once active, connection details are available in the response: `ssh_connection` for VMs/bare metal, or `network.domain` and `network.forwarded_ports` for containers.

## Manage instances

### Update a container

`PUT /gpu/instances/{instance_id}` is a **full replacement** — include all fields, not just the ones you're changing.

:::warning
Exposed ports cannot be changed after deployment. The port configuration from the original deployment stays in effect.
:::

:::info
A new update cannot be submitted while a previous one is still being applied.
:::

### VM and bare metal updates

Only renaming is supported via `PUT`. To change other configuration, terminate and re-deploy.

### Container debugging

- `GET /gpu/instances/{id}/logs` — container stdout/stderr. Use `?last=N` to tail.
- `GET /gpu/instances/{id}/events` — cluster-level events (scheduling, image pull, container start). Useful when the container fails to start.

### Terminate

`DELETE` on the instance endpoint. Only `ACTIVE` instances can be terminated. Unused balance is refunded.

## Error responses

GPU Cloud API errors come in two formats:

**Validation errors (422)** — the `detail` field is an array of objects describing each invalid field, with `loc`, `msg`, `type`, and `input`:

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "container_settings", "expose", 0, "port"],
      "msg": "Value error, Port must be between 1 and 65535",
      "input": "999999999",
      "ctx": { "error": {} }
    }
  ]
}
```

**Business logic errors (400)** — the `detail` field is a plain string:

```json
{
  "detail": "Insufficient balance to deploy instance"
}
```

Common causes: insufficient balance, plan no longer available, unsupported OS image (the error lists valid options).
