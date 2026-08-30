"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/wms/page-header";
import { StatusBadge } from "@/components/wms/status-badge";
import { warehouseTasks } from "@/data/tasks";
import type { WarehouseTask, WarehouseTaskStatus } from "@/types/wms";

const COLUMNS: WarehouseTaskStatus[] = ["Queued", "Assigned", "In Progress", "Review", "Completed"];

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState<WarehouseTask[]>(() => warehouseTasks.slice(0, 40));

  const advance = (task: WarehouseTask) => {
    const idx = COLUMNS.indexOf(task.status);
    if (idx === COLUMNS.length - 1) return;
    const next = COLUMNS[idx + 1]!;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    toast.success(`${task.taskNumber} moved to ${next}.`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Task Board"
        description="Kanban view of warehouse tasks. Advance a card through the workflow."
        breadcrumbs={[{ label: "Workforce" }, { label: "Tasks", href: "/tasks" }, { label: "Board" }]}
      />
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
        {COLUMNS.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div key={status} className="flex w-72 shrink-0 flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">{status}</h2>
                <span className="text-muted-foreground text-xs">{columnTasks.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {columnTasks.map((task) => (
                  <Card key={task.id} className="gap-2 py-3">
                    <CardContent className="space-y-2 px-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{task.taskNumber}</span>
                        <StatusBadge
                          status={task.priority}
                          tone={
                            task.priority === "Urgent" ? "danger" : task.priority === "High" ? "warning" : "neutral"
                          }
                        />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {task.type} · {task.location}
                      </p>
                      <p className="text-muted-foreground text-xs">{task.worker}</p>
                      {status !== "Completed" && (
                        <Button size="sm" variant="outline" className="w-full" onClick={() => advance(task)}>
                          Advance <ChevronRight className="size-3.5" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {columnTasks.length === 0 && (
                  <p className="rounded-md border border-dashed p-4 text-center text-muted-foreground text-xs">
                    No tasks
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
