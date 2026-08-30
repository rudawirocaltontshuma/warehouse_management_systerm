import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/wms/activity-timeline";
import { DemoActionButton } from "@/components/wms/demo-actions";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { orders } from "@/data/orders";
import { packTasks } from "@/data/packing";

export function generateStaticParams() {
  return packTasks.map((t) => ({ id: t.id }));
}

export default async function PackingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = packTasks.find((t) => t.id === id);
  if (!task) notFound();

  const order = orders.find((o) => o.orderNumber === task.orderNumber);

  return (
    <DetailShell
      title={task.packingId}
      description={`Order ${task.orderNumber} for ${task.customer}`}
      breadcrumbs={[
        { label: "Warehouse Operations" },
        { label: "Packing", href: "/packing" },
        { label: task.packingId },
      ]}
      actions={<DemoActionButton message="Packing preview updated.">Mark as Packed</DemoActionButton>}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <DetailField label="Order" value={task.orderNumber} />
            <DetailField label="Customer" value={task.customer} />
            <DetailField label="Items" value={task.items} />
            <DetailField label="Package" value={task.packageType} />
            <DetailField label="Dimensions" value={`${task.dimensionsCm} cm`} />
            <DetailField label="Weight" value={`${task.weightKg} kg`} />
            <DetailField label="Packing Station" value={task.station} />
            <DetailField label="Worker" value={task.worker} />
            <DetailField label="Status" value={<StatusBadge status={task.status} />} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <DetailSection title="Package Preview">
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
                <div
                  className="flex items-center justify-center rounded-md border-2 border-primary/40 bg-primary/5 font-mono text-muted-foreground text-xs"
                  style={{ width: 120, height: 90 }}
                >
                  {task.dimensionsCm} cm
                </div>
                <p className="text-muted-foreground text-xs">
                  {task.packageType} · {task.weightKg} kg (decorative preview)
                </p>
              </div>
            </DetailSection>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DetailSection title="Timeline">
            <ActivityTimeline
              events={[
                { id: "1", label: "Order Confirmed", timestamp: order?.date ?? "—", actor: "System" },
                { id: "2", label: "Picking Completed", timestamp: order?.date ?? "—", actor: "Pick Team" },
                {
                  id: "3",
                  label: task.status === "Packed" ? "Packing Completed" : "Packing In Progress",
                  timestamp: order?.date ?? "—",
                  actor: task.worker,
                },
              ]}
            />
          </DetailSection>
        </CardContent>
      </Card>
    </DetailShell>
  );
}
