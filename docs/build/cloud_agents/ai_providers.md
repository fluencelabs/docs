---
description: Connect a ChatGPT subscription, a provider API key, or your own OpenAI or Anthropic compatible endpoint, so cloud agents can use its models.
---

# Connect an AI provider

Cloud agents call models through the AI providers that you connect. You connect them once on the **Cloud agents** > **AI providers** page, and every new agent can use their models. Model use is billed by your AI provider, separately from the machine.

You can connect providers in three ways:

| Way | What you bring | Models |
|---|---|---|
| Subscription | A ChatGPT plan. You sign in with a code, without an API key. | The models of your ChatGPT plan |
| API key | A key of **Fluence inference**, **OpenAI**, **Z.ai**, or **OpenRouter** | The models of that provider |
| Custom | The base URL and API key of an OpenAI or Anthropic compatible API | The models that the endpoint lists |

You can connect several at once. The **Providers** card shows how many sources are connected, and the **Overview** panel shows the **ChatGPT** state and the number of **Provider keys**.

Keys are checked when you add them, stored, and never shown again. To change a key, save a new one.

## Sign in with a ChatGPT subscription

With a subscription, agents use your ChatGPT plan instead of an API key.

1. Open **Cloud agents** > **AI providers** and select **Subscription**.
2. If the page shows a **ChatGPT** row with **Connect**, click **Connect**.
3. Click **Sign in with ChatGPT**. The console shows an address and a code.
4. Open the address, sign in to ChatGPT, and type the code. The console shows how many minutes the code is good for.
5. Wait until the subscription shows **Active**. The page refreshes by itself.

A subscription shows one of these states:

| State | Meaning |
|---|---|
| **Waiting for code** | You started the sign-in and have not entered the code yet |
| **Active** | Agents can use the subscription |
| **Needs sign-in** | The sign-in no longer works. Click **Sign in again**. |
| **Forgetting…** | The subscription is being removed |

You can sign in more than one subscription. Agents use the one marked **selected**. The others stay signed in as spares. To switch, click **Use this one** on an active subscription.

To remove a subscription, click **Forget** and confirm with **Forget subscription**. If you forget the selected one, the most recently signed-in active subscription takes its place. With none left, new agents cannot use ChatGPT models until you sign in again.

## Add an API key

1. Open **Cloud agents** > **AI providers** and select **API key**.
2. Click **Connect** next to the provider.
3. Paste the key. The link under the field opens the page where the provider issues keys.
4. Click **Save key**. The row shows **Ready**.

To replace a key, click **Change**, paste the new key, and click **Save key**. To remove it, click **Change**, then **Remove**, and confirm with **Remove key**. New agents can no longer use the models of that provider through a key until you add one again.

A **Fluence inference** key needs the inference permission. The console reads the models of the key once, when you save it. If the key gives no model list, the console refuses it.

## Connect your own endpoint

Use **Custom** for any OpenAI or Anthropic compatible API, for example a model that you serve yourself.

1. Open **Cloud agents** > **AI providers** and select **API key**.
2. In the **Custom** row, click **Connect**.
3. Enter the provider name, for example `vllm`. Use up to 48 lowercase letters, digits, and hyphens, starting with a letter or a digit. You cannot change the name later.
4. Enter the base URL, for example `https://llm.example.com/v1`.
5. Choose **OpenAI protocol** or **Anthropic protocol**.
6. Enter the API key.
7. Click **Add provider**.

When you save, Fluence asks the address for its model list. The address must be reachable from the public internet and must answer with a list of models. If it does not, the console refuses the provider.

Agents name the models of a custom provider as `custom-<name>/<model>`, for example `custom-vllm/llama-3.1-8b`.

To change the address, the protocol, or the key, click **Change** on the provider row and then **Save provider**. An empty key field keeps the stored key. To remove the provider with its key, click **Remove** and confirm with **Remove provider**.

## How models are named

A model has the form `provider/model`. The launch form lists the models of all connected providers, each with its provider. You pick a model from the list.

## Changes and running agents

An agent takes its AI providers at launch. A new key, a removed provider, or a new subscription applies to new launches. Running agents keep what they started with.
