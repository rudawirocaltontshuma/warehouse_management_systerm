"use client";

import { useState } from "react";

import Link from "next/link";

import { Bell, CheckCheck, CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notifications as seedNotifications } from "@/data/notifications";
import { cn } from "@/lib/utils";
import type { NotificationSeverity } from "@/types/wms";

const ICONS: Record<NotificationSeverity, typeof Info> = {
  info: Info,
  warning: TriangleAlert,
  danger: CircleAlert,
  success: CircleCheck,
};

const COLORS: Record<NotificationSeverity, string> = {
  info: "text-blue-500",
  warning: "text-amber-500",
  danger: "text-red-500",
  success: "text-emerald-500",
};

export function NotificationsPopover() {
  const [items, setItems] = useState(seedNotifications);
  const unread = items.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label={`Notifications (${unread} unread)`} className="relative">
          <Bell />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <p className="font-medium text-sm">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            <CheckCheck data-icon="inline-start" className="size-3.5" />
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-80">
          <ul className="divide-y">
            {items.map((n) => {
              const Icon = ICONS[n.severity];
              return (
                <li key={n.id}>
                  <Link
                    href={n.link ?? "/dashboard"}
                    className={cn("flex gap-2.5 px-3 py-2.5 text-sm hover:bg-accent", !n.read && "bg-accent/40")}
                    onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                  >
                    <Icon className={cn("mt-0.5 size-4 shrink-0", COLORS[n.severity])} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block leading-snug">{n.message}</span>
                      <span className="text-muted-foreground text-xs">{n.timestamp}</span>
                    </span>
                    {!n.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
