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
| Scope | CPU virtual machines, disks, VPCs, subnets, security groups, public IP addresses, SSH keys, catalog, prices, GPU Cloud instances and offers, and Cloud Agents |

Each tool calls one operation of the Fluence public API v3, GPU Cloud API (`/v3/gpu`), or Cloud Agents API (`/v3/agents`) with your API key. A tool result is the same JSON that the API returns.

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

For local CPU and account tools, `tools/list` returns only the tools that your key has every permission for. GPU Cloud (`gpu_*`) and Cloud Agents (`agents_*`) tools are always returned by `tools/list`, and the server checks key scopes and service connection when you call them. If a client calls a tool without a required permission, CPU and account tools return `forbidden`, and GPU Cloud or Cloud Agents tools return `insufficient_scope`. A key needs all permissions listed for a tool. `vms:write` does not include `vms:read`, while `gpu:write` also allows `gpu:read` operations.

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
| `gpu:read` | `gpu_listGpuOffers`, `gpu_getGpuOffer`, `gpu_listGpuOfferGroups`, `gpu_getGpuOfferFacets`, `gpu_pickGpuOffers`, `gpu_listGpuDefaultImages`, `gpu_quoteGpuInstance`, `gpu_listGpuInstances`, `gpu_getGpuInstance`, `gpu_getGpuInstanceLogs`, `gpu_getGpuInstanceEvents` |
| `gpu:write` | `gpu_createGpuInstance`, `gpu_updateGpuInstance`, `gpu_deleteGpuInstance` (also grants `gpu:read` tools) |
| `agents:read` | `agents_defaults`, `agents_models`, `agents_vm_sizes`, `agents_list_environments`, `agents_get_environment`, `agents_list`, `agents_get`, `agents_context`, `agents_log`, `agents_messages`, `agents_message`, `agents_events`, `agents_list_presets`, `agents_get_preset` |
| `agents:run` | `agents_create`, `agents_send`, `agents_interrupt`, `agents_stop` |
| `agents:write` | `agents_create_preset`, `agents_replace_preset`, `agents_delete_preset` |

How the console's permission presets and services map to these permissions:

- **Read only** gives the `*:read` scopes for VMs, disks, VPCs, subnets, security groups, and public IP addresses, plus `ssh_key:list`, `api_key:list`, `billing:get_history`, and `billing:get_spending_history`. It does not give `clusters:read`, `vm:list`, or `prices:read`, so a Read only key cannot use the catalog, price, or estimate tools.
- **Custom scopes** with **Virtual machines** set to **Manage** gives `vms:read` and `vms:write`, and adds `clusters:read`, `vm:list`, and `prices:read`.
- For GPU Cloud tools (`gpu_*`), a key with legacy `akash:write` or `spheron:write` scopes also works.
- All Cloud Agents tools (`agents_*`) require **Cloud agents** to be connected to your account in the Fluence Console. Calling them before connecting returns `managed_service_not_connected` with a `connectUrl`.
- The console does not offer `account:read`, so `get_balances` does not work with a key created in the console.

A key can only receive permissions that your account has.

## Arguments

- Resource IDs are camelCase arguments: `vmId`, `clusterId`, `storageId`, `publicIpId`, `vpcId`, `subnetId`, `securityGroupId`, `sshKeyId`, `interfaceId`, `id` (for GPU offers, GPU instances, and Cloud Agents presets and environments), `agentId`, and `messageId`.
- The request body of the API operation goes in the `spec` argument. The server rejects unknown top-level arguments.
- Names of CPU VMs, disks, VPCs, subnets, security groups, public IP addresses, SSH keys, and GPU instances are 1 to 25 characters: lowercase letters, digits, and hyphens. A CPU resource name starts and ends with a letter or digit.
- Paginated list tools accept `page` (default 1) and `perPage` (default 50, maximum 200), or `limit` and `offset` for Cloud Agents list tools.

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
| `managed_service_not_connected` | Cloud Agents is not connected to your account. Open `connectUrl` in the error object to connect it in the Fluence Console, then retry. |
| `managed_service_unavailable` | The upstream GPU Cloud or Cloud Agents service could not be reached. Retry later. |
| `output_too_large` | The result was larger than the server returns. A write may have finished. |
| `idempotency_conflict` | A previous call used the same `requestKey` with different arguments |
| `request_in_progress` | A call with the same `requestKey` is still running. Wait for the time in `retryAfter`. |
| `idempotent_resource_gone` | The resource created under this `requestKey` has been deleted since |
| `vm_not_draft` | The operation needs a VM in the `draft` status |

Upstream calls (`gpu_*` and `agents_*`) can also return upstream refusal codes alongside an `upstreamStatus` field, such as `insufficient_scope`, `no_offer_matches`, `insufficient_balance`, and `idempotency_key_reused`. Inspect `code` and `upstreamStatus` before retrying.

## Limits

- Each server instance runs at most 2 tool calls at a time for one user and 8 in total. A call over the limit returns `busy` and does not start. Wait for a running call to finish, then retry with the same arguments.
- MCP calls and API calls made with the same key share one request budget.
- Local CPU writes keep running after a timeout or after the client disconnects. Upstream writes (`gpu_*` and `agents_*`) are cancelled when the upstream write timeout expires, though the upstream operation may already have succeeded. After a timeout on an upstream write, replay with the same `requestKey` if the tool takes one, or read the resource state before retrying. Reads stop when the client disconnects.

## Retries

Twelve tools take a required `requestKey` argument: `create_vm`, `create_storage`, `create_vm_data_disk`, `create_vm_boot_disk`, `create_public_ip`, `create_vpc`, `create_subnet`, `create_security_group`, `terminate_vm`, `gpu_createGpuInstance`, `agents_create`, and `agents_send`. The key is 1 to 128 characters: letters, digits, `.`, `_`, `:`, and `-`. If the outcome of a call is unknown, call the tool again with the same `requestKey` and the same arguments. The server returns the result of the first call and does not create a duplicate resource or message. The same key works across MCP and the API.

For `gpu_createGpuInstance`, a refused creation (such as `insufficient_balance` or `no_offer_matches`) stays refused for that `requestKey`. Fix the cause and retry with a new `requestKey`.

Other writes have no `requestKey`, for example `provision_vm`, `create_ssh_key`, interface changes, `gpu_updateGpuInstance`, `agents_create_preset`, and deletions. If the outcome of such a call is unknown, read the resource state before you retry.

## Tool annotations

Every tool sets `readOnlyHint`, `destructiveHint`, and `idempotentHint`, and `openWorldHint` is `false`.

- `readOnlyHint` is `true` for list, get, and estimate tools, including `gpu_quoteGpuInstance`.
- `destructiveHint` is `true` for tools that start billing, terminate or delete resources, or change network access. Clients can use it to ask for confirmation. `create_vm` is not destructive because it creates an unbilled draft, while `provision_vm`, `gpu_createGpuInstance`, `gpu_deleteGpuInstance`, `agents_create`, `agents_stop`, and `agents_delete_preset` are destructive.
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

### GPU Cloud

GPU Cloud tools need `gpu:read` for discovery, quotes, and reads, and `gpu:write` to create, update, or delete instances (`gpu:write` also allows `gpu:read` calls). Quote an instance with `gpu_quoteGpuInstance` before calling `gpu_createGpuInstance`, and keep the same `requirements` and workload between the two calls. For full field rules, see the [GPU Cloud API](../build/api/gpu_cloud.md).

| Tool | What it does |
|---|---|
| `gpu_pickGpuOffers` | Returns the cheapest offers on sale with at least `minVramGib` per GPU and ready `requirements` |
| `gpu_listGpuOffers` | Lists sellable GPU offers with placement, hardware, price, and availability |
| `gpu_getGpuOffer` | Reads one GPU offer by `id` |
| `gpu_listGpuOfferGroups` | Groups GPU offers by workload, GPU model, memory, GPU count, and rental mode with lowest prices |
| `gpu_getGpuOfferFacets` | Lists valid filter values (including exact `gpuModels` vendor and model pairs) and offer counts |
| `gpu_listGpuDefaultImages` | Lists predefined GPU container images with default ports, environment variables, and `sshUser` |
| `gpu_quoteGpuInstance` | Previews which offer a `spec` would pick and its `perHour` and `minimumCharge` without reserving or charging |
| `gpu_createGpuInstance` | Creates a GPU instance (`requestKey` and `spec` required). Bills once `status` reaches `running`. |
| `gpu_listGpuInstances` | Lists your GPU instances with status, workload, rental type, and search filters |
| `gpu_getGpuInstance` | Reads one GPU instance by `id` (supports `wait` and `since` long polling) |
| `gpu_getGpuInstanceLogs` | Reads recent output lines of a GPU instance (`tail` optional) when `actions` includes `logs` |
| `gpu_getGpuInstanceEvents` | Reads recent provider events of a GPU instance (`tail` optional) when `actions` includes `events` |
| `gpu_updateGpuInstance` | Renames a GPU instance or updates supported container settings (ports stay fixed on containers) |
| `gpu_deleteGpuInstance` | Stops and deletes a GPU instance and its local disk. Poll `gpu_getGpuInstance` until `isTerminal` is `true`. |

### Cloud Agents

Cloud Agents tools require **Cloud agents** to be connected to your account in the Fluence Console. Read tools need `agents:read`, agent lifecycle tools need `agents:run`, and preset write tools need `agents:write`. See [Cloud agents concepts](../build/cloud_agents/overview.md).

| Tool | What it does |
|---|---|
| `agents_defaults` | Returns the published bounds and defaults for per-turn `budget_seconds` |
| `agents_models` | Lists AI models available across your live machines |
| `agents_vm_sizes` | Lists VM size classes available for a cluster |
| `agents_list_environments`, `agents_get_environment` | List or read your agent environments (secret names only, never values) |
| `agents_list_presets`, `agents_get_preset` | List or read your presets |
| `agents_create_preset`, `agents_replace_preset`, `agents_delete_preset` | Create, replace, or delete a preset |
| `agents_list`, `agents_get` | List your cloud agents (filter by `label` or `instanceId`) or read one agent by `agentId` |
| `agents_create` | Launches a cloud agent from a preset (`requestKey` and `spec` required; supports repo-less launch via omitted `repo_url` or `without_repo: true`) |
| `agents_send` | Sends a message to an agent (`agentId`, `requestKey`, and `spec` required; `delivery`: `steer` or `queue`) |
| `agents_interrupt` | Interrupts an agent's running turn and keeps the agent alive in idle state |
| `agents_stop` | Permanently stops an agent and releases its machine |
| `agents_messages`, `agents_message` | List messages exchanged with an agent or read one message by `messageId` |
| `agents_context` | Reads an agent's current context usage |
| `agents_log` | Reads an agent's log entries |
| `agents_events` | Lists an agent's lifecycle events (`after`, `kinds`, and `limit` optional) |

## What the server does not do

- Top up the balance, add payment methods, apply promo codes, or show payment history. Use the console or the [API](../build/api/overview.md).
- Manage API keys or the account profile.
- Read back cloud-init user data. `get_vm` shows only whether a draft has it.
- Change SSH access inside a running VM.
