"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { aisles, bins, zones } from "@/data/locations";
import { warehouses } from "@/data/warehouses";
import type { Bin } from "@/types/wms";

export default function BinsPage() {
  const goTo = useRowNavigation("/locations");

  const columns: DataTableColumn<Bin>[] = [
    {
      id: "code",
      header: "Location Code",
      cell: (b) => <span className="font-medium font-mono text-xs">{b.code}</span>,
      sortValue: (b) => b.code,
    },
    { id: "warehouse", header: "Warehouse", cell: (b) => warehouses.find((w) => w.id === b.warehouseId)?.code },
    { id: "zone", header: "Zone", cell: (b) => zones.find((z) => z.id === b.zoneId)?.name ?? "—" },
    { id: "aisle", header: "Aisle", cell: (b) => aisles.find((a) => a.id === b.aisleId)?.code ?? "—" },
    { id: "rack", header: "Rack", cell: (b) => b.rack },
    { id: "bin", header: "Bin", cell: (b) => b.bin },
    { id: "capacity", header: "Capacity", cell: (b) => b.capacity },
    { id: "occupied", header: "Occupied", cell: (b) => b.occupied, sortValue: (b) => b.occupied },
    { id: "utilization", header: "Utilization", cell: (b) => `${Math.round((b.occupied / b.capacity) * 100)}%` },
    { id: "status", header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bins"
        description="Bin-level storage locations across every warehouse."
        breadcrumbs={[{ label: "Warehouses" }, { label: "Bins" }]}
      />
      <DataTable
        rows={bins}
        columns={columns}
        searchAccessor={(b) => b.code}
        searchPlaceholder="Search location code…"
        filters={[
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (b) => warehouses.find((w) => w.id === b.warehouseId)?.code ?? "",
          },
          { id: "status", label: "Status", options: ["active", "restricted", "offline"], accessor: (b) => b.status },
        ]}
        onRowClick={(b) => goTo(b.id)}
        emptyTitle="No bins found"
        pageSize={20}
      />
    </div>
  );
}
