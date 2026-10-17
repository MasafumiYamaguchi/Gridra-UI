import {getGridraMinimap} from "@gridra-ui/headless";
import type { CSSProperties, HTMLAttributes } from "react";
import type { GridraId } from "@gridra-ui/core";
import type { GridraNodePlacement } from "../GridraNode";
import { clampInt, clampNumber } from "@gridra-ui/core";

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
  const minimap=getGridraMinimap({gridColumns,gridRows,nodes,selectedIds,viewport});
  const {safeColumns,safeRows}=minimap;
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
        {minimap.nodes.map((node) => {
          return (
            <div
              key={node.id}
              className={[
                "gridra-minimap__node",
                node.selected ? "gridra-minimap__node--selected" : null
              ]
                .filter(Boolean)
                .join(" ")}
              data-gridra-minimap-node-id={node.id}
              style={{
                // 1始まりのグリッド座標を、ミニマップ内の割合へ変換する。
                left: `${node.rect.left}%`,
                top: `${node.rect.top}%`,
                width: `${node.rect.width}%`,
                height: `${node.rect.height}%`
              }}
            />
          );
        })}
        {showViewport && minimap.viewport ? (
          <div
            className="gridra-minimap__viewport"
            style={{
              // viewportもグリッドの範囲内へ制限してから割合へ変換する。
              left: `${minimap.viewport.left}%`,
              top: `${minimap.viewport.top}%`,
              width: `${minimap.viewport.width}%`,
              height: `${minimap.viewport.height}%`
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
