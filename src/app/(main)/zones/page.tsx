"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { zones } from "@/data/locations";
import { warehouses } from "@/data/warehouses";
import type { Zone } from "@/types/wms";

export default function ZonesPage() {
  const columns: DataTableColumn<Zone>[] = [
    {
      id: "name",
      header: "Zone",
      cell: (z) => <span className="font-medium">{z.name}</span>,
      sortValue: (z) => z.name,
    },
    { id: "warehouse", header: "Warehouse", cell: (z) => warehouses.find((w) => w.id === z.warehouseId)?.name },
    { id: "capacity", header: "Capacity", cell: (z) => z.capacity.toLocaleString("en-ZA") },
    {
      id: "utilization",
      header: "Utilization",
      cell: (z) => `${Math.round((z.used / z.capacity) * 100)}%`,
      sortValue: (z) => z.used / z.capacity,
    },
    { id: "skus", header: "SKUs", cell: (z) => z.skuCount },
    { id: "units", header: "Units", cell: (z) => z.unitCount.toLocaleString("en-ZA") },
    { id: "status", header: "Status", cell: (z) => <StatusBadge status={z.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Zones"
        description="Functional zones within each warehouse — receiving, storage, picking, packing and dispatch."
        breadcrumbs={[{ label: "Warehouses" }, { label: "Zones" }]}
      />
      <DataTable
        rows={zones}
        columns={columns}
        searchAccessor={(z) => z.name}
        searchPlaceholder="Search zone…"
        filters={[
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (z) => warehouses.find((w) => w.id === z.warehouseId)?.code ?? "",
          },
          {
            id: "purpose",
            label: "Purpose",
            options: ["Receiving", "Bulk Storage", "Picking", "Packing", "Dispatch", "Returns"],
            accessor: (z) => z.purpose,
          },
        ]}
        emptyTitle="No zones found"
        pageSize={15}
      />
    </div>
  );
}
