"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Boxes, Package, Search, ShoppingCart, Truck, Users, Warehouse as WarehouseIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { inventory } from "@/data/inventory";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { shipments } from "@/data/shipping";
import { suppliers } from "@/data/suppliers";
import { warehouses } from "@/data/warehouses";
import { workers } from "@/data/workers";
import type { NavMainItem } from "@/navigation/sidebar/sidebar-items";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

type SearchItem = {
  id: string;
  group: string;
  label: string;
  sublabel?: string;
  url: string;
  icon?: NavMainItem["icon"];
  disabled?: boolean;
  newTab?: boolean;
};

const sidebarGroupLabels = new Set(sidebarItems.flatMap((group) => (group.label ? [group.label] : [])));

function _getSubItemGroup(groupLabel: string | undefined, itemTitle: string) {
  return sidebarGroupLabels.has(itemTitle) ? (groupLabel ?? "Other") : itemTitle;
}

const navItems: SearchItem[] = sidebarItems.flatMap((group) =>
  group.items.flatMap((item) => {
    if (item.subItems) {
      return item.subItems.map((sub) => ({
        id: sub.id,
        group: "Navigation",
        label: sub.title,
        url: sub.url,
        icon: item.icon,
        disabled: sub.disabled,
        newTab: sub.newTab,
      }));
    }
    return [
      {
        id: item.id,
        group: "Navigation",
        label: item.title,
        url: item.url,
        icon: item.icon,
        disabled: item.disabled,
        newTab: item.newTab,
      },
    ];
  }),
);

const entitySearchItems: SearchItem[] = [
  ...products.slice(0, 60).map((p) => ({
    id: `product-${p.id}`,
    group: "Products",
    label: p.name,
    sublabel: p.sku,
    url: `/products/${p.id}`,
    icon: Package,
  })),
  ...inventory.slice(0, 40).map((i) => ({
    id: `inv-${i.id}`,
    group: "Inventory",
    label: `${i.sku} — ${i.locationCode}`,
    sublabel: `${i.onHand} on hand`,
    url: "/inventory",
    icon: Boxes,
  })),
  ...orders.slice(0, 40).map((o) => ({
    id: `order-${o.id}`,
    group: "Orders",
    label: o.orderNumber,
    sublabel: o.customer,
    url: `/orders/${o.id}`,
    icon: ShoppingCart,
  })),
  ...shipments.slice(0, 40).map((s) => ({
    id: `shipment-${s.id}`,
    group: "Shipments",
    label: s.shipmentNumber,
    sublabel: `${s.customer} · ${s.carrier}`,
    url: `/shipments/${s.id}`,
    icon: Truck,
  })),
  ...warehouses.map((w) => ({
    id: `wh-${w.id}`,
    group: "Warehouses",
    label: w.name,
    sublabel: w.city,
    url: `/warehouses/${w.id}`,
    icon: WarehouseIcon,
  })),
  ...suppliers.slice(0, 30).map((s) => ({
    id: `sup-${s.id}`,
    group: "Suppliers",
    label: s.name,
    sublabel: s.supplierId,
    url: `/suppliers/${s.id}`,
    icon: Users,
  })),
  ...workers.slice(0, 30).map((w) => ({
    id: `wrk-${w.id}`,
    group: "Workers",
    label: w.name,
    sublabel: w.role,
    url: `/workers/${w.id}`,
    icon: Users,
  })),
];

const searchItems: SearchItem[] = [...navItems, ...entitySearchItems];

function getAvailableItems(items: SearchItem[]) {
  return items.filter((item) => !item.disabled).slice(0, 8);
}

const recommendations = getAvailableItems(navItems);

function groupBy(items: SearchItem[]) {
  const groups = [...new Set(items.map((item) => item.group))];
  return groups.map((group) => ({
    group,
    items: items.filter((item) => item.group === group).slice(0, 8),
  }));
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "j") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) setQuery("");
  };

  const handleSelect = (item: SearchItem) => {
    if (item.disabled) return;
    handleOpenChange(false);
    if (item.newTab) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.url);
    }
  };

  const filtered = query
    ? searchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.sublabel?.toLowerCase().includes(query.toLowerCase()),
      )
    : recommendations;

  const renderGroups = (items: SearchItem[]) =>
    groupBy(items).map(({ group, items: groupItems }, index) => (
      <React.Fragment key={group}>
        {index > 0 && <CommandSeparator />}
        <CommandGroup heading={group}>
          {groupItems.map((item) => (
            <CommandItem
              disabled={item.disabled}
              key={`${group}-${item.id}`}
              value={`${item.group} ${item.label} ${item.sublabel ?? ""}`}
              onSelect={() => handleSelect(item)}
            >
              <span className="flex min-w-0 items-center gap-2">
                {item.icon && <item.icon />}
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{item.label}</span>
                  {item.sublabel && <span className="truncate text-muted-foreground text-xs">{item.sublabel}</span>}
                </span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </React.Fragment>
    ));

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        variant="link"
        className="px-0! font-normal text-muted-foreground hover:no-underline"
      >
        <Search data-icon="inline-start" />
        <span className="hidden sm:inline">Search products, orders, shipments…</span>
        <span className="sm:hidden">Search</span>
        <kbd className="hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px] sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <Command>
          <CommandInput
            placeholder="Search products, SKUs, orders, shipments, suppliers…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {renderGroups(filtered)}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
