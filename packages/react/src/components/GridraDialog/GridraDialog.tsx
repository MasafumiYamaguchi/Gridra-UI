import {
  cloneElement,
  isValidElement,
  useCallback,
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
import { useControllableValue } from "../../hooks/useControllableValue";

export type GridraDialogSize = "sm" | "md" | "lg" | "fullscreen";

export interface GridraDialogProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content" | "title" | "children" | "onChange"> {
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const triggerElement = children;
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [portalMounted, setPortalMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const close = useCallback(() => {
    setCurrentOpen(false);
  }, [setCurrentOpen]);

  const openDialog = useCallback(() => {
    setCurrentOpen(true);
  }, [setCurrentOpen]);

  const toggleOpen = useCallback(() => {
    if (currentOpen) {
      close();
    } else {
      openDialog();
    }
  }, [currentOpen, close, openDialog]);

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable) {
        focusable.focus();
      } else {
        dialog.focus();
      }
    });

    return () => {
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus();
      } else {
        triggerRef.current?.focus();
      }
      previousFocusRef.current = null;
    };
  }, [currentOpen, initialFocusRef]);

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first || !dialog.contains(document.activeElement)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !dialog.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentOpen, closeOnEscape, close]);

  const handleBackdropPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!closeOnBackdropPointerDown) {
        return;
      }
      if (event.target === event.currentTarget) {
        close();
      }
    },
    [closeOnBackdropPointerDown, close],
  );

  const triggerProps =
    triggerElement && isValidElement(triggerElement)
      ? {
          "aria-controls": undefined,
          "aria-expanded": currentOpen,
          "aria-haspopup": "dialog" as const,
          onClick: composeHandlers(
            triggerElement.props.onClick as ((event: MouseEvent) => void) | undefined,
            toggleOpen,
          ),
          ref: mergeRefs(
            (triggerElement as ReactElement & { ref?: unknown }).ref,
            (node: HTMLElement | null) => {
              triggerRef.current = node;
            },
          ),
        }
      : undefined;

  const dialogClassName = [
    "gridra-dialog",
    `gridra-dialog--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const backdropClassName = [
    "gridra-root",
    getGridraThemeClassName(triggerRef.current),
    "gridra-dialog__backdrop",
  ]
    .filter(Boolean)
    .join(" ");
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
              onPointerDown={handleBackdropPointerDown}
            >
              <div
                {...props}
                aria-describedby={description ? descriptionId : undefined}
                aria-labelledby={titleId}
                aria-modal="true"
                className={dialogClassName}
                ref={dialogRef}
                role="dialog"
                style={style}
              >
                <header className="gridra-dialog__header">
                  <h2 className="gridra-dialog__title" id={titleId}>
                    {title}
                  </h2>
                  {description ? (
                    <p className="gridra-dialog__description" id={descriptionId}>
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

function getPortalTarget(): HTMLElement | null {
  return typeof document === "undefined" ? null : document.body;
}

function getGridraThemeClassName(anchor: HTMLElement | null) {
  if (typeof document === "undefined") {
    return undefined;
  }

  const themeHost =
    anchor?.closest(".gridra-theme-dark, .gridra-theme-light") ??
    document.querySelector(".gridra-theme-dark, .gridra-theme-light");
  return Array.from(themeHost?.classList ?? []).find(
    (className) => className === "gridra-theme-dark" || className === "gridra-theme-light",
  );
}

function composeHandlers<TEvent>(
  existing: ((event: TEvent) => void) | undefined,
  next: (event: TEvent) => void,
) {
  return (event: TEvent) => {
    existing?.(event);
    if (!(event as unknown as { defaultPrevented: boolean }).defaultPrevented) {
      next(event);
    }
  };
}

function mergeRefs<TValue>(
  originalRef: unknown,
  nextRef: (value: TValue | null) => void,
) {
  return (value: TValue | null) => {
    if (typeof originalRef === "function") {
      originalRef(value);
    } else if (originalRef && typeof originalRef === "object" && "current" in (originalRef as object)) {
      (originalRef as { current: TValue | null }).current = value;
    }
    nextRef(value);
  };
}
