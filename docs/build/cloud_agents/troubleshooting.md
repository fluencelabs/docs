---
description: Limits of cloud agents in the Fluence Console, the refusals and failures you can meet at launch and during work, what each one means, and how to fix it.
---

# Troubleshoot cloud agents

This page lists the limits of cloud agents and the messages that the Fluence Console shows when something goes wrong, with what to do about each.

## Limits

| What | Limit |
|---|---|
| Agent name | 128 bytes, on one line |
| Task and each message | 20,000 characters |
| Repository | One per agent. Required in the console (`https://` address without credentials). Optional through the API and MCP. |
| Time per turn | 6 hours for a turn launched from the console. Through the API and MCP, `budget_seconds` sets a custom limit or `"unlimited"`. |
| Idle time | Whole hours, 1 or more, set in the preset in the console. An empty field takes the default. Through the API and MCP, `idle_timeout` accepts seconds or `"disabled"` to prevent automatic idle stop. |
| Labels (API and MCP) | Up to 16 key/value pairs per agent, set once at launch |
| Agents alive at once | Limited per account. A launch over the limit is refused. |
| Preset name | 64 characters, unique among your presets |
| Secret name | 64 lowercase letters, digits, and underscores |
| Custom provider name | 48 lowercase letters, digits, and hyphens |
| Plugins in one preset | 100 |

For the limits of plugin variables, see [Plugin order and limits](./extensions.md#plugin-order-and-limits).

## The section does not open

| Message | What to do |
|---|---|
| **Connecting Cloud agents…** | Wait. The console connects the section to your account by itself. |
| **Could not connect Cloud agents** | Click **Retry**. |

## The launch is closed or refused

The line under **Launch agent** says why the button is disabled:

| Message | What to do |
|---|---|
| **Connect an AI provider to launch.** | Connect a provider on the **AI providers** page. See [Connect an AI provider](./ai_providers.md). |
| **Add a GitHub token to launch.** | Add a token on the **Secrets** page. See [Add the GitHub token](./secrets.md#add-the-github-token). |
| **Reload the page to launch.** | The console could not read your setup. Reload the page. |

The form checks its fields when you click **Launch agent**:

| Message | What to do |
|---|---|
| **Describe the task** | Fill in **Task** |
| **Choose a model** | Choose a model in **Model** |
| **Enter a repository URL** | Fill in **Repository URL**. The console launch form requires a repository. |
| **Enter an https:// repository URL without credentials** | Use an address such as `https://github.com/owner/repository`. Do not put a user name or a token into the address. SSH addresses are not accepted. |
| **Use a shorter name**, **Use a name without line breaks** | Shorten the agent name, or remove line breaks from it |
| **This form expired. Reload the page.** | Reload the page and launch again |

A launch can also be refused after you click **Launch agent**. The console shows the reason:

| Reason | What to do |
|---|---|
| A secret that an MCP server or a plugin names is missing | Add the secret on the **Secrets** page, or change the extension. The preset page marks it **Missing secret**. |
| The model is not available | Choose a model from the list, and check that its provider is connected. |
| The ChatGPT subscription is not active | On the **AI providers** page, click **Sign in again**, or select another subscription |
| The limit of agents is reached | Stop an agent that you no longer need, then launch again |
| The preset, its secrets, or its AI providers no longer exist | Reload the page and choose another preset, or fix the preset on its page |

## The agent failed

A failed agent shows the reason in the **Details** panel of its page.

| Message | What it means and what to do |
|---|---|
| **The agent's machine could not be created.** | Fluence could not create the machine. Launch again. If it repeats, choose another size or cluster in the preset. |
| **The repository could not be prepared on the agent's machine.** | The agent could not clone the repository. Check the address and that the GitHub token has access to it, then launch again. |
| **The agent's machine does not offer the model the agent was launched with.** | The model is not served by your providers. Launch again with a model from the list. |
| **The AI profile's subscription sign-in no longer works. Sign in again.** | Sign in to ChatGPT again on the **AI providers** page, then launch again |
| **The models of the AI profile's subscription could not be read.** | Check the subscription on the **AI providers** page, then launch again |
| **The agent's machine is gone.**, **The agent's machine could not be found.**, **The agent's machine is being shut down.** | The machine ended under the agent. Launch a copy. |
| **The agent's machine refused to start the agent.**, **The agent could not be confirmed as started on its machine.**, **The agent's session on its machine was lost.** | The agent did not start or was lost on the machine. Launch a copy. |
| **The agent stopped because of an error.** | An error without a known reason. Launch a copy. If it repeats, contact support. |

To launch again with the same settings, open the menu and click **Launch a copy**.

## A turn went wrong

A turn can go wrong while the agent itself stays alive. The agent becomes **Idle** and takes your next message. The conversation shows **This turn failed.**, **This turn was interrupted.**, or **It is not known how this turn ended.** The **Last turn** column of the agent list shows a short reason:

| Reason | What it means | What to do |
|---|---|---|
| `interrupted` | You interrupted the turn | Send the next message |
| `budget_exceeded` | The turn ran out of its time limit (`budget_seconds`) | Send a message to continue, split large work into smaller tasks, or raise `budget_seconds` on a new agent |
| `turn_stalled` | The turn produced no output for too long and was stopped | Send a message to continue. If it repeats, try another model. |
| `model_auth` | The AI provider rejected the key or subscription | Check the API key or sign in to the subscription again on **AI providers** |
| `model_rate_limited`, `model_quota_exhausted` | The AI provider rate-limited the request or the quota ran out | Wait and send the message again, or check your plan and limits at your AI provider |
| `model_timeout`, `model_unavailable`, `model_unsupported`, `model_request_rejected` | The model call timed out, was unavailable, or was rejected by the provider | Retry, or launch a new agent with another model |
| `context_overflow` | The conversation exceeded the model's context window | Start a new agent with a shorter prompt or a model with a larger context window |
| `tool_failed`, `prompt_rejected`, `harness_restarted` | A tool call failed, the prompt was rejected, or the agent runtime restarted during the turn | Send the message again or adjust the prompt |
| `unknown` | The reason could not be determined | Send the message again |

## An extension does not work

| Symptom | What to check |
|---|---|
| The preset shows **Missing secret** | The extension names a secret that the preset does not have. Add it on the **Secrets** page under the same name. |
| Calls to an MCP server fail with an authorization error | The header. Most servers take **Authorization: Bearer \<key\>**. Some take **X-API-KEY: \<key\>**. Also check that the secret value is the key alone, without `Bearer`. |
| The agent has no tools of an MCP server | The URL of the endpoint, and that the server is reachable from the internet. Also check that the preset of the agent includes the server. |
| A change to an extension or a secret has no effect | A running agent keeps what it started with. Stop it and launch a new one. |
| The console refuses a plugin | The package format, a reserved or repeated variable name, or two plugins that set one variable to different values. See [OpenCode plugins](./extensions.md#opencode-plugins). |
| The console refuses a secret name | The name makes a reserved environment variable. See [How secrets reach the agent](./secrets.md#how-secrets-reach-the-agent). |

## Questions

### Can I launch an agent without a repository?

In the Fluence Console, the launch form requires a repository, and the agent clones it with the GitHub token. Through the Cloud Agents API (`POST /v3/agents/agents`) and Fluence MCP (`agents_create`), you can launch an agent without a repository by omitting `repo_url` (when the preset has no default) or passing `without_repo: true`. The agent starts in an empty working directory with nothing cloned.

### Can the agent open a pull request?

Yes, if the GitHub token has write access to the repository. With read access only, the agent can clone and read, but it cannot push.

### Can I see the value of a secret or a key that I saved?

No. Fluence stores the value and never shows it again. Save a new value if you lost the old one.

### Can I change the model, the machine, or the secrets of a running agent?

No. An agent keeps what it was launched with. Stop it and launch a copy with the new settings.

### Can I restart an ended agent?

No. **Ended** and **Failed** are final. Click **Launch a copy** to start a new agent with the same task, model, and repository.

### Can I rename or delete an agent?

No. The name is set at launch. Ended and failed agents stay in the list and are hidden by default.

### Why did my agent end by itself?

It stayed idle for the idle time of its preset. To keep idle agents longer, raise **Idle hours** in the **Machine** block of the preset. Through the API and MCP, setting `idle_timeout: "disabled"` on a preset prevents automatic idle stop until you stop the agent. A longer idle time means that you pay for the machine longer.

### Do I pay while the agent is idle?

Yes. You pay for the machine while it runs, also when the agent waits for a message. The machine is released when the agent stops or ends.

### Does Fluence charge for the model?

The machine price does not include model use. Your AI provider bills it under your key or your subscription.
