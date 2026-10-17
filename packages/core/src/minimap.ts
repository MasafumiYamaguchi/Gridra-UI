import { clampInt, clampNumber } from "./numeric";

export interface GridraMinimapPlacement {
  column: number;
  row: number;
  columnSpan?: number;
  rowSpan?: number;
}

export interface GridraMinimapNode {
  id: string;
  placement: GridraMinimapPlacement;
}

export interface GridraMinimapViewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridraMinimapOptions {
  gridColumns?: number;
  gridRows?: number;
  nodes?: GridraMinimapNode[];
  selectedIds?: string[];
  viewport?: GridraMinimapViewport;
}

/** 独自SVG等にも使えるよう、ミニマップの座標を0〜100の割合で返す。 */
export function getGridraMinimap({
  gridColumns = 12,
  gridRows = 6,
  nodes = [],
  selectedIds = [],
  viewport,
}: GridraMinimapOptions = {}) {
  const safeColumns = Number.isFinite(gridColumns) ? Math.max(1, Math.floor(gridColumns)) : 12;
  const safeRows = Number.isFinite(gridRows) ? Math.max(1, Math.floor(gridRows)) : 6;
  const selectedSet = new Set(selectedIds);
  return {
    safeColumns,
    safeRows,
    nodes: nodes.map(node => {
      const placement = normalizePlacement(node.placement, safeColumns, safeRows);
      return {
        id: node.id,
        selected: selectedSet.has(node.id),
        placement,
        rect: {
          left: (placement.column - 1) / safeColumns * 100,
          top: (placement.row - 1) / safeRows * 100,
          width: placement.columnSpan / safeColumns * 100,
          height: placement.rowSpan / safeRows * 100,
        },
      };
    }),
    viewport: viewport ? {
      left: clampNumber(viewport.x, 0, safeColumns) / safeColumns * 100,
      top: clampNumber(viewport.y, 0, safeRows) / safeRows * 100,
      width: clampNumber(viewport.width, 0, safeColumns) / safeColumns * 100,
      height: clampNumber(viewport.height, 0, safeRows) / safeRows * 100,
    } : undefined,
  };
}
function normalizePlacement(
  placement: GridraMinimapPlacement,
  maxColumns: number,
  maxRows: number
): Required<Pick<GridraMinimapPlacement, "column" | "row" | "columnSpan" | "rowSpan">> {
  // 位置を先に確定し、残りのセル数をスパンの上限として使う。
  const column = clampInt(placement.column, 1, maxColumns);
  const row = clampInt(placement.row, 1, maxRows);
  const columnSpan = clampInt(placement.columnSpan ?? 1, 1, maxColumns - column + 1);
  const rowSpan = clampInt(placement.rowSpan ?? 1, 1, maxRows - row + 1);
  return { column, row, columnSpan, rowSpan };
}
