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
      const initial = computePosition(anchorRect, popoverRect, placement);
      let nextPlacement = placement;
      let nextCoords = initial;

      if (isOutOfViewport(initial, popoverRect)) {
        nextPlacement = oppositePlacement(placement);
        nextCoords = computePosition(anchorRect, popoverRect, nextPlacement);
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

function computePosition(
  anchorRect: DOMRect,
  popoverRect: DOMRect,
  popoverPlacement: GridraPopoverPlacement,
) {
  if (popoverPlacement === "top") {
    return {
      top: anchorRect.top - popoverRect.height - POPOVER_OFFSET,
      left: anchorRect.left + (anchorRect.width - popoverRect.width) / 2,
    };
  }
  if (popoverPlacement === "right") {
    return {
      top: anchorRect.top + (anchorRect.height - popoverRect.height) / 2,
      left: anchorRect.right + POPOVER_OFFSET,
    };
  }
  if (popoverPlacement === "bottom") {
    return {
      top: anchorRect.bottom + POPOVER_OFFSET,
      left: anchorRect.left + (anchorRect.width - popoverRect.width) / 2,
    };
  }
  return {
    top: anchorRect.top + (anchorRect.height - popoverRect.height) / 2,
    left: anchorRect.left - popoverRect.width - POPOVER_OFFSET,
  };
}

function isOutOfViewport(
  candidateCoords: { top: number; left: number },
  popoverRect: DOMRect,
) {
  return (
    candidateCoords.top < 0 ||
    candidateCoords.left < 0 ||
    candidateCoords.top + popoverRect.height > window.innerHeight ||
    candidateCoords.left + popoverRect.width > window.innerWidth
  );
}

function oppositePlacement(
  popoverPlacement: GridraPopoverPlacement,
): GridraPopoverPlacement {
  if (popoverPlacement === "top") {
    return "bottom";
  }
  if (popoverPlacement === "bottom") {
    return "top";
  }
  if (popoverPlacement === "left") {
    return "right";
  }
  return "left";
}
