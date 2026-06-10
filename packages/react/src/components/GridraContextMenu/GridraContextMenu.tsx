import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useControllableValue } from "../../hooks/useControllableValue";
import { composeHandlers } from "../../internal/composeHandlers";
import { mergeRefs } from "../../internal/mergeRefs";
import { getGridraThemeClassName, getPortalTarget } from "../../internal/theme";
import type {
  GridraDropdownMenuItem,
  GridraDropdownMenuSize,
} from "../GridraDropdownMenu/GridraDropdownMenu";

export type { GridraDropdownMenuItem };

export type GridraContextMenuSize = GridraDropdownMenuSize;

// HTML属性とぶつかるので、onChangeとchildrenは除外する
export interface GridraContextMenuProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  children: ReactElement<Record<string, unknown>>;
  items: GridraDropdownMenuItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  size?: GridraContextMenuSize;
  minWidth?: number | string;
  maxWidth?: number | string;
  disabled?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePointerDown?: boolean;
  closeOnAction?: boolean;
}

function isCommand(
  item: GridraDropdownMenuItem,
): item is Extract<GridraDropdownMenuItem, { id: string; label: ReactNode }> {
  return !("type" in item) || item.type !== "separator";
}

// clamp処理の共通化しのためのヘルパ
function clampIndex(index: number, itemCount: number) {
  return itemCount === 0 ? 0 : Math.max(0, Math.min(index, itemCount - 1));
}

export function GridraContextMenu({
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
  size = "md",
  style,
  ...props
}: GridraContextMenuProps) {
  const triggerElement = children;
  const targetRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const pointerCoordsRef = useRef({ top: 0, left: 0 });
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalMounted, setPortalMounted] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  // 1. コマンドアイテムだけを抽出
  const commandItems = useMemo(() => items.filter(isCommand), [items]);
  // 2. 有効なコマンドアイテムだけを抽出
  const enabledItems = useMemo(
    () => commandItems.filter((item) => !item.disabled),
    [commandItems],
  );
  // 3. 有効なアイテムのIDリストを作成
  const enabledIds = useMemo(
    () => enabledItems.map((item) => item.id),
    [enabledItems],
  );

  const safeActiveIndex = clampIndex(activeIndex, enabledIds.length);

  const close = useCallback(() => {
    setCurrentOpen(false);
    targetRef.current?.focus();
  }, [setCurrentOpen]);

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

  const focusItemByIndex = useCallback(
    (index: number) => {
      if (enabledIds.length === 0) {
        return;
      }
      const clamped = clampIndex(index, enabledIds.length);
      setActiveIndex(clamped);
      const id = enabledIds[clamped];
      const el = itemRefs.current.get(id);
      el?.focus();
    },
    [enabledIds],
  );

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

  const handleOutsidePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!closeOnOutsidePointerDown || !currentOpen) {
        return;
      }
      const target = event.target as Node | null;
      if (
        target &&
        !menuRef.current?.contains(target) &&
        !targetRef.current?.contains(target)
      ) {
        close();
      }
    },
    [closeOnOutsidePointerDown, currentOpen, close],
  );

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
  }, [currentOpen, closeOnEscape, close, handleOutsidePointerDown]);

  useLayoutEffect(() => {
    if (!currentOpen) {
      return;
    }

    const updatePosition = () => {
      const menu = menuRef.current;
      if (!menu) {
        return;
      }

      const menuRect = menu.getBoundingClientRect();
      const rawTop = pointerCoordsRef.current.top;
      const rawLeft = pointerCoordsRef.current.left;

      const nextLeft = Math.max(
        0,
        Math.min(rawLeft, window.innerWidth - menuRect.width),
      );
      const nextTop = Math.max(
        0,
        Math.min(rawTop, window.innerHeight - menuRect.height),
      );

      setCoords({ top: nextTop, left: nextLeft });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [currentOpen, items, size, minWidth, maxWidth]);

  const openAt = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled) {
        return;
      }
      pointerCoordsRef.current = { top: clientY, left: clientX };
      setActiveIndex(0);
      setCurrentOpen(true);
    },
    [disabled, setCurrentOpen],
  );

  const handleContextMenu = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      openAt(event.clientX, event.clientY);
    },
    [openAt],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) {
        return;
      }

      const isContextMenuKey = event.key === "ContextMenu";
      const isShiftF10 = event.key === "F10" && event.shiftKey;

      if (isContextMenuKey || isShiftF10) {
        event.preventDefault();
        const target = targetRef.current;
        if (target) {
          const rect = target.getBoundingClientRect();
          openAt(rect.left, rect.bottom);
        }
      }
    },
    [disabled, openAt],
  );

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

  const targetProps = {
    "aria-expanded": !disabled ? currentOpen : undefined,
    "aria-haspopup": "menu" as const,
    onContextMenu: composeHandlers(
      triggerElement.props.onContextMenu as
        | ((event: ReactMouseEvent) => void)
        | undefined,
      handleContextMenu,
    ),
    onKeyDown: composeHandlers(
      triggerElement.props.onKeyDown as
        | ((event: KeyboardEvent) => void)
        | undefined,
      handleKeyDown,
    ),
    ref: mergeRefs(
      (triggerElement as ReactElement & { ref?: unknown }).ref,
      (node: HTMLElement | null) => {
        targetRef.current = node;
      },
    ),
  };

  const menuClassName = [
    "gridra-root",
    getGridraThemeClassName(targetRef.current),
    "gridra-context-menu",
    "gridra-dropdown-menu",
    `gridra-dropdown-menu--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
      {cloneElement(triggerElement, targetProps)}
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
                    className={[
                      "gridra-dropdown-menu__item",
                      item.disabled
                        ? "gridra-dropdown-menu__item--disabled"
                        : null,
                      item.destructive
                        ? "gridra-dropdown-menu__item--destructive"
                        : null,
                      isActive ? "gridra-dropdown-menu__item--active" : null,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={item.disabled}
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
