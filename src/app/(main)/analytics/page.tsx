import { Clock, Gauge, PackageCheck, ScanLine, Target, TrendingUp } from "lucide-react";

import { BarChartCard, LineChartCard, ProgressStatCard } from "@/components/wms/charts";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { fulfillmentMetrics, inventoryTurnover, warehouseAnalyticsMetrics } from "@/data/analytics";

export default function WarehouseAnalyticsPage() {
  const avgTurnover =
    Math.round(
      (warehouseAnalyticsMetrics.reduce((s, w) => s + w.turnover, 0) / warehouseAnalyticsMetrics.length) * 10,
    ) / 10;
  const avgDockToStock =
    Math.round(
      (warehouseAnalyticsMetrics.reduce((s, w) => s + w.dockToStockHours, 0) / warehouseAnalyticsMetrics.length) * 10,
    ) / 10;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Warehouse Analytics"
        description="Operational performance metrics across the warehouse network."
        breadcrumbs={[{ label: "Analytics" }, { label: "Warehouse Analytics" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Inventory Turnover" value={`${avgTurnover}x`} icon={TrendingUp} />
        <KpiCard label="Order Fulfillment" value={`${fulfillmentMetrics.completionRate}%`} icon={PackageCheck} />
        <KpiCard label="Picking Accuracy" value={`${fulfillmentMetrics.pickAccuracy}%`} icon={Target} />
        <KpiCard label="Receiving Accuracy" value="98.1%" icon={ScanLine} />
        <KpiCard label="Utilization" value="82.4%" icon={Gauge} />
        <KpiCard label="Dock-to-Stock" value={`${avgDockToStock}h`} icon={Clock} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartCard
          title="Inventory Turnover Trend"
          description="Turnover ratio, last 12 months."
          data={inventoryTurnover}
          xKey="month"
          series={[{ key: "turnover", label: "Turnover" }]}
        />
        <BarChartCard
          title="Fulfillment by Warehouse"
          description="Order fulfillment rate by distribution centre."
          data={warehouseAnalyticsMetrics}
          xKey="name"
          series={[{ key: "fulfillment", label: "Fulfillment %" }]}
        />
      </div>
      <ProgressStatCard
        title="Picking & Receiving Accuracy"
        description="Accuracy by warehouse."
        items={warehouseAnalyticsMetrics.map((w) => ({
          label: w.name,
          value: w.pickAccuracy,
          caption: `Receiving: ${w.receivingAccuracy}%`,
        }))}
      />
    </div>
  );
}
