"use client";

import { CheckCircle2, ClipboardList, PlayCircle, Target, TriangleAlert } from "lucide-react";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { cycleCounts } from "@/data/cycle-counts";
import { warehouses } from "@/data/warehouses";
import type { CycleCount } from "@/types/wms";

export default function CycleCountsPage() {
  const goTo = useRowNavigation("/cycle-counts");
  const completed = cycleCounts.filter((c) => c.status === "Completed");
  const avgAccuracy = completed.length
    ? Math.round((completed.reduce((s, c) => s + c.accuracy, 0) / completed.length) * 10) / 10
    : 0;

  const columns: DataTableColumn<CycleCount>[] = [
    { id: "id", header: "Count ID", cell: (c) => <span className="font-medium">{c.id.toUpperCase()}</span> },
    { id: "warehouse", header: "Warehouse", cell: (c) => warehouses.find((w) => w.id === c.warehouseId)?.code },
    { id: "zone", header: "Zone", cell: (c) => c.zone },
    { id: "location", header: "Location", cell: (c) => c.location },
    { id: "scheduled", header: "Scheduled Date", cell: (c) => c.scheduledDate, sortValue: (c) => c.scheduledDate },
    { id: "items", header: "Items", cell: (c) => c.items },
    { id: "worker", header: "Assigned Worker", cell: (c) => c.assignedWorker },
    { id: "accuracy", header: "Accuracy", cell: (c) => (c.status === "Scheduled" ? "—" : `${c.accuracy}%`) },
    { id: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cycle Counts"
        description="Schedule, track and reconcile inventory cycle counts."
        breadcrumbs={[{ label: "Inventory" }, { label: "Cycle Counts" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          label="Scheduled"
          value={String(cycleCounts.filter((c) => c.status === "Scheduled").length)}
          icon={ClipboardList}
        />
        <KpiCard
          label="In Progress"
          value={String(cycleCounts.filter((c) => c.status === "In Progress").length)}
          icon={PlayCircle}
        />
        <KpiCard label="Completed" value={String(completed.length)} icon={CheckCircle2} />
        <KpiCard
          label="Variance"
          value={String(cycleCounts.filter((c) => c.status === "Variance Review").length)}
          icon={TriangleAlert}
          tone="negative"
        />
        <KpiCard label="Accuracy" value={`${avgAccuracy}%`} icon={Target} />
      </div>
      <DataTable
        rows={cycleCounts}
        columns={columns}
        searchAccessor={(c) => `${c.id} ${c.zone} ${c.assignedWorker}`}
        searchPlaceholder="Search count ID, zone, worker…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Scheduled", "In Progress", "Completed", "Variance Review"],
            accessor: (c) => c.status,
          },
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (c) => warehouses.find((w) => w.id === c.warehouseId)?.code ?? "",
          },
        ]}
        onRowClick={(c) => goTo(c.id)}
        emptyTitle="No cycle counts scheduled"
      />
    </div>
  );
}
