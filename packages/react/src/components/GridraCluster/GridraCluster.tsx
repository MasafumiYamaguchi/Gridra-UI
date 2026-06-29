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

// Clusterは横並びレイアウト専用なので、display/gapはGridraBoxから受け取らずここで固定管理する。
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
  // GridraBoxを土台にしつつ、flex用のalign/justify/gapだけをClusterの責務として足す。
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
      {children}
    </GridraBox>
  );
}
