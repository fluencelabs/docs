---
description: Connect AI clients to Fluence through MCP, let agents pay with a wallet over x402, and give the Fluence docs to LLMs as llms.txt and markdown.
---

# Build with AI

AI tools can work with Fluence in three ways:

- An MCP client manages your CPU virtual machines with a Fluence API key.
- An autonomous agent funds its own account with USDC and calls the Fluence API.
- An LLM reads these docs in machine-readable formats.

## Connect an MCP client

The Fluence MCP server at `https://api.fluence.dev/mcp` gives Claude Code, Cursor, Codex, VS Code, and other MCP clients tools for CPU virtual machines. The tools create, launch, and terminate VMs and manage their disks, networks, and public IP addresses. The client signs in with an API key that you create in the Fluence Console. The scopes of the key decide which tools the client gets.

To set up a client, see [Connect an AI client through MCP](./mcp.md). For the tool list, permissions, limits, and errors, see the [MCP server reference](./mcp_reference.md).

## Let an agent pay with its own wallet

An agent with an EVM wallet can top up a Fluence balance with USDC on Base over the x402 protocol, sign in with the same wallet, and rent compute through the API without a human. See [Pay with x402 (for agents)](../build/api/x402.md).

## Give the docs to an LLM

### llms.txt

The [`/llms.txt`](https://fluence.dev/llms.txt) file is the entry point for LLM agents. It follows the [llms.txt convention](https://llmstxt.org/) and links to an `llms.txt` file for each section. Each section file links to the markdown version of every page in that section.

| File | Contents |
|------|-------------|
| [`/llms.txt`](https://fluence.dev/llms.txt) | Root index with links to all section indexes |
| [`/docs/build/llms.txt`](https://fluence.dev/docs/build/llms.txt) | Build: renting and managing compute, the API, x402 |
| [`/docs/build_with_ai/llms.txt`](https://fluence.dev/docs/build_with_ai/llms.txt) | Build with AI: the MCP server and this page |
| [`/docs/stake/llms.txt`](https://fluence.dev/docs/stake/llms.txt) | Stake: staking FLT and claiming tokens from the Fluence chain |
| [`/docs/connect_servers/llms.txt`](https://fluence.dev/docs/connect_servers/llms.txt) | Connect Servers: provider onboarding |

Give an agent the root `llms.txt`, or paste a section's `llms.txt` into a chat to give the model a list of pages with direct links.

### Markdown versions of pages

Every page is also available as markdown. Add `.md` to the page URL:

```text
https://fluence.dev/docs/build/overview → https://fluence.dev/docs/build/overview.md
```

The markdown version has no MDX syntax, React components, or front matter, so you can paste it into ChatGPT, Claude, Cursor, or any other tool.

### Copy as Markdown

Every page has a menu next to its title with two options:

- **View as Markdown** opens the `.md` version in a new tab.
- **Copy Page as Markdown** copies the page content to your clipboard.
