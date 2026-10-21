import { useGridraHoverCard } from "@gridra-ui/headless";
import type { Ref } from "react";
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
import { useControllableValue } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "@gridra-ui/headless";
import { mergeRefs } from "@gridra-ui/headless";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";
import { useDocumentEvent } from "@gridra-ui/headless";
import { useFloatingPosition } from "@gridra-ui/headless";

export type GridraHoverCardPlacement = "top" | "right" | "bottom" | "left";

export type GridraHoverCardSize = "sm" | "md" | "lg";

// HTML属性とぶつかるcontent/children/onChangeは、anchor・card内容・開閉状態の意味に合わせて独自定義する。
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

  const {
    currentOpen,
    portalMounted,
    anchorRef,
    cardRef,
    cardId,
    coords,
    resolvedPlacement,
    handleCardBlur,
    cancelHide,
    startHide,
    getTriggerProps,
  } = useGridraHoverCard({
    open,
    defaultOpen,
    onOpenChange,
    showDelay,
    hideDelay,
    disabled,
    closeOnEscape,
    placement,
    offset: HOVER_CARD_OFFSET,
  });
  const anchorProps = getTriggerProps<HTMLElement>({
    ...children.props,
    ref:
      (children.props.ref as Ref<HTMLElement> | undefined) ??
      (children as ReactElement & { ref?: Ref<HTMLElement> }).ref,
  });
  const portalTheme = useGridraPortalTheme(
    anchorRef,
    undefined,
    currentOpen && !disabled && portalMounted,
  );
  const cardClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-hover-card",
    `gridra-hover-card--${resolvedPlacement}`,
    `gridra-hover-card--${size}`,
    className,
  );

  // ユーザー指定の style を保ちつつ、計算済み座標とサイズ指定用 CSS 変数を付与する。
  // 任意サイズはCSS変数でtheme側へ渡し、classの種類を増やさない。
  const cardStyle = useMemo(
    () =>
      ({
        ...portalTheme.style,
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
      portalTheme.style,
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
