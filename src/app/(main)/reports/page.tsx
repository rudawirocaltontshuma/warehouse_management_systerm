"use client";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/wms/page-header";
import { reports } from "@/data/reports";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Report Center"
        description="Operational and inventory reports across the Nexora WMS network."
        breadcrumbs={[{ label: "Analytics" }, { label: "Reports" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline">{report.category}</Badge>
                <span className="text-muted-foreground text-xs">Updated {report.lastUpdated}</span>
              </div>
              <CardTitle className="text-base">{report.name}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardFooter className="gap-2">
              <Button size="sm" onClick={() => toast.success("Report preview opened.", { description: report.name })}>
                View Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast.success("Export preview prepared.", { description: "This demo does not generate a real file." })
                }
              >
                Export Preview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
