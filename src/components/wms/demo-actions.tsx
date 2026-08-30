"use client";

import type { ReactNode } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function DemoActionButton({
  children,
  message,
  description,
  variant = "outline",
  size = "sm",
  icon,
}: {
  children: ReactNode;
  message: string;
  description?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  icon?: ReactNode;
}) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() =>
        toast.success(message, {
          description: description ?? "This is a frontend-only demonstration — no data was changed.",
        })
      }
    >
      {icon}
      {children}
    </Button>
  );
}
