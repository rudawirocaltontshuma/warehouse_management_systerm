import { Clock, PackageCheck, Target, TriangleAlert } from "lucide-react";

import { AreaChartCard } from "@/components/wms/charts";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { fulfillmentMetrics, ordersPerDay } from "@/data/analytics";

export default function FulfillmentAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fulfillment Analytics"
        description="Order fulfillment speed, accuracy and completion rate."
        breadcrumbs={[{ label: "Analytics" }, { label: "Fulfillment" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Avg Fulfillment Time" value={`${fulfillmentMetrics.avgFulfillmentHours}h`} icon={Clock} />
        <KpiCard label="Pick Accuracy" value={`${fulfillmentMetrics.pickAccuracy}%`} icon={Target} />
        <KpiCard label="Pack Accuracy" value={`${fulfillmentMetrics.packAccuracy}%`} icon={PackageCheck} />
        <KpiCard
          label="Shipment Delays"
          value={String(fulfillmentMetrics.shipmentDelays)}
          icon={TriangleAlert}
          tone="negative"
        />
        <KpiCard
          label="Completion Rate"
          value={`${fulfillmentMetrics.completionRate}%`}
          icon={PackageCheck}
          tone="positive"
        />
      </div>
      <AreaChartCard
        title="Orders per Day"
        description="Order volume across all warehouses, last 14 days."
        data={ordersPerDay}
        xKey="day"
        series={[{ key: "orders", label: "Orders" }]}
      />
    </div>
  );
}
