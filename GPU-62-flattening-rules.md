# Docs File Structure Flattening Rules

This document describes the file organization convention for the Docusaurus docs site. Use it when reorganizing any section.

## Convention

### Pages

- **Single pages** live at their **section root** as `section/page_name.md`
- A page must NOT be nested as `section/page_name/page_name.md` — that creates redundant URLs with trailing slashes

### Assets

- Assets live in `section/assets/<page_name>/` — one subdirectory per page
- Asset subdirectories inside (e.g. `containers/`, `vm_baremetal/`) are preserved as-is
- This rule applies **recursively** at every level: if a subsection has pages, each page gets its own `assets/<page_name>/` folder within that subsection

### Subsections

- A subsection is a directory containing **multiple pages** that form a logical group
- Subsections keep their directory structure
- Pages inside a subsection follow the same rules: file at subsection root, assets in `subsection/assets/<page_name>/`

### Sidebar

- After moving a file from `section/page/page.md` to `section/page.md`, update `sidebars.js` from `"section/page/page"` to `"section/page"`

### Cross-doc links

- After moving a file, all relative links **to** and **from** that file must be recalculated
- Links use `.md` extensions (required for Docusaurus resolution): `./overview.md`, `../settings.md#anchor`
- When a file moves up one level (e.g. `subdir/file.md` → `parent/file.md`):
  - Outgoing `../X` becomes `./X` (siblings are now in same dir)
  - Outgoing `./X` becomes — recalculate based on new location
  - Incoming links from other files: `./subdir/file.md` becomes `./file.md`, `../subdir/file.md` becomes `../file.md`, etc.

### Image paths

- Image paths are relative to the markdown file: `./assets/<page_name>/image.webp`
- When a file moves, image paths change because the relative path to the assets dir changes

---

## Example transformation

### Before (page in its own subdir)

```
section/
├── page_a/
│   ├── page_a.md
│   └── assets/
│       ├── img1.webp
│       └── img2.webp
└── page_b/
    ├── page_b.md
    └── assets/
        └── img3.webp
```

### After (pages at section root, assets in section/assets/)

```
section/
├── assets/
│   ├── page_a/
│   │   ├── img1.webp
│   │   └── img2.webp
│   └── page_b/
│       └── img3.webp
├── page_a.md
└── page_b.md
```

### What changes

| Item | Before | After |
|------|--------|-------|
| Sidebar | `"section/page_a/page_a"` | `"section/page_a"` |
| Image path in page_a.md | `./assets/img1.webp` | `./assets/page_a/img1.webp` |
| Link from page_a to page_b | `../page_b/page_b.md` | `./page_b.md` |

---

## Step-by-step procedure for flattening a page

1. **Move the markdown file** to section root: `git mv section/page/page.md section/page.md`
2. **Create assets subdirectory**: `mkdir -p section/assets/page`
3. **Move assets**: `git mv section/page/assets/* section/assets/page/`
4. **Remove empty dirs**: `rmdir section/page/assets section/page`
5. **Update image paths** in the moved file: `./assets/X` → `./assets/page/X`
6. **Update sidebar**: `"path/page/page"` → `"path/page"`
7. **Fix outgoing links** from the moved file (recalculate relative paths from new location)
8. **Fix incoming links** in other files that referenced the old path
9. **Verify**: `npm run build` — must pass with no warnings

---

## Sections remaining to flatten

### `docs/stake/`

Current structure — 3 pages in subdirs, 1 overview at root:

| Page | Current path | Action |
|------|-------------|--------|
| overview | `stake/overview.md` | No change (already flat) |
| wallets_guide | `stake/wallets_guide/wallets_guide.md` + `wallets_guide/assets/` | Flatten → `stake/wallets_guide.md` + `stake/assets/wallets_guide/` |
| bridge_guide | `stake/bridge_guide/bridge_guide.md` + `bridge_guide/assets/` | Flatten → `stake/bridge_guide.md` + `stake/assets/bridge_guide/` |
| staking_app_guide | `stake/staking_app_guide/staking_app_guide.md` + `staking_app_guide/assets/` | Flatten → `stake/staking_app_guide.md` + `stake/assets/staking_app_guide/` |

Note: `stake/assets/` already exists with 2 images (`secure_with_staking.png`, `staking_user_flow.png`) used by `stake/overview.md`. These should stay — the new per-page subdirs go alongside them.

Sidebar changes:
- `"stake/wallets_guide/wallets_guide"` → `"stake/wallets_guide"`
- `"stake/bridge_guide/bridge_guide"` → `"stake/bridge_guide"`
- `"stake/staking_app_guide/staking_app_guide"` → `"stake/staking_app_guide"`

### `docs/connect_servers/`

Current structure — 5 pages in subdirs, 1 overview at root:

| Page | Current path | Action |
|------|-------------|--------|
| overview | `connect_servers/overview.md` | No change (already flat) |
| login | `connect_servers/login/login.md` + `login/assests/` | Flatten → `connect_servers/login.md` + `connect_servers/assets/login/` |
| hardware | `connect_servers/hardware/hardware.md` + `hardware/assests/` | Flatten → `connect_servers/hardware.md` + `connect_servers/assets/hardware/` |
| kubernetes | `connect_servers/kubernetes/kubernetes.md` + `kubernetes/assets/` | Flatten → `connect_servers/kubernetes.md` + `connect_servers/assets/kubernetes/` |
| subnets | `connect_servers/subnets/subnets.md` + `subnets/assets/` | Flatten → `connect_servers/subnets.md` + `connect_servers/assets/subnets/` |
| smart_contracts | `connect_servers/smart_contracts/smart_contracts.md` + `smart_contracts/assets/` | Flatten → `connect_servers/smart_contracts.md` + `connect_servers/assets/smart_contracts/` |
| upcoming_features | `connect_servers/upcoming_features/upcoming_features.md` (no assets) | Flatten → `connect_servers/upcoming_features.md` |

Note: `connect_servers/assets/` already exists with `subnets.svg` used by `connect_servers/overview.md`. This stays.

**Typo warning**: `login/` and `hardware/` directories have their assets folder misspelled as `assests/` (not `assets/`). During flattening, rename to `assets/` for consistency.

Sidebar changes:
- `"connect_servers/login/login"` → `"connect_servers/login"`
- `"connect_servers/hardware/hardware"` → `"connect_servers/hardware"`
- `"connect_servers/kubernetes/kubernetes"` → `"connect_servers/kubernetes"`
- `"connect_servers/subnets/subnets"` → `"connect_servers/subnets"`
- `"connect_servers/smart_contracts/smart_contracts"` → `"connect_servers/smart_contracts"`
- `"connect_servers/upcoming_features/upcoming_features"` → `"connect_servers/upcoming_features"`
