import {
  useCallback,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";

export type GridraAccordionType = "single" | "multiple";
export type GridraAccordionSize = "sm" | "md" | "lg";
export type GridraAccordionVariant = "default" | "divided";
export type GridraAccordionValue = string | string[];

export interface GridraAccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface GridraAccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: GridraAccordionItem[];
  type?: GridraAccordionType;
  value?: GridraAccordionValue;
  defaultValue?: GridraAccordionValue;
  onValueChange?: (nextValue: GridraAccordionValue, previousValue: GridraAccordionValue) => void;
  collapsible?: boolean;
  size?: GridraAccordionSize;
  variant?: GridraAccordionVariant;
}

function normalizeToSingle(value: GridraAccordionValue): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

function normalizeToMultiple(value: GridraAccordionValue): string[] {
  if (typeof value === "string") return value ? [value] : [];
  return Array.isArray(value) ? value : [];
}

function buildValidMap(items: GridraAccordionItem[]) {
  const seen = new Map<string, GridraAccordionItem>();
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.set(item.id, item);
    }
  }
  return seen;
}

export function GridraAccordion({
  className,
  collapsible = false,
  defaultValue,
  items,
  onValueChange,
  size = "md",
  type = "single",
  value: valueProp,
  variant = "default",
  ...props
}: GridraAccordionProps) {
  const baseId = useId();
  const headerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const validMap = useMemo(() => buildValidMap(items), [items]);

  const enabledIds = useMemo(
    () => items.filter((item) => !item.disabled && validMap.get(item.id) === item).map((item) => item.id),
    [items, validMap],
  );

  const sanitizedDefault = useMemo(() => {
    if (type === "single") {
      if (defaultValue !== undefined) {
        const val = normalizeToSingle(defaultValue);
        if (val && validMap.has(val)) {
          const resolved = validMap.get(val)!;
          if (!resolved.disabled) return val;
        }
        if (val && !validMap.has(val)) {
          if (enabledIds.length > 0) return enabledIds[0];
          return "";
        }
        return "";
      }
      if (enabledIds.length > 0) {
        return enabledIds[0];
      }
      return "";
    }
    if (defaultValue !== undefined) {
      const arr = normalizeToMultiple(defaultValue);
      return arr.filter((id) => {
        const resolved = validMap.get(id);
        return resolved && !resolved.disabled;
      });
    }
    return [];
  }, [type, defaultValue, validMap, enabledIds]);

  const [rawValue, setRawValue] = useControllableValue<GridraAccordionValue>(
    valueProp,
    sanitizedDefault,
    onValueChange,
  );

  const resolvedValue = useMemo((): string[] => {
    if (type === "single") {
      const val = normalizeToSingle(rawValue);
      if (!val) return [];
      const resolved = validMap.get(val);
      if (resolved && !resolved.disabled) return [val];
      return [];
    }
    const arr = normalizeToMultiple(rawValue);
    return arr.filter((id) => {
      const resolved = validMap.get(id);
      return resolved && !resolved.disabled;
    });
  }, [type, rawValue, validMap]);

  const openSet = useMemo(() => new Set(resolvedValue), [resolvedValue]);

  const toggleSingle = useCallback(
    (id: string) => {
      if (openSet.has(id)) {
        if (collapsible) {
          setRawValue("");
        }
      } else {
        setRawValue(id);
      }
    },
    [openSet, collapsible, setRawValue],
  );

  const toggleMultiple = useCallback(
    (id: string) => {
      if (openSet.has(id)) {
        setRawValue(resolvedValue.filter((v) => v !== id));
      } else {
        setRawValue([...resolvedValue, id]);
      }
    },
    [openSet, resolvedValue, setRawValue],
  );

  const handleToggle = useCallback(
    (id: string) => {
      if (type === "single") {
        toggleSingle(id);
      } else {
        toggleMultiple(id);
      }
    },
    [type, toggleSingle, toggleMultiple],
  );

  const handleHeaderKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const current = event.currentTarget as HTMLButtonElement;
      const currentIndex = enabledIds.indexOf(current.getAttribute("data-accordion-id") ?? "");

      let nextIndex = -1;
      let handled = false;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          nextIndex = currentIndex + 1;
          handled = true;
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex = currentIndex - 1;
          handled = true;
          break;
        case "Home":
          event.preventDefault();
          nextIndex = 0;
          handled = true;
          break;
        case "End":
          event.preventDefault();
          nextIndex = enabledIds.length - 1;
          handled = true;
          break;
      }

      if (handled && nextIndex >= 0 && nextIndex < enabledIds.length) {
        const nextId = enabledIds[nextIndex];
        headerRefs.current.get(nextId)?.focus();
      }
    },
    [enabledIds],
  );

  if (items.length === 0) {
    return (
      <div {...props} className={["gridra-accordion", `gridra-accordion--${variant}`, `gridra-accordion--${size}`, className].filter(Boolean).join(" ")} />
    );
  }

  const rootClassName = [
    "gridra-accordion",
    `gridra-accordion--${variant}`,
    `gridra-accordion--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} className={rootClassName}>
      {items.map((item) => {
        const isDisabled = item.disabled ?? false;
        const isOpen = !isDisabled && openSet.has(item.id);
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={[
              "gridra-accordion__item",
              isDisabled ? "gridra-accordion__item--disabled" : null,
              isOpen ? "gridra-accordion__item--expanded" : null,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <button
              aria-controls={panelId}
              aria-disabled={isDisabled || undefined}
              aria-expanded={isOpen}
              className="gridra-accordion__header"
              data-accordion-id={item.id}
              disabled={isDisabled}
              id={headerId}
              onClick={() => {
                if (!isDisabled) handleToggle(item.id);
              }}
              onKeyDown={handleHeaderKeyDown}
              ref={(el) => {
                if (el) headerRefs.current.set(item.id, el);
                else headerRefs.current.delete(item.id);
              }}
              type="button"
            >
              <span className="gridra-accordion__title">{item.title}</span>
              <span aria-hidden="true" className="gridra-accordion__icon" />
            </button>
            {isOpen ? (
              <div
                aria-labelledby={headerId}
                className="gridra-accordion__panel"
                id={panelId}
                role="region"
              >
                <div className="gridra-accordion__panel-content">{item.content}</div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
