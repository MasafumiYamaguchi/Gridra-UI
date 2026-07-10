import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
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
import { getPortalTarget } from "../../internal/theme";
import { useGridraThemeClassName } from "../../internal/themeContext";
import { useFloatingPosition } from "../../internal/useFloatingPosition";

export type GridraTooltipPlacement = "top" | "right" | "bottom" | "left";
export type GridraTooltipSize = "sm" | "md" | "lg";

export interface GridraTooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content" | "children" | "onChange"> {
  children: ReactElement<Record<string, unknown>>;
  content: ReactNode;
  placement?: GridraTooltipPlacement;
  size?: GridraTooltipSize;
  maxWidth?: number | string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  showDelay?: number;
  disabled?: boolean;
}

const TOOLTIP_OFFSET = 8;
const DEFAULT_SHOW_DELAY = 120;

export function GridraTooltip({
  children,
  className,
  content,
  defaultOpen = false,
  disabled = false,
  maxWidth,
  onOpenChange,
  open,
  placement = "top",
  showDelay = DEFAULT_SHOW_DELAY,
  size = "md",
  style,
  ...props
}: GridraTooltipProps) {
  // childrenはTooltipを表示するきっかけとなるアンカー要素として扱う。
  const anchorElement = children as ReactElement<Record<string, unknown>>;
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [portalMounted, setPortalMounted] = useState(false);
  const tooltipId = useId();

  useEffect(() => {
    // documentが使えるクライアント側でのみPortalを許可する。
    setPortalMounted(true);
    return () => {
      // 表示待ちのまま破棄された場合に、遅延コールバックがstateを更新しないようにする。
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  // アンカーとTooltipの実寸から、画面内に収まる座標と向きを求める。
  const { coords, resolvedPlacement } = useFloatingPosition({
    anchorRef,
    disabled,
    floatingRef: tooltipRef,
    offset: TOOLTIP_OFFSET,
    open: currentOpen,
    placement,
    updateDeps: [content, size, maxWidth],
  });

  const openWithDelay = () => {
    if (disabled) {
      return;
    }
    if (openTimerRef.current !== null) {
      // hoverとfocusが連続しても、表示タイマーを重複させない。
      window.clearTimeout(openTimerRef.current);
    }
    openTimerRef.current = window.setTimeout(() => {
      setCurrentOpen(true);
      openTimerRef.current = null;
    }, Math.max(0, showDelay));
  };

  const closeImmediately = () => {
    // 表示前に離れた場合は待機タイマーも取り消す。
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    setCurrentOpen(false);
  };

  // 元のイベントとrefを残したまま、hover・focusによる開閉処理を合成する。
  const anchorProps = {
    "aria-describedby": !disabled && currentOpen ? tooltipId : undefined,
    onMouseEnter: composeHandlers(anchorElement.props.onMouseEnter as ((event: unknown) => void) | undefined, openWithDelay),
    onMouseLeave: composeHandlers(anchorElement.props.onMouseLeave as ((event: unknown) => void) | undefined, closeImmediately),
    onFocus: composeHandlers(anchorElement.props.onFocus as ((event: unknown) => void) | undefined, openWithDelay),
    onBlur: composeHandlers(anchorElement.props.onBlur as ((event: unknown) => void) | undefined, closeImmediately),
    ref: mergeRefs((anchorElement as ReactElement & { ref?: unknown }).ref, (node: HTMLElement | null) => {
      anchorRef.current = node;
    }),
  };

  const portalThemeClassName = useGridraThemeClassName(anchorRef);
  const tooltipClassName = cx(
    "gridra-portal-root",
    portalThemeClassName,
    "gridra-tooltip",
    `gridra-tooltip--${resolvedPlacement}`,
    `gridra-tooltip--${size}`,
    className,
  );

  const tooltipStyle = useMemo(
    () =>
      ({
        ...style,
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        "--gridra-tooltip-max-width":
          maxWidth === undefined
            ? undefined
            : typeof maxWidth === "number"
              ? `${maxWidth}px`
              : maxWidth,
      }) as CSSProperties,
    [coords.left, coords.top, maxWidth, style],
  );
  const portalTarget = getPortalTarget();

  // cloneElementできないchildrenはアンカーとして成立しないため描画しない。
  if (!isValidElement(children)) {
    return null;
  }

  return (
    <>
      {cloneElement(children, anchorProps)}
      {/* Portal先でもテーマとARIA参照を維持したTooltipだけを開いている間描画する。 */}
      {currentOpen && !disabled && portalMounted && portalTarget
        ? createPortal(
            <div
              {...props}
              className={tooltipClassName}
              id={tooltipId}
              ref={tooltipRef}
              role="tooltip"
              style={tooltipStyle}
            >
              {content}
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}

// アンカーは元のDOM位置に残し、説明要素だけをPortal先へ分離する。
