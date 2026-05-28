import type { CSSProperties, HTMLAttributes } from "react";
import { clampNumber, normalizeGridLine, normalizeGridSpan } from "../../internal/numeric";

export type GridraSnapGuideOrientation = "vertical" | "horizontal";

export interface GridraSnapGuidePlacement {
  column?: number;
  row?: number;
  columnSpan?: number;
  rowSpan?: number;
}

export interface GridraSnapGuideProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  end?: number;
  orientation?: GridraSnapGuideOrientation;
  placement?: GridraSnapGuidePlacement;
  position?: number;
  start?: number;
  visible?: boolean;
}

export function GridraSnapGuide({
  active = true,
  className,
  end,
  orientation = "vertical",
  placement,
  position,
  start = 0,
  style,
  visible = true,
  ...props
}: GridraSnapGuideProps) {
  if (!visible || !active) {
    return null;
  }

  if (!placement && position === undefined) {
    return null;
  }

  const snapGuideClassName = [
    "gridra-snap-guide",
    `gridra-snap-guide--${orientation}`,
    placement ? "gridra-snap-guide--placement" : "gridra-snap-guide--position",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const snapGuideStyle = {
    ...style,
    ...(placement ? getPlacementStyle(orientation, placement) : null),
    ...(position !== undefined
      ? getPositionStyle(orientation, position, start, end)
      : null),
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={snapGuideClassName}
      style={snapGuideStyle}
      {...props}
    />
  );
}

function getPlacementStyle(
  orientation: GridraSnapGuideOrientation,
  placement: GridraSnapGuidePlacement
): CSSProperties {
  if (orientation === "vertical") {
    return {
      gridColumn: `${normalizeGridLine(placement.column ?? 1)} / span 1`,
      gridRow: `${normalizeGridLine(placement.row ?? 1)} / span ${normalizeGridSpan(placement.rowSpan)}`,
    };
  }

  return {
    gridColumn: `${normalizeGridLine(placement.column ?? 1)} / span ${normalizeGridSpan(placement.columnSpan)}`,
    gridRow: `${normalizeGridLine(placement.row ?? 1)} / span 1`,
  };
}

function getPositionStyle(
  orientation: GridraSnapGuideOrientation,
  position: number,
  start: number,
  end?: number
): CSSProperties {
  const normalizedPosition = normalizeCoordinate(position);
  const normalizedStart = normalizeCoordinate(start);
  const normalizedLength =
    end === undefined ? "100%" : normalizeSize(normalizeCoordinate(end) - normalizedStart);

  if (orientation === "vertical") {
    return {
      left: normalizedPosition,
      top: normalizedStart,
      height: normalizedLength,
    };
  }

  return {
    top: normalizedPosition,
    left: normalizedStart,
    width: normalizedLength,
  };
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
