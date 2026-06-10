import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useControllableValue } from "../../hooks/useControllableValue";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "../../internal/composeHandlers";
import { mergeRefs } from "../../internal/mergeRefs";
import { getGridraThemeClassName, getPortalTarget } from "../../internal/theme";
import { useFloatingPosition } from "../../internal/useFloatingPosition";

export type GridraDropdownMenuPlacement = "top" | "right" | "bottom" | "left";
export type GridraDropdownMenuSize = "sm" | "md" | "lg";

export type GridraDropdownMenuCommandItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
};

export type GridraDropdownMenuSeparatorItem = {
  type: "separator";
  id?: string;
};

export type GridraDropdownMenuItem =
  | GridraDropdownMenuCommandItem
  | GridraDropdownMenuSeparatorItem;

// HTML属性とぶつかるので、onChangeとchildrenは除外する
export interface GridraDropdownMenuProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  children: ReactElement<Record<string, unknown>>;
  items: GridraDropdownMenuItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  placement?: GridraDropdownMenuPlacement;
  size?: GridraDropdownMenuSize;
  minWidth?: number | string;
  maxWidth?: number | string;
  disabled?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePointerDown?: boolean;
  closeOnAction?: boolean;
}

const MENU_OFFSET = 4;

function isCommand(
  item: GridraDropdownMenuItem,
): item is GridraDropdownMenuCommandItem {
  return !("type" in item) || item.type !== "separator";
}

function clampIndex(index: number, itemCount: number) {
  return itemCount === 0 ? 0 : Math.max(0, Math.min(index, itemCount - 1));
}

export function GridraDropdownMenu({
  children,
  className,
  closeOnAction = true,
  closeOnEscape = true,
  closeOnOutsidePointerDown = true,
  defaultOpen = false,
  disabled = false,
  items,
  maxWidth,
  minWidth,
  onAction,
  onOpenChange,
  open,
  placement = "bottom",
  size = "md",
  style,
  ...props
}: GridraDropdownMenuProps) {
  const triggerElement = children;
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalMounted, setPortalMounted] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  // 1. コマンドアイテムだけを抽出
  const commandItems = useMemo(() => items.filter(isCommand), [items]);
  // 2. 有効なアイテムだけを抽出
  const enabledItems = useMemo(
    () => commandItems.filter((item) => !item.disabled),
    [commandItems],
  );
  // 3. 有効なアイテムのIDだけを抽出
  const enabledIds = useMemo(
    () => enabledItems.map((item) => item.id),
    [enabledItems],
  );

  const safeActiveIndex = clampIndex(activeIndex, enabledIds.length);

  const openMenu = () => {
    if (disabled) {
      return;
    }
    setCurrentOpen(true);
    setActiveIndex(0);
  };

  const close = () => {
    setCurrentOpen(false);
    triggerRef.current?.focus();
  };

  const toggleOpen = () => {
    if (currentOpen) {
      close();
    } else {
      openMenu();
    }
  };

  const activateItem = (id: string) => {
    if (disabled) {
      return;
    }
    const item = commandItems.find((c) => c.id === id);
    if (!item || item.disabled) {
      return;
    }
    onAction?.(id);
    if (closeOnAction) {
      close();
    }
  };

  const { coords, resolvedPlacement } = useFloatingPosition({
    alignment: "start",
    anchorRef: triggerRef,
    disabled,
    floatingRef: menuRef,
    offset: MENU_OFFSET,
    open: currentOpen,
    placement,
    updateDeps: [items, size, minWidth, maxWidth],
  });

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    if (enabledIds.length === 0) {
      return;
    }
    const firstId = enabledIds[0];
    const el = itemRefs.current.get(firstId);
    el?.focus();

    return () => {
      itemRefs.current.clear();
    };
  }, [currentOpen, enabledIds]);

  const focusItemByIndex = (index: number) => {
    if (enabledIds.length === 0) {
      return;
    }
    const clamped = clampIndex(index, enabledIds.length);
    setActiveIndex(clamped);
    const id = enabledIds[clamped];
    const el = itemRefs.current.get(id);
    el?.focus();
  };

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        close();
      }
    };

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!closeOnOutsidePointerDown) {
        return;
      }
      const target = event.target as Node | null;
      if (
        target &&
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsidePointerDown, true);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointerDown,
        true,
      );
    };
  }, [closeOnEscape, closeOnOutsidePointerDown, currentOpen, setCurrentOpen]);

  const handleMenuKeyDown = (event: KeyboardEvent) => {
    if (enabledIds.length === 0) {
      return;
    }

    let handled = true;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = (safeActiveIndex + 1) % enabledIds.length;
        focusItemByIndex(nextIndex);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prevIndex =
          (safeActiveIndex - 1 + enabledIds.length) % enabledIds.length;
        focusItemByIndex(prevIndex);
        break;
      }
      case "Home": {
        event.preventDefault();
        focusItemByIndex(0);
        break;
      }
      case "End": {
        event.preventDefault();
        focusItemByIndex(enabledIds.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        const activeId = enabledIds[safeActiveIndex];
        if (activeId) {
          activateItem(activeId);
        }
        break;
      }
      case "Tab": {
        close();
        break;
      }
      default:
        handled = false;
    }

    if (handled) {
      event.stopPropagation();
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ": {
        event.preventDefault();
        if (!currentOpen) {
          openMenu();
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (!currentOpen) {
          openMenu();
          setActiveIndex(enabledIds.length > 0 ? enabledIds.length - 1 : 0);
        }
        break;
      }
      default:
        break;
    }
  };

  const triggerProps = {
    "aria-controls": !disabled && currentOpen ? menuId : undefined,
    "aria-expanded": !disabled ? currentOpen : undefined,
    "aria-haspopup": "menu" as const,
    onClick: composeHandlers(
      triggerElement.props.onClick as ((event: MouseEvent) => void) | undefined,
      toggleOpen,
    ),
    onKeyDown: composeHandlers(
      triggerElement.props.onKeyDown as
        | ((event: KeyboardEvent) => void)
        | undefined,
      handleTriggerKeyDown,
    ),
    ref: mergeRefs(
      (triggerElement as ReactElement & { ref?: unknown }).ref,
      (node: HTMLElement | null) => {
        triggerRef.current = node;
      },
    ),
  };

  const menuClassName = cx(
    "gridra-portal-root",
    getGridraThemeClassName(triggerRef.current),
    "gridra-dropdown-menu",
    `gridra-dropdown-menu--${resolvedPlacement}`,
    `gridra-dropdown-menu--${size}`,
    className,
  );

  const menuStyle = useMemo(
    () =>
      ({
        ...style,
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        "--gridra-dropdown-menu-min-width":
          minWidth === undefined
            ? undefined
            : typeof minWidth === "number"
              ? `${minWidth}px`
              : minWidth,
        "--gridra-dropdown-menu-max-width":
          maxWidth === undefined
            ? undefined
            : typeof maxWidth === "number"
              ? `${maxWidth}px`
              : maxWidth,
      }) as CSSProperties,
    [coords.top, coords.left, minWidth, maxWidth, style],
  );
  const portalTarget = getPortalTarget();

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <>
      {cloneElement(triggerElement, triggerProps)}
      {currentOpen && !disabled && portalMounted && portalTarget
        ? createPortal(
            <div
              {...props}
              className={menuClassName}
              id={menuId}
              onKeyDown={handleMenuKeyDown}
              ref={menuRef}
              role="menu"
              style={menuStyle}
            >
              {items.map((item, index) => {
                if (!isCommand(item)) {
                  return (
                    <div
                      className="gridra-dropdown-menu__separator"
                      key={item.id ?? `sep-${index}`}
                      role="separator"
                    />
                  );
                }

                const isActive = enabledIds[safeActiveIndex] === item.id;

                return (
                  <button
                    className={cx(
                      "gridra-dropdown-menu__item",
                      item.disabled
                        ? "gridra-dropdown-menu__item--disabled"
                        : null,
                      item.destructive
                        ? "gridra-dropdown-menu__item--destructive"
                        : null,
                      isActive ? "gridra-dropdown-menu__item--active" : null,
                    )}
                    disabled={item.disabled}
                    id={item.id}
                    key={item.id}
                    onClick={() => activateItem(item.id)}
                    onMouseEnter={() => {
                      if (!item.disabled) {
                        const idx = enabledIds.indexOf(item.id);
                        if (idx !== -1) {
                          setActiveIndex(idx);
                        }
                      }
                    }}
                    ref={(el) => {
                      if (el) {
                        itemRefs.current.set(item.id, el);
                      } else {
                        itemRefs.current.delete(item.id);
                      }
                    }}
                    role="menuitem"
                    tabIndex={isActive ? 0 : -1}
                    type="button"
                  >
                    <span className="gridra-dropdown-menu__item-label">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}
