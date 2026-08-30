"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { backorders } from "@/data/orders";
import type { Backorder } from "@/types/wms";

export default function BackordersPage() {
  const columns: DataTableColumn<Backorder>[] = [
    { id: "order", header: "Order", cell: (b) => <span className="font-medium">{b.orderNumber}</span> },
    { id: "customer", header: "Customer", cell: (b) => b.customer },
    { id: "sku", header: "SKU", cell: (b) => b.sku },
    { id: "product", header: "Product", cell: (b) => b.productName },
    { id: "requested", header: "Requested Quantity", cell: (b) => b.requestedQuantity },
    { id: "available", header: "Available", cell: (b) => b.available },
    { id: "backordered", header: "Backordered", cell: (b) => b.backordered, sortValue: (b) => b.backordered },
    { id: "expected", header: "Expected Date", cell: (b) => b.expectedDate, sortValue: (b) => b.expectedDate },
    {
      id: "priority",
      header: "Priority",
      cell: (b) => (
        <StatusBadge
          status={b.priority}
          tone={b.priority === "Urgent" ? "danger" : b.priority === "High" ? "warning" : "neutral"}
        />
      ),
    },
    { id: "status", header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Backorders"
        description="Orders awaiting supplier replenishment before they can be fulfilled."
        breadcrumbs={[{ label: "Orders" }, { label: "Backorders" }]}
      />
      <DataTable
        rows={backorders}
        columns={columns}
        searchAccessor={(b) => `${b.orderNumber} ${b.customer} ${b.sku} ${b.productName}`}
        searchPlaceholder="Search order, customer, SKU…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Waiting on Supplier", "Partial Allocation", "Ready to Fulfill"],
            accessor: (b) => b.status,
          },
        ]}
        emptyTitle="No backorders found"
      />
    </div>
  );
}
