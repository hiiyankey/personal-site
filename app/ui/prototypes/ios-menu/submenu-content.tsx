import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMenuContext, useSubMenuContext } from "./context";
import { useReducedMotion } from "./hooks/useReducedMotion";
import type { SubMenuContentProps } from "./models";
import {
  CONTENT_BLUR,
  reducedMotionSpring,
  transitionConfig,
} from "./utils/animations";

export function SubMenuContent({
  children,
  className,
  style,
}: SubMenuContentProps) {
  const {
    activeSubmenu,
    setActiveSubmenu,
    contentRef: mainContentRef,
  } = useMenuContext();
  const { id, triggerRef } = useSubMenuContext();
  const prefersReducedMotion = useReducedMotion();

  const isActive = activeSubmenu === id;

  const subMenuRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const [triggerTop, setTriggerTop] = useState(0);
  const [triggerHeight, setTriggerHeight] = useState(44);

  const [measuredHeight, setMeasuredHeight] = useState(triggerHeight);

  useLayoutEffect(() => {
    if (isActive && triggerRef.current) {
      setTriggerTop(triggerRef.current.offsetTop);
      setTriggerHeight(triggerRef.current.offsetHeight);
    }
  }, [isActive, triggerRef]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  useLayoutEffect(() => {
    if (isActive && measureRef.current) {
      setMeasuredHeight(measureRef.current.offsetHeight);
    }
  }, [isActive, children, triggerHeight]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (subMenuRef.current?.contains(target)) {
        return;
      }

      if (triggerRef.current?.contains(target)) {
        return;
      }

      if (mainContentRef.current?.contains(target)) {
        event.stopPropagation();
        setActiveSubmenu(null);
        return;
      }

      setActiveSubmenu(null);
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isActive, setActiveSubmenu, mainContentRef]);

  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { type: "spring" as const, ...transitionConfig };

  const contentSpringConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : {
        type: "spring" as const,
        visualDuration: transitionConfig.visualDuration * 0.85,
        bounce: transitionConfig.bounce,
      };

  const contentVariants = {
    hidden: {
      opacity: 0,
      filter: prefersReducedMotion ? "blur(0px)" : `blur(${CONTENT_BLUR}px)`,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        ...contentSpringConfig,
        delay: 0.05,
      },
    },
    exit: {
      opacity: 0,
      filter: prefersReducedMotion ? "blur(0px)" : `blur(${CONTENT_BLUR}px)`,
      transition: {
        duration: 0.15,
      },
    },
  };

  const openScale = 1.06 / 0.96; // ≈ 1.104

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          animate={{
            height: measuredHeight,
            scale: openScale,
            opacity: 1,
            pointerEvents: "auto" as const,
          }}
          className={className}
          exit={{
            height: triggerHeight,
            scale: 1,
            opacity: 0,
            pointerEvents: "none" as const,
          }}
          initial={{
            height: triggerHeight,
            scale: 1,
            opacity: 1,
            pointerEvents: "auto" as const,
          }}
          ref={subMenuRef}
          style={{
            ...style,
            position: "absolute",
            top: triggerTop,
            left: 0,
            right: 0,
            zIndex: 10,
            overflow: "hidden",
            transformOrigin: "top center",
            willChange: "transform, height, opacity",
            boxSizing: "content-box",
          }}
          transition={{
            height: springConfig,
            scale: springConfig,
            opacity: { duration: 0.15 },
          }}
        >
          <div ref={measureRef}>
            <div aria-hidden="true" style={{ height: triggerHeight + 4 }} />
            <motion.div
              animate="visible"
              exit="exit"
              initial="hidden"
              variants={contentVariants}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
