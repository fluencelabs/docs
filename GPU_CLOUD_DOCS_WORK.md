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
5. Keep the original .png files for now (useful for rework and rollbacks). Clean up when the owner confirms.

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

### GPU Cloud billing model

GPU instances use hourly pre-paid billing. Key facts:

- Each instance has its own **dedicated balance**.
- **Billing periods** are fixed hourly intervals (15:00–16:00, 16:00–17:00 UTC etc.), not relative to instance start time.
- **On deployment**: 3 hours of rent are transferred from user's account to instance balance. 1 hour is charged immediately for the current billing period, 2 hours remain as reserve.
- **If provisioning fails**: full amount is returned to user.
- **Ongoing**: the system maintains a 2-hour reserve on instance balance by auto-topping-up from user's account after each hourly charge.
- **Insufficient funds**: system retries top-up. Instance runs through any paid period. Termination happens only when the next charge fails (balance is 0, new billing period starts).
- **On stop/termination**: unused funds return to user's account.

For comparison, **CPU Cloud** uses daily billing at 5:55 PM UTC with a 1-day prepayment.

## Current State and Work Items

### DONE

- [x] `instance_rent/instance_rent.md` - **Container section** (9-step walkthrough with screenshots)
- [x] `instance_rent/instance_rent.md` - **VM and Bare Metal section** (7-step walkthrough with screenshots)
- [x] `instance_rent/instance_rent.md` - **Billing model section** (pre-paid model, deployment charge, auto top-ups, termination, refunds)
- [x] `manage_instances/manage_instances.md` - **Full page**: instances list, container details (logs/events/update), VM/bare metal details, billing page
- [x] Container assets in `assets/containers/` - 10 webp screenshots
- [x] VM/Bare metal assets in `assets/vm_baremetal/` - 7 webp screenshots (png originals kept for now)
- [x] Manage instances assets - container (list, details, update, logs, events), vm_baremetal (list, details), billing page
- [x] Sidebar navigation configured for all GPU Cloud pages

### TODO - UI Documentation

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

4. **Write for users, not as a UI transcript**: The tone should be informative and helpful — you're explaining how to use the product, not mechanically listing every pixel on screen. But don't go too dry either — include enough detail that users can follow along with the actual UI (mention action icons, relevant field names, etc.). Key principles:
   - Each section should be **self-contained** — don't write "same as containers but..." forcing users to scroll elsewhere. Repeat the relevant info.
   - Don't over-describe things outside the page's scope (e.g., don't explain how the Top up button works on a page about instance management).
   - Don't mention implementation details (e.g., "uses the same UI components"). You can cross-reference related pages for detailed guidance (e.g., "The update page works the same way as the [instance creation flow](link)").
   - Describe **what users can do**, not what the UI looks like.

5. **Step-by-step walkthrough pattern** (established in GPU docs):
   - H3 headings without numbering: `### Select the GPU model` (not `### 1. Select the GPU model`)
   - Brief explanation of what the step does
   - Bullet list of options/fields when relevant
   - Screenshot at the end of each step
   - Admonitions (:::info, :::warning) for important notes
   - Note: CPU Cloud docs still use numbered headings — don't follow that pattern for GPU docs

6. **API doc pattern** (established in CPU Cloud API docs):
   - Show the endpoint URL in a code block
   - Document request parameters with field descriptions
   - Provide full JSON request examples
   - Document response structure with examples
   - Include error response examples
   - End with "Next steps" linking to related guides

7. **Structure within a page for multi-type content** (containers + VMs/bare metal):
   - Common intro and billing at the top
   - `## GPU container` section with its full walkthrough
   - `## VM and Bare Metal` section with its full walkthrough
   - Note shared steps and highlight differences

8. **Use H3 subheadings freely** within `##` sections (e.g., `### Deployment charge` under `## Billing model`). Docusaurus nests H3 under H2 in the right-side nav, so they organize well. H3 headings are linkable (useful for cross-references from other pages) and navigable on long pages.

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
| GPU container screenshots (rent) | `docs/build/gpu_cloud/instance_rent/assets/containers/` |
| GPU VM/bare metal screenshots (rent) | `docs/build/gpu_cloud/instance_rent/assets/vm_baremetal/` |
| GPU container screenshots (manage) | `docs/build/gpu_cloud/manage_instances/assets/container/` |
| GPU VM/bare metal screenshots (manage) | `docs/build/gpu_cloud/manage_instances/assets/vm_baremetal/` |
| GPU billing page screenshot | `docs/build/gpu_cloud/manage_instances/assets/billing_page.webp` |
