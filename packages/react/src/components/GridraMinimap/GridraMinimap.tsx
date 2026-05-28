import type { CSSProperties, HTMLAttributes } from "react";
import type { GridraId } from "@gridra-ui/core";
import type { GridraNodePlacement } from "../GridraNode";

export interface GridraMinimapNode {
  id: GridraId;
  placement: GridraNodePlacement;
}

export interface GridraMinimapViewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridraMinimapProps extends HTMLAttributes<HTMLDivElement> {
  gridColumns?: number;
  gridRows?: number;
  nodes?: GridraMinimapNode[];
  selectedIds?: GridraId[];
  viewport?: GridraMinimapViewport;
  showViewport?: boolean;
}

export function GridraMinimap({
  className,
  gridColumns = 12,
  gridRows = 6,
  nodes = [],
  selectedIds = [],
  showViewport = true,
  style,
  viewport,
  ...props
}: GridraMinimapProps) {
  const safeColumns = Number.isFinite(gridColumns) ? Math.max(1, Math.floor(gridColumns)) : 12;
  const safeRows = Number.isFinite(gridRows) ? Math.max(1, Math.floor(gridRows)) : 6;
  const selectedSet = new Set(selectedIds);

  return (
    <div
      className={["gridra-minimap", className].filter(Boolean).join(" ")}
      style={{
        ...style,
        "--gridra-minimap-columns": safeColumns.toString(),
        "--gridra-minimap-rows": safeRows.toString()
      } as CSSProperties}
      {...props}
    >
      <div className="gridra-minimap__surface" aria-hidden="true">
        {nodes.map((node) => {
          const normalized = normalizePlacement(node.placement, safeColumns, safeRows);
          return (
            <div
              key={node.id}
              className={[
                "gridra-minimap__node",
                selectedSet.has(node.id) ? "gridra-minimap__node--selected" : null
              ]
                .filter(Boolean)
                .join(" ")}
              data-gridra-minimap-node-id={node.id}
              style={{
                left: `${((normalized.column - 1) / safeColumns) * 100}%`,
                top: `${((normalized.row - 1) / safeRows) * 100}%`,
                width: `${(normalized.columnSpan / safeColumns) * 100}%`,
                height: `${(normalized.rowSpan / safeRows) * 100}%`
              }}
            />
          );
        })}
        {showViewport && viewport ? (
          <div
            className="gridra-minimap__viewport"
            style={{
              left: `${(clampNumber(viewport.x, 0, safeColumns) / safeColumns) * 100}%`,
              top: `${(clampNumber(viewport.y, 0, safeRows) / safeRows) * 100}%`,
              width: `${(clampNumber(viewport.width, 0, safeColumns) / safeColumns) * 100}%`,
              height: `${(clampNumber(viewport.height, 0, safeRows) / safeRows) * 100}%`
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function normalizePlacement(
  placement: GridraNodePlacement,
  maxColumns: number,
  maxRows: number
): Required<Pick<GridraNodePlacement, "column" | "row" | "columnSpan" | "rowSpan">> {
  const column = clampInt(placement.column, 1, maxColumns);
  const row = clampInt(placement.row, 1, maxRows);
  const columnSpan = clampInt(placement.columnSpan ?? 1, 1, maxColumns - column + 1);
  const rowSpan = clampInt(placement.rowSpan ?? 1, 1, maxRows - row + 1);
  return { column, row, columnSpan, rowSpan };
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  const intValue = Math.floor(value);
  return Math.min(max, Math.max(min, intValue));
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}
