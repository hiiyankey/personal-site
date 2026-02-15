"use client";

import { createContext, useContext } from "react";
import type { MenuContextValue, SubMenuContextValue } from "./models";

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error(
      "Menu components must be used within the <Menu.Root> component"
    );
  }
  return context;
}
export const SubMenuContext = createContext<SubMenuContextValue | null>(null);

export function useSubMenuContext() {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error(
      "SubMenu components must be used within the <SubMenu> component"
    );
  }
  return context;
}
