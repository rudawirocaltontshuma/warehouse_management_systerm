import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DetailField, DetailSection, DetailShell } from "@/components/wms/detail-shell";
import { StatusBadge } from "@/components/wms/status-badge";
import { purchaseOrders } from "@/data/orders";
import { products } from "@/data/products";
import { suppliers } from "@/data/suppliers";

export function generateStaticParams() {
  return suppliers.map((s) => ({ id: s.id }));
}

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = suppliers.find((s) => s.id === id);
  if (!supplier) notFound();

  const supplierOrders = purchaseOrders.filter((po) => po.supplierId === supplier.id).slice(0, 8);
  const supplierProducts = products.filter((p) => p.category === supplier.category).slice(0, 8);

  return (
    <DetailShell
      title={supplier.name}
      description={`${supplier.supplierId} · ${supplier.city}, ${supplier.province}`}
      breadcrumbs={[{ label: "Suppliers", href: "/suppliers" }, { label: supplier.name }]}
    >
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailField label="Category" value={supplier.category} />
          <DetailField label="Products" value={supplier.products} />
          <DetailField label="Open Orders" value={supplier.openOrders} />
          <DetailField label="Lead Time" value={`${supplier.leadTimeDays} days`} />
          <DetailField label="On-Time Delivery" value={`${supplier.onTimeDelivery}%`} />
          <DetailField label="Order Accuracy" value={`${supplier.orderAccuracy}%`} />
          <DetailField label="Defect Rate" value={`${supplier.defectRate}%`} />
          <DetailField
            label="Status"
            value={<StatusBadge status={supplier.status} tone={supplier.status === "active" ? "success" : "warning"} />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DetailSection title="Purchase Orders">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>{po.orderDate}</TableCell>
                      <TableCell>R {po.amount.toLocaleString("en-ZA")}</TableCell>
                      <TableCell>
                        <StatusBadge status={po.status} />
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
          <DetailSection title="Supplied Products">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Unit Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierProducts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.sku}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>R {p.unitCost.toLocaleString("en-ZA")}</TableCell>
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
