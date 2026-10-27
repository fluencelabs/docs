# fluence-docs

Source of the public Fluence documentation at https://fluence.dev. It covers renting CPU and GPU compute, the public API, AI agent access, staking, and connecting servers as a provider. The site is built with Docusaurus 3 and deployed by Vercel: a merged PR is live on fluence.dev within minutes.

If `AGENTS.local.md` exists in the repository root, read it before acting. It holds machine-local agent configuration that is not published.

## Before you write

- Read the "Contributing" section of `README.md`. It defines file layout, image rules, which MDX components the markdown plugin keeps or drops, and the `llms.txt` rules.
- Check every claim about product behaviour against the live product before you write it: the console, the API reference at https://api.fluence.dev/scalar, and live API responses. Memory and old pages are not sources.
- If you could not observe a behaviour, do not state it as fact. Leave it out, or list it in the PR description under "Not verified".
- This repository is public. Do not write internal service names, repository names, hostnames, people's names, or agent tooling into pages, commits, or PR descriptions. Describe the product as a user sees it.

## Commands

| Task | Command |
|---|---|
| Install dependencies | `npm ci` |
| Run the dev server | `npm run dev` |
| Run the gate (typecheck and build; broken links and anchors fail it) | `npm run gate` |
| Serve the production build | `npm run serve` |

Run `npm run gate` before every push. Vercel builds a preview for each PR; open the preview and read the pages you changed.

## Project structure

| Path | Contents |
|---|---|
| `docs/build/` | Build: account, balance, settings, CPU Cloud, GPU Cloud, API, agent guides |
| `docs/stake/` | Stake: wallets, bridge, staking app |
| `docs/connect_servers/` | Connect Servers: provider onboarding |
| `docs/build_with_ai/` | Using the docs and the product from AI tools |
| `sidebars.js` | Page order. A page missing here is not in the sidebar or in `llms.txt`. |
| `docusaurus.config.ts` | Navbar, footer, plugins, site options |
| `vercel.json` | Redirects and headers. When you move or delete a page, add a permanent redirect from the old URL. |
| `plugins/llms-txt-plugin/` | Generates `llms.txt` indexes from `sidebars.js` |
| `plugins/markdown-source-plugin/` | Generates the `.md` version of every page and the "Copy as Markdown" menu |
| `src/pages/` | Landing page |

## Writing rules

These rules apply to pages, commit messages, and PR descriptions. They follow the `technical-writing`, `unslop`, and `avoid-ai-writing` skills; if those skills are installed, run them on every page you touch.

Structure:
- Give each page one mode: tutorial, how-to guide, reference, or explanation. Do not mix them. Split the page and link instead.
- Name a how-to page by its task ("Rent a GPU instance"), not by a topic ("GPU rental").
- Use sentence case for headings. Use one `#` heading per page and do not skip heading levels.
- Use numbered lists for steps and bullets for everything else. Introduce a list with a full sentence.

Sentences:
- Write to the reader as "you", in the present tense. Write steps as commands: "Click **Create**."
- Put the condition before the step: "To delete the disk, select **Delete disks**."
- Use the exact UI label in bold, and the exact endpoint, field, or command in code font.
- Name the actor. Write "the console shows the address", not "the address is shown".
- Keep one instruction per sentence. Split sentences longer than about 25 words.
- Call each thing by one name on every page.

Words and punctuation:
- Cut words that do no work: "in order to", "it is important to note that", "simply", "easy", "quickly", "please".
- Use plain words: "use", not "leverage" or "utilize". Avoid "seamless", "robust", "powerful", "cutting-edge", "delve", "crucial", and similar filler.
- Do not use em dashes. Use a period or a comma.
- Do not bold whole phrases for emphasis. Bold is for UI labels.
- Do not add emojis to headings or lists.
- Use straight quotes.

Facts:
- Give numbers with units: prices, limits, billing periods, timeouts.
- Do not announce future features. Document what ships.
- Do not invent examples. Every request and response sample must come from a real call or the published API spec.

## Git workflow

- Use conventional commits (`feat:`, `fix:`, `docs:`, `chore:`). Branch names: `feat/…`, `fix/…`, `chore/…`. PR titles use the same format.
- Work in your own worktree: `git worktree add <dir> -b <branch> origin/main`.
- A PR description says what changed, how each fact was checked (observed live, or read from the API spec), and what is not verified.
- Do not add a co-author trailer unless asked.
- Never use `--no-verify`, `--force`, or `git reset --hard` without explicit instruction.
