import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoActionButton } from "@/components/wms/demo-actions";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { purchaseOrders } from "@/data/orders";
import { suppliers } from "@/data/suppliers";
import { warehouses } from "@/data/warehouses";

export function generateStaticParams() {
  return purchaseOrders.map((po) => ({ id: po.id }));
}

export default async function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const po = purchaseOrders.find((p) => p.id === id);
  if (!po) notFound();

  const supplier = suppliers.find((s) => s.id === po.supplierId);
  const warehouse = warehouses.find((w) => w.id === po.warehouseId);

  return (
    <DetailShell
      title={po.poNumber}
      description={`Purchase order to ${supplier?.name}`}
      breadcrumbs={[
        { label: "Orders" },
        { label: "Purchase Orders", href: "/purchase-orders" },
        { label: po.poNumber },
      ]}
      actions={<DemoActionButton message="Purchase order preview approved.">Approve Demo</DemoActionButton>}
    >
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailField label="PO Number" value={po.poNumber} />
          <DetailField label="Supplier" value={supplier?.name ?? "—"} />
          <DetailField label="Warehouse" value={warehouse?.name ?? "—"} />
          <DetailField label="Order Date" value={po.orderDate} />
          <DetailField label="Expected Date" value={po.expectedDate} />
          <DetailField label="Items" value={po.items} />
          <DetailField label="Amount" value={`R ${po.amount.toLocaleString("en-ZA")}`} />
          <DetailField label="Status" value={<StatusBadge status={po.status} />} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Line Items">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {po.lines.map((line) => (
                    <TableRow key={line.sku}>
                      <TableCell className="font-medium">{line.sku}</TableCell>
                      <TableCell>{line.productName}</TableCell>
                      <TableCell>{line.quantity}</TableCell>
                      <TableCell>R {line.unitCost.toLocaleString("en-ZA")}</TableCell>
                      <TableCell>R {Math.round(line.quantity * line.unitCost).toLocaleString("en-ZA")}</TableCell>
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
