import type { GridraNodePlacement } from "../GridraNode";
import type { GridraPoint } from "@gridra-ui/core";
import {
  getCanvasPoint,
  getGridMetrics,
  normalizeGridPlacement,
  normalizeGridPlacementForDrag,
  normalizeGridSpan,
} from "./geometry";
import type { PointerEvent } from "react";

export interface DragPlacementInput {
  canvas: HTMLDivElement;
  event: PointerEvent<HTMLDivElement>;
  gridColumns: number;
  gridRows: number;
  origin: GridraPoint;
  startPlacement: GridraNodePlacement;
}

export function computeDragPlacement(input: DragPlacementInput): GridraNodePlacement {
  const { canvas, event, gridColumns, gridRows, origin, startPlacement } = input;
  const metrics = getGridMetrics(canvas, gridColumns, gridRows);
  const currentPoint = getCanvasPoint(event, canvas);

  return normalizeGridPlacementForDrag(
    {
      ...startPlacement,
      column:
        startPlacement.column +
        Math.round((currentPoint.x - origin.x) / metrics.columnStep),
      row:
        startPlacement.row +
        Math.round((currentPoint.y - origin.y) / metrics.rowStep),
    },
    gridColumns,
    gridRows,
  );
}

export interface ResizePlacementInput {
  canvas: HTMLDivElement;
  event: PointerEvent<HTMLDivElement>;
  gridColumns: number;
  gridRows: number;
  origin: GridraPoint;
  startPlacement: GridraNodePlacement;
}

export function computeResizePlacement(input: ResizePlacementInput): GridraNodePlacement {
  const { canvas, event, gridColumns, gridRows, origin, startPlacement } = input;
  const metrics = getGridMetrics(canvas, gridColumns, gridRows);
  const currentPoint = getCanvasPoint(event, canvas);

  return normalizeGridPlacement(
    {
      ...startPlacement,
      columnSpan:
        normalizeGridSpan(startPlacement.columnSpan) +
        Math.round((currentPoint.x - origin.x) / metrics.columnStep),
      rowSpan:
        normalizeGridSpan(startPlacement.rowSpan) +
        Math.round((currentPoint.y - origin.y) / metrics.rowStep),
    },
    gridColumns,
    gridRows,
  );
}
