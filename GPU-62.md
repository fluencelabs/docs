# GPU-62 - lighten api docs

## Problem definition

This task comes from the issue that although the docs are very descriptive for the use cases and details, in the API section they provide a lot of details about JSON requests and responses, which leads to a burden with maintainance. Exactly - when a small change in API happens (not a new feature) - it may be missed by other temmates and won't be reflected in the docs (that is separate from the backend code), but in reflected in the API spec (openapi, swagger, redoc).
Again, this repo (and /docs/build exactly) has narrative guides for API and UI — hand-written (or AI-written) tutorials that explain concepts, walk through examples, and teach the user how to think use the product. This is not auto-generated reference. The problem is that the JSON examples and field descriptions in these guides go stale when the backend changes.

When I think about possible solutions, I see following options (order does not mean priority)

- Make some CI validation script:
  - Fetches the OpenAPI spec from api.fluence.dev
  - Parses all markdown files for JSON code blocks
  - Extracts field names and endpoint paths from those blocks
  - Cross-references them against the spec's schemas and paths
  - Fails or opens an issue when it finds a field name that doesn't exist in the spec anymore

    This won't catch everything (your examples are illustrative, not exhaustive), but it catches exactly the problem you described — renamed or removed fields. You'd tag your code blocks with the schema they correspond to (e.g., <!-- schema: MarketplaceOfferResponse -->) so the script knows what to validate against.

- Set up a GitHub Action on the backend repo that triggers when the OpenAPI spec changes:

  - Diff the old vs new OpenAPI spec (field renames, removed fields, schema changes)
  - Clone the docs repo
  - Feed the diff + affected doc pages to Claude API with a prompt like: "Here's what changed in the API spec. Here are the doc pages with examples referencing these endpoints. Update the JSON examples and field descriptions to match the new spec. Preserve the narrative style and explanations."
  - Open a PR on the docs repo with the changes

And we can continue such ideas ...

But lets try to think from another angle - maybe there's also an issue that some stuff from the API is described too detailed and maybe we can leave some stuff in the API spec and docs and leave here less code that can become stale by change (not a huge change like concepts change) - the field-by-field breakdowns, the JSON examples showing every parameter. This is exactly what Swagger/Redoc already does, and it's the part that rots.
We can focus the docs here on the narrative and concepts part, provide some small examples, but maybe try to reference the spec where needed - we need to find some middle ground of what to show and explain here and what to leave in the API spec. Why we do a lot of explanations here is because the domain is a bit special and complex and to use it, users need to understand some concepts - without it raw API spec is useless. Also in the API there is some domain stuff that is abstracted from users in UI.
We try to follow Stripe, DigitalOcean style of making docs.

Also now API part and UI duplicate some kinds of things like concepts. Maybe the very core sharable context things should be in the resource part and some API specific - in the API.
Like: CPU Cloud: overview (what is an instance, what statuses it has, how it is managed etc.), how-tos (use cases);

## Approach

Two layers, clear responsibilities:

- **OpenAPI spec** is the single source of truth for field-level reference — schemas, types, enums, examples, rate limits. The spec URL is linked from docs so humans use Swagger UI and agents fetch the JSON directly.
- **Docs** own concepts, workflows, gotchas, and business rules — things the spec can't convey. Docs never duplicate field definitions, JSON schemas, or response examples from the spec.

### What belongs in docs vs spec

**In the OpenAPI spec (not in docs):**
- Field names, types, required/optional
- JSON request/response schemas and examples
- Enum values
- Endpoint signatures (method, path, parameters)
- Rate limits
- Operation descriptions

**In docs (not in the spec):**
- Product concepts: what an instance is, workload types, billing model, lifecycle
- Workflow guidance: which ID to use from plans when deploying, how plans connect to deploy, what to poll after deployment
- Restrictions and gotchas the spec can't express: SSH_PUBKEY reserved, ports immutable after deploy, update is full replacement, os_image must match os_options
- Business rules: only ACTIVE instances can be terminated, provisioning takes ~2-3 min
- Cross-references between related pages

**Never in docs:**
- curl examples (spec has "Try it out")
- Field-by-field breakdowns
- Annotated JSON schemas
- Response structure diagrams
- Large example response blocks

### Doc structure per cloud API

One page per cloud (not per endpoint group). The page contains:
1. Endpoints table — full API surface at a glance
2. Sections per workflow area (plans, deploy, manage) — only gotchas, restrictions, and guidance
3. Error response formats (not in spec descriptions)
4. Link to API reference (OpenAPI spec JSON) and Swagger UI

### Shared concepts

Product concepts (instance types, lifecycle, statuses, billing model) belong in cloud overview pages (`docs/build/gpu_cloud/overview.md`, `docs/build/cpu_cloud/overview.md`), not in API docs. API docs link to them when relevant. No duplication between UI docs and API docs.

## Work items

### DONE

- [x] Enrich GPU OpenAPI spec — field descriptions, enums, examples, operation descriptions, rate limits. Checklist: [GPU-62-enrich-openapi.md](./GPU-62-enrich-openapi.md)
- [x] Consolidate GPU API docs — merged `get_plans`, `deploy_instance`, `manage_instances` into single `api/gpu_cloud/overview/overview.md`. Removed JSON schemas, field breakdowns, curl examples. Kept gotchas, restrictions, workflow guidance. Updated `sidebars.js`.

### TODO

- [ ] **Create GPU Cloud concept overview page** — `docs/build/gpu_cloud/overview.md` with shared concepts: workload types (container/VM/bare metal), instance lifecycle and statuses, billing model, terminology. Move these out of `instance_rent.md` and `manage_instances.md` where they're currently embedded. Update sidebar.
- [ ] **Create CPU Cloud concept overview page** — same pattern for `docs/build/cpu_cloud/overview.md`.
- [ ] **Slim down CPU API docs** — apply the same approach to `api/cpu_cloud/` pages: one page, no spec duplication, only guidance and gotchas. Currently `get_offerings`, `order_vm`, `manage_vms` are separate verbose pages.
- [ ] **Enrich CPU OpenAPI spec** — same treatment as GPU: field descriptions, enums, examples, operation descriptions.
- [ ] **Update cross-references** — UI docs link to overview pages for concepts. API docs link to overview for concepts and to spec for schemas. No orphan links after restructure.
- [ ] **Clean up old GPU API doc files** — delete `get_plans/`, `deploy_instance/`, `manage_instances/` directories once confirmed.
