import type { HTMLAttributes, ReactNode } from "react";
import { createElement } from "react";

export type GridraBoxAs =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "main"
  | "span";

export type GridraBoxPadding = "none" | "xs" | "sm" | "md" | "lg";
export type GridraBoxSurface = "none" | "surface" | "raised" | "input" | "selected";
export type GridraBoxBorder = "none" | "default" | "strong";
export type GridraBoxRadius = "none" | "sm" | "md";
export type GridraBoxDisplay = "block" | "flex" | "grid" | "inline-flex";
export type GridraBoxGap = "none" | "xs" | "sm" | "md" | "lg";
export type GridraBoxScroll = "none" | "auto" | "x" | "y";

export interface GridraBoxProps extends HTMLAttributes<HTMLElement> {
  as?: GridraBoxAs;
  border?: GridraBoxBorder;
  display?: GridraBoxDisplay;
  fullHeight?: boolean;
  fullWidth?: boolean;
  gap?: GridraBoxGap;
  minHeightZero?: boolean;
  minWidthZero?: boolean;
  padding?: GridraBoxPadding;
  paddingX?: GridraBoxPadding;
  paddingY?: GridraBoxPadding;
  radius?: GridraBoxRadius;
  scroll?: GridraBoxScroll;
  surface?: GridraBoxSurface;
}

export function GridraBox({
  as = "div",
  border,
  children,
  className,
  display,
  fullHeight = false,
  fullWidth = false,
  gap,
  minHeightZero = false,
  minWidthZero = false,
  padding,
  paddingX,
  paddingY,
  radius,
  scroll,
  surface,
  ...props
}: GridraBoxProps) {
  const boxClassName = [
    "gridra-box",
    padding ? `gridra-box--padding-${padding}` : null,
    paddingX ? `gridra-box--padding-x-${paddingX}` : null,
    paddingY ? `gridra-box--padding-y-${paddingY}` : null,
    surface ? `gridra-box--surface-${surface}` : null,
    border ? `gridra-box--border-${border}` : null,
    radius ? `gridra-box--radius-${radius}` : null,
    display ? `gridra-box--display-${display}` : null,
    gap ? `gridra-box--gap-${gap}` : null,
    fullWidth ? "gridra-box--full-width" : null,
    fullHeight ? "gridra-box--full-height" : null,
    scroll ? `gridra-box--scroll-${scroll}` : null,
    minWidthZero ? "gridra-box--min-width-zero" : null,
    minHeightZero ? "gridra-box--min-height-zero" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(
    as,
    { className: boxClassName, ...props },
    children as ReactNode
  );
}
