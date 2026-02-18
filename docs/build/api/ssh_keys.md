---
sidebar_position: 2
---

# SSH keys

SSH keys are account-level credentials used when deploying compute instances. The API lets you register, list, and remove keys so they're available at deploy time.

For authentication and general request format, see the [API introduction](./overview.md).

For complete request/response schemas, see the [API reference](https://api.fluence.dev/) (Swagger UI).

:::tip
You can also manage SSH keys through the [Fluence Console settings](../settings.md).
:::

## Endpoints

Base URL: `https://api.fluence.dev`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/ssh_keys` | List all registered keys |
| `POST` | `/ssh_keys` | Add a new key |
| `DELETE` | `/ssh_keys` | Remove a key |

## Add a key

Provide a friendly `name` and the full `publicKey` string. If the key already exists in your account (matched by fingerprint), the endpoint returns **200** with the existing key details instead of creating a duplicate. A newly created key returns **201**.

:::tip
Read how to [generate SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) if you don't have one yet.
:::

## Delete a key

Deletion uses the key's `fingerprint` as the identifier — not its name. You can find fingerprints by listing your keys first.

:::info
Removing a key from your account does not affect instances that were already deployed with it. Those instances remain accessible until terminated.
:::
