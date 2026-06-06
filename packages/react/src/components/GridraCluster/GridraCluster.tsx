import type { ReactNode } from "react";
import { GridraBox, type GridraBoxProps } from "../GridraBox";
import { cx } from "../../internal/classNames";

export type GridraClusterGap = "none" | "xs" | "sm" | "md" | "lg";
export type GridraClusterAlign =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "baseline";
export type GridraClusterJustify = "start" | "center" | "end" | "between";

// Cluster側でdisplayとgapを制御するため、GridraBoxPropsから除外する
export interface GridraClusterProps extends Omit<
  GridraBoxProps,
  "display" | "gap"
> {
  align?: GridraClusterAlign;
  gap?: GridraClusterGap;
  justify?: GridraClusterJustify;
  rowGap?: GridraClusterGap;
}

export function GridraCluster({
  align = "center",
  children,
  className,
  gap = "sm",
  justify = "start",
  rowGap,
  ...props
}: GridraClusterProps) {
  const clusterClassName = cx(
    "gridra-cluster",
    `gridra-cluster--gap-${gap}`,
    rowGap ? `gridra-cluster--row-gap-${rowGap}` : null,
    `gridra-cluster--align-${align}`,
    `gridra-cluster--justify-${justify}`,
    className,
  );

  return (
    <GridraBox className={clusterClassName} display="flex" {...props}>
      {children as ReactNode}
    </GridraBox>
  );
}
