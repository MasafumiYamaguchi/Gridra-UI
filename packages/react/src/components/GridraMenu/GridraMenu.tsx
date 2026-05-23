import {
  useCallback,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";

export type GridraMenuOrientation = "vertical" | "horizontal";
export type GridraMenuSize = "sm" | "md" | "lg";

export interface GridraMenuCommandItem {
  id: string;
  label: ReactNode;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
}

export interface GridraMenuSeparatorItem {
  type: "separator";
  id?: string;
}

export type GridraMenuItem = GridraMenuCommandItem | GridraMenuSeparatorItem;

export interface GridraMenuItemState {
  active: boolean;
  disabled: boolean;
  destructive: boolean;
  hasHref: boolean;
  orientation: GridraMenuOrientation;
}

export interface GridraMenuProps extends HTMLAttributes<HTMLElement> {
  items: GridraMenuItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (nextId: string | undefined, previousId: string | undefined) => void;
  onAction?: (id: string) => void;
  renderItem?: (item: GridraMenuCommandItem, state: GridraMenuItemState) => ReactNode;
  orientation?: GridraMenuOrientation;
  size?: GridraMenuSize;
}

function isCommand(item: GridraMenuItem): item is GridraMenuCommandItem {
  return !("type" in item) || item.type !== "separator";
}

function normalizeActiveId(
  requestedId: string | undefined,
  commandItems: GridraMenuCommandItem[],
): string | undefined {
  if (requestedId == null) return undefined;
  const item = commandItems.find((c) => c.id === requestedId);
  if (!item || item.disabled) return undefined;
  return requestedId;
}

export function GridraMenu({
  activeId,
  "aria-label": ariaLabel = "Menu",
  className,
  defaultActiveId,
  items,
  onAction,
  onActiveIdChange,
  orientation = "vertical",
  renderItem,
  size = "md",
  ...props
}: GridraMenuProps) {
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const commandItems = useMemo(() => items.filter(isCommand), [items]);

  const enabledItems = useMemo(
    () => commandItems.filter((c) => !c.disabled),
    [commandItems],
  );

  const enabledIds = useMemo(
    () => enabledItems.map((c) => c.id),
    [enabledItems],
  );

  const safeDefaultActiveId = useMemo(
    () => normalizeActiveId(defaultActiveId, commandItems),
    [defaultActiveId, commandItems],
  );

  const [currentActiveId, setActiveId] = useControllableValue(
    activeId,
    safeDefaultActiveId,
    onActiveIdChange,
  );

  const safeActiveId = useMemo(
    () => normalizeActiveId(currentActiveId, commandItems),
    [currentActiveId, commandItems],
  );

  const activeIndex = useMemo(
    () => (safeActiveId ? enabledIds.indexOf(safeActiveId) : -1),
    [safeActiveId, enabledIds],
  );

  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const focusedIndexRef = useRef(safeActiveIndex);

  // Keep ref in sync when activeId changes externally
  focusedIndexRef.current = safeActiveIndex;

  const handleActivate = useCallback(
    (id: string) => {
      const item = commandItems.find((c) => c.id === id);
      if (!item || item.disabled) return;
      setActiveId(id);
      onAction?.(id);
    },
    [commandItems, setActiveId, onAction],
  );

  const focusItemById = useCallback(
    (id: string) => {
      const el = itemRefs.current.get(id);
      el?.focus();
    },
    [],
  );

  const clampIndex = useCallback(
    (index: number) => {
      if (enabledIds.length === 0) return 0;
      return Math.max(0, Math.min(index, enabledIds.length - 1));
    },
    [enabledIds.length],
  );

  const navigateByIndex = useCallback(
    (index: number) => {
      const clamped = clampIndex(index);
      const id = enabledIds[clamped];
      if (id) focusItemById(id);
    },
    [enabledIds, clampIndex, focusItemById],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (enabledIds.length === 0) return;

      const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

      const currentIndex = focusedIndexRef.current;

      switch (event.key) {
        case nextKey: {
          event.preventDefault();
          const next = (currentIndex + 1) % enabledIds.length;
          focusedIndexRef.current = next;
          navigateByIndex(next);
          break;
        }
        case prevKey: {
          event.preventDefault();
          const prev =
            (currentIndex - 1 + enabledIds.length) % enabledIds.length;
          focusedIndexRef.current = prev;
          navigateByIndex(prev);
          break;
        }
        case "Home": {
          event.preventDefault();
          focusedIndexRef.current = 0;
          navigateByIndex(0);
          break;
        }
        case "End": {
          event.preventDefault();
          focusedIndexRef.current = enabledIds.length - 1;
          navigateByIndex(enabledIds.length - 1);
          break;
        }
      }
    },
    [orientation, enabledIds, navigateByIndex],
  );

  const rootClassName = [
    "gridra-menu",
    `gridra-menu--${orientation}`,
    `gridra-menu--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (items.length === 0) {
    return (
      <nav aria-label={ariaLabel} className={rootClassName} {...props}>
        <ul className="gridra-menu__list" />
      </nav>
    );
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={rootClassName}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <ul className="gridra-menu__list" role="list">
        {items.map((item, index) => {
          if (!isCommand(item)) {
            return (
              <li
                className="gridra-menu__separator"
                key={item.id ?? `sep-${index}`}
                role="separator"
              />
            );
          }

          const isActive = item.id === safeActiveId;
          const tagClassName = [
            "gridra-menu__item",
            item.disabled ? "gridra-menu__item--disabled" : null,
            item.destructive ? "gridra-menu__item--destructive" : null,
            isActive ? "gridra-menu__item--active" : null,
          ]
            .filter(Boolean)
            .join(" ");

          const state: GridraMenuItemState = {
            active: isActive,
            disabled: !!item.disabled,
            destructive: !!item.destructive,
            hasHref: !!item.href,
            orientation,
          };

          const content = renderItem ? (
            renderItem(item, state)
          ) : (
            <span className="gridra-menu__item-label">{item.label}</span>
          );

          const refCallback = (el: HTMLElement | null) => {
            if (el) {
              itemRefs.current.set(item.id, el);
            } else {
              itemRefs.current.delete(item.id);
            }
          };

          if (item.href && !item.disabled) {
            return (
              <li className="gridra-menu__list-item" key={item.id}>
                <a
                  className={tagClassName}
                  href={item.href}
                  ref={refCallback}
                  tabIndex={isActive ? 0 : -1}
                  {...(isActive ? { "aria-current": "page" as const } : {})}
                >
                  {content}
                </a>
              </li>
            );
          }

          return (
            <li className="gridra-menu__list-item" key={item.id}>
              <button
                className={tagClassName}
                disabled={item.disabled}
                onClick={() => handleActivate(item.id)}
                ref={refCallback}
                tabIndex={isActive ? 0 : -1}
                type="button"
                {...(isActive ? { "aria-current": "page" as const } : {})}
              >
                {content}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
