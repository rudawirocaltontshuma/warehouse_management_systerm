import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivityTimeline } from "@/components/wms/activity-timeline";
import { DetailField, DetailSection } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { shipments } from "@/data/shipping";
import { warehouses } from "@/data/warehouses";
import type { Order } from "@/types/wms";

export function OrderDetailContent({ order }: { order: Order }) {
  const warehouse = warehouses.find((w) => w.id === order.warehouseId);
  const shipment = shipments.find((s) => s.orderNumber === order.orderNumber);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <DetailField label="Order Number" value={order.orderNumber} />
            <DetailField label="Customer" value={order.customer} />
            <DetailField label="Date" value={order.date} />
            <DetailField label="Warehouse" value={warehouse?.name ?? "—"} />
            <DetailField
              label="Priority"
              value={
                <StatusBadge
                  status={order.priority}
                  tone={order.priority === "Urgent" ? "danger" : order.priority === "High" ? "warning" : "neutral"}
                />
              }
            />
            <DetailField label="Value" value={`R ${order.value.toLocaleString("en-ZA")}`} />
            <DetailField label="Fulfillment Status" value={<StatusBadge status={order.fulfillmentStatus} />} />
            <DetailField label="Payment Status" value={<StatusBadge status={order.paymentStatus} />} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <DetailSection title="Shipping Address">
              <p className="text-muted-foreground text-sm">{order.shippingAddress}</p>
            </DetailSection>
            <DetailSection title="Billing Address">
              <p className="text-muted-foreground text-sm">{order.billingAddress}</p>
            </DetailSection>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DetailSection title="Order Items">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Warehouse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.lines.map((line) => (
                    <TableRow key={line.sku}>
                      <TableCell className="font-medium">{line.sku}</TableCell>
                      <TableCell>{line.productName}</TableCell>
                      <TableCell>{line.quantity}</TableCell>
                      <TableCell>R {line.price.toLocaleString("en-ZA")}</TableCell>
                      <TableCell>{warehouse?.code}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DetailSection>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent>
            <DetailSection title="Order Timeline">
              <ActivityTimeline
                events={[
                  { id: "1", label: "Order Placed", timestamp: order.date, actor: order.customer },
                  { id: "2", label: "Order Allocated", timestamp: order.date, actor: "System" },
                  {
                    id: "3",
                    label: `Fulfillment: ${order.fulfillmentStatus}`,
                    timestamp: order.date,
                    actor: warehouse?.name,
                  },
                ]}
              />
            </DetailSection>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <DetailSection title="Shipment">
              {shipment ? (
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{shipment.shipmentNumber}</p>
                  <p className="text-muted-foreground">
                    {shipment.carrier} · {shipment.trackingNumber}
                  </p>
                  <StatusBadge status={shipment.status} />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No shipment created yet for this order.</p>
              )}
            </DetailSection>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
