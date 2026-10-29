---
sidebar_position: 2
---

# SSH keys

SSH keys are account-level credentials used when deploying compute instances. The API lets you register, list, and remove keys so they're available at deploy time.

For authentication and general request format, see the [API introduction](./overview.md).

For complete request and response schemas, see the [API reference](https://api.fluence.dev/docs).

:::tip
You can also manage SSH keys through the [Fluence Console settings](../settings.md).
:::

## Endpoints

Base URL: `https://api.fluence.dev`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/ssh_keys` | List all registered keys |
| `POST` | `/v1/ssh_keys` | Add a new key |
| `DELETE` | `/v1/ssh_keys/{ssh_key_id}` | Remove a key |
| `POST` | `/v1/ssh_keys/delete` | Remove several keys: `{"ids": ["<ssh_key_id>", …]}` |

## Add a key

Send a `name` (lowercase letters, digits and hyphens, up to 25 characters) and the full `publicKey` string, for example `ssh-ed25519 AAAA… user@host`:

```json
{
  "name": "my-key",
  "publicKey": "ssh-ed25519 AAAA…"
}
```

A new key returns **200** with its `id`, `name`, `publicKey`, `algorithm` and `fingerprint`. Use the `id` when you [create a VM](./cpu_cloud.md#deploy-a-vm). If the same key (matched by fingerprint) is already in your account, the request fails with **409**.

:::tip
Read how to [generate SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) if you don't have one yet.
:::

## Delete a key

Delete a key by its `id`, which you can find by listing your keys.

:::info
Removing a key from your account does not affect instances that were already deployed with it. Those instances remain accessible until terminated.
:::
