import {
  useEffect, useId, useMemo, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type KeyboardEvent, type Ref,
} from "react";
import { wrapIndex } from "@gridra-ui/core";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";

export type GridraTabsOrientation = "horizontal" | "vertical";
export type GridraTabsActivationMode = "automatic" | "manual";
export interface GridraTabsItem { id: string; disabled?: boolean }
export interface UseGridraTabsOptions<TItem extends GridraTabsItem = GridraTabsItem> {
  items: readonly TItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectionChange?: (nextId: string, previousId: string | null) => void;
  orientation?: GridraTabsOrientation;
  activationMode?: GridraTabsActivationMode;
}
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> };

/** 選択・フォーカス・ARIAを提供し、DOMと装飾は利用側が組み立てる。 */
export function useGridraTabs<TItem extends GridraTabsItem>({
  items: inputItems, selectedId, defaultSelectedId, onSelectionChange,
  orientation = "horizontal", activationMode = "automatic",
}: UseGridraTabsOptions<TItem>) {
  const baseId = useId();
  const items = useMemo(() => {
    const seen = new Set<string>();
    return inputItems.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [inputItems]);
  const enabledIds = useMemo(() => items.filter(item => !item.disabled).map(item => item.id), [items]);
  const fallbackId = enabledIds[0] ?? "";
  const resolve = (id: string) => enabledIds.includes(id) ? id : fallbackId;
  const [rawSelectedId, setRawSelectedId] = useControllableValue(
    selectedId === undefined ? undefined : resolve(selectedId),
    resolve(defaultSelectedId ?? fallbackId),
    // itemsの変更後もpreviousは現在公開している選択値にそろえる。
    (next, previous) => onSelectionChange?.(next, resolve(previous)),
  );
  const currentId = resolve(rawSelectedId);
  const [focusedId, setFocusedId] = useState(currentId);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => { setFocusedId(currentId); }, [currentId]);
  const currentFocusId = enabledIds.includes(focusedId) ? focusedId : currentId;
  const select = (id: string) => {
    if (!enabledIds.includes(id)) return;
    if (id !== currentId) setRawSelectedId(id);
    setFocusedId(id);
  };
  const focus = (index: number) => {
    if (!enabledIds.length) return;
    const id = enabledIds[wrapIndex(index, enabledIds.length)];
    setFocusedId(id);
    tabRefs.current.get(id)?.focus();
    if (activationMode === "automatic") select(id);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!enabledIds.length) return;
    const target = event.target as HTMLElement;
    if (target.closest('[role="tablist"]') !== event.currentTarget) return;
    const index = enabledIds.indexOf(currentFocusId);
    const horizontal = orientation === "horizontal";
    switch (event.key) {
      case horizontal ? "ArrowRight" : "ArrowDown": focus(index + 1); break;
      case horizontal ? "ArrowLeft" : "ArrowUp": focus(index - 1); break;
      case "Home": focus(0); break;
      case "End": focus(enabledIds.length - 1); break;
      case "Enter":
      case " ":
        if (activationMode !== "manual") return;
        select(currentFocusId);
        break;
      default: return;
    }
    event.preventDefault();
    event.stopPropagation();
  };
  const getTabListProps = (props: HTMLAttributes<HTMLDivElement> = {}): HTMLAttributes<HTMLDivElement> => ({
    ...props, role: "tablist", "aria-orientation": orientation,
    onKeyDown: composeHandlers(props.onKeyDown, onKeyDown),
  });
  const getTabProps = (id: string, props: ButtonProps = {}): ButtonProps => {
    const item = items.find(item => item.id === id);
    const disabled = !item || Boolean(item.disabled);
    return {
      ...props, id: `${baseId}-tab-${id}`, type: "button", role: "tab", disabled,
      "aria-controls": `${baseId}-panel-${id}`, "aria-selected": !disabled && id === currentId,
      "aria-disabled": disabled || undefined, tabIndex: !disabled && id === currentFocusId ? 0 : -1,
      onClick: composeHandlers(props.onClick, () => select(id)),
      onFocus: composeHandlers(props.onFocus, () => { if (!disabled) setFocusedId(id); }),
      ref: mergeRefs(props.ref, (element: HTMLButtonElement | null) => {
        if (element) tabRefs.current.set(id, element);
        else tabRefs.current.delete(id);
      }),
    };
  };
  const getPanelProps = (id: string, props: HTMLAttributes<HTMLDivElement> = {}): HTMLAttributes<HTMLDivElement> => ({
    ...props, id: `${baseId}-panel-${id}`, role: "tabpanel",
    "aria-labelledby": `${baseId}-tab-${id}`, hidden: id !== currentId || !enabledIds.includes(id),
  });
  return {
    items, selectedId: currentId, selectedItem: items.find(item => item.id === currentId),
    select, getTabListProps, getTabProps, getPanelProps,
  };
}
