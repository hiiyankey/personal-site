"use client";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { cx, useIsMobile } from "@/lib/utils";

export function Stage({ children, className }: React.ComponentProps<"div">) {
  const isMobile = useIsMobile();
  return (
    <div
      className={cx(
        "min-h-50 flex-center rounded-12 bg-gray-2 shadow-border-inset",
        className
      )}
      data-stage
    >
      {isMobile ? (
        <p className="flex items-center whitespace-nowrap rounded-6 bg-red/6 px-3 py-1 text-14 text-red">
          <span className="mr-2">
            <InfoCircledIcon />
          </span>
          Use desktop only
        </p>
      ) : (
        children
      )}
    </div>
  );
}
