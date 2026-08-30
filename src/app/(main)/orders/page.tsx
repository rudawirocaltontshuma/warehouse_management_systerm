"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { orders } from "@/data/orders";
import { warehouses } from "@/data/warehouses";
import type { Order } from "@/types/wms";

export default function OrdersPage() {
  const goTo = useRowNavigation("/orders");

  const columns: DataTableColumn<Order>[] = [
    {
      id: "order",
      header: "Order",
      cell: (o) => <span className="font-medium">{o.orderNumber}</span>,
      sortValue: (o) => o.orderNumber,
    },
    { id: "customer", header: "Customer", cell: (o) => o.customer },
    { id: "date", header: "Date", cell: (o) => o.date, sortValue: (o) => o.date },
    { id: "items", header: "Items", cell: (o) => o.items },
    { id: "quantity", header: "Quantity", cell: (o) => o.quantity },
    { id: "value", header: "Value", cell: (o) => `R ${o.value.toLocaleString("en-ZA")}`, sortValue: (o) => o.value },
    {
      id: "priority",
      header: "Priority",
      cell: (o) => (
        <StatusBadge
          status={o.priority}
          tone={o.priority === "Urgent" ? "danger" : o.priority === "High" ? "warning" : "neutral"}
        />
      ),
    },
    { id: "warehouse", header: "Warehouse", cell: (o) => warehouses.find((w) => w.id === o.warehouseId)?.code },
    { id: "fulfillment", header: "Fulfillment Status", cell: (o) => <StatusBadge status={o.fulfillmentStatus} /> },
    { id: "payment", header: "Payment Status", cell: (o) => <StatusBadge status={o.paymentStatus} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description="All customer orders across every warehouse and fulfillment stage."
        breadcrumbs={[{ label: "Orders" }]}
      />
      <DataTable
        rows={orders}
        columns={columns}
        searchAccessor={(o) => `${o.orderNumber} ${o.customer}`}
        searchPlaceholder="Search order number, customer…"
        filters={[
          {
            id: "fulfillment",
            label: "Fulfillment",
            options: ["Pending", "Allocated", "Picking", "Packing", "Shipped", "Completed", "Cancelled"],
            accessor: (o) => o.fulfillmentStatus,
          },
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (o) => warehouses.find((w) => w.id === o.warehouseId)?.code ?? "",
          },
          {
            id: "priority",
            label: "Priority",
            options: ["Low", "Medium", "High", "Urgent"],
            accessor: (o) => o.priority,
          },
        ]}
        onRowClick={(o) => goTo(o.id)}
        emptyTitle="No orders found"
        pageSize={15}
      />
    </div>
  );
}
