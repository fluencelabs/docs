# llms-txt-plugin

## Why This Exists

This plugin generates `llms.txt` index files so that LLM agents can discover and consume our documentation. It follows the [llms.txt convention](https://llmstxt.org/).

The companion `markdown-source-plugin` already produces clean `.md` files at build time. This plugin generates `llms.txt` files that point to those `.md` files, giving LLMs a structured entry point into the docs.

## Output Files

The plugin generates one root file and one file per sidebar section:

| File | URL | Content |
|------|-----|---------|
| `build/llms.txt` | `/llms.txt` | Root — lists sections with links to their llms.txt |
| `build/docs/<section>/llms.txt` | `/docs/<section>/llms.txt` | Section — all pages with subsection headings |

For example, a sidebar key `build` produces `build/docs/build/llms.txt` at `/docs/build/llms.txt`. Sections are discovered automatically from `sidebars.js` — adding a new top-level key generates a new llms.txt on the next build.

## File Structure

```
plugins/llms-txt-plugin/
├── index.js    # Docusaurus plugin (build-time only)
├── README.md   # This file
└── PLAN.md     # Original implementation plan
```

## How It Works

The plugin runs in the `postBuild` lifecycle hook and does three things:

### 1. Read sidebar structure

Requires `sidebars.js` to discover sections and page hierarchy. Each top-level key becomes a section. Categories within become `###` subsection headings in the output.

```
sidebars.js:
{
  build: [
    "build/overview",
    { type: "category", label: "GPU Cloud", items: ["build/gpu_cloud/instance_rent"] }
  ]
}

Output:
## Docs
- [Overview](https://fluence.dev/docs/build/overview.md)

### GPU Cloud
- [Renting an instance](https://fluence.dev/docs/build/gpu_cloud/instance_rent.md)
```

### 2. Extract titles from source files

For each sidebar item, the plugin reads the source `.md` file and extracts:
- **Title**: from YAML front matter `title:` field, or the first `# Heading`
- **Description**: from YAML front matter `description:` field (optional)

No external dependencies needed — uses simple regex matching.

### 3. Check for special files

In each section directory (and at `docs/` root), the plugin looks for:

| File | Effect |
|------|--------|
| `llms_txt_override.md` | Use as entire llms.txt content (skip auto-generation) |
| `llms_txt_include_head.md` | Prepend content before the auto-generated list |

If both exist, the override wins and a warning is logged.

If neither exists, a default `# Section Name` heading is generated (derived from the sidebar key: `connect_servers` becomes `Connect Servers`).

### 4. Construct URLs

All `.md` URLs use the full site URL from `docusaurus.config.ts` (`https://fluence.dev`), e.g. `https://fluence.dev/docs/build/overview.md`.

## Special Files

### `llms_txt_include_head.md`

Placed in a section directory (e.g. `docs/build/llms_txt_include_head.md`) or at the docs root (`docs/llms_txt_include_head.md`). Content is prepended before the auto-generated page list.

Example `docs/build/llms_txt_include_head.md`:
```markdown
# Build

> Documentation for developers using the Fluence compute marketplace. Covers the Fluence Console
> (web UI) and API for renting and managing CPU and GPU instances on decentralized infrastructure.

If you are new to Fluence, start with the [Overview](https://fluence.dev/docs/build/overview.md)
to understand the platform. If you are already familiar with the platform, jump to the relevant
section below.
```

The pattern is: `# Heading`, a blockquote with a one-line summary (who it's for, what it covers), then a short paragraph guiding the reader — typically pointing new users to the Overview and telling experienced users to skip ahead.

### `llms_txt_override.md`

Placed in the same locations. If present, the entire llms.txt content is replaced with this file's content — no auto-generation occurs.

Useful when you want full manual control over a section's llms.txt — for example, to embed section links directly in hand-written content instead of relying on auto-generation.

### Exclusion from other systems

Both special file types are automatically excluded from:
- **This plugin's page list** — they won't appear as doc entries in llms.txt
- **Docusaurus docs plugin** — the `exclude` option in `docusaurus.config.ts` prevents Docusaurus from generating HTML pages for them
- **markdown-source-plugin** — they won't be copied as `.md` files to the build output

## How To

### Add a new section

1. Add the section to `sidebars.js` with a new top-level key
2. Optionally create `docs/<section>/llms_txt_include_head.md` with a description
3. Rebuild — the plugin picks up new sidebar keys automatically

### Add descriptions to pages

Add YAML front matter to the doc source file:

```markdown
---
title: Overview
description: Introduction to the Fluence Console and its capabilities.
---

# Overview
...
```

The description appears after the link in llms.txt: `- [Overview](url.md): Introduction to...`

### Customize a section header

Create or edit `docs/<section>/llms_txt_include_head.md`. The content replaces the default `# Section Name` heading.

When writing a header, follow this pattern:
1. `# Section Name` — the heading
2. A blockquote (`>`) with a one-line summary: who the section is for and what it covers
3. A short paragraph guiding the reader — point new users to the Overview, tell experienced users to jump ahead

### Fully override a section

Create `docs/<section>/llms_txt_override.md` with the complete desired content. The auto-generated list is skipped entirely.

## Integration Points

### `docusaurus.config.ts`

Plugin registration:
```ts
plugins: [
  "docusaurus-plugin-sass",
  path.resolve(__dirname, "plugins/markdown-source-plugin"),
  path.resolve(__dirname, "plugins/llms-txt-plugin"),
],
```

Docs plugin exclusion (prevents Docusaurus from generating HTML pages for special files):
```ts
docs: {
  exclude: ["**/llms_txt_override.md", "**/llms_txt_include_head.md"],
},
```

### `vercel.json`

The existing headers configuration already covers `llms.txt`:
```json
{ "source": "/llms.txt", "headers": [{ "key": "Content-Type", "value": "text/plain; charset=utf-8" }] }
```

### markdown-source-plugin

The `findMarkdownFiles` function in `markdown-source-plugin/index.js` skips `llms_txt_override.md` and `llms_txt_include_head.md` so they don't get copied to the build output as doc pages.

### Dependencies

- **`fs-extra`** — file operations (transitive dependency via Docusaurus)
- **`sidebars.js`** — required at build time for section/page structure

## Local Development Notes

### `npm run start` (dev server)

The `llms.txt` files are **not generated** during dev — only during `npm run build`.

### `npm run serve` (after build)

`.txt` files may return the SPA HTML fallback instead of the actual content (same issue as with `.md` files in markdown-source-plugin).

### Testing locally

```bash
npm run build
npx serve build -L    # -L disables SPA mode
# Visit http://localhost:3000/llms.txt
# Visit http://localhost:3000/docs/build/llms.txt
```

## Maintenance Guide

### Docusaurus major upgrade

Things most likely to break:
1. **`postBuild` hook** — check if the `{ outDir }` argument shape changes
2. **`context.siteConfig.url`** — verify it still provides the site URL
3. **`sidebars.js` format** — if sidebar item shapes change, update `buildItemLines()`

### Sidebar format changes

The plugin handles two item types:
- **String items**: `"build/overview"` — treated as doc page IDs
- **Category objects**: `{ type: "category", label: "...", items: [...] }` — rendered as `###` headings

If Docusaurus adds new sidebar item types (e.g. links, generated indexes), update `buildItemLines()` in `index.js`.

### Adding new special file types

1. Add the filename to `SPECIAL_FILES` array in `index.js`
2. Add handling logic in `generateSectionLlmsTxt()` or `generateRootLlmsTxt()`
3. The `isSpecialFile()` check will automatically exclude it from page lists
4. Update `markdown-source-plugin/index.js` `findMarkdownFiles()` to exclude it too
5. Add the filename pattern to the `exclude` array in `docusaurus.config.ts` docs plugin options
