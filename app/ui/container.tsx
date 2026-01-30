import { cx } from "@/lib/utils";

export function Container({
  className,
  children,
}: { className?: string } & React.PropsWithChildren) {
  return (
    <div className={cx("mx-auto max-w-240 px-4 sm:px-16", className)}>
      {children}
    </div>
  );
}
