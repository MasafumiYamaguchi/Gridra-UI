import { useGridraTooltip } from "@gridra-ui/headless";
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

export type GridraTooltipPlacement = "top" | "right" | "bottom" | "left";

export type GridraTooltipSize = "sm" | "md" | "lg";

export interface GridraTooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content" | "children" | "onChange"
> {
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
  showDelay,
  size = "md",
  style,
  ...props
}: GridraTooltipProps) {
  const {
    currentOpen,
    portalMounted,
    anchorRef,
    resolvedPlacement,
    getTriggerProps,
    getContentProps,
  } = useGridraTooltip({
    open,
    defaultOpen,
    onOpenChange,
    showDelay,
    disabled,
    placement,
    offset: TOOLTIP_OFFSET,
  });
  const anchorProps = getTriggerProps<HTMLElement>(
    isValidElement(children)
      ? { ...children.props, ref: getChildRef<HTMLElement>(children) }
      : {},
  );
  const portalTheme = useGridraPortalTheme(
    anchorRef,
    undefined,
    currentOpen && !disabled && portalMounted,
  );
  const tooltipClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-tooltip",
    `gridra-tooltip--${resolvedPlacement}`,
    `gridra-tooltip--${size}`,
    className,
  );

  // id / role / ref と座標(top / left)・位置指定はgetContentPropsが付与する。
  const contentProps = getContentProps({
    ...props,
    className: tooltipClassName,
    style: {
      ...portalTheme.style,
      ...style,
      "--gridra-tooltip-max-width":
        maxWidth === undefined
          ? undefined
          : typeof maxWidth === "number"
            ? `${maxWidth}px`
            : maxWidth,
    } as CSSProperties,
  });
  const portalTarget = getPortalTarget();

  // cloneElementできないchildrenはアンカーとして成立しないため描画しない。
  if (!isValidElement(children)) {
    return null;
  }

  return (
    <>
      {/* アンカーは元のDOM位置に残し、説明要素だけをPortal先へ分離する。 */}
      {cloneElement(children, anchorProps)}
      {/* Portal先でもテーマとARIA参照を維持したTooltipだけを開いている間描画する。 */}
      {currentOpen && !disabled && portalMounted && portalTarget
        ? createPortal(
            <div {...contentProps}>{content}</div>,
            portalTarget,
          )
        : null}
    </>
  );
}
