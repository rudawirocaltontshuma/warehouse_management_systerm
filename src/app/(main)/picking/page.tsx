"use client";

import { Clock, ListChecks, PackageSearch, Timer, TrendingUp } from "lucide-react";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { pickTasks } from "@/data/picking";
import { warehouses } from "@/data/warehouses";
import type { PickTask } from "@/types/wms";

export default function PickingPage() {
  const goTo = useRowNavigation("/picking");

  const itemsToPick = pickTasks.reduce((sum, t) => sum + t.lines.reduce((s, l) => s + (l.quantity - l.picked), 0), 0);
  const pickedToday = pickTasks.filter((t) => t.status === "Completed").reduce((sum, t) => sum + t.items, 0);

  const columns: DataTableColumn<PickTask>[] = [
    {
      id: "pickList",
      header: "Pick List",
      cell: (t) => <span className="font-medium">{t.pickListId}</span>,
      sortValue: (t) => t.pickListId,
    },
    { id: "order", header: "Order", cell: (t) => t.orderNumber },
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
    { id: "items", header: "Items", cell: (t) => t.items },
    { id: "warehouse", header: "Warehouse", cell: (t) => warehouses.find((w) => w.id === t.warehouseId)?.code },
    { id: "zone", header: "Zone", cell: (t) => t.zone },
    { id: "worker", header: "Worker", cell: (t) => t.worker },
    { id: "created", header: "Created", cell: (t) => t.created, sortValue: (t) => t.created },
    { id: "status", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Picking"
        description="Manage pick lists from order allocation through completed picks."
        breadcrumbs={[{ label: "Warehouse Operations" }, { label: "Picking" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          label="Orders to Pick"
          value={String(pickTasks.filter((t) => t.status !== "Completed").length)}
          icon={ListChecks}
        />
        <KpiCard label="Items to Pick" value={itemsToPick.toLocaleString("en-ZA")} icon={PackageSearch} />
        <KpiCard label="Picked Today" value={pickedToday.toLocaleString("en-ZA")} icon={TrendingUp} />
        <KpiCard label="Pending" value={String(pickTasks.filter((t) => t.status === "Queued").length)} icon={Clock} />
        <KpiCard label="Avg Pick Time" value="48s" icon={Timer} />
      </div>
      <DataTable
        rows={pickTasks}
        columns={columns}
        searchAccessor={(t) => `${t.pickListId} ${t.orderNumber} ${t.customer} ${t.worker}`}
        searchPlaceholder="Search pick list, order, worker…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Queued", "Assigned", "In Progress", "Completed", "Exception"],
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
        onRowClick={(t) => goTo(t.id)}
        emptyTitle="No pick lists found"
      />
    </div>
  );
}
