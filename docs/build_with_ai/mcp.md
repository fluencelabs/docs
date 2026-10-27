---
description: Connect Claude Code, Cursor, Codex, VS Code, and other MCP clients to Fluence with an API key, so an AI agent can manage your CPU virtual machines.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Connect an AI client through MCP

The Fluence MCP server lets an AI client manage CPU virtual machines, disks, networks, and public IP addresses in your Fluence Cloud account. The client signs in with a Fluence API key, and the key's permissions decide which tools the client can use.

The server is free to use. You pay from your Fluence balance only for the resources that the agent creates.

The server does not manage GPU instances, top-ups, or payments. For the full list of tools and limits, see the [MCP server reference](./mcp_reference.md).

## Before you start

You need:

- A Fluence account. See [Registration](../build/registration.md).
- An MCP client that runs on your computer and connects to remote MCP servers over HTTP with a custom header. All clients listed on this page can. For another client with these features, use the URL and header below.

Browser-based clients and hosted connectors cannot connect. This includes Claude.ai custom connectors, Claude Desktop connectors, and ChatGPT. The server rejects requests that come from a browser, and it does not support OAuth sign-in.

## Create an API key

Create a separate key for each client. You can then revoke one client without affecting the others.

1. In the [Fluence Console](https://console.fluence.ai), open **Settings** > **API keys** and create a key.
2. Under **Permissions**, choose what the agent may do:
   - To let the agent view your resources without changing them, choose **Read only**. With this preset the agent cannot read the VM catalog or prices.
   - To let the agent create and launch VMs, choose **Custom scopes**. Set **Virtual machines** to **Manage**, and give **View** access to the SSH keys, subnets, and security groups that the VMs use. Choosing **Manage** for virtual machines also adds access to the catalog and prices.
   - To let the agent delete disks or public IP addresses, also set **Disks** or **Public IP addresses** to **Manage**.
3. Set an expiration date and create the key.
4. Copy the key and store it in a password manager or an environment variable. The console shows the key only once.

The permissions apply to every resource in your account. A key cannot be limited to one VM or one project.

## Add the server to your client

In the Fluence Console, **Settings** > **MCP** shows the configuration for each client below and the file to put it in. Its **API keys** button opens the page where you create keys.

Every client connects to the same server:

- URL: `https://api.fluence.dev/mcp`
- Header: `X-API-KEY` with your API key

Send exactly one `X-API-KEY` header. Do not add an `Authorization` header or a query string to the URL. The server rejects both.

If a client can read environment variables, its configuration below reads the key from `FLUENCE_API_KEY`. Set that variable in the environment that starts the client. If a client cannot, replace `YOUR_FLUENCE_API_KEY` with your key and keep the file private.

<Tabs groupId="mcp-client">
<TabItem value="claude-code" label="Claude Code">

Add the server to `.mcp.json` in your project root. If the file already has other servers, merge the `fluence` entry into `mcpServers`.

```json
{
  "mcpServers": {
    "fluence": {
      "type": "http",
      "url": "https://api.fluence.dev/mcp",
      "headers": {
        "X-API-KEY": "${FLUENCE_API_KEY}"
      }
    }
  }
}
```

Restart Claude Code, approve the project MCP server, and run `/mcp` to check that `fluence` is connected.

</TabItem>
<TabItem value="cursor" label="Cursor">

Add the server to `~/.cursor/mcp.json` and replace `YOUR_FLUENCE_API_KEY` with your key.

```json
{
  "mcpServers": {
    "fluence": {
      "url": "https://api.fluence.dev/mcp",
      "headers": {
        "X-API-KEY": "YOUR_FLUENCE_API_KEY"
      }
    }
  }
}
```

Enable `fluence` in **Tools & MCP** and open a new Agent chat.

</TabItem>
<TabItem value="codex" label="Codex">

Add this section to `~/.codex/config.toml`. Codex reads the key from the `FLUENCE_API_KEY` environment variable.

```toml
[mcp_servers.fluence]
url = "https://api.fluence.dev/mcp"
env_http_headers = { "X-API-KEY" = "FLUENCE_API_KEY" }
```

Restart Codex, run `codex mcp list`, and check `/mcp` in a new session.

</TabItem>
<TabItem value="vscode" label="VS Code">

Run **MCP: Open User Configuration** and merge this configuration. GitHub Copilot asks for the key when the server starts.

```json
{
  "servers": {
    "fluence": {
      "type": "http",
      "url": "https://api.fluence.dev/mcp",
      "headers": {
        "X-API-KEY": "${input:fluence-api-key}"
      }
    }
  },
  "inputs": [
    {
      "id": "fluence-api-key",
      "type": "promptString",
      "description": "Fluence API key",
      "password": true
    }
  ]
}
```

Run **MCP: List Servers**, start `fluence`, and enable its tools in a local GitHub Copilot Agent chat. Agent Host is not supported.

</TabItem>
<TabItem value="gemini-cli" label="Gemini CLI">

Add the server to `~/.gemini/settings.json` and replace `YOUR_FLUENCE_API_KEY` with your key.

```json
{
  "mcpServers": {
    "fluence": {
      "httpUrl": "https://api.fluence.dev/mcp",
      "headers": {
        "X-API-KEY": "YOUR_FLUENCE_API_KEY"
      }
    }
  }
}
```

Restart Gemini CLI and run `/mcp` to check `fluence`.

</TabItem>
<TabItem value="copilot-cli" label="Copilot CLI">

Add the server to `~/.copilot/mcp-config.json` and replace `YOUR_FLUENCE_API_KEY` with your key.

```json
{
  "mcpServers": {
    "fluence": {
      "type": "http",
      "url": "https://api.fluence.dev/mcp",
      "tools": ["*"],
      "headers": {
        "X-API-KEY": "YOUR_FLUENCE_API_KEY"
      }
    }
  }
}
```

Restart Copilot CLI and run `/mcp show fluence`.

</TabItem>
<TabItem value="opencode" label="OpenCode">

Add the server to `~/.config/opencode/opencode.json`. This format is for OpenCode 1.x. OpenCode reads the key from the `FLUENCE_API_KEY` environment variable.

```json
{
  "mcp": {
    "fluence": {
      "type": "remote",
      "url": "https://api.fluence.dev/mcp",
      "oauth": false,
      "headers": {
        "X-API-KEY": "{env:FLUENCE_API_KEY}"
      }
    }
  }
}
```

Restart OpenCode and run `opencode mcp list`.

</TabItem>
<TabItem value="cline" label="Cline">

In Cline, open **MCP Servers** > **Configure** > **Configure MCP Servers**, merge this configuration, and replace `YOUR_FLUENCE_API_KEY` with your key.

```json
{
  "mcpServers": {
    "fluence": {
      "type": "streamableHttp",
      "url": "https://api.fluence.dev/mcp",
      "headers": {
        "X-API-KEY": "YOUR_FLUENCE_API_KEY"
      }
    }
  }
}
```

Check `fluence` in the **MCP Servers** panel.

</TabItem>
<TabItem value="kilo-code" label="Kilo Code">

Add the server to `~/.config/kilo/kilo.jsonc`. Kilo Code reads the key from the `FLUENCE_API_KEY` environment variable.

```json
{
  "mcp": {
    "fluence": {
      "type": "remote",
      "url": "https://api.fluence.dev/mcp",
      "oauth": false,
      "headers": {
        "X-API-KEY": "{env:FLUENCE_API_KEY}"
      }
    }
  }
}
```

Check `fluence` in **Settings** > **Agent Behaviour** > **MCP Servers**.

</TabItem>
<TabItem value="zed" label="Zed">

Run **zed: open settings file**, merge this configuration, and replace `YOUR_FLUENCE_API_KEY` with your key.

```json
{
  "context_servers": {
    "fluence": {
      "url": "https://api.fluence.dev/mcp",
      "headers": {
        "X-API-KEY": "YOUR_FLUENCE_API_KEY"
      }
    }
  }
}
```

Check `fluence` in **Settings** > **AI** > **MCP Servers**. If Zed offers to sign in with OAuth, the key is wrong or missing. Fix the key instead of starting the OAuth flow.

</TabItem>
<TabItem value="continue" label="Continue">

Merge this entry into `mcpServers` in `~/.continue/config.yaml`, keep your models, and replace `YOUR_FLUENCE_API_KEY` with your key.

```yaml
mcpServers:
  - name: fluence
    type: streamable-http
    url: "https://api.fluence.dev/mcp"
    requestOptions:
      headers:
        X-API-KEY: YOUR_FLUENCE_API_KEY
```

In Agent mode, check the `fluence` tools in the tool selector.

</TabItem>
</Tabs>

## Check the connection

Ask the agent:

```text
List my Fluence virtual machines without making changes.
```

The agent calls `list_vms`. An empty list means the connection works and the account has no VMs.

Some tools start billing or change live infrastructure, for example `provision_vm`, `create_storage`, `create_public_ip`, and `terminate_vm`. The server marks them as destructive, so a client that supports confirmations asks you before it runs them. Keep confirmations on for these tools.

## Revoke access

Delete the key in **Settings** > **API keys**. The server checks the key on every request, so the client loses access at once. Removing the server from the client configuration does not revoke the key.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `401` with `A single X-API-KEY header and native client are required` | The request has no `X-API-KEY` header, has two of them, has an `Authorization` header, or the URL has a query string | Send one `X-API-KEY` header to `https://api.fluence.dev/mcp` |
| `403` with an empty body | The request has an `Origin` header, which browsers always send | Use a client that runs on your computer |
| `400` with `Invalid API key format` | The key is incomplete or has extra characters | Copy the key again, or create a new one |
| A tool is missing from the client's tool list | The key lacks a scope that the tool needs | Create a key with the scope. See [Tools and scopes](./mcp_reference.md#tools-and-scopes) |
| A tool returns the error code `busy` | Your account already has 2 tool calls running | Wait for a running call to finish, then retry with the same arguments. A `busy` call did not start |
| `get_balances` returns `forbidden` | The Fluence Console cannot add the `account:read` scope to a key | Check the balance on the **Billing** page |
