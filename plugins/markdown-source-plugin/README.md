# markdown-source-plugin

## Why This Exists

This plugin adds an "Open Markdown" dropdown to docs pages, letting users view or copy the raw markdown source of any page. It also copies cleaned `.md` files into the build output so they're accessible as static files.

It was originally based on [`docusaurus-markdown-source-plugin`](https://www.npmjs.com/package/docusaurus-markdown-source-plugin) (v2.0.1 by FlyNumber), but the npm version had several bugs that made it incompatible with our site. We copied the source, fixed the bugs, and adapted it to our conventions. This is now an independent, standalone plugin — there is no relationship to the upstream package.

## Bugs Fixed

| # | Bug | Original Behavior | Fix |
|---|-----|-------------------|-----|
| 1 | **Build path** | Copies `.md` files to `build/<section>/file.md` | Copies to `build/docs/<section>/file.md` to match Docusaurus URL structure |
| 2 | **DOM selector** | `article .markdown header` (header as child of `.markdown`) | `article header` — in Docusaurus 3, `header` is a sibling of `.markdown`, not a child |
| 3 | **Image dir name** | Looks for `img/` directories | Looks for `assets/` (our convention) |
| 4 | **Image path rewrite** | Rewrites `./img/` in markdown content | Rewrites `./assets/` |
| 5 | **Trailing-slash URL** | Appends `intro.md` to trailing-slash paths | Strips trailing slash, appends `.md` (e.g. `/docs/build/overview/` -> `/docs/build/overview.md`) |
| 6 | **CSS selector** | Targets `article .markdown header` | Targets `article header` (same issue as #2) |

## File Structure

```
plugins/markdown-source-plugin/
├── index.js                                    # Docusaurus plugin (build-time)
├── theme/
│   └── Root.js                                 # Theme wrapper (client-side, injects dropdown)
├── components/
│   └── MarkdownActionsDropdown/
│       └── index.js                            # React dropdown component
└── README.md                                   # This file
```

Styles live in `src/css/custom.scss` (appended at the bottom, under the "Markdown Actions Dropdown Styles" comment).

## How It Works

The plugin has two phases: **build-time** and **client-side**.

### Build-Time (`index.js`)

Runs during `npm run build` via the Docusaurus `postBuild` lifecycle hook.

1. **Find markdown files** — Recursively walks `docs/` to find all `.md` files.

2. **Clean content** — Each file goes through an 11-step cleaning pipeline (`cleanMarkdownForDisplay`) that strips MDX/Docusaurus-specific syntax to produce clean, readable markdown:
   - Strips YAML front matter
   - Removes `import` statements
   - Converts `<p><img src={require(...)}>` to standard `![alt](path)` syntax
   - Converts YouTube iframes to text links
   - Cleans HTML5 video tags
   - Removes `<Head>` components (SEO metadata)
   - Converts `<Tabs>`/`<TabItem>` to labeled markdown sections with `---` separators
   - Converts `<details>`/`<summary>` to `### heading` sections
   - Removes remaining uppercase-starting React/MDX components
   - Rewrites relative `./assets/` image paths to absolute `/docs/.../assets/` paths
   - Strips leading blank lines

3. **Write to build output** — Cleaned `.md` files are written to `build/docs/<path>`, mirroring the source structure. This means `/docs/build/overview.md` serves the raw markdown for the `/docs/build/overview` page.

4. **Copy asset directories** — Finds all `assets/` directories under `docs/` and copies them to `build/docs/...` so image references in the cleaned markdown resolve correctly.

### Client-Side (`theme/Root.js` + `MarkdownActionsDropdown`)

**Root.js** is a [Docusaurus theme wrapper](https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root) provided via `getThemePath()`. It wraps the entire site and does two things:

1. **Hash scroll fix** — Handles smooth scrolling to `#anchors` with retry logic (images/content may load late).

2. **Dropdown injection** — On docs pages (`/docs/*`), queries the DOM for `article header`, creates a container `div`, and uses `createRoot` to render the `MarkdownActionsDropdown` React component into it. Uses multiple `setTimeout` attempts (0ms, 100ms, 300ms) to handle async DOM readiness.

**MarkdownActionsDropdown** renders a button with two actions:
- **View as Markdown** — Opens the `.md` URL in a new tab
- **Copy Page as Markdown** — Fetches the `.md` file via `fetch()`, copies content to clipboard

The `.md` URL is constructed by stripping any trailing slash from the current pathname and appending `.md`.

## Integration Points

### `docusaurus.config.ts`

```ts
plugins: [
  "docusaurus-plugin-sass",
  path.resolve(__dirname, "plugins/markdown-source-plugin"),
],
```

### `src/css/custom.scss`

The dropdown styles are at the bottom of the file. Key selectors:
- `article header` — flexbox layout to place the dropdown inline with the h1
- `.markdown-actions-container` — positioned dropdown wrapper
- Responsive rules for mobile
- RTL support

### `vercel.json`

Headers for production serving:
- `/docs/(.*).md` — `Content-Type: text/plain`, `noindex`, 1-hour cache
- `/docs/(.*)/assets/(.*)` — `noindex`, 24-hour immutable cache

### Dependencies

- **`fs-extra`** — Used in `index.js` for file operations. Available as a transitive dependency (through Docusaurus). If it disappears after a major upgrade, add it explicitly: `npm install fs-extra`.

## Local Development Notes

### `npm run start` (dev server)

The dropdown UI will appear, but **"View as Markdown" and "Copy" will not work**. The `.md` files are only generated during `npm run build` (in the `postBuild` hook). The dev server never runs this hook.

### `npm run serve` (after build)

The dropdown UI works, but **`.md` URLs return the SPA HTML fallback** instead of the actual file. This is because Docusaurus's `serve` command uses the `serve` package with `--single` (SPA mode), which catches all requests and returns `index.html` for unknown routes.

### Testing `.md` URLs locally

Use a plain static file server after building:

```bash
npm run build
npx serve build -L    # -L disables SPA mode
```

Then visit `http://localhost:3000/docs/build/overview.md` — it should return the raw markdown.

### Production (Vercel)

Everything works. Vercel serves static files directly from the filesystem before falling back to SPA routing.

## Maintenance Guide

### Adding a new image directory convention

If you start using a directory name other than `assets/` for images:
1. `index.js` — Update the `file === 'assets'` check in `findImgDirs()`
2. `index.js` — Update the regex in step 10 of `cleanMarkdownForDisplay()`
3. `index.js` — Update the console.log messages

### Docusaurus major upgrade

Things most likely to break:
1. **DOM structure** — If `article header` no longer matches, inspect the rendered page and update the selector in `theme/Root.js` line 45 and the CSS in `custom.scss`.
2. **`getThemePath` / Root wrapper API** — Check Docusaurus migration guide for theme component changes.
3. **`createRoot`** — If React version changes significantly, the `react-dom/client` import may need updating.
4. **`postBuild` hook** — Check if the `{ outDir }` argument shape changes.

### Adding new MDX component cleaning rules

Edit `cleanMarkdownForDisplay()` in `index.js`. The cleaning steps run in order — place new rules logically:
- Content-preserving conversions (like Tabs/details) should run **before** step 9 (the generic uppercase component stripper)
- New component types that should be fully removed can rely on step 9's catch-all regex

### Changing the dropdown UI

Edit `components/MarkdownActionsDropdown/index.js`. It's a standard React component using Docusaurus/Infima CSS classes (`button--outline`, `dropdown__menu`, etc.). No build step — Docusaurus compiles it via its webpack pipeline.

## Origin

Originally based on `docusaurus-markdown-source-plugin@2.0.1` (February 2025). The npm package was removed and replaced with this standalone local plugin. The code has diverged and may continue to diverge — there is no intent to track or merge upstream changes.
