"use client";

import { AlertTriangle, Boxes, DollarSign, Lock, PackageX, TrendingUp } from "lucide-react";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { inventory } from "@/data/inventory";
import { products } from "@/data/products";
import { warehouses } from "@/data/warehouses";
import type { InventoryItem } from "@/types/wms";

function productFor(sku: string) {
  return products.find((p) => p.sku === sku);
}

export default function InventoryOverviewPage() {
  const goTo = useRowNavigation("/inventory");

  const totalUnits = inventory.reduce((s, i) => s + i.onHand, 0);
  const totalValue = inventory.reduce((s, i) => s + i.onHand * (productFor(i.sku)?.unitCost ?? 0), 0);
  const reserved = inventory.reduce((s, i) => s + i.reserved, 0);
  const available = inventory.reduce((s, i) => s + i.available, 0);

  const columns: DataTableColumn<InventoryItem>[] = [
    { id: "sku", header: "SKU", cell: (i) => <span className="font-medium">{i.sku}</span>, sortValue: (i) => i.sku },
    { id: "product", header: "Product", cell: (i) => productFor(i.sku)?.name ?? "—" },
    { id: "category", header: "Category", cell: (i) => productFor(i.sku)?.category ?? "—" },
    { id: "warehouse", header: "Warehouse", cell: (i) => warehouses.find((w) => w.id === i.warehouseId)?.code },
    { id: "location", header: "Location", cell: (i) => i.locationCode },
    { id: "onHand", header: "On Hand", cell: (i) => i.onHand.toLocaleString("en-ZA"), sortValue: (i) => i.onHand },
    { id: "reserved", header: "Reserved", cell: (i) => i.reserved.toLocaleString("en-ZA") },
    { id: "available", header: "Available", cell: (i) => i.available.toLocaleString("en-ZA") },
    { id: "reorder", header: "Reorder Level", cell: (i) => i.reorderPoint },
    { id: "status", header: "Status", cell: (i) => <StatusBadge status={i.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory Overview"
        description="Real-time stock visibility across every warehouse and location."
        breadcrumbs={[{ label: "Inventory" }, { label: "Inventory Overview" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <KpiCard label="Total SKUs" value={products.length.toLocaleString("en-ZA")} icon={Boxes} />
        <KpiCard label="Total Units" value={totalUnits.toLocaleString("en-ZA")} icon={Boxes} />
        <KpiCard
          label="Inventory Value"
          value={`R ${Math.round(totalValue).toLocaleString("en-ZA")}`}
          icon={DollarSign}
        />
        <KpiCard label="Reserved" value={reserved.toLocaleString("en-ZA")} icon={Lock} />
        <KpiCard label="Available" value={available.toLocaleString("en-ZA")} icon={TrendingUp} />
        <KpiCard
          label="Low Stock"
          value={String(inventory.filter((i) => i.status === "low-stock").length)}
          icon={AlertTriangle}
          tone="negative"
        />
        <KpiCard
          label="Out of Stock"
          value={String(inventory.filter((i) => i.status === "out-of-stock").length)}
          icon={PackageX}
          tone="negative"
        />
      </div>
      <DataTable
        rows={inventory}
        columns={columns}
        searchAccessor={(i) => `${i.sku} ${productFor(i.sku)?.name ?? ""} ${i.locationCode}`}
        searchPlaceholder="Search SKU, product, location…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["in-stock", "low-stock", "out-of-stock", "overstock"],
            accessor: (i) => i.status,
          },
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (i) => warehouses.find((w) => w.id === i.warehouseId)?.code ?? "",
          },
        ]}
        onRowClick={(i) => goTo(productFor(i.sku)?.id ?? i.id)}
        emptyTitle="No inventory records found"
      />
    </div>
  );
}
