---
sidebar_position: 1
---

# Introduction to the Fluence API

The Fluence API provides programmatic access to the decentralized Fluence compute marketplace. With the API you can find, rent, and manage compute resources on both CPU Cloud and GPU Cloud without using the web interface.

## Authentication

All Fluence API endpoints require an API key sent in the `X-API-KEY` header.
You can create and manage your keys in the [Fluence Console settings](../../settings/settings.md). If you omit or supply an invalid key, you'll get a 403 error.

## Request and response format

The Fluence API accepts and returns data in JSON format. When making POST requests, set the `Content-Type` header to `application/json`.

**Example request:**

```sh
curl -i -X GET https://api.fluence.dev/gpu/plans \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

## Response HTTP statuses

- **Success:** Status codes in the 200 range indicate the request was fulfilled successfully.
- **Client errors:** Status codes in the 400 range indicate an issue with the request — missing or invalid API key, malformed request body, resource not found, etc.
- **Server errors:** Status codes in the 500 range indicate a server-side problem.

All error responses return a JSON body with a description of the problem. The exact error format differs between CPU Cloud and GPU Cloud — see the cloud-specific overview pages for details.

## Next steps

- [CPU Cloud API overview](../cpu_cloud/overview/overview.md) — endpoints, error format, and Swagger UI for CPU Cloud
- [GPU Cloud API overview](../gpu_cloud/overview/overview.md) — endpoints, workload types, error format, and Swagger UI for GPU Cloud
- [Manage SSH keys](../ssh_keys/ssh_keys.md) — list, add, and remove SSH keys used for CPU Cloud VM access
