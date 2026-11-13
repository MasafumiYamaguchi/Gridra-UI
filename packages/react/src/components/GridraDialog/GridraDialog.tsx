import { useGridraDialog } from "@gridra-ui/headless";
import {
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../internal/classNames";
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
    getTriggerProps,
    getDialogProps,
    getBackdropProps,
    getCloseProps,
  } = useGridraDialog({
    open,
    defaultOpen,
    onOpenChange,
    closeOnEscape,
    closeOnBackdropPointerDown,
    initialFocusRef,
    hasDescription: Boolean(description),
    id: props.id,
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
              {...getBackdropProps({
                className: backdropClassName,
                style: portalTheme.style,
              })}
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
                      {...getCloseProps({
                        "aria-label": closeLabel,
                        className: "gridra-dialog__close",
                      })}
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
