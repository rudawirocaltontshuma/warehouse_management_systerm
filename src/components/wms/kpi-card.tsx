import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  tone = "neutral",
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="flex flex-row items-center justify-between px-4">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
        {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden />}
      </CardHeader>
      <CardContent className="px-4">
        <div className="font-semibold text-2xl tabular-nums tracking-tight">{value}</div>
        {trend !== undefined && (
          <p
            className={cn(
              "mt-1 text-xs",
              tone === "positive" && "text-emerald-600 dark:text-emerald-400",
              tone === "negative" && "text-red-600 dark:text-red-400",
              tone === "neutral" && "text-muted-foreground",
            )}
          >
            {trend > 0 ? "+" : ""}
            {trend}% {trendLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
