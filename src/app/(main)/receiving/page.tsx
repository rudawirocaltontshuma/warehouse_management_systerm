"use client";

import { AlertTriangle, PackageCheck, PackageOpen, Timer, TruckIcon } from "lucide-react";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { receipts } from "@/data/receiving";
import { suppliers } from "@/data/suppliers";
import { warehouses } from "@/data/warehouses";
import type { Receipt } from "@/types/wms";

function supplierName(id: string) {
  return suppliers.find((s) => s.id === id)?.name ?? "Unknown Supplier";
}
function warehouseName(id: string) {
  return warehouses.find((w) => w.id === id)?.name ?? id;
}

export default function ReceivingPage() {
  const goTo = useRowNavigation("/receiving");

  const kpis = {
    expected: receipts.filter((r) => r.status === "Expected").length,
    arrived: receipts.filter((r) => r.status === "Arrived").length,
    waiting: receipts.filter((r) => r.status === "Receiving").length,
    received: receipts.filter((r) => r.status === "Completed").length,
    exceptions: receipts.filter((r) => r.status === "Exception").length,
  };

  const columns: DataTableColumn<Receipt>[] = [
    {
      id: "receiptNumber",
      header: "Receipt Number",
      cell: (r) => <span className="font-medium">{r.receiptNumber}</span>,
      sortValue: (r) => r.receiptNumber,
    },
    { id: "poNumber", header: "Purchase Order", cell: (r) => r.poNumber },
    { id: "supplier", header: "Supplier", cell: (r) => supplierName(r.supplierId) },
    { id: "expected", header: "Expected Date", cell: (r) => r.expectedDate, sortValue: (r) => r.expectedDate },
    { id: "arrival", header: "Arrival", cell: (r) => r.actualArrival ?? "—" },
    { id: "items", header: "Items", cell: (r) => r.items },
    { id: "quantity", header: "Quantity", cell: (r) => r.expectedQuantity.toLocaleString("en-ZA") },
    { id: "warehouse", header: "Warehouse", cell: (r) => warehouseName(r.warehouseId) },
    { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Receiving"
        description="Track inbound shipments from expected arrival through completed receipt."
        breadcrumbs={[{ label: "Warehouse Operations" }, { label: "Receiving" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Expected Today" value={String(kpis.expected)} icon={Timer} />
        <KpiCard label="Arrived" value={String(kpis.arrived)} icon={TruckIcon} />
        <KpiCard label="Waiting" value={String(kpis.waiting)} icon={PackageOpen} />
        <KpiCard label="Received" value={String(kpis.received)} icon={PackageCheck} />
        <KpiCard label="Exceptions" value={String(kpis.exceptions)} icon={AlertTriangle} tone="negative" />
      </div>
      <DataTable
        rows={receipts}
        columns={columns}
        searchAccessor={(r) => `${r.receiptNumber} ${r.poNumber} ${supplierName(r.supplierId)}`}
        searchPlaceholder="Search receipts, PO number, supplier…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Expected", "Arrived", "Receiving", "Completed", "Exception"],
            accessor: (r) => r.status,
          },
          {
            id: "warehouse",
            label: "Warehouse",
            options: warehouses.map((w) => w.code),
            accessor: (r) => warehouses.find((w) => w.id === r.warehouseId)?.code ?? "",
          },
        ]}
        onRowClick={(r) => goTo(r.id)}
        emptyTitle="No receiving records found"
        emptyDescription="Try adjusting your filters to find a receipt."
      />
    </div>
  );
}
