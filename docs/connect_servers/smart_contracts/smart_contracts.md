# Fluence Smart-contracts Management

## Offer Update (Migration Only)

In the first release of Provider Application, there will be no support for interacting with Fluence's core smart-contracts This functionality will be added later.

:::info **Note**

Providers can continue to use the existing Fluence tooling to manage Blockchain operations, for example CCs creation and reward withdrawal, until the new functionality will be supported in Provider Application.
:::

For now Providers with  hardware resources already registered on-chain should execute a special command via [Fluence CLI](https://github.com/fluencelabs/cli) (FCLI) to support migration of existing offers to the new Kubernetes cluster .

Navigate to the `Clusters` page and retrieve the  newly generated Cluster key, whichreplaces the Peer keys from the old architecture. Next do the following:

1. Update FCLI to the latest version
2. Update existing Offers with new Cluster key. It should be a single Offer per cluster
3. Manually top up with FLT Cluster addresses for gas payments in [Fluence Network](https://chainlist.org/chain/9999999). Minimal recommended amount is 10 FLT per server in the Cluster.

:::info **Note**

In the next releases this process will be automated
:::

![cluster_key](./assets/show_clusters_address_page.webp)
