import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoActionButton } from "@/components/wms/demo-actions";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { transfers } from "@/data/transfers";
import { warehouses } from "@/data/warehouses";

export function generateStaticParams() {
  return transfers.map((t) => ({ id: t.id }));
}

export default async function TransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transfer = transfers.find((t) => t.id === id);
  if (!transfer) notFound();

  const source = warehouses.find((w) => w.id === transfer.sourceWarehouseId);
  const destination = warehouses.find((w) => w.id === transfer.destinationWarehouseId);

  return (
    <DetailShell
      title={transfer.id.toUpperCase()}
      description={`${source?.name} → ${destination?.name}`}
      breadcrumbs={[
        { label: "Inventory" },
        { label: "Transfers", href: "/transfers" },
        { label: transfer.id.toUpperCase() },
      ]}
      actions={<DemoActionButton message="Transfer preview approved.">Approve Demo</DemoActionButton>}
    >
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailField label="Source Warehouse" value={source?.name ?? "—"} />
          <DetailField label="Destination Warehouse" value={destination?.name ?? "—"} />
          <DetailField label="Requested By" value={transfer.requestedBy} />
          <DetailField label="Date" value={transfer.date} />
          <DetailField label="Items" value={transfer.items} />
          <DetailField label="Quantity" value={transfer.quantity.toLocaleString("en-ZA")} />
          <DetailField label="Status" value={<StatusBadge status={transfer.status} />} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Transfer Lines">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfer.lines.map((line) => (
                    <TableRow key={line.sku}>
                      <TableCell className="font-medium">{line.sku}</TableCell>
                      <TableCell>{line.productName}</TableCell>
                      <TableCell>{line.quantity}</TableCell>
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
