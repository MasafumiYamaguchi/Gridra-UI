import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEventHandler,
} from "react";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";
import { clampNumber, resolveCssLengthToPx } from "@gridra-ui/core";

const DEFAULT_OPEN_WIDTH = 280;

const DEFAULT_MIN_WIDTH = 180;

const DEFAULT_MAX_WIDTH = 480;

const KEYBOARD_STEP = 8;

export interface UseGridraSidebarOptions {
  side?: "left" | "right";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  width?: number | string;
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
}

/** 開閉とリサイズの状態・入力処理を提供する。 */
export function useGridraSidebar({
  side = "left",
  open,
  defaultOpen = true,
  onOpenChange,
  width = DEFAULT_OPEN_WIDTH,
  resizable = false,
  minWidth = DEFAULT_MIN_WIDTH,
  maxWidth = DEFAULT_MAX_WIDTH,
  onKeyDown,
}: UseGridraSidebarOptions = {}) {
  const contentId = useId();
  // open propの有無に応じて、開閉状態をcontrolled/uncontrolledで切り替える。
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [resizedWidth, setResizedWidth] = useState(() =>
    resolveCssLengthToPx(width, DEFAULT_OPEN_WIDTH),
  );
  // ドラッグ開始時のポインター位置と幅を固定し、移動差分から次の幅を求める。
  const dragStartXRef = useRef<number | null>(null);
  const dragStartWidthRef = useRef<number | null>(null);

  useEffect(() => {
    // 外部からwidthが変わった場合は、次のリサイズ開始値も同期する。
    setResizedWidth(resolveCssLengthToPx(width, DEFAULT_OPEN_WIDTH));
  }, [width]);

  const updateWidthFromClientX = (clientX: number) => {
    // ドラッグ開始情報が揃っていないmoveイベントでは幅を変更しない。
    if (
      !resizable ||
      dragStartXRef.current === null ||
      dragStartWidthRef.current === null
    ) {
      return;
    }

    if (!Number.isFinite(clientX) || !Number.isFinite(dragStartXRef.current)) {
      return;
    }

    // 右側Sidebarでは、左方向への移動が幅の増加になるため符号を反転する。
    const sign = side === "left" ? 1 : -1;
    const delta = (clientX - dragStartXRef.current) * sign;
    const nextWidth = clampWidth(
      dragStartWidthRef.current + delta,
      minWidth,
      maxWidth,
    );
    setResizedWidth(nextWidth);
    // 閉じた状態からseparatorを動かした場合は、リサイズ結果が見えるよう開く。
    if (!currentOpen) {
      setCurrentOpen(true);
    }
  };

  const toggleOpen = () => {
    setCurrentOpen(!currentOpen);
  };

  const getSeparatorProps = (
    props: HTMLAttributes<HTMLDivElement> = {},
  ): HTMLAttributes<HTMLDivElement> => {
    if (!resizable)
      return {
        ...props,
        role: "separator",
        tabIndex: -1,
        "aria-disabled": true,
      };

    return {
      ...props,
      "aria-orientation": "vertical",
      "aria-valuemax": maxWidth,
      "aria-valuemin": minWidth,
      "aria-valuenow": Math.round(clampWidth(resizedWidth, minWidth, maxWidth)),
      "onDoubleClick": composeHandlers(props.onDoubleClick, (event) => {
        event.preventDefault();
        toggleOpen();
      }),
      "onKeyDown": composeHandlers(props.onKeyDown, (event) => {
        // 親から渡された処理でpreventDefaultされた場合は、既定操作を重ねない。
        onKeyDown?.(event);
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          toggleOpen();
          event.preventDefault();

          return;
        }

        if (!currentOpen) {
          return;
        }

        let delta = 0;
        // 左右どちらに配置されているかで、矢印キーと幅の増減の対応が変わる。
        if (event.key === "ArrowLeft") {
          delta = side === "left" ? -KEYBOARD_STEP : KEYBOARD_STEP;
        }

        if (event.key === "ArrowRight") {
          delta = side === "left" ? KEYBOARD_STEP : -KEYBOARD_STEP;
        }

        if (event.key === "Home") {
          setResizedWidth(clampWidth(minWidth, minWidth, maxWidth));
          event.preventDefault();

          return;
        }

        if (event.key === "End") {
          setResizedWidth(clampWidth(maxWidth, minWidth, maxWidth));
          event.preventDefault();

          return;
        }

        if (!delta) {
          return;
        }

        setResizedWidth((current) =>
          clampWidth(current + delta, minWidth, maxWidth),
        );
        event.preventDefault();
      }),
      "onPointerCancel": composeHandlers(props.onPointerCancel, () => {
        dragStartXRef.current = null;
        dragStartWidthRef.current = null;
      }),
      "onPointerDown": composeHandlers(props.onPointerDown, (event) => {
        event.preventDefault();
        if (!Number.isFinite(event.clientX)) {
          return;
        }

        dragStartXRef.current = event.clientX;
        dragStartWidthRef.current = clampWidth(
          resizedWidth,
          minWidth,
          maxWidth,
        );
        // 要素外へポインターが出てもmove/upを受け取れるようcaptureする。
        if (typeof event.currentTarget.setPointerCapture === "function") {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }),
      "onPointerMove": composeHandlers(props.onPointerMove, (event) => {
        updateWidthFromClientX(event.clientX);
      }),
      "onPointerUp": composeHandlers(props.onPointerUp, () => {
        dragStartXRef.current = null;
        dragStartWidthRef.current = null;
      }),
      "onMouseDown": composeHandlers(props.onMouseDown, (event) => {
        event.preventDefault();
        if (!Number.isFinite(event.clientX)) {
          return;
        }

        dragStartXRef.current = event.clientX;
        dragStartWidthRef.current = clampWidth(
          resizedWidth,
          minWidth,
          maxWidth,
        );
      }),
      "onMouseMove": composeHandlers(props.onMouseMove, (event) => {
        updateWidthFromClientX(event.clientX);
      }),
      "onMouseUp": composeHandlers(props.onMouseUp, () => {
        dragStartXRef.current = null;
        dragStartWidthRef.current = null;
      }),
      "role": "separator",
      "tabIndex": 0,
      onLostPointerCapture: composeHandlers(props.onLostPointerCapture, () => {
        dragStartXRef.current = null;
        dragStartWidthRef.current = null;
      }),
    };
  };

  return {
    contentId,
    currentOpen,
    setCurrentOpen,
    toggleOpen,
    resizedWidth,
    openWidth: clampWidth(resizedWidth, minWidth, maxWidth),
    getSeparatorProps,
  };
}

function clampWidth(value: number, minWidth: number, maxWidth: number): number {
  // 制約が逆転している場合はminWidthを優先し、範囲計算の破綻を避ける。
  if (minWidth > maxWidth) {
    return minWidth;
  }

  return clampNumber(value, minWidth, maxWidth);
}
