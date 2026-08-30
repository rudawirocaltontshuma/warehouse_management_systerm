import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoActionButton } from "@/components/wms/demo-actions";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { pickTasks } from "@/data/picking";
import { warehouses } from "@/data/warehouses";

export function generateStaticParams() {
  return pickTasks.map((t) => ({ id: t.id }));
}

export default async function PickListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = pickTasks.find((t) => t.id === id);
  if (!task) notFound();

  const warehouse = warehouses.find((w) => w.id === task.warehouseId);
  const totalQty = task.lines.reduce((s, l) => s + l.quantity, 0);
  const totalPicked = task.lines.reduce((s, l) => s + l.picked, 0);

  return (
    <DetailShell
      title={task.pickListId}
      description={`Order ${task.orderNumber} for ${task.customer}`}
      breadcrumbs={[
        { label: "Warehouse Operations" },
        { label: "Picking", href: "/picking" },
        { label: task.pickListId },
      ]}
      actions={<DemoActionButton message="Pick list preview updated.">Assign Picker</DemoActionButton>}
    >
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailField label="Order" value={task.orderNumber} />
          <DetailField label="Customer" value={task.customer} />
          <DetailField
            label="Priority"
            value={
              <StatusBadge
                status={task.priority}
                tone={task.priority === "Urgent" ? "danger" : task.priority === "High" ? "warning" : "neutral"}
              />
            }
          />
          <DetailField label="Picker" value={task.worker} />
          <DetailField label="Zone" value={task.zone} />
          <DetailField label="Warehouse" value={warehouse?.name ?? "—"} />
          <DetailField label="Created" value={task.created} />
          <DetailField label="Status" value={<StatusBadge status={task.status} />} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Progress</p>
            <p className="text-muted-foreground text-xs">
              {totalPicked} of {totalQty} units picked
            </p>
          </div>
          <Progress value={totalQty ? (totalPicked / totalQty) * 100 : 0} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Pick Lines">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Picked</TableHead>
                    <TableHead>Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {task.lines.map((line) => (
                    <TableRow key={line.sku}>
                      <TableCell className="font-medium">{line.sku}</TableCell>
                      <TableCell>{line.productName}</TableCell>
                      <TableCell>{line.location}</TableCell>
                      <TableCell>{line.quantity}</TableCell>
                      <TableCell>{line.picked}</TableCell>
                      <TableCell>{line.quantity - line.picked}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DetailSection>
        </CardContent>
      </Card>
    </DetailShell>
  );
}
