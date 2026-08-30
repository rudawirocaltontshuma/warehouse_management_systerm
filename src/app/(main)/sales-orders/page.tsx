"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { orders } from "@/data/orders";
import { warehouses } from "@/data/warehouses";
import type { Order } from "@/types/wms";

export default function SalesOrdersPage() {
  const goTo = useRowNavigation("/sales-orders");

  const columns: DataTableColumn<Order>[] = [
    {
      id: "order",
      header: "Order Number",
      cell: (o) => <span className="font-medium">{o.orderNumber}</span>,
      sortValue: (o) => o.orderNumber,
    },
    { id: "customer", header: "Customer", cell: (o) => o.customer },
    { id: "date", header: "Date", cell: (o) => o.date, sortValue: (o) => o.date },
    { id: "warehouse", header: "Warehouse", cell: (o) => warehouses.find((w) => w.id === o.warehouseId)?.code },
    { id: "items", header: "Items", cell: (o) => o.items },
    { id: "amount", header: "Amount", cell: (o) => `R ${o.value.toLocaleString("en-ZA")}`, sortValue: (o) => o.value },
    { id: "status", header: "Status", cell: (o) => <StatusBadge status={o.paymentStatus} /> },
    { id: "fulfillment", header: "Fulfillment", cell: (o) => <StatusBadge status={o.fulfillmentStatus} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sales Orders"
        description="Customer sales orders with payment and fulfillment status."
        breadcrumbs={[{ label: "Orders" }, { label: "Sales Orders" }]}
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
            options: [...new Set(orders.map((o) => o.fulfillmentStatus))],
            accessor: (o) => o.fulfillmentStatus,
          },
        ]}
        onRowClick={(o) => goTo(o.id)}
        emptyTitle="No sales orders found"
        pageSize={15}
      />
    </div>
  );
}
