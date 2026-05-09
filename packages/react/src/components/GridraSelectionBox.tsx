import type { CSSProperties, HTMLAttributes } from "react";
import type { GridraRect } from "@gridra-ui/core";

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

function normalizeGridLine(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeGridSpan(value = 1): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeCoordinate(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return value;
}

function normalizeSize(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}
