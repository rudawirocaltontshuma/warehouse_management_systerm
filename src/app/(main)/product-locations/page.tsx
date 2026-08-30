"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { productLocations, products } from "@/data/products";
import { warehouses } from "@/data/warehouses";
import type { ProductLocation } from "@/types/wms";

export default function ProductLocationsPage() {
  const columns: DataTableColumn<ProductLocation>[] = [
    { id: "sku", header: "SKU", cell: (l) => <span className="font-medium">{l.sku}</span>, sortValue: (l) => l.sku },
    { id: "product", header: "Product", cell: (l) => products.find((p) => p.sku === l.sku)?.name ?? "—" },
    { id: "warehouse", header: "Warehouse", cell: (l) => warehouses.find((w) => w.id === l.warehouseId)?.code },
    { id: "aisle", header: "Aisle", cell: (l) => l.aisleCode },
    { id: "rack", header: "Rack", cell: (l) => l.rack },
    { id: "bin", header: "Bin", cell: (l) => l.bin },
    { id: "quantity", header: "Quantity", cell: (l) => l.quantity, sortValue: (l) => l.quantity },
    { id: "capacity", header: "Capacity", cell: (l) => l.capacity },
    {
      id: "status",
      header: "Status",
      cell: (l) => (
        <StatusBadge status={l.quantity >= l.capacity ? "overstock" : l.quantity === 0 ? "out-of-stock" : "in-stock"} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Product Locations"
        description="Where every SKU is physically stored across the warehouse network."
        breadcrumbs={[{ label: "Products" }, { label: "Product Locations" }]}
      />
      <DataTable
        rows={productLocations}
        columns={columns}
        searchAccessor={(l) => `${l.sku} ${l.aisleCode}`}
        searchPlaceholder="Search SKU, aisle…"
        filters={[
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (l) => warehouses.find((w) => w.id === l.warehouseId)?.code ?? "",
          },
        ]}
        emptyTitle="No product locations found"
        pageSize={15}
      />
    </div>
  );
}
