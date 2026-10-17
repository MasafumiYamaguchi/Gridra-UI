import {useGridraPopover} from "@gridra-ui/headless";
import type {Ref} from "react";
import {
  cloneElement,
  isValidElement,
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

export type GridraPopoverPlacement = "top" | "right" | "bottom" | "left";
export type GridraPopoverSize = "sm" | "md" | "lg";

export interface GridraPopoverProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content" | "children" | "onChange"> {
  children: ReactElement<Record<string, unknown>>;
  content: ReactNode;
  placement?: GridraPopoverPlacement;
  size?: GridraPopoverSize;
  maxWidth?: number | string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  disabled?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePointerDown?: boolean;
}

const POPOVER_OFFSET = 6;

export function GridraPopover({
  children,
  className,
  closeOnEscape = true,
  closeOnOutsidePointerDown = true,
  content,
  defaultOpen = false,
  disabled = false,
  maxWidth,
  onOpenChange,
  open,
  placement = "bottom",
  size = "md",
  style,
  ...props
}: GridraPopoverProps) {
  const {currentOpen,portalMounted,anchorRef,popoverRef,popoverId,coords,resolvedPlacement,getTriggerProps}=useGridraPopover({open,defaultOpen,onOpenChange,disabled,closeOnEscape,closeOnOutsidePointerDown,placement,offset:POPOVER_OFFSET});
  const anchorProps=getTriggerProps<HTMLElement>(isValidElement(children)?{...children.props,ref:(children.props.ref as Ref<HTMLElement>|undefined)??(children as ReactElement&{ref?:Ref<HTMLElement>}).ref}:{});
  const portalTheme = useGridraPortalTheme(anchorRef, undefined, currentOpen && !disabled && portalMounted);
  const popoverClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-popover",
    `gridra-popover--${resolvedPlacement}`,
    `gridra-popover--${size}`,
    className,
  );

  const popoverStyle = useMemo(
    () =>
      ({
        ...portalTheme.style,
        ...style,
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        "--gridra-popover-max-width":
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
      {/* Portal化してもテーマが揃うよう、アンカー側のテーマclassを引き継ぐ。 */}
      {currentOpen && !disabled && portalMounted && portalTarget
        ? createPortal(
            <div
              {...props}
              className={popoverClassName}
              id={popoverId}
              ref={popoverRef}
              style={popoverStyle}
            >
              {content}
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}

// アンカーは元のDOM位置に残し、浮動部分だけをPortal先へ分離する。
