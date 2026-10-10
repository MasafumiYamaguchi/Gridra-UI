import type { PointerEvent } from "react";
import type { GridraPoint, GridraRect } from "@gridra-ui/core";
import {
  normalizeGridLine,
  normalizeGridSpan,
  parseCssPx,
} from "../../internal/numeric";
import type { GridraNodePlacement } from "../GridraNode";

export { normalizeGridLine, normalizeGridSpan };

export function normalizeGridCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

export function normalizeGridPlacement(
  placement: GridraNodePlacement,
  maxColumns?: number,
  maxRows?: number,
): GridraNodePlacement {
  const column = normalizeGridLine(placement.column, maxColumns);
  const row = normalizeGridLine(placement.row, maxRows);

  return {
    column,
    row,
    columnSpan: normalizeGridSpan(placement.columnSpan, maxColumns, column),
    rowSpan: normalizeGridSpan(placement.rowSpan, maxRows, row),
  };
}

export function normalizeGridPlacementForDrag(
  placement: GridraNodePlacement,
  maxColumns?: number,
  maxRows?: number,
): GridraNodePlacement {
  const columnSpan = normalizeGridSpan(placement.columnSpan, maxColumns);
  const rowSpan = normalizeGridSpan(placement.rowSpan, maxRows);

  const maxColumn = maxColumns === undefined ? Infinity : Math.max(1, maxColumns - columnSpan + 1);
  const maxRow = maxRows === undefined ? Infinity : Math.max(1, maxRows - rowSpan + 1);

  return {
    column: Math.min(normalizeGridLine(placement.column, maxColumns), maxColumn),
    row: Math.min(normalizeGridLine(placement.row, maxRows), maxRow),
    columnSpan,
    rowSpan,
  };
}

export function getCanvasPoint(
  event: PointerEvent<Element>,
  canvas: HTMLElement,
): GridraPoint {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: event.clientX - bounds.left - canvas.clientLeft + canvas.scrollLeft,
    y: event.clientY - bounds.top - canvas.clientTop + canvas.scrollTop,
  };
}

export function createRect(origin: GridraPoint, current: GridraPoint): GridraRect {
  const x = Math.min(origin.x, current.x);
  const y = Math.min(origin.y, current.y);

  return {
    x,
    y,
    width: Math.abs(current.x - origin.x),
    height: Math.abs(current.y - origin.y),
  };
}

/** 接続点と曲線は、描画とヒットテストで同じピクセル座標を使う。 */
export function getConnectionPoint(rect: GridraRect, side: "input" | "output"): GridraPoint {
  return { x: side === "output" ? rect.x + rect.width : rect.x, y: rect.y + rect.height / 2 };
}

export function getConnectionPath(source: GridraPoint, target: GridraPoint): string {
  const bend = Math.max(16, Math.abs(target.x - source.x) / 2);
  return `M ${source.x} ${source.y} C ${source.x + bend} ${source.y} ${target.x - bend} ${target.y} ${target.x} ${target.y}`;
}

export function getConnectionRect(sourceRect: GridraRect, targetRect: GridraRect): GridraRect {
  const source = getConnectionPoint(sourceRect, "output");
  const target = getConnectionPoint(targetRect, "input");
  return createRect(source, target);
}

export interface GridMetrics {
  columns: number;
  rows: number;
  width: number;
  height: number;
  cellHeight: number;
  cellWidth: number;
  columnGap: number;
  columnStep: number;
  paddingLeft: number;
  paddingTop: number;
  rowGap: number;
  rowStep: number;
}

export function getNodeRect(
  placement: GridraNodePlacement,
  metrics: GridMetrics,
): GridraRect {
  const { columns: gridColumns, rows: gridRows } = metrics;
  const column = normalizeGridLine(placement.column, gridColumns);
  const row = normalizeGridLine(placement.row, gridRows);
  const columnSpan = normalizeGridSpan(placement.columnSpan, gridColumns, column);
  const rowSpan = normalizeGridSpan(placement.rowSpan, gridRows, row);

  return {
    x: metrics.paddingLeft + (column - 1) * metrics.columnStep,
    y: metrics.paddingTop + (row - 1) * metrics.rowStep,
    width: metrics.cellWidth * columnSpan + metrics.columnGap * Math.max(0, columnSpan - 1),
    height: metrics.cellHeight * rowSpan + metrics.rowGap * Math.max(0, rowSpan - 1),
  };
}

export function getGridMetrics(
  canvas: HTMLElement,
  gridColumns: number,
  gridRows: number,
): GridMetrics {
  const styles = getComputedStyle(canvas);
  const paddingLeft = parseCssPx(styles.paddingLeft);
  const paddingTop = parseCssPx(styles.paddingTop);
  const paddingRight = parseCssPx(styles.paddingRight);
  const paddingBottom = parseCssPx(styles.paddingBottom);
  const columnGap = parseCssPx(styles.columnGap || styles.gap);
  const rowGap = parseCssPx(styles.rowGap || styles.gap);
  const bounds = canvas.getBoundingClientRect();
  const canvasWidth = canvas.clientWidth || bounds.width;
  const canvasHeight = canvas.clientHeight || bounds.height;
  const contentWidth = Math.max(0, canvasWidth - paddingLeft - paddingRight);
  const contentHeight = Math.max(0, canvasHeight - paddingTop - paddingBottom);
  const cellWidth =
    (contentWidth - columnGap * Math.max(0, gridColumns - 1)) / gridColumns;
  const cellHeight =
    (contentHeight - rowGap * Math.max(0, gridRows - 1)) / gridRows;

  return {
    columns: gridColumns, rows: gridRows, width: canvasWidth, height: canvasHeight,
    cellHeight,
    cellWidth,
    columnGap,
    columnStep: Math.max(1, cellWidth + columnGap),
    paddingLeft,
    paddingTop,
    rowGap,
    rowStep: Math.max(1, cellHeight + rowGap),
  };
}

export function rectsIntersect(first: GridraRect, second: GridraRect): boolean {
  return (
    first.x <= second.x + second.width &&
    first.x + first.width >= second.x &&
    first.y <= second.y + second.height &&
    first.y + first.height >= second.y
  );
}

export function placementsEqual(
  first: GridraNodePlacement,
  second: GridraNodePlacement,
): boolean {
  return (
    first.column === second.column &&
    first.row === second.row &&
    normalizeGridSpan(first.columnSpan) === normalizeGridSpan(second.columnSpan) &&
    normalizeGridSpan(first.rowSpan) === normalizeGridSpan(second.rowSpan)
  );
}
