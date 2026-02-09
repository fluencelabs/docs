---
sidebar_position: 1
---

# Overview

The GPU Cloud API lets you browse available GPU plans, deploy instances, and manage them throughout their lifecycle. It supports three workload types — containers, VMs, and bare metal — each accessed through a consistent URL pattern.

:::info
All GPU Cloud API endpoints require the `X-API-KEY` header for authentication. See the [API introduction](../../overview/overview.md) for details on authentication and request format.
:::

## Base URL

```sh
https://api.fluence.dev/gpu
```

## Endpoints

| Endpoint              | Description                                         |
| --------------------- | --------------------------------------------------- |
| `/gpu/plans/*`        | Browse available GPU plans                          |
| `/gpu/instances/*`    | Deploy and manage GPU instances                     |

## Endpoint paths by workload type

GPU Cloud supports three workload types: containers, VMs, and bare metal. Endpoints are organized by workload type using path segments:

| Path segment | Workload type |
| ------------ | ------------- |
| `/` (root)   | Containers    |
| `/vms`       | VMs           |
| `/baremetal` | Bare metal    |

For example, `/gpu/plans/` returns container plans, `/gpu/plans/vms` returns VM plans, and `/gpu/plans/baremetal` returns bare metal plans. The same pattern applies to `/gpu/instances/`.

## SSH keys

GPU Cloud does not require pre-registered SSH keys. Instead, you provide your public SSH key directly in the [deployment request](../deploy_instance/deploy_instance.md). The key is passed as the `ssh_key` field in the request body — it is optional for containers and required for VMs and bare metal.

## Error responses

All GPU Cloud API endpoints return errors in one of two formats:

### Validation errors (422)

Returned when the request body has invalid or missing fields. The response contains a `detail` array with the location and description of each error:

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "container_settings", "expose", 0, "port"],
      "msg": "Value error, Port must be between 1 and 65535",
      "input": "999999999",
      "ctx": {
        "error": {}
      }
    }
  ]
}
```

### Business logic errors (400)

Returned when the request is well-formed but cannot be fulfilled. The response contains a `detail` string describing the problem:

```json
{
  "detail": "Insufficient balance to deploy instance"
}
```

Common 400 errors include:

- Insufficient account balance
- Plan no longer available
- Unsupported OS image for the selected plan (the error message lists the valid options):

  ```json
  {
    "detail": "Provided OS image Ubuntu Server 2.04 is not supported for the selected offer. Available OS images: Ubuntu Server 22.04"
  }
  ```

## Swagger UI

Explore and try the GPU Cloud API endpoints directly in your browser: [https://api.fluence.dev/gpu/api-docs](https://api.fluence.dev/gpu/api-docs)

## Next steps

1. [Find GPU plans on the marketplace](../get_plans/get_plans.md) — find GPU configurations that match your requirements
2. [Deploy GPU instances](../deploy_instance/deploy_instance.md) — create containers, VMs, or bare metal instances
3. [Manage GPU instances](../manage_instances/manage_instances.md) — monitor, update, and terminate your instances
