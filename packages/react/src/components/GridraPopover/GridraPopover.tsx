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
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";
import { composeHandlers } from "../../internal/composeHandlers";
import { mergeRefs } from "../../internal/mergeRefs";
import { computeFloatingPosition, isOutOfViewport, oppositePlacement } from "../../internal/floating";

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
  const [resolvedPlacement, setResolvedPlacement] = useState<GridraPopoverPlacement>(placement);
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const popoverId = useId();

  useEffect(() => {
    setResolvedPlacement(placement);
  }, [placement]);

  useLayoutEffect(() => {
    if (!currentOpen || disabled) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const popover = popoverRef.current;
      if (!anchor || !popover) {
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const initial = computeFloatingPosition(anchorRect, popoverRect, placement, POPOVER_OFFSET);
      let nextPlacement = placement;
      let nextCoords = initial;

      if (isOutOfViewport(initial, popoverRect)) {
        nextPlacement = oppositePlacement(placement);
        nextCoords = computeFloatingPosition(anchorRect, popoverRect, nextPlacement, POPOVER_OFFSET);
      }

      setResolvedPlacement(nextPlacement);
      setCoords(nextCoords);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [currentOpen, disabled, placement, content, size, maxWidth]);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && currentOpen) {
        event.preventDefault();
        setCurrentOpen(false);
      }
    },
    [closeOnEscape, currentOpen, setCurrentOpen],
  );

  useEffect(() => {
    if (!currentOpen) {
      return;
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [currentOpen, handleEscape]);

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

  useEffect(() => {
    if (!currentOpen) {
      return;
    }
    document.addEventListener("pointerdown", handleOutsidePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown, true);
    };
  }, [currentOpen, handleOutsidePointerDown]);

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

  const popoverClassName = [
    "gridra-popover",
    `gridra-popover--${resolvedPlacement}`,
    `gridra-popover--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

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

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <>
      {cloneElement(children, anchorProps)}
      {currentOpen && !disabled ? (
        <div
          {...props}
          className={popoverClassName}
          id={popoverId}
          ref={popoverRef}
          style={popoverStyle}
        >
          {content}
        </div>
      ) : null}
    </>
  );
}

