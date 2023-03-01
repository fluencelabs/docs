// @ts-check
const fs = require("fs");
const path = require("path");
const process = require("process");

const getFluenceLanguageConfig = (langName) => ({
  id: langName,
  scopeName: `source.${langName}`,
  grammar: JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "node_modules",
        "aqua-vscode",
        "syntaxes",
        `${langName}.tmLanguage.json`
      ),
      {
        encoding: "utf-8",
      }
    )
  ),
});

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Fluence Docs",
  tagline: "Decentralized Serverless Platform",
  url: "https://fluence.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/fluencelabs/docs/tree/main",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/fluencelabs/docs/tree/main",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
        gtag: {
          trackingID: "G-Z28T4R4T7P",
          anonymizeIP: true,
        },
      }),
    ],
    [
      "docusaurus-preset-shiki-twoslash",
      {
        themes: ["min-light", "min-dark"],
        langs: [
          "typescript",
          "javascript",
          "html",
          "json",
          "rust",
          "shell",
          "toml",
          getFluenceLanguageConfig("aqua"),
          getFluenceLanguageConfig("air"),
        ],
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: "LDLCNV5Z6K",
        apiKey: "8536d4a05a0bddd56f5345c1519ae8ec",
        indexName: "fluence",
      },
      navbar: {
        title: "Fluence",
        logo: {
          alt: "Fluence Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            position: "left",
            docId: "learn/overview",
            label: "Learn",
          },
          {
            type: "doc",
            position: "left",
            docId: "build/under_construction",
            label: "Build",
          },
          {
            type: "doc",
            position: "left",
            docId: "aqua-book/introduction",
            label: "Aqua Book",
          },
          {
            type: "doc",
            position: "left",
            docId: "marine-book/introduction",
            label: "Marine Book",
          },
          // { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/fluencelabs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Learn",
                to: "/docs/learn/overview",
              },
              {
                label: "Build",
                to: "/docs/build/introduction",
              },
              {
                label: "Aqua Book",
                to: "/docs/aqua-book/introduction",
              },
              {
                label: "Marine Book",
                to: "/docs/marine-book/introduction",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Telegram",
                href: "https://t.me/fluence_project",
              },
              {
                label: "Discord",
                href: "https://discord.com/invite/5qSnPZKh7u",
              },
              {
                label: "Telegram (ru)",
                href: "https://t.me/fluenceru",
              },
            ],
          },
          {
            title: "More",
            items: [
              // {
              //   label: "Blog",
              //   to: "/blog",
              // },
              {
                label: "GitHub",
                href: "https://github.com/fluencelabs",
              },
              {
                label: "Telegram Updates",
                href: "https://t.me/fluencedev",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Fluence Labs`,
      },
    }),
  plugins: ["docusaurus-plugin-sass"],
  scripts: [
    {
      src: "https://cdn.jsdelivr.net/npm/mermaid@9.4.0/dist/mermaid.min.js",
      defer: true,
    },
    {
      src: "/mermaid.js",
      defer: true,
    },
  ],
};

module.exports = config;
