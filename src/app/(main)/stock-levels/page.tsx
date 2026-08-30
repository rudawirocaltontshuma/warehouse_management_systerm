"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { inventory } from "@/data/inventory";
import { products } from "@/data/products";
import { warehouses } from "@/data/warehouses";
import type { InventoryItem } from "@/types/wms";

function productFor(sku: string) {
  return products.find((p) => p.sku === sku);
}

export default function StockLevelsPage() {
  const columns: DataTableColumn<InventoryItem>[] = [
    { id: "sku", header: "SKU", cell: (i) => <span className="font-medium">{i.sku}</span>, sortValue: (i) => i.sku },
    { id: "product", header: "Product", cell: (i) => productFor(i.sku)?.name ?? "—" },
    { id: "warehouse", header: "Warehouse", cell: (i) => warehouses.find((w) => w.id === i.warehouseId)?.code },
    { id: "location", header: "Location", cell: (i) => i.locationCode },
    { id: "onHand", header: "On Hand", cell: (i) => i.onHand, sortValue: (i) => i.onHand },
    { id: "reserved", header: "Reserved", cell: (i) => i.reserved },
    { id: "available", header: "Available", cell: (i) => i.available, sortValue: (i) => i.available },
    { id: "reorderPoint", header: "Reorder Point", cell: (i) => i.reorderPoint },
    { id: "max", header: "Maximum", cell: (i) => i.maximum },
    { id: "status", header: "Status", cell: (i) => <StatusBadge status={i.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Stock Levels"
        description="Search, filter and sort stock levels across every location."
        breadcrumbs={[{ label: "Inventory" }, { label: "Stock Levels" }]}
      />
      <DataTable
        rows={inventory}
        columns={columns}
        searchAccessor={(i) => `${i.sku} ${productFor(i.sku)?.name ?? ""} ${i.locationCode}`}
        searchPlaceholder="Search SKU, product, location…"
        filters={[
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (i) => warehouses.find((w) => w.id === i.warehouseId)?.code ?? "",
          },
          {
            id: "category",
            label: "Category",
            options: [...new Set(products.map((p) => p.category))],
            accessor: (i) => productFor(i.sku)?.category ?? "",
          },
          {
            id: "status",
            label: "Status",
            options: ["in-stock", "low-stock", "out-of-stock", "overstock"],
            accessor: (i) => i.status,
          },
        ]}
        emptyTitle="No stock records found"
        pageSize={15}
      />
    </div>
  );
}
