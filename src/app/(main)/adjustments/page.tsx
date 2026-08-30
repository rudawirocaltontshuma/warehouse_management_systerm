"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { stockAdjustments } from "@/data/adjustments";
import { products } from "@/data/products";
import type { AdjustmentReason, StockAdjustment } from "@/types/wms";

const REASONS: AdjustmentReason[] = ["Damage", "Count Difference", "Expiration", "Correction", "Other"];

export default function AdjustmentsPage() {
  const [open, setOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [reason, setReason] = useState<AdjustmentReason>("Correction");

  const columns: DataTableColumn<StockAdjustment>[] = [
    { id: "id", header: "Adjustment ID", cell: (a) => <span className="font-medium">{a.id.toUpperCase()}</span> },
    { id: "sku", header: "SKU", cell: (a) => a.sku },
    { id: "product", header: "Product", cell: (a) => a.productName },
    { id: "location", header: "Location", cell: (a) => a.locationCode },
    { id: "current", header: "Current Quantity", cell: (a) => a.currentQuantity },
    { id: "adjusted", header: "Adjusted Quantity", cell: (a) => a.adjustedQuantity },
    { id: "reason", header: "Reason", cell: (a) => a.reason },
    { id: "requestedBy", header: "Requested By", cell: (a) => a.requestedBy },
    { id: "date", header: "Date", cell: (a) => a.date, sortValue: (a) => a.date },
    { id: "status", header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Stock Adjustments"
        description="Review adjustment history and record a new demo adjustment."
        breadcrumbs={[{ label: "Inventory" }, { label: "Adjustments" }]}
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button>New Adjustment</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Record Stock Adjustment</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">
                <Field>
                  <FieldLabel htmlFor="adj-sku">
                    SKU <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="adj-sku"
                    list="sku-options"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. SKU-10482"
                  />
                  <datalist id="sku-options">
                    {products.slice(0, 30).map((p) => (
                      <option key={p.sku} value={p.sku} />
                    ))}
                  </datalist>
                  <FieldDescription>Enter or select the SKU to adjust.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="adj-qty">
                    Adjusted Quantity <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="adj-qty" type="number" placeholder="0" />
                </Field>
                <Field>
                  <FieldLabel>
                    Reason <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={reason} onValueChange={(v) => setReason(v as AdjustmentReason)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="adj-notes">Notes</FieldLabel>
                  <Textarea id="adj-notes" placeholder="Optional context for this adjustment…" />
                </Field>
              </div>
              <SheetFooter>
                <Button
                  onClick={() => {
                    setOpen(false);
                    setSku("");
                    toast.success("Demo adjustment recorded for this session.");
                  }}
                >
                  Save Demo Adjustment
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        }
      />
      <DataTable
        rows={stockAdjustments}
        columns={columns}
        searchAccessor={(a) => `${a.sku} ${a.productName} ${a.requestedBy}`}
        searchPlaceholder="Search SKU, product, requester…"
        filters={[
          { id: "reason", label: "Reason", options: REASONS, accessor: (a) => a.reason },
          { id: "status", label: "Status", options: ["Pending", "Approved", "Rejected"], accessor: (a) => a.status },
        ]}
        emptyTitle="No inventory adjustments found"
      />
    </div>
  );
}
