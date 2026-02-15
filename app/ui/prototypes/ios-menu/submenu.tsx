import { useMemo, useRef } from "react";
import { SubMenuContext } from "./context";
import type { SubMenuProps } from "./models";

export function SubMenu({ children, id }: SubMenuProps) {
  const triggerRef = useRef<HTMLElement>(null);

  const contextValue = useMemo(() => ({ id, triggerRef }), [id]);
  return (
    <SubMenuContext.Provider value={contextValue}>
      {children}
    </SubMenuContext.Provider>
  );
}
