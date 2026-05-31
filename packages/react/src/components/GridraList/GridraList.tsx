import type { HTMLAttributes, ReactNode } from "react";
import { createElement } from "react";
import { cx } from "../../internal/classNames";

export type GridraListAs = "ul" | "ol";
export type GridraListSize = "sm" | "md" | "lg";
export type GridraListSpacing = "compact" | "normal" | "relaxed";

export interface GridraListProps extends HTMLAttributes<HTMLElement> {
  as?: GridraListAs;
  dividers?: boolean;
  items?: ReactNode[];
  marker?: "default" | "none";
  size?: GridraListSize;
  spacing?: GridraListSpacing;
}

export function GridraList({
  as = "ul",
  children,
  className,
  dividers = false,
  items,
  marker = "default",
  size = "md",
  spacing = "normal",
  ...props
}: GridraListProps) {
  const rootClassName = cx(
    "gridra-list",
    `gridra-list--${size}`,
    `gridra-list--${spacing}`,
    `gridra-list--marker-${marker}`,
    dividers && "gridra-list--dividers",
    className,
  );

  const content = items
    ? items.map((item, index) => (
        <li className="gridra-list__item" key={index}>
          {item}
        </li>
      ))
    : children;

  return createElement(as, { className: rootClassName, ...props }, content);
}
