import { useGridraDialog } from "@gridra-ui/headless";
import type { Ref } from "react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useControllableValue } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "@gridra-ui/headless";
import { FOCUSABLE_SELECTOR, getFocusableElements } from "@gridra-ui/headless";
import { mergeRefs } from "@gridra-ui/headless";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";

export type GridraDialogSize = "sm" | "md" | "lg" | "fullscreen";

// HTML属性とぶつかるcontent/title/children/onChangeは、Dialogのslotと開閉状態の意味に合わせて独自定義する。
export interface GridraDialogProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content" | "title" | "children" | "onChange"
> {
  children?: ReactElement<Record<string, unknown>>;
  title: ReactNode;
  description?: ReactNode;
  content: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  size?: GridraDialogSize;
  closeLabel?: string;
  closeOnEscape?: boolean;
  closeOnBackdropPointerDown?: boolean;
  showCloseButton?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export function GridraDialog({
  children,
  className,
  closeLabel = "Close dialog",
  closeOnBackdropPointerDown = true,
  closeOnEscape = true,
  content,
  defaultOpen = false,
  description,
  initialFocusRef,
  onOpenChange,
  open,
  showCloseButton = true,
  size = "md",
  style,
  title,
  ...props
}: GridraDialogProps) {
  const {
    currentOpen,
    portalMounted,
    triggerRef,
    titleId,
    descriptionId,
    close,
    handleBackdropPointerDown,
    getTriggerProps,
    getDialogProps,
  } = useGridraDialog({
    open,
    defaultOpen,
    onOpenChange,
    closeOnEscape,
    closeOnBackdropPointerDown,
    initialFocusRef,
    hasDescription: Boolean(description),
  });
  const triggerElement = children;
  const triggerProps =
    triggerElement && isValidElement(triggerElement)
      ? getTriggerProps<HTMLElement>({
          ...triggerElement.props,
          ref:
            (triggerElement.props.ref as Ref<HTMLElement> | undefined) ??
            (triggerElement as ReactElement & { ref?: Ref<HTMLElement> }).ref,
        })
      : undefined;
  const portalTheme = useGridraPortalTheme(
    triggerRef,
    undefined,
    currentOpen && portalMounted,
  );
  const dialogClassName = cx(
    "gridra-dialog",
    `gridra-dialog--${size}`,
    className,
  );
  const backdropClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-dialog__backdrop",
  );
  const portalTarget = getPortalTarget();

  return (
    <>
      {triggerElement && isValidElement(triggerElement)
        ? cloneElement(triggerElement, triggerProps)
        : null}
      {currentOpen && portalMounted && portalTarget
        ? createPortal(
            <div
              className={backdropClassName}
              style={portalTheme.style}
              onPointerDown={handleBackdropPointerDown}
            >
              <div
                {...getDialogProps(props)}
                className={dialogClassName}
                style={style}
              >
                <header className="gridra-dialog__header">
                  <h2 className="gridra-dialog__title" id={titleId}>
                    {title}
                  </h2>
                  {description ? (
                    <p
                      className="gridra-dialog__description"
                      id={descriptionId}
                    >
                      {description}
                    </p>
                  ) : null}
                  {showCloseButton ? (
                    <button
                      aria-label={closeLabel}
                      className="gridra-dialog__close"
                      onClick={close}
                      type="button"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  ) : null}
                </header>
                <div className="gridra-dialog__body">{content}</div>
              </div>
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}
