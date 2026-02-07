# Renting an instance

The Fluence marketplace is a decentralized broker of GPU compute supply and demand that facilitates the renting process of GPU instances and management of your instances in datacenters located around the world.
The GPU marketplace offers three kinds of GPU workload for deployments: containers, VMs and bare metal instances. This document is focused on showing how to choose and configure and deploy an instance of any available kind.

## Billing model

Instances rent works on pre-paid model. When renting an instance, a prepayment amount equivalent to three hours of rent is deducted from your Balance and stored on a separate balance dedicated to an instance. Billing happens by charging one hour of rent from instance's balance. When an instance balance is below the required pre-paid amount, the system tries to top-up instance's balance from your Balance in the console.
Insufficient funds termination: if a system failed to charge an instance for one billing period due to insufficient funds on instance's prepdaid balance - a system failed to fill instance's balance from owner's balance, the instance rental agreement is terminated and it is automatically deleted.
Instance balance unfreeze: once instance rent stops all unused funds (not charged for running workload) from it's balance are moved back to the owner's balance.
You can check the amount of your Balance reserved as a “prepayment” on the **Billing** page in the Fluence Console.

## Steps to Configure an instance

The Fluence GPU marketplace aggregates enterprise-grade compute resources from predominantly Tier-3 and Tier-4 data centers around the world. Users can deploy three kinds of GPU workload: containers, VMs and bare metal - different kinds of workload require different configurations.

## Steps to Configure a GPU container
