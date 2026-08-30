import {
  AlertTriangle,
  Boxes,
  ClipboardCheck,
  DollarSign,
  Gauge,
  PackageCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChartCard, BarChartCard, DonutChartCard, LineChartCard, ProgressStatCard } from "@/components/wms/charts";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { cycleCounts } from "@/data/cycle-counts";
import {
  dailyActivity,
  dashboardKpis,
  fulfillmentTrend,
  inboundOutbound,
  inventoryByCategory,
  pickingProductivity,
  recentActivity,
  shipmentStatusBreakdown,
  topMovingProducts,
  utilizationByWarehouse,
  workerProductivitySummary,
} from "@/data/dashboard";
import { inventory } from "@/data/inventory";
import { receipts } from "@/data/receiving";
import { shipments } from "@/data/shipping";
import { transfers } from "@/data/transfers";
import { warehouses } from "@/data/warehouses";

function formatCurrency(value: number) {
  return `R ${Math.round(value).toLocaleString("en-ZA")}`;
}

export default function DashboardPage() {
  const lowStock = inventory.filter((i) => i.status === "low-stock").slice(0, 5);
  const pendingReceiving = receipts.filter((r) => r.status === "Expected" || r.status === "Arrived").slice(0, 5);
  const todaysShipments = shipments.slice(0, 5);
  const recentTransfers = transfers.slice(0, 5);
  const activeCycleCounts = cycleCounts.filter((c) => c.status !== "Completed").slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Warehouse Overview"
        description="Monitor inventory, fulfillment, receiving and warehouse activity."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        <KpiCard
          label="Inventory Units"
          value={dashboardKpis.totalInventoryUnits.toLocaleString("en-ZA")}
          icon={Boxes}
        />
        <KpiCard label="Inventory Value" value={formatCurrency(dashboardKpis.inventoryValue)} icon={DollarSign} />
        <KpiCard
          label="Orders Today"
          value="1,284"
          icon={ShoppingCart}
          trend={4.2}
          trendLabel="vs yesterday"
          tone="positive"
        />
        <KpiCard label="Pending Orders" value={String(dashboardKpis.ordersPending)} icon={ClipboardCheck} />
        <KpiCard label="Inbound Shipments" value={String(dashboardKpis.inboundShipments)} icon={Truck} />
        <KpiCard label="Outbound Shipments" value={String(dashboardKpis.outboundShipments)} icon={PackageCheck} />
        <KpiCard
          label="Low Stock"
          value={String(dashboardKpis.lowStockItems)}
          icon={AlertTriangle}
          tone="negative"
          trend={-2.1}
          trendLabel="vs last week"
        />
        <KpiCard label="Utilization" value={`${dashboardKpis.utilization}%`} icon={Gauge} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartCard
          title="Order Fulfillment Trend"
          description="Orders fulfilled vs daily target, last 14 days."
          data={fulfillmentTrend}
          xKey="day"
          series={[
            { key: "fulfilled", label: "Fulfilled" },
            { key: "target", label: "Target" },
          ]}
        />
        <BarChartCard
          title="Inbound vs Outbound"
          description="Shipment volume across all warehouses, last 7 days."
          data={inboundOutbound}
          xKey="day"
          series={[
            { key: "inbound", label: "Inbound" },
            { key: "outbound", label: "Outbound" },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ProgressStatCard
          title="Warehouse Utilization"
          description="Capacity used by distribution centre."
          items={utilizationByWarehouse.map((w) => ({ label: w.name, value: w.utilization }))}
        />
        <DonutChartCard
          title="Inventory by Category"
          description="Unit distribution across product categories."
          data={inventoryByCategory}
        />
        <DonutChartCard
          title="Shipment Status"
          description="Current shipment status across all carriers."
          data={shipmentStatusBreakdown}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard
          title="Picking Productivity"
          description="Units picked per worker, top performers today."
          data={pickingProductivity}
          xKey="name"
          series={[{ key: "units", label: "Units Picked" }]}
        />
        <AreaChartCard
          title="Daily Warehouse Activity"
          description="Receiving, picking and shipping volume, last 14 days."
          data={dailyActivity}
          xKey="day"
          series={[
            { key: "receiving", label: "Receiving" },
            { key: "picking", label: "Picking" },
            { key: "shipping", label: "Shipping" },
          ]}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Warehouse Activity</CardTitle>
            <CardDescription>Latest events across receiving, picking and shipping.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.slice(0, 6).map((a, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{a.label}</span>
                <span className="shrink-0 text-muted-foreground text-xs">{a.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Low Stock Alerts</CardTitle>
            <CardDescription>SKUs at or below their reorder point.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{item.sku}</span>
                <Badge variant="outline">{item.available} available</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Receiving</CardTitle>
            <CardDescription>Shipments expected or arrived at the dock.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReceiving.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{r.receiptNumber}</span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s Shipments</CardTitle>
            <CardDescription>Outbound shipments and their current status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysShipments.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{s.shipmentNumber}</span>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Moving Products</CardTitle>
            <CardDescription>Highest unit volume across all warehouses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topMovingProducts.map((p) => (
              <div key={p.sku} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{p.name}</span>
                <span className="shrink-0 text-muted-foreground text-xs">{p.units.toLocaleString("en-ZA")} units</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Warehouse Capacity</CardTitle>
            <CardDescription>Total capacity by distribution centre.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {warehouses.map((w) => (
              <div key={w.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{w.code}</span>
                <span className="shrink-0 text-muted-foreground text-xs">
                  {Math.round((w.usedCapacity / w.totalCapacity) * 100)}% used
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Worker Productivity</CardTitle>
            <CardDescription>Active workforce performance summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Active Workers</span>
              <span className="text-muted-foreground">{workerProductivitySummary.activeWorkers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Avg. Productivity</span>
              <span className="text-muted-foreground">{workerProductivitySummary.avgProductivity}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Avg. Accuracy</span>
              <span className="text-muted-foreground">{workerProductivitySummary.avgAccuracy}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Transfers</CardTitle>
            <CardDescription>Inventory movement between warehouses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransfers.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">
                  {warehouses.find((w) => w.id === t.sourceWarehouseId)?.code ?? ""} →{" "}
                  {warehouses.find((w) => w.id === t.destinationWarehouseId)?.code ?? ""}
                </span>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cycle Count Progress</CardTitle>
            <CardDescription>Scheduled and in-progress inventory counts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCycleCounts.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{c.zone}</span>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
