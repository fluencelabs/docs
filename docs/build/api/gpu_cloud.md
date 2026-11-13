---
sidebar_position: 4
description: "GPU Cloud API v3: find GPU offers and prices, rent GPU containers, VMs, and bare metal on demand or as spot, and manage instances, with permissions, retries, and errors."
---

# GPU Cloud API

The GPU Cloud API finds GPU offers, prices them, and rents GPU containers, VMs, and bare metal servers. The same API manages the instances after you rent them. For workload types, spot instances, statuses, and billing, see [GPU Cloud concepts](../gpu_cloud/overview.md).

- Base URL: `https://api.fluence.dev`. Every path on this page starts with `/v3/gpu`.
- OpenAPI document: [api.fluence.dev/v3/gpu/openapi.json](https://api.fluence.dev/v3/gpu/openapi.json)

The GPU endpoints have their own OpenAPI document. Their error body has `code`, `error`, and `details`, which differs from the rest of the [Fluence API](./overview.md). See [Errors](#errors).

## Authentication and permissions

Send an API key in the `X-API-KEY` header, or an access token in `Authorization: Bearer`. See [Authentication](./overview.md#authentication).

| To | Scope |
|---|---|
| List images, read offers, get quotes, and read your instances | `gpu:read` |
| Create, change, and delete instances, and everything that `gpu:read` allows | `gpu:write` |

When you create a key in the Fluence Console, give it **View & manage** access to **GPU containers** or **GPU VMs & bare metal**. See [Settings](../settings.md). These options give `akash:write` and `spheron:write`, the scopes of the [legacy GPU API](#legacy-gpu-api). A key with either scope also works with `/v3/gpu`, for reading and for changes. A key created before your account had GPU access has no GPU scopes. Create a new key.

`GET /v3/gpu/offers` and `GET /v3/gpu/offers/{id}` also work without credentials. Without credentials, the list shows only offers that you can rent now. The OpenAPI document needs no credentials either. Every other endpoint returns `401` with `unauthenticated` without credentials.

## Endpoints

### Offers

| Method | Path | What it does |
|---|---|---|
| `GET` | `/v3/gpu/offers` | Lists offers: one placement each, with hardware, price, and availability |
| `GET` | `/v3/gpu/offers/{id}` | Returns one offer |
| `GET` | `/v3/gpu/offer-groups` | Groups offers by GPU configuration, with the lowest price of each group |
| `GET` | `/v3/gpu/offer-facets` | Lists the values you can filter by, such as GPU models, countries, and providers, with counts |
| `GET` | `/v3/gpu/offer-picks` | Returns the cheapest offers with at least the GPU memory you need |
| `POST` | `/v3/gpu/instance-quotes` | Shows which offer a request would get and at what price, without renting |

### Instances

| Method | Path | What it does |
|---|---|---|
| `POST` | `/v3/gpu/instances` | Creates an instance |
| `GET` | `/v3/gpu/instances` | Lists your instances |
| `GET` | `/v3/gpu/instances/{id}` | Returns an instance |
| `GET` | `/v3/gpu/instances/by-idempotency-key` | Finds an instance by the `Idempotency-Key` it was created with |
| `PATCH` | `/v3/gpu/instances/{id}` | Renames an instance or changes the container of a running one |
| `DELETE` | `/v3/gpu/instances/{id}` | Ends an instance |
| `GET` | `/v3/gpu/instances/{id}/logs` | Returns the last lines of the instance output |
| `GET` | `/v3/gpu/instances/{id}/events` | Returns recent provider events of the instance |

### Images and the API document

| Method | Path | What it does |
|---|---|---|
| `GET` | `/v3/gpu/default-images` | Lists predefined container images with their ports, environment variables, and SSH user |
| `GET` | `/v3/gpu/openapi.json` | Returns the OpenAPI document of `/v3/gpu` |

The OpenAPI document also has volume endpoints. Volumes are not available yet. See [Volumes](#volumes).

## Find an offer

An offer is one placement that you can rent. It names a provider, a region, a GPU model and count, the rest of the machine, a rental type, and a price. Each offer has a `workload`: `container`, `vm`, or `baremetal`.

Choose the call that matches what you know:

- You know how much GPU memory you need: call `GET /v3/gpu/offer-picks` with `workload` and `minVramGib`, the memory of each GPU in GiB. It returns up to 10 of the cheapest offers, 3 by default. Each item has `requirements` that you pass to the quote and to the create request unchanged. If no offer fits, `items` is empty, `rejected` says why the other offers do not fit, and `largestOnSale` gives the largest GPU memory and GPU count on sale.
- You want to compare GPU models: call `GET /v3/gpu/offer-groups`. Each group has its lowest price and `requirements` for the quote. To create from a group, also set `offerId` to the group's `cheapestOfferId`, or set `maxPricePerHour`.
- You want to see every placement: call `GET /v3/gpu/offers`.

`GET /v3/gpu/offers`, `GET /v3/gpu/offer-groups`, and `GET /v3/gpu/offer-facets` take the same filters:

| Filter | What it matches |
|---|---|
| `workload` | `container`, `vm`, or `baremetal` |
| `rentalType` | `on_demand` or `spot`. Without it, only on-demand offers are listed. |
| `gpuVendor`, `gpuModel`, `gpuInterface` | The GPU as offers name it, for example `nvidia`, `h100`, `sxm`. Case does not matter. |
| `gpuVramGib`, `minGpuVramGib` | Memory of each GPU in GiB, exact or at least |
| `gpuCount`, `minGpuCount` | GPUs per machine, exact or at least |
| `minVcpu`, `minMemoryGib`, `minStorageGib` | Machine size, at least |
| `country`, `regionLabel`, `provider` | Location. `country` is a two-letter ISO code. `provider` takes several names separated by commas. |
| `hostTier` | `dedicated`, `shared`, or `unknown` |
| `cpuArchitecture` | `x86_64`, `arm64`, or `unknown` |
| `maxPricePerHour` | The highest price per instance-hour in USD, as a decimal string, for example `0.50` |
| `available` | `false` also lists offers without capacity left. Without credentials, only offers on sale are listed. |
| `q` | Text in the GPU vendor, GPU model, provider, or region label |

To sort, set `sort` to `price`, `vram`, `vcpu`, `memory`, `storage`, or `availability`, and `order` to `asc` or `desc`. Without `sort`, the cheapest offers come first.

Name GPU models exactly as offers name them, for example `rtx4090` or `h100`. `GET /v3/gpu/offer-facets` lists the models on sale. A filter with an unknown model returns an empty list. In a quote or a create request, an unknown model in `requirements.gpu.model` returns `invalid_input`.

```sh
curl "https://api.fluence.dev/v3/gpu/offers?workload=vm&rentalType=spot&minGpuVramGib=80"
```

### Read an offer

Besides the hardware and the price, an offer has these fields:

- `offerKind`: `provider_sku` is an item of a provider catalog, and `host_offer` is one host. `market_profile` is an Akash offer that fixes the hardware profile and the highest bid, but not the host. Akash picks the host from bids when you create the instance.
- `hostTier`: `dedicated`, `shared`, or `unknown`.
- `region`, `dataCenter`, and `origin`: where the machine runs.
- `topology`: GPU links, such as NVLink.
- `provisioning`: how long the instance usually takes to be ready, in `typicalSeconds`, `upperSeconds`, or both. It can be `null`.
- `availability`: `status` is `available`, `limited`, `sold_out`, or `unknown`. `lastOutOfStockAt` is the last time the provider refused this offer for lack of capacity. Such an offer stays on sale, and the next launch can succeed.
- `capabilities`: what an instance of the offer supports. `logs`, `events`, and `update` say whether you can read logs and events and change the container. `portProtocols`, `portRequired`, `environment`, and `privateRegistry` limit the container settings. See [Create the instance](#create-the-instance).
- `osImages`: the OS images that a VM or bare metal offer accepts. An empty list means the provider takes any name, and a wrong name fails only at the provider.
- `preemption`: only for spot offers. `noticeSeconds` is the warning the provider gives before it takes the machine back, and `0` means no warning. `dataSurvives` says whether the disk survives. `signal` is `explicit` when the provider reports the take-back, and `inferred` when Fluence detects it from the machine stopping.
- `groupKey`: the offer group of the offer, as in `GET /v3/gpu/offer-groups`.

### Offer prices

Every offer has a `price`. Here is the price of an 8 × RTX 4090 VM offer from `GET /v3/gpu/offers`:

```json
{
  "currency": "USD",
  "unit": "instance",
  "perHour": "4.2240",
  "gpuHour": "0.5280",
  "stepSeconds": 60,
  "perStep": "0.0704",
  "minimumPeriodSeconds": 1200,
  "minimumCharge": "1.4080",
  "components": [{ "kind": "gpu", "perHour": "4.2240" }]
}
```

- `perHour` is the full price of the instance per hour in USD. `gpuHour` is the same price per GPU, so you can compare offers with different GPU counts.
- `stepSeconds` is the billing step, and `perStep` is the price of one step.
- `minimumCharge` is the least you pay for an instance that starts running. It covers `minimumPeriodSeconds` of running time.

Amounts are decimal strings. See [Billing model](../gpu_cloud/overview.md#billing-model).

## Rent an instance

### Get a quote

Send `POST /v3/gpu/instance-quotes` with the same `requirements` and workload settings that you plan to create. The quote returns:

- `match`: the offer that the create request would select, with its price. `null` if no offer fits.
- `alternatives`: up to 3 other offers that fit.
- `rejected`: why other offers do not fit, for example `price_ceiling`, `out_of_stock`, or `port_required`, with the number of offers for each reason.

The quote also checks the image, the ports, and the environment variables. A quote holds nothing, and prices can change before you create the instance.

### Create the instance

Send `POST /v3/gpu/instances` with an `Idempotency-Key` header. The body has:

- `name`: 1 to 25 characters, lowercase letters, digits, and hyphens.
- `requirements`:
  - `workload`: `container`, `vm`, or `baremetal`.
  - `gpu`: `vendor`, `model`, and `count`, as offers name them.
  - `offerId` to rent one exact offer, or `maxPricePerHour` to let the API choose the cheapest matching offer at or below this price. One of them is required. With `offerId`, the other requirements must still fit the offer.
  - `rentalType`: `on_demand` or `spot`. On-demand is the default.
  - Optional limits, such as `minVcpu`, `minMemoryGib`, `minStorageGib`, `region`, `providers`, `hostTier`, and `cpuArchitecture`.
- Exactly one of `container`, `vm`, or `baremetal`, matching the workload.

For a container:

- `image` is required: an image reference, as for `docker pull`. `GET /v3/gpu/default-images` lists predefined images with the ports and environment variables they expect.
- `expose` lists the ports to open, each with `port` and `protocol`: `tcp`, `udp`, or `http`. The offer's `capabilities.portProtocols` lists the protocols it accepts. Where `capabilities.portRequired` is `true`, add at least one port. You cannot change the ports after creation.
- `environment` holds up to 64 variables, where the offer's `capabilities.environment` is `true`. Other offers refuse every variable except `SSH_PUBKEY`. A name starts with an uppercase letter and has uppercase letters, digits, and underscores. Set `secret: true` to hide a value. The API never returns secret values.
- `startupCommand` replaces the entry point of the image.
- `registryCredentials` with `host`, `username`, and `password` pulls an image from a private registry, where the offer's `capabilities.privateRegistry` is `true`.
- `sshKey` passes a public SSH key to the container in the `SSH_PUBKEY` variable. The predefined images read it. If you also define `SSH_PUBKEY` in `environment`, the API refuses the request.

For a VM or a bare metal server, `osImage` and `sshKey` are required. If the offer lists `osImages`, `osImage` must be one of them.

```json
{
  "name": "train-1",
  "requirements": {
    "workload": "vm",
    "rentalType": "on_demand",
    "gpu": { "vendor": "nvidia", "model": "rtx4090", "count": 8 },
    "offerId": "<OFFER_ID>"
  },
  "vm": {
    "osImage": "<ONE_OF_THE_OFFER_OS_IMAGES>",
    "sshKey": "ssh-ed25519 AAAA... user@host"
  }
}
```

Your balance must cover the minimum charge of the new instance on top of the amount that your running resources already hold. The quote shows the minimum charge in `match.price.minimumCharge`. If the balance is too low, the API returns `insufficient_balance` with the required and the available amounts.

The API answers `201` with the new instance. A refused request returns an error, for example `insufficient_balance`, `no_offer_matches`, or `fleet_too_large`. See [Errors](#errors).

### Retry a create request

The `Idempotency-Key` is 1 to 128 characters: letters, digits, `.`, `_`, `:`, and `-`.

- The same key with the same body returns the same instance with `200`. It does not create a second one.
- The same key with a different body returns `idempotency_key_reused`.
- While the first request is still running, a repeat returns `request_in_progress` with a `Retry-After` header.
- A refused create stays refused for its key. To try again, for example after a top-up, use a new key.

If the response is lost, send `GET /v3/gpu/instances/by-idempotency-key` with the same `Idempotency-Key` header. It returns the instance if the request created one, and `404` with `not_found` if it did not. Do not put the key in the URL.

### Wait for the instance

Read `GET /v3/gpu/instances/{id}` every few seconds until `status` is `running`, or `isTerminal` is `true`.

- When the instance is `running`, `connection` tells you how to reach it. For a VM or a bare metal server, `connection.sshCommand`, when present, is the ready SSH command. Otherwise use `connection.host`, `connection.port`, and `connection.user`. For a container, `connection.ports` maps each exposed port to an `externalPort` on `connection.host`.
- When the instance is `failed` or `ended`, `statusDetail`, `failure.code`, and `failure.reason` say why.

If the instance provisions longer than the offer's `provisioning.upperSeconds`, read its events.

### Instance fields

An instance has the fields of its request, and these fields:

- `status`: see [Instance statuses](../gpu_cloud/overview.md#instance-statuses).
- `statusDetail`: why the instance is in its status. Some values:
  - `awaiting_bids`: Akash collects bids for the instance.
  - `provider_rate_limited`: the provider limits how often instances are created. The launch continues by itself, and nothing is billed before the instance runs.
  - `out_of_stock`: the provider had no capacity for the offer. Nothing is billed, and another offer can succeed.
  - `user_requested`: you deleted the instance.
  - `preempted`: the provider took a spot instance back. `failure.code` is then `provider_terminated`, and `failure.reason` is `preempted`.
  - `provider_terminated`: the provider ended the instance.
- `isBilling`: `true` while the instance is billed.
- `isTerminal`: `true` for `ended` and `failed`.
- `placement`: the offer that the instance runs on, with its provider, region, hardware, and capabilities.
- `price`: the price fixed when the instance was created.
- `charged`: the amount charged so far in `total`, as of `asOf`.
- `actions`: what you can do with the instance now: `rename`, `delete`, `update`, `logs`, and `events`.
- `createdVia`: `v3`, or `legacy` for instances created through the [legacy GPU API](#legacy-gpu-api).
- `createdAt`, `activatedAt`, and `endedAt`: when the instance was created, started running, and ended.

## Manage instances

### List instances

`GET /v3/gpu/instances` lists every instance you created, including ended and failed ones. Instances that you created through the [legacy GPU API](#legacy-gpu-api) are in the list too, with `createdVia: "legacy"`. These filters narrow the list:

- `live=true` lists only instances that are not ended or failed. `live=false` lists only ended and failed ones.
- `status` takes one status or several, separated by commas.
- `workload`, `rentalType`, `provider`, `country`, and `createdVia` match those fields.
- `q` matches text in the instance ID, name, or GPU model.

To sort, set `sort` to `createdAt`, `name`, `status`, `pricePerHour`, or `activatedAt`. The newest instances come first by default.

### Rename an instance or change a container

`PATCH /v3/gpu/instances/{id}` changes:

- `name`, at any time until the instance starts terminating.
- For a running container, if the offer supports updates: `container.image`, `container.environment`, `container.startupCommand`, and `container.registryCredentials`. Omitted fields stay as they are. `container.environment` replaces the whole list of variables. To keep a secret value, list its name with `secret: true` and no value.

A container change answers `200` with `status: updating`. The instance returns to `running` when the provider applies the change. The same change sent again while it is applied returns the instance. A different change returns `update_in_progress`.

Nothing else changes after creation: not the offer, price, workload, or ports, and not the OS image or SSH key of a VM or bare metal server. To change them, create a new instance and delete the old one.

### Read logs and events

`GET /v3/gpu/instances/{id}/logs` and `GET /v3/gpu/instances/{id}/events` work when the instance's `actions` list `logs` or `events`. Otherwise, the API returns `409` with `unsupported_by_provider` or `instance_state_conflict`. Some providers return logs and events while the instance is still provisioning, so you can see why a workload does not start.

Add `tail=N` to get the last `N` lines. The provider can return fewer.

### Delete an instance

`DELETE /v3/gpu/instances/{id}` ends the instance. It answers `202` when it starts closing the instance, and `200` if the instance is already closing or ended, so you can repeat it. Billing stops when you delete the instance: `isBilling` becomes `false` and `endedAt` is set, while `status` can still read `terminating` for a short while. The local disk of the instance and its data are deleted.

After you delete an instance, read it until `isTerminal` is `true`. After an instance ends, `charged.total` can read `0` or grow for a few minutes. It is final when it is above `0` and does not change between two reads a minute apart.

## Volumes

:::warning
Volumes are not available yet. The volume API may change before it opens.
:::

A volume is block storage that outlives instances. The OpenAPI document has the volume endpoints under `/v3/gpu/volume-offers`, `/v3/gpu/volume-quotes`, and `/v3/gpu/volumes`. Until volumes open, `GET /v3/gpu/volume-offers` returns an empty list and you cannot create a volume. Offers show `capabilities.volumes: 0`.

## Errors

Every error has a `code`, an `error` message, and a `details` list:

```json
{ "code": "unauthenticated", "error": "Authentication is required.", "details": [] }
```

Write your error handling against `code`. These codes are common:

| Code | Meaning |
|---|---|
| `invalid_input` | A field or query parameter is invalid. A `field` detail names it. |
| `unauthenticated`, `api_key_expired` | The credentials are missing, invalid, or expired |
| `insufficient_scope` | The key lacks `gpu:read` or `gpu:write` |
| `instance_not_found`, `offer_not_found` | No such instance in your account, or no such offer on sale |
| `no_offer_matches` | No offer fits the requirements. `selection` details show how many offers each reason excluded. |
| `insufficient_balance` | Your balance does not cover the minimum charge of this instance. A `balance` detail has `required` and `available` amounts in USD, and the `window` in seconds that the amounts are counted for. |
| `fleet_too_large` | You have reached the limit of live instances on your account |
| `idempotency_key_reused`, `request_in_progress` | See [Retry a create request](#retry-a-create-request) |
| `update_in_progress`, `instance_state_conflict` | The instance is busy or in a status that does not allow the action |
| `unsupported_by_provider` | The provider of this instance does not support the action |
| `rate_limited` | Too many requests. Wait for the number of seconds in `Retry-After`. |
| `creation_disabled`, `provider_unavailable` | Creating instances is turned off for a while, or the provider is unavailable. Retry later. |

The full list is in the `ErrorBody` schema of the OpenAPI document. A code that is not in the list is newer than the document: act on the HTTP status. The same applies to other enumerations, such as `status`, `statusDetail`, and `offerKind`: do not reject a value that you do not know.

Every response has an `X-Request-Id` header. Quote it when you contact support. You can send your own `X-Request-Id`, 1 to 64 letters, digits, and hyphens, and the API returns it.

Lists take `page` and `perPage` (up to 200, 50 by default) and return `items` and `pagination`.

## Legacy GPU API

:::warning
The legacy GPU API is deprecated. Use `/v3/gpu` for new integrations, and move existing integrations to it.
:::

The earlier GPU API under `https://api.fluence.dev/gpu/...` still works for existing integrations, and its paths and responses do not change. New instances rented through the legacy API are billed the same way as `/v3/gpu` instances: by the billing step and minimum of their offer.

The legacy API needs the scope `akash:write` for containers, or `spheron:write` for VMs and bare metal, on the endpoints below except `GET /gpu/default-images/`. The endpoints under `/gpu/billing/` need valid credentials only. The legacy API has these endpoints for instances:

| Method | Path | What it does |
|---|---|---|
| `GET` | `/gpu/plans/`, `/gpu/plans/vms`, `/gpu/plans/baremetal` | Lists container, VM, and bare metal plans |
| `POST`, `GET` | `/gpu/instances/` | Deploys or lists containers |
| `GET`, `PUT`, `DELETE` | `/gpu/instances/{instance_id}` | Returns, updates, or terminates a container |
| `GET` | `/gpu/instances/{instance_id}/logs`, `/gpu/instances/{instance_id}/events` | Returns the output or the events of a container |
| `POST`, `GET` | `/gpu/instances/vms`, `/gpu/instances/baremetal` | Deploys or lists VMs or bare metal servers |
| `GET`, `PUT`, `DELETE` | `/gpu/instances/vms/{instance_id}`, `/gpu/instances/baremetal/{instance_id}` | Returns, renames, or terminates a VM or a bare metal server |
| `GET` | `/gpu/default-images/` | Lists the predefined container images |

Legacy errors have a `detail` field instead of `code`.
