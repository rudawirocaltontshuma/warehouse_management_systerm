import { CheckCircle2, MapPin, Route, Truck } from "lucide-react";

import { BarChartCard, DonutChartCard } from "@/components/wms/charts";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { carriers, routes, shipments } from "@/data/shipping";

export default function LogisticsPage() {
  const carrierVolume = carriers.map((c) => ({ name: c.name.split(" ")[0], shipments: c.shipments }));
  const routeStatus = (() => {
    const map = new Map<string, number>();
    for (const r of routes) map.set(r.status, (map.get(r.status) ?? 0) + 1);
    return Array.from(map, ([name, value]) => ({ name, value }));
  })();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Logistics"
        description="Shipments, carriers and delivery routes across the network."
        breadcrumbs={[{ label: "Logistics" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Shipments" value={String(shipments.length)} icon={Truck} />
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
          icon={Truck}
          tone="negative"
        />
        <KpiCard label="Vehicles" value={String(new Set(routes.map((r) => r.vehicle)).size)} icon={MapPin} />
        <KpiCard label="Routes" value={String(routes.length)} icon={Route} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard
          title="Shipment Volume by Carrier"
          data={carrierVolume}
          xKey="name"
          series={[{ key: "shipments", label: "Shipments" }]}
        />
        <DonutChartCard
          title="Route Status"
          description="Current status of scheduled delivery routes."
          data={routeStatus}
        />
      </div>
    </div>
  );
}
