import { GridraSelectableGrid } from "./GridraSelectableGrid";
import type { GridraSelectableGridItem, GridraSelectableGridProps } from "./GridraSelectableGrid";

export { GridraSelectableGrid, type GridraSelectableGridItem, type GridraSelectableGridProps };

/** @deprecated 項目の選択にはGridraSelectableGrid、レイアウトにはGridraGridLayoutを使用してください。 */
export const GridraGrid = GridraSelectableGrid;
/** @deprecated GridraSelectableGridItemを使用してください。 */
export type GridraGridItem = GridraSelectableGridItem;
/** @deprecated GridraSelectableGridPropsを使用してください。 */
export type GridraGridProps<TItem extends GridraSelectableGridItem = GridraSelectableGridItem> = GridraSelectableGridProps<TItem>;
