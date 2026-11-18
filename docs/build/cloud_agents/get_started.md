---
description: Set up cloud agents once in the Fluence Console, then launch your first agent with a task, a model, and a repository.
---

# Launch your first cloud agent

This guide takes you from an empty **Cloud agents** section to a working agent. You connect an AI provider and add a GitHub token once. After that, each launch asks only for a task, a model, and a repository. For what an agent is and how it is billed, see [Cloud agents concepts](./overview.md).

Before you start, you need:

- A Fluence account. The machine of the agent is billed to it. See [Payment and balance management](../balance.md).
- Access to models: a ChatGPT plan, an API key of a supported provider, or your own OpenAI or Anthropic compatible endpoint.
- A GitHub token with access to the repository the agent works on.

## Open Cloud agents

In the sidebar of the Fluence Console, open **Cloud agents**. The first time, the console connects the section to your account by itself and shows **Connecting Cloud agents…**. There is nothing to click.

The section has five tabs: **Agents**, **Presets**, **AI providers**, **Secrets**, and **Extensions**. Before your first agent, the **Agents** tab shows **Launch your first agent** with the setup steps.

If the console shows **Your role cannot use Cloud agents**, your role in the account lacks the access the message names. Ask the account owner for a role that grants it.

## Connect an AI provider

1. Open the **AI providers** tab.
2. Under **Providers**, choose how agents reach models:
   - To use your ChatGPT plan, select **Subscription** and click **Sign in with ChatGPT**. If the page shows a **ChatGPT** row with **Connect** instead, click **Connect** first. Then open the address the console shows, and type the code.
   - To use an API key, select **API key**, click **Connect** next to the provider, paste the key, and click **Save key**.
3. Check that the provider row shows **Ready**, or that **ChatGPT** in the **Overview** panel reads **Signed in**.

For all options, including your own endpoint, see [Connect an AI provider](./ai_providers.md).

## Add a GitHub token

1. Open the **Secrets** tab.
2. In the **GitHub token** card, click **Connect**.
3. Paste a token and click **Save token**.

The token needs access to every repository you give an agent: read access to clone, write access to push and open pull requests. See [Add a GitHub token and secrets](./secrets.md).

## Launch the agent

1. Open the **Agents** tab and click **Create new agent**. When you already have agents, the button reads **New agent**.
2. In the **Task** step, describe the work in **Task**, for example "Add a health check endpoint to the API, cover it with a test and open a pull request." Optional: enter an **Agent name**.
3. In the **Model** step, choose a model. The list comes from your connected AI providers.
4. In the **Machine** step, check the machine and its hourly price. The machine belongs to the preset. To use another size, click **Change in preset**.
5. In the **Repository** step, enter the **Repository URL**, for example `https://github.com/owner/repository`.
6. Check the **Review** panel: the model, the repository, the machine, and the **Price**. The panel below it lists the AI providers, secrets, and extensions that the agent gets.
7. Click **Launch agent**.

The console opens the agent page. The agent starts on the task right after launch.

If **Launch agent** is disabled, the line under it says what is missing: **Connect an AI provider to launch.** or **Add a GitHub token to launch.**

If the console cannot confirm the launch, it opens the agent list. Check the list before you launch again. Otherwise you can end up with two agents.

## Follow the work

On the agent page, the state goes from **Pending** through **Preparing** to **Working**. Creating the machine takes a few minutes. The step next to the state shows the progress, for example **Raising the machine**.

When the agent works, its replies and tool calls appear in the conversation. When the turn ends, the state becomes **Idle**. Send another message to continue, or stop the agent when the work is done. See [Work with a cloud agent](./manage_agents.md).

## Stop the agent

1. On the agent page, open the menu in the **Details** panel and click **Stop**.
2. Click **Stop agent** to confirm.

The agent stops, and its machine is released. An agent that you leave idle is stopped by itself after the idle time of its preset.
