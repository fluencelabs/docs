---
description: "What you can rent on Fluence Cloud, how to reach it through the Fluence Console, the API, or an AI client, and how new accounts get access."
---

# Fluence Cloud overview

Fluence Cloud rents GPU and CPU compute from data centers around the world. You pay from a prepaid balance in USD. You can work with it in three ways:

- In the Fluence Console at [console.fluence.ai](https://console.fluence.ai). To create an account, see [Registration](./registration.md).
- Through the [Fluence API](./api/overview.md), from scripts and your own tools.
- From an AI client such as Claude Code, Cursor, or Codex, through the [Fluence MCP server](../build_with_ai/mcp.md).

## What you can rent

| Product | What you get | Billing | Guides |
|---|---|---|---|
| GPU Cloud | GPU containers, GPU virtual machines, and bare metal servers | By the hour | [GPU Cloud concepts](./gpu_cloud/overview.md) |
| CPU Cloud | Virtual machines with disks, public IP addresses, private networks, and security groups | By the second | [CPU Cloud concepts](./cpu_cloud/overview.md) |

To reserve GPU clusters for a longer term, Fluence runs [GPU Cluster Auctions](https://auctions.fluence.ai), where providers bid for your request. These docs do not cover auctions.

## Console sections

The sidebar of the Fluence Console has these sections:

| Section | What it is for |
|---|---|
| **Public cloud** | CPU virtual machines on the **Compute** page, disks on **Storage**, and public IP addresses, VPCs, and security groups on **Network** |
| **GPU Marketplace** | Renting GPU containers, VMs, and bare metal servers |
| **GPU instances** | Managing the GPU instances you rented |
| **Billing** | Your balance, top-ups, promo codes, and usage. The balance in the page header also links here. |
| **Settings** | Your profile, API keys, SSH keys, and the **MCP** page with configurations for AI clients |
| **Support** | Opens an email to support@fluence.ai |

## Pay for compute

A new account can rent GPU and CPU compute right after registration. Rent is charged from your prepaid balance in USD, so top it up first. You can top it up by card or in crypto in the console. An AI agent can also top up over HTTP with USDC through [x402](./api/x402.md). See [Payment and balance management](./balance.md).
