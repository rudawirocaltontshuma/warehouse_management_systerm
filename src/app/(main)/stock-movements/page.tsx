"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { stockMovements } from "@/data/stock-movements";
import { warehouses } from "@/data/warehouses";
import type { StockMovement } from "@/types/wms";

export default function StockMovementsPage() {
  const columns: DataTableColumn<StockMovement>[] = [
    { id: "id", header: "Movement ID", cell: (m) => <span className="font-medium">{m.id.toUpperCase()}</span> },
    { id: "date", header: "Date", cell: (m) => m.date, sortValue: (m) => m.date },
    { id: "sku", header: "SKU", cell: (m) => m.sku },
    { id: "product", header: "Product", cell: (m) => m.productName },
    { id: "warehouse", header: "Warehouse", cell: (m) => warehouses.find((w) => w.id === m.warehouseId)?.code },
    { id: "location", header: "Location", cell: (m) => m.locationCode },
    {
      id: "quantity",
      header: "Quantity",
      cell: (m) => (m.quantity > 0 ? `+${m.quantity}` : m.quantity),
      sortValue: (m) => m.quantity,
    },
    { id: "type", header: "Movement Type", cell: (m) => <Badge variant="outline">{m.type}</Badge> },
    { id: "reference", header: "Reference", cell: (m) => m.reference },
    { id: "user", header: "User", cell: (m) => m.user },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Stock Movements"
        description="A read-only ledger of every inventory movement across the network."
        breadcrumbs={[{ label: "Inventory" }, { label: "Stock Movements" }]}
      />
      <DataTable
        rows={stockMovements}
        columns={columns}
        searchAccessor={(m) => `${m.sku} ${m.productName} ${m.reference} ${m.user}`}
        searchPlaceholder="Search SKU, product, reference, user…"
        filters={[
          {
            id: "type",
            label: "Type",
            options: ["Receipt", "Putaway", "Pick", "Transfer", "Adjustment", "Return"],
            accessor: (m) => m.type,
          },
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (m) => warehouses.find((w) => w.id === m.warehouseId)?.code ?? "",
          },
        ]}
        emptyTitle="No stock movements found"
        pageSize={15}
      />
    </div>
  );
}
