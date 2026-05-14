import type { ReactNode } from "react";
import type { GridraId, GridraSelectableItem } from "@gridra-ui/core";
import { useControllableValue } from "../../hooks/useControllableValue";

export interface GridraSelectableGridItem extends GridraSelectableItem {
  label?: ReactNode;
}

export interface GridraSelectableGridProps<TItem extends GridraSelectableGridItem = GridraSelectableGridItem> {
  items: TItem[];
  selectedId?: GridraId | null;
  defaultSelectedId?: GridraId | null;
  columns?: number | string;
  className?: string;
  emptyState?: ReactNode;
  onSelectionChange?: (selectedId: GridraId | null, previousSelectedId: GridraId | null) => void;
  renderItem?: (item: TItem, state: { selected: boolean }) => ReactNode;
}

export function GridraSelectableGrid<TItem extends GridraSelectableGridItem = GridraSelectableGridItem>({
  className,
  columns = "repeat(auto-fill, minmax(160px, 1fr))",
  defaultSelectedId = null,
  emptyState = "No items",
  items,
  onSelectionChange,
  renderItem,
  selectedId
}: GridraSelectableGridProps<TItem>) {
  const [currentSelectedId, setSelectedId] = useControllableValue(
    selectedId,
    defaultSelectedId,
    onSelectionChange
  );
  const gridTemplateColumns = typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  const gridClassName = ["gridra-grid", className].filter(Boolean).join(" ");

  if (items.length === 0) {
    return (
      <div className={gridClassName} style={{ gridTemplateColumns }}>
        <div className="gridra-grid__empty">{emptyState}</div>
      </div>
    );
  }

  return (
    <div className={gridClassName} style={{ gridTemplateColumns }}>
      {items.map((item) => {
        const selected = item.id === currentSelectedId;

        return (
          <button
            aria-selected={selected}
            className="gridra-grid__item"
            key={item.id}
            onClick={() => setSelectedId(selected ? null : item.id)}
            type="button"
          >
            {renderItem ? renderItem(item, { selected }) : item.label ?? item.id}
          </button>
        );
      })}
    </div>
  );
}
