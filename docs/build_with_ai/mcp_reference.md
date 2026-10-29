---
description: "Reference for the Fluence MCP server: endpoint, authentication, permissions per tool, limits, retries, errors, and the full tool list."
---

# MCP server reference

This page describes the Fluence MCP server at `https://api.fluence.dev/mcp`. To connect a client, see [Connect an AI client through MCP](./mcp.md).

## Endpoint and protocol

| Property | Value |
|---|---|
| URL | `https://api.fluence.dev/mcp` |
| Transport | Streamable HTTP, stateless, JSON responses. Requests use `POST`. There are no sessions and no event stream. |
| Protocol versions | `2025-11-25`, `2026-07-28` |
| Capabilities | Tools only. The server has no prompts and no resources. |
| Scope | CPU virtual machines, disks, VPCs, subnets, security groups, public IP addresses, SSH keys, catalog, and prices |

Each tool calls one operation of the Fluence public API v3 with your API key. A tool result is the same JSON that the API returns.

## Authentication

Every request needs exactly one `X-API-KEY` header with a Fluence API key. Keys start with `fl_v1_`. Create keys in the Fluence Console under **Settings** > **API keys**.

The server refuses a request before it checks the key in these cases:

| Request | Response |
|---|---|
| Has an `Origin` header. Browsers always send one. | `403`, empty body |
| Has an `Authorization` header | `401`, `A single X-API-KEY header and native client are required` |
| Has a query string in the URL | `401`, same message |
| Has no `X-API-KEY` header, or more than one | `401`, same message |

The server then checks the key on every request. A deleted or expired key stops working at once, and so does a key of a blocked account.

The server does not support OAuth. Clients that can only sign in with OAuth, and hosted connectors that cannot send a custom header, cannot connect.

## Tools and scopes

`tools/list` returns only the tools that your key has every permission for. If a client calls a tool anyway, the tool returns the error code `forbidden`. A key needs all permissions listed for a tool. `vms:write` does not include `vms:read`.

| Permissions | Tools |
|---|---|
| Any valid key | `list_images` |
| `clusters:read` | `list_clusters`, `get_cluster_options` |
| `clusters:read`, `vm:list`, `prices:read` | `list_vm_offerings` |
| `vm:list` | `list_configurations` |
| `prices:read` | `list_vm_prices`, `list_storage_prices`, `list_public_ip_prices`, `estimate_resource_cost`, `estimate_vm` |
| `vms:read`, `prices:read` | `estimate_saved_vm` |
| `vms:read` | `list_vms`, `get_vm`, `list_vm_interfaces` |
| `vms:write` | `create_vm`, `update_vm`, `provision_vm`, `restart_vm`, `soft_reboot_vm`, `terminate_vm`, `discard_vm`, `set_vm_cloud_init`, `clear_vm_cloud_init`, `replace_vm_ssh_keys`, `move_vm_cluster`, `add_vm_interface`, `update_vm_interface`, `detach_vm_security_group`, `remove_vm_interface`, `set_default_vm_interface`, `attach_vm_storage`, `create_vm_data_disk`, `create_vm_boot_disk`, `replace_vm_boot_disk`, `update_vm_storage`, `remove_vm_storage` |
| `ssh_key:list` | `list_ssh_keys` |
| `ssh_key:create` | `create_ssh_key` |
| `ssh_key:remove` | `delete_ssh_key` |
| `storage:read` | `list_storage_types`, `list_storages`, `get_storage` |
| `storage:write` | `create_storage`, `update_storage`, `delete_storage` |
| `vpc:read` | `list_vpcs` |
| `vpc:write` | `create_vpc`, `update_vpc`, `delete_vpc` |
| `subnet:read` | `list_subnets` |
| `subnet:write` | `create_subnet`, `update_subnet`, `delete_subnet`, `set_default_subnet` |
| `security_groups:read` | `list_security_groups` |
| `security_groups:write` | `create_security_group`, `update_security_group`, `delete_security_group` |
| `public_ip:read` | `list_public_ips` |
| `public_ip:write` | `create_public_ip`, `update_public_ip`, `delete_public_ip` |
| `account:read` | `get_balances` |

How the console's permission presets map to these permissions:

- **Read only** gives the `*:read` scopes for VMs, disks, VPCs, subnets, security groups, and public IP addresses, plus `ssh_key:list`, `api_key:list`, `billing:get_history`, and `billing:get_spending_history`. It does not give `clusters:read`, `vm:list`, or `prices:read`, so a Read only key cannot use the catalog, price, or estimate tools.
- **Custom scopes** with **Virtual machines** set to **Manage** gives `vms:read` and `vms:write`, and adds `clusters:read`, `vm:list`, and `prices:read`.
- The console does not offer `account:read`, so `get_balances` does not work with a key created in the console.

A key can only receive permissions that your account has.

## Arguments

- Resource IDs are UUIDs in camelCase arguments: `vmId`, `clusterId`, `storageId`, `publicIpId`, `vpcId`, `subnetId`, `securityGroupId`, `sshKeyId`, `interfaceId`.
- The request body of the API operation goes in the `spec` argument. The server rejects unknown top-level arguments.
- Names of VMs, disks, VPCs, subnets, security groups, public IP addresses, and SSH keys are 1 to 25 characters: lowercase letters, digits, and hyphens. A name starts and ends with a letter or digit.
- List tools accept `page` (default 1) and `perPage` (default 50, maximum 200).

## Results and errors

A successful call returns the API response in `structuredContent.result`, and the same JSON as text in `content`. An operation with no response body returns `{"result": null}`.

A failed call returns `isError: true` and an error object in `structuredContent`. Use the `code` field to decide what to do. The other fields of the error object can change.

| Code | Meaning |
|---|---|
| `bad_request` | The arguments do not match the tool's input schema |
| `forbidden` | The key lacks a permission the tool needs |
| `not_found` | The resource does not exist or belongs to another account |
| `busy` | Too many calls are running. This call did not start. |
| `rate_limited` | The key exceeded the request budget. Wait for the time in `retryAfter`. |
| `operation_timeout` | The server stopped waiting for the operation. A write may have finished. |
| `operation_unavailable` | The server could not run the operation, for example during a restart |
| `output_too_large` | The result was larger than the server returns. A write may have finished. |
| `idempotency_conflict` | A previous call used the same `requestKey` with different arguments |
| `request_in_progress` | A call with the same `requestKey` is still running. Wait for the time in `retryAfter`. |
| `idempotent_resource_gone` | The resource created under this `requestKey` has been deleted since |
| `vm_not_draft` | The operation needs a VM in the `draft` status |

## Limits

- Each server instance runs at most 2 tool calls at a time for one user and 8 in total. A call over the limit returns `busy` and does not start. Wait for a running call to finish, then retry with the same arguments.
- MCP calls and API calls made with the same key share one request budget.
- A write keeps running after a timeout or after the client disconnects. A read stops when the client disconnects.

## Retries

Nine tools take a required `requestKey` argument: `create_vm`, `create_storage`, `create_vm_data_disk`, `create_vm_boot_disk`, `create_public_ip`, `create_vpc`, `create_subnet`, `create_security_group`, and `terminate_vm`. The key is 1 to 128 characters: letters, digits, `.`, `_`, `:`, and `-`. If the outcome of a call is unknown, call the tool again with the same `requestKey` and the same arguments. The server returns the result of the first call and does not create a second resource. The same key works across MCP and the API.

Other writes have no `requestKey`, for example `provision_vm`, `create_ssh_key`, interface changes, and deletions. If the outcome of such a call is unknown, read the resource state before you retry.

## Tool annotations

Every tool sets `readOnlyHint`, `destructiveHint`, and `idempotentHint`, and `openWorldHint` is `false`.

- `readOnlyHint` is `true` for list, get, and estimate tools.
- `destructiveHint` is `true` for tools that start billing, terminate or delete resources, or change network access. Clients can use it to ask for confirmation. `create_vm` is not destructive. It creates a draft that is not billed. `provision_vm` is destructive. It starts the VM and billing.
- `idempotentHint` is `true` only for the tools that take a `requestKey`.

## VM lifecycle

A VM goes through these tool calls:

1. `list_clusters` returns the clusters and their locations.
2. `list_vm_offerings` returns the configurations available in a cluster with your hourly price.
3. `list_images` returns the OS images and the login user name of each image.
4. `list_ssh_keys` or `create_ssh_key` gives the SSH key IDs for the VM.
5. `estimate_vm` returns the hourly and monthly cost of a full VM specification. This step is optional.
6. `create_vm` creates a draft. A draft is not running and is not billed.
7. `provision_vm` starts the VM and billing.
8. `get_vm` and `list_vm_interfaces` show the status and the assigned IP addresses.
9. `terminate_vm` stops the VM. Its disks and public IP addresses stay and continue to be billed.
10. `delete_storage` and `delete_public_ip` remove the retained disks and addresses. To delete a draft that was never provisioned, use `discard_vm`.

VM statuses: `draft`, `new`, `launching`, `launched`, `failed`, `updating`, `terminating`, `terminated`, `suspending`, `suspended`, `restarting`, `softRebooting`, `unknown`.

Rules that agents often get wrong:

- If `create_vm` has no `sshKeyIds`, the draft gets all active SSH keys of the account. An empty list gives no keys. `estimate_vm` requires `sshKeyIds`.
- `launched` can come before the VM has an IP address. Read `list_vm_interfaces` until the interface has a non-empty `assignedIps`. An IP address does not mean that SSH is ready.
- `replace_vm_ssh_keys` changes a draft only. `delete_ssh_key` removes a key from the account but does not remove it from VMs that already run.
- `create_security_group` requires both `ingressRules` and `egressRules`. An empty list denies all traffic in that direction. Before you attach a group, read `list_security_groups` until the group status is `ready`.
- Catalog, offering, and estimate results do not reserve capacity.

## Prices

- `list_vm_prices`, `list_storage_prices`, `list_public_ip_prices`, and `list_vm_offerings` return `priceInfo` with `currency` (`USD`), `pricePerHourPerQty` (a decimal string), and `unit` (`vm`, `gb`, or `ip_address`).
- `estimate_vm` and `estimate_saved_vm` return `hourlyTotal`, `monthlyTotal`, and a `breakdown` for the VM, storage, and public IP address. A month is 730 hours. The `hourlyIncremental` and `monthlyIncremental` fields leave out resources that are already billed.
- `estimate_resource_cost` returns the cost of listed resources per second and for a period. The default period is 3600 seconds.
- The server returns the prices that currently apply to your account. An estimate is not a quote and does not fix the price.

## Tools

### Catalog and prices

| Tool | What it does |
|---|---|
| `list_clusters` | Lists clusters with city and country |
| `list_vm_offerings` | Lists VM configurations in a cluster with vCPU, RAM, CPU family, and your hourly price |
| `get_cluster_options` | Returns the configurations and the disk and IP capacity of a cluster |
| `list_configurations` | Resolves configuration IDs to CPU, RAM, and hardware |
| `list_images` | Lists OS images with the login user name |
| `list_storage_types` | Lists disk types |
| `list_vm_prices`, `list_storage_prices`, `list_public_ip_prices` | Return hourly prices |
| `estimate_vm` | Estimates the cost of a full VM specification |
| `estimate_saved_vm` | Estimates the cost of a saved draft |
| `estimate_resource_cost` | Estimates the cost of listed resources |
| `get_balances` | Returns the account balances |

### Virtual machines

| Tool | What it does |
|---|---|
| `list_vms`, `get_vm` | Return VMs with status and resource IDs |
| `create_vm` | Creates a draft VM |
| `update_vm` | Renames a VM or changes the configuration of a draft |
| `provision_vm` | Starts a draft VM and its billing |
| `restart_vm` | Restarts a running VM |
| `soft_reboot_vm` | Reboots a running VM through the guest OS |
| `terminate_vm` | Terminates a VM and keeps its disks and public IP addresses |
| `discard_vm` | Deletes a draft that was never provisioned |
| `set_vm_cloud_init`, `clear_vm_cloud_init` | Set or remove cloud-init user data on a draft |
| `replace_vm_ssh_keys` | Replaces the SSH keys of a draft |
| `move_vm_cluster` | Moves a draft to another cluster and detaches its disks and IP addresses |

### SSH keys

| Tool | What it does |
|---|---|
| `list_ssh_keys` | Lists SSH public keys |
| `create_ssh_key` | Adds an OpenSSH public key |
| `delete_ssh_key` | Removes a key from the account |

### Disks

| Tool | What it does |
|---|---|
| `list_storages`, `get_storage` | Return disks and their attachment state |
| `create_storage` | Creates a disk, empty or from an image |
| `update_storage` | Renames a disk or increases its size |
| `delete_storage` | Deletes a detached disk and its data |
| `attach_vm_storage` | Attaches a ready disk to a VM |
| `create_vm_data_disk` | Creates a data disk on a draft |
| `create_vm_boot_disk`, `replace_vm_boot_disk` | Create or replace the boot disk of a draft |
| `update_vm_storage` | Renames or resizes a draft's disk |
| `remove_vm_storage` | Detaches a disk from a VM |

### Networks

| Tool | What it does |
|---|---|
| `list_vpcs`, `create_vpc`, `update_vpc`, `delete_vpc` | Manage VPCs |
| `list_subnets`, `create_subnet`, `update_subnet`, `delete_subnet` | Manage subnets |
| `set_default_subnet` | Sets the subnet that new drafts in the VPC use |
| `list_security_groups`, `create_security_group`, `update_security_group`, `delete_security_group` | Manage security groups |
| `list_public_ips`, `create_public_ip`, `update_public_ip`, `delete_public_ip` | Manage public IP addresses |
| `list_vm_interfaces` | Lists a VM's network interfaces and assigned IP addresses |
| `add_vm_interface`, `update_vm_interface`, `remove_vm_interface` | Manage a VM's network interfaces |
| `set_default_vm_interface` | Chooses a VM's default interface |
| `detach_vm_security_group` | Removes the security group from an interface, which can open access |

## What the server does not do

- Manage GPU instances.
- Top up the balance, add payment methods, apply promo codes, or show payment history. Use the console or the [API](../build/api/overview.md).
- Manage API keys or the account profile.
- Read back cloud-init user data. `get_vm` shows only whether a draft has it.
- Change SSH access inside a running VM.
