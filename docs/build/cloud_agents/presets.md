---
description: Create and edit cloud agent presets in the Fluence Console. A preset holds the default model, the machine size, cluster and idle time, the extensions, and launch defaults.
---

# Create and edit presets

A preset says what an agent runs with: a model, a machine, and the extensions it includes. A preset can also carry a default repository and task. Every launch goes from a preset.

Your account has the **Default** preset. Agents launch from it when you choose no other, and it cannot be renamed or deleted. Create more presets when different work needs a different machine, model, or set of extensions, for example a large machine for one repository.

You manage presets on the **Cloud agents** > **Presets** page.

## What a preset holds

| Block | Fields | If you leave it empty |
|---|---|---|
| **Model** | **Default model** | Each launch names a model |
| **Machine** | **Cluster**, **VM size**, **Idle hours** | The default cluster, the default size, and the default idle time |
| **Extensions** | The MCP servers, plugins, and skills repositories that the preset includes | The agent gets no extensions |
| **Launch defaults** | **Repository URL**, **Task** | The launch form asks for them |
| **Advanced** | **Environment**, **AI profile** | The secrets and the AI providers of the account |

An agent takes a copy of its preset at launch. If you edit or delete a preset later, agents already launched from it are not changed.

## Preset list

The list shows each preset with its **Model**, **Secrets**, **Machine**, and **Extensions**:

- **Model** shows the default model, or **Named at launch**.
- **Secrets** shows **Account** when the preset uses the secrets of the **Secrets** page. A badge such as **1 missing** shows how many secrets the preset needs and does not have.
- **Machine** shows the size and its hourly price.

To launch an agent from a preset, click **Launch** on its row.

## Create a preset

1. Open **Cloud agents** > **Presets** and click **New preset**.
2. Enter a **Name**: up to 64 characters, different from the names of your other presets.
3. Click **Create preset**.

The new preset starts as a copy of the default preset. After that it lives on its own. Changing the default preset later does not change it.

The console opens the page of the new preset, where you edit its blocks.

## Edit a preset

Open the preset from the list. The page shows each block with its current values. To change a block, click **Edit** next to its title, change the fields, and click **Save**.

### Choose the default model

In **Model**, choose the **Default model** from the models of your AI providers. The launch form opens with this model selected. To make each launch name a model, choose **None — each launch names one**.

### Choose the machine

In **Machine**, set where and on what the agent runs:

- **Cluster**: where the machine is created. Sizes and prices depend on it. **Provider default** leaves the choice to Fluence.
- **VM size**: the size of the machine. Each size shows its vCPU, RAM, disk, and hourly price. **Default** takes the default size of the cluster. The console shows the price that you pay while the machine runs.
- **Idle hours**: whole hours without work before the machine shuts down and an idle agent on it is stopped. Enter 1 or more. An empty field takes the default.

When you change the cluster, the console keeps the size if the new cluster also sells it. Otherwise it falls back to the default size of that cluster.

The launch form does not ask for a machine. To launch on another machine, change it in the preset, or launch from another preset.

### Choose the extensions of a preset

In **Extensions**, select the MCP servers, plugins, and skills repositories that the preset includes, and click **Save**. The list shows the extensions of your account. To add or change an extension itself, click **Manage extensions**. See [Add MCP servers, plugins, and skills](./extensions.md).

If a selected extension names a secret that the preset does not have, the console marks it **Missing secret**. Add the secret before you launch. A launch from a preset with a missing secret is refused.

### Set launch defaults

In **Launch defaults**, optionally enter a **Repository URL** and a **Task**. The launch form opens with them filled in, and you can still change them for each launch.

The repository URL is an `https://` address with a path and no credentials in it, for example `https://github.com/owner/repo`.

### Rename or delete a preset

To rename a preset, click **Rename**, enter the new name, and click **Save**.

To delete a preset, click **Delete** and confirm with **Delete preset**. Agents already launched from it keep running. Its secrets stay as they are.

## Use separate secrets or AI providers for a preset

Most presets use the secrets and the AI providers of the account, and you can skip this section. The **Advanced** block is for two cases: a preset that needs a second GitHub token, or a preset that needs its own set of AI providers.

- **Environment** is a set of secrets: one GitHub token and named secrets. The secrets of the **Secrets** page are the environment of the account. To create another one, click **Manage environments**, then **New environment**, and give it a name. Then choose it in **Environment**. To edit its secrets, click **Manage secrets**.
- **AI profile** is a set of AI providers: subscriptions, keys, and custom endpoints. The providers of the **AI providers** page are the default profile. **Account default** uses whichever profile is the default when an agent starts. To create or clone a profile, click **Manage AI profiles**.

The **Advanced** block also lists the secrets that the preset needs, each marked **Set** or **Missing**.

Keep these in mind:

- The default model of a preset must be a model that its AI profile offers. If you choose a profile that does not offer the stored model, the console clears the model and asks you to choose another one in **Model**.
- The MCP servers and plugins of a preset take their secrets from the environment of the preset. A secret of the same name in another environment is a different secret.
- Saving the secrets of an environment makes a new version. Running agents keep the version they started with. New agents get the latest.
- Deleting an environment destroys its secrets. A profile cannot be deleted while it is the default or holds a subscription.
