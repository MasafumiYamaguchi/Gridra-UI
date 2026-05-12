import type { ReactNode } from "react";
import { GridraBox, type GridraBoxAs, type GridraBoxProps } from "../GridraBox";

export type GridraStackDirection = "vertical" | "horizontal";
export type GridraStackGap = "none" | "xs" | "sm" | "md" | "lg";
export type GridraStackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type GridraStackJustify = "start" | "center" | "end" | "between";

export interface GridraStackProps extends Omit<GridraBoxProps, "display" | "gap"> {
  align?: GridraStackAlign;
  direction?: GridraStackDirection;
  gap?: GridraStackGap;
  justify?: GridraStackJustify;
  reverse?: boolean;
  wrap?: boolean;
}

export function GridraStack({
  align = "stretch",
  children,
  className,
  direction = "vertical",
  gap = "md",
  justify = "start",
  reverse = false,
  wrap = false,
  ...props
}: GridraStackProps) {
  const stackClassName = [
    "gridra-stack",
    `gridra-stack--${direction}${reverse ? "-reverse" : ""}`,
    `gridra-stack--gap-${gap}`,
    `gridra-stack--align-${align}`,
    `gridra-stack--justify-${justify}`,
    wrap ? "gridra-stack--wrap" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <GridraBox className={stackClassName} display="flex" {...props}>
      {children as ReactNode}
    </GridraBox>
  );
}
