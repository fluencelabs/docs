---
sidebar_position: 1
---

# Introduction to the Fluence API

The Fluence API provides programmatic access to the decentralized Fluence compute marketplace. This API allows developers to find, rent, and manage compute resources without using the web interface, enabling direct integration of Fluence's decentralized compute capabilities into applications and workflows.

:::info
All API endpoints are available at:

```bash
https://api.fluence.dev
```

:::

## API functionality

The API enables you to:

1. **Search the marketplace** - Find compute resources matching specific requirements for CPU, memory, storage, location, and budget
2. **Deploy virtual machines** - Create and configure VMs with your choice of operating system and network settings
3. **Manage deployments** - View active VMs, modify their configuration, and remove them when no longer needed
4. **Manage personal resources** - View and edit SSH keys and other personal resources

## Authentication

The Fluence API uses API keys for authentication. All requests must include your API key in the Authorization header. You can read more about creating and managing API keys in the [Fluence Console Settings guide](../settings/settings.md).

Include your API key in the `Authorization` header with all API requests:

```bash
curl -X POST https://api.fluence.dev/vms/v3 \
  -H "Authorization: Bearer <YOUR_API_KEY>"
```

## Request and response format

The Fluence API accepts and returns data in JSON format. When making POST requests, set the `Content-Type` header to `application/json`:

```bash
curl -X POST https://api.fluence.dev/marketplace/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -d '{
    "basicConfiguration": "cpu-4-ram-8gb-storage-25gb"
  }'
```

## Common API endpoints

The API is organized around these main resource areas:

| Endpoint         | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| `/marketplace/*` | Endpoints for searching and discovering available compute offerings |
| `/vms/*`         | Endpoints for deploying and managing virtual machines               |
| `/ssh_keys`      | Endpoints for managing SSH keys                                     |

:::info

You can find detailed information about all API endpoints in the [Fluence API Reference](https://api.fluence.dev/docs).

:::

## Next steps

Now that you are familiar with the basics of the Fluence API, you can explore the following guides to learn more:

1. [Find compute resources on the Fluence marketplace](./get_offerings/get_offerings.md) - Learn how to search for and compare compute offerings that match your requirements
2. [Deploy virtual machines on the Fluence marketplace](./order_vm/order_vm.md) - Learn how to deploy and configure VMs
3. [Manage your virtual machines on Fluence](./manage_vms/manage_vms.md) - Learn how to view, monitor, and delete your VMs
