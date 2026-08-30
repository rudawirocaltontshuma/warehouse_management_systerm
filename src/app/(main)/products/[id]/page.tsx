import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityTimeline } from "@/components/wms/activity-timeline";
import { LineChartCard } from "@/components/wms/charts";
import { DetailField, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { inventory } from "@/data/inventory";
import { orders } from "@/data/orders";
import { productLocations, products } from "@/data/products";
import { stockMovements } from "@/data/stock-movements";
import { suppliers } from "@/data/suppliers";
import { warehouses } from "@/data/warehouses";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const records = inventory.filter((i) => i.sku === product.sku);
  const locations = productLocations.filter((l) => l.sku === product.sku);
  const relatedOrders = orders.filter((o) => o.lines.some((l) => l.sku === product.sku)).slice(0, 8);
  const relatedSuppliers = suppliers.filter((s) => s.category === product.category).slice(0, 4);
  const movements = stockMovements.filter((m) => m.sku === product.sku).slice(0, 12);
  const totalUnits = records.reduce((s, r) => s + r.onHand, 0);

  const movementChart = Array.from({ length: 8 }, (_, i) => ({
    week: `Wk ${i + 1}`,
    units: Math.max(0, Math.round(totalUnits / 8 + Math.sin(i) * (totalUnits / 20))),
  }));

  return (
    <DetailShell
      title={product.name}
      description={`SKU ${product.sku} · ${product.brand}`}
      breadcrumbs={[{ label: "Products", href: "/products" }, { label: product.name }]}
    >
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="movement">Movement</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <DetailField label="SKU" value={product.sku} />
              <DetailField label="Barcode" value={<span className="font-mono">{product.barcode}</span>} />
              <DetailField label="Category" value={product.category} />
              <DetailField label="Brand" value={product.brand} />
              <DetailField label="Weight" value={`${product.weightKg} kg`} />
              <DetailField label="Dimensions" value={`${product.dimensionsCm} cm`} />
              <DetailField label="Cost" value={`R ${product.unitCost.toLocaleString("en-ZA")}`} />
              <DetailField label="Selling Price" value={`R ${product.sellingPrice.toLocaleString("en-ZA")}`} />
              <DetailField label="Total Stock" value={totalUnits.toLocaleString("en-ZA")} />
              <DetailField label="Reorder Level" value={product.reorderLevel} />
              <DetailField label="Reorder Max" value={product.reorderMax} />
              <DetailField
                label="Status"
                value={
                  <StatusBadge status={product.status} tone={product.status === "active" ? "success" : "neutral"} />
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Aisle</TableHead>
                      <TableHead>Rack</TableHead>
                      <TableHead>Bin</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Capacity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell>{warehouses.find((w) => w.id === l.warehouseId)?.code ?? ""}</TableCell>
                        <TableCell>{l.aisleCode}</TableCell>
                        <TableCell>{l.rack}</TableCell>
                        <TableCell>{l.bin}</TableCell>
                        <TableCell>{l.quantity}</TableCell>
                        <TableCell>{l.capacity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.orderNumber}</TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell>{o.date}</TableCell>
                        <TableCell>
                          <StatusBadge status={o.fulfillmentStatus} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>On-Time Delivery</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedSuppliers.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.leadTimeDays} days</TableCell>
                        <TableCell>{s.onTimeDelivery}%</TableCell>
                        <TableCell>
                          <StatusBadge status={s.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement">
          <LineChartCard
            title="Inventory Movement"
            description="Estimated unit level over the past 8 weeks."
            data={movementChart}
            xKey="week"
            series={[{ key: "units", label: "Units on hand" }]}
          />
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent>
              <ActivityTimeline
                events={movements.map((m, i) => ({
                  id: `${m.id}-${i}`,
                  label: `${m.type} · ${m.quantity > 0 ? "+" : ""}${m.quantity} units`,
                  timestamp: m.date,
                  actor: m.user,
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DetailShell>
  );
}
