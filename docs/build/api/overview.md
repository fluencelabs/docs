---
sidebar_position: 1
---

# Introduction to the Fluence API

The Fluence API provides programmatic access to the decentralized Fluence compute marketplace. With API you can find, rent, and manage compute resources without using the web interface. This document will help you understand how to integrate Fluence's decentralized compute capabilities into your applications and workflows.

:::info
All API endpoints are available at:

```bash
https://api.fluence.dev/
```

:::

## API functionality

The API enables you to:

1. **Search the marketplace** - Find compute resources matching specific requirements for CPU, memory, storage, location, and budget
2. **Deploy virtual machines** - Create and configure VMs with your choice of operating system and network settings
3. **Manage deployments** - View active VMs, modify their configuration, and remove them when no longer needed
4. **Manage SSH keys** - View, add, and remove your SSH public keys

## API requests

### Authentication

All Fluence API endpoints require an API key sent as a Bearer token in the `Authorization` header.  
You can create and manage your keys in the [Fluence Console settings guide](../settings/settings.md). If you omit or supply an invalid key, you’ll get a 403 code error.

### Request and response format

The Fluence API accepts and returns data in JSON format. When making POST requests, set the `Content-Type` header to `application/json`.

#### Example request

```bash
curl -i -X POST https://api.fluence.dev/marketplace/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -d '{
    "basicConfiguration": "cpu-4-ram-8gb-storage-25gb"
  }'
```

### Response HTTP statuses

Along with the HTTP methods that the API responds to, it will also return standard HTTP statuses, including error codes.

- **Success:** If the status returned is in the 200 range, it indicates that the request was fulfilled successfully and that no error was encountered.
- **Error:** In the event of a problem, the status will contain the error code:
  - **Client errors:** Return codes in the 400 range typically indicate that there was an issue with the request that was sent. For example, this could mean missing or invalid API key, that the object you are requesting does not exist, or that your request is malformed.
  - **Server errors:** If you receive a status in the 500 range, this generally indicates a server-side problem. This means that we are having an issue on our end and cannot fulfill your request currently.
- **Error response body:** All 4xx/5xx responses return JSON with an `error` field with message providing additional information about the error.

#### Example error response

```bash
    HTTP/1.1 403 Forbidden
    {
      "error": "Auth failed. No such API Key",
    }
```

## Common API endpoints

The API is organized around these main resource areas:

| Endpoint         | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| `/marketplace/*` | Endpoints for searching and discovering available compute offerings |
| `/vms/*`         | Endpoints for deploying and managing virtual machines               |
| `/ssh_keys`      | Endpoints for managing SSH keys                                     |

## API documentation resources

### Swagger UI

The Fluence API also provides an Swagger UI that allows you to explore and try the API endpoints directly in your browser: [https://api.fluence.dev/](https://api.fluence.dev/)

### API Reference

The Fluence API also provides an API Reference that provides more technical details on how to use the API: [https://api.fluence.dev/docs](https://api.fluence.dev/docs)

## SSH keys and access to VMs

To access your VMs, you need to have at least one SSH key registered. Please ensure you have at least one SSH key registered in your account before creating a VM. You can do it either via the [Account settings in Fluence Console](../settings/settings.md) or using the API endpoints described in the [Manage SSH keys](./manage_vms/manage_vms.md#manage-ssh-keys) guide.

## Next steps

Now that you are familiar with the basics of the Fluence API, you can explore the following guides to learn more:

1. [Find compute resources on the Fluence marketplace](./get_offerings/get_offerings.md) - Learn how to search for and compare compute offerings that match your requirements
2. [Deploy virtual machines on the Fluence marketplace](./order_vm/order_vm.md) - Learn how to deploy and configure VMs
3. [Manage your virtual machines on Fluence](./manage_vms/manage_vms.md) - Learn how to view, monitor, and delete your VMs
