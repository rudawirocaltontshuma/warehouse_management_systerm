# Contributing to Dimension WMS

Thanks for showing interest in improving **Dimension WMS** — a frontend-only warehouse management
system demonstration built for portfolio purposes.

---

## Overview

This project is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**.
It is a frontend-only application: there is no backend, database, or authentication provider.
All data is generated locally by a deterministic seeded mock-data layer — see
[README.md](./README.md) for the full architecture and portfolio disclaimer.

---

## Project Layout

```
src
├── app                       # Next.js routes (App Router)
│   ├── (external)            # Public routes with no sidebar (/, /about)
│   └── (main)                # The WMS application shell
│       ├── _components       # Sidebar, header, search, theme switcher
│       ├── dashboard          # Warehouse Overview
│       ├── receiving, putaway, picking, packing, shipping, returns
│       ├── inventory, stock-levels, stock-movements, adjustments,
│       │   cycle-counts, transfers
│       ├── orders, sales-orders, purchase-orders, backorders
│       ├── products, categories, product-locations, barcodes
│       ├── warehouses, zones, aisles, bins, locations/[id]
│       ├── suppliers, supplier-performance
│       ├── workers, tasks, productivity, shifts
│       ├── shipments, carriers, routes, logistics
│       ├── analytics, reports
│       └── settings
├── components
│   ├── ui                    # shadcn/ui primitives
│   └── wms                   # Reusable WMS components (DataTable, KpiCard,
│                              # charts, StatusBadge, ActivityTimeline, ...)
├── data                       # Per-domain mock data modules
│   └── wms                   # Deterministic seeded generator + constants
├── navigation                 # Sidebar navigation configuration
├── types                      # Domain types (Product, Order, Shipment, ...)
├── hooks                      # Reusable hooks
├── lib                        # Config & utilities
└── styles                     # Tailwind / theme setup
```

Each route's `page.tsx` composes the shared `wms` components with the data it needs — new modules
should follow the same pattern rather than introducing bespoke one-off UI.

---

## Getting Started

1. **Clone the repository** and check out this branch.
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the dev server**
   ```bash
   npm run dev
   ```
   App will be available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```
- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`, etc.):
  ```bash
  git commit -m "feat: add cycle count variance chart"
  ```
- Open a Pull Request once ready. If your change adds a new screen or component, include a
  screenshot in the PR description.

---

## Guidelines

- **No real backend behavior.** This is a frontend-only demonstration — never add a database,
  authentication, real API calls, or anything that performs a genuine business operation (sending
  shipments, contacting carriers, processing payments, etc.). Interactive actions should update
  local component state and/or show a toast.
- **Reuse the shared components** in `src/components/wms` (`DataTable`, `KpiCard`, chart wrappers,
  `StatusBadge`, `DetailShell`, `ActivityTimeline`, `EmptyState`) rather than building bespoke
  list/detail UI per page.
- **Mock data belongs in `src/data`.** Add new entities to `src/data/wms/generate.ts` (keeping
  relationships consistent — reference real warehouses, products, workers, etc.) and re-export the
  relevant slice from a per-domain file (e.g. `src/data/orders.ts`).
- Prefer **TypeScript types** over `any`; add new domain types to `src/types/wms.ts`.
- Husky pre-commit hooks are enabled — linting and formatting run automatically on commit, and the
  commit is blocked until errors are fixed.
- Follow **shadcn/ui** style and Tailwind v4 conventions; keep accessibility in mind (ARIA, keyboard
  navigation, focus states).
- Avoid unnecessary dependencies — prefer existing utilities where possible.

---

## Submitting PRs

- Ensure your branch is up to date with `main` before submitting.
- Run `npm run check` and `npm run build` locally before opening the PR.
- Reference any related issue in your PR for context.

---

**Happy building!**
