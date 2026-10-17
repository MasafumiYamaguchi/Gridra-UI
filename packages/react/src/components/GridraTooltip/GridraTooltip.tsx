import {useGridraTooltip} from "@gridra-ui/headless";
import type {Ref} from "react";
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
import { useControllableValue } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "@gridra-ui/headless";
import { mergeRefs } from "@gridra-ui/headless";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";
import { useFloatingPosition } from "@gridra-ui/headless";

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
  const {currentOpen,portalMounted,anchorRef,tooltipRef,tooltipId,coords,resolvedPlacement,getTriggerProps}=useGridraTooltip({open,defaultOpen,onOpenChange,showDelay,disabled,placement,offset:TOOLTIP_OFFSET});
  const anchorProps=getTriggerProps<HTMLElement>(isValidElement(children)?{...children.props,ref:(children.props.ref as Ref<HTMLElement>|undefined)??(children as ReactElement&{ref?:Ref<HTMLElement>}).ref}:{});
  const portalTheme = useGridraPortalTheme(anchorRef, undefined, currentOpen && !disabled && portalMounted);
  const tooltipClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-tooltip",
    `gridra-tooltip--${resolvedPlacement}`,
    `gridra-tooltip--${size}`,
    className,
  );

  const tooltipStyle = useMemo(
    () =>
      ({
        ...portalTheme.style,
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
    [portalTheme.style, coords.left, coords.top, maxWidth, style],
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
