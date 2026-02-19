# llms-txt-plugin — Implementation Plan

## Context

We want LLM agents to discover and consume our documentation. The markdown-source-plugin already generates clean `.md` files at build time. This new plugin generates `llms.txt` index files that point to those `.md` files, following the [llms.txt convention](https://llmstxt.org/).

## Output Files

| File | URL | Content |
|------|-----|---------|
| `build/llms.txt` | `/llms.txt` | Root — lists sections with links to their llms.txt |
| `build/docs/build/llms.txt` | `/docs/build/llms.txt` | Build section — all pages with subsection headings |
| `build/docs/stake/llms.txt` | `/docs/stake/llms.txt` | Stake section — all pages |
| `build/docs/connect_servers/llms.txt` | `/docs/connect_servers/llms.txt` | Connect Servers section — all pages |

## Plugin File

**`plugins/llms-txt-plugin/index.js`** — single file, ~120 lines.

### How it works

1. **Reads `sidebars.js`** (`require('../../sidebars.js')`) to discover sections and page structure. Each top-level key = section. Categories within = subsection headings (`###`).

2. **Reads front matter** from each doc's source `.md` file to extract `title` and `description`. If no `title` in front matter, extracts the first `# Heading` from the file content. If no `description`, the link has no description text.

3. **Checks for special files** in each section directory and at `docs/` root:
   - `llms_txt_override.md` → use as entire llms.txt content (skip auto-generation)
   - `llms_txt_include_head.md` → prepend content before auto-generated list
   - If both exist → use override only, log a warning
   - Neither → auto-generate with a default `# Section Name` heading

4. **Generates llms.txt** for each section:
   - Optional header from `llms_txt_include_head.md`
   - `## Docs` heading
   - Top-level sidebar items as `- [Title](url.md): Description`
   - Categories as `### Category Label` followed by their items

5. **Generates root llms.txt**:
   - Optional header from `llms_txt_include_head.md` or override
   - `## Sections` heading (if not overridden)
   - One entry per section: `- [Section Name](/docs/section/llms.txt)`

6. **Constructs full URLs** using `context.siteConfig.url` (= `https://fluence.dev`).

### Sidebar parsing logic

```
sidebars.js structure:
{
  build: [
    "build/overview",              → top-level item
    { type: "category", label: "GPU Cloud", items: [...] }  → subsection
  ]
}

Output:
## Docs
- [Overview](https://fluence.dev/docs/build/overview.md)

### GPU Cloud
- [Instance Rent](https://fluence.dev/docs/build/gpu_cloud/instance_rent.md)
```

### Front matter extraction

Simple regex on source file (no gray-matter dependency needed):
```js
// Extract YAML front matter
const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
// Extract title/description from YAML
// Fallback: extract first # heading
const h1Match = content.match(/^#\s+(.+)$/m);
```

### Section name for default headings

Derived from sidebar key: `build` → `Build`, `connect_servers` → `Connect Servers` (split on `_`, capitalize each word).

## Config Changes

**`docusaurus.config.ts`** — add plugin to plugins array:
```ts
plugins: [
  "docusaurus-plugin-sass",
  path.resolve(__dirname, "plugins/markdown-source-plugin"),
  path.resolve(__dirname, "plugins/llms-txt-plugin"),
],
```

**`vercel.json`** — already has llms.txt headers configured, no changes needed.

## Files to Create

1. `plugins/llms-txt-plugin/index.js` — the plugin
2. `docs/llms_txt_include_head.md` — root header (hand-written intro about Fluence)
3. `docs/build/llms_txt_include_head.md` — build section header
4. `docs/stake/llms_txt_include_head.md` — stake section header
5. `docs/connect_servers/llms_txt_include_head.md` — connect servers section header

Note: the `llms_txt_include_head.md` files will be created with minimal placeholder content. The user can refine the descriptions later.

## Files to Modify

1. `docusaurus.config.ts` — add plugin reference (line 148)

## Special Files Excluded

`llms_txt_override.md` and `llms_txt_include_head.md` must be excluded from:
- The auto-generated page list (don't list them as doc pages) — handled by checking filename before adding to list
- The markdown-source-plugin (don't generate `.md` copies) — add exclusion in markdown-source-plugin's `findMarkdownFiles` or `postBuild`

## Verification

1. `npm run build` — succeeds, logs show llms.txt generation
2. `cat build/llms.txt` — root file with section links
3. `cat build/docs/build/llms.txt` — build section with structured page list, subsection headings for CPU Cloud / GPU Cloud / API
4. `cat build/docs/stake/llms.txt` — stake pages
5. `cat build/docs/connect_servers/llms.txt` — connect servers pages
6. All `.md` URLs in llms.txt are full `https://fluence.dev/...` URLs
7. Verify `llms_txt_include_head.md` files are NOT listed as doc pages in any llms.txt
8. Verify `llms_txt_include_head.md` files are NOT copied as `.md` files to build output
