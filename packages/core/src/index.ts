export type GridraId = string;

export interface GridraPoint {
  x: number;
  y: number;
}

export interface GridraSize {
  width: number;
  height: number;
}

export interface GridraRect extends GridraPoint, GridraSize {}

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

export const emptySelection: GridraSelectionState = {
  selectedId: null
};

export function selectGridraItem(
  state: GridraSelectionState,
  selectedId: GridraId | null
): GridraSelectionState {
  if (state.selectedId === selectedId) {
    return state;
  }

  return { selectedId };
}

export function toggleGridraSelection(
  state: GridraSelectionState,
  selectedId: GridraId
): GridraSelectionState {
  return {
    selectedId: state.selectedId === selectedId ? null : selectedId
  };
}

export function movePoint(point: GridraPoint, delta: GridraPoint): GridraPoint {
  return {
    x: point.x + delta.x,
    y: point.y + delta.y
  };
}

export function rectContainsPoint(rect: GridraRect, point: GridraPoint): boolean {
  return (
    point.x >= rect.x &&
    point.y >= rect.y &&
    point.x <= rect.x + rect.width &&
    point.y <= rect.y + rect.height
  );
}
