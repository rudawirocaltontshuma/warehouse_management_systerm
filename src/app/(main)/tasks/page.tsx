"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/wms/data-table";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { warehouseTasks } from "@/data/tasks";
import type { WarehouseTask } from "@/types/wms";

export default function TasksPage() {
  const columns: DataTableColumn<WarehouseTask>[] = [
    {
      id: "task",
      header: "Task",
      cell: (t) => <span className="font-medium">{t.taskNumber}</span>,
      sortValue: (t) => t.taskNumber,
    },
    { id: "type", header: "Type", cell: (t) => t.type },
    {
      id: "priority",
      header: "Priority",
      cell: (t) => (
        <StatusBadge
          status={t.priority}
          tone={t.priority === "Urgent" ? "danger" : t.priority === "High" ? "warning" : "neutral"}
        />
      ),
    },
    { id: "location", header: "Location", cell: (t) => <span className="font-mono text-xs">{t.location}</span> },
    { id: "worker", header: "Worker", cell: (t) => t.worker },
    { id: "created", header: "Created", cell: (t) => t.created, sortValue: (t) => t.created },
    { id: "due", header: "Due", cell: (t) => t.due },
    { id: "status", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        description="Every warehouse task across receiving, putaway, picking, packing and more."
        breadcrumbs={[{ label: "Workforce" }, { label: "Tasks" }]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/tasks/board">Board View</Link>
          </Button>
        }
      />
      <DataTable
        rows={warehouseTasks}
        columns={columns}
        searchAccessor={(t) => `${t.taskNumber} ${t.worker} ${t.location}`}
        searchPlaceholder="Search task, worker, location…"
        filters={[
          {
            id: "type",
            label: "Type",
            options: ["Receiving", "Putaway", "Picking", "Packing", "Cycle Count", "Transfer", "Loading"],
            accessor: (t) => t.type,
          },
          {
            id: "status",
            label: "Status",
            options: ["Queued", "Assigned", "In Progress", "Review", "Completed"],
            accessor: (t) => t.status,
          },
          {
            id: "priority",
            label: "Priority",
            options: ["Low", "Medium", "High", "Urgent"],
            accessor: (t) => t.priority,
          },
        ]}
        emptyTitle="No tasks found"
        pageSize={15}
      />
    </div>
  );
}
