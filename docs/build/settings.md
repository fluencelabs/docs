# Fluence console settings

Use the **Settings** section to manage your account profile, API keys and SSH keys.

## Account

On the **Account** page, you can view your email and edit your profile: name, last name, job role and company.

## API keys

An API key lets a script or an agent use the [Fluence API](./api/overview.md) on your behalf.

On the **API keys** page, click **Add API Key** and set:

1. **Name**: lowercase letters, digits and hyphens, up to 25 characters.
2. **Permissions**:
   - **Full access**: all permissions your account has, including payments and API keys.
   - **Read only**: view resources and billing. Read-only keys don't work with GPU Cloud.
   - **Custom scopes**: choose permissions for each resource.
3. **Expires at**: the date the key stops working.

The key value is shown once, right after the key is created; copy it and store it safely. The list shows each key's name, creation date, last use and expiration date. Delete a key you no longer need.

## SSH keys

On the **SSH keys** page, click **Add SSH Key**, give the key a name and paste your public key. Supported formats: RSA, DSA, ECDSA and ED25519. The list shows each key's name and fingerprint; you can delete keys you no longer need.

SSH keys are added to VMs when you [launch them](./cpu_cloud/vm_rent.md#6-add-ssh-keys). Deleting a key doesn't remove it from VMs that already use it.
