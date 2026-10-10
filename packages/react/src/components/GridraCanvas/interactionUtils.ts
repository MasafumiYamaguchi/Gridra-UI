import type { GridraNodePlacement } from "../GridraNode";
import type { GridraPoint } from "@gridra-ui/core";
import { normalizeGridPlacement, normalizeGridPlacementForDrag, normalizeGridSpan, type GridMetrics } from "./geometry";

export interface PlacementInput {
  metrics: GridMetrics;
  currentPoint: GridraPoint;
  origin: GridraPoint;
  startPlacement: GridraNodePlacement;
}

function getCellDelta({ metrics, currentPoint, origin }: PlacementInput) {
  return {
    x: Math.round((currentPoint.x - origin.x) / metrics.columnStep),
    y: Math.round((currentPoint.y - origin.y) / metrics.rowStep),
  };
}

export function computeDragPlacement(input: PlacementInput): GridraNodePlacement {
  const { metrics, startPlacement } = input;
  const delta = getCellDelta(input);
  // 移動はspanを維持し、配置の終端がグリッド内に収まるように補正する。
  return normalizeGridPlacementForDrag({ ...startPlacement,
    column: startPlacement.column + delta.x, row: startPlacement.row + delta.y,
  }, metrics.columns, metrics.rows);
}

export function computeResizePlacement(input: PlacementInput): GridraNodePlacement {
  const { metrics, startPlacement } = input;
  const delta = getCellDelta(input);
  // リサイズは配置の始点を維持し、残りのセル数でspanを制限する。
  return normalizeGridPlacement({ ...startPlacement,
    columnSpan: normalizeGridSpan(startPlacement.columnSpan) + delta.x,
    rowSpan: normalizeGridSpan(startPlacement.rowSpan) + delta.y,
  }, metrics.columns, metrics.rows);
}
