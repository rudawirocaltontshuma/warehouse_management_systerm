import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChartCard, BarChartCard } from "@/components/wms/charts";
import { DetailField, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { inventory } from "@/data/inventory";
import { aisles, bins, zones } from "@/data/locations";
import { products } from "@/data/products";
import { warehouses } from "@/data/warehouses";
import { daysFromToday } from "@/data/wms/rng";
import { workers } from "@/data/workers";

export function generateStaticParams() {
  return warehouses.map((w) => ({ id: w.id }));
}

export default async function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const warehouse = warehouses.find((w) => w.id === id);
  if (!warehouse) notFound();

  const warehouseZones = zones.filter((z) => z.warehouseId === warehouse.id);
  const warehouseAisles = aisles.filter((a) => a.warehouseId === warehouse.id);
  const warehouseBins = bins.filter((b) => b.warehouseId === warehouse.id);
  const warehouseInventory = inventory.filter((i) => i.warehouseId === warehouse.id).slice(0, 8);
  const warehouseWorkers = workers.filter((w) => w.warehouseId === warehouse.id).slice(0, 8);

  const activity = Array.from({ length: 7 }, (_, i) => ({
    day: daysFromToday(-6 + i).slice(5),
    inbound: Math.round(warehouse.inbound * (0.7 + 0.1 * i)),
    outbound: Math.round(warehouse.outbound * (0.7 + 0.1 * i)),
  }));

  return (
    <DetailShell
      title={warehouse.name}
      description={`${warehouse.address}`}
      breadcrumbs={[{ label: "Warehouses", href: "/warehouses" }, { label: warehouse.name }]}
    >
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="inbound">Inbound</TabsTrigger>
          <TabsTrigger value="outbound">Outbound</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <DetailField label="Manager" value={warehouse.manager} />
              <DetailField label="Status" value={<StatusBadge status={warehouse.status} />} />
              <DetailField label="Total Capacity" value={warehouse.totalCapacity.toLocaleString("en-ZA")} />
              <DetailField label="Used Capacity" value={warehouse.usedCapacity.toLocaleString("en-ZA")} />
              <DetailField label="SKUs" value={warehouse.skuCount.toLocaleString("en-ZA")} />
              <DetailField label="Units" value={warehouse.unitCount.toLocaleString("en-ZA")} />
              <DetailField label="Inventory Value" value={`R ${warehouse.inventoryValue.toLocaleString("en-ZA")}`} />
              <DetailField label="Workers" value={warehouse.workerCount} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Capacity Utilization</span>
                <span className="text-muted-foreground">
                  {Math.round((warehouse.usedCapacity / warehouse.totalCapacity) * 100)}%
                </span>
              </div>
              <Progress value={(warehouse.usedCapacity / warehouse.totalCapacity) * 100} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones">
          <Card>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseZones.map((z) => (
                      <TableRow key={z.id}>
                        <TableCell className="font-medium">{z.name}</TableCell>
                        <TableCell>{z.purpose}</TableCell>
                        <TableCell>{z.capacity.toLocaleString("en-ZA")}</TableCell>
                        <TableCell>{z.used.toLocaleString("en-ZA")}</TableCell>
                        <TableCell>
                          <StatusBadge status={z.status} />
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
                      <TableHead>Location Code</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupied</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseBins.slice(0, 12).map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">{b.code}</TableCell>
                        <TableCell>{b.capacity}</TableCell>
                        <TableCell>{b.occupied}</TableCell>
                        <TableCell>
                          <StatusBadge status={b.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-2 text-muted-foreground text-xs">
                {warehouseAisles.length} aisles · {warehouseBins.length} locations total.
              </p>
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
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>On Hand</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseInventory.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell className="font-medium">{i.sku}</TableCell>
                        <TableCell>{products.find((p) => p.sku === i.sku)?.name}</TableCell>
                        <TableCell>{i.onHand}</TableCell>
                        <TableCell>
                          <StatusBadge status={i.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound">
          <BarChartCard
            title="Inbound Volume"
            data={activity}
            xKey="day"
            series={[{ key: "inbound", label: "Inbound Shipments" }]}
          />
        </TabsContent>

        <TabsContent value="outbound">
          <BarChartCard
            title="Outbound Volume"
            data={activity}
            xKey="day"
            series={[{ key: "outbound", label: "Outbound Shipments" }]}
          />
        </TabsContent>

        <TabsContent value="workers">
          <Card>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseWorkers.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="font-medium">{w.name}</TableCell>
                        <TableCell>{w.department}</TableCell>
                        <TableCell>{w.shift}</TableCell>
                        <TableCell>
                          <StatusBadge status={w.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AreaChartCard
            title="Warehouse Activity"
            description="Inbound and outbound volume, last 7 days."
            data={activity}
            xKey="day"
            series={[
              { key: "inbound", label: "Inbound" },
              { key: "outbound", label: "Outbound" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </DetailShell>
  );
}
