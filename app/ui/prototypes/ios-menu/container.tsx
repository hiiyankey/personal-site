/** biome-ignore-all lint/style/noNestedTernary: shh! */
import { motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMenuContext } from "./context";
import { useReducedMotion } from "./hooks/useReducedMotion";
import type { Anchor, Direction, MenuContainerProps } from "./models";
import { reducedMotionSpring, transitionConfig } from "./utils/animations";

function getPositionStyles(direction: Direction): React.CSSProperties {
  const styles: React.CSSProperties = {
    position: "absolute",
  };

  // Direction determines which edge the trigger anchors to
  // biome-ignore lint/style/useDefaultSwitchClause: shh!
  switch (direction) {
    case "top":
      styles.bottom = 0;
      styles.left = 0;
      break;
    case "bottom":
      styles.top = 0;
      styles.left = 0;
      break;
    case "left":
      styles.right = 0;
      styles.bottom = 0;
      break;
    case "right":
      styles.left = 0;
      styles.bottom = 0;
      break;
  }

  return styles;
}

function getAnchorOffset(
  direction: Direction,
  anchor: Anchor,
  menuWidth: number,
  menuHeight: number,
  buttonWidth: number,
  buttonHeight: number
) {
  if (anchor === "start") {
    return { x: 0, y: 0 };
  }

  const offsetAmount = anchor === "center" ? 0.5 : 1;

  if (direction === "top" || direction === "bottom") {
    // Horizontal offset for vertical menus
    const xOffset = -(menuWidth - buttonWidth) * offsetAmount;
    return { x: xOffset, y: 0 };
  }
  // Vertical offset for horizontal menus
  const yOffset = (menuHeight - buttonHeight) * offsetAmount;
  return { x: 0, y: yOffset };
}

function getTransformOrigin(direction: Direction, anchor: Anchor): string {
  const vertical =
    direction === "top" ? "bottom" : direction === "bottom" ? "top" : "center";
  const horizontal =
    direction === "left" ? "right" : direction === "right" ? "left" : "center";

  if (direction === "top" || direction === "bottom") {
    const h =
      anchor === "start" ? "left" : anchor === "end" ? "right" : "center";
    return `${h} ${vertical}`;
  }
  const v = anchor === "start" ? "bottom" : anchor === "end" ? "top" : "center";
  return `${horizontal} ${v}`;
}

function getAnimationOffset(direction: Direction, amount: number) {
  // biome-ignore lint/style/useDefaultSwitchClause: shh!
  switch (direction) {
    case "top":
      return { y: -amount };
    case "bottom":
      return { y: amount };
    case "left":
      return { x: -amount };
    case "right":
      return { x: amount };
  }
}

export function Container({
  children,
  buttonSize = 40,
  buttonRadius,
  menuWidth = 200,
  menuRadius = 24,
  className = "",
  style,
}: MenuContainerProps) {
  const { open, setOpen, direction, anchor, activeSubmenu } = useMenuContext();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { type: "spring" as const, ...transitionConfig };

  const buttonWidth =
    typeof buttonSize === "number" ? buttonSize : buttonSize.width;
  const buttonHeight =
    typeof buttonSize === "number" ? buttonSize : buttonSize.height;
  const [measuredHeight, setMeasuredHeight] = useState<number>(buttonHeight);
  const [submenuStylesActive, setSubmenuStylesActive] = useState(false);
  const wasSubMenuActiveRef = useRef(false);
  useEffect(() => {
    if (activeSubmenu) {
      wasSubMenuActiveRef.current = true;
      setSubmenuStylesActive(true);
    } else if (wasSubMenuActiveRef.current) {
      const timeout = setTimeout(() => {
        wasSubMenuActiveRef.current = true;
        setSubmenuStylesActive(true);
      }, transitionConfig.visualDuration * 1000);
      return clearTimeout(timeout);
    }
  }, [activeSubmenu]);

  useLayoutEffect(() => {
    if (open && measureRef.current) {
      const height = measureRef.current.offsetHeight;
      setMeasuredHeight(height);
    }
  }, [open]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!open) {
        e.preventDefault();
        setOpen(true);
      }
    },
    [open, setOpen]
  );

  const closedRadius = buttonRadius ?? Math.min(buttonWidth, buttonHeight) / 2;
  const positionStyles = getPositionStyles(direction);
  const transformOrigin = getTransformOrigin(direction, anchor);
  const liftAmount = buttonHeight * 0.75;
  const directionOffset = getAnimationOffset(direction, liftAmount);
  const anchorOffset = getAnchorOffset(
    direction,
    anchor,
    menuWidth,
    measuredHeight,
    buttonWidth,
    buttonHeight
  );
  const openOffset = {
    x: (directionOffset.x || 0) + anchorOffset.x,
    y: (directionOffset.y || 0) + anchorOffset.y,
  };
  return (
    <div
      style={{
        position: "relative",
        width: buttonWidth,
        height: buttonHeight,
      }}
    >
      <motion.div
        animate={{
          width: open ? menuWidth : buttonWidth,
          height: open ? measuredHeight : buttonHeight,
          borderRadius: open ? menuRadius : closedRadius,
          x: open ? openOffset.x : 0,
          y: open ? openOffset.y : 0,
          scale: activeSubmenu ? 0.96 : 1,
          boxShadow: open
            ? "var(--shadow-border-medium)"
            : "var(--shadow-border-small)",
        }}
        className={className}
        initial={false}
        onClick={handleClick}
        ref={contentRef}
        style={{
          ...positionStyles,
          cursor: open ? "default" : "pointer",
          overflow: submenuStylesActive ? "visible" : "hidden",
          transformOrigin: submenuStylesActive
            ? "center center"
            : transformOrigin,
          zIndex: open ? 50 : "auto",
          willChange: "transform",
          ...style,
        }}
        transition={springConfig}
      >
        <div ref={measureRef}>{children}</div>
      </motion.div>
    </div>
  );
}
