---
sidebar_position: 2
---

# Finding compute resources on the Marketplace

The Fluence compute marketplace is a decentralized platform where you can find and rent compute resources from various providers worldwide. Each provider has its own offers with different geographies, configurations and prices. The marketplace API makes it easy to discover resources that meet your specific requirements.

In this guide, we'll walk through how to:

1. Search for available compute offers
2. Filter resources based on your requirements
3. Understand and compare different provider offerings
4. Select the optimal resources for your needs

## Searching for Available Offers

The marketplace offers a powerful API endpoint that allows you to search for available compute resources with specific filters:

```bash
POST https://api.fluence.dev/marketplace/offers
```

### Understanding search parameters (constraints)

You can use the request body to filter offers based on your specific requirements. All filters are optional, you can use them to find whether there are offers that match your requirements.

**Example of a request body with all filters applied:**

```json
{
  "basicConfiguration": "cpu-8-ram-16gb-storage-25gb",
  "additionalResources": {
    "ramMb": 2048,
    "storage": [
      {
        "type": "NVMe",
        "megabytes": 20480
      }
    ]
  },
  "hardware": {
    "cpu": [
      {
        "manufacturer": "AMD",
        "architecture": "Zen" // TODO: add brand and generation
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
    "countries": ["FR"] // TODO: maybe add requirements for data center certifications
  },
  "maxTotalPricePerEpochUsd": "12.57426"
}
```

Let's break down the request body parameters and their usage

#### Basic Configuration

A predefined configuration string that specifies a common resource profile. Use this for quick filtering without specifying individual resources

**Example:**

```json
{
  "basicConfiguration": "cpu-8-ram-16gb-storage-25gb"
}
```

This filter would show offers with 8 CPU cores, 16GB RAM, and 25GB storage.

To get the list with names of all available basic configurations on the marketplace, you can use specific endpoint. Read more about it in the [Basic configurations available on the Marketplace](#basic-configurations-available-on-the-marketplace) section.

#### Hardware specifications constraints

If you need specific CPU architecture or storage type, you can filter based on hardware requirements. To get the list of all available hardware specifications on the marketplace, you can use specific endpoint, read more about it in the [Hardware specifications available on the marketplace](#hardware-specifications-available-on-the-marketplace) section.

- `hardware`

  - Specific hardware requirements for the compute resources.
  - Fields:
    - `cpu`
      - `manufacturer` : CPU manufacturer (e.g., `"AMD"`, `"Intel"`)
      - `architecture` : CPU architecture (e.g., `"Zen"`, `"x86_64"`)
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
        "manufacturer": "AMD"
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
  }
}
```

#### Datacenter constraints

For applications with data residency requirements or to reduce latency for users in specific regions, you can filter datacenters by country. To get the list of all available countries on the marketplace, you can use specific endpoint, read more about it in the [Datacenter countries available on the marketplace](#datacenter-countries-available-on-the-marketplace) section.

- `datacenter` (object)

  - Geographic constraints for the compute resources.
  - Fields:
    - `countries` (array of strings): ISO country codes where you want your resources to be located (e.g., `["FR", "DE"]` for France and Germany)

**Example:**

```json
{
  "datacenter": {
    "countries": ["FR", "DE"]
  }
}
```

#### Additional Resources

If you need additional resources beyond the basic configuration, you can specify them in the request body to get offers that have enough additional resources to satisfy your requirements. Currently, only `STORAGE` is available as additional resource. Additional resources are hardware resources that are not included in the basic configuration, list of all hardware that you can use as additional resources is available in the [Hardware specifications available on the marketplace](#hardware-specifications-available-on-the-marketplace) section.

- `additionalResources`

  - Additional resources you need beyond the basic configuration.
  - Fields:
    - `storage`
      - `type` : Type of storage - one of: `"HDD"`, `"SSD"`, or `"NVMe"`
      - `megabytes` : Required storage size in megabytes

**Example:**

```json
{
  "additionalResources": {
    "storage": [
      {
        "type": "NVMe",
        "megabytes": 20480 // TODO: will be supply, units fields instead of megabytes. Change once we have it. And current value is in MiB, not MB.
      }
    ]
  }
}
```

#### Maximum price per epoch constraint

You can apply filter for the max price per epoch (24 hours) in USDC that you're willing to pay for the resources.
// TODO: specify whether it's per basic configuration or with additional resources.

- `maxTotalPricePerEpochUsd` - Maximum price you're willing to pay for the resources, in USD. This is expressed as a string to handle decimal precision (e.g. `"12.50"`)

**Example:**

```json
{
  "maxTotalPricePerEpochUsd": "12.5"
}
```

## Response structure

When you send a request to `/marketplace/offers`, you'll receive a response containing an array of offers that match your criteria. Each offer represents a unique configuration available from a specific provider in a particular data center.
The response is an array of objects, each object represents an offer from a provider for some basic configuration. To get the list of all available basic configurations, you can use specific endpoint, read more about it in the [Basic Configurations available on the marketplace](#basic-configurations-available-on-the-marketplace) section.

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

### Response Fields of a single offering object

#### Configuration

The `configuration` object represents the basic configuration of the offer. It includes:

- **`slug`**: The identifier for the basic configuration. Read more about basic configurations in the [Basic Configurations section](./get_offerings.md#basic-configurations-available-on-the-marketplace). Full list of available basic configurations is available at GET [/marketplace/basic-configurations](https://api.fluence.dev/marketplace/basic-configurations).
- **`price`**: The base price for this configuration (in USDC per epoch)

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

The `resources` array contains details about the base resources included in the offer with the basic configuration. This shows the exact resources that will be allocated to the VM.

Each resource element in the array includes:

- `type`: Resource type, can be one of the following: `VCPU`, `RAM`, `STORAGE`, `PUBLIC_IP`
- `metadata`: Its type-specific metadata. You can find more details about the metadata for each hardware resource type in the [Resources section](./get_offerings.md#hardware-specifications-available-on-the-marketplace).
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

This example object represents hardware configuration for the example basic configuration from the previous example.

#### Datacenter

The `datacenter` object provides information about the physical location of the resources and the certifications the datacenter holds.

Each `datacenter` object includes fields:

- **`countryCode`**: ISO country code
- **`cityCode`**: LOCODE code for the city
- **`cityIndex`**: Index if multiple datacenters exist in the same city
- **`tier`**: Datacenter tier level (1-4, with 4 being highest reliability)
- **`certifications`**: Array of compliance certifications this datacenter holds

**Example:**

```json
{
  "datacenter": {
    "countryCode": "FR",
    "cityCode": "PAR",
    "cityIndex": 1,
    "tier": 2,
    "certifications": ["ISO 200027", "SOC2", "ISO 50001:2011", "PCI DSS 3.2"]
  }
}
```

#### Servers

The `servers` array provides information about the actual physical machines available to host your workloads. Each element in this array represents a distinct physical server in the provider's infrastructure.

Each `server` object includes:

- **`availableBasicInstances`**: Number of instances with the basic configuration of the object that can be created on this set of resources
- **`additionalResources`**: Extra resources this specific server can provide beyond the basic configuration.
  - `supply`: Total amount of this resource available on this server
  - `perVmLimit`: Maximum amount of this resource that can be allocated to a single VM (null means no limit)
  - `type`: Resource type (currently only STORAGE is supported)
  - `metadata`: Its type-specific metadata. You can find more details about the metadata for each hardware resource type in the [hardware specifications available on the marketplace](#hardware-specifications-available-on-the-marketplace) section.
  - `price`: Cost per unit of this resource

**Example:**

```json
{
  "servers": [
    {
      "availableBasicInstances": 5,
      "additionalResources": [
        {
          "supply": 102400,
          "perVmLimit": 204800,
          "type": "STORAGE",
          "metadata": {
            "type": "NVMe"
          },
          "price": "0.00006"
        }
      ]
    }
    // Other servers
  ]
}
```

#### Max additional supply per VM

The `maxAdditionalSupply` array provides information about the maximum additional resources you can purchase per one instance of VM.
Each element in this array represents a distinct resource type and has the following fields:

- **`supply`**: Total available quantity of this resource type
- **`perVmLimit`**: Maximum amount of this resource that can be allocated to a single VM (null means no limit)
- **`type`**: Resource type (currently only STORAGE is supported)
- **`metadata`**: Resource-specific details
- **`price`**: Cost per unit of this resource

```json
{
  "maxAdditionalSupply": [
    {
      "supply": 128000,
      "perVmLimit": 204800,
      "type": "STORAGE",
      "metadata": {
        "type": "NVMe"
      },
      "price": "0.00001"
    }
  ]
}
```

## Comparing and Selecting Offers

The marketplace may return multiple offers that match your criteria. These offers can differ in several ways:

1. **Price**: Different providers set different prices for similar configurations
2. **Location**: Same configuration might be available in different datacenters
3. **Hardware specs**: CPUs might be from different manufacturers or generations
4. **Availability**: The number of instances and additional resources varies

For example, you might see two offers for the same basic configuration (e.g., `cpu-2-ram-4gb-storage-25gb`) but with different pricing:

- Offer 1: Base price of $0.30 per epoch in a French datacenter with AMD processors
- Offer 2: Base price of $0.27 per epoch in a German datacenter with Intel processors

This allows you to choose based on your priorities - whether that's cost, location, or specific hardware requirements.

## Discovering available options for filter parameters

The Fluence Marketplace API provides several endpoints to help you discover valid values for filter parameters. These endpoints allow you to see what options are available for basic configurations, countries, and hardware specifications.

### Basic Configurations available on the marketplace

```bash
GET /marketplace/basic_configurations
```

Retrieves all available predefined resource configurations in the marketplace without specification of concrete hardware. These predefined configurations follow a simple naming pattern: `cpu-[cores]-ram-[memory]-storage-[disk]`. For example, cpu-2-ram-4gb-storage-25gb represents a VM with 2 CPU cores, 4GB RAM, and 25GB storage.

Response is an array of strings, each string is a basic configuration slug.

**Example of a response:**

```json
{
  "basic_configurations": [
    // TODO: change to plain array
    "cpu-2-ram-4gb-storage-25gb",
    "cpu-4-ram-8gb-storage-25gb",
    "cpu-8-ram-16gb-storage-25gb"
    // More basic configurations
  ]
}
```

**Usage:** Use these values in the `basicConfiguration` field of your [search parameters](#understanding-search-parameters-constraints) to quickly select standard resource profiles.
Each configuration string follows the format `cpu-[cores]-ram-[memory]-storage-[disk]`. For example, `"cpu-2-ram-4gb-storage-25gb"` represents a configuration with 2 CPU cores, 4GB RAM, and 25GB storage.

### Datacenter countries available on the marketplace

```bash
GET /marketplace/countries
```

Lists all countries that have datacenters with available offers in the marketplace.

**Example of a response:**

```json
["DE", "FR", "GB", "LT", "PL", "US"]
```

**Usage:** Use these ISO country codes in the `datacenter.countries` array of your [search parameters](#understanding-search-parameters-constraints) to restrict results to specific geographic locations. This is particularly useful for applications with data residency requirements or to minimize latency for specific user regions.

### Hardware specifications available on the marketplace

```bash
GET /marketplace/hardware
```

This endpoint returns all hardware specifications available across all providers in the marketplace. The response is an object with arrays of hardware specifications for each resource type.

**Example of a response:**

```json
{
  "cpu": [
    {
      "manufacturer": "AMD",
      "architecture": "Zen" // TODO: add brand and generation once they are added to the API
    },
    {
      "manufacturer": "Intel",
      "architecture": "Cascade Lake"
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

**Usage:** This endpoint helps you see what hardware specifications are available for filtering. You can use these values in the `hardware` section of your [search parameters](#understanding-search-parameters-constraints):

- **CPU specifications**: Use `architecture` and `manufacturer` values to specify CPU requirements
- **Memory specifications**: Use `type` and `generation` values to filter by RAM type
- **Storage types**: Use the `type` value to filter by storage technology (`HDD`, `SSD`, or `NVMe`)

For example, if you need high-performance storage, you might filter for offers with `NVMe` storage based on the values returned by this endpoint.

## Practical workflow

Let's walk through a typical workflow for finding and selecting compute resources if you have any specific requirements:

1. Determine your requirements:
   - Compute power (CPUs, RAM)
   - Storage needs
   - Geographic constraints
   - Budget limitations
2. Discover available options:
   - Use `/marketplace/basic_configurations` to see standard configurations
   - Use `/marketplace/countries` to see available locations
   - Use `/marketplace/hardware` to see available hardware specs
3. Search with filters:
   - Create a filter based on your requirements
   - Send a POST request to `/marketplace/offers`
4. Compare and select:
   - Review the returned offers
   - Compare prices, locations, and hardware specs
   - Select the offer that best meets your needs
5. Proceed to deployment:
   - Use the selected offer to [create a deployment](../order_vm/order_vm.md)

## The next steps

The Fluence compute marketplace API provides a powerful and flexible way to find and compare compute resources from various providers across the globe. By using the filtering capabilities and understanding the response structure, you can quickly find resources that match your specific requirements including price, location, and hardware specifications.

In the next document, we'll cover how to use your selected offer to create and manage deployments on the Fluence platform.
