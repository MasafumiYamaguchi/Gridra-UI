import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  useMemo,
  useRef,
} from "react";
import { useControllableValue } from "@gridra-ui/headless";
import { clampSize, clampSizeInPair, normalizePaneSizes, sumBeforeIndex } from "./splitPaneSizing";

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
  // コンテナの実寸はポインター座標を割合へ変換するために参照する。
  const containerRef = useRef<HTMLDivElement>(null);
  // どのseparatorをドラッグ中かを再描画なしで追跡する。
  const draggingSeparatorIndexRef = useRef<number | null>(null);
  const [currentSize, setCurrentSize] = useControllableValue(
    size,
    clampSize(defaultSize, minSize, maxSize),
    onSizeChange,
  );

  // pane数は2〜3に制限し、不足時は空pane、超過時は先頭3件だけを使う。
  const childArray = Children.toArray(children);
  const paneCount = Math.min(Math.max(2, childArray.length), 3);
  const paneNodes = childArray.slice(0, paneCount);
  const isThreePane = paneCount === 3;
  // 初期比率はpane数に合わせ、合計が100%になるよう正規化する。
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
  // 3pane時はsizes、2pane時はsizeをそれぞれcontrolled値として扱う。
  const [currentSizes, setCurrentSizes] = useControllableValue(
    isThreePane && sizes && sizes.length >= paneCount
      ? normalizePaneSizes(sizes.slice(0, paneCount), paneCount, minSize, maxSize)
      : undefined,
    normalizedDefaultSizes,
    onSizesChange,
  );

  // 計算した比率をCSS変数へ集約し、orientationごとの配置はCSSへ委ねる。
  const paneStyle = useMemo(
    () => {
      const clampedSize = clampSize(currentSize, minSize, maxSize);

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
    },
    [currentSize, currentSizes, isThreePane, maxSize, minSize, style],
  );

  // 入力経路を問わず、隣接paneの更新と同値判定を一か所で行う。
  const resizeAdjacentPanes = (separatorIndex: number, nextLeft: number) => {
    if (!isThreePane) {
      if (nextLeft !== clampSize(currentSize, minSize, maxSize)) {
        setCurrentSize(nextLeft);
      }
      return;
    }

    const nextSizes = [...currentSizes];
    const pairTotal = currentSizes[separatorIndex] + currentSizes[separatorIndex + 1];
    nextSizes[separatorIndex] = nextLeft;
    nextSizes[separatorIndex + 1] = pairTotal - nextLeft;
    const normalized = normalizePaneSizes(nextSizes, paneCount, minSize, maxSize);
    if (normalized.some((value, index) => value !== currentSizes[index])) {
      setCurrentSizes(normalized);
    }
  };

  const updateSizeFromPointer = (
    separatorIndex: number,
    event: { clientX: number; clientY: number },
  ) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // コンテナ左端または上端からの距離を、orientationに応じて割合へ変換する。
    const rect = container.getBoundingClientRect();
    const rawPercent =
      orientation === "horizontal"
        ? ((event.clientX - rect.left) / rect.width) * 100
        : ((event.clientY - rect.top) / rect.height) * 100;

    if (!Number.isFinite(rawPercent)) {
      return;
    }

    if (!isThreePane) {
      // 2paneではseparatorの絶対位置が先頭paneの割合になる。
      resizeAdjacentPanes(separatorIndex, clampSize(rawPercent, minSize, maxSize));
      return;
    }

    // 3paneでは隣接する2paneの合計を保ったまま、境界の左右だけを更新する。
    const previousSum = sumBeforeIndex(currentSizes, separatorIndex);
    const pairTotal = currentSizes[separatorIndex] + currentSizes[separatorIndex + 1];
    resizeAdjacentPanes(
      separatorIndex,
      clampSizeInPair(rawPercent - previousSum, pairTotal, minSize, maxSize),
    );
  };

  const splitPaneClassName = [
    "gridra-split-pane",
    `gridra-split-pane--${orientation}`,
    isThreePane ? "gridra-split-pane--three" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // separatorのaria-valuenowには、コンテナ先頭からの累積割合を使用する。
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
            // 利用側が処理済みのキー操作に、リサイズ処理を重ねない。
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

            const delta = deltaByKey[event.key];
            const requested = event.key === "Home"
              ? minSize
              : event.key === "End"
                ? maxSize
                : delta === undefined ? undefined : current + delta;
            if (requested === undefined) {
              return;
            }

            resizeAdjacentPanes(
              separatorIndex,
              clampSizeInPair(requested, pairTotal, minSize, maxSize),
            );
            event.preventDefault();
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            draggingSeparatorIndexRef.current = separatorIndex;
            // separator外へ移動してもドラッグを継続できるようpointerをcaptureする。
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
          onLostPointerCapture={() => {
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
