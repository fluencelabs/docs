---
sidebar_position: 2
---

# Find compute resources on the marketplace

The Fluence compute marketplace is a decentralized platform where you can find and rent compute resources from various providers worldwide. Each provider has offers with different geographies, configurations, and prices. The marketplace API helps you discover resources that meet your specific requirements.

In this document, you'll learn:

1. The core concepts of the Fluence Marketplace
2. How to search for available compute offers
3. How to filter resources based on your requirements
4. How to estimate the cost of your deployment

## The core concepts

Before exploring the Fluence Marketplace, let’s define five key terms:

| Term                       | Description                                                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Offer**                  | An on-chain listing from a provider that includes one or more compute Peers with identical specifications, located in the same datacenter, available at a set price. |
| **Compute Peer**           | A physical server that is referenced in an Offer. Each Peer has its own hardware resources and is the actual machine that will run your workloads.                   |
| **Resource**               | A distinct resource on a peer: vCPU, RAM, storage, or public IP.                                                                                                     |
| **Hardware specification** | Metadata that describes a resource (such as CPU architecture, memory generation, storage medium, etc.).                                                              |
| **Epoch**                  | A time period used for billing purposes. Currently, the billing interval is set to 24 hours. All marketplace prices are quoted in USDC per epoch.                    |

### Attributes of a compute peer

1. **Hardware resources** – Each peer has it's own set of hardware resources and capacity.
2. **Hardware specifications** – Detailed metadata lets you target exactly the hardware you need (e.g. `manufacturer: "AMD"`, `storage.type: "NVMe"`).
3. **Price per epoch** – Cost depends on the hardware specification; more powerful peers cost more per 24-hour epoch.
4. **Location** – All peers in a single offer are located in the same datacenter.
5. **Availability** – Peers differ in how many VMs (of a given basic configuration) they can still host and how much additional resource (such as extra storage) remains unallocated.

Once you've found suitable offers that match your requirements for CPU, RAM, storage, and location, you can proceed to deploy virtual machines on these peers. The marketplace API helps you first discover and evaluate options before committing to deployment.

:::tip
You can skip the exploration step and simply declare your VM deployment requirements, then the Marketplace algorithms will automatically match you with the best available Offer. For this, proceed to [Deploy virtual machines](../order_vm/order_vm.md) section.
:::

## Search for available offers

The marketplace offers a powerful API endpoint that allows you to search for available compute resources with specific filters. Without filters, you will receive all compute providers' offers available on the marketplace. By applying different filters, you can find offers that match your specific requirements. To get the Marketplace offers, send a `POST` request to the following endpoint with a JSON body containing your filters:

```bash
https://api.fluence.dev/marketplace/offers
```

### Request parameters

You can use the request body to filter offers based on your specific requirements. All filters are optional and in case you do not want to apply any filters, send an empty object `{}` in the body.

**Example of a request body with all filters applied:**

```json
{
  "basicConfiguration": "cpu-8-ram-16gb-storage-25gb",
  "additionalResources": {
    "storage": [
      {
        "supply": 4,
        "units": "GiB",
        "type": "NVMe"
      }
    ]
  },
  "hardware": {
    "cpu": [
      {
        "manufacturer": "AMD",
        "architecture": "Zen"
      }
    ],
    "memory": [
      {
        "type": "DDR",
        "generation": "5"
      }
    ],
    "storage": [
      {
        "type": "NVMe"
      }
    ]
  },
  "datacenter": {
    "countries": ["FR"]
  },
  "maxTotalPricePerEpochUsd": "12.57426"
}
```

Let's break down the request body parameters and their usage

#### Basic configuration

The `basicConfiguration` parameter allows you to specify a standardized resource profile using a predefined string format. This format follows the pattern `cpu-{cores}-ram-{memory}gb-storage-{size}gb`, where:

- `{cores}` represents the number of vCPU cores
- `{memory}` represents the RAM amount in GB
- `{size}` represents the storage capacity in GB

To get the list with names of all available basic configurations on the marketplace, you can use specific endpoint. Read more about it in the [Available Basic VM Configurations](#available-basic-vm-configurations) section.

**Example:**

```json
{
  "basicConfiguration": "cpu-8-ram-16gb-storage-25gb"
}
```

#### Hardware specifications constraints

If you need specific CPU architecture or storage type, you can filter based on hardware requirements. To get the list of all available hardware specifications on the marketplace, you can use specific endpoint, read more about it in the [Available Hardware Specifications](#available-hardware-specifications) section.

- **`hardware`**

  - Specific hardware requirements for the compute resources.
  - Fields:
    - `cpu`
      - `manufacturer` : CPU manufacturer (e.g., `"AMD"`, `"Intel (R)"`)
      - `architecture` : CPU architecture (e.g., `"Zen"`, `"ICE LAKE"`)
    - `memory`
      - `type` : Memory type (e.g., `"DDR"`)
      - `generation` : Memory generation (e.g., `"4"`, `"5"`)
    - `storage`
      - `type` : Storage type - one of: `"HDD"`, `"SSD"`, or `"NVMe"`

**Example:**

```json
{
  "hardware": {
    "cpu": [
      {
        "manufacturer": "AMD",
        "architecture": "Zen"
      }
    ],
    "memory": [
      {
        "type": "DDR",
        "generation": "4"
      }
    ],
    "storage": [
      {
        "type": "NVMe"
      }
    ]
  }
}
```

#### Datacenter constraints

API allows you to filter datacenters by country. To get the list of all available countries on the marketplace, you can use specific endpoint, read more about it in the [Available Datacenter Countries](#available-datacenter-countries) section.

- **`datacenter`**

  - Geographic constraints for the compute resources.
  - Fields:
    - `countries`: An array of ISO country codes where you want your resources to be located (e.g., `["US", "PL"]` for United States and Poland). The filter works as an OR condition - offerings from any of the specified countries will be included in the results.

**Example:**

```json
{
  "datacenter": {
    "countries": ["US", "PL"]
  }
}
```

#### Additional resources

Additional resources are hardware resources that you can request beyond the basic configuration. You can specify them to find offers with sufficient extra capacity. Currently, only additional `storage` is supported.

:::info
Currently, `additionalResources` can be used only along with `hardware.storage` filter.
:::

- **`additionalResources`**

  - Additional resources you need beyond the basic configuration.
  - Fields:
    - `storage`
      - `type` : Type of storage - one of: `"HDD"`, `"SSD"`, or `"NVMe"`
      - `units`: Units of measurement - currently only `"GiB"` (Gibibytes) is supported
      - `supply` : Required storage volume size in the specified units

**Example:**

```json
{
  "additionalResources": {
    "storage": [
      {
        "supply": 20,
        "units": "GiB",
        "type": "NVMe"
      }
    ]
  }
}
```

#### Maximum price per epoch constraint

You can apply a filter for the max price per epoch (24 hours) in USDC that you're willing to pay for the resources you specify.

- **`maxTotalPricePerEpochUsd`** - Expressed as a string to handle decimal precision (e.g. `"12.5"`)

**Example:**

```json
{
  "maxTotalPricePerEpochUsd": "12.5"
}
```

## Response structure

When you send a request to `/marketplace/offers`, you'll receive a response containing an array of offers that match your criteria. Each non-empty offer represents a configuration available from a specific provider in a particular data center. The array consists of objects, with each object representing an offer from a provider for a specific basic configuration. _If no offers match your criteria, the response will contain an empty list._

:::note
To view all available basic configurations, use the endpoint described in the [Available Basic VM Configurations](#available-basic-vm-configurations) section.
:::

**General structure of the response for a single object:**

```json
[
  {
    "configuration": {
      "slug": string,
      "price": string
    },
    "resources": [
      {
        "type": string,
        "metadata": {...},
        "price": string
      }
    ],
    "datacenter": {
      "countryCode": string,
      "cityCode": string,
      "cityIndex": number,
      "tier": number,
      "certifications": [string]
    },
    "servers": [
      {
        "availableBasicInstances": number,
        "additionalResources": [
            {
            "supply": number,
            "perVmLimit": number | null,
            "type": string,
            "metadata": {...},
            "price": string
          }
        ]
      }
    ],
    "maxAdditionalSupply": [
      {
        "supply": number,
        "perVmLimit": number | null,
      }
    ]
  },
  // More offers with different configurations and prices
]
```

Let's break down the key components of the response:

### Response fields of a single offering object

#### Configuration

The `configuration` object represents the basic configuration of the offer. It includes:

- **`slug`**: The basic configuration identifier. Read more about basic configurations in the [Available Basic VM Configurations](#available-basic-vm-configurations) section.
- **`price`**: Price for the quoted configuration (in USDC per epoch)

**Example:**

```json
{
  "configuration": {
    "slug": "cpu-2-ram-4gb-storage-25gb",
    "price": "0.30698"
  }
}
```

#### Resources

The `resources` array shows the resources that will be allocated to the VM, if matched to this offer.

Each resource element in the array includes:

- `type`: Resource type, can be one of the following: `VCPU`, `RAM`, `STORAGE`, `PUBLIC_IP`
- `metadata`: Its type-specific metadata. You can find more details about the metadata for each hardware resource type in the [Available Hardware Specifications](#available-hardware-specifications) section.
- `price`: The price for this resource per epoch

**Example:**

```json
{
  "resources": [
    {
      "type": "VCPU",
      "metadata": {
        "manufacturer": "AMD",
        "brand": "EPYC",
        "architecture": "Zen",
        "generation": "2"
      },
      "price": "0.005"
    },
    {
      "type": "RAM",
      "metadata": {
        "type": "DDR",
        "generation": "4"
      },
      "price": "0.002"
    }
    // Other resources (STORAGE, PUBLIC_IP)
  ]
}
```

This example object contains the configuration, and associated pricing, for the basic configuration used in [the previous example](#configuration).

#### Datacenter

The `datacenter` object provides information about the geo-location of the compute resources as well as the datacenter certifications, e.g., SOC2, ISO27001, etc..

Each `datacenter` object includes fields:

- **`countryCode`**: ISO country code
- **`cityCode`**: LOCODE code for the city
- **`cityIndex`**: Index if multiple datacenters exist in the same city
- **`tier`**: Datacenter tier level (1-4, with 4 identifying data centers with the highest reliability rating)
- **`certifications`**: Array of compliance certifications this datacenter holds

**Example:**

```json
{
  "datacenter": {
    "countryCode": "PL",
    "cityCode": "POZ",
    "cityIndex": 1,
    "tier": 4,
    "certifications": ["ISO 27001:2022", "SOC2", "PCI DSS"]
  }
}
```

#### Servers

The `servers` array provides information about the actual physical machines available to host your workloads that are available in an offer. Each element in this array represents a distinct physical server in the provider's infrastructure.

Each `server` object includes:

- **`availableBasicInstances`**: Number of instances with the basic configuration of the object that can be created on this set of resources
- **`additionalResources`**: Extra resources this specific server can provide beyond the basic configuration.
  - `type`: Resource type (currently only `STORAGE` is supported)
  - `metadata`: Its type-specific metadata. You can find more details about the metadata for each hardware resource type in the [Available Hardware Specifications](#available-hardware-specifications) section.
  - `price`: Cost per unit of this resource per epoch (24 hours)
  - `supply`: Total amount of a resource available on the server.
  - `units`: Units of measurement (currently only `GiB` is supported)
  - `perVmLimit`: Limit for the amount of this resource that can be allocated to a single VM, set by the Protocol.

**Example:**

```json
{
  "servers": [
    {
      "availableBasicInstances": 5,
      "additionalResources": [
        {
          "type": "STORAGE",
          "metadata": {
            "type": "NVMe"
          },
          "price": "0.00001",
          "supply": 100,
          "units": "GiB",
          "perVmLimit": 200
        }
      ]
    }
    // Other servers
  ]
}
```

#### Maximum Additional Supply Available Per VM

The `maxAdditionalSupply` array provides information about the maximum amount of additional resources you can purchase in addition to a VM with the basic configuration.
Each element in this array represents a distinct resource type and has the following fields:

- **`supply`**: Total available quantity of this resource type.
- **`perVmLimit`**: Maximum amount of this resource that can be allocated to a single VM, set by the Protocol.
- **`type`**: Resource type (currently only `STORAGE` is supported)
- **`metadata`**: Resource-specific details
- **`price`**: Cost per unit of this resource

```json
{
  "maxAdditionalSupply": [
    {
      "type": "STORAGE",
      "metadata": {
        "type": "NVMe"
      },
      "price": "0.00001",
      "supply": 100,
      "units": "GiB",
      "perVmLimit": 200
    }
  ]
}
```

## Discovering Filter Parameters

The Fluence Marketplace API provides several endpoints to help you discover valid values for filter parameters. These endpoints allow you to see what options are available for basic configurations, countries, and hardware specifications.

### Available Basic VM Configurations

To retrieve all available basic configurations, send a `GET` request to the following endpoint:

```bash
https://api.fluence.dev/marketplace/basic_configurations
```

The response will return all available basic configurations in the marketplace without specification of concrete hardware. The `basicConfiguration` parameter allows you to specify a standardized resource profile using a predefined string format. This format follows the pattern `cpu-{cores}-ram-{memory}gb-storage-{size}gb`, where:

- `{cores}` represents the number of vCPU cores
- `{memory}` represents the RAM amount in GB
- `{size}` represents the storage capacity in GB

#### Response

The response returns an array of strings with names of all available basic configurations.

For example:

```json
[
  "cpu-2-ram-4gb-storage-25gb",
  "cpu-4-ram-8gb-storage-25gb",
  "cpu-8-ram-16gb-storage-25gb"
  // Other basic configurations
]
```

### Available Datacenter Countries

To retrieve all available countries that have datacenters with available offers in the marketplace, send a `GET` request to the following endpoint:

```bash
https://api.fluence.dev/marketplace/countries
```

The response returns all available countries ISO codes that have datacenters with available offers in the marketplace.

For example:

```json
["DE", "FR", "GB", "LT", "PL", "US"]
```

Use these ISO country codes in the `datacenter.countries` array of your [search parameters](#search-for-available-offers) to filter results and show only offers from specific geographic locations.

### Available Hardware Specifications

To retrieve all available hardware specifications on the marketplace, send a `GET` request to the following endpoint:

```bash
https://api.fluence.dev/marketplace/hardware
```

The response returns all hardware specifications available across all providers in the marketplace. The response is an object with arrays of hardware specifications for each resource type.

For example:

```json
{
  "cpu": [
    {
      "manufacturer": "AMD",
      "architecture": "Zen"
    },
    {
      "manufacturer": "Intel (R)",
      "architecture": "ICE LAKE"
    }
    // More CPU options
  ],
  "memory": [
    {
      "type": "DDR",
      "generation": "5"
    },
    {
      "type": "DDR",
      "generation": "4"
    }
  ],
  "storage": [
    {
      "type": "SSD"
    },
    {
      "type": "NVMe"
    }
  ]
}
```

Use these values in the `hardware` section of your [search parameters](#search-for-available-offers):

- **CPU specifications**: Use `architecture` and `manufacturer` values to specify CPU requirements
- **Memory specifications**: Use `type` and `generation` values to filter by RAM type
- **Storage types**: Use the `type` value to filter by storage technology (`HDD`, `SSD`, or `NVMe`)

For example, if you need high-performance storage, you might filter for offers with `NVMe` storage based on the values returned by this endpoint.

## Estimate price for a deployment

Before committing to a deployment, you'll often want to know how much it will cost. The `/vms/v3/estimate` endpoint allows you to calculate the expected price for your deployment based on your configuration requirements and the number of instances you plan to deploy.

```bash
POST /vms/v3/estimate
```

### Request parameters

The request body follows a similar structure to the `/marketplace/offers` endpoint, with the addition of an `instances` field to specify how many VMs you want to deploy.

**Example of a request body with all filters specified:**

```json
{
  "constraints": {
    "basicConfiguration": "cpu-2-ram-4gb-storage-25gb",
    "additionalResources": {
      "storage": [
        {
          "type": "NVMe",
          "supply": 20,
          "units": "GiB"
        }
      ]
    },
    "hardware": {
      "cpu": [
        {
          "manufacturer": "AMD"
        }
      ],
      "storage": [
        {
          "type": "NVMe"
        }
      ]
    },
    "datacenter": {
      "countries": ["PL"]
    },
    "maxTotalPricePerEpochUsd": "1.2"
  },
  "instances": 3
}
```

- **`constraints`**: Contains all your requirements for the deployment, identical to the filters used in the `/marketplace/offers` endpoint.

  - **`basicConfiguration`**: The predefined VM configuration you want (e.g., `"cpu-2-ram-4gb-storage-25gb"`)
  - **`additionalResources`**: Extra resources you need beyond the basic configuration
  - **`hardware`**: Specific hardware requirements (CPU manufacturer, storage type, etc.)
  - **`datacenter`**: Geographic constraints for your deployment
  - **`maxTotalPricePerEpochUsd`**: Maximum price per epoch (24 hours) you're willing to pay

- **`instances`**: The number of VMs you want to deploy with this configuration

### Response structure

The endpoint returns detailed pricing estimation for your proposed deployment. Example of a successful response:

```json
{
  "depositAmountUsdc": "7.01532", // totalPricePerEpoch * depositEpochs
  "depositEpochs": 2,
  "totalPricePerEpoch": "3.50766", // total price for all instances per epoch
  "maxPricePerEpoch": "0.35793", // max price for a single instance per epoch
  "instances": 10 // number of instances
}
```

In case no offers are found to satisfy the constraints, the endpoint will return an 422 error response with a message:

```json
{
  "error": "Not enough offers found"
}
```

#### Response fields

- **`depositAmountUsdc`**: The total deposit amount required in USDC. This is calculated as `totalPricePerEpoch` × `depositEpochs`.
- **`depositEpochs`**: The number of epochs (days) for which the deposit is calculated. This represents the initial commitment period.
- **`instances`**: The number of VM instances you requested in your estimate.
- **`maxPricePerEpoch`**: The maximum price per epoch (24 hours) for a single instance of your configuration.
- **`totalPricePerEpoch`**: The total price per epoch for all instances combined.

## The next steps

The Fluence compute marketplace API provides a powerful and flexible way to find and compare compute resources from various providers across the globe. By using the filtering capabilities and understanding the response structure, you can quickly find resources that match your specific requirements including price, location, and hardware specifications.

In the next [section](../order_vm/order_vm.md), we'll cover how to use your selected offer to create and manage deployments on the Fluence platform.
