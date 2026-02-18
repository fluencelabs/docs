// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  stake: [
    "stake/overview",
    "stake/wallets_guide",
    "stake/bridge_guide",
    "stake/staking_app_guide",
  ],
  build: [
    "build/overview",
    "build/registration",
    "build/balance",
    "build/settings",
    {
      type: "category",
      label: "CPU Cloud",
      items: [
        "build/cpu_cloud/overview",
        "build/cpu_cloud/vm_rent",
        "build/cpu_cloud/manage_vm",
      ],
    },
    {
      type: "category",
      label: "GPU Cloud",
      items: [
        "build/gpu_cloud/overview",
        "build/gpu_cloud/instance_rent",
        "build/gpu_cloud/manage_instances",
      ],
    },
    {
      type: "category",
      label: "API",
      items: [
        "build/api/overview",
        "build/api/ssh_keys",
        "build/api/cpu_cloud",
        "build/api/gpu_cloud",
      ],
    },
  ],
  connect_servers: [
    "connect_servers/overview",
    "connect_servers/login",
    "connect_servers/hardware",
    "connect_servers/kubernetes",
    "connect_servers/subnets",
    "connect_servers/smart_contracts",
    "connect_servers/upcoming_features",
  ],
};

module.exports = sidebars;
