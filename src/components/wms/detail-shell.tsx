import type { ReactNode } from "react";

import { PageHeader } from "./page-header";

export function DetailShell({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} actions={actions} />
      {children}
    </div>
  );
}

export function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}

export function DetailSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {title && <h2 className="mb-3 font-semibold text-base">{title}</h2>}
      {children}
    </div>
  );
}
