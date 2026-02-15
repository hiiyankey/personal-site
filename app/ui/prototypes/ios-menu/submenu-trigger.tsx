import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMenuContext, useSubMenuContext } from "./context";
import { useReducedMotion } from "./hooks/useReducedMotion";
import type { SubMenuTriggerProps } from "./models";
import { reducedMotionSpring, transitionConfig } from "./utils/animations";

export function SubMenuTrigger({
  children,
  disabled = false,
  className = "",
  style,
}: SubMenuTriggerProps) {
  const { activeSubmenu, setActiveSubmenu, isOpenAnimationCompleteRef } =
    useMenuContext();
  const { id, triggerRef } = useSubMenuContext();

  const prefersReducedMotion = useReducedMotion();

  const isActive = activeSubmenu === id;

  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { type: "spring" as const, ...transitionConfig };

  const openScale = 1.06 / 0.96; // ≈ 1.104

  const [isElevated, setElevated] = useState(false);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (isActive) {
      wasActiveRef.current = true;
      setElevated(true);
    } else if (wasActiveRef.current) {
      const timeout = setTimeout(() => {
        setElevated(false);
        wasActiveRef.current = false;
      }, transitionConfig.visualDuration * 1000);
      return clearTimeout(timeout);
    }
  }, [isActive]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setActiveSubmenu(isActive ? null : id);
      }
    },
    [id, disabled, isActive, setActiveSubmenu]
  );

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) {
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveSubmenu(isActive ? null : id);
      } else if (e.key === "ArrowRight" && !isActive) {
        e.preventDefault();
        setActiveSubmenu(id);
      } else if ((e.key === "ArrowLeft" || e.key === "Escape") && !isActive) {
        e.preventDefault();
        setActiveSubmenu(null);
      }
    },
    [id, disabled, isActive, setActiveSubmenu]
  );
  const content =
    typeof children === "function" ? children(isActive) : children;
  return (
    <motion.button
      animate={{ scale: isActive ? openScale : 1 }}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-expanded={isActive}
      aria-haspopup="menu"
      className={className}
      data-disabled={disabled || undefined}
      data-elevated={isElevated || undefined}
      data-highlighted={
        isOpenAnimationCompleteRef.current ? undefined : undefined
      }
      initial={false}
      onClick={handleClick}
      onKeyDown={handleKeydown}
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      role="menuitem"
      style={{
        ...style,
        position: "relative",
        transformOrigin: "top center",
        zIndex: isElevated ? 20 : undefined,
        userSelect: "none",
      }}
      transition={springConfig}
    >
      {content}
    </motion.button>
  );
}
