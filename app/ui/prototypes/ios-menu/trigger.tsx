import { AnimatePresence, motion, type Variant } from "motion/react";
import { type RefObject, useCallback } from "react";
import { useMenuContext } from "./context";
import { useReducedMotion } from "./hooks/useReducedMotion";
import type { MenuTriggerProps } from "./models";
import {
  contentTransitionConfig,
  reducedMotionSpring,
  TRIGGER_BLUR,
} from "./utils/animations";

export default function Trigger({
  children,
  disabled = false,
  className = "",
  style,
}: MenuTriggerProps) {
  const { open, setOpen, triggerRef } = useMenuContext();
  const prefersReducedMotion = useReducedMotion();

  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { type: "spring" as const, ...contentTransitionConfig };

  const triggerVariants = {
    visible: { opacity: 1, filter: "blur(0px)" } as Variant,
    hidden: {
      opacity: 0,
      filter: prefersReducedMotion ? "blur(0px)" : `blur(${TRIGGER_BLUR}px)`,
    } as Variant,
  };
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // ...
      if (disabled) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      setOpen(!open);
    },
    [open, setOpen, disabled]
  );

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent) => {
      // ...
      if (disabled) {
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
    },
    [setOpen, disabled]
  );
  return (
    <AnimatePresence initial={false}>
      {!open && (
        <motion.button
          animate="visible"
          className={className}
          exit="hidden"
          initial="hidden"
          key="menu-trigger"
          onClick={handleClick}
          onKeyDown={handleKeydown}
          ref={triggerRef as RefObject<HTMLButtonElement>}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            ...style,
          }}
          tabIndex={disabled ? -1 : 0}
          transition={springConfig}
          type="button"
          variants={triggerVariants}
        >
          {children}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
