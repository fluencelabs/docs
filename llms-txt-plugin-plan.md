# Plan: LLM-friendly docs plugin (`llms-txt-plugin`)

## Context & Problem

Docusaurus compiles `.md` source files into HTML-only output (`build/docs/build/api/ssh_keys/index.html`). The original markdown is not included in the build. This means:

- If you `curl` any page, you get an HTML shell with JS-loaded content — useless for LLMs
- There's no way to get clean markdown via URL (e.g., appending `.md`)
- There's no `llms.txt` index for LLMs to discover documentation structure
- No UI for humans to quickly copy a page as markdown

## Research Summary

### The llms.txt standard (llmstxt.org)
Proposes: (1) provide LLM-friendly info via `llms.txt` files, (2) allow appending `.md` to any URL to get markdown source. We follow both.

### Existing plugins evaluated

**`docusaurus-plugin-llms` (rachfop):** Generates `llms.txt` and `llms-full.txt`, optionally per-page `.md` files. Processes source markdown (not built HTML). No UI. No hierarchical indexes.

**`@signalwire/docusaurus-plugin-llms-txt`:** Processes built HTML → markdown. Has copy button but requires a separate theme package (`@signalwire/docusaurus-theme-llms-txt`). More complex than we need.

**`docusaurus-markdown-source-plugin` (FlyNumber):** ~150 lines. Copies cleaned source `.md` files to build output. Provides a dropdown UI (view/copy markdown). MIT licensed. Simple, does exactly what we need for per-page markdown + UI.

### Decision: custom plugin based on FlyNumber

We copy and adapt FlyNumber's MIT-licensed code (~150 lines for markdown processing + ~60 lines for theme Root + ~120 lines for dropdown component) because:

1. Our images use `assets/` directories, FlyNumber hardcodes `img/` — needs adaptation
2. We need hierarchical `llms.txt` index generation — FlyNumber doesn't have this
3. We want one plugin, not two — combining `.md` generation and `llms.txt` indexes
4. Our docs are plain markdown (no heavy MDX), so the plugin is straightforward
5. Keeping FlyNumber's MDX transformations (Tabs, TabItem, details, iframes, Head, React components) for future-proofing even though we don't currently use them

### What we keep from FlyNumber as-is
- `cleanMarkdownForDisplay()` — strips frontmatter, imports, converts MDX components
- `convertTabsToMarkdown()` — converts `<Tabs>/<TabItem>` to plain markdown
- `convertDetailsToMarkdown()` — converts `<details>/<summary>` to markdown
- `findMarkdownFiles()` — recursive `.md` file finder
- `MarkdownActionsDropdown` component — dropdown with "View as Markdown" / "Copy Page as Markdown"
- `theme/Root.js` — injects dropdown into article header via DOM manipulation

### What we adapt
- Image directory copying: `img/` → `assets/` (our convention)
- Image path rewriting regex: `./assets/` → absolute `/docs/<path>/assets/`
- URL construction in dropdown: paths adjusted for our doc structure
- Add `llms.txt` index generation (new feature, not in FlyNumber)

---

## Implementation

### Step 1: Create plugin directory structure

```
src/plugins/llms-txt-plugin/
├── index.js                          ← main plugin entry point
├── README.md                         ← detailed documentation (see below)
├── theme/
│   └── Root.js                       ← Docusaurus theme wrapper, injects UI
└── components/
    └── MarkdownActionsDropdown/
        └── index.js                  ← React dropdown component
```

### Step 2: Implement `index.js` — main plugin

The plugin exports a function that returns an object with:

- `name: 'llms-txt-plugin'`
- `getThemePath()` — returns `./theme` so Docusaurus loads our `Root.js`
- `async postBuild({ outDir, siteConfig })` — runs after build completes:

**Phase A: Generate per-page `.md` files**
1. Read `docsDir` (`<siteDir>/docs/`)
2. Recursively find all `.md` files
3. For each file: read → `cleanMarkdownForDisplay()` → write to `<outDir>/docs/<relative-path>`
4. Find and copy all `assets/` directories from docs to build output
5. Skip `llms_prefix.md` files — they are metadata for index generation, not doc pages

**Phase B: Generate `llms.txt` index files**
1. Read `sidebars.js` via `require()` to get the sidebar structure
2. For each level, check if a `llms_prefix.md` file exists in the corresponding `docs/` directory — if so, read it and insert its contents between the heading and the link list
3. Walk the sidebar tree, generating an `llms.txt` for each level:

```
build/llms.txt                              → root index (links to sections)
build/docs/build/llms.txt                   → Build section index
build/docs/build/api/llms.txt               → API subsection index
build/docs/build/cpu_cloud/llms.txt         → CPU Cloud subsection index
build/docs/build/gpu_cloud/llms.txt         → GPU Cloud subsection index
build/docs/stake/llms.txt                   → Stake section index
build/docs/connect_servers/llms.txt         → Connect Servers section index
```

Each `llms.txt` follows this format:
```markdown
# Fluence Docs - Build

<contents of docs/build/llms_prefix.md if it exists, otherwise nothing>

- [Overview](https://fluence.dev/docs/build/overview.md)
- [Registration](https://fluence.dev/docs/build/registration/registration.md)
- [Balance](https://fluence.dev/docs/build/balance/balance.md)
- [Settings](https://fluence.dev/docs/build/settings/settings.md)

## CPU Cloud
- [Concepts](https://fluence.dev/docs/build/cpu_cloud/overview/overview.md)
- [Rent a VM](https://fluence.dev/docs/build/cpu_cloud/vm_rent/vm_rent.md)
- [Manage instances](https://fluence.dev/docs/build/cpu_cloud/manage_vm/manage_vm.md)
- [Provider VM Termination](https://fluence.dev/docs/build/cpu_cloud/manage_vm/provider_vm_termination.md)

## GPU Cloud
- [Concepts](https://fluence.dev/docs/build/gpu_cloud/overview/overview.md)
...

## API
- [Overview](https://fluence.dev/docs/build/api/overview.md)
...
```

Page titles are extracted from the first `# heading` in each markdown file (after frontmatter stripping).

The root `llms.txt` links to section-level indexes:
```markdown
# Fluence Docs

<contents of docs/llms_prefix.md if it exists>

## Sections
- [Build](https://fluence.dev/docs/build/llms.txt): API and guides for building on Fluence
- [Stake](https://fluence.dev/docs/stake/llms.txt): Staking guides and wallet setup
- [Connect Servers](https://fluence.dev/docs/connect_servers/llms.txt): Server connection and hardware setup
```

### Step 3: Implement `theme/Root.js`

Adapted from FlyNumber. A Docusaurus theme Root wrapper that:
1. On every docs page (`/docs/*`), waits for DOM to be ready
2. Finds the article header (`article .markdown header`)
3. If not already injected, creates a container div and renders `<MarkdownActionsDropdown />` onto it via `createRoot()`
4. Also handles hash-based scroll (from FlyNumber — useful, keeping it)

### Step 4: Implement `MarkdownActionsDropdown` component

Adapted from FlyNumber. A React component that:
1. Only renders on `/docs/` pages
2. Shows a dropdown button labeled "Open Markdown"
3. Constructs the `.md` URL from current pathname: `${pathname}.md`
4. "View as Markdown" — `window.open(mdUrl, '_blank')`
5. "Copy Page as Markdown" — `fetch(mdUrl)` → `navigator.clipboard.writeText(text)` → show "Copied!" feedback

### Step 5: Register plugin in `docusaurus.config.ts`

Add to the `plugins` array:
```ts
plugins: [
  "docusaurus-plugin-sass",
  path.resolve(__dirname, "src/plugins/llms-txt-plugin"),
],
```

### Step 6: Configure Vercel headers in `vercel.json`

Add headers to serve `.md` files with correct content type and prevent search engine indexing (avoid duplicate content SEO issues):

```json
{
  "headers": [
    {
      "source": "/docs/(.*).md",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex" },
        { "key": "Content-Type", "value": "text/markdown; charset=utf-8" }
      ]
    },
    {
      "source": "/(.*)/llms.txt",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex" },
        { "key": "Content-Type", "value": "text/plain; charset=utf-8" }
      ]
    }
  ]
}
```

---

## Plugin README (to be created at `src/plugins/llms-txt-plugin/README.md`)

The README will document:

1. **What the plugin does** — generates LLM-friendly markdown files and hierarchical `llms.txt` indexes from Docusaurus docs
2. **How it works** — hooks into `postBuild`, processes source markdown, generates indexes from sidebar structure
3. **Architecture** — three components: build-time processor, theme Root wrapper, dropdown React component
4. **File-by-file breakdown:**
   - `index.js`: entry point, markdown cleaning functions (with inline comments explaining each transformation), `postBuild` hook
   - `theme/Root.js`: DOM injection strategy, why timeouts are used
   - `components/MarkdownActionsDropdown/index.js`: UI component, clipboard API usage
5. **How to modify:**
   - Adding new MDX component transformations → add regex in `cleanMarkdownForDisplay()`
   - Changing image directory name → update `copyAssetDirectories()` and image path regex
   - Adding new sidebar sections → automatic, plugin reads `sidebars.js`
   - Changing `llms.txt` format → modify `generateLlmsTxt()` function
   - Changing dropdown UI → edit `MarkdownActionsDropdown/index.js`
   - Adding/editing prefix text for a section's `llms.txt` → create/edit `llms_prefix.md` in the corresponding `docs/` directory (e.g., `docs/build/llms_prefix.md` for the Build section index)
6. **Origin** — adapted from `docusaurus-markdown-source-plugin` (FlyNumber, MIT license), with `llms.txt` index generation added

---

## Verification

1. `npm run build` — plugin logs processed files and generated indexes
2. `npm run serve` — test URLs:
   - `http://localhost:3000/docs/build/api/ssh_keys.md` → returns clean markdown
   - `http://localhost:3000/llms.txt` → root index with section links
   - `http://localhost:3000/docs/build/llms.txt` → Build section index
   - `http://localhost:3000/docs/build/api/llms.txt` → API subsection index
   - Dropdown button visible on doc pages, both "View" and "Copy" work
3. Verify `build/docs/build/balance/assets/` exists (image directories copied)
4. Verify `.md` files don't contain YAML frontmatter or import statements
5. Verify `llms.txt` links use absolute URLs with `https://fluence.dev` base
