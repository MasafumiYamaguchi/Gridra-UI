import {
  useId, useMemo, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type KeyboardEvent, type Ref,
} from "react";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";

export type GridraAccordionType = "single" | "multiple";
export type GridraAccordionValue = string | string[];
export interface GridraAccordionItemState { id: string; disabled?: boolean }
export interface UseGridraAccordionOptions<TItem extends GridraAccordionItemState = GridraAccordionItemState> {
  items: readonly TItem[];
  type?: GridraAccordionType;
  value?: GridraAccordionValue;
  defaultValue?: GridraAccordionValue;
  onValueChange?: (next: GridraAccordionValue, previous: GridraAccordionValue) => void;
  collapsible?: boolean;
}
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> };

/** 開閉規則とキーボード操作を提供し、見出し・内容の描画は利用側が決める。 */
export function useGridraAccordion<TItem extends GridraAccordionItemState>({
  items: inputItems, type = "single", value, defaultValue, onValueChange, collapsible = false,
}: UseGridraAccordionOptions<TItem>) {
  const baseId = useId();
  const items = useMemo(() => {
    const seen = new Set<string>();
    return inputItems.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [inputItems]);
  const enabledIds = items.filter(item => !item.disabled).map(item => item.id);
  const normalize = (raw: GridraAccordionValue): string[] => {
    const ids = typeof raw === "string" ? (raw ? [raw] : []) : Array.isArray(raw) ? raw : [];
    return [...new Set(type === "single" ? ids.slice(0, 1) : ids)].filter(id => enabledIds.includes(id));
  };
  const [internalValue, setInternalValue] = useState<GridraAccordionValue>(() => {
    if (type === "multiple") return defaultValue ?? [];
    if (defaultValue === undefined) return enabledIds[0] ?? "";
    const first = typeof defaultValue === "string" ? defaultValue : Array.isArray(defaultValue) ? defaultValue[0] ?? "" : "";
    return first && !items.some(item => item.id === first) ? enabledIds[0] ?? "" : first;
  });
  const expandedIds = normalize(value === undefined ? internalValue : value);
  const headers = useRef(new Map<string, HTMLButtonElement>());
  const isExpanded = (id: string) => expandedIds.includes(id);
  const toggle = (id: string) => {
    if (!enabledIds.includes(id)) return;
    let nextIds: string[];
    if (type === "single") {
      if (isExpanded(id) && !collapsible) return;
      nextIds = isExpanded(id) ? [] : [id];
    } else {
      nextIds = isExpanded(id) ? expandedIds.filter(current => current !== id) : [...expandedIds, id];
    }
    const previous = type === "single" ? expandedIds[0] ?? "" : expandedIds;
    const next = type === "single" ? nextIds[0] ?? "" : nextIds;
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next, previous);
  };
  const onKeyDown = (id: string, event: KeyboardEvent<HTMLButtonElement>) => {
    const index = enabledIds.indexOf(id);
    if (index < 0) return;
    let nextIndex: number;
    switch (event.key) {
      case "ArrowDown": nextIndex = index + 1; break;
      case "ArrowUp": nextIndex = index - 1; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = enabledIds.length - 1; break;
      default: return;
    }
    event.preventDefault();
    headers.current.get(enabledIds[nextIndex])?.focus();
  };
  const getTriggerProps = (id: string, props: ButtonProps = {}): ButtonProps => {
    const item = items.find(item => item.id === id);
    const disabled = !item || Boolean(item.disabled);
    return {
      ...props, id: `${baseId}-header-${id}`, type: "button", disabled,
      "aria-disabled": disabled || undefined, "aria-expanded": isExpanded(id),
      "aria-controls": `${baseId}-panel-${id}`,
      onClick: composeHandlers(props.onClick, () => toggle(id)),
      onKeyDown: composeHandlers(props.onKeyDown, event => onKeyDown(id, event)),
      ref: mergeRefs(props.ref, (element: HTMLButtonElement | null) => {
        if (element) headers.current.set(id, element);
        else headers.current.delete(id);
      }),
    };
  };
  const getPanelProps = (id: string, props: HTMLAttributes<HTMLDivElement> = {}): HTMLAttributes<HTMLDivElement> => ({
    ...props, id: `${baseId}-panel-${id}`, role: "region", "aria-labelledby": `${baseId}-header-${id}`,
    hidden: !isExpanded(id),
  });
  return { items, expandedIds, isExpanded, toggle, getTriggerProps, getPanelProps };
}
