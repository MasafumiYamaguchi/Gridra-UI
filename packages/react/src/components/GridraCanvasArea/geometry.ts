import type { PointerEvent } from "react";
import type { GridraPoint, GridraRect } from "@gridra-ui/core";
import type { GridraNodePlacement } from "../GridraNode";

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

export function normalizeGridLine(value: number, max?: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  const line = Math.max(1, Math.floor(value));

  return max === undefined ? line : Math.min(line, max);
}

export function normalizeGridSpan(value = 1, max?: number, start = 1): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  const span = Math.max(1, Math.floor(value));

  if (max === undefined) {
    return span;
  }

  return Math.min(span, Math.max(1, max - start + 1));
}

export function getCanvasPoint(
  event: PointerEvent<Element>,
  canvas: HTMLDivElement,
): GridraPoint {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: event.clientX - bounds.left + canvas.scrollLeft,
    y: event.clientY - bounds.top + canvas.scrollTop,
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

export function getConnectionPath(
  source: GridraNodePlacement,
  target: GridraNodePlacement,
  gridColumns: number,
  gridRows: number,
): string {
  const sourcePoint = getConnectionPoint(source, "output", gridColumns, gridRows);
  const targetPoint = getConnectionPoint(target, "input", gridColumns, gridRows);
  const controlDistance = Math.max(0.5, Math.abs(targetPoint.x - sourcePoint.x) * 0.5);
  const sourceControlX = Math.min(gridColumns, sourcePoint.x + controlDistance);
  const targetControlX = Math.max(0, targetPoint.x - controlDistance);

  return [
    `M ${sourcePoint.x} ${sourcePoint.y}`,
    `C ${sourceControlX} ${sourcePoint.y}`,
    `${targetControlX} ${targetPoint.y}`,
    `${targetPoint.x} ${targetPoint.y}`,
  ].join(" ");
}

export function getConnectionPoint(
  placement: GridraNodePlacement,
  side: "input" | "output",
  gridColumns: number,
  gridRows: number,
): GridraPoint {
  const column = normalizeGridLine(placement.column, gridColumns);
  const row = normalizeGridLine(placement.row, gridRows);
  const columnSpan = normalizeGridSpan(placement.columnSpan, gridColumns, column);
  const rowSpan = normalizeGridSpan(placement.rowSpan, gridRows, row);
  const x = side === "output" ? column - 1 + columnSpan : column - 1;
  const y = row - 1 + rowSpan / 2;

  return {
    x: clampNumber(x, 0, gridColumns),
    y: clampNumber(y, 0, gridRows),
  };
}

export function getConnectionRect(
  sourcePlacement: GridraNodePlacement,
  targetPlacement: GridraNodePlacement,
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): GridraRect {
  const sourceRect = getNodeRect(sourcePlacement, canvas, gridColumns, gridRows);
  const targetRect = getNodeRect(targetPlacement, canvas, gridColumns, gridRows);
  const sourcePoint = {
    x: sourceRect.x + sourceRect.width,
    y: sourceRect.y + sourceRect.height / 2,
  };
  const targetPoint = {
    x: targetRect.x,
    y: targetRect.y + targetRect.height / 2,
  };
  const x = Math.min(sourcePoint.x, targetPoint.x);
  const y = Math.min(sourcePoint.y, targetPoint.y);

  return {
    x,
    y,
    width: Math.abs(targetPoint.x - sourcePoint.x),
    height: Math.abs(targetPoint.y - sourcePoint.y),
  };
}

export function getNodeRect(
  placement: GridraNodePlacement,
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): GridraRect {
  const metrics = getGridMetrics(canvas, gridColumns, gridRows);
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
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
) {
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

export function formatCssLength(value: number | string): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return "0px";
    }

    return `${Math.max(0, value)}px`;
  }

  return value;
}

function parseCssPx(value: string): number {
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}
