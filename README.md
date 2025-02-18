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
