import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  useMemo,
  useRef,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";
import { clampNumber } from "../../internal/numeric";

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
      setCurrentSize(clampSize(rawPercent, minSize, maxSize));
      return;
    }

    // 3paneでは隣接する2paneの合計を保ったまま、境界の左右だけを更新する。
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
  // 値と制約を有限な0〜100の範囲へ揃えてからclampする。
  const { min, max } = normalizeSizeConstraints(minSize, maxSize);
  const safeValue = Number.isFinite(value) ? value : min;
  return clampNumber(safeValue, min, max);
}

function normalizeSizeConstraints(
  minSize: number,
  maxSize: number,
): { min: number; max: number } {
  // minとmaxが逆でも呼び出し側が同じ範囲として扱えるよう並べ直す。
  const rawMin = Number.isFinite(minSize) ? clampNumber(minSize, 0, 100) : 0;
  const rawMax = Number.isFinite(maxSize) ? clampNumber(maxSize, 0, 100) : 100;

  return rawMin <= rawMax
    ? { min: rawMin, max: rawMax }
    : { min: rawMax, max: rawMin };
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
  // 不足分を均等値で補い、入力値の比率を保ちながら合計100%へ変換する。
  const base = values.slice(0, paneCount);
  while (base.length < paneCount) {
    base.push(100 / paneCount);
  }
  const total = base.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0) || 1;
  let normalized = base.map((value) => ((Number.isFinite(value) ? value : 0) / total) * 100);
  normalized = normalized.map((value) => clampSize(value, minSize, maxSize));
  const normalizedTotal = normalized.reduce((sum, value) => sum + value, 0) || 1;
  normalized = normalized.map((value) => (value / normalizedTotal) * 100);
  // 丸め誤差は最後のpaneへ戻し、CSS上の合計を常に100%にする。
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
  // 相手側paneもmin/maxを満たせるよう、隣接2paneの合計から許容範囲を求める。
  const { min, max } = normalizeSizeConstraints(minSize, maxSize);
  const total = Number.isFinite(pairTotal) && pairTotal > 0 ? pairTotal : 100;
  const minBound = Math.max(min, total - max);
  const maxBound = Math.min(max, total - min);
  const lower = Math.min(minBound, maxBound);
  const upper = Math.max(minBound, maxBound);
  const safeValue = Number.isFinite(value) ? value : lower;

  return clampNumber(safeValue, lower, upper);
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
  // 2paneと3paneで状態の持ち方が異なるため、更新先をここで切り替える。
  if (!isThreePane) {
    setCurrentSize(nextLeft);
    return;
  }

  const nextSizes = [...currentSizes];
  nextSizes[separatorIndex] = nextLeft;
  nextSizes[separatorIndex + 1] = pairTotal - nextLeft;
  setCurrentSizes(normalizePaneSizes(nextSizes, paneCount, minSize, maxSize));
}
