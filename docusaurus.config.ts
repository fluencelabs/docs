import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

function getFluenceLanguageConfig(langName: string) {
  return {
    id: langName,
    scopeName: `source.${langName}`,
    grammar: JSON.parse(
      readFileSync(
        join(
          cwd(),
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
  };
}

const config: Config = {
  title: "Fluence Docs",
  tagline: "Decentralized Serverless Platform",
  url: "https://fluence.dev",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
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
      } satisfies Preset.Options,
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
          "yaml",
          getFluenceLanguageConfig("aqua"),
          getFluenceLanguageConfig("air"),
        ],
      },
    ],
  ],
  themeConfig: {
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
          docId: "build-mvm/introducing_fluence",
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
              label: "Youtube",
              href: "https://www.youtube.com/channel/UC3b5eFyKRFlEMwSJ1BTjpbw",
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
  } satisfies Preset.ThemeConfig,
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

export default config;
