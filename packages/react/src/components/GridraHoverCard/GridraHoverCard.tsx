import {
  cloneElement,
  isValidElement,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useControllableValue } from "../../hooks/useControllableValue";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "../../internal/composeHandlers";
import { mergeRefs } from "../../internal/mergeRefs";
import { getGridraThemeClassName, getPortalTarget } from "../../internal/theme";
import { useDocumentEvent } from "../../internal/useDocumentEvent";
import { useFloatingPosition } from "../../internal/useFloatingPosition";

export type GridraHoverCardPlacement = "top" | "right" | "bottom" | "left";
export type GridraHoverCardSize = "sm" | "md" | "lg";

// HTML属性とぶつかるので、content, children, onChangeは除外する
export interface GridraHoverCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content" | "children" | "onChange"
> {
  children: ReactElement<Record<string, unknown>>;
  content: ReactNode;
  placement?: GridraHoverCardPlacement;
  size?: GridraHoverCardSize;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  showDelay?: number;
  hideDelay?: number;
  disabled?: boolean;
  closeOnEscape?: boolean;
}

const HOVER_CARD_OFFSET = 4;
const DEFAULT_SHOW_DELAY = 120;
const DEFAULT_HIDE_DELAY = 120;

export function GridraHoverCard({
  children,
  className,
  closeOnEscape = true,
  content,
  defaultOpen = false,
  disabled = false,
  height,
  hideDelay = DEFAULT_HIDE_DELAY,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  onOpenChange,
  open,
  placement = "bottom",
  showDelay = DEFAULT_SHOW_DELAY,
  size = "md",
  style,
  width,
  ...props
}: GridraHoverCardProps) {
  // childrenが有効なReact要素でない場合は何もレンダリングしない
  if (!isValidElement(children)) {
    console.warn("GridraHoverCard: children must be a valid React element.");
    return null;
  }

  const anchorRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  // show/hideの遅延処理をまたいでtimerIDを保持する。
  // 再レンダリングしても値を失わず、不要なタイマーを確実にクリアできるようにするため。
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  // open が渡された場合は controlled、未指定の場合は defaultOpen を初期値にした uncontrolled として扱う。
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [portalMounted, setPortalMounted] = useState(false);
  const cardId = useId();

  // hover/focus の出入りが短時間に連続しても古い show/hide 処理が残らないよう、両方のタイマーを解除する。
  const clearTimers = useCallback(() => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  // Portal の描画先は document に依存するため、クライアントでマウントされた後にだけ参照する。
  // SSR 時や初回レンダリング時に document へアクセスしないようにする。
  useEffect(() => {
    setPortalMounted(true);
    return clearTimers;
  }, [clearTimers]);

  // anchor と card の位置・サイズから表示座標を計算する。
  // content やサイズ指定が変わると card の寸法が変わるため、updateDeps に含めて再計算させる。
  const { coords, resolvedPlacement } = useFloatingPosition({
    anchorRef,
    disabled,
    floatingRef: cardRef,
    offset: HOVER_CARD_OFFSET,
    open: currentOpen,
    placement,
    updateDeps: [
      content,
      size,
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
    ],
  });

  const startShow = useCallback(() => {
    if (disabled) {
      return;
    }
    clearTimers();
    showTimerRef.current = window.setTimeout(
      () => {
        setCurrentOpen(true);
        showTimerRef.current = null;
      },
      Math.max(0, showDelay),
    );
  }, [disabled, clearTimers, showDelay, setCurrentOpen]);

  const startHide = useCallback(() => {
    clearTimers();
    hideTimerRef.current = window.setTimeout(
      () => {
        setCurrentOpen(false);
        hideTimerRef.current = null;
      },
      Math.max(0, hideDelay),
    );
  }, [clearTimers, hideDelay, setCurrentOpen]);

  const closeImmediately = useCallback(() => {
    clearTimers();
    setCurrentOpen(false);
  }, [clearTimers, setCurrentOpen]);

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const handleEscape = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && currentOpen) {
        event.preventDefault();
        closeImmediately();
      }
    },
    [closeOnEscape, currentOpen, closeImmediately],
  );

  useDocumentEvent("keydown", handleEscape, currentOpen);

  // focus が anchor と card の間を移動しただけの場合は HoverCard を閉じない。
  // relatedTarget が DOM Node でない場合もあるため、contains の前に型を確認する。
  const isWithinHoverCard = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Node)) {
      return false;
    }
    return (
      anchorRef.current?.contains(target) === true ||
      cardRef.current?.contains(target) === true
    );
  }, []);

  // anchor から card 内へ focus が移った場合は、操作継続中として閉じない。
  const handleAnchorBlur = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      if (isWithinHoverCard(event.relatedTarget)) {
        cancelHide();
        return;
      }
      startHide();
    },
    [cancelHide, isWithinHoverCard, startHide],
  );

  const handleCardBlur = useCallback(
    (event: ReactFocusEvent<HTMLDivElement>) => {
      if (isWithinHoverCard(event.relatedTarget)) {
        cancelHide();
        return;
      }
      startHide();
    },
    [cancelHide, isWithinHoverCard, startHide],
  );

  // children を HoverCard の anchor として扱うため、ARIA 属性とイベントハンドラを合成して渡す。
  // 既存の children.props のハンドラは composeHandlers で維持する。
  const anchorProps = {
    "aria-controls": !disabled && currentOpen ? cardId : undefined,
    "aria-expanded": !disabled ? currentOpen : undefined,
    "aria-haspopup": "dialog",
    onBlur: composeHandlers(
      children.props.onBlur as
        | ((event: ReactFocusEvent<HTMLElement>) => void)
        | undefined,
      handleAnchorBlur,
    ),
    onFocus: composeHandlers(
      children.props.onFocus as
        | ((event: ReactFocusEvent<HTMLElement>) => void)
        | undefined,
      startShow,
    ),
    onMouseEnter: composeHandlers(
      children.props.onMouseEnter as
        | ((event: ReactMouseEvent<HTMLElement>) => void)
        | undefined,
      startShow,
    ),
    onMouseLeave: composeHandlers(
      children.props.onMouseLeave as
        | ((event: ReactMouseEvent<HTMLElement>) => void)
        | undefined,
      startHide,
    ),
    // children が元々持っている ref を壊さず、内部でも anchor 要素を参照できるようにする。
    ref: mergeRefs(
      (children as ReactElement & { ref?: unknown }).ref,
      (node: HTMLElement | null) => {
        anchorRef.current = node;
      },
    ),
  };

  const cardClassName = cx(
    "gridra-portal-root",
    getGridraThemeClassName(anchorRef.current),
    "gridra-hover-card",
    `gridra-hover-card--${resolvedPlacement}`,
    `gridra-hover-card--${size}`,
    className,
  );

  // ユーザー指定の style を保ちつつ、計算済み座標とサイズ指定用 CSS 変数を付与する。
  // style オブジェクトの参照を安定させ、不要な再生成を避ける。
  const cardStyle = useMemo(
    () =>
      ({
        ...style,
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        "--gridra-hover-card-width": width,
        "--gridra-hover-card-min-width": minWidth,
        "--gridra-hover-card-max-width": maxWidth,
        "--gridra-hover-card-height": height,
        "--gridra-hover-card-min-height": minHeight,
        "--gridra-hover-card-max-height": maxHeight,
      }) as CSSProperties,
    [
      coords.left,
      coords.top,
      height,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      style,
      width,
    ],
  );
  const portalTarget = getPortalTarget();

  return (
    <>
      {cloneElement(children, anchorProps)}
      {currentOpen && !disabled && portalMounted && portalTarget
        ? createPortal(
            <div
              {...props}
              className={cardClassName}
              id={cardId}
              onBlur={composeHandlers(
                props.onBlur as
                  | ((event: ReactFocusEvent<HTMLDivElement>) => void)
                  | undefined,
                handleCardBlur,
              )}
              onFocus={composeHandlers(
                props.onFocus as
                  | ((event: ReactFocusEvent<HTMLDivElement>) => void)
                  | undefined,
                cancelHide,
              )}
              onMouseEnter={composeHandlers(
                props.onMouseEnter as
                  | ((event: ReactMouseEvent<HTMLDivElement>) => void)
                  | undefined,
                cancelHide,
              )}
              onMouseLeave={composeHandlers(
                props.onMouseLeave as
                  | ((event: ReactMouseEvent<HTMLDivElement>) => void)
                  | undefined,
                startHide,
              )}
              ref={cardRef}
              role="dialog"
              style={cardStyle}
            >
              {content}
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}
