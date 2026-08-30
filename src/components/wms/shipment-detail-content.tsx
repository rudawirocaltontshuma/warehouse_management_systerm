import { Card, CardContent } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/wms/activity-timeline";
import { DemoActionButton } from "@/components/wms/demo-actions";
import { DetailField, DetailSection } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import type { Shipment } from "@/types/wms";

const TRACKING_STEPS = ["Order Confirmed", "Packed", "Dispatched", "In Transit", "Out for Delivery", "Delivered"];

export function ShipmentDetailActions({ shipment }: { shipment: Shipment }) {
  return (
    <>
      <DemoActionButton message="Shipment preview opened.">View Carrier Preview</DemoActionButton>
      <DemoActionButton message="Delivery preview updated." variant="secondary">
        Mark Delivered
      </DemoActionButton>
    </>
  );
}

export function ShipmentDetailContent({ shipment }: { shipment: Shipment }) {
  const currentIndex = TRACKING_STEPS.indexOf(shipment.status);

  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailField label="Shipment ID" value={shipment.shipmentNumber} />
          <DetailField label="Order" value={shipment.orderNumber} />
          <DetailField label="Customer" value={shipment.customer} />
          <DetailField label="Carrier" value={shipment.carrier} />
          <DetailField label="Tracking Number" value={shipment.trackingNumber} />
          <DetailField label="Origin" value={shipment.origin} />
          <DetailField label="Destination" value={shipment.destination} />
          <DetailField label="Weight" value={`${shipment.weightKg} kg`} />
          <DetailField label="Packages" value={shipment.packages} />
          <DetailField label="Expected Delivery" value={shipment.expectedDelivery} />
          <DetailField label="Current Status" value={<StatusBadge status={shipment.status} />} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Delivery Progress">
            <ol className="flex flex-wrap gap-2">
              {TRACKING_STEPS.map((step, i) => (
                <li
                  key={step}
                  className={`rounded-md border px-3 py-1.5 font-medium text-xs ${
                    i <= currentIndex && currentIndex >= 0
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step}
                </li>
              ))}
            </ol>
          </DetailSection>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Timeline">
            <ActivityTimeline events={shipment.timeline} />
          </DetailSection>
        </CardContent>
      </Card>
    </>
  );
}
