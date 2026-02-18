---
sidebar_position: 1
---

# Introduction to the Fluence API

The Fluence API provides programmatic access to the decentralized Fluence compute marketplace. With the API you can find, rent, and manage compute resources on both CPU Cloud and GPU Cloud without using the web interface.

## Authentication

All Fluence API endpoints require an API key sent in the `X-API-KEY` header.
You can create and manage your keys in the [Fluence Console settings](../settings/settings.md). If you omit or supply an invalid key, you'll get a 403 error.

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

## Contents

The Fluence API covers two cloud platforms — CPU Cloud and GPU Cloud. Pick the one that matches your workload:

- [CPU Cloud](./cpu_cloud.md) — search the decentralized CPU compute marketplace, deploy and manage virtual machines
- [GPU Cloud](./gpu_cloud.md) — browse available GPU plans, deploy and manage containers, VMs, and bare metal instances

In addition, the API provides shared account-level management that applies across both platforms:

- [SSH keys](./ssh_keys.md) — register and manage SSH keys for use during deployment
