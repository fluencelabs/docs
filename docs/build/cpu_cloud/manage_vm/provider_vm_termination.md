# Handling provider-terminated VMs

When a compute provider decides to terminate a VM that you are actively using, the VM is moved to "Terminated" status.
Terminated VMs are no longer accessible, and data stored on the terminated VM is lost.
It's important to note that even though a provider has terminated your VM, the VM's record will still appear in your list with its balance reserved. You need to perform a final step to remove this record, which releases the funds back to your main balance. This action is the same one you would take when willfully terminating a VM yourself.

In this document, you'll learn:

1. Reasons for VM termination
2. Identification of terminated VMs
3. Finalization of VM termination in the Fluence Console (UI) or via the API

## Reasons for Termination

The Fluence compute marketplace sources from established compute providers with high standards of security and reliability supported by high Tier 3 and 4 certifications. Termination is the last resort for providers when handling exceptions and usually are the result of a adverse user behavior such as:

- Not paying for the VM (VM balance reached 0)
- Violating the terms of service
- Using the VM for illegal activities or running malicious workloads

## Identification of terminated VMs

Currently, status updates about VM termination are only available in the Fluence Console (UI) on the "Running Instances" page or via the API when you request your active VM info using the [View your active VMs](../../api/cpu_cloud.md#manage-vms) endpoint.

### For Fluence Console (UI) Users

**Banner Notification.** You will see an informational banner on the "Running Instances" page with the message: _"Certain virtual machines were stopped by the provider. View details"_. You can click the "View details" button on the banner to see the list of terminated VMs.

**Status Display.** The VM will be clearly marked with a "Terminated" status.

![View of Running Instances page with a banner notification and a Terminated VM](./assets/terminated_vms_general.png)

**Filtering.** You can use the status filter on the "Running Instances" page and select "Terminated" to view only these VMs.

![View of Running Instances page with a status filter](./assets/terminated_vms_filtered.png)

### For API Users

- **Status Field**: In the response from the [View your active VMs](../../api/cpu_cloud.md#manage-vms) endpoint, the `status` field for the affected VM will be `"Terminated"`.
- **Missing Information**:

  - The `publicIp` field will be `null`.
  - Location information within the `datacenter` object might be absent or marked as unavailable.

  Example snippet from the endpoint response for a terminated VM:

  ```json
  {
    "id": "0x68bd60079721AE2A04759d00Fc516148aCF479e4",
    "vmName": "apricot-wolf-5354",
    "status": "Terminated",
    "pricePerEpoch": "0.30697",
    "resources": [
        ...
    ],
    "osImage": "...",
    "datacenter": null,
    "publicIp": null,
    "ports": [
      {
        "port": 22,
        "protocol": "tcp"
      }
    ],
    "reservedBalance": ".30697",
    "totalSpent": "2.45576",
    "createdAt": "2025-05-07T16:20:43Z"
  }
  ```

## Finalization of VM termination and reserved funds release

After identifying VMs that have been terminated by a provider (as described in the section above), you'll need to finalize the termination to release the reserved funds:

### Fluence Console (UI) Users

- Click "Terminate" on the VM with "Terminated" status to remove its record and release its reserved funds

For details on this process, see the [VM Management section](./manage_vm.md#vm-management).

### API Users

- Use the [Delete your VM](../../api/cpu_cloud.md#delete-vms) endpoint with the `vmId` of the terminated VM to remove its record and release its reserved funds
