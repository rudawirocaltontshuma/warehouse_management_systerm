# Nexora WMS — Warehouse Management Platform

A frontend-only, high-fidelity warehouse management system (WMS) demonstration built with **Next.js**,
**TypeScript**, **Tailwind CSS** and **shadcn/ui**. It showcases the information architecture, data
density and operational workflows of a modern enterprise logistics product — receiving, putaway,
picking, packing, shipping, inventory, orders, workforce and analytics — using entirely fictional,
locally generated mock data.

> **Portfolio disclaimer:** This project is a frontend-only Warehouse Management System demonstration
> created for portfolio purposes. It uses fictional mock data and does not connect to a production
> database, authentication provider, warehouse hardware, carrier service, ERP system or external
> business API.

## Overview

Nexora WMS simulates the day-to-day operations of a four-warehouse South African distribution network:
Johannesburg, Cape Town, Durban and Pretoria. Every screen — from the executive dashboard down to a
single bin location — is backed by deterministic, locally generated mock data with realistic SKUs,
customers, suppliers and workers.

## Features

- **Executive dashboard** with KPIs, trend charts and operational widgets
- **Warehouse operations**: receiving, putaway, picking, packing, shipping, returns
- **Inventory management**: stock levels, movements, adjustments, cycle counts, transfers
- **Order management**: orders, sales orders, purchase orders, backorders
- **Product catalog**: products, categories, product locations, barcode management
- **Warehouse structure**: warehouses, zones, aisles, bins/locations
- **Suppliers**: directory and performance scorecards
- **Workforce**: workers, tasks (list + Kanban board), productivity, shifts
- **Logistics**: shipments, carriers, delivery routes
- **Analytics & reporting**: warehouse, inventory and fulfillment analytics, a report center
- **Global command palette** (`⌘K` / `Ctrl+K`) searching products, orders, shipments, suppliers and more
- **Notifications center**, **warehouse switcher**, **demo mode indicator**
- Fully responsive, from 320px mobile up to large desktops, with light/dark/system themes

## Modules

| Area | Routes |
| --- | --- |
| Dashboard | `/dashboard` |
| Warehouse Operations | `/receiving`, `/putaway`, `/picking`, `/packing`, `/shipping`, `/returns` |
| Inventory | `/inventory`, `/stock-levels`, `/stock-movements`, `/adjustments`, `/cycle-counts`, `/transfers` |
| Orders | `/orders`, `/sales-orders`, `/purchase-orders`, `/backorders` |
| Products | `/products`, `/categories`, `/product-locations`, `/barcodes` |
| Warehouses | `/warehouses`, `/zones`, `/aisles`, `/bins`, `/locations/[id]` |
| Suppliers | `/suppliers`, `/supplier-performance` |
| Workforce | `/workers`, `/tasks`, `/tasks/board`, `/productivity`, `/shifts` |
| Logistics | `/shipments`, `/carriers`, `/routes`, `/logistics` |
| Analytics | `/analytics`, `/analytics/inventory`, `/analytics/fulfillment`, `/reports` |
| Administration | `/settings` |
| Showcase | `/about` |

## Technology Stack

- [Next.js](https://nextjs.org/) (App Router, React Server Components)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix-based component primitives)
- [Recharts](https://recharts.org/) for all data visualization
- [Lucide](https://lucide.dev/) icons
- [Zustand](https://zustand-demo.pmnd.rs/) for local preference state

## Architecture

```
src/
  app/                 Next.js App Router routes (one folder per module)
  components/
    ui/                shadcn/ui primitives
    wms/                Reusable WMS components: DataTable, KpiCard, charts,
                        StatusBadge, ActivityTimeline, DetailShell, etc.
  data/                Per-domain mock data modules (products, orders, ...)
    wms/               Deterministic seeded generator + shared constants
  navigation/          Sidebar navigation configuration
  types/               Domain types (Product, Order, Shipment, Worker, ...)
```

### Mock data approach

All data lives in `src/data/wms/generate.ts`, built from a small seeded pseudo-random generator
(`src/data/wms/rng.ts`) so the dataset is large (80+ products, 100+ orders, 150+ inventory records,
150+ stock movements, and more), relationally consistent (orders reference real products and
warehouses, shipments reference real orders, etc.), and stable across renders — no backend or
database required. Per-domain files under `src/data/` (e.g. `products.ts`, `orders.ts`,
`receiving.ts`) simply re-export the relevant slices for a clean import surface.

### Reusable components

Nearly every list page is built on a single generic `DataTable` component (search, sort, filter,
pagination, export-preview) and every detail page on a shared `DetailShell`/`DetailField` pattern,
keeping the ~90 routes consistent while remaining easy to extend.

## Responsive Design

The layout is verified from 320px through 1440px+: the sidebar becomes a navigation drawer, the
header compacts, tables scroll horizontally within their own container, filters move into bottom
sheets, and detail views remain fully usable on a phone-sized screen.

## Local Development

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build
npm run lint      # Biome lint
npm run check     # Biome format + lint check
```

## Project Structure

See [Architecture](#architecture) above. The codebase avoids unnecessary abstraction — shared UI
lives in `components/wms`, domain types in `types/wms.ts`, and each route's `page.tsx` composes
those primitives with the data it needs.
