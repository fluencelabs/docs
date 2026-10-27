---
sidebar_position: 2
description: Add, list, and delete the SSH public keys of a Fluence account with the API v3, and choose which keys a VM gets.
---

# SSH keys

SSH keys belong to your account. A CPU VM gets the keys you choose when you create its draft. You can also manage keys in the Fluence Console. See [Settings](../settings.md#ssh-keys). For authentication and permissions, see the [API overview](./overview.md).

## Endpoints

| Method | Path | Scope | What it does |
|---|---|---|---|
| `GET` | `/v3/ssh-keys` | `ssh_key:list` | Lists your keys. Accepts `ids`, `page`, and `perPage`. |
| `POST` | `/v3/ssh-keys` | `ssh_key:create` | Adds a key |
| `DELETE` | `/v3/ssh-keys/{ssh_key_id}` | `ssh_key:remove` | Deletes a key |

## Add a key

Send a `name` and the full public key in OpenSSH format. The name is 1 to 25 characters: lowercase letters, digits, and hyphens.

```sh
curl -X POST https://api.fluence.dev/v3/ssh-keys \
  -H "X-API-KEY: $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-key", "publicKey": "ssh-ed25519 AAAA... user@host"}'
```

The response is `201` with the key's `id`, `name`, `publicKey`, `algorithm`, and `fingerprint`.

This request has no `Idempotency-Key`. If the response is lost, list your keys and look for the fingerprint before you send it again.

Never send a private key. If you don't have a key pair yet, see [Generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) in the GitHub docs.

## Choose the keys of a VM

When you create a VM draft with `POST /v3/vms`:

- Leave out `sshKeyIds` to add all active SSH keys of your account.
- Pass a list of key IDs to add only those keys.
- Pass `[]` to add no keys.

To change the keys of a draft, use `PUT /v3/vms/{vm_id}/ssh-keys` with `{"sshKeys": ["<ssh_key_id>"]}`. After the VM is provisioned, change its keys inside the guest OS. See [CPU Cloud API](./cpu_cloud.md).

## Delete a key

Delete a key by its `id`:

```sh
curl -X DELETE https://api.fluence.dev/v3/ssh-keys/<ssh_key_id> \
  -H "X-API-KEY: $FLUENCE_API_KEY"
```

The response is `200` with the deleted key. Deleting a key from your account does not remove it from VMs that already have it. To remove access to a running VM, delete the key from `~/.ssh/authorized_keys` on the VM.

## Earlier API versions

The v1 endpoints still work: `GET /v1/ssh_keys`, `POST /v1/ssh_keys`, `DELETE /v1/ssh_keys/{ssh_key_id}`, and `POST /v1/ssh_keys/delete` to delete several keys at once. In v1, adding a key returns `200`, and adding a key that is already in the account returns `409`.
