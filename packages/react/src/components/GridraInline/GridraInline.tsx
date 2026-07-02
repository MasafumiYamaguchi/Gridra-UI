import { Children, type HTMLAttributes, type ReactNode } from "react";
import { GridraBox, type GridraBoxProps } from "../GridraBox";
import { cx } from "../../internal/classNames";

export type GridraInlineGap = "none" | "xs" | "sm" | "md" | "lg";
export type GridraInlineAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type GridraInlineJustify = "start" | "center" | "end" | "between";

// displayとgapはHTML属性とぶつかるため、GridraBoxPropsから除外して独自定義する
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
  const inlineClassName = cx(
    "gridra-inline",
    `gridra-inline--gap-${gap}`,
    `gridra-inline--align-${align}`,
    `gridra-inline--justify-${justify}`,
    className
  );
  // childrenの中でnull/undefined/""を除外するヘルパ
  const validChildren = Children.toArray(children).filter(
    (child) => child !== null && child !== undefined && child !== ""
  );
  // separatorが指定されている場合、childrenの間にseparatorを挿入する
  // issue: reduceの処理が複雑で可読性が低いので、別の方法を検討する
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
  const itemClassName = cx(
    "gridra-inline-item",
    grow ? "gridra-inline-item--grow" : null,
    className
  );
  // growがtrueの場合、CSSのオプションとして
  // flex: 1 1 auto;を適用することで、親要素の幅に応じて自動的に伸縮するようにする
  return (
    <span className={itemClassName} {...props}>
      {children}
    </span>
  );
}
