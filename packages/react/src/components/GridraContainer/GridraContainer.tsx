import type { CSSProperties } from "react";
import { GridraBox, type GridraBoxProps } from "../GridraBox";

export type GridraContainerSize = "sm" | "md" | "lg" | "xl" | "full";
export type GridraContainerAlign = "start" | "center" | "end";

export interface GridraContainerProps extends Omit<GridraBoxProps, "display"> {
  size?: GridraContainerSize;
  maxWidth?: number | string;
  align?: GridraContainerAlign;
}

export function GridraContainer({
  align = "center",
  className,
  maxWidth,
  size = "lg",
  style,
  ...props
}: GridraContainerProps) {
  const containerClassName = [
    "gridra-container",
    `gridra-container--size-${size}`,
    `gridra-container--align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle = {
    ...style,
    ...(maxWidth === undefined
      ? null
      : {
          "--gridra-container-max-width":
            typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        }),
  } as CSSProperties;

  return <GridraBox className={containerClassName} style={containerStyle} {...props} />;
}
