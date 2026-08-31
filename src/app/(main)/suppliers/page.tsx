"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { suppliers } from "@/data/suppliers";
import type { Supplier } from "@/types/wms";

export default function SuppliersPage() {
  const goTo = useRowNavigation("/suppliers");

  const columns: DataTableColumn<Supplier>[] = [
    {
      id: "name",
      header: "Supplier",
      cell: (s) => <span className="font-medium">{s.name}</span>,
      sortValue: (s) => s.name,
    },
    { id: "id", header: "Supplier ID", cell: (s) => s.supplierId },
    { id: "category", header: "Category", cell: (s) => s.category },
    { id: "location", header: "Location", cell: (s) => `${s.city}, ${s.province}` },
    { id: "products", header: "Products", cell: (s) => s.products },
    { id: "openOrders", header: "Open Orders", cell: (s) => s.openOrders },
    {
      id: "accuracy",
      header: "Delivery Accuracy",
      cell: (s) => `${s.deliveryAccuracy}%`,
      sortValue: (s) => s.deliveryAccuracy,
    },
    {
      id: "status",
      header: "Status",
      cell: (s) => (
        <StatusBadge
          status={s.status}
          tone={s.status === "active" ? "success" : s.status === "under-review" ? "warning" : "danger"}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Suppliers"
        description="Supplier directory across all Dimension WMS distribution centres."
        breadcrumbs={[{ label: "Suppliers" }]}
      />
      <DataTable
        rows={suppliers}
        columns={columns}
        searchAccessor={(s) => `${s.name} ${s.supplierId}`}
        searchPlaceholder="Search supplier, ID…"
        filters={[
          {
            id: "category",
            label: "Category",
            options: [...new Set(suppliers.map((s) => s.category))],
            accessor: (s) => s.category,
          },
          { id: "status", label: "Status", options: ["active", "under-review", "inactive"], accessor: (s) => s.status },
        ]}
        onRowClick={(s) => goTo(s.id)}
        emptyTitle="No suppliers found"
        pageSize={15}
      />
    </div>
  );
}
