"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { carriers } from "@/data/shipping";
import type { Carrier } from "@/types/wms";

export default function CarriersPage() {
  const columns: DataTableColumn<Carrier>[] = [
    {
      id: "name",
      header: "Carrier",
      cell: (c) => <span className="font-medium">{c.name}</span>,
      sortValue: (c) => c.name,
    },
    { id: "shipments", header: "Shipments", cell: (c) => c.shipments, sortValue: (c) => c.shipments },
    { id: "onTime", header: "On-Time Rate", cell: (c) => `${c.onTimeRate}%`, sortValue: (c) => c.onTimeRate },
    { id: "avgDelivery", header: "Average Delivery", cell: (c) => `${c.avgDeliveryDays} days` },
    { id: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} tone="success" /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Carriers"
        description="Shipping carrier partners and their delivery performance."
        breadcrumbs={[{ label: "Logistics" }, { label: "Carriers" }]}
      />
      <DataTable
        rows={carriers}
        columns={columns}
        searchAccessor={(c) => c.name}
        searchPlaceholder="Search carrier…"
        emptyTitle="No carriers found"
      />
    </div>
  );
}
