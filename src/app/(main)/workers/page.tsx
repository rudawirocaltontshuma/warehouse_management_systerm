"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { warehouses } from "@/data/warehouses";
import { workers } from "@/data/workers";
import type { Worker } from "@/types/wms";

export default function WorkersPage() {
  const goTo = useRowNavigation("/workers");

  const columns: DataTableColumn<Worker>[] = [
    { id: "workerId", header: "Worker ID", cell: (w) => w.workerId, sortValue: (w) => w.workerId },
    {
      id: "name",
      header: "Name",
      cell: (w) => <span className="font-medium">{w.name}</span>,
      sortValue: (w) => w.name,
    },
    { id: "department", header: "Department", cell: (w) => w.department },
    { id: "role", header: "Role", cell: (w) => w.role },
    { id: "warehouse", header: "Warehouse", cell: (w) => warehouses.find((x) => x.id === w.warehouseId)?.code },
    { id: "shift", header: "Shift", cell: (w) => w.shift },
    { id: "tasks", header: "Tasks", cell: (w) => w.tasksCompleted, sortValue: (w) => w.tasksCompleted },
    { id: "productivity", header: "Productivity", cell: (w) => `${w.productivity}%`, sortValue: (w) => w.productivity },
    { id: "status", header: "Status", cell: (w) => <StatusBadge status={w.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Workers"
        description="Warehouse workforce across every department and shift."
        breadcrumbs={[{ label: "Workforce" }, { label: "Workers" }]}
      />
      <DataTable
        rows={workers}
        columns={columns}
        searchAccessor={(w) => `${w.name} ${w.workerId} ${w.role}`}
        searchPlaceholder="Search worker, ID, role…"
        filters={[
          {
            id: "department",
            label: "Department",
            options: [...new Set(workers.map((w) => w.department))],
            accessor: (w) => w.department,
          },
          {
            id: "status",
            label: "Status",
            options: ["Active", "On Break", "Off Shift", "Inactive"],
            accessor: (w) => w.status,
          },
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (w) => warehouses.find((x) => x.id === w.warehouseId)?.code ?? "",
          },
        ]}
        onRowClick={(w) => goTo(w.id)}
        emptyTitle="No workers found"
        pageSize={15}
      />
    </div>
  );
}
