import { CheckCircle2, ListChecks, Target, Timer, TrendingUp } from "lucide-react";

import { BarChartCard } from "@/components/wms/charts";
import { KpiCard } from "@/components/wms/kpi-card";
import { PageHeader } from "@/components/wms/page-header";
import { workers } from "@/data/workers";

export default function ProductivityPage() {
  const totalUnitsPicked = workers
    .filter((w) => w.department === "Picking")
    .reduce((s, w) => s + w.tasksCompleted * 6, 0);
  const ordersCompleted = Math.round(workers.reduce((s, w) => s + w.tasksCompleted, 0) / 4);
  const avgAccuracy = Math.round((workers.reduce((s, w) => s + w.accuracy, 0) / workers.length) * 10) / 10;
  const avgPickTime = Math.round(workers.reduce((s, w) => s + w.avgPickTimeSeconds, 0) / workers.length);
  const totalTasks = workers.reduce((s, w) => s + w.tasksCompleted, 0);

  const byDepartment = ["Receiving", "Putaway", "Picking", "Packing", "Shipping", "Inventory"].map((dept) => ({
    department: dept,
    tasks: workers.filter((w) => w.department === dept).reduce((s, w) => s + w.tasksCompleted, 0),
  }));

  const byShift = ["Morning", "Afternoon", "Night"].map((shift) => ({
    shift,
    productivity: Math.round(
      workers.filter((w) => w.shift === shift).reduce((s, w) => s + w.productivity, 0) /
        Math.max(1, workers.filter((w) => w.shift === shift).length),
    ),
  }));

  const topWorkers = [...workers]
    .sort((a, b) => b.productivity - a.productivity)
    .slice(0, 8)
    .map((w) => ({ name: w.name.split(" ")[0], productivity: w.productivity }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Productivity"
        description="Workforce productivity across departments, shifts and zones."
        breadcrumbs={[{ label: "Workforce" }, { label: "Productivity" }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Units Picked" value={totalUnitsPicked.toLocaleString("en-ZA")} icon={ListChecks} />
        <KpiCard label="Orders Completed" value={ordersCompleted.toLocaleString("en-ZA")} icon={CheckCircle2} />
        <KpiCard label="Avg Pick Time" value={`${avgPickTime}s`} icon={Timer} />
        <KpiCard label="Accuracy" value={`${avgAccuracy}%`} icon={Target} />
        <KpiCard label="Tasks Completed" value={totalTasks.toLocaleString("en-ZA")} icon={TrendingUp} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard
          title="Tasks by Department"
          data={byDepartment}
          xKey="department"
          series={[{ key: "tasks", label: "Tasks Completed" }]}
        />
        <BarChartCard
          title="Productivity by Shift"
          data={byShift}
          xKey="shift"
          series={[{ key: "productivity", label: "Avg Productivity %" }]}
        />
      </div>
      <BarChartCard
        title="Top Performers"
        description="Highest productivity scores this period."
        data={topWorkers}
        xKey="name"
        series={[{ key: "productivity", label: "Productivity %" }]}
      />
    </div>
  );
}
