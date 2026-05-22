import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";

export type GridraTabsOrientation = "horizontal" | "vertical";
export type GridraTabsSize = "sm" | "md" | "lg";
export type GridraTabsVariant = "line" | "boxed";
export type GridraTabsActivationMode = "automatic" | "manual";

export interface GridraTabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface GridraTabsProps extends HTMLAttributes<HTMLDivElement> {
  items: GridraTabItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectionChange?: (nextId: string, previousId: string | null) => void;
  orientation?: GridraTabsOrientation;
  size?: GridraTabsSize;
  variant?: GridraTabsVariant;
  activationMode?: GridraTabsActivationMode;
}

export function GridraTabs({
  className,
  activationMode = "automatic",
  defaultSelectedId,
  items,
  onSelectionChange,
  orientation = "horizontal",
  selectedId,
  size = "md",
  variant = "line",
  ...props
}: GridraTabsProps) {
  const baseId = useId();
  const enabledIds = useMemo(
    () => items.filter((item) => !item.disabled).map((item) => item.id),
    [items],
  );

  const fallbackId = enabledIds[0] ?? "";

  const [currentId, setCurrentId] = useControllableValue(
    selectedId,
    enabledIds.includes(defaultSelectedId ?? "") ? defaultSelectedId! : fallbackId,
    onSelectionChange,
  );

  const safeSelectedId = enabledIds.includes(currentId) ? currentId : fallbackId;

  const [focusedIndex, setFocusedIndex] = useState(
    () => enabledIds.indexOf(safeSelectedId),
  );

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const idx = enabledIds.indexOf(safeSelectedId);
    setFocusedIndex(idx >= 0 ? idx : 0);
  }, [safeSelectedId, enabledIds]);

  const enabledCount = enabledIds.length;

  const clampIndex = useCallback(
    (index: number) => {
      if (enabledCount === 0) return 0;
      return ((index % enabledCount) + enabledCount) % enabledCount;
    },
    [enabledCount],
  );

  const focusTab = useCallback(
    (index: number) => {
      const clamped = clampIndex(index);
      setFocusedIndex(clamped);
      const id = enabledIds[clamped];
      tabRefs.current.get(id)?.focus();

      if (activationMode === "automatic") {
        setCurrentId(id);
      }
    },
    [clampIndex, enabledIds, activationMode, setCurrentId],
  );

  const selectTab = useCallback(
    (id: string) => {
      if (!enabledIds.includes(id)) return;
      setCurrentId(id);
      setFocusedIndex(enabledIds.indexOf(id));
    },
    [enabledIds, setCurrentId],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isHorizontal = orientation === "horizontal";
      let handled = true;

      switch (event.key) {
        case isHorizontal ? "ArrowRight" : "ArrowDown":
          event.preventDefault();
          focusTab(focusedIndex + 1);
          break;
        case isHorizontal ? "ArrowLeft" : "ArrowUp":
          event.preventDefault();
          focusTab(focusedIndex - 1);
          break;
        case "Home":
          event.preventDefault();
          focusTab(0);
          break;
        case "End":
          event.preventDefault();
          focusTab(enabledCount - 1);
          break;
        case "Enter":
        case " ":
          if (activationMode === "manual") {
            event.preventDefault();
            const id = enabledIds[focusedIndex];
            if (id) selectTab(id);
          }
          break;
        default:
          handled = false;
      }

      if (handled) {
        event.stopPropagation();
      }
    },
    [orientation, focusTab, focusedIndex, enabledCount, enabledIds, activationMode, selectTab],
  );

  const rootClassName = [
    "gridra-tabs",
    `gridra-tabs--${orientation}`,
    `gridra-tabs--${variant}`,
    `gridra-tabs--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const selectedItem = items.find((item) => item.id === safeSelectedId);

  return (
    <div {...props} className={rootClassName}>
      <div
        aria-orientation={orientation}
        className="gridra-tabs__list"
        onKeyDown={handleKeyDown}
        role="tablist"
      >
        {items.map((item) => {
          const isSelected = item.id === safeSelectedId;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <button
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              aria-selected={isSelected}
              className={[
                "gridra-tabs__tab",
                item.disabled ? "gridra-tabs__tab--disabled" : null,
                isSelected ? "gridra-tabs__tab--selected" : null,
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={item.disabled}
              id={tabId}
              key={item.id}
              onClick={() => selectTab(item.id)}
              ref={(el) => {
                if (el) tabRefs.current.set(item.id, el);
                else tabRefs.current.delete(item.id);
              }}
              role="tab"
              tabIndex={
                item.disabled
                  ? -1
                  : focusedIndex === enabledIds.indexOf(item.id)
                    ? 0
                    : -1
              }
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {selectedItem ? (
        <div
          aria-labelledby={`${baseId}-tab-${selectedItem.id}`}
          className="gridra-tabs__panel"
          id={`${baseId}-panel-${selectedItem.id}`}
          role="tabpanel"
        >
          {selectedItem.content}
        </div>
      ) : null}
    </div>
  );
}
