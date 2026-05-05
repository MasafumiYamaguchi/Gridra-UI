import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import type { GridraId } from "@gridra-ui/core";

export interface GridraNodePlacement {
  column: number;
  row: number;
  columnSpan?: number;
  rowSpan?: number;
}

export interface GridraNodeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "id" | "onSelect"> {
  id: GridraId;
  placement: GridraNodePlacement;
  selected?: boolean;
  children?: ReactNode;
  onSelect?: (id: GridraId) => void;
}

export function GridraNode({
  children,
  className,
  id,
  onClick,
  onSelect,
  placement,
  selected = false,
  style,
  type = "button",
  ...props
}: GridraNodeProps) {
  const nodeClassName = ["gridra-node", className].filter(Boolean).join(" ");
  const nodeStyle = {
    ...style,
    gridColumn: `${normalizeGridLine(placement.column)} / span ${normalizeGridSpan(placement.columnSpan)}`,
    gridRow: `${normalizeGridLine(placement.row)} / span ${normalizeGridSpan(placement.rowSpan)}`
  } as CSSProperties;

  return (
    <button
      aria-selected={selected}
      className={nodeClassName}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onSelect?.(id);
        }
      }}
      style={nodeStyle}
      type={type}
      {...props}
    >
      {children ?? id}
    </button>
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
