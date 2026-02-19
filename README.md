# Fluence Docs

Fluence Docs are built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Contributing

- Generally docs hierarchy should be reflected in the file hierarchy, but ultimately the docs tree must be set up inside `sidebars.js` file. If you put a markdown file inside a directory - don't ever name it `index.md` - use the same name as the directory itself instead (e.g. [basic-concepts.md](./docs/stake/bridge_guide/bridge_guide.md))
- Currently the index page is redirected to `/docs/learn/overview`. This is because we don't have a design of what's best to place on the index page. The redirect is configured in the `vercel.json` file
- Avoid adding a lot of images. Images are added using `![short description of an image](./path-to-an-image.png)` syntax. If you have to add an image - please put it inside the directory near the doc where it is used. Check out [basic-concepts.md](./docs/stake/bridge_guide/bridge_guide.md). Please use .png or even better - svg for diagrams and .jpg for photos, resize the image as small as you are comfortable and compress it using [tinypng.com](https://tinypng.com/) (or [svgomg](https://jakearchibald.github.io/svgomg/) for .svg).
- When adding ANY github links please use [permalinks](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-a-permanent-link-to-a-code-snippet) - otherwise links will point to the wrong place eventually. I also added new experimental markdown related settings to .vscode/settings.json which help a lot with writing valid markdown. Also [this vscode extension](https://marketplace.visualstudio.com/items?itemName=blackmist.LinkCheckMD) can help you find broken external links as well
- Please at least use spell checker inside your editor or maybe Grammarly and be attentive when writing docs - they are the face of the company in a sense
- Use \`\`\`sh for something that you intend to type in a shell. Maybe don't put \$ signs and execution results right inside  \`\`\`sh code-blocks for the following reasons: \$ signs and commands output mixed with all of it make it harder to copy and use the code from the docs and also some of the commands output will be changed by us and will have to be maintained in the docs as well which is very inconvenient.
- Headings are not just a stylistic tool but also semantic one. Headings are used to give document a structure which is especially important for page navigation for certain people and also for generating valid quick navigation tree that is displayed on the right side of the docs. So basically the main rule is to not skip heading levels (e.g. don't do #Heading followed immediately by ###Heading - use ##Heading instead)
- Every docs page has a "View/Copy as Markdown" dropdown button (see `plugins/markdown-source-plugin/`). The plugin strips MDX syntax to produce clean, readable markdown for end users. Keep the following in mind:
  - Put images in directories named `assets/` (not `img/`) — the plugin looks for `assets/` when copying images to the build output and when rewriting image paths
  - `<Tabs>`, `<TabItem>`, and `<details>`/`<summary>` are converted to readable markdown equivalents automatically
  - Any other uppercase-starting React/MDX component (e.g. `<MyWidget>`) is **silently removed** along with its content. If you add a new custom component that contains user-facing content, add a conversion rule in `plugins/markdown-source-plugin/index.js` — see the `cleanMarkdownForDisplay()` function and the plugin's own README for details
- The site generates `llms.txt` index files at build time so LLM agents can discover our docs (see `plugins/llms-txt-plugin/`). Keep the following in mind:
  - The page list is auto-generated from `sidebars.js` — adding or moving pages updates the llms.txt files on the next build
  - To customize the header of any section's llms.txt, create an `llms_txt_include_head.md` in that section's directory (or `docs/` root). To replace the entire llms.txt with hand-written content, use `llms_txt_override.md` instead
  - Files named `llms_txt_include_head.md` and `llms_txt_override.md` are not doc pages — they are excluded from the site, the markdown-source-plugin, and the page lists automatically. Don't rename them
  - Page titles come from the first `# Heading` in each doc (or YAML front matter `title:`). Optional `description:` front matter adds a short description after the link
  - See the plugin's README for the full guide on writing headers, overrides, and adding new sections

## Installation

```sh
npm i
```

## Local Development

```sh
npm run dev
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```sh
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
