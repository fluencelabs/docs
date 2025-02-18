# CPU VM Renting

Currently, on the Fluence platform, it is possible to rent resources in the form of CPU VMs with various configurations. It is important to note that the rental process involves smart contracts in the Fluence network, which regulate the relationship between the user and the compute resource provider for launching and properly functioning the VM.

Currently, due to the specifics of the Fluence protocol, there are several important limitation for rented VMs:

1. **VMs can only be rented for a limited period**. Since the Fluence protocol uses the **Capacity Commitment (CC)** and **Staking** mechanics to verify the provider’s infrastructure, the rental period for a specific server is limited by the duration of the Capacity Commitment created for it. After the Capacity Commitment ends, the Fluence protocol stops verifying the provider’s infrastructure, meaning there is no guarantee of the server’s availability.
    :::info
    When renting a server through Fluence Console, users can explicitly see the maximum rental duration for a CPU VM.
    :::

1. When renting a VM, an additional amount equal to one day’s rent is deducted from the user’s balance. This amount is held as a 'prepayment' for the next day’s rental. It is refunded to your Fluence Balance once the rental period ends — unless your balance runs out and the prepaid amount is used to cover the VM costs.
    :::info
    Users can always check the amount of Balance reserved as a “prepayment” on the Billing page.
    :::

## Steps to Configure a Rented VM

The Fluence protocol provides users of the Fluence platform with access to a variety of commercial-grade server hardware from reliable Tier-1 to Tier-4 data centers around the world. To rent a VM, follow these steps:

### 1. Choose location

Choose one of the available Locations for renting a VM.

![choose location](./assets/location.webp)

### 2. Choose configuration

Choose a Basic configuration. Currently, Fluence provides a fixed set of CPU and RAM configurations for VMs that users can rent.

:::info
Currently, compute resources can only be rented in multiples of a compute unit, which is 2 vCPUs and 4 GB. In the future, this limitation will be removed and compute resources can be added in a fine-grained manner for both vCPUs and RAM.
:::

![choose configuration](./assets/configuration.webp)

### 3. Choose storage

Choose the type of Storage and its amount. Currently, the minimum Storage size for a VM is 25 GB. When renting a VM, DAS Storage is allocated, physically located on the same server as the CPU and RAM resources. This ensures higher Storage performance compared to NAS but limits the ability to expand it.

![choose storage](./assets/storage.webp)

### 4. Choose server type

Specify the Server type for the VM. Since the hardware in the Fluence protocol can vary , the user needs to pay attention to the provided information as the price of resources may vary depending on the quality of the hardware. Users also need to utilized the Data Center information provided. In Fluence Console, users are provided with a Data Center's geo info at the city level, available certifications and more.

![choose server type](./assets/server_type.webp)

:::info
The choice of **Server type** also affects the rental duration of the VM. Pay attention to the `Expires in` parameter in the **Review** block. If the user is not satisfied with the rental period, they can try selecting a different Server type. Currently, the maximum available rental period is set by default for each Server type.
:::

### 5. Rent Public IPv4 address

Currently, users can only access their VMs via SSH over the public IPv4 allocated to the VM. In the future, the requirement for a Public IPv4 to access a VM will be removed.

![rent public IPv4 address](./assets/public_ip.webp)

After selecting all the resource parameters for the VM, the user can proceed to the settings related to the workload that will be launched inside the VM.

### 6. Specify VM name

Specify a **name for the VM**. Currently, the VM name must be unique within a specific user account.

![specify VM name](./assets/vm_name.webp)

### 7. Specify the ports

Specify the **ports that need to be opened** for the VM. By default, all ports except **port 22** are closed. Therefore, before renting a VM, the user needs to select which ports need to be opened. Currently, all open ports support **TCP** and **UDP** protocols. The user can open **up to 50 ports**.

:::danger
Currently, it is not possible to change the set of open ports through **Fluence Console** after renting a VM. After renting a VM, users will be able to configure their own Firewall and **close** the necessary ports. However, users will not be able to **open** ports that were closed during the VM renting process.
:::

![specify ports](./assets/ports.webp)

### 8. Choose the OS image

Choose the **OS image** for launching the VM. Users can either choose a pre-defined OS image or provide a link to their **custom OS image**. It is important to note the following limitations on custom OS images:

- The Custom OS image must be available for download via a publicly accessible link.
- The Custom OS image must be intended for running on the remote instance(s). The Fluence team recommends choosing images with the `Generic Cloud` or `Cloud` tags.

![choose OS image](./assets/os_image.webp)

### 9. Provide the public SSH key

Provide the public SSH key for connecting to the VM, which is currently only possible via SSH using the public IPv4 address allocated to your VM. Thus, you need to specify at least one SSH key in one of the following formats: RSA, ECDSA, or ED25519.

![provide SSH key](./assets/ssh.webp)

### 10. Review the summary

After selecting all the VM parameters, the user can see a quick summary in the Review section, including the final rental price of the VM.

![review summary](./assets/summary.webp)

### 11. Click the Launch button

Click the “Launch” button to rent the VM. After that, you will be redirected to the Running Instances page to manage the launched VM.

:::info
Currently an additional amount equal to the cost of one day’s rent is deducted from the user’s Balance, which is reserved as a “prepayment” until the rental is canceled. Immediately after canceling the VM rental, this amount will be returned to the user’s Balance provided that the "prepayment" amount was not used to pay for the VM after the entire Balance on the Fluence platform was exhausted. The reserved amount is displayed on the **Billing page** under the name `Reserved for running workload`.
:::

:::warning
Please note **payment for rented VMs occurs at the same time every day at** `5:55 PM UTC`. Also, payment is currently only possible for full days, regardless of the rental start time. Thus, if a user rents a VM at `5:45 PM UTC`, they will pay for a **FULL** day of rent and 10 minutes later, at `5:55 PM UTC`, they will pay for another **FULL** day. This limitation is also expected to be remedied in the near future.
:::
