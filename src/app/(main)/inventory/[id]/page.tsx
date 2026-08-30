import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { inventory } from "@/data/inventory";
import { products } from "@/data/products";
import { stockMovements } from "@/data/stock-movements";
import { warehouses } from "@/data/warehouses";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const records = inventory.filter((i) => i.sku === product.sku);
  const movements = stockMovements.filter((m) => m.sku === product.sku).slice(0, 10);
  const totalOnHand = records.reduce((s, r) => s + r.onHand, 0);

  return (
    <DetailShell
      title={product.name}
      description={`SKU ${product.sku} · ${product.category}`}
      breadcrumbs={[
        { label: "Inventory", href: "/inventory" },
        { label: "Inventory Overview", href: "/inventory" },
        { label: product.sku },
      ]}
    >
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailField label="SKU" value={product.sku} />
          <DetailField label="Category" value={product.category} />
          <DetailField label="Total On Hand" value={totalOnHand.toLocaleString("en-ZA")} />
          <DetailField label="Reorder Level" value={product.reorderLevel} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Stock by Warehouse">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>On Hand</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{warehouses.find((w) => w.id === r.warehouseId)?.name}</TableCell>
                      <TableCell className="font-mono text-xs">{r.locationCode}</TableCell>
                      <TableCell>{r.onHand}</TableCell>
                      <TableCell>{r.reserved}</TableCell>
                      <TableCell>{r.available}</TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DetailSection>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Recent Movements">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.date}</TableCell>
                      <TableCell>{m.type}</TableCell>
                      <TableCell>{m.quantity > 0 ? `+${m.quantity}` : m.quantity}</TableCell>
                      <TableCell>{m.reference}</TableCell>
                      <TableCell>{m.user}</TableCell>
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
