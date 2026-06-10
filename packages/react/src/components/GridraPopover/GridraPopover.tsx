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
import { useControllableValue } from "../../hooks/useControllableValue";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "../../internal/composeHandlers";
import { mergeRefs } from "../../internal/mergeRefs";
import { getGridraThemeClassName, getPortalTarget } from "../../internal/theme";
import { useDocumentEvent } from "../../internal/useDocumentEvent";
import { useFloatingPosition } from "../../internal/useFloatingPosition";

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
  const anchorElement = children as ReactElement<Record<string, unknown>>;
  const anchorRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [portalMounted, setPortalMounted] = useState(false);
  const popoverId = useId();

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const { coords, resolvedPlacement } = useFloatingPosition({
    anchorRef,
    disabled,
    floatingRef: popoverRef,
    offset: POPOVER_OFFSET,
    open: currentOpen,
    placement,
    updateDeps: [content, size, maxWidth],
  });

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && currentOpen) {
        event.preventDefault();
        setCurrentOpen(false);
      }
    },
    [closeOnEscape, currentOpen, setCurrentOpen],
  );

  useDocumentEvent("keydown", handleEscape, currentOpen);

  const handleOutsidePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!closeOnOutsidePointerDown || !currentOpen) {
        return;
      }
      const target = event.target as Node | null;
      if (
        target &&
        !popoverRef.current?.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        setCurrentOpen(false);
      }
    },
    [closeOnOutsidePointerDown, currentOpen, setCurrentOpen],
  );

  useDocumentEvent("pointerdown", handleOutsidePointerDown, currentOpen, true);

  const toggleOpen = () => {
    if (disabled) {
      return;
    }
    setCurrentOpen(!currentOpen);
  };

  const anchorProps = {
    "aria-controls": !disabled && currentOpen ? popoverId : undefined,
    "aria-expanded": !disabled ? currentOpen : undefined,
    onClick: composeHandlers(
      anchorElement.props.onClick as ((event: MouseEvent) => void) | undefined,
      toggleOpen,
    ),
    ref: mergeRefs(
      (anchorElement as ReactElement & { ref?: unknown }).ref,
      (node: HTMLElement | null) => {
        anchorRef.current = node;
      },
    ),
  };

  const popoverClassName = cx(
    "gridra-root",
    getGridraThemeClassName(anchorRef.current),
    "gridra-popover",
    `gridra-popover--${resolvedPlacement}`,
    `gridra-popover--${size}`,
    className,
  );

  const popoverStyle = useMemo(
    () =>
      ({
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
    [coords.left, coords.top, maxWidth, style],
  );
  const portalTarget = getPortalTarget();

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <>
      {cloneElement(children, anchorProps)}
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

