import type { CSSProperties, HTMLAttributes } from "react";
import type { GridraRect } from "@gridra-ui/core";
import { normalizeGridLine, normalizeGridSpan } from "../../internal/numeric";

export interface GridraSelectionBoxPlacement {
  column: number;
  row: number;
  columnSpan?: number;
  rowSpan?: number;
}

export interface GridraSelectionBoxProps extends HTMLAttributes<HTMLDivElement> {
  placement?: GridraSelectionBoxPlacement;
  rect?: GridraRect;
  visible?: boolean;
}

export function GridraSelectionBox({
  className,
  placement,
  rect,
  style,
  visible = true,
  ...props
}: GridraSelectionBoxProps) {
  // 非表示、または座標情報がない場合は選択枠自体をDOMへ残さない。
  if (!visible) {
    return null;
  }

  if (!rect && !placement) {
    return null;
  }

  const selectionBoxClassName = [
    "gridra-selection-box",
    rect ? "gridra-selection-box--rect" : "gridra-selection-box--placement",
    className
  ]
    .filter(Boolean)
    .join(" ");
  // rectは絶対座標、placementはCSS Grid座標として同じ枠へ変換する。
  const selectionBoxStyle = {
    ...style,
    ...(rect
      ? {
          left: normalizeCoordinate(rect.x),
          top: normalizeCoordinate(rect.y),
          width: normalizeSize(rect.width),
          height: normalizeSize(rect.height),
        }
      : null),
    ...(placement
      ? {
          gridColumn: `${normalizeGridLine(placement.column)} / span ${normalizeGridSpan(placement.columnSpan)}`,
          gridRow: `${normalizeGridLine(placement.row)} / span ${normalizeGridSpan(placement.rowSpan)}`,
        }
      : null),
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={selectionBoxClassName}
      style={selectionBoxStyle}
      {...props}
    />
  );
}

function normalizeCoordinate(value: number): number {
  // CSSへNaNやInfinityが渡ると枠が消えるため、座標は0へフォールバックする。
  if (!Number.isFinite(value)) {
    return 0;
  }

  return value;
}

function normalizeSize(value: number): number {
  // 幅・高さは有限かつ0以上に制限し、反転した選択枠を作らない。
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}
