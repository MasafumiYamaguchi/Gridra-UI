import { getGridMetrics, getNodeRect } from "./geometry";
import type { NodeSnapGuide } from "./types";

export function createNodeDragSnapGuides(
  placement: { column: number; row: number; columnSpan?: number; rowSpan?: number },
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): NodeSnapGuide[] {
  const metrics = getGridMetrics(canvas, gridColumns, gridRows);
  const rect = getNodeRect(placement, canvas, gridColumns, gridRows);
  const verticalStart = metrics.paddingTop;
  const horizontalStart = metrics.paddingLeft;

  return [
    {
      orientation: "vertical",
      position: rect.x,
      start: verticalStart,
      end: verticalStart + metrics.rowStep * gridRows,
    },
    {
      orientation: "horizontal",
      position: rect.y,
      start: horizontalStart,
      end: horizontalStart + metrics.columnStep * gridColumns,
    },
  ];
}

export function createNodeResizeSnapGuides(
  placement: { column: number; row: number; columnSpan?: number; rowSpan?: number },
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): NodeSnapGuide[] {
  const metrics = getGridMetrics(canvas, gridColumns, gridRows);
  const rect = getNodeRect(placement, canvas, gridColumns, gridRows);
  const verticalStart = metrics.paddingTop;
  const horizontalStart = metrics.paddingLeft;

  return [
    {
      orientation: "vertical",
      position: rect.x + rect.width,
      start: verticalStart,
      end: verticalStart + metrics.rowStep * gridRows,
    },
    {
      orientation: "horizontal",
      position: rect.y + rect.height,
      start: horizontalStart,
      end: horizontalStart + metrics.columnStep * gridColumns,
    },
  ];
}
