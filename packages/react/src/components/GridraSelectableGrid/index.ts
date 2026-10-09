import { GridraSelectableGrid } from "./GridraSelectableGrid";
import type { GridraSelectableGridItem, GridraSelectableGridProps } from "./GridraSelectableGrid";

export { GridraSelectableGrid, type GridraSelectableGridItem, type GridraSelectableGridProps };

/** @deprecated Use GridraSelectableGrid for item selection, or GridraGridLayout for layout. */
export const GridraGrid = GridraSelectableGrid;
/** @deprecated Use GridraSelectableGridItem. */
export type GridraGridItem = GridraSelectableGridItem;
/** @deprecated Use GridraSelectableGridProps. */
export type GridraGridProps<TItem extends GridraSelectableGridItem = GridraSelectableGridItem> = GridraSelectableGridProps<TItem>;
