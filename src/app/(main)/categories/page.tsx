"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { categories } from "@/data/products";
import type { Category } from "@/types/wms";

export default function CategoriesPage() {
  const columns: DataTableColumn<Category>[] = [
    {
      id: "name",
      header: "Category",
      cell: (c) => <span className="font-medium">{c.name}</span>,
      sortValue: (c) => c.name,
    },
    { id: "products", header: "Products", cell: (c) => c.productCount, sortValue: (c) => c.productCount },
    { id: "units", header: "Units", cell: (c) => c.unitCount.toLocaleString("en-ZA"), sortValue: (c) => c.unitCount },
    {
      id: "value",
      header: "Inventory Value",
      cell: (c) => `R ${c.inventoryValue.toLocaleString("en-ZA")}`,
      sortValue: (c) => c.inventoryValue,
    },
    { id: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} tone="success" /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Categories"
        description="Product categories and their inventory footprint."
        breadcrumbs={[{ label: "Products" }, { label: "Categories" }]}
      />
      <DataTable
        rows={categories}
        columns={columns}
        searchAccessor={(c) => c.name}
        searchPlaceholder="Search category…"
        emptyTitle="No categories found"
      />
    </div>
  );
}
