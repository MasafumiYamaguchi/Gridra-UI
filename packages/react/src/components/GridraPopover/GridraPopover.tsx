import { useGridraPopover } from "@gridra-ui/headless";
import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../internal/classNames";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";

export type GridraPopoverPlacement = "top" | "right" | "bottom" | "left";

export type GridraPopoverSize = "sm" | "md" | "lg";

export interface GridraPopoverProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content" | "children" | "onChange"
> {
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
  const {
    currentOpen,
    portalMounted,
    anchorRef,
    resolvedPlacement,
    getTriggerProps,
    getContentProps,
  } = useGridraPopover({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    closeOnEscape,
    closeOnOutsidePointerDown,
    placement,
    offset: POPOVER_OFFSET,
  });
  const anchorProps = getTriggerProps<HTMLElement>(
    isValidElement(children)
      ? {
          ...children.props,
          ref:
            (children.props.ref as Ref<HTMLElement> | undefined) ??
            (children as ReactElement & { ref?: Ref<HTMLElement> }).ref,
        }
      : {},
  );
  // Portal化してもテーマが揃うよう、アンカー側のテーマclassを引き継ぐ。
  const portalTheme = useGridraPortalTheme(
    anchorRef,
    undefined,
    currentOpen && !disabled && portalMounted,
  );
  const popoverClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-popover",
    `gridra-popover--${resolvedPlacement}`,
    `gridra-popover--${size}`,
    className,
  );

  // 座標(top / left)と位置指定はgetContentPropsが付与する。
  const contentProps = getContentProps({
    ...props,
    className: popoverClassName,
    style: {
      ...portalTheme.style,
      ...style,
      "--gridra-popover-max-width":
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
      {/* アンカーは元のDOM位置に残し、浮動部分だけをPortal先へ分離する。 */}
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
