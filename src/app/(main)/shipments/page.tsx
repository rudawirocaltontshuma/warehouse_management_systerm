"use client";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { shipments } from "@/data/shipping";
import type { Shipment } from "@/types/wms";

export default function ShipmentsLogisticsPage() {
  const goTo = useRowNavigation("/shipments");

  const columns: DataTableColumn<Shipment>[] = [
    {
      id: "shipment",
      header: "Shipment",
      cell: (s) => <span className="font-medium">{s.shipmentNumber}</span>,
      sortValue: (s) => s.shipmentNumber,
    },
    { id: "carrier", header: "Carrier", cell: (s) => s.carrier },
    { id: "tracking", header: "Tracking Number", cell: (s) => s.trackingNumber },
    { id: "origin", header: "Origin", cell: (s) => s.origin },
    { id: "destination", header: "Destination", cell: (s) => s.destination },
    { id: "weight", header: "Weight", cell: (s) => `${s.weightKg} kg`, sortValue: (s) => s.weightKg },
    { id: "eta", header: "Expected Delivery", cell: (s) => s.expectedDelivery },
    { id: "status", header: "Status", cell: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shipments"
        description="All shipments in transit across the WMS logistics network."
        breadcrumbs={[{ label: "Logistics" }, { label: "Shipments" }]}
      />
      <DataTable
        rows={shipments}
        columns={columns}
        searchAccessor={(s) => `${s.shipmentNumber} ${s.trackingNumber} ${s.carrier}`}
        searchPlaceholder="Search shipment, tracking number, carrier…"
        filters={[
          {
            id: "carrier",
            label: "Carrier",
            options: [...new Set(shipments.map((s) => s.carrier))],
            accessor: (s) => s.carrier,
          },
          {
            id: "status",
            label: "Status",
            options: [...new Set(shipments.map((s) => s.status))],
            accessor: (s) => s.status,
          },
        ]}
        onRowClick={(s) => goTo(s.id)}
        emptyTitle="No shipments found"
      />
    </div>
  );
}
