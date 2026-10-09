import { cx } from "../../internal/classNames";
import { GridraStack, GridraStackItem, type GridraStackProps, type GridraStackItemProps, type GridraStackGap, type GridraStackAlign, type GridraStackJustify } from "../GridraStack";

/** @deprecated Use GridraStackGap. */
export type GridraInlineGap = GridraStackGap;
/** @deprecated Use GridraStackAlign. */
export type GridraInlineAlign = GridraStackAlign;
/** @deprecated Use GridraStackJustify. */
export type GridraInlineJustify = GridraStackJustify;
/** @deprecated Use GridraStackProps with direction="horizontal" and inline. */
export type GridraInlineProps = Omit<GridraStackProps, "direction" | "inline" | "reverse" | "rowGap" | "wrap">;

/** @deprecated Use GridraStack direction="horizontal" inline align="center" gap="sm". */
export function GridraInline({ align = "center", className, gap = "sm", justify = "start", ...props }: GridraInlineProps) {
  return (
    <GridraStack
      {...props}
      align={align}
      className={cx("gridra-inline", `gridra-inline--gap-${gap}`, `gridra-inline--align-${align}`, `gridra-inline--justify-${justify}`, className)}
      direction="horizontal"
      gap={gap}
      inline
      justify={justify}
    />
  );
}

/** @deprecated Use GridraStackItemProps. */
export type GridraInlineItemProps = GridraStackItemProps;
/** @deprecated Use GridraStackItem. */
export function GridraInlineItem({ className, grow = false, ...props }: GridraInlineItemProps) {
  return <GridraStackItem {...props} className={cx("gridra-inline-item", grow && "gridra-inline-item--grow", className)} grow={grow} />;
}
