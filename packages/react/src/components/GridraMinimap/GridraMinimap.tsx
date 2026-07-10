import type { CSSProperties, HTMLAttributes } from "react";
import type { GridraId } from "@gridra-ui/core";
import type { GridraNodePlacement } from "../GridraNode";
import { clampInt, clampNumber } from "../../internal/numeric";

export interface GridraMinimapNode {
  id: GridraId;
  placement: GridraNodePlacement;
}

// viewportはミニマップ上の表示領域を、グリッド座標系で表す。
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
  // 0以下や非数がCSS Gridの定義に渡らないよう、列数・行数を有効な整数へ正規化する。
  const safeColumns = Number.isFinite(gridColumns) ? Math.max(1, Math.floor(gridColumns)) : 12;
  const safeRows = Number.isFinite(gridRows) ? Math.max(1, Math.floor(gridRows)) : 6;
  // 各ノードの選択判定を繰り返すため、配列ではなくSetとして参照する。
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
          // ノードがグリッド外へはみ出さないよう、位置とスパンを描画前に補正する。
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
                // 1始まりのグリッド座標を、ミニマップ内の割合へ変換する。
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
              // viewportもグリッドの範囲内へ制限してから割合へ変換する。
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
  // 位置を先に確定し、残りのセル数をスパンの上限として使う。
  const column = clampInt(placement.column, 1, maxColumns);
  const row = clampInt(placement.row, 1, maxRows);
  const columnSpan = clampInt(placement.columnSpan ?? 1, 1, maxColumns - column + 1);
  const rowSpan = clampInt(placement.rowSpan ?? 1, 1, maxRows - row + 1);
  return { column, row, columnSpan, rowSpan };
}

// 正規化を描画処理から分離し、割合変換では補正済みの値だけを扱う。
