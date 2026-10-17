import type { GridraRect } from "@gridra-ui/core";
import { getNodeRect, type GridMetrics } from "./geometry";
import type { GridraCanvasSnapGuide } from "./types";

export function createNodeSnapGuides(rect: GridraRect, metrics: GridMetrics, edge: "start" | "end"): GridraCanvasSnapGuide[] {
  const bounds = getNodeRect({ column: 1, row: 1, columnSpan: metrics.columns, rowSpan: metrics.rows }, metrics);
  return [
    { orientation: "vertical", position: rect.x + (edge === "end" ? rect.width : 0),
      start: bounds.y, end: bounds.y + bounds.height },
    { orientation: "horizontal", position: rect.y + (edge === "end" ? rect.height : 0),
      start: bounds.x, end: bounds.x + bounds.width },
  ];
}

/** 各セルの両端を描く。gapがない場合、隣り合うセルの境界は重複させない。 */
export function createGridLines(metrics: GridMetrics): GridraCanvasSnapGuide[] {
  const bounds = getNodeRect({ column: 1, row: 1, columnSpan: metrics.columns, rowSpan: metrics.rows }, metrics);
  const positions = (count: number, origin: number, step: number, size: number) =>
    step === size ? Array.from({ length: count + 1 }, (_, index) => origin + index * step) :
    Array.from({ length: count }, (_, index) => {
      const start = origin + index * step;
      return [start, start + size];
    }).flat();
  return [
    ...positions(metrics.columns, bounds.x, metrics.columnStep, metrics.cellWidth).map((position) => ({
      orientation: "vertical" as const, position, start: bounds.y, end: bounds.y + bounds.height,
    })),
    ...positions(metrics.rows, bounds.y, metrics.rowStep, metrics.cellHeight).map((position) => ({
      orientation: "horizontal" as const, position, start: bounds.x, end: bounds.x + bounds.width,
    })),
  ];
}
