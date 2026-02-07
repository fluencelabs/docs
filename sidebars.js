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
        "build/cpu_cloud/vm_rent/vm_rent",
        {
          type: "category",
          label: "Manage VMs",
          items: [
            "build/cpu_cloud/manage_vm/manage_vm",
            "build/cpu_cloud/manage_vm/provider_vm_termination",
          ],
        },
        {
          type: "category",
          label: "API",
          collapsed: true,
          items: [
            "build/cpu_cloud/api/overview",
            "build/cpu_cloud/api/get_offerings/get_offerings",
            "build/cpu_cloud/api/order_vm/order_vm",
            "build/cpu_cloud/api/manage_vms/manage_vms",
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
        {
          type: "category",
          label: "API",
          collapsed: true,
          items: [
            "build/gpu_cloud/api/overview",
            "build/gpu_cloud/api/get_plans/get_plans",
            "build/gpu_cloud/api/order_instance/order_instance",
            "build/gpu_cloud/api/manage_instances/manage_instances",
          ],
        },
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
