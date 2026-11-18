---
description: "Cloud agents concepts: a coding agent on its own machine in your Fluence account, what it gets at launch, turns and messages, agent states, idle stop, and pricing."
---

# Cloud agents concepts

A cloud agent is a coding agent that runs on its own machine in your Fluence account. You give it a task, a model, and a repository. The agent clones the repository, works on the task, and answers in a conversation on its page. If its GitHub token has write access, it can push branches and open pull requests.

You work with cloud agents in the Fluence Console under **Cloud agents**. To launch one, see [Launch your first cloud agent](./get_started.md).

## How a cloud agent works

Each launch creates one agent on one machine:

1. You launch an agent from a preset. The preset gives the machine size and the extensions. You give the task, the model, and the repository.
2. Fluence creates a machine in your account and prepares it: the repository, the secrets, the AI providers, and the extensions.
3. The agent starts on the task right after launch. Its replies and the tools it used appear in the conversation.
4. You send more messages while the agent works or after it finishes a turn.
5. The agent ends when you stop it, or when it stays idle for the idle time of its preset. Its machine is released.

The agent runs [OpenCode](https://opencode.ai). The models it can use come from the AI providers that you connect.

## What an agent gets at launch

You set up three things once, and every new agent gets them:

| Console page | What it holds |
|---|---|
| **AI providers** | How agents reach models: a ChatGPT subscription, API keys of known providers, or your own endpoint. See [Connect an AI provider](./ai_providers.md). |
| **Secrets** | The GitHub token that agents clone repositories with, and named secrets for MCP servers and plugins. See [Add a GitHub token and secrets](./secrets.md). |
| **Extensions** | MCP servers, OpenCode plugins, and skills repositories. See [Add MCP servers, plugins, and skills](./extensions.md). |

An agent takes its AI providers, secrets, and extensions at launch. Changes on these pages apply to new launches. Running agents keep what they started with. To give a running agent a change, stop it and launch a new one.

## Presets

A preset says what an agent runs with: a default model, a machine, and the extensions it includes. A preset can also carry a default repository and task.

Every account has the **Default** preset. Agents launch from it when you choose no other. You need more presets only when you want different machines, models, or extensions for different work. See [Create and edit presets](./presets.md).

## Turns and messages

The agent works in turns. The task you launch with starts the first turn. Each later message starts a new turn or joins the running one:

- To an idle agent, a message starts a new turn at once.
- To a working agent, you choose. **Steer now** hands the message to the running turn at its next step. **Queue** runs the message as its own turn after the running one.

A turn has a time limit. A turn launched from the console can run for up to 6 hours. A turn that produces no output for too long is also stopped. When a limit stops a turn, the agent stays and takes the next message.

See [Work with a cloud agent](./manage_agents.md).

## Agent states

| State | Meaning |
|---|---|
| **Pending** | The launch is accepted, and Fluence is finding or creating the machine |
| **Preparing** | The machine is ready, and the repository and the agent are being prepared on it |
| **Working** | A turn is running |
| **Idle** | The agent has no turn running and waits for a message |
| **Stopping** | The agent is stopping, and its machine is being released |
| **Ended** | The agent was stopped, or it stayed idle for the idle time |
| **Failed** | The agent could not start or lost its machine. Its page says why. |

**Ended** and **Failed** are final. A final agent stays in your list with its conversation, but takes no more messages.

While an agent is **Pending** or **Preparing**, its page shows the current step next to the state: **Accepted**, **Finding a machine**, **Raising the machine**, **Machine ready**, **Connecting to the machine**, or **Handing over the task**.

## Idle stop

A machine does not run forever. When an agent stays idle for the idle time of its preset, the machine shuts down and the agent is stopped. Its state becomes **Ended**.

You set the idle time in whole hours in the **Machine** block of a preset, in the **Idle hours** field. An empty field takes the default.

To continue the work of an ended agent, launch a copy of it. The copy starts on a new machine with a new conversation.

## Pricing

A cloud agent has two costs:

- The machine. You pay for it by the hour while it runs, at the hourly price of its size. The console shows the price in the **Machine** step and the **Review** panel of the launch form, in the agent list, and on the agent page. The **Review** panel also shows what a month costs if the machine runs nonstop.
- The model. Model use is billed by your AI provider, not by the machine price.

You pay for the machine only while it runs. The idle stop limits what a forgotten agent can cost. Sizes and prices depend on the cluster of the preset.

The machine is billed to your Fluence account. See [Payment and balance management](../balance.md).
