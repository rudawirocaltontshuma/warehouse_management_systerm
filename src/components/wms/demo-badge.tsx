import { FlaskConical } from "lucide-react";

export function DemoModeBadge() {
  return (
    <span
      title="All data shown is fictional demonstration data — Nexora WMS is a frontend-only portfolio project."
      className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-medium text-amber-600 text-xs dark:text-amber-400"
    >
      <FlaskConical className="size-3.5" aria-hidden />
      <span className="hidden sm:inline">DEMO MODE</span>
    </span>
  );
}
