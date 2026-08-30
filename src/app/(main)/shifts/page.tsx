"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { warehouses } from "@/data/warehouses";
import { shifts } from "@/data/workers";
import type { Shift } from "@/types/wms";

export default function ShiftsPage() {
  const columns: DataTableColumn<Shift>[] = [
    { id: "name", header: "Shift", cell: (s) => <span className="font-medium">{s.name}</span> },
    { id: "start", header: "Start", cell: (s) => s.start },
    { id: "end", header: "End", cell: (s) => s.end },
    { id: "workers", header: "Workers", cell: (s) => s.workers, sortValue: (s) => s.workers },
    { id: "warehouse", header: "Warehouse", cell: (s) => warehouses.find((w) => w.id === s.warehouseId)?.name },
    {
      id: "status",
      header: "Status",
      cell: (s) => (
        <StatusBadge status={s.status === "active" ? "Active" : s.status === "upcoming" ? "Scheduled" : "Off Shift"} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shifts"
        description="Shift schedules and staffing levels by warehouse."
        breadcrumbs={[{ label: "Workforce" }, { label: "Shifts" }]}
      />
      <DataTable
        rows={shifts}
        columns={columns}
        searchAccessor={(s) => `${s.name} ${warehouses.find((w) => w.id === s.warehouseId)?.name}`}
        searchPlaceholder="Search shift, warehouse…"
        filters={[
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (s) => warehouses.find((w) => w.id === s.warehouseId)?.code ?? "",
          },
        ]}
        emptyTitle="No shifts found"
      />
    </div>
  );
}
