---
description: Add the GitHub token that cloud agents clone repositories with, and named secrets for MCP servers and plugins. How secrets reach the agent as environment variables.
---

# Add a GitHub token and secrets

The **Cloud agents** > **Secrets** page holds what every new agent gets: one GitHub token, and any number of named secrets for MCP servers and plugins.

Fluence stores a secret value when you save it and never shows it again. The console shows only names, dates, and what uses each secret. To change a value, save a new one.

## Add the GitHub token

Agents clone repositories with the GitHub token. A launch needs it: without a token, the launch form shows **Add a GitHub token to launch.**

1. Open **Cloud agents** > **Secrets**.
2. In the **GitHub token** card, click **Connect**. If a token is already stored, the button reads **Change**.
3. Paste the token and click **Save token**.

Give the token access to every repository you hand an agent:

- Read access lets the agent clone.
- Write access lets the agent push and open pull requests.

You can use either kind of GitHub token:

| Token kind | Permissions |
|---|---|
| Fine-grained | **Contents**, **Pull requests**, **Actions**, and **Issues**, each with read and write access. **Contents** with read-only access is enough to only read. |
| Classic | The `repo` scope. Add `workflow` to let the agent change GitHub Actions workflows. |

If an organization blocks fine-grained tokens or holds them for approval, use a classic token.

When you save a token, Fluence asks GitHub about it. The card then shows the result:

- **Token checked**: GitHub accepted the token. The card shows the GitHub account that owns it, the date of the check, and the expiry date if the token has one.
- **Token not checked**: the token is saved, but GitHub could not be asked. The card gives the reason.

The check confirms that the token is valid. It does not confirm access to a specific repository. That shows only at launch, when the agent clones.

On the machine, the agent gets the token in the `GH_TOKEN` environment variable.

## Add a named secret

A named secret is a value with a name, for example `npm_token`. MCP servers and plugins use a secret by its name.

1. Open **Cloud agents** > **Secrets**.
2. In the **Secrets** card, click **Add a secret**.
3. Enter the name. Use up to 64 lowercase letters, digits, and underscores.
4. Enter the value.
5. Click **Add secret**.

Each secret row shows what uses it, for example **Used by 1 MCP server and 2 plugins**, or **Not used yet**.

To store a new value, click **Change** on the row, enter the value, and click **Save secret**. You cannot rename a secret. Add a new one instead.

To remove a secret, click **Change**, then **Remove**, and confirm with **Remove secret**. New launches no longer get it. Before you remove a secret that is in use, take it out of the MCP servers and plugins that name it. A launch from a preset that names a missing secret is refused.

## How secrets reach the agent

The console never shows a secret value, and an MCP server or plugin record holds only the name of a secret.

On the machine, each named secret is an environment variable of the agent. The variable is the secret name in uppercase:

| Secret name | Environment variable |
|---|---|
| `npm_token` | `NPM_TOKEN` |
| `linear_api_key` | `LINEAR_API_KEY` |

A secret also reaches the agent in these ways:

- An MCP server sends the secret that you choose for it in a request header. See [MCP servers](./extensions.md#mcp-servers).
- A plugin gets a secret under a variable name that you choose, as a secret variable. See [OpenCode plugins](./extensions.md#opencode-plugins).

Some names cannot be used, because their variable belongs to the machine or to the agent itself. The console refuses a secret whose variable would be one of these:

- `GH_TOKEN` and any variable that starts with `GIT_`.
- Variables of the agent process, for example `PATH`, `HOME`, `NODE_OPTIONS`, `HTTPS_PROXY`, and any variable that starts with `OPENCODE_`, `NPM_CONFIG_`, or `XDG_`.
- `OPENAI_API_KEY`, which an OpenAI key on the **AI providers** page fills.

A name that starts with a digit is also refused, because it makes no valid variable. Choose another name, for example `npm_registry_token` instead of `npm_config_token`.

:::warning
Anything the agent can read, it can also print or send. Give an agent only the secrets that its task needs, and prefer tokens with narrow permissions and an expiry date.
:::

## Changes and running agents

An agent takes its secrets at launch. A new or changed secret applies to new launches. Running agents keep what they started with. To give a running agent a new value, stop it and launch a new one.
