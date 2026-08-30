"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { products } from "@/data/products";
import type { Product } from "@/types/wms";

function BarcodePreview({ code }: { code: string }) {
  const bars = code.split("").map((digit, _i) => 2 + (Number(digit) % 5));
  return (
    <div className="flex h-8 items-end gap-[1px]" aria-hidden>
      {bars.map((height, i) => (
        <span key={i} style={{ height: `${height * 3}px` }} className="w-[2px] bg-foreground" />
      ))}
    </div>
  );
}

export default function BarcodesPage() {
  const columns: DataTableColumn<Product>[] = [
    { id: "sku", header: "SKU", cell: (p) => <span className="font-medium">{p.sku}</span>, sortValue: (p) => p.sku },
    { id: "product", header: "Product", cell: (p) => p.name },
    { id: "barcode", header: "Barcode", cell: (p) => <span className="font-mono text-xs">{p.barcode}</span> },
    { id: "type", header: "Barcode Type", cell: (p) => p.barcodeType },
    {
      id: "status",
      header: "Status",
      cell: (p) => <StatusBadge status={p.status} tone={p.status === "active" ? "success" : "neutral"} />,
    },
    {
      id: "preview",
      header: "Print Preview",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <BarcodePreview code={p.barcode} />
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.success("Print preview prepared.", { description: `${p.sku} label queued for the demo printer.` })
            }
          >
            Print Preview
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Barcodes"
        description="Manage barcode assignments and preview printable labels."
        breadcrumbs={[{ label: "Products" }, { label: "Barcodes" }]}
      />
      <DataTable
        rows={products}
        columns={columns}
        searchAccessor={(p) => `${p.sku} ${p.name} ${p.barcode}`}
        searchPlaceholder="Search SKU, product, barcode…"
        filters={[
          { id: "type", label: "Type", options: ["EAN-13", "UPC-A", "Code128"], accessor: (p) => p.barcodeType },
        ]}
        emptyTitle="No barcodes found"
        pageSize={15}
      />
    </div>
  );
}
