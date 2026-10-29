---
description: Manage your profile, API keys and their permissions, SSH keys, and MCP client setup in the Settings section of the Fluence Console.
---

# Settings

The **Settings** section of the Fluence Console has four pages: **Account**, **API keys**, **MCP**, and **SSH keys**.

## Account

The **Account** page shows your email. You can edit your name, last name, job role, and company.

## API keys

An API key lets a script or an AI agent use the [Fluence API](./api/overview.md) or the [MCP server](../build_with_ai/mcp.md) on your behalf.

To create a key:

1. On the **API keys** page, click **Add API key**.
2. Enter a **Name**: up to 25 characters, lowercase letters, digits, and hyphens.
3. Under **Permissions**, choose one option:
   - **Full access** gives all permissions your account has, including payments and API keys.
   - **Read only** lets the key view your resources and billing. It cannot use GPU Cloud, and it cannot read the VM catalog or prices.
   - **Custom scopes** lets you choose the access for each group. The groups are virtual machines, disks, VPCs and subnets, public IP addresses, security groups, SSH keys, API keys, expenses and payments, GPU containers, and GPU VMs and bare metal. Most groups offer **View** or **Manage**. Each GPU group offers one option that includes both viewing and managing.
4. Set the **Expiration date**. By default, a key expires in one year.
5. Create the key, then copy its value and store it safely. The console shows the value only once.

The console offers only the permissions that your account has. To create a key that can launch VMs, choose **Custom scopes** and set **Virtual machines** to **Manage**. This also gives the key access to the VM catalog and prices. For the API scopes behind each option, see [Permissions](./api/overview.md#permissions).

The list shows the name, creation date, last use, and expiration date of each key. Delete a key you no longer need. Deleting a key stops it at once.

## MCP

The **MCP** page helps you connect an AI client to the Fluence MCP server. Choose your client, for example Cursor, Claude Code, VS Code, or Codex. The page shows the configuration file to edit and the configuration to copy. The **API keys** button opens the page where you create a key for the client.

For the full setup, see [Connect an AI client through MCP](../build_with_ai/mcp.md).

## SSH keys

To add a key, click **Add SSH key**. Paste your public key into **SSH Key**, enter a **Name**, and save. Supported formats: RSA, DSA, ECDSA, and ED25519. The list shows the name and fingerprint of each key. Delete a key you no longer need.

You choose the SSH keys of a VM when you [create it](./cpu_cloud/vm_rent.md#6-add-ssh-keys). Deleting a key from your account doesn't remove it from VMs that already have it.
