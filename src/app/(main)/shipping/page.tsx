"use client";

import { AlertTriangle, CheckCircle2, PackageCheck, Truck } from "lucide-react";

import { DataTable, type DataTableColumn, useRowNavigation } from "@/components/wms/data-table";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { shipments } from "@/data/shipping";
import type { Shipment } from "@/types/wms";

export default function ShippingPage() {
  const goTo = useRowNavigation("/shipping");

  const columns: DataTableColumn<Shipment>[] = [
    {
      id: "shipment",
      header: "Shipment",
      cell: (s) => <span className="font-medium">{s.shipmentNumber}</span>,
      sortValue: (s) => s.shipmentNumber,
    },
    { id: "order", header: "Order", cell: (s) => s.orderNumber },
    { id: "customer", header: "Customer", cell: (s) => s.customer },
    { id: "carrier", header: "Carrier", cell: (s) => s.carrier },
    { id: "destination", header: "Destination", cell: (s) => s.destination },
    { id: "shipDate", header: "Ship Date", cell: (s) => s.shipDate, sortValue: (s) => s.shipDate },
    { id: "eta", header: "Expected Delivery", cell: (s) => s.expectedDelivery },
    { id: "status", header: "Status", cell: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shipping"
        description="Track outbound shipments from dispatch through delivery."
        breadcrumbs={[{ label: "Warehouse Operations" }, { label: "Shipping" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          label="Ready to Ship"
          value={String(shipments.filter((s) => s.status === "Packed").length)}
          icon={PackageCheck}
        />
        <KpiCard
          label="Shipped Today"
          value={String(shipments.filter((s) => s.status === "Dispatched").length)}
          icon={Truck}
        />
        <KpiCard
          label="In Transit"
          value={String(shipments.filter((s) => s.status === "In Transit").length)}
          icon={Truck}
        />
        <KpiCard
          label="Delivered"
          value={String(shipments.filter((s) => s.status === "Delivered").length)}
          icon={CheckCircle2}
        />
        <KpiCard
          label="Delayed"
          value={String(shipments.filter((s) => s.status === "Delayed").length)}
          icon={AlertTriangle}
          tone="negative"
        />
      </div>
      <DataTable
        rows={shipments}
        columns={columns}
        searchAccessor={(s) => `${s.shipmentNumber} ${s.orderNumber} ${s.customer} ${s.carrier}`}
        searchPlaceholder="Search shipment, order, customer, carrier…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: [
              "Order Confirmed",
              "Packed",
              "Dispatched",
              "In Transit",
              "Out for Delivery",
              "Delivered",
              "Delayed",
            ],
            accessor: (s) => s.status,
          },
          {
            id: "carrier",
            label: "Carrier",
            options: [...new Set(shipments.map((s) => s.carrier))],
            accessor: (s) => s.carrier,
          },
        ]}
        onRowClick={(s) => goTo(s.id)}
        emptyTitle="No shipments found"
      />
    </div>
  );
}
