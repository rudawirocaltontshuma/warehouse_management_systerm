import Link from "next/link";

import { FlaskConical } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportCard() {
  return (
    <Card size="sm" className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 gap-1 px-4">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <FlaskConical className="size-3.5 text-amber-500" aria-hidden />
          Demo Mode
        </CardTitle>
        <CardDescription className="line-clamp-3">
          All warehouses, orders and inventory shown are fictional. See the{" "}
          <Link href="/about" className="text-foreground underline underline-offset-2">
            platform overview
          </Link>{" "}
          for details.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
