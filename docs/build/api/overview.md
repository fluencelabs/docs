---
sidebar_position: 1
description: "Fluence API basics: base URL, API versions, authentication with API keys, permissions, request conventions, retries with Idempotency-Key, errors, and rate limits."
---

# Fluence API

The Fluence API lets you do from code what you do in the Fluence Console. You can find locations and prices, create and manage CPU virtual machines, disks, networks, and public IP addresses, rent GPU instances, and manage your account, keys, and top-ups.

- Base URL: `https://api.fluence.dev`
- API reference: [api.fluence.dev/scalar](https://api.fluence.dev/scalar)
- OpenAPI document: [api.fluence.dev/docs/fluence-public.yaml](https://api.fluence.dev/docs/fluence-public.yaml)

## API versions

| Version | Paths | Use it for |
|---|---|---|
| Public v3 | `/v3/...` | New integrations: CPU virtual machines, disks, networks, public IP addresses, SSH keys, prices, account, API keys, top-ups, and promo codes |
| Public v1 and v2 | `/v1/...`, `/v2/...` | Existing integrations. These paths still work. |
| GPU | `/gpu/...` | GPU containers, GPU virtual machines, and bare metal. See [GPU Cloud API](./gpu_cloud.md). |

The x402 top-up and wallet sign-in endpoints use `/v2/x402/...` and `/v1/auth/siwe...`. They are not in the API reference. See [Pay with x402](./x402.md).

AI clients can also use the API through the Fluence MCP server. See [Connect an AI client through MCP](../../build_with_ai/mcp.md).

## Authentication

Send one of these headers with every request:

- `X-API-KEY: <API key>`
- `Authorization: Bearer <access token>`

The examples in these docs use API keys. An access token comes from signing in, for example with a wallet as described in [Pay with x402](./x402.md).

```sh
curl https://api.fluence.dev/v3/clusters \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

### Create an API key

Create keys in the Fluence Console on the [**API keys**](https://console.fluence.ai/settings/api-keys) page under **Settings**. See [Settings](../settings.md). You can also create keys with `POST /v3/api-keys`.

The key value is shown only once, when you create the key. Store it in a secret manager or an environment variable. If you lose a key, delete it and create a new one.

### Permissions

Each key has a set of permissions, called scopes, and an expiration date. The API reference lists the scopes that each operation needs. A request without a needed scope returns `403`.

| To work with | Read | Change |
|---|---|---|
| Virtual machines | `vms:read` | `vms:write` |
| Clusters, configurations, and prices | `clusters:read`, `vm:list`, `prices:read` | |
| Disks | `storage:read` | `storage:write` |
| VPCs | `vpc:read` | `vpc:write` |
| Subnets | `subnet:read` | `subnet:write` |
| Security groups | `security_groups:read` | `security_groups:write` |
| Public IP addresses | `public_ip:read` | `public_ip:write` |
| SSH keys | `ssh_key:list` | `ssh_key:create`, `ssh_key:remove` |
| API keys | `api_key:list` | `api_key:create`, `api_key:remove` |
| Account | `account:read` | `account:write` |
| Top-ups and payments | `billing:get_history`, `billing:get_spending_history` | `billing:top_up` |
| GPU containers | | `akash:write` |
| GPU virtual machines and bare metal | | `spheron:write` |

- A key can only get scopes that your account has.
- A `write` scope does not include the matching `read` scope. To create and then read a VM, a key needs both `vms:write` and `vms:read`.
- The GPU API does not accept read-only scopes. To list or read GPU instances, a key needs `akash:write` or `spheron:write`.
- In the Fluence Console, the **Read only** preset does not include `clusters:read`, `vm:list`, or `prices:read`. A key with only this preset cannot read the catalog or prices.

## Requests

- Send JSON with `Content-Type: application/json`. Field names in v3 are camelCase.
- v3 rejects unknown fields in the request body and unknown query parameters.
- Names of VMs, disks, VPCs, subnets, security groups, public IP addresses, SSH keys, and API keys are 1 to 25 characters: lowercase letters, digits, and hyphens. A name starts and ends with a letter or a digit.
- Array query parameters use indexes: `ids[0]=<id>&ids[1]=<id>`.
- In v3, an omitted field, `null`, and an empty value mean different things. The API reference describes each case. A `PATCH` with an empty body returns `400`.

### Pagination

v3 lists return `items` and `pagination`. Use `page` (default 1) and `perPage` (default 50, from 1 to 200). Some short lists, such as API keys, clusters, and prices, return all items without pagination.

## Retries

Some v3 operations take an `Idempotency-Key` header. The key is 1 to 128 characters: letters, digits, `.`, `_`, `:`, and `-`. If a request with an `Idempotency-Key` times out or the response is lost, send the same request again with the same key and the same body. The API returns the result of the first request and does not create a second resource.

- `POST /v3/vms` and `POST /v3/vms/{vm_id}/terminate` require the header.
- Creating a disk, a public IP address, a VPC, a subnet, a security group, or a draft VM's disk accepts the header.
- A different body with the same key returns `409` with `idempotency_conflict`.
- A request that is still running returns `409` with `request_in_progress` and a `Retry-After` header.

Other changes, such as provisioning, restarting, editing, and creating SSH keys, API keys, or top-ups, have no `Idempotency-Key`. If the result of such a request is unknown, read the resource before you send it again. Repeating the request can, for example, restart a VM twice or create a second API key.

## Errors

The API returns `2xx` on success and a JSON error body on failure:

| Status | Meaning |
|---|---|
| `400` | The request is malformed or fails validation |
| `401` | The credentials are missing or invalid |
| `403` | The credentials lack a needed scope |
| `404` | The resource does not exist or belongs to another account |
| `409` | The request conflicts with the resource state or with an earlier request that used the same `Idempotency-Key` |
| `413` | The request body is too large |
| `422` | The request is well formed but cannot be done, for example a disk that is too small for the image |
| `429` | Too many requests. Wait for the number of seconds in `Retry-After`. |
| `503` | A dependency is unavailable. Retry later. Do not retry a change with a new `Idempotency-Key` only because of a `503`. |

Every v3 error body has a `code` field, such as `forbidden`, `vm_not_draft`, or `insufficient_balance`. Write your error handling against `code`. Other fields of the error body differ between operations. The API reference lists them for each operation.

The GPU endpoints return errors in a different format. See [GPU Cloud API](./gpu_cloud.md).

## Pages in this section

- [CPU Cloud API](./cpu_cloud.md): create a virtual machine, connect to it, and delete it.
- [SSH keys](./ssh_keys.md): add and remove the SSH keys that VMs use.
- [GPU Cloud API](./gpu_cloud.md): rent GPU containers, virtual machines, and bare metal.
- [Pay with x402](./x402.md): fund an account with USDC over HTTP and sign in with a wallet, for AI agents and scripts.
