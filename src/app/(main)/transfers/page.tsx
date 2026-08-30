"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { transfers } from "@/data/transfers";
import { warehouses } from "@/data/warehouses";
import type { Transfer } from "@/types/wms";

export default function TransfersPage() {
  const goTo = useRowNavigation("/transfers");

  const columns: DataTableColumn<Transfer>[] = [
    { id: "id", header: "Transfer ID", cell: (t) => <span className="font-medium">{t.id.toUpperCase()}</span> },
    {
      id: "source",
      header: "Source Warehouse",
      cell: (t) => warehouses.find((w) => w.id === t.sourceWarehouseId)?.name,
    },
    {
      id: "destination",
      header: "Destination Warehouse",
      cell: (t) => warehouses.find((w) => w.id === t.destinationWarehouseId)?.name,
    },
    { id: "items", header: "Items", cell: (t) => t.items },
    {
      id: "quantity",
      header: "Quantity",
      cell: (t) => t.quantity.toLocaleString("en-ZA"),
      sortValue: (t) => t.quantity,
    },
    { id: "requestedBy", header: "Requested By", cell: (t) => t.requestedBy },
    { id: "date", header: "Date", cell: (t) => t.date, sortValue: (t) => t.date },
    { id: "status", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory Transfers"
        description="Move inventory between distribution centres."
        breadcrumbs={[{ label: "Inventory" }, { label: "Transfers" }]}
      />
      <DataTable
        rows={transfers}
        columns={columns}
        searchAccessor={(t) => `${t.id} ${t.requestedBy}`}
        searchPlaceholder="Search transfer ID, requester…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Draft", "Requested", "Approved", "In Transit", "Completed", "Cancelled"],
            accessor: (t) => t.status,
          },
        ]}
        onRowClick={(t) => goTo(t.id)}
        emptyTitle="No transfers found"
      />
    </div>
  );
}
