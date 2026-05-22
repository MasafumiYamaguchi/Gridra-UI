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

export type GridraHoverCardPlacement = "top" | "right" | "bottom" | "left";
export type GridraHoverCardSize = "sm" | "md" | "lg";

export interface GridraHoverCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content" | "children" | "onChange"> {
  children: ReactElement<Record<string, unknown>>;
  content: ReactNode;
  placement?: GridraHoverCardPlacement;
  size?: GridraHoverCardSize;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  showDelay?: number;
  hideDelay?: number;
  disabled?: boolean;
  closeOnEscape?: boolean;
}

const HOVER_CARD_OFFSET = 4;
const DEFAULT_SHOW_DELAY = 120;
const DEFAULT_HIDE_DELAY = 120;

export function GridraHoverCard({
  children,
  className,
  closeOnEscape = true,
  content,
  defaultOpen = false,
  disabled = false,
  height,
  hideDelay = DEFAULT_HIDE_DELAY,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  onOpenChange,
  open,
  placement = "bottom",
  showDelay = DEFAULT_SHOW_DELAY,
  size = "md",
  style,
  width,
  ...props
}: GridraHoverCardProps) {
  const anchorElement = children;
  const anchorRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [resolvedPlacement, setResolvedPlacement] = useState<GridraHoverCardPlacement>(placement);
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const cardId = useId();

  const clearTimers = useCallback(() => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  useEffect(() => {
    setResolvedPlacement(placement);
  }, [placement]);

  useLayoutEffect(() => {
    if (!currentOpen || disabled) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const card = cardRef.current;
      if (!anchor || !card) {
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const initial = computePosition(anchorRect, cardRect, placement);
      let nextPlacement = placement;
      let nextCoords = initial;

      if (isOutOfViewport(initial, cardRect)) {
        nextPlacement = oppositePlacement(placement);
        nextCoords = computePosition(anchorRect, cardRect, nextPlacement);
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
  }, [
    currentOpen,
    disabled,
    placement,
    content,
    size,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
  ]);

  const startShow = useCallback(() => {
    if (disabled) {
      return;
    }
    clearTimers();
    showTimerRef.current = window.setTimeout(() => {
      setCurrentOpen(true);
      showTimerRef.current = null;
    }, Math.max(0, showDelay));
  }, [disabled, clearTimers, showDelay, setCurrentOpen]);

  const startHide = useCallback(() => {
    clearTimers();
    hideTimerRef.current = window.setTimeout(() => {
      setCurrentOpen(false);
      hideTimerRef.current = null;
    }, Math.max(0, hideDelay));
  }, [clearTimers, hideDelay, setCurrentOpen]);

  const closeImmediately = useCallback(() => {
    clearTimers();
    setCurrentOpen(false);
  }, [clearTimers, setCurrentOpen]);

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const handleEscape = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && currentOpen) {
        event.preventDefault();
        closeImmediately();
      }
    },
    [closeOnEscape, currentOpen, closeImmediately],
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

  const anchorProps = {
    "aria-controls": !disabled && currentOpen ? cardId : undefined,
    "aria-expanded": !disabled ? currentOpen : undefined,
    onBlur: composeHandlers(
      anchorElement.props.onBlur as ((event: FocusEvent) => void) | undefined,
      startHide,
    ),
    onFocus: composeHandlers(
      anchorElement.props.onFocus as ((event: FocusEvent) => void) | undefined,
      startShow,
    ),
    onMouseEnter: composeHandlers(
      anchorElement.props.onMouseEnter as ((event: MouseEvent) => void) | undefined,
      startShow,
    ),
    onMouseLeave: composeHandlers(
      anchorElement.props.onMouseLeave as ((event: MouseEvent) => void) | undefined,
      startHide,
    ),
    ref: mergeRefs(
      (anchorElement as ReactElement & { ref?: unknown }).ref,
      (node: HTMLElement | null) => {
        anchorRef.current = node;
      },
    ),
  };

  const cardClassName = [
    "gridra-hover-card",
    `gridra-hover-card--${resolvedPlacement}`,
    `gridra-hover-card--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const cardStyle = useMemo(
    () =>
      ({
        ...style,
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        "--gridra-hover-card-width": width,
        "--gridra-hover-card-min-width": minWidth,
        "--gridra-hover-card-max-width": maxWidth,
        "--gridra-hover-card-height": height,
        "--gridra-hover-card-min-height": minHeight,
        "--gridra-hover-card-max-height": maxHeight,
      }) as CSSProperties,
    [
      coords.left,
      coords.top,
      height,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      style,
      width,
    ],
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
          className={cardClassName}
          id={cardId}
          onMouseEnter={cancelHide}
          onMouseLeave={startHide}
          ref={cardRef}
          style={cardStyle}
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
  cardRect: DOMRect,
  cardPlacement: GridraHoverCardPlacement,
) {
  if (cardPlacement === "top") {
    return {
      top: anchorRect.top - cardRect.height - HOVER_CARD_OFFSET,
      left: anchorRect.left + (anchorRect.width - cardRect.width) / 2,
    };
  }
  if (cardPlacement === "right") {
    return {
      top: anchorRect.top + (anchorRect.height - cardRect.height) / 2,
      left: anchorRect.right + HOVER_CARD_OFFSET,
    };
  }
  if (cardPlacement === "bottom") {
    return {
      top: anchorRect.bottom + HOVER_CARD_OFFSET,
      left: anchorRect.left + (anchorRect.width - cardRect.width) / 2,
    };
  }
  return {
    top: anchorRect.top + (anchorRect.height - cardRect.height) / 2,
    left: anchorRect.left - cardRect.width - HOVER_CARD_OFFSET,
  };
}

function isOutOfViewport(
  candidateCoords: { top: number; left: number },
  cardRect: DOMRect,
) {
  return (
    candidateCoords.top < 0 ||
    candidateCoords.left < 0 ||
    candidateCoords.top + cardRect.height > window.innerHeight ||
    candidateCoords.left + cardRect.width > window.innerWidth
  );
}

function oppositePlacement(
  cardPlacement: GridraHoverCardPlacement,
): GridraHoverCardPlacement {
  if (cardPlacement === "top") {
    return "bottom";
  }
  if (cardPlacement === "bottom") {
    return "top";
  }
  if (cardPlacement === "left") {
    return "right";
  }
  return "left";
}
