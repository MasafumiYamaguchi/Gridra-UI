import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  useMemo,
} from "react";
import {
  DEFAULT_SPLIT_PANE_MAX_SIZE,
  DEFAULT_SPLIT_PANE_MIN_SIZE,
  DEFAULT_SPLIT_PANE_SIZE,
  useGridraSplitPane,
  type GridraSplitPaneOrientation,
} from "@gridra-ui/headless";

export type { GridraSplitPaneOrientation } from "@gridra-ui/headless";

export interface GridraSplitPaneProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  orientation?: GridraSplitPaneOrientation;
  size?: number;
  defaultSize?: number;
  sizes?: number[];
  defaultSizes?: number[];
  minSize?: number;
  maxSize?: number;
  onSizeChange?: (next: number, previous: number) => void;
  onSizesChange?: (next: number[], previous: number[]) => void;
}

export function GridraSplitPane({
  children,
  className,
  defaultSize = DEFAULT_SPLIT_PANE_SIZE,
  defaultSizes,
  maxSize = DEFAULT_SPLIT_PANE_MAX_SIZE,
  minSize = DEFAULT_SPLIT_PANE_MIN_SIZE,
  onSizeChange,
  onSizesChange,
  onKeyDown,
  orientation = "horizontal",
  size,
  sizes,
  style,
  ...props
}: GridraSplitPaneProps) {
  const childArray = Children.toArray(children);
  const {
    paneCount,
    isThreePane,
    currentSizes,
    effectiveSizes,
    getSeparatorProps,
    getContainerProps,
  } = useGridraSplitPane({
    paneCount: childArray.length,
    orientation,
    size,
    defaultSize,
    sizes,
    defaultSizes,
    minSize,
    maxSize,
    onSizeChange,
    onSizesChange,
    onKeyDown,
  });
  const paneNodes = childArray.slice(0, paneCount);
  // 計算した比率をCSS変数へ集約し、orientationごとの配置はCSSへ委ねる。
  const paneStyle = useMemo(() => {
    const clampedSize = effectiveSizes[0];

    return {
      ...style,
      "--gridra-split-pane-size": `${clampedSize}%`,
      "--gridra-split-pane-size-fr": `${clampedSize}fr`,
      "--gridra-split-pane-rest-fr": `${100 - clampedSize}fr`,
      ...(isThreePane
        ? {
            "--gridra-split-pane-size-a": `${currentSizes[0]}%`,
            "--gridra-split-pane-size-b": `${currentSizes[1]}%`,
            "--gridra-split-pane-size-c": `${currentSizes[2]}%`,
            "--gridra-split-pane-size-a-fr": `${currentSizes[0]}fr`,
            "--gridra-split-pane-size-b-fr": `${currentSizes[1]}fr`,
            "--gridra-split-pane-size-c-fr": `${currentSizes[2]}fr`,
          }
        : null),
    } as CSSProperties;
  }, [currentSizes, effectiveSizes, isThreePane, style]);

  const splitPaneClassName = [
    "gridra-split-pane",
    `gridra-split-pane--${orientation}`,
    isThreePane ? "gridra-split-pane--three" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={splitPaneClassName}
      {...getContainerProps()}
      style={paneStyle}
      {...props}
    >
      {Array.from({ length: paneCount }).map((_, paneIndex) => {
        const paneNode = paneNodes[paneIndex] ?? null;
        const paneClassName =
          paneIndex === 0
            ? "gridra-split-pane__pane gridra-split-pane__pane--primary"
            : paneIndex === 1
              ? "gridra-split-pane__pane gridra-split-pane__pane--secondary"
              : "gridra-split-pane__pane gridra-split-pane__pane--tertiary";

        return (
          <div className={paneClassName} key={`pane-${paneIndex}`}>
            {paneNode}
          </div>
        );
      })}
      {Array.from({ length: paneCount - 1 }).map((_, separatorIndex) => (
        <div
          {...getSeparatorProps(separatorIndex)}

          className={`gridra-split-pane__separator gridra-split-pane__separator--${separatorIndex + 1}`}
          key={`separator-${separatorIndex}`}
        />
      ))}
    </div>
  );
}
