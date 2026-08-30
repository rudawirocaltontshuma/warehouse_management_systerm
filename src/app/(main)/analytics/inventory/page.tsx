import { AlertTriangle, PackageX, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartCard, DonutChartCard, LineChartCard } from "@/components/wms/charts";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { deadStockValue, fastMovingItems, inventoryValueTrend, slowMovingItems, stockAging } from "@/data/analytics";
import { inventoryByCategory } from "@/data/dashboard";

export default function InventoryAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory Analytics"
        description="Inventory value, turnover and aging analysis."
        breadcrumbs={[{ label: "Analytics" }, { label: "Inventory Analytics" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Dead Stock Value"
          value={`R ${deadStockValue.toLocaleString("en-ZA")}`}
          icon={PackageX}
          tone="negative"
        />
        <KpiCard label="Slow Movers" value={String(slowMovingItems.length)} icon={TrendingDown} />
        <KpiCard label="Fast Movers" value={String(fastMovingItems.length)} icon={TrendingUp} tone="positive" />
        <KpiCard
          label="Aging Alerts"
          value={String(stockAging.filter((s) => s.bucket.includes("90") || s.bucket.includes("180")).length)}
          icon={AlertTriangle}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartCard
          title="Inventory Value Trend"
          description="Total inventory value, last 12 months."
          data={inventoryValueTrend}
          xKey="month"
          series={[{ key: "value", label: "Value (R)" }]}
        />
        <DonutChartCard
          title="Category Distribution"
          description="Unit distribution by product category."
          data={inventoryByCategory}
        />
      </div>
      <BarChartCard
        title="Stock Aging"
        description="Units on hand by age bucket."
        data={stockAging}
        xKey="bucket"
        series={[{ key: "units", label: "Units" }]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Slow Moving Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {slowMovingItems.map((item) => (
              <div key={item.sku} className="flex items-center justify-between text-sm">
                <span className="truncate">{item.name}</span>
                <span className="text-muted-foreground text-xs">
                  {item.units} units · {item.daysOnHand}d
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fast Moving Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fastMovingItems.map((item) => (
              <div key={item.sku} className="flex items-center justify-between text-sm">
                <span className="truncate">{item.name}</span>
                <span className="text-muted-foreground text-xs">{item.turnoverRate}x turnover</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
