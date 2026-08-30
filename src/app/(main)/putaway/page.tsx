"use client";

import { AlertTriangle, CheckCircle2, ClipboardList, PlayCircle, UserCheck } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { putawayTasks } from "@/data/putaway";
import { warehouses } from "@/data/warehouses";
import type { PutawayTask } from "@/types/wms";

export default function PutawayPage() {
  const kpis = {
    pending: putawayTasks.filter((t) => t.status === "Pending").length,
    assigned: putawayTasks.filter((t) => t.status === "Assigned").length,
    inProgress: putawayTasks.filter((t) => t.status === "In Progress").length,
    completed: putawayTasks.filter((t) => t.status === "Completed").length,
    exceptions: putawayTasks.filter((t) => t.status === "Exception").length,
  };

  const columns: DataTableColumn<PutawayTask>[] = [
    {
      id: "task",
      header: "Task",
      cell: (t) => <span className="font-medium">{t.taskNumber}</span>,
      sortValue: (t) => t.taskNumber,
    },
    { id: "product", header: "Product", cell: (t) => t.productName },
    { id: "sku", header: "SKU", cell: (t) => t.sku },
    { id: "quantity", header: "Quantity", cell: (t) => t.quantity },
    { id: "from", header: "From", cell: (t) => t.from },
    { id: "to", header: "To", cell: (t) => t.to },
    {
      id: "priority",
      header: "Priority",
      cell: (t) => (
        <StatusBadge
          status={t.priority}
          tone={t.priority === "Urgent" ? "danger" : t.priority === "High" ? "warning" : "neutral"}
        />
      ),
    },
    { id: "worker", header: "Assigned Worker", cell: (t) => t.assignedWorker },
    { id: "status", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Putaway"
        description="Move received inventory from the dock into its storage location."
        breadcrumbs={[{ label: "Warehouse Operations" }, { label: "Putaway" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Pending Putaway" value={String(kpis.pending)} icon={ClipboardList} />
        <KpiCard label="Assigned" value={String(kpis.assigned)} icon={UserCheck} />
        <KpiCard label="In Progress" value={String(kpis.inProgress)} icon={PlayCircle} />
        <KpiCard label="Completed" value={String(kpis.completed)} icon={CheckCircle2} />
        <KpiCard label="Exceptions" value={String(kpis.exceptions)} icon={AlertTriangle} tone="negative" />
      </div>
      <DataTable
        rows={putawayTasks}
        columns={columns}
        searchAccessor={(t) => `${t.taskNumber} ${t.sku} ${t.productName} ${t.assignedWorker}`}
        searchPlaceholder="Search task, SKU, product, worker…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Pending", "Assigned", "In Progress", "Completed", "Exception"],
            accessor: (t) => t.status,
          },
          {
            id: "priority",
            label: "Priority",
            options: ["Low", "Medium", "High", "Urgent"],
            accessor: (t) => t.priority,
          },
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (t) => warehouses.find((w) => w.id === t.warehouseId)?.code ?? "",
          },
        ]}
        emptyTitle="No putaway tasks found"
      />
    </div>
  );
}
