"use client";

import { CheckCircle2, ClipboardList, Search, XCircle } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { returns } from "@/data/returns";
import type { ReturnRequest } from "@/types/wms";

export default function ReturnsPage() {
  const columns: DataTableColumn<ReturnRequest>[] = [
    {
      id: "id",
      header: "Return ID",
      cell: (r) => <span className="font-medium">{r.returnNumber}</span>,
      sortValue: (r) => r.returnNumber,
    },
    { id: "order", header: "Order", cell: (r) => r.orderNumber },
    { id: "customer", header: "Customer", cell: (r) => r.customer },
    { id: "reason", header: "Reason", cell: (r) => r.reason },
    { id: "items", header: "Items", cell: (r) => r.items },
    { id: "date", header: "Date", cell: (r) => r.date, sortValue: (r) => r.date },
    { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Returns"
        description="Review and process customer return requests."
        breadcrumbs={[{ label: "Warehouse Operations" }, { label: "Returns" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Return Requests" value={String(returns.length)} icon={ClipboardList} />
        <KpiCard
          label="Awaiting Inspection"
          value={String(returns.filter((r) => r.status === "Awaiting Inspection").length)}
          icon={Search}
        />
        <KpiCard
          label="Approved"
          value={String(returns.filter((r) => r.status === "Approved").length)}
          icon={CheckCircle2}
        />
        <KpiCard
          label="Rejected"
          value={String(returns.filter((r) => r.status === "Rejected").length)}
          icon={XCircle}
          tone="negative"
        />
      </div>
      <DataTable
        rows={returns}
        columns={columns}
        searchAccessor={(r) => `${r.returnNumber} ${r.orderNumber} ${r.customer}`}
        searchPlaceholder="Search return ID, order, customer…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Awaiting Inspection", "Approved", "Rejected", "Completed"],
            accessor: (r) => r.status,
          },
          {
            id: "reason",
            label: "Reason",
            options: ["Damaged", "Wrong Item", "Defective", "Customer Return", "Other"],
            accessor: (r) => r.reason,
          },
        ]}
        emptyTitle="No returns found"
      />
    </div>
  );
}
