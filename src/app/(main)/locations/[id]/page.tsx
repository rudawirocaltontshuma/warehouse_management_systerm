import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { aisles, bins, zones } from "@/data/locations";
import { productLocations, products } from "@/data/products";
import { stockMovements } from "@/data/stock-movements";
import { warehouses } from "@/data/warehouses";

export function generateStaticParams() {
  return bins.slice(0, 60).map((b) => ({ id: b.id }));
}

export default async function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bin = bins.find((b) => b.id === id);
  if (!bin) notFound();

  const warehouse = warehouses.find((w) => w.id === bin.warehouseId);
  const zone = zones.find((z) => z.id === bin.zoneId);
  const aisle = aisles.find((a) => a.id === bin.aisleId);
  const productsHere = productLocations.filter(
    (l) => l.rack === bin.rack && l.bin === bin.bin && l.warehouseId === bin.warehouseId,
  );
  const movements = stockMovements.filter((m) => m.locationCode.includes(`${bin.rack}-${bin.bin}`)).slice(0, 8);

  return (
    <DetailShell
      title={bin.code}
      description={`${warehouse?.name} · ${zone?.name}`}
      breadcrumbs={[{ label: "Warehouses" }, { label: "Bins", href: "/bins" }, { label: bin.code }]}
    >
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailField label="Location Code" value={bin.code} />
          <DetailField label="Warehouse" value={warehouse?.name ?? "—"} />
          <DetailField label="Zone" value={zone?.name ?? "—"} />
          <DetailField label="Aisle" value={aisle?.code ?? "—"} />
          <DetailField label="Capacity" value={bin.capacity} />
          <DetailField label="Current Units" value={bin.occupied} />
          <DetailField label="Status" value={<StatusBadge status={bin.status} />} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Utilization</span>
            <span className="text-muted-foreground">{Math.round((bin.occupied / bin.capacity) * 100)}%</span>
          </div>
          <Progress value={(bin.occupied / bin.capacity) * 100} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Products in this Location">
            {productsHere.length ? (
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
                    {productsHere.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.sku}</TableCell>
                        <TableCell>{products.find((p) => p.sku === l.sku)?.name}</TableCell>
                        <TableCell>{l.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No products currently assigned to this location.</p>
            )}
          </DetailSection>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Recent Movements">
            {movements.length ? (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.date}</TableCell>
                        <TableCell>{m.sku}</TableCell>
                        <TableCell>{m.type}</TableCell>
                        <TableCell>{m.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No recent movements recorded for this location.</p>
            )}
          </DetailSection>
        </CardContent>
      </Card>
    </DetailShell>
  );
}
