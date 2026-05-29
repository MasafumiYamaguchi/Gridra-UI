import {
  cloneElement,
  isValidElement,
  useCallback,
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
import { useControllableValue } from "../../hooks/useControllableValue";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "../../internal/composeHandlers";
import { mergeRefs } from "../../internal/mergeRefs";
import { useDocumentEvent } from "../../internal/useDocumentEvent";
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

export interface GridraDropdownMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
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
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [activeIndex, setActiveIndex] = useState(0);
  const menuId = useId();

  const commandItems = useMemo(() => items.filter(isCommand), [items]);

  const enabledItems = useMemo(
    () => commandItems.filter((item) => !item.disabled),
    [commandItems],
  );

  const enabledIds = useMemo(
    () => enabledItems.map((item) => item.id),
    [enabledItems],
  );

  const clampIndex = useCallback(
    (index: number) => {
      if (enabledIds.length === 0) {
        return 0;
      }
      return Math.max(0, Math.min(index, enabledIds.length - 1));
    },
    [enabledIds.length],
  );

  const safeActiveIndex = useMemo(
    () => clampIndex(activeIndex),
    [activeIndex, clampIndex],
  );

  const openMenu = useCallback(() => {
    if (disabled) {
      return;
    }
    setCurrentOpen(true);
    setActiveIndex(0);
  }, [disabled, setCurrentOpen]);

  const close = useCallback(() => {
    setCurrentOpen(false);
    triggerRef.current?.focus();
  }, [setCurrentOpen]);

  const toggleOpen = useCallback(() => {
    if (currentOpen) {
      close();
    } else {
      openMenu();
    }
  }, [currentOpen, close, openMenu]);

  const activateItem = useCallback(
    (id: string) => {
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
    },
    [disabled, commandItems, onAction, closeOnAction, close],
  );

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

    requestAnimationFrame(() => {
      if (enabledIds.length === 0) {
        return;
      }
      const firstId = enabledIds[0];
      const el = itemRefs.current.get(firstId);
      el?.focus();
    });

    return () => {
      itemRefs.current.clear();
    };
  }, [currentOpen, enabledIds]);

  const focusItemByIndex = useCallback(
    (index: number) => {
      if (enabledIds.length === 0) {
        return;
      }
      const clamped = clampIndex(index);
      setActiveIndex(clamped);
      const id = enabledIds[clamped];
      const el = itemRefs.current.get(id);
      el?.focus();
    },
    [enabledIds, clampIndex],
  );

  const handleEscape = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && currentOpen) {
        event.preventDefault();
        close();
      }
    },
    [closeOnEscape, currentOpen, close],
  );

  const handleOutsidePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!closeOnOutsidePointerDown || !currentOpen) {
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
    },
    [closeOnOutsidePointerDown, currentOpen, close],
  );

  useDocumentEvent("keydown", handleEscape, currentOpen);
  useDocumentEvent("pointerdown", handleOutsidePointerDown, currentOpen, true);

  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
    },
    [enabledIds, safeActiveIndex, focusItemByIndex, activateItem, close],
  );

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
    },
    [disabled, currentOpen, openMenu, enabledIds.length],
  );

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

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <>
      {cloneElement(triggerElement, triggerProps)}
      {currentOpen && !disabled ? (
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
        </div>
      ) : null}
    </>
  );
}

