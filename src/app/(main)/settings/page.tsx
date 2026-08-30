"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/wms/page-header";
import { warehouses } from "@/data/warehouses";

function saveDemo() {
  toast.success("Preferences preview updated.", { description: "Settings are not persisted in this demo." });
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Warehouse, operational and personal preferences for the demo environment."
        breadcrumbs={[{ label: "Administration" }, { label: "Settings" }]}
      />
      <Tabs defaultValue="warehouse">
        <TabsList>
          <TabsTrigger value="warehouse">Warehouse Settings</TabsTrigger>
          <TabsTrigger value="operations">Operational Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="warehouse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Default Warehouse</CardTitle>
              <CardDescription>Choose which distribution centre loads by default.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Primary Warehouse</FieldLabel>
                <Select defaultValue={warehouses[0]?.id}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="dock-count">Default Dock Count</FieldLabel>
                <Input id="dock-count" type="number" defaultValue={5} />
                <FieldDescription>Number of receiving docks shown on the receiving board.</FieldDescription>
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operational Thresholds</CardTitle>
              <CardDescription>Configure alerting thresholds used across the demo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Low stock alerts</p>
                  <p className="text-muted-foreground text-xs">Notify when a SKU falls below its reorder point.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Shipment delay alerts</p>
                  <p className="text-muted-foreground text-xs">Notify when a shipment misses its expected delivery.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Cycle count variance alerts</p>
                  <p className="text-muted-foreground text-xs">Notify when a count exceeds the variance tolerance.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Preferences</CardTitle>
              <CardDescription>Preferences for Jordan Mitchell in this demo session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email notifications</p>
                  <p className="text-muted-foreground text-xs">Receive a daily summary of warehouse activity.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Compact tables</p>
                  <p className="text-muted-foreground text-xs">Show more rows per page across list views.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div>
        <Button onClick={saveDemo}>Save Demo</Button>
      </div>
    </div>
  );
}
