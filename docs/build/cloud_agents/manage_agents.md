---
description: Launch cloud agents, read their conversation, send messages, steer or queue a turn, interrupt a turn, stop an agent, and launch a copy in the Fluence Console.
---

# Work with a cloud agent

You launch and manage cloud agents in the Fluence Console under **Cloud agents** > **Agents**. For turns, idle stop, and pricing, see [Cloud agents concepts](./overview.md).

## Launch an agent

Before the first launch, connect an AI provider and add a GitHub token. See [Launch your first cloud agent](./get_started.md).

1. On the **Agents** tab, click **New agent**.
2. If you have more than one preset, choose the **Preset**. With only the **Default** preset, the form does not show this field.
3. Optional: enter an **Agent name**, up to 128 bytes on one line.
4. In **Task**, describe the work. The task is the first message the agent gets. It can be up to 20,000 characters.
5. In **Model**, choose a model.
6. In **Repository URL**, enter an `https://` address without credentials, for example `https://github.com/owner/repository`.
7. Check the **Review** panel and click **Launch agent**.

When you choose another preset, the form takes its default model and fills the task and the repository if you left them empty. The **Machine** step shows the machine of the preset. To change it, click **Change in preset**.

### Repositories

A launch needs a repository. The agent clones it with the GitHub token:

- The token needs read access to clone, and write access to push and open pull requests.
- The **Repository** step shows **Token checked**, **Token not checked**, or **No GitHub token**. A checked token is valid, but the console learns only at launch whether it reaches this repository.
- An agent that cannot clone the repository fails. Its page shows **The repository could not be prepared on the agent's machine.** Check the address and the access of the token, then launch again.

An agent works on one repository. To work on another one, launch another agent.

## Agent list

The list shows each agent with its repository as the title, its **Last turn**, **Model**, **Price** per hour, **Updated** time, and **State**.

- **Last turn** shows **Running**, **OK**, or the reason the last turn went badly.
- By default, the list shows active agents. Ended and failed agents are hidden. To see them, change the state filter, or click **Show all**.
- **Search agents** matches the repository, the agent name, and the agent ID.
- To sort by the last change, click **Updated**.

The list refreshes by itself every 10 seconds.

## Agent page

Click an agent to open its page. It has the conversation on the left and the **Details** panel on the right.

The **Details** panel shows the **Status**, **Name**, **Model**, **Repository**, **Machine**, the number of **Extensions** the agent was launched with, and the **Price** of the machine per hour. If the agent failed, the panel says why.

The page refreshes by itself every 5 seconds while the agent is starting, working, or stopping.

## Send a message

Type in the field under the conversation. A message can be up to 20,000 characters. What happens depends on the state of the agent:

| Agent state | What you can do |
|---|---|
| **Idle** | Press **Enter** or click **Send**. The message starts a new turn at once. |
| **Working** | Click **Queue** or press **Enter** to run the message as its own turn after the running one. Click **Steer now** or press **Ctrl+Enter** (**⌘+Enter** on macOS) to hand it to the running turn at its next step. |
| **Pending**, **Preparing** | Wait. The agent takes messages once it is **Working** or **Idle**. |
| **Stopping**, **Ended**, **Failed** | The agent no longer takes messages. |

Press **Shift+Enter** for a new line.

Use **Steer now** to correct the agent while it works, for example "Do not touch the migrations." Use **Queue** for the next piece of work. A queued message runs as a separate turn with its own time limit.

### Delivery labels

Each message that you send shows a label:

| Label | Meaning |
|---|---|
| **Queued** | Accepted, waiting for its turn |
| **Sending** | Being handed to the agent |
| **Delivered** | The agent has it |
| **unknown — checking** | Fluence is checking whether the agent got it. Wait. Do not send it again, or the agent can get it twice. |
| **Failed** | It did not run. The reason is shown next to it. |
| **Cancelled** | It never ran. It was still waiting when the agent was stopped or ended. |

If a running turn is cut short, a message that you steered into it and that did not run shows **Failed**. A queued message is kept and runs as the next turn.

## Interrupt a turn

To stop what the agent is doing and keep the agent, interrupt the turn:

1. On the agent page, open the menu in the **Details** panel.
2. Click **Interrupt agent**. The menu shows it only while the agent is **Working**.

The running turn stops, and the agent becomes **Idle**. It keeps its machine and its conversation, and it takes your next message.

## Stop an agent

1. Open the menu in the **Details** panel of the agent page, or the menu on the agent's row in the list.
2. Click **Stop**, and confirm with **Stop agent**.

The agent stops, and its machine is released. Messages that have not run yet will not run. You cannot start a stopped agent again. Anything the agent did not push to the repository is gone with the machine.

An idle agent also stops by itself after the idle time of its preset. See [Idle stop](./overview.md#idle-stop).

## Launch a copy

To start a new agent with the settings of an existing one, open the menu of the agent and click **Launch a copy**. The launch form opens with the name, task, model, and repository of that agent, and with its preset if the preset still exists. Change what you need, and click **Launch agent**.

The copy is a new agent on a new machine. It does not continue the conversation of the first one.
