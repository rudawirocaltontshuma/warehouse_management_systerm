"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { purchaseOrders } from "@/data/orders";
import { suppliers } from "@/data/suppliers";
import { warehouses } from "@/data/warehouses";
import type { PurchaseOrder } from "@/types/wms";

export default function PurchaseOrdersPage() {
  const goTo = useRowNavigation("/purchase-orders");

  const columns: DataTableColumn<PurchaseOrder>[] = [
    {
      id: "po",
      header: "PO Number",
      cell: (po) => <span className="font-medium">{po.poNumber}</span>,
      sortValue: (po) => po.poNumber,
    },
    { id: "supplier", header: "Supplier", cell: (po) => suppliers.find((s) => s.id === po.supplierId)?.name ?? "—" },
    { id: "warehouse", header: "Warehouse", cell: (po) => warehouses.find((w) => w.id === po.warehouseId)?.code },
    { id: "orderDate", header: "Order Date", cell: (po) => po.orderDate, sortValue: (po) => po.orderDate },
    { id: "expected", header: "Expected Date", cell: (po) => po.expectedDate },
    { id: "items", header: "Items", cell: (po) => po.items },
    {
      id: "amount",
      header: "Amount",
      cell: (po) => `R ${po.amount.toLocaleString("en-ZA")}`,
      sortValue: (po) => po.amount,
    },
    { id: "status", header: "Status", cell: (po) => <StatusBadge status={po.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Purchase Orders"
        description="Track supplier purchase orders from submission through receipt."
        breadcrumbs={[{ label: "Orders" }, { label: "Purchase Orders" }]}
      />
      <DataTable
        rows={purchaseOrders}
        columns={columns}
        searchAccessor={(po) => `${po.poNumber} ${suppliers.find((s) => s.id === po.supplierId)?.name ?? ""}`}
        searchPlaceholder="Search PO number, supplier…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Draft", "Submitted", "Approved", "Partially Received", "Received", "Cancelled"],
            accessor: (po) => po.status,
          },
        ]}
        onRowClick={(po) => goTo(po.id)}
        emptyTitle="No purchase orders found"
        pageSize={15}
      />
    </div>
  );
}
