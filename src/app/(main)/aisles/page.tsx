"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { aisles, zones } from "@/data/locations";
import { warehouses } from "@/data/warehouses";
import type { Aisle } from "@/types/wms";

export default function AislesPage() {
  const columns: DataTableColumn<Aisle>[] = [
    {
      id: "code",
      header: "Aisle",
      cell: (a) => <span className="font-medium">{a.code}</span>,
      sortValue: (a) => a.code,
    },
    { id: "zone", header: "Zone", cell: (a) => zones.find((z) => z.id === a.zoneId)?.name ?? "—" },
    { id: "locations", header: "Locations", cell: (a) => a.locationCount },
    { id: "capacity", header: "Capacity", cell: (a) => a.capacity.toLocaleString("en-ZA") },
    {
      id: "utilization",
      header: "Utilization",
      cell: (a) => `${Math.round((a.used / a.capacity) * 100)}%`,
      sortValue: (a) => a.used / a.capacity,
    },
    { id: "status", header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Aisles"
        description="Aisle-level capacity and utilization within each zone."
        breadcrumbs={[{ label: "Warehouses" }, { label: "Aisles" }]}
      />
      <DataTable
        rows={aisles}
        columns={columns}
        searchAccessor={(a) => a.code}
        searchPlaceholder="Search aisle…"
        filters={[
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (a) => warehouses.find((w) => w.id === a.warehouseId)?.code ?? "",
          },
        ]}
        emptyTitle="No aisles found"
        pageSize={15}
      />
    </div>
  );
}
