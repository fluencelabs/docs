---
sidebar_position: 1
---

# Overview

The CPU Cloud API lets you search the decentralized compute marketplace, deploy virtual machines, and manage them throughout their lifecycle.

:::info
All CPU Cloud API endpoints require the `X-API-KEY` header for authentication. See the [API introduction](../../overview/overview.md) for details on authentication and request format.
:::

## Base URL

```sh
https://api.fluence.dev/
```

## Endpoints

| Endpoint         | Description                                        |
| ---------------- | -------------------------------------------------- |
| `/marketplace/*` | Search and discover available compute offerings    |
| `/vms/*`         | Deploy and manage virtual machines                 |

## Error responses

All CPU Cloud API error responses return a JSON body with an `error` field containing a message:

```json
{
  "error": "No suitable offer found"
}
```

Common errors include:

- **403**: Invalid or missing API key
- **422**: No matching offers found for the given constraints

## API documentation resources

- **Swagger UI:** [https://api.fluence.dev/](https://api.fluence.dev/)
- **API Reference:** [https://api.fluence.dev/docs](https://api.fluence.dev/docs)

## Next steps

1. [Find compute resources on the marketplace](../get_offerings/get_offerings.md) — search for and compare compute offerings
2. [Deploy virtual machines](../order_vm/order_vm.md) — deploy and configure VMs
3. [Manage your deployments](../manage_vms/manage_vms.md) — view, monitor, and delete your VMs
