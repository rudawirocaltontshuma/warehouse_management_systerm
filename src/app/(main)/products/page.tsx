"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { categories, products } from "@/data/products";
import { warehouses } from "@/data/warehouses";
import type { Product } from "@/types/wms";

export default function ProductsPage() {
  const goTo = useRowNavigation("/products");

  const columns: DataTableColumn<Product>[] = [
    {
      id: "sku",
      header: "SKU",
      cell: (p) => (
        <span className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.imageColor }} aria-hidden />
          <span className="font-medium">{p.sku}</span>
        </span>
      ),
      sortValue: (p) => p.sku,
    },
    { id: "name", header: "Product", cell: (p) => p.name },
    { id: "category", header: "Category", cell: (p) => p.category },
    { id: "brand", header: "Brand", cell: (p) => p.brand },
    { id: "barcode", header: "Barcode", cell: (p) => <span className="font-mono text-xs">{p.barcode}</span> },
    { id: "units", header: "Units", cell: (p) => p.units.toLocaleString("en-ZA"), sortValue: (p) => p.units },
    { id: "warehouse", header: "Warehouse", cell: (p) => warehouses.find((w) => w.id === p.primaryWarehouseId)?.code },
    {
      id: "status",
      header: "Status",
      cell: (p) => (
        <StatusBadge
          status={p.status}
          tone={p.status === "active" ? "success" : p.status === "seasonal" ? "info" : "neutral"}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="The full Nexora WMS product catalog across all warehouses."
        breadcrumbs={[{ label: "Products" }]}
      />
      <DataTable
        rows={products}
        columns={columns}
        searchAccessor={(p) => `${p.sku} ${p.name} ${p.brand} ${p.barcode}`}
        searchPlaceholder="Search SKU, product, brand, barcode…"
        filters={[
          { id: "category", label: "Category", options: categories.map((c) => c.name), accessor: (p) => p.category },
          { id: "status", label: "Status", options: ["active", "seasonal", "discontinued"], accessor: (p) => p.status },
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (p) => warehouses.find((w) => w.id === p.primaryWarehouseId)?.code ?? "",
          },
        ]}
        onRowClick={(p) => goTo(p.id)}
        emptyTitle="No products found"
        pageSize={15}
      />
    </div>
  );
}
