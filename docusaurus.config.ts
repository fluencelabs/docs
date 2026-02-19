import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import path from "path";

const config: Config = {
  title: "Fluence Docs",
  tagline: "Decentralized Compute Platform",
  url: "https://fluence.dev",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  themes: ["@docusaurus/theme-mermaid"],
  markdown: { mermaid: true },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/fluencelabs/docs/tree/main",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          exclude: ["**/llms_txt_override.md", "**/llms_txt_include_head.md"],
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
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
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
        src: "img/logo_badge_black.svg",
      },
      items: [
        {
          type: "doc",
          position: "left",
          docId: "build/overview",
          label: "Build",
        },
        {
          type: "doc",
          position: "left",
          docId: "stake/overview",
          label: "Stake",
        },
        {
          type: "doc",
          position: "left",
          docId: "connect_servers/overview",
          label: "Connect Servers",
        },
        {
          type: "doc",
          position: "left",
          docId: "build_with_ai/overview",
          label: "Build with AI",
        },
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
              label: "Build",
              to: "/docs/build/overview",
            },
            {
              label: "Stake",
              to: "/docs/stake/overview",
            },
            {
              label: "Connect Servers",
              to: "/docs/connect_servers/overview",
            },
            {
              label: "Build with AI",
              to: "/docs/build_with_ai/overview",
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
      copyright: `Copyright © ${new Date().getFullYear()} Cloudless Labs`,
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    "docusaurus-plugin-sass",
    path.resolve(__dirname, "plugins/markdown-source-plugin"),
    path.resolve(__dirname, "plugins/llms-txt-plugin"),
  ],
};

export default config;
