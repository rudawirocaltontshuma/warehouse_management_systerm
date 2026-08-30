"use client";

import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { routes } from "@/data/shipping";
import type { DeliveryRoute } from "@/types/wms";

export default function RoutesPage() {
  const columns: DataTableColumn<DeliveryRoute>[] = [
    {
      id: "id",
      header: "Route ID",
      cell: (r) => <span className="font-medium">{r.routeId}</span>,
      sortValue: (r) => r.routeId,
    },
    { id: "origin", header: "Origin", cell: (r) => r.origin },
    { id: "destination", header: "Destination", cell: (r) => r.destination },
    { id: "stops", header: "Stops", cell: (r) => r.stops },
    { id: "shipments", header: "Shipments", cell: (r) => r.shipments },
    { id: "driver", header: "Driver", cell: (r) => r.driver },
    { id: "vehicle", header: "Vehicle", cell: (r) => r.vehicle },
    { id: "departure", header: "Departure", cell: (r) => r.departure, sortValue: (r) => r.departure },
    { id: "eta", header: "ETA", cell: (r) => r.eta },
    {
      id: "status",
      header: "Status",
      cell: (r) => (
        <StatusBadge
          status={r.status}
          tone={r.status === "Delayed" ? "warning" : r.status === "Completed" ? "success" : "info"}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Delivery Routes"
        description="Planned and active delivery routes across the logistics network."
        breadcrumbs={[{ label: "Logistics" }, { label: "Delivery Routes" }]}
      />
      <DataTable
        rows={routes}
        columns={columns}
        searchAccessor={(r) => `${r.routeId} ${r.driver} ${r.destination}`}
        searchPlaceholder="Search route, driver, destination…"
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Scheduled", "En Route", "Completed", "Delayed"],
            accessor: (r) => r.status,
          },
        ]}
        emptyTitle="No delivery routes found"
        pageSize={15}
      />
    </div>
  );
}
