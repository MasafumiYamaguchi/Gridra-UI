export type GridraId = string;
export interface GridraPoint {
    x: number;
    y: number;
}
export interface GridraSize {
    width: number;
    height: number;
}
export interface GridraRect extends GridraPoint, GridraSize {
}
export interface GridraSelectionState {
    selectedId: GridraId | null;
}
export interface GridraDragState {
    id: GridraId;
    origin: GridraPoint;
    current: GridraPoint;
}
export interface GridraResizeState {
    id: GridraId;
    origin: GridraRect;
    current: GridraRect;
}
export interface GridraThemeTokens {
    colorBackground: string;
    colorSurface: string;
    colorText: string;
    colorMutedText: string;
    colorBorder: string;
    colorAccent: string;
    colorSelected: string;
    radiusSm: string;
    radiusMd: string;
    spaceXs: string;
    spaceSm: string;
    spaceMd: string;
    spaceLg: string;
}
export interface GridraSelectableItem {
    id: GridraId;
}
export interface GridraChange<TValue> {
    value: TValue;
    previousValue: TValue;
}
export declare const emptySelection: GridraSelectionState;
export declare function selectGridraItem(state: GridraSelectionState, selectedId: GridraId | null): GridraSelectionState;
export declare function toggleGridraSelection(state: GridraSelectionState, selectedId: GridraId): GridraSelectionState;
export declare function movePoint(point: GridraPoint, delta: GridraPoint): GridraPoint;
export declare function rectContainsPoint(rect: GridraRect, point: GridraPoint): boolean;
//# sourceMappingURL=index.d.ts.map