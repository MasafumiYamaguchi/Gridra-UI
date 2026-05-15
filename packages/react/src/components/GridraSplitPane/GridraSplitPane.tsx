import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
  useRef,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";

export type GridraSplitPaneOrientation = "horizontal" | "vertical";

export interface GridraSplitPaneProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  orientation?: GridraSplitPaneOrientation;
  size?: number;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onSizeChange?: (next: number, previous: number) => void;
}

const KEYBOARD_STEP = 2;

export function GridraSplitPane({
  children,
  className,
  defaultSize = 50,
  maxSize = 90,
  minSize = 10,
  onSizeChange,
  onKeyDown,
  orientation = "horizontal",
  size,
  style,
  ...props
}: GridraSplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [currentSize, setCurrentSize] = useControllableValue(
    size,
    clampSize(defaultSize, minSize, maxSize),
    onSizeChange,
  );

  const childArray = Children.toArray(children);
  const primaryPane = childArray[0] ?? null;
  const secondaryPane = childArray[1] ?? null;

  const paneStyle = useMemo(
    () => ({
      ...style,
      "--gridra-split-pane-size": `${clampSize(currentSize, minSize, maxSize)}%`,
    }) as CSSProperties,
    [currentSize, maxSize, minSize, style],
  );

  const updateSizeFromPointer = (event: { clientX: number; clientY: number }) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const rawPercent =
      orientation === "horizontal"
        ? ((event.clientX - rect.left) / rect.width) * 100
        : ((event.clientY - rect.top) / rect.height) * 100;

    if (!Number.isFinite(rawPercent)) {
      return;
    }

    setCurrentSize(clampSize(rawPercent, minSize, maxSize));
  };

  const splitPaneClassName = [
    "gridra-split-pane",
    `gridra-split-pane--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={splitPaneClassName} ref={containerRef} style={paneStyle} {...props}>
      <div className="gridra-split-pane__pane gridra-split-pane__pane--primary">
        {primaryPane}
      </div>
      <div
        aria-orientation={orientation}
        aria-valuemax={maxSize}
        aria-valuemin={minSize}
        aria-valuenow={Math.round(clampSize(currentSize, minSize, maxSize))}
        className="gridra-split-pane__separator"
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) {
            return;
          }

          const deltaByKey: Record<string, number> = {
            ArrowLeft: -KEYBOARD_STEP,
            ArrowUp: -KEYBOARD_STEP,
            ArrowRight: KEYBOARD_STEP,
            ArrowDown: KEYBOARD_STEP,
          };

          if (event.key === "Home") {
            setCurrentSize(minSize);
            event.preventDefault();
            return;
          }

          if (event.key === "End") {
            setCurrentSize(maxSize);
            event.preventDefault();
            return;
          }

          const delta = deltaByKey[event.key];
          if (delta === undefined) {
            return;
          }

          setCurrentSize(clampSize(currentSize + delta, minSize, maxSize));
          event.preventDefault();
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          isDraggingRef.current = true;
          if (typeof event.currentTarget.setPointerCapture === "function") {
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          updateSizeFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (!isDraggingRef.current) {
            return;
          }

          updateSizeFromPointer(event);
        }}
        onPointerUp={() => {
          isDraggingRef.current = false;
        }}
        onPointerCancel={() => {
          isDraggingRef.current = false;
        }}
        onMouseDown={(event) => {
          event.preventDefault();
          isDraggingRef.current = true;
          updateSizeFromPointer(event);
        }}
        onMouseMove={(event) => {
          if (!isDraggingRef.current) {
            return;
          }
          updateSizeFromPointer(event);
        }}
        onMouseUp={() => {
          isDraggingRef.current = false;
        }}
        role="separator"
        tabIndex={0}
      />
      <div className="gridra-split-pane__pane gridra-split-pane__pane--secondary">
        {secondaryPane}
      </div>
    </div>
  );
}

function clampSize(value: number, minSize: number, maxSize: number): number {
  const min = Math.max(0, minSize);
  const max = Math.min(100, maxSize);
  if (min > max) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}
