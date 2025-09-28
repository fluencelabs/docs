# Upcoming Features for Provider Application

## General Improvement

- *Email Notifications* - ability to get emails with information about servers and cluster health, earned rewards and required management actions, such as upcoming updates or Capacity commitments creation
- *Role-based access model (RBAC)* - support of multiple users over a single Provider organization. For example it would be possible to grant limited access to the Provider Application for Data center on-site engineers to initiate maintenance window for the infrastructure.
- *Self-hosted provider application* - ability to host Provider Application within your private organization environment and keep full control over your data.
- *Detailed revenue information* - ability to get insights about business operations within Fluence Protocol and take strategic decisions about scaling or upgrading infrastructure

## Hardware management

- *Removing servers from the Fluence Protocol* - currently Providers should contact Fluence team directly to initiate server removing. This process is impacted by Fluence customers’ workload running on the Provider’s hardware and presence of Capacity Commitment with staked FLT collateral so servers can’t be disconnected from the Protocol at any time.
- *Maintenance window* - currently Providers should contact Fluence team directly to plan maintenance window. In the upcoming release, this operations will be automated via Web Application
- *Talos logs and metrics* - currently Fluence collect metrics about Talos and K8s functioning, but they are only available via Kubernetes CLI within a pods. New functionality will allow to analize metrics via Provider Application to get insights about infrastructure faster
- PXE talos boot
- *Talos version management* - ability to safely update Talos version across all servers within a clusters to the supported one by Fluence stack via Provider Application

## Kubernetes cluster management

- *Scale existing Clusters* - ability to add new nodes into an existing K8s cluster.
- *Change server K8s role* - allows to change K8s Node role from Control plane to Worker Node and vice versa. This is essential functionality, that allows to initiate the removal of  servers from the Fluence Protocol without  risking  Cluster integrity
- *Control plane backups* - support backups for core K8s nodes to increase the stability and resilience of the Fluence stack
- *Cluster version management* - ability to safely update the Fluence supported K8s version via Provider Application

## IP subnets management

- *Removing subnets from the Fluence Protocol* - currently, Providers should contact Fluence team  to initiate IP subnet removal.  as IP subnets hosting Fluence customers' workloads can’t be disconnected from the Protocol at any time.

## Smart contracts management

- *Interaction with smart-contracts* - ability to manage Offers, Capacity Commitments and Deals via the Provider Application. Until this functionality is releases, Providers should use the existing Fluence toolset for smart-contracts management
- *Rewards withdrawal* - ability to withdraw all earned FLT and USDC rewards in “one click” across all related on-chain entities.
- *Wallet connect support* - to maximize decentralization, it will be introduced as a new feature for Providers who want Provider Application don’t have any access to the