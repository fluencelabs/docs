# Renting an instance

This guide walks you through deploying a virtual machine instance on CPU Cloud. For background on marketplace concepts, instance lifecycle, and how billing works, see the [CPU Cloud concepts](./overview.md).

When you deploy, the system reserves 2 days' rent from your account balance — one day is charged immediately, the other is kept as a reserve. Make sure your balance has enough funds before starting. See [billing model](./overview.md#billing-model) for details.

## Steps to configure an instance

### 1. Choose a location

Choose one of the available data center locations.

![choose location](./assets/vm_rent/location.webp)

### 2. Choose a configuration

Choose your instance's configuration from the available options. Compute resources come in multiples of a compute unit — 2 vCPUs and 4 GB of RAM.

![choose configuration](./assets/vm_rent/configuration.webp)

### 3. Choose storage

Choose the type and amount of storage. The minimum storage size is 25 GB. Currently only DAS (direct-attached storage) is available, which offers better performance than shared network solutions but does not allow dynamic resizing.

![choose storage](./assets/vm_rent/storage.webp)

### 4. Choose the server type

Review the available servers for your chosen configuration. Hardware varies within and across data centers, so pay attention to the specifications and price. The console also shows each data center's location at the city level and details such as available certifications.

![choose server type](./assets/vm_rent/server_type.webp)

### 5. Rent a public IPv4 address

A public IPv4 address is allocated to the instance at deployment. Currently, this is the only way to access your instance via SSH.

![rent public IPv4 address](./assets/vm_rent/public_ip.webp)

### 6. Specify the instance name

Choose a **name** for your instance. The name must be unique within your account.

![specify VM name](./assets/vm_rent/vm_name.webp)

### 7. Specify the open ports

By default, only **port 22** is open. You can assign up to 50 additional ports — all open ports support **TCP** and **UDP**.

![specify ports](./assets/vm_rent/ports.webp)

### 8. Choose the OS image

Choose an **OS image** for your instance. You can pick a pre-defined image or provide a link to a **custom image**. Custom images must be publicly downloadable and configured for remote instances — look for images tagged `Generic Cloud` or `Cloud`. See [supported formats](./overview.md#os-images).

![choose OS image](./assets/vm_rent/os_image.webp)

### 9. Provide the public SSH key

Provide at least one SSH public key to connect to your instance. Supported formats: RSA, ECDSA, and ED25519.

![provide SSH key](./assets/vm_rent/ssh.webp)

### 10. Review the summary

Review the instance summary and price in the Review section before launching.

![review summary](./assets/vm_rent/summary.webp)

### 11. Launch the instance

Click **Launch** to deploy. You'll be redirected to the **Running Instances** page.

