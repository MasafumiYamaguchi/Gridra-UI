import type { GridraRect } from "@gridra-ui/core";
import type { GridMetrics } from "./geometry";
import type { GridraCanvasSnapGuide } from "./types";

export function createNodeSnapGuides(rect: GridraRect, metrics: GridMetrics, edge: "start" | "end"): GridraCanvasSnapGuide[] {
  return [
    { orientation: "vertical", position: rect.x + (edge === "end" ? rect.width : 0),
      start: metrics.paddingTop, end: metrics.paddingTop + metrics.rowStep * metrics.rows },
    { orientation: "horizontal", position: rect.y + (edge === "end" ? rect.height : 0),
      start: metrics.paddingLeft, end: metrics.paddingLeft + metrics.columnStep * metrics.columns },
  ];
}
