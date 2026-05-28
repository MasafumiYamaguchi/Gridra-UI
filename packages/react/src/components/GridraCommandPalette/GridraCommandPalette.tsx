import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useControllableValue } from "../../hooks/useControllableValue";
import { getGridraThemeClassName, getPortalTarget } from "../../internal/theme";

export type GridraCommandPaletteSize = "sm" | "md" | "lg";

const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

export interface GridraCommandPaletteCommandItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  destructive?: boolean;
}

export type GridraCommandPaletteSeparatorItem = {
  type: "separator";
  id?: string;
};

export type GridraCommandPaletteItem =
  | GridraCommandPaletteCommandItem
  | GridraCommandPaletteSeparatorItem;

export interface GridraCommandPaletteProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "title"> {
  items: GridraCommandPaletteItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  placeholder?: string;
  title?: ReactNode;
  emptyLabel?: ReactNode;
  size?: GridraCommandPaletteSize;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (next: string, previous: string) => void;
  closeOnAction?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

function isCommand(
  item: GridraCommandPaletteItem,
): item is GridraCommandPaletteCommandItem {
  return !("type" in item) || item.type !== "separator";
}

function itemMatchesQuery(item: GridraCommandPaletteCommandItem, query: string): boolean {
  if (!query) {
    return true;
  }
  const lower = query.toLowerCase();
  const fields = [
    getPlainSearchText(item.label),
    getPlainSearchText(item.description),
    item.group ?? "",
    ...(item.keywords ?? []),
  ];
  return fields.some((f) => f.toLowerCase().includes(lower));
}

function getPlainSearchText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return "";
}

export function GridraCommandPalette({
  className,
  closeOnAction = true,
  closeOnEscape = true,
  defaultOpen = false,
  defaultQuery = "",
  emptyLabel = "No commands found.",
  items,
  onAction,
  onOpenChange,
  onQueryChange,
  open,
  placeholder = "Search commands...",
  query,
  showCloseButton = true,
  size = "md",
  style,
  title = "Command Palette",
  ...props
}: GridraCommandPaletteProps) {
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [currentQuery, setCurrentQuery] = useControllableValue(query, defaultQuery, onQueryChange);
  const isQueryControlled = query !== undefined;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalMounted, setPortalMounted] = useState(false);
  const [portalThemeClassName, setPortalThemeClassName] = useState<string | undefined>(() =>
    getGridraThemeClassName(),
  );
  const titleId = useId();
  const inputId = useId();

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const commandItems = useMemo(() => items.filter(isCommand), [items]);

  const filteredCommands = useMemo(() => {
    if (!currentQuery) {
      return commandItems;
    }
    return commandItems.filter((item) => itemMatchesQuery(item, currentQuery));
  }, [commandItems, currentQuery]);

  const enabledFiltered = useMemo(
    () => filteredCommands.filter((item) => !item.disabled),
    [filteredCommands],
  );

  const enabledIds = useMemo(
    () => enabledFiltered.map((item) => item.id),
    [enabledFiltered],
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

  const close = useCallback(() => {
    setCurrentOpen(false);
    if (!isQueryControlled) {
      setCurrentQuery("");
    }
  }, [isQueryControlled, setCurrentOpen, setCurrentQuery]);

  const activateItem = useCallback(
    (id: string) => {
      const item = commandItems.find((c) => c.id === id);
      if (!item || item.disabled) {
        return;
      }
      onAction?.(id);
      if (closeOnAction) {
        close();
      }
    },
    [commandItems, onAction, closeOnAction, close],
  );

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

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setActiveIndex(0);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus();
      }
      previousFocusRef.current = null;
      itemRefs.current.clear();
    };
  }, [currentOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [currentQuery]);

  useLayoutEffect(() => {
    if (!currentOpen) {
      return;
    }
    setPortalThemeClassName(getGridraThemeClassName());
  }, [currentOpen]);

  const handleEscape = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && currentOpen) {
        event.preventDefault();
        close();
      }
    },
    [closeOnEscape, currentOpen, close],
  );

  const handleBackdropPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.target === event.currentTarget) {
        close();
      }
    },
    [close],
  );

  useEffect(() => {
    if (!currentOpen) {
      return;
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [currentOpen, handleEscape]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCurrentQuery(event.target.value);
    },
    [setCurrentQuery],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) {
          return;
        }

        const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first || !dialog.contains(document.activeElement)) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last || !dialog.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }

        event.stopPropagation();
        return;
      }

      if (enabledIds.length === 0) {
        return;
      }

      let handled = true;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          focusItemByIndex(safeActiveIndex + 1);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          focusItemByIndex(safeActiveIndex - 1);
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
        case "Enter": {
          event.preventDefault();
          const activeId = enabledIds[safeActiveIndex];
          if (activeId) {
            activateItem(activeId);
          }
          break;
        }
        default:
          handled = false;
      }

      if (handled) {
        event.stopPropagation();
      }
    },
    [enabledIds, safeActiveIndex, focusItemByIndex, activateItem],
  );

  const dialogClassName = [
    "gridra-command-palette",
    `gridra-command-palette--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const backdropClassName = [
    "gridra-root",
    portalThemeClassName,
    "gridra-command-palette__backdrop",
  ]
    .filter(Boolean)
    .join(" ");
  const portalTarget = getPortalTarget();

  const groups = useMemo(() => {
    const map = new Map<string, GridraCommandPaletteCommandItem[]>();
    for (const item of filteredCommands) {
      const key = item.group ?? "";
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [filteredCommands]);

  const hasGrouping = groups.some(([key]) => key !== "");

  return currentOpen && portalMounted && portalTarget
    ? createPortal(
        <div
          className={backdropClassName}
          onPointerDown={handleBackdropPointerDown}
        >
          <div
            {...props}
            aria-labelledby={titleId}
            aria-modal="true"
            className={dialogClassName}
            onKeyDown={handleKeyDown}
            ref={dialogRef}
            role="dialog"
            style={style}
          >
            <header className="gridra-command-palette__header">
              <h2 className="gridra-command-palette__title" id={titleId}>
                {title}
              </h2>
              {showCloseButton ? (
                <button
                  aria-label="Close"
                  className="gridra-command-palette__close"
                  onClick={close}
                  type="button"
                >
                  <span aria-hidden="true">×</span>
                </button>
              ) : null}
            </header>
            <div className="gridra-command-palette__search">
              <input
                autoComplete="off"
                className="gridra-command-palette__input"
                id={inputId}
                onChange={handleSearchChange}
                placeholder={placeholder}
                ref={inputRef}
                type="text"
                value={currentQuery}
              />
            </div>
            <div className="gridra-command-palette__list" ref={listRef}>
              {filteredCommands.length === 0 ? (
                <div className="gridra-command-palette__empty">
                  {emptyLabel}
                </div>
              ) : hasGrouping ? (
                groups.map(([group, groupItems]) => (
                  <div className="gridra-command-palette__group" key={group || "__ungrouped"}>
                    {group ? (
                      <div className="gridra-command-palette__group-label">
                        {group}
                      </div>
                    ) : null}
                    {groupItems.map((item) => {
                      const isActive = enabledIds[safeActiveIndex] === item.id;
                      return (
                        <button
                          className={[
                            "gridra-command-palette__item",
                            item.disabled
                              ? "gridra-command-palette__item--disabled"
                              : null,
                            item.destructive
                              ? "gridra-command-palette__item--destructive"
                              : null,
                            isActive ? "gridra-command-palette__item--active" : null,
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
                          tabIndex={isActive ? 0 : -1}
                          type="button"
                        >
                          <span className="gridra-command-palette__item-label">
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="gridra-command-palette__item-desc">
                              {item.description}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                filteredCommands.map((item) => {
                  const isActive = enabledIds[safeActiveIndex] === item.id;
                  return (
                    <button
                      className={[
                        "gridra-command-palette__item",
                        item.disabled
                          ? "gridra-command-palette__item--disabled"
                          : null,
                        item.destructive
                          ? "gridra-command-palette__item--destructive"
                          : null,
                        isActive ? "gridra-command-palette__item--active" : null,
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
                      tabIndex={isActive ? 0 : -1}
                      type="button"
                    >
                      <span className="gridra-command-palette__item-label">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="gridra-command-palette__item-desc">
                          {item.description}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>,
        portalTarget,
      )
    : null;
}

