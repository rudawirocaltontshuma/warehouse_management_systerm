import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/wms/activity-timeline";
import { DemoActionButton } from "@/components/wms/demo-actions";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { receipts } from "@/data/receiving";
import { suppliers } from "@/data/suppliers";
import { warehouses } from "@/data/warehouses";

export function generateStaticParams() {
  return receipts.map((r) => ({ id: r.id }));
}

export default async function ReceiptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const receipt = receipts.find((r) => r.id === id);
  if (!receipt) notFound();

  const supplier = suppliers.find((s) => s.id === receipt.supplierId);
  const warehouse = warehouses.find((w) => w.id === receipt.warehouseId);

  return (
    <DetailShell
      title={receipt.receiptNumber}
      description={`Purchase order ${receipt.poNumber} from ${supplier?.name}`}
      breadcrumbs={[
        { label: "Warehouse Operations" },
        { label: "Receiving", href: "/receiving" },
        { label: receipt.receiptNumber },
      ]}
      actions={
        <>
          <DemoActionButton message="Receiving preview updated.">Mark as Received</DemoActionButton>
          <DemoActionButton message="Exception preview logged." variant="destructive">
            Log Exception
          </DemoActionButton>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <DetailField label="Receipt Number" value={receipt.receiptNumber} />
            <DetailField label="Purchase Order" value={receipt.poNumber} />
            <DetailField label="Supplier" value={supplier?.name ?? "—"} />
            <DetailField label="Warehouse" value={warehouse?.name ?? "—"} />
            <DetailField label="Dock" value={receipt.dock} />
            <DetailField label="Expected Arrival" value={receipt.expectedDate} />
            <DetailField label="Actual Arrival" value={receipt.actualArrival ?? "Not yet arrived"} />
            <DetailField label="Status" value={<StatusBadge status={receipt.status} />} />
            <DetailField label="Items" value={receipt.items} />
            <DetailField label="Expected Quantity" value={receipt.expectedQuantity.toLocaleString("en-ZA")} />
            <DetailField label="Received Quantity" value={receipt.receivedQuantity.toLocaleString("en-ZA")} />
            <DetailField label="Damaged Quantity" value={receipt.damagedQuantity.toLocaleString("en-ZA")} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <DetailSection title="Notes">
              <p className="text-muted-foreground text-sm">{receipt.notes}</p>
            </DetailSection>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DetailSection title="Timeline">
            <ActivityTimeline events={receipt.timeline} />
          </DetailSection>
        </CardContent>
      </Card>
    </DetailShell>
  );
}
