# GPU Cloud Documentation - Work Context

This document provides context for agents and contributors working on the GPU Cloud documentation for the Fluence docs site. It covers the project setup, conventions, current state, and what needs to be done.

## Project Setup

The docs site is a **Docusaurus 2** project.

```sh
# Install dependencies
npm i

# Local dev server (live reload)
npm run dev

# Production build (run after every change to verify it builds)
npm run build
```

**Always run `npm run build` after changes** to catch broken links, missing assets, or markdown issues before committing.

## Repository Structure (docs/build)

```
docs/build/
  overview.md                    # Build section entry point
  registration/registration.md   # User registration (shared)
  balance/balance.md             # Billing & balance (shared)
  settings/settings.md           # Account settings, API keys, SSH keys (shared)
  cpu_cloud/                     # CPU Cloud - COMPLETE, use as reference
    vm_rent/vm_rent.md           # Renting a CPU VM (UI walkthrough)
    manage_vm/
      manage_vm.md               # VM info and management
      provider_vm_termination.md # Provider termination handling
    api/
      overview.md                # API intro, auth, request format
      get_offerings/             # Marketplace search API
      order_vm/                  # Deploy VMs API
      manage_vms/                # Manage VMs API (+ SSH key mgmt)
  gpu_cloud/                     # GPU Cloud - IN PROGRESS
    instance_rent/instance_rent.md
    manage_instances/manage_instances.md
    api/
      overview.md
      get_offerings/get_offerings.md
      order_instance/order_instance.md
      manage_instances/manage_instances.md
```

Navigation is configured in `sidebars.js`. All GPU Cloud pages are already registered there. **Do not rename files or change directory structure** without updating `sidebars.js`.

Shared pages (registration, balance, settings) apply to both CPU and GPU Cloud. Link to them rather than duplicating content.

## Doc Conventions

These are established conventions from the project README and existing docs:

### File naming and hierarchy
- File hierarchy mirrors the docs hierarchy. The doc tree is defined in `sidebars.js`.
- **Never name a file `index.md`** - use the same name as its parent directory (e.g., `instance_rent/instance_rent.md`).

### Images and assets

Assets live in an `assets/` directory bound to the page directory, then split by workload type. For example:

```
docs/build/gpu_cloud/instance_rent/
  instance_rent.md
  assets/
    containers/          # Screenshots for the container creation flow
      gpu_models.webp
      configurations.webp
      ...
    vm_baremetal/         # Screenshots for the VM / bare metal creation flow
      gpu_models.png
      configurations.png
      ...
```

**Workflow for screenshots:**

1. Screenshots are initially added as **.png** files to the appropriate `assets/<type>/` subdirectory.
2. When writing documentation, **read the .png screenshot** to understand the UI and describe what's shown (dropdowns, toggles, input fields, buttons, panels, etc.) following the style established in existing docs.
3. Convert the .png to **.webp** before finalizing. Use `cwebp` (installed via `brew install webp`):
   ```sh
   cwebp -q 80 input.png -o output.webp
   ```
4. Reference the .webp version in markdown: `![short description](./assets/containers/image.webp)`.
5. Remove the original .png after conversion.

**When describing screenshots** in the doc text, explain what the user sees and interacts with: mention specific UI elements like dropdowns, toggles, input fields, checkboxes, buttons, and panels by name. The goal is that a user can follow the doc alongside the actual UI. See the existing container section in `instance_rent.md` for the established style.

**General image rules:**
- Prefer **.webp** for screenshots, **.svg** for diagrams, **.png** only as intermediate format before webp conversion.
- Compress images via [tinypng.com](https://tinypng.com/) or [svgomg](https://jakearchibald.github.io/svgomg/) if needed.
- Keep images as small as reasonable.

### Markdown style
- Use ```` ```sh ```` for shell commands. Avoid `$` signs and command output in shell code blocks (makes copy-paste harder).
- **Do not skip heading levels** (e.g., don't follow `#` immediately with `###` - use `##` instead). Headings are semantic and power the right-side navigation.
- Use GitHub permalinks for any GitHub source links.
- Use Docusaurus admonitions: `:::info`, `:::warning`, `:::tip`, etc.
- Spell-check content and aim for clear, concise writing.

### Linking
- Use relative links between docs (e.g., `[Settings](../../settings/settings.md)`).
- Cross-reference related docs where helpful (e.g., link from UI docs to API docs and vice versa).

## GPU Cloud - Key Concepts

The GPU marketplace offers **three kinds of GPU workload**:

| Type | Description |
|------|-------------|
| **Containers** | Lightweight deployments running containerized workloads with full GPU access. User specifies a container image, start command, ports, env vars. |
| **VMs** | Full virtual machines with GPU passthrough. User specifies an OS image. |
| **Bare metal** | Dedicated physical servers with direct GPU access. User specifies an OS image. |

### VMs and Bare Metal share UX

VMs and bare metal instances have **almost identical UX** in the console and API. The creation flow, management, and billing work the same way. The key differences are:

- They have **different paths/sections in the UI** (user selects "VM" or "Bare Metal" as the deployment type).
- They have **different API endpoints** (different resource paths).
- Bare metal provides direct hardware access (no virtualization overhead).

**In documentation, we describe VMs and bare metal together** within the same sections, noting where their UI/API paths diverge. We do NOT create separate doc pages for VMs vs bare metal.

### Containers have distinct UX

Containers have a meaningfully different creation flow compared to VMs/bare metal:
- Container image instead of OS image
- Start command configuration
- Environment variables
- Port mapping works differently
- No hostname/public IP configuration in the same way

**Containers get their own sections** within each doc page (e.g., `## GPU container` and `## VM and Bare Metal` within `instance_rent.md`).

### Billing model difference from CPU Cloud

- **CPU Cloud**: daily billing at 5:55 PM UTC, prepayment = 1 day.
- **GPU Cloud**: hourly billing, prepayment = 3 hours. System auto-tops-up instance balance from the owner's balance.

## Current State and Work Items

### DONE

- [x] `instance_rent/instance_rent.md` - **Container section complete** (9-step walkthrough with screenshots)
- [x] Container assets in `assets/containers/` - 10 webp screenshots
- [x] VM/Bare metal assets in `assets/vm_baremetal/` - 7 png screenshots
- [x] Sidebar navigation configured for all GPU Cloud pages
- [x] Billing model section written in `instance_rent.md`

### TODO - UI Documentation

- [ ] **`instance_rent/instance_rent.md` - VM and Bare Metal section**: Screenshots exist in `assets/vm_baremetal/` but the walkthrough text is not yet written. Needs a section similar to the container one, explaining the VM/bare metal creation flow step by step. Note: explain VMs and bare metal together, mention where UI paths differ.

- [ ] **`manage_instances/manage_instances.md` - Instance management**: Currently a "Coming soon" stub. Needs content covering:
  - Instance information display (hardware specs, status, billing info)
  - Instance management operations (terminate, etc.)
  - Billing history
  - Should cover all three types (containers, VMs, bare metal)
  - Reference: `cpu_cloud/manage_vm/manage_vm.md` for structure

- [ ] **Provider termination handling for GPU instances**: CPU Cloud has a dedicated `provider_vm_termination.md`. Evaluate whether GPU Cloud needs an equivalent page. If so, add it to `sidebars.js` under `manage_instances` category.

### TODO - API Documentation

All GPU Cloud API pages are stubs ("Coming soon"). They need to be written following the CPU Cloud API docs as structural reference, but with GPU-specific endpoints, parameters, and examples.

- [ ] **`api/overview.md`** - GPU Cloud API introduction
  - Authentication (same X-API-KEY mechanism)
  - Request/response format
  - GPU-specific endpoint overview table (likely `/gpu/*` or similar paths instead of `/vms/*`)
  - Links to Swagger/API reference
  - Reference: `cpu_cloud/api/overview.md`

- [ ] **`api/get_offerings/get_offerings.md`** - Search GPU marketplace
  - How to search for GPU compute offerings
  - GPU-specific filters (GPU model, vRAM, interface type PCIe/SXM, etc.)
  - Container vs VM/bare metal offering differences
  - Reference: `cpu_cloud/api/get_offerings/get_offerings.md` (633 lines, very detailed)

- [ ] **`api/order_instance/order_instance.md`** - Deploy GPU instances
  - Creating containers via API (image, start command, ports, env vars, SSH keys)
  - Creating VMs/bare metal via API (OS image, SSH keys, ports)
  - Request/response structure with examples
  - Reference: `cpu_cloud/api/order_vm/order_vm.md`

- [ ] **`api/manage_instances/manage_instances.md`** - Manage GPU instances
  - List instances, get instance details
  - Terminate instances
  - SSH key management (or link to shared docs)
  - Reference: `cpu_cloud/api/manage_vms/manage_vms.md`

### TODO - Shared/Cross-cutting

- [ ] **`build/overview.md`** - Update to mention GPU Cloud alongside CPU Cloud. Currently only references CPU VMs and API.

## Writing Guidelines for GPU Cloud Docs

1. **Use CPU Cloud docs as structural reference** but don't copy-paste. GPU Cloud has different UX, billing, and terminology.

2. **Terminology**:
   - CPU Cloud uses "VM" everywhere.
   - GPU Cloud uses "instance" as the umbrella term covering containers, VMs, and bare metal.
   - Be consistent: "GPU instance" when generic, "GPU container" / "GPU VM" / "bare metal instance" when specific.

3. **Screenshots are examples, not exhaustive references**: The marketplace is dynamic — available GPU models, configurations, OS images, locations, providers, and prices change over time. When describing a screenshot, explain what the UI elements are and how to use them (dropdowns, cards, columns, etc.) but **do not treat the specific options visible in a screenshot as the full or fixed set**. You may use `e.g.` to give examples for clarity, but don't write as if those are the only options available.

4. **Write for users, not as a UI transcript**: Describe what the user can do and what the product provides — don't mechanically list every icon, button label, or panel. Avoid phrases like "click the arrow icon on the right side of the card" or "the right panel shows" — just state the facts. Each section (e.g., VM and Bare Metal) should be self-contained — don't write "same as containers but..." forcing users to scroll elsewhere. Don't over-describe obvious UI (e.g., "Click Top up to add funds" when the doc isn't about billing). Don't mention implementation details like "uses the same UI components".

5. **Step-by-step walkthrough pattern** (established in both CPU and GPU docs):
   - Numbered H3 headings: `### 1. Step name`
   - Brief explanation of what the step does
   - Bullet list of options/fields when relevant
   - Screenshot at the end of each step
   - Admonitions (:::info, :::warning) for important notes

4. **API doc pattern** (established in CPU Cloud API docs):
   - Show the endpoint URL in a code block
   - Document request parameters with field descriptions
   - Provide full JSON request examples
   - Document response structure with examples
   - Include error response examples
   - End with "Next steps" linking to related guides

5. **Structure within a page for multi-type content** (containers + VMs/bare metal):
   - Common intro and billing at the top
   - `## GPU container` section with its full walkthrough
   - `## VM and Bare Metal` section with its full walkthrough
   - Note shared steps and highlight differences

## Useful References

| What | Where |
|------|-------|
| Docusaurus config | `docusaurus.config.ts` |
| Sidebar navigation | `sidebars.js` |
| CPU VM rent (UI reference) | `docs/build/cpu_cloud/vm_rent/vm_rent.md` |
| CPU VM management (UI reference) | `docs/build/cpu_cloud/manage_vm/manage_vm.md` |
| CPU API overview (API reference) | `docs/build/cpu_cloud/api/overview.md` |
| CPU deploy API (API reference) | `docs/build/cpu_cloud/api/order_vm/order_vm.md` |
| CPU marketplace API (API reference) | `docs/build/cpu_cloud/api/get_offerings/get_offerings.md` |
| CPU manage API (API reference) | `docs/build/cpu_cloud/api/manage_vms/manage_vms.md` |
| Balance & billing (shared) | `docs/build/balance/balance.md` |
| Settings & SSH keys (shared) | `docs/build/settings/settings.md` |
| GPU container screenshots | `docs/build/gpu_cloud/instance_rent/assets/containers/` |
| GPU VM/bare metal screenshots | `docs/build/gpu_cloud/instance_rent/assets/vm_baremetal/` |
