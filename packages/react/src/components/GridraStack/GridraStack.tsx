import { Children, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/classNames";
import { GridraBox, type GridraBoxProps } from "../GridraBox";

export type GridraStackDirection = "vertical" | "horizontal";
export type GridraStackGap = "none" | "xs" | "sm" | "md" | "lg";
export type GridraStackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type GridraStackJustify = "start" | "center" | "end" | "between";

export interface GridraStackProps extends Omit<GridraBoxProps, "display" | "gap"> {
  align?: GridraStackAlign;
  direction?: GridraStackDirection;
  gap?: GridraStackGap;
  inline?: boolean;
  justify?: GridraStackJustify;
  reverse?: boolean;
  rowGap?: GridraStackGap;
  separator?: ReactNode;
  wrap?: boolean;
}

export function GridraStack({
  align = "stretch",
  children,
  className,
  direction = "vertical",
  gap = "md",
  inline = false,
  justify = "start",
  reverse = false,
  rowGap,
  separator,
  wrap = false,
  ...props
}: GridraStackProps) {
  const stackClassName = cx(
    "gridra-stack",
    `gridra-stack--${direction}${reverse ? "-reverse" : ""}`,
    `gridra-stack--gap-${gap}`,
    rowGap ? `gridra-stack--row-gap-${rowGap}` : null,
    `gridra-stack--align-${align}`,
    `gridra-stack--justify-${justify}`,
    wrap ? "gridra-stack--wrap" : null,
    className,
  );
  let content = children;
  if (separator !== undefined) {
    const items = Children.toArray(children).filter((child) => child !== "");
    content = items.flatMap((child, index) => index === 0 ? [child] : [
      <span className="gridra-stack__separator" key={`separator-${index}`}>
        {separator}
      </span>,
      child,
    ]);
  }
  return (
    <GridraBox className={stackClassName} display={inline ? "inline-flex" : "flex"} {...props}>
      {content}
    </GridraBox>
  );
}

export interface GridraStackItemProps extends HTMLAttributes<HTMLSpanElement> {
  grow?: boolean;
}

export function GridraStackItem({ children, className, grow = false, ...props }: GridraStackItemProps) {
  return (
    <span className={cx("gridra-stack-item", grow && "gridra-stack-item--grow", className)} {...props}>
      {children}
    </span>
  );
}
