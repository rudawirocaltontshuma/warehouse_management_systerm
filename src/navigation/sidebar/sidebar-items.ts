import {
  BarChart3,
  Boxes,
  Factory,
  Forklift,
  LayoutDashboard,
  type LucideIcon,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [{ id: "dashboard", title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    id: 2,
    label: "Warehouse Operations",
    items: [
      {
        id: "warehouse-operations",
        title: "Warehouse Operations",
        icon: Forklift,
        subItems: [
          { id: "receiving", title: "Receiving", url: "/receiving" },
          { id: "putaway", title: "Putaway", url: "/putaway" },
          { id: "picking", title: "Picking", url: "/picking" },
          { id: "packing", title: "Packing", url: "/packing" },
          { id: "shipping", title: "Shipping", url: "/shipping" },
          { id: "returns", title: "Returns", url: "/returns" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Inventory",
    items: [
      {
        id: "inventory",
        title: "Inventory",
        icon: Boxes,
        subItems: [
          { id: "inventory-overview", title: "Inventory Overview", url: "/inventory" },
          { id: "stock-levels", title: "Stock Levels", url: "/stock-levels" },
          { id: "stock-movements", title: "Stock Movements", url: "/stock-movements" },
          { id: "adjustments", title: "Adjustments", url: "/adjustments" },
          { id: "cycle-counts", title: "Cycle Counts", url: "/cycle-counts" },
          { id: "transfers", title: "Transfers", url: "/transfers" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Orders",
    items: [
      {
        id: "orders-group",
        title: "Orders",
        icon: ShoppingCart,
        subItems: [
          { id: "orders", title: "Orders", url: "/orders" },
          { id: "sales-orders", title: "Sales Orders", url: "/sales-orders" },
          { id: "purchase-orders", title: "Purchase Orders", url: "/purchase-orders" },
          { id: "backorders", title: "Backorders", url: "/backorders" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Products",
    items: [
      {
        id: "products-group",
        title: "Products",
        icon: Package,
        subItems: [
          { id: "products", title: "Products", url: "/products" },
          { id: "categories", title: "Categories", url: "/categories" },
          { id: "product-locations", title: "Product Locations", url: "/product-locations" },
          { id: "barcodes", title: "Barcodes", url: "/barcodes" },
        ],
      },
    ],
  },
  {
    id: 6,
    label: "Warehouses",
    items: [
      {
        id: "warehouses-group",
        title: "Warehouses",
        icon: Warehouse,
        subItems: [
          { id: "warehouses", title: "Warehouses", url: "/warehouses" },
          { id: "zones", title: "Zones", url: "/zones" },
          { id: "aisles", title: "Aisles", url: "/aisles" },
          { id: "bins", title: "Bins", url: "/bins" },
        ],
      },
    ],
  },
  {
    id: 7,
    label: "Suppliers",
    items: [
      {
        id: "suppliers-group",
        title: "Suppliers",
        icon: Factory,
        subItems: [
          { id: "suppliers", title: "Suppliers", url: "/suppliers" },
          { id: "supplier-performance", title: "Supplier Performance", url: "/supplier-performance" },
        ],
      },
    ],
  },
  {
    id: 8,
    label: "Workforce",
    items: [
      {
        id: "workforce-group",
        title: "Workforce",
        icon: Users,
        subItems: [
          { id: "workers", title: "Workers", url: "/workers" },
          { id: "tasks", title: "Tasks", url: "/tasks" },
          { id: "productivity", title: "Productivity", url: "/productivity" },
          { id: "shifts", title: "Shifts", url: "/shifts" },
        ],
      },
    ],
  },
  {
    id: 9,
    label: "Logistics",
    items: [
      {
        id: "logistics-group",
        title: "Logistics",
        icon: Truck,
        subItems: [
          { id: "shipments", title: "Shipments", url: "/shipments" },
          { id: "carriers", title: "Carriers", url: "/carriers" },
          { id: "routes", title: "Delivery Routes", url: "/routes" },
        ],
      },
    ],
  },
  {
    id: 10,
    label: "Analytics",
    items: [
      {
        id: "analytics-group",
        title: "Analytics",
        icon: BarChart3,
        subItems: [
          { id: "warehouse-analytics", title: "Warehouse Analytics", url: "/analytics" },
          { id: "inventory-analytics", title: "Inventory Analytics", url: "/analytics/inventory" },
          { id: "productivity-analytics", title: "Productivity", url: "/productivity" },
          { id: "fulfillment-analytics", title: "Fulfillment", url: "/analytics/fulfillment" },
          { id: "reports", title: "Reports", url: "/reports" },
        ],
      },
    ],
  },
  {
    id: 11,
    label: "Administration",
    items: [
      {
        id: "administration-group",
        title: "Administration",
        icon: Settings,
        subItems: [
          { id: "warehouse-settings", title: "Warehouse Settings", url: "/settings?tab=warehouse" },
          { id: "operational-settings", title: "Operational Settings", url: "/settings?tab=operations" },
          { id: "preferences", title: "Preferences", url: "/settings?tab=preferences" },
        ],
      },
    ],
  },
];
