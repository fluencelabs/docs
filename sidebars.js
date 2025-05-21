// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  stake: [
    "stake/overview",
    "stake/wallets_guide/wallets_guide",
    "stake/bridge_guide/bridge_guide",
    "stake/nft_guide/nft_guide",
    "stake/staking_app_guide/staking_app_guide",
  ],
  build: [
    "build/overview",
    "build/registration/registration",
    "build/balance/balance",
    "build/vm_rent/vm_rent",
    {
      type: "category",
      label: "VM Management",
      items: [
        "build/manage_vm/manage_vm",
        "build/manage_vm/provider_vm_termination",
      ],
    },
    "build/settings/settings",
    {
      type: "category",
      label: "API",
      items: [
        "build/api/overview",
        "build/api/get_offerings/get_offerings",
        "build/api/order_vm/order_vm",
        "build/api/manage_vms/manage_vms",
      ],
      collapsed: true,
    },
  ],
};

module.exports = sidebars;
