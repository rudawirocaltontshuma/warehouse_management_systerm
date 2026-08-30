import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { cycleCounts } from "@/data/cycle-counts";
import { warehouses } from "@/data/warehouses";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return cycleCounts.map((c) => ({ id: c.id }));
}

export default async function CycleCountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const count = cycleCounts.find((c) => c.id === id);
  if (!count) notFound();

  const warehouse = warehouses.find((w) => w.id === count.warehouseId);

  return (
    <DetailShell
      title={count.id.toUpperCase()}
      description={`${count.zone} · ${count.location}`}
      breadcrumbs={[
        { label: "Inventory" },
        { label: "Cycle Counts", href: "/cycle-counts" },
        { label: count.id.toUpperCase() },
      ]}
    >
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailField label="Warehouse" value={warehouse?.name ?? "—"} />
          <DetailField label="Zone" value={count.zone} />
          <DetailField label="Location" value={count.location} />
          <DetailField label="Assigned Worker" value={count.assignedWorker} />
          <DetailField label="Scheduled Date" value={count.scheduledDate} />
          <DetailField label="Status" value={<StatusBadge status={count.status} />} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Products & Variance">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>System Quantity</TableHead>
                    <TableHead>Counted Quantity</TableHead>
                    <TableHead>Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {count.lines.map((line) => {
                    const variance = line.countedQuantity - line.systemQuantity;
                    return (
                      <TableRow key={line.sku}>
                        <TableCell className="font-medium">{line.sku}</TableCell>
                        <TableCell>{line.productName}</TableCell>
                        <TableCell>{line.systemQuantity}</TableCell>
                        <TableCell>{count.status === "Scheduled" ? "—" : line.countedQuantity}</TableCell>
                        <TableCell>
                          {count.status === "Scheduled" ? (
                            "—"
                          ) : (
                            <span
                              className={cn(
                                "font-medium",
                                variance === 0 && "text-emerald-600 dark:text-emerald-400",
                                variance !== 0 && "text-amber-600 dark:text-amber-400",
                              )}
                            >
                              {variance > 0 ? `+${variance}` : variance}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DetailSection>
        </CardContent>
      </Card>
    </DetailShell>
  );
}
