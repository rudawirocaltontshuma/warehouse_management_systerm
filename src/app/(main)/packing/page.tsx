"use client";

import { AlertTriangle, Boxes, PackageCheck, PackagePlus } from "lucide-react";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { packTasks } from "@/data/packing";
import type { PackTask } from "@/types/wms";

export default function PackingPage() {
  const goTo = useRowNavigation("/packing");

  const columns: DataTableColumn<PackTask>[] = [
    {
      id: "id",
      header: "Packing ID",
      cell: (t) => <span className="font-medium">{t.packingId}</span>,
      sortValue: (t) => t.packingId,
    },
    { id: "order", header: "Order", cell: (t) => t.orderNumber },
    { id: "items", header: "Items", cell: (t) => t.items },
    { id: "package", header: "Package", cell: (t) => t.packageType },
    { id: "weight", header: "Weight", cell: (t) => `${t.weightKg} kg`, sortValue: (t) => t.weightKg },
    { id: "station", header: "Station", cell: (t) => t.station },
    { id: "worker", header: "Worker", cell: (t) => t.worker },
    { id: "status", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Packing"
        description="Prepare picked orders for dispatch and shipment."
        breadcrumbs={[{ label: "Warehouse Operations" }, { label: "Packing" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Orders Ready"
          value={String(packTasks.filter((t) => t.status === "Ready").length)}
          icon={PackagePlus}
        />
        <KpiCard label="Packing" value={String(packTasks.filter((t) => t.status === "Packing").length)} icon={Boxes} />
        <KpiCard
          label="Packed Today"
          value={String(packTasks.filter((t) => t.status === "Packed").length)}
          icon={PackageCheck}
        />
        <KpiCard
          label="Exceptions"
          value={String(packTasks.filter((t) => t.status === "Exception").length)}
          icon={AlertTriangle}
          tone="negative"
        />
      </div>
      <DataTable
        rows={packTasks}
        columns={columns}
        searchAccessor={(t) => `${t.packingId} ${t.orderNumber} ${t.worker}`}
        searchPlaceholder="Search packing ID, order, worker…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Ready", "Packing", "Packed", "Exception"],
            accessor: (t) => t.status,
          },
        ]}
        onRowClick={(t) => goTo(t.id)}
        emptyTitle="No packing tasks found"
      />
    </div>
  );
}
