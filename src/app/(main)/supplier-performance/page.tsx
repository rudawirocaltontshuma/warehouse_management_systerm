import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChartCard, LineChartCard } from "@/components/wms/charts";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { supplierPerformanceTrend, topSuppliersBySpend } from "@/data/analytics";
import { suppliers } from "@/data/suppliers";

export default function SupplierPerformancePage() {
  const avgOnTime = Math.round((suppliers.reduce((s, x) => s + x.onTimeDelivery, 0) / suppliers.length) * 10) / 10;
  const avgAccuracy = Math.round((suppliers.reduce((s, x) => s + x.orderAccuracy, 0) / suppliers.length) * 10) / 10;
  const avgLeadTime = Math.round(suppliers.reduce((s, x) => s + x.leadTimeDays, 0) / suppliers.length);
  const avgDefect = Math.round((suppliers.reduce((s, x) => s + x.defectRate, 0) / suppliers.length) * 100) / 100;

  const chartData = topSuppliersBySpend.map((s) => ({ name: s.name.split(" ")[0], spend: Math.round(s.spend / 1000) }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Supplier Performance"
        description="On-time delivery, accuracy and spend across the supplier network."
        breadcrumbs={[{ label: "Suppliers" }, { label: "Supplier Performance" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>On-Time Delivery</CardDescription>
            <CardTitle className="text-2xl">{avgOnTime}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Order Accuracy</CardDescription>
            <CardTitle className="text-2xl">{avgAccuracy}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg. Lead Time</CardDescription>
            <CardTitle className="text-2xl">{avgLeadTime} days</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Defect Rate</CardDescription>
            <CardTitle className="text-2xl">{avgDefect}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartCard
          title="Supplier Performance Trend"
          description="On-time delivery and order accuracy over time."
          data={supplierPerformanceTrend}
          xKey="month"
          series={[
            { key: "onTime", label: "On-Time %" },
            { key: "accuracy", label: "Accuracy %" },
          ]}
        />
        <BarChartCard
          title="Spend by Supplier"
          description="Top suppliers by spend (R thousands)."
          data={chartData}
          xKey="name"
          series={[{ key: "spend", label: "Spend (R'000)" }]}
        />
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>On-Time</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Defect Rate</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSuppliersBySpend.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.onTimeDelivery}%</TableCell>
                    <TableCell>{s.orderAccuracy}%</TableCell>
                    <TableCell>{s.leadTimeDays} days</TableCell>
                    <TableCell>{s.defectRate}%</TableCell>
                    <TableCell>R {s.spend.toLocaleString("en-ZA")}</TableCell>
                    <TableCell>{s.orders}</TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} tone={s.status === "active" ? "success" : "warning"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
