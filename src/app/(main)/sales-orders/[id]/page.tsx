import { notFound } from "next/navigation";

import { DetailShell } from "@/components/wms/detail-shell";
import { OrderDetailContent } from "@/components/wms/order-detail-content";
import { orders } from "@/data/orders";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export default async function SalesOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();

  return (
    <DetailShell
      title={order.orderNumber}
      description={`Sales order for ${order.customer}`}
      breadcrumbs={[
        { label: "Orders" },
        { label: "Sales Orders", href: "/sales-orders" },
        { label: order.orderNumber },
      ]}
    >
      <OrderDetailContent order={order} />
    </DetailShell>
  );
}
