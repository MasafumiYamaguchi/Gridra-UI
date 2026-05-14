import { Children, type HTMLAttributes, type ReactNode } from "react";
import { GridraBox, type GridraBoxProps } from "../GridraBox";

export type GridraInlineGap = "none" | "xs" | "sm" | "md" | "lg";
export type GridraInlineAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type GridraInlineJustify = "start" | "center" | "end" | "between";

export interface GridraInlineProps extends Omit<GridraBoxProps, "display" | "gap"> {
  align?: GridraInlineAlign;
  gap?: GridraInlineGap;
  justify?: GridraInlineJustify;
  separator?: ReactNode;
}

export function GridraInline({
  align = "center",
  children,
  className,
  gap = "sm",
  justify = "start",
  separator,
  ...props
}: GridraInlineProps) {
  const inlineClassName = [
    "gridra-inline",
    `gridra-inline--gap-${gap}`,
    `gridra-inline--align-${align}`,
    `gridra-inline--justify-${justify}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  const validChildren = Children.toArray(children).filter(
    (child) => child !== null && child !== undefined && child !== ""
  );

  const withSeparators =
    separator !== undefined && validChildren.length > 1
      ? validChildren.reduce<ReactNode[]>((acc, child, index) => {
          if (index > 0) {
            acc.push(
              <span key={`sep-${index}`} className="gridra-inline__separator">
                {separator}
              </span>
            );
          }
          acc.push(child);
          return acc;
        }, [])
      : validChildren;

  return (
    <GridraBox className={inlineClassName} display="inline-flex" {...props}>
      {withSeparators as ReactNode}
    </GridraBox>
  );
}

export interface GridraInlineItemProps extends HTMLAttributes<HTMLSpanElement> {
  grow?: boolean;
}

export function GridraInlineItem({
  children,
  className,
  grow = false,
  ...props
}: GridraInlineItemProps) {
  const itemClassName = [
    "gridra-inline-item",
    grow ? "gridra-inline-item--grow" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={itemClassName} {...props}>
      {children}
    </span>
  );
}
