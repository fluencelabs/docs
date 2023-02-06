// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  build: [
    "build/introduction",
    "build/thinking-in-aqua-marine/thinking-in-aqua-marine",
    "build/concepts/concepts",
    "build/fluence-cli",
    {
      type: "category",
      label: "Quick Start",
      link: { id: "build/quick-start/quick-start", type: "doc" },
      items: [
        "build/quick-start/browser-to-browser/browser-to-browser",
        "build/quick-start/hosted-services/hosted-services",
        "build/quick-start/browser-to-service/browser-to-service",
        "build/quick-start/service-composition-and-reuse/service-composition-and-reuse",
        "build/quick-start/decentralized-oracles/decentralized-oracles",
      ],
    },
    {
      type: "category",
      label: "Aquamarine",
      link: { id: "build/aquamarine/aquamarine", type: "doc" },
      items: [
        "build/aquamarine/aqua",
        {
          type: "category",
          label: "Marine",
          link: { id: "build/aquamarine/marine/marine", type: "doc" },
          items: [
            "build/aquamarine/marine/marine-cli",
            "build/aquamarine/marine/marine-repl",
            "build/aquamarine/marine/marine-rs-sdk",
          ],
        },
      ],
    },
    "build/tools",
    "build/node",
    {
      type: "category",
      label: "Fluence JS",
      link: { id: "build/fluence-js/fluence-js", type: "doc" },
      items: [
        "build/fluence-js/concepts",
        "build/fluence-js/basics",
        "build/fluence-js/run-in-node",
        "build/fluence-js/run-in-browser",
        "build/fluence-js/in-depth",
        "build/fluence-js/api-reference",
        "build/fluence-js/changelog",
      ],
    },
    "build/security",
    {
      type: "category",
      label: "Tutorials",
      link: { type: "generated-index" },
      items: [
        "build/tutorials/setting-up-your-environment",
        "build/tutorials/deploy-a-local-fluence-node",
        "build/tutorials/curl-as-a-service",
        "build/tutorials/add-your-own-builtins",
      ],
    },
    "build/research-papers-and-references",
  ],
  learn: [
    "learn/overview",
    "learn/how-it-works",
    "learn/why-fluence",
    "learn/fluence-comparison",
    "learn/use-cases",
    "learn/technology",
    "learn/networks",
  ],
  "aqua-book": [
    "aqua-book/introduction",
    {
      type: "category",
      label: "Getting Started",
      link: { id: "aqua-book/getting-started/getting-started", type: "doc" },
      items: [
        "aqua-book/getting-started/installation/installation",
        "aqua-book/getting-started/quick-start",
      ],
    },
    {
      type: "category",
      label: "Language",
      link: { id: "aqua-book/language/language", type: "doc" },
      items: [
        "aqua-book/language/types",
        "aqua-book/language/values",
        "aqua-book/language/topology",
        {
          type: "category",
          label: "Execution flow",
          link: { id: "aqua-book/language/flow/flow", type: "doc" },
          items: [
            "aqua-book/language/flow/sequential",
            "aqua-book/language/flow/conditional",
            "aqua-book/language/flow/parallel",
            "aqua-book/language/flow/iterative",
          ],
        },
        "aqua-book/language/abilities-and-services",
        "aqua-book/language/crdt-streams",
        "aqua-book/language/closures",
        {
          type: "category",
          label: "Imports and Exports",
          link: { id: "aqua-book/language/header/header", type: "doc" },
          items: ["aqua-book/language/header/control-scope-and-visibility"],
        },
        {
          type: "category",
          label: "Expressions",
          link: {
            id: "aqua-book/language/expressions/expressions",
            type: "doc",
          },
          items: [
            "aqua-book/language/expressions/header",
            "aqua-book/language/expressions/functions",
            "aqua-book/language/expressions/services",
            "aqua-book/language/expressions/type-definitions",
            "aqua-book/language/expressions/overridable-constants",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Libraries",
      link: { id: "aqua-book/libraries/libraries", type: "doc" },
      items: [
        "aqua-book/libraries/aqua-lib",
        "aqua-book/libraries/aqua-ipfs",
        "aqua-book/libraries/registry",
      ],
    },
    {
      type: "category",
      label: "Aqua CLI",
      link: { id: "aqua-book/aqua-cli/aqua-cli", type: "doc" },
      items: [
        "aqua-book/aqua-cli/service-management",
        "aqua-book/aqua-cli/scheduling-scripts",
        "aqua-book/aqua-cli/plugins",
        "aqua-book/aqua-cli/peer-state-info",
      ],
    },
    "aqua-book/changelog",
  ],
  "marine-book": [
    {
      type: "html",
      value: `<img src="/img/marine.jpg" alt="Marine logo" style="padding: 11px;" />`,
    },
    "marine-book/introduction",
    "marine-book/basic-concepts/basic-concepts",
    {
      type: "category",
      label: "🚴 Quick Start",
      link: { id: "marine-book/quick-start/quick-start", type: "doc" },
      items: [
        "marine-book/quick-start/setting-up-the-development-environment",
        "marine-book/quick-start/develop-a-single-module-service",
        "marine-book/quick-start/develop-a-multi-modules-service",
      ],
    },
    {
      type: "category",
      label: "Marine Runtime",
      link: { id: "marine-book/marine-runtime/marine-runtime", type: "doc" },
      items: [
        {
          type: "category",
          label: "Architecture",
          link: {
            id: "marine-book/marine-runtime/architecture/architecture/architecture",
            type: "doc",
          },
          items: [
            "marine-book/marine-runtime/architecture/core/core",
            "marine-book/marine-runtime/architecture/marine-js/marine-js",
            "marine-book/marine-runtime/architecture/interface-types-instructions",
          ],
        },
        "marine-book/marine-runtime/i-value-and-i-type",
        "marine-book/marine-runtime/host-exports",
        "marine-book/marine-runtime/mounted-binaries",
        "marine-book/marine-runtime/module-types/module-types",
        "marine-book/marine-runtime/configuration-file",
        {
          type: "category",
          label: "API",
          link: {
            id: "marine-book/marine-runtime/api/api",
            type: "doc",
          },
          items: [
            "marine-book/marine-runtime/api/marine-api",
            "marine-book/marine-runtime/api/marine-js-api",
            "marine-book/marine-runtime/api/core-api",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Marine Rust SDK",
      link: { id: "marine-book/marine-rust-sdk/marine-rust-sdk", type: "doc" },
      items: [
        {
          type: "category",
          label: "Developing",
          link: {
            id: "marine-book/marine-rust-sdk/developing/developing",
            type: "doc",
          },
          items: [
            "marine-book/marine-rust-sdk/developing/export-functions",
            "marine-book/marine-rust-sdk/developing/import-functions",
            "marine-book/marine-rust-sdk/developing/structures",
            "marine-book/marine-rust-sdk/developing/module-manifest",
            "marine-book/marine-rust-sdk/developing/call-parameters",
            "marine-book/marine-rust-sdk/developing/mounted-binaries",
            "marine-book/marine-rust-sdk/developing/logging",
            "marine-book/marine-rust-sdk/developing/environment-variables",
          ],
        },
        {
          type: "category",
          label: "Testing & Debugging",
          link: {
            id: "marine-book/marine-rust-sdk/testing-and-debugging/testing-and-debugging",
            type: "doc",
          },
          items: [
            "marine-book/marine-rust-sdk/testing-and-debugging/testing-a-module",
            "marine-book/marine-rust-sdk/testing-and-debugging/testing-a-service",
            "marine-book/marine-rust-sdk/testing-and-debugging/using-cargo-build-scripts",
            "marine-book/marine-rust-sdk/testing-and-debugging/internal-debugging-api",
          ],
        },
        "marine-book/marine-rust-sdk/module-abi",
      ],
    },
    {
      type: "category",
      label: "Marine Tooling Reference",
      link: {
        id: "marine-book/marine-tooling-reference/marine-tooling-reference",
        type: "doc",
      },
      items: [
        "marine-book/marine-tooling-reference/marine-repl",
        "marine-book/marine-tooling-reference/marine-cli",
      ],
    },
    "marine-book/changelog",
  ],
};

module.exports = sidebars;
