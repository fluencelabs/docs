# Using Fluence docs with AI tools

Fluence documentation is available in machine-readable formats so you can use it with LLMs, AI coding assistants, and agent frameworks.

## llms.txt

The [`/llms.txt`](https://fluence.dev/llms.txt) file is the entry point for LLM agents. It follows the [llms.txt convention](https://llmstxt.org/) and provides a structured index of all documentation sections, each linking to its own `llms.txt` with individual page links.

| File | Description |
|------|-------------|
| [`/llms.txt`](https://fluence.dev/llms.txt) | Root index — links to all section indexes |
| [`/docs/build/llms.txt`](https://fluence.dev/docs/build/llms.txt) | Build — renting and managing compute |
| [`/docs/stake/llms.txt`](https://fluence.dev/docs/stake/llms.txt) | Stake — delegating FLT and earning rewards |
| [`/docs/connect_servers/llms.txt`](https://fluence.dev/docs/connect_servers/llms.txt) | Connect Servers — provider onboarding |

Use these files to give an LLM agent context about Fluence, or paste a section's `llms.txt` into a chat to get a table of contents with direct links.

## Markdown versions of pages

Every documentation page is available as clean markdown. Append `.md` to any page URL:

```
https://fluence.dev/docs/build/overview → https://fluence.dev/docs/build/overview.md
```

The markdown is cleaned of MDX syntax, React components, and front matter — ready to paste into ChatGPT, Claude, Cursor, or any other tool.

## Copy as Markdown

Every documentation page has a dropdown button (next to the page title) with two options:

- **View as Markdown** — opens the `.md` version in a new tab
- **Copy Page as Markdown** — copies the page content to your clipboard

Use this when you want to quickly feed a specific page into an AI tool without leaving the browser.
