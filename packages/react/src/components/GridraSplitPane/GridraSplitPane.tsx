import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
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
  sizes?: number[];
  defaultSizes?: number[];
  minSize?: number;
  maxSize?: number;
  onSizeChange?: (next: number, previous: number) => void;
  onSizesChange?: (next: number[], previous: number[]) => void;
}

const KEYBOARD_STEP = 2;

export function GridraSplitPane({
  children,
  className,
  defaultSize = 50,
  defaultSizes,
  maxSize = 90,
  minSize = 10,
  onSizeChange,
  onSizesChange,
  onKeyDown,
  orientation = "horizontal",
  size,
  sizes,
  style,
  ...props
}: GridraSplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingSeparatorIndexRef = useRef<number | null>(null);
  const [currentSize, setCurrentSize] = useControllableValue(
    size,
    clampSize(defaultSize, minSize, maxSize),
    onSizeChange,
  );

  const childArray = Children.toArray(children);
  const paneCount = Math.min(Math.max(2, childArray.length), 3);
  const paneNodes = childArray.slice(0, paneCount);
  const isThreePane = paneCount === 3;
  const normalizedDefaultSizes = normalizePaneSizes(
    defaultSizes && defaultSizes.length >= paneCount
      ? defaultSizes.slice(0, paneCount)
      : isThreePane
        ? [30, 40, 30]
        : [defaultSize, 100 - defaultSize],
    paneCount,
    minSize,
    maxSize,
  );
  const [currentSizes, setCurrentSizes] = useControllableValue(
    isThreePane && sizes && sizes.length >= paneCount
      ? normalizePaneSizes(sizes.slice(0, paneCount), paneCount, minSize, maxSize)
      : undefined,
    normalizedDefaultSizes,
    onSizesChange,
  );

  const paneStyle = useMemo(
    () => ({
      ...style,
      "--gridra-split-pane-size": `${clampSize(currentSize, minSize, maxSize)}%`,
      ...(isThreePane
        ? {
            "--gridra-split-pane-size-a": `${currentSizes[0]}%`,
            "--gridra-split-pane-size-b": `${currentSizes[1]}%`,
            "--gridra-split-pane-size-c": `${currentSizes[2]}%`,
          }
        : null),
    }) as CSSProperties,
    [currentSize, currentSizes, isThreePane, maxSize, minSize, style],
  );

  const updateSizeFromPointer = (
    separatorIndex: number,
    event: { clientX: number; clientY: number },
  ) => {
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

    if (!isThreePane) {
      setCurrentSize(clampSize(rawPercent, minSize, maxSize));
      return;
    }

    const nextSizes = [...currentSizes];
    const previousSum = sumBeforeIndex(nextSizes, separatorIndex);
    const pairTotal = nextSizes[separatorIndex] + nextSizes[separatorIndex + 1];
    const rawLocalLeft = rawPercent - previousSum;
    const localLeft = clampSizeInPair(rawLocalLeft, pairTotal, minSize, maxSize);
    nextSizes[separatorIndex] = localLeft;
    nextSizes[separatorIndex + 1] = pairTotal - localLeft;
    setCurrentSizes(normalizePaneSizes(nextSizes, paneCount, minSize, maxSize));
  };

  const splitPaneClassName = [
    "gridra-split-pane",
    `gridra-split-pane--${orientation}`,
    isThreePane ? "gridra-split-pane--three" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const effectiveSizes = !isThreePane
    ? [clampSize(currentSize, minSize, maxSize), 100 - clampSize(currentSize, minSize, maxSize)]
    : currentSizes;

  const getSeparatorValue = (separatorIndex: number) =>
    Math.round(sumBeforeIndex(effectiveSizes, separatorIndex + 1));

  return (
    <div className={splitPaneClassName} ref={containerRef} style={paneStyle} {...props}>
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
          aria-orientation={orientation}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={getSeparatorValue(separatorIndex)}
          className={`gridra-split-pane__separator gridra-split-pane__separator--${separatorIndex + 1}`}
          key={`separator-${separatorIndex}`}
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

            const current = isThreePane
              ? currentSizes[separatorIndex]
              : clampSize(currentSize, minSize, maxSize);
            const pairTotal = isThreePane
              ? currentSizes[separatorIndex] + currentSizes[separatorIndex + 1]
              : 100;

            if (event.key === "Home") {
              const next = clampSizeInPair(minSize, pairTotal, minSize, maxSize);
              applyAdjacentResize(
                separatorIndex,
                next,
                pairTotal,
                isThreePane,
                currentSizes,
                paneCount,
                minSize,
                maxSize,
                setCurrentSize,
                setCurrentSizes,
              );
              event.preventDefault();
              return;
            }

            if (event.key === "End") {
              const next = clampSizeInPair(maxSize, pairTotal, minSize, maxSize);
              applyAdjacentResize(
                separatorIndex,
                next,
                pairTotal,
                isThreePane,
                currentSizes,
                paneCount,
                minSize,
                maxSize,
                setCurrentSize,
                setCurrentSizes,
              );
              event.preventDefault();
              return;
            }

            const delta = deltaByKey[event.key];
            if (delta === undefined) {
              return;
            }

            const next = clampSizeInPair(current + delta, pairTotal, minSize, maxSize);
            applyAdjacentResize(
              separatorIndex,
              next,
              pairTotal,
              isThreePane,
              currentSizes,
              paneCount,
              minSize,
              maxSize,
              setCurrentSize,
              setCurrentSizes,
            );
            event.preventDefault();
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            draggingSeparatorIndexRef.current = separatorIndex;
            if (typeof event.currentTarget.setPointerCapture === "function") {
              event.currentTarget.setPointerCapture(event.pointerId);
            }
            updateSizeFromPointer(separatorIndex, event);
          }}
          onPointerMove={(event) => {
            if (draggingSeparatorIndexRef.current !== separatorIndex) {
              return;
            }

            updateSizeFromPointer(separatorIndex, event);
          }}
          onPointerUp={() => {
            draggingSeparatorIndexRef.current = null;
          }}
          onPointerCancel={() => {
            draggingSeparatorIndexRef.current = null;
          }}
          onMouseDown={(event) => {
            event.preventDefault();
            draggingSeparatorIndexRef.current = separatorIndex;
            updateSizeFromPointer(separatorIndex, event);
          }}
          onMouseMove={(event) => {
            if (draggingSeparatorIndexRef.current !== separatorIndex) {
              return;
            }
            updateSizeFromPointer(separatorIndex, event);
          }}
          onMouseUp={() => {
            draggingSeparatorIndexRef.current = null;
          }}
          role="separator"
          tabIndex={0}
        />
      ))}
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

function sumBeforeIndex(values: number[], indexExclusive: number): number {
  return values.slice(0, indexExclusive).reduce((sum, value) => sum + value, 0);
}

function normalizePaneSizes(
  values: number[],
  paneCount: number,
  minSize: number,
  maxSize: number,
): number[] {
  const base = values.slice(0, paneCount);
  while (base.length < paneCount) {
    base.push(100 / paneCount);
  }
  const total = base.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0) || 1;
  let normalized = base.map((value) => ((Number.isFinite(value) ? value : 0) / total) * 100);
  normalized = normalized.map((value) => clampSize(value, minSize, maxSize));
  const normalizedTotal = normalized.reduce((sum, value) => sum + value, 0) || 1;
  normalized = normalized.map((value) => (value / normalizedTotal) * 100);
  const rounded = normalized.map((value) => Number(value.toFixed(4)));
  const diff = Number((100 - rounded.reduce((sum, value) => sum + value, 0)).toFixed(4));
  rounded[rounded.length - 1] = Number((rounded[rounded.length - 1] + diff).toFixed(4));
  return rounded;
}

function clampSizeInPair(
  value: number,
  pairTotal: number,
  minSize: number,
  maxSize: number,
): number {
  const minBound = Math.max(minSize, pairTotal - maxSize);
  const maxBound = Math.min(maxSize, pairTotal - minSize);
  return Math.min(maxBound, Math.max(minBound, value));
}

function applyAdjacentResize(
  separatorIndex: number,
  nextLeft: number,
  pairTotal: number,
  isThreePane: boolean,
  currentSizes: number[],
  paneCount: number,
  minSize: number,
  maxSize: number,
  setCurrentSize: (next: number) => void,
  setCurrentSizes: (next: number[]) => void,
) {
  if (!isThreePane) {
    setCurrentSize(nextLeft);
    return;
  }

  const nextSizes = [...currentSizes];
  nextSizes[separatorIndex] = nextLeft;
  nextSizes[separatorIndex + 1] = pairTotal - nextLeft;
  setCurrentSizes(normalizePaneSizes(nextSizes, paneCount, minSize, maxSize));
}
