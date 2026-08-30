"use client";

import { useState } from "react";

import { Check, ChevronsUpDown, Warehouse as WarehouseIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { warehouses } from "@/data/warehouses";

export function WarehouseSelector() {
  const [activeId, setActiveId] = useState(warehouses[0]?.id);
  const active = warehouses.find((w) => w.id === activeId)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-48 justify-between">
          <span className="flex min-w-0 items-center gap-1.5">
            <WarehouseIcon className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {active.code} — {active.city}
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Switch warehouse</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {warehouses.map((w) => (
          <DropdownMenuItem
            key={w.id}
            onSelect={() => {
              setActiveId(w.id);
              toast.success(`Viewing ${w.name}`, { description: "Warehouse context updated for this session." });
            }}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{w.name}</span>
              <span className="text-muted-foreground text-xs">
                {w.city}, {w.province}
              </span>
            </span>
            {w.id === activeId && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
