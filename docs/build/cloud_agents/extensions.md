---
description: Give cloud agents remote MCP servers, OpenCode plugins, and skills repositories. How MCP server secrets are sent, plugin package formats, variables, limits, and common mistakes.
---

# Add MCP servers, plugins, and skills

Extensions give an agent more than its model and its repository. You add them once on the **Cloud agents** > **Extensions** page, and every new agent gets them. There are three kinds:

| Kind | What it gives the agent |
|---|---|
| MCP servers | Tools that the agent can call during a task, served by a remote MCP server |
| OpenCode plugins | Packages that extend the agent itself |
| Skills repositories | Git repositories with skills that the agent can use |

An agent takes its extensions at launch. Changes apply to new launches. Running agents keep what they started with. The **Details** panel of an agent shows how many extensions it was launched with.

## MCP servers

An MCP server here is a remote server that the agent reaches over HTTP. Each has a name, a URL, and an optional secret. The agent cannot start a local MCP server from a command.

### Add an MCP server

If the server needs a key, first add the key as a named secret on the **Secrets** page. See [Add a named secret](./secrets.md#add-a-named-secret).

1. Open **Cloud agents** > **Extensions**.
2. In the **MCP servers** card, click **Add MCP server**.
3. Enter the name, for example `docs`. Use lowercase letters, digits, hyphens, and underscores. Each server needs its own name.
4. Enter the URL of the MCP endpoint, for example `https://mcp.example.com/mcp`.
5. Optional: choose the secret that holds the key of the server. **No secret** sends no key.
6. If you chose a secret, choose how the key is sent. See [How the key is sent](#how-the-key-is-sent).
7. Click **Add server**.

The server row shows its URL and the name of its secret, or **no secret**.

To change a server, click **Change** on its row and then **Save server**. To remove it, click **Change**, then **Remove**.

### How the key is sent

The agent sends the secret in a request header on each call to the server. You choose one of two headers:

| Option | Header the server receives | When to use it |
|---|---|---|
| **Authorization: Bearer \<key\>** | `Authorization: Bearer` followed by the secret value | The default. It fits most MCP servers, for example GitHub, Linear, and Notion. |
| **X-API-KEY: \<key\>** | `X-API-KEY` with the secret value | When the documentation of the service names the `X-API-KEY` header, for example the Fluence MCP server. |

The server record holds only the name of the secret, never its value. The value is the one stored on the **Secrets** page when the agent launches.

You cannot send a secret in any other header, add custom headers, or put a secret into the URL from the form. If a server accepts its key only in a query string or a custom header, it does not fit.

### Example: the Fluence MCP server

To let an agent manage your Fluence resources, connect the [Fluence MCP server](../../build_with_ai/mcp.md):

1. Create an API key in **Settings** > **API keys**. See [API keys](../settings.md#api-keys).
2. On **Cloud agents** > **Secrets**, add a secret, for example `fluence_api_key`, with the key as its value.
3. On **Cloud agents** > **Extensions**, add an MCP server with the URL `https://api.fluence.dev/mcp`, the secret `fluence_api_key`, and **X-API-KEY: \<key\>**.

### If the secret is missing

An MCP server can name a secret that no longer exists, for example after you removed the secret. Then:

- The preset page shows **Missing secret** with the name of the secret and the server that uses it. The preset list shows the number of missing secrets.
- A launch from that preset is refused. The message names the secret and what uses it.

To fix it, add the secret again under the same name on the **Secrets** page, or choose another secret for the server.

### Tips for MCP servers

- Use the exact endpoint URL from the documentation of the service. Many servers serve MCP on a path such as `/mcp`, not on the site root.
- Give each server a short name that says what it is, for example `linear` or `docs`.
- If a tool call fails with an authorization error, check the header first. A key sent as **Authorization: Bearer** does not work on a server that expects `X-API-KEY`, and the other way round.
- Paste only the key as the secret value. Do not add `Bearer` in front of it.
- The agent's machine reaches the server over the internet. A server on your laptop or in a private network does not work.
- A failed tool call shows in the conversation under **Used N tools**, marked as failed.

## OpenCode plugins

A plugin is a package that the agent installs at start. You name the package and, if the plugin needs settings, its variables.

### Add a plugin

1. Open **Cloud agents** > **Extensions**.
2. In the **OpenCode plugins** card, click **Add plugin**.
3. Enter the plugin package. See [Plugin package formats](#plugin-package-formats).
4. Optional: click **Add variable**, and enter a variable name and a value. The value is stored as typed and stays visible in the console.
5. Optional: click **Add secret variable**, enter a variable name, and choose a secret. The plugin gets the value of that secret under the variable name.
6. Click **Add plugin**.

The plugin row shows the package, the number of variables and secret variables, and the secrets it uses.

To change a plugin, click **Change** on its row and then **Save plugin**. To remove it, click **Change**, then **Remove**.

### Plugin package formats

| Format | Example | Notes |
|---|---|---|
| npm package | `opencode-example-plugin`, `opencode-example-plugin@1.2.0`, `@scope/plugin@latest` | A version or a tag after `@` is optional |
| HTTPS archive | `https://example.com/plugins/plugin-1.2.0.tgz` | The address starts with `https://`, ends with `.tgz`, and has no credentials, query string, or fragment |
| GitHub repository | `github:owner/repo`, `github:owner/repo#v1.2.0` | A public repository whose root package carries a built plugin. A branch, tag, or commit after `#` is optional |

Pin a version, a tag, or a commit. An unpinned package can change between two launches.

### Variables and secret variables

A plugin has two kinds of variables:

| | Variable | Secret variable |
|---|---|---|
| Holds | A value that you type | The name of a secret from the **Secrets** page |
| Shown in the console | Yes | Only the secret name |
| Use it for | Settings that are not sensitive, for example a URL or a mode | Tokens and keys |

Never type a token into a plain variable. It stays readable in the console.

A variable name uses letters, digits, and underscores, and does not start with a digit. All plugins of an agent share one set of environment variables. If two plugins set the same variable, they must set it to the same value or the same secret. Otherwise the console refuses the save and names both sides.

A secret variable lets a plugin read a secret under the name the plugin expects. For example, a plugin that reads `LINEAR_TOKEN` can take it from your secret `linear_api_key`.

### Plugin order and limits

Plugins reach the agent in the order of the list. A new plugin goes to the end, and a changed plugin keeps its place. The console has no control to reorder plugins. To move a plugin to the end, remove it and add it again.

The limits are:

| Limit | Value |
|---|---|
| Plugins in one preset | 100 |
| Length of the plugin package | 2,048 bytes |
| Variables per plugin | 128 |
| Secret variables per plugin | 128 |
| Length of a variable name | 128 characters |
| Length of a variable value | 8,192 bytes, with no control characters such as line breaks |

A variable cannot be both a variable and a secret variable of the same plugin. These variable names are reserved and refused: `GH_TOKEN`, `OPENCODE_CONFIG`, any name that starts with `GIT_`, and any name that starts with `Profile_`.

If a plugin names a missing secret, the preset shows **Missing secret**, and a launch from it is refused, the same as for an [MCP server](#if-the-secret-is-missing).

## Skills repositories

A skills repository is a Git repository with skills that the agent can use. Each repository is cloned into its own directory on the machine.

1. Open **Cloud agents** > **Extensions**.
2. In the **Skills repositories** card, click **Add skills repository**.
3. Enter the URL of the repository, for example `https://github.com/owner/skills`.
4. Click **Add repository**.

Add each repository once. To change or remove one, click **Change** on its row.

## Extensions and presets

With only the **Default** preset, every extension goes to every new agent, and you can skip this section.

When you have more than one preset, each preset includes its own set of extensions:

- Each form on the **Extensions** page shows a **Presets** group. Select the presets that include the extension. A new extension is selected for all presets.
- Each row shows where the extension is included: **All presets**, or the names of the presets. **Differs in** names the presets whose copy of the extension is not the one shown.
- **Remove** takes the extension out of every preset.
- You can also choose the extensions of one preset on its page. See [Choose the extensions of a preset](./presets.md#choose-the-extensions-of-a-preset).

If a save reaches some presets and not others, the console says in which presets it was not saved. Fix the cause and save again.
