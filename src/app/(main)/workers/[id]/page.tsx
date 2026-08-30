import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartCard } from "@/components/wms/charts";
import { DetailField, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { warehouseTasks } from "@/data/tasks";
import { warehouses } from "@/data/warehouses";
import { workers } from "@/data/workers";

export function generateStaticParams() {
  return workers.map((w) => ({ id: w.id }));
}

export default async function WorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const worker = workers.find((w) => w.id === id);
  if (!worker) notFound();

  const warehouse = warehouses.find((w) => w.id === worker.warehouseId);
  const relatedTasks = warehouseTasks.filter((t) => t.worker === worker.name).slice(0, 8);

  const weeklyChart = Array.from({ length: 6 }, (_, i) => ({
    week: `Wk ${i + 1}`,
    tasks: Math.max(4, Math.round(worker.tasksCompleted / 6 + Math.sin(i) * 6)),
  }));

  return (
    <DetailShell
      title={worker.name}
      description={`${worker.role} · ${warehouse?.name}`}
      breadcrumbs={[{ label: "Workforce" }, { label: "Workers", href: "/workers" }, { label: worker.name }]}
    >
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <DetailField label="Worker ID" value={worker.workerId} />
              <DetailField label="Role" value={worker.role} />
              <DetailField label="Warehouse" value={warehouse?.name ?? "—"} />
              <DetailField label="Shift" value={worker.shift} />
              <DetailField label="Tasks Completed" value={worker.tasksCompleted} />
              <DetailField label="Productivity Score" value={`${worker.productivity}%`} />
              <DetailField label="Avg. Pick Time" value={`${worker.avgPickTimeSeconds}s`} />
              <DetailField label="Accuracy" value={`${worker.accuracy}%`} />
              <DetailField label="Status" value={<StatusBadge status={worker.status} />} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="space-y-2">
              {relatedTasks.length ? (
                relatedTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                    <span>
                      {t.taskNumber} · {t.type}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No tasks currently assigned to this worker.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity">
          <BarChartCard
            title="Weekly Task Completion"
            data={weeklyChart}
            xKey="week"
            series={[{ key: "tasks", label: "Tasks Completed" }]}
          />
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Attendance rate:{" "}
                <span className="font-medium text-foreground">{Math.min(99, worker.productivity + 4)}%</span>
              </p>
              <p className="text-muted-foreground">
                Shift: <span className="font-medium text-foreground">{worker.shift}</span>
              </p>
              <p className="text-muted-foreground">
                Status: <StatusBadge status={worker.status} />
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts">
          <Card>
            <CardContent className="text-muted-foreground text-sm">
              Currently scheduled for the <span className="font-medium text-foreground">{worker.shift}</span> shift at{" "}
              {warehouse?.name}.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="space-y-2 text-muted-foreground text-sm">
              <p>
                {worker.name} completed {worker.tasksCompleted} tasks with {worker.accuracy}% accuracy this period.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DetailShell>
  );
}
