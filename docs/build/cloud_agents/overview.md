---
description: "Cloud agents concepts: managed coding agents on isolated machines in your Fluence account, controlled from the console, MCP, or the API. What an agent gets at launch, turns and messages, idle stop, and pricing."
---

# Cloud agents concepts

Cloud agents are managed coding agents. Each agent runs on its own isolated virtual machine in your Fluence account. You give it a task, a model, and a repository. Fluence creates the machine, sets up the agent on it, and releases the machine when you stop the agent or when it stays idle.

The agent clones the repository, works on the task, and answers in a conversation on its page. If its GitHub token has write access, it can push branches and open pull requests.

With cloud agents you get:

- A managed agent. You do not rent or configure a server. You launch an agent, and you pay for its machine only while it runs.
- An isolated machine. Each agent has its own virtual machine, with no SSH access and no static public IP address.
- A reproducible setup. You set up AI providers, secrets, MCP servers, plugins, and skills once. Every new agent starts with the same setup, so you do not configure each machine by hand.
- Control from the console, MCP, or the API. You launch agents, send them messages, and stop them in the Fluence Console, through [Fluence MCP](../../build_with_ai/mcp.md), or through the API.

To launch your first agent in the Fluence Console, see [Launch your first cloud agent](./get_started.md).

## How a cloud agent works

Each launch creates one agent on one machine:

1. You launch an agent with a task, a model, and a repository.
2. Fluence creates a machine of the selected size in your account and prepares it: the repository, the secrets, the AI providers, and the extensions.
3. The agent starts on the task right after launch. Its replies and the tools it used appear in the conversation.
4. You send more messages while the agent works or after it finishes a turn.
5. The agent runs until you stop it, or until it stays idle for the selected idle time. Then its machine is released.

An agent that stopped or failed stays in your list with its conversation, but takes no more messages.

The agent runs [OpenCode](https://opencode.ai). The models it can use come from the AI providers that you connect.

## What an agent gets at launch

You set up three things once, and every new agent gets them:

| Console page | What it holds |
|---|---|
| **AI providers** | How agents reach models: a ChatGPT subscription, API keys of known providers, or your own endpoint. See [Connect an AI provider](./ai_providers.md). |
| **Secrets** | The GitHub token that agents clone repositories with, and named secrets for MCP servers and plugins. See [Add a GitHub token and secrets](./secrets.md). |
| **Extensions** | MCP servers, OpenCode plugins, and skills repositories. See [Add MCP servers, plugins, and skills](./extensions.md). |

An agent takes its AI providers, secrets, and extensions at launch. Changes on these pages apply to new launches. Running agents keep what they started with. To give a running agent a change, stop it and launch a new one.

## Turns and messages

The agent works in turns. The task you launch with starts the first turn. Each later message starts a new turn or joins the running one:

- To an idle agent, a message starts a new turn at once.
- To a working agent, you choose. **Steer now** hands the message to the running turn at its next step. **Queue** runs the message as its own turn after the running one.

A turn has a time limit. A turn launched from the console can run for up to 6 hours. A turn that produces no output for too long is also stopped. When a limit stops a turn, the agent stays and takes the next message.

See [Work with a cloud agent](./manage_agents.md).

## Idle stop

A machine does not run forever. When an agent stays idle for the selected idle time, the machine shuts down and the agent is stopped. The idle time is a whole number of hours.

Anything the agent did not push to the repository is gone with the machine. Ask the agent to push its work before you leave it idle.

To continue the work of a stopped agent, launch a copy of it. The copy starts on a new machine with a new conversation.

## Pricing

A cloud agent has two costs:

- The machine. You pay for it by the hour while it runs, at the hourly price of its size. The console shows the price in the **Machine** step and the **Review** panel of the launch form, in the agent list, and on the agent page. The **Review** panel also shows what a month costs if the machine runs nonstop.
- The model. Model use is billed by your AI provider, not by the machine price.

You pay for the machine only while it runs. It also runs while the agent is idle and waits for a message. The idle stop limits what a forgotten agent can cost. Sizes and prices depend on the selected cluster.

The machine is billed to your Fluence account. See [Payment and balance management](../balance.md).
