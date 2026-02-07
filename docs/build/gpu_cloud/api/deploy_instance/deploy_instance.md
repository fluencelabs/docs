---
sidebar_position: 3
---

# Deploy GPU instances

After [browsing available GPU plans](../get_plans/get_plans.md), the next step is to deploy an instance. This guide walks you through the process of deploying GPU containers, VMs, and bare metal instances via the API.

In this guide, you'll learn how to:

1. Deploy a GPU container from a plan
2. Deploy a VM or bare metal instance from a plan
3. Find available default container images
4. Understand the deployment response

## Deploy a container

To deploy a GPU container, send a `POST` request to the following endpoint with a JSON body containing your instance configuration:

```sh
POST https://api.fluence.dev/gpu/instances/
```

### Request parameters

Your deployment request consists of a plan reference, instance name, container configuration, and optional location constraint and SSH key.

**Example request body:**

```json
{
  "plan_id": "075e40d4-2766-4347-833b-205245fe3629",
  "name": "my-gpu-container",
  "container_settings": {
    "image": "docker.io/fluencelabs/debian-ssh-root:11",
    "expose": [
      {
        "port": "22",
        "protocol": "tcp"
      },
      {
        "port": "80",
        "protocol": "http"
      },
      {
        "port": "443",
        "protocol": "tcp"
      },
      {
        "port": "8000",
        "protocol": "tcp"
      }
    ],
    "environment": [
      {
        "name": "MODEL_PATH",
        "value": "/models/llama"
      }
    ],
    "startup_command": "python3 serve.py --port 8000"
  },
  "constraints": {
    "location": "US"
  },
  "ssh_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@host"
}
```

Let's break down each field:

#### plan_id

The unique identifier of the container plan you want to deploy. This is the `plan.id` value from the [container plans](../get_plans/get_plans.md#container-plans) response.

```json
"plan_id": "075e40d4-2766-4347-833b-205245fe3629"
```

#### name

A human-readable name for your instance. Must be 1–25 characters, lowercase letters, digits, or hyphens only. Cannot start or end with a hyphen.

```json
"name": "my-gpu-container"
```

#### container_settings

The `container_settings` object defines your container configuration:

- **`image`** (string, required): The container image reference (e.g., `"docker.io/fluencelabs/debian-ssh-root:11"`). Must be lowercase, max 255 characters. You can use any public image or a private image with credentials.

- **`expose`** (array, required): Ports to expose on the container. Each entry has:
  - `port` (string): The port number
  - `protocol` (string): One of `"tcp"`, `"udp"`, or `"http"`. Defaults to `"tcp"` if omitted.

  You can expose between 1 and 10 ports.

  :::info
  Only port 80 supports the `"http"` protocol. All other ports must use `"tcp"` or `"udp"`.
  :::

- **`environment`** (array, optional): Environment variables available inside the container. Each entry has:
  - `name` (string): Variable name (uppercase letters, digits, and underscores; must start with a letter)
  - `value` (string): Variable value

  You can add up to 64 environment variables.

  :::warning
  When using a predefined container image, the environment variable `SSH_PUBKEY` is reserved by the system for injecting your SSH key. Defining a variable with this name will cause the deployment to fail.
  :::

- **`startup_command`** (string, optional): A command executed as the container entrypoint on startup. Max 2048 characters. If omitted, the default entrypoint defined in the container image is used.

- **`credentials`** (object, optional): Authentication for private container registries:
  - `host` (string): Registry host — `"docker.io"` or `"ghcr.io"`
  - `username` (string): Registry username
  - `password` (string): Registry password or access token

**Example with a private image:**

```json
"container_settings": {
  "image": "ghcr.io/myorg/private-model:v1",
  "expose": [
    { "port": "22", "protocol": "tcp" },
    { "port": "8080", "protocol": "tcp" }
  ],
  "credentials": {
    "host": "ghcr.io",
    "username": "myuser",
    "password": "ghp_xxxxxxxxxxxx"
  }
}
```

#### constraints (optional)

Optional constraints for instance placement. Currently supports location filtering only.

- **`location`** (string, optional): Two-letter country code to restrict where the instance is deployed (e.g., `"US"`). Must match one of the locations returned in the plan's `attributes.location` array.

```json
"constraints": {
  "location": "US"
}
```

If omitted, the system selects a location automatically from those available for the plan.

#### ssh_key (optional)

A public SSH key that will be authorized to access the container.

```json
"ssh_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@host"
```

### Example request

```sh
curl -X POST https://api.fluence.dev/gpu/instances/ \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: <YOUR_API_KEY>" \
  -d '{
    "plan_id": "075e40d4-2766-4347-833b-205245fe3629",
    "name": "my-gpu-container",
    "container_settings": {
      "image": "docker.io/fluencelabs/debian-ssh-root:11",
      "expose": [
        { "port": "22", "protocol": "tcp" },
        { "port": "80", "protocol": "http" }
      ]
    },
    "ssh_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@host"
  }'
```

### Response

A successful response returns the new instance ID:

```json
{
  "instance_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

- **`instance_id`** (string): Unique identifier for your new instance. Save this — you'll need it to manage the instance later.

:::info
An amount equivalent to 3 hours of rent is deducted from your account balance when the instance is created. See the [billing model](../../instance_rent/instance_rent.md#billing-model) for details.
:::

### Default container images

The API provides a list of pre-configured container images that you can use when deploying containers. These images come with common settings already defined.

#### Endpoint

```sh
GET https://api.fluence.dev/gpu/default-images/
```

**Example request:**

```sh
curl -X GET https://api.fluence.dev/gpu/default-images/ \
  -H "X-API-KEY: <YOUR_API_KEY>"
```

#### Response structure

The response is a JSON array of default container image objects:

```json
[
  {
    "slug": string,
    "name": string,
    "description": string | null,
    "image": string,
    "expose": [...],
    "environment": [...],
    "startup_command": string | null,
    "requires_ssh": boolean | null
  }
  // More images...
]
```

#### Response fields

- **`slug`** (string): Unique identifier for the image (e.g., `"debian-ssh-11"`).
- **`name`** (string): Display name of the image (e.g., `"Debian SSH 11"`).
- **`description`** (string or null): Optional description of the image.
- **`image`** (string): Full container image reference. Use this value in the `container_settings.image` field of your [deployment request](#deploy-a-container).
- **`expose`** (array): Default port configurations for this image. You can use these as a starting point and adjust in your deployment request.
- **`environment`** (array): Default environment variables.
- **`startup_command`** (string or null): Default startup command, if any.
- **`requires_ssh`** (boolean or null): Whether the image requires an SSH key to be provided during deployment.

:::tip
You don't have to use default images — you can specify any public or private container image in your deployment request. Default images are provided as convenient starting points with pre-configured settings.
:::

## Deploy a VM or Bare Metal instance

VM and bare metal instances provide full OS-level access with GPU passthrough. Both use the same request structure — only the endpoint path differs.

:::info
`/gpu/instances/vms` and `/gpu/instances/baremetal` accept identical request bodies. The examples below use the VM endpoint, but the bare metal endpoint works the same way.
:::

### Endpoints

To deploy a VM:

```sh
POST https://api.fluence.dev/gpu/instances/vms
```

To deploy a bare metal instance:

```sh
POST https://api.fluence.dev/gpu/instances/baremetal
```

### Request parameters

**Example request body:**

```json
{
  "plan_id": "e5f00ba8-268e-4279-9672-eabca860f19e",
  "name": "my-gpu-vm",
  "ssh_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@host",
  "os_image": "Ubuntu Server 22.04"
}
```

#### plan_id

The unique identifier of the configuration you want to deploy. This is the `id` value from a specific option in the [VM or bare metal plans](../get_plans/get_plans.md#vm-and-bare-metal-plans) response (`availability_by_number[].options[].id`).

The plan ID determines the GPU model, vCPU, memory, storage, provider, and location for your instance.

```json
"plan_id": "e5f00ba8-268e-4279-9672-eabca860f19e"
```

#### name

A human-readable name for your instance. Must be 1–25 characters, lowercase letters, digits, or hyphens only. Cannot start or end with a hyphen.

```json
"name": "my-gpu-vm"
```

#### ssh_key

A public SSH key that will be authorized to access the instance via SSH. Required for VM and bare metal instances.

```json
"ssh_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@host"
```

#### os_image

The operating system image to install on the instance. Must match one of the values in the `os_options` array from the selected plan in the [plans response](../get_plans/get_plans.md#configuration-option).

```json
"os_image": "Ubuntu Server 22.04"
```

:::warning
If the `os_image` value doesn't match any available option for the selected plan, the API returns an error with the list of valid image names.
:::

### Example request

```sh
curl -X POST https://api.fluence.dev/gpu/instances/vms \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: <YOUR_API_KEY>" \
  -d '{
    "plan_id": "e5f00ba8-268e-4279-9672-eabca860f19e",
    "name": "my-gpu-vm",
    "ssh_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@host",
    "os_image": "Ubuntu Server 22.04"
  }'
```

### Response

A successful response returns the new instance ID:

```json
{
  "instance_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

- **`instance_id`** (string): Unique identifier for your new instance. Save this — you'll need it to manage the instance later.

:::info
An amount equivalent to 3 hours of rent is deducted from your account balance when the instance is created. See the [billing model](../../instance_rent/instance_rent.md#billing-model) for details.
:::

## Error responses

All deployment endpoints return errors in the same format. There are two kinds:

### Validation errors (422)

Returned when the request body has invalid or missing fields. The response contains a `detail` array with the location and description of each error:

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "container_settings", "expose", 0, "port"],
      "msg": "Value error, Port must be between 1 and 65535",
      "input": "999999999",
      "ctx": {
        "error": {}
      }
    }
  ]
}
```

### Business logic errors (400)

Returned when the request is well-formed but cannot be fulfilled. The response contains a `detail` string describing the problem:

```json
{
  "detail": "Insufficient balance to deploy instance"
}
```

Common 400 errors include:

- Insufficient account balance
- Plan no longer available
- Unsupported OS image for the selected plan (the error message lists the valid options):
  ```json
  {
    "detail": "Provided OS image sss is not supported for the selected offer. Available OS images: Ubuntu Server 22.04"
  }
  ```

## Next steps

After deploying your instance, you can:

1. **Check instance status** — Monitor your instance as it provisions
2. **Get connection details** — Retrieve the IP address and port for SSH access
3. **Manage instances** — View, update, or terminate your running instances

Proceed to the [Manage GPU instances](../manage_instances/manage_instances.md) guide to learn more.
