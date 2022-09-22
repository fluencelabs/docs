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
  tagline:
    "Peer-to-peer compute protocol that frees computation from centralized cloud providers",
  url: "https://doc.fluence.dev",
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
      }),
    ],
    [
      "docusaurus-preset-shiki-twoslash",
      {
        themes: ["min-light", "min-dark"],
        langs: [
          "typescript",
          "javascript",
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
            docId: "build/introduction",
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
};

module.exports = config;
