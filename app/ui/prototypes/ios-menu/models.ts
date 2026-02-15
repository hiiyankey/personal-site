export type Direction = "top" | "bottom" | "left" | "right";
export type Anchor = "start" | "center" | "end";

export interface MenuRootProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: Direction;
  anchor?: Anchor;
}

export interface MenuContainerProps {
  children: React.ReactNode;
  // Size of the closed button state
  buttonSize?: number | { width: number; height: number };
  buttonRadius?: number;
  // Fixed width (open menu state)
  menuWidth?: number;
  menuRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface MenuTriggerProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface MenuContentProps {
  children: React.ReactNode;
  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface MenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  closeOnSelect?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface SubMenuProps {
  children: React.ReactNode;
  id: string;
}

export interface SubMenuTriggerProps {
  children: React.ReactNode | ((isActive: boolean) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export interface SubMenuContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  direction: Direction;
  anchor: Anchor;
  isOpenAnimationCompleteRef: React.RefObject<boolean>;
  activeSubmenu: string | null;
  setActiveSubmenu: (id: string | null) => void;
}

export interface SubMenuContextValue {
  id: string;
  triggerRef: React.RefObject<HTMLElement | null>;
}
