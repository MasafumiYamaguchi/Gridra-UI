import type { ReactNode } from "react";
import type { GridraId, GridraSelectableItem } from "@gridra-ui/core";
export interface GridraGridItem extends GridraSelectableItem {
    label?: ReactNode;
}
export interface GridraGridProps<TItem extends GridraGridItem = GridraGridItem> {
    items: TItem[];
    selectedId?: GridraId | null;
    defaultSelectedId?: GridraId | null;
    columns?: number | string;
    className?: string;
    emptyState?: ReactNode;
    onSelectionChange?: (selectedId: GridraId | null, previousSelectedId: GridraId | null) => void;
    renderItem?: (item: TItem, state: {
        selected: boolean;
    }) => ReactNode;
}
export declare function GridraGrid<TItem extends GridraGridItem = GridraGridItem>({ className, columns, defaultSelectedId, emptyState, items, onSelectionChange, renderItem, selectedId }: GridraGridProps<TItem>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GridraGrid.d.ts.map