import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/types/wms";

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  if (!events.length) {
    return <p className="text-muted-foreground text-sm">No activity recorded yet.</p>;
  }

  return (
    <ol className="relative flex flex-col gap-6 pl-6">
      <div className="absolute top-1 bottom-1 left-[7px] w-px bg-border" aria-hidden />
      {events.map((event, i) => (
        <li key={event.id} className="relative">
          <span
            className={cn(
              "absolute top-0.5 -left-6 flex size-3.5 items-center justify-center rounded-full border-2 border-background",
              i === events.length - 1 ? "bg-primary" : "bg-muted-foreground/60",
            )}
          >
            {i === events.length - 1 && <Check className="size-2 text-primary-foreground" aria-hidden />}
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="font-medium text-sm">{event.label}</p>
            <p className="text-muted-foreground text-xs">
              {event.timestamp}
              {event.actor ? ` · ${event.actor}` : ""}
            </p>
            {event.description && <p className="text-muted-foreground text-xs">{event.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
