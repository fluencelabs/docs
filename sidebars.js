// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  stake: [
    "stake/overview",
    "stake/wallets_guide/wallets_guide",
    "stake/bridge_guide/bridge_guide",
    "stake/staking_app_guide/staking_app_guide",
  ],
  build: [
    "build/overview",
    "build/registration/registration",
    "build/balance/balance",
    "build/settings/settings",
    {
      type: "category",
      label: "CPU Cloud",
      items: [
        "build/cpu_cloud/overview/overview",
        "build/cpu_cloud/vm_rent/vm_rent",
        {
          type: "category",
          label: "Manage VMs",
          items: [
            "build/cpu_cloud/manage_vm/manage_vm",
            "build/cpu_cloud/manage_vm/provider_vm_termination",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "GPU Cloud",
      items: [
        "build/gpu_cloud/instance_rent/instance_rent",
        "build/gpu_cloud/manage_instances/manage_instances",
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
    "connect_servers/login/login",
    "connect_servers/hardware/hardware",
    "connect_servers/kubernetes/kubernetes",
    "connect_servers/subnets/subnets",
    "connect_servers/smart_contracts/smart_contracts",
    "connect_servers/upcoming_features/upcoming_features",
  ],
};

module.exports = sidebars;
