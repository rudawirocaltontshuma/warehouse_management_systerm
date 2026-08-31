"use client";

import { Progress } from "@/components/ui/progress";
import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { warehouses } from "@/data/warehouses";
import type { Warehouse } from "@/types/wms";

export default function WarehousesPage() {
  const goTo = useRowNavigation("/warehouses");

  const columns: DataTableColumn<Warehouse>[] = [
    {
      id: "name",
      header: "Warehouse",
      cell: (w) => <span className="font-medium">{w.name}</span>,
      sortValue: (w) => w.name,
    },
    { id: "location", header: "Location", cell: (w) => `${w.city}, ${w.province}` },
    { id: "capacity", header: "Total Capacity", cell: (w) => w.totalCapacity.toLocaleString("en-ZA") },
    { id: "used", header: "Used Capacity", cell: (w) => w.usedCapacity.toLocaleString("en-ZA") },
    {
      id: "utilization",
      header: "Utilization",
      cell: (w) => (
        <div className="flex items-center gap-2">
          <Progress value={(w.usedCapacity / w.totalCapacity) * 100} className="w-20" />
          <span className="text-xs">{Math.round((w.usedCapacity / w.totalCapacity) * 100)}%</span>
        </div>
      ),
      sortValue: (w) => w.usedCapacity / w.totalCapacity,
    },
    { id: "skus", header: "SKUs", cell: (w) => w.skuCount.toLocaleString("en-ZA") },
    { id: "units", header: "Units", cell: (w) => w.unitCount.toLocaleString("en-ZA") },
    { id: "value", header: "Inventory Value", cell: (w) => `R ${w.inventoryValue.toLocaleString("en-ZA")}` },
    { id: "inbound", header: "Inbound", cell: (w) => w.inbound },
    { id: "outbound", header: "Outbound", cell: (w) => w.outbound },
    { id: "status", header: "Status", cell: (w) => <StatusBadge status={w.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Warehouses"
        description="All Dimension WMS distribution centres and their operational status."
        breadcrumbs={[{ label: "Warehouses" }]}
      />
      <DataTable
        rows={warehouses}
        columns={columns}
        searchAccessor={(w) => `${w.name} ${w.city}`}
        searchPlaceholder="Search warehouse, city…"
        onRowClick={(w) => goTo(w.id)}
        emptyTitle="No warehouses found"
      />
    </div>
  );
}
