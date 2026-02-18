# Upcoming Features for Provider Application

## General Improvements

- **Email Notifications** – Receive email alerts about server and cluster health, earned rewards and required management actions such as upcoming updates or Capacity Commitments creation.
- **Role-Based Access Control (RBAC)** – Enable multiple user roles within a single Provider organization. For example, Data Center on-site engineers could be granted limited access to initiate maintenance windows for infrastructure.
- **Self-Hosted Provider Application** – Option to host the Provider Application within a private organizational environment to maintain full control over data.
- **Detailed Revenue Information** – Access detailed insights on business operations within the Fluence Protocol to help make strategic decisions on scaling or upgrading infrastructure.

## Hardware Management

- **Removing Servers from the Fluence Protocol** – Currently, Providers must contact the Fluence team to initiate server removal. This process depends on Fluence customers’ workloads running on the servers and existing Capacity Commitments with staked FLT collateral, so servers cannot be disconnected at any time.
- **Maintenance Window** – Providers currently contact Fluence to schedule maintenance windows. This operation will be automated in an upcoming release via the Web Application.
- **Talos Logs and Metrics** – Fluence currently collects Talos and Kubernetes metrics accessible only via Kubernetes CLI inside pods. New functionality will allow providers to analyze these metrics directly in the Provider Application for faster infrastructure insights.
- **Talos Version Management** – Safely update Talos versions across all servers in clusters to a version supported by the Fluence stack, managed via the Provider Application.

## Kubernetes Cluster Management

- **Scale Existing Clusters** – Add new nodes to an existing Kubernetes cluster.
- **Change Server Kubernetes Role** – Change a node’s Kubernetes role between Control Plane and Worker Node. This is essential for safely initiating server removals without risking cluster integrity.
- **Control Plane Backups** – Support backups of core Kubernetes nodes to enhance stability and resilience.
- **Cluster Version Management** – Safely update Kubernetes versions supported by Fluence via the Provider Application.

## IP Subnets Management

- **Removing Subnets from the Fluence Protocol** – Currently, Providers must contact Fluence to remove IP subnets. Subnets hosting Fluence customers’ workloads cannot be disconnected at any time.

## Smart Contracts Management

- **Interaction with Smart Contracts** – Manage Offers, Capacity Commitments, and Deals via the Provider Application. Until this feature is released, Providers must use existing Fluence tools.
- **Rewards Withdrawal** – Withdraw all earned FLT and USDC rewards in a single click across all related on-chain entities.
- **WalletConnect Support** – To maximize decentralization, WalletConnect will be introduced for Providers who prefer the Provider Application not to have direct access to their wallets.