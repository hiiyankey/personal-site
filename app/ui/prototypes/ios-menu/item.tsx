import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { useMenuContext } from "./context";
import { useReducedMotion } from "./hooks/useReducedMotion";
import type { MenuItemProps } from "./models";
import { reducedMotionSpring, transitionConfig } from "./utils/animations";

export function Item({
  children,
  closeOnSelect = true,
  onSelect,
  disabled = false,
  className = "",
  style,
}: MenuItemProps) {
  const { setOpen, isOpenAnimationCompleteRef } = useMenuContext();
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { type: "spring" as const, ...transitionConfig };
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) {
        return;
      }
      event.preventDefault();
      onSelect?.();
      if (closeOnSelect) {
        setOpen(false);
      }
    },
    [disabled, onSelect, closeOnSelect, setOpen]
  );

  const handleMouseEnter = useCallback(() => {
    if (!isOpenAnimationCompleteRef.current) {
      return;
    }
    if (!disabled) {
      setIsHovered(true);
    }
  }, [disabled, isOpenAnimationCompleteRef]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      aria-disabled={disabled}
      className={className}
      data-disabled={disabled || undefined}
      data-highlighted={isHovered || undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="menuitem"
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        transformOrigin: "center center",
        userSelect: "none",
        ...style,
      }}
      transition={springConfig}
    >
      {children}
    </motion.div>
  );
}
