---
sidebar_position: 4
description: "GPU Cloud API: list GPU plans, deploy and manage GPU containers, VMs, and bare metal servers, with permissions, rate limits, and errors."
---

# GPU Cloud API

The GPU Cloud API lets you list GPU plans and deploy GPU containers, VMs, and bare metal servers. The same API manages them after deployment. For workload types, statuses, and billing, see [GPU Cloud concepts](../gpu_cloud/overview.md).

- Base URL: `https://api.fluence.dev/gpu`
- OpenAPI document: [api.fluence.dev/gpu/api-docs/openapi.json](https://api.fluence.dev/gpu/api-docs/openapi.json)
- Interactive reference: [api.fluence.dev/gpu/api-docs](https://api.fluence.dev/gpu/api-docs)

The GPU API is a separate service. It has no v3 version, and its requests, responses, and errors differ from the rest of the [Fluence API](./overview.md).

## Authentication and permissions

Send an API key in the `X-API-KEY` header, or an access token in `Authorization: Bearer`. The default images endpoint needs no credentials.

| Workload | Scope |
|---|---|
| Containers | `akash:write` |
| VMs and bare metal servers | `spheron:write` |

There is no read-only scope for GPU. To list or read GPU instances, a key needs the same scope as to deploy them. A key with the **Read only** preset of the Fluence Console cannot use the GPU API.

New accounts don't have GPU permissions. See [Account access](../overview.md#account-access).

## Endpoints

### Plans

| Method | Path | What it does |
|---|---|---|
| `GET` | `/gpu/plans/` | Lists container plans |
| `GET` | `/gpu/plans/vms` | Lists VM plans |
| `GET` | `/gpu/plans/baremetal` | Lists bare metal plans |

Keep the trailing slash in `/gpu/plans/`, `/gpu/instances/`, and `/gpu/default-images/`. Without it, the API answers with a redirect to an `http://` URL.

### Containers

| Method | Path | What it does |
|---|---|---|
| `POST` | `/gpu/instances/` | Deploys a container |
| `GET` | `/gpu/instances/` | Lists containers |
| `GET` | `/gpu/instances/{instance_id}` | Returns a container |
| `PUT` | `/gpu/instances/{instance_id}` | Updates a container |
| `DELETE` | `/gpu/instances/{instance_id}` | Terminates a container |
| `GET` | `/gpu/instances/{instance_id}/logs` | Returns the container output |
| `GET` | `/gpu/instances/{instance_id}/events` | Returns the cluster events of the container |

### VMs and bare metal servers

VMs and bare metal servers use the same requests and responses. For bare metal, replace `vms` with `baremetal` in the path.

| Method | Path | What it does |
|---|---|---|
| `POST` | `/gpu/instances/vms` | Deploys a VM |
| `GET` | `/gpu/instances/vms` | Lists VMs |
| `GET` | `/gpu/instances/vms/{instance_id}` | Returns a VM |
| `PUT` | `/gpu/instances/vms/{instance_id}` | Renames a VM |
| `DELETE` | `/gpu/instances/vms/{instance_id}` | Terminates a VM |

### Images

| Method | Path | What it does |
|---|---|---|
| `GET` | `/gpu/default-images/` | Lists the predefined container images |

## Choose a plan

- Container plans come as a flat list. Each plan groups offers that can run in different locations. To deploy, pass the plan ID and, optionally, a location.
- VM and bare metal plans are grouped by GPU model and then by GPU count. Each group has options, each in one location. To deploy, pass the option ID as `plan_id`. Each option lists `os_options`. Pass one of them as `os_image`.

## Deploy an instance

Your balance must cover at least 1 hour of the instance's price. Otherwise the API refuses the request.

### Deploy a container

Send `POST /gpu/instances/` with at least a plan ID, an instance name, and container settings. The settings need an image and at least one exposed port. You can also pass environment variables, a start command, private registry credentials, a location, and an SSH key.

- Only port 80 can use the `http` protocol. Other ports use `tcp` or `udp`.
- A container can have up to 10 exposed ports and 64 environment variables.
- `SSH_PUBKEY` is reserved for the SSH key. If you pass an SSH key and also define `SSH_PUBKEY`, the deployment fails.
- Private registries can be `docker.io` or `ghcr.io`.
- `GET /gpu/default-images/` lists the predefined images.

### Deploy a VM or a bare metal server

Send `POST /gpu/instances/vms` or `POST /gpu/instances/baremetal` with the option ID as `plan_id`, an instance name, an SSH key, and an `os_image`. If `os_image` is not in the `os_options` of the option, the error lists the valid values.

### After the request

Provisioning usually takes 2 to 3 minutes. Read the instance until its status is `ACTIVE`. Then its connection details are in the response: `ssh_connection` for a VM or a bare metal server, and `network.domain` with `network.forwarded_ports` for a container.

If the response to a deploy request is lost, list your instances before you send it again. A repeated request can create a second instance.

## Manage instances

### Update a container

`PUT /gpu/instances/{instance_id}` replaces the whole container configuration. Send every field, not only the ones you change. You cannot change the exposed ports. The ports from the deployment stay. The API refuses an update while a previous update is still being applied.

### Rename a VM or a bare metal server

`PUT` on a VM or bare metal instance changes only its name. To change anything else, terminate the instance and deploy a new one.

### Debug a container

- `GET /gpu/instances/{instance_id}/logs` returns the container output. Add `?last=N` to get the last `N` lines.
- `GET /gpu/instances/{instance_id}/events` returns cluster events, such as scheduling, image pulls, and container starts. Read them when a container doesn't start.

### Terminate an instance

Send `DELETE` to the instance path. You can terminate only an instance with the status `ACTIVE`. Billing stops, and the unused part of the current hour is not returned.

## Rate limits

The API limits requests per API key, or per IP address for requests without a key.

| Requests | Per second | Per minute |
|---|---|---|
| `GET` | 60 | 100 |
| `POST`, `PUT`, `DELETE` | 30 | 50 |

Every response has the headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. Over the limit, the API returns `429` with a `Retry-After` header.

## Errors

Errors have a `detail` field.

Validation errors return `422`, and `detail` is a list with one object per invalid field:

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "container_settings", "expose", 0, "port"],
      "msg": "Value error, Port must be between 1 and 65535",
      "input": "999999999",
      "ctx": { "error": {} }
    }
  ]
}
```

Other errors return `detail` as a string, for example:

```json
{
  "detail": "Invalid API key"
}
```

A `503` means that the authentication service is unavailable, or that deploying new instances is turned off for a while. Retry later.
