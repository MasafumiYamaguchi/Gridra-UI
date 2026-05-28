import type { CSSProperties, ReactNode } from "react";
import { formatCssLength } from "../../internal/numeric";
import { GridraBox, type GridraBoxProps } from "../GridraBox";

export type GridraGridLayoutGap = "none" | "xs" | "sm" | "md" | "lg";
export type GridraGridLayoutAlign = "start" | "center" | "end" | "stretch";
export type GridraGridLayoutJustify = "start" | "center" | "end" | "stretch";

export interface GridraGridLayoutProps extends Omit<GridraBoxProps, "display" | "gap"> {
  align?: GridraGridLayoutAlign;
  columnGap?: GridraGridLayoutGap;
  columns?: number | "auto";
  gap?: GridraGridLayoutGap;
  justify?: GridraGridLayoutJustify;
  minColumnWidth?: number | string;
  rowGap?: GridraGridLayoutGap;
}

export function GridraGridLayout({
  align = "stretch",
  children,
  className,
  columnGap,
  columns = "auto",
  gap = "md",
  justify = "stretch",
  minColumnWidth = "160px",
  rowGap,
  style,
  ...props
}: GridraGridLayoutProps) {
  const layoutClassName = [
    "gridra-grid-layout",
    `gridra-grid-layout--columns-${typeof columns === "number" ? "fixed" : columns}`,
    `gridra-grid-layout--gap-${gap}`,
    columnGap ? `gridra-grid-layout--column-gap-${columnGap}` : null,
    rowGap ? `gridra-grid-layout--row-gap-${rowGap}` : null,
    `gridra-grid-layout--align-${align}`,
    `gridra-grid-layout--justify-${justify}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  const layoutStyle: CSSProperties = {
    ...style,
    ...(typeof columns === "number"
      ? { "--gridra-grid-layout-columns": safeRepeatCount(columns).toString() }
      : { "--gridra-grid-layout-min-column-width": formatCssLength(minColumnWidth) })
  } as CSSProperties;

  return (
    <GridraBox className={layoutClassName} display="grid" style={layoutStyle} {...props}>
      {children as ReactNode}
    </GridraBox>
  );
}

function safeRepeatCount(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.floor(value);
}
