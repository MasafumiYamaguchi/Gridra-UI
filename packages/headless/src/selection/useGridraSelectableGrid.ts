import type { ButtonHTMLAttributes } from "react";
import type { GridraId, GridraSelectableItem } from "@gridra-ui/core";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";

export interface UseGridraSelectableGridOptions<TItem extends GridraSelectableItem = GridraSelectableItem> {
  items: readonly TItem[];
  selectedId?: GridraId | null;
  defaultSelectedId?: GridraId | null;
  onSelectionChange?: (next: GridraId | null, previous: GridraId | null) => void;
}
/** 選択と意味属性を提供し、グリッド配置や描画は利用側が担当する。 */
export function useGridraSelectableGrid<TItem extends GridraSelectableItem>({
  items, selectedId, defaultSelectedId = null, onSelectionChange,
}: UseGridraSelectableGridOptions<TItem>) {
  const resolve = (id: GridraId | null) => items.some(item => item.id === id) ? id : null;
  const [raw, setRaw] = useControllableValue(selectedId === undefined ? undefined : resolve(selectedId),
    resolve(defaultSelectedId), (next, previous) => onSelectionChange?.(next, resolve(previous)));
  const currentSelectedId = resolve(raw);
  const select = (id: GridraId | null) => {
    const next = resolve(id);
    if (id !== null && next === null) return;
    if (next !== currentSelectedId) setRaw(next);
  };
  const getItemProps = (id: GridraId, props: ButtonHTMLAttributes<HTMLButtonElement> = {}): ButtonHTMLAttributes<HTMLButtonElement> => ({
    ...props, type: "button", "aria-selected": id === currentSelectedId,
    onClick: composeHandlers(props.onClick, () => {
      if (!props.disabled) select(id === currentSelectedId ? null : id);
    }),
  });
  return { items, selectedId: currentSelectedId, select, getItemProps };
}
