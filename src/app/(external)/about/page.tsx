import Link from "next/link";

import { BarChart3, Boxes, Factory, Forklift, Package, ShoppingCart, Truck, Users, Warehouse } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/config/app-config";

const MODULES = [
  { name: "Receiving", icon: Truck, description: "Inbound shipments from expected arrival through completed receipt." },
  { name: "Putaway", icon: Boxes, description: "Move received stock from the dock into storage locations." },
  { name: "Picking", icon: Package, description: "Pick lists, zone routing and picker productivity." },
  { name: "Packing", icon: Package, description: "Pack station workflows and package previews." },
  { name: "Shipping", icon: Truck, description: "Dispatch, carrier tracking and delivery timelines." },
  { name: "Inventory", icon: Boxes, description: "Stock levels, movements, adjustments and cycle counts." },
  { name: "Orders", icon: ShoppingCart, description: "Sales orders, purchase orders and backorders." },
  { name: "Warehouses", icon: Warehouse, description: "Zones, aisles, bins and capacity utilization." },
  { name: "Suppliers", icon: Factory, description: "Supplier directory and delivery performance scorecards." },
  { name: "Workforce", icon: Users, description: "Workers, tasks, shifts and productivity analytics." },
  { name: "Logistics", icon: Forklift, description: "Shipments, carriers and delivery routes." },
  { name: "Analytics & Reports", icon: BarChart3, description: "Warehouse, inventory and fulfillment analytics." },
];

const STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "shadcn/ui",
  "Recharts",
  "Responsive Design",
  "Component Architecture",
  "Enterprise UX",
  "Data Visualization",
  "Advanced Tables",
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <div className="space-y-4 text-center">
        <Badge variant="outline" className="mx-auto">
          Portfolio Demonstration
        </Badge>
        <h1 className="font-semibold text-4xl tracking-tight">{APP_CONFIG.name}</h1>
        <p className="text-lg text-muted-foreground">{APP_CONFIG.tagline}</p>
        <p className="mx-auto max-w-2xl text-muted-foreground text-sm">
          This frontend-only warehouse management demonstration showcases modern enterprise application architecture,
          responsive UX, data visualization and operational workflow design using Next.js, TypeScript, Tailwind CSS and
          shadcn/ui.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Open the Demo</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com" target="_blank" rel="noreferrer">
              View Source
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-xl">Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <Card key={m.name}>
              <CardHeader>
                <m.icon className="size-5 text-muted-foreground" aria-hidden />
                <CardTitle className="text-base">{m.name}</CardTitle>
                <CardDescription>{m.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-xl">Technical Showcase</h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="bg-muted/40">
        <CardContent className="space-y-2 text-muted-foreground text-sm">
          <p className="font-medium text-foreground">Portfolio Disclaimer</p>
          <p>
            This project is a frontend-only Warehouse Management System demonstration created for portfolio purposes. It
            uses fictional mock data and does not connect to a production database, authentication provider, warehouse
            hardware, carrier service, ERP system or external business API.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
