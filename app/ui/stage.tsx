"use client";
import { cx, useIsMobile } from "@/lib/utils";

export function Stage({ children, className }: React.ComponentProps<"div">) {
  const isMobile = useIsMobile();
  return (
    <div
      className={cx(
        "h-80 flex-center rounded-12 bg-gray-2 shadow-border-inset",
        className
      )}
      data-stage
    >
      {isMobile ? "Use desktop only" : children}
    </div>
  );
}
