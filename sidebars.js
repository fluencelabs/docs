// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  learn: [
    "learn/overview",
    "learn/how-it-works",
    "learn/why-fluence",
    "learn/fluence-comparison",
    "learn/use-cases",
    {
      type: "category",
      label: "Governance",
      link: { id: "learn/governance/overview", type: "doc" },
      items: [],
    },
  ],
  build: [
    {
      type: "category",
      label: "Hello Fluence",
      collapsible: true,
      collapsed: true,
      link: { id: "build/introducing_fluence", type: "doc" },
      items: [],
    },
    {
      type: "category",
      label: "Overview",
      collapsible: true,
      collapsed: true,
      link: { id: "build/overview/fluence_functions", type: "doc" },
      items: [
        // "build/overview/fluence_functions",
        "build/overview/getting_started",
        // "build/overview/roadmap",
      ],
    },
    {
      type: "category",
      label: "Setting Up",
      collapsible: true,
      collapsed: true,
      link: { id: "build/setting-up/setting_up", type: "doc" },
      items: [
        "build/setting-up/installing_cli",
        "build/setting-up/set-up-development-env",
        "build/setting-up/working_with_local_networks",
      ],
    },
    {
      type: "category",
      label: "Quickstart",
      collapsible: true,
      collapsed: true,
      //  link: { id: "build/overview/your_first_function", type: "doc" },
      items: [
        "build/quickstarts/your_first_function",
        // "build/quickstarts/connecting_to_the_world",
        // "build/quickstarts/connecting_to_local_storage",
      ],
    },
    /*
    {
      type: "category",
      label: "Concepts",
      collapsible: true,
      collapsed: true,
      //  link: { id: "build/overview/fluence_functions", type: "doc" },
      items: [
        "build/concepts/best_practices",
        "build/concepts/fluence_functions_revisited",
        "build/concepts/marketplace",
        "build/concepts/http_gateways",
        // "build/concepts/scheduling_functions",
        "build/concepts/security",
      ],
    },
    */
    /*
    {
      type: "category",
      label: "Tutorials",
      collapsible: true,
      collapsed: true,
      //  link: { id: "build/overview/fluence_functions", type: "doc" },
      items: [
        "build/tutorials/workflow_fundamentals",
        "build/tutorials/event_handling_in_js",
      ],
    },
    */
    {
      type: "category",
      label: "Examples",
      collapsible: true,
      collapsed: true,
      //  link: { id: "build/overview/fluence_functions", type: "doc" },
      items: ["build/examples/frpc"],
    },
    {
      type: "category",
      label: "How To Guides",
      collapsible: true,
      collapsed: true,
      //  link: { id: "build/overview/fluence_functions", type: "doc" },
      items: [
        /*
        "build/how-to/setting_up",
        "build/how-to/configure",
        "build/how-to/setup_payments",
        "build/how-to/develop",
        "build/how-to/test",
        "build/how-to/securing_functions",
        "build/how-to/deploy",
        "build/how-to/monitor",
        "build/how-to/migrate",
        */
        "build/how-to/schedule_functions",
      ],
    },
    "build/glossary",
    // "build/references",
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
        "aqua-book/language/crdt-streams",
        "aqua-book/language/crdt-maps",
        "aqua-book/language/closures",
        "aqua-book/language/modularity",
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
            "aqua-book/language/expressions/overridable-constants",
          ],
        },
        "aqua-book/language/services",
        "aqua-book/language/abilities",
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
    "aqua-book/aqua-js-api",
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
  stake: [
    "stake/overview",
    "stake/wallets_guide/wallets_guide",
    "stake/bridge_guide/bridge_guide",
    "stake/nft_guide/nft_guide",
    "stake/staking_app_guide/staking_app_guide",
    // {
    //   type: "category",
    //   label: "Wallets guide",
    //   link: { id: "stake/wallets_guide/wallets_guide", type: "doc" },
    //   items: [],
    // },
  ],
};

module.exports = sidebars;
