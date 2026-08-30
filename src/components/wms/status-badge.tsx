import { cn } from "@/lib/utils";
import type { BadgeTone } from "@/types/wms";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  info: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  neutral: "bg-muted text-muted-foreground border-border",
};

const STATUS_TONE_MAP: Record<string, BadgeTone> = {
  // success
  Completed: "success",
  Delivered: "success",
  Active: "success",
  Approved: "success",
  Received: "success",
  Paid: "success",
  "Ready to Fulfill": "success",
  "in-stock": "success",
  operational: "success",
  Packed: "success",
  // warning
  Pending: "warning",
  Scheduled: "warning",
  "On Break": "warning",
  Expected: "warning",
  Draft: "warning",
  "low-stock": "warning",
  overstock: "warning",
  "reduced-capacity": "warning",
  "Awaiting Inspection": "warning",
  "Partially Received": "warning",
  "Waiting on Supplier": "warning",
  "Partial Allocation": "warning",
  "Variance Review": "warning",
  "Count Difference": "warning",
  Delayed: "warning",
  "under-review": "warning",
  restricted: "warning",
  // danger
  Exception: "danger",
  Cancelled: "danger",
  Rejected: "danger",
  Failed: "danger",
  "out-of-stock": "danger",
  Inactive: "danger",
  "Off Shift": "neutral",
  maintenance: "danger",
  offline: "danger",
  inactive: "danger",
  // info
  "In Progress": "info",
  Picking: "info",
  Packing: "info",
  Shipped: "info",
  "In Transit": "info",
  "Out for Delivery": "info",
  Receiving: "info",
  Assigned: "info",
  Arrived: "info",
  Allocated: "info",
  "En Route": "info",
  Requested: "info",
  Submitted: "info",
  Refunded: "info",
  Review: "info",
};

export function toneForStatus(status: string): BadgeTone {
  return STATUS_TONE_MAP[status] ?? "neutral";
}

export function StatusBadge({ status, tone, className }: { status: string; tone?: BadgeTone; className?: string }) {
  const resolvedTone = tone ?? toneForStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 font-medium text-xs",
        TONE_CLASSES[resolvedTone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}
