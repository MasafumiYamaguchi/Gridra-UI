import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";

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
  const anchorElement = children as ReactElement<Record<string, unknown>>;
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [resolvedPlacement, setResolvedPlacement] = useState<GridraTooltipPlacement>(placement);
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const tooltipId = useId();

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setResolvedPlacement(placement);
  }, [placement]);

  useLayoutEffect(() => {
    if (!currentOpen || disabled) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const tooltip = tooltipRef.current;
      if (!anchor || !tooltip) {
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const initial = computePosition(anchorRect, tooltipRect, placement);
      let nextPlacement = placement;
      let nextCoords = initial;

      if (isOutOfViewport(initial, tooltipRect)) {
        nextPlacement = oppositePlacement(placement);
        nextCoords = computePosition(anchorRect, tooltipRect, nextPlacement);
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

  const openWithDelay = () => {
    if (disabled) {
      return;
    }
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
    }
    openTimerRef.current = window.setTimeout(() => {
      setCurrentOpen(true);
      openTimerRef.current = null;
    }, Math.max(0, showDelay));
  };

  const closeImmediately = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    setCurrentOpen(false);
  };

  const anchorProps = {
    "aria-describedby": !disabled && currentOpen ? tooltipId : undefined,
    onMouseEnter: composeHandlers(anchorElement.props.onMouseEnter as ((event: unknown) => void) | undefined, openWithDelay),
    onMouseLeave: composeHandlers(anchorElement.props.onMouseLeave as ((event: unknown) => void) | undefined, closeImmediately),
    onFocus: composeHandlers(anchorElement.props.onFocus as ((event: unknown) => void) | undefined, openWithDelay),
    onBlur: composeHandlers(anchorElement.props.onBlur as ((event: unknown) => void) | undefined, closeImmediately),
    ref: mergeRefs((anchorElement as ReactElement & { ref?: unknown }).ref, (node: HTMLElement | null) => {
      anchorRef.current = node;
    }),
  };

  const tooltipClassName = [
    "gridra-tooltip",
    `gridra-tooltip--${resolvedPlacement}`,
    `gridra-tooltip--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const tooltipStyle = useMemo(
    () =>
      ({
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
          className={tooltipClassName}
          id={tooltipId}
          ref={tooltipRef}
          role="tooltip"
          style={tooltipStyle}
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
    next(event);
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
  tooltipRect: DOMRect,
  placement: GridraTooltipPlacement,
) {
  if (placement === "top") {
    return {
      top: anchorRect.top - tooltipRect.height - TOOLTIP_OFFSET,
      left: anchorRect.left + (anchorRect.width - tooltipRect.width) / 2,
    };
  }
  if (placement === "right") {
    return {
      top: anchorRect.top + (anchorRect.height - tooltipRect.height) / 2,
      left: anchorRect.right + TOOLTIP_OFFSET,
    };
  }
  if (placement === "bottom") {
    return {
      top: anchorRect.bottom + TOOLTIP_OFFSET,
      left: anchorRect.left + (anchorRect.width - tooltipRect.width) / 2,
    };
  }
  return {
    top: anchorRect.top + (anchorRect.height - tooltipRect.height) / 2,
    left: anchorRect.left - tooltipRect.width - TOOLTIP_OFFSET,
  };
}

function isOutOfViewport(
  coords: { top: number; left: number },
  tooltipRect: DOMRect,
) {
  return (
    coords.top < 0 ||
    coords.left < 0 ||
    coords.top + tooltipRect.height > window.innerHeight ||
    coords.left + tooltipRect.width > window.innerWidth
  );
}

function oppositePlacement(placement: GridraTooltipPlacement): GridraTooltipPlacement {
  if (placement === "top") {
    return "bottom";
  }
  if (placement === "bottom") {
    return "top";
  }
  if (placement === "left") {
    return "right";
  }
  return "left";
}
