import { notFound } from "next/navigation";

import { DetailShell } from "@/components/wms/detail-shell";
import { ShipmentDetailActions, ShipmentDetailContent } from "@/components/wms/shipment-detail-content";
import { shipments } from "@/data/shipping";

export function generateStaticParams() {
  return shipments.map((s) => ({ id: s.id }));
}

export default async function ShippingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = shipments.find((s) => s.id === id);
  if (!shipment) notFound();

  return (
    <DetailShell
      title={shipment.shipmentNumber}
      description={`Shipment for order ${shipment.orderNumber} via ${shipment.carrier}`}
      breadcrumbs={[
        { label: "Warehouse Operations" },
        { label: "Shipping", href: "/shipping" },
        { label: shipment.shipmentNumber },
      ]}
      actions={<ShipmentDetailActions shipment={shipment} />}
    >
      <ShipmentDetailContent shipment={shipment} />
    </DetailShell>
  );
}
