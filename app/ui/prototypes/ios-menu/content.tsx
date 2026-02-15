"use client";

import { AnimatePresence, motion, type Variant } from "motion/react";
import { useCallback } from "react";
import { useMenuContext } from "./context";
import { useReducedMotion } from "./hooks/useReducedMotion";
import type { MenuContentProps } from "./models";
import {
  CONTENT_BLUR,
  CONTENT_ENTER_DELAY,
  contentTransitionConfig,
  reducedMotionSpring,
} from "./utils/animations";

export default function Content({
  children,
  onAnimationComplete,
  className = "",
  style,
}: MenuContentProps) {
  const { open, contentRef, direction, isOpenAnimationCompleteRef } =
    useMenuContext();
  const prefersReducedMotion = useReducedMotion();

  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { type: "spring" as const, ...contentTransitionConfig };

  const getOffset = (amount: number) => {
    // biome-ignore lint/style/useDefaultSwitchClause: shh!
    switch (direction) {
      case "top":
        return { x: 0, y: amount };
      case "bottom":
        return { x: 0, y: -amount };
      case "left":
        return { x: amount, y: 0 };
      case "right":
        return { x: -amount, y: 0 };
    }
  };

  const hiddenOffset = getOffset(8);
  const exitOffset = getOffset(30);
  const contentVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: prefersReducedMotion ? 0 : CONTENT_ENTER_DELAY },
    } as Variant,
    hidden: {
      opacity: 0,
      scale: 0.9,
      ...hiddenOffset,
      filter: prefersReducedMotion ? "blur(0px)" : `blur(${CONTENT_BLUR}px)`,
    } as Variant,
    exit: {
      opacity: 0,
      scale: 0.9,
      ...exitOffset,
      filter: prefersReducedMotion ? "blur(0px)" : `blur(${CONTENT_BLUR}px)`,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    } as Variant,
  };
  const setRef = useCallback(
    (node: HTMLDivElement) => {
      contentRef.current = node;
    },
    [contentRef]
  );

  const handelAnimationComplete = useCallback(
    (definition: string) => {
      if (definition === "visible") {
        isOpenAnimationCompleteRef.current = true;
      }
      onAnimationComplete?.();
    },
    [onAnimationComplete, isOpenAnimationCompleteRef]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate="visible"
          className={className}
          exit="exit"
          initial="hidden"
          key="menu-content"
          onAnimationComplete={handelAnimationComplete}
          ref={setRef}
          style={{ position: "relative", ...style }}
          transition={springConfig}
          variants={contentVariants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
