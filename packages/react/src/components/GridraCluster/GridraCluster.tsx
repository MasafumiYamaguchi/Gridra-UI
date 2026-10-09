import { cx } from "../../internal/classNames";
import { GridraStack, type GridraStackProps, type GridraStackGap, type GridraStackAlign, type GridraStackJustify } from "../GridraStack";

/** @deprecated Use GridraStackGap. */
export type GridraClusterGap = GridraStackGap;
/** @deprecated Use GridraStackAlign. */
export type GridraClusterAlign = GridraStackAlign;
/** @deprecated Use GridraStackJustify. */
export type GridraClusterJustify = GridraStackJustify;
/** @deprecated Use GridraStackProps with direction="horizontal" and wrap. */
export type GridraClusterProps = Omit<GridraStackProps, "direction" | "inline" | "reverse" | "separator" | "wrap">;

/** @deprecated Use GridraStack direction="horizontal" wrap align="center" gap="sm". */
export function GridraCluster({ align = "center", className, gap = "sm", justify = "start", rowGap, ...props }: GridraClusterProps) {
  return (
    <GridraStack
      {...props}
      align={align}
      className={cx("gridra-cluster", `gridra-cluster--gap-${gap}`, rowGap && `gridra-cluster--row-gap-${rowGap}`, `gridra-cluster--align-${align}`, `gridra-cluster--justify-${justify}`, className)}
      direction="horizontal"
      gap={gap}
      justify={justify}
      rowGap={rowGap}
      wrap
    />
  );
}
