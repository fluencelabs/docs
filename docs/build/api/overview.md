---
sidebar_position: 1
---

# Introduction to the Fluence Console API

The Fluence Console API provides programmatic access to the decentralized Fluence compute marketplace, allowing developers to find, rent, and manage compute resources without using the web interface. With this API, you can automate your infrastructure provisioning, scale resources dynamically, and integrate Fluence's decentralized compute capabilities directly into your applications and workflows.

## What You Can Do with the Fluence Console API

The API enables you to:

1. **Search the Marketplace** - Find compute resources that match your specific requirements including CPU, memory, storage, geographic location, and budget constraints
2. **Deploy Virtual Machines** - Create and configure VMs with your choice of operating system and network settings
3. **Manage Resources** - View your active deployments and monitor their status
4. **Terminate Resources** - Delete VMs when they're no longer needed

## Authentication

The Fluence Console API uses API keys for authentication. All requests must include your API key in the Authorization header. You can read more about API keys creation and management in the [Fluence Console Settings guide](../settings/settings.md).

### Using Your API Key

Include your API key in the `Authorization` header with all API requests:

```bash
curl -X POST https://api.fluence.dev/vms/v3 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## API Base URL

All API endpoints are available at:

```bash
https://api.fluence.dev
```

## Request and Response Format

The Fluence Console API accepts and returns data in JSON format. When making POST requests, set the `Content-Type` header to `application/json`:

```bash
curl -X POST https://api.fluence.dev/marketplace/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "basicConfiguration": "cpu-4-ram-8gb-storage-25gb"
  }'
```

## Common API Endpoints

The API is organized around these main resource areas:

| Endpoint         | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| `/marketplace/*` | Endpoints for searching and discovering available compute offerings |
| `/vms/*`         | Endpoints for deploying and managing virtual machines               |

:::info

You can find detailed information about all API endpoints in the [Fluence Console API Reference](https://vodopad.mainnet.fluence.dev/docs). // TODO: switch to api.fluence.dev once it's ready

:::

## Rate Limits

Currently, the API has no rate limits. // TODO: add rate limits once we have them

## Next Steps

Now that you understand the basics of the Fluence Console API, you can explore the following guides to learn more:

1. [Finding Compute Resources on the Fluence Marketplace](./get_offerings/get_offerings.md) - Learn how to search for and compare compute offerings that match your requirements
2. [Deploying Virtual Machines on the Fluence Marketplace](./order_vm/order_vm.md) - Learn how to deploy and configure VMs
3. [Managing Your Virtual Machines on Fluence](./manage_vms/manage_vms.md) - Learn how to view, monitor, and delete your VMs
