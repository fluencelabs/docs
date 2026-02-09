---
sidebar_position: 2
---

# Manage SSH keys

The Fluence API provides endpoints for managing SSH keys registered in your account.

In this guide, you'll learn how to:

1. List your registered SSH keys
2. Add new SSH keys to your account
3. Remove SSH keys when they're no longer needed

:::tip
You can also manage SSH keys through the [Fluence Console settings](../../settings/settings.md).
:::

## List SSH keys

To view all SSH keys registered in your account, use the following API endpoint:

```sh
GET https://api.fluence.dev/ssh_keys
```

This endpoint returns an array of SSH key objects representing all the keys you've registered.

**Example response:**

```json
[
  {
    "name": "name-ed25519",
    "fingerprint": "SHA256:fingerprint",
    "algorithm": "ssh-ed25519",
    "comment": "comment",
    "publicKey": "ssh-ed25519 key",
    "active": true,
    "createdAt": "+002025-03-28T16:26:38.808750000Z"
  }
]
```

### Response fields

Each SSH key object includes the following information:

- **`active`**: Indicates whether the key is currently active and can be used
- **`algorithm`**: The cryptographic algorithm used for the key (e.g., `ssh-ed25519`, `ssh-rsa`)
- **`comment`**: A comment included with the key, often indicating the user and machine that created it
- **`createdAt`**: Timestamp when the key was added to your account
- **`fingerprint`**: A unique identifier for the key, used when deleting keys
- **`name`**: The friendly name you assigned to the key
- **`publicKey`**: The full public key string

## Add an SSH key

To add a new SSH key to your account, use the following API endpoint:

```sh
POST https://api.fluence.dev/ssh_keys
```

### Request parameters

```json
{
  "name": "my-key",
  "publicKey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKgJIjnDg1DjqOOxINs78oU3f7PJXIyq9uiNocNVhXNx user@example.com"
}
```

- **`name`**: A friendly name for identifying this key in your account
- **`publicKey`**: The full SSH public key string, which typically includes the algorithm, the key itself, and optionally a comment

:::tip
Read how to [generate SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) if you don't have them yet.
:::

### Response fields

If the key already exists in your account, the endpoint returns a 200 status code with the existing key details:

```json
[
  {
    "active": true,
    "algorithm": "ssh-ed25519",
    "comment": "user@example.com",
    "createdAt": "+002025-03-01T00:00:000000000Z",
    "fingerprint": "SHA256:sINcLA/hlKG0nDpE9n233xEnXAgSISxq0/nVWbbx5A4",
    "name": "my-key",
    "public_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKgJIjnDg1DjqOOxINs78oU3f7PJXIyq9uiNocNVhXNx user@example.com"
  }
]
```

If a new key is created, the endpoint returns a 201 status code with the newly created key details in the same format.

## Delete an SSH key

When you no longer need an SSH key, you can remove it from your account using the following API endpoint:

```sh
DELETE https://api.fluence.dev/ssh_keys
```

### Request parameters

To delete a key, specify its unique fingerprint in the request body:

```json
{
  "fingerprint": "SHA256:sINcLA/hlKG0nDpE9n233xEnXAgSISxq0/nVWbbx5A4"
}
```

- **`fingerprint`**: The unique fingerprint of the SSH key you want to delete

A successful deletion request will return a 200 status code.
