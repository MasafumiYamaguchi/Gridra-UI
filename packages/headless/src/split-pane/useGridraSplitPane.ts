import {
  useRef,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type Ref,
} from "react";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";
import {
  clampSize,
  clampSizeInPair,
  normalizePaneSizes,
  sumBeforeIndex,
} from "./splitPaneSizing";

export type GridraSplitPaneOrientation = "horizontal" | "vertical";

export interface UseGridraSplitPaneOptions {
  orientation?: GridraSplitPaneOrientation;
  paneCount?: number;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
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

/** 2pane時の先頭paneの既定の割合 (%)。react 側の既定値と共有する。 */
export const DEFAULT_SPLIT_PANE_SIZE = 50;

/** paneの既定の最小割合 (%)。 */
export const DEFAULT_SPLIT_PANE_MIN_SIZE = 10;

/** paneの既定の最大割合 (%)。 */
export const DEFAULT_SPLIT_PANE_MAX_SIZE = 90;

// 矢印キーごとの割合の増減。キー入力のたびに生成しないようモジュール定数にする。
const KEYBOARD_DELTA_BY_KEY: Record<string, number> = {
  ArrowLeft: -KEYBOARD_STEP,
  ArrowUp: -KEYBOARD_STEP,
  ArrowRight: KEYBOARD_STEP,
  ArrowDown: KEYBOARD_STEP,
};

/** paneの割合とポインター・キーボードによる境界操作を管理する。 */
export function useGridraSplitPane({
  paneCount: rawPaneCount = 2,
  orientation = "horizontal",
  size,
  defaultSize = DEFAULT_SPLIT_PANE_SIZE,
  sizes,
  defaultSizes,
  minSize = DEFAULT_SPLIT_PANE_MIN_SIZE,
  maxSize = DEFAULT_SPLIT_PANE_MAX_SIZE,
  onSizeChange,
  onSizesChange,
  onKeyDown,
}: UseGridraSplitPaneOptions = {}) {
  // コンテナの実寸はポインター座標を割合へ変換するために参照する。
  const containerRef = useRef<HTMLDivElement>(null);
  // どのseparatorをドラッグ中かを再描画なしで追跡する。
  const draggingSeparatorIndexRef = useRef<number | null>(null);
  const [currentSize, setCurrentSize] = useControllableValue(
    size === undefined ? undefined : clampSize(size, minSize, maxSize),
    clampSize(defaultSize, minSize, maxSize),
    (next, previous) =>
      onSizeChange?.(next, clampSize(previous, minSize, maxSize)),
  );

  // pane数は2〜3に制限する。不足時は空paneを描画し、超過分の切り詰めは呼び出し側(react)が行う。
  const paneCount = Number.isFinite(rawPaneCount)
    ? Math.min(Math.max(2, Math.floor(rawPaneCount)), 3)
    : 2;
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
      ? normalizePaneSizes(
          sizes.slice(0, paneCount),
          paneCount,
          minSize,
          maxSize,
        )
      : undefined,
    normalizedDefaultSizes,
    onSizesChange,
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
    const pairTotal =
      currentSizes[separatorIndex] + currentSizes[separatorIndex + 1];
    nextSizes[separatorIndex] = nextLeft;
    nextSizes[separatorIndex + 1] = pairTotal - nextLeft;
    const normalized = normalizePaneSizes(
      nextSizes,
      paneCount,
      minSize,
      maxSize,
    );
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
      resizeAdjacentPanes(
        separatorIndex,
        clampSize(rawPercent, minSize, maxSize),
      );

      return;
    }

    // 3paneでは隣接する2paneの合計を保ったまま、境界の左右だけを更新する。
    const previousSum = sumBeforeIndex(currentSizes, separatorIndex);
    const pairTotal =
      currentSizes[separatorIndex] + currentSizes[separatorIndex + 1];
    resizeAdjacentPanes(
      separatorIndex,
      clampSizeInPair(rawPercent - previousSum, pairTotal, minSize, maxSize),
    );
  };

  // separatorのaria-valuenowには、コンテナ先頭からの累積割合を使用する。
  const effectiveSizes = !isThreePane
    ? [
        clampSize(currentSize, minSize, maxSize),
        100 - clampSize(currentSize, minSize, maxSize),
      ]
    : currentSizes;

  const beginDrag = (
    separatorIndex: number,
    event: { clientX: number; clientY: number },
  ) => {
    draggingSeparatorIndexRef.current = separatorIndex;
    updateSizeFromPointer(separatorIndex, event);
  };

  // ドラッグ中のseparatorだけが移動を反映する。
  const moveDrag = (
    separatorIndex: number,
    event: { clientX: number; clientY: number },
  ) => {
    if (draggingSeparatorIndexRef.current !== separatorIndex) {
      return;
    }

    updateSizeFromPointer(separatorIndex, event);
  };

  const endDrag = () => {
    draggingSeparatorIndexRef.current = null;
  };

  const getSeparatorValue = (separatorIndex: number) =>
    Math.round(sumBeforeIndex(effectiveSizes, separatorIndex + 1));

  const getSeparatorProps = (
    separatorIndex: number,
    props: HTMLAttributes<HTMLDivElement> = {},
  ): HTMLAttributes<HTMLDivElement> => {
    if (
      !Number.isInteger(separatorIndex) ||
      separatorIndex < 0 ||
      separatorIndex >= paneCount - 1
    )
      return {
        ...props,
        role: "separator",
        tabIndex: -1,
        "aria-disabled": true,
      };

    return {
      ...props,
      "aria-orientation": orientation,
      "aria-valuemax": 100,
      "aria-valuemin": 0,
      "aria-valuenow": getSeparatorValue(separatorIndex),
      "onKeyDown": composeHandlers(props.onKeyDown, (event) => {
        // 利用側が処理済みのキー操作に、リサイズ処理を重ねない。
        onKeyDown?.(event);
        if (event.defaultPrevented) {
          return;
        }

        const current = isThreePane
          ? currentSizes[separatorIndex]
          : clampSize(currentSize, minSize, maxSize);
        const pairTotal = isThreePane
          ? currentSizes[separatorIndex] + currentSizes[separatorIndex + 1]
          : 100;

        const delta = KEYBOARD_DELTA_BY_KEY[event.key];
        const requested =
          event.key === "Home"
            ? minSize
            : event.key === "End"
              ? maxSize
              : delta === undefined
                ? undefined
                : current + delta;
        if (requested === undefined) {
          return;
        }

        resizeAdjacentPanes(
          separatorIndex,
          clampSizeInPair(requested, pairTotal, minSize, maxSize),
        );
        event.preventDefault();
      }),
      "onPointerDown": composeHandlers(props.onPointerDown, (event) => {
        event.preventDefault();
        // separator外へ移動してもドラッグを継続できるようpointerをcaptureする。
        if (typeof event.currentTarget.setPointerCapture === "function") {
          event.currentTarget.setPointerCapture(event.pointerId);
        }

        beginDrag(separatorIndex, event);
      }),
      "onPointerMove": composeHandlers(props.onPointerMove, (event) => {
        moveDrag(separatorIndex, event);
      }),
      "onPointerUp": composeHandlers(props.onPointerUp, endDrag),
      "onLostPointerCapture": composeHandlers(props.onLostPointerCapture, endDrag),
      "onPointerCancel": composeHandlers(props.onPointerCancel, endDrag),
      "onMouseDown": composeHandlers(props.onMouseDown, (event) => {
        event.preventDefault();
        beginDrag(separatorIndex, event);
      }),
      "onMouseMove": composeHandlers(props.onMouseMove, (event) => {
        moveDrag(separatorIndex, event);
      }),
      "onMouseUp": composeHandlers(props.onMouseUp, endDrag),
      "role": "separator",
      "tabIndex": 0,
    };
  };

  const getContainerProps = (
    props: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> } = {},
  ) => ({
    ...props,
    ref: mergeRefs(props.ref, (element: HTMLDivElement | null) => {
      containerRef.current = element;
    }),
  });

  return {
    paneCount,
    isThreePane,
    currentSize,
    currentSizes,
    effectiveSizes,
    getSeparatorValue,
    getSeparatorProps,
    getContainerProps,
  };
}
