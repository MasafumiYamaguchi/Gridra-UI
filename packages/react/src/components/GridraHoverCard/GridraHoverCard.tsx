import { useGridraHoverCard } from "@gridra-ui/headless";
import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../internal/classNames";
import { getChildRef } from "../../internal/getChildRef";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";

export type GridraHoverCardPlacement = "top" | "right" | "bottom" | "left";

export type GridraHoverCardSize = "sm" | "md" | "lg";

// HTML属性とぶつかるcontent/children/onChangeは、アンカー・カード内容・開閉状態の意味に合わせて独自定義する。
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

export function GridraHoverCard({
  children,
  className,
  closeOnEscape = true,
  content,
  defaultOpen = false,
  disabled = false,
  height,
  hideDelay,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  onOpenChange,
  open,
  placement = "bottom",
  showDelay,
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
    resolvedPlacement,
    getTriggerProps,
    getContentProps,
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
    ref: getChildRef<HTMLElement>(children),
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

  // ユーザー指定の style を保ちつつ、サイズ指定用 CSS 変数を付与する。
  // 任意サイズはCSS変数でtheme側へ渡し、classの種類を増やさない。
  // id / role / ref、カード側のhover・focus処理、座標(top / left)・位置指定はgetContentPropsが付与する。
  const contentProps = getContentProps({
    ...props,
    className: cardClassName,
    style: {
      ...portalTheme.style,
      ...style,
      "--gridra-hover-card-width": width,
      "--gridra-hover-card-min-width": minWidth,
      "--gridra-hover-card-max-width": maxWidth,
      "--gridra-hover-card-height": height,
      "--gridra-hover-card-min-height": minHeight,
      "--gridra-hover-card-max-height": maxHeight,
    } as CSSProperties,
  });
  const portalTarget = getPortalTarget();

  return (
    <>
      {cloneElement(children, anchorProps)}
      {currentOpen && !disabled && portalMounted && portalTarget
        ? createPortal(
            <div {...contentProps}>{content}</div>,
            portalTarget,
          )
        : null}
    </>
  );
}
