"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Container } from "./container";
import Content from "./content";
import { MenuContext } from "./context";
import { useClickOutside } from "./hooks/useClickOutside";
import { useControllable } from "./hooks/useControllable";
import { useEscapeKey } from "./hooks/useEscapeKey";
import { Item } from "./item";
import type { MenuRootProps } from "./models";
import { SubMenu } from "./submenu";
import { SubMenuContent } from "./submenu-content";
import { SubMenuTrigger } from "./submenu-trigger";
import Trigger from "./trigger";

export function Root({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  direction = "top",
  anchor: anchorProp = "start",
}: MenuRootProps) {
  const anchor =
    direction === "left" || direction === "right" ? "center" : anchorProp;
  const [open, setOpen] = useControllable({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const isOpenAnimationCompleteRef = useRef(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const handleSetOpen = useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        isOpenAnimationCompleteRef.current = false;
      }
      setOpen(newOpen);
    },
    [setOpen]
  );

  const contextValue = useMemo(
    () => ({
      open,
      setOpen: handleSetOpen,
      triggerRef,
      contentRef,
      direction,
      anchor,
      isOpenAnimationCompleteRef,
      activeSubmenu,
      setActiveSubmenu,
    }),
    [open, handleSetOpen, direction, anchor, activeSubmenu]
  );

  useClickOutside([triggerRef, contentRef], () => setOpen(false), open);
  useEscapeKey(() => setOpen(false), open);

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
}

export const Menu = Object.assign(Root, {
  Container,
  Trigger,
  Content,
  Item,
  SubMenu,
  SubMenuTrigger,
  SubMenuContent,
});
